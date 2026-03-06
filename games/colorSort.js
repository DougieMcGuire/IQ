// games/colorSort.js — Sort the colors into the right order
(function () {

  var PALETTES = [
    { name:'Rainbow', colors:['#FF0000','#FF7700','#FFDD00','#00CC44','#0066FF','#8833FF'], labels:['Red','Orange','Yellow','Green','Blue','Purple'] },
    { name:'Warm→Cool', colors:['#FF2200','#FF6600','#FFAA00','#44BBFF','#2266FF','#1133AA'], labels:['Hot Red','Orange','Warm','Sky','Blue','Deep Blue'] },
    { name:'Light→Dark', colors:['#FFFFFF','#CCCCCC','#999999','#666666','#333333','#111111'], labels:['White','Light','Silver','Gray','Dark','Black'] },
  ];

  Q.register('colorSort', function () {
    var size = Q.rand(0,1);
    var pal = Q.pick(PALETTES);
    var count = size === 0 ? 4 : 6;
    var correct = pal.colors.slice(0, count);
    var labels = pal.labels.slice(0, count);
    var scrambled = Q.shuffle(correct.map(function(c, i){ return { color:c, label:labels[i], idx:i }; }));
    return {
      type:'colorSort', category:'patternRecognition', categoryLabel:'Color Sort',
      difficulty: size === 0 ? 0.7 : 1.1,
      question:'Sort ' + pal.name + ' in order!',
      scrambled: scrambled, correctOrder: correct,
      answer:'complete', options:[], explanation:'Visual pattern recognition.', visual:'custom'
    };
  }, 3);

  Q.registerRenderer('colorSort', {
    render: function (q, idx) {
      var tiles = '';
      for (var i = 0; i < q.scrambled.length; i++) {
        var s = q.scrambled[i];
        var lightColors = ['#FFFFFF','#CCCCCC','#FFDD00','#FFAA00','#44BBFF','#FF7700'];
        var textColor = lightColors.indexOf(s.color) !== -1 ? '#333' : '#fff';
        var borderStyle = s.color === '#FFFFFF' ? 'border:2px solid #999;' : '';
        tiles += '<button class="csort-tile" data-orig-idx="' + s.idx + '" style="background:' + s.color + ';color:' + textColor + ';' + borderStyle + '">' + s.label + '</button>';
      }
      return '<div class="qcard">' +
        '<div class="category">🎨 Color Sort</div>' +
        '<div class="question">' + q.question + '</div>' +
        '<div class="csort-status" id="csort-status-' + idx + '">Tap colors in order (1st → last)</div>' +
        '<div class="csort-placed" id="csort-placed-' + idx + '"></div>' +
        '<div class="csort-pool" id="csort-pool-' + idx + '">' + tiles + '</div>' +
        '<div class="explanation" id="exp-' + idx + '"></div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var pool = slideEl.querySelector('#csort-pool-' + idx);
      var placed = slideEl.querySelector('#csort-placed-' + idx);
      var statusEl = slideEl.querySelector('#csort-status-' + idx);
      if (!pool) return;

      var placedOrder = [];
      var done = false;

      pool.addEventListener('click', function (e) {
        var btn = e.target.closest('.csort-tile');
        if (!btn || done || btn.classList.contains('csort-used')) return;
        btn.classList.add('csort-used');

        // Nudge on each tile tap
        Haptics.medium();

        var origIdx = parseInt(btn.dataset.origIdx);
        placedOrder.push(origIdx);

        var div = document.createElement('div');
        div.className = 'csort-placed-tile';
        div.style.background = btn.style.background;
        if (btn.style.background === 'rgb(255, 255, 255)') div.style.border = '2px solid #999';
        placed.appendChild(div);

        statusEl.textContent = placedOrder.length + '/' + q.correctOrder.length + ' placed';

        if (placedOrder.length === q.correctOrder.length) {
          var won = true;
          for (var k = 0; k < placedOrder.length; k++) {
            if (placedOrder[k] !== k) { won = false; break; }
          }
          finish(won);
        }
      });

      function finish(won) {
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if (won) {
          Haptics.success();
          statusEl.textContent = 'Perfect! 🎨';
          statusEl.style.color = 'var(--green)';
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(14);
        } else {
          Haptics.error();
          statusEl.textContent = 'Wrong order!';
          statusEl.style.color = 'var(--red)';
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) {
          var sortedLabels = q.scrambled.slice().sort(function(a,b){ return a.idx - b.idx; }).map(function(s){ return s.label; });
          expEl.textContent = won ? 'Colors sorted correctly!' : 'Correct order: ' + sortedLabels.join(' → ');
          expEl.classList.add('show');
        }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }
    }
  });

})();