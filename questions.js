// questions.js
// Thin router — delegates to the individual game files.
// To add a new game: create games/yourgame.js and add it to the
// `games` array below.  That's it.

const Q = {
  age: 25,
  used: new Set(),

  setAge(a) {
    this.age = a || 25;
    MCQGame.setAge(this.age);
  },

  // All registered games.
  // Each entry must expose: generate(difficulty) → question object
  // Wordle also needs: render(q, idx) and attach(slideEl, q, idx, feed, answerStartRef, onAnswer)
  // MCQ questions use the shared render/attach in improve.html
  games: [
    // { game: WordleGame, weight: 10 },   ← uncomment once loaded
    // { game: MCQGame,    weight: 90 },
  ],

  _init() {
    // Called after all game scripts have loaded (see improve.html)
    this.games = [
      { game: WordleGame, weight: 10 },
      { game: MCQGame,    weight: 90 },
    ];
  },

  hash(q) {
    return q.type + ':' + q.question.slice(0, 50) + (q.sequence || []).join('');
  },

  generate(targetDifficulty = 1.0) {
    if (!this.games.length) this._init();

    // weighted pick
    const totalWeight = this.games.reduce((s, g) => s + g.weight, 0);
    let rng = Math.random() * totalWeight;
    let chosen = this.games[this.games.length - 1].game;
    for (const g of this.games) {
      rng -= g.weight;
      if (rng <= 0) { chosen = g.game; break; }
    }

    let q, tries = 0;
    do {
      q = chosen.generate(targetDifficulty);
      tries++;
      if (tries > 30) break;
    } while (this.used.has(this.hash(q)));

    this.used.add(this.hash(q));
    if (this.used.size > 1500) this.used = new Set([...this.used].slice(-750));
    return q;
  },
};