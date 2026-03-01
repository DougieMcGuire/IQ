// ═══════════════════════════════════════════════════
// games/wordle.js — Wordle question type plugin
// Self-registers with Q (questions.js must be loaded first)
// ═══════════════════════════════════════════════════

(function () {

  // ─── Word lists by difficulty tier ───────────────
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
      'LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','THWAT','VIVID','WHIFF',
    ],
    hard: [
      'GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL',
      'ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER',
      'AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY',
      'KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY',
      'VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR',
      'OVULE','PIXEL','QUASAR','RABID','SCOFF','TWIXT','UNZIP','VEXED','WIZEN','EXPEL',
    ],
  };

  const TIERS  = ['easy', 'medium', 'hard'];
  const DIFFS  = [0.8, 1.2, 1.7];

  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
  ];

  // ─── 1. Register the generator ──────────────────
  Q.register('wordle', function () {
    const tier = this.rand(0, 2);
    const word = this.pick(WORDS[TIERS[tier]]);
    return {
      type:          'wordle',
      category:      'verbalReasoning',
      categoryLabel: 'Wordle',
      difficulty:    DIFFS[tier],
      question:      'Guess the 5-letter word',
      answer:        word,
      options:       [],
      explanation:   'The word was ' + word + '.',
      visual:        'wordle',
      maxGuesses:    6,
    };
  }, 4);

  // ─── 2. Register the custom renderer ────────────
  Q.registerRenderer('wordle', {

    // Build the card HTML (grid + keyboard)
    render: function (q, idx) {
      // 6×5 grid
      var gridHTML = '';
      for (var r = 0; r < 6; r++) {
        var rowHTML = '';
        for (var c = 0; c < 5; c++) {
          rowHTML += '<div class="wordle-tile" id="wt-' + idx + '-' + r + '-' + c + '"></div>';
        }
        gridHTML += '<div class="wordle-row">' + rowHTML + '</div>';
      }

      // custom keyboard
      var kbHTML = KB_ROWS.map(function (row) {
        var keys = row.map(function (k) {
          var wide = (k === 'ENTER' || k === '⌫') ? ' wide' : '';
          return '<button class="wk' + wide + '" data-wk="' + k + '" data-wi="' + idx + '">' + k + '</button>';
        }).join('');
        return '<div class="wordle-kb-row">' + keys + '</div>';
      }).join('');

      return '<div class="qcard">' +
        '<div class="category">🟩 Wordle</div>' +
        '<div class="question">Guess the 5-letter word</div>' +
        '<div class="wordle-grid">' + gridHTML + '</div>' +
        '<div class="wordle-msg" id="wm-' + idx + '"></div>' +
        '<div class="wordle-kb">' + kbHTML + '</div>' +
        '<div class="explain" id="exp-' + idx + '"></div>' +
      '</div>' +
      '<div class="scroll-hint" id="hint-' + idx + '">' +
        '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>' +
        'Swipe for next' +
      '</div>';
    },

    // Attach interactive logic after DOM insert
    attach: function (slideEl, q, idx, ctx) {
      var feed      = ctx.feed;
      var flashEl   = ctx.flashEl;
      var IQData    = ctx.IQData;
      var updateUI  = ctx.updateUI;
      var checkMore = ctx.checkMore;
      var spawnConfetti  = ctx.spawnConfetti;
      var answerStartRef = ctx.answerStartRef;

      // Per-card mutable state
      var st = {
        answer:    q.answer,
        category:  q.category,
        difficulty:q.difficulty,
        guesses:   [],
        current:   '',
        done:      false,
        keyColors: {},
      };

      // ── tap on custom keyboard ──
      slideEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-wk]');
        if (!btn || +btn.dataset.wi !== idx) return;
        handleKey(btn.dataset.wk);
      });

      // ── physical keyboard (only when this slide is visible) ──
      document.addEventListener('keydown', function (e) {
        if (st.done) return;
        var visIdx = Math.round(feed.scrollTop / (feed.clientHeight || 1));
        if (feed.children[visIdx] !== slideEl) return;
        if      (e.key === 'Enter')     handleKey('ENTER');
        else if (e.key === 'Backspace') handleKey('⌫');
        else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
      });

      // ── key handler ──
      function handleKey(key) {
        if (st.done) return;
        var msgEl = document.getElementById('wm-' + idx);

        if (key === '⌫') {
          st.current = st.current.slice(0, -1);
          updateCurrentRow();
          msgEl.className = 'wordle-msg';
          msgEl.textContent = '';
          return;
        }

        if (key === 'ENTER') {
          if (st.current.length < 5) {
            msgEl.className = 'wordle-msg error';
            msgEl.textContent = 'Not enough letters';
            shakeRow(st.guesses.length);
            return;
          }
          submitGuess();
          return;
        }

        // letter
        if (st.current.length < 5) {
          st.current += key;
          updateCurrentRow();
          msgEl.className = 'wordle-msg';
          msgEl.textContent = '';
        }
      }

      // ── live tile update ──
      function updateCurrentRow() {
        var row = st.guesses.length;
        for (var c = 0; c < 5; c++) {
          var tile = document.getElementById('wt-' + idx + '-' + row + '-' + c);
          if (!tile) continue;
          var letter = st.current[c] || '';
          tile.textContent = letter;
          tile.className = 'wordle-tile' + (letter ? ' has-letter' : '');
        }
      }

      function shakeRow(row) {
        for (var c = 0; c < 5; c++) {
          var t = document.getElementById('wt-' + idx + '-' + row + '-' + c);
          if (!t) continue;
          t.classList.remove('shake');
          void t.offsetWidth;
          t.classList.add('shake');
          (function (el) { setTimeout(function () { el.classList.remove('shake'); }, 400); })(t);
        }
      }

      // ── score a guess ──
      function scoreGuess(guess, answer) {
        var res  = [null,null,null,null,null];
        var pool = answer.split('');
        var i;
        for (i = 0; i < 5; i++) res[i] = 'absent';
        for (i = 0; i < 5; i++) {
          if (guess[i] === pool[i]) { res[i] = 'correct'; pool[i] = null; }
        }
        for (i = 0; i < 5; i++) {
          if (res[i] === 'correct') continue;
          var j = pool.indexOf(guess[i]);
          if (j !== -1) { res[i] = 'present'; pool[j] = null; }
        }
        return res;
      }

      // ── submit + animate ──
      function submitGuess() {
        var guess  = st.current;
        var result = scoreGuess(guess, st.answer);
        var row    = st.guesses.length;
        st.guesses.push({ word: guess, result: result });
        st.current = '';

        var FLIP_HALF = 200;
        var FLIP_DUR  = 400;
        var STAGGER   = 100;

        for (var c = 0; c < 5; c++) {
          (function (col) {
            var tile = document.getElementById('wt-' + idx + '-' + row + '-' + col);
            if (!tile) return;
            var delay = col * STAGGER;

            setTimeout(function () {
              tile.style.transition = 'transform ' + FLIP_HALF + 'ms ease-in';
              tile.style.transform  = 'rotateX(-90deg)';

              setTimeout(function () {
                tile.textContent = guess[col];
                tile.className   = 'wordle-tile reveal-' + result[col];
                tile.style.transition = 'transform ' + FLIP_HALF + 'ms ease-out';
                tile.style.transform  = 'rotateX(0deg)';
              }, FLIP_HALF);
            }, delay);
          })(c);
        }

        var allDone = 4 * STAGGER + FLIP_DUR + 50;
        setTimeout(function () {
          updateKeyboard(guess, result);
          var won  = result.every(function (r) { return r === 'correct'; });
          var lost = !won && st.guesses.length >= 6;
          if (won || lost) finishWordle(won);
        }, allDone);
      }

      // ── keyboard colour update ──
      function updateKeyboard(guess, result) {
        var priority = { correct: 3, present: 2, absent: 1 };
        for (var i = 0; i < 5; i++) {
          var l = guess[i];
          if (!st.keyColors[l] || priority[result[i]] > priority[st.keyColors[l]]) {
            st.keyColors[l] = result[i];
          }
        }
        var btns = document.querySelectorAll('[data-wi="' + idx + '"]');
        btns.forEach(function (btn) {
          var state = st.keyColors[btn.dataset.wk];
          if (!state) return;
          btn.classList.remove('st-correct', 'st-present', 'st-absent');
          btn.classList.add('st-' + state);
        });
      }

      // ── win / lose ──
      function finishWordle(won) {
        st.done = true;
        var msgEl  = document.getElementById('wm-' + idx);
        var expEl  = document.getElementById('exp-' + idx);
        var hintEl = document.getElementById('hint-' + idx);

        var ms     = Date.now() - answerStartRef.get();
        var data   = IQData.recordAnswer(st.category, won, st.difficulty, ms);

        if (won) {
          var byGuess = ['Ace! 🎯','Brilliant! 🧠','Nailed it! ⚡','Great! 🔥','Nice! 💡','Phew! 😅'];
          msgEl.className  = 'wordle-msg success';
          msgEl.textContent = byGuess[st.guesses.length - 1] || 'Yes!';
          flashEl.className = 'flash green show';
          spawnConfetti(st.guesses.length === 1 ? 30 : 14);
          setTimeout(function () { flashEl.className = 'flash'; }, 350);
        } else {
          msgEl.className  = 'wordle-msg error';
          msgEl.textContent = 'The word was ' + st.answer;
          flashEl.className = 'flash red show';
          setTimeout(function () { flashEl.className = 'flash'; }, 350);
        }

        if (expEl) {
          expEl.textContent = won
            ? 'Solved in ' + st.guesses.length + ' guess' + (st.guesses.length === 1 ? '' : 'es') + '!'
            : 'The answer was "' + st.answer + '". Keep going!';
          setTimeout(function () { expEl.classList.add('show'); }, 200);
        }
        setTimeout(function () { if (hintEl) hintEl.classList.add('show'); }, 500);
        updateUI(data);

        // streak milestone popup
        if (won && data.streak > 0 && data.streak % 5 === 0) {
          setTimeout(function () {
            var streakNum   = document.getElementById('streak-num');
            var streakPopup = document.getElementById('streak-popup');
            if (streakNum)   streakNum.textContent = data.streak;
            if (streakPopup) {
              streakPopup.classList.add('show');
              spawnConfetti(25);
              setTimeout(function () { streakPopup.classList.remove('show'); }, 1800);
            }
          }, 600);
        }

        checkMore();
        answerStartRef.set(Date.now());
      }
    }
  });

})();