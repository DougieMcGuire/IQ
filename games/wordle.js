// games/wordle.js — Wordle question type plugin
(function () {

  const ANSWERS_URL = 'https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/wordle-answers-alphabetical.txt';
  const GUESSES_URL = 'https://gist.githubusercontent.com/cfreshman/cdcdf777450c5b5301e439061d29694c/raw/b9f4f46b690e8a7c0643be16d239e824a3232b1b/wordle-allowed-guesses.txt';

  const SEED_EASY = ['BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD','SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE','VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY','GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED','WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER','STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT','TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT'];
  const SEED_MEDIUM = ['FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC','DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH','PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT','CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT','NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH','YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER','LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','VIVID','WHIFF'];
  const SEED_HARD = ['GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL','ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER','AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY','KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY','VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR','OVULE','PIXEL','RABID','SCOFF','UNZIP','VEXED','WIZEN','EXPEL'];

  var WORDS = { easy: SEED_EASY.slice(), medium: SEED_MEDIUM.slice(), hard: SEED_HARD.slice() };
  var VALID_WORDS = new Set(SEED_EASY.concat(SEED_MEDIUM, SEED_HARD));
  var COMMON_BIGRAMS = new Set(['TH','HE','IN','ER','AN','RE','ON','EN','AT','ND','ST','ES','NG','ED','TE','OR','TI','IS','IT','AR','AL','LE','NT','IC','OU','TO','LY','RA','IO','RI']);

  function wordFreqScore(w) { var s=0; for(var i=0;i<4;i++) if(COMMON_BIGRAMS.has(w.slice(i,i+2)))s++; return s; }
  function classifyWords(words) {
    var scored = words.map(function(w){return{w:w,s:wordFreqScore(w)};}); scored.sort(function(a,b){return b.s-a.s;});
    var t=Math.floor(scored.length/3);
    WORDS.easy=scored.slice(0,t).map(function(x){return x.w;}); WORDS.medium=scored.slice(t,t*2).map(function(x){return x.w;}); WORDS.hard=scored.slice(t*2).map(function(x){return x.w;});
  }
  (function(){
    var ar=false,gr=false,aa=[];
    function tm(){if(!ar||!gr)return;if(aa.length)classifyWords(aa);}
    fetch(ANSWERS_URL).then(function(r){return r.text();}).then(function(t){aa=t.trim().split(/\s+/).map(function(w){return w.trim().toUpperCase();}).filter(function(w){return/^[A-Z]{5}$/.test(w);});aa.forEach(function(w){VALID_WORDS.add(w);});ar=true;tm();}).catch(function(){ar=true;tm();});
    fetch(GUESSES_URL).then(function(r){return r.text();}).then(function(t){t.trim().split(/\s+/).forEach(function(w){var x=w.trim().toUpperCase();if(/^[A-Z]{5}$/.test(x))VALID_WORDS.add(x);});gr=true;tm();}).catch(function(){gr=true;tm();});
  })();

  const TIERS=['easy','medium','hard'], DIFFS=[0.8,1.2,1.7];
  const KB_ROWS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','⌫']];

  Q.register('wordle', function () {
    var tier=this.rand(0,2), list=WORDS[TIERS[tier]], word=this.pick(list.length?list:SEED_EASY);
    return {type:'wordle',category:'verbalReasoning',categoryLabel:'Wordle',difficulty:DIFFS[tier],question:'Guess the 5-letter word',answer:word,options:[],explanation:'The word was '+word+'.',visual:'wordle',maxGuesses:6};
  }, 4);

  Q.registerRenderer('wordle', {
    render: function (q, idx) {
      var grid='';
      for(var r=0;r<6;r++){var row='';for(var c=0;c<5;c++)row+='<div class="wordle-tile" id="wt-'+idx+'-'+r+'-'+c+'"></div>';grid+='<div class="wordle-row" style="gap:3px">'+row+'</div>';}
      var kb=KB_ROWS.map(function(row){return '<div class="wordle-kb-row" style="gap:3px">'+row.map(function(k){return '<button class="wk'+(k==='ENTER'||k==='⌫'?' wide':'')+'" data-wk="'+k+'" data-wi="'+idx+'">'+k+'</button>';}).join('')+'</div>';}).join('');
      return '<div class="qcard" style="gap:6px;padding:12px 10px">'+
        '<div class="category">🟩 Wordle</div>'+
        '<div class="question" style="font-size:clamp(12px,3.2vw,15px)">Guess the 5-letter word</div>'+
        '<div class="wordle-grid" style="gap:3px">'+grid+'</div>'+
        '<div class="wordle-msg" id="wm-'+idx+'"></div>'+
        '<div class="wordle-kb" style="gap:3px">'+kb+'</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explain" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>'+
        '<div class="scroll-hint" id="hint-'+idx+'"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>Swipe for next</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var feed=ctx.feed,flashEl=ctx.flashEl,IQData=ctx.IQData,updateUI=ctx.updateUI,checkMore=ctx.checkMore,spawnConfetti=ctx.spawnConfetti,answerStartRef=ctx.answerStartRef,H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx); if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      var st={answer:q.answer,category:q.category,difficulty:q.difficulty,guesses:[],current:'',done:false,keyColors:{}};

      slideEl.addEventListener('click',function(e){var btn=e.target.closest('[data-wk]');if(!btn||+btn.dataset.wi!==idx)return;handleKey(btn.dataset.wk);});
      document.addEventListener('keydown',function(e){if(st.done)return;var vi=Math.round(feed.scrollTop/(feed.clientHeight||1));if(feed.children[vi]!==slideEl)return;if(e.key==='Enter')handleKey('ENTER');else if(e.key==='Backspace')handleKey('⌫');else if(/^[a-zA-Z]$/.test(e.key))handleKey(e.key.toUpperCase());});

      function handleKey(key){
        if(st.done)return;
        var msgEl=document.getElementById('wm-'+idx);
        if(key==='⌫'){if(st.current.length>0)H.light&&H.light();st.current=st.current.slice(0,-1);updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';return;}
        if(key==='ENTER'){
          if(st.current.length<5){H.warning&&H.warning();msgEl.className='wordle-msg error';msgEl.textContent='Not enough letters';shakeRow(st.guesses.length);return;}
          if(!VALID_WORDS.has(st.current)){H.wordleWrong&&H.wordleWrong();msgEl.className='wordle-msg error';msgEl.textContent='Not a valid word!';shakeRow(st.guesses.length);return;}
          submitGuess();return;
        }
        if(st.current.length<5){H.tilePop&&H.tilePop();st.current+=key;updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';}
      }
      function updateCurrentRow(){var row=st.guesses.length;for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;var l=st.current[c]||'';t.textContent=l;t.className='wordle-tile'+(l?' has-letter':'');}}
      function shakeRow(row){for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');(function(el){setTimeout(function(){el.classList.remove('shake');},400);})(t);}}
      function scoreGuess(guess,answer){var res=[null,null,null,null,null],pool=answer.split(''),i;for(i=0;i<5;i++)res[i]='absent';for(i=0;i<5;i++)if(guess[i]===pool[i]){res[i]='correct';pool[i]=null;}for(i=0;i<5;i++){if(res[i]==='correct')continue;var j=pool.indexOf(guess[i]);if(j!==-1){res[i]='present';pool[j]=null;}}return res;}
      function submitGuess(){
        var guess=st.current,result=scoreGuess(guess,st.answer),row=st.guesses.length;
        st.guesses.push({word:guess,result:result});st.current='';
        var FH=200,FD=400,ST=100;
        for(var t=0;t<5;t++)(function(i){setTimeout(function(){H.tilePop&&H.tilePop();},i*ST);})(t);
        for(var c=0;c<5;c++)(function(col){var tile=document.getElementById('wt-'+idx+'-'+row+'-'+col);if(!tile)return;setTimeout(function(){tile.style.transition='transform '+FH+'ms ease-in';tile.style.transform='rotateX(-90deg)';setTimeout(function(){tile.textContent=guess[col];tile.className='wordle-tile reveal-'+result[col];tile.style.transition='transform '+FH+'ms ease-out';tile.style.transform='rotateX(0deg)';},FH);},col*ST);})(c);
        setTimeout(function(){updateKeyboard(guess,result);var won=result.every(function(r){return r==='correct';});var lost=!won&&st.guesses.length>=6;if(won||lost)finishWordle(won);},4*ST+FD+50);
      }
      function updateKeyboard(guess,result){var p={correct:3,present:2,absent:1};for(var i=0;i<5;i++){var l=guess[i];if(!st.keyColors[l]||p[result[i]]>p[st.keyColors[l]])st.keyColors[l]=result[i];}document.querySelectorAll('[data-wi="'+idx+'"]').forEach(function(btn){var s=st.keyColors[btn.dataset.wk];if(!s)return;btn.classList.remove('st-correct','st-present','st-absent');btn.classList.add('st-'+s);});}
      function finishWordle(won){
        st.done=true;
        var msgEl=document.getElementById('wm-'+idx),expEl=document.getElementById('exp-'+idx),hintEl=document.getElementById('hint-'+idx);
        var ms=Date.now()-answerStartRef.get(),data=IQData.recordAnswer(st.category,won,st.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordle');
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){var bg=['Ace! 🎯','Brilliant! 🧠','Nailed it! ⚡','Great! 🔥','Nice! 💡','Phew! 😅'];msgEl.className='wordle-msg success';msgEl.textContent=bg[st.guesses.length-1]||'Yes!';st.guesses.length===1?(H.streak&&H.streak()):(H.wordleWin&&H.wordleWin());flashEl.className='flash green show';spawnConfetti(st.guesses.length===1?30:14);setTimeout(function(){flashEl.className='flash';},350);}
        else{msgEl.className='wordle-msg error';msgEl.textContent='The word was '+st.answer;H.error&&H.error();flashEl.className='flash red show';setTimeout(function(){flashEl.className='flash';},350);}
        if(expEl){expEl.textContent=won?'Solved in '+st.guesses.length+' guess'+(st.guesses.length===1?'':'es')+'!':'The answer was "'+st.answer+'". Keep going!';setTimeout(function(){expEl.classList.add('show');},200);}
        setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);
        updateUI(data);
        if(won&&data.streak>0&&data.streak%5===0){setTimeout(function(){H.streak&&H.streak();var sn=document.getElementById('streak-num'),sp=document.getElementById('streak-popup');if(sn)sn.textContent=data.streak;if(sp){sp.classList.add('show');spawnConfetti(25);setTimeout(function(){sp.classList.remove('show');},1800);}},600);}
        checkMore();answerStartRef.set(Date.now());
      }
    }
  });
})();