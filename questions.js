// ═══════════════════════════════════════════════════
// QUESTIONS.JS — Core registry + shared utilities
// ═══════════════════════════════════════════════════

var Q = {
  age: 25,
  used: new Set(),
  _lastType: null,
  _recentTypes: [], // rolling window for balance

  _types: {},
  _weights: [],
  _renderers: {},

  register(name, fn, weight) {
    if (typeof weight !== 'number' || weight < 1) weight = 1;
    this._types[name] = fn;
    for (let i = 0; i < weight; i++) this._weights.push(name);
  },

  registerRenderer(name, renderer) {
    this._renderers[name] = renderer;
  },

  setAge(a) { this.age = a || 25; },

  generate(targetDifficulty) {
    if (targetDifficulty === undefined) targetDifficulty = 1.0;
    const tolerance = 0.45;
    if (!this._weights.length) return null;

    let q, tries = 0;
    do {
      // Build candidate pool: exclude last type on first few tries for variety
      // but ALWAYS fall back to full pool so we never get stuck
      let pool = this._weights;
      if (tries < 10 && this._lastType) {
        const filtered = this._weights.filter(t => t !== this._lastType);
        if (filtered.length) pool = filtered;
      }

      const typeName = pool[Math.floor(Math.random() * pool.length)];
      const fn = this._types[typeName];
      if (!fn) { tries++; continue; }

      try { q = fn.call(this); } catch(e) { tries++; continue; }
      tries++;
      if (tries > 40) break;
    } while (
      !q ||
      this.used.has(this.hash(q)) ||
      Math.abs(q.difficulty - targetDifficulty) > tolerance
    );

    if (!q) return null;

    this._lastType = q.type;
    this._recentTypes.push(q.type);
    if (this._recentTypes.length > 20) this._recentTypes.shift();

    this.used.add(this.hash(q));
    if (this.used.size > 1500) this.used = new Set([...this.used].slice(-750));
    return q;
  },

  rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },

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
