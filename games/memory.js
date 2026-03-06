// games/memory.js — Memory Match (flip cards to find pairs)
(function () {

  var EMOJIS = ['🦌','🧠','⚡','🔥','🎯','💡','🌟','🎪','🎨','🎮','🏆','💎','🚀','🌈','🎵','🍕'];

  Q.register('memory', function () {
    var size = Q.rand(0,2); // 0=easy(6 cards/3 pairs), 1=med(8/4), 2=hard(12/6)
    var pairs = [3,4,6][size];
    var picks = Q.shuffle(EMOJIS.slice()).slice(0, pairs);
    var cards = Q.shuffle(picks.concat(picks));
    return {
      type:'memory', category:'memory', categoryLabel:'Memory Match',
      difficulty:[0.7, 1.1, 1.5][size],
      question:'Find all matching pairs!',
      cards: cards, pairs: pairs,
      answer:'complete', options:[], explanation:'Memory training strengthens recall.', visual:'custom'
    };
  }, 4);

  Q.registerRenderer('memory', {
    render: function (q, idx) {
      var cols = q.pairs <= 3 ? 3 : 4;
      var cells = '';
      for (var i = 0; i < q.cards.length; i++) {
        cells += '<button class="mem-card" data-mi="' + idx + '" data-mc="' + i + '" data-mv="' + q.cards[i] + '"><span class="mem-front">?</span><span class="mem-back">' + q.cards[i] + '</span></button>';
      }
      return '<div class="qcard">' +
        '<div class="category">🧠 Memory Match</div>' +
        '<div class="question">' + q.question + '</div>' +
        '<div class="mem-status" id="mem-status-' + idx + '">Tap to flip</div>' +
        '<div class="mem-grid mem-cols-' + cols + '" id="mem-grid-' + idx + '">' + cells + '</div>' +
        '<div class="explanation" id="exp-' + idx + '">' + q.explanation + '</div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var grid = slideEl.querySelector('#mem-grid-' + idx);
      var status = slideEl.querySelector('#mem-status-' + idx);
      if (!grid) return;
      var flipped = [], matched = 0, moves = 0, locked = false;
      var totalPairs = q.pairs;

      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('.mem-card');
        if (!btn || locked || btn.classList.contains('mem-flip') || btn.classList.contains('mem-matched')) return;

        // Card flip feel
        Haptics.cardFlip();

        btn.classList.add('mem-flip');
        flipped.push(btn);
        if (flipped.length === 2) {
          moves++;
          locked = true;
          var a = flipped[0], b = flipped[1];
          if (a.dataset.mv === b.dataset.mv) {
            // Pair matched
            setTimeout(function () { Haptics.cardMatch(); }, 150);
            a.classList.add('mem-matched');
            b.classList.add('mem-matched');
            matched++;
            flipped = [];
            locked = false;
            if (matched === totalPairs) {
              finish(true);
            } else {
              status.textContent = matched + '/' + totalPairs + ' pairs';
            }
          } else {
            // No match — subtle warning before flip back
            setTimeout(function () { Haptics.light(); }, 300);
            setTimeout(function () {
              a.classList.remove('mem-flip');
              b.classList.remove('mem-flip');
              flipped = [];
              locked = false;
            }, 600);
          }
        }
      });

      function finish(won) {
        var ms = Date.now() - ctx.answerStartRef.get();
        var perfect = moves <= totalPairs + 1;
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        perfect ? Haptics.streak() : Haptics.success();
        status.textContent = 'Done in ' + moves + ' moves!';
        status.style.color = 'var(--green)';
        ctx.flashEl.className = 'flash green show';
        ctx.spawnConfetti(perfect ? 25 : 10);
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) { expEl.textContent = perfect ? 'Perfect memory! 🎯' : 'Solved in ' + moves + ' moves'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }
    }
  });

})();