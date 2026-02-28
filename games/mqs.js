// ═══════════════════════════════════════════════════
// MCQ GAME  — all multiple-choice question types
// ═══════════════════════════════════════════════════

const MCQGame = (() => {

  // ── tiny utils ────────────────────────────────────
  const u = {
    rand(a, b)  { return Math.floor(Math.random() * (b - a + 1)) + a; },
    pick(arr)   { return arr[this.rand(0, arr.length - 1)]; },
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    numOpts(ans, n = 4, spread) {
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
  };

  let _age = 25;
  function setAge(a) { _age = a || 25; }

  // ── render (shared for all MCQ types) ─────────────
  function render(q, idx) {
    let visual = '';
    if (q.visual === 'sequence' || q.visual === 'letterSequence') {
      const parts = q.sequence.map((n, i) => {
        if (n === '?') return `<span class="blank">?</span>`;
        const arrow = i < q.sequence.length - 1 ? `<span class="arrow">→</span>` : '';
        return `<span>${n}</span>${arrow}`;
      });
      if (q.sequence[q.sequence.length - 1] !== '?')
        parts.push(`<span class="arrow">→</span><span class="blank">?</span>`);
      visual = `<div class="sequence">${parts.join('')}</div>`;
    } else if (q.visual === 'matrix') {
      visual = `<div class="matrix">${q.grid.map(c =>
        `<div class="matrix-cell${c === '?' ? ' blank' : ''}">${c}</div>`
      ).join('')}</div>`;
    }
    const wide = q.options.some(o => String(o).length > 20);
    return `
      <div class="qcard">
        <div class="category">${q.categoryLabel}</div>
        <div class="question">${q.question}</div>
        ${visual}
        <div class="options${wide ? ' wide' : ''}" data-idx="${idx}" data-ans="${_esc(q.answer)}" data-cat="${q.category}" data-diff="${q.difficulty}">
          ${q.options.map(o => `<button class="opt" data-v="${_esc(o)}">${o}</button>`).join('')}
        </div>
        <div class="feedback" id="fb-${idx}"></div>
        <div class="explain"  id="exp-${idx}">${q.explanation}</div>
      </div>
      <div class="scroll-hint" id="hint-${idx}">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        Swipe for next
      </div>`;
  }

  // attach is handled globally in improve.html for MCQ (click delegation)
  // but we expose a no-op so the interface is consistent
  function attach() {}

  function _esc(s) { return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

  // ── GENERATORS ────────────────────────────────────

  function numSeq() {
    const patterns = [
      () => { const add=u.rand(2,10),s=u.rand(1,30); return {seq:[s,s+add,s+add*2,s+add*3],ans:s+add*4,d:0.6,why:`+${add} each time.`}; },
      () => { const sub=u.rand(2,8),s=u.rand(40,80); return {seq:[s,s-sub,s-sub*2,s-sub*3],ans:s-sub*4,d:0.7,why:`-${sub} each time.`}; },
      () => { const s=u.rand(2,6); return {seq:[s,s*2,s*4,s*8],ans:s*16,d:0.7,why:`Doubles each time.`}; },
      () => { const s=u.rand(1,4); return {seq:[s,s*3,s*9,s*27],ans:s*81,d:0.8,why:`Triples each time.`}; },
      () => ({seq:[2,3,5,7],ans:11,d:0.9,why:`Prime numbers.`}),
      () => ({seq:[1,3,6,10],ans:15,d:0.8,why:`Triangular numbers: +2,+3,+4,+5.`}),
      () => { const s=u.rand(1,6); return {seq:[s,s+2,s+5,s+9],ans:s+14,d:0.8,why:`Gaps: +2,+3,+4,+5.`}; },
      () => { const s=u.rand(4,8)*16; return {seq:[s,s/2,s/4,s/8],ans:s/16,d:0.7,why:`Halved each time.`}; },
      () => { const o=u.rand(1,5); return {seq:[o*o,(o+1)**2,(o+2)**2,(o+3)**2],ans:(o+4)**2,d:0.9,why:`Perfect squares.`}; },
      () => { const a=u.rand(1,5),b=u.rand(2,6); const c=a+b,d=b+c,e=c+d; return {seq:[a,b,c,d],ans:e,d:1.0,why:`Each = sum of previous two.`}; },
      () => { const o=u.rand(0,2); return {seq:[2**(o+1),2**(o+2),2**(o+3),2**(o+4)],ans:2**(o+5),d:1.0,why:`Powers of 2.`}; },
      () => { const o=u.rand(1,4); return {seq:[o**3,(o+1)**3,(o+2)**3,(o+3)**3],ans:(o+4)**3,d:1.1,why:`Cube numbers.`}; },
      () => { const s=u.rand(1,8); return {seq:[s,s+2,s+6,s+12],ans:s+20,d:1.1,why:`Gaps double: +2,+4,+6,+8.`}; },
      () => { const s=u.rand(1,5); return {seq:[s,s*2,s*6,s*24],ans:s*120,d:1.2,why:`×2,×3,×4,×5.`}; },
      () => { const c=u.rand(1,5); return {seq:[1+c,4+c,9+c,16+c],ans:25+c,d:1.1,why:`Perfect squares + ${c}.`}; },
      () => { const s=u.rand(1,6); return {seq:[s,s+1,s+3,s+7],ans:s+15,d:1.2,why:`Gaps double: +1,+2,+4,+8.`}; },
      () => { const s=u.rand(2,5); return {seq:[s,s*s,s*s*s,s*s*s*s],ans:s**5,d:1.3,why:`Powers of ${s}.`}; },
      () => ({seq:[1,1,2,3,5,8],ans:13,d:1.3,why:`Fibonacci: each = sum of previous two.`}),
      () => ({seq:[2,6,12,20,30],ans:42,d:1.4,why:`n(n+1): 6×7=42.`}),
      () => { const a=u.rand(10,30),dd=u.rand(3,9); return {seq:[a,a+dd,a+dd*3,a+dd*6],ans:a+dd*10,d:1.5,why:`Gaps: +${dd},+${dd*2},+${dd*3},+${dd*4}.`}; },
    ];
    const p = u.pick(patterns)();
    return {
      type:'numSeq', category:'patternRecognition', categoryLabel:'Number Pattern',
      difficulty:p.d, question:'What comes next?',
      sequence:p.seq, answer:String(p.ans),
      options:u.numOpts(p.ans).map(String), explanation:p.why, visual:'sequence'
    };
  }

  function letterSeq() {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => { const i=u.rand(0,19); return {seq:[A[i],A[i+1],A[i+2],A[i+3]],ans:A[i+4],d:0.6,why:`Consecutive letters.`}; },
      () => { const i=u.rand(0,15); return {seq:[A[i],A[i+2],A[i+4],A[i+6]],ans:A[i+8],d:0.7,why:`Skip one letter.`}; },
      () => { const i=u.rand(10,25); return {seq:[A[i],A[i-1],A[i-2],A[i-3]],ans:A[i-4],d:0.6,why:`Backward alphabet.`}; },
      () => ({seq:['A','E','I','O'],ans:'U',d:0.7,why:`The five vowels.`}),
      () => ({seq:['B','D','F','H'],ans:'J',d:0.7,why:`Every other letter from B.`}),
      () => ({seq:['Z','X','V','T'],ans:'R',d:0.7,why:`Backwards, skipping one.`}),
      () => { const i=u.rand(0,11); return {seq:[A[i],A[i+3],A[i+6],A[i+9]],ans:A[i+12],d:1.0,why:`Skip two letters.`}; },
      () => ({seq:['A','B','D','G'],ans:'K',d:1.0,why:`Gaps: +1,+2,+3,+4.`}),
      () => ({seq:['Z','Y','W','T'],ans:'P',d:1.0,why:`Gaps: -1,-2,-3,-4.`}),
      () => ({seq:['A','C','F','J'],ans:'O',d:1.1,why:`Gaps: +2,+3,+4,+5.`}),
      () => ({seq:['A','Z','B','Y'],ans:'C',d:1.3,why:`Alternating from start and end.`}),
      () => ({seq:['B','E','I','N'],ans:'T',d:1.4,why:`Gaps: +3,+4,+5,+6.`}),
      () => ({seq:['Z','A','Y','B'],ans:'X',d:1.3,why:`Alternating backward from Z and forward from A.`}),
      () => ({seq:['A','B','D','H'],ans:'P',d:1.6,why:`Positions double: 1,2,4,8,16=P.`}),
    ];
    const p = u.pick(patterns)();
    const wrong = A.split('').filter(l => l !== p.ans);
    return {
      type:'letterSeq', category:'patternRecognition', categoryLabel:'Letter Pattern',
      difficulty:p.d, question:'What letter comes next?',
      sequence:p.seq, answer:p.ans,
      options:u.shuffle([p.ans,...u.shuffle(wrong).slice(0,3)]),
      explanation:p.why, visual:'letterSequence'
    };
  }

  function matrix() {
    const type = u.rand(0,7);
    let grid, ans, why, d;
    if (type===0) {
      const sum=u.rand(12,27),a=u.rand(2,8),b=u.rand(2,8),c=sum-a-b,dd=u.rand(2,8),e=u.rand(2,8),f=sum-dd-e,g=u.rand(2,8),h=u.rand(2,8);
      ans=sum-g-h; grid=[a,b,c,dd,e,f,g,h,'?']; why=`Each row sums to ${sum}.`; d=1.2;
    } else if (type===1) {
      const add=u.rand(2,6),r=[u.rand(1,7),u.rand(1,7),u.rand(1,7)];
      grid=[...r,r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?']; ans=r[2]+add*2; why=`Each column +${add} per row.`; d=1.1;
    } else if (type===2) {
      const a=u.rand(2,5),b=u.rand(2,5),dd=u.rand(2,5),e=u.rand(2,5),g=u.rand(2,5),h=u.rand(2,5);
      grid=[a,b,a*b,dd,e,dd*e,g,h,'?']; ans=g*h; why=`Row: col1 × col2 = col3.`; d=1.3;
    } else if (type===3) {
      const a=u.rand(2,5),b=u.rand(2,5),c=u.rand(2,5);
      grid=[a,b,c,a*2,b*2,c*2,a*4,b*4,'?']; ans=c*4; why=`Each row ×2.`; d=1.1;
    } else if (type===4) {
      const a=u.rand(2,6),add=u.rand(1,4);
      grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?']; ans=a+add*2+2; why=`+1 across, +${add} down.`; d=1.2;
    } else if (type===5) {
      const colSum=u.rand(12,20),a=u.rand(2,6),dd=u.rand(2,6),g=colSum-a-dd,b=u.rand(2,6),e=u.rand(2,6),h=colSum-b-e,c=u.rand(2,6),f=u.rand(2,6);
      ans=colSum-c-f; grid=[a,b,c,dd,e,f,g,h,'?']; why=`Each column sums to ${colSum}.`; d=1.3;
    } else if (type===6) {
      const a=u.rand(2,9),c=u.rand(2,9),b=Math.round((a+c)/2),dd=u.rand(2,9),f=u.rand(2,9),e=Math.round((dd+f)/2),g=u.rand(2,9),i2=u.rand(2,9);
      ans=Math.round((g+i2)/2); grid=[a,b,c,dd,e,f,g,'?',i2]; why=`Middle = average of first and last.`; d=1.5;
    } else {
      const diag=u.rand(10,20),a=u.rand(2,7),e=u.rand(2,7),i2=diag-a-e,c=u.rand(2,7),g=u.rand(2,7);
      ans=diag-c-g; const b=u.rand(2,7),d2=u.rand(2,7),f=u.rand(2,7),h=u.rand(2,7);
      grid=[a,b,c,d2,e,f,g,h,'?']; why=`Main diagonal sums to ${diag}.`; d=1.6;
    }
    return {
      type:'matrix', category:'patternRecognition', categoryLabel:'Matrix Logic',
      difficulty:d||1.3, question:'Find the missing number',
      grid, answer:String(ans), options:u.numOpts(ans).map(String),
      explanation:why, visual:'matrix'
    };
  }

  function series() {
    const items = [
      {q:'J, F, M, A, M, J, ?',a:'J',w:['A','S','D'],why:'Month initials. July=J.',d:0.7},
      {q:'S, M, T, W, T, F, ?',a:'S',w:['M','T','W'],why:'Weekday initials. Saturday=S.',d:0.7},
      {q:'R, O, Y, G, B, I, ?',a:'V',w:['P','R','O'],why:'Rainbow colors. Violet=V.',d:0.7},
      {q:'M, V, E, M, J, S, U, ?',a:'N',w:['P','E','M'],why:'Planets from Sun. Neptune=N.',d:0.8},
      {q:'I, II, III, IV, V, VI, ?',a:'VII',w:['VIII','IIV','VV'],why:'Roman numerals.',d:0.7},
      {q:'Do, Re, Mi, Fa, Sol, La, ?',a:'Ti',w:['Do','Si','Se'],why:'Solfege scale.',d:0.7},
      {q:'N, S, E, ?',a:'W',w:['N','S','NE'],why:'Compass directions.',d:0.6},
      {q:'Spring, Summer, Autumn, ?',a:'Winter',w:['Fall','Monsoon','Spring'],why:'Four seasons.',d:0.6},
      {q:'O, T, T, F, F, S, S, ?',a:'E',w:['N','T','S'],why:'First letters of numbers. Eight=E.',d:1.0},
      {q:'H, He, Li, Be, B, C, ?',a:'N',w:['O','F','Ne'],why:'Chemical elements. Nitrogen=N.',d:1.1},
      {q:'A, E, ?',a:'I',w:['O','U','C'],why:'Vowels in order.',d:0.8},
      {q:'2, 3, 5, 7, 11, 13, ?',a:'17',w:['14','15','16'],why:'Prime numbers.',d:1.1},
      {q:'Q, W, E, R, T, ?',a:'Y',w:['U','A','S'],why:'Top row of QWERTY keyboard.',d:1.0},
      {q:'Mercury, Venus, Earth, ?',a:'Mars',w:['Jupiter','Saturn','Neptune'],why:'Planets in order from Sun.',d:0.7},
      {q:'Solid, Liquid, ?',a:'Gas',w:['Steam','Ice','Plasma'],why:'States of matter.',d:0.7},
      {q:'1, 1, 2, 3, 5, 8, ?',a:'13',w:['11','14','10'],why:'Fibonacci. 5+8=13.',d:1.0},
      {q:'G, E, D, C, B, ?',a:'A',w:['F','G','H'],why:'Musical notes descending.',d:1.4},
      {q:'AT, FT, HG, PB, AU, ?',a:'AG',w:['FE','CU','SN'],why:'Chemical symbols for metals. AU=Gold, AG=Silver.',d:1.8},
    ];
    const i = u.pick(items);
    return {
      type:'series', category:'patternRecognition', categoryLabel:'Complete the Series',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function shapePattern() {
    const items = [
      {q:'Triangle (3), Square (4), Pentagon (5), Hexagon (6), ?',a:'Heptagon (7)',w:['Octagon (8)','Hexagon (6)','Pentagon (5)'],why:'Polygons with increasing sides.',d:0.8},
      {q:'How many faces does a cube have?',a:'6',w:['4','8','12'],why:'Top,bottom,front,back,left,right=6.',d:0.6},
      {q:'How many degrees in a full circle?',a:'360',w:['180','270','90'],why:'A full rotation = 360°.',d:0.6},
      {q:'How many right angles in a rectangle?',a:'4',w:['2','3','6'],why:'All four corners are right angles.',d:0.6},
      {q:'How many faces does a triangular pyramid have?',a:'4',w:['3','5','6'],why:'A tetrahedron has 4 triangular faces.',d:1.0},
      {q:'How many edges does a cube have?',a:'12',w:['6','8','10'],why:'4 top + 4 bottom + 4 vertical = 12.',d:1.0},
      {q:'How many lines of symmetry does a regular hexagon have?',a:'6',w:['3','4','8'],why:'6 lines through opposite vertices/midpoints.',d:1.1},
      {q:'What is the interior angle of a regular hexagon?',a:'120°',w:['90°','108°','135°'],why:'(6-2)×180/6 = 120°.',d:1.2},
      {q:'How many vertices does a cube have?',a:'8',w:['6','10','12'],why:'8 corners on a cube.',d:0.9},
      {q:'What is the exterior angle of a regular pentagon?',a:'72°',w:['60°','90°','108°'],why:'360/5 = 72°.',d:1.3},
      {q:'What is the sum of interior angles in a hexagon?',a:'720°',w:['540°','900°','360°'],why:'(6-2)×180 = 720°.',d:1.3},
      {q:'How many faces does an icosahedron have?',a:'20',w:['12','8','16'],why:'Icosa = 20 triangular faces.',d:1.5},
      {q:'What is the number of diagonals in a hexagon?',a:'9',w:['6','12','8'],why:'n(n-3)/2 = 9.',d:1.6},
    ];
    const i = u.pick(items);
    return {
      type:'shapePattern', category:'patternRecognition', categoryLabel:'Shape Logic',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function codeBreak() {
    const items = [
      {q:'If A=1, B=2, C=3, what is A+B+C?',a:'6',w:['3','9','5'],why:'1+2+3=6',d:0.7},
      {q:'If N+N=10, what is N?',a:'5',w:['10','4','6'],why:'2N=10, N=5',d:0.7},
      {q:'If X times X = 25, what is X?',a:'5',w:['4','6','25'],why:'5×5=25',d:0.7},
      {q:'If P × 3 = 18, what is P?',a:'6',w:['3','9','18'],why:'18/3=6',d:0.7},
      {q:'If X/2 = 7, what is X?',a:'14',w:['7','9','12'],why:'X=7×2=14',d:0.7},
      {q:'If A=1, B=2... what is Z?',a:'26',w:['24','25','28'],why:'Z is the 26th letter.',d:0.8},
      {q:'If M=4, what is M×M−M?',a:'12',w:['8','16','0'],why:'16-4=12',d:1.0},
      {q:'If 2X − 3 = 7, what is X?',a:'5',w:['4','6','7'],why:'2X=10, X=5',d:1.0},
      {q:'If A=2, B=4, C=6... what is E?',a:'10',w:['8','12','5'],why:'Each letter=position×2. E=5th, 10.',d:1.1},
      {q:'If N×N×N = 27, what is N?',a:'3',w:['9','6','4'],why:'3×3×3=27',d:1.0},
      {q:'If 3X + 2Y = 20 and X=4, what is Y?',a:'4',w:['2','6','8'],why:'12+2Y=20, 2Y=8, Y=4',d:1.4},
      {q:'STAR=58. Each letter=position in alphabet. What does DOG equal?',a:'26',w:['30','22','29'],why:'D=4,O=15,G=7. 4+15+7=26',d:1.5},
      {q:'If RED=27, GREEN=49, what is BLUE?',a:'40',w:['35','45','38'],why:'B+L+U+E=2+12+21+5=40',d:1.7},
    ];
    const i = u.pick(items);
    return {
      type:'codeBreak', category:'problemSolving', categoryLabel:'Code Breaker',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function riddle() {
    const items = [
      {q:'I have hands but cannot clap. What am I?',a:'A clock',w:['A person','A robot','A tree'],why:"Clock hands can't clap.",d:0.6},
      {q:'What has keys but no locks?',a:'A piano',w:['A door','A car','A safe'],why:'Piano has musical keys.',d:0.6},
      {q:'What gets wetter the more it dries?',a:'A towel',w:['A sponge','Paper','The sun'],why:'A towel absorbs water.',d:0.7},
      {q:'What has a head and tail but no body?',a:'A coin',w:['A snake','A fish','A ghost'],why:'Coins have heads and tails.',d:0.7},
      {q:'What can you catch but not throw?',a:'A cold',w:['A ball','A fish','A wave'],why:'You catch a cold illness.',d:0.7},
      {q:'I am tall when young, short when old. What am I?',a:'A candle',w:['A person','A tree','A building'],why:'Candles burn down.',d:0.7},
      {q:'What has teeth but cannot bite?',a:'A comb',w:['A shark','A dog','A saw'],why:'A comb has teeth for hair.',d:0.6},
      {q:'What goes up but never comes down?',a:'Your age',w:['A balloon','A bird','Smoke'],why:'Age only increases.',d:0.7},
      {q:'The more you take, the more you leave behind. What?',a:'Footsteps',w:['Money','Time','Breath'],why:'Walking leaves footsteps.',d:1.0},
      {q:'What can fill a room but takes no space?',a:'Light',w:['Air','Water','Sound'],why:'Light has no mass.',d:1.0},
      {q:'What breaks but never falls, and falls but never breaks?',a:'Day and Night',w:['Glass','Waves','Dreams'],why:'Day breaks, night falls.',d:1.0},
      {q:'What can travel around the world while staying in a corner?',a:'A stamp',w:['A compass','The internet','A satellite'],why:'Stamps stay in envelope corners.',d:1.0},
      {q:'The more there is, the less you see. What am I?',a:'Darkness',w:['Light','Fog','Space'],why:'More darkness = less visibility.',d:1.0},
      {q:'What is so fragile that saying its name breaks it?',a:'Silence',w:['Glass','A dream','A secret'],why:'Speaking breaks silence.',d:1.3},
      {q:"The person who makes it doesn't need it, the buyer doesn't want it, the user doesn't know it. What is it?",a:'A coffin',w:['A pill','A gift','A trap'],why:'Coffins are made, bought, and used in this way.',d:1.5},
      {q:"I'm light as a feather but even the world's strongest man can't hold me for five minutes. What am I?",a:'Your breath',w:['Air','A thought','A cloud'],why:'No one can hold their breath for 5+ minutes.',d:1.2},
      {q:'What has 13 hearts but no other organs?',a:'A deck of cards',w:['A hospital','A town','A garden'],why:'Each of the 4 suits has cards; 13 heart cards.',d:1.4},
    ];
    const i = u.pick(items);
    return {
      type:'riddle', category:'problemSolving', categoryLabel:'Riddle',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function wordProblem() {
    const gens = [
      () => { const a=u.rand(3,6),p=u.rand(2,4); return {q:`A store sells ${a} apples for $${p}. How much for ${a*2} apples?`,a:String(p*2),w:[String(p*3),String(p+2),String(p)],why:`Double the apples = double the price.`,d:0.7}; },
      () => { const t=u.rand(15,30),g=u.rand(3,10); return {q:`${t} students in class. ${g} wear glasses. How many don't?`,a:String(t-g),w:[String(t+g),String(g),String(t)],why:`${t}-${g}=${t-g}`,d:0.6}; },
      () => { const p=u.rand(3,8),d=u.rand(5,10); return {q:`A car travels ${p} miles per minute. How far in ${d} minutes?`,a:String(p*d)+' miles',w:[String(p*d+p)+' miles',String(p+d)+' miles',String(p*d-p)+' miles'],why:`${p}×${d}=${p*d} miles`,d:0.7}; },
      () => { const each=u.rand(3,8),n=u.rand(4,10); const total=each*n,paid=Math.ceil(total/10)*10; return {q:`You buy ${n} items at $${each} each. Pay with $${paid}. Change?`,a:'$'+String(paid-total),w:['$'+String(paid-total+1),'$'+String(paid-total-1),'$'+String(each)],why:`${n}×$${each}=$${total}. $${paid}-$${total}=$${paid-total}`,d:0.9}; },
      () => { const base=u.rand(5,12),h=u.rand(4,10); return {q:`A rectangle is ${base}cm wide and ${h}cm tall. Perimeter?`,a:String((base+h)*2)+'cm',w:[String(base*h)+'cm',String(base+h)+'cm',String((base+h)*2+2)+'cm'],why:`2×(${base}+${h})=${(base+h)*2}cm`,d:1.0}; },
      () => { const speed=u.rand(4,8)*10,time=u.rand(2,4); return {q:`Driving at ${speed} mph for ${time} hours. Distance?`,a:String(speed*time)+' miles',w:[String(speed+time)+' miles',String(speed*time+speed)+' miles',String(speed*(time-1))+' miles'],why:`${speed}×${time}=${speed*time} miles`,d:0.9}; },
      () => { const pages=u.rand(100,300),read=u.rand(40,80); return {q:`Book has ${pages} pages. Read ${read}. % remaining?`,a:Math.round((pages-read)/pages*100)+'%',w:[Math.round(read/pages*100)+'%',Math.round((pages-read)/pages*100+10)+'%',Math.round((pages-read)/pages*100-10)+'%'],why:`(${pages}-${read})/${pages}×100≈${Math.round((pages-read)/pages*100)}%`,d:1.1}; },
      () => { const base=u.rand(4,9),h=u.rand(4,9); return {q:`Triangle base=${base}cm, height=${h}cm. Area?`,a:String(base*h/2)+'cm²',w:[String(base*h)+'cm²',String((base+h)*2)+'cm²',String(base*h/2+1)+'cm²'],why:`Area=½×${base}×${h}=${base*h/2}cm²`,d:1.2}; },
      () => { const p=u.rand(20,80),disc=u.rand(10,40); return {q:`Item costs $${p}. ${disc}% off. Final price?`,a:'$'+String(Math.round(p*(1-disc/100))),w:['$'+String(Math.round(p*(1-disc/100))+5),'$'+String(Math.round(p*disc/100)),'$'+String(p-disc)],why:`$${p}×${1-disc/100}=$${Math.round(p*(1-disc/100))}`,d:1.2}; },
    ];
    const gen = u.pick(gens)();
    return {
      type:'wordProblem', category:'problemSolving', categoryLabel:'Word Problem',
      difficulty:gen.d||1.2, question:gen.q, answer:gen.a,
      options:u.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  }

  function logicGrid() {
    const items = [
      {q:'Amy has a dog. Ben has a cat. The pet owner on Oak St has a dog. Who lives on Oak St?',a:'Amy',w:['Ben','Neither','Both'],why:'Amy has a dog = Oak St person.',d:0.9},
      {q:'All teachers have degrees. Maria has a degree. Is Maria a teacher?',a:'Not necessarily',w:['Yes','No','Always'],why:'Not all degree holders are teachers.',d:1.1},
      {q:'Alex is older than Ben. Ben is older than Chris. Who is youngest?',a:'Chris',w:['Alex','Ben','Cannot tell'],why:'Alex > Ben > Chris.',d:0.8},
      {q:'Every rose is a flower. Some flowers wilt quickly. Do all roses wilt quickly?',a:'Not necessarily',w:['Yes','No','Sometimes'],why:'Only SOME flowers wilt quickly.',d:1.2},
      {q:'If all Bloops are Razzies, and all Razzies are Lazzies, are all Bloops Lazzies?',a:'Yes',w:['No','Maybe','Only some'],why:'Chain: Bloop→Razzie→Lazzie.',d:1.3},
      {q:'In a village everyone either always lies or always tells truth. A says "B is a liar." B says "A and I are the same type." Who lies?',a:'A lies, B tells truth',w:['A tells truth, B lies','Both lie','Both tell truth'],why:"If A lies, then B is truthful. B then truthfully says they're different types. Consistent.",d:1.9},
      {q:'You have 12 balls, one is heavier. Minimum weighings on a balance scale to find it?',a:'3',w:['2','4','6'],why:'Binary elimination: 3 weighings handle up to 27 balls.',d:1.8},
      {q:'5 people in a line. Alice is not first. Bob is directly behind Alice. Can Bob be first?',a:'No',w:['Yes','Maybe','Depends'],why:"If Bob is behind Alice, Alice must be before Bob.",d:1.4},
    ];
    const i = u.pick(items);
    return {
      type:'logicGrid', category:'problemSolving', categoryLabel:'Logic Puzzle',
      difficulty:i.d||1.5, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function math() {
    const ops = [
      () => { const a=u.rand(5,25),b=u.rand(5,25); return {q:`${a} + ${b}`,a:a+b,w:`${a}+${b}=${a+b}`,d:0.5}; },
      () => { const a=u.rand(20,60),b=u.rand(5,20); return {q:`${a} − ${b}`,a:a-b,w:`${a}-${b}=${a-b}`,d:0.5}; },
      () => { const a=u.rand(2,9),b=u.rand(2,9); return {q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:0.6}; },
      () => { const b=u.rand(2,6),a=b*u.rand(2,8); return {q:`${a} ÷ ${b}`,a:a/b,w:`${a}/${b}=${a/b}`,d:0.6}; },
      () => { const n=u.rand(2,10); return {q:`${n} squared`,a:n*n,w:`${n}²=${n*n}`,d:0.7}; },
      () => { const b=u.rand(2,8)*10,p=[10,20,25,50][u.rand(0,3)]; return {q:`${p}% of ${b}`,a:b*p/100,w:`${p}%×${b}=${b*p/100}`,d:0.8}; },
      () => { const a=u.rand(12,88),b=u.rand(8,55); return {q:`${a} + ${b}`,a:a+b,w:`${a}+${b}=${a+b}`,d:0.9}; },
      () => { const a=u.rand(3,14),b=u.rand(3,14); return {q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:1.0}; },
      () => { const a=u.rand(15,60),b=u.rand(10,30),c=u.rand(5,20); return {q:`${a} + ${b} − ${c}`,a:a+b-c,w:`=${a+b-c}`,d:1.0}; },
      () => { const a=u.rand(2,6),b=u.rand(2,6),c=u.rand(2,6); return {q:`${a} × ${b} × ${c}`,a:a*b*c,w:`=${a*b*c}`,d:1.1}; },
      () => { const a=u.rand(2,9),b=u.rand(2,9); return {q:`${a}² + ${b}²`,a:a*a+b*b,w:`${a*a}+${b*b}=${a*a+b*b}`,d:1.1}; },
      () => { const n=u.rand(4,12); return {q:`${n} cubed`,a:n**3,w:`${n}³=${n**3}`,d:1.2}; },
      () => { const a=u.rand(100,300),b=u.rand(100,300); return {q:`${a} + ${b}`,a:a+b,w:`${a}+${b}=${a+b}`,d:1.2}; },
      () => { const a=u.rand(11,25),b=u.rand(2,9); return {q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:1.2}; },
      () => { const a=u.rand(2,8),b=u.rand(2,8); return {q:`(${a} + ${b})²`,a:(a+b)**2,w:`(${a+b})²=${(a+b)**2}`,d:1.4}; },
      () => { const n=u.rand(2,9); return {q:`√${n*n*n*n}`,a:n*n,w:`√${n**4}=${n**2}`,d:1.5}; },
    ];
    const p = u.pick(ops)();
    return {
      type:'math', category:'mentalAgility', categoryLabel:'Mental Math',
      difficulty:p.d||1.0, question:`${p.q} = ?`, answer:String(p.a),
      options:u.numOpts(p.a).map(String), explanation:p.w, visual:'text'
    };
  }

  function missingNum() {
    const gens = [
      () => { const a=u.rand(5,15),b=u.rand(5,15); return {q:`? + ${b} = ${a+b}`,a,why:`${a+b}-${b}=${a}`,d:0.6}; },
      () => { const a=u.rand(20,60),b=u.rand(5,20); return {q:`${a} − ? = ${a-b}`,a:b,why:`${a}-(${a-b})=${b}`,d:0.6}; },
      () => { const a=u.rand(2,9),b=u.rand(2,9); return {q:`? × ${b} = ${a*b}`,a,why:`${a*b}/${b}=${a}`,d:0.7}; },
      () => { const a=u.rand(2,9),b=u.rand(2,9); return {q:`${a*b} ÷ ? = ${a}`,a:b,why:`${a*b}/${a}=${b}`,d:0.7}; },
      () => { const a=u.rand(3,9),b=u.rand(3,9),c=u.rand(3,9); return {q:`? + ${b} + ${c} = ${a+b+c}`,a,why:`${a+b+c}-${b}-${c}=${a}`,d:0.9}; },
      () => { const a=u.rand(2,8); return {q:`? × ? = ${a*a} (same number)`,a,why:`${a}×${a}=${a*a}`,d:0.9}; },
      () => { const a=u.rand(2,6),b=u.rand(2,6); return {q:`(? × ${b}) + ${a} = ${a+a*b}`,a,why:`(${a}×${b})+${a}=${a+a*b}`,d:1.1}; },
      () => { const a=u.rand(2,8); return {q:`?² = ${a*a}`,a,why:`√${a*a}=${a}`,d:1.0}; },
      () => { const a=u.rand(2,5); return {q:`?³ = ${a**3}`,a,why:`Cube root of ${a**3} = ${a}`,d:1.3}; },
      () => { const a=u.rand(5,15),b=u.rand(2,5); return {q:`? ÷ ${b} = ${a}`,a:a*b,why:`${a}×${b}=${a*b}`,d:0.8}; },
    ];
    const p = u.pick(gens)();
    return {
      type:'missingNum', category:'mentalAgility', categoryLabel:'Find the Missing Number',
      difficulty:p.d||1.1, question:p.q, answer:String(p.a),
      options:u.numOpts(p.a).map(String), explanation:p.why, visual:'text'
    };
  }

  function timeCalc() {
    const gens = [
      () => { const h=u.rand(1,10); return {q:`How many hours in ${h} days?`,a:String(h*24),w:[String(h*24+12),String(h*12),String(h*24-24)],why:`${h}×24=${h*24}`,d:0.7}; },
      () => { const w=u.rand(2,5); return {q:`How many days in ${w} weeks?`,a:String(w*7),w:[String(w*7+1),String(w*7-1),String(w*5)],why:`${w}×7=${w*7}`,d:0.6}; },
      () => { const d=u.rand(2,6); return {q:`How many minutes in ${d} days?`,a:String(d*1440),w:[String(d*1440+60),String(d*60),String(d*1440-60)],why:`${d}×24×60=${d*1440}`,d:1.2}; },
      () => ({q:`A flight departs 11:45 PM and lands 3:20 AM. Duration?`,a:'3h 35m',w:['3h 45m','4h 35m','2h 35m'],why:`15m before midnight + 3h 20m = 3h 35m.`,d:1.3}),
      () => ({q:`It's 3:47. What time was it 2 hours and 18 minutes ago?`,a:'1:29',w:['1:19','2:29','1:39'],why:`3:47 − 2:18 = 1:29.`,d:1.4}),
    ];
    const gen = u.pick(gens)();
    return {
      type:'timeCalc', category:'mentalAgility', categoryLabel:'Time Math',
      difficulty:gen.d||1.1, question:gen.q, answer:gen.a,
      options:u.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  }

  function mentalChain() {
    const chains = [
      () => { const a=u.rand(5,10),b=u.rand(2,4),c=u.rand(2,8); return {q:`Start with ${a}, multiply by ${b}, subtract ${c}. Result?`,a:String(a*b-c),w:[String(a*b-c+2),String(a*b-c-3),String(a+b-c)],why:`${a}×${b}=${a*b}, −${c}=${a*b-c}`,d:0.9}; },
      () => { const a=u.rand(10,30),b=u.rand(5,10),c=u.rand(2,5); return {q:`Start with ${a}, add ${b}, multiply by ${c}. Result?`,a:String((a+b)*c),w:[String(a+b*c),String(a*b+c),String(a+b+c)],why:`(${a}+${b})×${c}=${(a+b)*c}`,d:1.0}; },
      () => { const a=u.rand(50,100),b=u.rand(10,30),c=u.rand(2,5); return {q:`Take ${a}, subtract ${b}, multiply by ${c}. Result?`,a:String((a-b)*c),w:[String((a-b)*c+c),String((a-b)*c-b),String(a*c-b)],why:`(${a}-${b})×${c}=${(a-b)*c}`,d:1.2}; },
      () => { const a=u.rand(2,6),b=u.rand(2,6); return {q:`Square ${a}, square ${b}, add them. Result?`,a:String(a*a+b*b),w:[String(a*a+b*b+1),String(a*b),String((a+b)**2)],why:`${a}²+${b}²=${a*a}+${b*b}=${a*a+b*b}`,d:1.2}; },
      () => { const a=u.rand(20,60),b=u.rand(2,5); return {q:`Divide ${a} by ${b}. What's half of that?`,a:String(a/b/2),w:[String(a/b),String(a/b/2+1),String(a/2)],why:`${a}/${b}=${a/b}, half=${a/b/2}`,d:1.3}; },
    ];
    const gen = u.pick(chains)();
    return {
      type:'mentalChain', category:'mentalAgility', categoryLabel:'Chain Calculation',
      difficulty:gen.d||1.3, question:gen.q, answer:gen.a,
      options:u.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  }

  function memoryTask() {
    const gens = [
      () => { const nums=[u.rand(2,9),u.rand(2,9),u.rand(2,9)]; const sum=nums.reduce((a,b)=>a+b,0); return {q:`Add: ${nums.join(', ')}`,a:String(sum),w:[String(sum+2),String(sum-1),String(sum+3)],why:`${nums.join('+')}=${sum}`,d:0.7}; },
      () => { const items=u.shuffle(['Red','Blue','Green','Yellow','Purple']); const pos=u.rand(0,4); const ord=['first','second','third','fourth','last']; return {q:`List: ${items.join(', ')} — which is ${ord[pos]}?`,a:items[pos],w:u.shuffle(items.filter(i=>i!==items[pos])).slice(0,3),why:`${items[pos]} is ${ord[pos]}.`,d:0.7}; },
      () => { const nums=[u.rand(10,30),u.rand(10,30),u.rand(10,30),u.rand(10,30),u.rand(10,30)]; const max=Math.max(...nums); return {q:`Largest: ${nums.join(', ')}`,a:String(max),w:u.shuffle(nums.filter(n=>n!==max).map(String)).slice(0,3),why:`${max} is largest.`,d:0.6}; },
      () => { const word=u.pick(['BRAIN','SMART','THINK','LEARN','QUICK','POWER','LIGHT','DREAM','SPACE','WORLD']); const rev=word.split('').reverse().join(''); return {q:`"${word}" spelled backwards?`,a:rev,w:[rev.slice(0,-1)+word[0],word,rev.split('').sort().join('')].filter(x=>x!==rev).slice(0,3),why:`${word} → ${rev}`,d:1.0}; },
      () => { const a=u.rand(2,8),b=u.rand(2,8),c=u.rand(2,8); const ans=a*b+c; return {q:`${a} × ${b}, then + ${c} = ?`,a:String(ans),w:[String(ans+2),String(ans-3),String(a+b+c)],why:`${a*b}+${c}=${ans}`,d:1.0}; },
      () => { const word=u.pick(['PLANET','GARDEN','CASTLE','BRIDGE','SILVER','ORANGE','WINTER','FOREST']); const pos=u.rand(1,4); const ord=['','2nd','3rd','4th','5th']; return {q:`In "${word}", what is the ${ord[pos]} letter?`,a:word[pos],w:u.shuffle(word.split('').filter(l=>l!==word[pos])).slice(0,3),why:`${word}[${pos+1}]=${word[pos]}`,d:1.1}; },
      () => { const a=u.rand(3,9),b=u.rand(3,9),c=u.rand(3,9); return {q:`${a} × ${b} × ${c} = ?`,a:String(a*b*c),w:[String(a*b*c+a),String(a*b*c-b),String(a+b+c)],why:`${a}×${b}×${c}=${a*b*c}`,d:1.2}; },
    ];
    const gen = u.pick(gens)();
    return {
      type:'memoryTask', category:'workingMemory', categoryLabel:'Working Memory',
      difficulty:gen.d||1.1, question:gen.q, answer:gen.a,
      options:u.shuffle([gen.a,...gen.w.filter(w=>w!==gen.a).slice(0,3)]),
      explanation:gen.why, visual:'text'
    };
  }

  function analogy() {
    const items = [
      {a:'Hot',b:'Cold',c:'Up',d:'Down',why:'Opposites.',d2:0.6},
      {a:'Puppy',b:'Dog',c:'Kitten',d:'Cat',why:'Young to adult.',d2:0.6},
      {a:'Bird',b:'Nest',c:'Bee',d:'Hive',why:'Animal to home.',d2:0.7},
      {a:'Eye',b:'See',c:'Ear',d:'Hear',why:'Organ to function.',d2:0.6},
      {a:'Fish',b:'Swim',c:'Bird',d:'Fly',why:'Animal to movement.',d2:0.6},
      {a:'Pen',b:'Write',c:'Knife',d:'Cut',why:'Tool to action.',d2:0.7},
      {a:'Cow',b:'Milk',c:'Bee',d:'Honey',why:'Producer to product.',d2:0.7},
      {a:'Doctor',b:'Hospital',c:'Teacher',d:'School',why:'Worker to workplace.',d2:0.7},
      {a:'Author',b:'Book',c:'Chef',d:'Meal',why:'Creator to creation.',d2:1.0},
      {a:'Lock',b:'Key',c:'Question',d:'Answer',why:'Problem to solution.',d2:1.0},
      {a:'Telescope',b:'Stars',c:'Microscope',d:'Cells',why:"Tool to what it observes.",d2:1.2},
      {a:'Prologue',b:'Book',c:'Overture',d:'Opera',why:'Introductory section to work.',d2:1.5},
      {a:'Cartographer',b:'Maps',c:'Lexicographer',d:'Dictionaries',why:'Specialist to what they create.',d2:1.6},
      {a:'Archipelago',b:'Islands',c:'Constellation',d:'Stars',why:'Group name to components.',d2:1.7},
      {a:'Violin',b:'Orchestra',c:'Soldier',d:'Army',why:'Individual to group.',d2:1.1},
      {a:'Sail',b:'Wind',c:'Engine',d:'Fuel',why:'Mechanism to energy source.',d2:1.1},
    ];
    const i = u.pick(items);
    const wrong = items.filter(x=>x.d!==i.d).map(x=>x.d);
    return {
      type:'analogy', category:'verbalReasoning', categoryLabel:'Analogy',
      difficulty:i.d2||1.1, question:`${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer:i.d, options:u.shuffle([i.d,...u.shuffle(wrong).slice(0,3)]),
      explanation:i.why, visual:'text'
    };
  }

  function verbal() {
    const vocab = [
      {q:'What is the opposite of "ancient"?',a:'Modern',w:['Old','Historic','Antique'],why:'Ancient=old, modern=current.',d:0.6},
      {q:'What word means the same as "rapid"?',a:'Fast',w:['Slow','Steady','Calm'],why:'Rapid=fast.',d:0.6},
      {q:'What is the opposite of "expand"?',a:'Shrink',w:['Grow','Stretch','Increase'],why:'Expand=bigger, shrink=smaller.',d:0.7},
      {q:'What word means the same as "enormous"?',a:'Huge',w:['Tiny','Small','Medium'],why:'Enormous=huge.',d:0.6},
      {q:'What is the opposite of "brave"?',a:'Cowardly',w:['Bold','Strong','Fierce'],why:'Brave=courageous; cowardly=lacking courage.',d:0.7},
      {q:'What word means the same as "wealthy"?',a:'Affluent',w:['Poor','Cheap','Broke'],why:'Affluent=wealthy.',d:1.0},
      {q:'What is the opposite of "temporary"?',a:'Permanent',w:['Brief','Short','Fleeting'],why:'Temporary=short-lived; permanent=forever.',d:1.0},
      {q:'What word means the same as "cautious"?',a:'Prudent',w:['Reckless','Bold','Wild'],why:'Prudent=wisely cautious.',d:1.1},
      {q:'What is the opposite of "transparent"?',a:'Opaque',w:['Clear','Visible','Obvious'],why:'Transparent=see-through; opaque=not.',d:1.1},
      {q:'What is the opposite of "loquacious"?',a:'Taciturn',w:['Quiet','Shy','Nervous'],why:'Loquacious=very talkative; taciturn=reserved.',d:1.5},
      {q:'What word means the same as "ephemeral"?',a:'Fleeting',w:['Eternal','Constant','Permanent'],why:'Ephemeral=lasting a very short time.',d:1.4},
      {q:'What word means the same as "obfuscate"?',a:'Confuse',w:['Clarify','Explain','Reveal'],why:'Obfuscate=make unclear.',d:1.6},
      {q:'What word means the same as "perspicacious"?',a:'Shrewd',w:['Dull','Confused','Naive'],why:'Perspicacious=having ready insight.',d:1.8},
    ];
    const v = u.pick(vocab);
    return {
      type:'verbal', category:'verbalReasoning', categoryLabel:'Vocabulary',
      difficulty:v.d||1.0, question:v.q, answer:v.a,
      options:u.shuffle([v.a,...v.w]), explanation:v.why, visual:'text'
    };
  }

  function wordLink() {
    const verified = [
      {first:'FIRE',second:'OUT',a:'WORK',w:['PLACE','SIDE','FIGHT'],why:'FIREWORK + WORKOUT.',d:0.9},
      {first:'BOOK',second:'HOLE',a:'WORM',w:['CASE','MARK','SHELF'],why:'BOOKWORM + WORMHOLE.',d:0.9},
      {first:'SUN',second:'HOUSE',a:'LIGHT',w:['BURN','SET','RISE'],why:'SUNLIGHT + LIGHTHOUSE.',d:0.9},
      {first:'FOOT',second:'ROOM',a:'BALL',w:['NOTE','STEP','PRINT'],why:'FOOTBALL + BALLROOM.',d:0.9},
      {first:'HEAD',second:'STAND',a:'BAND',w:['LINE','SET','PHONE'],why:'HEADBAND + BANDSTAND.',d:1.0},
      {first:'TOOTH',second:'POCKET',a:'PICK',w:['BRUSH','PASTE','ACHE'],why:'TOOTHPICK + PICKPOCKET.',d:1.0},
      {first:'DOOR',second:'TOWER',a:'BELL',w:['KNOB','STEP','WAY'],why:'DOORBELL + BELLTOWER.',d:1.0},
      {first:'BASE',second:'GAME',a:'BALL',w:['LINE','CAMP','BOARD'],why:'BASEBALL + BALLGAME.',d:0.9},
      {first:'AIR',second:'HOLE',a:'PORT',w:['LINE','CRAFT','PLANE'],why:'AIRPORT + PORTHOLE.',d:1.0},
      {first:'SNOW',second:'PARK',a:'BALL',w:['FLAKE','MAN','DRIFT'],why:'SNOWBALL + BALLPARK.',d:1.0},
      {first:'WATER',second:'OUT',a:'FALL',w:['MARK','PROOF','SIDE'],why:'WATERFALL + FALLOUT.',d:1.0},
      {first:'STAR',second:'TANK',a:'FISH',w:['LIGHT','SHIP','DUST'],why:'STARFISH + FISHTANK.',d:1.0},
      {first:'SAND',second:'WORK',a:'PAPER',w:['CASTLE','STORM','BOX'],why:'SANDPAPER + PAPERWORK.',d:1.0},
      {first:'DAY',second:'HOUSE',a:'LIGHT',w:['DREAM','BREAK','TIME'],why:'DAYLIGHT + LIGHTHOUSE.',d:1.0},
      {first:'OVER',second:'LOAD',a:'WORK',w:['TIME','COME','BOARD'],why:'OVERWORK + WORKLOAD.',d:1.1},
      {first:'UNDER',second:'LINE',a:'SCORE',w:['COVER','TAKE','WORLD'],why:'UNDERSCORE + SCORELINE.',d:1.2},
      {first:'HIGH',second:'HOUSE',a:'LIGHT',w:['WAY','LAND','RISE'],why:'HIGHLIGHT + LIGHTHOUSE.',d:1.0},
      {first:'HAND',second:'DOWN',a:'SHAKE',w:['MADE','CUFF','RAIL'],why:'HANDSHAKE + SHAKEDOWN.',d:1.0},
      {first:'OUT',second:'LINE',a:'SIDE',w:['BACK','RUN','LAW'],why:'OUTSIDE + SIDELINE.',d:1.0},
      {first:'BLACK',second:'HOUSE',a:'BIRD',w:['BOARD','SMITH','OUT'],why:'BLACKBIRD + BIRDHOUSE.',d:1.0},
      {first:'PLAY',second:'GROUND',a:'BACK',w:['WORK','BOY','TIME'],why:'PLAYBACK + BACKGROUND.',d:1.1},
      {first:'FLASH',second:'GROUND',a:'BACK',w:['LIGHT','POINT','FIRE'],why:'FLASHBACK + BACKGROUND.',d:1.1},
      {first:'CARD',second:'WALK',a:'BOARD',w:['GAME','SHARP','TRICK'],why:'CARDBOARD + BOARDWALK.',d:1.1},
      {first:'STEAM',second:'YARD',a:'SHIP',w:['POWER','ROLLER','ENGINE'],why:'STEAMSHIP + SHIPYARD.',d:1.1},
      {first:'EYE',second:'BEAT',a:'BROW',w:['LID','SIGHT','DROP'],why:'EYEBROW + BROWBEAT.',d:1.1},
      {first:'NEWS',second:'BACK',a:'PAPER',w:['CAST','LETTER','STAND'],why:'NEWSPAPER + PAPERBACK.',d:1.1},
      {first:'COURT',second:'STICK',a:'YARD',w:['ROOM','ORDER','SHIP'],why:'COURTYARD + YARDSTICK.',d:1.1},
      {first:'MOON',second:'SHIP',a:'LIGHT',w:['BEAM','SHINE','GLOW'],why:'MOONLIGHT + LIGHTSHIP.',d:1.0},
    ];
    const i = u.pick(verified);
    return {
      type:'wordLink', category:'verbalReasoning', categoryLabel:'Word Link',
      difficulty:i.d||1.0, question:`What word connects: ${i.first} ___ ${i.second}`,
      answer:i.a, options:u.shuffle([i.a,...i.w]),
      explanation:i.why, visual:'text'
    };
  }

  function sentenceLogic() {
    const items = [
      {q:'Which is grammatically correct?',a:"She and I went to the store.",w:['Her and me went to the store.','Me and her went to the store.','Her and I went to the store.'],why:'"She and I" is the correct subject.',d:0.8},
      {q:'What does "break the ice" mean?',a:'Start a conversation',w:['Break something cold','Cause a problem','End a friendship'],why:'To initiate social interaction.',d:0.7},
      {q:'What does "once in a blue moon" mean?',a:'Very rarely',w:['Every month','At night','When it is cold'],why:'Something that happens very rarely.',d:0.7},
      {q:'"Actions speak louder than words" means:',a:'What you do matters more than what you say',w:['Be quiet','Talk loudly','Take action quickly'],why:'Deeds matter more than promises.',d:0.7},
      {q:'What is the correct plural of "phenomenon"?',a:'Phenomena',w:['Phenomenons','Phenomenas','Phenomeni'],why:'Greek origin: phenomenon → phenomena.',d:1.1},
      {q:'What does "begging the question" actually mean?',a:'Assuming the conclusion in your argument',w:['Avoiding a question','Raising a question','Asking repeatedly'],why:"It's a logic fallacy, not literally asking a question.",d:1.4},
      {q:'What is the difference between "affect" and "effect"?',a:'Affect is a verb, effect is a noun',w:['They are the same','Effect is a verb, affect is a noun','Both are nouns'],why:'Affect (verb): to influence. Effect (noun): the result.',d:1.3},
      {q:'What does "pleonasm" mean?',a:'Using more words than necessary',w:['Fear of words','A type of poem','A logical fallacy'],why:'Example: "free gift" or "ATM machine."',d:1.7},
      {q:'What is a "dangling modifier"?',a:"A phrase that doesn't clearly modify any word",w:['A very long sentence','An unclear pronoun','A misplaced comma'],why:'"Running to the store, the rain started." — who was running?',d:1.5},
    ];
    const i = u.pick(items);
    return {
      type:'sentenceLogic', category:'verbalReasoning', categoryLabel:'Language Logic',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function oddOut() {
    const sets = [
      {items:['Apple','Banana','Carrot','Orange'],odd:'Carrot',why:'Vegetable, not a fruit.',d:0.5},
      {items:['Dog','Cat','Goldfish','Hamster'],odd:'Goldfish',why:'Fish, not a mammal.',d:0.6},
      {items:['Red','Blue','Square','Green'],odd:'Square',why:'Shape, not a color.',d:0.5},
      {items:['January','Monday','March','December'],odd:'Monday',why:'Day of week, not a month.',d:0.5},
      {items:['Coffee','Tea','Juice','Bread'],odd:'Bread',why:'Solid food, others are drinks.',d:0.5},
      {items:['Eagle','Penguin','Sparrow','Hawk'],odd:'Penguin',why:'Cannot fly.',d:0.7},
      {items:['Piano','Guitar','Violin','Drums'],odd:'Drums',why:'Percussion; others are melodic.',d:0.9},
      {items:['Mars','Venus','Moon','Jupiter'],odd:'Moon',why:"Orbits Earth, not the Sun.",d:0.9},
      {items:['Dolphin','Shark','Whale','Seal'],odd:'Shark',why:'Fish; others are mammals.',d:0.9},
      {items:['Python','Java','French','Ruby'],odd:'French',why:'Human language; others are programming languages.',d:0.9},
      {items:['Gold','Silver','Diamond','Copper'],odd:'Diamond',why:'Gemstone; others are metals.',d:1.0},
      {items:['Cello','Flute','Violin','Harp'],odd:'Flute',why:'Wind instrument; others are stringed.',d:1.0},
      {items:['Mercury','Earth','Pluto','Saturn'],odd:'Pluto',why:'Dwarf planet.',d:1.0},
      {items:['Heart','Lungs','Brain','Femur'],odd:'Femur',why:'Bone; others are organs.',d:1.0},
      {items:['Beethoven','Mozart','Picasso','Bach'],odd:'Picasso',why:'Painter; others were composers.',d:1.2},
      {items:['Democracy','Monarchy','Republic','Capitalism'],odd:'Capitalism',why:'Economic system; others are government types.',d:1.3},
      {items:['Meter','Kilogram','Second','Dollar'],odd:'Dollar',why:'Currency; others are SI units.',d:1.2},
      {items:['Sonnet','Haiku','Limerick','Novel'],odd:'Novel',why:'Prose fiction; others are poetry forms.',d:1.3},
      {items:['Simile','Metaphor','Hyperbole','Haiku'],odd:'Haiku',why:'Poetry form; others are figures of speech.',d:1.4},
      {items:['Plato','Aristotle','Socrates','Caesar'],odd:'Caesar',why:'Military/political leader; others were philosophers.',d:1.3},
    ];
    const s = u.pick(sets);
    return {
      type:'oddOut', category:'logicalReasoning', categoryLabel:'Odd One Out',
      difficulty:s.d||1.0, question:"Which one doesn't belong?",
      answer:s.odd, options:u.shuffle(s.items),
      explanation:s.why, visual:'text'
    };
  }

  function logic() {
    const puzzles = [
      {q:'All cats have tails. Whiskers is a cat. Does Whiskers have a tail?',a:'Yes',w:['No','Maybe','Not enough info'],why:'All cats → Whiskers is a cat → has a tail.',d:0.7},
      {q:'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?',a:'Leo',w:['Jake','Kim','Cannot tell'],why:'Order: Jake, Kim, Leo.',d:0.7},
      {q:'Lisa runs faster than Mia. Mia runs faster than Nora. Who is fastest?',a:'Lisa',w:['Mia','Nora','Cannot tell'],why:'Lisa > Mia > Nora.',d:0.7},
      {q:'If A > B and B > C, is A > C?',a:'Yes, always',w:['No','Sometimes','Cannot tell'],why:'Transitivity.',d:0.8},
      {q:'If it rains, the grass is wet. The grass is wet. Did it rain?',a:'Not necessarily',w:['Yes','No','Always'],why:'Grass could be wet from a sprinkler.',d:1.0},
      {q:'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?',a:'Not necessarily',w:['Yes','No','Always'],why:'Only SOME dogs bark loudly.',d:1.0},
      {q:'If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?',a:'Yes',w:['No','Maybe','Cannot determine'],why:'A⊂B and B⊂C → A⊂C.',d:1.1},
      {q:'If no mammals lay eggs, and a platypus lays eggs, what can we conclude?',a:'The statement is false',w:["Platypus is not a mammal",'Nothing','Platypus is a bird'],why:'Platypus IS a mammal that lays eggs → premise is false.',d:1.4},
      {q:'You pick Box 1 of 3. Host reveals Box 3 is empty. Should you switch to Box 2?',a:'Yes, switching is better',w:["No, stay with Box 1","It doesn't matter","Not enough info"],why:'Monty Hall: switching gives 2/3 chance vs 1/3.',d:1.7},
      {q:'If "If P then Q" is true, and Q is false, what do we know about P?',a:'P is false',w:['P is true','P is unknown','Nothing'],why:'Contrapositive: not-Q → not-P.',d:1.5},
      {q:'A says "We are both liars." Can A be telling the truth?',a:'No',w:['Yes','Maybe','It depends'],why:'If A tells truth, both are liars → A is a liar. Contradiction.',d:1.8},
    ];
    const p = u.pick(puzzles);
    return {
      type:'logic', category:'logicalReasoning', categoryLabel:'Logic',
      difficulty:p.d||1.2, question:p.q, answer:p.a,
      options:u.shuffle([p.a,...p.w]), explanation:p.why, visual:'text'
    };
  }

  function truthTable() {
    const items = [
      {q:"Statement: \"If it's raining, I bring an umbrella.\" It's NOT raining. Can we conclude anything about the umbrella?",a:'No, could go either way',w:['I definitely have an umbrella','I definitely don\'t have one','The statement is false'],why:'"If" only specifies the rain case.',d:1.4},
      {q:'"All dogs are loyal. Some loyal things are brave." Are all dogs brave?',a:'Not necessarily',w:['Yes','No','Always'],why:'Only SOME loyal things are brave.',d:1.3},
      {q:'True or False: "If A implies B, then not-B implies not-A"',a:'True',w:['False','Sometimes','Cannot determine'],why:'This is the contrapositive — always logically equivalent.',d:1.5},
      {q:'"Either it will rain or snow tomorrow." It didn\'t rain. What happened?',a:'It snowed',w:['Nothing happened','It rained anyway','Cannot tell'],why:'One of two must happen; rain didn\'t → snow did.',d:1.2},
      {q:'"If I study I pass. If I pass I graduate." I studied. What happens?',a:'I graduate',w:['I might pass','Nothing certain','I only pass'],why:'Study → pass → graduate.',d:1.2},
      {q:'All P are Q. All Q are R. No R are S. Are any P also S?',a:'No',w:['Yes','Maybe','Cannot tell'],why:'P→Q→R, and no R are S, so no P can be S.',d:1.6},
    ];
    const i = u.pick(items);
    return {
      type:'truthTable', category:'logicalReasoning', categoryLabel:'Logical Deduction',
      difficulty:i.d||1.5, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function emotionalIQ() {
    const items = [
      {q:'Your friend cancels plans last minute and seems stressed. Best response?',a:"Ask if they're okay",w:['Get angry','Ignore them','Cancel on them next time'],why:'Concern builds trust.',d:0.7},
      {q:"A coworker takes credit for your idea. Best first step?",a:'Talk to them privately',w:['Yell publicly','Do nothing','Complain to everyone'],why:'Private conversation addresses it directly.',d:0.9},
      {q:"Someone says \"I'm fine\" but looks upset. What do they likely mean?",a:"They're not fine but don't want to talk",w:["They are fine","They want you to leave","They're testing you"],why:'Body language often contradicts words.',d:0.8},
      {q:'You made a mistake at work. Best approach?',a:'Own it and fix it',w:['Hide it','Blame someone','Hope no one notices'],why:'Taking responsibility shows integrity.',d:0.7},
      {q:'A friend is venting about their day. What do they most likely want?',a:'Someone to listen',w:['Advice','To be told to calm down','Solutions'],why:'Venting = being heard.',d:0.7},
      {q:'Someone gives you harsh feedback. Best initial reaction?',a:'Listen and consider it',w:['Defend immediately','Walk away','Give harsh feedback back'],why:'Even harsh feedback can contain truth.',d:0.9},
      {q:'Your friend just failed an exam. What should you say?',a:'Acknowledge their feelings, offer support',w:["Tell them it's not a big deal","List what they did wrong","Share how well you did"],why:'Validating feelings shows empathy.',d:0.7},
      {q:'Two friends are arguing. Both want you to pick a side. Best move?',a:'Stay neutral, encourage them to talk',w:["Pick the closer friend",'Avoid both',"Tell both they're wrong"],why:'Neutrality preserves relationships.',d:0.9},
      {q:'You feel overwhelmed with tasks. Best coping strategy?',a:'Break tasks into smaller steps',w:['Ignore everything','Do it all at once','Complain'],why:'Breaking things down reduces anxiety.',d:0.8},
      {q:"Someone close to you is going through a difficult time. They push you away. Best approach?",a:"Give space but let them know you're there",w:['Force conversations','Stop trying completely','Tell others about it'],why:'Space + availability is the healthiest balance.',d:1.1},
    ];
    const i = u.pick(items);
    return {
      type:'emotionalIQ', category:'spatialAwareness', categoryLabel:'Emotional IQ',
      difficulty:i.d||1.0, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function spatial() {
    const items = [
      {q:'Rotate an arrow pointing UP by 180°. Where does it point?',a:'Down',w:['Up','Left','Right'],why:'180° flips direction.',d:0.7},
      {q:'Rotate an arrow pointing RIGHT by 90° clockwise. Where does it point?',a:'Down',w:['Up','Left','Right'],why:'Right + 90° CW = Down.',d:0.8},
      {q:'Rotate an arrow pointing UP by 90° clockwise. Where does it point?',a:'Right',w:['Left','Down','Up'],why:'Up + 90° CW = Right.',d:0.7},
      {q:'How many faces does a standard die have?',a:'6',w:['4','8','12'],why:'A cube has 6 faces.',d:0.6},
      {q:'If you fold a square in half diagonally, what shape do you get?',a:'Triangle',w:['Rectangle','Pentagon','Trapezoid'],why:'Diagonal fold → right triangle.',d:0.7},
      {q:'Rotate an arrow pointing DOWN by 90° counter-clockwise. Where does it point?',a:'Right',w:['Up','Left','Down'],why:'Down + 90° CCW = Right.',d:1.0},
      {q:'Looking at a clock, what angle do the hands make at 3:00?',a:'90°',w:['60°','120°','180°'],why:'At 3:00, hands are at right angles.',d:0.9},
      {q:'If you rotate the letter "M" 180°, it looks most like:',a:'W',w:['N','Z','Ш'],why:'M flipped upside down = W.',d:0.9},
      {q:'A cube is painted red on all sides and cut into 27 equal smaller cubes. How many have NO paint?',a:'1',w:['6','8','0'],why:'Only the very center cube has no painted faces.',d:1.3},
      {q:'How many degrees does the minute hand of a clock move in 20 minutes?',a:'120°',w:['60°','90°','180°'],why:'6°/min × 20 = 120°.',d:1.2},
      {q:'A clock shows 4:30. What is the angle between the hands?',a:'45°',w:['30°','60°','90°'],why:'Hour at 135°, minute at 180°. 180-135=45°.',d:1.5},
    ];
    const i = u.pick(items);
    return {
      type:'spatial', category:'numericalReasoning', categoryLabel:'Spatial',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function comparison() {
    const items = [
      {q:'Which is larger: 3/4 or 1/2?',a:'3/4',w:['1/2','Equal','Cannot tell'],why:'3/4=0.75 > 1/2=0.5.',d:0.6},
      {q:'Which is smaller: 1/3 or 1/2?',a:'1/3',w:['1/2','Equal','Cannot tell'],why:'1/3=0.33 < 1/2=0.5.',d:0.6},
      {q:'Which is larger: 50% or 1/3?',a:'50%',w:['1/3','Equal','Cannot tell'],why:'50%=0.5 > 1/3=0.33.',d:0.7},
      {q:'Which is larger: 3/4 or 2/3?',a:'3/4',w:['2/3','Equal','Cannot tell'],why:'3/4=0.75 > 2/3=0.67.',d:1.0},
      {q:'Which is larger: 2 cubed or 3 squared?',a:'3 squared (9)',w:['2 cubed (8)','Equal','Cannot tell'],why:'2³=8, 3²=9.',d:1.0},
      {q:'Which is larger: 25% or 1/3?',a:'1/3',w:['25%','Equal','Cannot tell'],why:'1/3=0.33 > 0.25.',d:1.0},
      {q:'Which is larger: 2/5 or 3/8?',a:'2/5',w:['3/8','Equal','Cannot tell'],why:'2/5=0.40 > 3/8=0.375.',d:1.1},
      {q:'Which is larger: 2⁵ or 5²?',a:'2⁵ (32)',w:['5² (25)','Equal','Cannot tell'],why:'2⁵=32 > 5²=25.',d:1.0},
      {q:'Which is larger: 10% of 200 or 20% of 90?',a:'10% of 200',w:['20% of 90','Equal','Cannot tell'],why:'10%×200=20, 20%×90=18.',d:1.2},
      {q:'Which is larger: 5 squared or 4 cubed?',a:'4 cubed',w:['5 squared','Equal','Cannot tell'],why:'5²=25 < 4³=64.',d:1.1},
      {q:'Which is closer to 1: 7/8 or 5/6?',a:'7/8',w:['5/6','They are equal','Cannot tell'],why:'1-7/8=0.125, 1-5/6=0.167. 7/8 is closer.',d:1.4},
    ];
    const i = u.pick(items);
    return {
      type:'comparison', category:'numericalReasoning', categoryLabel:'Compare',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function estimation() {
    const items = [
      {q:'About how many days in a year?',a:'365',w:['300','400','350'],why:'365 days.',d:0.5},
      {q:'About how many weeks in a year?',a:'52',w:['48','56','42'],why:'365÷7≈52.',d:0.6},
      {q:'How many months have 31 days?',a:'7',w:['5','6','8'],why:'Jan,Mar,May,Jul,Aug,Oct,Dec.',d:0.7},
      {q:'How many continents are there?',a:'7',w:['5','6','8'],why:'Africa,Antarctica,Asia,Australia,Europe,N.America,S.America.',d:0.5},
      {q:'How many planets in our solar system?',a:'8',w:['7','9','10'],why:'Mercury through Neptune.',d:0.5},
      {q:'About how many hours in a week?',a:'168',w:['100','200','150'],why:'24×7=168.',d:0.9},
      {q:'About how many seconds in an hour?',a:'3600',w:['360','6000','1800'],why:'60×60=3600.',d:0.9},
      {q:'About how many bones in an adult human body?',a:'206',w:['150','300','106'],why:'206 bones.',d:1.0},
      {q:'How many keys on a standard piano?',a:'88',w:['76','92','64'],why:'Standard piano=88 keys.',d:1.0},
      {q:'About what % of Earth is water?',a:'71%',w:['50%','85%','60%'],why:'~71% of surface is water.',d:0.9},
      {q:'How many zeros in a trillion?',a:'12',w:['9','15','6'],why:'1,000,000,000,000 = 10¹².',d:1.1},
      {q:'About how many cells are in the human body?',a:'~37 trillion',w:['~1 million','~1 billion','~1 trillion'],why:'Estimated 37 trillion cells.',d:1.3},
    ];
    const i = u.pick(items);
    return {
      type:'estimation', category:'numericalReasoning', categoryLabel:'General Knowledge',
      difficulty:i.d||1.0, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  function numberProperty() {
    const items = [
      {q:'Is 0 even or odd?',a:'Even',w:['Odd','Neither','Both'],why:'0 is divisible by 2.',d:0.7},
      {q:'What is the smallest prime number?',a:'2',w:['1','3','0'],why:'2 is the smallest prime.',d:0.7},
      {q:'Is 15 prime?',a:'No',w:['Yes','Cannot tell','Only in some systems'],why:'15=3×5.',d:0.7},
      {q:'What is the square root of 64?',a:'8',w:['6','7','9'],why:'8×8=64.',d:0.7},
      {q:'Is 97 a prime number?',a:'Yes',w:['No','Cannot tell','Only if even'],why:'97 is only divisible by 1 and 97.',d:1.1},
      {q:'How many factors does 12 have?',a:'6',w:['4','5','3'],why:'1,2,3,4,6,12=six factors.',d:1.0},
      {q:'What is 2 to the power of 10?',a:'1024',w:['512','2048','1000'],why:'2¹⁰=1024.',d:1.1},
      {q:'How many prime numbers between 1 and 20?',a:'8',w:['6','7','10'],why:'2,3,5,7,11,13,17,19.',d:1.1},
      {q:'What is the sum of the first 10 positive integers?',a:'55',w:['45','50','60'],why:'n(n+1)/2=55.',d:1.0},
      {q:'What is 7 factorial (7!)?',a:'5040',w:['720','40320','2520'],why:'7×6×5×4×3×2×1=5040.',d:1.2},
      {q:'What is the sum of all integers from 1 to 100?',a:'5050',w:['4950','5000','5100'],why:'n(n+1)/2=100×101/2=5050.',d:1.4},
      {q:'Is 1 a prime number?',a:'No',w:['Yes','Sometimes','By definition'],why:'Primes must have exactly 2 factors. 1 only has 1.',d:1.3},
      {q:'What is the next perfect number after 6?',a:'28',w:['12','18','24'],why:'28=1+2+4+7+14.',d:1.7},
    ];
    const i = u.pick(items);
    return {
      type:'numberProperty', category:'numericalReasoning', categoryLabel:'Number Theory',
      difficulty:i.d||1.3, question:i.q, answer:i.a,
      options:u.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }

  // ── generate: pick a random MCQ question ──────────
  function generate(targetDifficulty) {
    const types = [
      'numSeq','numSeq','numSeq','numSeq','numSeq',
      'letterSeq','letterSeq','letterSeq',
      'matrix','matrix','matrix',
      'series','series',
      'shapePattern','shapePattern',
      'codeBreak','codeBreak','codeBreak',
      'riddle','riddle','riddle','riddle',
      'wordProblem','wordProblem','wordProblem',
      'logicGrid','logicGrid',
      'math','math','math','math','math',
      'missingNum','missingNum','missingNum',
      'timeCalc','timeCalc',
      'mentalChain','mentalChain',
      'memoryTask','memoryTask','memoryTask','memoryTask',
      'analogy','analogy','analogy','analogy',
      'verbal','verbal','verbal',
      'wordLink','wordLink','wordLink',
      'sentenceLogic','sentenceLogic',
      'oddOut','oddOut','oddOut','oddOut',
      'logic','logic','logic',
      'truthTable','truthTable',
      'emotionalIQ','emotionalIQ','emotionalIQ',
      'spatial','spatial',
      'comparison','comparison',
      'estimation','estimation',
      'numberProperty','numberProperty',
    ];
    const generators = {
      numSeq, letterSeq, matrix, series, shapePattern,
      codeBreak, riddle, wordProblem, logicGrid,
      math, missingNum, timeCalc, mentalChain,
      memoryTask, analogy, verbal, wordLink, sentenceLogic,
      oddOut, logic, truthTable, emotionalIQ,
      spatial, comparison, estimation, numberProperty,
    };

    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const fn = u.pick(types);
      q = generators[fn]();
      tries++;
      if (tries > 30) break;
    } while (Math.abs(q.difficulty - targetDifficulty) > tolerance);

    return q;
  }

  return { generate, render, attach, setAge };
})();