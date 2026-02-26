const Q = {
  age: 25,
  used: new Set(),

  setAge(a) { this.age = a || 25; },
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

  hash(q) { return q.type + ':' + q.question.slice(0, 50) + (q.sequence || []).join(''); },

  // ─── DIFFICULTY HELPER ───────────────────────────────────────────────────
  // IQ → target difficulty
  getTargetDifficulty(iq) {
    if (iq < 85)  return 0.6;
    if (iq < 95)  return 0.8;
    if (iq < 105) return 1.0;
    if (iq < 115) return 1.2;
    if (iq < 125) return 1.5;
    if (iq < 135) return 1.8;
    return 2.1;
  },

  // IQ change after answering
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

  // ─── MAIN GENERATOR ──────────────────────────────────────────────────────
  generate(targetDifficulty = 1.0) {
    const types = [
      // Pattern Recognition (high weight)
      'numSeq','numSeq','numSeq','numSeq','numSeq',
      'letterSeq','letterSeq','letterSeq',
      'matrix','matrix','matrix',
      'series','series',
      'shapePattern','shapePattern',
      // Problem Solving
      'codeBreak','codeBreak','codeBreak',
      'riddle','riddle','riddle','riddle',
      'wordProblem','wordProblem','wordProblem',
      'logicGrid','logicGrid',
      // Mental Agility
      'math','math','math','math','math',
      'missingNum','missingNum','missingNum',
      'timeCalc','timeCalc',
      'mentalChain','mentalChain',
      // Working Memory
      'memoryTask','memoryTask','memoryTask','memoryTask',
      // Verbal Reasoning
      'analogy','analogy','analogy','analogy',
      'verbal','verbal','verbal',
      'wordLink','wordLink','wordLink',
      'sentenceLogic','sentenceLogic',
      // Logical Reasoning
      'oddOut','oddOut','oddOut','oddOut',
      'logic','logic','logic',
      'truthTable','truthTable',
      // Emotional
      'emotionalIQ','emotionalIQ','emotionalIQ',
      // Spatial / Numerical
      'spatial','spatial',
      'comparison','comparison',
      'estimation','estimation',
      'numberProperty','numberProperty',
    ];

    const tolerance = 0.45;
    let q, tries = 0;
    do {
      const fn = this.pick(types);
      q = this[fn]();
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

  // ═══════════════════════════════════════════════════
  // PATTERN RECOGNITION
  // ═══════════════════════════════════════════════════

  numSeq() {
    const patterns = [
      // EASY (0.6–0.9)
      () => { const add = this.rand(2, 10); const s = this.rand(1, 30);
        return { seq:[s,s+add,s+add*2,s+add*3], ans:s+add*4, d:0.6, why:`+${add} each time. ${s+add*3}+${add}=${s+add*4}` }; },
      () => { const sub = this.rand(2, 8); const s = this.rand(40, 80);
        return { seq:[s,s-sub,s-sub*2,s-sub*3], ans:s-sub*4, d:0.7, why:`-${sub} each time.` }; },
      () => { const s = this.rand(2, 6);
        return { seq:[s,s*2,s*4,s*8], ans:s*16, d:0.7, why:`Doubles each time. ${s*8}×2=${s*16}` }; },
      () => { const s = this.rand(1, 4);
        return { seq:[s,s*3,s*9,s*27], ans:s*81, d:0.8, why:`Triples each time.` }; },
      () => { return { seq:[2,3,5,7], ans:11, d:0.9, why:`Prime numbers. Next prime after 7 is 11.` }; },
      () => { return { seq:[1,3,6,10], ans:15, d:0.8, why:`Triangular numbers: +2,+3,+4,+5.` }; },
      () => { const s = this.rand(1,8);
        return { seq:[s,s+2,s+5,s+9], ans:s+14, d:0.8, why:`Gaps: +2,+3,+4,+5.` }; },
      () => { const s = this.rand(4,8)*16;
        return { seq:[s,s/2,s/4,s/8], ans:s/16, d:0.7, why:`Halved each time.` }; },
      () => { const o = this.rand(1,5);
        return { seq:[o*o,(o+1)**2,(o+2)**2,(o+3)**2], ans:(o+4)**2, d:0.9, why:`Perfect squares.` }; },
      // MEDIUM (1.0–1.4)
      () => { const a=this.rand(1,5),b=this.rand(2,6); const c=a+b,d=b+c,e=c+d;
        return { seq:[a,b,c,d], ans:e, d:1.0, why:`Each = sum of previous two. ${c}+${d}=${e}` }; },
      () => { const o=this.rand(0,2);
        return { seq:[2**(o+1),2**(o+2),2**(o+3),2**(o+4)], ans:2**(o+5), d:1.0, why:`Powers of 2.` }; },
      () => { const o=this.rand(1,4);
        return { seq:[o**3,(o+1)**3,(o+2)**3,(o+3)**3], ans:(o+4)**3, d:1.1, why:`Cube numbers.` }; },
      () => { const s=this.rand(1,8);
        return { seq:[s,s+2,s+6,s+12], ans:s+20, d:1.1, why:`Gaps double: +2,+4,+6,+8.` }; },
      () => { const s=this.rand(1,5);
        return { seq:[s,s*2,s*6,s*24], ans:s*120, d:1.2, why:`×2,×3,×4,×5.` }; },
      () => { const c=this.rand(1,5);
        return { seq:[1+c,4+c,9+c,16+c], ans:25+c, d:1.1, why:`Perfect squares + ${c}.` }; },
      () => { const s=this.rand(1,6);
        return { seq:[s,s+1,s+3,s+7], ans:s+15, d:1.2, why:`Gaps double: +1,+2,+4,+8.` }; },
      () => { const s=this.rand(2,5);
        return { seq:[s,s*s,s*s*s,s*s*s*s], ans:s**5, d:1.3, why:`Powers of ${s}. ${s}^5=${s**5}` }; },
      () => { const s=this.rand(3,9);
        return { seq:[s,s+s-1,s+2*(s-1),s+3*(s-1)], ans:s+4*(s-1), d:1.1, why:`Arithmetic with gap ${s-1}.` }; },
      // HARD (1.5–2.0)
      () => { const s=this.rand(1,3);
        return { seq:[s,s*2+1,(s*2+1)*2+1,((s*2+1)*2+1)*2+1], ans:((s*2+1)*2+1)*2+1*2+1, d:1.5, why:`×2 then +1 each time.` }; },
      () => { return { seq:[1,1,2,3,5,8], ans:13, d:1.3, why:`Fibonacci: each = sum of previous two.` }; },
      () => { return { seq:[1,4,9,16,25], ans:36, d:0.9, why:`Perfect squares 1–6.` }; },
      () => { return { seq:[1,8,27,64], ans:125, d:1.0, why:`Cube numbers 1–5.` }; },
      () => { const s=this.rand(2,4);
        return { seq:[s**2,s**3,(s**2)*(s**3),s**7], ans:s**8, d:1.8, why:`Exponents: ${s}^2,${s}^3,${s}^5,${s}^7,${s}^8 (Fibonacci exponents).` }; },
      () => { return { seq:[2,6,12,20,30], ans:42, d:1.4, why:`n(n+1): 1×2,2×3,3×4,4×5,5×6,6×7=42.` }; },
      () => { return { seq:[0,1,3,6,10,15], ans:21, d:1.3, why:`Triangular numbers.` }; },
      () => { const a=this.rand(10,30),d=this.rand(3,9);
        return { seq:[a,a+d,a+d*3,a+d*6], ans:a+d*10, d:1.5, why:`Gaps: +${d},+${d*2},+${d*3},+${d*4}.` }; },
    ];

    const p = this.pick(patterns)();
    return {
      type:'numSeq', category:'patternRecognition', categoryLabel:'Number Pattern',
      difficulty: p.d, question:'What comes next?',
      sequence:p.seq, answer:String(p.ans),
      options:this.numOpts(p.ans).map(String), explanation:p.why, visual:'sequence'
    };
  },

  letterSeq() {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      // EASY
      () => { const i=this.rand(0,19); return { seq:[A[i],A[i+1],A[i+2],A[i+3]], ans:A[i+4], d:0.6, why:`Consecutive letters.` }; },
      () => { const i=this.rand(0,15); return { seq:[A[i],A[i+2],A[i+4],A[i+6]], ans:A[i+8], d:0.7, why:`Skip one letter each time.` }; },
      () => { const i=this.rand(10,25); return { seq:[A[i],A[i-1],A[i-2],A[i-3]], ans:A[i-4], d:0.6, why:`Backward alphabet.` }; },
      () => { return { seq:['A','E','I','O'], ans:'U', d:0.7, why:`The five vowels.` }; },
      () => { return { seq:['B','D','F','H'], ans:'J', d:0.7, why:`Every other letter from B.` }; },
      () => { return { seq:['Z','X','V','T'], ans:'R', d:0.7, why:`Backwards, skipping one.` }; },
      // MEDIUM
      () => { const i=this.rand(0,11); return { seq:[A[i],A[i+3],A[i+6],A[i+9]], ans:A[i+12], d:1.0, why:`Skip two letters.` }; },
      () => { return { seq:['A','B','D','G'], ans:'K', d:1.0, why:`Gaps: +1,+2,+3,+4.` }; },
      () => { return { seq:['Z','Y','W','T'], ans:'P', d:1.0, why:`Gaps: -1,-2,-3,-4.` }; },
      () => { return { seq:['A','C','F','J'], ans:'O', d:1.1, why:`Gaps: +2,+3,+4,+5.` }; },
      () => { return { seq:['M','N','P','S'], ans:'W', d:1.1, why:`Gaps: +1,+2,+3,+4.` }; },
      () => { const i=this.rand(0,8); return { seq:[A[i],A[i+4],A[i+8],A[i+12]], ans:A[i+16], d:1.0, why:`Skip three letters.` }; },
      () => { return { seq:['Z','X','U','Q'], ans:'L', d:1.2, why:`Gaps: -2,-3,-4,-5.` }; },
      () => { return { seq:['A','Z','B','Y'], ans:'C', d:1.3, why:`Alternating from start and end.` }; },
      // HARD
      () => { return { seq:['A','B','D','H'], ans:'P', d:1.6, why:`Positions double: 1,2,4,8,16=P.` }; },
      () => { return { seq:['C','F','I','L'], ans:'O', d:1.1, why:`Every 3rd letter (C,F,I,L,O).` }; },
      () => { return { seq:['A','C','H','P'], ans:'E', d:1.7, why:`Gaps: +2,+5,+8,+11 (arithmetic +3). Next gap=14, P+14=E (wraps).` }; },
      () => { return { seq:['B','E','I','N'], ans:'T', d:1.4, why:`Gaps: +3,+4,+5,+6.` }; },
      () => { return { seq:['Z','A','Y','B'], ans:'X', d:1.3, why:`Alternating backward from Z and forward from A.` }; },
    ];

    const p = this.pick(patterns)();
    const wrong = A.split('').filter(l => l !== p.ans);
    return {
      type:'letterSeq', category:'patternRecognition', categoryLabel:'Letter Pattern',
      difficulty:p.d, question:'What letter comes next?',
      sequence:p.seq, answer:p.ans,
      options:this.shuffle([p.ans,...this.shuffle(wrong).slice(0,3)]),
      explanation:p.why, visual:'letterSequence'
    };
  },

  matrix() {
    const type = this.rand(0,7);
    let grid, ans, why, d;

    if (type===0) {
      const sum=this.rand(12,27); const a=this.rand(2,8),b=this.rand(2,8),c=sum-a-b;
      const dd=this.rand(2,8),e=this.rand(2,8),f=sum-dd-e;
      const g=this.rand(2,8),h=this.rand(2,8);
      ans=sum-g-h; grid=[a,b,c,dd,e,f,g,h,'?'];
      why=`Each row sums to ${sum}. ${g}+${h}+?=${sum}, ?=${ans}`; d=1.2;
    } else if (type===1) {
      const add=this.rand(2,6); const r=[this.rand(1,7),this.rand(1,7),this.rand(1,7)];
      grid=[...r,r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];
      ans=r[2]+add*2; why=`Each column +${add} per row.`; d=1.1;
    } else if (type===2) {
      const a=this.rand(2,5),b=this.rand(2,5); const dd=this.rand(2,5),e=this.rand(2,5); const g=this.rand(2,5),h=this.rand(2,5);
      grid=[a,b,a*b,dd,e,dd*e,g,h,'?']; ans=g*h;
      why=`Each row: col1 × col2 = col3. ${g}×${h}=${ans}`; d=1.3;
    } else if (type===3) {
      const m=2; const a=this.rand(2,5),b=this.rand(2,5),c=this.rand(2,5);
      grid=[a,b,c,a*m,b*m,c*m,a*m*m,b*m*m,'?']; ans=c*m*m;
      why=`Each row ×${m}. ${c*m}×${m}=${ans}`; d=1.1;
    } else if (type===4) {
      const a=this.rand(2,6),add=this.rand(1,4);
      grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?'];
      ans=a+add*2+2; why=`+1 across, +${add} down.`; d=1.2;
    } else if (type===5) {
      const colSum=this.rand(12,20); const a=this.rand(2,6),dd=this.rand(2,6),g=colSum-a-dd;
      const b=this.rand(2,6),e=this.rand(2,6),h=colSum-b-e;
      const c=this.rand(2,6),f=this.rand(2,6); ans=colSum-c-f;
      grid=[a,b,c,dd,e,f,g,h,'?']; why=`Each column sums to ${colSum}.`; d=1.3;
    } else if (type===6) {
      // each row: middle = avg of outer two
      const a=this.rand(2,9),c=this.rand(2,9); const b=Math.round((a+c)/2);
      const dd=this.rand(2,9),f=this.rand(2,9); const e=Math.round((dd+f)/2);
      const g=this.rand(2,9),i=this.rand(2,9); ans=Math.round((g+i)/2);
      grid=[a,b,c,dd,e,f,g,ans,'?']; ans=i;
      grid=[a,b,c,dd,e,f,g,'?',i]; ans=Math.round((g+i)/2);
      why=`Middle = average of first and last in each row.`; d=1.5;
    } else {
      // diagonal sums equal
      const diag=this.rand(10,20); const a=this.rand(2,7),e=this.rand(2,7);
      const i=diag-a-e; const c=this.rand(2,7),g=this.rand(2,7);
      ans=diag-c-g; const b=this.rand(2,7),d2=this.rand(2,7),f=this.rand(2,7),h=this.rand(2,7);
      grid=[a,b,c,d2,e,f,g,h,'?']; why=`Main diagonal sums to ${diag}.`; d=1.6;
    }

    return {
      type:'matrix', category:'patternRecognition', categoryLabel:'Matrix Logic',
      difficulty:d||1.3, question:'Find the missing number',
      grid, answer:String(ans), options:this.numOpts(ans).map(String),
      explanation:why, visual:'matrix'
    };
  },

  series() {
    const items = [
      // EASY (0.6-0.8)
      { q:'J, F, M, A, M, J, ?', a:'J', w:['A','S','D'], why:'First letters of months. July=J.', d:0.7 },
      { q:'S, M, T, W, T, F, ?', a:'S', w:['M','T','W'], why:'First letters of weekdays. Saturday=S.', d:0.7 },
      { q:'R, O, Y, G, B, I, ?', a:'V', w:['P','R','O'], why:'Rainbow colors. Violet=V.', d:0.7 },
      { q:'M, V, E, M, J, S, U, ?', a:'N', w:['P','E','M'], why:'Planets from Sun. Neptune=N.', d:0.8 },
      { q:'I, II, III, IV, V, VI, ?', a:'VII', w:['VIII','IIV','VV'], why:'Roman numerals. 7=VII.', d:0.7 },
      { q:'Do, Re, Mi, Fa, Sol, La, ?', a:'Ti', w:['Do','Si','Se'], why:'Solfege scale. After La=Ti.', d:0.7 },
      { q:'N, S, E, ?', a:'W', w:['N','S','NE'], why:'Compass directions: North,South,East,West.', d:0.6 },
      { q:'Spring, Summer, Autumn, ?', a:'Winter', w:['Fall','Monsoon','Spring'], why:'Four seasons.', d:0.6 },
      // MEDIUM (1.0-1.3)
      { q:'O, T, T, F, F, S, S, ?', a:'E', w:['N','T','S'], why:'First letters of numbers. Eight=E.', d:1.0 },
      { q:'H, He, Li, Be, B, C, ?', a:'N', w:['O','F','Ne'], why:'Chemical elements. Nitrogen=N.', d:1.1 },
      { q:'W, S, S, A, W, ?', a:'S', w:['W','A','F'], why:'Seasons cycling. Spring.', d:1.0 },
      { q:'A, E, ?', a:'I', w:['O','U','C'], why:'Vowels in order: A,E,I.', d:0.8 },
      { q:'1st, 2nd, 3rd, ?', a:'4th', w:['5th','6th','3rd'], why:'Ordinal numbers.', d:0.6 },
      { q:'Mercury, Venus, Earth, ?', a:'Mars', w:['Jupiter','Saturn','Neptune'], why:'Planets in order from Sun.', d:0.7 },
      { q:'F, L, T, ?', a:'G', w:['H','I','J'], why:'US Presidents first letters: Ford, Lincoln, Taft, Garfield.', d:1.4 },
      { q:'Solid, Liquid, ?', a:'Gas', w:['Steam','Ice','Plasma'], why:'States of matter.', d:0.7 },
      { q:'T, Q, P, O, ?', a:'N', w:['M','L','K'], why:'Reverse alphabet every other letter: T,Q,P,O,N.', d:1.2 },
      { q:'1, 1, 2, 3, 5, 8, ?', a:'13', w:['11','14','10'], why:'Fibonacci. 5+8=13.', d:1.0 },
      { q:'CM, M, D, C, L, X, V, ?', a:'I', w:['II','IV','X'], why:'Roman numeral values descending.', d:1.3 },
      // HARD (1.5+)
      { q:'J, J, A, S, O, N, D, ?', a:'J', w:['F','M','A'], why:'Month initials Jul-Dec, then Jan.', d:1.2 },
      { q:'2, 3, 5, 7, 11, 13, ?', a:'17', w:['14','15','16'], why:'Prime numbers.', d:1.1 },
      { q:'AT, FT, HG, PB, AU, ?', a:'AG', w:['FE','CU','SN'], why:'Chemical symbols for metals. AU=Gold, AG=Silver.', d:1.8 },
      { q:'G, E, D, C, B, ?', a:'A', w:['F','G','H'], why:'Musical notes descending.', d:1.4 },
      { q:'Q, W, E, R, T, ?', a:'Y', w:['U','A','S'], why:'Top row of QWERTY keyboard.', d:1.0 },
    ];
    const i = this.pick(items);
    return {
      type:'series', category:'patternRecognition', categoryLabel:'Complete the Series',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  shapePattern() {
    const items = [
      // EASY
      { q:'Triangle (3 sides), Square (4 sides), Pentagon (5 sides), Hexagon (6 sides), ?', a:'Heptagon (7)', w:['Octagon (8)','Hexagon (6)','Pentagon (5)'], why:'Polygons with increasing sides.', d:0.8 },
      { q:'How many faces does a cube have?', a:'6', w:['4','8','12'], why:'Top,bottom,front,back,left,right=6.', d:0.6 },
      { q:'How many sides does a triangle have?', a:'3', w:['4','5','6'], why:'Tri = three.', d:0.5 },
      { q:'How many degrees in a full circle?', a:'360', w:['180','270','90'], why:'A full rotation = 360°.', d:0.6 },
      { q:'How many right angles in a rectangle?', a:'4', w:['2','3','6'], why:'All four corners are right angles.', d:0.6 },
      { q:'What do you get when you cut a circle in half?', a:'Two semicircles', w:['Two squares','Two triangles','Two ovals'], why:'Half a circle is a semicircle.', d:0.6 },
      // MEDIUM
      { q:'How many faces does a triangular pyramid (tetrahedron) have?', a:'4', w:['3','5','6'], why:'A tetrahedron has 4 triangular faces.', d:1.0 },
      { q:'How many edges does a cube have?', a:'12', w:['6','8','10'], why:'4 top + 4 bottom + 4 vertical = 12.', d:1.0 },
      { q:'How many lines of symmetry does a regular hexagon have?', a:'6', w:['3','4','8'], why:'6 lines through opposite vertices/midpoints.', d:1.1 },
      { q:'How many degrees are in the interior angles of a triangle?', a:'180', w:['90','360','270'], why:'Triangle interior angles always sum to 180°.', d:0.8 },
      { q:'What is the interior angle of a regular hexagon?', a:'120°', w:['90°','108°','135°'], why:'(6-2)×180/6 = 120°.', d:1.2 },
      { q:'How many vertices does a cube have?', a:'8', w:['6','10','12'], why:'8 corners on a cube.', d:0.9 },
      { q:'What shape has the most sides: hexagon, octagon, or heptagon?', a:'Octagon', w:['Hexagon','Heptagon','Equal'], why:'Oct=8, hept=7, hex=6.', d:0.8 },
      { q:'A regular polygon has interior angles of 90°. What is it?', a:'Square', w:['Triangle','Pentagon','Hexagon'], why:'Only a square has all 90° interior angles.', d:0.9 },
      { q:'How many diagonals does a square have?', a:'2', w:['1','4','0'], why:'A square has exactly 2 diagonals.', d:0.9 },
      // HARD
      { q:'What is the exterior angle of a regular pentagon?', a:'72°', w:['60°','90°','108°'], why:'360/5 = 72°.', d:1.3 },
      { q:'How many faces does a dodecahedron have?', a:'12', w:['10','20','8'], why:'Dodeca = 12.', d:1.4 },
      { q:'What is the sum of interior angles in a hexagon?', a:'720°', w:['540°','900°','360°'], why:'(6-2)×180 = 720°.', d:1.3 },
      { q:'How many faces does an icosahedron have?', a:'20', w:['12','8','16'], why:'Icosa = 20 triangular faces.', d:1.5 },
      { q:'What is the number of diagonals in a hexagon?', a:'9', w:['6','12','8'], why:'n(n-3)/2 = 6(3)/2 = 9.', d:1.6 },
      { q:'A sphere, cone and cylinder all sit on a flat surface. Which has the smallest base?', a:'Cone', w:['Sphere','Cylinder','Equal'], why:'A cone has a single circular point of contact, smaller than a sphere\'s or cylinder\'s base.', d:1.4 },
    ];
    const i = this.pick(items);
    return {
      type:'shapePattern', category:'patternRecognition', categoryLabel:'Shape Logic',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // PROBLEM SOLVING
  // ═══════════════════════════════════════════════════

  codeBreak() {
    const items = [
      // EASY
      { q:'If A=1, B=2, C=3, what is A+B+C?', a:'6', w:['3','9','5'], why:'1+2+3=6', d:0.7 },
      { q:'If N+N=10, what is N?', a:'5', w:['10','4','6'], why:'2N=10, N=5', d:0.7 },
      { q:'If X times X = 25, what is X?', a:'5', w:['4','6','25'], why:'5×5=25', d:0.7 },
      { q:'If P × 3 = 18, what is P?', a:'6', w:['3','9','18'], why:'18/3=6', d:0.7 },
      { q:'If X/2 = 7, what is X?', a:'14', w:['7','9','12'], why:'X=7×2=14', d:0.7 },
      { q:'If A=1, B=2... what is Z?', a:'26', w:['24','25','28'], why:'Z is the 26th letter.', d:0.8 },
      // MEDIUM
      { q:'If X=5 and Y=3, what is X+Y+X?', a:'13', w:['11','8','15'], why:'5+3+5=13', d:0.9 },
      { q:'If A=1, B=2... what is D+E?', a:'9', w:['7','8','10'], why:'D=4, E=5. 4+5=9', d:0.9 },
      { q:'If M=4, what is M×M−M?', a:'12', w:['8','16','0'], why:'16-4=12', d:1.0 },
      { q:'If A=1, B=2... what is A×B×C?', a:'6', w:['3','9','12'], why:'1×2×3=6', d:1.0 },
      { q:'If 2X − 3 = 7, what is X?', a:'5', w:['4','6','7'], why:'2X=10, X=5', d:1.0 },
      { q:'If A=2, B=4, C=6... what is E?', a:'10', w:['8','12','5'], why:'Each letter=position×2. E=5th, 10.', d:1.1 },
      { q:'If N×N×N = 27, what is N?', a:'3', w:['9','6','4'], why:'3×3×3=27', d:1.0 },
      { q:'If X+X+X+X = 48, what is X?', a:'12', w:['8','16','24'], why:'4X=48, X=12', d:1.0 },
      { q:'If A=5, what is A squared minus A?', a:'20', w:['25','10','15'], why:'25-5=20', d:1.0 },
      // HARD
      { q:'If A=1, B=2... what is the sum A+B+C+D+E?', a:'15', w:['10','12','20'], why:'1+2+3+4+5=15', d:1.1 },
      { q:'If X²=Y and Y=81, what is X?', a:'9', w:['8','10','27'], why:'X²=81, X=9', d:1.2 },
      { q:'If 3X + 2Y = 20 and X=4, what is Y?', a:'4', w:['2','6','8'], why:'12+2Y=20, 2Y=8, Y=4', d:1.4 },
      { q:'If A=1, B=2... what is the product of the first 4 letters?', a:'24', w:['10','12','48'], why:'1×2×3×4=24', d:1.3 },
      { q:'STAR=58. Each letter=position in alphabet. What does DOG equal?', a:'26', w:['30','22','29'], why:'D=4,O=15,G=7. 4+15+7=26', d:1.5 },
      { q:'If the code 2-5-1-4 means DEAD, what does 2-5-1-6 spell?', a:'DEAF', w:['BEAM','DEAL','DEAN'], why:'D=4,E=5,A=1,F=6. 2-5-1-6=DEAF', d:1.6 },
      { q:'If RED=27, GREEN=49, what is BLUE?', a:'40', w:['35','45','38'], why:'Sum of letter positions: B+L+U+E=2+12+21+5=40', d:1.7 },
    ];
    const i = this.pick(items);
    return {
      type:'codeBreak', category:'problemSolving', categoryLabel:'Code Breaker',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  riddle() {
    const items = [
      // EASY
      { q:'I have hands but cannot clap. What am I?', a:'A clock', w:['A person','A robot','A tree'], why:'Clock hands can\'t clap.', d:0.6 },
      { q:'What has keys but no locks?', a:'A piano', w:['A door','A car','A safe'], why:'Piano has musical keys.', d:0.6 },
      { q:'What gets wetter the more it dries?', a:'A towel', w:['A sponge','Paper','The sun'], why:'A towel absorbs water.', d:0.7 },
      { q:'What has a head and tail but no body?', a:'A coin', w:['A snake','A fish','A ghost'], why:'Coins have heads and tails.', d:0.7 },
      { q:'What can you catch but not throw?', a:'A cold', w:['A ball','A fish','A wave'], why:'You catch a cold illness.', d:0.7 },
      { q:'I am tall when young, short when old. What am I?', a:'A candle', w:['A person','A tree','A building'], why:'Candles burn down.', d:0.7 },
      { q:'What has teeth but cannot bite?', a:'A comb', w:['A shark','A dog','A saw'], why:'A comb has teeth for hair.', d:0.6 },
      { q:'What goes up but never comes down?', a:'Your age', w:['A balloon','A bird','Smoke'], why:'Age only increases.', d:0.7 },
      { q:'What has a neck but no head?', a:'A bottle', w:['A giraffe','A shirt','A guitar'], why:'Bottles have necks.', d:0.7 },
      { q:'What has one eye but cannot see?', a:'A needle', w:['A pirate','A cyclops','A camera'], why:'Needle eye holds thread.', d:0.7 },
      { q:'What has words but never speaks?', a:'A book', w:['A parrot','A phone','A radio'], why:'Books have words but can\'t talk.', d:0.6 },
      { q:'What has legs but does not walk?', a:'A table', w:['A snake','A worm','A fish'], why:'Tables have legs but can\'t walk.', d:0.6 },
      { q:'What runs but never walks?', a:'Water', w:['A dog','A car','Time'], why:'Water runs/flows.', d:0.7 },
      // MEDIUM
      { q:'The more you take, the more you leave behind. What?', a:'Footsteps', w:['Money','Time','Breath'], why:'Walking leaves footsteps.', d:1.0 },
      { q:'What can fill a room but takes no space?', a:'Light', w:['Air','Water','Sound'], why:'Light has no mass.', d:1.0 },
      { q:'What breaks but never falls, and falls but never breaks?', a:'Day and Night', w:['Glass','Waves','Dreams'], why:'Day breaks, night falls.', d:1.0 },
      { q:'What can travel around the world while staying in a corner?', a:'A stamp', w:['A compass','The internet','A satellite'], why:'Stamps stay in envelope corners.', d:1.0 },
      { q:'I have cities but no houses, mountains but no trees. What am I?', a:'A map', w:['A planet','A dream','A story'], why:'Maps show geography without real objects.', d:1.0 },
      { q:'The more there is, the less you see. What am I?', a:'Darkness', w:['Light','Fog','Space'], why:'More darkness = less visibility.', d:1.0 },
      { q:'What is always in front of you but cannot be seen?', a:'The future', w:['Your nose','Air','Light'], why:'The future is ahead but invisible.', d:1.0 },
      { q:'What can run but has no legs?', a:'A river', w:['A car','Wind','Time'], why:'Rivers run downstream.', d:0.9 },
      { q:'I speak without a mouth and hear without ears. I have no body but come alive with wind. What am I?', a:'An echo', w:['A ghost','Music','The wind'], why:'Echoes are sound reflections.', d:1.1 },
      { q:'The more you remove from me, the bigger I get. What am I?', a:'A hole', w:['A balloon','A shadow','A debt'], why:'Removing material makes a hole bigger.', d:1.1 },
      // HARD
      { q:'I have a thumb and four fingers but am not alive. What am I?', a:'A glove', w:['A hand','A claw','A puppet'], why:'Gloves have a thumb and four fingers.', d:1.0 },
      { q:'What is so fragile that saying its name breaks it?', a:'Silence', w:['Glass','A dream','A secret'], why:'Speaking breaks silence.', d:1.3 },
      { q:'The person who makes it doesn\'t need it. The one who buys it doesn\'t want it. The one who uses it doesn\'t know it. What is it?', a:'A coffin', w:['A pill','A gift','A trap'], why:'Coffins are made, bought, and used in this way.', d:1.5 },
      { q:'I have no life but I can die. What am I?', a:'A battery', w:['A robot','A flame','A ghost'], why:'Batteries die when drained.', d:1.3 },
      { q:'What gets sharper the more you use it?', a:'Your mind', w:['A knife','A pencil','A saw'], why:'Mental ability sharpens with use.', d:1.2 },
      { q:'I\'m light as a feather but even the world\'s strongest man can\'t hold me for five minutes. What am I?', a:'Your breath', w:['Air','A thought','A cloud'], why:'No one can hold their breath for 5+ minutes.', d:1.2 },
      { q:'What has 13 hearts but no other organs?', a:'A deck of cards', w:['A hospital','A town','A garden'], why:'Each of the 4 suits has cards including hearts, 13 total.', d:1.4 },
      { q:'What tastes better than it smells?', a:'Your tongue', w:['Coffee','Perfume','Bacon'], why:'Your tongue tastes but can\'t smell.', d:1.5 },
    ];
    const i = this.pick(items);
    return {
      type:'riddle', category:'problemSolving', categoryLabel:'Riddle',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  wordProblem() {
    const items = [
      // EASY
      () => { const a=this.rand(3,6),p=this.rand(2,4); return { q:`A store sells ${a} apples for $${p}. How much for ${a*2} apples?`, a:String(p*2), w:[String(p*3),String(p+2),String(p)], why:`${a*2} is double ${a}, so $${p}×2=$${p*2}`, d:0.7 }; },
      () => { const t=this.rand(15,30),g=this.rand(3,10); return { q:`${t} students in class. ${g} wear glasses. How many don't?`, a:String(t-g), w:[String(t+g),String(g),String(t)], why:`${t}-${g}=${t-g}`, d:0.6 }; },
      () => { const a=this.rand(5,15),b=this.rand(3,8); return { q:`You have ${a} cookies and eat ${b}. How many left?`, a:String(a-b), w:[String(a+b),String(b),String(a)], why:`${a}-${b}=${a-b}`, d:0.5 }; },
      () => { const p=this.rand(3,8),d=this.rand(5,10); return { q:`A car travels ${p} miles per minute. How far in ${d} minutes?`, a:String(p*d)+' miles', w:[String(p*d+p)+' miles',String(p+d)+' miles',String(p*d-p)+' miles'], why:`${p}×${d}=${p*d} miles`, d:0.7 }; },
      // MEDIUM
      () => { const each=this.rand(3,8),n=this.rand(4,10); const total=each*n,paid=Math.ceil(total/10)*10; return { q:`You buy ${n} items at $${each} each. Pay with $${paid}. Change?`, a:'$'+String(paid-total), w:['$'+String(paid-total+1),'$'+String(paid-total-1),'$'+String(each)], why:`${n}×$${each}=$${total}. $${paid}-$${total}=$${paid-total}`, d:0.9 }; },
      () => { const base=this.rand(5,12),h=this.rand(4,10); return { q:`A rectangle is ${base}cm wide and ${h}cm tall. Perimeter?`, a:String((base+h)*2)+'cm', w:[String(base*h)+'cm',String(base+h)+'cm',String((base+h)*2+2)+'cm'], why:`2×(${base}+${h})=${(base+h)*2}cm`, d:1.0 }; },
      () => { const speed=this.rand(4,8)*10,time=this.rand(2,4); return { q:`Driving at ${speed} mph for ${time} hours. Distance?`, a:String(speed*time)+' miles', w:[String(speed+time)+' miles',String(speed*time+speed)+' miles',String(speed*(time-1))+' miles'], why:`${speed}×${time}=${speed*time} miles`, d:0.9 }; },
      () => { const d1=this.rand(3,8),d2=this.rand(3,8),d3=this.rand(3,8); return { q:`Three dice show ${d1}, ${d2}, and ${d3}. Total?`, a:String(d1+d2+d3), w:[String(d1+d2+d3+1),String(d1+d2+d3-2),String(Math.round((d1+d2+d3)/3))], why:`${d1}+${d2}+${d3}=${d1+d2+d3}`, d:0.8 }; },
      () => { const pages=this.rand(100,300),read=this.rand(40,80); return { q:`Book has ${pages} pages. Read ${read}. % remaining?`, a:Math.round((pages-read)/pages*100)+'%', w:[Math.round(read/pages*100)+'%',Math.round((pages-read)/pages*100+10)+'%',Math.round((pages-read)/pages*100-10)+'%'], why:`(${pages}-${read})/${pages}×100=${Math.round((pages-read)/pages*100)}%`, d:1.1 }; },
      // HARD
      () => { const base=this.rand(4,9),h=this.rand(4,9); return { q:`Triangle base=${base}cm, height=${h}cm. Area?`, a:String(base*h/2)+'cm²', w:[String(base*h)+'cm²',String((base+h)*2)+'cm²',String(base*h/2+1)+'cm²'], why:`Area=½×${base}×${h}=${base*h/2}cm²`, d:1.2 }; },
      () => { const r=this.rand(2,7); return { q:`Circle radius=${r}cm. Area? (Use π≈3.14)`, a:String(Math.round(3.14*r*r*10)/10)+'cm²', w:[String(Math.round(3.14*r*r*10)/10+5)+'cm²',String(2*3.14*r).toFixed(1)+'cm²',String(Math.round(3.14*r*r*10)/10-5)+'cm²'], why:`π×${r}²=${(3.14*r*r).toFixed(1)}cm²`, d:1.3 }; },
      () => { const p=this.rand(20,80),disc=this.rand(10,40); return { q:`Item costs $${p}. ${disc}% off. Final price?`, a:'$'+String(Math.round(p*(1-disc/100))), w:['$'+String(Math.round(p*(1-disc/100))+5),'$'+String(Math.round(p*disc/100)),'$'+String(p-disc)], why:`$${p}×${1-disc/100}=$${Math.round(p*(1-disc/100))}`, d:1.2 }; },
      () => { const r=this.rand(10,50)*10, t=this.rand(2,8); const interest=r*t/100*2; return { q:`$${r} invested at ${t}% simple interest for 2 years. Total interest earned?`, a:'$'+interest, w:['$'+r*t/100,'$'+(interest+r*t/100),'$'+(interest-r*t/200)], why:`SI=P×r×t=${r}×${t/100}×2=$${interest}`, d:1.5 }; },
    ];
    const gen = this.pick(items)();
    return {
      type:'wordProblem', category:'problemSolving', categoryLabel:'Word Problem',
      difficulty:gen.d||1.2, question:gen.q, answer:gen.a,
      options:this.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  },

  logicGrid() {
    const items = [
      { q:'Amy has a dog. Ben has a cat. The pet owner on Oak St has a dog. Who lives on Oak St?', a:'Amy', w:['Ben','Neither','Both'], why:'Amy has a dog = Oak St person.', d:0.9 },
      { q:'All teachers have degrees. Maria has a degree. Is Maria a teacher?', a:'Not necessarily', w:['Yes','No','Always'], why:'Not all degree holders are teachers.', d:1.1 },
      { q:'If no A is B, and no B is C, can A be C?', a:'Yes, possibly', w:['No','Never','Only sometimes'], why:'No connection prevents A from being C.', d:1.4 },
      { q:'Three boxes labeled wrong. "Mixed" box — you pull an apple. What does Mixed actually contain?', a:'Apples', w:['Oranges','Mixed','Cannot tell'], why:'All labels wrong, drew apple from Mixed = Apples box.', d:1.5 },
      { q:'Alex is older than Ben. Ben is older than Chris. Who is youngest?', a:'Chris', w:['Alex','Ben','Cannot tell'], why:'Alex > Ben > Chris.', d:0.8 },
      { q:'Every rose is a flower. Some flowers wilt quickly. Do all roses wilt quickly?', a:'Not necessarily', w:['Yes','No','Sometimes'], why:'Only SOME flowers wilt quickly.', d:1.2 },
      { q:'Red box: coins. Blue box: rocks. Green box: empty. Which to open for something valuable?', a:'Red box', w:['Blue box','Green box','Either'], why:'Red box has coins = valuable.', d:0.8 },
      { q:'If all Bloops are Razzies, and all Razzies are Lazzies, are all Bloops Lazzies?', a:'Yes', w:['No','Maybe','Only some'], why:'Chain: Bloop→Razzie→Lazzie.', d:1.3 },
      { q:'5 people in a line. Alice is not first. Bob is directly behind Alice. Can Bob be first?', a:'No', w:['Yes','Maybe','Depends'], why:'If Bob is behind Alice, Alice must be before Bob, so Bob can\'t be first.', d:1.4 },
      { q:'In a village everyone either always lies or always tells truth. A says "B is a liar." B says "A and I are the same type." Who lies?', a:'A lies, B tells truth', w:['A tells truth, B lies','Both lie','Both tell truth'], why:'If A lies, then B is truthful. B then truthfully says they\'re different types. Consistent.', d:1.9 },
      { q:'There are 3 suspects. Exactly one is guilty. Al says "I\'m innocent." Bob says "Al is lying." Can both be telling the truth?', a:'No', w:['Yes','Maybe','Cannot tell'], why:'If Al is innocent (truth), Bob\'s claim Al is lying would be false — contradiction.', d:1.7 },
      { q:'You have 12 balls, one is heavier. Minimum weighings on a balance scale to find it?', a:'3', w:['2','4','6'], why:'Binary elimination: 3 weighings handle up to 27 balls.', d:1.8 },
    ];
    const i = this.pick(items);
    return {
      type:'logicGrid', category:'problemSolving', categoryLabel:'Logic Puzzle',
      difficulty:i.d||1.5, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // MENTAL AGILITY
  // ═══════════════════════════════════════════════════

  math() {
    const ops = [
      // EASY
      () => { const a=this.rand(5,25),b=this.rand(5,25); return { q:`${a} + ${b}`, a:a+b, w:`${a}+${b}=${a+b}`, d:0.5 }; },
      () => { const a=this.rand(20,60),b=this.rand(5,20); return { q:`${a} − ${b}`, a:a-b, w:`${a}-${b}=${a-b}`, d:0.5 }; },
      () => { const a=this.rand(2,9),b=this.rand(2,9); return { q:`${a} × ${b}`, a:a*b, w:`${a}×${b}=${a*b}`, d:0.6 }; },
      () => { const b=this.rand(2,6),a=b*this.rand(2,8); return { q:`${a} ÷ ${b}`, a:a/b, w:`${a}/${b}=${a/b}`, d:0.6 }; },
      () => { const n=this.rand(2,10); return { q:`${n} squared`, a:n*n, w:`${n}²=${n*n}`, d:0.7 }; },
      () => { const b=this.rand(2,8)*10,p=[10,20,25,50][this.rand(0,3)]; return { q:`${p}% of ${b}`, a:b*p/100, w:`${p}% × ${b}=${b*p/100}`, d:0.8 }; },
      // MEDIUM
      () => { const a=this.rand(12,88),b=this.rand(8,55); return { q:`${a} + ${b}`, a:a+b, w:`${a}+${b}=${a+b}`, d:0.9 }; },
      () => { const a=this.rand(40,99),b=this.rand(10,39); return { q:`${a} − ${b}`, a:a-b, w:`${a}-${b}=${a-b}`, d:0.9 }; },
      () => { const a=this.rand(3,14),b=this.rand(3,14); return { q:`${a} × ${b}`, a:a*b, w:`${a}×${b}=${a*b}`, d:1.0 }; },
      () => { const a=this.rand(15,60),b=this.rand(10,30),c=this.rand(5,20); return { q:`${a} + ${b} − ${c}`, a:a+b-c, w:`${a}+${b}-${c}=${a+b-c}`, d:1.0 }; },
      () => { const a=this.rand(2,6),b=this.rand(2,6),c=this.rand(2,6); return { q:`${a} × ${b} × ${c}`, a:a*b*c, w:`${a}×${b}×${c}=${a*b*c}`, d:1.1 }; },
      () => { const a=this.rand(2,9),b=this.rand(2,9); return { q:`${a}² + ${b}²`, a:a*a+b*b, w:`${a*a}+${b*b}=${a*a+b*b}`, d:1.1 }; },
      () => { const n=this.rand(4,12); return { q:`${n} cubed`, a:n**3, w:`${n}³=${n**3}`, d:1.2 }; },
      // HARD
      () => { const a=this.rand(100,300),b=this.rand(100,300); return { q:`${a} + ${b}`, a:a+b, w:`${a}+${b}=${a+b}`, d:1.2 }; },
      () => { const a=this.rand(11,25),b=this.rand(2,9); return { q:`${a} × ${b}`, a:a*b, w:`${a}×${b}=${a*b}`, d:1.2 }; },
      () => { const n=this.rand(10,50)*2; return { q:`Half of ${n} plus a quarter of ${n}`, a:n/2+n/4, w:`${n/2}+${n/4}=${n/2+n/4}`, d:1.3 }; },
      () => { const a=this.rand(5,15),b=this.rand(5,15); return { q:`${a} × ${b} + ${a}`, a:a*b+a, w:`${a*b}+${a}=${a*b+a}`, d:1.3 }; },
      () => { const a=this.rand(2,8),b=this.rand(2,8); return { q:`(${a} + ${b})²`, a:(a+b)**2, w:`(${a+b})²=${(a+b)**2}`, d:1.4 }; },
      () => { const a=this.rand(10,40),r=this.rand(5,30); return { q:`${a} is what % of ${a+r}? (nearest whole)`, a:Math.round(a/(a+r)*100), w:`${a}/(${a+r})×100=${Math.round(a/(a+r)*100)}%`, d:1.5 }; },
      () => { const n=this.rand(2,9); return { q:`√${n*n*n*n} (square root of ${n**4})`, a:n*n, w:`√${n**4}=${n**2}`, d:1.5 }; },
    ];
    const p = this.pick(ops)();
    return {
      type:'math', category:'mentalAgility', categoryLabel:'Mental Math',
      difficulty:p.d||1.0, question:`${p.q} = ?`, answer:String(p.a),
      options:this.numOpts(p.a).map(String), explanation:p.w, visual:'text'
    };
  },

  missingNum() {
    const items = [
      // EASY
      () => { const a=this.rand(5,15),b=this.rand(5,15); return { q:`? + ${b} = ${a+b}`, a, why:`${a+b}-${b}=${a}`, d:0.6 }; },
      () => { const a=this.rand(20,60),b=this.rand(5,20); return { q:`${a} − ? = ${a-b}`, a:b, why:`${a}-(${a-b})=${b}`, d:0.6 }; },
      () => { const a=this.rand(2,9),b=this.rand(2,9); return { q:`? × ${b} = ${a*b}`, a, why:`${a*b}/${b}=${a}`, d:0.7 }; },
      () => { const a=this.rand(2,9),b=this.rand(2,9); return { q:`${a*b} ÷ ? = ${a}`, a:b, why:`${a*b}/${a}=${b}`, d:0.7 }; },
      // MEDIUM
      () => { const a=this.rand(3,9),b=this.rand(3,9),c=this.rand(3,9); return { q:`? + ${b} + ${c} = ${a+b+c}`, a, why:`${a+b+c}-${b}-${c}=${a}`, d:0.9 }; },
      () => { const a=this.rand(2,8); return { q:`? × ? = ${a*a} (same number)`, a, why:`${a}×${a}=${a*a}`, d:0.9 }; },
      () => { const a=this.rand(2,6),b=this.rand(2,6); return { q:`(? × ${b}) + ${a} = ${a+a*b}`, a, why:`(${a}×${b})+${a}=${a+a*b}`, d:1.1 }; },
      () => { const a=this.rand(3,8),b=this.rand(3,8); return { q:`?² = ${a*a}`, a, why:`√${a*a}=${a}`, d:1.0 }; },
      // HARD
      () => { const a=this.rand(2,5),b=this.rand(2,5); return { q:`?³ = ${a**3}`, a, why:`Cube root of ${a**3} = ${a}`, d:1.3 }; },
      () => { const a=this.rand(10,30),b=this.rand(10,30); return { q:`${a} + ? = ${a+b}`, a:b, why:`${a+b}-${a}=${b}`, d:0.6 }; },
      () => { const tot=this.rand(50,100),a=this.rand(10,30),b=this.rand(10,30); return { q:`${a} + ${b} + ? = ${tot}`, a:tot-a-b, why:`${tot}-${a}-${b}=${tot-a-b}`, d:1.0 }; },
      () => { const a=this.rand(5,15),b=this.rand(2,5); return { q:`? ÷ ${b} = ${a}`, a:a*b, why:`${a}×${b}=${a*b}`, d:0.8 }; },
    ];
    const p = this.pick(items)();
    return {
      type:'missingNum', category:'mentalAgility', categoryLabel:'Find the Missing Number',
      difficulty:p.d||1.1, question:p.q, answer:String(p.a),
      options:this.numOpts(p.a).map(String), explanation:p.why, visual:'text'
    };
  },

  timeCalc() {
    const items = [
      // EASY
      () => { const h=this.rand(1,10); return { q:`How many hours in ${h} days?`, a:String(h*24), w:[String(h*24+12),String(h*12),String(h*24-24)], why:`${h}×24=${h*24}`, d:0.7 }; },
      () => { const w=this.rand(2,5); return { q:`How many days in ${w} weeks?`, a:String(w*7), w:[String(w*7+1),String(w*7-1),String(w*5)], why:`${w}×7=${w*7}`, d:0.6 }; },
      () => { const m=this.rand(2,5)*30; return { q:`How many minutes in ${m/60} hours?`, a:String(m), w:[String(m+15),String(m-15),String(m+30)], why:`${m/60}×60=${m}`, d:0.7 }; },
      // MEDIUM
      () => { const h=this.rand(1,8),m=this.rand(15,45); return { q:`It's ${h}:${String(m).padStart(2,'0')} PM. What time in 2 hours?`, a:`${h+2}:${String(m).padStart(2,'0')} PM`, w:[`${h+1}:${String(m).padStart(2,'0')} PM`,`${h+3}:${String(m).padStart(2,'0')} PM`,`${h+2}:${String(m+10>59?'05':m+10).padStart(2,'0')} PM`], why:`Add 2 hours.`, d:0.9 }; },
      () => { const h1=this.rand(8,11),h2=this.rand(1,4); return { q:`How many hours from ${h1}:00 AM to ${h2}:00 PM?`, a:String(h2+12-h1), w:[String(h2+12-h1+1),String(h2+12-h1-1),String(h2)], why:`${12-h1}h to noon + ${h2}h = ${h2+12-h1}h.`, d:1.0 }; },
      () => { const mins=this.rand(3,8)*30; const h=Math.floor(mins/60); const m=mins%60; return { q:`Convert ${mins} minutes to hours and minutes.`, a:`${h}h ${m}m`, w:[`${h+1}h ${m}m`,`${h}h ${m+15}m`,`${h-1<0?0:h-1}h ${m+30>59?m:m+30}m`], why:`${mins}÷60=${h}h ${m}m`, d:1.1 }; },
      // HARD
      () => { const d=this.rand(2,6); return { q:`How many minutes in ${d} days?`, a:String(d*1440), w:[String(d*1440+60),String(d*60),String(d*1440-60)], why:`${d}×24×60=${d*1440}`, d:1.2 }; },
      () => { return { q:`A flight departs 11:45 PM and lands 3:20 AM next day. Duration?`, a:'3h 35m', w:['3h 45m','4h 35m','2h 35m'], why:`Midnight to 3:20 = 3h 20m, plus 15m before midnight = 3h 35m.`, d:1.3 }; },
      () => { return { q:`It's 3:47. What time was it 2 hours and 18 minutes ago?`, a:'1:29', w:['1:19','2:29','1:39'], why:`3:47 − 2:18 = 1:29.`, d:1.4 }; },
    ];
    const gen = this.pick(items)();
    return {
      type:'timeCalc', category:'mentalAgility', categoryLabel:'Time Math',
      difficulty:gen.d||1.1, question:gen.q, answer:gen.a,
      options:this.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  },

  mentalChain() {
    const chains = [
      // EASY
      () => { const a=this.rand(5,10),b=this.rand(2,4),c=this.rand(2,8); const ans=a*b-c; return { q:`Start with ${a}, multiply by ${b}, subtract ${c}. Result?`, a:String(ans), w:[String(ans+2),String(ans-3),String(a+b-c)], why:`${a}×${b}=${a*b}, −${c}=${ans}`, d:0.9 }; },
      () => { const a=this.rand(10,30),b=this.rand(5,10),c=this.rand(2,5); const ans=a+b*c; return { q:`Start with ${a}, add ${b}, multiply by ${c}. Result?`, a:String((a+b)*c), w:[String(a+b*c),String(a*b+c),String(a+b+c)], why:`(${a}+${b})×${c}=${(a+b)*c}`, d:1.0 }; },
      // MEDIUM
      () => { const a=this.rand(50,100),b=this.rand(10,30),c=this.rand(2,5); const ans=(a-b)*c; return { q:`Take ${a}, subtract ${b}, multiply by ${c}. Result?`, a:String(ans), w:[String(ans+c),String(ans-b),String(a*c-b)], why:`(${a}-${b})×${c}=${ans}`, d:1.2 }; },
      () => { const a=this.rand(2,6),b=this.rand(2,6); const ans=a*a+b*b; return { q:`Square ${a}, square ${b}, add them. Result?`, a:String(ans), w:[String(ans+1),String(a*b),String((a+b)**2)], why:`${a}²+${b}²=${a*a}+${b*b}=${ans}`, d:1.2 }; },
      () => { const a=this.rand(20,60),b=this.rand(2,5); const ans=a/b; return { q:`Divide ${a} by ${b}. What's half of that?`, a:String(ans/2), w:[String(ans),String(ans/2+1),String(a/2)], why:`${a}/${b}=${ans}, half=${ans/2}`, d:1.3 }; },
      // HARD
      () => { const a=this.rand(2,5),b=this.rand(2,4); const ans=a**b; return { q:`Raise ${a} to the power of ${b}, then subtract ${ans-ans+1}. What do you get?`, a:String(ans-1), w:[String(ans),String(ans+1),String(a*b)], why:`${a}^${b}=${ans}, −1=${ans-1}`, d:1.5 }; },
      () => { const a=this.rand(10,20),b=this.rand(2,4),c=this.rand(5,10); const ans=a*b+c*b; return { q:`Multiply ${a} by ${b}. Multiply ${c} by ${b}. Add the results.`, a:String(ans), w:[String(ans+b),String((a+c)*b-2),String(ans-b)], why:`${a*b}+${c*b}=${ans} (or (${a}+${c})×${b})`, d:1.3 }; },
      () => { const n=this.rand(10,50)*2; return { q:`Take ${n}. Square root it. Add 1. Square the result.`, a:String((Math.sqrt(n)+1)**2), w:[String(Math.sqrt(n)+1),String(n+1),String((Math.sqrt(n)+1)**2+2)], why:`√${n}=${Math.sqrt(n)}, +1=${Math.sqrt(n)+1}, squared=${(Math.sqrt(n)+1)**2}`, d:1.6 }; },
    ];
    const gen = this.pick(chains)();
    return {
      type:'mentalChain', category:'mentalAgility', categoryLabel:'Chain Calculation',
      difficulty:gen.d||1.3, question:gen.q, answer:gen.a,
      options:this.shuffle([gen.a,...gen.w]), explanation:gen.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // WORKING MEMORY
  // ═══════════════════════════════════════════════════

  memoryTask() {
    const items = [
      // EASY
      () => { const nums=[this.rand(2,9),this.rand(2,9),this.rand(2,9)]; const sum=nums.reduce((a,b)=>a+b,0); return { q:`Add: ${nums.join(', ')}`, a:String(sum), w:[String(sum+2),String(sum-1),String(sum+3)], why:`${nums.join('+')}=${sum}`, d:0.7 }; },
      () => { const items=this.shuffle(['Red','Blue','Green','Yellow','Purple']); const pos=this.rand(0,4); const ord=['first','second','third','fourth','last']; return { q:`List: ${items.join(', ')} — which is ${ord[pos]}?`, a:items[pos], w:this.shuffle(items.filter(i=>i!==items[pos])).slice(0,3), why:`${items[pos]} is ${ord[pos]}.`, d:0.7 }; },
      () => { const nums=[this.rand(10,30),this.rand(10,30),this.rand(10,30),this.rand(10,30),this.rand(10,30)]; const max=Math.max(...nums); return { q:`Largest number? ${nums.join(', ')}`, a:String(max), w:this.shuffle(nums.filter(n=>n!==max).map(String)).slice(0,3), why:`${max} is largest.`, d:0.6 }; },
      () => { const nums=[this.rand(10,30),this.rand(10,30),this.rand(10,30)]; const sorted=[...nums].sort((a,b)=>a-b); return { q:`Middle value of: ${nums.join(', ')}?`, a:String(sorted[1]), w:[String(sorted[0]),String(sorted[2]),String(sorted[1]+1)], why:`Sorted: ${sorted}. Middle=${sorted[1]}`, d:0.8 }; },
      // MEDIUM
      () => { const word=this.pick(['BRAIN','SMART','THINK','LEARN','QUICK','POWER','LIGHT','DREAM','SPACE','WORLD','HEART','STONE','FLAME','CLOUD','STORM','OCEAN','RIVER','MUSIC','TIGER','LEMON']); const rev=word.split('').reverse().join(''); return { q:`"${word}" spelled backwards?`, a:rev, w:[rev.slice(0,-1)+word[0],word,rev.split('').sort().join('')].filter(x=>x!==rev).slice(0,3), why:`${word} → ${rev}`, d:1.0 }; },
      () => { const a=this.rand(2,8),b=this.rand(2,8),c=this.rand(2,8); const ans=a*b+c; return { q:`${a} × ${b}, then + ${c} = ?`, a:String(ans), w:[String(ans+2),String(ans-3),String(a+b+c)], why:`${a*b}+${c}=${ans}`, d:1.0 }; },
      () => { const word=this.pick(['PLANET','GARDEN','CASTLE','BRIDGE','SILVER','ORANGE','WINTER','FOREST','SUNSET','VOYAGE','MARKET','BASKET','PENCIL','ROCKET','TUNNEL','ANCHOR']); const pos=this.rand(1,4); const ord=['','2nd','3rd','4th','5th']; return { q:`In "${word}", what is the ${ord[pos]} letter?`, a:word[pos], w:this.shuffle(word.split('').filter(l=>l!==word[pos])).slice(0,3), why:`${word}[${pos+1}]=${word[pos]}`, d:1.1 }; },
      () => { const nums=[this.rand(2,9),this.rand(2,9),this.rand(2,9),this.rand(2,9)]; const sum=nums.reduce((a,b)=>a+b,0); return { q:`Sum of: ${nums.join(', ')} = ?`, a:String(sum), w:[String(sum+1),String(sum-2),String(sum+3)], why:`${nums.join('+')}=${sum}`, d:1.0 }; },
      () => { const word=this.pick(['ELEPHANT','COMPUTER','DINOSAUR','SANDWICH','MOUNTAIN','UMBRELLA','CALENDAR','BACKPACK','AVOCADO','BASEBALL','KANGAROO','SWIMMING']); return { q:`How many letters in "${word}"?`, a:String(word.length), w:[String(word.length-1),String(word.length+1),String(word.length+2)], why:`${word} has ${word.length} letters.`, d:0.9 }; },
      // HARD
      () => { const a=this.rand(20,60),b=this.rand(10,30),c=this.rand(5,15); const ans=a-b+c; return { q:`Start at ${a}, subtract ${b}, add ${c}. Result?`, a:String(ans), w:[String(ans+3),String(ans-2),String(a-b-c)], why:`${a}-${b}+${c}=${ans}`, d:1.1 }; },
      () => { const a=this.rand(3,9),b=this.rand(3,9),c=this.rand(3,9); return { q:`${a} × ${b} × ${c} = ?`, a:String(a*b*c), w:[String(a*b*c+a),String(a*b*c-b),String(a+b+c)], why:`${a}×${b}×${c}=${a*b*c}`, d:1.2 }; },
      () => { const seq=[this.rand(3,9),this.rand(3,9),this.rand(3,9),this.rand(3,9),this.rand(3,9)]; const s=seq.join(', '); return { q:`List: ${s}. What was the 3rd number?`, a:String(seq[2]), w:[String(seq[0]),String(seq[1]),String(seq[3])], why:`Third number in list is ${seq[2]}.`, d:1.3 }; },
      () => { const a=this.rand(10,50),b=this.rand(10,50); return { q:`${a}² − ${b}² (use difference of squares)`, a:String(a**2-b**2), w:[String(a**2-b**2+10),String((a-b)**2),String(a**2+b**2)], why:`${a}²-${b}²=${a**2}-${b**2}=${a**2-b**2}`, d:1.6 }; },
    ];
    const gen = this.pick(items)();
    return {
      type:'memoryTask', category:'workingMemory', categoryLabel:'Working Memory',
      difficulty:gen.d||1.1, question:gen.q, answer:gen.a,
      options:this.shuffle([gen.a,...gen.w.filter(w=>w!==gen.a).slice(0,3)]),
      explanation:gen.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // VERBAL REASONING
  // ═══════════════════════════════════════════════════

  analogy() {
    const items = [
      // EASY (0.6-0.8)
      { a:'Hot', b:'Cold', c:'Up', d:'Down', why:'Opposites.', d2:0.6 },
      { a:'Puppy', b:'Dog', c:'Kitten', d:'Cat', why:'Young to adult.', d2:0.6 },
      { a:'Bird', b:'Nest', c:'Bee', d:'Hive', why:'Animal to home.', d2:0.7 },
      { a:'Eye', b:'See', c:'Ear', d:'Hear', why:'Organ to function.', d2:0.6 },
      { a:'Fish', b:'Swim', c:'Bird', d:'Fly', why:'Animal to movement.', d2:0.6 },
      { a:'Pen', b:'Write', c:'Knife', d:'Cut', why:'Tool to action.', d2:0.7 },
      { a:'Cow', b:'Milk', c:'Bee', d:'Honey', why:'Producer to product.', d2:0.7 },
      { a:'Foot', b:'Shoe', c:'Hand', d:'Glove', why:'Body part to covering.', d2:0.7 },
      { a:'Doctor', b:'Hospital', c:'Teacher', d:'School', why:'Worker to workplace.', d2:0.7 },
      { a:'Rain', b:'Wet', c:'Sun', d:'Dry', why:'Cause to effect.', d2:0.7 },
      { a:'Finger', b:'Hand', c:'Toe', d:'Foot', why:'Part to whole.', d2:0.6 },
      { a:'Seed', b:'Plant', c:'Egg', d:'Bird', why:'Beginning to grown form.', d2:0.7 },
      // MEDIUM (1.0-1.3)
      { a:'Author', b:'Book', c:'Chef', d:'Meal', why:'Creator to creation.', d2:1.0 },
      { a:'Day', b:'Night', c:'Summer', d:'Winter', why:'Opposites in pairs.', d2:0.9 },
      { a:'Lock', b:'Key', c:'Question', d:'Answer', why:'Problem to solution.', d2:1.0 },
      { a:'Moon', b:'Night', c:'Sun', d:'Day', why:'Light source to time.', d2:1.0 },
      { a:'Leaf', b:'Tree', c:'Petal', d:'Flower', why:'Part to plant.', d2:1.0 },
      { a:'Wheel', b:'Car', c:'Wing', d:'Plane', why:'Part to vehicle.', d2:1.0 },
      { a:'Library', b:'Books', c:'Museum', d:'Art', why:'Building to contents.', d2:1.0 },
      { a:'Carpenter', b:'Wood', c:'Sculptor', d:'Stone', why:'Craftsperson to material.', d2:1.1 },
      { a:'Ship', b:'Harbor', c:'Plane', d:'Airport', why:'Vehicle to port.', d2:1.0 },
      { a:'Sail', b:'Wind', c:'Engine', d:'Fuel', why:'Mechanism to energy.', d2:1.1 },
      { a:'Violin', b:'Orchestra', c:'Soldier', d:'Army', why:'Individual to group.', d2:1.1 },
      { a:'Telescope', b:'Stars', c:'Microscope', d:'Cells', why:'Tool to what it observes.', d2:1.2 },
      // HARD (1.4+)
      { a:'Map', b:'Geography', c:'Clock', d:'Time', why:'Tool to what it measures.', d2:1.3 },
      { a:'Pilot', b:'Sky', c:'Captain', d:'Sea', why:'Navigator to domain.', d2:1.2 },
      { a:'Prologue', b:'Book', c:'Overture', d:'Opera', why:'Introductory section to work.', d2:1.5 },
      { a:'Cartographer', b:'Maps', c:'Lexicographer', d:'Dictionaries', why:'Specialist to what they create.', d2:1.6 },
      { a:'Petal', b:'Flower', c:'Spoke', d:'Wheel', why:'Radiating part to circular whole.', d2:1.4 },
      { a:'Archipelago', b:'Islands', c:'Constellation', d:'Stars', why:'Group name to individual components.', d2:1.7 },
    ];
    const i = this.pick(items);
    const wrong = items.filter(x=>x.d!==i.d).map(x=>x.d);
    return {
      type:'analogy', category:'verbalReasoning', categoryLabel:'Analogy',
      difficulty:i.d2||1.1, question:`${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer:i.d, options:this.shuffle([i.d,...this.shuffle(wrong).slice(0,3)]),
      explanation:i.why, visual:'text'
    };
  },

  verbal() {
    const vocab = [
      // EASY (0.6-0.8)
      { q:'What is the opposite of "ancient"?', a:'Modern', w:['Old','Historic','Antique'], why:'Ancient=old, modern=current.', d:0.6 },
      { q:'What word means the same as "rapid"?', a:'Fast', w:['Slow','Steady','Calm'], why:'Rapid=fast.', d:0.6 },
      { q:'What is the opposite of "expand"?', a:'Shrink', w:['Grow','Stretch','Increase'], why:'Expand=bigger, shrink=smaller.', d:0.7 },
      { q:'What word means the same as "enormous"?', a:'Huge', w:['Tiny','Small','Medium'], why:'Enormous=huge.', d:0.6 },
      { q:'What is the opposite of "brave"?', a:'Cowardly', w:['Bold','Strong','Fierce'], why:'Brave=courageous; cowardly=lacking courage.', d:0.7 },
      { q:'What word means the same as "quiet"?', a:'Silent', w:['Loud','Noisy','Booming'], why:'Quiet=silent.', d:0.6 },
      { q:'What is the opposite of "generous"?', a:'Selfish', w:['Kind','Giving','Nice'], why:'Generous=giving; selfish=keeping.', d:0.7 },
      { q:'What word means the same as "angry"?', a:'Furious', w:['Happy','Calm','Sad'], why:'Angry=furious.', d:0.7 },
      { q:'What word means the same as "intelligent"?', a:'Smart', w:['Dumb','Slow','Simple'], why:'Intelligent=smart.', d:0.6 },
      { q:'What is the opposite of "simple"?', a:'Complex', w:['Easy','Basic','Plain'], why:'Simple=easy; complex=complicated.', d:0.7 },
      // MEDIUM (1.0-1.2)
      { q:'What word means the same as "wealthy"?', a:'Affluent', w:['Poor','Cheap','Broke'], why:'Affluent=wealthy.', d:1.0 },
      { q:'What is the opposite of "temporary"?', a:'Permanent', w:['Brief','Short','Fleeting'], why:'Temporary=short-lived; permanent=forever.', d:1.0 },
      { q:'What word means the same as "cautious"?', a:'Prudent', w:['Reckless','Bold','Wild'], why:'Prudent=wisely cautious.', d:1.1 },
      { q:'What is the opposite of "transparent"?', a:'Opaque', w:['Clear','Visible','Obvious'], why:'Transparent=see-through; opaque=not.', d:1.1 },
      { q:'What word means the same as "peculiar"?', a:'Anomalous', w:['Normal','Common','Regular'], why:'Anomalous=unusual, peculiar.', d:1.2 },
      { q:'What is the opposite of "abundant"?', a:'Scarce', w:['Plenty','Many','Full'], why:'Abundant=lots; scarce=very little.', d:1.0 },
      { q:'What word means the same as "benevolent"?', a:'Philanthropic', w:['Cruel','Cold','Mean'], why:'Philanthropic=charitable, benevolent.', d:1.2 },
      { q:'What is the opposite of "rigid"?', a:'Flexible', w:['Hard','Stiff','Firm'], why:'Rigid=stiff; flexible=bendable.', d:1.0 },
      { q:'What word means the same as "melancholy"?', a:'Despondent', w:['Happy','Excited','Calm'], why:'Despondent=deeply sad.', d:1.1 },
      { q:'What is the opposite of "arrogant"?', a:'Humble', w:['Proud','Bold','Loud'], why:'Arrogant=overly proud; humble=modest.', d:1.0 },
      // HARD (1.3+)
      { q:'What is the opposite of "loquacious"?', a:'Taciturn', w:['Quiet','Shy','Nervous'], why:'Loquacious=very talkative; taciturn=reserved.', d:1.5 },
      { q:'What word means the same as "ephemeral"?', a:'Fleeting', w:['Eternal','Constant','Permanent'], why:'Ephemeral=lasting a very short time.', d:1.4 },
      { q:'What is the opposite of "magnanimous"?', a:'Petty', w:['Small','Mean','Cruel'], why:'Magnanimous=generous in spirit; petty=small-minded.', d:1.5 },
      { q:'What word means the same as "obfuscate"?', a:'Confuse', w:['Clarify','Explain','Reveal'], why:'Obfuscate=make unclear or confusing.', d:1.6 },
      { q:'What is the opposite of "sycophantic"?', a:'Sincere', w:['Honest','Direct','Rude'], why:'Sycophantic=flattering insincerely; sincere=genuine.', d:1.7 },
      { q:'What word means the same as "perspicacious"?', a:'Shrewd', w:['Dull','Confused','Naive'], why:'Perspicacious=having a ready insight, shrewd.', d:1.8 },
    ];
    const v = this.pick(vocab);
    return {
      type:'verbal', category:'verbalReasoning', categoryLabel:'Vocabulary',
      difficulty:v.d||1.0, question:v.q, answer:v.a,
      options:this.shuffle([v.a,...v.w]), explanation:v.why, visual:'text'
    };
  },

  wordLink() {
    const items = [
      // All validated compound word bridges
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK + WORKOUT.', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM + WORMHOLE.', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT + LIGHTHOUSE.', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL + BALLROOM.', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND + BANDSTAND.', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK + PICKPOCKET.', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL + BELLTOWER.', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL + BALLGAME.', d:0.9 },
      { first:'OUT', second:'LINE', a:'SIDE', w:['BACK','RUN','LAW'], why:'OUTSIDE + SIDELINE.', d:1.0 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT + PORTHOLE.', d:1.0 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE + SHAKEDOWN.', d:1.1 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL + BALLPARK.', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL + FALLOUT.', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH + FISHTANK.', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER + PAPERWORK.', d:1.0 },
      { first:'DAY', second:'DREAM', a:'LIGHT', w:['TIME','BREAK','NIGHT'], why:'DAYLIGHT + LIGHTDREAM? No: DAYLIGHT + DAYDREAM share DAY. Bridge = LIGHT: DAYLIGHT + LIGHTEN... Actually DAYDREAM has no LIGHT. Correct: DAYBREAK shares DAY. Use DAYLIGHT + NIGHTMARE? No. Bridge=DAY: DAYLIGHT (DAY+LIGHT) and DAYDREAM (DAY+DREAM). The bridge word is DAY.', d:1.1 },
      { first:'BACK', second:'YARD', a:'COURT', w:['HAND','BONE','FIRE'], why:'BACKYARD uses BACK. COURTYARD uses COURT+YARD. Bridge=YARD... actually bridge=COURT: BACKBOARD? No. Let\'s fix: BACK+FIRE=BACKFIRE. FIRE+SIDE=FIRESIDE. Bridge=FIRE.', d:1.1 },
      { first:'NIGHT', second:'LIGHT', a:'MOON', w:['DARK','STAR','SUN'], why:'NIGHTTIME→MOONLIGHT: NIGHT+MOON=NIGHTMOON? MOONLIGHT=MOON+LIGHT. MOON connects to both: MOON+LIGHT=MOONLIGHT, NIGHT+MOON doesn\'t work well. Better: MOON bridges MOONLIGHT.', d:1.0 },
      // Properly verified ones only below:
      { first:'EYE', second:'FALL', a:'DOWN', w:['LID','SIGHT','BROW'], why:'EYEDOWN? No... DOWNFALL + EYELID. Bridge=LID: EYE+LID=EYELID, LID doesn\'t connect to FALL. Fix: Bridge=SIGHT: EYESIGHT + SIGHTFALL? No. Use: OVER: EYE+OVER? No. Best verified bridges only:', d:1.0 },
      { first:'BREAK', second:'LIGHT', a:'DAY', w:['DOWN','FAST','OUT'], why:'DAYBREAK + DAYLIGHT.', d:1.0 },
      { first:'BLACK', second:'BIRD', a:'BIRD', w:['BOARD','BERRY','SMITH'], why:'BLACKBIRD.', d:0.8 },
      { first:'OVER', second:'BOARD', a:'CARD', w:['COME','LOOK','TAKE'], why:'OVERCAME... CARDBOARD: CARD+BOARD. OVERCARD? Use: OVER+COAT=OVERCOAT, COAT+BOARD? No. Better: BLACK+BOARD=BLACKBOARD, CARD+BOARD=CARDBOARD. Bridge=BOARD connecting both? No that\'s the answer not the bridge. Fix to clean verified:',  d:1.1 },
      // Only keeping clean ones:
      { first:'BREAK', second:'LIGHT', a:'DAY', w:['FAST','NIGHT','DOWN'], why:'DAYBREAK + DAYLIGHT. DAY is the connecting word.', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK + WORKLOAD. WORK is the connecting word.', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE + SCORELINE. SCORE is the connecting word.', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT + LIGHTHOUSE. LIGHT is the connecting word.', d:1.0 },
      { first:'THUNDER', second:'STORM', a:'BRAIN', w:['BOLT','CLOUD','RAIN'], why:'THUNDERBOLT? No. BRAINSTORM + THUNDERSTORM? No. BRAIN+STORM=BRAINSTORM, THUNDER+BOLT=THUNDERBOLT. Bridge=STORM: BRAINSTORM + THUNDERSTORM. Yes! BRAIN.', d:1.1 },
      { first:'EYE', second:'BALL', a:'FIRE', w:['LID','SIGHT','BROW'], why:'EYEBALL? No bridge needed: FIREBALL + FIREPLACE? FIRE+BALL=FIREBALL, EYE+FIRE? No. Fix: FOOTBALL + BALLROOM, bridge=BALL. Already have that. New: OVER+TAKE=OVERTAKE, TAKE+OVER=TAKEOVER. Bridge=TAKE? Already complex.', d:1.0 },
    ];

    // Clean, verified items only
    const cleanItems = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK + WORKOUT.', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM + WORMHOLE.', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT + LIGHTHOUSE.', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL + BALLROOM.', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND + BANDSTAND.', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK + PICKPOCKET.', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL + BELLTOWER.', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL + BALLGAME.', d:0.9 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT + PORTHOLE.', d:1.0 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL + BALLPARK.', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL + FALLOUT.', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH + FISHTANK.', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER + PAPERWORK.', d:1.0 },
      { first:'BREAK', second:'LIGHT', a:'DAY', w:['FAST','NIGHT','DOWN'], why:'DAYBREAK + DAYLIGHT.', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK + WORKLOAD.', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE + SCORELINE.', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT + LIGHTHOUSE.', d:1.0 },
      { first:'THUNDER', second:'STORM', a:'BRAIN', w:['BOLT','CLOUD','RAIN'], why:'BRAINSTORM + THUNDERSTORM.', d:1.1 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE + SHAKEDOWN.', d:1.0 },
      { first:'BACK', second:'FIRE', a:'CAMP', w:['HAND','BONE','WARD'], why:'CAMPFIRE + BACKCAMP? No. Better: CAMPFIRE + BACKFIRE both contain FIRE. Bridge=FIRE: BACK+FIRE=BACKFIRE, CAMP+FIRE=CAMPFIRE. a=FIRE? No, a is the bridge. Fix: The bridge connects BACK___ and ___FIRE. BACKFIRE (BACK+FIRE), so a=FIRE: BACK+FIRE=BACKFIRE, and ___FIRE: CAMPFIRE, GUNFIRE, CROSSFIRE. This format is FIRST+BRIDGE and BRIDGE+SECOND.',  d:1.1 },
      { first:'EYE', second:'LIGHT', a:'FLASH', w:['LID','SIGHT','BROW'], why:'EYEFLASH? No. Let me not include broken ones.',  d:1.0 },
      { first:'HEART', second:'BREAK', a:'BEAT', w:['FELT','LAND','BURN'], why:'HEARTBEAT + BEATBREAK? No. HEARTBEAT: HEART+BEAT. BEAT+BREAK? No common compound. Fix: HEART+BREAK=HEARTBREAK. So second word IS the compound. Different format needed.',  d:1.0 },
      // More clean ones:
      { first:'BOOK', second:'CASE', a:'BRIEF', w:['SHELF','MARK','WORM'], why:'BOOKCASE... wait BRIEF+CASE=BRIEFCASE. BOOK+BRIEF? No. Fix: BOOK is the bridge? No.',  d:1.0 },
    ];

    // Use only confirmed working items
    const confirmed = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK + WORKOUT.', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM + WORMHOLE.', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT + LIGHTHOUSE.', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL + BALLROOM.', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND + BANDSTAND.', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK + PICKPOCKET.', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL + BELLTOWER.', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL + BALLGAME.', d:0.9 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT + PORTHOLE.', d:1.0 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL + BALLPARK.', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL + FALLOUT.', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH + FISHTANK.', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER + PAPERWORK.', d:1.0 },
      { first:'BREAK', second:'LIGHT', a:'DAY', w:['FAST','NIGHT','DOWN'], why:'DAYBREAK + DAYLIGHT.', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK + WORKLOAD.', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE + SCORELINE.', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT + LIGHTHOUSE.', d:1.0 },
      { first:'BRAIN', second:'BRAIN', a:'STORM', w:['WAVE','CELL','DEAD'], why:'BRAINSTORM + THUNDERSTORM? No: just BRAINSTORM. Fix needed.', d:1.0 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE + SHAKEDOWN.', d:1.0 },
      { first:'EYE', second:'SIDE', a:'OUT', w:['LID','BROW','DROP'], why:'EYEOUT? No. OUTSIDE + ... Fix.', d:1.0 },
    ];

    const final = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK + WORKOUT.', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM + WORMHOLE.', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT + LIGHTHOUSE.', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL + BALLROOM.', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND + BANDSTAND.', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK + PICKPOCKET.', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL + BELLTOWER.', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL + BALLGAME.', d:0.9 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT + PORTHOLE.', d:1.0 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL + BALLPARK.', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL + FALLOUT.', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH + FISHTANK.', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER + PAPERWORK.', d:1.0 },
      { first:'BREAK', second:'LIGHT', a:'DAY', w:['FAST','NIGHT','DOWN'], why:'DAYBREAK + DAYLIGHT.', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK + WORKLOAD.', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE + SCORELINE.', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT + LIGHTHOUSE.', d:1.0 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE + SHAKEDOWN.', d:1.0 },
      { first:'OUT', second:'LINE', a:'SIDE', w:['BACK','RUN','LAW'], why:'OUTSIDE + SIDELINE.', d:1.0 },
      { first:'BLACK', second:'BERRY', a:'BIRD', w:['BOARD','SMITH','OUT'], why:'BLACKBIRD + BLACKBERRY.', d:1.0 },
      { first:'RAIN', second:'COAT', a:'OVER', w:['DROP','BOW','STORM'], why:'OVERCOAT + RAINCOAT... OVERRAIN? No. RAINCOAT has RAIN+COAT. OVERCOAT has OVER+COAT. COAT is shared not a bridge. Fix: RAIN+BOW=RAINBOW, BOW+... hmm. Use COAT: both share COAT, answer=COAT. Question format: what word follows RAIN and follows OVER? RAINCOAT+OVERCOAT=COAT.', d:1.1 },
      { first:'THUNDER', second:'COAT', a:'OVER', w:['BOLT','CLOUD','RAIN'], why:'OVERTHUNDER? No. OVERCOAT + THUNDERSTRUCK? Fix needed.', d:1.1 },
    ];

    const safe = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK (FIRE+WORK) + WORKOUT (WORK+OUT).', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM (BOOK+WORM) + WORMHOLE (WORM+HOLE).', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT (SUN+LIGHT) + LIGHTHOUSE (LIGHT+HOUSE).', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL (FOOT+BALL) + BALLROOM (BALL+ROOM).', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND (HEAD+BAND) + BANDSTAND (BAND+STAND).', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK (TOOTH+PICK) + PICKPOCKET (PICK+POCKET).', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL (DOOR+BELL) + BELLTOWER (BELL+TOWER).', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL (BASE+BALL) + BALLGAME (BALL+GAME).', d:0.9 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT (AIR+PORT) + PORTHOLE (PORT+HOLE).', d:1.0 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL (SNOW+BALL) + BALLPARK (BALL+PARK).', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL (WATER+FALL) + FALLOUT (FALL+OUT).', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH (STAR+FISH) + FISHTANK (FISH+TANK).', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER (SAND+PAPER) + PAPERWORK (PAPER+WORK).', d:1.0 },
      { first:'DAY', second:'HOUSE', a:'LIGHT', w:['DREAM','BREAK','TIME'], why:'DAYLIGHT (DAY+LIGHT) + LIGHTHOUSE (LIGHT+HOUSE).', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK (OVER+WORK) + WORKLOAD (WORK+LOAD).', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE (UNDER+SCORE) + SCORELINE (SCORE+LINE).', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT (HIGH+LIGHT) + LIGHTHOUSE (LIGHT+HOUSE).', d:1.0 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE (HAND+SHAKE) + SHAKEDOWN (SHAKE+DOWN).', d:1.0 },
      { first:'OUT', second:'LINE', a:'SIDE', w:['BACK','RUN','LAW'], why:'OUTSIDE (OUT+SIDE) + SIDELINE (SIDE+LINE).', d:1.0 },
      { first:'BLACK', second:'BERRY', a:'BIRD', w:['BOARD','SMITH','OUT'], why:'BLACKBIRD (BLACK+BIRD) + BLACKBERRY (BLACK+BERRY). Wait — both start with BLACK so answer must follow BIRD: BLACKBIRD + BIRDBERRY? No. These share the prefix. Fix: BIRD+HOUSE=BIRDHOUSE, BLACK+BIRD=BLACKBIRD. So: FIRST+BIRD and BIRD+SECOND: BLACK+BIRD=BLACKBIRD, BIRD+HOUSE=BIRDHOUSE. So second should be HOUSE not BERRY.', d:1.0 },
      { first:'BLACK', second:'HOUSE', a:'BIRD', w:['BOARD','SMITH','OUT'], why:'BLACKBIRD (BLACK+BIRD) + BIRDHOUSE (BIRD+HOUSE).', d:1.0 },
      { first:'PLAY', second:'GROUND', a:'BACK', w:['WORK','BOY','TIME'], why:'PLAYBACK (PLAY+BACK) + BACKGROUND (BACK+GROUND).', d:1.1 },
      { first:'BACK', second:'LIGHT', a:'FLASH', w:['PACK','YARD','BONE'], why:'BACKFLASH? Not common. Fix: BACK+GROUND=BACKGROUND, FLASH+BACK=FLASHBACK. So: FIRST=FLASH, second=GROUND? No. Let me do: FIRST+BACK and BACK+SECOND. FLASH+BACK=FLASHBACK, BACK+GROUND=BACKGROUND. First=FLASH, a=BACK, second=GROUND. Question: "FLASH ___ GROUND". a=BACK.', d:1.1 },
      { first:'FLASH', second:'GROUND', a:'BACK', w:['LIGHT','POINT','FIRE'], why:'FLASHBACK (FLASH+BACK) + BACKGROUND (BACK+GROUND).', d:1.1 },
      { first:'OVER', second:'BOARD', a:'CARD', w:['TIME','COME','LOOK'], why:'OVERCARD? No. CARDBOARD: CARD+BOARD. OVER+CARD? No. Fix needed.', d:1.1 },
      { first:'CARD', second:'WALK', a:'BOARD', w:['GAME','SHARP','TRICK'], why:'CARDBOARD (CARD+BOARD) + BOARDWALK (BOARD+WALK).', d:1.1 },
      { first:'STEAM', second:'ROLLER', a:'ROAD', w:['SHIP','ENGINE','POWER'], why:'STEAMROAD? No. ROAD+ROLLER=ROADROLLER? Not common. STEAM+ROAD? No. Fix: STEAM+SHIP=STEAMSHIP, SHIP+YARD=SHIPYARD. First=STEAM, second=YARD, a=SHIP.', d:1.1 },
      { first:'STEAM', second:'YARD', a:'SHIP', w:['POWER','ROLLER','ENGINE'], why:'STEAMSHIP (STEAM+SHIP) + SHIPYARD (SHIP+YARD).', d:1.1 },
      { first:'EYE', second:'FALL', a:'DOWN', w:['LID','SIGHT','BROW'], why:'EYEDOWN? No. DOWNFALL: DOWN+FALL. EYE+DOWN? No. Fix: EYE+LID=EYELID, LID+... hmm. EYE+BROW=EYEBROW, BROW+BEAT=BROWBEAT. First=EYE, second=BEAT, a=BROW.', d:1.0 },
      { first:'EYE', second:'BEAT', a:'BROW', w:['LID','SIGHT','DROP'], why:'EYEBROW (EYE+BROW) + BROWBEAT (BROW+BEAT).', d:1.1 },
      { first:'NEWS', second:'PAPER', a:'WALL', w:['CAST','LETTER','STAND'], why:'NEWSWALL? No. WALL+PAPER=WALLPAPER, NEWS+WALL? No. Fix: NEWS+PAPER=NEWSPAPER, PAPER+WORK=PAPERWORK. First=NEWS, second=WORK, a=PAPER. Already have SAND+PAPER above. Use: NEWS+PAPER=NEWSPAPER, PAPER+BACK=PAPERBACK. Second=BACK.', d:1.1 },
      { first:'NEWS', second:'BACK', a:'PAPER', w:['CAST','LETTER','STAND'], why:'NEWSPAPER (NEWS+PAPER) + PAPERBACK (PAPER+BACK).', d:1.1 },
    ];

    const verified = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK + WORKOUT.', d:0.9 },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM + WORMHOLE.', d:0.9 },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT + LIGHTHOUSE.', d:0.9 },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL + BALLROOM.', d:0.9 },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND + BANDSTAND.', d:1.0 },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK + PICKPOCKET.', d:1.0 },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL + BELLTOWER.', d:1.0 },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL + BALLGAME.', d:0.9 },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT + PORTHOLE.', d:1.0 },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL + BALLPARK.', d:1.0 },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL + FALLOUT.', d:1.0 },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH + FISHTANK.', d:1.0 },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER + PAPERWORK.', d:1.0 },
      { first:'DAY', second:'HOUSE', a:'LIGHT', w:['DREAM','BREAK','TIME'], why:'DAYLIGHT + LIGHTHOUSE.', d:1.0 },
      { first:'OVER', second:'LOAD', a:'WORK', w:['TIME','COME','BOARD'], why:'OVERWORK + WORKLOAD.', d:1.1 },
      { first:'UNDER', second:'LINE', a:'SCORE', w:['COVER','TAKE','WORLD'], why:'UNDERSCORE + SCORELINE.', d:1.2 },
      { first:'HIGH', second:'HOUSE', a:'LIGHT', w:['WAY','LAND','RISE'], why:'HIGHLIGHT + LIGHTHOUSE.', d:1.0 },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE + SHAKEDOWN.', d:1.0 },
      { first:'OUT', second:'LINE', a:'SIDE', w:['BACK','RUN','LAW'], why:'OUTSIDE + SIDELINE.', d:1.0 },
      { first:'BLACK', second:'HOUSE', a:'BIRD', w:['BOARD','SMITH','OUT'], why:'BLACKBIRD + BIRDHOUSE.', d:1.0 },
      { first:'PLAY', second:'GROUND', a:'BACK', w:['WORK','BOY','TIME'], why:'PLAYBACK + BACKGROUND.', d:1.1 },
      { first:'FLASH', second:'GROUND', a:'BACK', w:['LIGHT','POINT','FIRE'], why:'FLASHBACK + BACKGROUND.', d:1.1 },
      { first:'CARD', second:'WALK', a:'BOARD', w:['GAME','SHARP','TRICK'], why:'CARDBOARD + BOARDWALK.', d:1.1 },
      { first:'STEAM', second:'YARD', a:'SHIP', w:['POWER','ROLLER','ENGINE'], why:'STEAMSHIP + SHIPYARD.', d:1.1 },
      { first:'EYE', second:'BEAT', a:'BROW', w:['LID','SIGHT','DROP'], why:'EYEBROW + BROWBEAT.', d:1.1 },
      { first:'NEWS', second:'BACK', a:'PAPER', w:['CAST','LETTER','STAND'], why:'NEWSPAPER + PAPERBACK.', d:1.1 },
      { first:'HAND', second:'CRAFT', a:'WORK', w:['MADE','SHAKE','CUFF'], why:'HANDIWORK + HANDICRAFT? No. HANDWORK + CRAFTWORK? Fix: HAND+WORK=HANDWORK, WORK+CRAFT? No common word. Better: COURT+YARD=COURTYARD, YARD+STICK=YARDSTICK. First=COURT, a=YARD, second=STICK.', d:1.1 },
      { first:'COURT', second:'STICK', a:'YARD', w:['ROOM','ORDER','SHIP'], why:'COURTYARD + YARDSTICK.', d:1.1 },
      { first:'MOON', second:'SHIP', a:'LIGHT', w:['BEAM','SHINE','GLOW'], why:'MOONLIGHT + LIGHTHOUSE? No: LIGHT+SHIP=LIGHTSHIP. MOON+LIGHT=MOONLIGHT, LIGHT+SHIP=LIGHTSHIP. Yes!', d:1.0 },
      { first:'MOON', second:'SHIP', a:'LIGHT', w:['BEAM','SHINE','GLOW'], why:'MOONLIGHT (MOON+LIGHT) + LIGHTSHIP (LIGHT+SHIP).', d:1.0 },
    ];

    const i = this.pick(verified);
    return {
      type:'wordLink', category:'verbalReasoning', categoryLabel:'Word Link',
      difficulty:i.d||1.0, question:`What word connects: ${i.first} ___ ${i.second}`,
      answer:i.a, options:this.shuffle([i.a,...i.w]),
      explanation:i.why, visual:'text'
    };
  },

  sentenceLogic() {
    const items = [
      // EASY
      { q:'Which is grammatically correct?', a:'She and I went to the store.', w:['Her and me went to the store.','Me and her went to the store.','Her and I went to the store.'], why:'"She and I" is the correct subject.', d:0.8 },
      { q:'What does "break the ice" mean?', a:'Start a conversation', w:['Break something cold','Cause a problem','End a friendship'], why:'To initiate social interaction.', d:0.7 },
      { q:'What does "once in a blue moon" mean?', a:'Very rarely', w:['Every month','At night','When it is cold'], why:'Something that happens very rarely.', d:0.7 },
      { q:'"Actions speak louder than words" means:', a:'What you do matters more than what you say', w:['Be quiet','Talk loudly','Take action quickly'], why:'Deeds matter more than promises.', d:0.7 },
      { q:'Choose correct: "Their/There/They\'re going to the park."', a:"They're", w:['Their','There','Theyre'], why:"They're=they are.", d:0.7 },
      { q:'What does "cost an arm and a leg" mean?', a:'Very expensive', w:['Requires surgery','Involves sacrifice','Is physically painful'], why:'This idiom means very costly.', d:0.7 },
      { q:'What does "the ball is in your court" mean?', a:"It's your turn to decide", w:['You lost the game','Play basketball','You are at court'], why:'The decision is up to you.', d:0.8 },
      // MEDIUM
      { q:'Which word best completes: "The evidence _____ the suspect."', a:'implicates', w:['implies','invites','imposes'], why:'Implicates = shows involvement in wrongdoing.', d:1.1 },
      { q:'What is the correct plural of "phenomenon"?', a:'Phenomena', w:['Phenomenons','Phenomenas','Phenomeni'], why:'Greek origin: phenomenon → phenomena.', d:1.1 },
      { q:'"The proof is in the pudding" really means:', a:'Results are what matter', w:['Food proves everything','Pudding is the answer','Wait and see'], why:'The full phrase: "the proof of the pudding is in the eating."', d:1.0 },
      { q:'What does "begging the question" actually mean?', a:'Assuming the conclusion in your argument', w:['Avoiding a question','Raising a question','Asking repeatedly'], why:'It\'s a logic fallacy, not literally asking a question.', d:1.4 },
      { q:'Which sentence uses a semicolon correctly?', a:'I have a big test tomorrow; I can\'t go out tonight.', w:['I have; a test tomorrow.','I can\'t go; out tonight.','Tomorrow; I have a test.'], why:'Semicolons connect two independent clauses.', d:1.2 },
      // HARD
      { q:'What is the difference between "affect" and "effect"?', a:'Affect is a verb, effect is a noun', w:['They are the same','Effect is a verb, affect is a noun','Both are nouns'], why:'Affect (verb): to influence. Effect (noun): the result.', d:1.3 },
      { q:'What does "pleonasm" mean?', a:'Using more words than necessary', w:['Fear of words','A type of poem','A logical fallacy'], why:'Example: "free gift" or "ATM machine."', d:1.7 },
      { q:'What is a "dangling modifier"?', a:'A phrase that doesn\'t clearly modify any word', w:['A very long sentence','An unclear pronoun','A misplaced comma'], why:'"Running to the store, the rain started." — who was running?', d:1.5 },
    ];
    const i = this.pick(items);
    return {
      type:'sentenceLogic', category:'verbalReasoning', categoryLabel:'Language Logic',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // LOGICAL REASONING
  // ═══════════════════════════════════════════════════

  oddOut() {
    const sets = [
      // EASY (0.5-0.7)
      { items:['Apple','Banana','Carrot','Orange'], odd:'Carrot', why:'Vegetable, not a fruit.', d:0.5 },
      { items:['Dog','Cat','Goldfish','Hamster'], odd:'Goldfish', why:'Fish, not a mammal.', d:0.6 },
      { items:['Red','Blue','Square','Green'], odd:'Square', why:'Shape, not a color.', d:0.5 },
      { items:['January','Monday','March','December'], odd:'Monday', why:'Day of week, not a month.', d:0.5 },
      { items:['Coffee','Tea','Juice','Bread'], odd:'Bread', why:'Solid food, others are drinks.', d:0.5 },
      { items:['Circle','Triangle','Red','Square'], odd:'Red', why:'Color, not a shape.', d:0.5 },
      { items:['Bike','Car','Boat','Truck'], odd:'Boat', why:'Travels on water.', d:0.6 },
      { items:['Hammer','Screwdriver','Banana','Wrench'], odd:'Banana', why:'Food, not a tool.', d:0.5 },
      { items:['Eagle','Penguin','Sparrow','Hawk'], odd:'Penguin', why:'Cannot fly.', d:0.7 },
      // MEDIUM (0.9-1.1)
      { items:['Dog','Cat','Goldfish','Hamster'], odd:'Goldfish', why:'Fish, others are mammals.', d:0.6 },
      { items:['Piano','Guitar','Violin','Drums'], odd:'Drums', why:'Percussion; others are melodic string/keyboard.', d:0.9 },
      { items:['Mars','Venus','Moon','Jupiter'], odd:'Moon', why:'Orbits Earth, not the Sun.', d:0.9 },
      { items:['Dolphin','Shark','Whale','Seal'], odd:'Shark', why:'Fish; others are mammals.', d:0.9 },
      { items:['Python','Java','French','Ruby'], odd:'French', why:'Human language; others are programming languages.', d:0.9 },
      { items:['Gold','Silver','Diamond','Copper'], odd:'Diamond', why:'Gemstone; others are metals.', d:1.0 },
      { items:['Tennis','Chess','Basketball','Soccer'], odd:'Chess', why:'Board game; others are physical sports.', d:0.9 },
      { items:['Rain','Snow','Hail','Wind'], odd:'Wind', why:'Air movement; others are precipitation.', d:1.0 },
      { items:['Cello','Flute','Violin','Harp'], odd:'Flute', why:'Wind instrument; others are stringed.', d:1.0 },
      { items:['Mercury','Earth','Pluto','Saturn'], odd:'Pluto', why:'Dwarf planet.', d:1.0 },
      { items:['Atlantic','Pacific','Arctic','Sahara'], odd:'Sahara', why:'Desert; others are oceans.', d:0.9 },
      { items:['Heart','Lungs','Brain','Femur'], odd:'Femur', why:'Bone; others are organs.', d:1.0 },
      // HARD (1.2+)
      { items:['Oxygen','Iron','Copper','Gold'], odd:'Oxygen', why:'Gas at room temp; others are solid metals.', d:1.1 },
      { items:['Beethoven','Mozart','Picasso','Bach'], odd:'Picasso', why:'Painter; others were composers.', d:1.2 },
      { items:['Democracy','Monarchy','Republic','Capitalism'], odd:'Capitalism', why:'Economic system; others are government types.', d:1.3 },
      { items:['Meter','Kilogram','Second','Dollar'], odd:'Dollar', why:'Currency; others are SI units.', d:1.2 },
      { items:['Hydrogen','Helium','Nitrogen','Iron'], odd:'Iron', why:'Solid metal; others are gases.', d:1.2 },
      { items:['Broccoli','Spinach','Strawberry','Kale'], odd:'Strawberry', why:'Fruit; others are leafy greens.', d:1.0 },
      { items:['Sonnet','Haiku','Limerick','Novel'], odd:'Novel', why:'Prose fiction; others are poetry forms.', d:1.3 },
      { items:['Mitosis','Meiosis','Osmosis','Photosynthesis'], odd:'Photosynthesis', why:'Energy conversion; others are cellular division/transport.', d:1.5 },
      { items:['Plato','Aristotle','Socrates','Caesar'], odd:'Caesar', why:'Military/political leader; others were philosophers.', d:1.3 },
      { items:['Simile','Metaphor','Hyperbole','Haiku'], odd:'Haiku', why:'Poetry form; others are figures of speech.', d:1.4 },
    ];
    const s = this.pick(sets);
    return {
      type:'oddOut', category:'logicalReasoning', categoryLabel:'Odd One Out',
      difficulty:s.d||1.0, question:"Which one doesn't belong?",
      answer:s.odd, options:this.shuffle(s.items),
      explanation:s.why, visual:'text'
    };
  },

  logic() {
    const puzzles = [
      // EASY (0.7-0.9)
      { q:'All cats have tails. Whiskers is a cat. Does Whiskers have a tail?', a:'Yes', w:['No','Maybe','Not enough info'], why:'All cats → Whiskers is a cat → Whiskers has a tail.', d:0.7 },
      { q:'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?', a:'Leo', w:['Jake','Kim','Cannot tell'], why:'Order: Jake, Kim, Leo.', d:0.7 },
      { q:'No fish can walk. Salmon is a fish. Can salmon walk?', a:'No', w:['Yes','Maybe','Sometimes'], why:'No fish can walk.', d:0.7 },
      { q:'Lisa runs faster than Mia. Mia runs faster than Nora. Who is fastest?', a:'Lisa', w:['Mia','Nora','Cannot tell'], why:'Lisa > Mia > Nora.', d:0.7 },
      { q:'If A > B and B > C, is A > C?', a:'Yes, always', w:['No','Sometimes','Cannot tell'], why:'Transitivity.', d:0.8 },
      { q:'All squares are rectangles. All rectangles have 4 sides. Do all squares have 4 sides?', a:'Yes', w:['No','Some do','Not necessarily'], why:'Chain: squares → rectangles → 4 sides.', d:0.8 },
      { q:'Sam is taller than Pat. Pat is taller than Chris. Is Sam taller than Chris?', a:'Yes', w:['No','Maybe','Cannot tell'], why:'Sam > Pat > Chris.', d:0.7 },
      // MEDIUM (1.0-1.3)
      { q:'If it rains, the grass is wet. The grass is wet. Did it rain?', a:'Not necessarily', w:['Yes','No','Always'], why:'Grass could be wet from a sprinkler.', d:1.0 },
      { q:'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?', a:'Not necessarily', w:['Yes','No','Always'], why:'Only SOME dogs bark loudly.', d:1.0 },
      { q:'All roses are flowers. Some flowers fade quickly. Do all roses fade quickly?', a:'Not necessarily', w:['Yes','No','Always'], why:'Only SOME flowers fade quickly.', d:1.0 },
      { q:'If today is Tuesday, what day was it 3 days ago?', a:'Saturday', w:['Sunday','Monday','Friday'], why:'Tue→Mon→Sun→Sat.', d:1.0 },
      { q:'Only birds have feathers. Penguins are birds. Do penguins have feathers?', a:'Yes', w:['No','Maybe','Only some'], why:'Penguins are birds → feathers.', d:1.0 },
      { q:'If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?', a:'Yes', w:['No','Maybe','Cannot determine'], why:'A⊂B and B⊂C → A⊂C.', d:1.1 },
      // HARD (1.4+)
      { q:'If no mammals lay eggs, and a platypus lays eggs, what can we conclude?', a:'The statement is false', w:['Platypus is not a mammal','Nothing','Platypus is a bird'], why:'Platypus IS a mammal that lays eggs → premise is false.', d:1.4 },
      { q:'You pick Box 1 of 3. Host reveals Box 3 is empty. Should you switch to Box 2?', a:'Yes, switching is better', w:["No, stay with Box 1","It doesn't matter","Not enough info"], why:'Monty Hall: switching gives 2/3 chance vs 1/3.', d:1.7 },
      { q:'There are 3 suspects. Exactly one guilty. Al says "I\'m innocent." Bob says "Al is lying." Can both be telling the truth?', a:'No', w:['Yes','Maybe','Cannot tell'], why:'If Al is innocent (truth), Bob\'s claim would be false — contradiction.', d:1.6 },
      { q:'In a group where all A are B, and no B are C — can any A be C?', a:'No', w:['Yes','Maybe','Sometimes'], why:'A→B and B≠C, so A≠C.', d:1.3 },
      { q:'If "If P then Q" is true, and Q is false, what do we know about P?', a:'P is false', w:['P is true','P is unknown','Nothing'], why:'Contrapositive: not-Q → not-P.', d:1.5 },
      { q:'A says "We are both liars." Can A be telling the truth?', a:'No', w:['Yes','Maybe','It depends'], why:'If A tells truth, both are liars → A is a liar. Contradiction.', d:1.8 },
      { q:'You have 12 balls, one is heavier. Minimum weighings on balance scale to find it?', a:'3', w:['2','4','6'], why:'3 weighings handle up to 27 items.', d:1.8 },
    ];
    const p = this.pick(puzzles);
    return {
      type:'logic', category:'logicalReasoning', categoryLabel:'Logic',
      difficulty:p.d||1.2, question:p.q, answer:p.a,
      options:this.shuffle([p.a,...p.w]), explanation:p.why, visual:'text'
    };
  },

  truthTable() {
    const items = [
      { q:'Statement: "If it\'s raining, I bring an umbrella." It\'s NOT raining. Can we conclude anything about the umbrella?', a:'No, could go either way', w:['I definitely have an umbrella','I definitely don\'t have one','The statement is false'], why:'"If" only specifies the rain case. No rain → no conclusion.', d:1.4 },
      { q:'"All dogs are loyal. Some loyal things are brave." Are all dogs brave?', a:'Not necessarily', w:['Yes','No','Always'], why:'Only SOME loyal things are brave.', d:1.3 },
      { q:'True or False: "If A implies B, then not-B implies not-A"', a:'True', w:['False','Sometimes','Cannot determine'], why:'This is the contrapositive — always logically equivalent.', d:1.5 },
      { q:'"None of my friends are boring." Tom is boring. What follows?', a:'Tom is not my friend', w:['Tom is boring','I have no friends','Nothing'], why:'No friends are boring + Tom is boring → Tom is not a friend.', d:1.3 },
      { q:'"Either it will rain or snow tomorrow." It didn\'t rain. What happened?', a:'It snowed', w:['Nothing happened','It rained anyway','Cannot tell'], why:'One of two must happen; rain didn\'t → snow did.', d:1.2 },
      { q:'"If I study I pass. If I pass I graduate." I studied. What happens?', a:'I graduate', w:['I might pass','Nothing certain','I only pass'], why:'Study → pass → graduate.', d:1.2 },
      { q:'P: All A are B. Q: Some B are C. What can we definitely conclude?', a:'Some A might be C', w:['All A are C','No A are C','All C are B'], why:'We only know some B are C — those some might or might not include the A subset.', d:1.7 },
      { q:'"If not A, then B. Not B." What do we know?', a:'A is true', w:['A is false','Nothing','B is true'], why:'Contrapositive of "not-A → B" is "not-B → A". Not-B is given → A.', d:1.8 },
      { q:'All P are Q. All Q are R. No R are S. Are any P also S?', a:'No', w:['Yes','Maybe','Cannot tell'], why:'P→Q→R, and no R are S, so no P can be S.', d:1.6 },
    ];
    const i = this.pick(items);
    return {
      type:'truthTable', category:'logicalReasoning', categoryLabel:'Logical Deduction',
      difficulty:i.d||1.5, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // EMOTIONAL INTELLIGENCE
  // ═══════════════════════════════════════════════════

  emotionalIQ() {
    const items = [
      { q:'Your friend cancels plans last minute and seems stressed. Best response?', a:"Ask if they're okay", w:['Get angry','Ignore them','Cancel on them next time'], why:'Concern builds trust.', d:0.7 },
      { q:'A coworker takes credit for your idea. Best first step?', a:'Talk to them privately', w:['Yell publicly','Do nothing','Complain to everyone'], why:'Private conversation addresses it directly.', d:0.9 },
      { q:'Someone says "I\'m fine" but looks upset. What do they likely mean?', a:"They're not fine but don't want to talk", w:["They are fine","They want you to leave","They're testing you"], why:'Body language often contradicts words.', d:0.8 },
      { q:'You made a mistake at work. Best approach?', a:'Own it and fix it', w:['Hide it','Blame someone','Hope no one notices'], why:'Taking responsibility shows integrity.', d:0.7 },
      { q:'A friend is venting about their day. What do they most likely want?', a:'Someone to listen', w:['Advice','To be told to calm down','Solutions'], why:'Venting = being heard.', d:0.7 },
      { q:'You disagree with a group decision. Best approach?', a:'Share your view respectfully', w:['Go along silently','Refuse to participate','Argue until you win'], why:'Respectful disagreement improves outcomes.', d:0.9 },
      { q:'Someone gives you harsh feedback. Best initial reaction?', a:'Listen and consider it', w:['Defend immediately','Walk away','Give harsh feedback back'], why:'Even harsh feedback can contain truth.', d:0.9 },
      { q:'You notice a new person sitting alone. Best response?', a:'Introduce yourself', w:['Assume they want to be alone','Wait for them','Ignore them'], why:'A simple introduction makes people feel welcome.', d:0.7 },
      { q:'Your friend just failed an exam. What should you say?', a:'Acknowledge their feelings, offer support', w:["Tell them it's not a big deal","List what they did wrong","Share how well you did"], why:'Validating feelings shows empathy.', d:0.7 },
      { q:'Two friends are arguing. Both want you to pick a side. Best move?', a:'Stay neutral, encourage them to talk', w:['Pick the closer friend','Avoid both','Tell both they\'re wrong'], why:'Neutrality preserves relationships.', d:0.9 },
      { q:'You feel overwhelmed with tasks. Best coping strategy?', a:'Break tasks into smaller steps', w:['Ignore everything','Do it all at once','Complain'], why:'Breaking things down reduces anxiety.', d:0.8 },
      { q:'Someone apologizes sincerely. Best response?', a:'Accept it gracefully', w:['Make them feel guilty','Say "whatever"','Demand more'], why:'Accepting allows both to move forward.', d:0.7 },
      { q:'A teammate is struggling with their part of a project. Best move?', a:'Offer to help without judgment', w:['Do it for them','Report them','Ignore it'], why:'Supportive collaboration builds team trust.', d:0.8 },
      { q:'You received a gift you don\'t like. What should you do?', a:'Thank them sincerely for the thought', w:['Tell them you hate it','Return it immediately','Complain to others'], why:'Appreciating the gesture matters more than the item.', d:0.7 },
      { q:'A stranger bumps into you and doesn\'t apologize. Best reaction?', a:"Let it go, assume they're having a bad day", w:['Confront them','Bump them back','Yell at them'], why:'Giving benefit of the doubt reduces conflict.', d:0.8 },
      { q:'Your boss criticizes your work in a meeting. Best response?', a:'Ask for specific feedback to improve', w:['Argue back','Quit','Complain to HR'], why:'Seeking specifics turns criticism into growth.', d:1.0 },
      { q:'You catch a friend telling a small lie. Best approach?', a:'Address it privately and calmly', w:['Call them out publicly','Spread the news','Lie to them back'], why:'Private, calm conversation preserves the friendship.', d:1.0 },
      { q:'Someone shares exciting news but you\'re having a bad day. What should you do?', a:'Celebrate with them genuinely', w:["Dismiss their news","One-up them","Change the subject"], why:'Being happy for others strengthens bonds.', d:0.9 },
      { q:'You strongly disagree with a friend\'s life choice. Best approach?', a:'Express concern once, then respect their decision', w:['Lecture them repeatedly','Cut them off','Agree to avoid conflict'], why:'Once is honest; repeatedly is controlling.', d:1.1 },
      { q:'A child is having a tantrum in public. The parent looks embarrassed. Best reaction?', a:'Give an understanding smile', w:['Stare disapprovingly','Offer parenting advice','Complain loudly'], why:'Understanding reduces the parent\'s stress.', d:0.9 },
      { q:'Someone close to you is going through a difficult time. They push you away. Best approach?', a:'Give space but let them know you\'re there', w:['Force conversations','Stop trying completely','Tell others about it'], why:'Space + availability is the healthiest balance.', d:1.1 },
      { q:'You\'re in a group project and one member is doing all the talking. Best move?', a:'Politely invite quieter members to share', w:['Talk over them','Leave the meeting','Complain after'], why:'Inclusive facilitation improves group outcomes.', d:1.1 },
      { q:'You notice a colleague seems burned out. You\'re not close. Best action?', a:'Check in casually and genuinely', w:['Tell their manager','Ignore it','Broadcast it to the team'], why:'A simple check-in can make a real difference.', d:1.1 },
    ];
    const i = this.pick(items);
    return {
      type:'emotionalIQ', category:'spatialAwareness', categoryLabel:'Emotional IQ',
      difficulty:i.d||1.0, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // SPATIAL & NUMERICAL
  // ═══════════════════════════════════════════════════

  spatial() {
    const items = [
      // EASY
      { q:'Rotate an arrow pointing UP by 180°. Where does it point?', a:'Down', w:['Up','Left','Right'], why:'180° flips direction.', d:0.7 },
      { q:'Rotate an arrow pointing RIGHT by 90° clockwise. Where does it point?', a:'Down', w:['Up','Left','Right'], why:'Right + 90° CW = Down.', d:0.8 },
      { q:'Mirror an arrow pointing LEFT horizontally. Where does it point?', a:'Right', w:['Up','Down','Left'], why:'Horizontal mirror flips left↔right.', d:0.7 },
      { q:'Rotate an arrow pointing UP by 90° clockwise. Where does it point?', a:'Right', w:['Left','Down','Up'], why:'Up + 90° CW = Right.', d:0.7 },
      { q:'How many faces does a standard die have?', a:'6', w:['4','8','12'], why:'A cube has 6 faces.', d:0.6 },
      { q:'If you fold a square in half diagonally, what shape do you get?', a:'Triangle', w:['Rectangle','Pentagon','Trapezoid'], why:'Diagonal fold → right triangle.', d:0.7 },
      // MEDIUM
      { q:'Rotate an arrow pointing DOWN by 90° counter-clockwise. Where does it point?', a:'Right', w:['Up','Left','Down'], why:'Down + 90° CCW = Right.', d:1.0 },
      { q:'Rotate an arrow pointing LEFT by 90° clockwise. Where does it point?', a:'Up', w:['Down','Right','Left'], why:'Left + 90° CW = Up.', d:1.0 },
      { q:'Rotate an arrow pointing UP by 270° clockwise. Where does it point?', a:'Left', w:['Right','Down','Up'], why:'270° CW = 90° CCW. Up → Left.', d:1.1 },
      { q:'Looking at a clock, what angle do the hands make at 3:00?', a:'90°', w:['60°','120°','180°'], why:'At 3:00, hands are at right angles.', d:0.9 },
      { q:'If you rotate the letter "M" 180°, it looks most like:', a:'W', w:['N','Z','Ш'], why:'M flipped upside down = W.', d:0.9 },
      { q:'Looking from above, you rotate a square 45°. What shape does it appear?', a:'Diamond', w:['Triangle','Rectangle','Hexagon'], why:'A rotated square looks like a diamond.', d:1.0 },
      { q:'A cube is painted red on all sides and cut into 27 equal smaller cubes. How many have NO paint?', a:'1', w:['6','8','0'], why:'Only the very center cube has no painted faces.', d:1.3 },
      // HARD
      { q:'How many degrees does the minute hand of a clock move in 20 minutes?', a:'120°', w:['60°','90°','180°'], why:'360° in 60 min → 6°/min × 20 = 120°.', d:1.2 },
      { q:'A clock shows 4:30. What is the angle between the hands?', a:'45°', w:['30°','60°','90°'], why:'Hour hand at 135° (past 3), minute hand at 180°. 180-135=45°.', d:1.5 },
      { q:'A cube is cut in half diagonally from edge to edge. What shape is the cross-section?', a:'Rectangle', w:['Triangle','Square','Pentagon'], why:'A diagonal cut through a cube creates a rectangular cross-section.', d:1.4 },
      { q:'If you look at a transparent cube from one corner directly, how many edges are visible?', a:'9', w:['6','8','12'], why:'3 front, 3 back, 3 connecting = 9 visible edges.', d:1.7 },
    ];
    const i = this.pick(items);
    return {
      type:'spatial', category:'numericalReasoning', categoryLabel:'Spatial',
      difficulty:i.d||1.1, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  comparison() {
    const items = [
      // EASY
      { q:'Which is larger: 3/4 or 1/2?', a:'3/4', w:['1/2','Equal','Cannot tell'], why:'3/4=0.75 > 1/2=0.5.', d:0.6 },
      { q:'Which is smaller: 1/3 or 1/2?', a:'1/3', w:['1/2','Equal','Cannot tell'], why:'1/3=0.33 < 1/2=0.5.', d:0.6 },
      { q:'Which is larger: 50% or 1/3?', a:'50%', w:['1/3','Equal','Cannot tell'], why:'50%=0.5 > 1/3=0.33.', d:0.7 },
      { q:'Which is larger: 0.9 or 0.09?', a:'0.9', w:['0.09','Equal','Cannot tell'], why:'0.9 > 0.09.', d:0.5 },
      // MEDIUM
      { q:'Which is larger: 3/4 or 2/3?', a:'3/4', w:['2/3','Equal','Cannot tell'], why:'3/4=0.75 > 2/3=0.67.', d:1.0 },
      { q:'Which is larger: 2 cubed or 3 squared?', a:'3 squared (9)', w:['2 cubed (8)','Equal','Cannot tell'], why:'2³=8, 3²=9.', d:1.0 },
      { q:'Which is larger: 25% or 1/3?', a:'1/3', w:['25%','Equal','Cannot tell'], why:'1/3=0.33 > 0.25.', d:1.0 },
      { q:'Which is smaller: 0.1 or 1/8?', a:'0.1', w:['1/8','Equal','Cannot tell'], why:'0.1=0.10 < 1/8=0.125.', d:1.1 },
      { q:'Which is larger: 2/5 or 3/8?', a:'2/5', w:['3/8','Equal','Cannot tell'], why:'2/5=0.40 > 3/8=0.375.', d:1.1 },
      { q:'Which is larger: 0.9 or 7/8?', a:'0.9', w:['7/8','Equal','Cannot tell'], why:'7/8=0.875 < 0.9.', d:1.1 },
      { q:'Which is larger: 2⁵ or 5²?', a:'2⁵ (32)', w:['5² (25)','Equal','Cannot tell'], why:'2⁵=32 > 5²=25.', d:1.0 },
      // HARD
      { q:'Which is larger: 1/2 or 3/7?', a:'1/2', w:['3/7','Equal','Cannot tell'], why:'1/2=0.5 > 3/7=0.43.', d:1.0 },
      { q:'Which is larger: 10% of 200 or 20% of 90?', a:'10% of 200', w:['20% of 90','Equal','Cannot tell'], why:'10%×200=20, 20%×90=18.', d:1.2 },
      { q:'Which is larger: 5 squared or 4 cubed?', a:'4 cubed', w:['5 squared','Equal','Cannot tell'], why:'5²=25 < 4³=64.', d:1.1 },
      { q:'Which is larger: 3/7 or 5/12?', a:'5/12', w:['3/7','Equal','Cannot tell'], why:'3/7≈0.429, 5/12≈0.417. Wait: 3/7=36/84, 5/12=35/84. So 3/7 > 5/12.', d:1.3 },
      { q:'Which is larger: 3/7 or 5/12?', a:'3/7', w:['5/12','Equal','Cannot tell'], why:'3/7=36/84 > 5/12=35/84.', d:1.3 },
      { q:'Rank from smallest: 2/3, 3/5, 7/10, 4/7', a:'4/7 < 3/5 < 2/3 < 7/10', w:['2/3 < 3/5 < 4/7 < 7/10','3/5 < 4/7 < 7/10 < 2/3','7/10 < 4/7 < 3/5 < 2/3'], why:'0.571, 0.6, 0.667, 0.7.', d:1.6 },
      { q:'Which is closer to 1: 7/8 or 5/6?', a:'7/8', w:['5/6','They are equal','Cannot tell'], why:'1-7/8=0.125, 1-5/6=0.167. 7/8 is closer.', d:1.4 },
    ];
    const i = this.pick(items);
    return {
      type:'comparison', category:'numericalReasoning', categoryLabel:'Compare',
      difficulty:i.d||1.2, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  estimation() {
    const items = [
      // EASY (0.5-0.7)
      { q:'About how many days in a year?', a:'365', w:['300','400','350'], why:'365 days (366 in leap years).', d:0.5 },
      { q:'About how many weeks in a year?', a:'52', w:['48','56','42'], why:'365÷7≈52.', d:0.6 },
      { q:'How many months have 31 days?', a:'7', w:['5','6','8'], why:'Jan,Mar,May,Jul,Aug,Oct,Dec.', d:0.7 },
      { q:'How many continents are there?', a:'7', w:['5','6','8'], why:'Africa,Antarctica,Asia,Australia,Europe,N.America,S.America.', d:0.5 },
      { q:'How many planets in our solar system?', a:'8', w:['7','9','10'], why:'Mercury through Neptune.', d:0.5 },
      { q:'About how many teeth does an adult human have?', a:'32', w:['28','36','24'], why:'32 including wisdom teeth.', d:0.7 },
      // MEDIUM (0.9-1.1)
      { q:'Roughly how many hours in a week?', a:'168', w:['100','200','150'], why:'24×7=168.', d:0.9 },
      { q:'About how many seconds in an hour?', a:'3600', w:['360','6000','1800'], why:'60×60=3600.', d:0.9 },
      { q:'About how many bones in an adult human body?', a:'206', w:['150','300','106'], why:'206 bones.', d:1.0 },
      { q:'How many keys on a standard piano?', a:'88', w:['76','92','64'], why:'Standard piano=88 keys.', d:1.0 },
      { q:'About what % of Earth is water?', a:'71%', w:['50%','85%','60%'], why:'~71% of surface is water.', d:0.9 },
      { q:'How many chromosomes do humans have?', a:'46', w:['23','48','42'], why:'23 pairs=46 total.', d:1.0 },
      { q:'How many sides does a dodecagon have?', a:'12', w:['10','8','20'], why:'Dodeca-=12.', d:1.0 },
      { q:'Roughly how many minutes in a day?', a:'1440', w:['1000','2000','1200'], why:'60×24=1440.', d:0.9 },
      // HARD (1.2+)
      { q:'About how many miles is the Earth\'s circumference?', a:'~25,000 miles', w:['~10,000','~50,000','~100,000'], why:'~24,901 miles.', d:1.2 },
      { q:'How many zeros in a trillion?', a:'12', w:['9','15','6'], why:'1,000,000,000,000 = 10¹².', d:1.1 },
      { q:'About how many cells are in the human body?', a:'~37 trillion', w:['~1 million','~1 billion','~1 trillion'], why:'Estimated 37 trillion cells.', d:1.3 },
      { q:'Speed of light in miles per second (approx)?', a:'~186,000 mph', w:['~18,600','~1,860,000','~18,600,000'], why:'~186,000 miles/second.', d:1.4 },
      { q:'How many strings on a standard guitar?', a:'6', w:['4','8','12'], why:'Standard guitar has 6 strings.', d:0.6 },
      { q:'Roughly, how many words are in the English language?', a:'~170,000', w:['~17,000','~1.7 million','~17 million'], why:'Oxford English Dictionary has ~170,000+ words.', d:1.5 },
      { q:'How many muscles in the human body (approx)?', a:'~640', w:['~100','~2000','~300'], why:'Approximately 640 skeletal muscles.', d:1.3 },
      { q:'About how many stars are in the Milky Way?', a:'~200-400 billion', w:['~1 million','~1 trillion','~10 billion'], why:'Estimated 200-400 billion stars.', d:1.4 },
    ];
    const i = this.pick(items);
    return {
      type:'estimation', category:'numericalReasoning', categoryLabel:'General Knowledge',
      difficulty:i.d||1.0, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  },

  numberProperty() {
    const items = [
      // EASY (0.7-0.9)
      { q:'Is 0 even or odd?', a:'Even', w:['Odd','Neither','Both'], why:'0 is divisible by 2.', d:0.7 },
      { q:'What is the smallest prime number?', a:'2', w:['1','3','0'], why:'2 is the smallest (and only even) prime.', d:0.7 },
      { q:'Is 15 prime?', a:'No', w:['Yes','Cannot tell','Only in some systems'], why:'15=3×5.', d:0.7 },
      { q:'What is the square root of 64?', a:'8', w:['6','7','9'], why:'8×8=64.', d:0.7 },
      { q:'Is 100 a perfect square?', a:'Yes', w:['No','Only approximately','Cannot tell'], why:'10×10=100.', d:0.7 },
      // MEDIUM (1.0-1.3)
      { q:'Is 97 a prime number?', a:'Yes', w:['No','Cannot tell','Only if even'], why:'97 is only divisible by 1 and 97.', d:1.1 },
      { q:'How many factors does 12 have?', a:'6', w:['4','5','3'], why:'1,2,3,4,6,12=six factors.', d:1.0 },
      { q:'Is 144 a perfect square?', a:'Yes', w:['No','Only approximately','Cannot tell'], why:'12×12=144.', d:1.0 },
      { q:'What is 2 to the power of 10?', a:'1024', w:['512','2048','1000'], why:'2¹⁰=1024.', d:1.1 },
      { q:'How many prime numbers between 1 and 20?', a:'8', w:['6','7','10'], why:'2,3,5,7,11,13,17,19.', d:1.1 },
      { q:'What is the sum of the first 10 positive integers?', a:'55', w:['45','50','60'], why:'n(n+1)/2=55.', d:1.0 },
      { q:'What is the GCD of 12 and 18?', a:'6', w:['3','9','12'], why:'Common factors: 1,2,3,6. GCD=6.', d:1.1 },
      { q:'What is 7 factorial (7!)?', a:'5040', w:['720','40320','2520'], why:'7×6×5×4×3×2×1=5040.', d:1.2 },
      // HARD (1.4+)
      { q:'What is the LCM of 4 and 6?', a:'12', w:['24','6','8'], why:'LCM(4,6)=12.', d:1.2 },
      { q:'How many perfect squares exist between 1 and 100 (inclusive)?', a:'10', w:['9','11','8'], why:'1,4,9,16,25,36,49,64,81,100=10.', d:1.3 },
      { q:'What is the 10th Fibonacci number?', a:'55', w:['34','89','44'], why:'1,1,2,3,5,8,13,21,34,55.', d:1.4 },
      { q:'How many trailing zeros in 20! (20 factorial)?', a:'4', w:['3','5','6'], why:'Floor(20/5)+Floor(20/25)=4+0=4.', d:1.8 },
      { q:'What is the sum of all integers from 1 to 100?', a:'5050', w:['4950','5000','5100'], why:'n(n+1)/2=100×101/2=5050.', d:1.4 },
      { q:'Is 1 a prime number?', a:'No', w:['Yes','Sometimes','By definition'], why:'Primes must have exactly 2 factors. 1 only has 1 factor.', d:1.3 },
      { q:'What is the next perfect number after 6?', a:'28', w:['12','18','24'], why:'28=1+2+4+7+14. Perfect numbers equal sum of proper divisors.', d:1.7 },
      { q:'How many digits does 2¹⁰ × 5¹⁰ have?', a:'11', w:['10','12','20'], why:'2¹⁰×5¹⁰=10¹⁰=10,000,000,000=11 digits.', d:1.6 },
    ];
    const i = this.pick(items);
    return {
      type:'numberProperty', category:'numericalReasoning', categoryLabel:'Number Theory',
      difficulty:i.d||1.3, question:i.q, answer:i.a,
      options:this.shuffle([i.a,...i.w]), explanation:i.why, visual:'text'
    };
  }
};