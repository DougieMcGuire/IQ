// games/ticTacToe.js — Tic Tac Toe vs Bot plugin
(function () {

  var DIFFS = [0.6, 1.0, 1.5];
  var LABELS = ['Easy', 'Medium', 'Hard'];

  Q.register('ticTacToe', function () {
    var tier = this.rand(0, 2);
    return {
      type:          'ticTacToe',
      category:      'problemSolving',
      categoryLabel: 'Tic Tac Toe',
      difficulty:    DIFFS[tier],
      question:      'Beat the bot! (' + LABELS[tier] + ')',
      answer:        'win',
      options:       [],
      explanation:   '',
      visual:        'ticTacToe',
      botLevel:      tier,
    };
  }, 3);

  Q.registerRenderer('ticTacToe', {

    render: function (q, idx) {
      var cells = '';
      for (var i = 0; i < 9; i++) {
        cells += '<button class="ttt-cell" data-ti="' + idx + '" data-tc="' + i + '"></button>';
      }

      return '<div class="qcard">' +
        '<div class="category">❌ Tic Tac Toe</div>' +
        '<div class="question">' + q.question + '</div>' +
        '<div class="ttt-status" id="ttt-status-' + idx + '">Your turn (X)</div>' +
        '<div class="ttt-grid" id="ttt-grid-' + idx + '">' + cells + '</div>' +
        '<div class="explain" id="exp-' + idx + '"></div>' +
      '</div>' +
      '<div class="scroll-hint" id="hint-' + idx + '">' +
        '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>' +
        'Swipe for next' +
      '</div>';
    },

    attach: function (slideEl, q, idx, ctx) {
      var IQData         = ctx.IQData;
      var flashEl        = ctx.flashEl;
      var updateUI       = ctx.updateUI;
      var checkMore      = ctx.checkMore;
      var spawnConfetti  = ctx.spawnConfetti;
      var answerStartRef = ctx.answerStartRef;

      var board = [0,0,0,0,0,0,0,0,0];
      var done  = false;
      var botLevel = q.botLevel;

      var WINS = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],
      ];

      slideEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-tc]');
        if (!btn || +btn.dataset.ti !== idx || done) return;
        var cell = +btn.dataset.tc;
        if (board[cell] !== 0) return;

        // Player places X
        Haptics.medium();

        board[cell] = 1;
        renderBoard();

        var w = checkWin();
        if (w) { finish(w); return; }
        if (isFull()) { finish('draw'); return; }

        setStatus("Bot thinking...");
        done = true;
        setTimeout(function () {
          done = false;
          var move = botMove();
          board[move] = 2;
          // Bot's move — lighter feel
          Haptics.light();
          renderBoard();

          var w2 = checkWin();
          if (w2) { finish(w2); return; }
          if (isFull()) { finish('draw'); return; }
          setStatus("Your turn (X)");
        }, 350);
      });

      function renderBoard() {
        for (var i = 0; i < 9; i++) {
          var el = slideEl.querySelector('[data-tc="' + i + '"]');
          if (!el) continue;
          if (board[i] === 1) {
            el.textContent = 'X';
            el.classList.add('ttt-x');
            el.classList.remove('ttt-o');
          } else if (board[i] === 2) {
            el.textContent = 'O';
            el.classList.add('ttt-o');
            el.classList.remove('ttt-x');
          }
        }
      }

      function setStatus(txt) {
        var el = document.getElementById('ttt-status-' + idx);
        if (el) el.textContent = txt;
      }

      function checkWin() {
        for (var i = 0; i < WINS.length; i++) {
          var a = WINS[i][0], b = WINS[i][1], c = WINS[i][2];
          if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            highlightWin(WINS[i]);
            return board[a] === 1 ? 'player' : 'bot';
          }
        }
        return null;
      }

      function highlightWin(cells) {
        for (var i = 0; i < cells.length; i++) {
          var el = slideEl.querySelector('[data-tc="' + cells[i] + '"]');
          if (el) el.classList.add('ttt-win');
        }
      }

      function isFull() {
        for (var i = 0; i < 9; i++) { if (board[i] === 0) return false; }
        return true;
      }

      function empties() {
        var e = [];
        for (var i = 0; i < 9; i++) { if (board[i] === 0) e.push(i); }
        return e;
      }

      function botMove() {
        if (botLevel === 0) return botEasy();
        if (botLevel === 1) return botMedium();
        return botHard();
      }

      function botEasy() {
        var e = empties();
        return e[Math.floor(Math.random() * e.length)];
      }

      function botMedium() {
        var w = findWinMove(2);
        if (w !== -1) return w;
        var b = findWinMove(1);
        if (b !== -1) return b;
        if (board[4] === 0) return 4;
        return botEasy();
      }

      function botHard() {
        var bestScore = -Infinity;
        var bestMove  = -1;
        var e = empties();
        for (var i = 0; i < e.length; i++) {
          board[e[i]] = 2;
          var score = minimax(false, 0);
          board[e[i]] = 0;
          if (score > bestScore) { bestScore = score; bestMove = e[i]; }
        }
        return bestMove;
      }

      function minimax(isMax, depth) {
        var w = checkWinner();
        if (w === 2) return 10 - depth;
        if (w === 1) return depth - 10;
        if (isFull()) return 0;

        var e = empties();
        if (isMax) {
          var best = -Infinity;
          for (var i = 0; i < e.length; i++) {
            board[e[i]] = 2;
            best = Math.max(best, minimax(false, depth + 1));
            board[e[i]] = 0;
          }
          return best;
        } else {
          var best = Infinity;
          for (var i = 0; i < e.length; i++) {
            board[e[i]] = 1;
            best = Math.min(best, minimax(true, depth + 1));
            board[e[i]] = 0;
          }
          return best;
        }
      }

      function checkWinner() {
        for (var i = 0; i < WINS.length; i++) {
          var a = WINS[i][0], b = WINS[i][1], c = WINS[i][2];
          if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
        }
        return 0;
      }

      function findWinMove(piece) {
        var e = empties();
        for (var i = 0; i < e.length; i++) {
          board[e[i]] = piece;
          if (checkWinner() === piece) { board[e[i]] = 0; return e[i]; }
          board[e[i]] = 0;
        }
        return -1;
      }

      function finish(result) {
        done = true;
        var won  = result === 'player';
        var draw = result === 'draw';
        var ms   = Date.now() - answerStartRef.get();

        if (won) {
          setStatus("You win! 🎉");
          Haptics.success();
        } else if (draw) {
          setStatus("It's a draw! 🤝");
          Haptics.toggle(); // neutral click feel for draw
        } else {
          setStatus("Bot wins! 🤖");
          Haptics.error();
        }

        var data = IQData.recordAnswer(q.category, won, q.difficulty, ms);

        if (won) {
          flashEl.className = 'flash green show';
          spawnConfetti(16);
          setTimeout(function () { flashEl.className = 'flash'; }, 350);
        } else if (!draw) {
          flashEl.className = 'flash red show';
          setTimeout(function () { flashEl.className = 'flash'; }, 350);
        }

        var expEl  = document.getElementById('exp-' + idx);
        var hintEl = document.getElementById('hint-' + idx);
        if (expEl) {
          expEl.textContent = won ? 'Nice strategy!' : draw ? 'A draw is respectable against this bot.' : 'The bot outsmarted you this time.';
          setTimeout(function () { expEl.classList.add('show'); }, 200);
        }
        setTimeout(function () { if (hintEl) hintEl.classList.add('show'); }, 500);
        updateUI(data);

        if (won && data.streak > 0 && data.streak % 5 === 0) {
          setTimeout(function () {
            Haptics.streak();
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