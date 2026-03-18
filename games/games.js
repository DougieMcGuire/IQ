// games/games.js — Cebear Brain Games
// Pure interactive puzzles — no test-style Q&A

// ── Inject game styles ────────────────────────────────────────────────────────
(function(){
  if(document.getElementById('cg-styles'))return;
  var s=document.createElement('style');s.id='cg-styles';
  s.textContent=`
  /* ── Mini 2048 ── */
  .m48-wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;background:rgba(27,45,91,.55);padding:7px;border-radius:14px;width:min(228px,62vw);margin:4px auto;touch-action:none;user-select:none}
  .m48-cell{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:clamp(12px,3.4vw,18px);font-weight:900;background:rgba(240,234,214,.06);color:rgba(240,234,214,.18);transition:background .08s}
  .m48-cell[data-v="2"]{background:#3a7df2;color:#fff}
  .m48-cell[data-v="4"]{background:#6d4aed;color:#fff}
  .m48-cell[data-v="8"]{background:#e87d1a;color:#fff}
  .m48-cell[data-v="16"]{background:#e8443a;color:#fff}
  .m48-cell[data-v="32"]{background:#3fba4f;color:#fff;animation:pop .22s}
  .m48-cell[data-v="64"]{background:#e8a817;color:#1a1a2e}
  .m48-cell[data-v="128"]{background:#fff;color:#1b2d5b;font-size:clamp(9px,2.5vw,13px)}
  .m48-scores{display:flex;gap:8px;justify-content:center}
  .m48-sbox{background:rgba(240,234,214,.08);border-radius:10px;padding:5px 14px;text-align:center}
  .m48-sl{font-size:9px;font-weight:900;letter-spacing:1px;color:rgba(240,234,214,.3);text-transform:uppercase}
  .m48-sv{font-size:17px;font-weight:900;color:var(--cream)}
  .m48-msg{font-size:13px;font-weight:800;text-align:center;min-height:18px;color:rgba(240,234,214,.5)}

  /* ── Water Sort ── */
  .ws2-wrap{display:flex;gap:clamp(6px,2vw,11px);justify-content:center;align-items:flex-end;margin:6px 0;flex-wrap:wrap}
  .ws2-tube-outer{display:flex;flex-direction:column;align-items:center;cursor:pointer;user-select:none}
  .ws2-tube{width:clamp(28px,7.5vw,38px);border:2.5px solid rgba(240,234,214,.16);border-top:none;border-radius:0 0 10px 10px;overflow:hidden;background:rgba(240,234,214,.03);transition:transform .15s,border-color .15s}
  .ws2-tube.ws2-sel{border-color:var(--gold);transform:translateY(-9px)}
  .ws2-tube.ws2-done{border-color:var(--green)}
  .ws2-layer{height:clamp(15px,4.2vw,21px);width:100%;transition:background .18s}
  .ws2-cap{width:clamp(13px,3.5vw,18px);height:4px;background:rgba(240,234,214,.08);border-radius:3px 3px 0 0;margin-bottom:-1px}
  .ws2-pours{font-size:11px;font-weight:700;text-align:center;color:rgba(240,234,214,.22);min-height:15px}
  .ws2-status{font-size:13px;font-weight:800;text-align:center;min-height:18px;color:rgba(240,234,214,.4)}

  /* ── Pipe Connect ── */
  .pc-grid{display:grid;gap:3px;background:rgba(27,45,91,.4);padding:5px;border-radius:10px;margin:4px auto}
  .pc-cell{aspect-ratio:1;background:rgba(240,234,214,.05);border-radius:5px;position:relative;cursor:pointer;user-select:none;transition:background .1s;overflow:hidden}
  .pc-cell:active{background:rgba(240,234,214,.12)}
  .pc-cell.pc-wall{background:rgba(27,45,91,.3);cursor:default;pointer-events:none}
  .pc-cell.pc-src{background:rgba(63,186,79,.18)}
  .pc-cell.pc-snk{background:rgba(232,68,58,.18)}
  .pc-cell.pc-lit .pc-arm,.pc-cell.pc-lit .pc-dot{background:var(--green)!important}
  .pc-cell.pc-src.pc-lit{background:rgba(63,186,79,.3)}
  .pc-arm{position:absolute;background:rgba(240,234,214,.28);border-radius:2px;pointer-events:none}
  .pc-arm.pn{width:26%;height:51%;left:37%;top:0}
  .pc-arm.ps{width:26%;height:51%;left:37%;bottom:0;top:auto}
  .pc-arm.pe{height:26%;width:51%;top:37%;right:0;left:auto}
  .pc-arm.pw{height:26%;width:51%;top:37%;left:0}
  .pc-dot{position:absolute;width:30%;height:30%;border-radius:50%;background:rgba(240,234,214,.35);top:35%;left:35%;pointer-events:none}
  .pc-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;pointer-events:none;font-weight:900}
  .pc-status{font-size:13px;font-weight:800;text-align:center;min-height:18px;color:rgba(240,234,214,.4)}
  .pc-moves{font-size:11px;font-weight:700;text-align:center;color:rgba(240,234,214,.22)}

  /* ── Word Ladder ── */
  .wl-endpoints{display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 2px;margin:4px 0}
  .wl-ep-box{text-align:center}
  .wl-ep-lbl{font-size:9px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;color:rgba(240,234,214,.28);margin-bottom:3px}
  .wl-ep-tiles{display:flex;gap:3px}
  .wl-ep-tile{width:clamp(22px,6vw,30px);height:clamp(22px,6vw,30px);border-radius:6px;background:rgba(240,234,214,.09);display:flex;align-items:center;justify-content:center;font-size:clamp(10px,3vw,14px);font-weight:900;color:rgba(240,234,214,.45)}
  .wl-arrow{font-size:20px;color:rgba(240,234,214,.15);align-self:center}
  .wl-current{display:flex;gap:5px;justify-content:center;margin:6px 0}
  .wl-cur-tile{width:clamp(28px,7.5vw,38px);height:clamp(28px,7.5vw,38px);border-radius:8px;background:rgba(240,234,214,.1);border:2px solid rgba(240,234,214,.2);display:flex;align-items:center;justify-content:center;font-size:clamp(13px,3.5vw,17px);font-weight:900;color:var(--cream);cursor:pointer;transition:all .12s}
  .wl-cur-tile.wl-sel{background:rgba(232,168,23,.2);border-color:var(--gold);color:var(--gold)}
  .wl-cur-tile.wl-match{background:rgba(63,186,79,.15);border-color:var(--green);color:var(--green);pointer-events:none}
  .wl-alpha{display:flex;flex-wrap:wrap;justify-content:center;gap:3px;margin:4px 0;max-width:272px}
  .wl-lbtn{width:clamp(19px,5.2vw,27px);height:clamp(19px,5.2vw,27px);border:none;border-radius:5px;background:rgba(240,234,214,.1);color:var(--cream);font-family:'Nunito',sans-serif;font-size:clamp(8px,2.5vw,11px);font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .08s;padding:0}
  .wl-lbtn:active{background:rgba(240,234,214,.25);transform:translateY(1px)}
  .wl-lbtn.wl-same{background:rgba(240,234,214,.04);color:rgba(240,234,214,.18);pointer-events:none}
  .wl-moves{font-size:12px;font-weight:800;text-align:center;color:rgba(240,234,214,.3);min-height:16px}
  .wl-status{font-size:13px;font-weight:800;text-align:center;min-height:18px}
  .wl-hist{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:2px 0;min-height:16px}
  .wl-hist-w{font-size:10px;font-weight:800;color:rgba(240,234,214,.2);padding:2px 6px;background:rgba(240,234,214,.05);border-radius:4px}

  /* ── Connections ── */
  .conn-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;width:100%}
  .conn-word{border:none;border-radius:8px;padding:clamp(7px,2vw,11px) 4px;font-family:'Nunito',sans-serif;font-size:clamp(9px,2.2vw,11px);font-weight:900;cursor:pointer;text-align:center;background:rgba(240,234,214,.1);color:var(--cream);transition:all .12s;user-select:none;line-height:1.2;word-break:break-word}
  .conn-word.conn-sel{background:rgba(240,234,214,.3);transform:translateY(-2px);box-shadow:0 4px 10px rgba(0,0,0,.2)}
  .conn-word.conn-done{pointer-events:none;opacity:0;height:0;padding:0;overflow:hidden;border:0;transition:all .25s}
  .conn-word.conn-shake{animation:shake .4s}
  .conn-cat{border-radius:10px;padding:9px 6px;display:flex;flex-direction:column;align-items:center;gap:2px;grid-column:span 4;animation:pop .3s}
  .conn-cat-nm{font-size:10px;font-weight:900;letter-spacing:.8px;text-transform:uppercase}
  .conn-cat-wds{font-size:11px;font-weight:700;opacity:.85;text-align:center}
  .conn-lives{display:flex;gap:5px;justify-content:center;margin:2px 0}
  .conn-dot{width:11px;height:11px;border-radius:50%;background:var(--gold);transition:background .3s}
  .conn-dot.gone{background:rgba(240,234,214,.12)}
  .conn-sub{background:rgba(240,234,214,.1);color:var(--cream);border:2px solid rgba(240,234,214,.2);border-radius:12px;padding:9px 26px;font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;cursor:pointer;transition:all .1s;margin-top:2px}
  .conn-sub:active{transform:translateY(2px)}
  .conn-sub:disabled{opacity:.3;pointer-events:none}
  .conn-sub.ready{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 3px 0 var(--gd)}
  .conn-msg{font-size:12px;font-weight:800;text-align:center;min-height:16px;color:rgba(240,234,214,.4)}

  /* ── Branding pill ── */
  .game-branding{width:100%;display:flex;justify-content:center;margin-top:8px;padding-top:10px;border-top:1px solid rgba(240,234,214,.06)}
  .game-branding a{display:inline-flex;align-items:center;gap:5px;background:rgba(240,234,214,.07);border:1px solid rgba(240,234,214,.12);border-radius:20px;padding:5px 12px 5px 8px;text-decoration:none;transition:all .15s}
  .game-branding a:active{transform:scale(.96)}
  .game-branding-bear{width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
  .game-branding-bear img{width:20px;height:20px;object-fit:contain}
  .game-branding-text{font-size:11px;font-weight:900;color:rgba(240,234,214,.5);letter-spacing:1.5px;text-transform:uppercase}

  /* ── Scroll hint ── */
  .scroll-hint{position:absolute;bottom:14px;left:0;right:0;font-size:13px;font-weight:900;display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity .4s;pointer-events:none;opacity:0}
  .scroll-hint.show{opacity:1}
  .scroll-hint-inner{display:flex;align-items:center;gap:7px;background:rgba(240,234,214,.1);border:1px solid rgba(240,234,214,.15);border-radius:20px;padding:7px 16px;color:var(--cream)}
  .scroll-hint-inner svg{width:16px;height:16px;stroke:var(--gold);fill:none;stroke-width:2.8;animation:bounce 1.2s infinite}
  .scroll-hint-inner span{font-size:12px;font-weight:900;color:rgba(240,234,214,.7);letter-spacing:.3px}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
  `;
  document.head.appendChild(s);
})();

// ── Branding helper ───────────────────────────────────────────────────────────
function _gameBranding(){
  return '<div class="game-branding"><a href="https://cebear.com" target="_blank" rel="noopener">'+
    '<div class="game-branding-bear"><img src="logo.png" alt=""></div>'+
    '<span class="game-branding-text">cebear.com</span>'+
    '</a></div>';
}

// ── Scroll hint helper ────────────────────────────────────────────────────────
function _scrollHint(idx){
  return '<div class="scroll-hint" id="hint-'+idx+'">'+
    '<div class="scroll-hint-inner">'+
    '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>'+
    '<span>Swipe for next</span>'+
    '</div></div>';
}

