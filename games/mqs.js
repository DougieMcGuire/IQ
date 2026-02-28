// ═══════════════════════════════════════════════════
//  MCQ GAME — Multiple Choice Questions
//  Provides: MCQGame.generate(difficulty)
//            MCQGame.render(q, idx)
//            MCQGame.attach(slideEl, q, idx, feed, onAnswer)
// ═══════════════════════════════════════════════════

const MCQGame = (() => {

  // ── Utilities ─────────────────────────────────────
  function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
  function pick(arr)  { return arr[rand(0, arr.length - 1)]; }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function numOpts(ans, n = 4, spread) {
    const opts = new Set([ans]);
    const r = spread || Math.max(4, Math.abs(ans) * 0.35);
    let t = 0;
    while (opts.size < n && t++ < 100) {
      let v = ans + rand(1, Math.ceil(r)) * (Math.random() > 0.5 ? 1 : -1);
      if (Number.isInteger(ans)) v = Math.round(v);
      if (v !== ans && !isNaN(v)) opts.add(v);
    }
    while (opts.size < n) opts.add(ans + opts.size);
    return shuffle([...opts]);
  }

  // ── Render ────────────────────────────────────────
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
        <div class="options${wide ? ' wide' : ''}" data-idx="${idx}" data-ans="${esc(q.answer)}" data-cat="${q.category}" data-diff="${q.difficulty}">
          ${q.options.map(o => `<button class="opt" data-v="${esc(o)}">${o}</button>`).join('')}
        </div>
        <div class="feedback" id="fb-${idx}"></div>
        <div class="explain"  id="exp-${idx}">${q.explanation}</div>
      </div>
      <div class="scroll-hint" id="hint-${idx}">
        <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        Swipe for next
      </div>`;
  }

  function esc(s) { return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

  // ── Attach ────────────────────────────────────────
  // onAnswer(isCorrect, ms) called when user taps an option
  function attach(slideEl, q, idx, feed, onAnswer) {
    slideEl.addEventListener('click', e => {
      if (!e.target.classList.contains('opt')) return;
      const btn  = e.target;
      const opts = btn.parentElement;
      if (opts.dataset.done) return;
      opts.dataset.done = '1';

      const correct   = opts.dataset.ans;
      const isCorrect = btn.dataset.v === correct;
      const ms        = Date.now() - (slideEl._startTime || Date.now());

      opts.querySelectorAll('.opt').forEach(o => {
        if      (o.dataset.v === correct) o.classList.add(isCorrect ? 'correct' : 'show-correct');
        else if (o === btn)               o.classList.add('wrong');
        else                              o.classList.add('dim');
      });

      setTimeout(() => document.getElementById(`exp-${idx}`)?.classList.add('show'),  250);
      setTimeout(() => document.getElementById(`hint-${idx}`)?.classList.add('show'), 500);

      onAnswer(isCorrect, ms);
    });
  }

  // ═══════════════════════════════════════════════════
  // QUESTION GENERATORS
  // ═══════════════════════════════════════════════════

  function numSeq() {
    const patterns = [
      () => { const add=rand(2,10),s=rand(1,30); return { seq:[s,s+add,s+add*2,s+add*3],ans:s+add*4,d:0.6,why:`+${add} each time.` }; },
      () => { const sub=rand(2,8),s=rand(40,80); return { seq:[s,s-sub,s-sub*2,s-sub*3],ans:s-sub*4,d:0.7,why:`-${sub} each time.` }; },
      () => { const s=rand(2,6); return { seq:[s,s*2,s*4,s*8],ans:s*16,d:0.7,why:`Doubles each time.` }; },
      () => { const s=rand(1,4); return { seq:[s,s*3,s*9,s*27],ans:s*81,d:0.8,why:`Triples each time.` }; },
      () => ({ seq:[2,3,5,7],ans:11,d:0.9,why:`Prime numbers.` }),
      () => ({ seq:[1,3,6,10],ans:15,d:0.8,why:`Triangular numbers: +2,+3,+4,+5.` }),
      () => { const s=rand(1,8); return { seq:[s,s+2,s+5,s+9],ans:s+14,d:0.8,why:`Gaps: +2,+3,+4,+5.` }; },
      () => { const s=rand(4,8)*16; return { seq:[s,s/2,s/4,s/8],ans:s/16,d:0.7,why:`Halved each time.` }; },
      () => { const o=rand(1,5); return { seq:[o*o,(o+1)**2,(o+2)**2,(o+3)**2],ans:(o+4)**2,d:0.9,why:`Perfect squares.` }; },
      () => { const a=rand(1,5),b=rand(2,6);const c=a+b,d=b+c,e=c+d; return { seq:[a,b,c,d],ans:e,d:1.0,why:`Each = sum of previous two.` }; },
      () => { const o=rand(0,2); return { seq:[2**(o+1),2**(o+2),2**(o+3),2**(o+4)],ans:2**(o+5),d:1.0,why:`Powers of 2.` }; },
      () => { const o=rand(1,4); return { seq:[o**3,(o+1)**3,(o+2)**3,(o+3)**3],ans:(o+4)**3,d:1.1,why:`Cube numbers.` }; },
      () => { const s=rand(1,8); return { seq:[s,s+2,s+6,s+12],ans:s+20,d:1.1,why:`Gaps double: +2,+4,+6,+8.` }; },
      () => { const s=rand(1,5); return { seq:[s,s*2,s*6,s*24],ans:s*120,d:1.2,why:`×2,×3,×4,×5.` }; },
      () => { const c=rand(1,5); return { seq:[1+c,4+c,9+c,16+c],ans:25+c,d:1.1,why:`Perfect squares + ${c}.` }; },
      () => { const s=rand(1,6); return { seq:[s,s+1,s+3,s+7],ans:s+15,d:1.2,why:`Gaps double: +1,+2,+4,+8.` }; },
      () => { const s=rand(2,5); return { seq:[s,s*s,s*s*s,s*s*s*s],ans:s**5,d:1.3,why:`Powers of ${s}.` }; },
      () => ({ seq:[1,1,2,3,5,8],ans:13,d:1.3,why:`Fibonacci: each = sum of previous two.` }),
      () => ({ seq:[2,6,12,20,30],ans:42,d:1.4,why:`n(n+1).` }),
      () => { const a=rand(10,30),dv=rand(3,9); return { seq:[a,a+dv,a+dv*3,a+dv*6],ans:a+dv*10,d:1.5,why:`Gaps: +${dv},+${dv*2},+${dv*3},+${dv*4}.` }; },
    ];
    const p = pick(patterns)();
    return {
      type:'numSeq',category:'patternRecognition',categoryLabel:'Number Pattern',
      difficulty:p.d,question:'What comes next?',
      sequence:p.seq,answer:String(p.ans),
      options:numOpts(p.ans).map(String),explanation:p.why,visual:'sequence'
    };
  }

  function letterSeq() {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => { const i=rand(0,19); return { seq:[A[i],A[i+1],A[i+2],A[i+3]],ans:A[i+4],d:0.6,why:`Consecutive letters.` }; },
      () => { const i=rand(0,15); return { seq:[A[i],A[i+2],A[i+4],A[i+6]],ans:A[i+8],d:0.7,why:`Skip one letter.` }; },
      () => { const i=rand(10,25); return { seq:[A[i],A[i-1],A[i-2],A[i-3]],ans:A[i-4],d:0.6,why:`Backward alphabet.` }; },
      () => ({ seq:['A','E','I','O'],ans:'U',d:0.7,why:`The five vowels.` }),
      () => ({ seq:['B','D','F','H'],ans:'J',d:0.7,why:`Every other letter from B.` }),
      () => ({ seq:['Z','X','V','T'],ans:'R',d:0.7,why:`Backwards, skipping one.` }),
      () => { const i=rand(0,11); return { seq:[A[i],A[i+3],A[i+6],A[i+9]],ans:A[i+12],d:1.0,why:`Skip two letters.` }; },
      () => ({ seq:['A','B','D','G'],ans:'K',d:1.0,why:`Gaps: +1,+2,+3,+4.` }),
      () => ({ seq:['Z','Y','W','T'],ans:'P',d:1.0,why:`Gaps: -1,-2,-3,-4.` }),
      () => ({ seq:['A','C','F','J'],ans:'O',d:1.1,why:`Gaps: +2,+3,+4,+5.` }),
      () => ({ seq:['M','N','P','S'],ans:'W',d:1.1,why:`Gaps: +1,+2,+3,+4.` }),
      () => ({ seq:['Z','X','U','Q'],ans:'L',d:1.2,why:`Gaps: -2,-3,-4,-5.` }),
      () => ({ seq:['A','Z','B','Y'],ans:'C',d:1.3,why:`Alternating from start and end.` }),
      () => ({ seq:['A','B','D','H'],ans:'P',d:1.6,why:`Positions double: 1,2,4,8,16=P.` }),
      () => ({ seq:['B','E','I','N'],ans:'T',d:1.4,why:`Gaps: +3,+4,+5,+6.` }),
    ];
    const p = pick(patterns)();
    const wrong = A.split('').filter(l => l !== p.ans);
    return {
      type:'letterSeq',category:'patternRecognition',categoryLabel:'Letter Pattern',
      difficulty:p.d,question:'What letter comes next?',
      sequence:p.seq,answer:p.ans,
      options:shuffle([p.ans,...shuffle(wrong).slice(0,3)]),
      explanation:p.why,visual:'letterSequence'
    };
  }

  function matrix() {
    const type = rand(0,5);
    let grid, ans, why, d;
    if (type===0) {
      const sum=rand(12,27);const a=rand(2,8),b=rand(2,8),c=sum-a-b;
      const dd=rand(2,8),e=rand(2,8),f=sum-dd-e;const g=rand(2,8),h=rand(2,8);
      ans=sum-g-h;grid=[a,b,c,dd,e,f,g,h,'?'];why=`Each row sums to ${sum}.`;d=1.2;
    } else if (type===1) {
      const add=rand(2,6);const r=[rand(1,7),rand(1,7),rand(1,7)];
      grid=[...r,r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];
      ans=r[2]+add*2;why=`Each column +${add} per row.`;d=1.1;
    } else if (type===2) {
      const a=rand(2,5),b=rand(2,5);const dd=rand(2,5),e=rand(2,5);const g=rand(2,5),h=rand(2,5);
      grid=[a,b,a*b,dd,e,dd*e,g,h,'?'];ans=g*h;why=`Each row: col1 × col2 = col3.`;d=1.3;
    } else if (type===3) {
      const m=2;const a=rand(2,5),b=rand(2,5),c=rand(2,5);
      grid=[a,b,c,a*m,b*m,c*m,a*m*m,b*m*m,'?'];ans=c*m*m;why=`Each row ×${m}.`;d=1.1;
    } else if (type===4) {
      const a=rand(2,6),add=rand(1,4);
      grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?'];
      ans=a+add*2+2;why=`+1 across, +${add} down.`;d=1.2;
    } else {
      const colSum=rand(12,20);const a=rand(2,6),dd=rand(2,6),g=colSum-a-dd;
      const b=rand(2,6),e=rand(2,6),h=colSum-b-e;const c=rand(2,6),f=rand(2,6);
      ans=colSum-c-f;grid=[a,b,c,dd,e,f,g,h,'?'];why=`Each column sums to ${colSum}.`;d=1.3;
    }
    return {
      type:'matrix',category:'patternRecognition',categoryLabel:'Matrix Logic',
      difficulty:d||1.3,question:'Find the missing number',
      grid,answer:String(ans),options:numOpts(ans).map(String),
      explanation:why,visual:'matrix'
    };
  }

  function series() {
    const items = [
      {q:'J, F, M, A, M, J, ?',a:'J',w:['A','S','D'],why:'Months. July=J.',d:0.7},
      {q:'S, M, T, W, T, F, ?',a:'S',w:['M','T','W'],why:'Weekdays. Saturday=S.',d:0.7},
      {q:'R, O, Y, G, B, I, ?',a:'V',w:['P','R','O'],why:'Rainbow. Violet=V.',d:0.7},
      {q:'M, V, E, M, J, S, U, ?',a:'N',w:['P','E','M'],why:'Planets. Neptune=N.',d:0.8},
      {q:'Do, Re, Mi, Fa, Sol, La, ?',a:'Ti',w:['Do','Si','Se'],why:'Solfege scale.',d:0.7},
      {q:'N, S, E, ?',a:'W',w:['N','S','NE'],why:'Compass directions.',d:0.6},
      {q:'Spring, Summer, Autumn, ?',a:'Winter',w:['Fall','Monsoon','Spring'],why:'Four seasons.',d:0.6},
      {q:'O, T, T, F, F, S, S, ?',a:'E',w:['N','T','S'],why:'First letters of numbers. Eight=E.',d:1.0},
      {q:'H, He, Li, Be, B, C, ?',a:'N',w:['O','F','Ne'],why:'Chemical elements. Nitrogen=N.',d:1.1},
      {q:'2, 3, 5, 7, 11, 13, ?',a:'17',w:['14','15','16'],why:'Prime numbers.',d:1.1},
      {q:'Q, W, E, R, T, ?',a:'Y',w:['U','A','S'],why:'Top row of QWERTY keyboard.',d:1.0},
      {q:'1, 1, 2, 3, 5, 8, ?',a:'13',w:['11','14','10'],why:'Fibonacci. 5+8=13.',d:1.0},
      {q:'G, E, D, C, B, ?',a:'A',w:['F','G','H'],why:'Musical notes descending.',d:1.4},
    ];
    const i = pick(items);
    return {
      type:'series',category:'patternRecognition',categoryLabel:'Complete the Series',
      difficulty:i.d||1.2,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function shapePattern() {
    const items = [
      {q:'Triangle (3), Square (4), Pentagon (5), Hexagon (6), ?',a:'Heptagon (7)',w:['Octagon (8)','Hexagon (6)','Pentagon (5)'],why:'Polygons with increasing sides.',d:0.8},
      {q:'How many faces does a cube have?',a:'6',w:['4','8','12'],why:'Top,bottom,front,back,left,right=6.',d:0.6},
      {q:'How many degrees in a full circle?',a:'360',w:['180','270','90'],why:'Full rotation=360°.',d:0.6},
      {q:'How many right angles in a rectangle?',a:'4',w:['2','3','6'],why:'All four corners are right angles.',d:0.6},
      {q:'How many faces does a tetrahedron have?',a:'4',w:['3','5','6'],why:'A tetrahedron has 4 triangular faces.',d:1.0},
      {q:'How many edges does a cube have?',a:'12',w:['6','8','10'],why:'4 top + 4 bottom + 4 vertical = 12.',d:1.0},
      {q:'How many lines of symmetry does a regular hexagon have?',a:'6',w:['3','4','8'],why:'6 lines through opposite vertices/midpoints.',d:1.1},
      {q:'What is the interior angle of a regular hexagon?',a:'120°',w:['90°','108°','135°'],why:'(6-2)×180/6=120°.',d:1.2},
      {q:'What is the exterior angle of a regular pentagon?',a:'72°',w:['60°','90°','108°'],why:'360/5=72°.',d:1.3},
      {q:'What is the sum of interior angles in a hexagon?',a:'720°',w:['540°','900°','360°'],why:'(6-2)×180=720°.',d:1.3},
      {q:'How many faces does an icosahedron have?',a:'20',w:['12','8','16'],why:'Icosa=20 triangular faces.',d:1.5},
      {q:'What is the number of diagonals in a hexagon?',a:'9',w:['6','12','8'],why:'n(n-3)/2=9.',d:1.6},
    ];
    const i = pick(items);
    return {
      type:'shapePattern',category:'patternRecognition',categoryLabel:'Shape Logic',
      difficulty:i.d||1.2,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function codeBreak() {
    const items = [
      {q:'If A=1, B=2, C=3, what is A+B+C?',a:'6',w:['3','9','5'],why:'1+2+3=6',d:0.7},
      {q:'If N+N=10, what is N?',a:'5',w:['10','4','6'],why:'2N=10, N=5',d:0.7},
      {q:'If X times X = 25, what is X?',a:'5',w:['4','6','25'],why:'5×5=25',d:0.7},
      {q:'If P × 3 = 18, what is P?',a:'6',w:['3','9','18'],why:'18/3=6',d:0.7},
      {q:'If A=1, B=2... what is Z?',a:'26',w:['24','25','28'],why:'Z is the 26th letter.',d:0.8},
      {q:'If M=4, what is M×M−M?',a:'12',w:['8','16','0'],why:'16-4=12',d:1.0},
      {q:'If 2X − 3 = 7, what is X?',a:'5',w:['4','6','7'],why:'2X=10, X=5',d:1.0},
      {q:'If A=2, B=4, C=6... what is E?',a:'10',w:['8','12','5'],why:'Each letter=position×2. E=10.',d:1.1},
      {q:'If 3X + 2Y = 20 and X=4, what is Y?',a:'4',w:['2','6','8'],why:'12+2Y=20, Y=4',d:1.4},
      {q:'STAR=58. Each letter=position. What does DOG equal?',a:'26',w:['30','22','29'],why:'D=4,O=15,G=7. 4+15+7=26',d:1.5},
      {q:'If RED=27, GREEN=49, what is BLUE?',a:'40',w:['35','45','38'],why:'B+L+U+E=2+12+21+5=40',d:1.7},
    ];
    const i = pick(items);
    return {
      type:'codeBreak',category:'problemSolving',categoryLabel:'Code Breaker',
      difficulty:i.d||1.2,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function riddle() {
    const items = [
      {q:'I have hands but cannot clap. What am I?',a:'A clock',w:['A person','A robot','A tree'],why:'Clock hands can\'t clap.',d:0.6},
      {q:'What has keys but no locks?',a:'A piano',w:['A door','A car','A safe'],why:'Piano has musical keys.',d:0.6},
      {q:'What gets wetter the more it dries?',a:'A towel',w:['A sponge','Paper','The sun'],why:'A towel absorbs water.',d:0.7},
      {q:'What has a head and tail but no body?',a:'A coin',w:['A snake','A fish','A ghost'],why:'Coins have heads and tails.',d:0.7},
      {q:'I am tall when young, short when old. What am I?',a:'A candle',w:['A person','A tree','A building'],why:'Candles burn down.',d:0.7},
      {q:'What has teeth but cannot bite?',a:'A comb',w:['A shark','A dog','A saw'],why:'A comb has teeth for hair.',d:0.6},
      {q:'What goes up but never comes down?',a:'Your age',w:['A balloon','A bird','Smoke'],why:'Age only increases.',d:0.7},
      {q:'The more you take, the more you leave behind. What?',a:'Footsteps',w:['Money','Time','Breath'],why:'Walking leaves footsteps.',d:1.0},
      {q:'What can fill a room but takes no space?',a:'Light',w:['Air','Water','Sound'],why:'Light has no mass.',d:1.0},
      {q:'I have cities but no houses, mountains but no trees. What am I?',a:'A map',w:['A planet','A dream','A story'],why:'Maps show geography without real objects.',d:1.0},
      {q:'What is so fragile that saying its name breaks it?',a:'Silence',w:['Glass','A dream','A secret'],why:'Speaking breaks silence.',d:1.3},
      {q:'The person who makes it doesn\'t need it. The buyer doesn\'t want it. The user doesn\'t know it. What is it?',a:'A coffin',w:['A pill','A gift','A trap'],why:'Coffins are made, bought, and used in this way.',d:1.5},
      {q:'What has 13 hearts but no other organs?',a:'A deck of cards',w:['A hospital','A town','A garden'],why:'Each suit has cards; 13 hearts total.',d:1.4},
    ];
    const i = pick(items);
    return {
      type:'riddle',category:'problemSolving',categoryLabel:'Riddle',
      difficulty:i.d||1.1,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function wordProblem() {
    const items = [
      () => { const a=rand(3,6),p=rand(2,4);return{q:`A store sells ${a} apples for $${p}. How much for ${a*2} apples?`,a:String(p*2),w:[String(p*3),String(p+2),String(p)],why:`Double the quantity = double the price.`,d:0.7};},
      () => { const t=rand(15,30),g=rand(3,10);return{q:`${t} students in class. ${g} wear glasses. How many don't?`,a:String(t-g),w:[String(t+g),String(g),String(t)],why:`${t}-${g}=${t-g}`,d:0.6};},
      () => { const a=rand(5,15),b=rand(3,8);return{q:`You have ${a} cookies and eat ${b}. How many left?`,a:String(a-b),w:[String(a+b),String(b),String(a)],why:`${a}-${b}=${a-b}`,d:0.5};},
      () => { const p=rand(3,8),d=rand(5,10);return{q:`A car travels ${p} miles per minute. How far in ${d} minutes?`,a:String(p*d)+' miles',w:[String(p*d+p)+' miles',String(p+d)+' miles',String(p*d-p)+' miles'],why:`${p}×${d}=${p*d} miles`,d:0.7};},
      () => { const each=rand(3,8),n=rand(4,10);const total=each*n,paid=Math.ceil(total/10)*10;return{q:`You buy ${n} items at $${each} each. Pay with $${paid}. Change?`,a:'$'+String(paid-total),w:['$'+String(paid-total+1),'$'+String(paid-total-1),'$'+String(each)],why:`${n}×$${each}=$${total}. $${paid}-$${total}=$${paid-total}`,d:0.9};},
      () => { const base=rand(5,12),h=rand(4,10);return{q:`A rectangle is ${base}cm wide and ${h}cm tall. Perimeter?`,a:String((base+h)*2)+'cm',w:[String(base*h)+'cm',String(base+h)+'cm',String((base+h)*2+2)+'cm'],why:`2×(${base}+${h})=${(base+h)*2}cm`,d:1.0};},
      () => { const speed=rand(4,8)*10,time=rand(2,4);return{q:`Driving at ${speed} mph for ${time} hours. Distance?`,a:String(speed*time)+' miles',w:[String(speed+time)+' miles',String(speed*time+speed)+' miles',String(speed*(time-1))+' miles'],why:`${speed}×${time}=${speed*time} miles`,d:0.9};},
      () => { const p=rand(20,80),disc=rand(10,40);return{q:`Item costs $${p}. ${disc}% off. Final price?`,a:'$'+String(Math.round(p*(1-disc/100))),w:['$'+String(Math.round(p*(1-disc/100))+5),'$'+String(Math.round(p*disc/100)),'$'+String(p-disc)],why:`$${p}×${1-disc/100}=$${Math.round(p*(1-disc/100))}`,d:1.2};},
      () => { const base=rand(4,9),h=rand(4,9);return{q:`Triangle base=${base}cm, height=${h}cm. Area?`,a:String(base*h/2)+'cm²',w:[String(base*h)+'cm²',String((base+h)*2)+'cm²',String(base*h/2+1)+'cm²'],why:`½×${base}×${h}=${base*h/2}cm²`,d:1.2};},
    ];
    const gen = pick(items)();
    return {
      type:'wordProblem',category:'problemSolving',categoryLabel:'Word Problem',
      difficulty:gen.d||1.2,question:gen.q,answer:gen.a,
      options:shuffle([gen.a,...gen.w]),explanation:gen.why,visual:'text'
    };
  }

  function logicGrid() {
    const items = [
      {q:'Amy has a dog. Ben has a cat. The pet owner on Oak St has a dog. Who lives on Oak St?',a:'Amy',w:['Ben','Neither','Both'],why:'Amy has a dog = Oak St person.',d:0.9},
      {q:'All teachers have degrees. Maria has a degree. Is Maria a teacher?',a:'Not necessarily',w:['Yes','No','Always'],why:'Not all degree holders are teachers.',d:1.1},
      {q:'Alex is older than Ben. Ben is older than Chris. Who is youngest?',a:'Chris',w:['Alex','Ben','Cannot tell'],why:'Alex > Ben > Chris.',d:0.8},
      {q:'Every rose is a flower. Some flowers wilt quickly. Do all roses wilt quickly?',a:'Not necessarily',w:['Yes','No','Sometimes'],why:'Only SOME flowers wilt quickly.',d:1.2},
      {q:'If all Bloops are Razzies, and all Razzies are Lazzies, are all Bloops Lazzies?',a:'Yes',w:['No','Maybe','Only some'],why:'Chain: Bloop→Razzie→Lazzie.',d:1.3},
      {q:'You have 12 balls, one is heavier. Minimum weighings on a balance scale to find it?',a:'3',w:['2','4','6'],why:'3 weighings handle up to 27 balls.',d:1.8},
    ];
    const i = pick(items);
    return {
      type:'logicGrid',category:'problemSolving',categoryLabel:'Logic Puzzle',
      difficulty:i.d||1.5,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function math() {
    const ops = [
      () => { const a=rand(5,25),b=rand(5,25);return{q:`${a} + ${b}`,a:a+b,w:`${a}+${b}=${a+b}`,d:0.5};},
      () => { const a=rand(20,60),b=rand(5,20);return{q:`${a} − ${b}`,a:a-b,w:`${a}-${b}=${a-b}`,d:0.5};},
      () => { const a=rand(2,9),b=rand(2,9);return{q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:0.6};},
      () => { const b=rand(2,6),a=b*rand(2,8);return{q:`${a} ÷ ${b}`,a:a/b,w:`${a}/${b}=${a/b}`,d:0.6};},
      () => { const n=rand(2,10);return{q:`${n} squared`,a:n*n,w:`${n}²=${n*n}`,d:0.7};},
      () => { const b=rand(2,8)*10,p=[10,20,25,50][rand(0,3)];return{q:`${p}% of ${b}`,a:b*p/100,w:`${p}%×${b}=${b*p/100}`,d:0.8};},
      () => { const a=rand(12,88),b=rand(8,55);return{q:`${a} + ${b}`,a:a+b,w:`${a}+${b}=${a+b}`,d:0.9};},
      () => { const a=rand(3,14),b=rand(3,14);return{q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:1.0};},
      () => { const a=rand(2,6),b=rand(2,6),c=rand(2,6);return{q:`${a} × ${b} × ${c}`,a:a*b*c,w:`${a}×${b}×${c}=${a*b*c}`,d:1.1};},
      () => { const n=rand(4,12);return{q:`${n} cubed`,a:n**3,w:`${n}³=${n**3}`,d:1.2};},
      () => { const a=rand(11,25),b=rand(2,9);return{q:`${a} × ${b}`,a:a*b,w:`${a}×${b}=${a*b}`,d:1.2};},
      () => { const a=rand(5,15),b=rand(5,15);return{q:`${a} × ${b} + ${a}`,a:a*b+a,w:`${a*b}+${a}=${a*b+a}`,d:1.3};},
      () => { const a=rand(2,8),b=rand(2,8);return{q:`(${a} + ${b})²`,a:(a+b)**2,w:`(${a+b})²=${(a+b)**2}`,d:1.4};},
    ];
    const p = pick(ops)();
    return {
      type:'math',category:'mentalAgility',categoryLabel:'Mental Math',
      difficulty:p.d||1.0,question:`${p.q} = ?`,answer:String(p.a),
      options:numOpts(p.a).map(String),explanation:p.w,visual:'text'
    };
  }

  function missingNum() {
    const items = [
      () => { const a=rand(5,15),b=rand(5,15);return{q:`? + ${b} = ${a+b}`,a,why:`${a+b}-${b}=${a}`,d:0.6};},
      () => { const a=rand(20,60),b=rand(5,20);return{q:`${a} − ? = ${a-b}`,a:b,why:`${a}-(${a-b})=${b}`,d:0.6};},
      () => { const a=rand(2,9),b=rand(2,9);return{q:`? × ${b} = ${a*b}`,a,why:`${a*b}/${b}=${a}`,d:0.7};},
      () => { const a=rand(2,9),b=rand(2,9);return{q:`${a*b} ÷ ? = ${a}`,a:b,why:`${a*b}/${a}=${b}`,d:0.7};},
      () => { const a=rand(2,6),b=rand(2,6);return{q:`(? × ${b}) + ${a} = ${a+a*b}`,a,why:`(${a}×${b})+${a}=${a+a*b}`,d:1.1};},
      () => { const a=rand(2,8);return{q:`?² = ${a*a}`,a,why:`√${a*a}=${a}`,d:1.0};},
      () => { const a=rand(2,5);return{q:`?³ = ${a**3}`,a,why:`Cube root of ${a**3}=${a}`,d:1.3};},
      () => { const tot=rand(50,100),a=rand(10,30),b=rand(10,30);return{q:`${a} + ${b} + ? = ${tot}`,a:tot-a-b,why:`${tot}-${a}-${b}=${tot-a-b}`,d:1.0};},
    ];
    const p = pick(items)();
    return {
      type:'missingNum',category:'mentalAgility',categoryLabel:'Find the Missing Number',
      difficulty:p.d||1.1,question:p.q,answer:String(p.a),
      options:numOpts(p.a).map(String),explanation:p.why,visual:'text'
    };
  }

  function timeCalc() {
    const items = [
      () => { const h=rand(1,10);return{q:`How many hours in ${h} days?`,a:String(h*24),w:[String(h*24+12),String(h*12),String(h*24-24)],why:`${h}×24=${h*24}`,d:0.7};},
      () => { const w=rand(2,5);return{q:`How many days in ${w} weeks?`,a:String(w*7),w:[String(w*7+1),String(w*7-1),String(w*5)],why:`${w}×7=${w*7}`,d:0.6};},
      () => { const h1=rand(8,11),h2=rand(1,4);return{q:`How many hours from ${h1}:00 AM to ${h2}:00 PM?`,a:String(h2+12-h1),w:[String(h2+12-h1+1),String(h2+12-h1-1),String(h2)],why:`${12-h1}h to noon + ${h2}h.`,d:1.0};},
      () => { const d=rand(2,6);return{q:`How many minutes in ${d} days?`,a:String(d*1440),w:[String(d*1440+60),String(d*60),String(d*1440-60)],why:`${d}×24×60=${d*1440}`,d:1.2};},
      () => ({q:`A flight departs 11:45 PM and lands 3:20 AM next day. Duration?`,a:'3h 35m',w:['3h 45m','4h 35m','2h 35m'],why:`15m before midnight + 3h 20m = 3h 35m.`,d:1.3}),
      () => ({q:`It's 3:47. What time was it 2 hours and 18 minutes ago?`,a:'1:29',w:['1:19','2:29','1:39'],why:`3:47 − 2:18 = 1:29.`,d:1.4}),
    ];
    const gen = pick(items)();
    return {
      type:'timeCalc',category:'mentalAgility',categoryLabel:'Time Math',
      difficulty:gen.d||1.1,question:gen.q,answer:gen.a,
      options:shuffle([gen.a,...gen.w]),explanation:gen.why,visual:'text'
    };
  }

  function mentalChain() {
    const chains = [
      () => { const a=rand(5,10),b=rand(2,4),c=rand(2,8);const ans=(a*b)-c;return{q:`Start with ${a}, multiply by ${b}, subtract ${c}. Result?`,a:String(ans),w:[String(ans+2),String(ans-3),String(a+b-c)],why:`${a}×${b}=${a*b}, −${c}=${ans}`,d:0.9};},
      () => { const a=rand(10,30),b=rand(5,10),c=rand(2,5);return{q:`Start with ${a}, add ${b}, multiply by ${c}. Result?`,a:String((a+b)*c),w:[String(a+b*c),String(a*b+c),String(a+b+c)],why:`(${a}+${b})×${c}=${(a+b)*c}`,d:1.0};},
      () => { const a=rand(50,100),b=rand(10,30),c=rand(2,5);const ans=(a-b)*c;return{q:`Take ${a}, subtract ${b}, multiply by ${c}. Result?`,a:String(ans),w:[String(ans+c),String(ans-b),String(a*c-b)],why:`(${a}-${b})×${c}=${ans}`,d:1.2};},
      () => { const a=rand(2,6),b=rand(2,6);const ans=a*a+b*b;return{q:`Square ${a}, square ${b}, add them. Result?`,a:String(ans),w:[String(ans+1),String(a*b),String((a+b)**2)],why:`${a}²+${b}²=${a*a}+${b*b}=${ans}`,d:1.2};},
      () => { const a=rand(10,20),b=rand(2,4),c=rand(5,10);const ans=a*b+c*b;return{q:`Multiply ${a} by ${b}. Multiply ${c} by ${b}. Add the results.`,a:String(ans),w:[String(ans+b),String((a+c)*b-2),String(ans-b)],why:`${a*b}+${c*b}=${ans}`,d:1.3};},
    ];
    const gen = pick(chains)();
    return {
      type:'mentalChain',category:'mentalAgility',categoryLabel:'Chain Calculation',
      difficulty:gen.d||1.3,question:gen.q,answer:gen.a,
      options:shuffle([gen.a,...gen.w]),explanation:gen.why,visual:'text'
    };
  }

  function memoryTask() {
    const items = [
      () => { const nums=[rand(2,9),rand(2,9),rand(2,9)];const sum=nums.reduce((a,b)=>a+b,0);return{q:`Add: ${nums.join(', ')}`,a:String(sum),w:[String(sum+2),String(sum-1),String(sum+3)],why:`${nums.join('+')}=${sum}`,d:0.7};},
      () => { const items2=shuffle(['Red','Blue','Green','Yellow','Purple']);const pos=rand(0,4);const ord=['first','second','third','fourth','last'];return{q:`List: ${items2.join(', ')} — which is ${ord[pos]}?`,a:items2[pos],w:shuffle(items2.filter(i=>i!==items2[pos])).slice(0,3),why:`${items2[pos]} is ${ord[pos]}.`,d:0.7};},
      () => { const nums=[rand(10,30),rand(10,30),rand(10,30),rand(10,30),rand(10,30)];const max=Math.max(...nums);return{q:`Largest number? ${nums.join(', ')}`,a:String(max),w:shuffle(nums.filter(n=>n!==max).map(String)).slice(0,3),why:`${max} is largest.`,d:0.6};},
      () => { const word=pick(['BRAIN','SMART','THINK','LEARN','QUICK','POWER','LIGHT','DREAM','SPACE','WORLD']);const rev=word.split('').reverse().join('');return{q:`"${word}" spelled backwards?`,a:rev,w:[word,rev.slice(0,-1)+word[0],rev.split('').sort().join('')].filter(x=>x!==rev).slice(0,3),why:`${word} → ${rev}`,d:1.0};},
      () => { const a=rand(2,8),b=rand(2,8),c=rand(2,8);return{q:`${a} × ${b}, then + ${c} = ?`,a:String(a*b+c),w:[String(a*b+c+2),String(a*b+c-3),String(a+b+c)],why:`${a*b}+${c}=${a*b+c}`,d:1.0};},
      () => { const word=pick(['PLANET','GARDEN','CASTLE','BRIDGE','SILVER','ORANGE','WINTER']);const pos=rand(1,4);const ord=['','2nd','3rd','4th','5th'];return{q:`In "${word}", what is the ${ord[pos]} letter?`,a:word[pos],w:shuffle(word.split('').filter(l=>l!==word[pos])).slice(0,3),why:`${word}[${pos+1}]=${word[pos]}`,d:1.1};},
    ];
    const gen = pick(items)();
    return {
      type:'memoryTask',category:'workingMemory',categoryLabel:'Working Memory',
      difficulty:gen.d||1.1,question:gen.q,answer:gen.a,
      options:shuffle([gen.a,...gen.w.filter(w=>w!==gen.a).slice(0,3)]),
      explanation:gen.why,visual:'text'
    };
  }

  function analogy() {
    const items = [
      {a:'Hot',b:'Cold',c:'Up',d:'Down',why:'Opposites.',d2:0.6},
      {a:'Puppy',b:'Dog',c:'Kitten',d:'Cat',why:'Young to adult.',d2:0.6},
      {a:'Bird',b:'Nest',c:'Bee',d:'Hive',why:'Animal to home.',d2:0.7},
      {a:'Eye',b:'See',c:'Ear',d:'Hear',why:'Organ to function.',d2:0.6},
      {a:'Fish',b:'Swim',c:'Bird',d:'Fly',why:'Animal to movement.',d2:0.6},
      {a:'Doctor',b:'Hospital',c:'Teacher',d:'School',why:'Worker to workplace.',d2:0.7},
      {a:'Author',b:'Book',c:'Chef',d:'Meal',why:'Creator to creation.',d2:1.0},
      {a:'Lock',b:'Key',c:'Question',d:'Answer',why:'Problem to solution.',d2:1.0},
      {a:'Telescope',b:'Stars',c:'Microscope',d:'Cells',why:'Tool to what it observes.',d2:1.2},
      {a:'Prologue',b:'Book',c:'Overture',d:'Opera',why:'Introductory section to work.',d2:1.5},
      {a:'Cartographer',b:'Maps',c:'Lexicographer',d:'Dictionaries',why:'Specialist to creation.',d2:1.6},
      {a:'Archipelago',b:'Islands',c:'Constellation',d:'Stars',why:'Group name to components.',d2:1.7},
    ];
    const i = pick(items);
    const wrong = items.filter(x=>x.d!==i.d).map(x=>x.d);
    return {
      type:'analogy',category:'verbalReasoning',categoryLabel:'Analogy',
      difficulty:i.d2||1.1,question:`${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer:i.d,options:shuffle([i.d,...shuffle(wrong).slice(0,3)]),
      explanation:i.why,visual:'text'
    };
  }

  function verbal() {
    const vocab = [
      {q:'What is the opposite of "ancient"?',a:'Modern',w:['Old','Historic','Antique'],why:'Ancient=old, modern=current.',d:0.6},
      {q:'What word means the same as "rapid"?',a:'Fast',w:['Slow','Steady','Calm'],why:'Rapid=fast.',d:0.6},
      {q:'What is the opposite of "brave"?',a:'Cowardly',w:['Bold','Strong','Fierce'],why:'Brave=courageous; cowardly=lacking courage.',d:0.7},
      {q:'What word means the same as "enormous"?',a:'Huge',w:['Tiny','Small','Medium'],why:'Enormous=huge.',d:0.6},
      {q:'What is the opposite of "temporary"?',a:'Permanent',w:['Brief','Short','Fleeting'],why:'Temporary=short-lived; permanent=forever.',d:1.0},
      {q:'What word means the same as "cautious"?',a:'Prudent',w:['Reckless','Bold','Wild'],why:'Prudent=wisely cautious.',d:1.1},
      {q:'What is the opposite of "transparent"?',a:'Opaque',w:['Clear','Visible','Obvious'],why:'Transparent=see-through; opaque=not.',d:1.1},
      {q:'What is the opposite of "loquacious"?',a:'Taciturn',w:['Quiet','Shy','Nervous'],why:'Loquacious=very talkative; taciturn=reserved.',d:1.5},
      {q:'What word means the same as "ephemeral"?',a:'Fleeting',w:['Eternal','Constant','Permanent'],why:'Ephemeral=lasting a very short time.',d:1.4},
      {q:'What word means the same as "perspicacious"?',a:'Shrewd',w:['Dull','Confused','Naive'],why:'Perspicacious=having a ready insight.',d:1.8},
    ];
    const v = pick(vocab);
    return {
      type:'verbal',category:'verbalReasoning',categoryLabel:'Vocabulary',
      difficulty:v.d||1.0,question:v.q,answer:v.a,
      options:shuffle([v.a,...v.w]),explanation:v.why,visual:'text'
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
    const i = pick(verified);
    return {
      type:'wordLink',category:'verbalReasoning',categoryLabel:'Word Link',
      difficulty:i.d||1.0,question:`What word connects: ${i.first} ___ ${i.second}`,
      answer:i.a,options:shuffle([i.a,...i.w]),
      explanation:i.why,visual:'text'
    };
  }

  function sentenceLogic() {
    const items = [
      {q:'Which is grammatically correct?',a:'She and I went to the store.',w:['Her and me went to the store.','Me and her went to the store.','Her and I went to the store.'],why:'"She and I" is the correct subject.',d:0.8},
      {q:'What does "break the ice" mean?',a:'Start a conversation',w:['Break something cold','Cause a problem','End a friendship'],why:'To initiate social interaction.',d:0.7},
      {q:'What does "once in a blue moon" mean?',a:'Very rarely',w:['Every month','At night','When it is cold'],why:'Something that happens very rarely.',d:0.7},
      {q:'Choose correct: "Their/There/They\'re going to the park."',a:"They're",w:['Their','There','Theyre'],why:"They're=they are.",d:0.7},
      {q:'What is the correct plural of "phenomenon"?',a:'Phenomena',w:['Phenomenons','Phenomenas','Phenomeni'],why:'Greek origin: phenomenon → phenomena.',d:1.1},
      {q:'What does "begging the question" actually mean?',a:'Assuming the conclusion in your argument',w:['Avoiding a question','Raising a question','Asking repeatedly'],why:'It\'s a logical fallacy.',d:1.4},
      {q:'What is the difference between "affect" and "effect"?',a:'Affect is a verb, effect is a noun',w:['They are the same','Effect is a verb, affect is a noun','Both are nouns'],why:'Affect: to influence. Effect: the result.',d:1.3},
      {q:'What is a "dangling modifier"?',a:'A phrase that doesn\'t clearly modify any word',w:['A very long sentence','An unclear pronoun','A misplaced comma'],why:'"Running to the store, the rain started." — who was running?',d:1.5},
    ];
    const i = pick(items);
    return {
      type:'sentenceLogic',category:'verbalReasoning',categoryLabel:'Language Logic',
      difficulty:i.d||1.1,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function oddOut() {
    const sets = [
      {items:['Apple','Banana','Carrot','Orange'],odd:'Carrot',why:'Vegetable, not a fruit.',d:0.5},
      {items:['Dog','Cat','Goldfish','Hamster'],odd:'Goldfish',why:'Fish, not a mammal.',d:0.6},
      {items:['Red','Blue','Square','Green'],odd:'Square',why:'Shape, not a color.',d:0.5},
      {items:['January','Monday','March','December'],odd:'Monday',why:'Day of week, not a month.',d:0.5},
      {items:['Eagle','Penguin','Sparrow','Hawk'],odd:'Penguin',why:'Cannot fly.',d:0.7},
      {items:['Piano','Guitar','Violin','Drums'],odd:'Drums',why:'Percussion; others are melodic.',d:0.9},
      {items:['Mars','Venus','Moon','Jupiter'],odd:'Moon',why:'Orbits Earth, not the Sun.',d:0.9},
      {items:['Dolphin','Shark','Whale','Seal'],odd:'Shark',why:'Fish; others are mammals.',d:0.9},
      {items:['Python','Java','French','Ruby'],odd:'French',why:'Human language; others are programming languages.',d:0.9},
      {items:['Gold','Silver','Diamond','Copper'],odd:'Diamond',why:'Gemstone; others are metals.',d:1.0},
      {items:['Cello','Flute','Violin','Harp'],odd:'Flute',why:'Wind instrument; others are stringed.',d:1.0},
      {items:['Beethoven','Mozart','Picasso','Bach'],odd:'Picasso',why:'Painter; others were composers.',d:1.2},
      {items:['Democracy','Monarchy','Republic','Capitalism'],odd:'Capitalism',why:'Economic system; others are government types.',d:1.3},
      {items:['Meter','Kilogram','Second','Dollar'],odd:'Dollar',why:'Currency; others are SI units.',d:1.2},
      {items:['Sonnet','Haiku','Limerick','Novel'],odd:'Novel',why:'Prose; others are poetry forms.',d:1.3},
      {items:['Plato','Aristotle','Socrates','Caesar'],odd:'Caesar',why:'Political leader; others were philosophers.',d:1.3},
    ];
    const s = pick(sets);
    return {
      type:'oddOut',category:'logicalReasoning',categoryLabel:'Odd One Out',
      difficulty:s.d||1.0,question:"Which one doesn't belong?",
      answer:s.odd,options:shuffle(s.items),
      explanation:s.why,visual:'text'
    };
  }

  function logic() {
    const puzzles = [
      {q:'All cats have tails. Whiskers is a cat. Does Whiskers have a tail?',a:'Yes',w:['No','Maybe','Not enough info'],why:'All cats → Whiskers is a cat → Whiskers has a tail.',d:0.7},
      {q:'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?',a:'Leo',w:['Jake','Kim','Cannot tell'],why:'Order: Jake, Kim, Leo.',d:0.7},
      {q:'Lisa runs faster than Mia. Mia runs faster than Nora. Who is fastest?',a:'Lisa',w:['Mia','Nora','Cannot tell'],why:'Lisa > Mia > Nora.',d:0.7},
      {q:'If it rains, the grass is wet. The grass is wet. Did it rain?',a:'Not necessarily',w:['Yes','No','Always'],why:'Grass could be wet from a sprinkler.',d:1.0},
      {q:'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?',a:'Not necessarily',w:['Yes','No','Always'],why:'Only SOME dogs bark loudly.',d:1.0},
      {q:'If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?',a:'Yes',w:['No','Maybe','Cannot determine'],why:'A⊂B and B⊂C → A⊂C.',d:1.1},
      {q:'If no mammals lay eggs, and a platypus lays eggs, what can we conclude?',a:'The statement is false',w:['Platypus is not a mammal','Nothing','Platypus is a bird'],why:'Platypus IS a mammal that lays eggs → premise is false.',d:1.4},
      {q:'You pick Box 1 of 3. Host reveals Box 3 is empty. Should you switch to Box 2?',a:'Yes, switching is better',w:["No, stay with Box 1","It doesn't matter","Not enough info"],why:'Monty Hall: switching gives 2/3 chance.',d:1.7},
      {q:'If "If P then Q" is true, and Q is false, what do we know about P?',a:'P is false',w:['P is true','P is unknown','Nothing'],why:'Contrapositive: not-Q → not-P.',d:1.5},
    ];
    const p = pick(puzzles);
    return {
      type:'logic',category:'logicalReasoning',categoryLabel:'Logic',
      difficulty:p.d||1.2,question:p.q,answer:p.a,
      options:shuffle([p.a,...p.w]),explanation:p.why,visual:'text'
    };
  }

  function truthTable() {
    const items = [
      {q:'Statement: "If it\'s raining, I bring an umbrella." It\'s NOT raining. Can we conclude anything about the umbrella?',a:'No, could go either way',w:['I definitely have an umbrella','I definitely don\'t have one','The statement is false'],why:'"If" only specifies the rain case.',d:1.4},
      {q:'"Either it will rain or snow tomorrow." It didn\'t rain. What happened?',a:'It snowed',w:['Nothing happened','It rained anyway','Cannot tell'],why:'One of two must happen; rain didn\'t → snow did.',d:1.2},
      {q:'"If I study I pass. If I pass I graduate." I studied. What happens?',a:'I graduate',w:['I might pass','Nothing certain','I only pass'],why:'Study → pass → graduate.',d:1.2},
      {q:'True or False: "If A implies B, then not-B implies not-A"',a:'True',w:['False','Sometimes','Cannot determine'],why:'This is the contrapositive — always logically equivalent.',d:1.5},
      {q:'All P are Q. All Q are R. No R are S. Are any P also S?',a:'No',w:['Yes','Maybe','Cannot tell'],why:'P→Q→R, and no R are S, so no P can be S.',d:1.6},
    ];
    const i = pick(items);
    return {
      type:'truthTable',category:'logicalReasoning',categoryLabel:'Logical Deduction',
      difficulty:i.d||1.5,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function emotionalIQ() {
    const items = [
      {q:'Your friend cancels plans last minute and seems stressed. Best response?',a:"Ask if they're okay",w:['Get angry','Ignore them','Cancel on them next time'],why:'Concern builds trust.',d:0.7},
      {q:'A coworker takes credit for your idea. Best first step?',a:'Talk to them privately',w:['Yell publicly','Do nothing','Complain to everyone'],why:'Private conversation addresses it directly.',d:0.9},
      {q:'Someone says "I\'m fine" but looks upset. What do they likely mean?',a:"They're not fine but don't want to talk",w:["They are fine","They want you to leave","They're testing you"],why:'Body language often contradicts words.',d:0.8},
      {q:'A friend is venting about their day. What do they most likely want?',a:'Someone to listen',w:['Advice','To be told to calm down','Solutions'],why:'Venting = being heard.',d:0.7},
      {q:'You made a mistake at work. Best approach?',a:'Own it and fix it',w:['Hide it','Blame someone','Hope no one notices'],why:'Taking responsibility shows integrity.',d:0.7},
      {q:'Someone gives you harsh feedback. Best initial reaction?',a:'Listen and consider it',w:['Defend immediately','Walk away','Give harsh feedback back'],why:'Even harsh feedback can contain truth.',d:0.9},
      {q:'Your friend just failed an exam. What should you say?',a:'Acknowledge their feelings, offer support',w:["Tell them it's not a big deal","List what they did wrong","Share how well you did"],why:'Validating feelings shows empathy.',d:0.7},
      {q:'You strongly disagree with a friend\'s life choice. Best approach?',a:'Express concern once, then respect their decision',w:['Lecture them repeatedly','Cut them off','Agree to avoid conflict'],why:'Once is honest; repeatedly is controlling.',d:1.1},
    ];
    const i = pick(items);
    return {
      type:'emotionalIQ',category:'spatialAwareness',categoryLabel:'Emotional IQ',
      difficulty:i.d||1.0,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function spatial() {
    const items = [
      {q:'Rotate an arrow pointing UP by 180°. Where does it point?',a:'Down',w:['Up','Left','Right'],why:'180° flips direction.',d:0.7},
      {q:'Rotate an arrow pointing RIGHT by 90° clockwise. Where does it point?',a:'Down',w:['Up','Left','Right'],why:'Right + 90° CW = Down.',d:0.8},
      {q:'Rotate an arrow pointing UP by 90° clockwise. Where does it point?',a:'Right',w:['Left','Down','Up'],why:'Up + 90° CW = Right.',d:0.7},
      {q:'How many faces does a standard die have?',a:'6',w:['4','8','12'],why:'A cube has 6 faces.',d:0.6},
      {q:'Rotate an arrow pointing LEFT by 90° clockwise. Where does it point?',a:'Up',w:['Down','Right','Left'],why:'Left + 90° CW = Up.',d:1.0},
      {q:'Rotate an arrow pointing UP by 270° clockwise. Where does it point?',a:'Left',w:['Right','Down','Up'],why:'270° CW = 90° CCW. Up → Left.',d:1.1},
      {q:'Looking at a clock, what angle do the hands make at 3:00?',a:'90°',w:['60°','120°','180°'],why:'At 3:00, hands are at right angles.',d:0.9},
      {q:'A cube is painted red on all sides and cut into 27 equal smaller cubes. How many have NO paint?',a:'1',w:['6','8','0'],why:'Only the very center cube has no painted faces.',d:1.3},
      {q:'How many degrees does the minute hand move in 20 minutes?',a:'120°',w:['60°','90°','180°'],why:'6°/min × 20 = 120°.',d:1.2},
    ];
    const i = pick(items);
    return {
      type:'spatial',category:'numericalReasoning',categoryLabel:'Spatial',
      difficulty:i.d||1.1,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function comparison() {
    const items = [
      {q:'Which is larger: 3/4 or 1/2?',a:'3/4',w:['1/2','Equal','Cannot tell'],why:'3/4=0.75 > 1/2=0.5.',d:0.6},
      {q:'Which is smaller: 1/3 or 1/2?',a:'1/3',w:['1/2','Equal','Cannot tell'],why:'1/3=0.33 < 1/2=0.5.',d:0.6},
      {q:'Which is larger: 50% or 1/3?',a:'50%',w:['1/3','Equal','Cannot tell'],why:'50%=0.5 > 1/3=0.33.',d:0.7},
      {q:'Which is larger: 3/4 or 2/3?',a:'3/4',w:['2/3','Equal','Cannot tell'],why:'3/4=0.75 > 2/3=0.67.',d:1.0},
      {q:'Which is larger: 2 cubed or 3 squared?',a:'3 squared (9)',w:['2 cubed (8)','Equal','Cannot tell'],why:'2³=8, 3²=9.',d:1.0},
      {q:'Which is larger: 2/5 or 3/8?',a:'2/5',w:['3/8','Equal','Cannot tell'],why:'2/5=0.40 > 3/8=0.375.',d:1.1},
      {q:'Which is larger: 2⁵ or 5²?',a:'2⁵ (32)',w:['5² (25)','Equal','Cannot tell'],why:'2⁵=32 > 5²=25.',d:1.0},
      {q:'Which is larger: 10% of 200 or 20% of 90?',a:'10% of 200',w:['20% of 90','Equal','Cannot tell'],why:'10%×200=20, 20%×90=18.',d:1.2},
      {q:'Which is larger: 3/7 or 5/12?',a:'3/7',w:['5/12','Equal','Cannot tell'],why:'3/7=36/84 > 5/12=35/84.',d:1.3},
    ];
    const i = pick(items);
    return {
      type:'comparison',category:'numericalReasoning',categoryLabel:'Compare',
      difficulty:i.d||1.2,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function estimation() {
    const items = [
      {q:'About how many days in a year?',a:'365',w:['300','400','350'],why:'365 days.',d:0.5},
      {q:'About how many weeks in a year?',a:'52',w:['48','56','42'],why:'365÷7≈52.',d:0.6},
      {q:'How many months have 31 days?',a:'7',w:['5','6','8'],why:'Jan,Mar,May,Jul,Aug,Oct,Dec.',d:0.7},
      {q:'How many continents are there?',a:'7',w:['5','6','8'],why:'7 continents.',d:0.5},
      {q:'How many planets in our solar system?',a:'8',w:['7','9','10'],why:'Mercury through Neptune.',d:0.5},
      {q:'About how many bones in an adult human body?',a:'206',w:['150','300','106'],why:'206 bones.',d:1.0},
      {q:'How many keys on a standard piano?',a:'88',w:['76','92','64'],why:'Standard piano=88 keys.',d:1.0},
      {q:'Roughly how many minutes in a day?',a:'1440',w:['1000','2000','1200'],why:'60×24=1440.',d:0.9},
      {q:'How many zeros in a trillion?',a:'12',w:['9','15','6'],why:'10¹².',d:1.1},
      {q:'How many chromosomes do humans have?',a:'46',w:['23','48','42'],why:'23 pairs=46 total.',d:1.0},
    ];
    const i = pick(items);
    return {
      type:'estimation',category:'numericalReasoning',categoryLabel:'General Knowledge',
      difficulty:i.d||1.0,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  function numberProperty() {
    const items = [
      {q:'Is 0 even or odd?',a:'Even',w:['Odd','Neither','Both'],why:'0 is divisible by 2.',d:0.7},
      {q:'What is the smallest prime number?',a:'2',w:['1','3','0'],why:'2 is the smallest (and only even) prime.',d:0.7},
      {q:'Is 15 prime?',a:'No',w:['Yes','Cannot tell','Only in some systems'],why:'15=3×5.',d:0.7},
      {q:'What is the square root of 64?',a:'8',w:['6','7','9'],why:'8×8=64.',d:0.7},
      {q:'Is 97 a prime number?',a:'Yes',w:['No','Cannot tell','Only if even'],why:'97 is only divisible by 1 and 97.',d:1.1},
      {q:'How many factors does 12 have?',a:'6',w:['4','5','3'],why:'1,2,3,4,6,12=six factors.',d:1.0},
      {q:'What is 2 to the power of 10?',a:'1024',w:['512','2048','1000'],why:'2¹⁰=1024.',d:1.1},
      {q:'How many prime numbers between 1 and 20?',a:'8',w:['6','7','10'],why:'2,3,5,7,11,13,17,19.',d:1.1},
      {q:'What is the sum of the first 10 positive integers?',a:'55',w:['45','50','60'],why:'n(n+1)/2=55.',d:1.0},
      {q:'What is the sum of all integers from 1 to 100?',a:'5050',w:['4950','5000','5100'],why:'n(n+1)/2=5050.',d:1.4},
      {q:'Is 1 a prime number?',a:'No',w:['Yes','Sometimes','By definition'],why:'Primes must have exactly 2 factors. 1 only has 1.',d:1.3},
      {q:'What is the next perfect number after 6?',a:'28',w:['12','18','24'],why:'28=1+2+4+7+14.',d:1.7},
    ];
    const i = pick(items);
    return {
      type:'numberProperty',category:'numericalReasoning',categoryLabel:'Number Theory',
      difficulty:i.d||1.3,question:i.q,answer:i.a,
      options:shuffle([i.a,...i.w]),explanation:i.why,visual:'text'
    };
  }

  // ── Generate (router) ─────────────────────────────
  const TYPE_POOL = [
    ['numSeq',       5],
    ['letterSeq',    3],
    ['matrix',       3],
    ['series',       2],
    ['shapePattern', 2],
    ['codeBreak',    3],
    ['riddle',       4],
    ['wordProblem',  3],
    ['logicGrid',    2],
    ['math',         5],
    ['missingNum',   3],
    ['timeCalc',     2],
    ['mentalChain',  2],
    ['memoryTask',   4],
    ['analogy',      4],
    ['verbal',       3],
    ['wordLink',     3],
    ['sentenceLogic',2],
    ['oddOut',       4],
    ['logic',        3],
    ['truthTable',   2],
    ['emotionalIQ',  3],
    ['spatial',      2],
    ['comparison',   2],
    ['estimation',   2],
    ['numberProperty',2],
  ];

  // Expand the pool based on weights
  const WEIGHTED_TYPES = TYPE_POOL.flatMap(([type, weight]) =>
    Array(weight).fill(type)
  );

  const generators = {
    numSeq, letterSeq, matrix, series, shapePattern,
    codeBreak, riddle, wordProblem, logicGrid,
    math, missingNum, timeCalc, mentalChain,
    memoryTask, analogy, verbal, wordLink, sentenceLogic,
    oddOut, logic, truthTable, emotionalIQ,
    spatial, comparison, estimation, numberProperty,
  };

  function generate(difficulty = 1.0) {
    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const typeName = pick(WEIGHTED_TYPES);
      q = generators[typeName]();
      tries++;
      if (tries > 30) break;
    } while (Math.abs(q.difficulty - difficulty) > tolerance);
    return q;
  }

  return { generate, render, attach };
})();

window.MCQGame = MCQGame;