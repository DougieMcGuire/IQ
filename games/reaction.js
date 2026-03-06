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
        '<div class="question">Tap GREEN as fast as you can!</div>' +
        '<div id="react-ready-wrap-' + idx + '" style="display:flex;justify-content:center;margin:16px 0;">' +
          '<button id="react-ready-' + idx + '" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:14px 36px;font-family:Nunito,sans-serif;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--gold-dark);">Tap to Start!</button>' +
        '</div>' +
        '<div class="react-zone" id="react-zone-' + idx + '" style="display:none;">' +
          '<div class="react-circle" id="react-circle-' + idx + '">Wait...</div>' +
        '</div>' +
        '<div class="react-result" id="react-result-' + idx + '"></div>' +
        '<div class="explanation" id="exp-' + idx + '">' + q.explanation + '</div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var readyWrap = slideEl.querySelector('#react-ready-wrap-' + idx);
      var readyBtn  = slideEl.querySelector('#react-ready-' + idx);
      var zone      = slideEl.querySelector('#react-zone-' + idx);
      var circle    = slideEl.querySelector('#react-circle-' + idx);
      var result    = slideEl.querySelector('#react-result-' + idx);
      if (!circle) return;

      var state = 'idle';
      var goTime = 0;
      var timer = null;
      var done = false;

      readyBtn.addEventListener('click', function () {
        Haptics.medium();
        readyWrap.style.display = 'none';
        zone.style.display = 'flex';
        state = 'waiting';
        ctx.answerStartRef.set(Date.now());

        var delay = 1500 + Math.random() * 2500;
        timer = setTimeout(function () {
          if (done) return;
          state = 'go';
          goTime = Date.now();
          // Subtle nudge when circle goes green — player should feel it before they see it
          Haptics.nudge();
          circle.classList.add('react-go');
          circle.textContent = 'TAP!';
        }, delay);
      });

      circle.addEventListener('click', function () {
        if (done || state === 'idle') return;

        if (state === 'waiting') {
          done = true;
          clearTimeout(timer);
          // Too early — sharp error
          Haptics.error();
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
          // Distinct haptic for the actual tap
          Haptics.reactionTap();
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
          // Delay slightly so reactionTap fires first, then success follows
          setTimeout(function () { ms < 250 ? Haptics.streak() : Haptics.success(); }, 120);
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