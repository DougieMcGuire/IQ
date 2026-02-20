const QuestionGenerator = {
  age: 25,
  usedQuestions: new Set(),
  questionCount: 0,

  setAge(a) { this.age = a || 25; },
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  pick(arr) { return arr[this.rand(0, arr.length - 1)]; },
  
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Generate unique wrong options for numbers
  numOpts(correct, count = 4, spread = null) {
    const opts = new Set([correct]);
    const range = spread || Math.max(5, Math.abs(correct) * 0.4);
    let tries = 0;
    while (opts.size < count && tries < 100) {
      tries++;
      const delta = this.rand(1, Math.ceil(range)) * (Math.random() > 0.5 ? 1 : -1);
      const v = correct + delta;
      if (v !== correct && !isNaN(v) && v >= 0) opts.add(v);
    }
    while (opts.size < count) opts.add(correct + opts.size);
    return this.shuffle([...opts]);
  },

  // Hash a question to prevent duplicates
  hashQuestion(q) {
    return `${q.type}-${q.question}-${JSON.stringify(q.options?.sort() || '')}`;
  },

  generate() {
    this.questionCount++;
    
    // Weighted selection of question types
    const types = [
      // Pattern Recognition (18%)
      { fn: 'numberSequence', weight: 6 },
      { fn: 'letterSequence', weight: 4 },
      { fn: 'visualPattern', weight: 4 },
      { fn: 'matrixPattern', weight: 4 },
      
      // Problem Solving (16%)
      { fn: 'logicPuzzle', weight: 5 },
      { fn: 'riddleQuestion', weight: 4 },
      { fn: 'balanceScale', weight: 4 },
      { fn: 'syllogism', weight: 3 },
      
      // Mental Agility (12%)
      { fn: 'mentalMath', weight: 5 },
      { fn: 'missingOperator', weight: 4 },
      { fn: 'quickCompare', weight: 3 },
      
      // Working Memory (14%)
      { fn: 'reverseSequence', weight: 4 },
      { fn: 'digitSpan', weight: 3 },
      { fn: 'nBack', weight: 3 },
      
      // Verbal Reasoning (14%)
      { fn: 'analogy', weight: 5 },
      { fn: 'vocabulary', weight: 4 },
      { fn: 'wordRelation', weight: 3 },
      { fn: 'scrambledWord', weight: 2 },
      
      // Logical Reasoning (14%)
      { fn: 'conditionalLogic', weight: 4 },
      { fn: 'deduction', weight: 4 },
      { fn: 'oddOneOut', weight: 4 },
      { fn: 'seriesCompletion', weight: 2 },
      
      // Spatial Awareness (6%)
      { fn: 'spatialRotation', weight: 3 },
      { fn: 'mirrorImage', weight: 3 },
      
      // Processing Speed (6%)
      { fn: 'quickCalc', weight: 3 },
      { fn: 'patternMatch', weight: 3 }
    ];
    
    const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
    let r = Math.random() * totalWeight;
    let selected = types[0].fn;
    
    for (const t of types) {
      r -= t.weight;
      if (r <= 0) {
        selected = t.fn;
        break;
      }
    }
    
    let q;
    let attempts = 0;
    
    do {
      attempts++;
      q = this[selected]();
      if (attempts > 20) {
        // Try a different type if stuck
        selected = types[this.rand(0, types.length - 1)].fn;
      }
    } while (this.usedQuestions.has(this.hashQuestion(q)) && attempts < 50);
    
    this.usedQuestions.add(this.hashQuestion(q));
    
    // Cleanup old questions periodically
    if (this.usedQuestions.size > 1000) {
      const arr = [...this.usedQuestions];
      this.usedQuestions = new Set(arr.slice(-500));
    }
    
    return q;
  },

  // ==================== PATTERN RECOGNITION ====================
  
  numberSequence() {
    const patterns = [
      // Arithmetic
      () => {
        const add = this.rand(2, 15);
        const start = this.rand(1, 50);
        return { seq: [start, start+add, start+add*2, start+add*3], ans: start+add*4, exp: `Adding ${add}` };
      },
      () => {
        const sub = this.rand(2, 10);
        const start = this.rand(50, 100);
        return { seq: [start, start-sub, start-sub*2, start-sub*3], ans: start-sub*4, exp: `Subtracting ${sub}` };
      },
      // Geometric
      () => {
        const mult = this.rand(2, 4);
        const start = this.rand(1, 5);
        return { seq: [start, start*mult, start*mult*mult, start*mult*mult*mult], ans: start*mult*mult*mult*mult, exp: `Multiplying by ${mult}` };
      },
      () => {
        const start = this.rand(2, 4);
        return { seq: [start*64, start*32, start*16, start*8], ans: start*4, exp: `Dividing by 2` };
      },
      // Squares and cubes
      () => {
        const off = this.rand(1, 5);
        return { seq: [off*off, (off+1)*(off+1), (off+2)*(off+2), (off+3)*(off+3)], ans: (off+4)*(off+4), exp: `Perfect squares` };
      },
      () => {
        const off = this.rand(1, 3);
        return { seq: [off*off*off, (off+1)**3, (off+2)**3, (off+3)**3], ans: (off+4)**3, exp: `Perfect cubes` };
      },
      // Fibonacci-like
      () => {
        const a = this.rand(1, 5), b = this.rand(2, 6);
        const c = a+b, d = b+c, e = c+d;
        return { seq: [a, b, c, d], ans: e, exp: `Each = sum of previous two` };
      },
      // Increasing gaps
      () => {
        const start = this.rand(1, 10);
        return { seq: [start, start+1, start+3, start+6], ans: start+10, exp: `Gaps: +1, +2, +3, +4` };
      },
      () => {
        const start = this.rand(1, 5);
        return { seq: [start, start+2, start+6, start+12], ans: start+20, exp: `Gaps: +2, +4, +6, +8` };
      },
      // Triangular
      () => {
        return { seq: [1, 3, 6, 10], ans: 15, exp: `Triangular numbers` };
      },
      // Primes
      () => {
        return { seq: [2, 3, 5, 7], ans: 11, exp: `Prime numbers` };
      },
      () => {
        return { seq: [11, 13, 17, 19], ans: 23, exp: `Prime numbers` };
      },
      // Double operations
      () => {
        const start = this.rand(1, 4);
        const add = this.rand(1, 3);
        let seq = [start];
        for (let i = 0; i < 3; i++) seq.push(seq[i] * 2 + add);
        return { seq, ans: seq[3] * 2 + add, exp: `Double and add ${add}` };
      },
      // Alternating
      () => {
        const a = this.rand(2, 5), b = this.rand(6, 10);
        return { seq: [a, b, a+1, b+1, a+2], ans: b+2, exp: `Two alternating sequences` };
      }
    ];
    
    const p = this.pick(patterns)();
    
    return {
      type: 'numberSequence',
      category: 'patternRecognition',
      categoryLabel: 'Number Pattern',
      difficulty: 1.0 + (p.ans > 100 ? 0.3 : 0) + (p.seq.some(n => n > 50) ? 0.2 : 0),
      question: 'What comes next?',
      sequence: p.seq,
      answer: String(p.ans),
      options: this.numOpts(p.ans).map(String),
      explanation: p.exp,
      visual: 'sequence'
    };
  },

  letterSequence() {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => {
        const start = this.rand(0, 18);
        return { seq: [alpha[start], alpha[start+1], alpha[start+2], alpha[start+3]], ans: alpha[start+4], exp: 'Consecutive letters' };
      },
      () => {
        const start = this.rand(0, 14);
        return { seq: [alpha[start], alpha[start+2], alpha[start+4], alpha[start+6]], ans: alpha[start+8], exp: 'Skip one letter' };
      },
      () => {
        const start = this.rand(0, 11);
        return { seq: [alpha[start], alpha[start+3], alpha[start+6], alpha[start+9]], ans: alpha[start+12], exp: 'Skip two letters' };
      },
      () => {
        const start = this.rand(12, 25);
        return { seq: [alpha[start], alpha[start-1], alpha[start-2], alpha[start-3]], ans: alpha[start-4], exp: 'Reverse alphabet' };
      },
      () => {
        return { seq: ['A', 'E', 'I', 'O'], ans: 'U', exp: 'Vowels' };
      },
      () => {
        return { seq: ['B', 'C', 'D', 'F'], ans: 'G', exp: 'Consonants in order' };
      },
      () => {
        return { seq: ['A', 'B', 'D', 'G'], ans: 'K', exp: 'Gaps: +1, +2, +3, +4' };
      },
      () => {
        return { seq: ['Z', 'Y', 'X', 'W'], ans: 'V', exp: 'Reverse consecutive' };
      }
    ];
    
    const p = this.pick(patterns)();
    const wrong = alpha.split('').filter(l => l !== p.ans);
    
    return {
      type: 'letterSequence',
      category: 'patternRecognition',
      categoryLabel: 'Letter Pattern',
      difficulty: 1.0,
      question: 'What letter comes next?',
      sequence: p.seq,
      answer: p.ans,
      options: this.shuffle([p.ans, ...this.shuffle(wrong).slice(0, 3)]),
      explanation: p.exp,
      visual: 'letterSequence'
    };
  },

  visualPattern() {
    const patterns = [
      { q: '○ ○● ○●● ?', ans: '○●●●', wrong: ['●●●●', '○○●●', '○●○●'], exp: 'Adding one ● each time' },
      { q: '★ ★★ ★★★ ?', ans: '★★★★', wrong: ['★★★', '★★', '★★★★★'], exp: 'Adding one star' },
      { q: '▲▼ ▼▲ ▲▼ ?', ans: '▼▲', wrong: ['▲▲', '▼▼', '▲▼'], exp: 'Alternating' },
      { q: '● ●● ●●● ?', ans: '●●●●', wrong: ['●●●', '●●', '●●●●●'], exp: 'Adding one dot' },
      { q: '◆ ◇ ◆ ◇ ?', ans: '◆', wrong: ['◇', '◆◇', '◇◆'], exp: 'Alternating fill' },
      { q: '→ ↓ ← ↑ ?', ans: '→', wrong: ['↓', '←', '↑'], exp: 'Rotating clockwise' },
      { q: '■ ■■ ■■■ ?', ans: '■■■■', wrong: ['■■■', '■■', '■'], exp: 'Adding one square' },
      { q: '🔴 🔵 🔴 🔵 ?', ans: '🔴', wrong: ['🔵', '🟢', '🟡'], exp: 'Alternating colors' },
      { q: '1️⃣ 2️⃣ 3️⃣ 4️⃣ ?', ans: '5️⃣', wrong: ['6️⃣', '4️⃣', '1️⃣'], exp: 'Counting up' },
      { q: '⬆️ ➡️ ⬇️ ⬅️ ?', ans: '⬆️', wrong: ['➡️', '⬇️', '⬅️'], exp: 'Clockwise rotation cycle' },
      { q: '😀 😐 😀 😐 ?', ans: '😀', wrong: ['😐', '😢', '😡'], exp: 'Alternating faces' },
      { q: '🌑 🌓 🌕 🌗 ?', ans: '🌑', wrong: ['🌓', '🌕', '🌗'], exp: 'Moon phases cycle' }
    ];
    
    const p = this.pick(patterns);
    
    return {
      type: 'visualPattern',
      category: 'patternRecognition',
      categoryLabel: 'Visual Pattern',
      difficulty: 1.1,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.exp,
      visual: 'options'
    };
  },

  matrixPattern() {
    const type = this.rand(0, 4);
    let grid, ans, exp;
    
    if (type === 0) {
      // Row sums
      const sum = this.rand(12, 24);
      const a1 = this.rand(2, 7), b1 = this.rand(2, 7), c1 = sum - a1 - b1;
      const a2 = this.rand(2, 7), b2 = this.rand(2, 7), c2 = sum - a2 - b2;
      const a3 = this.rand(2, 7), b3 = this.rand(2, 7);
      ans = sum - a3 - b3;
      grid = [a1, b1, c1, a2, b2, c2, a3, b3, '?'];
      exp = `Rows sum to ${sum}`;
    } else if (type === 1) {
      // Column multiplication
      const mult = 2;
      const a = this.rand(2, 5), b = this.rand(2, 5), c = this.rand(2, 5);
      grid = [a, b, c, a*mult, b*mult, c*mult, a*mult*mult, b*mult*mult, '?'];
      ans = c*mult*mult;
      exp = `Columns multiply by ${mult}`;
    } else if (type === 2) {
      // Diagonal pattern
      const d = this.rand(2, 4);
      const start = this.rand(2, 6);
      grid = [start, this.rand(1,9), this.rand(1,9), this.rand(1,9), start+d, this.rand(1,9), this.rand(1,9), this.rand(1,9), '?'];
      ans = start + d + d;
      exp = `Diagonal +${d}`;
    } else if (type === 3) {
      // Each row adds constant
      const add = this.rand(2, 5);
      const r1 = [this.rand(2,6), this.rand(2,6), this.rand(2,6)];
      grid = [...r1, r1[0]+add, r1[1]+add, r1[2]+add, r1[0]+add*2, r1[1]+add*2, '?'];
      ans = r1[2] + add*2;
      exp = `Each row +${add}`;
    } else {
      // Simple multiplication
      const a = this.rand(2, 5), b = this.rand(2, 5);
      grid = [a, b, a*b, a+1, b, (a+1)*b, a+2, b, '?'];
      ans = (a+2)*b;
      exp = `Third = First × Second`;
    }
    
    return {
      type: 'matrixPattern',
      category: 'patternRecognition',
      categoryLabel: 'Matrix Pattern',
      difficulty: 1.3,
      question: 'Find the missing number',
      grid: grid,
      answer: String(ans),
      options: this.numOpts(ans).map(String),
      explanation: exp,
      visual: 'matrix'
    };
  },

  // ==================== PROBLEM SOLVING ====================

  logicPuzzle() {
    const puzzles = [
      { q: 'Tom is taller than Sam. Sam is taller than Mike. Who is shortest?', ans: 'Mike', wrong: ['Tom', 'Sam', 'Cannot tell'] },
      { q: 'Amy is older than Beth. Carol is younger than Beth. Who is oldest?', ans: 'Amy', wrong: ['Beth', 'Carol', 'Cannot tell'] },
      { q: 'Red is darker than yellow. Blue is darker than red. Which is lightest?', ans: 'Yellow', wrong: ['Red', 'Blue', 'Cannot tell'] },
      { q: 'John runs faster than Mark. Mark runs faster than Paul. Who is slowest?', ans: 'Paul', wrong: ['John', 'Mark', 'Cannot tell'] },
      { q: 'Box A is heavier than B. Box C is lighter than B. Which is heaviest?', ans: 'A', wrong: ['B', 'C', 'Cannot tell'] },
      { q: 'Lisa scored higher than Emma. Emma scored higher than Maya. Who scored highest?', ans: 'Lisa', wrong: ['Emma', 'Maya', 'Cannot tell'] },
      { q: 'Book X has more pages than Y. Book Z has fewer pages than Y. Which has most pages?', ans: 'X', wrong: ['Y', 'Z', 'Cannot tell'] },
      { q: 'City A is larger than B. City B is larger than C. Which is smallest?', ans: 'C', wrong: ['A', 'B', 'Cannot tell'] },
      { q: 'Jake arrived before Kim. Kim arrived before Leo. Who arrived first?', ans: 'Jake', wrong: ['Kim', 'Leo', 'Cannot tell'] },
      { q: 'Plant A is taller than B but shorter than C. Which is tallest?', ans: 'C', wrong: ['A', 'B', 'Cannot tell'] }
    ];
    
    const p = this.pick(puzzles);
    
    return {
      type: 'logicPuzzle',
      category: 'problemSolving',
      categoryLabel: 'Logic',
      difficulty: 1.2,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Logical deduction',
      visual: 'options'
    };
  },

  riddleQuestion() {
    const riddles = [
      { q: 'I have hands but cannot clap. What am I?', ans: 'A clock', wrong: ['A tree', 'A human', 'A robot'] },
      { q: 'The more you take, the more you leave behind. What?', ans: 'Footsteps', wrong: ['Time', 'Money', 'Photos'] },
      { q: 'What has keys but no locks?', ans: 'A piano', wrong: ['A door', 'A car', 'A safe'] },
      { q: 'What has a head and tail but no body?', ans: 'A coin', wrong: ['A snake', 'A fish', 'A ghost'] },
      { q: 'I am tall when young and short when old. What am I?', ans: 'A candle', wrong: ['A person', 'A tree', 'A building'] },
      { q: 'What gets wetter the more it dries?', ans: 'A towel', wrong: ['A sponge', 'A mop', 'Paper'] },
      { q: 'What can you catch but not throw?', ans: 'A cold', wrong: ['A ball', 'A fish', 'A wave'] },
      { q: 'What has teeth but cannot bite?', ans: 'A comb', wrong: ['A shark', 'A zipper', 'A saw'] },
      { q: 'What runs but never walks?', ans: 'Water', wrong: ['A car', 'Time', 'Wind'] },
      { q: 'What can travel the world while staying in a corner?', ans: 'A stamp', wrong: ['A plane', 'Wi-Fi', 'Light'] },
      { q: 'What has one eye but cannot see?', ans: 'A needle', wrong: ['A cyclops', 'A camera', 'A storm'] },
      { q: 'What goes up but never comes down?', ans: 'Your age', wrong: ['A balloon', 'A rocket', 'Smoke'] },
      { q: 'What has a neck but no head?', ans: 'A bottle', wrong: ['A giraffe', 'A shirt', 'A guitar'] },
      { q: 'What can fill a room but takes no space?', ans: 'Light', wrong: ['Air', 'Sound', 'Smell'] },
      { q: 'I have cities but no houses, forests but no trees. What am I?', ans: 'A map', wrong: ['A dream', 'A game', 'A story'] }
    ];
    
    const p = this.pick(riddles);
    
    return {
      type: 'riddleQuestion',
      category: 'problemSolving',
      categoryLabel: 'Riddle',
      difficulty: 1.2,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.ans,
      visual: 'options'
    };
  },

  balanceScale() {
    const scales = [
      { q: 'If ●●● = 12, what is ●?', ans: '4', wrong: ['3', '6', '2'] },
      { q: 'If ■■ = 10, what is ■?', ans: '5', wrong: ['4', '6', '10'] },
      { q: 'If ▲▲▲▲ = 20, what is ▲?', ans: '5', wrong: ['4', '6', '10'] },
      { q: 'If ★ + ★ + ★ = 15, what is ★?', ans: '5', wrong: ['3', '6', '15'] },
      { q: 'If ●● + ▲ = 10 and ● = 3, what is ▲?', ans: '4', wrong: ['3', '5', '7'] },
      { q: 'If ■ × 3 = 18, what is ■?', ans: '6', wrong: ['3', '5', '9'] },
      { q: 'If ◆ + ◆ = ● and ● = 8, what is ◆?', ans: '4', wrong: ['2', '6', '8'] },
      { q: 'If ▲ × ▲ = 16, what is ▲?', ans: '4', wrong: ['2', '8', '6'] },
      { q: 'If ★★ = ●●● and ● = 4, what is ★?', ans: '6', wrong: ['4', '8', '12'] },
      { q: 'If ■ + 7 = 15, what is ■?', ans: '8', wrong: ['7', '9', '22'] }
    ];
    
    const p = this.pick(scales);
    
    return {
      type: 'balanceScale',
      category: 'problemSolving',
      categoryLabel: 'Balance',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: `Solve the equation`,
      visual: 'options'
    };
  },

  syllogism() {
    const items = [
      { q: 'All dogs bark. Rex is a dog. Does Rex bark?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'All cats have tails. Fluffy is a cat. Does Fluffy have a tail?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'All birds can fly. Penguins are birds. Can penguins fly?', ans: 'The premise is false', wrong: ['Yes', 'No', 'Maybe'] },
      { q: 'Some fruits are red. Apples are fruits. Are all apples red?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] },
      { q: 'All squares are rectangles. All rectangles have 4 sides. Do squares have 4 sides?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'No fish can walk. Salmon is a fish. Can salmon walk?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] },
      { q: 'All metals conduct electricity. Gold is a metal. Does gold conduct electricity?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'Some students are athletes. John is a student. Is John an athlete?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] }
    ];
    
    const p = this.pick(items);
    
    return {
      type: 'syllogism',
      category: 'problemSolving',
      categoryLabel: 'Syllogism',
      difficulty: 1.4,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Logical reasoning',
      visual: 'options'
    };
  },

  // ==================== MENTAL AGILITY ====================

  mentalMath() {
    const ops = [
      () => { const a = this.rand(10, 99), b = this.rand(10, 99); return { q: `${a} + ${b}`, ans: a + b }; },
      () => { const a = this.rand(50, 99), b = this.rand(10, 49); return { q: `${a} - ${b}`, ans: a - b }; },
      () => { const a = this.rand(3, 12), b = this.rand(3, 12); return { q: `${a} × ${b}`, ans: a * b }; },
      () => { const b = this.rand(2, 12), ans = this.rand(2, 12); return { q: `${b * ans} ÷ ${b}`, ans }; },
      () => { const n = this.rand(5, 15); return { q: `${n}²`, ans: n * n }; },
      () => { const base = this.rand(2, 10) * 20, pct = [10, 20, 25, 50][this.rand(0, 3)]; return { q: `${pct}% of ${base}`, ans: base * pct / 100 }; },
      () => { const a = this.rand(10, 50), b = this.rand(5, 20), c = this.rand(5, 20); return { q: `${a} + ${b} - ${c}`, ans: a + b - c }; },
      () => { const a = this.rand(2, 6), b = this.rand(2, 6), c = this.rand(2, 6); return { q: `${a} × ${b} × ${c}`, ans: a * b * c }; },
      () => { const a = this.rand(100, 200), b = this.rand(50, 100); return { q: `${a} - ${b}`, ans: a - b }; },
      () => { const a = this.rand(11, 19), b = this.rand(2, 5); return { q: `${a} × ${b}`, ans: a * b }; }
    ];
    
    const p = this.pick(ops)();
    
    return {
      type: 'mentalMath',
      category: 'mentalAgility',
      categoryLabel: 'Mental Math',
      difficulty: p.ans > 100 ? 1.3 : 1.1,
      question: `${p.q} = ?`,
      answer: String(p.ans),
      options: this.numOpts(p.ans).map(String),
      explanation: `${p.q} = ${p.ans}`,
      visual: 'options'
    };
  },

  missingOperator() {
    const ops = [
      { a: 8, b: 4, target: 12, ans: '+' },
      { a: 15, b: 3, target: 5, ans: '÷' },
      { a: 6, b: 7, target: 42, ans: '×' },
      { a: 20, b: 8, target: 12, ans: '-' },
      { a: 9, b: 9, target: 18, ans: '+' },
      { a: 24, b: 6, target: 4, ans: '÷' },
      { a: 5, b: 8, target: 40, ans: '×' },
      { a: 36, b: 4, target: 9, ans: '÷' },
      { a: 7, b: 7, target: 49, ans: '×' },
      { a: 50, b: 25, target: 25, ans: '-' },
      { a: 12, b: 4, target: 3, ans: '÷' },
      { a: 15, b: 15, target: 30, ans: '+' }
    ];
    
    const p = this.pick(ops);
    
    return {
      type: 'missingOperator',
      category: 'mentalAgility',
      categoryLabel: 'Find Operator',
      difficulty: 1.2,
      question: `${p.a} ? ${p.b} = ${p.target}`,
      answer: p.ans,
      options: this.shuffle(['+', '-', '×', '÷']),
      explanation: `${p.a} ${p.ans} ${p.b} = ${p.target}`,
      visual: 'options'
    };
  },

  quickCompare() {
    const comps = [
      { q: 'Which is larger: 3/4 or 2/3?', ans: '3/4', wrong: ['2/3', 'Equal', 'Cannot tell'] },
      { q: 'Which is smaller: 0.5 or 1/3?', ans: '1/3', wrong: ['0.5', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 25% or 1/3?', ans: '1/3', wrong: ['25%', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: √16 or 3?', ans: '√16', wrong: ['3', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 2³ or 3²?', ans: '3²', wrong: ['2³', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 0.25 or 1/5?', ans: '0.25', wrong: ['1/5', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 1/2 or 0.49?', ans: '1/2', wrong: ['0.49', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 0.75 or 7/10?', ans: '0.75', wrong: ['7/10', 'Equal', 'Cannot tell'] },
      { q: 'Which is larger: 5² or 4³?', ans: '4³', wrong: ['5²', 'Equal', 'Cannot tell'] },
      { q: 'Which is smaller: 1/4 or 0.3?', ans: '1/4', wrong: ['0.3', 'Equal', 'Cannot tell'] }
    ];
    
    const p = this.pick(comps);
    
    return {
      type: 'quickCompare',
      category: 'mentalAgility',
      categoryLabel: 'Quick Compare',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: `Calculate and compare`,
      visual: 'options'
    };
  },

  // ==================== WORKING MEMORY ====================

  reverseSequence() {
    const seqs = [
      { seq: ['?', '8', '16', '32'], ans: 4, exp: 'Doubling sequence' },
      { seq: ['?', '6', '9', '12'], ans: 3, exp: 'Adding 3' },
      { seq: ['?', '10', '15', '20'], ans: 5, exp: 'Adding 5' },
      { seq: ['?', '27', '9', '3'], ans: 81, exp: 'Dividing by 3' },
      { seq: ['?', '21', '28', '35'], ans: 14, exp: 'Adding 7' },
      { seq: ['?', '6', '12', '24'], ans: 3, exp: 'Doubling' },
      { seq: ['?', '15', '12', '9'], ans: 18, exp: 'Subtracting 3' },
      { seq: ['?', '50', '25', '12'], ans: 100, exp: 'Halving (approx)' }
    ];
    
    const p = this.pick(seqs);
    
    return {
      type: 'reverseSequence',
      category: 'workingMemory',
      categoryLabel: 'What Came First?',
      difficulty: 1.3,
      question: 'Find the first number',
      sequence: p.seq,
      answer: String(p.ans),
      options: this.numOpts(p.ans).map(String),
      explanation: p.exp,
      visual: 'sequence'
    };
  },

  digitSpan() {
    const len = this.rand(4, 6);
    const digits = [];
    for (let i = 0; i < len; i++) digits.push(this.rand(1, 9));
    const sum = digits.reduce((a, b) => a + b, 0);
    
    return {
      type: 'digitSpan',
      category: 'workingMemory',
      categoryLabel: 'Digit Memory',
      difficulty: 1.2 + (len - 4) * 0.15,
      question: `What is the sum of: ${digits.join(' ')}?`,
      answer: String(sum),
      options: this.numOpts(sum, 4, 5).map(String),
      explanation: `${digits.join(' + ')} = ${sum}`,
      visual: 'options'
    };
  },

  nBack() {
    const sequences = [
      { q: 'In the sequence A-B-C-B, which letter appeared twice?', ans: 'B', wrong: ['A', 'C', 'None'] },
      { q: 'In 3-7-3-9, which number appeared twice?', ans: '3', wrong: ['7', '9', 'None'] },
      { q: 'In X-Y-Z-X-W, which letter appeared twice?', ans: 'X', wrong: ['Y', 'Z', 'W'] },
      { q: 'In 5-2-8-2-6, which number appeared twice?', ans: '2', wrong: ['5', '8', '6'] },
      { q: 'In red-blue-red-green, which color appeared twice?', ans: 'Red', wrong: ['Blue', 'Green', 'None'] },
      { q: 'In 1-4-7-4-9, which number repeated?', ans: '4', wrong: ['1', '7', '9'] },
      { q: 'In M-N-O-P-N, which letter repeated?', ans: 'N', wrong: ['M', 'O', 'P'] },
      { q: 'In 6-3-6-9-3, how many numbers repeated?', ans: '2', wrong: ['1', '3', '0'] }
    ];
    
    const p = this.pick(sequences);
    
    return {
      type: 'nBack',
      category: 'workingMemory',
      categoryLabel: 'Pattern Memory',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Track repeating elements',
      visual: 'options'
    };
  },

  // ==================== VERBAL REASONING ====================

  analogy() {
    const analogies = [
      { a: 'Hot', b: 'Cold', c: 'Light', ans: 'Dark', wrong: ['Bright', 'Heavy', 'Warm'] },
      { a: 'Puppy', b: 'Dog', c: 'Kitten', ans: 'Cat', wrong: ['Mouse', 'Tiger', 'Pet'] },
      { a: 'Bird', b: 'Nest', c: 'Bee', ans: 'Hive', wrong: ['Honey', 'Flower', 'Garden'] },
      { a: 'Eye', b: 'See', c: 'Ear', ans: 'Hear', wrong: ['Sound', 'Music', 'Nose'] },
      { a: 'Fish', b: 'Swim', c: 'Bird', ans: 'Fly', wrong: ['Feather', 'Sing', 'Wing'] },
      { a: 'Author', b: 'Book', c: 'Chef', ans: 'Meal', wrong: ['Kitchen', 'Food', 'Recipe'] },
      { a: 'Car', b: 'Garage', c: 'Plane', ans: 'Hangar', wrong: ['Airport', 'Sky', 'Runway'] },
      { a: 'Pen', b: 'Write', c: 'Knife', ans: 'Cut', wrong: ['Sharp', 'Kitchen', 'Blade'] },
      { a: 'Day', b: 'Night', c: 'Summer', ans: 'Winter', wrong: ['Cold', 'Fall', 'Snow'] },
      { a: 'King', b: 'Queen', c: 'Prince', ans: 'Princess', wrong: ['Knight', 'Castle', 'Duke'] },
      { a: 'Cow', b: 'Milk', c: 'Chicken', ans: 'Egg', wrong: ['Feather', 'Farm', 'Meat'] },
      { a: 'Rain', b: 'Wet', c: 'Sun', ans: 'Dry', wrong: ['Hot', 'Light', 'Yellow'] },
      { a: 'Foot', b: 'Shoe', c: 'Hand', ans: 'Glove', wrong: ['Finger', 'Ring', 'Arm'] },
      { a: 'Hungry', b: 'Eat', c: 'Tired', ans: 'Sleep', wrong: ['Bed', 'Rest', 'Night'] },
      { a: 'Lock', b: 'Key', c: 'Question', ans: 'Answer', wrong: ['Ask', 'Problem', 'Test'] },
      { a: 'Doctor', b: 'Hospital', c: 'Teacher', ans: 'School', wrong: ['Student', 'Book', 'Class'] },
      { a: 'Moon', b: 'Night', c: 'Sun', ans: 'Day', wrong: ['Light', 'Hot', 'Sky'] },
      { a: 'Seed', b: 'Plant', c: 'Egg', ans: 'Bird', wrong: ['Nest', 'Fly', 'Shell'] },
      { a: 'Painter', b: 'Brush', c: 'Writer', ans: 'Pen', wrong: ['Book', 'Paper', 'Story'] },
      { a: 'Ocean', b: 'Fish', c: 'Sky', ans: 'Bird', wrong: ['Cloud', 'Blue', 'Plane'] }
    ];
    
    const p = this.pick(analogies);
    
    return {
      type: 'analogy',
      category: 'verbalReasoning',
      categoryLabel: 'Analogy',
      difficulty: 1.2,
      question: `${p.a} is to ${p.b}, as ${p.c} is to _____`,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: `Same relationship`,
      visual: 'options'
    };
  },

  vocabulary() {
    const vocab = [
      { q: 'Opposite of "ancient"?', ans: 'Modern', wrong: ['Old', 'Historic', 'Antique'] },
      { q: 'Synonym for "rapid"?', ans: 'Fast', wrong: ['Slow', 'Steady', 'Calm'] },
      { q: 'Opposite of "expand"?', ans: 'Contract', wrong: ['Grow', 'Extend', 'Increase'] },
      { q: 'Synonym for "enormous"?', ans: 'Huge', wrong: ['Tiny', 'Small', 'Average'] },
      { q: 'Opposite of "victory"?', ans: 'Defeat', wrong: ['Win', 'Success', 'Triumph'] },
      { q: 'Synonym for "intelligent"?', ans: 'Smart', wrong: ['Stupid', 'Slow', 'Dull'] },
      { q: 'Opposite of "generous"?', ans: 'Stingy', wrong: ['Kind', 'Giving', 'Nice'] },
      { q: 'Synonym for "furious"?', ans: 'Angry', wrong: ['Happy', 'Calm', 'Sad'] },
      { q: 'Opposite of "transparent"?', ans: 'Opaque', wrong: ['Clear', 'Glass', 'Visible'] },
      { q: 'Synonym for "peculiar"?', ans: 'Strange', wrong: ['Normal', 'Common', 'Usual'] },
      { q: 'Opposite of "shallow"?', ans: 'Deep', wrong: ['Thin', 'Wide', 'Low'] },
      { q: 'Synonym for "courageous"?', ans: 'Brave', wrong: ['Scared', 'Weak', 'Shy'] },
      { q: 'Opposite of "artificial"?', ans: 'Natural', wrong: ['Fake', 'Made', 'Built'] },
      { q: 'Synonym for "anxious"?', ans: 'Worried', wrong: ['Calm', 'Happy', 'Relaxed'] },
      { q: 'Opposite of "minimum"?', ans: 'Maximum', wrong: ['Least', 'Small', 'Less'] }
    ];
    
    const p = this.pick(vocab);
    
    return {
      type: 'vocabulary',
      category: 'verbalReasoning',
      categoryLabel: 'Vocabulary',
      difficulty: 1.1,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.ans,
      visual: 'options'
    };
  },

  wordRelation() {
    const relations = [
      { q: 'How are "apple" and "orange" related?', ans: 'Both fruits', wrong: ['Both vegetables', 'Both colors', 'Not related'] },
      { q: 'How are "car" and "bicycle" related?', ans: 'Both vehicles', wrong: ['Both have engines', 'Both fly', 'Not related'] },
      { q: 'How are "piano" and "guitar" related?', ans: 'Both instruments', wrong: ['Both string', 'Both electronic', 'Not related'] },
      { q: 'How are "happy" and "sad" related?', ans: 'Opposites', wrong: ['Synonyms', 'Same meaning', 'Not related'] },
      { q: 'How are "doctor" and "nurse" related?', ans: 'Both medical', wrong: ['Same job', 'Opposites', 'Not related'] },
      { q: 'How are "sun" and "moon" related?', ans: 'Both celestial', wrong: ['Same size', 'Both hot', 'Not related'] },
      { q: 'How are "book" and "magazine" related?', ans: 'Both reading material', wrong: ['Same length', 'Both digital', 'Not related'] },
      { q: 'How are "walk" and "run" related?', ans: 'Both movement', wrong: ['Opposites', 'Same speed', 'Not related'] }
    ];
    
    const p = this.pick(relations);
    
    return {
      type: 'wordRelation',
      category: 'verbalReasoning',
      categoryLabel: 'Word Relation',
      difficulty: 1.2,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.ans,
      visual: 'options'
    };
  },

  scrambledWord() {
    const words = [
      { scrambled: 'ELPPA', ans: 'APPLE', wrong: ['PAPER', 'PLACE', 'PLANE'] },
      { scrambled: 'DOGO', ans: 'GOOD', wrong: ['DOOR', 'FOOD', 'MOOD'] },
      { scrambled: 'RETAW', ans: 'WATER', wrong: ['TOWER', 'WASTE', 'WATCH'] },
      { scrambled: 'NIARB', ans: 'BRAIN', wrong: ['TRAIN', 'DRAIN', 'GRAIN'] },
      { scrambled: 'CISUM', ans: 'MUSIC', wrong: ['COMIC', 'MAGIC', 'BASIC'] },
      { scrambled: 'DLROW', ans: 'WORLD', wrong: ['SWORD', 'WORDS', 'CROWD'] },
      { scrambled: 'TRAHE', ans: 'HEART', wrong: ['EARTH', 'HATER', 'TREAT'] },
      { scrambled: 'LAMNI', ans: 'ANIMAL', wrong: ['MANUAL', 'MENTAL', 'DENTAL'] },
      { scrambled: 'LOOHCS', ans: 'SCHOOL', wrong: ['CHOOSE', 'SMOOTH', 'SCORCH'] },
      { scrambled: 'ENIHS', ans: 'SHINE', wrong: ['NOISE', 'SINCE', 'LINES'] },
      { scrambled: 'KCOLC', ans: 'CLOCK', wrong: ['BLOCK', 'CLICK', 'KNOCK'] },
      { scrambled: 'THGIL', ans: 'LIGHT', wrong: ['TIGHT', 'NIGHT', 'RIGHT'] }
    ];
    
    const p = this.pick(words);
    
    return {
      type: 'scrambledWord',
      category: 'verbalReasoning',
      categoryLabel: 'Unscramble',
      difficulty: 1.2,
      question: `Unscramble: ${p.scrambled}`,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: `${p.scrambled} → ${p.ans}`,
      visual: 'options'
    };
  },

  // ==================== LOGICAL REASONING ====================

  conditionalLogic() {
    const conditions = [
      { q: 'If it rains, the grass gets wet. The grass is wet. Did it definitely rain?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] },
      { q: 'If A then B. A is true. What about B?', ans: 'B is true', wrong: ['B is false', 'Unknown', 'Maybe'] },
      { q: 'If A then B. B is false. What about A?', ans: 'A is false', wrong: ['A is true', 'Unknown', 'Maybe'] },
      { q: 'If A then B. B is true. What about A?', ans: 'Unknown', wrong: ['A is true', 'A is false', 'Always true'] },
      { q: 'All X are Y. Z is not Y. Is Z an X?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] },
      { q: 'Some A are B. C is A. Is C a B?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] },
      { q: 'No X are Y. Z is X. Is Z a Y?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] },
      { q: 'If P or Q. Not P. What about Q?', ans: 'Q is true', wrong: ['Q is false', 'Unknown', 'Maybe'] }
    ];
    
    const p = this.pick(conditions);
    
    return {
      type: 'conditionalLogic',
      category: 'logicalReasoning',
      categoryLabel: 'Logic',
      difficulty: 1.4,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Conditional logic',
      visual: 'options'
    };
  },

  deduction() {
    const deductions = [
      { q: 'All dogs are animals. All animals need water. Do dogs need water?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'No reptiles are mammals. All snakes are reptiles. Are snakes mammals?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] },
      { q: 'All squares have 4 sides. This shape has 3 sides. Is it a square?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] },
      { q: 'Some birds can swim. Penguins are birds. Can penguins swim?', ans: 'Not enough info', wrong: ['Yes', 'No', 'All can'] },
      { q: 'All prime numbers > 2 are odd. 17 is prime and > 2. Is 17 odd?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'No fish can breathe air. Dolphins breathe air. Are dolphins fish?', ans: 'No', wrong: ['Yes', 'Maybe', 'Unknown'] }
    ];
    
    const p = this.pick(deductions);
    
    return {
      type: 'deduction',
      category: 'logicalReasoning',
      categoryLabel: 'Deduction',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Logical deduction',
      visual: 'options'
    };
  },

  oddOneOut() {
    const sets = [
      { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', exp: 'Carrot is a vegetable' },
      { items: ['Dog', 'Cat', 'Fish', 'Hamster'], odd: 'Fish', exp: 'Fish lives in water' },
      { items: ['Red', 'Blue', 'Triangle', 'Green'], odd: 'Triangle', exp: 'Triangle is a shape' },
      { items: ['Piano', 'Guitar', 'Violin', 'Drums'], odd: 'Drums', exp: 'Drums are percussion' },
      { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 'Moon', exp: 'Moon is a satellite' },
      { items: ['Dolphin', 'Shark', 'Whale', 'Seal'], odd: 'Shark', exp: 'Shark is a fish' },
      { items: ['Python', 'Java', 'Spanish', 'Ruby'], odd: 'Spanish', exp: 'Spanish is human language' },
      { items: ['Gold', 'Silver', 'Diamond', 'Bronze'], odd: 'Diamond', exp: 'Diamond is a gemstone' },
      { items: ['Eagle', 'Penguin', 'Sparrow', 'Hawk'], odd: 'Penguin', exp: 'Penguin cannot fly' },
      { items: ['London', 'Paris', 'Europe', 'Tokyo'], odd: 'Europe', exp: 'Europe is a continent' },
      { items: ['Coffee', 'Tea', 'Juice', 'Bread'], odd: 'Bread', exp: 'Bread is not a drink' },
      { items: ['January', 'Monday', 'March', 'April'], odd: 'Monday', exp: 'Monday is a day' },
      { items: ['Hammer', 'Saw', 'Apple', 'Drill'], odd: 'Apple', exp: 'Apple is food' },
      { items: ['Circle', 'Square', 'Red', 'Triangle'], odd: 'Red', exp: 'Red is a color' },
      { items: ['Tennis', 'Soccer', 'Chess', 'Basketball'], odd: 'Chess', exp: 'Chess is not physical' },
      { items: ['Shirt', 'Pants', 'Watch', 'Jacket'], odd: 'Watch', exp: 'Watch is an accessory' },
      { items: ['Oxygen', 'Gold', 'Silver', 'Iron'], odd: 'Oxygen', exp: 'Oxygen is a gas' },
      { items: ['Whale', 'Tuna', 'Salmon', 'Trout'], odd: 'Whale', exp: 'Whale is a mammal' }
    ];
    
    const s = this.pick(sets);
    
    return {
      type: 'oddOneOut',
      category: 'logicalReasoning',
      categoryLabel: 'Odd One Out',
      difficulty: 1.0,
      question: 'Which one doesn\'t belong?',
      answer: s.odd,
      options: this.shuffle(s.items),
      explanation: s.exp,
      visual: 'options'
    };
  },

  seriesCompletion() {
    const series = [
      { q: 'J, F, M, A, M, J, ?', ans: 'J', wrong: ['A', 'S', 'O'], exp: 'Months: July' },
      { q: 'S, M, T, W, T, F, ?', ans: 'S', wrong: ['M', 'T', 'W'], exp: 'Days: Saturday' },
      { q: 'O, T, T, F, F, S, ?', ans: 'S', wrong: ['E', 'N', 'T'], exp: 'One, Two... Seven' },
      { q: 'R, O, Y, G, B, I, ?', ans: 'V', wrong: ['P', 'R', 'O'], exp: 'Rainbow: Violet' },
      { q: 'M, V, E, M, J, S, ?', ans: 'U', wrong: ['N', 'P', 'E'], exp: 'Planets: Uranus' }
    ];
    
    const p = this.pick(series);
    
    return {
      type: 'seriesCompletion',
      category: 'logicalReasoning',
      categoryLabel: 'Complete Series',
      difficulty: 1.4,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.exp,
      visual: 'options'
    };
  },

  // ==================== SPATIAL AWARENESS ====================

  spatialRotation() {
    const rotations = [
      { q: 'Rotate ▲ by 180°', ans: '▼', wrong: ['▲', '◀', '▶'] },
      { q: 'Rotate ▶ by 90° clockwise', ans: '▼', wrong: ['▲', '◀', '▶'] },
      { q: 'Rotate ▼ by 90° counter-clockwise', ans: '▶', wrong: ['▲', '◀', '▼'] },
      { q: 'Rotate ◀ by 180°', ans: '▶', wrong: ['▲', '▼', '◀'] },
      { q: 'Rotate ▲ by 90° clockwise', ans: '▶', wrong: ['◀', '▼', '▲'] },
      { q: 'Rotate ▼ by 180°', ans: '▲', wrong: ['▼', '◀', '▶'] },
      { q: 'Rotate ▶ by 270° clockwise', ans: '▲', wrong: ['▼', '◀', '▶'] },
      { q: 'Rotate ◀ by 90° clockwise', ans: '▲', wrong: ['▼', '▶', '◀'] }
    ];
    
    const p = this.pick(rotations);
    
    return {
      type: 'spatialRotation',
      category: 'spatialAwareness',
      categoryLabel: 'Spatial',
      difficulty: 1.2,
      question: p.q,
      startShape: p.q.match(/[▲▼◀▶]/)[0],
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Mental rotation',
      visual: 'spatial'
    };
  },

  mirrorImage() {
    const mirrors = [
      { q: 'Mirror ◀ horizontally', ans: '▶', wrong: ['▲', '▼', '◀'] },
      { q: 'Mirror ▲ vertically', ans: '▼', wrong: ['▲', '◀', '▶'] },
      { q: 'Mirror "b" horizontally', ans: 'd', wrong: ['b', 'p', 'q'] },
      { q: 'Mirror "p" vertically', ans: 'b', wrong: ['d', 'q', 'p'] },
      { q: 'Mirror ▶ horizontally', ans: '◀', wrong: ['▲', '▼', '▶'] },
      { q: 'Mirror ◀ vertically', ans: '◀', wrong: ['▶', '▲', '▼'] }
    ];
    
    const p = this.pick(mirrors);
    
    return {
      type: 'mirrorImage',
      category: 'spatialAwareness',
      categoryLabel: 'Mirror',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Mirror reflection',
      visual: 'options'
    };
  },

  // ==================== PROCESSING SPEED ====================

  quickCalc() {
    const a = this.rand(2, 9);
    const b = this.rand(2, 9);
    const op = this.pick(['+', '-', '×']);
    let ans;
    if (op === '+') ans = a + b;
    else if (op === '-') ans = Math.max(a, b) - Math.min(a, b);
    else ans = a * b;
    
    const q = op === '-' ? `${Math.max(a,b)} ${op} ${Math.min(a,b)}` : `${a} ${op} ${b}`;
    
    return {
      type: 'quickCalc',
      category: 'processingSpeed',
      categoryLabel: 'Quick Math',
      difficulty: 1.0,
      question: `${q} = ?`,
      answer: String(ans),
      options: this.numOpts(ans, 4, 3).map(String),
      explanation: `${q} = ${ans}`,
      visual: 'options'
    };
  },

  patternMatch() {
    const patterns = [
      { q: 'Which is different: ○○○ ○○○ ○●○ ○○○', ans: '○●○', wrong: ['○○○', 'All same', 'None'] },
      { q: 'Which is different: AAA AAA ABA AAA', ans: 'ABA', wrong: ['AAA', 'All same', 'None'] },
      { q: 'Which is different: 111 111 121 111', ans: '121', wrong: ['111', 'All same', 'None'] },
      { q: 'How many triangles: ▲ ■ ▲ ● ▲ ■', ans: '3', wrong: ['2', '4', '1'] },
      { q: 'How many circles: ○ □ ○ △ □ ○ △', ans: '3', wrong: ['2', '4', '5'] },
      { q: 'Count the 7s: 7 3 7 5 7 8 7 2', ans: '4', wrong: ['3', '5', '2'] }
    ];
    
    const p = this.pick(patterns);
    
    return {
      type: 'patternMatch',
      category: 'processingSpeed',
      categoryLabel: 'Pattern Match',
      difficulty: 1.1,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: 'Visual scanning',
      visual: 'options'
    };
  }
};