// games/games.js — Cebear Interactive Games (v6)
// Riddles & Matrix live in questions.js — this file is ONLY interactive game renderers

(function(){
  if(document.getElementById('cg-styles'))return;
  var s=document.createElement('style');s.id='cg-styles';
  s.textContent=`
  .m48-wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;background:rgba(27,45,91,.55);padding:7px;border-radius:14px;width:min(228px,62vw);margin:4px auto;touch-action:none;user-select:none}.m48-cell{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(12px,3.4vw,18px);font-weight:900;background:rgba(240,234,214,.06);color:rgba(240,234,214,.18);transition:background .12s,transform .1s}.m48-cell.m48-pop{animation:m48pop .18s ease-out}@keyframes m48pop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}.m48-cell[data-v="2"]{background:#3a7df2;color:#fff}.m48-cell[data-v="4"]{background:#6d4aed;color:#fff}.m48-cell[data-v="8"]{background:#e87d1a;color:#fff}.m48-cell[data-v="16"]{background:#e8443a;color:#fff}.m48-cell[data-v="32"]{background:#3fba4f;color:#fff}.m48-cell[data-v="64"]{background:#e8a817;color:#1a1a2e}.m48-cell[data-v="128"]{background:#fff;color:#1b2d5b;font-size:clamp(9px,2.5vw,13px)}.m48-scores{display:flex;gap:8px;justify-content:center}.m48-sbox{background:rgba(240,234,214,.08);border-radius:10px;padding:5px 14px;text-align:center}.m48-sl{font-size:9px;font-weight:900;letter-spacing:1px;color:rgba(240,234,214,.3);text-transform:uppercase}.m48-sv{font-size:17px;font-weight:900;color:var(--cream)}.m48-msg{font-size:13px;font-weight:800;text-align:center;min-height:18px;color:rgba(240,234,214,.5)}
  .ws2-wrap{display:flex;gap:clamp(6px,2vw,11px);justify-content:center;align-items:flex-end;margin:6px 0;flex-wrap:wrap}.ws2-tube-outer{display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none;transition:transform .15s}.ws2-tube-outer:active{transform:scale(.95)}.ws2-tube{width:clamp(30px,8vw,40px);border:2.5px solid rgba(240,234,214,.16);border-top:none;border-radius:0 0 10px 10px;overflow:hidden;background:rgba(240,234,214,.03);transition:transform .15s,border-color .15s}.ws2-tube.ws2-sel{border-color:var(--gold);transform:translateY(-9px)}.ws2-tube.ws2-done{border-color:var(--green)}.ws2-layer{height:clamp(16px,4.5vw,22px);width:100%;transition:background .18s}.ws2-cap{width:clamp(14px,3.8vw,20px);height:4px;background:rgba(240,234,214,.08);border-radius:3px 3px 0 0;margin-bottom:-1px}.ws2-pours{font-size:11px;font-weight:700;text-align:center;color:rgba(240,234,214,.22);min-height:15px}.ws2-status{font-size:13px;font-weight:800;text-align:center;min-height:18px;color:rgba(240,234,214,.4)}
  .wl-endpoints{display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 2px;margin:4px 0}.wl-ep-box{text-align:center}.wl-ep-lbl{font-size:9px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:rgba(240,234,214,.28);margin-bottom:3px}.wl-ep-tiles{display:flex;gap:3px}.wl-ep-tile{width:clamp(22px,6vw,30px);height:clamp(22px,6vw,30px);border-radius:6px;background:rgba(240,234,214,.09);display:flex;align-items:center;justify-content:center;font-size:clamp(10px,3vw,14px);font-weight:900;color:rgba(240,234,214,.45)}.wl-arrow{font-size:20px;color:rgba(240,234,214,.15);align-self:center}.wl-current{display:flex;gap:5px;justify-content:center;margin:6px 0}.wl-cur-tile{width:clamp(32px,8.5vw,44px);height:clamp(32px,8.5vw,44px);border-radius:8px;background:rgba(240,234,214,.1);border:2px solid rgba(240,234,214,.2);display:flex;align-items:center;justify-content:center;font-size:clamp(14px,4vw,19px);font-weight:900;color:var(--cream);cursor:pointer;transition:all .12s}.wl-cur-tile.wl-sel{background:rgba(232,168,23,.2);border-color:var(--gold);color:var(--gold)}.wl-cur-tile.wl-match{background:rgba(63,186,79,.15);border-color:var(--green);color:var(--green);pointer-events:none}.wl-alpha{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin:6px 0;max-width:320px}.wl-lbtn{min-width:clamp(28px,7.5vw,38px);height:clamp(32px,8.5vw,42px);border:none;border-radius:8px;background:rgba(240,234,214,.14);color:var(--cream);font-family:'Nunito',sans-serif;font-size:clamp(12px,3.2vw,15px);font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .08s,transform .08s;padding:0 5px;box-shadow:0 3px 0 rgba(0,0,0,.3);user-select:none}.wl-lbtn:active{background:rgba(240,234,214,.3);transform:translateY(3px);box-shadow:none}.wl-lbtn.wl-same{background:rgba(240,234,214,.04);color:rgba(240,234,214,.18);pointer-events:none;box-shadow:none}.wl-moves{font-size:12px;font-weight:800;text-align:center;color:rgba(240,234,214,.3);min-height:16px}.wl-status{font-size:13px;font-weight:800;text-align:center;min-height:18px}.wl-hist{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:2px 0;min-height:16px}.wl-hist-w{font-size:10px;font-weight:800;color:rgba(240,234,214,.2);padding:2px 6px;background:rgba(240,234,214,.05);border-radius:4px}
  .game-fullbtn{display:flex;align-items:center;justify-content:center;gap:6px;background:rgba(240,234,214,.07);border:1px solid rgba(240,234,214,.14);border-radius:12px;padding:8px 16px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:900;color:rgba(240,234,214,.55);cursor:pointer;width:100%;margin-top:6px;transition:all .15s;text-decoration:none}.game-fullbtn:active{background:rgba(240,234,214,.14);transform:scale(.97)}.game-fullbtn svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.5;flex-shrink:0}
  .game-branding{width:100%;display:flex;justify-content:center;margin-top:8px;padding-top:10px;border-top:1px solid rgba(240,234,214,.06)}.game-branding a{display:inline-flex;align-items:center;gap:5px;background:rgba(240,234,214,.07);border:1px solid rgba(240,234,214,.12);border-radius:20px;padding:5px 12px 5px 8px;text-decoration:none;transition:all .15s}.game-branding a:active{transform:scale(.96)}.game-branding-bear{width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}.game-branding-bear img{width:20px;height:20px;object-fit:contain}.game-branding-text{font-size:11px;font-weight:900;color:rgba(240,234,214,.5);letter-spacing:1.5px;text-transform:uppercase}
  .scroll-hint{position:relative;bottom:auto;left:auto;right:auto;font-size:13px;font-weight:900;display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity .4s;pointer-events:none;opacity:0;margin-top:8px}.scroll-hint.show{opacity:1}.scroll-hint-inner{display:flex;align-items:center;gap:7px;background:rgba(240,234,214,.1);border:1px solid rgba(240,234,214,.15);border-radius:20px;padding:7px 16px;color:var(--cream)}.scroll-hint-inner svg{width:16px;height:16px;stroke:var(--gold);fill:none;stroke-width:2.8;animation:bounce 1.2s infinite}.scroll-hint-inner span{font-size:12px;font-weight:900;color:rgba(240,234,214,.7);letter-spacing:.3px}@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}@keyframes pop{0%{transform:scale(1)}30%{transform:scale(1.12)}60%{transform:scale(.97)}100%{transform:scale(1)}}
  .pc3-grid{display:grid;gap:5px;background:#e2ddd4;padding:7px;border-radius:16px;margin:4px auto;border:3px solid #d6cfc0;box-shadow:0 5px 0 #c0b9ae}.pc3-cell{border-radius:10px;background:#fff;border:2.5px solid #e8e2d6;position:relative;cursor:pointer;user-select:none;transition:border-color .15s,background .15s,box-shadow .15s;box-shadow:0 3px 0 #d6cfc0;overflow:hidden;aspect-ratio:1}.pc3-cell:not([style*='pointer-events:none']):active{transform:translateY(3px);box-shadow:none}.pc3-status{font-size:13px;font-weight:800;text-align:center;color:rgba(255,255,255,.6);min-height:18px}.pc3-moves{font-size:11px;font-weight:700;text-align:center;color:rgba(255,255,255,.3);min-height:14px}
  .jig-pw{cursor:grab;user-select:none;touch-action:none;transition:opacity .15s}.jig-pw:active{cursor:grabbing}.jig-pw.jig-pw-placed{opacity:.15;pointer-events:none}.jig-status{font-size:13px;font-weight:800;text-align:center;color:rgba(255,255,255,.55);min-height:18px}
  `;
  document.head.appendChild(s);
})();