// ── Matrix Logic (visual, kept) ───────────────────────────────────────────────
(function () {
  Q.register('matrix', function () {
    var type=Q.rand(0,7),grid,ans,why,d;
    if(type===0){var sum=Q.rand(12,27),a=Q.rand(2,8),b=Q.rand(2,8),c=sum-a-b,dd=Q.rand(2,8),e=Q.rand(2,8),f=sum-dd-e,g=Q.rand(2,8),h=Q.rand(2,8);ans=sum-g-h;grid=[a,b,c,dd,e,f,g,h,'?'];why='Each row sums to '+sum+'. '+g+'+'+h+'+?='+sum;d=1.2;}
    else if(type===1){var add=Q.rand(2,6),r=[Q.rand(1,7),Q.rand(1,7),Q.rand(1,7)];grid=[r[0],r[1],r[2],r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];ans=r[2]+add*2;why='Each column +'+add+' per row.';d=1.1;}
    else if(type===2){var a=Q.rand(2,5),b=Q.rand(2,5),dd=Q.rand(2,5),e=Q.rand(2,5),g=Q.rand(2,5),h=Q.rand(2,5);grid=[a,b,a*b,dd,e,dd*e,g,h,'?'];ans=g*h;why='Each row: col1 × col2 = col3. '+g+'×'+h+'='+ans;d=1.3;}
    else if(type===3){var m=2,a=Q.rand(2,5),b=Q.rand(2,5),c=Q.rand(2,5);grid=[a,b,c,a*m,b*m,c*m,a*m*m,b*m*m,'?'];ans=c*m*m;why='Each row ×'+m+'.';d=1.1;}
    else if(type===4){var a=Q.rand(2,6),add=Q.rand(1,4);grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?'];ans=a+add*2+2;why='+1 across, +'+add+' down.';d=1.2;}
    else if(type===5){var colSum=Q.rand(12,20),a=Q.rand(2,6),dd=Q.rand(2,6),g=colSum-a-dd,b=Q.rand(2,6),e=Q.rand(2,6),h=colSum-b-e,c=Q.rand(2,6),f=Q.rand(2,6);ans=colSum-c-f;grid=[a,b,c,dd,e,f,g,h,'?'];why='Each column sums to '+colSum+'.';d=1.3;}
    else if(type===6){var a=Q.rand(2,9),c=Q.rand(2,9),dd=Q.rand(2,9),f=Q.rand(2,9),e=Math.round((dd+f)/2),g=Q.rand(2,9),i=Q.rand(2,9);ans=Math.round((g+i)/2);grid=[a,Math.round((a+c)/2),c,dd,e,f,g,'?',i];why='Middle = average of first and last in each row.';d=1.5;}
    else{var diag=Q.rand(10,20),a=Q.rand(2,7),e=Q.rand(2,7),c=Q.rand(2,7),g=Q.rand(2,7);ans=diag-c-g;var b=Q.rand(2,7),d2=Q.rand(2,7),f=Q.rand(2,7),h=Q.rand(2,7);grid=[a,b,c,d2,e,f,g,h,'?'];why='Main diagonal sums to '+diag+'.';d=1.6;}
    return {type:'matrix',category:'patternRecognition',categoryLabel:'Matrix Logic',difficulty:d||1.3,question:'Find the missing number',grid:grid,answer:String(ans),options:Q.numOpts(ans).map(String),explanation:why,visual:'matrix'};
  }, 3);
})();

// ── Riddles (kept — classic brain puzzle) ────────────────────────────────────
(function () {
  Q.register('riddle', function () {
    var items=[
      {q:'I have hands but cannot clap. What am I?',a:'A clock',w:['A person','A robot','A tree'],why:'Clock hands tell time.',d:0.6},{q:'What has keys but no locks?',a:'A piano',w:['A door','A car','A safe'],why:'Piano has musical keys.',d:0.6},{q:'What gets wetter the more it dries?',a:'A towel',w:['A sponge','Paper','The sun'],why:'Towels absorb water as they dry things.',d:0.7},{q:'What has a head and tail but no body?',a:'A coin',w:['A snake','A fish','A ghost'],why:'Coins have heads and tails.',d:0.7},{q:'What can you catch but not throw?',a:'A cold',w:['A ball','A fish','A wave'],why:'You catch a cold.',d:0.7},{q:'What has teeth but cannot bite?',a:'A comb',w:['A shark','A dog','A saw'],why:'A comb has teeth for hair.',d:0.6},{q:'What goes up but never comes down?',a:'Your age',w:['A balloon','A bird','Smoke'],why:'Age only increases.',d:0.7},{q:'What has one eye but cannot see?',a:'A needle',w:['A pirate','A cyclops','A camera'],why:'Needle eye holds thread.',d:0.7},{q:'What has words but never speaks?',a:'A book',w:['A parrot','A phone','A radio'],why:'Books have words but cannot talk.',d:0.6},{q:'What runs but never walks?',a:'Water',w:['A dog','A car','Time'],why:'Water runs and flows.',d:0.7},{q:'The more you take, the more you leave behind. What?',a:'Footsteps',w:['Money','Time','Breath'],why:'Walking leaves footsteps.',d:1.0},{q:'What can fill a room but takes no space?',a:'Light',w:['Air','Water','Sound'],why:'Light fills space with no mass.',d:1.0},{q:'What can travel the world while staying in a corner?',a:'A stamp',w:['A compass','The internet','A satellite'],why:'Stamps stay in envelope corners.',d:1.0},{q:'I have cities but no houses, mountains but no trees. What am I?',a:'A map',w:['A planet','A dream','A story'],why:'Maps show geography without real objects.',d:1.0},{q:'The more there is, the less you see. What am I?',a:'Darkness',w:['Light','Fog','Space'],why:'More darkness = less visibility.',d:1.0},{q:'I speak without a mouth and hear without ears. What am I?',a:'An echo',w:['A ghost','Music','The wind'],why:'Echoes are sound reflections.',d:1.1},{q:'The more you remove from me, the bigger I get. What am I?',a:'A hole',w:['A balloon','A shadow','A debt'],why:'Removing material makes a hole bigger.',d:1.1},{q:'What is so fragile that saying its name breaks it?',a:'Silence',w:['Glass','A dream','A secret'],why:'Speaking breaks silence.',d:1.3},{q:'I have no life but I can die. What am I?',a:'A battery',w:['A robot','A flame','A ghost'],why:'Batteries die when drained.',d:1.3},{q:'What gets sharper the more you use it?',a:'Your mind',w:['A knife','A pencil','A saw'],why:'Mental ability sharpens with practice.',d:1.2},{q:"I'm light as a feather but the strongest man can't hold me for 5 minutes.",a:'Your breath',w:['Air','A thought','A cloud'],why:"Nobody can hold their breath that long.",d:1.2},{q:'What has 13 hearts but no other organs?',a:'A deck of cards',w:['A hospital','A town','A garden'],why:'13 hearts in the suit.',d:1.4},{q:'What tastes better than it smells?',a:'Your tongue',w:['Coffee','Perfume','Bacon'],why:'Your tongue tastes but cannot smell.',d:1.5},{q:"The person who makes it doesn't need it. The buyer doesn't use it. The user doesn't know it.",a:'A coffin',w:['A pill','A gift','A trap'],why:'Coffins: made, bought, and used this way.',d:1.5}
    ];
    var i=Q.pick(items);
    return {type:'riddle',category:'problemSolving',categoryLabel:'Riddle',difficulty:i.d||1.1,question:i.q,answer:i.a,options:Q.shuffle([i.a].concat(i.w)),explanation:i.why,visual:'text'};
  }, 3);
})();

// ── Wordle ────────────────────────────────────────────────────────────────────
(function () {
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
    render:function(q,idx){var grid='';for(var r=0;r<6;r++){var row='';for(var c=0;c<5;c++)row+='<div class="wordle-tile" id="wt-'+idx+'-'+r+'-'+c+'"></div>';grid+='<div class="wordle-row" style="gap:3px">'+row+'</div>';}var kb=KB_ROWS.map(function(row){return'<div class="wordle-kb-row" style="gap:3px">'+row.map(function(k){return'<button class="wk'+(k==='ENTER'||k==='⌫'?' wide':'')+'" data-wk="'+k+'" data-wi="'+idx+'">'+k+'</button>';}).join('')+'</div>';}).join('');return'<div class="qcard" style="gap:3px;padding:6px 8px;overflow-y:auto"><div class="category">🟩 Wordle</div><div class="question" style="font-size:clamp(11px,2.8vw,13px);margin:0">Guess the 5-letter word</div><div class="wordle-grid" style="gap:3px">'+grid+'</div><div class="wordle-msg" id="wm-'+idx+'"></div><div class="wordle-kb" style="gap:3px">'+kb+'</div><div id="wa-'+idx+'"></div><div class="explain" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
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
(function () {
  var DIFFS=[0.6,1.0,1.5],LABELS=['Easy','Medium','Hard'];
  Q.register('ticTacToe',function(){var tier=this.rand(0,2);return{type:'ticTacToe',category:'problemSolving',categoryLabel:'Tic Tac Toe',difficulty:DIFFS[tier],question:'Beat the bot! ('+LABELS[tier]+')',answer:'win',options:[],explanation:'',visual:'ticTacToe',botLevel:tier};},3);
  Q.registerRenderer('ticTacToe',{
    render:function(q,idx){var cells='';for(var i=0;i<9;i++)cells+='<button class="ttt-cell" data-ti="'+idx+'" data-tc="'+i+'"></button>';return'<div class="qcard" style="gap:10px"><div class="category">❌ Tic Tac Toe</div><div class="question">'+q.question+'</div><div class="ttt-status" id="ttt-status-'+idx+'">Your turn (X)</div><div class="ttt-grid" id="ttt-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explain" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>'+_scrollHint(idx);},
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
(function () {
  var EMOJIS=['🐻','🧠','⚡','🔥','🎯','💡','🌟','🎪','🎨','🎮','🏆','💎','🚀','🌈','🎵','🍕'];
  Q.register('memory',function(){var size=Q.rand(0,2),pairs=[3,4,6][size],picks=Q.shuffle(EMOJIS.slice()).slice(0,pairs),cards=Q.shuffle(picks.concat(picks));return{type:'memory',category:'memory',categoryLabel:'Memory Match',difficulty:[0.7,1.1,1.5][size],question:'Find all matching pairs!',cards:cards,pairs:pairs,answer:'complete',options:[],explanation:'Memory training strengthens recall.',visual:'custom'};},3);
  Q.registerRenderer('memory',{
    render:function(q,idx){var cols=q.pairs<=3?3:4,cells='';for(var i=0;i<q.cards.length;i++)cells+='<button class="mem-card" data-mi="'+idx+'" data-mc="'+i+'" data-mv="'+q.cards[i]+'"><span class="mem-front">?</span><span class="mem-back">'+q.cards[i]+'</span></button>';return'<div class="qcard" style="gap:10px"><div class="category">🧠 Memory Match</div><div class="question">'+q.question+'</div><div class="mem-status" id="mem-status-'+idx+'">Tap to flip</div><div class="mem-grid mem-cols-'+cols+'" id="mem-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#mem-grid-'+idx),status=slideEl.querySelector('#mem-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var flipped=[],matched=0,moves=0,locked=false,totalPairs=q.pairs;grid.addEventListener('click',function(e){var btn=e.target.closest('.mem-card');if(!btn||locked||btn.classList.contains('mem-flip')||btn.classList.contains('mem-matched'))return;H.cardFlip&&H.cardFlip();btn.classList.add('mem-flip');flipped.push(btn);if(flipped.length===2){moves++;locked=true;var a=flipped[0],b=flipped[1];if(a.dataset.mv===b.dataset.mv){setTimeout(function(){H.cardMatch&&H.cardMatch();},150);a.classList.add('mem-matched');b.classList.add('mem-matched');matched++;flipped=[];locked=false;if(matched===totalPairs){finish(true);}else{status.textContent=matched+'/'+totalPairs+' pairs';}}else{setTimeout(function(){H.light&&H.light();},300);setTimeout(function(){a.classList.remove('mem-flip');b.classList.remove('mem-flip');flipped=[];locked=false;},600);}}});
    function finish(won){var ms=Date.now()-ctx.answerStartRef.get(),perfect=moves<=totalPairs+1,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('memory');if(ctx.onAnswer)ctx.onAnswer(won,ms);perfect?(H.streak&&H.streak()):(H.success&&H.success());status.textContent='Done in '+moves+' moves!';status.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?25:10);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Perfect memory! 🎯':'Solved in '+moves+' moves';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Simon Says ────────────────────────────────────────────────────────────────
(function () {
  var COLORS=['#e8443a','#3fba4f','#e8a817','#3a7df2'];
  Q.register('simon',function(){return{type:'simon',category:'memory',categoryLabel:'Simon Says',difficulty:1.2,question:'Repeat the pattern!',answer:'complete',options:[],explanation:'Working memory and pattern repetition.',visual:'custom'};},3);
  Q.registerRenderer('simon',{
    render:function(q,idx){var pads='';for(var i=0;i<4;i++)pads+='<button class="simon-pad" data-si="'+idx+'" data-sc="'+i+'" style="background:'+COLORS[i]+'"></button>';return'<div class="qcard" style="gap:10px"><div class="category">🔴 Simon Says</div><div class="question">'+q.question+'</div><div class="simon-level" id="simon-level-'+idx+'">Level 1</div><div class="simon-grid" id="simon-grid-'+idx+'">'+pads+'</div><div class="simon-status" id="simon-status-'+idx+'">Watch the pattern...</div><div id="simon-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0"><button id="simon-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#simon-grid-'+idx),status=slideEl.querySelector('#simon-status-'+idx),levelEl=slideEl.querySelector('#simon-level-'+idx),readyWrap=slideEl.querySelector('#simon-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#simon-ready-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var sequence=[],playerSeq=[],level=0,accepting=false,done=false,maxLevel=5;function getPad(i){return grid.querySelector('[data-sc="'+i+'"]');}function flashPad(i,dur){var p=getPad(i);if(!p)return;p.classList.add('simon-lit');setTimeout(function(){p.classList.remove('simon-lit');},dur||400);}function playSequence(){accepting=false;status.textContent='Watch the pattern...';var delay=600;sequence.forEach(function(c,i){setTimeout(function(){H.light&&H.light();flashPad(c,350);},delay+i*600);});setTimeout(function(){accepting=true;status.textContent='Your turn! Repeat it.';playerSeq=[];},delay+sequence.length*600);}readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';ctx.answerStartRef.set(Date.now());nextLevel();});function nextLevel(){level++;levelEl.textContent='Level '+level;sequence.push(Math.floor(Math.random()*4));playSequence();}grid.addEventListener('click',function(e){var btn=e.target.closest('.simon-pad');if(!btn||!accepting||done)return;var ci=parseInt(btn.dataset.sc);H.medium&&H.medium();flashPad(ci,200);playerSeq.push(ci);var pos=playerSeq.length-1;if(playerSeq[pos]!==sequence[pos]){done=true;accepting=false;H.error&&H.error();status.textContent='Wrong! Got to level '+level;finish(false);return;}if(playerSeq.length===sequence.length){if(level>=maxLevel){done=true;accepting=false;H.success&&H.success();status.textContent='You beat it! 🎉';finish(true);}else{status.textContent='Level '+level+' done! ✓';setTimeout(nextLevel,800);}}});
    function finish(won){var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('simon');if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){ctx.flashEl.className='flash green show';ctx.spawnConfetti(20);}else{ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Excellent memory! All 5 levels!':'Reached level '+level+'. Keep training!';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Reaction Time ─────────────────────────────────────────────────────────────
(function () {
  Q.register('reaction',function(){return{type:'reaction',category:'mentalAgility',categoryLabel:'Reaction Time',difficulty:1.0,question:'Tap as soon as the circle turns GREEN!',answer:'complete',options:[],explanation:'Tests your reaction speed.',visual:'custom'};},3);
  Q.registerRenderer('reaction',{
    render:function(q,idx){return'<div class="qcard" style="gap:10px"><div class="category">⚡ Reaction Time</div><div class="question">Tap GREEN as fast as you can!</div><div id="react-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:8px 0"><button id="react-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:14px 36px;font-family:Nunito,sans-serif;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div class="react-zone" id="react-zone-'+idx+'" style="display:none"><div class="react-circle" id="react-circle-'+idx+'">Wait...</div></div><div class="react-result" id="react-result-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var readyWrap=slideEl.querySelector('#react-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#react-ready-'+idx),zone=slideEl.querySelector('#react-zone-'+idx),circle=slideEl.querySelector('#react-circle-'+idx),result=slideEl.querySelector('#react-result-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!circle)return;var state='idle',goTime=0,timer=null,done=false;readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';zone.style.display='flex';state='waiting';ctx.answerStartRef.set(Date.now());var delay=1500+Math.random()*2500;timer=setTimeout(function(){if(done)return;state='go';goTime=Date.now();H.nudge&&H.nudge();circle.classList.add('react-go');circle.textContent='TAP!';},delay);});circle.addEventListener('click',function(){if(done||state==='idle')return;if(state==='waiting'){done=true;clearTimeout(timer);H.error&&H.error();circle.classList.add('react-fail');circle.textContent='Too early!';result.textContent='Wait for green next time';result.style.color='var(--red)';finish(false,0);}else if(state==='go'){done=true;var rms=Date.now()-goTime,good=rms<400,great=rms<250;H.reactionTap&&H.reactionTap();circle.classList.remove('react-go');circle.classList.add(good?'react-success':'react-slow');circle.textContent=rms+'ms';result.textContent=great?'Lightning fast! ⚡':good?'Nice reflexes!':'A bit slow, try again!';result.style.color=good?'var(--green)':'var(--gold)';finish(good,rms);}});
    function finish(won,ms){var totalMs=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,totalMs);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('reaction');if(ctx.onAnswer)ctx.onAnswer(won,totalMs);if(won){setTimeout(function(){ms<250?(H.streak&&H.streak()):(H.success&&H.success());},120);ctx.flashEl.className='flash green show';ctx.spawnConfetti(ms<250?20:8);}else{ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=ms>0?'Your reaction: '+ms+'ms. Average is ~250ms.':'Patience is key!';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Word Scramble ─────────────────────────────────────────────────────────────
(function () {
  var WORDS={easy:[{w:'BRAIN',h:'Think with it'},{w:'SMART',h:'Opposite of dumb'},{w:'LIGHT',h:'Turn it on'},{w:'QUICK',h:'Very fast'},{w:'HEART',h:'Beats in your chest'},{w:'DREAM',h:'Happens when you sleep'},{w:'OCEAN',h:'Big body of water'},{w:'HAPPY',h:'Feeling of joy'},{w:'MUSIC',h:'Melody and rhythm'},{w:'DANCE',h:'Move to the beat'},{w:'TIGER',h:'Striped big cat'},{w:'GRAPE',h:'Small purple fruit'},{w:'STORM',h:'Thunder and lightning'},{w:'RIVER',h:'Flowing water'},{w:'CANDY',h:'Sweet treat'}],medium:[{w:'PUZZLE',h:'Brain teaser'},{w:'GENIUS',h:'Very smart person'},{w:'ROCKET',h:'Goes to space'},{w:'FROZEN',h:'Turned to ice'},{w:'MYSTIC',h:'Mysterious'},{w:'BRIDGE',h:'Crosses a gap'},{w:'JUNGLE',h:'Dense forest'},{w:'GALAXY',h:'Stars and planets'},{w:'TROPHY',h:'Winner gets one'},{w:'ZOMBIE',h:'Undead creature'},{w:'KNIGHT',h:'Medieval warrior'},{w:'WHISPER',h:'Speak very softly'}],hard:[{w:'QUANTUM',h:'Physics of the very small'},{w:'PARADOX',h:'Contradicts itself'},{w:'PHOENIX',h:'Rises from ashes'},{w:'ECLIPSE',h:'Sun or moon blocked'},{w:'ALCHEMY',h:'Medieval chemistry'},{w:'TSUNAMI',h:'Giant ocean wave'},{w:'CRYPTIC',h:'Hard to understand'},{w:'LABYRINTH',h:'Complex maze'},{w:'SYMPHONY',h:'Orchestral composition'}]};
  Q.register('wordScramble',function(){var tier=['easy','medium','hard'][Q.rand(0,2)],item=Q.pick(WORDS[tier]),word=item.w,sc;do{sc=Q.shuffle(word.split('')).join('');}while(sc===word);return{type:'wordScramble',category:'verbalReasoning',categoryLabel:'Word Scramble',difficulty:{easy:0.7,medium:1.1,hard:1.5}[tier],question:'Unscramble the word!',scrambled:sc,word:word,hint:item.h,answer:word,options:[],explanation:'Hint: '+item.h,visual:'custom'};},3);
  Q.registerRenderer('wordScramble',{
    render:function(q,idx){var srct='',anst='';for(var i=0;i<q.scrambled.length;i++)srct+='<button class="ws-tile ws-src" data-wi="'+idx+'" data-wc="'+i+'" data-wl="'+q.scrambled[i]+'">'+q.scrambled[i]+'</button>';for(var j=0;j<q.word.length;j++)anst+='<div class="ws-tile ws-slot" data-wi="'+idx+'" data-ws="'+j+'"></div>';return'<div class="qcard" style="gap:10px"><div class="category">🔤 Word Scramble</div><div class="question">'+q.question+'</div><div class="ws-hint" id="ws-hint-'+idx+'">💡 '+q.hint+'</div><div class="ws-answer" id="ws-answer-'+idx+'">'+anst+'</div><div class="ws-source" id="ws-source-'+idx+'">'+srct+'</div><div class="ws-status" id="ws-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var sourceEl=slideEl.querySelector('#ws-source-'+idx),answerEl=slideEl.querySelector('#ws-answer-'+idx),statusEl=slideEl.querySelector('#ws-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!sourceEl)return;var placed=[],done=false,slots=answerEl.querySelectorAll('.ws-slot');sourceEl.addEventListener('click',function(e){var btn=e.target.closest('.ws-src');if(!btn||done||btn.classList.contains('ws-used'))return;H.tilePop&&H.tilePop();btn.classList.add('ws-used');var letter=btn.dataset.wl;placed.push({letter:letter,btn:btn});slots[placed.length-1].textContent=letter;slots[placed.length-1].classList.add('ws-filled');if(placed.length===q.word.length){var attempt=placed.map(function(p){return p.letter;}).join('');if(attempt===q.word){finish(true);}else{H.wordleWrong&&H.wordleWrong();answerEl.classList.add('ws-shake');statusEl.textContent='Not quite! Try again.';statusEl.style.color='var(--red)';setTimeout(function(){answerEl.classList.remove('ws-shake');placed.forEach(function(p){p.btn.classList.remove('ws-used');});slots.forEach(function(s){s.textContent='';s.classList.remove('ws-filled');});placed=[];statusEl.textContent='';},700);}}});answerEl.addEventListener('click',function(e){var slot=e.target.closest('.ws-slot');if(!slot||done||!slot.classList.contains('ws-filled'))return;H.light&&H.light();var si=Array.from(slots).indexOf(slot);while(placed.length>si){var p=placed.pop();p.btn.classList.remove('ws-used');slots[placed.length].textContent='';slots[placed.length].classList.remove('ws-filled');}});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordScramble');if(ctx.onAnswer)ctx.onAnswer(won,ms);H.success&&H.success();slots.forEach(function(s){s.classList.add('ws-correct');});statusEl.textContent='Nice! 🎉';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=q.word+' — '+q.hint;expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Slide Puzzle ──────────────────────────────────────────────────────────────
(function () {
  Q.register('slidePuzzle',function(){var goal=[1,2,3,4,5,6,7,8,0],board;do{board=Q.shuffle(goal.slice());}while(!isSolvable(board)||boardEq(board,goal));function isSolvable(b){var inv=0;for(var i=0;i<9;i++)for(var j=i+1;j<9;j++)if(b[i]&&b[j]&&b[i]>b[j])inv++;return inv%2===0;}function boardEq(a,b){for(var i=0;i<9;i++)if(a[i]!==b[i])return false;return true;}return{type:'slidePuzzle',category:'problemSolving',categoryLabel:'Slide Puzzle',difficulty:1.3,question:'Slide tiles to order 1-8!',board:board,answer:'complete',options:[],explanation:'Spatial reasoning & planning.',visual:'custom'};},3);
  Q.registerRenderer('slidePuzzle',{
    render:function(q,idx){var cells='';for(var i=0;i<9;i++){var v=q.board[i];cells+='<button class="slide-cell'+(v===0?' slide-empty':'')+'" data-si="'+idx+'" data-sc="'+i+'">'+(v||'')+'</button>';}return'<div class="qcard" style="gap:10px"><div class="category">🧩 Slide Puzzle</div><div class="question">'+q.question+'</div><div class="slide-moves" id="slide-moves-'+idx+'">Moves: 0</div><div class="slide-grid" id="slide-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var grid=slideEl.querySelector('#slide-grid-'+idx),movesEl=slideEl.querySelector('#slide-moves-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!grid)return;var board=q.board.slice(),moves=0,done=false,goal=[1,2,3,4,5,6,7,8,0];grid.addEventListener('click',function(e){var btn=e.target.closest('.slide-cell');if(!btn||done)return;var ci=parseInt(btn.dataset.sc),blank=board.indexOf(0),canMove=false;if(ci===blank-1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank+1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank-3||ci===blank+3)canMove=true;if(!canMove){H.light&&H.light();return;}H.medium&&H.medium();board[blank]=board[ci];board[ci]=0;moves++;movesEl.textContent='Moves: '+moves;var cells=grid.querySelectorAll('.slide-cell');for(var i=0;i<9;i++){cells[i].textContent=board[i]||'';cells[i].className='slide-cell'+(board[i]===0?' slide-empty':'');cells[i].dataset.sc=i;}var won=true;for(var j=0;j<9;j++)if(board[j]!==goal[j]){won=false;break;}if(won)finish();});
    function finish(){done=true;var ms=Date.now()-ctx.answerStartRef.get(),optimal=moves<=25,data=ctx.IQData.recordAnswer(q.category,true,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('slidePuzzle');if(ctx.onAnswer)ctx.onAnswer(true,ms);optimal?(H.streak&&H.streak()):(H.success&&H.success());movesEl.textContent='Solved in '+moves+' moves!';movesEl.style.color='var(--green)';grid.querySelectorAll('.slide-cell').forEach(function(c){if(c.textContent)c.classList.add('slide-win');});ctx.flashEl.className='flash green show';ctx.spawnConfetti(optimal?25:12);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=optimal?'Efficient solver! 🧠':'Solved in '+moves+' moves. Optimal is ~22.';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Color Sort ────────────────────────────────────────────────────────────────
(function () {
  var PALETTES=[{name:'Rainbow',colors:['#FF0000','#FF7700','#FFDD00','#00CC44','#0066FF','#8833FF'],labels:['Red','Orange','Yellow','Green','Blue','Purple']},{name:'Warm\u2192Cool',colors:['#FF2200','#FF6600','#FFAA00','#44BBFF','#2266FF','#1133AA'],labels:['Hot Red','Orange','Warm','Sky','Blue','Deep Blue']},{name:'Light\u2192Dark',colors:['#FFFFFF','#CCCCCC','#999999','#666666','#333333','#111111'],labels:['White','Light','Silver','Gray','Dark','Black']}];
  Q.register('colorSort',function(){var size=Q.rand(0,1),pal=Q.pick(PALETTES),count=size===0?4:6,correct=pal.colors.slice(0,count),labels=pal.labels.slice(0,count),scrambled=Q.shuffle(correct.map(function(c,i){return{color:c,label:labels[i],idx:i};}));return{type:'colorSort',category:'patternRecognition',categoryLabel:'Color Sort',difficulty:size===0?0.7:1.1,question:'Sort '+pal.name+' in order!',scrambled:scrambled,correctOrder:correct,answer:'complete',options:[],explanation:'Visual pattern recognition.',visual:'custom'};},3);
  Q.registerRenderer('colorSort',{
    render:function(q,idx){var tiles='';for(var i=0;i<q.scrambled.length;i++){var s=q.scrambled[i];var light=['#FFFFFF','#CCCCCC','#FFDD00','#FFAA00','#44BBFF','#FF7700'];var tc=light.indexOf(s.color)!==-1?'#333':'#fff';var bs=s.color==='#FFFFFF'?'border:2px solid #999;':'';tiles+='<button class="csort-tile" data-orig-idx="'+s.idx+'" style="background:'+s.color+';color:'+tc+';'+bs+'">'+s.label+'</button>';}return'<div class="qcard" style="gap:10px"><div class="category">\uD83C\uDFA8 Color Sort</div><div class="question">'+q.question+'</div><div class="csort-status" id="csort-status-'+idx+'">Tap colors in order (1st \u2192 last)</div><div class="csort-placed" id="csort-placed-'+idx+'"></div><div class="csort-pool" id="csort-pool-'+idx+'">'+tiles+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var pool=slideEl.querySelector('#csort-pool-'+idx),placed=slideEl.querySelector('#csort-placed-'+idx),statusEl=slideEl.querySelector('#csort-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!pool)return;var placedOrder=[],done=false;pool.addEventListener('click',function(e){var btn=e.target.closest('.csort-tile');if(!btn||done||btn.classList.contains('csort-used'))return;H.medium&&H.medium();btn.classList.add('csort-used');var oi=parseInt(btn.dataset.origIdx);placedOrder.push(oi);var div=document.createElement('div');div.className='csort-placed-tile';div.style.background=btn.style.background;if(btn.style.background==='rgb(255, 255, 255)')div.style.border='2px solid #999';placed.appendChild(div);statusEl.textContent=placedOrder.length+'/'+q.correctOrder.length+' placed';if(placedOrder.length===q.correctOrder.length){var won=true;for(var k=0;k<placedOrder.length;k++)if(placedOrder[k]!==k){won=false;break;}finish(won);}});
    function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.success&&H.success();statusEl.textContent='Perfect!';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}else{H.error&&H.error();statusEl.textContent='Wrong order!';statusEl.style.color='var(--red)';ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){var sl=q.scrambled.slice().sort(function(a,b){return a.idx-b.idx;}).map(function(s){return s.label;});expEl.textContent=won?'Colors sorted correctly!':'Correct: '+sl.join(' \u2192 ');expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Math Rush ─────────────────────────────────────────────────────────────────
(function () {
  Q.register('mathRush',function(){var eqs=[];for(var i=0;i<5;i++){var a=Q.rand(2,20),b=Q.rand(2,20),op=['+','-','\xD7'][Q.rand(0,2)],real;if(op==='+')real=a+b;else if(op==='-'){if(a<b){var t=a;a=b;b=t;}real=a-b;}else real=a*b;var isTrue=Math.random()>0.4,shown=isTrue?real:real+(Q.rand(0,1)?Q.rand(1,5):-Q.rand(1,5));if(shown===real)isTrue=true;eqs.push({text:a+' '+op+' '+b+' = '+shown,correct:isTrue});}return{type:'mathRush',category:'mentalAgility',categoryLabel:'Math Rush',difficulty:1.0,question:'True or False? (5 rounds, 5s each!)',equations:eqs,answer:'complete',options:[],explanation:'Speed + accuracy = brain power.',visual:'custom'};},3);
  Q.registerRenderer('mathRush',{
    render:function(q,idx){return'<div class="qcard" style="gap:8px"><div class="category">\uD83C\uDFC3 Math Rush</div><div class="question">True or False?</div><div class="mr-timer" id="mr-timer-'+idx+'"></div><div class="mr-eq" id="mr-eq-'+idx+'">Get ready...</div><div class="mr-btns" id="mr-btns-'+idx+'" style="display:none"><button class="mr-btn mr-true" data-rv="true">\u2713 True</button><button class="mr-btn mr-false" data-rv="false">\u2717 False</button></div><div id="mr-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0"><button id="mr-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><div class="mr-score" id="mr-score-'+idx+'"></div><div class="mr-progress" id="mr-progress-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var eqEl=slideEl.querySelector('#mr-eq-'+idx),scoreEl=slideEl.querySelector('#mr-score-'+idx),timerEl=slideEl.querySelector('#mr-timer-'+idx),btnsEl=slideEl.querySelector('#mr-btns-'+idx),progressEl=slideEl.querySelector('#mr-progress-'+idx),readyWrap=slideEl.querySelector('#mr-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#mr-ready-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!eqEl)return;var round=0,score=0,done=false,roundTimer=null;readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';btnsEl.style.display='flex';ctx.answerStartRef.set(Date.now());showRound();});function showRound(){if(round>=q.equations.length){finish();return;}eqEl.textContent=q.equations[round].text;eqEl.className='mr-eq';var dots='';for(var i=0;i<q.equations.length;i++)dots+='<span class="mr-dot'+(i<round?' mr-dot-done':i===round?' mr-dot-active':'')+'"></span>';progressEl.innerHTML=dots;var timeLeft=5.0;timerEl.textContent='5.0s';timerEl.style.color='var(--cream)';clearInterval(roundTimer);roundTimer=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){clearInterval(roundTimer);H.warning&&H.warning();eqEl.classList.add('mr-wrong');round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);}else{timerEl.textContent=timeLeft.toFixed(1)+'s';if(timeLeft<=2)timerEl.style.color='var(--red)';}},100);}btnsEl.addEventListener('click',function(e){var btn=e.target.closest('.mr-btn');if(!btn||done)return;clearInterval(roundTimer);var ans=btn.dataset.rv==='true',correct=q.equations[round].correct===ans;if(correct){H.medium&&H.medium();score++;eqEl.classList.add('mr-correct');}else{H.error&&H.error();eqEl.classList.add('mr-wrong');}round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);});
    function finish(){done=true;clearInterval(roundTimer);var ms=Date.now()-ctx.answerStartRef.get(),won=score>=3,perfect=score===q.equations.length,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('mathRush');if(ctx.onAnswer)ctx.onAnswer(won,ms);eqEl.textContent=score+'/'+q.equations.length+(perfect?' Perfect!':won?' Nice!':' Try harder!');eqEl.className='mr-eq '+(won?'mr-correct':'mr-wrong');timerEl.textContent='';btnsEl.style.display='none';if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?22:10);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Flawless! \uD83D\uDD25':score+' correct. Speed and accuracy!';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
  }});
})();

// ── Odd Tile Out ──────────────────────────────────────────────────────────────
(function () {
  function hslToStr(h,s,l){return'hsl('+h+','+s+'%,'+l+'%)';}
  function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  var LEVELS=[{g:3,hd:40,ld:0,d:0.5},{g:3,hd:25,ld:0,d:0.7},{g:4,hd:20,ld:0,d:0.9},{g:4,hd:12,ld:0,d:1.1},{g:4,hd:0,ld:14,d:1.2},{g:5,hd:10,ld:0,d:1.3},{g:5,hd:0,ld:10,d:1.4},{g:5,hd:7,ld:0,d:1.6},{g:5,hd:0,ld:7,d:1.7},{g:6,hd:6,ld:0,d:1.9}];
  Q.register('oddTileOut',function(){var lv=LEVELS[randInt(0,LEVELS.length-1)],g=lv.g,total=g*g,baseH=randInt(0,359),baseS=randInt(55,80),baseL=randInt(40,65),oddH=(baseH+(lv.hd||0)+360)%360,oddL=baseL+(lv.ld||0),oddIdx=randInt(0,total-1),tiles=[];for(var i=0;i<total;i++)tiles.push(i===oddIdx?hslToStr(oddH,baseS,oddL):hslToStr(baseH,baseS,baseL));return{type:'oddTileOut',category:'patternRecognition',categoryLabel:'Odd Tile Out',difficulty:lv.d,question:'Find the different tile!',tiles:tiles,oddIdx:oddIdx,gridSize:g,answer:'complete',options:[],explanation:'Color perception & visual attention.',visual:'custom'};},3);
  Q.registerRenderer('oddTileOut',{
    render:function(q,idx){return'<div class="qcard" style="gap:8px"><div class="category">\uD83C\uDFA8 Odd Tile Out</div><div class="question">'+q.question+'</div><div class="oto-rounds" id="oto-rounds-'+idx+'"><span class="oto-dot oto-dot-active"></span><span class="oto-dot"></span><span class="oto-dot"></span></div><div id="oto-grid-wrap-'+idx+'"></div><div class="oto-status" id="oto-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var wrap=slideEl.querySelector('#oto-grid-wrap-'+idx),statusEl=slideEl.querySelector('#oto-status-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!wrap)return;var LEVELS2=[{g:3,hd:40,ld:0,d:0.5},{g:3,hd:25,ld:0,d:0.7},{g:4,hd:20,ld:0,d:0.9},{g:4,hd:12,ld:0,d:1.1},{g:4,hd:0,ld:14,d:1.2},{g:5,hd:10,ld:0,d:1.3},{g:5,hd:0,ld:10,d:1.4},{g:5,hd:7,ld:0,d:1.6},{g:5,hd:0,ld:7,d:1.7},{g:6,hd:6,ld:0,d:1.9}];var TOTAL_ROUNDS=3,round=0,score=0,done=false;function makePuzzle(){var lv=LEVELS2[Math.floor(Math.random()*LEVELS2.length)],g=lv.g,total=g*g,baseH=Math.floor(Math.random()*360),baseS=Math.floor(Math.random()*26)+55,baseL=Math.floor(Math.random()*26)+40,oddH=(baseH+(lv.hd||0)+360)%360,oddL=baseL+(lv.ld||0),oddIdx=Math.floor(Math.random()*total),tiles=[];for(var i=0;i<total;i++)tiles.push(i===oddIdx?hslToStr(oddH,baseS,oddL):hslToStr(baseH,baseS,baseL));return{g:g,tiles:tiles,oddIdx:oddIdx,d:lv.d};}function updateDots(){var dots=slideEl.querySelectorAll('.oto-dot');dots.forEach(function(d,i){d.className='oto-dot'+(i<round?' oto-dot-done':i===round?' oto-dot-active':'');});}function showRound(){var p=makePuzzle(),size='clamp('+Math.floor(240/p.g)+'px,'+Math.floor(56/p.g)+'vw,'+Math.floor(290/p.g)+'px)',cells='';for(var i=0;i<p.tiles.length;i++)cells+='<button class="oto-tile" data-oi="'+idx+'" data-oc="'+i+'" data-odd="'+p.oddIdx+'" style="background:'+p.tiles[i]+';width:'+size+';height:'+size+'"></button>';wrap.innerHTML='<div class="oto-grid" style="grid-template-columns:repeat('+p.g+',1fr)">'+cells+'</div>';statusEl.textContent='';statusEl.style.color='';updateDots();wrap.querySelector('.oto-grid').addEventListener('click',function(e){var btn=e.target.closest('.oto-tile');if(!btn||done)return;var tapped=parseInt(btn.dataset.oc),oddI=parseInt(btn.dataset.odd),won=tapped===oddI;var tiles2=wrap.querySelectorAll('.oto-tile');tiles2[oddI].classList.add('oto-correct');if(!won){H.error&&H.error();btn.classList.add('oto-wrong');}else{H.medium&&H.medium();score++;}statusEl.textContent=won?'✓ Got it!':'✗ Missed';statusEl.style.color=won?'var(--green)':'var(--red)';round++;if(round>=TOTAL_ROUNDS){setTimeout(function(){finish();},600);}else{setTimeout(function(){showRound();},700);}},{once:true});}function finish(){done=true;var won=score>=2,perfect=score===TOTAL_ROUNDS,ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?20:10);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);statusEl.textContent=perfect?'Perfect! 3/3 🎯':won?score+'/3 — Nice!':score+'/3 — Keep training!';statusEl.style.color=won?'var(--green)':'var(--red)';var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Flawless color vision!':'Spotted '+score+' of 3 odd tiles.';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}showRound();}
  });
})();

// ── Stop the Clock ────────────────────────────────────────────────────────────
(function () {
  Q.register('stopClock',function(){var useZone=Q.rand(0,1)===1,targetAngle=useZone?Q.rand(0,359):[0,90,180,270][Q.rand(0,3)],zoneSize=useZone?[30,22,16,12][Q.rand(0,3)]:null,speed=[1.5,2,2.5,3][Q.rand(0,3)],d=useZone?(zoneSize<=16?1.5:zoneSize<=22?1.2:0.9):0.6;return{type:'stopClock',category:'mentalAgility',categoryLabel:'Stop the Clock',difficulty:d,question:useZone?'Tap to stop the needle in the red zone!':'Tap to stop the needle at 12 o\'clock!',targetAngle:targetAngle,zoneSize:zoneSize,speed:speed,useZone:useZone,answer:'complete',options:[],explanation:'Timing and precision.',visual:'custom'};},3);
  Q.registerRenderer('stopClock',{
    render:function(q,idx){return'<div class="qcard" style="gap:10px"><div class="category">⏱ Stop the Clock</div><div class="question">'+q.question+'</div><div id="stc-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:4px 0"><button id="stc-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button></div><canvas id="stc-canvas-'+idx+'" width="220" height="220" style="display:none;border-radius:50%;cursor:pointer;touch-action:manipulation"></canvas><div class="stc-result" id="stc-result-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div>'+_gameBranding()+'</div>';},
    attach:function(slideEl,q,idx,ctx){var readyWrap=slideEl.querySelector('#stc-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#stc-ready-'+idx),canvas=slideEl.querySelector('#stc-canvas-'+idx),resultEl=slideEl.querySelector('#stc-result-'+idx),H=ctx.Haptics||{};var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);if(!canvas)return;var cx2=canvas.getContext('2d'),angle=0,raf=null,done=false,running=false,degreesPerMs=360/(q.speed*1000),lastTime=null,targetAngle=q.targetAngle!=null?q.targetAngle:0,zoneSize=q.zoneSize||25,zoneStart=(targetAngle-zoneSize/2+360)%360,zoneEnd=(targetAngle+zoneSize/2)%360;function drawClock(a){var W=220,R=100,cxC=W/2,cyC=W/2;cx2.clearRect(0,0,W,W);cx2.beginPath();cx2.arc(cxC,cyC,R,0,Math.PI*2);cx2.fillStyle='rgba(240,234,214,0.08)';cx2.fill();cx2.strokeStyle='rgba(240,234,214,0.2)';cx2.lineWidth=2;cx2.stroke();if(q.useZone){var s2=(zoneStart-90)*Math.PI/180,e2=(zoneEnd-90)*Math.PI/180;if(zoneEnd<zoneStart)e2+=Math.PI*2;cx2.beginPath();cx2.moveTo(cxC,cyC);cx2.arc(cxC,cyC,R,s2,e2);cx2.closePath();cx2.fillStyle='rgba(232,68,58,0.35)';cx2.fill();cx2.strokeStyle='rgba(232,68,58,0.7)';cx2.lineWidth=1.5;cx2.stroke();}else{var ta=(targetAngle-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cxC+Math.cos(ta)*85,cyC+Math.sin(ta)*85);cx2.lineTo(cxC+Math.cos(ta)*100,cyC+Math.sin(ta)*100);cx2.strokeStyle='var(--green)';cx2.lineWidth=3;cx2.stroke();}for(var i=0;i<12;i++){var ta2=(i*30-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cxC+Math.cos(ta2)*88,cyC+Math.sin(ta2)*88);cx2.lineTo(cxC+Math.cos(ta2)*98,cyC+Math.sin(ta2)*98);cx2.strokeStyle='rgba(240,234,214,0.3)';cx2.lineWidth=1.5;cx2.stroke();}var ra=(a-90)*Math.PI/180;cx2.beginPath();cx2.moveTo(cxC,cyC);cx2.lineTo(cxC+Math.cos(ra)*78,cyC+Math.sin(ra)*78);cx2.strokeStyle='var(--cream)';cx2.lineWidth=3;cx2.lineCap='round';cx2.stroke();cx2.beginPath();cx2.arc(cxC,cyC,5,0,Math.PI*2);cx2.fillStyle='var(--gold)';cx2.fill();}function loop(ts){if(!running||done)return;if(lastTime)angle=(angle+degreesPerMs*(ts-lastTime))%360;lastTime=ts;drawClock(angle);raf=requestAnimationFrame(loop);}readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';canvas.style.display='block';running=true;lastTime=null;ctx.answerStartRef.set(Date.now());raf=requestAnimationFrame(loop);});canvas.addEventListener('click',function(){if(!running||done)return;done=true;running=false;cancelAnimationFrame(raf);drawClock(angle);var diff=Math.abs(angle-targetAngle);if(diff>180)diff=360-diff;var won,msg;if(q.useZone){var inZone=zoneEnd>zoneStart?(angle>=zoneStart&&angle<=zoneEnd):(angle>=zoneStart||angle<=zoneEnd);won=inZone;msg=won?'In the zone! ✅':'Missed by '+(diff.toFixed(0))+'°';}else{won=diff<=15;msg=won?'Nailed it! ✅':'Off by '+(diff.toFixed(0))+'°';}var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.onAnswer)ctx.onAnswer(won,ms);if(won){H.success&&H.success();ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);resultEl.textContent=msg;resultEl.style.color=won?'var(--green)':'var(--red)';var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Perfect timing!':'Off by '+diff.toFixed(0)+'°. Try again!';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());});}
  });
})();

// ══════════════════════════════════════════════════════════════════════════════
// NEW GAMES
// ══════════════════════════════════════════════════════════════════════════════

// ── 1. Mini 2048 ──────────────────────────────────────────────────────────────
(function () {
  Q.register('mini2048', function () {
    return {type:'mini2048',category:'problemSolving',categoryLabel:'Mini 2048',difficulty:1.3,question:'Merge tiles to reach 32!',answer:'complete',options:[],explanation:'Combine same numbers by swiping.',visual:'custom'};
  }, 3);

  Q.registerRenderer('mini2048', {
    render: function(q, idx) {
      var cells = '';
      for(var i = 0; i < 16; i++) cells += '<div class="m48-cell" id="m48-'+idx+'-'+i+'"></div>';
      return '<div class="qcard" style="gap:8px">'+
        '<div class="category">🔢 Mini 2048</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="m48-scores">'+
          '<div class="m48-sbox"><div class="m48-sl">Score</div><div class="m48-sv" id="m48-score-'+idx+'">0</div></div>'+
          '<div class="m48-sbox"><div class="m48-sl">Best</div><div class="m48-sv" id="m48-best-'+idx+'">32</div></div>'+
        '</div>'+
        '<div class="m48-wrap" id="m48-board-'+idx+'">'+cells+'</div>'+
        '<div class="m48-msg" id="m48-msg-'+idx+'">Swipe to merge tiles!</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        _gameBranding()+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var H = ctx.Haptics||{};
      var actEl = slideEl.querySelector('#wa-'+idx);
      if(actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);
      var board = new Array(16).fill(0), score = 0, done = false;
      var msgEl = document.getElementById('m48-msg-'+idx);
      var scoreEl = document.getElementById('m48-score-'+idx);

      function render() {
        for(var i = 0; i < 16; i++) {
          var cell = document.getElementById('m48-'+idx+'-'+i);
          if(!cell) continue;
          cell.textContent = board[i] || '';
          cell.setAttribute('data-v', board[i] || '');
        }
        scoreEl.textContent = score;
      }

      function addRandom() {
        var empty = [];
        for(var i = 0; i < 16; i++) if(!board[i]) empty.push(i);
        if(!empty.length) return;
        var pos = empty[Math.floor(Math.random() * empty.length)];
        board[pos] = Math.random() < 0.85 ? 2 : 4;
      }

      function getRow(r) { return [board[r*4], board[r*4+1], board[r*4+2], board[r*4+3]]; }
      function getCol(c) { return [board[c], board[c+4], board[c+8], board[c+12]]; }
      function setRow(r, arr) { for(var i = 0; i < 4; i++) board[r*4+i] = arr[i]; }
      function setCol(c, arr) { for(var i = 0; i < 4; i++) board[c+i*4] = arr[i]; }

      function slideArr(arr) {
        var filtered = arr.filter(function(x){ return x !== 0; });
        var merged = [], skip = false, gained = 0;
        for(var i = 0; i < filtered.length; i++) {
          if(skip) { skip = false; continue; }
          if(i < filtered.length-1 && filtered[i] === filtered[i+1]) {
            merged.push(filtered[i]*2);
            gained += filtered[i]*2;
            skip = true;
          } else {
            merged.push(filtered[i]);
          }
        }
        while(merged.length < 4) merged.push(0);
        return { arr: merged, gained: gained };
      }

      function arrEq(a, b) { for(var i = 0; i < 4; i++) if(a[i] !== b[i]) return false; return true; }

      function move(dir) {
        if(done) return;
        var moved = false;
        if(dir === 'left' || dir === 'right') {
          for(var r = 0; r < 4; r++) {
            var row = getRow(r);
            if(dir === 'right') row.reverse();
            var res = slideArr(row);
            var newRow = res.arr;
            if(dir === 'right') newRow.reverse();
            if(!arrEq(getRow(r), newRow)) moved = true;
            setRow(r, newRow);
            score += res.gained;
          }
        } else {
          for(var c = 0; c < 4; c++) {
            var col = getCol(c);
            if(dir === 'down') col.reverse();
            var res2 = slideArr(col);
            var newCol = res2.arr;
            if(dir === 'down') newCol.reverse();
            if(!arrEq(getCol(c), newCol)) moved = true;
            setCol(c, newCol);
            score += res2.gained;
          }
        }
        if(moved) {
          H.light && H.light();
          addRandom();
          render();
          checkWin();
        }
      }

      function checkWin() {
        var won = board.indexOf(32) !== -1 || board.indexOf(64) !== -1 || board.indexOf(128) !== -1;
        if(won) { finish(true); return; }
        for(var i = 0; i < 16; i++) {
          if(!board[i]) return;
          if(i % 4 !== 3 && board[i] === board[i+1]) return;
          if(i < 12 && board[i] === board[i+4]) return;
        }
        finish(false);
      }

      function finish(won) {
        if(done) return;
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if(ctx.notifyGamePlayed) ctx.notifyGamePlayed('mini2048');
        if(ctx.onAnswer) ctx.onAnswer(won, ms);
        if(won) {
          msgEl.textContent = '🎉 You hit 32!';
          msgEl.style.color = 'var(--green)';
          H.streak && H.streak();
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(20);
        } else {
          msgEl.textContent = 'No moves left! Score: ' + score;
          msgEl.style.color = 'var(--red)';
          H.error && H.error();
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-'+idx);
        if(expEl) { expEl.textContent = won ? 'Merge tiles: same numbers combine!' : 'Plan ahead — keep large tiles in a corner.'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }

      // ── Touch/swipe — FIXED: preventDefault on touchmove to block page scroll ──
      var boardEl = document.getElementById('m48-board-'+idx);
      var tx = 0, ty = 0, tActive = false;

      boardEl.addEventListener('touchstart', function(e) {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
        tActive = true;
      }, {passive: true});

      // Use non-passive touchmove so we can preventDefault
      boardEl.addEventListener('touchmove', function(e) {
        if(!tActive) return;
        e.preventDefault(); // ← blocks feed scroll while swiping on board
      }, {passive: false});

      boardEl.addEventListener('touchend', function(e) {
        if(!tActive) return;
        tActive = false;
        var dx = e.changedTouches[0].clientX - tx;
        var dy = e.changedTouches[0].clientY - ty;
        if(Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
        if(Math.abs(dx) > Math.abs(dy)) { move(dx > 0 ? 'right' : 'left'); }
        else { move(dy > 0 ? 'down' : 'up'); }
      }, {passive: true});

      // Arrow keys
      document.addEventListener('keydown', function(e) {
        if(done) return;
        var feed = ctx.feed;
        var vi = Math.round(feed.scrollTop / (feed.clientHeight || 1));
        if(feed.children[vi] !== slideEl) return;
        var map = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
        if(map[e.key]) { e.preventDefault(); move(map[e.key]); }
      });

      addRandom(); addRandom();
      render();
      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── 2. Water Sort ─────────────────────────────────────────────────────────────
(function () {
  var PALETTE = ['#e8443a','#3a7df2','#3fba4f','#e8a817','#6d4aed','#e87d1a','#e8557a','#00bcd4'];

  function makePuzzle(numColors, tubeCount) {
    var layers = [];
    for(var c = 0; c < numColors; c++) {
      for(var l = 0; l < 4; l++) layers.push(c);
    }
    for(var i = layers.length-1; i > 0; i--) {
      var j = Math.floor(Math.random()*(i+1));
      var tmp = layers[i]; layers[i] = layers[j]; layers[j] = tmp;
    }
    var tubes = [];
    for(var t = 0; t < numColors; t++) {
      tubes.push(layers.slice(t*4, t*4+4));
    }
    for(var e = 0; e < tubeCount - numColors; e++) tubes.push([]);
    return tubes;
  }

  Q.register('waterSort', function () {
    var lvl = Q.rand(0, 1);
    var numColors = lvl === 0 ? 4 : 5;
    var tubeCount = numColors + 2;
    var tubes = makePuzzle(numColors, tubeCount);
    return {type:'waterSort',category:'problemSolving',categoryLabel:'Water Sort',difficulty:lvl===0?1.1:1.5,question:'Sort the colors — one color per tube!',tubes:tubes,numColors:numColors,answer:'complete',options:[],explanation:'Pour the top color into a matching or empty tube.',visual:'custom'};
  }, 3);

  Q.registerRenderer('waterSort', {
    render: function(q, idx) {
      return '<div class="qcard" style="gap:8px">'+
        '<div class="category">🧪 Water Sort</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="ws2-wrap" id="ws2-tubes-'+idx+'"></div>'+
        '<div class="ws2-status" id="ws2-status-'+idx+'">Tap a tube to select, tap again to pour</div>'+
        '<div class="ws2-pours" id="ws2-pours-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+
        _gameBranding()+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var H = ctx.Haptics||{};
      var actEl = slideEl.querySelector('#wa-'+idx);
      if(actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);
      var tubesEl = document.getElementById('ws2-tubes-'+idx);
      var statusEl = document.getElementById('ws2-status-'+idx);
      var poursEl = document.getElementById('ws2-pours-'+idx);
      if(!tubesEl) return;

      var tubes = q.tubes.map(function(t){ return t.slice(); });
      var selected = -1, pours = 0, done = false;

      function canPour(from, to) {
        if(from === to) return false;
        if(!tubes[from].length) return false;
        if(tubes[to].length >= 4) return false;
        var topFrom = tubes[from][tubes[from].length-1];
        if(!tubes[to].length) return true;
        var topTo = tubes[to][tubes[to].length-1];
        return topFrom === topTo;
      }

      function pour(from, to) {
        var color = tubes[from][tubes[from].length-1];
        while(tubes[from].length && tubes[from][tubes[from].length-1] === color && tubes[to].length < 4) {
          tubes[to].push(tubes[from].pop());
          pours++;
        }
      }

      function isSolved() {
        for(var t = 0; t < tubes.length; t++) {
          if(!tubes[t].length) continue;
          if(tubes[t].length !== 4) return false;
          for(var l = 1; l < 4; l++) {
            if(tubes[t][l] !== tubes[t][0]) return false;
          }
        }
        return true;
      }

      function renderTubes() {
        tubesEl.innerHTML = '';
        tubes.forEach(function(tube, ti) {
          var outer = document.createElement('div');
          outer.className = 'ws2-tube-outer';
          outer.dataset.ti = ti;
          var cap = document.createElement('div');
          cap.className = 'ws2-cap';
          var tubeDiv = document.createElement('div');
          tubeDiv.className = 'ws2-tube' + (ti === selected ? ' ws2-sel' : '');
          var CAPACITY = 4;
          var empties = CAPACITY - tube.length;
          for(var e = 0; e < empties; e++) {
            var layer = document.createElement('div');
            layer.className = 'ws2-layer ws2-empty';
            tubeDiv.appendChild(layer);
          }
          for(var l = tube.length-1; l >= 0; l--) {
            var layer2 = document.createElement('div');
            layer2.className = 'ws2-layer';
            layer2.style.background = PALETTE[tube[l]];
            tubeDiv.appendChild(layer2);
          }
          if(tube.length === 4 && tube.every(function(c){ return c === tube[0]; })) {
            tubeDiv.classList.add('ws2-done');
          }
          outer.appendChild(cap);
          outer.appendChild(tubeDiv);
          tubesEl.appendChild(outer);
        });
        poursEl.textContent = pours > 0 ? pours + ' pours' : '';
      }

      tubesEl.addEventListener('click', function(e) {
        if(done) return;
        var outer = e.target.closest('.ws2-tube-outer');
        if(!outer) return;
        var ti = parseInt(outer.dataset.ti);
        H.light && H.light();
        if(selected === -1) {
          if(!tubes[ti].length) return;
          selected = ti;
          statusEl.textContent = 'Now tap where to pour';
        } else {
          if(ti === selected) {
            selected = -1;
            statusEl.textContent = 'Tap a tube to select';
          } else if(canPour(selected, ti)) {
            H.medium && H.medium();
            pour(selected, ti);
            selected = -1;
            statusEl.textContent = 'Tap a tube to select';
            if(isSolved()) { finish(true); return; }
            else { renderTubes(); return; }
          } else {
            H.error && H.error();
            statusEl.textContent = "Can't pour there!";
            setTimeout(function(){ statusEl.textContent = 'Tap a tube to select'; selected = -1; renderTubes(); }, 600);
            return;
          }
        }
        renderTubes();
      });

      function finish(won) {
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if(ctx.notifyGamePlayed) ctx.notifyGamePlayed('waterSort');
        if(ctx.onAnswer) ctx.onAnswer(won, ms);
        if(won) {
          statusEl.textContent = '🎉 Sorted! ' + pours + ' pours';
          statusEl.style.color = 'var(--green)';
          H.streak && H.streak();
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(18);
        }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-'+idx);
        if(expEl) { expEl.textContent = won ? 'Completed in ' + pours + ' pours!' : 'Pour same-colored liquids together.'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
        renderTubes();
      }

      renderTubes();
      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── 3. Pipe Connect ───────────────────────────────────────────────────────────
(function () {
  var PUZZLES = [
    {size:4,cells:[
      {t:6},{t:12},{t:12},{t:9},
      {t:3},{t:0 },{t:0 },{t:3},
      {t:6},{t:12},{t:0 },{t:5},
      {t:3},{t:0 },{t:0 },{t:5},
    ],src:0,snk:15,d:0.8},
    {size:5,cells:[
      {t:6},{t:12},{t:12},{t:12},{t:9},
      {t:3},{t:0 },{t:0 },{t:0 },{t:3},
      {t:6},{t:12},{t:9 },{t:0 },{t:5},
      {t:0},{t:3 },{t:3 },{t:0 },{t:5},
      {t:0},{t:6 },{t:6 },{t:12},{t:9},
    ],src:0,snk:24,d:1.2},
  ];

  var PIPE_DEFS = {
    0:[], 3:['pn','ps'], 5:['pn','pe'], 6:['ps','pe'],
    9:['pn','pw'], 10:['ps','pw'], 12:['pe','pw'],
    15:['pn','ps','pe','pw'],
  };

  function rotate(t, times) {
    var result = t;
    for(var i = 0; i < (times||0); i++) {
      var n=(result&1)?1:0, s=(result&2)?1:0, e=(result&4)?1:0, w=(result&8)?1:0;
      result = (n?4:0)|(e?2:0)|(s?8:0)|(w?1:0);
    }
    return result;
  }

  Q.register('pipeConnect', function () {
    var puz = Q.pick(PUZZLES);
    var cells = puz.cells.map(function(c, i) {
      if(i === puz.src || i === puz.snk || c.t === 0) return {t:c.t, rot:0};
      return {t:c.t, rot:Q.rand(0,3)};
    });
    return {type:'pipeConnect',category:'spatialAwareness',categoryLabel:'Pipe Connect',difficulty:puz.d,question:'Rotate pipes to connect source to drain!',size:puz.size,cells:cells,src:puz.src,snk:puz.snk,answer:'complete',options:[],explanation:'Rotate pipes by tapping — connect 🟢 to 🔴!',visual:'custom'};
  }, 3);

  Q.registerRenderer('pipeConnect', {
    render: function(q, idx) {
      var sz = 'min('+(Math.floor(240/q.size))+'px,'+(Math.floor(58/q.size))+'vw)';
      var cells = '';
      for(var i = 0; i < q.cells.length; i++) {
        var c = q.cells[i];
        var cls = 'pc-cell';
        var inner = '<div class="pc-dot"></div>';
        if(i === q.src) { cls += ' pc-src'; inner = '<div class="pc-label">🟢</div>'; }
        else if(i === q.snk) { cls += ' pc-snk'; inner = '<div class="pc-label">🔴</div>'; }
        else if(c.t === 0) cls += ' pc-wall';
        else {
          var arms = PIPE_DEFS[rotate(c.t, c.rot)] || [];
          inner = arms.map(function(a){ return '<div class="pc-arm '+a+'"></div>'; }).join('') + '<div class="pc-dot"></div>';
        }
        cells += '<div class="'+cls+'" data-pi="'+idx+'" data-pc="'+i+'" style="width:'+sz+';height:'+sz+'">'+inner+'</div>';
      }
      return '<div class="qcard" style="gap:8px">'+
        '<div class="category">🔧 Pipe Connect</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="pc-grid" id="pc-grid-'+idx+'" style="grid-template-columns:repeat('+q.size+',1fr);width:min('+(q.size*50)+'px,'+(q.size*13)+'vw)">'+cells+'</div>'+
        '<div class="pc-status" id="pc-status-'+idx+'">Tap pipes to rotate them</div>'+
        '<div class="pc-moves" id="pc-moves-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        _gameBranding()+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var H = ctx.Haptics||{};
      var actEl = slideEl.querySelector('#wa-'+idx);
      if(actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);
      var grid = document.getElementById('pc-grid-'+idx);
      var statusEl = document.getElementById('pc-status-'+idx);
      var movesEl = document.getElementById('pc-moves-'+idx);
      if(!grid) return;
      var cells = q.cells.map(function(c){ return {t:c.t, rot:c.rot||0}; });
      var moves = 0, done = false;

      function PIPE_DEFS_local(t) { return PIPE_DEFS[t] || []; }

      function renderCell(i) {
        var cellEl = grid.querySelector('[data-pc="'+i+'"]');
        if(!cellEl) return;
        if(i === q.src || i === q.snk || cells[i].t === 0) return;
        var rt = rotate(cells[i].t, cells[i].rot);
        var arms = PIPE_DEFS_local(rt);
        var inner = arms.map(function(a){ return '<div class="pc-arm '+a+'"></div>'; }).join('') + '<div class="pc-dot"></div>';
        cellEl.innerHTML = inner;
      }

      function checkConnected() {
        var visited = new Set([q.src]);
        var queue = [q.src];
        while(queue.length) {
          var curr = queue.shift();
          if(curr === q.snk) return true;
          var row = Math.floor(curr/q.size), col = curr%q.size;
          var ct = rotate(cells[curr].t, cells[curr].rot);
          var arms = PIPE_DEFS_local(ct);
          ['pn','ps','pe','pw'].forEach(function(arm) {
            if(arms.indexOf(arm) === -1) return;
            var nb = -1;
            var opposite = {pn:'ps',ps:'pn',pe:'pw',pw:'pe'}[arm];
            if(arm==='pn' && row>0) nb = curr-q.size;
            if(arm==='ps' && row<q.size-1) nb = curr+q.size;
            if(arm==='pe' && col<q.size-1) nb = curr+1;
            if(arm==='pw' && col>0) nb = curr-1;
            if(nb === -1 || visited.has(nb)) return;
            var nct = rotate(cells[nb].t, cells[nb].rot);
            if(PIPE_DEFS_local(nct).indexOf(opposite) !== -1) {
              visited.add(nb);
              queue.push(nb);
            }
          });
        }
        return false;
      }

      function highlightPath() {
        var visited = new Set([q.src]);
        var queue = [q.src];
        var connected = new Set([q.src]);
        while(queue.length) {
          var curr = queue.shift();
          var row = Math.floor(curr/q.size), col = curr%q.size;
          var ct = rotate(cells[curr].t, cells[curr].rot);
          var arms = PIPE_DEFS_local(ct);
          ['pn','ps','pe','pw'].forEach(function(arm) {
            if(arms.indexOf(arm) === -1) return;
            var opposite = {pn:'ps',ps:'pn',pe:'pw',pw:'pe'}[arm];
            var nb = -1;
            if(arm==='pn' && row>0) nb = curr-q.size;
            if(arm==='ps' && row<q.size-1) nb = curr+q.size;
            if(arm==='pe' && col<q.size-1) nb = curr+1;
            if(arm==='pw' && col>0) nb = curr-1;
            if(nb === -1 || visited.has(nb)) return;
            var nct = rotate(cells[nb].t, cells[nb].rot);
            if(PIPE_DEFS_local(nct).indexOf(opposite) !== -1) {
              visited.add(nb);
              connected.add(nb);
              queue.push(nb);
            }
          });
        }
        for(var i = 0; i < cells.length; i++) {
          var el = grid.querySelector('[data-pc="'+i+'"]');
          if(!el) continue;
          el.classList.toggle('pc-lit', connected.has(i));
        }
      }

      grid.addEventListener('click', function(e) {
        if(done) return;
        var cellEl = e.target.closest('[data-pc]');
        if(!cellEl || +cellEl.dataset.pi !== idx) return;
        var i = parseInt(cellEl.dataset.pc);
        if(i === q.src || i === q.snk || cells[i].t === 0) return;
        H.light && H.light();
        cells[i].rot = (cells[i].rot + 1) % 4;
        moves++;
        movesEl.textContent = moves + ' rotation' + (moves === 1 ? '' : 's');
        renderCell(i);
        highlightPath();
        if(checkConnected()) {
          statusEl.textContent = '🎉 Connected!';
          setTimeout(function(){ finish(true); }, 300);
        }
      });

      function finish(won) {
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if(ctx.notifyGamePlayed) ctx.notifyGamePlayed('pipeConnect');
        if(ctx.onAnswer) ctx.onAnswer(won, ms);
        if(won) {
          H.streak && H.streak();
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(16);
        }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-'+idx);
        if(expEl) { expEl.textContent = won ? 'Pipeline complete in '+moves+' rotations!' : 'Rotate pipes to form a connected path.'; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }

      highlightPath();
      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── 4. Word Ladder ────────────────────────────────────────────────────────────
(function () {
  var LADDERS = [
    {start:'CAT',end:'DOG',steps:3,hint:'C→D, A→O, T→G (any order)'},
    {start:'HOT',end:'COD',steps:3,hint:'H→C, O→O, T→D'},
    {start:'CAR',end:'BUS',steps:4,hint:'Change one letter at a time'},
    {start:'COLD',end:'WARM',steps:4,hint:'Change one letter at a time'},
    {start:'HATE',end:'LOVE',steps:4,hint:'Change one letter at a time'},
    {start:'FISH',end:'BIRD',steps:4,hint:'Change one letter at a time'},
    {start:'HAND',end:'FOOT',steps:4,hint:'Change one letter at a time'},
    {start:'DARK',end:'DAWN',steps:3,hint:'DARK → DARN → BARN → BAWN → DAWN'},
    {start:'BOY',end:'MAN',steps:3,hint:'BOY → BAY → BAN → MAN'},
    {start:'LEAD',end:'GOLD',steps:4,hint:'Change one letter at a time'},
  ];

  var VALID3 = new Set(['CAT','BAT','BAD','BID','BIG','BIT','BUT','CAN','CAR','COT','COD','COP','CUP','CUT','DAD','DAM','DIM','DIP','DIT','DOG','DOT','DUG','DUN','FAD','FAN','FAR','FAT','FIG','FIN','FIT','FIX','FOP','FOG','FUN','GAN','GAP','GAS','GIT','GOT','GUN','GUP','HAD','HAM','HAN','HAP','HAS','HAT','HID','HIM','HIP','HIT','HOD','HOG','HOP','HOT','HOW','HUG','HUM','HUT','JAN','JOB','JOG','JOT','JOY','JUG','JUT','KAN','KIT','LAD','LAG','LAP','LAW','LAX','LAY','LED','LEG','LET','LID','LIP','LIT','LOG','LOT','LOW','MAD','MAN','MAP','MAR','MAT','MAW','MOB','MOD','MOP','MOW','MUD','MUG','NAB','NAG','NAP','NAW','NOB','NOD','NOG','NOR','NOT','NOW','NUB','NUN','NUT','ODD','OPT','PAD','PAN','PAP','PAR','PAT','PAW','PAY','PEA','PEG','PEN','PEP','PET','PEW','PIG','PIN','PIT','PIX','PLY','POD','POP','POT','POW','PRY','PUB','PUG','PUN','PUP','PUS','PUT','RAD','RAG','RAM','RAN','RAP','RAT','RAW','RAY','RED','RIB','RID','RIG','RIM','RIP','ROB','ROD','ROT','ROW','RUB','RUG','RUN','RUT','SAC','SAD','SAP','SAT','SAW','SAY','SET','SEW','SIP','SIR','SIT','SIX','SKI','SKY','SOB','SOD','SON','SOP','SOT','SOW','SOY','SPA','SPY','STY','SUB','SUM','SUN','SUP','TAB','TAD','TAN','TAP','TAR','TAT','TAW','TAX','TEN','TIN','TIP','TOD','TON','TOP','TOT','TOW','TOY','TUB','TUG','TUN','TWO','URN','VAN','VAR','VAT','VIA','VIE','VOW','WAD','WAG','WAR','WAS','WAX','WAY','WEB','WED','WIG','WIN','WIT','WOE','WOG','WOK','WON','WOO','WOW','YAK','YAM','YAP','YAW','YEA','YEP','YES','YET','YEW','YOU','ZAG','ZAP','ZIT','ZOO','BAY','BAN','BOY','BOW','BOX','COW','COB','COG','FEW','GEL','GEM','GET','GOB','GOD','HEN','HER','HIM','JAB','JAG','JAM','JAR','JAW','JAY','JET','JIB','DEN','DEW','DEW']);
  var VALID4 = new Set(['COLD','CORD','WORD','WARD','WARM','HAND','BAND','BOND','FOND','FONT','FOOT','LEAD','BEAD','DEAD','DEAN','BEAN','LEAN','LEND','BEND','BIND','BIRD','GOLD','BOLD','BALD','BALL','BELL','BELT','FELT','FELT','MELT','HELD','HELP','HEAP','REAP','REAL','TEAL','TELL','TALL','TALK','WALK','WALL','WILL','FILL','FILE','FIRE','HIRE','HIKE','BIKE','LIKE','LIME','TIME','TIDE','HIDE','HATE','HAVE','CAVE','CAVE','GAVE','GIVE','LIVE','LOVE','DOVE','DOVE','COVE','CORE','BORE','BORN','BARN','BARD','HARD','HARE','BARE','CARE','FARE','FACE','RACE','RICE','RISE','WISE','WINE','VINE','FINE','MINE','MIND','WIND','WAND','SAND','LAND','LANE','CANE','CAME','GAME','GATE','LATE','FATE','FACT','FAST','LAST','LASH','CASH','CAST','COST','COAT','GOAT','GOAD','LOAD','ROAD','READ','BEAD','HEAD','HEAT','MEAT','MEAL','SEAL','SALE','TALE','PALE','PAGE','CAGE','CAME','LAME','LAMP','DAMP','CAMP','RAMP','RIMS','AIMS','AIDS','AIDE','SIDE','SITE','KITE','BITE','MITE','MILE','PILE','PINE','PINT','HINT','MINT','DINT','DIET','DIED','DIEM','TIER','PIER','PEER','BEER','BEEF','REEF','REED','SEED','WEED','DEED','FEED','FEEL','FEET','MEET','MELT','BELT','BOLT','BOOT','BOOK','COOK','COOL','FOOL','POOL','POLL','PULL','BULL','BELL','CELL','WELL','WALK','TALK','TANK','BANK','BANG','GANG','SANG','SING','KING','RING','RINK','LINK','LICK','KICK','SICK','SILK','MILK','MILL','KILL','FILL','HILL','HULL','DULL','DULL','GULL','GALE','TALE','PALE','MALE','MOLE','HOLE','POLE','ROLE','RULE','MULE','FUME','FAME','SAME','NAME','GAME','LAME','FISH','FIST','GIST','GUST','BUST','BIRD','BIND']);

  function isValidWord(w) {
    if(w.length === 3) return VALID3.has(w);
    if(w.length === 4) return VALID4.has(w);
    return true;
  }

  function diffLetters(a, b) {
    if(a.length !== b.length) return 999;
    var diff = 0;
    for(var i = 0; i < a.length; i++) if(a[i] !== b[i]) diff++;
    return diff;
  }

  Q.register('wordLadder', function () {
    var ladder = Q.pick(LADDERS);
    return {type:'wordLadder',category:'verbalReasoning',categoryLabel:'Word Ladder',difficulty:1.2,question:ladder.start+' → '+ladder.end,start:ladder.start,end:ladder.end,steps:ladder.steps,hint:ladder.hint,answer:'complete',options:[],explanation:ladder.hint,visual:'custom'};
  }, 3);

  Q.registerRenderer('wordLadder', {
    render: function(q, idx) {
      var startTiles = q.start.split('').map(function(l){ return '<div class="wl-ep-tile">'+l+'</div>'; }).join('');
      var endTiles = q.end.split('').map(function(l){ return '<div class="wl-ep-tile">'+l+'</div>'; }).join('');
      var curTiles = q.start.split('').map(function(l,i){ return '<div class="wl-cur-tile" data-wli="'+idx+'" data-wlp="'+i+'">'+l+'</div>'; }).join('');
      var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function(l){
        return '<button class="wl-lbtn" data-wll="'+l+'" data-wla="'+idx+'">'+l+'</button>';
      }).join('');
      return '<div class="qcard" style="gap:7px">'+
        '<div class="category">🪜 Word Ladder</div>'+
        '<div class="question">Change one letter at a time</div>'+
        '<div class="wl-endpoints">'+
          '<div class="wl-ep-box"><div class="wl-ep-lbl">Start</div><div class="wl-ep-tiles">'+startTiles+'</div></div>'+
          '<div class="wl-arrow">→</div>'+
          '<div class="wl-ep-box"><div class="wl-ep-lbl">Target</div><div class="wl-ep-tiles">'+endTiles+'</div></div>'+
        '</div>'+
        '<div class="wl-current" id="wl-cur-'+idx+'">'+curTiles+'</div>'+
        '<div class="wl-alpha" id="wl-alpha-'+idx+'">'+alpha+'</div>'+
        '<div class="wl-hist" id="wl-hist-'+idx+'"></div>'+
        '<div class="wl-moves" id="wl-moves-'+idx+'">0 moves</div>'+
        '<div class="wl-status" id="wl-status-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+
        _gameBranding()+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var H = ctx.Haptics||{};
      var actEl = slideEl.querySelector('#wa-'+idx);
      if(actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);
      var curEl = document.getElementById('wl-cur-'+idx);
      var alphaEl = document.getElementById('wl-alpha-'+idx);
      var histEl = document.getElementById('wl-hist-'+idx);
      var movesEl = document.getElementById('wl-moves-'+idx);
      var statusEl = document.getElementById('wl-status-'+idx);
      if(!curEl) return;

      var current = q.start.split(''), selectedPos = -1, moves = 0, done = false, history = [];

      function renderCurrent() {
        var tiles = curEl.querySelectorAll('.wl-cur-tile');
        tiles.forEach(function(tile, i) {
          tile.textContent = current[i];
          var isMatch = current[i] === q.end[i];
          tile.className = 'wl-cur-tile' + (i === selectedPos ? ' wl-sel' : '') + (isMatch ? ' wl-match' : '');
        });
        var alphaBtns = alphaEl.querySelectorAll('.wl-lbtn');
        alphaBtns.forEach(function(btn) {
          var l = btn.dataset.wll;
          btn.className = 'wl-lbtn' + (selectedPos !== -1 && current[selectedPos] === l ? ' wl-same' : '');
        });
      }

      function addHistEntry(word) {
        var span = document.createElement('span');
        span.className = 'wl-hist-w';
        span.textContent = word;
        histEl.appendChild(span);
      }

      curEl.addEventListener('click', function(e) {
        var tile = e.target.closest('.wl-cur-tile');
        if(!tile || done) return;
        if(tile.classList.contains('wl-match')) return;
        var pos = parseInt(tile.dataset.wlp);
        H.light && H.light();
        selectedPos = selectedPos === pos ? -1 : pos;
        statusEl.textContent = selectedPos !== -1 ? 'Now pick a letter' : '';
        statusEl.style.color = '';
        renderCurrent();
      });

      alphaEl.addEventListener('click', function(e) {
        var btn = e.target.closest('.wl-lbtn');
        if(!btn || done || selectedPos === -1) return;
        var letter = btn.dataset.wll;
        if(current[selectedPos] === letter) return;
        var newWord = current.slice();
        newWord[selectedPos] = letter;
        var wordStr = newWord.join('');
        if(diffLetters(current.join(''), wordStr) !== 1) return;
        if(!isValidWord(wordStr)) {
          H.error && H.error();
          statusEl.textContent = '"'+wordStr+'" — not a valid word';
          statusEl.style.color = 'var(--red)';
          setTimeout(function(){ statusEl.textContent = 'Pick a letter'; statusEl.style.color=''; }, 1200);
          return;
        }
        H.medium && H.medium();
        history.push(current.join(''));
        addHistEntry(current.join(''));
        current = newWord;
        moves++;
        movesEl.textContent = moves + ' move' + (moves === 1 ? '' : 's');
        selectedPos = -1;
        statusEl.textContent = '';
        statusEl.style.color = '';
        renderCurrent();
        if(current.join('') === q.end) { finish(true); }
      });

      function finish(won) {
        done = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if(ctx.notifyGamePlayed) ctx.notifyGamePlayed('wordLadder');
        if(ctx.onAnswer) ctx.onAnswer(won, ms);
        if(won) {
          statusEl.textContent = '🎉 Got it in '+moves+' moves!';
          statusEl.style.color = 'var(--green)';
          H.streak && H.streak();
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(16);
        }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-'+idx);
        if(expEl) { expEl.textContent = won ? q.start + ' → ' + history.join(' → ') + ' → ' + q.end : 'Tip: '+q.hint; expEl.classList.add('show'); }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }

      renderCurrent();
      ctx.answerStartRef.set(Date.now());
    }
  });
})();

// ── 5. Connections ────────────────────────────────────────────────────────────
(function () {
  var PUZZLES = [
    {categories:[
      {name:'Planets',color:'#3a7df2',words:['MARS','VENUS','EARTH','SATURN']},
      {name:'Card Games',color:'#3fba4f',words:['SNAP','POKER','RUMMY','BRIDGE']},
      {name:'___ ball',color:'#e8a817',words:['FIRE','BASKET','FOOT','BASE']},
      {name:'Things that fly',color:'#e8443a',words:['KITE','EAGLE','DRONE','CLOUD']},
    ]},
    {categories:[
      {name:'Shades of Blue',color:'#3a7df2',words:['NAVY','AZURE','COBALT','TEAL']},
      {name:'Types of pasta',color:'#3fba4f',words:['PENNE','RIGATONI','FUSILLI','ORZO']},
      {name:'___ fish',color:'#e8a817',words:['SWORD','STAR','CLOWN','BLOW']},
      {name:'Famous Einsteins',color:'#e8443a',words:['ALBERT','BAGEL','THEORY','RELATIVITY']},
    ]},
    {categories:[
      {name:'Things in a kitchen',color:'#3a7df2',words:['FORK','OVEN','WHISK','LADLE']},
      {name:'Types of music',color:'#3fba4f',words:['JAZZ','BLUES','SOUL','FUNK']},
      {name:'___ stone',color:'#e8a817',words:['LIME','KEY','SAND','COBBLE']},
      {name:'Shades of red',color:'#e8443a',words:['RUBY','CRIMSON','SCARLET','MAROON']},
    ]},
    {categories:[
      {name:'Currencies',color:'#3a7df2',words:['YEN','EURO','POUND','PESO']},
      {name:'Dances',color:'#3fba4f',words:['TANGO','WALTZ','SALSA','RUMBA']},
      {name:'___ bear',color:'#e8a817',words:['POLAR','PANDA','GRIZZLY','TEDDY']},
      {name:'Things that buzz',color:'#e8443a',words:['BEE','PHONE','SAW','CROWD']},
    ]},
    {categories:[
      {name:'Phobias',color:'#3a7df2',words:['CLAUSTRO','ARACHNO','ACRO','HYDRO']},
      {name:'Types of tea',color:'#3fba4f',words:['GREEN','CHAI','OOLONG','MATCHA']},
      {name:'Parts of a car',color:'#e8a817',words:['AXLE','CLUTCH','BONNET','CHASSIS']},
      {name:'___ board',color:'#e8443a',words:['CARD','SKATE','SNOW','DART']},
    ]},
    {categories:[
      {name:'Oceans',color:'#3a7df2',words:['PACIFIC','ATLANTIC','ARCTIC','INDIAN']},
      {name:'Famous Mikes',color:'#3fba4f',words:['TYSON','JORDAN','JACKSON','MYERS']},
      {name:'___ house',color:'#e8a817',words:['FULL','TREE','FARM','WARE']},
      {name:'Things with shells',color:'#e8443a',words:['SNAIL','CRAB','EGG','TORTOISE']},
    ]},
    {categories:[
      {name:'Shakespeare plays',color:'#3a7df2',words:['HAMLET','OTHELLO','MACBETH','TEMPEST']},
      {name:'Coffee types',color:'#3fba4f',words:['LATTE','ESPRESSO','MOCHA','LUNGO']},
      {name:'___ light',color:'#e8a817',words:['MOON','SUN','STAR','FLASH']},
      {name:'Board game pieces',color:'#e8443a',words:['PAWN','TOKEN','DICE','MEEPLE']},
    ]},
    {categories:[
      {name:'Types of cheese',color:'#3a7df2',words:['BRIE','GOUDA','FETA','EDAM']},
      {name:'Harry Potter houses',color:'#3fba4f',words:['GRYFFINDOR','SLYTHERIN','HUFFLEPUFF','RAVENCLAW']},
      {name:'___ clock',color:'#e8a817',words:['ALARM','CUCKOO','STOP','BODY']},
      {name:'Olympic sports',color:'#e8443a',words:['EPEE','LUGE','BOBSLED','BIATHLON']},
    ]},
  ];

  Q.register('connections', function () {
    var puz = Q.pick(PUZZLES);
    var all = [];
    puz.categories.forEach(function(cat, ci) {
      cat.words.forEach(function(w) { all.push({word:w, cat:ci}); });
    });
    all = Q.shuffle(all);
    return {type:'connections',category:'verbalReasoning',categoryLabel:'Connections',difficulty:1.4,question:'Group 4 words that share something in common',words:all,categories:puz.categories,answer:'complete',options:[],explanation:'Find the hidden connection between each group.',visual:'custom'};
  }, 3);

  Q.registerRenderer('connections', {
    render: function(q, idx) {
      var words = q.words.map(function(w, i) {
        return '<button class="conn-word" data-ci="'+idx+'" data-cw="'+i+'" data-cat="'+w.cat+'">'+w.word+'</button>';
      }).join('');
      var dots = [0,1,2,3].map(function(){ return '<div class="conn-dot"></div>'; }).join('');
      return '<div class="qcard" style="gap:7px">'+
        '<div class="category">🔗 Connections</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="conn-lives" id="conn-lives-'+idx+'">'+dots+'</div>'+
        '<div class="conn-grid" id="conn-grid-'+idx+'">'+words+'</div>'+
        '<div class="conn-msg" id="conn-msg-'+idx+'"></div>'+
        '<button class="conn-sub" id="conn-sub-'+idx+'" disabled>Submit (0/4)</button>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        _gameBranding()+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var H = ctx.Haptics||{};
      var actEl = slideEl.querySelector('#wa-'+idx);
      if(actEl && ctx.addShareBtn) ctx.addShareBtn(actEl, q);
      var grid = document.getElementById('conn-grid-'+idx);
      var livesEl = document.getElementById('conn-lives-'+idx);
      var subBtn = document.getElementById('conn-sub-'+idx);
      var msgEl = document.getElementById('conn-msg-'+idx);
      if(!grid) return;

      var selected = [], lives = 4, solvedCats = 0, done = false;

      function getSelected() {
        return Array.from(grid.querySelectorAll('.conn-word.conn-sel'));
      }

      function updateSub() {
        var sel = getSelected();
        subBtn.textContent = 'Submit (' + sel.length + '/4)';
        subBtn.disabled = sel.length !== 4;
        subBtn.className = 'conn-sub' + (sel.length === 4 ? ' ready' : '');
      }

      grid.addEventListener('click', function(e) {
        var btn = e.target.closest('.conn-word');
        if(!btn || done || btn.classList.contains('conn-done')) return;
        var sel = getSelected();
        if(btn.classList.contains('conn-sel')) {
          H.light && H.light();
          btn.classList.remove('conn-sel');
        } else {
          if(sel.length >= 4) return;
          H.light && H.light();
          btn.classList.add('conn-sel');
        }
        msgEl.textContent = '';
        updateSub();
      });

      subBtn.addEventListener('click', function() {
        if(done) return;
        var sel = getSelected();
        if(sel.length !== 4) return;
        var catVotes = [0,0,0,0];
        sel.forEach(function(btn) { catVotes[parseInt(btn.dataset.cat)]++; });
        var maxCat = catVotes.indexOf(Math.max.apply(null, catVotes));
        var correct = catVotes[maxCat] === 4;

        if(correct) {
          H.success && H.success();
          var cat = q.categories[maxCat];
          sel.forEach(function(btn) { btn.classList.add('conn-done'); });
          setTimeout(function() {
            var row = document.createElement('div');
            row.className = 'conn-cat';
            row.style.background = cat.color;
            row.innerHTML = '<div class="conn-cat-nm" style="color:#fff">'+cat.name+'</div>'+
              '<div class="conn-cat-wds" style="color:rgba(255,255,255,.85)">'+cat.words.join(' · ')+'</div>';
            grid.insertBefore(row, grid.firstChild);
            solvedCats++;
            if(solvedCats === 4) { finish(true); }
          }, 280);
          msgEl.textContent = '✓ Correct!';
          msgEl.style.color = 'var(--green)';
        } else {
          var oneAway = catVotes.some(function(v){ return v === 3; });
          H.error && H.error();
          sel.forEach(function(btn){ btn.classList.add('conn-shake'); });
          setTimeout(function(){ sel.forEach(function(btn){ btn.classList.remove('conn-shake','conn-sel'); }); updateSub(); }, 400);
          lives--;
          var dots = livesEl.querySelectorAll('.conn-dot');
          if(dots[4-lives]) dots[4-lives].classList.add('gone');
          msgEl.textContent = oneAway ? 'One away! 😮' : 'Not quite!';
          msgEl.style.color = 'var(--red)';
          if(lives <= 0) { setTimeout(function(){ finish(false); }, 600); }
        }
      });

      function finish(won) {
        done = true;
        subBtn.disabled = true;
        var ms = Date.now() - ctx.answerStartRef.get();
        var data = ctx.IQData.recordAnswer(q.category, won, q.difficulty, ms);
        if(ctx.notifyGamePlayed) ctx.notifyGamePlayed('connections');
        if(ctx.onAnswer) ctx.onAnswer(won, ms);
        if(won) {
          msgEl.textContent = '🎉 All 4 groups found!';
          msgEl.style.color = 'var(--green)';
          H.streak && H.streak();
          ctx.flashEl.className = 'flash green show';
          ctx.spawnConfetti(20);
        } else {
          msgEl.textContent = 'Better luck next time!';
          msgEl.style.color = 'var(--red)';
          ctx.flashEl.className = 'flash red show';
        }
        setTimeout(function(){ ctx.flashEl.className = 'flash'; }, 350);
        var expEl = slideEl.querySelector('#exp-'+idx);
        if(expEl) {
          var hints = won ? 'Great grouping!' : q.categories.map(function(c){ return c.name+': '+c.words.join(', '); }).join(' | ');
          expEl.textContent = hints;
          expEl.classList.add('show');
        }
        ctx.updateUI(data);
        ctx.checkMore();
        ctx.answerStartRef.set(Date.now());
      }

      updateSub();
      ctx.answerStartRef.set(Date.now());
    }
  });
})();