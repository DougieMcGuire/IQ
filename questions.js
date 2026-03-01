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

  // ─── Registry internals ──────────────────────────
  _types: {},       // name → generator function
  _weights: [],     // weighted array of type names for random selection
  _renderers: {},   // name → { render(q,idx), attach(slideEl,q,idx,ctx) }

  // ─── Public: register a question type ────────────
  // weight controls how often this type appears relative to others
  register(name, fn, weight) {
    if (typeof weight !== 'number' || weight < 1) weight = 1;
    this._types[name] = fn;
    for (let i = 0; i < weight; i++) this._weights.push(name);
  },

  // ─── Public: register a custom renderer ──────────
  // render(q, idx) → HTML string for the slide
  // attach(slideEl, q, idx, ctx) → called after DOM insert for event binding
  //   ctx provides: { feed, flashEl, confettiEl, IQData, getEncouragement,
  //                   updateUI, checkMore, spawnConfetti, answerStartRef }
  registerRenderer(name, renderer) {
    this._renderers[name] = renderer;
  },

  // ─── Public API ──────────────────────────────────
  setAge(a) { this.age = a || 25; },

  generate(targetDifficulty) {
    if (targetDifficulty === undefined) targetDifficulty = 1.0;
    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const typeName = this.pick(this._weights);
      const fn = this._types[typeName];
      if (!fn) continue;
      q = fn.call(this);
      tries++;
      if (tries > 30) break;
    } while (
      this.used.has(this.hash(q)) ||
      Math.abs(q.difficulty - targetDifficulty) > tolerance
    );

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

  // ─── CSS injection (game plugins call this to add their styles) ──
  _injectedCSS: {},
  injectCSS(name, css) {
    if (this._injectedCSS[name]) return; // only inject once
    var style = document.createElement('style');
    style.setAttribute('data-game', name);
    style.textContent = css;
    document.head.appendChild(style);
    this._injectedCSS[name] = true;
  },

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