// ═══════════════════════════════════════════════════
// QUESTIONS.JS — Core registry + utilities + question data
// ═══════════════════════════════════════════════════
//
// Question types self-register via:
//   Q.register(name, generatorFn, weight)
//
// Types with custom card UI (like Wordle) also call:
//   Q.registerRenderer(name, { render(q, idx), attach(slideEl, q, idx, ctx) })
//
// Default multiple-choice rendering is handled by improve.html
// for any type that doesn't register a custom renderer.
//
// ═══════════════════════════════════════════════════

var Q = {
  age: 25,
  used: new Set(),

  // ─── Registry internals ──────────────────────────
  _types: {},
  _weights: [],
  _renderers: {},

  register(name, fn, weight) {
    if (typeof weight !== 'number' || weight < 1) weight = 1;
    this._types[name] = fn;
    // Rebuild weights for this name (replace any old ones)
    this._weights = this._weights.filter(function(n){ return n !== name; });
    for (let i = 0; i < weight; i++) this._weights.push(name);
  },

  registerRenderer(name, renderer) {
    this._renderers[name] = renderer;
  },

  // ─── Public API ──────────────────────────────────
  setAge(a) { this.age = a || 25; },

  generate(targetDifficulty) {
    if (targetDifficulty === undefined) targetDifficulty = 1.0;
    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const typeName = this.pick(this._weights);
      const fn = this._types[typeName];
      if (!fn) continue;
      q = fn.call(this);
      tries++;
      if (tries > 30) break;
    } while (
      this.used.has(this.hash(q)) ||
      Math.abs(q.difficulty - targetDifficulty) > tolerance
    );
    this.used.add(this.hash(q));
    if (this.used.size > 1500) this.used = new Set([...this.used].slice(-750));
    return q;
  },

  // ─── Shared Utilities ────────────────────────────
  rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; },
  pick(arr) { return arr[this.rand(0, arr.length - 1)]; },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  numOpts(ans, n, spread) {
    if (!n) n = 4;
    const opts = new Set([ans]);
    const r = spread || Math.max(4, Math.abs(ans) * 0.35);
    let t = 0;
    while (opts.size < n && t++ < 100) {
      let v = ans + this.rand(1, Math.ceil(r)) * (Math.random() > 0.5 ? 1 : -1);
      if (Number.isInteger(ans)) v = Math.round(v);
      if (v !== ans && !isNaN(v)) opts.add(v);
    }
    while (opts.size < n) opts.add(ans + opts.size);
    return this.shuffle([...opts]);
  },

  hash(q) { return q.type + ':' + q.question.slice(0, 50) + (q.sequence || []).join(''); },

  getTargetDifficulty(iq) {
    if (iq < 85)  return 0.6;
    if (iq < 95)  return 0.8;
    if (iq < 105) return 1.0;
    if (iq < 115) return 1.2;
    if (iq < 125) return 1.5;
    if (iq < 135) return 1.8;
    return 2.1;
  },

  calculateIQChange(correct, questionDifficulty, currentIQ) {
    const expected = this.getTargetDifficulty(currentIQ);
    if (correct) {
      const reward = questionDifficulty / expected;
      return Math.max(1, Math.round(reward * 2.5));
    } else {
      const penalty = expected / questionDifficulty;
      return -Math.max(1, Math.round(penalty * 1.8));
    }
  },
};