function _gameBranding(){return'<div class="game-branding"><a href="https://cebear.com" target="_blank" rel="noopener"><div class="game-branding-bear"><img src="logo.png" alt=""></div><span class="game-branding-text">cebear.com</span></a></div>';}
function _scrollHint(idx){return'<div class="scroll-hint" id="hint-'+idx+'"><div class="scroll-hint-inner"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg><span>Swipe for next</span></div></div>';}
function _fullGameBtn(label,gameType){return'<button class="game-fullbtn" onclick="_openFullGame(\''+gameType+'\')"><svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'+label+'</button>';}
window._openFullGame=function(gt){var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:9999;background:#0a1628;display:flex;flex-direction:column;overflow:hidden;';ov.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(240,234,214,.1);flex-shrink:0"><span style="font-family:Nunito,sans-serif;font-size:16px;font-weight:900;color:#F0EAD6">Full Game</span><button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(240,234,214,.1);border:none;border-radius:10px;padding:7px 14px;font-family:Nunito,sans-serif;font-size:13px;font-weight:800;color:rgba(240,234,214,.7);cursor:pointer">✕ Close</button></div>';var bd=document.createElement('div');bd.style.cssText='flex:1;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;';ov.appendChild(bd);document.body.appendChild(ov);bd.innerHTML='<div style="color:rgba(240,234,214,.5);font-family:Nunito,sans-serif;text-align:center;padding:40px">Full game coming soon!</div>';};
(function(){if(!window._lastGameType)window._lastGameType=null;if(!window._gameTypeCount)window._gameTypeCount={};})();

// ── Wordle ────────────────────────────────────────────────────────────────────
(function(){
  const ANSWERS_URL='https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/wordle-answers-alphabetical.txt';
  const GUESSES_URL='https://gist.githubusercontent.com/cfreshman/cdcdf777450c5b5301e439061d29694c/raw/b9f4f46b690e8a7c0643be16d239e824a3232b1b/wordle-allowed-guesses.txt';
  const SEED_EASY=['BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD','SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE','VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY','GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED','WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER','STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT','TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT'];
  const SEED_MEDIUM=['FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC','DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH','PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT','CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT','NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH','YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER','LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','VIVID','WHIFF'];
  const SEED_HARD=['GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL','ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER','AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY','KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY','VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR','OVULE','PIXEL','RABID','SCOFF','UNZIP','VEXED','WIZEN','EXPEL'];
  var WORDS={easy:SEED_EASY.slice(),medium:SEED_MEDIUM.slice(),hard:SEED_HARD.slice()};
  var VALID_WORDS=new Set(SEED_EASY.concat(SEED_MEDIUM,SEED_HARD));
  var COMMON_BIGRAMS=new Set(['TH','HE','IN','ER','AN','RE','ON','EN','AT','ND','ST','ES','NG','ED','TE','OR','TI','IS','IT','AR','AL','LE','NT','IC','OU','TO','LY','RA','IO','RI']);
  function wordFreqScore(w){var s=0;for(var i=0;i<4;i++)if(COMMON_BIGRAMS.has(w.slice(i,i+2)))s++;return s;}
  function classifyWords(words){var scored=words.map(function(w){return{w:w,s:wordFreqScore(w)};});scored.sort(function(a,b){return b.s-a.s;});var t=Math.floor(scored.length/3);WORDS.easy=scored.slice(0,t).map(function(x){return x.w;});WORDS.medium=scored.slice(t,t*2).map(function(x){return x.w;});WORDS.hard=scored.slice(t*2).map(function(x){return x.w;});}
  (function(){var ar=false,gr=false,aa=[];function tm(){if(!ar||!gr)return;if(aa.length)classifyWords(aa);}fetch(ANSWERS_URL).then(function(r){return r.text();}).then(function(t){aa=t.trim().split(/\s+/).map(function(w){return w.trim().toUpperCase();}).filter(function(w){return/^[A-Z]{5}$/.test(w);});aa.forEach(function(w){VALID_WORDS.add(w);});ar=true;tm();}).catch(function(){ar=true;tm();});fetch(GUESSES_URL).then(function(r){return r.text();}).then(function(t){t.trim().split(/\s+/).forEach(function(w){var x=w.trim().toUpperCase();if(/^[A-Z]{5}$/.test(x))VALID_WORDS.add(x);});gr=true;tm();}).catch(function(){gr=true;tm();});})();
  const TIERS=['easy','medium','hard'],DIFFS=[0.8,1.2,1.7];
  const KB_ROWS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','⌫']];
  Q.register('wordle',function(){var tier=this.rand(0,2),list=WORDS[TIERS[tier]],word=this.pick(list.length?list:SEED_EASY);return{type:'wordle',category:'verbalReasoning',categoryLabel:'Wordle',difficulty:DIFFS[tier],question:'Guess the 5-letter word',answer:word,options:[],explanation:'The word was '+word+'.',visual:'wordle',maxGuesses:6};},3);
  Q.registerRenderer('wordle',{
    render:function(q,idx){var grid='';for(var r=0;r<6;r++){var row='';for(var c=0;c<5;c++)row+='<div class="wordle-tile" id="wt-'+idx+'-'+r+'-'+c+'"></div>';grid+='<div class="wordle-row" style="gap:3px">'+row+'</div>';}var kb=KB_ROWS.map(function(row){return'<div class="wordle-kb-row" style="gap:3px">'+row.map(function(k){return'<button class="wk'+(k==='ENTER'||k==='⌫'?' wide':'')+'" data-wk="'+k+'" data-wi="'+idx+'">'+k+'</button>';}).join('')+'</div>';}).join('');return'<div class="qcard" style="gap:3px;padding:6px 8px;overflow:hidden"><div class="category">WORDLE</div><div class="question" style="font-size:clamp(11px,2.8vw,13px);margin:0">Guess the 5-letter word</div><div class="wordle-grid" style="gap:3px">'+grid+'</div><div class="wordle-msg" id="wm-'+idx+'"></div><div class="wordle-kb" style="gap:3px">'+kb+'</div><div id="wa-'+idx+'"></div><div class="explain" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var feed=ctx.feed,flashEl=ctx.flashEl,IQData=ctx.IQData,updateUI=ctx.updateUI,checkMore=ctx.checkMore,spawnConfetti=ctx.spawnConfetti,answerStartRef=ctx.answerStartRef,H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var st={answer:q.answer,category:q.category,difficulty:q.difficulty,guesses:[],current:'',done:false,keyColors:{}};slideEl.addEventListener('click',function(e){var btn=e.target.closest('[data-wk]');if(!btn||+btn.dataset.wi!==idx)return;handleKey(btn.dataset.wk);});document.addEventListener('keydown',function(e){if(st.done)return;var vi=Math.round(feed.scrollTop/(feed.clientHeight||1));if(feed.children[vi]!==slideEl)return;if(e.key==='Enter')handleKey('ENTER');else if(e.key==='Backspace')handleKey('⌫');else if(/^[a-zA-Z]$/.test(e.key))handleKey(e.key.toUpperCase());});
    function handleKey(key){if(st.done)return;var msgEl=document.getElementById('wm-'+idx);if(key==='⌫'){if(st.current.length>0)H.light&&H.light();st.current=st.current.slice(0,-1);updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';return;}if(key==='ENTER'){if(st.current.length<5){H.warning&&H.warning();msgEl.className='wordle-msg error';msgEl.textContent='Not enough letters';shakeRow(st.guesses.length);return;}if(!VALID_WORDS.has(st.current)){H.wordleWrong&&H.wordleWrong();msgEl.className='wordle-msg error';msgEl.textContent='Not a valid word!';shakeRow(st.guesses.length);return;}submitGuess();return;}if(st.current.length<5){H.tilePop&&H.tilePop();st.current+=key;updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';}}
    function updateCurrentRow(){var row=st.guesses.length;for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;var l=st.current[c]||'';t.textContent=l;t.className='wordle-tile'+(l?' has-letter':'');}}
    function shakeRow(row){for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');(function(el){setTimeout(function(){el.classList.remove('shake');},400);})(t);}}
    function scoreGuess(guess,answer){var res=[],pool=answer.split(''),i;for(i=0;i<5;i++)res[i]='absent';for(i=0;i<5;i++)if(guess[i]===pool[i]){res[i]='correct';pool[i]=null;}for(i=0;i<5;i++){if(res[i]==='correct')continue;var j=pool.indexOf(guess[i]);if(j!==-1){res[i]='present';pool[j]=null;}}return res;}
    function submitGuess(){var guess=st.current,result=scoreGuess(guess,st.answer),row=st.guesses.length;st.guesses.push({word:guess,result:result});st.current='';var FH=200,ST=100;for(var t2=0;t2<5;t2++)(function(i){setTimeout(function(){H.tilePop&&H.tilePop();},i*ST);})(t2);for(var c=0;c<5;c++)(function(col){var tile=document.getElementById('wt-'+idx+'-'+row+'-'+col);if(!tile)return;setTimeout(function(){tile.style.transition='transform '+FH+'ms ease-in';tile.style.transform='rotateX(-90deg)';setTimeout(function(){tile.textContent=guess[col];tile.className='wordle-tile reveal-'+result[col];tile.style.transition='transform '+FH+'ms ease-out';tile.style.transform='rotateX(0deg)';},FH);},col*ST);})(c);setTimeout(function(){updateKeyboard(guess,result);var won=result.every(function(r){return r==='correct';});var lost=!won&&st.guesses.length>=6;if(won||lost)finishWordle(won);},4*ST+FH*2+50);}
    function updateKeyboard(guess,result){var p={correct:3,present:2,absent:1};for(var i=0;i<5;i++){var l=guess[i];if(!st.keyColors[l]||p[result[i]]>p[st.keyColors[l]])st.keyColors[l]=result[i];}document.querySelectorAll('[data-wi="'+idx+'"]').forEach(function(btn){var s=st.keyColors[btn.dataset.wk];if(!s)return;btn.classList.remove('st-correct','st-present','st-absent');btn.classList.add('st-'+s);});}
    function finishWordle(won){st.done=true;var msgEl=document.getElementById('wm-'+idx),expEl=document.getElementById('exp-'+idx),hintEl=document.getElementById('hint-'+idx);var ms=Date.now()-answerStartRef.get(),data=IQData.recordAnswer(st.category,won,st.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordle');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){var bg=['Ace! 🎯','Brilliant! 🧠','Nailed it! ⚡','Great! 🔥','Nice! 💡','Phew! 😅'];msgEl.className='wordle-msg success';msgEl.textContent=bg[st.guesses.length-1]||'Yes!';st.guesses.length===1?(H.streak&&H.streak()):(H.wordleWin&&H.wordleWin());flashEl.className='flash green show';spawnConfetti(st.guesses.length===1?30:14);setTimeout(function(){flashEl.className='flash';},350);}else{msgEl.className='wordle-msg error';msgEl.textContent='The word was '+st.answer;H.error&&H.error();flashEl.className='flash red show';setTimeout(function(){flashEl.className='flash';},350);}if(expEl){expEl.textContent=won?'Solved in '+st.guesses.length+' guess'+(st.guesses.length===1?'':'es')+'!':'The answer was "'+st.answer+'". Keep going!';setTimeout(function(){expEl.classList.add('show');},200);}setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);updateUI(data);if(won&&data.streak>0&&data.streak%5===0){setTimeout(function(){H.streak&&H.streak();var sn=document.getElementById('streak-num'),sp=document.getElementById('streak-popup');if(sn)sn.textContent=data.streak;if(sp){sp.classList.add('show');spawnConfetti(25);setTimeout(function(){sp.classList.remove('show');},1800);}},600);}checkMore();answerStartRef.set(Date.now());}
  }});
})();

// ── Tic Tac Toe ───────────────────────────────────────────────────────────────
(function(){
  var DIFFS=[0.6,1.0,1.5],LABELS=['Easy','Medium','Hard'];
  Q.register('ticTacToe',function(){var tier=this.rand(0,2);return{type:'ticTacToe',category:'problemSolving',categoryLabel:'Tic Tac Toe',difficulty:DIFFS[tier],question:'Beat the bot! ('+LABELS[tier]+')',answer:'win',options:[],explanation:'',visual:'ticTacToe',botLevel:tier};},3);
  Q.registerRenderer('ticTacToe',{
    render:function(q,idx){var cells='';for(var i=0;i<9;i++)cells+='<button class="ttt-cell" data-ti="'+idx+'" data-tc="'+i+'"></button>';return'<div class="qcard" style="gap:6px"><div class="category">TIC TAC TOE</div><div class="question">'+q.question+'</div><div class="ttt-status" id="ttt-status-'+idx+'">Your turn (X)</div><div class="ttt-grid" id="ttt-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explain" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var IQData=ctx.IQData,flashEl=ctx.flashEl,updateUI=ctx.updateUI,checkMore=ctx.checkMore,spawnConfetti=ctx.spawnConfetti,answerStartRef=ctx.answerStartRef,H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var board=[0,0,0,0,0,0,0,0,0],done=false,botLevel=q.botLevel;var WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];slideEl.addEventListener('click',function(e){var btn=e.target.closest('[data-tc]');if(!btn||+btn.dataset.ti!==idx||done)return;var cell=+btn.dataset.tc;if(board[cell]!==0)return;H.medium&&H.medium();board[cell]=1;renderBoard();var w=checkWin();if(w){finish(w);return;}if(isFull()){finish('draw');return;}setStatus('Bot thinking...');done=true;setTimeout(function(){done=false;var move=botMove();board[move]=2;H.light&&H.light();renderBoard();var w2=checkWin();if(w2){finish(w2);return;}if(isFull()){finish('draw');return;}setStatus('Your turn (X)');},350);});
    function renderBoard(){for(var i=0;i<9;i++){var el=slideEl.querySelector('[data-tc="'+i+'"]');if(!el)continue;if(board[i]===1){el.textContent='X';el.classList.add('ttt-x');el.classList.remove('ttt-o');}else if(board[i]===2){el.textContent='O';el.classList.add('ttt-o');el.classList.remove('ttt-x');}}}
    function setStatus(txt){var el=document.getElementById('ttt-status-'+idx);if(el)el.textContent=txt;}
    function checkWin(){for(var i=0;i<WINS.length;i++){var a=WINS[i][0],b=WINS[i][1],c=WINS[i][2];if(board[a]&&board[a]===board[b]&&board[b]===board[c]){highlightWin(WINS[i]);return board[a]===1?'player':'bot';}}return null;}
    function highlightWin(cells){for(var i=0;i<cells.length;i++){var el=slideEl.querySelector('[data-tc="'+cells[i]+'"]');if(el)el.classList.add('ttt-win');}}
    function isFull(){for(var i=0;i<9;i++)if(board[i]===0)return false;return true;}
    function empties(){var e=[];for(var i=0;i<9;i++)if(board[i]===0)e.push(i);return e;}
    function botMove(){if(botLevel===0)return botEasy();if(botLevel===1)return botMedium();return botHard();}
    function botEasy(){var e=empties();return e[Math.floor(Math.random()*e.length)];}
    function botMedium(){var w=findWinMove(2);if(w!==-1)return w;var b=findWinMove(1);if(b!==-1)return b;if(board[4]===0)return 4;return botEasy();}
    function botHard(){var best=-Infinity,move=-1,e=empties();for(var i=0;i<e.length;i++){board[e[i]]=2;var s=minimax(false,0);board[e[i]]=0;if(s>best){best=s;move=e[i];}}return move;}
    function minimax(isMax,depth){var w=checkWinner();if(w===2)return 10-depth;if(w===1)return depth-10;if(isFull())return 0;var e=empties(),best2=isMax?-Infinity:Infinity;for(var i=0;i<e.length;i++){board[e[i]]=isMax?2:1;var s=minimax(!isMax,depth+1);board[e[i]]=0;best2=isMax?Math.max(best2,s):Math.min(best2,s);}return best2;}
    function checkWinner(){for(var i=0;i<WINS.length;i++){var a=WINS[i][0],b=WINS[i][1],c=WINS[i][2];if(board[a]&&board[a]===board[b]&&board[b]===board[c])return board[a];}return 0;}
    function findWinMove(piece){var e=empties();for(var i=0;i<e.length;i++){board[e[i]]=piece;if(checkWinner()===piece){board[e[i]]=0;return e[i];}board[e[i]]=0;}return -1;}
    function finish(result){done=true;var won=result==='player',draw=result==='draw',ms=Date.now()-answerStartRef.get();if(won){setStatus('You win! 🎉');H.success&&H.success();}else if(draw){setStatus("It's a draw! 🤝");H.toggle&&H.toggle();}else{setStatus('Bot wins! 🤖');H.error&&H.error();}var data=IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('ticTacToe');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){flashEl.className='flash green show';spawnConfetti(16);}else if(!draw){flashEl.className='flash red show';}setTimeout(function(){flashEl.className='flash';},350);var expEl=document.getElementById('exp-'+idx),hintEl=document.getElementById('hint-'+idx);if(expEl){expEl.textContent=won?'Nice strategy!':draw?'A draw is respectable.':'The bot outsmarted you this time.';setTimeout(function(){expEl.classList.add('show');},200);}setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);updateUI(data);if(won&&data.streak>0&&data.streak%5===0){setTimeout(function(){H.streak&&H.streak();var sn=document.getElementById('streak-num'),sp=document.getElementById('streak-popup');if(sn)sn.textContent=data.streak;if(sp){sp.classList.add('show');spawnConfetti(25);setTimeout(function(){sp.classList.remove('show');},1800);}},600);}checkMore();answerStartRef.set(Date.now());}
  }});
})();

// ── Memory Match ──────────────────────────────────────────────────────────────
(function(){
  var EMOJIS=['🐻','🧠','⚡','🔥','🎯','💡','🌟','🎪','🎨','🎮','🏆','💎','🚀','🌈','🎵','🍕'];
  Q.register('memory',function(){var size=Q.rand(0,2),pairs=[3,4,6][size],picks=Q.shuffle(EMOJIS.slice()).slice(0,pairs),cards=Q.shuffle(picks.concat(picks));return{type:'memory',category:'memory',categoryLabel:'Memory Match',difficulty:[0.7,1.1,1.5][size],question:'Find all matching pairs!',cards:cards,pairs:pairs,answer:'complete',options:[],explanation:'Memory training strengthens recall.',visual:'custom'};},3);
  Q.registerRenderer('memory',{
    render:function(q,idx){var cols=q.pairs<=3?3:4,cells='';for(var i=0;i<q.cards.length;i++)cells+='<button class="mem-card" data-mi="'+idx+'" data-mc="'+i+'" data-mv="'+q.cards[i]+'"><span class="mem-front">?</span><span class="mem-back">'+q.cards[i]+'</span></button>';return'<div class="qcard" style="gap:6px"><div class="category">MEMORY MATCH</div><div class="question">'+q.question+'</div><div class="mem-status" id="mem-status-'+idx+'">Tap to flip</div><div class="mem-grid mem-cols-'+cols+'" id="mem-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#mem-grid-'+idx),status=slideEl.querySelector('#mem-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var flipped=[],matched=0,moves=0,locked=false,totalPairs=q.pairs;grid.addEventListener('click',function(e){var btn=e.target.closest('.mem-card');if(!btn||locked||btn.classList.contains('mem-flip')||btn.classList.contains('mem-matched'))return;H.cardFlip&&H.cardFlip();btn.classList.add('mem-flip');flipped.push(btn);if(flipped.length===2){moves++;locked=true;var a=flipped[0],b=flipped[1];if(a.dataset.mv===b.dataset.mv){setTimeout(function(){H.cardMatch&&H.cardMatch();},150);a.classList.add('mem-matched');b.classList.add('mem-matched');matched++;flipped=[];locked=false;if(matched===totalPairs)finish(true);else status.textContent=matched+'/'+totalPairs+' pairs';}else{setTimeout(function(){H.light&&H.light();},300);setTimeout(function(){a.classList.remove('mem-flip');b.classList.remove('mem-flip');flipped=[];locked=false;},600);}}});
    function finish(won){var ms=Date.now()-ctx.answerStartRef.get(),perfect=moves<=totalPairs+1,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('memory');if(ctx.onAnswer)ctx.onAnswer(won,ms);perfect?(H.streak&&H.streak()):(H.success&&H.success());status.textContent='Done in '+moves+' moves!';status.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?25:10);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Perfect memory! 🎯':'Solved in '+moves+' moves';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Simon Says ────────────────────────────────────────────────────────────────
(function(){
  var COLORS=['#e8443a','#3fba4f','#e8a817','#3a7df2'];
  Q.register('simon',function(){return{type:'simon',category:'memory',categoryLabel:'Simon Says',difficulty:1.2,question:'Repeat the pattern!',answer:'complete',options:[],explanation:'Working memory and pattern repetition.',visual:'custom'};},3);
  Q.registerRenderer('simon',{
    render:function(q,idx){var pads='';for(var i=0;i<4;i++)pads+='<button class="simon-pad" data-si="'+idx+'" data-sc="'+i+'" style="background:'+COLORS[i]+'"></button>';return'<div class="qcard" style="gap:6px"><div class="category">SIMON SAYS</div><div class="question">'+q.question+'</div><div class="simon-level" id="simon-level-'+idx+'">Level 1</div><div class="simon-grid" id="simon-grid-'+idx+'">'+pads+'</div><div class="simon-status" id="simon-status-'+idx+'">Watch the pattern...</div><div id="simon-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0"><button id="simon-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#simon-grid-'+idx),status=slideEl.querySelector('#simon-status-'+idx),levelEl=slideEl.querySelector('#simon-level-'+idx),readyWrap=slideEl.querySelector('#simon-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#simon-ready-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var sequence=[],playerSeq=[],level=0,accepting=false,done=false,maxLevel=5;function getPad(i){return grid.querySelector('[data-sc="'+i+'"]');}function flashPad(i,dur){var p=getPad(i);if(!p)return;p.classList.add('simon-lit');setTimeout(function(){p.classList.remove('simon-lit');},dur||400);}function playSequence(){accepting=false;status.textContent='Watch the pattern...';var delay=600;sequence.forEach(function(c,i){setTimeout(function(){H.light&&H.light();flashPad(c,350);},delay+i*600);});setTimeout(function(){accepting=true;status.textContent='Your turn! Repeat it.';playerSeq=[];},delay+sequence.length*600);}readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';ctx.answerStartRef.set(Date.now());nextLevel();});function nextLevel(){level++;levelEl.textContent='Level '+level;sequence.push(Math.floor(Math.random()*4));playSequence();}grid.addEventListener('click',function(e){var btn=e.target.closest('.simon-pad');if(!btn||!accepting||done)return;var ci=parseInt(btn.dataset.sc);H.medium&&H.medium();flashPad(ci,200);playerSeq.push(ci);var pos=playerSeq.length-1;if(playerSeq[pos]!==sequence[pos]){done=true;accepting=false;H.error&&H.error();status.textContent='Wrong! Got to level '+level;finish(false);return;}if(playerSeq.length===sequence.length){if(level>=maxLevel){done=true;accepting=false;H.success&&H.success();status.textContent='You beat it! 🎉';finish(true);}else{status.textContent='Level '+level+' done! ✓';setTimeout(nextLevel,800);}}});
    function finish(won){var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('simon');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){ctx.flashEl.className='flash green show';ctx.spawnConfetti(20);}else ctx.flashEl.className='flash red show';setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Excellent memory! All 5 levels!':'Reached level '+level+'. Keep training!';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Reaction Time ─────────────────────────────────────────────────────────────
(function(){
  Q.register('reaction',function(){return{type:'reaction',category:'mentalAgility',categoryLabel:'Reaction Time',difficulty:1.0,question:'Tap as soon as the circle turns GREEN!',answer:'complete',options:[],explanation:'Tests your reaction speed.',visual:'custom'};},3);
  Q.registerRenderer('reaction',{
    render:function(q,idx){return'<div class="qcard" style="gap:6px"><div class="category">REACTION TIME</div><div class="question">Tap GREEN as fast as you can!</div><div id="react-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:8px 0"><button id="react-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:14px 36px;font-family:Nunito,sans-serif;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div class="react-zone" id="react-zone-'+idx+'" style="display:none"><div class="react-circle" id="react-circle-'+idx+'">Wait...</div></div><div class="react-result" id="react-result-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var readyWrap=slideEl.querySelector('#react-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#react-ready-'+idx),zone=slideEl.querySelector('#react-zone-'+idx),circle=slideEl.querySelector('#react-circle-'+idx),result=slideEl.querySelector('#react-result-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!circle)return;var state='idle',goTime=0,timer=null,done=false;readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';zone.style.display='flex';state='waiting';ctx.answerStartRef.set(Date.now());var delay=1500+Math.random()*2500;timer=setTimeout(function(){if(done)return;state='go';goTime=Date.now();H.nudge&&H.nudge();circle.classList.add('react-go');circle.textContent='TAP!';},delay);});circle.addEventListener('click',function(){if(done||state==='idle')return;if(state==='waiting'){done=true;clearTimeout(timer);H.error&&H.error();circle.classList.add('react-fail');circle.textContent='Too early!';result.textContent='Wait for green next time';result.style.color='var(--red)';finish(false,0);}else if(state==='go'){done=true;var rms=Date.now()-goTime,good=rms<400,great=rms<250;H.reactionTap&&H.reactionTap();circle.classList.remove('react-go');circle.classList.add(good?'react-success':'react-slow');circle.textContent=rms+'ms';result.textContent=great?'Lightning fast! ⚡':good?'Nice reflexes!':'A bit slow, try again!';result.style.color=good?'var(--green)':'var(--gold)';finish(good,rms);}});
    function finish(won,ms){var totalMs=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,totalMs);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('reaction');if(ctx.onAnswer)ctx.onAnswer(won,totalMs);if(won){setTimeout(function(){ms<250?(H.streak&&H.streak()):(H.success&&H.success());},120);ctx.flashEl.className='flash green show';ctx.spawnConfetti(ms<250?20:8);}else ctx.flashEl.className='flash red show';setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=ms>0?'Your reaction: '+ms+'ms. Average is ~250ms.':'Patience is key!';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Word Scramble ─────────────────────────────────────────────────────────────
(function(){
  var WORDS={easy:[{w:'BRAIN',h:'Think with it'},{w:'SMART',h:'Opposite of dumb'},{w:'LIGHT',h:'Turn it on'},{w:'QUICK',h:'Very fast'},{w:'HEART',h:'Beats in your chest'},{w:'DREAM',h:'Happens when you sleep'},{w:'OCEAN',h:'Big body of water'},{w:'HAPPY',h:'Feeling of joy'},{w:'MUSIC',h:'Melody and rhythm'},{w:'DANCE',h:'Move to the beat'},{w:'TIGER',h:'Striped big cat'},{w:'GRAPE',h:'Small purple fruit'},{w:'STORM',h:'Thunder and lightning'},{w:'RIVER',h:'Flowing water'},{w:'CANDY',h:'Sweet treat'}],medium:[{w:'PUZZLE',h:'Brain teaser'},{w:'GENIUS',h:'Very smart person'},{w:'ROCKET',h:'Goes to space'},{w:'FROZEN',h:'Turned to ice'},{w:'MYSTIC',h:'Mysterious'},{w:'BRIDGE',h:'Crosses a gap'},{w:'JUNGLE',h:'Dense forest'},{w:'GALAXY',h:'Stars and planets'},{w:'TROPHY',h:'Winner gets one'},{w:'ZOMBIE',h:'Undead creature'},{w:'KNIGHT',h:'Medieval warrior'},{w:'WHISPER',h:'Speak very softly'}],hard:[{w:'QUANTUM',h:'Physics of the very small'},{w:'PARADOX',h:'Contradicts itself'},{w:'PHOENIX',h:'Rises from ashes'},{w:'ECLIPSE',h:'Sun or moon blocked'},{w:'ALCHEMY',h:'Medieval chemistry'},{w:'TSUNAMI',h:'Giant ocean wave'},{w:'CRYPTIC',h:'Hard to understand'},{w:'LABYRINTH',h:'Complex maze'},{w:'SYMPHONY',h:'Orchestral composition'}]};
  Q.register('wordScramble',function(){var tier=['easy','medium','hard'][Q.rand(0,2)],item=Q.pick(WORDS[tier]),word=item.w,sc;do{sc=Q.shuffle(word.split('')).join('');}while(sc===word);return{type:'wordScramble',category:'verbalReasoning',categoryLabel:'Word Scramble',difficulty:{easy:0.7,medium:1.1,hard:1.5}[tier],question:'Unscramble the word!',scrambled:sc,word:word,hint:item.h,answer:word,options:[],explanation:'Hint: '+item.h,visual:'custom'};},3);
  Q.registerRenderer('wordScramble',{
    render:function(q,idx){var srct='',anst='';for(var i=0;i<q.scrambled.length;i++)srct+='<button class="ws-tile ws-src" data-wi="'+idx+'" data-wc="'+i+'" data-wl="'+q.scrambled[i]+'">'+q.scrambled[i]+'</button>';for(var j=0;j<q.word.length;j++)anst+='<div class="ws-tile ws-slot" data-wi="'+idx+'" data-ws="'+j+'"></div>';return'<div class="qcard" style="gap:6px"><div class="category">WORD SCRAMBLE</div><div class="question">'+q.question+'</div><div class="ws-hint" id="ws-hint-'+idx+'">💡 '+q.hint+'</div><div class="ws-answer" id="ws-answer-'+idx+'">'+anst+'</div><div class="ws-source" id="ws-source-'+idx+'">'+srct+'</div><div class="ws-status" id="ws-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var sourceEl=slideEl.querySelector('#ws-source-'+idx),answerEl=slideEl.querySelector('#ws-answer-'+idx),statusEl=slideEl.querySelector('#ws-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!sourceEl)return;var placed=[],done=false,slots=answerEl.querySelectorAll('.ws-slot');sourceEl.addEventListener('click',function(e){var btn=e.target.closest('.ws-src');if(!btn||done||btn.classList.contains('ws-used'))return;H.tilePop&&H.tilePop();btn.classList.add('ws-used');var letter=btn.dataset.wl;placed.push({letter:letter,btn:btn});slots[placed.length-1].textContent=letter;slots[placed.length-1].classList.add('ws-filled');if(placed.length===q.word.length){var attempt=placed.map(function(p){return p.letter;}).join('');if(attempt===q.word){finish(true);}else{H.wordleWrong&&H.wordleWrong();answerEl.classList.add('ws-shake');statusEl.textContent='Not quite! Try again.';statusEl.style.color='var(--red)';setTimeout(function(){answerEl.classList.remove('ws-shake');placed.forEach(function(p){p.btn.classList.remove('ws-used');});slots.forEach(function(s){s.textContent='';s.classList.remove('ws-filled');});placed=[];statusEl.textContent='';},700);}}});answerEl.addEventListener('click',function(e){var slot=e.target.closest('.ws-slot');if(!slot||done||!slot.classList.contains('ws-filled'))return;H.light&&H.light();var si=Array.from(slots).indexOf(slot);while(placed.length>si){var p=placed.pop();p.btn.classList.remove('ws-used');slots[placed.length].textContent='';slots[placed.length].classList.remove('ws-filled');}});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordScramble');if(ctx.onAnswer)ctx.onAnswer(won,ms);H.success&&H.success();slots.forEach(function(s){s.classList.add('ws-correct');});statusEl.textContent='Nice! 🎉';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=q.word+' — '+q.hint;expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Slide Puzzle ──────────────────────────────────────────────────────────────
(function(){
  Q.register('slidePuzzle',function(){var goal=[1,2,3,4,5,6,7,8,0],board;do{board=Q.shuffle(goal.slice());}while(!isSolvable(board)||boardEq(board,goal));function isSolvable(b){var inv=0;for(var i=0;i<9;i++)for(var j=i+1;j<9;j++)if(b[i]&&b[j]&&b[i]>b[j])inv++;return inv%2===0;}function boardEq(a,b){for(var i=0;i<9;i++)if(a[i]!==b[i])return false;return true;}return{type:'slidePuzzle',category:'problemSolving',categoryLabel:'Slide Puzzle',difficulty:1.3,question:'Slide tiles to order 1-8!',board:board,answer:'complete',options:[],explanation:'Spatial reasoning & planning.',visual:'custom'};},3);
  Q.registerRenderer('slidePuzzle',{
    render:function(q,idx){var cells='';for(var i=0;i<9;i++){var v=q.board[i];cells+='<button class="slide-cell'+(v===0?' slide-empty':'')+'" data-si="'+idx+'" data-sc="'+i+'">'+(v||'')+'</button>';}return'<div class="qcard" style="gap:6px"><div class="category">SLIDE PUZZLE</div><div class="question">'+q.question+'</div><div class="slide-moves" id="slide-moves-'+idx+'">Moves: 0</div><div class="slide-grid" id="slide-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#slide-grid-'+idx),movesEl=slideEl.querySelector('#slide-moves-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var board=q.board.slice(),moves=0,done=false,goal=[1,2,3,4,5,6,7,8,0];grid.addEventListener('click',function(e){var btn=e.target.closest('.slide-cell');if(!btn||done)return;var ci=parseInt(btn.dataset.sc),blank=board.indexOf(0),canMove=false;if(ci===blank-1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank+1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank-3||ci===blank+3)canMove=true;if(!canMove){H.light&&H.light();return;}H.medium&&H.medium();board[blank]=board[ci];board[ci]=0;moves++;movesEl.textContent='Moves: '+moves;var cells=grid.querySelectorAll('.slide-cell');for(var i=0;i<9;i++){cells[i].textContent=board[i]||'';cells[i].className='slide-cell'+(board[i]===0?' slide-empty':'');cells[i].dataset.sc=i;}var won=true;for(var j=0;j<9;j++)if(board[j]!==goal[j]){won=false;break;}if(won)finish();});
    function finish(){done=true;var ms=Date.now()-ctx.answerStartRef.get(),optimal=moves<=25,data=ctx.IQData.recordAnswer(q.category,true,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('slidePuzzle');if(ctx.onAnswer)ctx.onAnswer(true,ms);optimal?(H.streak&&H.streak()):(H.success&&H.success());movesEl.textContent='Solved in '+moves+' moves!';movesEl.style.color='var(--green)';grid.querySelectorAll('.slide-cell').forEach(function(c){if(c.textContent)c.classList.add('slide-win');});ctx.flashEl.className='flash green show';ctx.spawnConfetti(optimal?25:12);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=optimal?'Efficient solver! 🧠':'Solved in '+moves+' moves. Optimal is ~22.';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Color Sort ────────────────────────────────────────────────────────────────
(function(){
  var PALETTES=[{name:'Rainbow',colors:['#FF0000','#FF7700','#FFDD00','#00CC44','#0066FF','#8833FF'],labels:['Red','Orange','Yellow','Green','Blue','Purple']},{name:'Warm→Cool',colors:['#FF2200','#FF6600','#FFAA00','#44BBFF','#2266FF','#1133AA'],labels:['Hot Red','Orange','Warm','Sky','Blue','Deep Blue']},{name:'Light→Dark',colors:['#FFFFFF','#CCCCCC','#999999','#666666','#333333','#111111'],labels:['White','Light','Silver','Gray','Dark','Black']}];
  Q.register('colorSort',function(){var size=Q.rand(0,1),pal=Q.pick(PALETTES),count=size===0?4:6,correct=pal.colors.slice(0,count),labels=pal.labels.slice(0,count),scrambled=Q.shuffle(correct.map(function(c,i){return{color:c,label:labels[i],idx:i};}));return{type:'colorSort',category:'patternRecognition',categoryLabel:'Color Sort',difficulty:size===0?0.7:1.1,question:'Sort '+pal.name+' in order!',scrambled:scrambled,correctOrder:correct,answer:'complete',options:[],explanation:'Visual pattern recognition.',visual:'custom'};},3);
  Q.registerRenderer('colorSort',{
    render:function(q,idx){var tiles='';for(var i=0;i<q.scrambled.length;i++){var s=q.scrambled[i],light=['#FFFFFF','#CCCCCC','#FFDD00','#FFAA00','#44BBFF','#FF7700'],tc=light.indexOf(s.color)!==-1?'#333':'#fff',bs=s.color==='#FFFFFF'?'border:2px solid #999;':'';tiles+='<button class="csort-tile" data-orig-idx="'+s.idx+'" style="background:'+s.color+';color:'+tc+';'+bs+'">'+s.label+'</button>';}return'<div class="qcard" style="gap:6px"><div class="category">COLOR SORT</div><div class="question">'+q.question+'</div><div class="csort-status" id="csort-status-'+idx+'">Tap colors in order (1st → last)</div><div class="csort-placed" id="csort-placed-'+idx+'"></div><div class="csort-pool" id="csort-pool-'+idx+'">'+tiles+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var pool=slideEl.querySelector('#csort-pool-'+idx),placed=slideEl.querySelector('#csort-placed-'+idx),statusEl=slideEl.querySelector('#csort-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!pool)return;var placedOrder=[],done=false;pool.addEventListener('click',function(e){var btn=e.target.closest('.csort-tile');if(!btn||done||btn.classList.contains('csort-used'))return;H.medium&&H.medium();btn.classList.add('csort-used');var oi=parseInt(btn.dataset.origIdx);placedOrder.push(oi);var div=document.createElement('div');div.className='csort-placed-tile';div.style.background=btn.style.background;if(btn.style.background==='rgb(255, 255, 255)')div.style.border='2px solid #999';placed.appendChild(div);statusEl.textContent=placedOrder.length+'/'+q.correctOrder.length+' placed';if(placedOrder.length===q.correctOrder.length){var won=true;for(var k=0;k<placedOrder.length;k++)if(placedOrder[k]!==k){won=false;break;}finish(won);}});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.success&&H.success();statusEl.textContent='Perfect!';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}else{H.error&&H.error();statusEl.textContent='Wrong order!';statusEl.style.color='var(--red)';ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){var sl=q.scrambled.slice().sort(function(a,b){return a.idx-b.idx;}).map(function(s){return s.label;});expEl.textContent=won?'Colors sorted correctly!':'Correct: '+sl.join(' → ');expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Math Rush ─────────────────────────────────────────────────────────────────
(function(){
  Q.register('mathRush',function(){var eqs=[];for(var i=0;i<5;i++){var a=Q.rand(2,20),b=Q.rand(2,20),op=['+','-','×'][Q.rand(0,2)],real;if(op==='+')real=a+b;else if(op==='-'){if(a<b){var t=a;a=b;b=t;}real=a-b;}else real=a*b;var isTrue=Math.random()>0.4,shown=isTrue?real:real+(Q.rand(0,1)?Q.rand(1,5):-Q.rand(1,5));if(shown===real)isTrue=true;eqs.push({text:a+' '+op+' '+b+' = '+shown,correct:isTrue});}return{type:'mathRush',category:'mentalAgility',categoryLabel:'Math Rush',difficulty:1.0,question:'True or False? (5 rounds, 5s each!)',equations:eqs,answer:'complete',options:[],explanation:'Speed + accuracy = brain power.',visual:'custom'};},3);
  Q.registerRenderer('mathRush',{
    render:function(q,idx){return'<div class="qcard" style="gap:6px"><div class="category">MATH RUSH</div><div class="question">True or False?</div><div class="mr-timer" id="mr-timer-'+idx+'"></div><div class="mr-eq" id="mr-eq-'+idx+'">Get ready...</div><div class="mr-btns" id="mr-btns-'+idx+'" style="display:none"><button class="mr-btn mr-true" data-rv="true">✓ True</button><button class="mr-btn mr-false" data-rv="false">✗ False</button></div><div id="mr-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0"><button id="mr-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div class="mr-score" id="mr-score-'+idx+'"></div><div class="mr-progress" id="mr-progress-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var eqEl=slideEl.querySelector('#mr-eq-'+idx),scoreEl=slideEl.querySelector('#mr-score-'+idx),timerEl=slideEl.querySelector('#mr-timer-'+idx),btnsEl=slideEl.querySelector('#mr-btns-'+idx),progressEl=slideEl.querySelector('#mr-progress-'+idx),readyWrap=slideEl.querySelector('#mr-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#mr-ready-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!eqEl)return;var round=0,score=0,done=false,roundTimer=null;readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';btnsEl.style.display='flex';ctx.answerStartRef.set(Date.now());showRound();});function showRound(){if(round>=q.equations.length){finish();return;}eqEl.textContent=q.equations[round].text;eqEl.className='mr-eq';var dots='';for(var i=0;i<q.equations.length;i++)dots+='<span class="mr-dot'+(i<round?' mr-dot-done':i===round?' mr-dot-active':'')+'"></span>';progressEl.innerHTML=dots;var timeLeft=5.0;timerEl.textContent='5.0s';timerEl.style.color='var(--cream)';clearInterval(roundTimer);roundTimer=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){clearInterval(roundTimer);H.warning&&H.warning();eqEl.classList.add('mr-wrong');round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);}else{timerEl.textContent=timeLeft.toFixed(1)+'s';if(timeLeft<=2)timerEl.style.color='var(--red)';}},100);}btnsEl.addEventListener('click',function(e){var btn=e.target.closest('.mr-btn');if(!btn||done)return;clearInterval(roundTimer);var ans=btn.dataset.rv==='true',correct=q.equations[round].correct===ans;if(correct){H.medium&&H.medium();score++;eqEl.classList.add('mr-correct');}else{H.error&&H.error();eqEl.classList.add('mr-wrong');}round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);});
    function finish(){done=true;clearInterval(roundTimer);var ms=Date.now()-ctx.answerStartRef.get(),won=score>=3,perfect=score===q.equations.length,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('mathRush');if(ctx.onAnswer)ctx.onAnswer(won,ms);eqEl.textContent=score+'/'+q.equations.length+(perfect?' Perfect!':won?' Nice!':' Try harder!');eqEl.className='mr-eq '+(won?'mr-correct':'mr-wrong');timerEl.textContent='';btnsEl.style.display='none';if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?22:10);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Flawless! 🔥':score+' correct. Speed and accuracy!';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Odd Tile Out ──────────────────────────────────────────────────────────────
(function(){
  var GOOD_HUES=[0,15,30,45,60,90,120,150,170,280,300,320,340];
  function hslToStr(h,s,l){return'hsl('+h+','+s+'%,'+l+'%)';}
  var LEVELS=[{g:3,hd:45,ld:0,d:0.5},{g:3,hd:30,ld:0,d:0.7},{g:4,hd:22,ld:0,d:0.9},{g:4,hd:15,ld:0,d:1.1},{g:4,hd:0,ld:16,d:1.2},{g:5,hd:12,ld:0,d:1.3},{g:5,hd:0,ld:12,d:1.4},{g:5,hd:8,ld:0,d:1.6},{g:5,hd:0,ld:8,d:1.7},{g:6,hd:6,ld:0,d:1.9}];
  Q.register('oddTileOut',function(){var lv=LEVELS[Q.rand(0,LEVELS.length-1)],g=lv.g,total=g*g,baseH=GOOD_HUES[Q.rand(0,GOOD_HUES.length-1)],baseS=Q.rand(80,95),baseL=Q.rand(45,60),oddH=(baseH+(lv.hd||0)+360)%360,oddL=baseL+(lv.ld||0),oddIdx=Q.rand(0,total-1),tiles=[];for(var i=0;i<total;i++)tiles.push(i===oddIdx?hslToStr(oddH,baseS,oddL):hslToStr(baseH,baseS,baseL));return{type:'oddTileOut',category:'patternRecognition',categoryLabel:'Odd Tile Out',difficulty:lv.d,question:'Find the different tile!',tiles:tiles,oddIdx:oddIdx,gridSize:g,answer:'complete',options:[],explanation:'Color perception & visual attention.',visual:'custom'};},3);
  Q.registerRenderer('oddTileOut',{
    render:function(q,idx){return'<div class="qcard" style="gap:6px"><div class="category">ODD TILE OUT</div><div class="question">'+q.question+'</div><div class="oto-rounds" id="oto-rounds-'+idx+'"><span class="oto-dot oto-dot-active"></span><span class="oto-dot"></span><span class="oto-dot"></span></div><div id="oto-grid-wrap-'+idx+'"></div><div class="oto-status" id="oto-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var wrap=slideEl.querySelector('#oto-grid-wrap-'+idx),statusEl=slideEl.querySelector('#oto-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!wrap)return;var TOTAL_ROUNDS=3,round=0,score=0,done=false;function hsl2(h,s,l){return'hsl('+h+','+s+'%,'+l+'%)';}function makePuzzle(){var lv=LEVELS[Math.floor(Math.random()*LEVELS.length)],g=lv.g,total=g*g;var baseH=GOOD_HUES[Math.floor(Math.random()*GOOD_HUES.length)],baseS=Math.floor(Math.random()*16)+80,baseL=Math.floor(Math.random()*16)+45;var oddH=(baseH+(lv.hd||0)+360)%360,oddL=baseL+(lv.ld||0);var oddIdx=Math.floor(Math.random()*total),tiles=[];for(var i=0;i<total;i++)tiles.push(i===oddIdx?hsl2(oddH,baseS,oddL):hsl2(baseH,baseS,baseL));return{g:g,tiles:tiles,oddIdx:oddIdx};}function updateDots(){var dots=slideEl.querySelectorAll('.oto-dot');dots.forEach(function(d,i){d.className='oto-dot'+(i<round?' oto-dot-done':i===round?' oto-dot-active':'');});}function showRound(){var p=makePuzzle(),size='clamp('+Math.floor(240/p.g)+'px,'+Math.floor(56/p.g)+'vw,'+Math.floor(290/p.g)+'px)',cells='';for(var i=0;i<p.tiles.length;i++)cells+='<button class="oto-tile" data-oi="'+idx+'" data-oc="'+i+'" data-odd="'+p.oddIdx+'" style="background:'+p.tiles[i]+';width:'+size+';height:'+size+'"></button>';wrap.innerHTML='<div class="oto-grid" style="grid-template-columns:repeat('+p.g+',1fr)">'+cells+'</div>';statusEl.textContent='';statusEl.style.color='';updateDots();wrap.querySelector('.oto-grid').addEventListener('click',function(e){var btn=e.target.closest('.oto-tile');if(!btn||done)return;var tapped=parseInt(btn.dataset.oc),oddI=parseInt(btn.dataset.odd),won=tapped===oddI;var tiles2=wrap.querySelectorAll('.oto-tile');tiles2[oddI].classList.add('oto-correct');if(!won){H.error&&H.error();btn.classList.add('oto-wrong');}else{H.medium&&H.medium();score++;}statusEl.textContent=won?'✓ Got it!':'✗ Missed';statusEl.style.color=won?'var(--green)':'var(--red)';round++;if(round>=TOTAL_ROUNDS)setTimeout(finish,600);else setTimeout(showRound,700);},{once:true});}function finish(){done=true;var won=score>=2,perfect=score===TOTAL_ROUNDS,ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?20:10);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);statusEl.textContent=perfect?'Perfect! 3/3 🎯':won?score+'/3 — Nice!':score+'/3 — Keep training!';statusEl.style.color=won?'var(--green)':'var(--red)';var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Flawless color vision!':'Spotted '+score+' of 3 odd tiles.';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}showRound();}
  });
})();

// ── Stop the Clock ────────────────────────────────────────────────────────────
(function(){
  Q.register('stopClock',function(){var useZone=Q.rand(0,1)===1,targetAngle=useZone?Q.rand(0,359):[0,90,180,270][Q.rand(0,3)],zoneSize=useZone?[35,28,22,18][Q.rand(0,3)]:null,speed=[1.2,1.6,2.0,2.4][Q.rand(0,3)],d=useZone?(zoneSize<=22?1.5:zoneSize<=28?1.2:0.9):0.6;return{type:'stopClock',category:'mentalAgility',categoryLabel:'Stop the Clock',difficulty:d,question:useZone?'Tap to stop the needle in the red zone!':"Tap to stop the needle at 12 o'clock!",targetAngle:targetAngle,zoneSize:zoneSize,speed:speed,useZone:useZone,answer:'complete',options:[],explanation:'Timing and precision.',visual:'custom'};},3);
  Q.registerRenderer('stopClock',{
    render:function(q,idx){return'<div class="qcard" style="gap:6px"><div class="category">STOP THE CLOCK</div><div class="question">'+q.question+'</div><div id="stc-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:4px 0"><button id="stc-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><canvas id="stc-canvas-'+idx+'" width="220" height="220" style="display:none;border-radius:50%;cursor:pointer;touch-action:manipulation"></canvas><div class="stc-result" id="stc-result-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var readyWrap=slideEl.querySelector('#stc-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#stc-ready-'+idx),canvas=slideEl.querySelector('#stc-canvas-'+idx),resultEl=slideEl.querySelector('#stc-result-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!canvas)return;var cx2=canvas.getContext('2d'),angle=0,raf=null,done=false,running=false;var degreesPerMs=360/(q.speed*1000),lastTs=null;var targetAngle=q.targetAngle!=null?q.targetAngle:0;var zoneSize=q.zoneSize||30;var zoneStart=(targetAngle-zoneSize/2+360)%360,zoneEnd=(targetAngle+zoneSize/2)%360;function drawClock(a){var W=220,R=100,cx=W/2,cy=W/2;cx2.clearRect(0,0,W,W);cx2.beginPath();cx2.arc(cx,cy,R,0,Math.PI*2);cx2.fillStyle='rgba(240,234,214,0.08)';cx2.fill();cx2.strokeStyle='rgba(240,234,214,0.2)';cx2.lineWidth=2;cx2.stroke();if(q.useZone){var s2=(zoneStart-90)*Math.PI/180,e2=(zoneEnd-90)*Math.PI/180;if(zoneEnd<zoneStart)e2+=Math.PI*2;cx2.beginPath();cx2.moveTo(cx,cy);cx2.arc(cx,cy,R,s2,e2);cx2.closePath();cx2.fillStyle='rgba(232,68,58,0.38)';cx2.fill();cx2.strokeStyle='rgba(232,68,58,0.8)';cx2.lineWidth=1.5;cx2.stroke();}else{var ta=(targetAngle-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cx+Math.cos(ta)*82,cy+Math.sin(ta)*82);cx2.lineTo(cx+Math.cos(ta)*100,cy+Math.sin(ta)*100);cx2.strokeStyle='#22c55e';cx2.lineWidth=3.5;cx2.stroke();}for(var i=0;i<12;i++){var ta2=(i*30-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cx+Math.cos(ta2)*88,cy+Math.sin(ta2)*88);cx2.lineTo(cx+Math.cos(ta2)*98,cy+Math.sin(ta2)*98);cx2.strokeStyle='rgba(240,234,214,0.3)';cx2.lineWidth=1.5;cx2.stroke();}var ra=(a-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cx,cy);cx2.lineTo(cx+Math.cos(ra)*80,cy+Math.sin(ra)*80);cx2.strokeStyle='#F0EAD6';cx2.lineWidth=3;cx2.lineCap='round';cx2.stroke();cx2.beginPath();cx2.arc(cx,cy,5,0,Math.PI*2);cx2.fillStyle='#f59e0b';cx2.fill();}
    function loop(ts){if(!running||done)return;if(lastTs!==null){var delta=ts-lastTs;angle=(angle+degreesPerMs*delta)%360;}lastTs=ts;drawClock(angle);raf=requestAnimationFrame(loop);}
    readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';canvas.style.display='block';running=true;lastTs=null;ctx.answerStartRef.set(Date.now());raf=requestAnimationFrame(loop);});
    canvas.addEventListener('click',function(){if(!running||done)return;done=true;running=false;cancelAnimationFrame(raf);drawClock(angle);var diff=Math.abs(angle-targetAngle);if(diff>180)diff=360-diff;var won,msg;if(q.useZone){var inZone=zoneEnd>zoneStart?(angle>=zoneStart&&angle<=zoneEnd):(angle>=zoneStart||angle<=zoneEnd);won=inZone;msg=won?'In the zone! ✅':'Missed by '+(diff.toFixed(0))+'°';}else{won=diff<=18;msg=won?'Nailed it! ✅':'Off by '+(diff.toFixed(0))+'°';}var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.success&&H.success();ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);resultEl.textContent=msg;resultEl.style.color=won?'var(--green)':'var(--red)';var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Perfect timing!':'Off by '+diff.toFixed(0)+'°. Try again!';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());});}
  });
})();

// ── Mini 2048 ─────────────────────────────────────────────────────────────────
(function(){
  Q.register('mini2048',function(){return{type:'mini2048',category:'problemSolving',categoryLabel:'Mini 2048',difficulty:1.3,question:'Merge tiles to reach 64!',answer:'complete',options:[],explanation:'Combine same numbers by swiping.',visual:'custom'};},3);
  Q.registerRenderer('mini2048',{
    render:function(q,idx){var cells='';for(var i=0;i<16;i++)cells+='<div class="m48-cell" id="m48-'+idx+'-'+i+'"></div>';return'<div class="qcard" style="gap:6px"><div class="category">MINI 2048</div><div class="question">'+q.question+'</div><div class="m48-scores"><div class="m48-sbox"><div class="m48-sl">Score</div><div class="m48-sv" id="m48-score-'+idx+'">0</div></div><div class="m48-sbox"><div class="m48-sl">Target</div><div class="m48-sv">64</div></div></div><div class="m48-wrap" id="m48-board-'+idx+'">'+cells+'</div><div class="m48-msg" id="m48-msg-'+idx+'">Swipe or drag to merge!</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var board=new Array(16).fill(0),score=0,done=false,msgEl=document.getElementById('m48-msg-'+idx),scoreEl=document.getElementById('m48-score-'+idx);
    function render(){for(var i=0;i<16;i++){var cell=document.getElementById('m48-'+idx+'-'+i);if(!cell)continue;var prev=cell.getAttribute('data-v');cell.textContent=board[i]||'';cell.setAttribute('data-v',board[i]||'');if(board[i]&&String(board[i])!==prev){cell.classList.remove('m48-pop');void cell.offsetWidth;cell.classList.add('m48-pop');}}scoreEl.textContent=score;}
    function addRandom(){var empty=[];for(var i=0;i<16;i++)if(!board[i])empty.push(i);if(!empty.length)return;board[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<0.85?2:4;}
    function getRow(r){return[board[r*4],board[r*4+1],board[r*4+2],board[r*4+3]];}function getCol(c){return[board[c],board[c+4],board[c+8],board[c+12]];}function setRow(r,arr){for(var i=0;i<4;i++)board[r*4+i]=arr[i];}function setCol(c,arr){for(var i=0;i<4;i++)board[c+i*4]=arr[i];}
    function slideArr(arr){var filtered=arr.filter(function(x){return x!==0;}),merged=[],skip=false,gained=0;for(var i=0;i<filtered.length;i++){if(skip){skip=false;continue;}if(i<filtered.length-1&&filtered[i]===filtered[i+1]){merged.push(filtered[i]*2);gained+=filtered[i]*2;skip=true;}else merged.push(filtered[i]);}while(merged.length<4)merged.push(0);return{arr:merged,gained:gained};}
    function arrEq(a,b){for(var i=0;i<4;i++)if(a[i]!==b[i])return false;return true;}
    function move(dir){if(done)return;var moved=false;if(dir==='left'||dir==='right'){for(var r=0;r<4;r++){var row=getRow(r);if(dir==='right')row.reverse();var res=slideArr(row),newRow=res.arr;if(dir==='right')newRow.reverse();if(!arrEq(getRow(r),newRow))moved=true;setRow(r,newRow);score+=res.gained;}}else{for(var c=0;c<4;c++){var col=getCol(c);if(dir==='down')col.reverse();var res2=slideArr(col),newCol=res2.arr;if(dir==='down')newCol.reverse();if(!arrEq(getCol(c),newCol))moved=true;setCol(c,newCol);score+=res2.gained;}}if(moved){H.light&&H.light();addRandom();render();checkWin();}}
    function checkWin(){var won=board.some(function(v){return v>=64;});if(won){finish(true);return;}for(var i=0;i<16;i++){if(!board[i])return;if(i%4!==3&&board[i]===board[i+1])return;if(i<12&&board[i]===board[i+4])return;}finish(false);}
    function finish(won){if(done)return;done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('mini2048');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){msgEl.textContent='🎉 You hit 64!';msgEl.style.color='var(--green)';H.streak&&H.streak();ctx.flashEl.className='flash green show';ctx.spawnConfetti(20);}else{msgEl.textContent='No moves left! Score: '+score;msgEl.style.color='var(--red)';H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Merge tiles: same numbers combine!':'Plan ahead — keep large tiles in a corner.';expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    var boardEl=document.getElementById('m48-board-'+idx);
    var tx=0,ty=0,tActive=false;
    boardEl.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY;tActive=true;},{passive:true});
    boardEl.addEventListener('touchmove',function(e){if(!tActive)return;e.preventDefault();},{passive:false});
    boardEl.addEventListener('touchend',function(e){if(!tActive)return;tActive=false;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');},{passive:true});
    var mx=0,my=0,mActive=false;
    boardEl.addEventListener('mousedown',function(e){mx=e.clientX;my=e.clientY;mActive=true;e.preventDefault();});
    document.addEventListener('mouseup',function(e){if(!mActive)return;mActive=false;var dx=e.clientX-mx,dy=e.clientY-my;if(Math.abs(dx)<15&&Math.abs(dy)<15)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'right':'left');else move(dy>0?'down':'up');});
    document.addEventListener('keydown',function(e){if(done)return;var vi=Math.round(ctx.feed.scrollTop/(ctx.feed.clientHeight||1));if(ctx.feed.children[vi]!==slideEl)return;var map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(map[e.key]){e.preventDefault();move(map[e.key]);}});
    addRandom();addRandom();render();ctx.answerStartRef.set(Date.now());}
  });
})();

// ── Water Sort ────────────────────────────────────────────────────────────────
(function(){
  var PALETTE=['#e8443a','#00BCD4','#3fba4f','#e8a817','#6d4aed','#e87d1a','#e8557a','#00897B'];
  function makePuzzle(numColors,tubeCount){var layers=[];for(var c=0;c<numColors;c++)for(var l=0;l<4;l++)layers.push(c);for(var i=layers.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=layers[i];layers[i]=layers[j];layers[j]=tmp;}var tubes=[];for(var t=0;t<numColors;t++)tubes.push(layers.slice(t*4,t*4+4));for(var e=0;e<tubeCount-numColors;e++)tubes.push([]);return tubes;}
  Q.register('waterSort',function(){var lvl=Q.rand(0,1),numColors=lvl===0?4:5,tubeCount=numColors+2,tubes=makePuzzle(numColors,tubeCount);return{type:'waterSort',category:'problemSolving',categoryLabel:'Water Sort',difficulty:lvl===0?1.1:1.5,question:'Sort the colors — one color per tube!',tubes:tubes,numColors:numColors,answer:'complete',options:[],explanation:'Pour the top color into a matching or empty tube.',visual:'custom'};},3);
  Q.registerRenderer('waterSort',{
    render:function(q,idx){return'<div class="qcard" style="gap:6px"><div class="category">WATER SORT</div><div class="question">'+q.question+'</div><div class="ws2-wrap" id="ws2-tubes-'+idx+'"></div><div class="ws2-status" id="ws2-status-'+idx+'">Tap a tube to select, tap again to pour</div><div class="ws2-pours" id="ws2-pours-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var tubesEl=document.getElementById('ws2-tubes-'+idx),statusEl=document.getElementById('ws2-status-'+idx),poursEl=document.getElementById('ws2-pours-'+idx);if(!tubesEl)return;var tubes=q.tubes.map(function(t){return t.slice();}),selected=-1,pours=0,done=false;
    function canPour(from,to){if(from===to)return false;if(!tubes[from].length)return false;if(tubes[to].length>=4)return false;var topFrom=tubes[from][tubes[from].length-1];if(!tubes[to].length)return true;return topFrom===tubes[to][tubes[to].length-1];}
    function pour(from,to){var color=tubes[from][tubes[from].length-1];while(tubes[from].length&&tubes[from][tubes[from].length-1]===color&&tubes[to].length<4){tubes[to].push(tubes[from].pop());pours++;}}
    function isSolved(){for(var t=0;t<tubes.length;t++){if(!tubes[t].length)continue;if(tubes[t].length!==4)return false;for(var l=1;l<4;l++)if(tubes[t][l]!==tubes[t][0])return false;}return true;}
    function renderTubes(){tubesEl.innerHTML='';tubes.forEach(function(tube,ti){var outer=document.createElement('div');outer.className='ws2-tube-outer';outer.dataset.ti=ti;var cap=document.createElement('div');cap.className='ws2-cap';var tubeDiv=document.createElement('div');tubeDiv.className='ws2-tube'+(ti===selected?' ws2-sel':'');for(var e=0;e<4-tube.length;e++){var layer=document.createElement('div');layer.className='ws2-layer ws2-empty';tubeDiv.appendChild(layer);}for(var l=tube.length-1;l>=0;l--){var layer2=document.createElement('div');layer2.className='ws2-layer';layer2.style.background=PALETTE[tube[l]];tubeDiv.appendChild(layer2);}if(tube.length===4&&tube.every(function(c){return c===tube[0];}))tubeDiv.classList.add('ws2-done');outer.appendChild(cap);outer.appendChild(tubeDiv);tubesEl.appendChild(outer);});poursEl.textContent=pours>0?pours+' pours':'';}
    tubesEl.addEventListener('click',function(e){if(done)return;var outer=e.target.closest('.ws2-tube-outer');if(!outer)return;var ti=parseInt(outer.dataset.ti);H.light&&H.light();if(selected===-1){if(!tubes[ti].length)return;selected=ti;statusEl.textContent='Now tap where to pour';}else{if(ti===selected){selected=-1;statusEl.textContent='Tap a tube to select';}else if(canPour(selected,ti)){H.medium&&H.medium();pour(selected,ti);selected=-1;statusEl.textContent='Tap a tube to select';if(isSolved()){finish(true);return;}else{renderTubes();return;}}else{H.error&&H.error();statusEl.textContent="Can't pour there!";setTimeout(function(){statusEl.textContent='Tap a tube to select';selected=-1;renderTubes();},600);return;}}renderTubes();});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('waterSort');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){statusEl.textContent='🎉 Sorted! '+pours+' pours';statusEl.style.color='var(--green)';H.streak&&H.streak();ctx.flashEl.className='flash green show';ctx.spawnConfetti(18);}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Completed in '+pours+' pours!':'Pour same-colored liquids together.';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());renderTubes();}
    renderTubes();ctx.answerStartRef.set(Date.now());}
  });
})();

// ── Pipe Connect ──────────────────────────────────────────────────────────────
(function(){
  function rot(t,n){var r=t;for(var i=0;i<(n||0);i++){var N=(r&1)?1:0,S=(r&2)?1:0,E=(r&4)?1:0,W=(r&8)?1:0;r=(N?4:0)|(E?2:0)|(S?8:0)|(W?1:0);}return r;}
  function arms(t){var a=[];if(t&1)a.push('N');if(t&2)a.push('S');if(t&4)a.push('E');if(t&8)a.push('W');return a;}
  function connected(cells,size,src){var vis=new Set([src]),q=[src];while(q.length){var c=q.shift(),ct=rot(cells[c].t,cells[c].r),row=Math.floor(c/size),col=c%size;var nb={N:{i:c-size,op:'S',ok:row>0},S:{i:c+size,op:'N',ok:row<size-1},E:{i:c+1,op:'W',ok:col<size-1},W:{i:c-1,op:'E',ok:col>0}};arms(ct).forEach(function(a){var d=nb[a];if(!d||!d.ok||vis.has(d.i))return;var nc=rot(cells[d.i].t,cells[d.i].r);if(arms(nc).indexOf(d.op)!==-1){vis.add(d.i);q.push(d.i);}});}return vis;}
  function drawPipe(t,lit,isSrc,isSnk){if(isSrc)return'<div style="position:absolute;inset:22%;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px #fff inset"></div>';if(isSnk)return'<div style="position:absolute;inset:22%;border-radius:50%;background:#ef4444;box-shadow:0 0 0 3px #fff inset"></div>';var a=arms(t);if(!a.length)return'<div style="position:absolute;inset:40%;border-radius:50%;background:rgba(30,41,59,.2)"></div>';var ac=lit?'#22c55e':'#1e293b';var dc=lit?'#22c55e':'#334155';var s='';if(a.indexOf('N')!==-1)s+='<div style="position:absolute;left:37%;right:37%;top:0;bottom:50%;background:'+ac+';border-radius:0 0 2px 2px"></div>';if(a.indexOf('S')!==-1)s+='<div style="position:absolute;left:37%;right:37%;top:50%;bottom:0;background:'+ac+';border-radius:2px 2px 0 0"></div>';if(a.indexOf('E')!==-1)s+='<div style="position:absolute;top:37%;bottom:37%;left:50%;right:0;background:'+ac+';border-radius:2px 0 0 2px"></div>';if(a.indexOf('W')!==-1)s+='<div style="position:absolute;top:37%;bottom:37%;right:50%;left:0;background:'+ac+';border-radius:0 2px 2px 0"></div>';s+='<div style="position:absolute;inset:32%;border-radius:50%;background:'+dc+(lit?';box-shadow:0 0 8px rgba(34,197,94,.5)':'')+'"></div>';return s;}
  var PUZZLES=[{sz:4,cells:[{t:6},{t:12},{t:12},{t:10},{t:3},{t:0},{t:0},{t:3},{t:3},{t:0},{t:0},{t:3},{t:5},{t:12},{t:12},{t:9}],src:0,snk:15,d:0.8},{sz:4,cells:[{t:6},{t:12},{t:12},{t:10},{t:3},{t:0},{t:0},{t:3},{t:6},{t:9},{t:6},{t:9},{t:0},{t:0},{t:5},{t:0}],src:0,snk:14,d:0.9},{sz:4,cells:[{t:6},{t:12},{t:10},{t:0},{t:3},{t:0},{t:6},{t:10},{t:6},{t:9},{t:3},{t:3},{t:5},{t:0},{t:5},{t:0}],src:0,snk:14,d:0.9},{sz:5,cells:[{t:6},{t:12},{t:12},{t:12},{t:10},{t:3},{t:0},{t:0},{t:0},{t:3},{t:3},{t:0},{t:0},{t:0},{t:3},{t:3},{t:0},{t:0},{t:0},{t:3},{t:5},{t:12},{t:12},{t:12},{t:9}],src:0,snk:24,d:1.0},{sz:5,cells:[{t:6},{t:12},{t:10},{t:0},{t:0},{t:0},{t:0},{t:6},{t:12},{t:10},{t:0},{t:6},{t:9},{t:0},{t:3},{t:5},{t:9},{t:0},{t:0},{t:3},{t:0},{t:0},{t:0},{t:5},{t:9}],src:0,snk:24,d:1.1},{sz:5,cells:[{t:6},{t:12},{t:12},{t:10},{t:0},{t:3},{t:6},{t:9},{t:3},{t:0},{t:3},{t:5},{t:0},{t:6},{t:10},{t:6},{t:12},{t:9},{t:5},{t:3},{t:5},{t:0},{t:0},{t:12},{t:9}],src:0,snk:24,d:1.3}];
  Q.register('pipeConnect',function(){var puz=Q.pick(PUZZLES);var cells=puz.cells.map(function(c,i){if(!c.t||i===puz.src||i===puz.snk)return{t:c.t||0,r:0};return{t:c.t,r:Q.rand(0,3)};});return{type:'pipeConnect',category:'spatialAwareness',categoryLabel:'Pipe Connect',difficulty:puz.d,question:'Rotate pipes to connect green to red',sz:puz.sz,cells:cells,src:puz.src,snk:puz.snk,answer:'complete',options:[],explanation:'Tap each pipe to rotate it 90°.',visual:'custom'};},3);
  Q.registerRenderer('pipeConnect',{
    render:function(q,idx){var sz=q.sz;var cells='';for(var i=0;i<q.cells.length;i++){var c=q.cells[i];var isSrc=i===q.src,isSnk=i===q.snk,isEmpty=!c.t&&!isSrc&&!isSnk;var inner=isEmpty?'':drawPipe(rot(c.t,c.r),false,isSrc,isSnk);var extraBg=isSrc?'background:#dcfce7;border-color:#22c55e;box-shadow:0 3px 0 #16a34a;':isSnk?'background:#fee2e2;border-color:#ef4444;box-shadow:0 3px 0 #dc2626;':isEmpty?'background:#f8fafc;border-color:#e2e8f0;box-shadow:none;opacity:.5;pointer-events:none;':'';cells+='<button class="pc3-cell" id="pc3c-'+idx+'-'+i+'" data-pi="'+idx+'" data-pc="'+i+'"'+(isEmpty||isSrc||isSnk?' disabled':'')+' style="'+extraBg+'">'+inner+'</button>';}var hint='<div style="display:flex;gap:14px;justify-content:center;align-items:center;margin:2px 0"><div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:800;color:rgba(255,255,255,.65)"><div style="width:13px;height:13px;border-radius:50%;background:#22c55e;border:2px solid rgba(255,255,255,.5)"></div>Source</div><div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:800;color:rgba(255,255,255,.65)"><div style="width:13px;height:13px;border-radius:50%;background:#ef4444;border:2px solid rgba(255,255,255,.5)"></div>Drain</div></div>';return'<div class="qcard" style="gap:6px"><div class="category">PIPE CONNECT</div><div class="question" style="font-size:14px">'+q.question+'</div>'+hint+'<div class="pc3-grid" id="pc3g-'+idx+'" style="grid-template-columns:repeat('+sz+',1fr);width:min(260px,70vw)">'+cells+'</div><div class="pc3-status" id="pc3s-'+idx+'">Tap pipes to rotate them</div><div class="pc3-moves" id="pc3m-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var cells=q.cells.map(function(c){return{t:c.t,r:c.r};}),moves=0,done=false;var statEl=document.getElementById('pc3s-'+idx),movEl=document.getElementById('pc3m-'+idx);function getEl(i){return document.getElementById('pc3c-'+idx+'-'+i);}function refresh(){var lit=connected(cells,q.sz,q.src);for(var i=0;i<cells.length;i++){if(i===q.src||i===q.snk||!cells[i].t)continue;var el=getEl(i);if(!el)continue;var isLit=lit.has(i);el.innerHTML=drawPipe(rot(cells[i].t,cells[i].r),isLit,false,false);el.style.background=isLit?'#f0fdf4':'#fff';el.style.borderColor=isLit?'#22c55e':'#e8e2d6';el.style.boxShadow=isLit?'0 3px 0 #16a34a':'0 3px 0 #d6cfc0';}var srcEl=getEl(q.src),snkEl=getEl(q.snk);if(srcEl&&lit.has(q.src))srcEl.style.boxShadow='0 3px 0 #15803d,0 0 14px rgba(34,197,94,.35)';if(snkEl&&lit.has(q.snk))snkEl.style.boxShadow='0 3px 0 #991b1b,0 0 14px rgba(239,68,68,.35)';return lit.has(q.snk);}var grid=document.getElementById('pc3g-'+idx);if(!grid)return;grid.addEventListener('click',function(e){if(done)return;var btn=e.target.closest('[data-pc]');if(!btn||+btn.dataset.pi!==idx||btn.disabled)return;var i=parseInt(btn.dataset.pc);if(i===q.src||i===q.snk||!cells[i].t)return;H.light&&H.light();cells[i].r=(cells[i].r+1)%4;btn.style.transform='scale(.88)';setTimeout(function(){btn.style.transform='';},110);moves++;movEl.textContent=moves+' rotation'+(moves===1?'':'s');var won=refresh();if(won){statEl.textContent='Connected! 🎉';setTimeout(function(){finish(true);},300);}});function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('pipeConnect');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.streak&&H.streak();ctx.flashEl.className='flash green show';ctx.spawnConfetti(16);}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx),hintEl=document.getElementById('hint-'+idx);if(expEl){expEl.textContent=won?'Pipes connected in '+moves+' rotations!':'Rotate each pipe to link source to drain.';expEl.classList.add('show');}setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}refresh();ctx.answerStartRef.set(Date.now());}
  });
})();



// ── Jigsaw Puzzle ─────────────────────────────────────────────────────────────
(function(){
  var CS = 44;
  var COLORS = ['#e8443a','#3a7df2','#3fba4f','#e8a817','#8b5cf6','#f97316','#ec4899','#06b6d4'];

  var PUZZLES = [
    {sz:4, pieces:[[[0,0],[0,1],[1,0],[1,1]],[[0,2],[0,3],[1,2],[1,3]],[[2,0],[2,1],[3,0],[3,1]],[[2,2],[2,3],[3,2],[3,3]]]},
    {sz:4, pieces:[[[0,0],[0,1],[0,2],[0,3]],[[1,0],[1,1],[2,0],[2,1]],[[1,2],[1,3],[2,2],[2,3]],[[3,0],[3,1],[3,2],[3,3]]]},
    {sz:4, pieces:[[[0,0],[1,0],[2,0],[3,0]],[[0,1],[0,2],[0,3],[1,1]],[[1,2],[1,3],[2,1],[2,2]],[[2,3],[3,1],[3,2],[3,3]]]},
    {sz:4, pieces:[[[0,0],[0,1],[1,0],[2,0]],[[0,2],[0,3],[1,3],[2,3]],[[1,1],[1,2],[2,1],[2,2]],[[3,0],[3,1],[3,2],[3,3]]]},
    {sz:4, pieces:[[[0,0],[0,1],[0,2],[1,0]],[[0,3],[1,1],[1,2],[1,3]],[[2,0],[2,1],[3,0],[3,1]],[[2,2],[2,3],[3,2],[3,3]]]},
    {sz:5, pieces:[[[0,0],[0,1],[0,2],[0,3],[0,4]],[[1,0],[1,1],[2,0],[2,1],[3,0]],[[1,2],[1,3],[1,4],[2,2],[3,2]],[[2,3],[2,4],[3,3],[3,4],[4,4]],[[3,1],[4,0],[4,1],[4,2],[4,3]]]},
    {sz:5, pieces:[[[0,0],[1,0],[2,0],[3,0],[4,0]],[[0,1],[0,2],[0,3],[0,4],[1,1]],[[1,2],[1,3],[1,4],[2,4],[3,4]],[[2,1],[2,2],[2,3],[3,1],[3,2]],[[3,3],[4,1],[4,2],[4,3],[4,4]]]},
  ];

  function buildOutline(cells){
    var set={};cells.forEach(function(c){set[c[0]+','+c[1]]=true;});
    function has(r,c2){return set[r+','+c2]===true;}
    var edges=[];
    cells.forEach(function(rc){
      var r=rc[0],c2=rc[1];
      if(!has(r-1,c2))edges.push({x1:c2*CS,y1:r*CS,x2:(c2+1)*CS,y2:r*CS});
      if(!has(r,c2+1))edges.push({x1:(c2+1)*CS,y1:r*CS,x2:(c2+1)*CS,y2:(r+1)*CS});
      if(!has(r+1,c2))edges.push({x1:(c2+1)*CS,y1:(r+1)*CS,x2:c2*CS,y2:(r+1)*CS});
      if(!has(r,c2-1))edges.push({x1:c2*CS,y1:(r+1)*CS,x2:c2*CS,y2:r*CS});
    });
    if(!edges.length)return'';
    var adj={};edges.forEach(function(e,i){var k=e.x1+','+e.y1;if(!adj[k])adj[k]=[];adj[k].push(i);});
    var used=new Array(edges.length),pts=[];
    used[0]=true;pts.push(edges[0].x1+','+edges[0].y1);
    var ex=edges[0].x2,ey=edges[0].y2;
    for(var step=1;step<edges.length;step++){
      var k=ex+','+ey,found=false,cands=adj[k];
      if(cands){for(var j=0;j<cands.length;j++){var ei=cands[j];if(!used[ei]){used[ei]=true;pts.push(edges[ei].x1+','+edges[ei].y1);ex=edges[ei].x2;ey=edges[ei].y2;found=true;break;}}}
      if(!found)break;
    }
    return'M'+pts.join('L')+'Z';
  }

  function bbox(cells){var minR=Infinity,maxR=-Infinity,minC=Infinity,maxC=-Infinity;cells.forEach(function(c){if(c[0]<minR)minR=c[0];if(c[0]>maxR)maxR=c[0];if(c[1]<minC)minC=c[1];if(c[1]>maxC)maxC=c[1];});return{minR:minR,maxR:maxR,minC:minC,maxC:maxC};}

  Q.register('jigsaw',function(){
    var puz=Q.pick(PUZZLES),order=[];
    for(var i=0;i<puz.pieces.length;i++)order.push(i);
    order=Q.shuffle(order);
    return{type:'jigsaw',category:'spatialAwareness',categoryLabel:'Jigsaw',difficulty:puz.sz===4?0.9:1.2,question:'Drag pieces to fill the grid!',sz:puz.sz,pieces:puz.pieces,trayOrder:order,answer:'complete',options:[],explanation:'Spatial reasoning.',visual:'custom'};
  },3);

  Q.registerRenderer('jigsaw',{
    render:function(q,idx){
      var sz=q.sz,gridW=sz*CS,maxW=Math.min(210,Math.floor(window.innerWidth*0.55)),scale=maxW/gridW,dispW=Math.round(gridW*scale);
      // Board SVG — just grid lines, NO outlines showing where pieces go
      var svgContent='';
      for(var i=0;i<=sz;i++){
        svgContent+='<line x1="'+(i*CS)+'" y1="0" x2="'+(i*CS)+'" y2="'+gridW+'" stroke="rgba(255,255,255,.15)" stroke-width="1"/>';
        svgContent+='<line x1="0" y1="'+(i*CS)+'" x2="'+gridW+'" y2="'+(i*CS)+'" stroke="rgba(255,255,255,.15)" stroke-width="1"/>';
      }
      // Tray pieces
      var trayHtml='';
      q.trayOrder.forEach(function(pi){
        var cells=q.pieces[pi],color=COLORS[pi%COLORS.length],d=buildOutline(cells);if(!d)return;
        var bb=bbox(cells),pad=3,vx=bb.minC*CS-pad,vy=bb.minR*CS-pad,vw=(bb.maxC-bb.minC+1)*CS+pad*2,vh=(bb.maxR-bb.minR+1)*CS+pad*2;
        var ts=scale*0.8,pw=Math.round(vw*ts),ph=Math.round(vh*ts);
        trayHtml+='<div class="jig-pw" id="jpw-'+idx+'-'+pi+'" data-ji="'+idx+'" data-jp="'+pi+'" style="display:inline-block;touch-action:none;user-select:none;-webkit-user-select:none"><svg width="'+pw+'" height="'+ph+'" viewBox="'+vx+' '+vy+' '+vw+' '+vh+'" style="display:block;overflow:visible;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))"><path d="'+d+'" fill="'+color+'" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linejoin="round"/></svg></div>';
      });
      return'<div class="qcard" style="gap:5px;padding:12px 10px"><div class="category">JIGSAW</div><div class="question" style="font-size:13px">'+q.question+'</div>'
        +'<div id="jdz-'+idx+'" style="background:rgba(255,255,255,.1);border-radius:14px;padding:6px;border:2px solid rgba(255,255,255,.15);display:inline-block">'
        +'<svg id="jsvg-'+idx+'" width="'+dispW+'" height="'+dispW+'" viewBox="0 0 '+gridW+' '+gridW+'" style="display:block;border-radius:10px;background:rgba(255,255,255,.06)">'+svgContent+'</svg></div>'
        +'<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:4px 0" id="jtray-'+idx+'">'+trayHtml+'</div>'
        +'<div class="jig-status" id="jst-'+idx+'" style="color:rgba(255,255,255,.5);font-size:12px">Drag a piece onto the grid</div>'
        +'<div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'
        +_gameBranding()+'</div>'+_scrollHint(idx);
    },
    attach:function(slideEl,q,idx,ctx){
      var Hp=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      var svgEl=document.getElementById('jsvg-'+idx),dzEl=document.getElementById('jdz-'+idx),statEl=document.getElementById('jst-'+idx);
      if(!svgEl)return;
      var sz=q.sz,gridW=sz*CS,placed=0,totalPieces=q.pieces.length,done=false;
      var placedSet={},drag=null;

      function getXY(e){
        var t=e.touches?e.touches[0]:null;
        if(!t)t=e.changedTouches?e.changedTouches[0]:null;
        if(!t)t=e;
        return{x:t.clientX,y:t.clientY};
      }

      // Build a lookup: for each grid cell [r,c], which piece index owns it
      var cellOwner={};
      q.pieces.forEach(function(cells,pi){
        cells.forEach(function(c){cellOwner[c[0]+','+c[1]]=pi;});
      });

      function startDrag(e){
        if(done)return;
        e.preventDefault();e.stopPropagation();
        var pw=e.currentTarget;
        var pi=parseInt(pw.dataset.jp);
        if(placedSet[pi])return;
        var xy=getXY(e),rect=pw.getBoundingClientRect();
        // Create floating clone
        var clone=pw.cloneNode(true);
        clone.style.cssText='position:fixed;z-index:9999;pointer-events:none;opacity:0.85;transform:scale(1.15);transition:none';
        clone.style.left=rect.left+'px';clone.style.top=rect.top+'px';
        clone.style.width=rect.width+'px';clone.style.height=rect.height+'px';
        document.body.appendChild(clone);
        pw.style.opacity='0.2';
        drag={pi:pi,pw:pw,clone:clone,offX:xy.x-rect.left,offY:xy.y-rect.top};
        Hp.light&&Hp.light();
        document.addEventListener('mousemove',onMove,{passive:false});
        document.addEventListener('touchmove',onMove,{passive:false});
        document.addEventListener('mouseup',onUp);
        document.addEventListener('touchend',onUp);
      }

      function onMove(e){
        if(!drag)return;e.preventDefault();
        var xy=getXY(e);
        drag.clone.style.left=(xy.x-drag.offX)+'px';
        drag.clone.style.top=(xy.y-drag.offY)+'px';
      }

      function onUp(e){
        if(!drag)return;
        document.removeEventListener('mousemove',onMove);
        document.removeEventListener('touchmove',onMove);
        document.removeEventListener('mouseup',onUp);
        document.removeEventListener('touchend',onUp);
        var xy=getXY(e);
        drag.clone.remove();
        drag.pw.style.opacity='1';
        // Convert drop point to SVG grid coordinates
        var svgRect=svgEl.getBoundingClientRect();
        var scaleX=gridW/svgRect.width;
        var svgX=(xy.x-svgRect.left)*scaleX;
        var svgY=(xy.y-svgRect.top)*scaleX;
        // Which grid cell did they drop on?
        var dropR=Math.floor(svgY/CS),dropC=Math.floor(svgX/CS);
        if(dropR>=0&&dropR<sz&&dropC>=0&&dropC<sz){
          // Check if this cell belongs to the dragged piece
          var owner=cellOwner[dropR+','+dropC];
          if(owner===drag.pi&&!placedSet[drag.pi]){
            snapIn(drag.pi,drag.pw);
          }else{
            // Wrong spot
            Hp.error&&Hp.error();
            statEl.textContent='Wrong spot!';
            setTimeout(function(){if(!done)statEl.textContent=placed+'/'+totalPieces+' placed';},800);
          }
        }
        drag=null;
      }

      function snapIn(pi,pw){
        Hp.medium&&Hp.medium();
        placedSet[pi]=true;
        var cells=q.pieces[pi],color=COLORS[pi%COLORS.length],d=buildOutline(cells);
        var path=document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d',d);path.setAttribute('fill',color);
        path.setAttribute('stroke','rgba(255,255,255,.4)');path.setAttribute('stroke-width','1.5');
        path.setAttribute('stroke-linejoin','round');
        path.style.opacity='0';
        svgEl.appendChild(path);
        requestAnimationFrame(function(){path.style.transition='opacity 0.2s';path.style.opacity='1';});
        pw.style.opacity='0.12';pw.style.pointerEvents='none';pw.style.transform='scale(0.85)';
        placed++;
        statEl.textContent=placed+'/'+totalPieces+' placed';
        if(placed===totalPieces)setTimeout(function(){finish(true);},300);
      }

      function finish(won){
        done=true;
        var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('jigsaw');if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){Hp.streak&&Hp.streak();statEl.textContent='🎉 Complete!';statEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(18);}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        var expEl=slideEl.querySelector('#exp-'+idx),hintEl=document.getElementById('hint-'+idx);
        if(expEl){expEl.textContent=won?'All pieces placed!':'';expEl.classList.add('show');}
        setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }

      // Attach drag to tray pieces
      slideEl.querySelectorAll('.jig-pw[data-ji="'+idx+'"]').forEach(function(pw){
        pw.addEventListener('mousedown',startDrag);
        pw.addEventListener('touchstart',startDrag,{passive:false});
      });

      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── Flappy Bird ───────────────────────────────────────────────────────────────
(function(){
  var TARGET = 10;

  Q.register('flappy', function(){
    var speeds = [
      { label: 'Chill',  speed: 1.0, gap: 130, interval: 170, d: 0.8 },
      { label: 'Normal', speed: 1.3, gap: 120, interval: 150, d: 1.1 },
      { label: 'Hard',   speed: 1.6, gap: 110, interval: 135, d: 1.5 },
    ];
    var tier = Q.rand(0, 2), s = speeds[tier];
    return {
      type: 'flappy', category: 'mentalAgility', categoryLabel: 'Flappy Bird',
      difficulty: s.d, question: 'Get past ' + TARGET + ' pipes! (' + s.label + ')',
      answer: 'complete', options: [], explanation: 'Timing and rhythm.',
      visual: 'custom', ps: s.speed, gap: s.gap, pi: s.interval
    };
  }, 3);

  Q.registerRenderer('flappy', {
    render: function(q, idx){
      return '<div class="qcard" style="gap:6px;padding:10px">'
        + '<div class="category">FLAPPY BIRD</div>'
        + '<div class="question" style="font-size:13px">' + q.question + '</div>'
        + '<div style="position:relative;display:flex;justify-content:center">'
        +   '<canvas id="fbc-' + idx + '" style="border-radius:14px;touch-action:manipulation;width:100%;max-width:280px"></canvas>'
        +   '<div id="fbo-' + idx + '" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;border-radius:14px">'
        +     '<div style="background:#fff;color:var(--blue,#0474fc);border:none;border-radius:14px;padding:11px 30px;font-family:Nunito,sans-serif;font-size:15px;font-weight:900;box-shadow:0 4px 0 #d6cfc0;cursor:pointer">Tap to Play!</div>'
        +   '</div>'
        + '</div>'
        + '<div id="fbs-' + idx + '" style="font-size:13px;font-weight:800;text-align:center;color:rgba(255,255,255,.6);min-height:18px"></div>'
        + '<div id="wa-' + idx + '"></div>'
        + '<div class="explanation" id="exp-' + idx + '"></div>'
        + _fullGameBtn('Play Endless Flappy', 'flappy')
        + _gameBranding() + _scrollHint(idx)
        + '</div>';
    },

    attach: function(slideEl, q, idx, ctx){
      var Hp = ctx.Haptics || {};
      var actEl = slideEl.querySelector('#wa-' + idx);
      if (actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);

      var cv = slideEl.querySelector('#fbc-' + idx);
      var ov = slideEl.querySelector('#fbo-' + idx);
      var st = slideEl.querySelector('#fbs-' + idx);
      if (!cv) return;

      var W = 280, H = 340;
      cv.width = W * 2; cv.height = H * 2;
      cv.style.maxWidth = W + 'px';
      cv.style.aspectRatio = W + '/' + H;
      cv.style.cursor = 'pointer';
      var g = cv.getContext('2d');
      g.scale(2, 2);

      var GRAV = 0.18, FLP = -3.4, MXV = 4;
      var PW = 42, PS = q.ps, GAP = q.gap, PII = q.pi;
      var BX = 60, BR = 13;

      var by, bv, ba, pp, sc, fc, dead, won, raf, on;

      function reset(){ by = H * 0.4; bv = 0; ba = 0; pp = []; sc = 0; fc = 0; dead = false; won = false; on = false; }
      reset();

      function flap(){ if (!dead && !won){ bv = FLP; Hp.light && Hp.light(); } }

      function addP(){
        var mn = 50, mx = H - GAP - 50;
        pp.push({ x: W, t: mn + Math.random() * (mx - mn), s: false });
      }

      // ── Drawing ──

      function drawBird(x, y, a){
        g.save(); g.translate(x, y); g.rotate(a);

        // Shadow
        g.fillStyle = 'rgba(0,0,0,.1)';
        g.beginPath(); g.arc(1, 2, BR, 0, Math.PI * 2); g.fill();

        // Body — white circle
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(0, 0, BR, 0, Math.PI * 2); g.fill();

        // Wing flap
        var wy = Math.sin(fc * 0.25) * 2.5;
        g.fillStyle = 'rgba(4,116,252,.2)';
        g.beginPath(); g.ellipse(-4, wy, 8, 5, -0.15, 0, Math.PI * 2); g.fill();

        // Eye
        g.fillStyle = '#1e293b';
        g.beginPath(); g.arc(4, -3, 3, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff';
        g.beginPath(); g.arc(5, -4, 1.2, 0, Math.PI * 2); g.fill();

        // Beak
        g.fillStyle = '#f59e0b';
        g.beginPath();
        g.moveTo(BR - 4, -2);
        g.lineTo(BR + 5, 1);
        g.lineTo(BR - 4, 4);
        g.closePath();
        g.fill();

        g.restore();
      }

      function drawPipe(x, top){
        var bot = top + GAP, cap = 8, ov = 4, r = 6;

        // White pipe with shadow — matches the white button/card style
        // Shadow first
        g.fillStyle = 'rgba(0,0,0,.08)';
        g.beginPath(); g.roundRect(x + 2, -4, PW, top - cap + 6, r); g.fill();
        g.beginPath(); g.roundRect(x + 2, bot + cap - 2, PW, H - bot - cap + 6, r); g.fill();

        // Top pipe body
        g.fillStyle = '#fff';
        g.beginPath(); g.roundRect(x, -4, PW, top - cap + 4, r); g.fill();
        // Top cap — wider
        g.beginPath(); g.roundRect(x - ov, top - cap, PW + ov * 2, cap, [0, 0, r, r]); g.fill();

        // Bottom pipe body
        g.beginPath(); g.roundRect(x, bot + cap, PW, H - bot - cap + 4, r); g.fill();
        // Bottom cap
        g.beginPath(); g.roundRect(x - ov, bot, PW + ov * 2, cap, [r, r, 0, 0]); g.fill();

        // Subtle inner line for depth
        g.fillStyle = 'rgba(4,116,252,.06)';
        g.fillRect(x + 3, 0, 2, top - cap);
        g.fillRect(x + 3, bot + cap, 2, H);
      }

      function draw(){
        // Clear — same blue as the qcard
        g.fillStyle = '#0474fc';
        g.fillRect(0, 0, W, H);

        // Subtle inner shadow at edges
        g.fillStyle = 'rgba(0,0,0,.06)';
        g.fillRect(0, 0, W, 3);
        g.fillRect(0, H - 3, W, 3);

        // Pipes
        for (var i = 0; i < pp.length; i++) drawPipe(pp[i].x, pp[i].t);

        // Floor line
        g.fillStyle = 'rgba(255,255,255,.12)';
        g.fillRect(0, H - 2, W, 2);

        // Bird
        var ta = Math.min(Math.max(bv * 0.09, -0.4), 0.9);
        ba += (ta - ba) * 0.12;
        drawBird(BX, by, ba);

        // Score — top center
        g.textAlign = 'center';
        g.font = '900 18px Nunito, sans-serif';
        g.fillStyle = 'rgba(255,255,255,.3)';
        g.fillText(sc + ' / ' + TARGET, W / 2, 24);
      }

      // Static preview
      pp = [{ x: 120, t: 80, s: false }, { x: 220, t: 150, s: false }];
      draw();
      pp = [];

      function hit(){
        var bT = by - BR * 0.6, bB = by + BR * 0.6;
        if (bB >= H - 4 || bT <= 2) return true;
        for (var i = 0; i < pp.length; i++){
          var p = pp[i];
          if (BX + BR < p.x || BX - BR > p.x + PW) continue;
          if (bT < p.t || bB > p.t + GAP) return true;
        }
        return false;
      }

      function tick(){
        if (!on || dead || won) return;
        fc++;
        bv = Math.min(bv + GRAV, MXV);
        by += bv;
        if (by < BR + 2){ by = BR + 2; bv = 0; }

        if (fc % PII === 0) addP();
        for (var i = pp.length - 1; i >= 0; i--){
          pp[i].x -= PS;
          if (!pp[i].s && pp[i].x + PW < BX){
            pp[i].s = true; sc++;
            Hp.medium && Hp.medium();
            if (sc >= TARGET){ won = true; end(true); return; }
          }
          if (pp[i].x < -PW - 10) pp.splice(i, 1);
        }
        if (hit()){ dead = true; Hp.error && Hp.error(); end(false); }
      }

      function loop(){ tick(); draw(); if (!dead && !won) raf = requestAnimationFrame(loop); else drawOver(); }

      function drawOver(){
        g.fillStyle = dead ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.12)';
        g.fillRect(0, 0, W, H);
        g.textAlign = 'center';
        g.font = '900 22px Nunito, sans-serif';
        g.fillStyle = '#fff';
        g.fillText(won ? 'Nice! 🎉' : 'Game Over', W / 2, H * 0.4);
        g.font = '800 13px Nunito, sans-serif';
        g.fillStyle = 'rgba(255,255,255,.6)';
        g.fillText(sc + ' / ' + TARGET, W / 2, H * 0.4 + 22);
      }

      function end(w){
        var ms = Date.now() - ctx.answerStartRef.get();
        var d = ctx.IQData.recordAnswer(q.category, w, q.difficulty, ms);
        if (ctx.notifyGamePlayed) ctx.notifyGamePlayed('flappy');
        if (ctx.onAnswer) ctx.onAnswer(w, ms);
        if (w){ Hp.streak && Hp.streak(); st.textContent = '🎉 Score ' + TARGET + '!'; st.style.color = 'var(--green)'; ctx.flashEl.className = 'flash green show'; ctx.spawnConfetti(20); }
        else { st.textContent = 'Scored ' + sc + ' — try again!'; st.style.color = 'var(--red)'; ctx.flashEl.className = 'flash red show'; }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-' + idx), hintEl = document.getElementById('hint-' + idx);
        if (expEl){ expEl.textContent = w ? 'Got past ' + TARGET + ' pipes!' : 'Got ' + sc + '. Tap steady!'; expEl.classList.add('show'); }
        setTimeout(function(){ if (hintEl) hintEl.classList.add('show'); }, 500);
        ctx.updateUI(d); ctx.checkMore(); ctx.answerStartRef.set(Date.now());
      }

      function tap(e){ e.preventDefault(); e.stopPropagation(); if (!dead && !won) flap(); }

      function go(e){
        if (e){ e.preventDefault(); e.stopPropagation(); }
        Hp.medium && Hp.medium();
        ov.style.display = 'none';
        reset(); on = true;
        ctx.answerStartRef.set(Date.now());
        flap();
        loop();
        cv.addEventListener('click', tap);
        cv.addEventListener('touchstart', tap, { passive: false });
      }

      ov.addEventListener('click', go);
      ov.addEventListener('touchstart', go, { passive: false });

      document.addEventListener('keydown', function(e){
        if (dead || won) return;
        var vi = Math.round(ctx.feed.scrollTop / (ctx.feed.clientHeight || 1));
        if (ctx.feed.children[vi] !== slideEl) return;
        if (e.code === 'Space' || e.code === 'ArrowUp'){ e.preventDefault(); if (!on) go(); else flap(); }
      });

      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── Word Ladder ───────────────────────────────────────────────────────────────
(function(){
  var _WL_WORDS=new Set(["CAT","COT","COG","DOG","HOT","COD","BOY","BAY","BAN","MAN","PIG","BIG","BAG","BAT","COLD","CORD","WORD","WARD","WARM","FOUR","POUR","SOUR","TOUR","HIDE","TIDE","TILE","TIME","LIME","RAIN","REIN","VEIN","VAIN","BOOT","BOOK","COOK","COOL","FOOL","BOLD","BALD","BALL","BELL","BELT","STAR","SCAR","SOAR","BOAR","BEAR","GOAL","COAL","COAT","GOAT","BOAT","FAST","LAST","LUST","JUST","PINK","RINK","RING","DING"]);
  (function(){fetch('/words.txt').then(function(r){return r.text();}).then(function(t){t.trim().split(/\r?\n/).forEach(function(w){var x=w.trim().toUpperCase();if(x.length>=3&&x.length<=6&&/^[A-Z]+$/.test(x))_WL_WORDS.add(x);});}).catch(function(){});})();
  function isValidWord(w){return _WL_WORDS.has(w.toUpperCase());}
  function diffLetters(a,b){if(a.length!==b.length)return 999;var d=0;for(var i=0;i<a.length;i++)if(a[i]!==b[i])d++;return d;}
  var LADDERS=[{start:'CAT',end:'DOG',path:['CAT','COT','COG','DOG'],hint:'Feline to canine'},{start:'HOT',end:'COD',path:['HOT','COT','COD'],hint:'Temperature to fish'},{start:'BOY',end:'MAN',path:['BOY','BAY','BAN','MAN'],hint:'Youth to adult'},{start:'PIG',end:'CAT',path:['PIG','BIG','BAG','BAT','CAT'],hint:'Farm animal to feline'},{start:'COLD',end:'WARM',path:['COLD','CORD','WORD','WARD','WARM'],hint:'Freeze to cozy'},{start:'FOUR',end:'TOUR',path:['FOUR','POUR','SOUR','TOUR'],hint:'Number to journey'},{start:'HIDE',end:'LIME',path:['HIDE','TIDE','TILE','TIME','LIME'],hint:'Conceal to citrus'},{start:'RAIN',end:'VAIN',path:['RAIN','REIN','VEIN','VAIN'],hint:'Weather to conceited'},{start:'BOOT',end:'FOOL',path:['BOOT','BOOK','COOK','COOL','FOOL'],hint:'Shoe to jester'},{start:'BOLD',end:'BELT',path:['BOLD','BALD','BALL','BELL','BELT'],hint:'Brave to strap'},{start:'STAR',end:'BEAR',path:['STAR','SCAR','SOAR','BOAR','BEAR'],hint:'Sky light to animal'},{start:'GOAL',end:'BOAT',path:['GOAL','COAL','COAT','GOAT','BOAT'],hint:'Aim to vessel'},{start:'FAST',end:'JUST',path:['FAST','LAST','LUST','JUST'],hint:'Quick to fair'},{start:'PINK',end:'DING',path:['PINK','RINK','RING','DING'],hint:'Color to chime'}];
  Q.register('wordLadder',function(){var ladder=Q.pick(LADDERS);return{type:'wordLadder',category:'verbalReasoning',categoryLabel:'Word Ladder',difficulty:1.2,question:ladder.start+' → '+ladder.end,start:ladder.start,end:ladder.end,steps:ladder.path.length-1,hint:ladder.hint,path:ladder.path,answer:'complete',options:[],explanation:ladder.hint,visual:'custom'};},3);
  Q.registerRenderer('wordLadder',{
    render:function(q,idx){var startTiles=q.start.split('').map(function(l){return'<div class="wl-ep-tile">'+l+'</div>';}).join('');var endTiles=q.end.split('').map(function(l){return'<div class="wl-ep-tile">'+l+'</div>';}).join('');var curTiles=q.start.split('').map(function(l,i){return'<div class="wl-cur-tile" data-wli="'+idx+'" data-wlp="'+i+'">'+l+'</div>';}).join('');var alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(l){return'<button class="wl-lbtn" data-wll="'+l+'" data-wla="'+idx+'">'+l+'</button>';}).join('');return'<div class="qcard" style="gap:7px"><div class="category">WORD LADDER</div><div class="question">Change one letter at a time</div><div class="wl-endpoints"><div class="wl-ep-box"><div class="wl-ep-lbl">Start</div><div class="wl-ep-tiles">'+startTiles+'</div></div><div class="wl-arrow">→</div><div class="wl-ep-box"><div class="wl-ep-lbl">Target</div><div class="wl-ep-tiles">'+endTiles+'</div></div></div><div class="wl-current" id="wl-cur-'+idx+'">'+curTiles+'</div><div style="display:flex;justify-content:center"><div class="wl-alpha" id="wl-alpha-'+idx+'">'+alpha+'</div></div><div class="wl-hist" id="wl-hist-'+idx+'"></div><div class="wl-moves" id="wl-moves-'+idx+'">0 moves</div><div class="wl-status" id="wl-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">Hint: '+q.hint+'</div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var curEl=document.getElementById('wl-cur-'+idx),alphaEl=document.getElementById('wl-alpha-'+idx),histEl=document.getElementById('wl-hist-'+idx),movesEl=document.getElementById('wl-moves-'+idx),statusEl=document.getElementById('wl-status-'+idx);if(!curEl)return;var current=q.start.split(''),selectedPos=-1,moves=0,done=false,history=[];
    function renderCurrent(){var tiles=curEl.querySelectorAll('.wl-cur-tile');tiles.forEach(function(tile,i){tile.textContent=current[i];var isMatch=current[i]===q.end[i];tile.className='wl-cur-tile'+(i===selectedPos?' wl-sel':'')+(isMatch?' wl-match':'');});var alphaBtns=alphaEl.querySelectorAll('.wl-lbtn');alphaBtns.forEach(function(btn){btn.className='wl-lbtn'+(selectedPos!==-1&&current[selectedPos]===btn.dataset.wll?' wl-same':'');});}
    curEl.addEventListener('click',function(e){var tile=e.target.closest('.wl-cur-tile');if(!tile||done)return;if(tile.classList.contains('wl-match'))return;var pos=parseInt(tile.dataset.wlp);H.light&&H.light();selectedPos=(selectedPos===pos)?-1:pos;statusEl.textContent=selectedPos!==-1?'Now pick a letter below':'';statusEl.style.color='';renderCurrent();});
    alphaEl.addEventListener('click',function(e){var btn=e.target.closest('.wl-lbtn');if(!btn||done||selectedPos===-1)return;var letter=btn.dataset.wll;if(current[selectedPos]===letter)return;var newWord=current.slice();newWord[selectedPos]=letter;var wordStr=newWord.join('');if(diffLetters(current.join(''),wordStr)!==1)return;if(!isValidWord(wordStr)){H.error&&H.error();statusEl.textContent='"'+wordStr+'" — not a word';statusEl.style.color='var(--red)';setTimeout(function(){if(statusEl.textContent.includes('not a word')){statusEl.textContent='Pick a letter';statusEl.style.color='';}},1500);return;}H.medium&&H.medium();history.push(current.join(''));var span=document.createElement('span');span.className='wl-hist-w';span.textContent=current.join('');histEl.appendChild(span);current=newWord;moves++;movesEl.textContent=moves+' move'+(moves===1?'':'s');selectedPos=-1;statusEl.textContent='';statusEl.style.color='';renderCurrent();if(current.join('')===q.end)finish(true);});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordLadder');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){statusEl.textContent='🎉 Got it in '+moves+' moves!';statusEl.style.color='var(--green)';H.streak&&H.streak();ctx.flashEl.className='flash green show';ctx.spawnConfetti(16);}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?q.start+' → '+history.concat([q.end]).join(' → '):'Path: '+q.path.join(' → ');expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    renderCurrent();ctx.answerStartRef.set(Date.now());}
  });
})();

// ── Connections ───────────────────────────────────────────────────────────────
(function(){
  var PZLS=[{cats:[{name:'Planets',tier:0,words:['MARS','VENUS','SATURN','NEPTUNE']},{name:'Card games',tier:1,words:['POKER','RUMMY','BRIDGE','HEARTS']},{name:'___ ball',tier:2,words:['FIRE','BASKET','FOOT','BASE']},{name:'Things that fly',tier:3,words:['KITE','EAGLE','DRONE','ARROW']}]},{cats:[{name:'Types of tea',tier:0,words:['GREEN','CHAI','OOLONG','MATCHA']},{name:'Dances',tier:1,words:['TANGO','WALTZ','SALSA','RUMBA']},{name:'___ board',tier:2,words:['SKATE','SNOW','DART','CHALK']},{name:'Greek letters',tier:3,words:['ALPHA','DELTA','SIGMA','OMEGA']}]},{cats:[{name:'Dog breeds',tier:0,words:['POODLE','BEAGLE','HUSKY','BOXER']},{name:'Coffee drinks',tier:1,words:['LATTE','MOCHA','LUNGO','CORTADO']},{name:'___ house',tier:2,words:['TREE','FARM','WARE','LIGHT']},{name:'Things with shells',tier:3,words:['SNAIL','CRAB','EGG','WALNUT']}]},{cats:[{name:'Oceans',tier:0,words:['PACIFIC','ATLANTIC','ARCTIC','INDIAN']},{name:'Music genres',tier:1,words:['JAZZ','BLUES','SOUL','FUNK']},{name:'___ stone',tier:2,words:['LIME','SAND','COBBLE','MILE']},{name:'Shades of red',tier:3,words:['RUBY','CRIMSON','SCARLET','MAROON']}]},{cats:[{name:'Currencies',tier:0,words:['YEN','EURO','POUND','PESO']},{name:'Cheese types',tier:1,words:['BRIE','GOUDA','FETA','EDAM']},{name:'___ clock',tier:2,words:['ALARM','CUCKOO','STOP','BODY']},{name:'Winter sports',tier:3,words:['LUGE','BIATHLON','CURLING','SLALOM']}]},{cats:[{name:'Fruits',tier:0,words:['MANGO','GUAVA','LYCHEE','PAPAYA']},{name:'Fabrics',tier:1,words:['SILK','DENIM','VELVET','LINEN']},{name:'___ work',tier:2,words:['FIRE','FRAME','HOME','TEAM']},{name:'Elements',tier:3,words:['IRON','GOLD','NEON','ZINC']}]},{cats:[{name:'Breakfast foods',tier:0,words:['WAFFLE','CREPE','BAGEL','SCONE']},{name:'Space things',tier:1,words:['COMET','PULSAR','QUASAR','NEBULA']},{name:'___ down',tier:2,words:['BREAK','LOCK','TOUCH','COUNT']},{name:'Card suits',tier:3,words:['SPADE','CLUB','HEART','DIAMOND']}]},{cats:[{name:'Shades of blue',tier:0,words:['NAVY','AZURE','COBALT','TEAL']},{name:'Kitchen tools',tier:1,words:['WHISK','LADLE','TONGS','GRATER']},{name:'___ fish',tier:2,words:['SWORD','STAR','CLOWN','BLOW']},{name:'Math terms',tier:3,words:['PRIME','FACTOR','MEDIAN','VERTEX']}]},{cats:[{name:'Board games',tier:0,words:['CHESS','CLUE','RISK','SORRY']},{name:'Pasta shapes',tier:1,words:['PENNE','FUSILLI','ORZO','ROTINI']},{name:'___ light',tier:2,words:['MOON','FLASH','SPOT','HIGH']},{name:'Things that buzz',tier:3,words:['BEE','PHONE','ALARM','RAZOR']}]},{cats:[{name:'Precious gems',tier:0,words:['OPAL','TOPAZ','JADE','ONYX']},{name:'Shakespeare plays',tier:1,words:['HAMLET','OTHELLO','MACBETH','TEMPEST']},{name:'___ bear',tier:2,words:['POLAR','PANDA','GRIZZLY','TEDDY']},{name:'Car brands',tier:3,words:['FORD','HONDA','VOLVO','AUDI']}]}];
  var TC=['#22c55e','#3a7df2','#e8a817','#e8443a'];var TBG=['rgba(34,197,94,0.12)','rgba(58,125,242,0.12)','rgba(232,168,23,0.12)','rgba(232,68,58,0.12)'];var TBD=['rgba(34,197,94,0.3)','rgba(58,125,242,0.3)','rgba(232,168,23,0.3)','rgba(232,68,58,0.3)'];var TLBL=['Straightforward','Getting warmer','Tricky!','Devious'];
  Q.register('connections',function(){var puz=Q.pick(PZLS),all=[];puz.cats.forEach(function(cat,ci){cat.words.forEach(function(w){all.push({word:w,cat:ci});});});all=Q.shuffle(all);return{type:'connections',category:'verbalReasoning',categoryLabel:'Connections',difficulty:1.4,question:'Group 4 words that share something',words:all,categories:puz.cats,answer:'complete',options:[],explanation:'Find the hidden connection between each group.',visual:'custom'};},3);
  Q.registerRenderer('connections',{
    render:function(q,idx){var wds=q.words.map(function(w,i){return'<button class="cn-word" data-ci="'+idx+'" data-cw="'+i+'" data-cat="'+w.cat+'">'+w.word+'</button>';}).join('');var dots=[0,1,2,3].map(function(){return'<div class="cn-life"></div>';}).join('');return'<div class="qcard" style="gap:6px"><div class="category">CONNECTIONS</div><div class="question" style="font-size:13px">Group 4 words that share something</div><div class="cn-solved-area" id="cns-'+idx+'"></div><div class="cn-grid" id="cng-'+idx+'">'+wds+'</div><div class="cn-bar"><div class="cn-lives" id="cnl-'+idx+'">'+dots+'</div><button class="cn-submit" id="cnb-'+idx+'" disabled>Submit (0 / 4)</button></div><div class="cn-msg" id="cnm-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
    attach:function(slideEl,q,idx,ctx){var H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);var grid=document.getElementById('cng-'+idx),solved=document.getElementById('cns-'+idx),livesEl=document.getElementById('cnl-'+idx),subBtn=document.getElementById('cnb-'+idx),msgEl=document.getElementById('cnm-'+idx);if(!grid)return;var lives=4,solvedCt=0,done=false;function sel(){return Array.from(grid.querySelectorAll('.cn-word.cn-sel'));}function refreshSub(){var s=sel().length;subBtn.textContent='Submit ('+s+' / 4)';subBtn.disabled=s!==4;subBtn.className='cn-submit'+(s===4?' cn-ready':'');}function msg(txt,col){msgEl.textContent=txt;msgEl.style.color=col||'rgba(255,255,255,0.45)';}function refreshLives(){var d=livesEl.querySelectorAll('.cn-life');for(var i=0;i<4;i++)d[i].classList.toggle('cn-life-dead',i>=lives);}
    grid.addEventListener('click',function(e){var b=e.target.closest('.cn-word');if(!b||done)return;var s=sel();if(b.classList.contains('cn-sel')){H.light&&H.light();b.classList.remove('cn-sel');}else{if(s.length>=4)return;H.light&&H.light();b.classList.add('cn-sel');}msg('');refreshSub();});
    subBtn.addEventListener('click',function(){if(done)return;var s=sel();if(s.length!==4)return;var votes=[0,0,0,0];s.forEach(function(b){votes[parseInt(b.dataset.cat)]++;});var best=votes.indexOf(Math.max.apply(null,votes)),correct=votes[best]===4;if(correct){H.success&&H.success();var cat=q.categories[best],tier=cat.tier;s.forEach(function(b){b.classList.remove('cn-sel');b.style.opacity='0';b.style.transform='scale(0.8)';b.style.transition='all .22s';b.style.pointerEvents='none';});setTimeout(function(){s.forEach(function(b){if(b.parentNode===grid)grid.removeChild(b);});var row=document.createElement('div');row.style.cssText='background:'+TBG[tier]+';border:1.5px solid '+TBD[tier]+';border-radius:10px;padding:9px 12px;animation:cnPop .3s cubic-bezier(.34,1.56,.64,1)';row.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:11px;font-weight:900;letter-spacing:.7px;text-transform:uppercase;color:'+TC[tier]+'">'+cat.name+'</span><span style="font-size:9px;font-weight:800;color:'+TC[tier]+';opacity:.8">'+TLBL[tier]+'</span></div><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:.3px">'+cat.words.join('  ·  ')+'</div>';solved.appendChild(row);solvedCt++;msg(solvedCt===4?'All 4 found! 🎉':'Correct!','rgba(34,197,94,0.9)');if(solvedCt===4)finish(true);else refreshSub();},260);}else{var oneAway=votes.some(function(v){return v===3;});H.error&&H.error();s.forEach(function(b){b.classList.add('cn-shake');setTimeout(function(){b.classList.remove('cn-shake','cn-sel');},480);});setTimeout(refreshSub,500);lives--;refreshLives();msg(oneAway?'One away! 😬':'Not quite…','rgba(239,68,68,0.9)');if(lives<=0)setTimeout(function(){revealAll();finish(false);},700);}});
    function revealAll(){q.categories.forEach(function(cat){var tier=cat.tier,row=document.createElement('div');row.style.cssText='background:'+TBG[tier]+';border:1.5px solid '+TBD[tier]+';border-radius:10px;padding:9px 12px;margin-bottom:4px';row.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:11px;font-weight:900;letter-spacing:.7px;text-transform:uppercase;color:'+TC[tier]+'">'+cat.name+'</span><span style="font-size:9px;font-weight:800;color:'+TC[tier]+';opacity:.8">'+TLBL[tier]+'</span></div><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:.3px">'+cat.words.join('  ·  ')+'</div>';solved.appendChild(row);});while(grid.firstChild)grid.removeChild(grid.firstChild);msg('Here are the groups:','rgba(255,255,255,0.35)');}
    function finish(won){done=true;subBtn.disabled=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('connections');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.streak&&H.streak();ctx.flashEl.className='flash green show';ctx.spawnConfetti(20);}else ctx.flashEl.className='flash red show';setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Sharp! All 4 groups found.':'Connections: '+q.categories.map(function(c){return c.name;}).join(' / ');expEl.classList.add('show');}ctx.updateUI(data);var hintEl2=document.getElementById('hint-'+idx);setTimeout(function(){if(hintEl2)hintEl2.classList.add('show');},400);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    refreshLives();refreshSub();ctx.answerStartRef.set(Date.now());}
  });
})();
