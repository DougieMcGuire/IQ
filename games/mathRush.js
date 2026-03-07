// games/mathRush.js — True or False math equations, race against time
(function () {

  Q.register('mathRush', function () {
    var eqs = [];
    for (var i = 0; i < 5; i++) {
      var a = Q.rand(2, 20), b = Q.rand(2, 20);
      var op = ['+','-','×'][Q.rand(0,2)];
      var real;
      if (op === '+') real = a + b;
      else if (op === '-') { if (a < b) { var t=a; a=b; b=t; } real = a - b; }
      else real = a * b;
      var isTrue = Math.random() > 0.4;
      var shown = isTrue ? real : real + (Q.rand(0,1) ? Q.rand(1,5) : -Q.rand(1,5));
      if (shown === real) isTrue = true;
      eqs.push({ text: a + ' ' + op + ' ' + b + ' = ' + shown, correct: isTrue });
    }
    return {
      type:'mathRush', category:'mentalAgility', categoryLabel:'Math Rush',
      difficulty: 1.0,
      question:'True or False? (5 rounds, 5s each!)',
      equations: eqs,
      answer:'complete', options:[], explanation:'Speed + accuracy = brain power.', visual:'custom'
    };
  }, 3);

  Q.registerRenderer('mathRush', {
    render: function (q, idx) {
      return '<div class="qcard">' +
        '<div class="category">🏃 Math Rush</div>' +
        '<div class="question">True or False?</div>' +
        '<div class="mr-timer" id="mr-timer-' + idx + '"></div>' +
        '<div class="mr-eq" id="mr-eq-' + idx + '">Get ready...</div>' +
        '<div class="mr-btns" id="mr-btns-' + idx + '" style="display:none">' +
          '<button class="mr-btn mr-true" data-rv="true">✓ True</button>' +
          '<button class="mr-btn mr-false" data-rv="false">✗ False</button>' +
        '</div>' +
        '<div id="mr-ready-wrap-' + idx + '" style="display:flex;justify-content:center;margin:10px 0;">' +
          '<button id="mr-ready-' + idx + '" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:14px 36px;font-family:Nunito,sans-serif;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--gold-dark);">Tap to Start!</button>' +
        '</div>' +
        '<div class="mr-score" id="mr-score-' + idx + '"></div>' +
        '<div class="mr-progress" id="mr-progress-' + idx + '"></div>' +
        '<div class="explanation" id="exp-' + idx + '"></div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var eqEl       = slideEl.querySelector('#mr-eq-' + idx);
      var scoreEl    = slideEl.querySelector('#mr-score-' + idx);
      var timerEl    = slideEl.querySelector('#mr-timer-' + idx);
      var btnsEl     = slideEl.querySelector('#mr-btns-' + idx);
      var progressEl = slideEl.querySelector('#mr-progress-' + idx);
      var readyWrap  = slideEl.querySelector('#mr-ready-wrap-' + idx);
      var readyBtn   = slideEl.querySelector('#mr-ready-' + idx);
      var H = ctx.Haptics || {};
      if (!eqEl) return;

      var round = 0, score = 0, done = false;
      var roundTimer = null;
      var tickTimer = null;
      var lastTickSecond = -1;

      readyBtn.addEventListener('click', function () {
        H.medium && H.medium();
        readyWrap.style.display = 'none';
        btnsEl.style.display = 'flex';
        ctx.answerStartRef.set(Date.now());
        showRound();
      });

      function showRound() {
        if (round >= q.equations.length) { finish(); return; }
        eqEl.textContent = q.equations[round].text;
        eqEl.className = 'mr-eq';
        var dots = '';
        for (var i = 0; i < q.equations.length; i++) {
          dots += '<span class="mr-dot' + (i < round ? ' mr-dot-done' : (i === round ? ' mr-dot-active' : '')) + '"></span>';
        }
        progressEl.innerHTML = dots;
        var timeLeft = 5.0;
        lastTickSecond = 5;
        timerEl.textContent = '5.0s';
        timerEl.style.color = 'var(--cream)';
        clearInterval(roundTimer);
        clearInterval(tickTimer);

        roundTimer = setInterval(function() {
          timeLeft -= 0.1;
          if (timeLeft <= 0) {
            clearInterval(roundTimer);
            clearInterval(tickTimer);
            H.warning && H.warning();
            eqEl.classList.add('mr-wrong');
            round++;
            scoreEl.textContent = score + '/' + q.equations.length;
            setTimeout(showRound, 500);
          } else {
            timerEl.textContent = timeLeft.toFixed(1) + 's';
            var currentSecond = Math.ceil(timeLeft);
            if (currentSecond !== lastTickSecond) {
              lastTickSecond = currentSecond;
              if (timeLeft <= 2) {
                H.warning && H.warning();
                timerEl.style.color = 'var(--red)';
              } else {
                H.light && H.light();
              }
            }
          }
        }, 100);
      }

      btnsEl.addEventListener('click', function(e) {
        var btn = e.target.closest('.mr-btn');
        if (!btn || done) return;
        clearInterval(roundTimer);
        clearInterval(tickTimer);
        var ans = btn.dataset.rv === 'true';
        var correct = q.equations[round].correct === ans;
        if (correct) {
          H.medium && H.medium();
          score++;
          eqEl.classList.add('mr-correct');
        } else {
          H.error && H.error();
          eqEl.classList.add('mr-wrong');
        }
        round++;
        scoreEl.textContent = score + '/' + q.equations.length;
        setTimeout(showRound, 500);
      });

      function finish() {
        done = true;
        clearInterval(roundTimer);
        clearInterval(tickTimer);
        var ms = Date.now() - ctx.answerStartRef.get();
        var won = score >= 3;
        var perfect = score === q.equations.length;
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);

        // Notify game played + session stats
        if (ctx.notifyGamePlayed) ctx.notifyGamePlayed('mathRush');
        if (ctx.onAnswer) ctx.onAnswer(won, ms);

        eqEl.textContent = score + '/' + q.equations.length + (perfect ? ' Perfect!' : won ? ' Nice!' : ' Try harder!');
        eqEl.className = 'mr-eq ' + (won ? 'mr-correct' : 'mr-wrong');
        timerEl.textContent = '';
        btnsEl.style.display = 'none';
        if (won) {
          perfect ? (H.streak && H.streak()) : (H.success && H.success());
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(perfect ? 22 : 10);
        } else {
          H.error && H.error();
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) { expEl.textContent = perfect ? 'Flawless! 🔥' : score + ' correct. Speed and accuracy!'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }
    }
  });

})();