// ═══════════════════════════════════════════════════
// QUESTION DATA — Matrix Logic
// ═══════════════════════════════════════════════════
(function(){
  Q.register('matrix',function(){
    var type=Q.rand(0,7),grid,ans,why,d;
    if(type===0){var sum=Q.rand(12,27),a=Q.rand(2,8),b=Q.rand(2,8),c=sum-a-b,dd=Q.rand(2,8),e=Q.rand(2,8),f=sum-dd-e,g=Q.rand(2,8),h=Q.rand(2,8);ans=sum-g-h;grid=[a,b,c,dd,e,f,g,h,'?'];why='Each row sums to '+sum+'. '+g+'+'+h+'+?='+sum;d=1.2;}
    else if(type===1){var add=Q.rand(2,6),r=[Q.rand(1,7),Q.rand(1,7),Q.rand(1,7)];grid=[r[0],r[1],r[2],r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];ans=r[2]+add*2;why='Each column +'+add+' per row.';d=1.1;}
    else if(type===2){var a2=Q.rand(2,5),b2=Q.rand(2,5),dd2=Q.rand(2,5),e2=Q.rand(2,5),g2=Q.rand(2,5),h2=Q.rand(2,5);grid=[a2,b2,a2*b2,dd2,e2,dd2*e2,g2,h2,'?'];ans=g2*h2;why='Each row: col1 × col2 = col3. '+g2+'×'+h2+'='+ans;d=1.3;}
    else if(type===3){var m=2,a3=Q.rand(2,5),b3=Q.rand(2,5),c3=Q.rand(2,5);grid=[a3,b3,c3,a3*m,b3*m,c3*m,a3*m*m,b3*m*m,'?'];ans=c3*m*m;why='Each row ×'+m+'.';d=1.1;}
    else if(type===4){var a4=Q.rand(2,6),add2=Q.rand(1,4);grid=[a4,a4+1,a4+2,a4+add2,a4+add2+1,a4+add2+2,a4+add2*2,a4+add2*2+1,'?'];ans=a4+add2*2+2;why='+1 across, +'+add2+' down.';d=1.2;}
    else if(type===5){var colSum=Q.rand(12,20),a5=Q.rand(2,6),dd5=Q.rand(2,6),g5=colSum-a5-dd5,b5=Q.rand(2,6),e5=Q.rand(2,6),h5=colSum-b5-e5,c5=Q.rand(2,6),f5=Q.rand(2,6);ans=colSum-c5-f5;grid=[a5,b5,c5,dd5,e5,f5,g5,h5,'?'];why='Each column sums to '+colSum+'.';d=1.3;}
    else if(type===6){var a6=Q.rand(2,9),c6=Q.rand(2,9),dd6=Q.rand(2,9),f6=Q.rand(2,9),e6=Math.round((dd6+f6)/2),g6=Q.rand(2,9),i6=Q.rand(2,9);ans=Math.round((g6+i6)/2);grid=[a6,Math.round((a6+c6)/2),c6,dd6,e6,f6,g6,'?',i6];why='Middle = average of first and last in each row.';d=1.5;}
    else{var diag=Q.rand(10,20),a7=Q.rand(2,7),e7=Q.rand(2,7),c7=Q.rand(2,7),g7=Q.rand(2,7);ans=diag-c7-g7;var b7=Q.rand(2,7),d7=Q.rand(2,7),f7=Q.rand(2,7),h7=Q.rand(2,7);grid=[a7,b7,c7,d7,e7,f7,g7,h7,'?'];why='Main diagonal sums to '+diag+'.';d=1.6;}
    return{type:'matrix',category:'patternRecognition',categoryLabel:'Matrix Logic',difficulty:d||1.3,question:'Find the missing number',grid:grid,answer:String(ans),options:Q.numOpts(ans).map(String),explanation:why,visual:'matrix'};
  },3);
})();

