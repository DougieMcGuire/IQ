// ═══════════════════════════════════════════════════
//  WORDLE GAME
//  Provides: WordleGame.generate(difficulty)
//            WordleGame.render(q, idx)
//            WordleGame.attach(slideEl, q, idx, onAnswer)
// ═══════════════════════════════════════════════════

const WordleGame = (() => {

  const WORDS = {
    easy: [
      'BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD',
      'SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE',
      'VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY',
      'GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED',
      'WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER',
      'STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT',
      'TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT',
    ],
    medium: [
      'FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC',
      'DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH',
      'PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT',
      'CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT',
      'NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH',
      'YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER',
      'LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','VIVID','WHIFF',
    ],
    hard: [
      'GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL',
      'ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER',
      'AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY',
      'KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY',
      'VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR',
      'OVULE','PIXEL','RABID','SCOFF','UNZIP','VEXED','WIZEN','EXPEL',
    ],
  };

  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── Generate ──────────────────────────────────────
  function generate(difficulty) {
    const tier  = difficulty < 1.0 ? 'easy' : difficulty < 1.5 ? 'medium' : 'hard';
    const diffs = { easy: 0.8, medium: 1.2, hard: 1.7 };
    const word  = pick(WORDS[tier]);
    return {
      type:          'wordle',
      category:      'verbalReasoning',
      categoryLabel: 'Wordle',
      difficulty:    diffs[tier],
      question:      'Guess the 5-letter word',
      answer:        word,
      options:       [],
      explanation:   `The word was ${word}.`,
      visual:        'wordle',
      maxGuesses:    6,
    };
  }

  // ── Render ────────────────────────────────────────
  function render(q, idx) {
    let gridHTML = '';
    for (let r = 0; r < 6; r++) {
      let row = '';
      for (let c = 0; c < 5; c++) {
        row += `<div class="wordle-tile" id="wt-${idx}-${r}-${c}"></div>`;
      }
      gridHTML += `<div class="wordle-row">${row}</div>`;
    }

    const kbHTML = KB_ROWS.map(row => {
      const keys = row.map(k => {
        const wide = (k === 'ENTER' || k === '⌫') ? ' wide' : '';
        return `<button class="wk${wide}" data-wk="${k}" data-wi="${idx}">${k}</button>`;
      }).join('');
      return `<div class="wordle-kb-row">${keys}</div>`;
    }).join('');

    return `
      <div class="qcard">
        <div class="category">🟩 Wordle</div>
        <div class="question">Guess the 5-letter word</div>
        <div class="wordle-grid">${gridHTML}</div>
        <div class="wordle-msg" id="wm-${idx}"></div>
        <div class="wordle-kb">${kbHTML}</div>
        <div class="explain" id="exp-${idx}"></div>
      </div>
      <div class="scroll-hint" id="hint-${idx}">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        Swipe for next
      </div>`;
  }

  // ── Attach (interactive logic) ────────────────────
  // onAnswer(isCorrect, ms) is called when the game ends
  function attach(slideEl, q, idx, feed, onAnswer) {
    const st = {
      answer:     q.answer,
      category:   q.category,
      difficulty: q.difficulty,
      guesses:    [],
      current:    '',
      done:       false,
      keyColors:  {},
    };

    slideEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-wk]');
      if (!btn || +btn.dataset.wi !== idx) return;
      handleKey(btn.dataset.wk, st, idx, feed, onAnswer);
    });

    document.addEventListener('keydown', e => {
      if (st.done) return;
      const visIdx = Math.round(feed.scrollTop / (feed.clientHeight || 1));
      if (feed.children[visIdx] !== slideEl) return;
      if      (e.key === 'Enter')               handleKey('ENTER', st, idx, feed, onAnswer);
      else if (e.key === 'Backspace')           handleKey('⌫',    st, idx, feed, onAnswer);
      else if (/^[a-zA-Z]$/.test(e.key))       handleKey(e.key.toUpperCase(), st, idx, feed, onAnswer);
    });
  }

  // ── Internal helpers ──────────────────────────────

  function handleKey(key, st, idx, feed, onAnswer) {
    if (st.done) return;
    const msgEl = document.getElementById(`wm-${idx}`);

    if (key === '⌫') {
      st.current = st.current.slice(0, -1);
      updateCurrentRow(st, idx);
      msgEl.className = 'wordle-msg';
      msgEl.textContent = '';
      return;
    }
    if (key === 'ENTER') {
      if (st.current.length < 5) {
        msgEl.className = 'wordle-msg error';
        msgEl.textContent = 'Not enough letters';
        shakeRow(st.guesses.length, idx);
        return;
      }
      submitGuess(st, idx, onAnswer);
      return;
    }
    if (st.current.length < 5) {
      st.current += key;
      updateCurrentRow(st, idx);
      msgEl.className = 'wordle-msg';
      msgEl.textContent = '';
    }
  }

  function updateCurrentRow(st, idx) {
    const row = st.guesses.length;
    for (let c = 0; c < 5; c++) {
      const tile = document.getElementById(`wt-${idx}-${row}-${c}`);
      if (!tile) continue;
      const letter = st.current[c] || '';
      tile.textContent = letter;
      tile.className = 'wordle-tile' + (letter ? ' has-letter' : '');
    }
  }

  function shakeRow(row, idx) {
    for (let c = 0; c < 5; c++) {
      const t = document.getElementById(`wt-${idx}-${row}-${c}`);
      if (!t) continue;
      t.classList.remove('shake');
      void t.offsetWidth;
      t.classList.add('shake');
      setTimeout(() => t.classList.remove('shake'), 400);
    }
  }

  function scoreGuess(guess, answer) {
    const res  = Array(5).fill('absent');
    const pool = answer.split('');
    for (let i = 0; i < 5; i++) {
      if (guess[i] === pool[i]) { res[i] = 'correct'; pool[i] = null; }
    }
    for (let i = 0; i < 5; i++) {
      if (res[i] === 'correct') continue;
      const j = pool.indexOf(guess[i]);
      if (j !== -1) { res[i] = 'present'; pool[j] = null; }
    }
    return res;
  }

  function submitGuess(st, idx, onAnswer) {
    const guess  = st.current;
    const result = scoreGuess(guess, st.answer);
    const row    = st.guesses.length;
    st.guesses.push({ word: guess, result });
    st.current = '';

    const FLIP_HALF = 200, FLIP_DUR = 400, STAGGER = 100;

    for (let c = 0; c < 5; c++) {
      const tile  = document.getElementById(`wt-${idx}-${row}-${c}`);
      if (!tile) continue;
      const delay = c * STAGGER;
      setTimeout(() => {
        tile.style.transition = `transform ${FLIP_HALF}ms ease-in`;
        tile.style.transform  = 'rotateX(-90deg)';
        setTimeout(() => {
          tile.textContent = guess[c];
          tile.className   = `wordle-tile reveal-${result[c]}`;
          tile.style.transition = `transform ${FLIP_HALF}ms ease-out`;
          tile.style.transform  = 'rotateX(0deg)';
        }, FLIP_HALF);
      }, delay);
    }

    const allDone = 4 * STAGGER + FLIP_DUR + 50;
    setTimeout(() => {
      updateKeyboard(st, guess, result, idx);
      const won  = result.every(r => r === 'correct');
      const lost = !won && st.guesses.length >= 6;
      if (won || lost) finishGame(st, idx, won, onAnswer);
    }, allDone);
  }

  function updateKeyboard(st, guess, result, idx) {
    const priority = { correct: 3, present: 2, absent: 1 };
    for (let i = 0; i < 5; i++) {
      const l = guess[i];
      if (!st.keyColors[l] || priority[result[i]] > priority[st.keyColors[l]]) {
        st.keyColors[l] = result[i];
      }
    }
    document.querySelectorAll(`[data-wi="${idx}"]`).forEach(btn => {
      const state = st.keyColors[btn.dataset.wk];
      if (!state) return;
      btn.classList.remove('st-correct', 'st-present', 'st-absent');
      btn.classList.add(`st-${state}`);
    });
  }

  function finishGame(st, idx, won, onAnswer) {
    st.done = true;
    const msgEl  = document.getElementById(`wm-${idx}`);
    const expEl  = document.getElementById(`exp-${idx}`);
    const hintEl = document.getElementById(`hint-${idx}`);

    const ms = Date.now() - (st._startTime || Date.now());

    if (won) {
      const byGuess = ['Ace! 🎯','Brilliant! 🧠','Nailed it! ⚡','Great! 🔥','Nice! 💡','Phew! 😅'];
      msgEl.className   = 'wordle-msg success';
      msgEl.textContent = byGuess[st.guesses.length - 1] || 'Yes!';
    } else {
      msgEl.className   = 'wordle-msg error';
      msgEl.textContent = `The word was ${st.answer}`;
    }

    if (expEl) {
      expEl.textContent = won
        ? `Solved in ${st.guesses.length} guess${st.guesses.length === 1 ? '' : 'es'}!`
        : `The answer was "${st.answer}". Keep going!`;
      setTimeout(() => expEl.classList.add('show'), 200);
    }
    setTimeout(() => hintEl?.classList.add('show'), 500);

    // Call back to improve.html with the result
    onAnswer(won, ms, st);
  }

  return { generate, render, attach };
})();

window.WordleGame = WordleGame;