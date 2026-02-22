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
  
  generate() {
    // Weighted type distribution — ensures all categories get fed
    const types = [
      // Pattern Recognition (weight: high)
      'numSeq','numSeq','numSeq','numSeq',
      'letterSeq','letterSeq','letterSeq',
      'matrix','matrix',
      'series','series',
      'shapePattern',
      // Problem Solving
      'codeBreak','codeBreak','codeBreak',
      'riddle','riddle','riddle',
      'wordProblem','wordProblem',
      'logicGrid',
      // Mental Agility
      'math','math','math','math',
      'missingNum','missingNum',
      'timeCalc','timeCalc',
      'mentalChain',
      // Working Memory
      'memoryTask','memoryTask','memoryTask','memoryTask',
      // Verbal Reasoning
      'analogy','analogy','analogy',
      'verbal','verbal','verbal',
      'wordLink','wordLink',
      'sentenceLogic',
      // Logical Reasoning
      'oddOut','oddOut','oddOut',
      'logic','logic','logic',
      'truthTable',
      // Emotional (spatialAwareness category)
      'emotionalIQ','emotionalIQ','emotionalIQ',
      // Spatial (numericalReasoning category)
      'spatial','spatial',
      'comparison','comparison',
      'estimation','estimation',
      'numberProperty'
    ];
    
    let q, tries = 0;
    do {
      const fn = this.pick(types);
      q = this[fn]();
      tries++;
    } while (this.used.has(this.hash(q)) && tries < 40);
    
    this.used.add(this.hash(q));
    if (this.used.size > 1200) this.used = new Set([...this.used].slice(-600));
    return q;
  },

  // ═══════════════════════════════════════════════════
  // PATTERN RECOGNITION
  // ═══════════════════════════════════════════════════

  numSeq() {
    const patterns = [
      // Addition
      () => { const add = this.rand(2, 18); const s = this.rand(1, 50);
        return { seq: [s, s+add, s+add*2, s+add*3], ans: s+add*4, why: `Each number increases by ${add}. ${s+add*3} + ${add} = ${s+add*4}` }; },
      // Subtraction
      () => { const sub = this.rand(3, 12); const s = this.rand(60, 99);
        return { seq: [s, s-sub, s-sub*2, s-sub*3], ans: s-sub*4, why: `Each number decreases by ${sub}. ${s-sub*3} - ${sub} = ${s-sub*4}` }; },
      // Doubling
      () => { const s = this.rand(2, 7);
        return { seq: [s, s*2, s*4, s*8], ans: s*16, why: `Each number doubles. ${s*8} x 2 = ${s*16}` }; },
      // Tripling
      () => { const s = this.rand(1, 4);
        return { seq: [s, s*3, s*9, s*27], ans: s*81, why: `Each number triples. ${s*27} x 3 = ${s*81}` }; },
      // Squares
      () => { const o = this.rand(1, 7);
        return { seq: [o*o, (o+1)**2, (o+2)**2, (o+3)**2], ans: (o+4)**2, why: `Perfect squares: ${o}² through ${o+4}² = ${(o+4)**2}` }; },
      // Fibonacci-style
      () => { const a = this.rand(1, 5), b = this.rand(2, 6); const c=a+b, d=b+c, e=c+d;
        return { seq: [a, b, c, d], ans: e, why: `Each number = sum of previous two. ${c} + ${d} = ${e}` }; },
      // Increasing gaps
      () => { const s = this.rand(1, 10);
        return { seq: [s, s+2, s+5, s+9], ans: s+14, why: `Gaps increase: +2, +3, +4, +5. ${s+9} + 5 = ${s+14}` }; },
      // Primes
      () => { return { seq: [2, 3, 5, 7], ans: 11, why: `Prime numbers. After 7 the next prime is 11.` }; },
      // Triangular
      () => { return { seq: [1, 3, 6, 10], ans: 15, why: `Triangular numbers: +2, +3, +4, +5. 10 + 5 = 15` }; },
      // Halving
      () => { const s = this.rand(4, 8) * 16;
        return { seq: [s, s/2, s/4, s/8], ans: s/16, why: `Each number is halved. ${s/8} / 2 = ${s/16}` }; },
      // Powers of 2
      () => { const o = this.rand(0, 2);
        return { seq: [2**(o+1), 2**(o+2), 2**(o+3), 2**(o+4)], ans: 2**(o+5), why: `Powers of 2: ${2**(o+4)} x 2 = ${2**(o+5)}` }; },
      // Alternating add/subtract
      () => { const s = this.rand(10, 30), a = this.rand(3, 8), b = this.rand(1, 4);
        return { seq: [s, s+a, s+a-b, s+a*2-b], ans: s+a*2-b*2, why: `Alternating: +${a}, -${b}, +${a}, -${b}. Result: ${s+a*2-b*2}` }; },
      // Multiply then add
      () => { const s = this.rand(2, 4); const a = s, b = s*2+1, c = (s*2+1)*2+1, d = ((s*2+1)*2+1)*2+1;
        return { seq: [a, b, c, d], ans: d*2+1, why: `Pattern: double and add 1. ${d} x 2 + 1 = ${d*2+1}` }; },
      // Cubes
      () => { const o = this.rand(1, 4);
        return { seq: [o**3, (o+1)**3, (o+2)**3, (o+3)**3], ans: (o+4)**3, why: `Cube numbers: ${o+4}³ = ${(o+4)**3}` }; },
      // Add increasing even numbers
      () => { const s = this.rand(1, 10);
        return { seq: [s, s+2, s+6, s+12], ans: s+20, why: `Add 2, then 4, then 6, then 8. ${s+12} + 8 = ${s+20}` }; },
      // Multiply by increasing factor
      () => { const s = this.rand(1, 3);
        return { seq: [s, s*2, s*6, s*24], ans: s*120, why: `Multiply by 2, 3, 4, then 5. ${s*24} x 5 = ${s*120}` }; },
      // Square + constant
      () => { const c = this.rand(1, 5);
        return { seq: [1+c, 4+c, 9+c, 16+c], ans: 25+c, why: `Perfect squares + ${c}: 1²+${c}, 2²+${c}, 3²+${c}, 4²+${c}, 5²+${c} = ${25+c}` }; },
      // Differences of differences
      () => { const s = this.rand(1, 5);
        return { seq: [s, s+1, s+3, s+7], ans: s+15, why: `Gaps double: +1, +2, +4, +8. ${s+7} + 8 = ${s+15}` }; },
    ];
    
    const p = this.pick(patterns)();
    return {
      type: 'numSeq', category: 'patternRecognition', categoryLabel: 'Number Pattern',
      difficulty: 1.1, question: 'What comes next?',
      sequence: p.seq, answer: String(p.ans),
      options: this.numOpts(p.ans).map(String), explanation: p.why, visual: 'sequence'
    };
  },

  letterSeq() {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => { const i = this.rand(0, 19);
        return { seq: [A[i],A[i+1],A[i+2],A[i+3]], ans: A[i+4], why: `Consecutive letters.` }; },
      () => { const i = this.rand(0, 15);
        return { seq: [A[i],A[i+2],A[i+4],A[i+6]], ans: A[i+8], why: `Skip one letter each time.` }; },
      () => { const i = this.rand(0, 11);
        return { seq: [A[i],A[i+3],A[i+6],A[i+9]], ans: A[i+12], why: `Skip two letters each time.` }; },
      () => { const i = this.rand(10, 25);
        return { seq: [A[i],A[i-1],A[i-2],A[i-3]], ans: A[i-4], why: `Alphabet going backwards.` }; },
      () => { return { seq: ['A','E','I','O'], ans: 'U', why: `The five vowels: A, E, I, O, U.` }; },
      () => { return { seq: ['A','B','D','G'], ans: 'K', why: `Gaps increase: +1, +2, +3, +4. G + 4 = K.` }; },
      () => { return { seq: ['Z','X','V','T'], ans: 'R', why: `Backwards, skipping one each time.` }; },
      () => { return { seq: ['B','D','F','H'], ans: 'J', why: `Every other letter starting from B.` }; },
      () => { const i = this.rand(0, 8);
        return { seq: [A[i],A[i+4],A[i+8],A[i+12]], ans: A[i+16], why: `Skip three letters each time.` }; },
      () => { return { seq: ['Z','Y','W','T'], ans: 'P', why: `Going back by 1, then 2, then 3, then 4.` }; },
      () => { return { seq: ['A','C','F','J'], ans: 'O', why: `Gaps increase: +2, +3, +4, +5. J + 5 = O.` }; },
      () => { return { seq: ['M','N','P','S'], ans: 'W', why: `Gaps increase: +1, +2, +3, +4. S + 4 = W.` }; },
    ];
    
    const p = this.pick(patterns)();
    const wrong = A.split('').filter(l => l !== p.ans);
    return {
      type: 'letterSeq', category: 'patternRecognition', categoryLabel: 'Letter Pattern',
      difficulty: 1.0, question: 'What letter comes next?',
      sequence: p.seq, answer: p.ans,
      options: this.shuffle([p.ans, ...this.shuffle(wrong).slice(0, 3)]),
      explanation: p.why, visual: 'letterSequence'
    };
  },

  matrix() {
    const type = this.rand(0, 5);
    let grid, ans, why;
    
    if (type === 0) {
      const sum = this.rand(12, 27);
      const a=this.rand(2,8), b=this.rand(2,8), c=sum-a-b;
      const d=this.rand(2,8), e=this.rand(2,8), f=sum-d-e;
      const g=this.rand(2,8), h=this.rand(2,8);
      ans = sum-g-h; grid = [a,b,c,d,e,f,g,h,'?'];
      why = `Each row sums to ${sum}. Last row: ${g} + ${h} + ? = ${sum}, so ? = ${ans}`;
    } else if (type === 1) {
      const add = this.rand(2, 6);
      const r = [this.rand(1,7), this.rand(1,7), this.rand(1,7)];
      grid = [...r, r[0]+add, r[1]+add, r[2]+add, r[0]+add*2, r[1]+add*2, '?'];
      ans = r[2]+add*2; why = `Each column increases by ${add}. Third column: ${r[2]}, ${r[2]+add}, ${ans}`;
    } else if (type === 2) {
      const a=this.rand(2,5), b=this.rand(2,5);
      const d=this.rand(2,5), e=this.rand(2,5);
      const g=this.rand(2,5), h=this.rand(2,5);
      grid = [a,b,a*b, d,e,d*e, g,h,'?']; ans = g*h;
      why = `Each row: first x second = third. ${g} x ${h} = ${ans}`;
    } else if (type === 3) {
      const m = 2;
      const a=this.rand(2,5), b=this.rand(2,5), c=this.rand(2,5);
      grid = [a,b,c, a*m,b*m,c*m, a*m*m,b*m*m,'?']; ans = c*m*m;
      why = `Each row multiplies by ${m}. So ${c*m} x ${m} = ${ans}`;
    } else if (type === 4) {
      // Diagonal pattern
      const a=this.rand(2,6), add=this.rand(1,4);
      grid = [a, a+1, a+2, a+add, a+add+1, a+add+2, a+add*2, a+add*2+1, '?'];
      ans = a+add*2+2; why = `Numbers increase by 1 across and ${add} down. ? = ${ans}`;
    } else {
      // Column sums
      const colSum = this.rand(12, 20);
      const a=this.rand(2,6), d=this.rand(2,6), g=colSum-a-d;
      const b=this.rand(2,6), e=this.rand(2,6), h=colSum-b-e;
      const c=this.rand(2,6), f=this.rand(2,6); ans = colSum-c-f;
      grid = [a,b,c,d,e,f,g,h,'?'];
      why = `Each column sums to ${colSum}. Last column: ${c} + ${f} + ? = ${colSum}, so ? = ${ans}`;
    }
    
    return {
      type: 'matrix', category: 'patternRecognition', categoryLabel: 'Matrix Logic',
      difficulty: 1.3, question: 'Find the missing number',
      grid, answer: String(ans), options: this.numOpts(ans).map(String),
      explanation: why, visual: 'matrix'
    };
  },

  series() {
    const items = [
      { q: 'J, F, M, A, M, J, ?', a: 'J', w: ['A','S','D'], why: 'First letters of months. July = J.' },
      { q: 'S, M, T, W, T, F, ?', a: 'S', w: ['M','T','W'], why: 'First letters of weekdays. Saturday = S.' },
      { q: 'O, T, T, F, F, S, S, ?', a: 'E', w: ['N','T','S'], why: 'First letters of numbers (One, Two...). Eight = E.' },
      { q: 'R, O, Y, G, B, I, ?', a: 'V', w: ['P','R','O'], why: 'Rainbow colors. Violet = V.' },
      { q: 'M, V, E, M, J, S, U, ?', a: 'N', w: ['P','E','M'], why: 'Planets from the Sun. Neptune = N.' },
      { q: 'W, S, S, A, W, ?', a: 'S', w: ['W','A','F'], why: 'Seasons repeating: Winter, Spring, Summer, Autumn, Winter, Spring.' },
      { q: 'H, He, Li, Be, B, C, ?', a: 'N', w: ['O','F','Ne'], why: 'Chemical elements in order. Nitrogen = N.' },
      { q: 'I, II, III, IV, V, VI, ?', a: 'VII', w: ['VIII','IIV','VV'], why: 'Roman numerals in order. 7 = VII.' },
      { q: 'Do, Re, Mi, Fa, Sol, La, ?', a: 'Ti', w: ['Do','Si','Se'], why: 'Musical scale (solfege). After La comes Ti.' },
      { q: 'N, S, E, ?', a: 'W', w: ['N','S','NE'], why: 'Cardinal compass directions: North, South, East, West.' },
    ];
    const i = this.pick(items);
    return {
      type: 'series', category: 'patternRecognition', categoryLabel: 'Complete the Series',
      difficulty: 1.4, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  shapePattern() {
    const items = [
      { q: 'Triangle (3), Square (4), Pentagon (5), Hexagon (6), ?', a: 'Heptagon (7)', w: ['Octagon (8)', 'Hexagon (6)', 'Pentagon (5)'], why: 'Polygons with increasing sides. After 6 comes 7 sides = heptagon.' },
      { q: 'A shape has 4 equal sides and 4 right angles. What is it?', a: 'Square', w: ['Rectangle', 'Rhombus', 'Trapezoid'], why: 'A square has 4 equal sides and 4 right angles.' },
      { q: 'How many faces does a cube have?', a: '6', w: ['4', '8', '12'], why: 'A cube has 6 faces (top, bottom, front, back, left, right).' },
      { q: 'If you cut a square diagonally, what two shapes do you get?', a: 'Two triangles', w: ['Two rectangles', 'Two trapezoids', 'A triangle and a pentagon'], why: 'A diagonal cut through a square creates two right triangles.' },
      { q: 'How many edges does a triangular pyramid (tetrahedron) have?', a: '6', w: ['4', '8', '3'], why: 'A tetrahedron has 4 faces, 4 vertices, and 6 edges.' },
      { q: 'What shape has the most sides: hexagon, octagon, or pentagon?', a: 'Octagon', w: ['Hexagon', 'Pentagon', 'They are equal'], why: 'Octagon = 8 sides, hexagon = 6, pentagon = 5.' },
      { q: 'How many lines of symmetry does a regular hexagon have?', a: '6', w: ['3', '4', '8'], why: 'A regular hexagon has 6 lines of symmetry.' },
      { q: 'How many degrees in the angles of a triangle combined?', a: '180', w: ['90', '360', '270'], why: 'The interior angles of any triangle always sum to 180 degrees.' },
    ];
    const i = this.pick(items);
    return {
      type: 'shapePattern', category: 'patternRecognition', categoryLabel: 'Shape Logic',
      difficulty: 1.2, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // PROBLEM SOLVING
  // ═══════════════════════════════════════════════════

  codeBreak() {
    const items = [
      { q: 'If A=1, B=2, C=3... what is A+B+C?', a: '6', w: ['3','9','5'], why: '1+2+3 = 6' },
      { q: 'If X=5 and Y=3, what is X+Y+X?', a: '13', w: ['11','8','15'], why: '5+3+5 = 13' },
      { q: 'If N+N=10, what is N?', a: '5', w: ['10','4','6'], why: '2N=10, N=5' },
      { q: 'If A=1, B=2... what is D+E?', a: '9', w: ['7','8','10'], why: 'D=4, E=5. 4+5 = 9' },
      { q: 'If X times X = 25, what is X?', a: '5', w: ['4','6','25'], why: '5 x 5 = 25' },
      { q: 'If M=4, what is M x M - M?', a: '12', w: ['8','16','0'], why: '4 x 4 = 16, 16 - 4 = 12' },
      { q: 'If P x 3 = 18, what is P?', a: '6', w: ['3','9','18'], why: '18 / 3 = 6' },
      { q: 'If A=1, B=2... what is A x B x C?', a: '6', w: ['3','9','12'], why: '1 x 2 x 3 = 6' },
      { q: 'If X + Y = 10 and X = 4, what is Y?', a: '6', w: ['4','5','10'], why: '10 - 4 = 6' },
      { q: 'If A=2, B=4, C=6... what is E?', a: '10', w: ['8','12','5'], why: 'Each letter = position x 2. E is 5th, so 10.' },
      { q: 'If X/2 = 7, what is X?', a: '14', w: ['7','9','12'], why: 'X = 7 x 2 = 14' },
      { q: 'If 2X - 3 = 7, what is X?', a: '5', w: ['4','6','7'], why: '2X = 10, X = 5' },
      { q: 'If A=1, B=2... what is Z?', a: '26', w: ['24','25','28'], why: 'Z is the 26th letter.' },
      { q: 'If N x N x N = 27, what is N?', a: '3', w: ['9','6','4'], why: '3 x 3 x 3 = 27' },
      { q: 'If X + X + X + X = 48, what is X?', a: '12', w: ['8','16','24'], why: '4X = 48, X = 12' },
      { q: 'If A=5, what is A squared minus A?', a: '20', w: ['25','10','15'], why: '25 - 5 = 20' },
    ];
    const i = this.pick(items);
    return {
      type: 'codeBreak', category: 'problemSolving', categoryLabel: 'Code Breaker',
      difficulty: 1.2, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  riddle() {
    const items = [
      { q: 'I have hands but cannot clap. What am I?', a: 'A clock', w: ['A person','A robot','A tree'], why: 'A clock has hands but cannot clap.' },
      { q: 'What has keys but no locks?', a: 'A piano', w: ['A door','A car','A safe'], why: 'A piano has musical keys.' },
      { q: 'What gets wetter the more it dries?', a: 'A towel', w: ['A sponge','Paper','The sun'], why: 'A towel absorbs water while drying things.' },
      { q: 'What has a head and tail but no body?', a: 'A coin', w: ['A snake','A fish','A ghost'], why: 'Coins have heads and tails.' },
      { q: 'What can you catch but not throw?', a: 'A cold', w: ['A ball','A fish','A wave'], why: 'You catch a cold but cannot throw it.' },
      { q: 'I am tall when young, short when old. What am I?', a: 'A candle', w: ['A person','A tree','A building'], why: 'Candles shorten as they burn.' },
      { q: 'What runs but never walks?', a: 'Water', w: ['A dog','A car','Time'], why: 'Water runs (flows) but does not walk.' },
      { q: 'What has teeth but cannot bite?', a: 'A comb', w: ['A shark','A dog','A saw'], why: 'A comb has teeth for hair.' },
      { q: 'What goes up but never comes down?', a: 'Your age', w: ['A balloon','A bird','Smoke'], why: 'Your age only increases.' },
      { q: 'What can fill a room but takes no space?', a: 'Light', w: ['Air','Water','Sound'], why: 'Light fills a room with no mass.' },
      { q: 'What has a neck but no head?', a: 'A bottle', w: ['A giraffe','A shirt','A guitar'], why: 'Bottles have necks.' },
      { q: 'What has one eye but cannot see?', a: 'A needle', w: ['A pirate','A cyclops','A camera'], why: 'A needle has an eye for thread.' },
      { q: 'The more you take, the more you leave behind. What?', a: 'Footsteps', w: ['Money','Time','Breath'], why: 'Walking leaves footsteps behind.' },
      { q: 'What has words but never speaks?', a: 'A book', w: ['A parrot','A phone','A radio'], why: 'Books have words but cannot speak.' },
      { q: 'What breaks but never falls, and falls but never breaks?', a: 'Day and Night', w: ['Glass','Waves','Dreams'], why: 'Day breaks, night falls.' },
      { q: 'What can travel around the world while staying in a corner?', a: 'A stamp', w: ['A compass','The internet','A satellite'], why: 'Stamps stay in the corner of envelopes.' },
      { q: 'What has a ring but no finger?', a: 'A phone', w: ['A planet','A tree','A bell'], why: 'Phones ring.' },
      { q: 'I have cities but no houses. I have mountains but no trees. What am I?', a: 'A map', w: ['A planet','A dream','A story'], why: 'Maps show cities and mountains without real objects.' },
      { q: 'What is always in front of you but cannot be seen?', a: 'The future', w: ['Your nose','Air','Light'], why: 'The future is ahead but invisible.' },
      { q: 'What has legs but does not walk?', a: 'A table', w: ['A snake','A chair','A worm'], why: 'Tables have legs but cannot walk.' },
    ];
    const i = this.pick(items);
    return {
      type: 'riddle', category: 'problemSolving', categoryLabel: 'Riddle',
      difficulty: 1.2, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  wordProblem() {
    const items = [
      () => { const a=this.rand(3,8), p=this.rand(2,5); return { q: `A store sells ${a} apples for $${p}. How much for ${a*3} apples?`, a: String(p*3), w: [String(p*2), String(p*4), String(p+3)], why: `${a*3} is 3 times ${a}, so cost is 3 x $${p} = $${p*3}` }; },
      () => { const t=this.rand(20,50), g=this.rand(5,15); return { q: `${t} students in class. ${g} are wearing glasses. How many are NOT wearing glasses?`, a: String(t-g), w: [String(t+g), String(g), String(t)], why: `${t} - ${g} = ${t-g} students without glasses.` }; },
      () => { const s=this.rand(30,60), r=this.rand(5,15); return { q: `A train travels ${s} miles per hour. How far in ${r===5?'5':r===10?'10':'15'} minutes?`, a: String(s*r/60), w: [String(s), String(s*2), String(Math.round(s/r))], why: `${r} min = ${r}/60 of an hour. ${s} x ${r}/60 = ${s*r/60} miles.` }; },
      () => { const each=this.rand(3,8), n=this.rand(4,10), total=each*n, paid=Math.ceil(total/10)*10; return { q: `You buy ${n} items at $${each} each. You pay with $${paid}. Change?`, a: '$'+String(paid-total), w: ['$'+String(paid-total+1), '$'+String(paid-total-1), '$'+String(each)], why: `${n} x $${each} = $${total}. $${paid} - $${total} = $${paid-total}.` }; },
      () => { const d1=this.rand(3,8), d2=this.rand(3,8), d3=this.rand(3,8); const avg=Math.round((d1+d2+d3)/3); return { q: `3 dice show ${d1}, ${d2}, and ${d3}. What's the total?`, a: String(d1+d2+d3), w: [String(d1+d2+d3+1), String(d1+d2+d3-2), String(avg)], why: `${d1} + ${d2} + ${d3} = ${d1+d2+d3}` }; },
      () => { const pages=this.rand(200,400), read=this.rand(50,150); return { q: `A book has ${pages} pages. You've read ${read}. What fraction is left?`, a: `${pages-read}/${pages}`, w: [`${read}/${pages}`, `${pages}/${read}`, `${Math.round(read/pages*100)}%`], why: `${pages} - ${read} = ${pages-read} pages left, so ${pages-read}/${pages}.` }; },
      () => { const base=this.rand(5,12), h=this.rand(4,10); return { q: `A rectangle is ${base}cm wide and ${h}cm tall. What's the perimeter?`, a: String((base+h)*2)+'cm', w: [String(base*h)+'cm', String(base+h)+'cm', String(base*h*2)+'cm'], why: `Perimeter = 2 x (${base} + ${h}) = ${(base+h)*2}cm.` }; },
      () => { const speed=this.rand(4,10)*10, time=this.rand(2,5); return { q: `Driving at ${speed} mph for ${time} hours. Distance traveled?`, a: String(speed*time)+' miles', w: [String(speed+time)+' miles', String(speed*time+speed)+' miles', String(speed*(time-1))+' miles'], why: `Distance = speed x time = ${speed} x ${time} = ${speed*time} miles.` }; },
    ];
    const gen = this.pick(items)();
    return {
      type: 'wordProblem', category: 'problemSolving', categoryLabel: 'Word Problem',
      difficulty: 1.3, question: gen.q, answer: gen.a,
      options: this.shuffle([gen.a, ...gen.w]), explanation: gen.why, visual: 'text'
    };
  },

  logicGrid() {
    const items = [
      { q: 'Amy has a dog. Ben has a cat. The pet owner who lives on Oak St has a dog. Who lives on Oak St?', a: 'Amy', w: ['Ben','Neither','Both'], why: 'Amy has a dog, and the Oak St person has a dog, so Amy lives on Oak St.' },
      { q: 'Red box has coins. Blue box has keys. Green box is empty. Which box should you open to find something valuable?', a: 'Red box', w: ['Blue box','Green box','None'], why: 'Red box has coins which are valuable.' },
      { q: 'All teachers have degrees. Maria has a degree. Is Maria a teacher?', a: 'Not necessarily', w: ['Yes','No','Always'], why: 'All teachers have degrees, but not all degree holders are teachers.' },
      { q: 'If no A is B, and no B is C, can A be C?', a: 'Yes, possibly', w: ['No','Never','Only sometimes'], why: 'No A is B and no B is C does not prevent A from being C.' },
      { q: 'Three boxes labeled wrong. One says Apples, one Oranges, one Mixed. You pick from Mixed and get an apple. What does the Mixed box actually contain?', a: 'Apples', w: ['Oranges','Mixed','Cannot tell'], why: 'Since all labels are wrong and you got an apple, the "Mixed" box must be Apples.' },
    ];
    const i = this.pick(items);
    return {
      type: 'logicGrid', category: 'problemSolving', categoryLabel: 'Logic Puzzle',
      difficulty: 1.5, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // MENTAL AGILITY
  // ═══════════════════════════════════════════════════

  math() {
    const ops = [
      () => { const a=this.rand(12,88), b=this.rand(8,55); return { q:`${a} + ${b}`, a:a+b, w:`${a}+${b}=${a+b}` }; },
      () => { const a=this.rand(40,99), b=this.rand(10,39); return { q:`${a} - ${b}`, a:a-b, w:`${a}-${b}=${a-b}` }; },
      () => { const a=this.rand(3,14), b=this.rand(3,14); return { q:`${a} x ${b}`, a:a*b, w:`${a}x${b}=${a*b}` }; },
      () => { const b=this.rand(2,12), a=b*this.rand(3,12); return { q:`${a} / ${b}`, a:a/b, w:`${a}/${b}=${a/b}` }; },
      () => { const n=this.rand(4,14); return { q:`${n} squared`, a:n*n, w:`${n}x${n}=${n*n}` }; },
      () => { const b=this.rand(2,10)*20, p=[10,20,25,50][this.rand(0,3)]; return { q:`${p}% of ${b}`, a:b*p/100, w:`${p}% of ${b}=${b*p/100}` }; },
      () => { const a=this.rand(15,60), b=this.rand(10,30), c=this.rand(5,20); return { q:`${a} + ${b} - ${c}`, a:a+b-c, w:`${a}+${b}-${c}=${a+b-c}` }; },
      () => { const a=this.rand(2,6), b=this.rand(2,6), c=this.rand(2,6); return { q:`${a} x ${b} x ${c}`, a:a*b*c, w:`${a}x${b}x${c}=${a*b*c}` }; },
      () => { const a=this.rand(2,9), b=this.rand(2,9); return { q:`${a}² + ${b}²`, a:a*a+b*b, w:`${a*a}+${b*b}=${a*a+b*b}` }; },
      () => { const a=this.rand(100,300), b=this.rand(100,300); return { q:`${a} + ${b}`, a:a+b, w:`${a}+${b}=${a+b}` }; },
      () => { const a=this.rand(11,25), b=this.rand(2,9); return { q:`${a} x ${b}`, a:a*b, w:`${a}x${b}=${a*b}` }; },
      () => { const a=this.rand(2,5), b=this.rand(2,5); return { q:`${a}³ (${a} cubed)`, a:a**3, w:`${a}x${a}x${a}=${a**3}` }; },
      () => { const n=this.rand(10,50)*2; return { q:`Half of ${n} plus a quarter of ${n}`, a:n/2+n/4, w:`${n/2}+${n/4}=${n/2+n/4}` }; },
      () => { const a=this.rand(5,15), b=this.rand(5,15); return { q:`${a} x ${b} + ${a}`, a:a*b+a, w:`${a*b}+${a}=${a*b+a}` }; },
    ];
    const p = this.pick(ops)();
    return {
      type: 'math', category: 'mentalAgility', categoryLabel: 'Mental Math',
      difficulty: 1.1, question: `${p.q} = ?`, answer: String(p.a),
      options: this.numOpts(p.a).map(String), explanation: p.w, visual: 'text'
    };
  },

  missingNum() {
    const items = [
      () => { const a=this.rand(5,25), b=this.rand(5,25); return { q:`? + ${b} = ${a+b}`, a, why:`${a+b} - ${b} = ${a}` }; },
      () => { const a=this.rand(30,80), b=this.rand(10,25); return { q:`${a} - ? = ${a-b}`, a:b, why:`${a} - ${a-b} = ${b}` }; },
      () => { const a=this.rand(2,12), b=this.rand(2,12); return { q:`? x ${b} = ${a*b}`, a, why:`${a*b} / ${b} = ${a}` }; },
      () => { const a=this.rand(2,12), b=this.rand(2,12); return { q:`${a*b} / ? = ${a}`, a:b, why:`${a*b} / ${a} = ${b}` }; },
      () => { const a=this.rand(3,9), b=this.rand(3,9), c=this.rand(3,9); return { q:`? + ${b} + ${c} = ${a+b+c}`, a, why:`${a+b+c} - ${b} - ${c} = ${a}` }; },
      () => { const a=this.rand(2,8), b=this.rand(2,8); return { q:`? x ? = ${a*a} (same number)`, a, why:`${a} x ${a} = ${a*a}` }; },
      () => { const a=this.rand(2,6), b=this.rand(2,6); return { q:`(? x ${b}) + ${a} = ${a+a*b}`, a, why:`(${a} x ${b}) + ${a} = ${a*b} + ${a} = ${a+a*b}` }; },
    ];
    const p = this.pick(items)();
    return {
      type: 'missingNum', category: 'mentalAgility', categoryLabel: 'Find the Missing Number',
      difficulty: 1.2, question: p.q, answer: String(p.a),
      options: this.numOpts(p.a).map(String), explanation: p.why, visual: 'text'
    };
  },

  timeCalc() {
    const items = [
      () => { const h=this.rand(1,8), m=this.rand(15,50); return { q:`It's ${h}:${String(m).padStart(2,'0')} PM. What time is it in 2 hours?`, a:`${h+2}:${String(m).padStart(2,'0')} PM`, w:[`${h+1}:${String(m).padStart(2,'0')} PM`,`${h+3}:${String(m).padStart(2,'0')} PM`,`${h}:${String(m+20>59?'00':m+20).padStart(2,'0')} PM`], why:`Add 2 hours: ${h}:${String(m).padStart(2,'0')} + 2:00 = ${h+2}:${String(m).padStart(2,'0')} PM` }; },
      () => { const h1=this.rand(8,11), h2=this.rand(1,5); return { q:`How many hours from ${h1}:00 AM to ${h2}:00 PM?`, a:String(h2+12-h1), w:[String(h2+12-h1+1),String(h2+12-h1-1),String(h2)], why:`${h1} AM to noon = ${12-h1}h, noon to ${h2} PM = ${h2}h. Total = ${h2+12-h1}h.` }; },
      () => { const m=this.rand(2,8)*15; return { q:`How many minutes in ${m/60 < 1 ? m + ' minutes' : (m/60) + ' hours'}?`, a:String(m), w:[String(m+15),String(m-15),String(m*2)], why:`${m/60} hours x 60 = ${m} minutes.` }; },
      () => { const mins = this.rand(3,12)*30; const h = Math.floor(mins/60); const m = mins%60; return { q:`Convert ${mins} minutes to hours and minutes.`, a:`${h}h ${m}m`, w:[`${h+1}h ${m}m`,`${h}h ${m+15}m`,`${h-1}h ${m+60}m`], why:`${mins} / 60 = ${h} hours with ${m} minutes remaining.` }; },
      () => { const d=this.rand(2,8); return { q:`How many hours in ${d} days?`, a:String(d*24), w:[String(d*24+12),String(d*12),String(d*24-24)], why:`${d} x 24 = ${d*24} hours.` }; },
      () => { const w=this.rand(2,6); return { q:`How many days in ${w} weeks?`, a:String(w*7), w:[String(w*7+1),String(w*7-1),String(w*5)], why:`${w} x 7 = ${w*7} days.` }; },
    ];
    const gen = this.pick(items)();
    return {
      type: 'timeCalc', category: 'mentalAgility', categoryLabel: 'Time Math',
      difficulty: 1.2, question: gen.q, answer: gen.a,
      options: this.shuffle([gen.a, ...gen.w]), explanation: gen.why, visual: 'text'
    };
  },

  mentalChain() {
    const chains = [
      () => { const a=this.rand(5,15), b=this.rand(2,5), c=this.rand(3,10); const ans=a*b-c;
        return { q:`Start with ${a}, multiply by ${b}, subtract ${c}. What do you get?`, a:String(ans), w:[String(ans+2),String(ans-3),String(a+b-c)], why:`${a} x ${b} = ${a*b}, then - ${c} = ${ans}` }; },
      () => { const a=this.rand(50,100), b=this.rand(10,30), c=this.rand(2,5); const ans=(a-b)*c;
        return { q:`Take ${a}, subtract ${b}, multiply by ${c}. Result?`, a:String(ans), w:[String(ans+c),String(ans-b),String(a*c-b)], why:`${a} - ${b} = ${a-b}, then x ${c} = ${ans}` }; },
      () => { const a=this.rand(2,6), b=this.rand(2,6); const ans=a*a+b*b;
        return { q:`Square ${a}, square ${b}, add them together. Result?`, a:String(ans), w:[String(ans+1),String(a*b),String((a+b)**2)], why:`${a}² = ${a*a}, ${b}² = ${b*b}. Sum = ${ans}` }; },
      () => { const a=this.rand(100,200), b=this.rand(2,4); const ans=a/b;
        return { q:`Divide ${a} by ${b/b===1?b:b}. What's half of that?`, a:String(ans/2), w:[String(ans),String(ans/2+1),String(a/2)], why:`${a}/${b} = ${ans}. Half of ${ans} = ${ans/2}` }; },
    ];
    const gen = this.pick(chains)();
    return {
      type: 'mentalChain', category: 'mentalAgility', categoryLabel: 'Chain Calculation',
      difficulty: 1.4, question: gen.q, answer: gen.a,
      options: this.shuffle([gen.a, ...gen.w]), explanation: gen.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // WORKING MEMORY
  // ═══════════════════════════════════════════════════

  memoryTask() {
    const items = [
      () => {
        const word = this.pick(['BRAIN','SMART','THINK','LEARN','QUICK','POWER','LIGHT','DREAM','SPACE','WORLD','HEART','STONE','FLAME','CLOUD','STORM','OCEAN','RIVER','MUSIC','PIZZA','TIGER','LEMON','GRAPE','SWORD','CHESS','CROWN','EAGLE','FROST','HONEY','JUDGE','KNOCK']);
        const rev = word.split('').reverse().join('');
        const w1 = word.split('').reverse().map((c,i) => i===1?word[1]:c).join('');
        const w2 = word.split('').reverse().map((c,i) => i===0?word[0]:c).join('');
        return { q:`What is "${word}" spelled backwards?`, a:rev, w:[w1,w2,word].filter(x=>x!==rev).slice(0,3), why:`${word} backwards = ${rev}` };
      },
      () => {
        const nums = [this.rand(2,9),this.rand(2,9),this.rand(2,9),this.rand(2,9)];
        const sum = nums.reduce((a,b)=>a+b,0);
        return { q:`Add in your head: ${nums.join(', ')}`, a:String(sum), w:[String(sum+2),String(sum-1),String(sum+3)], why:`${nums.join(' + ')} = ${sum}` };
      },
      () => {
        const nums = [this.rand(10,50),this.rand(10,50),this.rand(10,50)];
        const sorted = [...nums].sort((a,b)=>a-b);
        return { q:`What is the middle value of: ${nums.join(', ')}?`, a:String(sorted[1]), w:[String(sorted[0]),String(sorted[2]),String(sorted[1]+1)], why:`Sorted: ${sorted.join(', ')}. Middle = ${sorted[1]}` };
      },
      () => {
        const a=this.rand(2,8), b=this.rand(2,8), c=this.rand(2,8);
        const ans = a*b+c;
        return { q:`${a} x ${b}, then + ${c} = ?`, a:String(ans), w:[String(ans+2),String(ans-3),String(a+b+c)], why:`${a}x${b}=${a*b}, +${c}=${ans}` };
      },
      () => {
        const word = this.pick(['PLANET','GARDEN','CASTLE','BRIDGE','SILVER','ORANGE','WINTER','FOREST','SUNSET','VOYAGE','MARKET','BASKET','PENCIL','ROCKET','TUNNEL','MUFFIN','BUTTER','PIRATE','VELVET','ANCHOR']);
        const pos = this.rand(2,4);
        const letter = word[pos];
        const ordinals = ['','','3rd','4th','5th'];
        return { q:`In "${word}", what is the ${ordinals[pos]} letter?`, a:letter, w:this.shuffle(word.split('').filter(l=>l!==letter)).slice(0,3), why:`${word}: the ${ordinals[pos]} letter is ${letter}` };
      },
      () => {
        const a=this.rand(20,60), b=this.rand(10,30), c=this.rand(5,15);
        const ans = a-b+c;
        return { q:`Start at ${a}, subtract ${b}, add ${c}. Result?`, a:String(ans), w:[String(ans+3),String(ans-2),String(a-b-c)], why:`${a}-${b}=${a-b}, +${c}=${ans}` };
      },
      () => {
        const items = this.shuffle(['Red','Blue','Green','Yellow','Purple']);
        const pos = this.rand(0,4);
        const ordinals = ['first','second','third','fourth','last'];
        return { q:`In this list: ${items.join(', ')} — which is ${ordinals[pos]}?`, a:items[pos], w:this.shuffle(items.filter(i=>i!==items[pos])).slice(0,3), why:`${items[pos]} is in the ${ordinals[pos]} position.` };
      },
      () => {
        const nums = [this.rand(10,30),this.rand(10,30),this.rand(10,30),this.rand(10,30),this.rand(10,30)];
        const max = Math.max(...nums);
        return { q:`What's the largest number? ${nums.join(', ')}`, a:String(max), w:this.shuffle(nums.filter(n=>n!==max).map(String)).slice(0,3), why:`${max} is the largest among ${nums.join(', ')}` };
      },
      () => {
        const a=this.rand(3,9), b=this.rand(3,9), c=this.rand(3,9);
        const product = a*b*c;
        return { q:`${a} x ${b} x ${c} = ?`, a:String(product), w:[String(product+a),String(product-b),String(a+b+c)], why:`${a}x${b}=${a*b}, x${c}=${product}` };
      },
      () => {
        const word = this.pick(['ELEPHANT','COMPUTER','DINOSAUR','SANDWICH','MOUNTAIN','UMBRELLA','CALENDAR','BACKPACK','AVOCADO','BASEBALL','KANGAROO','SWIMMING','ABSOLUTE','BIRTHDAY']);
        const count = word.length;
        return { q:`How many letters in "${word}"?`, a:String(count), w:[String(count-1),String(count+1),String(count+2)], why:`${word} has ${count} letters.` };
      },
      () => {
        const nums = [this.rand(2,9),this.rand(2,9),this.rand(2,9),this.rand(2,9),this.rand(2,9)];
        const sum = nums.reduce((a,b)=>a+b,0);
        return { q:`Sum of: ${nums.join(', ')} = ?`, a:String(sum), w:[String(sum+1),String(sum-2),String(sum+3)], why:`${nums.join('+')} = ${sum}` };
      },
    ];
    const gen = this.pick(items)();
    return {
      type: 'memoryTask', category: 'workingMemory', categoryLabel: 'Working Memory',
      difficulty: 1.2, question: gen.q, answer: gen.a,
      options: this.shuffle([gen.a, ...gen.w.filter(w=>w!==gen.a).slice(0,3)]),
      explanation: gen.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // VERBAL REASONING
  // ═══════════════════════════════════════════════════

  analogy() {
    const items = [
      { a:'Hot', b:'Cold', c:'Up', d:'Down', why:'Opposites.' },
      { a:'Puppy', b:'Dog', c:'Kitten', d:'Cat', why:'Young to adult.' },
      { a:'Bird', b:'Nest', c:'Bee', d:'Hive', why:'Animal to home.' },
      { a:'Eye', b:'See', c:'Ear', d:'Hear', why:'Organ to function.' },
      { a:'Fish', b:'Swim', c:'Bird', d:'Fly', why:'Animal to movement.' },
      { a:'Author', b:'Book', c:'Chef', d:'Meal', why:'Creator to creation.' },
      { a:'Pen', b:'Write', c:'Knife', d:'Cut', why:'Tool to action.' },
      { a:'Day', b:'Night', c:'Summer', d:'Winter', why:'Opposite pairs.' },
      { a:'Cow', b:'Milk', c:'Bee', d:'Honey', why:'Producer to product.' },
      { a:'Foot', b:'Shoe', c:'Hand', d:'Glove', why:'Body part to covering.' },
      { a:'Lock', b:'Key', c:'Question', d:'Answer', why:'Problem to solution.' },
      { a:'Doctor', b:'Hospital', c:'Teacher', d:'School', why:'Worker to workplace.' },
      { a:'Moon', b:'Night', c:'Sun', d:'Day', why:'Light source to time.' },
      { a:'Rain', b:'Wet', c:'Sun', d:'Dry', why:'Cause to effect.' },
      { a:'Hungry', b:'Eat', c:'Tired', d:'Sleep', why:'Feeling to remedy.' },
      { a:'Finger', b:'Hand', c:'Toe', d:'Foot', why:'Part to whole.' },
      { a:'Leaf', b:'Tree', c:'Petal', d:'Flower', why:'Part to plant.' },
      { a:'Painter', b:'Canvas', c:'Writer', d:'Paper', why:'Artist to medium.' },
      { a:'Wheel', b:'Car', c:'Wing', d:'Plane', why:'Part to vehicle.' },
      { a:'Library', b:'Books', c:'Museum', d:'Art', why:'Building to contents.' },
      { a:'Seed', b:'Plant', c:'Egg', d:'Bird', why:'Beginning to grown form.' },
      { a:'Carpenter', b:'Wood', c:'Sculptor', d:'Stone', why:'Craftsperson to material.' },
      { a:'Ship', b:'Harbor', c:'Plane', d:'Airport', why:'Vehicle to port.' },
      { a:'Page', b:'Book', c:'Scene', d:'Movie', why:'Section to whole.' },
      { a:'Sail', b:'Wind', c:'Engine', d:'Fuel', why:'Mechanism to energy source.' },
      { a:'Stage', b:'Actor', c:'Court', d:'Judge', why:'Setting to professional.' },
      { a:'Map', b:'Geography', c:'Clock', d:'Time', why:'Tool to what it measures.' },
      { a:'Violin', b:'Orchestra', c:'Soldier', d:'Army', why:'Individual to group.' },
      { a:'Telescope', b:'Stars', c:'Microscope', d:'Cells', why:'Tool to what it observes.' },
      { a:'Pilot', b:'Sky', c:'Captain', d:'Sea', why:'Navigator to domain.' },
    ];
    const i = this.pick(items);
    const wrong = items.filter(x => x.d !== i.d).map(x => x.d);
    return {
      type: 'analogy', category: 'verbalReasoning', categoryLabel: 'Analogy',
      difficulty: 1.2, question: `${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer: i.d, options: this.shuffle([i.d, ...this.shuffle(wrong).slice(0,3)]),
      explanation: i.why, visual: 'text'
    };
  },

  verbal() {
    const vocab = [
      { q:'What is the opposite of "ancient"?', a:'Modern', w:['Old','Historic','Antique'], why:'Ancient = very old; modern = current.' },
      { q:'What word means the same as "rapid"?', a:'Fast', w:['Slow','Steady','Calm'], why:'Rapid = fast.' },
      { q:'What is the opposite of "expand"?', a:'Shrink', w:['Grow','Stretch','Increase'], why:'Expand = get bigger; shrink = get smaller.' },
      { q:'What word means the same as "enormous"?', a:'Huge', w:['Tiny','Small','Medium'], why:'Enormous = huge.' },
      { q:'What is the opposite of "generous"?', a:'Selfish', w:['Kind','Giving','Nice'], why:'Generous = giving; selfish = keeping.' },
      { q:'What word means the same as "angry"?', a:'Furious', w:['Happy','Calm','Sad'], why:'Angry = furious.' },
      { q:'What is the opposite of "brave"?', a:'Cowardly', w:['Bold','Strong','Fierce'], why:'Brave = courageous; cowardly = lacking courage.' },
      { q:'What word means the same as "quiet"?', a:'Silent', w:['Loud','Noisy','Booming'], why:'Quiet = silent.' },
      { q:'What is the opposite of "simple"?', a:'Complex', w:['Easy','Basic','Plain'], why:'Simple = easy; complex = complicated.' },
      { q:'What word means the same as "intelligent"?', a:'Smart', w:['Dumb','Slow','Simple'], why:'Intelligent = smart.' },
      { q:'What is the opposite of "reveal"?', a:'Conceal', w:['Show','Expose','Display'], why:'Reveal = show; conceal = hide.' },
      { q:'What word means the same as "wealthy"?', a:'Rich', w:['Poor','Cheap','Broke'], why:'Wealthy = rich.' },
      { q:'What is the opposite of "temporary"?', a:'Permanent', w:['Brief','Short','Fleeting'], why:'Temporary = short-lived; permanent = forever.' },
      { q:'What word means the same as "cautious"?', a:'Careful', w:['Reckless','Bold','Wild'], why:'Cautious = careful.' },
      { q:'What is the opposite of "transparent"?', a:'Opaque', w:['Clear','Visible','Obvious'], why:'Transparent = see-through; opaque = not see-through.' },
      { q:'What word means the same as "peculiar"?', a:'Strange', w:['Normal','Common','Regular'], why:'Peculiar = strange.' },
      { q:'What is the opposite of "abundant"?', a:'Scarce', w:['Plenty','Many','Full'], why:'Abundant = lots; scarce = very little.' },
      { q:'What word means the same as "benevolent"?', a:'Kind', w:['Cruel','Cold','Mean'], why:'Benevolent = kind and generous.' },
      { q:'What is the opposite of "rigid"?', a:'Flexible', w:['Hard','Stiff','Firm'], why:'Rigid = stiff; flexible = bendable.' },
      { q:'What word means the same as "melancholy"?', a:'Sad', w:['Happy','Excited','Calm'], why:'Melancholy = deep sadness.' },
      { q:'What is the opposite of "arrogant"?', a:'Humble', w:['Proud','Bold','Loud'], why:'Arrogant = overly proud; humble = modest.' },
      { q:'What word means the same as "diligent"?', a:'Hardworking', w:['Lazy','Careless','Slow'], why:'Diligent = hardworking.' },
      { q:'What is the opposite of "triumph"?', a:'Defeat', w:['Victory','Success','Win'], why:'Triumph = victory; defeat = loss.' },
      { q:'What word means the same as "fragile"?', a:'Delicate', w:['Strong','Tough','Solid'], why:'Fragile = delicate, easily broken.' },
    ];
    const v = this.pick(vocab);
    return {
      type: 'verbal', category: 'verbalReasoning', categoryLabel: 'Vocabulary',
      difficulty: 1.1, question: v.q, answer: v.a,
      options: this.shuffle([v.a, ...v.w]), explanation: v.why, visual: 'text'
    };
  },

  wordLink() {
    const items = [
      { first:'FIRE', second:'OUT', a:'WORK', w:['PLACE','SIDE','FIGHT'], why:'FIREWORK and WORKOUT.' },
      { first:'BOOK', second:'HOLE', a:'WORM', w:['CASE','MARK','SHELF'], why:'BOOKWORM and WORMHOLE.' },
      { first:'SUN', second:'HOUSE', a:'LIGHT', w:['BURN','SET','RISE'], why:'SUNLIGHT and LIGHTHOUSE.' },
      { first:'FOOT', second:'ROOM', a:'BALL', w:['NOTE','STEP','PRINT'], why:'FOOTBALL and BALLROOM.' },
      { first:'HEAD', second:'STAND', a:'BAND', w:['LINE','SET','PHONE'], why:'HEADBAND and BANDSTAND.' },
      { first:'TOOTH', second:'POCKET', a:'PICK', w:['BRUSH','PASTE','ACHE'], why:'TOOTHPICK and PICKPOCKET.' },
      { first:'DOOR', second:'TOWER', a:'BELL', w:['KNOB','STEP','WAY'], why:'DOORBELL and BELLTOWER.' },
      { first:'BASE', second:'GAME', a:'BALL', w:['LINE','CAMP','BOARD'], why:'BASEBALL and BALLGAME.' },
      { first:'BACK', second:'WORK', a:'FIRE', w:['HAND','YARD','BONE'], why:'BACKFIRE and FIREWORK.' },
      { first:'OUT', second:'LINE', a:'SIDE', w:['BACK','RUN','LAW'], why:'OUTSIDE and SIDELINE.' },
      { first:'DAY', second:'HOUSE', a:'LIGHT', w:['TIME','BREAK','DREAM'], why:'DAYLIGHT and LIGHTHOUSE.' },
      { first:'AIR', second:'HOLE', a:'PORT', w:['LINE','CRAFT','PLANE'], why:'AIRPORT and PORTHOLE.' },
      { first:'HAND', second:'DOWN', a:'SHAKE', w:['MADE','CUFF','RAIL'], why:'HANDSHAKE and SHAKEDOWN.' },
      { first:'SNOW', second:'PARK', a:'BALL', w:['FLAKE','MAN','DRIFT'], why:'SNOWBALL and BALLPARK.' },
      { first:'WATER', second:'OUT', a:'FALL', w:['MARK','PROOF','SIDE'], why:'WATERFALL and FALLOUT.' },
      { first:'BED', second:'TEMPERATURE', a:'ROOM', w:['TIME','SIDE','SHEET'], why:'BEDROOM and ROOM TEMPERATURE.' },
      { first:'STAR', second:'TANK', a:'FISH', w:['LIGHT','SHIP','DUST'], why:'STARFISH and FISHTANK.' },
      { first:'SAND', second:'WORK', a:'PAPER', w:['CASTLE','STORM','BOX'], why:'SANDPAPER and PAPERWORK.' },
      { first:'RAIN', second:'JACKET', a:'COAT', w:['DROP','BOW','STORM'], why:'RAINCOAT and COAT JACKET... wait. Actually just RAINCOAT and COATJACKET. Think of it as layered clothing terms.' },
      { first:'EAR', second:'WORM', a:'BOOK', w:['RING','DRUM','LOBE'], why:'EARBOOK... Actually: think of it as EAR + BOOK = EARBOOK? No. Let me fix: these are compound word bridges.' },
    ];
    // Only use validated ones
    const safe = items.slice(0, 18);
    const i = this.pick(safe);
    return {
      type: 'wordLink', category: 'verbalReasoning', categoryLabel: 'Word Link',
      difficulty: 1.3, question: `What word connects: ${i.first} ___ ${i.second}`,
      answer: i.a, options: this.shuffle([i.a, ...i.w]),
      explanation: i.why, visual: 'text'
    };
  },

  sentenceLogic() {
    const items = [
      { q: 'Which sentence is grammatically correct?', a: 'She and I went to the store.', w: ['Her and me went to the store.', 'Me and her went to the store.', 'Her and I went to the store.'], why: '"She and I" is correct as the subject of the sentence.' },
      { q: 'What does "break the ice" mean?', a: 'Start a conversation', w: ['Break something cold', 'Cause a problem', 'End a friendship'], why: '"Break the ice" means to initiate social interaction.' },
      { q: 'Which word best completes: "The cat sat ___ the mat"?', a: 'on', w: ['in', 'at', 'by'], why: '"Sat on" indicates sitting on top of a surface.' },
      { q: 'What does "once in a blue moon" mean?', a: 'Very rarely', w: ['Every month', 'At night', 'When it is cold'], why: '"Once in a blue moon" means something happens very rarely.' },
      { q: '"Actions speak louder than words" means:', a: 'What you do matters more than what you say', w: ['Be quiet', 'Talk loudly', 'Take action quickly'], why: 'This proverb emphasizes deeds over promises.' },
      { q: 'What does "the ball is in your court" mean?', a: "It's your turn to decide", w: ['You lost the game', 'Play basketball', 'You are at court'], why: 'It means the decision or next move is up to you.' },
      { q: 'Choose the correct word: "Their/There/They\'re going to the park."', a: "They're", w: ['Their', 'There', 'Theyre'], why: "They're = they are. Their = possessive. There = location." },
      { q: 'What does "cost an arm and a leg" mean?', a: 'Very expensive', w: ['Requires surgery', 'Involves sacrifice', 'Is physically painful'], why: 'This idiom means something is very costly.' },
    ];
    const i = this.pick(items);
    return {
      type: 'sentenceLogic', category: 'verbalReasoning', categoryLabel: 'Language Logic',
      difficulty: 1.1, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // LOGICAL REASONING
  // ═══════════════════════════════════════════════════

  oddOut() {
    const sets = [
      { items:['Apple','Banana','Carrot','Orange'], odd:'Carrot', why:'Carrot is a vegetable.' },
      { items:['Dog','Cat','Goldfish','Hamster'], odd:'Goldfish', why:'Goldfish lives underwater.' },
      { items:['Red','Blue','Square','Green'], odd:'Square', why:'Square is a shape, not a color.' },
      { items:['Piano','Guitar','Violin','Drums'], odd:'Drums', why:'Drums are percussion, others are melodic.' },
      { items:['Mars','Venus','Moon','Jupiter'], odd:'Moon', why:'Moon orbits Earth, others orbit the Sun.' },
      { items:['Dolphin','Shark','Whale','Seal'], odd:'Shark', why:'Shark is a fish, others are mammals.' },
      { items:['Python','Java','French','Ruby'], odd:'French', why:'French is a human language, others are code.' },
      { items:['Gold','Silver','Diamond','Copper'], odd:'Diamond', why:'Diamond is a gemstone, others are metals.' },
      { items:['Eagle','Penguin','Sparrow','Hawk'], odd:'Penguin', why:'Penguin cannot fly.' },
      { items:['Coffee','Tea','Juice','Bread'], odd:'Bread', why:'Bread is solid, others are drinks.' },
      { items:['Circle','Triangle','Red','Square'], odd:'Red', why:'Red is a color, others are shapes.' },
      { items:['January','Monday','March','December'], odd:'Monday', why:'Monday is a day, others are months.' },
      { items:['Hammer','Screwdriver','Banana','Wrench'], odd:'Banana', why:'Banana is food, others are tools.' },
      { items:['Oxygen','Iron','Copper','Gold'], odd:'Oxygen', why:'Oxygen is a gas, others are solid metals.' },
      { items:['Tennis','Chess','Basketball','Soccer'], odd:'Chess', why:'Chess is a board game, others are physical.' },
      { items:['Bike','Car','Boat','Truck'], odd:'Boat', why:'Boat travels on water.' },
      { items:['Rain','Snow','Hail','Wind'], odd:'Wind', why:'Wind is air movement, others are precipitation.' },
      { items:['Cello','Flute','Violin','Harp'], odd:'Flute', why:'Flute is wind, others are stringed.' },
      { items:['Mercury','Earth','Pluto','Saturn'], odd:'Pluto', why:'Pluto is a dwarf planet.' },
      { items:['Broccoli','Spinach','Strawberry','Kale'], odd:'Strawberry', why:'Strawberry is a fruit, others are greens.' },
      { items:['Hydrogen','Helium','Nitrogen','Iron'], odd:'Iron', why:'Iron is solid, others are gases.' },
      { items:['Beethoven','Mozart','Picasso','Bach'], odd:'Picasso', why:'Picasso was a painter, others were composers.' },
      { items:['Democracy','Monarchy','Republic','Capitalism'], odd:'Capitalism', why:'Capitalism is an economic system, others are government types.' },
      { items:['Atlantic','Pacific','Arctic','Sahara'], odd:'Sahara', why:'Sahara is a desert, others are oceans.' },
      { items:['Heart','Lungs','Brain','Femur'], odd:'Femur', why:'Femur is a bone, others are organs.' },
      { items:['Meter','Kilogram','Second','Dollar'], odd:'Dollar', why:'Dollar is currency, others are SI units.' },
    ];
    const s = this.pick(sets);
    return {
      type: 'oddOut', category: 'logicalReasoning', categoryLabel: 'Odd One Out',
      difficulty: 1.0, question: 'Which one doesn\'t belong?',
      answer: s.odd, options: this.shuffle(s.items),
      explanation: s.why, visual: 'text'
    };
  },

  logic() {
    const puzzles = [
      { q:'All cats have tails. Whiskers is a cat. Does Whiskers have a tail?', a:'Yes', w:['No','Maybe','Not enough info'], why:'All cats have tails + Whiskers is a cat = Whiskers has a tail.' },
      { q:'If it rains, the grass is wet. The grass is wet. Did it rain?', a:'Not necessarily', w:['Yes','No','Always'], why:'Grass could be wet from a sprinkler.' },
      { q:'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?', a:'Leo', w:['Jake','Kim','Cannot tell'], why:'Order: Jake, Kim, Leo. Leo is last.' },
      { q:'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?', a:'Not necessarily', w:['Yes','No','Always'], why:'Only SOME dogs bark loudly.' },
      { q:'No fish can walk. Salmon is a fish. Can salmon walk?', a:'No', w:['Yes','Maybe','Sometimes'], why:'No fish can walk, salmon is a fish.' },
      { q:'All roses are flowers. Some flowers fade quickly. Do all roses fade quickly?', a:'Not necessarily', w:['Yes','No','Always'], why:'Only SOME flowers fade quickly.' },
      { q:'Lisa runs faster than Mia. Mia runs faster than Nora. Who is fastest?', a:'Lisa', w:['Mia','Nora','Cannot tell'], why:'Lisa > Mia > Nora.' },
      { q:'If A > B and B > C, is A > C?', a:'Yes, always', w:['No','Sometimes','Cannot tell'], why:'Transitivity: if A>B and B>C, then A>C.' },
      { q:'All squares are rectangles. All rectangles have 4 sides. Do all squares have 4 sides?', a:'Yes', w:['No','Some do','Not necessarily'], why:'Squares are rectangles which have 4 sides.' },
      { q:'Sam is taller than Pat. Pat is taller than Chris. Is Sam taller than Chris?', a:'Yes', w:['No','Maybe','Cannot tell'], why:'Sam > Pat > Chris in height.' },
      { q:'If today is Tuesday, what day was it 3 days ago?', a:'Saturday', w:['Sunday','Monday','Friday'], why:'Tue → Mon → Sun → Sat. 3 days back = Saturday.' },
      { q:'Only birds have feathers. Penguins are birds. Do penguins have feathers?', a:'Yes', w:['No','Maybe','Only some'], why:'Penguins are birds, and all birds have feathers.' },
      { q:'If no mammals lay eggs, and a platypus lays eggs, what can we conclude?', a:'The statement is false', w:['Platypus is not a mammal','Nothing','Platypus is a bird'], why:'Platypus IS a mammal that lays eggs, so "no mammals lay eggs" is false.' },
      { q:'There are 3 boxes. One has gold. You pick Box 1. The host opens Box 3 (empty). Should you switch to Box 2?', a:'Yes, switching is better', w:['No, stay with Box 1','It doesn\'t matter','Not enough info'], why:'The Monty Hall problem: switching gives 2/3 chance vs 1/3.' },
      { q:'If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?', a:'Yes', w:['No','Maybe','Cannot determine'], why:'If A⊂B and B⊂C, then A⊂C. All bloops are lazzies.' },
    ];
    const p = this.pick(puzzles);
    return {
      type: 'logic', category: 'logicalReasoning', categoryLabel: 'Logic',
      difficulty: 1.3, question: p.q, answer: p.a,
      options: this.shuffle([p.a, ...p.w]), explanation: p.why, visual: 'text'
    };
  },

  truthTable() {
    const items = [
      { q: 'Statement: "If it\'s raining, I bring an umbrella." It\'s NOT raining. Can we say anything about the umbrella?', a: 'No, could go either way', w: ['I definitely have an umbrella', 'I definitely don\'t have one', 'The statement is false'], why: 'The "if" only tells us what happens when it rains. No rain = we can\'t conclude anything.' },
      { q: '"All dogs are loyal. Some loyal things are brave." Are all dogs brave?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'Only SOME loyal things are brave. Dogs are loyal but may not be in the brave subset.' },
      { q: 'True or False: "If A implies B, then not-B implies not-A"', a: 'True', w: ['False', 'Sometimes', 'Cannot determine'], why: 'This is the contrapositive, which is always logically equivalent.' },
      { q: '"None of my friends are boring." Tom is boring. What can we conclude?', a: 'Tom is not my friend', w: ['Tom is boring', 'I have no friends', 'Nothing'], why: 'Since no friends are boring and Tom IS boring, Tom cannot be a friend.' },
      { q: '"Either it will rain or snow tomorrow." It didn\'t rain. What happened?', a: 'It snowed', w: ['Nothing happened', 'It rained anyway', 'Cannot tell'], why: 'If one of two must happen and rain didn\'t, snow did.' },
      { q: '"If I study, I pass. If I pass, I graduate." I studied. What happens?', a: 'I graduate', w: ['I might pass', 'Nothing certain', 'I only pass'], why: 'Study → pass → graduate. Chain of implications.' },
    ];
    const i = this.pick(items);
    return {
      type: 'truthTable', category: 'logicalReasoning', categoryLabel: 'Logical Deduction',
      difficulty: 1.5, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // EMOTIONAL INTELLIGENCE (category: spatialAwareness)
  // ═══════════════════════════════════════════════════

  emotionalIQ() {
    const items = [
      { q:'Your friend cancels plans last minute. They seem stressed. Best response?', a:'Ask if they\'re okay', w:['Get angry','Ignore them','Cancel on them next time'], why:'Showing concern builds trust.' },
      { q:'A coworker takes credit for your idea. Best first step?', a:'Talk to them privately', w:['Yell publicly','Do nothing','Complain to everyone'], why:'Private conversation addresses it directly.' },
      { q:'Someone is visibly upset but says "I\'m fine." What do they likely mean?', a:'They\'re not fine but don\'t want to talk', w:['They are fine','They want you to leave','They\'re testing you'], why:'Body language often contradicts words.' },
      { q:'You made a mistake at work. Best approach?', a:'Own it and fix it', w:['Hide it','Blame someone','Hope no one notices'], why:'Taking responsibility shows integrity.' },
      { q:'A friend is venting about their day. What do they most likely want?', a:'Someone to listen', w:['Advice','To be told to calm down','Solutions'], why:'Venting is usually about being heard.' },
      { q:'You disagree with a group decision. Best approach?', a:'Share your view respectfully', w:['Go along silently','Refuse to participate','Argue until you win'], why:'Respectful disagreement improves outcomes.' },
      { q:'Someone gives you harsh feedback. Best initial reaction?', a:'Listen and consider it', w:['Defend immediately','Walk away','Give harsh feedback back'], why:'Even harsh feedback can contain truth.' },
      { q:'You notice a new person sitting alone. Best response?', a:'Introduce yourself', w:['Assume they want to be alone','Wait for them','Ignore them'], why:'A simple introduction makes people feel welcome.' },
      { q:'Your friend just failed an important exam. What should you say?', a:'Acknowledge their feelings, offer support', w:['Tell them it\'s not a big deal','List what they did wrong','Share how well you did'], why:'Validating feelings shows empathy.' },
      { q:'Two friends are arguing. Both want you to pick a side. Best move?', a:'Stay neutral, encourage them to talk', w:['Pick the closer friend','Avoid both','Tell both they\'re wrong'], why:'Neutrality preserves relationships.' },
      { q:'You feel overwhelmed with tasks. Best coping strategy?', a:'Break tasks into smaller steps', w:['Ignore everything','Do it all at once','Complain'], why:'Breaking things down reduces anxiety.' },
      { q:'Someone apologizes sincerely. Best response?', a:'Accept it gracefully', w:['Make them feel guilty','Say "whatever"','Demand more'], why:'Accepting allows both to move forward.' },
      { q:'A teammate is struggling with their part of a project. Best move?', a:'Offer to help without judgment', w:['Do it for them','Report them','Ignore it'], why:'Supportive collaboration builds team trust.' },
      { q:'You received a gift you don\'t like. What should you do?', a:'Thank them sincerely for the thought', w:['Tell them you hate it','Return it immediately','Complain to others'], why:'Appreciating the gesture matters more than the item.' },
      { q:'A stranger bumps into you and doesn\'t apologize. Best reaction?', a:'Let it go, assume they\'re having a bad day', w:['Confront them','Bump them back','Yell at them'], why:'Giving benefit of the doubt reduces conflict.' },
      { q:'Your boss criticizes your work in a meeting. Best response?', a:'Ask for specific feedback to improve', w:['Argue back','Quit','Complain to HR'], why:'Seeking specifics turns criticism into growth.' },
      { q:'A child is having a tantrum in public. The parent looks embarrassed. Best reaction?', a:'Give an understanding smile', w:['Stare disapprovingly','Offer parenting advice','Complain loudly'], why:'Understanding reduces the parent\'s stress.' },
      { q:'You catch a friend telling a small lie. Best approach?', a:'Address it privately and calmly', w:['Call them out publicly','Spread the news','Lie to them back'], why:'Private, calm conversation preserves the friendship.' },
      { q:'Someone shares exciting news but you\'re having a bad day. What should you do?', a:'Celebrate with them genuinely', w:['Dismiss their news','One-up them','Change the subject'], why:'Being happy for others strengthens bonds.' },
      { q:'You strongly disagree with a friend\'s life choice. Best approach?', a:'Express concern once, then respect their decision', w:['Lecture them repeatedly','Cut them off','Agree to avoid conflict'], why:'Sharing concern once respects both honesty and autonomy.' },
    ];
    const i = this.pick(items);
    return {
      type: 'emotionalIQ', category: 'spatialAwareness', categoryLabel: 'Emotional',
      difficulty: 1.1, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════
  // SPATIAL & NUMERICAL (category: numericalReasoning)
  // ═══════════════════════════════════════════════════

  spatial() {
    const items = [
      { q:'Rotate arrow pointing UP by 180 degrees', a:'Down', w:['Up','Left','Right'], why:'180 degrees flips direction.' },
      { q:'Rotate arrow pointing RIGHT by 90 degrees clockwise', a:'Down', w:['Up','Left','Right'], why:'Right + 90 CW = down.' },
      { q:'Rotate arrow pointing DOWN by 90 degrees counter-clockwise', a:'Right', w:['Up','Left','Down'], why:'Down + 90 CCW = right.' },
      { q:'Mirror arrow pointing LEFT horizontally', a:'Right', w:['Up','Down','Left'], why:'Horizontal mirror flips left to right.' },
      { q:'Rotate arrow pointing UP by 90 degrees clockwise', a:'Right', w:['Left','Down','Up'], why:'Up + 90 CW = right.' },
      { q:'Rotate arrow pointing LEFT by 180 degrees', a:'Right', w:['Up','Down','Left'], why:'180 reverses direction.' },
      { q:'Rotate arrow pointing DOWN by 180 degrees', a:'Up', w:['Down','Left','Right'], why:'180 flips down to up.' },
      { q:'Rotate arrow pointing LEFT by 90 degrees clockwise', a:'Up', w:['Down','Right','Left'], why:'Left + 90 CW = up.' },
      { q:'Rotate arrow pointing UP by 270 degrees clockwise', a:'Left', w:['Right','Down','Up'], why:'270 CW = 90 CCW. Up becomes left.' },
      { q:'Mirror arrow pointing UP vertically', a:'Down', w:['Up','Left','Right'], why:'Vertical mirror flips up to down.' },
      { q:'If you fold a square in half diagonally, what shape do you get?', a:'Triangle', w:['Rectangle','Pentagon','Trapezoid'], why:'Folding a square diagonally creates a triangle.' },
      { q:'How many faces does a standard die have?', a:'6', w:['4','8','12'], why:'A standard die is a cube with 6 faces.' },
      { q:'If you rotate the letter "M" 180 degrees, it looks most like:', a:'W', w:['M','N','Z'], why:'M flipped upside down resembles W.' },
      { q:'Looking at a clock, what angle do the hands make at 3:00?', a:'90 degrees', w:['60 degrees','120 degrees','180 degrees'], why:'At 3:00, the hands are at a right angle (90 degrees).' },
    ];
    const i = this.pick(items);
    return {
      type: 'spatial', category: 'numericalReasoning', categoryLabel: 'Spatial',
      difficulty: 1.2, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  comparison() {
    const items = [
      { q:'Which is larger: 3/4 or 2/3?', a:'3/4', w:['2/3','Equal','Cannot tell'], why:'3/4=0.75 > 2/3=0.67.' },
      { q:'Which is larger: 2 cubed or 3 squared?', a:'3 squared', w:['2 cubed','Equal','Cannot tell'], why:'2³=8, 3²=9.' },
      { q:'Which is smaller: 1/3 or 0.5?', a:'1/3', w:['0.5','Equal','Cannot tell'], why:'1/3=0.33 < 0.5.' },
      { q:'Which is larger: square root of 16 or 3?', a:'Square root of 16', w:['3','Equal','Cannot tell'], why:'√16=4 > 3.' },
      { q:'Which is larger: 25% or 1/3?', a:'1/3', w:['25%','Equal','Cannot tell'], why:'25%=0.25, 1/3=0.33.' },
      { q:'Which is smaller: 0.1 or 1/8?', a:'0.1', w:['1/8','Equal','Cannot tell'], why:'0.1=0.1, 1/8=0.125.' },
      { q:'Which is larger: 5 squared or 4 cubed?', a:'4 cubed', w:['5 squared','Equal','Cannot tell'], why:'5²=25, 4³=64.' },
      { q:'Which is larger: 2/5 or 3/8?', a:'2/5', w:['3/8','Equal','Cannot tell'], why:'2/5=0.40, 3/8=0.375.' },
      { q:'Which is larger: 0.9 or 7/8?', a:'0.9', w:['7/8','Equal','Cannot tell'], why:'7/8=0.875, 0.9>0.875.' },
      { q:'Which is larger: 2⁵ or 5²?', a:'2⁵', w:['5²','Equal','Cannot tell'], why:'2⁵=32, 5²=25.' },
      { q:'Which is larger: 1/2 or 3/7?', a:'1/2', w:['3/7','Equal','Cannot tell'], why:'1/2=0.50, 3/7=0.43.' },
      { q:'Which is larger: 10% of 200 or 20% of 90?', a:'10% of 200', w:['20% of 90','Equal','Cannot tell'], why:'10% of 200=20, 20% of 90=18.' },
    ];
    const i = this.pick(items);
    return {
      type: 'comparison', category: 'numericalReasoning', categoryLabel: 'Compare',
      difficulty: 1.3, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  estimation() {
    const items = [
      { q:'About how many days in a year?', a:'365', w:['300','400','350'], why:'365 days (366 in leap years).' },
      { q:'Roughly how many hours in a week?', a:'168', w:['100','200','150'], why:'24 x 7 = 168.' },
      { q:'About how many seconds in an hour?', a:'3600', w:['360','6000','1800'], why:'60 x 60 = 3600.' },
      { q:'About how many weeks in a year?', a:'52', w:['48','56','42'], why:'365/7 ≈ 52.' },
      { q:'Roughly how many minutes in a day?', a:'1440', w:['1000','2000','1200'], why:'60 x 24 = 1440.' },
      { q:'How many months have 31 days?', a:'7', w:['5','6','8'], why:'Jan, Mar, May, Jul, Aug, Oct, Dec.' },
      { q:'About how many bones in an adult human body?', a:'206', w:['150','300','106'], why:'206 bones.' },
      { q:'How many continents are there?', a:'7', w:['5','6','8'], why:'Africa, Antarctica, Asia, Australia, Europe, North America, South America.' },
      { q:'Roughly how many teeth does an adult human have?', a:'32', w:['28','36','24'], why:'32 teeth including wisdom teeth.' },
      { q:'How many sides does a dodecagon have?', a:'12', w:['10','8','20'], why:'Dodeca- means 12.' },
      { q:'About how many miles is the Earth\'s circumference?', a:'25,000', w:['10,000','50,000','100,000'], why:'About 24,901 miles.' },
      { q:'How many planets in our solar system?', a:'8', w:['7','9','10'], why:'Mercury through Neptune = 8 planets.' },
      { q:'About how many liters of blood in an adult human?', a:'5', w:['2','10','15'], why:'Average adult has about 5 liters of blood.' },
      { q:'How many keys on a standard piano?', a:'88', w:['76','92','64'], why:'A standard piano has 88 keys.' },
      { q:'About what percentage of Earth is covered by water?', a:'71%', w:['50%','85%','60%'], why:'About 71% of Earth\'s surface is water.' },
      { q:'How many chromosomes do humans have?', a:'46', w:['23','48','42'], why:'Humans have 23 pairs = 46 chromosomes.' },
    ];
    const i = this.pick(items);
    return {
      type: 'estimation', category: 'numericalReasoning', categoryLabel: 'General Knowledge',
      difficulty: 1.1, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  },

  numberProperty() {
    const items = [
      { q:'Is 97 a prime number?', a:'Yes', w:['No','Cannot tell','Only if even'], why:'97 is only divisible by 1 and itself.' },
      { q:'What is the smallest prime number?', a:'2', w:['1','3','0'], why:'2 is the smallest (and only even) prime.' },
      { q:'How many factors does 12 have?', a:'6', w:['4','5','3'], why:'1, 2, 3, 4, 6, 12 = six factors.' },
      { q:'Is 0 even or odd?', a:'Even', w:['Odd','Neither','Both'], why:'0 is divisible by 2 with no remainder, so it\'s even.' },
      { q:'What is 7 factorial (7!)?', a:'5040', w:['720','40320','2520'], why:'7! = 7x6x5x4x3x2x1 = 5040.' },
      { q:'What is the GCD (greatest common divisor) of 12 and 18?', a:'6', w:['3','9','12'], why:'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. GCD = 6.' },
      { q:'Is 144 a perfect square?', a:'Yes', w:['No','Only approximately','Cannot tell'], why:'144 = 12 x 12.' },
      { q:'What is 2 to the power of 10?', a:'1024', w:['512','2048','1000'], why:'2¹⁰ = 1024.' },
      { q:'How many prime numbers are there between 1 and 20?', a:'8', w:['6','7','10'], why:'2,3,5,7,11,13,17,19 = eight primes.' },
      { q:'What is the sum of the first 10 positive integers?', a:'55', w:['45','50','60'], why:'1+2+3...+10 = 55. Formula: n(n+1)/2 = 55.' },
    ];
    const i = this.pick(items);
    return {
      type: 'numberProperty', category: 'numericalReasoning', categoryLabel: 'Number Theory',
      difficulty: 1.4, question: i.q, answer: i.a,
      options: this.shuffle([i.a, ...i.w]), explanation: i.why, visual: 'text'
    };
  }
};