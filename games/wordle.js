// games/wordle.js — Wordle question type plugin
(function () {

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

  const TIERS = ['easy', 'medium', 'hard'];
  const DIFFS = [0.8, 1.2, 1.7];

  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
  ];

  // All valid guess words — answer words plus a broad common-word list
  const VALID_WORDS = new Set([
    // Answer words
    'BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD',
    'SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE',
    'VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY',
    'GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED',
    'WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER',
    'STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT',
    'TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT',
    'FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC',
    'DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH',
    'PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT',
    'CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT',
    'NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH',
    'YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER',
    'LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','VIVID','WHIFF',
    'GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL',
    'ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER',
    'AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY',
    'KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY',
    'VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR',
    'OVULE','PIXEL','RABID','SCOFF','UNZIP','VEXED','WIZEN',
    // Common 5-letter words for guessing
    'ABOUT','ABOVE','ABUSE','ACTOR','ACUTE','ADMIT','ADOPT','ADULT','AGAIN','AGENT',
    'AGREE','AHEAD','ALARM','ALBUM','ALIBI','ALIEN','ALIGN','ALIKE','ALIVE','ALLEY',
    'ALLOW','ALONE','ALONG','ALTER','ANGEL','ANGER','ANGLE','ANGRY','ANIME','ANKLE',
    'ANNEX','ANNOY','ANVIL','AORTA','APPLE','APPLY','APRON','ARENA','ARGUE','ARISE',
    'ARMOR','AROMA','AROSE','ARRAY','ARROW','ARSON','ASIDE','ATLAS','ATTIC','AUDIO',
    'AUDIT','AVOID','AWARD','AWARE','AWFUL','BADLY','BAKER','BASIC','BASIS','BATCH',
    'BATHE','BEACH','BEARD','BEAST','BEGAN','BEGIN','BEING','BELOW','BENCH','BERRY',
    'BIBLE','BIRTH','BLACK','BLADE','BLAME','BLAND','BLANK','BLAST','BLEED','BLESS',
    'BLIND','BLOCK','BLOOD','BLOOM','BLOWN','BOARD','BOAST','BONUS','BOOST','BOOTH',
    'BOUND','BOXER','BRAND','BRASS','BREAK','BREED','BRICK','BRIDE','BRIEF','BRING',
    'BROAD','BROKE','BROOD','BROOK','BROWN','BRUSH','BUDDY','BUILD','BUILT','BUNCH',
    'BURST','BUYER','CABIN','CABLE','CAMEL','CANDY','CARGO','CARRY','CAUSE','CEASE',
    'CHAIR','CHALK','CHAOS','CHARM','CHART','CHASE','CHEAP','CHECK','CHEEK','CHEER',
    'CHESS','CHEST','CHIEF','CHILD','CHOIR','CLAIM','CLAMP','CLASH','CLASS','CLEAN',
    'CLERK','CLICK','CLIFF','CLOCK','CLONE','CLOTH','CLOUD','CLOWN','COACH','COAST',
    'COLOR','COMIC','COMMA','CONCH','CORAL','COUCH','COULD','COUNT','COURT','COVER',
    'CRACK','CRAFT','CRANE','CRASH','CRAWL','CREAM','CREEK','CRIME','CROSS','CROWD',
    'CROWN','CRUSH','CRUST','CURVE','CYCLE','DAIRY','DAISY','DEATH','DECAY','DECRY',
    'DELAY','DELTA','DENSE','DERBY','DEVIL','DIRTY','DISCO','DITCH','DIVER','DIZZY',
    'DOING','DONOR','DOUBT','DOUGH','DOWRY','DRAFT','DRAIN','DRAMA','DRAWL','DRINK',
    'DRIVE','DROVE','DRUGS','DRYER','DUNCE','EAGER','EIGHT','ELECT','ELITE','EMAIL',
    'EMBER','EMPTY','ENEMY','ENJOY','ENTER','ENTRY','EQUAL','ERROR','ESSAY','EVENT',
    'EVERY','EXACT','EXIST','FABLE','FAINT','FAIRY','FAITH','FALSE','FANCY','FATAL',
    'FAULT','FEAST','FENCE','FERRY','FEVER','FEWER','FIERY','FIGHT','FILED','FINAL',
    'FIXED','FLARE','FLASH','FLASK','FLEET','FLESH','FLOCK','FLOOD','FLOOR','FLOUR',
    'FLUID','FLUKE','FLUSH','FORGE','FORTH','FORUM','FOUND','FREED','FRESH','FRONT',
    'FROST','FRUIT','FULLY','FUNNY','GAVEL','GHOST','GIVEN','GLAND','GLARE','GLEAM',
    'GLOOM','GLORY','GLOSS','GLOVE','GOING','GRAIN','GRAND','GRANT','GRASS','GRAVE',
    'GRAZE','GREAT','GREED','GREEN','GRIEF','GRILL','GRIND','GROAN','GROIN','GROUP',
    'GROVE','GROWL','GROWN','GUARD','GUESS','GUEST','GUIDE','GUILD','GUILE','GUILT',
    'GUISE','HABIT','HARSH','HASTE','HAVEN','HEARD','HEAVY','HERTZ','HINGE','HINTS',
    'HOLLY','HONEY','HONOR','HOPED','HORSE','HOTEL','HOUND','HUMAN','HURRY','HYDRA',
    'IDEAL','IDIOM','IDIOT','IMAGE','INDEX','INNER','INTER','INTRO','IRONY','ISSUE',
    'IVORY','JAPAN','JEWEL','KARMA','KNIFE','KNOCK','KNOWN','LABEL','LANCE','LASER',
    'LATER','LAUGH','LAYER','LEASE','LEAVE','LEGAL','LEVEL','LINEN','LIVER','LOCAL',
    'LOGIC','LOOSE','LOUSE','LOWER','LUCKY','LUNAR','LYING','MAJOR','MAKER','MANOR',
    'MAPLE','MARCH','MARSH','MATCH','MAYBE','MEDIA','MERCY','MERGE','METAL','MIGHT',
    'MINCE','MINOR','MINUS','MIXED','MODEL','MONEY','MONTH','MORAL','MOUSE','MOUTH',
    'MOVED','MOVIE','MUDDY','MUSIC','NAIVE','NERVE','NEVER','NOBLE','NOISE','NORTH',
    'NOVEL','OCCUR','OFFER','OFTEN','OLIVE','OPERA','ORBIT','OTHER','OUTER','OWNER',
    'OXIDE','OZONE','PANEL','PANIC','PAPER','PARTY','PATCH','PAUSE','PEACE','PEACH',
    'PEARL','PEDAL','PHOTO','PIANO','PIECE','PITCH','PLAIN','PLANE','PLANK','PLANT',
    'PLATE','PLAZA','PLEAD','PLUCK','PLUME','PLUNK','POINT','POKER','POLAR','POUND',
    'PRESS','PRICE','PRIDE','PRIME','PRINT','PRIZE','PROBE','PROOF','PROSE','PROUD',
    'PROVE','PUNCH','QUERY','QUEST','QUEUE','QUIET','QUOTA','QUOTE','RADAR','RADIO',
    'RALLY','RANCH','RANGE','RAPID','RATIO','READY','REBUS','RECAP','REFER','REIGN',
    'RELAX','RELAY','REMIX','RENAL','RENEW','REPAY','REPEL','REPLY','RESET','RESIN',
    'RHINO','RIDGE','RIGHT','RIVAL','ROBOT','ROCKY','ROMAN','ROUGE','ROUGH','ROUND',
    'ROYAL','RUGBY','RULER','RUNNY','SADLY','SALAD','SAUCE','SCALE','SCARE','SCENE',
    'SCONE','SCOPE','SEDAN','SEIZE','SENSE','SERVE','SETUP','SEVEN','SHADE','SHAKE',
    'SHALL','SHAME','SHAPE','SHARE','SHARK','SHEER','SHELF','SHELL','SHIFT','SHINE',
    'SHIRT','SHOCK','SHORE','SHORT','SHOUT','SHOVE','SHRUG','SILLY','SINCE','SIXTH',
    'SIXTY','SKILL','SKULL','SLACK','SLANT','SLAVE','SLEEK','SLEEP','SLEET','SLIDE',
    'SLOPE','SLOTH','SMELL','SMILE','SMIRK','SMOKE','SNACK','SNAIL','SNAKE','SOLVE',
    'SORRY','SOUTH','SPARK','SPEAK','SPEED','SPELL','SPILL','SPINE','SPOKE','SPOON',
    'SPORT','STAFF','STAIN','STAKE','STALE','STALL','STAMP','STAND','STARE','START',
    'STATE','STEAL','STEAM','STEEL','STEEP','STEER','STERN','STICK','STIFF','STILL',
    'STOCK','STOMP','STONE','STOOD','STORE','STRAP','STRAW','STRAY','STRIP','STUCK',
    'STUDY','STYLE','SUGAR','SUITE','SUNNY','SUPER','SURGE','SWAMP','SWEAR','SWEAT',
    'SWEEP','SWEET','SWIFT','SWIPE','SWIRL','SWOOP','SWORD','TABLE','TAKEN','TASTE',
    'TEACH','TENSE','THEIR','THEME','THERE','THESE','THICK','THING','THORN','THOSE',
    'THREE','THREW','THROW','THUMB','TIGER','TIGHT','TITLE','TODAY','TONIC','TORCH',
    'TOTAL','TOUCH','TOUGH','TOWEL','TRACK','TRADE','TRAIL','TRAIT','TRAMP','TRASH',
    'TREAD','TREAT','TREND','TRIAL','TRIBE','TRICK','TRIED','TROOP','TROVE','TRUCK',
    'TRULY','TRUNK','TRUST','TRUTH','TUMOR','TWIRL','TWIST','TYING','UNCLE','UNDER',
    'UNIFY','UNION','UNITY','UPPER','UPSET','URBAN','USAGE','USHER','UTTER','VAGUE',
    'VALVE','VAULT','VERSE','VIDEO','VIGOR','VIRAL','VIRUS','VISIT','VISTA','VOCAL',
    'VOTER','VYING','WAIST','WEAVE','WEIGH','WEIRD','WHALE','WHERE','WHILE','WHITE',
    'WHOLE','WHOSE','WIELD','WITCH','WOMAN','WOMEN','WOODS','WORRY','WORSE','WORST',
    'WRIST','WROTE','YIELD','YOURS','YOUTH','ZEBRA','ZONED',
  ]);

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

  Q.registerRenderer('wordle', {

    render: function (q, idx) {
      var gridHTML = '';
      for (var r = 0; r < 6; r++) {
        var rowHTML = '';
        for (var c = 0; c < 5; c++) {
          rowHTML += '<div class="wordle-tile" id="wt-' + idx + '-' + r + '-' + c + '"></div>';
        }
        gridHTML += '<div class="wordle-row">' + rowHTML + '</div>';
      }

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

    attach: function (slideEl, q, idx, ctx) {
      var feed      = ctx.feed;
      var flashEl   = ctx.flashEl;
      var IQData    = ctx.IQData;
      var updateUI  = ctx.updateUI;
      var checkMore = ctx.checkMore;
      var spawnConfetti  = ctx.spawnConfetti;
      var answerStartRef = ctx.answerStartRef;

      var st = {
        answer:    q.answer,
        category:  q.category,
        difficulty:q.difficulty,
        guesses:   [],
        current:   '',
        done:      false,
        keyColors: {},
      };

      slideEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-wk]');
        if (!btn || +btn.dataset.wi !== idx) return;
        handleKey(btn.dataset.wk);
      });

      document.addEventListener('keydown', function (e) {
        if (st.done) return;
        var visIdx = Math.round(feed.scrollTop / (feed.clientHeight || 1));
        if (feed.children[visIdx] !== slideEl) return;
        if      (e.key === 'Enter')     handleKey('ENTER');
        else if (e.key === 'Backspace') handleKey('⌫');
        else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
      });

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
          if (!VALID_WORDS.has(st.current)) {
            msgEl.className = 'wordle-msg error';
            msgEl.textContent = 'Not a valid word!';
            shakeRow(st.guesses.length);
            return;
          }
          submitGuess();
          return;
        }

        if (st.current.length < 5) {
          st.current += key;
          updateCurrentRow();
          msgEl.className = 'wordle-msg';
          msgEl.textContent = '';
        }
      }

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

      function finishWordle(won) {
        st.done = true;
        var msgEl  = document.getElementById('wm-' + idx);
        var expEl  = document.getElementById('exp-' + idx);
        var hintEl = document.getElementById('hint-' + idx);

        var ms   = Date.now() - answerStartRef.get();
        var data = IQData.recordAnswer(st.category, won, st.difficulty, ms);

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