// ═══════════════════════════════════════════════════
// QUESTION DATA — Riddles (70+)
// ═══════════════════════════════════════════════════
(function(){
  var R=[
    {q:'I have hands but cannot clap. What am I?',a:'A clock',w:['A person','A robot','A tree'],why:'Clock hands tell time.',d:0.6},
    {q:'What has keys but no locks?',a:'A piano',w:['A door','A car','A safe'],why:'Piano has musical keys.',d:0.6},
    {q:'What gets wetter the more it dries?',a:'A towel',w:['A sponge','Paper','The sun'],why:'Towels absorb water.',d:0.7},
    {q:'What has a head and tail but no body?',a:'A coin',w:['A snake','A fish','A ghost'],why:'Coins have heads and tails.',d:0.7},
    {q:'What can you catch but not throw?',a:'A cold',w:['A ball','A fish','A wave'],why:'You catch a cold.',d:0.7},
    {q:'What has teeth but cannot bite?',a:'A comb',w:['A shark','A dog','A saw'],why:'Combs have teeth.',d:0.6},
    {q:'What goes up but never comes down?',a:'Your age',w:['A balloon','A bird','Smoke'],why:'Age only increases.',d:0.7},
    {q:'What has one eye but cannot see?',a:'A needle',w:['A pirate','A cyclops','A camera'],why:'Needle eye.',d:0.7},
    {q:'What has words but never speaks?',a:'A book',w:['A parrot','A phone','A radio'],why:'Books have words.',d:0.6},
    {q:'What runs but never walks?',a:'Water',w:['A dog','A car','Time'],why:'Water runs.',d:0.7},
    {q:'The more you take, the more you leave behind.',a:'Footsteps',w:['Money','Time','Breath'],why:'Walking leaves footsteps.',d:1.0},
    {q:'What can fill a room but takes no space?',a:'Light',w:['Air','Water','Sound'],why:'Light has no mass.',d:1.0},
    {q:'What travels the world staying in a corner?',a:'A stamp',w:['A compass','The internet','A satellite'],why:'Stamps in envelope corners.',d:1.0},
    {q:'I have cities but no houses. What am I?',a:'A map',w:['A planet','A dream','A story'],why:'Maps show places without buildings.',d:1.0},
    {q:'The more there is, the less you see.',a:'Darkness',w:['Light','Fog','Space'],why:'Darkness reduces visibility.',d:1.0},
    {q:'I speak without a mouth. What am I?',a:'An echo',w:['A ghost','Music','The wind'],why:'Echoes repeat sound.',d:1.1},
    {q:'Saying my name breaks me. What am I?',a:'Silence',w:['Glass','A dream','A secret'],why:'Speaking breaks silence.',d:1.3},
    {q:'I have no life but I can die.',a:'A battery',w:['A robot','A flame','A ghost'],why:'Batteries die.',d:1.3},
    {q:'What gets sharper the more you use it?',a:'Your mind',w:['A knife','A pencil','A saw'],why:'Practice sharpens minds.',d:1.2},
    {q:'What has 13 hearts but no organs?',a:'A deck of cards',w:['A hospital','A town','A garden'],why:'13 heart cards.',d:1.4},
    {q:'What tastes better than it smells?',a:'Your tongue',w:['Coffee','Perfume','Bacon'],why:'Tongues taste, not smell.',d:1.5},
    {q:'What has a neck but no head?',a:'A bottle',w:['A shirt','A guitar','A giraffe'],why:'Bottles have necks.',d:0.7},
    {q:'What is always in front of you but unseen?',a:'The future',w:['Air','Glass','Your nose'],why:'The future is invisible.',d:1.1},
    {q:'What can you break without touching?',a:'A promise',w:['Glass','A record','Ice'],why:'Promises break without contact.',d:1.3},
    {q:'What invention lets you see through a wall?',a:'A window',w:['A mirror','X-rays','A telescope'],why:'Windows are transparent walls.',d:0.8},
    {q:'Once in a minute, twice in a moment, never in a thousand years.',a:'The letter M',w:['A second','Silence','A heartbeat'],why:'M appears in those words.',d:1.4},
    {q:'What has a ring but no finger?',a:'A telephone',w:['A planet','A boxing ring','A circus'],why:'Phones ring.',d:0.7},
    {q:'What can be cracked, made, told, and played?',a:'A joke',w:['A record','An egg','A game'],why:'Jokes do all four.',d:1.0},
    {q:'What gets bigger when more is taken away?',a:'A hole',w:['A debt','A balloon','A sponge'],why:'Digging makes holes bigger.',d:1.1},
    {q:'What has branches but no fruit?',a:'A bank',w:['A dead tree','A road','A river'],why:'Bank branches.',d:1.2},
    {q:'What loses its head every morning?',a:'A pillow',w:['A candle','The sun','A coin'],why:'You lift your head off.',d:1.1},
    {q:'Full of holes but holds water.',a:'A sponge',w:['A net','A bucket','A cloud'],why:'Sponges absorb.',d:0.8},
    {q:'What word becomes shorter adding two letters?',a:'Short',w:['Small','Tiny','Brief'],why:'Short + er = shorter.',d:1.4},
    {q:'I fly without wings, cry without eyes.',a:'A cloud',w:['A bat','A ghost','Smoke'],why:'Clouds rain and drift.',d:1.2},
    {q:'What can you never eat for breakfast?',a:'Dinner',w:['Eggs','Lunch','Cereal'],why:'Dinner is evening.',d:0.6},
    {q:'What belongs to you but others use more?',a:'Your name',w:['Your phone','Your money','Your house'],why:'Others say your name.',d:1.1},
    {q:'I shrink every time you use me.',a:'A bar of soap',w:['A sponge','A pencil','A candle'],why:'Soap wears down.',d:0.8},
    {q:'Many keys but opens no door.',a:'A keyboard',w:['A key ring','A piano','A safe'],why:'Keyboard keys.',d:0.8},
    {q:'What has ears but cannot hear?',a:'A cornfield',w:['A statue','A teddy bear','A painting'],why:'Corn has ears.',d:0.7},
    {q:'What building has the most stories?',a:'A library',w:['A skyscraper','A hotel','A museum'],why:'Books = stories.',d:0.8},
    {q:'Thumb and four fingers, not alive.',a:'A glove',w:['A hand','A puppet','A statue'],why:'Gloves.',d:0.7},
    {q:'What month has 28 days?',a:'All of them',w:['February','None','Just February'],why:'All months have 28+.',d:0.9},
    {q:'Keep after giving it away.',a:'Your word',w:['A gift','A smile','Money'],why:'You keep your word.',d:1.0},
    {q:'Goes through cities but never moves.',a:'A road',w:['The wind','A river','Sunlight'],why:'Roads are stationary.',d:0.9},
    {q:'Has a bed but never sleeps.',a:'A river',w:['A cave','A volcano','A hotel'],why:'Riverbeds.',d:1.1},
    {q:'Broken without being held.',a:'A promise',w:['Silence','A rule','A heart'],why:'Abstract breaking.',d:1.0},
    {q:'What begins and ends with T, has T in it?',a:'A teapot',w:['A toast','A tent','A test'],why:'Teapot has tea.',d:1.2},
    {q:'Four wheels and flies.',a:'A garbage truck',w:['An airplane','A helicopter','A drone'],why:'Attracts flies.',d:1.3},
    {q:'What has legs but cannot walk?',a:'A table',w:['A chair','A bed','A stool'],why:'Table legs.',d:0.6},
    {q:'A room with no doors or windows.',a:'A mushroom',w:['A dark room','A sealed room','A virtual room'],why:'Mush-room.',d:1.0},
    {q:'Share me and you have less.',a:'A secret',w:['Money','Time','Food'],why:'Sharing secrets.',d:1.1},
    {q:'Goes up and down but stays still.',a:'A staircase',w:['An elevator','A seesaw','Temperature'],why:'Stairs are fixed.',d:0.9},
    {q:'Face and two hands, no arms.',a:'A clock',w:['A doll','A robot','A puppet'],why:'Clock face and hands.',d:0.6},
    {q:'I have lakes with no water.',a:'A map',w:['A dream','A painting','A model'],why:'Map geography.',d:1.1},
    {q:'What has a heart that doesnt beat?',a:'An artichoke',w:['A robot','A teddy bear','A statue'],why:'Artichoke hearts.',d:1.3},
    {q:'What has an eye but has never seen?',a:'A hurricane',w:['A potato','A storm','A needle'],why:'Eye of a hurricane.',d:1.2},
    {q:'Im tall when young and short when old.',a:'A candle',w:['A person','A tree','A shadow'],why:'Candles melt shorter.',d:0.8},
    {q:'What has a spine but no bones?',a:'A book',w:['A cactus','A fish','A snake'],why:'Book spines.',d:0.9},
    {q:'What can be served but never eaten?',a:'A tennis ball',w:['A plate','Revenge','Justice'],why:'You serve in tennis.',d:1.2},
    {q:'What has a bank but no money?',a:'A river',w:['A piggybank','A vault','A casino'],why:'Riverbanks.',d:0.9},
    {q:'What coat is always wet when you put it on?',a:'A coat of paint',w:['A raincoat','A fur coat','A lab coat'],why:'Paint is wet when applied.',d:1.3},
    {q:'What gets answered but never asks questions?',a:'A doorbell',w:['A phone','A teacher','A riddle'],why:'You answer the door.',d:1.1},
    {q:'What is full of holes but still holds water?',a:'A sponge',w:['A net','A bucket','A cloud'],why:'Sponges are porous yet absorb water.',d:0.8},
    {q:'What can you hold in your right hand but never in your left?',a:'Your left hand',w:['A pen','A coin','A ball'],why:'You cannot hold your left hand with itself.',d:1.0},
    {q:'What has four legs in the morning, two at noon, and three in the evening?',a:'A human',w:['A dog','A spider','A horse'],why:'Baby crawls, adult walks, elder uses a cane.',d:1.2},
    {q:'What can you break even if you never pick it up or touch it?',a:'A promise',w:['Glass','A record','Ice'],why:'You can break a promise without touching anything.',d:1.3},
    {q:'I fly without wings. I cry without eyes. What am I?',a:'A cloud',w:['A bat','A ghost','Smoke'],why:'Clouds bring rain and block sunlight.',d:1.2},
  ];
  Q.register('riddle',function(){
    var i=Q.pick(R);
    return{type:'riddle',category:'problemSolving',categoryLabel:'Riddle',
      difficulty:i.d||1.1,question:i.q,answer:i.a,
      options:Q.shuffle([i.a].concat(i.w)),explanation:i.why,visual:'text'};
  },3);
})();
