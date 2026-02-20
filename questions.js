const QuestionGenerator = {
  age: 25,
  usedHashes: new Set(),

  setAge(a) { this.age = a || 25; },
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  numOpts(correct, count = 4) {
    const opts = new Set([correct]);
    const range = Math.max(5, Math.abs(correct) * 0.4);
    let tries = 0;
    while (opts.size < count && tries < 50) {
      tries++;
      const delta = this.rand(1, Math.ceil(range)) * (Math.random() > 0.5 ? 1 : -1);
      const v = correct + delta;
      if (v > 0 && v !== correct && !isNaN(v)) opts.add(v);
    }
    // Fill with fallbacks if needed
    let fallback = correct + 1;
    while (opts.size < count) {
      if (!opts.has(fallback)) opts.add(fallback);
      fallback++;
    }
    return this.shuffle([...opts]);
  },

  generate() {
    const types = [
      this.numberSeq, this.numberSeq,
      this.matrix,
      this.analogy, this.analogy,
      this.math, this.math, this.math,
      this.oddOne,
      this.logic, this.logic,
      this.verbal, this.verbal,
      this.letterSeq,
      this.spatial,
      this.codeBreak, this.codeBreak,
      this.visualPattern,
      this.missingOp,
      this.comparison,
      this.reverseSeq,
      this.riddle, this.riddle,
      this.balanceScale,
      this.timeCalc,
      this.wordScramble,
      this.trueFalse,
      this.estimation,
      this.nextInSeries
    ];
    
    const q = types[this.rand(0, types.length - 1)].call(this);
    
    // Validate - no NaN
    if (!q || !q.answer || q.answer === 'NaN' || q.answer === 'undefined') {
      return this.generate();
    }
    
    const hash = q.type + '-' + q.question + '-' + q.answer;
    if (this.usedHashes.has(hash)) return this.generate();
    this.usedHashes.add(hash);
    if (this.usedHashes.size > 500) {
      this.usedHashes = new Set([...this.usedHashes].slice(-200));
    }
    
    return q;
  },

  // NUMBER SEQUENCES
  numberSeq() {
    const type = this.rand(0, 9);
    let seq, ans, exp;
    
    switch(type) {
      case 0: { // Add constant
        const add = this.rand(2, 12);
        const start = this.rand(1, 30);
        seq = [start, start + add, start + add*2, start + add*3];
        ans = start + add*4;
        exp = `Adding ${add} each time`;
        break;
      }
      case 1: { // Subtract constant
        const sub = this.rand(2, 8);
        const start = this.rand(40, 80);
        seq = [start, start - sub, start - sub*2, start - sub*3];
        ans = start - sub*4;
        exp = `Subtracting ${sub} each time`;
        break;
      }
      case 2: { // Multiply
        const mult = this.rand(2, 3);
        const start = this.rand(1, 5);
        seq = [start, start*mult, start*mult*mult, start*mult*mult*mult];
        ans = start*mult*mult*mult*mult;
        exp = `Multiplying by ${mult}`;
        break;
      }
      case 3: { // Squares
        const off = this.rand(1, 4);
        seq = [off*off, (off+1)*(off+1), (off+2)*(off+2), (off+3)*(off+3)];
        ans = (off+4)*(off+4);
        exp = `Perfect squares: ${off}², ${off+1}², ${off+2}²...`;
        break;
      }
      case 4: { // Fibonacci-like
        const a = this.rand(1, 3), b = this.rand(2, 4);
        const c = a + b, d = b + c, e = c + d;
        seq = [a, b, c, d];
        ans = e;
        exp = `Each = sum of previous two`;
        break;
      }
      case 5: { // Increasing gaps
        const start = this.rand(1, 5);
        seq = [start, start+1, start+3, start+6];
        ans = start + 10;
        exp = `Gaps increase: +1, +2, +3, +4`;
        break;
      }
      case 6: { // Double
        const start = this.rand(2, 6);
        seq = [start, start*2, start*4, start*8];
        ans = start*16;
        exp = `Doubling each time`;
        break;
      }
      case 7: { // Triangular numbers
        seq = [1, 3, 6, 10];
        ans = 15;
        exp = `Triangular numbers: +2, +3, +4, +5`;
        break;
      }
      case 8: { // Add increasing
        const start = this.rand(1, 5);
        seq = [start, start+2, start+2+3, start+2+3+4];
        ans = start+2+3+4+5;
        exp = `Adding 2, then 3, then 4, then 5`;
        break;
      }
      default: { // Primes
        seq = [2, 3, 5, 7];
        ans = 11;
        exp = `Prime numbers`;
      }
    }
    
    return {
      type: 'numberSeq',
      category: 'patternRecognition',
      categoryLabel: 'Number Sequence',
      difficulty: 1.2,
      question: 'What comes next?',
      sequence: seq,
      answer: String(ans),
      options: this.numOpts(ans).map(String),
      explanation: exp,
      visual: 'sequence'
    };
  },

  // MATRIX - Fixed NaN issue
  matrix() {
    const type = this.rand(0, 2);
    let grid = [], ans, exp;
    
    if (type === 0) {
      // Row sums equal
      const sum = this.rand(15, 24);
      const a1 = this.rand(3, 7), b1 = this.rand(3, 7), c1 = sum - a1 - b1;
      const a2 = this.rand(3, 7), b2 = this.rand(3, 7), c2 = sum - a2 - b2;
      const a3 = this.rand(3, 7), b3 = this.rand(3, 7);
      ans = sum - a3 - b3;
      grid = [a1, b1, c1, a2, b2, c2, a3, b3, '?'];
      exp = `Each row sums to ${sum}`;
    } else if (type === 1) {
      // Column adds constant
      const add = this.rand(2, 4);
      const r1 = [this.rand(2, 6), this.rand(2, 6), this.rand(2, 6)];
      const r2 = [r1[0]+add, r1[1]+add, r1[2]+add];
      ans = r2[2] + add;
      grid = [...r1, r2[0], r2[1], r2[2], r1[0]+add+add, r1[1]+add+add, '?'];
      exp = `Each column adds ${add} going down`;
    } else {
      // Simple multiplication across rows
      const mult = 2;
      const a1 = this.rand(2, 5), b1 = a1 * mult, c1 = b1 * mult;
      const a2 = this.rand(2, 5), b2 = a2 * mult, c2 = b2 * mult;
      const a3 = this.rand(2, 5), b3 = a3 * mult;
      ans = b3 * mult;
      grid = [a1, b1, c1, a2, b2, c2, a3, b3, '?'];
      exp = `Each row: multiply by ${mult}`;
    }
    
    // Validate no NaN
    if (isNaN(ans) || ans === undefined) {
      ans = 12;
      grid = [2, 4, 8, 3, 6, 12, 4, 8, '?'];
      exp = 'Each row: multiply by 2';
    }
    
    return {
      type: 'matrix',
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

  // ANALOGIES
  analogy() {
    const all = [
      { a: 'Hot', b: 'Cold', c: 'Light', ans: 'Dark', wrong: ['Bright', 'Heavy', 'Warm'] },
      { a: 'Puppy', b: 'Dog', c: 'Kitten', ans: 'Cat', wrong: ['Mouse', 'Tiger', 'Pet'] },
      { a: 'Bird', b: 'Nest', c: 'Bee', ans: 'Hive', wrong: ['Honey', 'Flower', 'Garden'] },
      { a: 'Eye', b: 'See', c: 'Ear', ans: 'Hear', wrong: ['Sound', 'Music', 'Nose'] },
      { a: 'Fish', b: 'Swim', c: 'Bird', ans: 'Fly', wrong: ['Feather', 'Sing', 'Wing'] },
      { a: 'Author', b: 'Book', c: 'Chef', ans: 'Meal', wrong: ['Kitchen', 'Food', 'Recipe'] },
      { a: 'Car', b: 'Garage', c: 'Plane', ans: 'Hangar', wrong: ['Airport', 'Sky', 'Runway'] },
      { a: 'Finger', b: 'Hand', c: 'Toe', ans: 'Foot', wrong: ['Leg', 'Shoe', 'Nail'] },
      { a: 'Pen', b: 'Write', c: 'Knife', ans: 'Cut', wrong: ['Sharp', 'Kitchen', 'Blade'] },
      { a: 'Day', b: 'Night', c: 'Summer', ans: 'Winter', wrong: ['Cold', 'Fall', 'Snow'] },
      { a: 'King', b: 'Queen', c: 'Prince', ans: 'Princess', wrong: ['Knight', 'Castle', 'Duke'] },
      { a: 'Cow', b: 'Milk', c: 'Chicken', ans: 'Egg', wrong: ['Feather', 'Farm', 'Meat'] },
      { a: 'Rain', b: 'Wet', c: 'Sun', ans: 'Dry', wrong: ['Hot', 'Light', 'Yellow'] },
      { a: 'Foot', b: 'Shoe', c: 'Hand', ans: 'Glove', wrong: ['Finger', 'Ring', 'Arm'] },
      { a: 'Hungry', b: 'Eat', c: 'Tired', ans: 'Sleep', wrong: ['Bed', 'Rest', 'Night'] },
      { a: 'Lock', b: 'Key', c: 'Question', ans: 'Answer', wrong: ['Ask', 'Problem', 'Test'] },
      { a: 'Doctor', b: 'Hospital', c: 'Teacher', ans: 'School', wrong: ['Student', 'Book', 'Class'] },
      { a: 'Brush', b: 'Paint', c: 'Pen', ans: 'Ink', wrong: ['Paper', 'Write', 'Draw'] },
      { a: 'Moon', b: 'Night', c: 'Sun', ans: 'Day', wrong: ['Light', 'Hot', 'Sky'] },
      { a: 'Seed', b: 'Tree', c: 'Egg', ans: 'Bird', wrong: ['Nest', 'Fly', 'Shell'] }
    ];
    
    const i = all[this.rand(0, all.length - 1)];
    
    return {
      type: 'analogy',
      category: 'verbalReasoning',
      categoryLabel: 'Analogy',
      difficulty: 1.2,
      question: `${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer: i.ans,
      options: this.shuffle([i.ans, ...i.wrong]),
      explanation: `${i.a}→${i.b} same as ${i.c}→${i.ans}`,
      visual: 'options'
    };
  },

  // MATH
  math() {
    const type = this.rand(0, 9);
    let q, ans, exp;
    
    switch(type) {
      case 0: {
        const a = this.rand(15, 67), b = this.rand(12, 38);
        q = `${a} + ${b} = ?`; ans = a + b; exp = `${a} + ${b} = ${ans}`;
        break;
      }
      case 1: {
        const a = this.rand(45, 95), b = this.rand(12, 35);
        q = `${a} - ${b} = ?`; ans = a - b; exp = `${a} - ${b} = ${ans}`;
        break;
      }
      case 2: {
        const a = this.rand(4, 12), b = this.rand(4, 12);
        q = `${a} × ${b} = ?`; ans = a * b; exp = `${a} × ${b} = ${ans}`;
        break;
      }
      case 3: {
        const b = this.rand(3, 12); ans = this.rand(4, 12);
        const a = b * ans;
        q = `${a} ÷ ${b} = ?`; exp = `${a} ÷ ${b} = ${ans}`;
        break;
      }
      case 4: {
        const base = this.rand(2, 10) * 20;
        const pct = [10, 20, 25, 50][this.rand(0, 3)];
        ans = (base * pct) / 100;
        q = `${pct}% of ${base} = ?`; exp = `${pct}% × ${base} = ${ans}`;
        break;
      }
      case 5: {
        const n = this.rand(5, 12); ans = n * n;
        q = `${n}² = ?`; exp = `${n} × ${n} = ${ans}`;
        break;
      }
      case 6: {
        const a = this.rand(8, 25), b = this.rand(5, 20); ans = a;
        q = `? + ${b} = ${a + b}`; exp = `${a + b} - ${b} = ${a}`;
        break;
      }
      case 7: {
        const a = this.rand(10, 30), b = this.rand(5, 15);
        q = `${a} + ${b} - 5 = ?`; ans = a + b - 5; exp = `${a} + ${b} - 5 = ${ans}`;
        break;
      }
      case 8: {
        const a = this.rand(2, 5), b = this.rand(2, 5), c = this.rand(2, 5);
        q = `${a} × ${b} × ${c} = ?`; ans = a * b * c; exp = `${a} × ${b} × ${c} = ${ans}`;
        break;
      }
      default: {
        const price = this.rand(4, 15), qty = this.rand(3, 8);
        ans = price * qty;
        q = `${qty} items at $${price} each = $?`; exp = `${qty} × ${price} = ${ans}`;
      }
    }
    
    return {
      type: 'math',
      category: 'mentalAgility',
      categoryLabel: 'Mental Math',
      difficulty: 1.1,
      question: q,
      answer: String(ans),
      options: this.numOpts(ans).map(String),
      explanation: exp,
      visual: 'options'
    };
  },

  // ODD ONE OUT
  oddOne() {
    const sets = [
      { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', exp: 'Carrot is a vegetable' },
      { items: ['Dog', 'Cat', 'Goldfish', 'Hamster'], odd: 'Goldfish', exp: 'Goldfish lives in water' },
      { items: ['Red', 'Blue', 'Triangle', 'Green'], odd: 'Triangle', exp: 'Triangle is a shape' },
      { items: ['Piano', 'Guitar', 'Violin', 'Drums'], odd: 'Drums', exp: 'Drums are percussion' },
      { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 'Moon', exp: 'Moon is a satellite' },
      { items: ['Dolphin', 'Shark', 'Whale', 'Seal'], odd: 'Shark', exp: 'Shark is a fish' },
      { items: ['Python', 'Java', 'Spanish', 'Ruby'], odd: 'Spanish', exp: 'Spanish is a human language' },
      { items: ['Gold', 'Silver', 'Diamond', 'Bronze'], odd: 'Diamond', exp: 'Diamond is a gemstone' },
      { items: ['Eagle', 'Penguin', 'Sparrow', 'Hawk'], odd: 'Penguin', exp: 'Penguin cannot fly' },
      { items: ['London', 'Paris', 'Europe', 'Tokyo'], odd: 'Europe', exp: 'Europe is a continent' },
      { items: ['Coffee', 'Tea', 'Juice', 'Bread'], odd: 'Bread', exp: 'Bread is not a drink' },
      { items: ['January', 'Monday', 'March', 'April'], odd: 'Monday', exp: 'Monday is a day' },
      { items: ['Hammer', 'Saw', 'Apple', 'Drill'], odd: 'Apple', exp: 'Apple is food' },
      { items: ['Circle', 'Square', 'Red', 'Triangle'], odd: 'Red', exp: 'Red is a color' },
      { items: ['Tennis', 'Soccer', 'Chess', 'Basketball'], odd: 'Chess', exp: 'Chess is not physical' }
    ];
    
    const s = sets[this.rand(0, sets.length - 1)];
    
    return {
      type: 'oddOne',
      category: 'commonSense',
      categoryLabel: 'Odd One Out',
      difficulty: 1.0,
      question: 'Which one doesn\'t belong?',
      answer: s.odd,
      options: this.shuffle(s.items),
      explanation: s.exp,
      visual: 'options'
    };
  },

  // LOGIC
  logic() {
    const all = [
      { q: 'Tom is taller than Sam. Sam is taller than Mike. Who is shortest?', ans: 'Mike', wrong: ['Tom', 'Sam', 'Cannot tell'] },
      { q: 'All cats have whiskers. Fluffy is a cat. Does Fluffy have whiskers?', ans: 'Yes', wrong: ['No', 'Maybe', 'Unknown'] },
      { q: 'If it rains, the grass gets wet. The grass is wet. Did it definitely rain?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] },
      { q: 'A is older than B. C is younger than B. Who is youngest?', ans: 'C', wrong: ['A', 'B', 'Cannot tell'] },
      { q: 'Anna is taller than Beth but shorter than Carol. Who is tallest?', ans: 'Carol', wrong: ['Beth', 'Anna', 'Cannot tell'] },
      { q: 'All dogs bark. Rex barks. Is Rex definitely a dog?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] },
      { q: 'Red is darker than yellow. Blue is darker than red. Which is lightest?', ans: 'Yellow', wrong: ['Red', 'Blue', 'Cannot tell'] },
      { q: 'If all birds fly, and penguins are birds, can penguins fly?', ans: 'The premise is false', wrong: ['Yes', 'No', 'Sometimes'] },
      { q: 'John finished before Mary. Mary finished before Lisa. Who finished first?', ans: 'John', wrong: ['Mary', 'Lisa', 'Cannot tell'] },
      { q: 'Some fruits are red. Apples are fruits. Are all apples red?', ans: 'Not necessarily', wrong: ['Yes', 'No', 'Always'] }
    ];
    
    const l = all[this.rand(0, all.length - 1)];
    
    return {
      type: 'logic',
      category: 'problemSolving',
      categoryLabel: 'Logic',
      difficulty: 1.3,
      question: l.q,
      answer: l.ans,
      options: this.shuffle([l.ans, ...l.wrong]),
      explanation: `Logical answer: ${l.ans}`,
      visual: 'options'
    };
  },

  // VERBAL
  verbal() {
    const all = [
      { q: 'Opposite of "ancient"?', ans: 'Modern', wrong: ['Old', 'Historic', 'Antique'] },
      { q: 'Synonym for "rapid"?', ans: 'Fast', wrong: ['Slow', 'Steady', 'Calm'] },
      { q: 'Opposite of "expand"?', ans: 'Contract', wrong: ['Grow', 'Extend', 'Increase'] },
      { q: 'Synonym for "enormous"?', ans: 'Huge', wrong: ['Tiny', 'Small', 'Average'] },
      { q: 'Opposite of "temporary"?', ans: 'Permanent', wrong: ['Brief', 'Short', 'Quick'] },
      { q: 'Opposite of "victory"?', ans: 'Defeat', wrong: ['Win', 'Success', 'Triumph'] },
      { q: 'Synonym for "intelligent"?', ans: 'Smart', wrong: ['Stupid', 'Slow', 'Dull'] },
      { q: 'Opposite of "generous"?', ans: 'Stingy', wrong: ['Kind', 'Giving', 'Nice'] },
      { q: 'Synonym for "beautiful"?', ans: 'Gorgeous', wrong: ['Ugly', 'Plain', 'Simple'] },
      { q: 'Opposite of "brave"?', ans: 'Cowardly', wrong: ['Bold', 'Strong', 'Fierce'] },
      { q: 'Synonym for "angry"?', ans: 'Furious', wrong: ['Happy', 'Calm', 'Sad'] },
      { q: 'Opposite of "noisy"?', ans: 'Quiet', wrong: ['Loud', 'Sound', 'Busy'] }
    ];
    
    const v = all[this.rand(0, all.length - 1)];
    
    return {
      type: 'verbal',
      category: 'verbalReasoning',
      categoryLabel: 'Vocabulary',
      difficulty: 1.1,
      question: v.q,
      answer: v.ans,
      options: this.shuffle([v.ans, ...v.wrong]),
      explanation: `${v.ans} is correct`,
      visual: 'options'
    };
  },

  // LETTER SEQUENCES
  letterSeq() {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const type = this.rand(0, 4);
    let seq, ans, exp;
    
    switch(type) {
      case 0: {
        const start = this.rand(0, 15);
        seq = [alpha[start], alpha[start+2], alpha[start+4], alpha[start+6]];
        ans = alpha[start+8];
        exp = 'Skip one letter each time';
        break;
      }
      case 1: {
        const start = this.rand(0, 20);
        seq = [alpha[start], alpha[start+1], alpha[start+2], alpha[start+3]];
        ans = alpha[start+4];
        exp = 'Consecutive letters';
        break;
      }
      case 2: {
        const start = this.rand(10, 25);
        seq = [alpha[start], alpha[start-1], alpha[start-2], alpha[start-3]];
        ans = alpha[start-4];
        exp = 'Going backwards';
        break;
      }
      case 3: {
        seq = ['A', 'B', 'D', 'G'];
        ans = 'K';
        exp = 'Gaps: +1, +2, +3, +4';
        break;
      }
      default: {
        seq = ['A', 'E', 'I', 'O'];
        ans = 'U';
        exp = 'Vowels in order';
      }
    }
    
    const wrong = alpha.split('').filter(l => l !== ans);
    
    return {
      type: 'letterSeq',
      category: 'patternRecognition',
      categoryLabel: 'Letter Pattern',
      difficulty: 1.1,
      question: 'What letter comes next?',
      sequence: seq,
      answer: ans,
      options: this.shuffle([ans, ...this.shuffle(wrong).slice(0, 3)]),
      explanation: exp,
      visual: 'letterSequence'
    };
  },

  // SPATIAL
  spatial() {
    const puzzles = [
      { q: 'Rotate ▲ by 180°', ans: '▼', wrong: ['▲', '◀', '▶'], exp: 'Flips upside down' },
      { q: 'Mirror ◀ horizontally', ans: '▶', wrong: ['▲', '▼', '◀'], exp: 'Flips left to right' },
      { q: 'Rotate ▶ by 90° clockwise', ans: '▼', wrong: ['▲', '◀', '▶'], exp: 'Right becomes down' },
      { q: 'Rotate ▼ by 90° counter-clockwise', ans: '▶', wrong: ['▲', '◀', '▼'], exp: 'Down becomes right' },
      { q: 'Rotate ◀ by 180°', ans: '▶', wrong: ['▲', '▼', '◀'], exp: 'Reverses direction' },
      { q: 'Rotate ▲ by 90° clockwise', ans: '▶', wrong: ['◀', '▼', '▲'], exp: 'Up becomes right' },
      { q: 'Rotate ▼ by 180°', ans: '▲', wrong: ['▼', '◀', '▶'], exp: 'Flips upside down' },
      { q: 'Mirror ▲ vertically', ans: '▼', wrong: ['▲', '◀', '▶'], exp: 'Top becomes bottom' }
    ];
    
    const p = puzzles[this.rand(0, puzzles.length - 1)];
    
    return {
      type: 'spatial',
      category: 'spatialAwareness',
      categoryLabel: 'Spatial',
      difficulty: 1.2,
      question: p.q,
      startShape: p.q.match(/[▲▼◀▶]/)[0],
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.exp,
      visual: 'spatial'
    };
  },

  // CODE BREAKING
  codeBreak() {
    const puzzles = [
      { q: 'If A=1, B=2, C=3... What is C+A+B?', ans: '6', wrong: ['3', '9', '12'], exp: '3+1+2=6' },
      { q: 'If ★=5 and ●=3, what is ★+●+★?', ans: '13', wrong: ['11', '15', '8'], exp: '5+3+5=13' },
      { q: 'If ◆+◆=10, what is ◆?', ans: '5', wrong: ['10', '6', '4'], exp: '◆=5' },
      { q: 'If X=2 and Y=X×3, what is Y?', ans: '6', wrong: ['3', '5', '8'], exp: '2×3=6' },
      { q: 'If ▲=4 and ■=▲+3, what is ■?', ans: '7', wrong: ['6', '8', '12'], exp: '4+3=7' },
      { q: 'If A=1, B=2... what is D+E?', ans: '9', wrong: ['7', '8', '10'], exp: '4+5=9' },
      { q: 'If ★×★=25, what is ★?', ans: '5', wrong: ['4', '6', '10'], exp: '5×5=25' },
      { q: 'If 🔴+🔵=10 and 🔴=6, what is 🔵?', ans: '4', wrong: ['6', '5', '3'], exp: '10-6=4' },
      { q: 'If ●×3=15, what is ●?', ans: '5', wrong: ['3', '15', '6'], exp: '15÷3=5' },
      { q: 'If A=1, B=2... what is A+B+C+D?', ans: '10', wrong: ['8', '9', '11'], exp: '1+2+3+4=10' }
    ];
    
    const p = puzzles[this.rand(0, puzzles.length - 1)];
    
    return {
      type: 'codeBreak',
      category: 'problemSolving',
      categoryLabel: 'Code Breaker',
      difficulty: 1.3,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.exp,
      visual: 'options'
    };
  },

  // VISUAL PATTERNS
  visualPattern() {
    const puzzles = [
      { q: '○ ○● ○●● → ?', ans: '○●●●', wrong: ['●●●●', '○○●●', '○●○●'], exp: 'Adding one ● each time' },
      { q: '★ ★★ ★★★ → ?', ans: '★★★★', wrong: ['★★★', '★★', '★★★★★'], exp: 'Adding one star' },
      { q: '▲▼ ▼▲ ▲▼ → ?', ans: '▼▲', wrong: ['▲▲', '▼▼', '▲▼'], exp: 'Alternating pattern' },
      { q: '● ●● ●●● → ?', ans: '●●●●', wrong: ['●●●', '●●', '●●●●●'], exp: 'Adding one each time' },
      { q: '◆ ◇ ◆ ◇ → ?', ans: '◆', wrong: ['◇', '◆◇', '◇◆'], exp: 'Alternating' },
      { q: '→ ↓ ← ↑ → ?', ans: '↓', wrong: ['←', '↑', '→'], exp: 'Rotating clockwise' },
      { q: '■ ■■ ■■■ → ?', ans: '■■■■', wrong: ['■■■', '■■', '■'], exp: 'Adding one square' }
    ];
    
    const p = puzzles[this.rand(0, puzzles.length - 1)];
    
    return {
      type: 'visualPattern',
      category: 'patternRecognition',
      categoryLabel: 'Visual Pattern',
      difficulty: 1.2,
      question: p.q,
      answer: p.ans,
      options: this.shuffle([p.ans, ...p.wrong]),
      explanation: p.exp,
      visual: 'options'
    };
  },

  // MISSING OPERATOR
  missingOp() {
    const ops = [
      { a: 8, b: 4, ans: '+', target: 12 },
      { a: 15, b: 3, ans: '÷', target: 5 },
      { a: 6, b: 7, ans: '×', target: 42 },
      { a: 20, b: 8, ans: '-', target: 12 },
      { a: 9, b: 9, ans: '+', target: 18 },
      { a: 24, b: 6, ans: '÷', target: 4 },
      { a: 5, b: 8, ans: '×', target: 40 },
      { a: 36, b: 6, ans: '÷', target: 6 },
      { a: 7, b: 7, ans: '×', target: 49 },
      { a: 50, b: 25, ans: '-', target: 25 }
    ];
    
    const p = ops[this.rand(0, ops.length - 1)];
    
    return {
      type: 'missingOp',
      category: 'mentalAgility',
      categoryLabel: 'Missing Operator',
      difficulty: 1.2,
      question: `${p.a} ? ${p.b} = ${p.target}`,
      answer: p.ans,
      options: this.shuffle(['+', '-', '×', '÷']),
      explanation: `${p.a} ${p.ans} ${p.b} = ${p.target}`,
      visual: 'options'
    };
  },

  // COMPARISON
  comparison() {
    const comps = [
      { q: 'Which is larger: 3/4 or 2/3?', ans: '3/4', wrong: ['2/3', 'Equal', 'Cannot tell'], exp: '0.75 > 0.67' },
      { q: 'Which is smaller: 0.5 or 1/3?', ans: '1/3', wrong: ['0.5', 'Equal', 'Cannot tell'], exp: '0.33 < 0.5' },
      { q: 'Which is larger: 25% or 1/3?', ans: '1/3', wrong: ['25%', 'Equal', 'Cannot tell'], exp: '33% > 25%' },
      { q: 'Which is larger: √16 or 3?', ans: '√16', wrong: ['3', 'Equal', 'Cannot tell'], exp: '√16 = 4' },
      { q: 'Which is larger: 2³ or 3²?', ans: '3²', wrong: ['2³', 'Equal', 'Cannot tell'], exp: '9 > 8' },
      { q: 'Which is larger: 0.25 or 1/5?', ans: '0.25', wrong: ['1/5', 'Equal', 'Cannot tell'], exp: '0.25 > 0.2' },
      { q: 'Which is larger: 1/2 or 2/5?', ans: '1/2', wrong: ['2/5', 'Equal', 'Cannot tell'], exp: '0.5 > 0.4' }
    ];
    
    const c = comps[this.rand(0, comps.length - 1)];
    
    return {
      type: 'comparison',
      category: 'mentalAgility',
      categoryLabel: 'Quick Compare',
      difficulty: 1.3,
      question: c.q,
      answer: c.ans,
      options: this.shuffle([c.ans, ...c.wrong]),
      explanation: c.exp,
      visual: 'options'
    };
  },

  // REVERSE SEQUENCE
  reverseSeq() {
    const seqs = [
      { seq: ['?', '8', '16', '32'], ans: 4, exp: 'Doubling: 4→8→16→32' },
      { seq: ['?', '5', '8', '11'], ans: 2, exp: 'Adding 3' },
      { seq: ['?', '10', '15', '20'], ans: 5, exp: 'Adding 5' },
      { seq: ['?', '27', '9', '3'], ans: 81, exp: 'Dividing by 3' },
      { seq: ['?', '21', '28', '35'], ans: 14, exp: 'Adding 7' },
      { seq: ['?', '6', '12', '24'], ans: 3, exp: 'Doubling each time' }
    ];
    
    const s = seqs[this.rand(0, seqs.length - 1)];
    
    return {
      type: 'reverseSeq',
      category: 'patternRecognition',
      categoryLabel: 'What Came First?',
      difficulty: 1.3,
      question: 'Find the first number',
      sequence: s.seq,
      answer: String(s.ans),
      options: this.numOpts(s.ans).map(String),
      explanation: s.exp,
      visual: 'sequence'
    };
  },

  // RIDDLES
  riddle() {
    const riddles = [
      { q: 'I have hands but can\'t clap. What am I?', ans: 'A clock', wrong: ['A tree', 'A book', 'A chair'], exp: 'Clocks have hands' },
      { q: 'The more you take, the more you leave behind. What?', ans: 'Footsteps', wrong: ['Money', 'Time', 'Photos'], exp: 'Walking leaves footsteps' },
      { q: 'What has keys but no locks?', ans: 'A piano', wrong: ['A door', 'A car', 'A safe'], exp: 'Piano has keys' },
      { q: 'What has a head and tail but no body?', ans: 'A coin', wrong: ['A snake', 'A fish', 'A ghost'], exp: 'Coins have heads/tails' },
      { q: 'I\'m tall when young, short when old. What am I?', ans: 'A candle', wrong: ['A tree', 'A person', 'A building'], exp: 'Candles burn down' },
      { q: 'What gets wetter the more it dries?', ans: 'A towel', wrong: ['The sun', 'A sponge', 'Paper'], exp: 'Towels absorb water' },
      { q: 'What can you catch but not throw?', ans: 'A cold', wrong: ['A ball', 'A fish', 'A wave'], exp: 'You catch a cold' },
      { q: 'What has teeth but cannot bite?', ans: 'A comb', wrong: ['A shark', 'A dog', 'A saw'], exp: 'Combs have teeth' },
      { q: 'What runs but never walks?', ans: 'Water', wrong: ['A dog', 'A car', 'Time'], exp: 'Water runs' },
      { q: 'What can travel the world while staying in a corner?', ans: 'A stamp', wrong: ['A plane', 'Wi-Fi', 'Light'], exp: 'Stamps stay in corners' }
    ];
    
    const r = riddles[this.rand(0, riddles.length - 1)];
    
    return {
      type: 'riddle',
      category: 'problemSolving',
      categoryLabel: 'Riddle',
      difficulty: 1.2,
      question: r.q,
      answer: r.ans,
      options: this.shuffle([r.ans, ...r.wrong]),
      explanation: r.exp,
      visual: 'options'
    };
  },

  // BALANCE SCALE
  balanceScale() {
    const scales = [
      { q: 'If ●●● = 12, what is ●?', ans: '4', wrong: ['3', '6', '2'], exp: '12 ÷ 3 = 4' },
      { q: 'If ▲▲ = ●●●, and ● = 4, what is ▲?', ans: '6', wrong: ['4', '8', '3'], exp: '▲▲ = 12, ▲ = 6' },
      { q: 'If ★★★★ = 20, what is ★?', ans: '5', wrong: ['4', '6', '10'], exp: '20 ÷ 4 = 5' },
      { q: 'If ■ + ■ + ■ = 15, what is ■?', ans: '5', wrong: ['3', '15', '6'], exp: '15 ÷ 3 = 5' },
      { q: 'If ●● + ▲ = 10, and ● = 3, what is ▲?', ans: '4', wrong: ['3', '5', '7'], exp: '6 + ▲ = 10' }
    ];
    
    const s = scales[this.rand(0, scales.length - 1)];
    
    return {
      type: 'balance',
      category: 'problemSolving',
      categoryLabel: 'Balance Scale',
      difficulty: 1.4,
      question: s.q,
      answer: s.ans,
      options: this.shuffle([s.ans, ...s.wrong]),
      explanation: s.exp,
      visual: 'options'
    };
  },

  // TIME CALCULATION
  timeCalc() {
    const times = [
      { q: 'A movie starts at 7:30 PM and is 2 hours long. When does it end?', ans: '9:30 PM', wrong: ['9:00 PM', '10:00 PM', '8:30 PM'] },
      { q: 'If it\'s 3:45 PM, what time was it 2 hours ago?', ans: '1:45 PM', wrong: ['1:15 PM', '2:45 PM', '12:45 PM'] },
      { q: 'A train leaves at 8:15 AM and arrives at 10:45 AM. How long is the trip?', ans: '2h 30m', wrong: ['2h', '2h 15m', '3h'] },
      { q: 'If you sleep 8 hours and wake at 7 AM, when did you fall asleep?', ans: '11 PM', wrong: ['10 PM', '12 AM', '9 PM'] },
      { q: 'A 90-minute meeting starts at 2:00 PM. When does it end?', ans: '3:30 PM', wrong: ['3:00 PM', '4:00 PM', '3:15 PM'] }
    ];
    
    const t = times[this.rand(0, times.length - 1)];
    
    return {
      type: 'timeCalc',
      category: 'mentalAgility',
      categoryLabel: 'Time Math',
      difficulty: 1.2,
      question: t.q,
      answer: t.ans,
      options: this.shuffle([t.ans, ...t.wrong]),
      explanation: `Answer: ${t.ans}`,
      visual: 'options'
    };
  },

  // WORD SCRAMBLE
  wordScramble() {
    const words = [
      { scrambled: 'EPLAP', ans: 'APPLE', wrong: ['PAPER', 'PLACE', 'PLANE'] },
      { scrambled: 'ODOG', ans: 'GOOD', wrong: ['DOOR', 'FOOD', 'MOOD'] },
      { scrambled: 'ARWET', ans: 'WATER', wrong: ['TOWER', 'WASTE', 'WATCH'] },
      { scrambled: 'ARPYT', ans: 'PARTY', wrong: ['PAINT', 'PAPER', 'PARTS'] },
      { scrambled: 'CLOKO', ans: 'CLOCK', wrong: ['BLOCK', 'CLICK', 'CLOSE'] },
      { scrambled: 'RBNAI', ans: 'BRAIN', wrong: ['TRAIN', 'DRAIN', 'GRAIN'] },
      { scrambled: 'ISUMC', ans: 'MUSIC', wrong: ['COMIC', 'MAGIC', 'BASIC'] },
      { scrambled: 'DIWRN', ans: 'WORLD', wrong: ['WEIRD', 'SWORD', 'WORDS'] }
    ];
    
    const w = words[this.rand(0, words.length - 1)];
    
    return {
      type: 'wordScramble',
      category: 'verbalReasoning',
      categoryLabel: 'Unscramble',
      difficulty: 1.2,
      question: `Unscramble: ${w.scrambled}`,
      answer: w.ans,
      options: this.shuffle([w.ans, ...w.wrong]),
      explanation: `${w.scrambled} → ${w.ans}`,
      visual: 'options'
    };
  },

  // TRUE OR FALSE
  trueFalse() {
    const facts = [
      { q: 'The sun rises in the east', ans: 'True', wrong: ['False'], exp: 'The sun always rises in the east' },
      { q: 'Humans have 4 lungs', ans: 'False', wrong: ['True'], exp: 'Humans have 2 lungs' },
      { q: 'Water freezes at 0°C', ans: 'True', wrong: ['False'], exp: 'Water freezes at 0°C / 32°F' },
      { q: 'A square has 5 sides', ans: 'False', wrong: ['True'], exp: 'A square has 4 sides' },
      { q: 'Spiders have 8 legs', ans: 'True', wrong: ['False'], exp: 'All spiders have 8 legs' },
      { q: 'The moon produces its own light', ans: 'False', wrong: ['True'], exp: 'The moon reflects sunlight' },
      { q: 'There are 60 seconds in a minute', ans: 'True', wrong: ['False'], exp: '60 seconds = 1 minute' },
      { q: 'Bats are blind', ans: 'False', wrong: ['True'], exp: 'Bats can see quite well' }
    ];
    
    const f = facts[this.rand(0, facts.length - 1)];
    
    return {
      type: 'trueFalse',
      category: 'commonSense',
      categoryLabel: 'True or False',
      difficulty: 1.0,
      question: f.q,
      answer: f.ans,
      options: ['True', 'False'],
      explanation: f.exp,
      visual: 'options'
    };
  },

  // ESTIMATION
  estimation() {
    const ests = [
      { q: 'About how many days in a year?', ans: '365', wrong: ['300', '400', '350'], exp: '365 days (366 in leap year)' },
      { q: 'Roughly how many hours in a week?', ans: '168', wrong: ['100', '200', '150'], exp: '24 × 7 = 168' },
      { q: 'About how many seconds in an hour?', ans: '3,600', wrong: ['360', '6,000', '1,800'], exp: '60 × 60 = 3,600' },
      { q: 'Roughly how many weeks in a year?', ans: '52', wrong: ['48', '56', '42'], exp: '365 ÷ 7 ≈ 52' },
      { q: 'About how many minutes in a day?', ans: '1,440', wrong: ['1,000', '2,000', '1,200'], exp: '60 × 24 = 1,440' }
    ];
    
    const e = ests[this.rand(0, ests.length - 1)];
    
    return {
      type: 'estimation',
      category: 'mentalAgility',
      categoryLabel: 'Estimation',
      difficulty: 1.1,
      question: e.q,
      answer: e.ans,
      options: this.shuffle([e.ans, ...e.wrong]),
      explanation: e.exp,
      visual: 'options'
    };
  },

  // NEXT IN SERIES (shapes/emojis)
  nextInSeries() {
    const series = [
      { q: '🔴 🟡 🔴 🟡 → ?', ans: '🔴', wrong: ['🟡', '🔵', '🟢'], exp: 'Alternating red and yellow' },
      { q: '🌙 ⭐ 🌙 ⭐ 🌙 → ?', ans: '⭐', wrong: ['🌙', '☀️', '🌟'], exp: 'Moon star pattern' },
      { q: '1️⃣ 2️⃣ 3️⃣ 4️⃣ → ?', ans: '5️⃣', wrong: ['6️⃣', '4️⃣', '1️⃣'], exp: 'Counting up' },
      { q: '🔵 🔵 🔴 🔵 🔵 🔴 → ?', ans: '🔵', wrong: ['🔴', '🟡', '🟢'], exp: 'Blue blue red pattern' },
      { q: '⬆️ ➡️ ⬇️ ⬅️ → ?', ans: '⬆️', wrong: ['➡️', '⬇️', '⬅️'], exp: 'Rotating clockwise' },
      { q: '😀 😐 😀 😐 → ?', ans: '😀', wrong: ['😐', '😢', '😡'], exp: 'Happy neutral pattern' }
    ];
    
    const s = series[this.rand(0, series.length - 1)];
    
    return {
      type: 'nextInSeries',
      category: 'patternRecognition',
      categoryLabel: 'Next In Series',
      difficulty: 1.1,
      question: s.q,
      answer: s.ans,
      options: this.shuffle([s.ans, ...s.wrong]),
      explanation: s.exp,
      visual: 'options'
    };
  }
};