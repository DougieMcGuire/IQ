// games/wordScramble.js — Unscramble the word (tap letters in order)
(function () {

  var WORDS = {
    easy: [
      {w:'BRAIN',h:'Think with it'},
      {w:'SMART',h:'Opposite of dumb'},
      {w:'LIGHT',h:'Turn it on'},
      {w:'QUICK',h:'Very fast'},
      {w:'HEART',h:'Beats in your chest'},
      {w:'DREAM',h:'Happens when you sleep'},
      {w:'OCEAN',h:'Big body of water'},
      {w:'HAPPY',h:'Feeling of joy'},
      {w:'MUSIC',h:'Melody and rhythm'},
      {w:'DANCE',h:'Move to the beat'},
      {w:'TIGER',h:'Striped big cat'},
      {w:'GRAPE',h:'Small purple fruit'},
      {w:'STORM',h:'Thunder and lightning'},
      {w:'RIVER',h:'Flowing water'},
      {w:'CANDY',h:'Sweet treat'},
    ],
    medium: [
      {w:'PUZZLE',h:'Brain teaser'},
      {w:'GENIUS',h:'Very smart person'},
      {w:'ROCKET',h:'Goes to space'},
      {w:'FROZEN',h:'Turned to ice'},
      {w:'MYSTIC',h:'Mysterious'},
      {w:'BRIDGE',h:'Crosses a gap'},
      {w:'JUNGLE',h:'Dense forest'},
      {w:'GALAXY',h:'Stars and planets'},
      {w:'TROPHY',h:'Winner gets one'},
      {w:'ZOMBIE',h:'Undead creature'},
      {w:'KNIGHT',h:'Medieval warrior'},
      {w:'WHISPER',h:'Speak very softly'},
    ],
    hard: [
      {w:'QUANTUM',h:'Physics of the very small'},
      {w:'PARADOX',h:'Contradicts itself'},
      {w:'PHOENIX',h:'Rises from ashes'},
      {w:'ECLIPSE',h:'Sun or moon blocked'},
      {w:'ALCHEMY',h:'Medieval chemistry'},
      {w:'TSUNAMI',h:'Giant ocean wave'},
      {w:'CRYPTIC',h:'Hard to understand'},
      {w:'LABYRINTH',h:'Complex maze'},
      {w:'SYMPHONY',h:'Orchestral composition'},
    ]
  };

  Q.register('wordScramble', function () {
    var tier = ['easy','medium','hard'][Q.rand(0,2)];
    var item = Q.pick(WORDS[tier]);
    var word = item.w;
    var scrambled;
    do { scrambled = Q.shuffle(word.split('')).join(''); } while (scrambled === word);
    return {
      type:'wordScramble', category:'verbalReasoning', categoryLabel:'Word Scramble',
      difficulty: {easy:0.7, medium:1.1, hard:1.5}[tier],
      question:'Unscramble the word!',
      scrambled: scrambled, word: word, hint: item.h,
      answer:word, options:[], explanation:'Hint: ' + item.h, visual:'custom'
    };
  }, 4);

  Q.registerRenderer('wordScramble', {
    render: function (q, idx) {
      var scrTiles = '';
      for (var i = 0; i < q.scrambled.length; i++) {
        scrTiles += '<button class="ws-tile ws-src" data-wi="' + idx + '" data-wc="' + i + '" data-wl="' + q.scrambled[i] + '">' + q.scrambled[i] + '</button>';
      }
      var ansTiles = '';
      for (var j = 0; j < q.word.length; j++) {
        ansTiles += '<div class="ws-tile ws-slot" data-wi="' + idx + '" data-ws="' + j + '"></div>';
      }
      return '<div class="qcard">' +
        '<div class="category">🔤 Word Scramble</div>' +
        '<div class="question">' + q.question + '</div>' +
        '<div class="ws-hint" id="ws-hint-' + idx + '">💡 ' + q.hint + '</div>' +
        '<div class="ws-answer" id="ws-answer-' + idx + '">' + ansTiles + '</div>' +
        '<div class="ws-source" id="ws-source-' + idx + '">' + scrTiles + '</div>' +
        '<div class="ws-status" id="ws-status-' + idx + '"></div>' +
        '<div class="explanation" id="exp-' + idx + '"></div>' +
        '<div class="branding">braindeer.org</div>' +
        '</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var sourceEl = slideEl.querySelector('#ws-source-' + idx);
      var answerEl = slideEl.querySelector('#ws-answer-' + idx);
      var statusEl = slideEl.querySelector('#ws-status-' + idx);
      var H = ctx.Haptics || {};
      if (!sourceEl) return;

      var placed = [];
      var done = false;
      var slots = answerEl.querySelectorAll('.ws-slot');

      sourceEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.ws-src');
        if (!btn || done || btn.classList.contains('ws-used')) return;

        H.tilePop && H.tilePop();

        btn.classList.add('ws-used');
        var letter = btn.dataset.wl;
        placed.push({ letter: letter, btn: btn });
        slots[placed.length - 1].textContent = letter;
        slots[placed.length - 1].classList.add('ws-filled');

        if (placed.length === q.word.length) {
          var attempt = placed.map(function(p){ return p.letter; }).join('');
          if (attempt === q.word) {
            finish(true);
          } else {
            H.wordleWrong && H.wordleWrong();
            answerEl.classList.add('ws-shake');
            statusEl.textContent = 'Not quite! Try again.';
            statusEl.style.color = 'var(--red)';
            setTimeout(function () {
              answerEl.classList.remove('ws-shake');
              placed.forEach(function(p){ p.btn.classList.remove('ws-used'); });
              slots.forEach(function(s){ s.textContent = ''; s.classList.remove('ws-filled'); });
              placed = [];
              statusEl.textContent = '';
            }, 700);
          }
        }
      });

      // Tap slot to undo
      answerEl.addEventListener('click', function (e) {
        var slot = e.target.closest('.ws-slot');
        if (!slot || done || !slot.classList.contains('ws-filled')) return;
        H.light && H.light();
        var slotIdx = Array.from(slots).indexOf(slot);
        while (placed.length > slotIdx) {
          var p = placed.pop();
          p.btn.classList.remove('ws-used');
          slots[placed.length].textContent = '';
          slots[placed.length].classList.remove('ws-filled');
        }
      });

      function finish(won) {
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);

        // Notify daily tasks
        if (ctx.notifyGamePlayed) ctx.notifyGamePlayed('wordScramble');

        H.success && H.success();
        slots.forEach(function(s){ s.classList.add('ws-correct'); });
        statusEl.textContent = 'Nice! 🎉';
        statusEl.style.color = 'var(--green)';
        ctx.flashEl.className = 'flash green show';
        ctx.spawnConfetti(14);
        setTimeout(function () { ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx);
        if (expEl) { expEl.textContent = q.word + ' — ' + q.hint; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }
    }
  });

})();