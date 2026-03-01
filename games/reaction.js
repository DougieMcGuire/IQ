// games/reaction.js — Reaction Time test
(function () {

  Q.register('reaction', function () {
    return {
      type:'reaction', category:'mentalAgility', categoryLabel:'Reaction Time',
      difficulty: 1.0,
      question:'Tap as soon as the circle turns GREEN!',
      answer:'complete', options:[], explanation:'Tests your reaction speed.', visual:'custom'
    };
  }, 3);

  Q.registerRenderer('reaction', {
    render: function (q, idx) {
      return '<div class="qcard">' +
        '<div class="category">⚡ Reaction Time</div>' +
        '<div class="question">' + q.question + '</div>' +
        '<div class="react-zone" id="react-zone-' + idx + '">' +
          '<div class="react-circle" id="react-circle-' + idx + '">Wait...</div>' +
        '</div>' +
        '<div class="react-result" id="react-result-' + idx + '"></div>' +
        '<div class="explanation" id="exp-' + idx + '">' + q.explanation + '</div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var circle = slideEl.querySelector('#react-circle-' + idx);
      var result = slideEl.querySelector('#react-result-' + idx);
      if (!circle) return;

      var state = 'waiting'; // waiting → ready → go → done
      var goTime = 0;
      var timer = null;
      var done = false;

      // Random delay 1.5-4s before turning green
      var delay = 1500 + Math.random() * 2500;
      timer = setTimeout(function () {
        if (done) return;
        state = 'go';
        goTime = Date.now();
        circle.classList.add('react-go');
        circle.textContent = 'TAP!';
      }, delay);

      circle.addEventListener('click', function () {
        if (done) return;

        if (state === 'waiting' || state === 'ready') {
          // Too early!
          done = true;
          clearTimeout(timer);
          circle.classList.add('react-fail');
          circle.textContent = 'Too early!';
          result.textContent = 'Wait for green next time';
          result.style.color = 'var(--red)';
          finish(false, 0);
        } else if (state === 'go') {
          done = true;
          var reactionMs = Date.now() - goTime;
          var good = reactionMs < 400;
          var great = reactionMs < 250;
          circle.classList.remove('react-go');
          circle.classList.add(good ? 'react-success' : 'react-slow');
          circle.textContent = reactionMs + 'ms';
          result.textContent = great ? 'Lightning fast! ⚡' : good ? 'Nice reflexes!' : 'A bit slow, try again!';
          result.style.color = good ? 'var(--green)' : 'var(--gold)';
          finish(good, reactionMs);
        }
      });

      function finish(won, ms) {
        var totalMs = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, totalMs);
        if (won) {
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(ms < 250 ? 20 : 8);
        } else {
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) { expEl.textContent = ms > 0 ? 'Your reaction: ' + ms + 'ms. Average is ~250ms.' : 'Patience is key!'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }
    }
  });

})();