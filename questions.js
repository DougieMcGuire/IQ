// ═══════════════════════════════════════════════════
//  questions.js  —  question router
//
//  Depends on (load before this):
//    games/wordle.js   → WordleGame
//    games/mcq.js      → MCQGame
//    (future)          → TicTacToeGame, etc.
//
//  Public API (used by improve.html):
//    Q.setAge(n)
//    Q.generate(difficulty)   → question object
//    Q.render(q, idx)         → HTML string
//    Q.attach(slideEl, q, idx, feed, onAnswer)
// ═══════════════════════════════════════════════════

const Q = (() => {

  let _age = 25;
  const _used = new Set();

  function setAge(a) { _age = a || 25; }

  // ── Hash for deduplication ──────────────────────
  function hash(q) {
    return q.type + ':' + q.question.slice(0, 50) + (q.sequence || q.grid || []).join('');
  }

  // ── Pick the right game for a question type ─────
  function gameFor(q) {
    if (q.type === 'wordle') return WordleGame;
    return MCQGame;
    // Future: if (q.type === 'tictactoe') return TicTacToeGame;
  }

  // ── Difficulty helper (based on IQ) ─────────────
  function difficultyFromIQ(iq) {
    if (iq < 85)  return 0.6;
    if (iq < 95)  return 0.8;
    if (iq < 105) return 1.0;
    if (iq < 115) return 1.2;
    if (iq < 125) return 1.5;
    if (iq < 135) return 1.8;
    return 2.1;
  }

  // ── Generate ─────────────────────────────────────
  // Picks a game type, generates a question, deduplicates
  function generate(difficulty = 1.0) {
    // Decide which game to use (weighted)
    // Right now: ~20% Wordle, ~80% MCQ
    const useWordle = Math.random() < 0.20;
    const game = useWordle ? WordleGame : MCQGame;

    let q, tries = 0;
    do {
      q = game.generate(difficulty);
      tries++;
      if (tries > 30) break;
    } while (_used.has(hash(q)));

    _used.add(hash(q));
    if (_used.size > 1500) {
      // Keep only the last 750
      const arr = [..._used];
      _used.clear();
      arr.slice(-750).forEach(h => _used.add(h));
    }
    return q;
  }

  // ── Render ────────────────────────────────────────
  function render(q, idx) {
    return gameFor(q).render(q, idx);
  }

  // ── Attach ────────────────────────────────────────
  function attach(slideEl, q, idx, feed, onAnswer) {
    slideEl._startTime = Date.now();
    gameFor(q).attach(slideEl, q, idx, feed, onAnswer);
  }

  return { setAge, generate, render, attach, difficultyFromIQ };

})();

window.Q = Q;