// games/mathRush.js — True or False math equations, race against time
(function () {

  Q.register('mathRush', function () {
    // Generate 5 equations, some true, some false
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
      if (shown === real) isTrue = true; // edge case
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
        '<div class="mr-eq" id="mr-eq-' + idx + '"></div>' +
        '<div class="mr-btns" id="mr-btns-' + idx + '">' +
          '<button class="mr-btn mr-true" data-ri="' + idx + '" data-rv="true">✓ True</button>' +
          '<button class="mr-btn mr-false" data-ri="' + idx + '" data-rv="false">✗ False</button>' +
        '</div>' +
        '<div class="mr-score" id="mr-score-' + idx + '">0/5</div>' +
        '<div class="mr-progress" id="mr-progress-' + idx + '"></div>' +
        '<div class="explanation" id="exp-' + idx + '"></div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var eqEl = slideEl.querySelector('#mr-eq-' + idx);
      var scoreEl = slideEl.querySelector('#mr-score-' + idx);
      var timerEl = slideEl.querySelector('#mr-timer-' + idx);
      var btnsEl = slideEl.querySelector('#mr-btns-' + idx);
      var progressEl = slideEl.querySelector('#mr-progress-' + idx);
      if (!eqEl) return;

      var round = 0, score = 0, done = false;
      var roundTimer = null;

      function showRound() {
        if (round >= q.equations.length) { finish(); return; }
        eqEl.textContent = q.equations[round].text;
        eqEl.className = 'mr-eq';
        // Progress dots
        var dots = '';
        for (var i = 0; i < q.equations.length; i++) {
          dots += '<span class="mr-dot' + (i < round ? ' mr-dot-done' : (i === round ? ' mr-dot-active' : '')) + '"></span>';
        }
        progressEl.innerHTML = dots;
        // 5 second timer
        var timeLeft = 5.0;
        timerEl.textContent = '5.0s';
        timerEl.style.color = 'var(--cream)';
        clearInterval(roundTimer);
        roundTimer = setInterval(function() {
          timeLeft -= 0.1;
          if (timeLeft <= 0) {
            clearInterval(roundTimer);
            // Time's up = wrong
            eqEl.classList.add('mr-wrong');
            round++;
            scoreEl.textContent = score + '/' + q.equations.length;
            setTimeout(showRound, 500);
          } else {
            timerEl.textContent = timeLeft.toFixed(1) + 's';
            if (timeLeft < 2) timerEl.style.color = 'var(--red)';
          }
        }, 100);
      }

      btnsEl.addEventListener('click', function(e) {
        var btn = e.target.closest('.mr-btn');
        if (!btn || done) return;
        clearInterval(roundTimer);
        var ans = btn.dataset.rv === 'true';
        var correct = q.equations[round].correct === ans;
        if (correct) {
          score++;
          eqEl.classList.add('mr-correct');
        } else {
          eqEl.classList.add('mr-wrong');
        }
        round++;
        scoreEl.textContent = score + '/' + q.equations.length;
        setTimeout(showRound, 500);
      });

      function finish() {
        done = true;
        clearInterval(roundTimer);
        var ms = Date.now() - ctx.answerStartRef.get();
        var won = score >= 3;
        var perfect = score === q.equations.length;
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        eqEl.textContent = score + '/' + q.equations.length + (perfect ? ' Perfect!' : won ? ' Nice!' : ' Try harder!');
        eqEl.className = 'mr-eq ' + (won ? 'mr-correct' : 'mr-wrong');
        timerEl.textContent = '';
        btnsEl.style.display = 'none';
        if (won) {
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(perfect ? 22 : 10);
        } else {
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) { expEl.textContent = perfect ? 'Flawless! 🔥' : score + ' correct. Speed and accuracy!'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }

      showRound();
    }
  });

})();