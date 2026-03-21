// ═══════════════════════════════════════════════════
// QUESTIONS.JS — Core registry + shared utilities
// ═══════════════════════════════════════════════════
//
// Question types self-register via:
//   Q.register(name, generatorFn, weight)
//
// Types with custom card UI (like Wordle) also call:
//   Q.registerRenderer(name, { render(q, idx), attach(slideEl, q, idx, ctx) })
//
// Default multiple-choice rendering is handled by improve.html
// for any type that doesn't register a custom renderer.
//
// ═══════════════════════════════════════════════════

var Q = {
  age: 25,
  used: new Set(),
  _lastType: null,         // prevent consecutive same game type
  _typeHistory: [],        // recent type history for balancing
  _typeCounts: {},         // count per type in recent window
  _BALANCE_WINDOW: 12,     // look back 12 cards for balance

  // ─── Registry internals ──────────────────────────
  _types: {},       // name → generator function
  _weights: [],     // weighted array of type names for random selection
  _renderers: {},   // name → { render(q,idx), attach(slideEl,q,idx,ctx) }

  // ─── Public: register a question type ────────────
  register(name, fn, weight) {
    if (typeof weight !== 'number' || weight < 1) weight = 1;
    this._types[name] = fn;
    for (let i = 0; i < weight; i++) this._weights.push(name);
  },

  // ─── Public: register a custom renderer ──────────
  registerRenderer(name, renderer) {
    this._renderers[name] = renderer;
  },

  // ─── Public API ──────────────────────────────────
  setAge(a) { this.age = a || 25; },

  // Get a shuffled pool of type names, excluding the last played type
  // and types that have appeared too frequently in the recent window
  _getBalancedType() {
    const allTypes = Object.keys(this._types);
    if (!allTypes.length) return null;

    // Count recent type appearances
    const recent = this._typeHistory.slice(-this._BALANCE_WINDOW);
    const counts = {};
    recent.forEach(t => { counts[t] = (counts[t] || 0) + 1; });

    // Max times a type can appear in the window (soft cap)
    const softCap = Math.max(2, Math.ceil(this._BALANCE_WINDOW / allTypes.length) + 1);

    // Build a candidate pool from _weights, excluding last type and over-represented types
    let pool = this._weights.filter(t => {
      if (t === this._lastType) return false;
      if ((counts[t] || 0) >= softCap) return false;
      return true;
    });

    // If pool is empty (e.g. only one type registered), allow the last type
    if (!pool.length) {
      pool = this._weights.filter(t => t !== this._lastType);
    }
    // If still empty, use everything
    if (!pool.length) {
      pool = this._weights.slice();
    }

    return pool[Math.floor(Math.random() * pool.length)];
  },

  generate(targetDifficulty) {
    if (targetDifficulty === undefined) targetDifficulty = 1.0;
    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const typeName = this._getBalancedType();
      if (!typeName) break;
      const fn = this._types[typeName];
      if (!fn) continue;
      q = fn.call(this);
      tries++;
      if (tries > 30) break;
    } while (
      this.used.has(this.hash(q)) ||
      Math.abs(q.difficulty - targetDifficulty) > tolerance
    );

    if (!q) return null;

    // Track type history for consecutive/balance prevention
    this._lastType = q.type;
    this._typeHistory.push(q.type);
    if (this._typeHistory.length > this._BALANCE_WINDOW * 2) {
      this._typeHistory = this._typeHistory.slice(-this._BALANCE_WINDOW);
    }

    this.used.add(this.hash(q));
    if (this.used.size > 1500) this.used = new Set([...this.used].slice(-750));
    return q;
  },

  // ─── Shared Utilities (available to all game types via `this`) ───
  rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; },
  pick(arr) { return arr[this.rand(0, arr.length - 1)]; },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  numOpts(ans, n, spread) {
    if (!n) n = 4;
    const opts = new Set([ans]);
    const r = spread || Math.max(4, Math.abs(ans) * 0.35);
    let t = 0;
    while (opts.size < n && t++ < 100) {
      let v = ans + this.rand(1, Math.ceil(r)) * (Math.random() > 0.5 ? 1 : -1);
      if (Number.isInteger(ans)) v = Math.round(v);
      if (v !== ans && !isNaN(v)) opts.add(v);
    }
    while (opts.size < n) opts.add(ans + opts.size);
    return this.shuffle([...opts]);
  },

  hash(q) { return q.type + ':' + q.question.slice(0, 50) + (q.sequence || []).join(''); },

  // ─── Difficulty helpers ──────────────────────────
  getTargetDifficulty(iq) {
    if (iq < 85)  return 0.6;
    if (iq < 95)  return 0.8;
    if (iq < 105) return 1.0;
    if (iq < 115) return 1.2;
    if (iq < 125) return 1.5;
    if (iq < 135) return 1.8;
    return 2.1;
  },

  calculateIQChange(correct, questionDifficulty, currentIQ) {
    const expected = this.getTargetDifficulty(currentIQ);
    if (correct) {
      const reward = questionDifficulty / expected;
      return Math.max(1, Math.round(reward * 2.5));
    } else {
      const penalty = expected / questionDifficulty;
      return -Math.max(1, Math.round(penalty * 1.8));
    }
  },
};
