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
    while (opts.size < n && t++ < 80) {
      const v = ans + this.rand(1, Math.ceil(r)) * (Math.random() > 0.5 ? 1 : -1);
      if (v !== ans && v >= 0 && !isNaN(v)) opts.add(v);
    }
    while (opts.size < n) opts.add(ans + opts.size);
    return this.shuffle([...opts]);
  },
  
  hash(q) { return q.type + q.question + (q.sequence || []).join(''); },
  
  generate() {
    const types = [
      'numSeq', 'numSeq', 'numSeq',
      'letterSeq', 'letterSeq',
      'matrix',
      'analogy', 'analogy', 'analogy',
      'math', 'math', 'math',
      'oddOut', 'oddOut',
      'logic', 'logic',
      'verbal', 'verbal',
      'spatial',
      'codeBreak', 'codeBreak',
      'riddle', 'riddle',
      'series',
      'comparison',
      'missingNum',
      'nextShape',
      'wordLink',
      'estimation',
      'timeCalc'
    ];
    
    let q, tries = 0;
    do {
      const fn = this.pick(types);
      q = this[fn]();
      tries++;
    } while (this.used.has(this.hash(q)) && tries < 30);
    
    this.used.add(this.hash(q));
    if (this.used.size > 800) this.used = new Set([...this.used].slice(-400));
    
    return q;
  },

  // ═══════════════════════════════════════════════════════════
  // NUMBER SEQUENCES
  // ═══════════════════════════════════════════════════════════
  numSeq() {
    const patterns = [
      // Adding
      () => {
        const add = this.rand(3, 15);
        const start = this.rand(2, 40);
        return {
          seq: [start, start+add, start+add*2, start+add*3],
          ans: start+add*4,
          why: `Each number increases by ${add}. So ${start+add*3} + ${add} = ${start+add*4}`
        };
      },
      // Subtracting
      () => {
        const sub = this.rand(3, 9);
        const start = this.rand(50, 90);
        return {
          seq: [start, start-sub, start-sub*2, start-sub*3],
          ans: start-sub*4,
          why: `Each number decreases by ${sub}. So ${start-sub*3} - ${sub} = ${start-sub*4}`
        };
      },
      // Multiply by 2
      () => {
        const start = this.rand(2, 6);
        return {
          seq: [start, start*2, start*4, start*8],
          ans: start*16,
          why: `Each number doubles. So ${start*8} × 2 = ${start*16}`
        };
      },
      // Multiply by 3
      () => {
        const start = this.rand(1, 3);
        return {
          seq: [start, start*3, start*9, start*27],
          ans: start*81,
          why: `Each number triples. So ${start*27} × 3 = ${start*81}`
        };
      },
      // Squares
      () => {
        const off = this.rand(1, 5);
        return {
          seq: [off*off, (off+1)**2, (off+2)**2, (off+3)**2],
          ans: (off+4)**2,
          why: `These are perfect squares: ${off}², ${off+1}², ${off+2}², ${off+3}², ${off+4}² = ${(off+4)**2}`
        };
      },
      // Fibonacci-style
      () => {
        const a = this.rand(1, 4), b = this.rand(2, 5);
        const c = a+b, d = b+c, e = c+d;
        return {
          seq: [a, b, c, d],
          ans: e,
          why: `Each number is the sum of the two before it. ${c} + ${d} = ${e}`
        };
      },
      // Increasing gaps
      () => {
        const s = this.rand(1, 8);
        return {
          seq: [s, s+2, s+5, s+9],
          ans: s+14,
          why: `The gaps increase by 1 each time: +2, +3, +4, +5. So ${s+9} + 5 = ${s+14}`
        };
      },
      // Primes
      () => {
        return {
          seq: [2, 3, 5, 7],
          ans: 11,
          why: `These are prime numbers (only divisible by 1 and themselves). After 7 comes 11.`
        };
      },
      // Triangular
      () => {
        return {
          seq: [1, 3, 6, 10],
          ans: 15,
          why: `Triangular numbers: add 2, then 3, then 4, then 5. So 10 + 5 = 15`
        };
      },
      // Half each time
      () => {
        const start = this.rand(4, 8) * 16;
        return {
          seq: [start, start/2, start/4, start/8],
          ans: start/16,
          why: `Each number is halved. ${start/8} ÷ 2 = ${start/16}`
        };
      }
    ];
    
    const p = this.pick(patterns)();
    return {
      type: 'numSeq',
      category: 'patternRecognition',
      categoryLabel: 'Number Pattern',
      difficulty: 1.1,
      question: 'What comes next?',
      sequence: p.seq,
      answer: String(p.ans),
      options: this.numOpts(p.ans).map(String),
      explanation: p.why,
      visual: 'sequence'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // LETTER SEQUENCES
  // ═══════════════════════════════════════════════════════════
  letterSeq() {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => {
        const i = this.rand(0, 18);
        return { seq: [alpha[i], alpha[i+1], alpha[i+2], alpha[i+3]], ans: alpha[i+4], why: `Consecutive letters in alphabetical order.` };
      },
      () => {
        const i = this.rand(0, 14);
        return { seq: [alpha[i], alpha[i+2], alpha[i+4], alpha[i+6]], ans: alpha[i+8], why: `Skip one letter each time: A, C, E, G... (every other letter)` };
      },
      () => {
        const i = this.rand(0, 11);
        return { seq: [alpha[i], alpha[i+3], alpha[i+6], alpha[i+9]], ans: alpha[i+12], why: `Skip two letters each time.` };
      },
      () => {
        const i = this.rand(8, 25);
        return { seq: [alpha[i], alpha[i-1], alpha[i-2], alpha[i-3]], ans: alpha[i-4], why: `Alphabet going backwards.` };
      },
      () => {
        return { seq: ['A', 'E', 'I', 'O'], ans: 'U', why: `The five vowels: A, E, I, O, U` };
      },
      () => {
        return { seq: ['A', 'B', 'D', 'G'], ans: 'K', why: `Gaps increase: +1, +2, +3, +4. After G (7th letter) + 4 = K (11th)` };
      },
      () => {
        return { seq: ['Z', 'X', 'V', 'T'], ans: 'R', why: `Going backwards, skipping one each time.` };
      }
    ];
    
    const p = this.pick(patterns)();
    const wrong = alpha.split('').filter(l => l !== p.ans);
    
    return {
      type: 'letterSeq',
      category: 'patternRecognition',
      categoryLabel: 'Letter Pattern',
      difficulty: 1.0,
      question: 'What letter comes next?',
      sequence: p.seq,
      answer: p.ans,
      options: this.shuffle([p.ans, ...this.shuffle(wrong).slice(0, 3)]),
      explanation: p.why,
      visual: 'letterSequence'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // MATRIX PATTERNS
  // ═══════════════════════════════════════════════════════════
  matrix() {
    const type = this.rand(0, 3);
    let grid, ans, why;
    
    if (type === 0) {
      // Rows sum to same value
      const sum = this.rand(15, 24);
      const a = this.rand(3, 7), b = this.rand(3, 7), c = sum - a - b;
      const d = this.rand(3, 7), e = this.rand(3, 7), f = sum - d - e;
      const g = this.rand(3, 7), h = this.rand(3, 7);
      ans = sum - g - h;
      grid = [a, b, c, d, e, f, g, h, '?'];
      why = `Each row adds up to ${sum}. In the last row: ${g} + ${h} + ? = ${sum}, so ? = ${ans}`;
    } else if (type === 1) {
      // Each column adds same number
      const add = this.rand(2, 5);
      const r = [this.rand(2, 6), this.rand(2, 6), this.rand(2, 6)];
      grid = [...r, r[0]+add, r[1]+add, r[2]+add, r[0]+add*2, r[1]+add*2, '?'];
      ans = r[2] + add*2;
      why = `Each column increases by ${add} going down. The third column: ${r[2]}, ${r[2]+add}, ${ans}`;
    } else if (type === 2) {
      // Rows multiply
      const a = this.rand(2, 4), b = this.rand(2, 4);
      const d = this.rand(2, 4), e = this.rand(2, 4);
      const g = this.rand(2, 4), h = this.rand(2, 4);
      grid = [a, b, a*b, d, e, d*e, g, h, '?'];
      ans = g * h;
      why = `In each row, the third number = first × second. ${g} × ${h} = ${ans}`;
    } else {
      // Columns have same product
      const p = this.rand(12, 24);
      const factors = [[2,p/2], [3,p/3], [4,p/4], [6,p/6]].filter(f => f[1] === Math.floor(f[1]) && f[1] > 1);
      const f = this.pick(factors);
      grid = [f[0], this.rand(2,6), this.rand(2,6), f[1], this.rand(2,6), this.rand(2,6), '?', this.rand(2,6), this.rand(2,6)];
      ans = p / f[0];
      why = `First column multiplies to ${p}. ${f[0]} × ${ans} = ${p}`;
    }
    
    return {
      type: 'matrix',
      category: 'patternRecognition',
      categoryLabel: 'Matrix Logic',
      difficulty: 1.3,
      question: 'Find the missing number',
      grid,
      answer: String(ans),
      options: this.numOpts(ans).map(String),
      explanation: why,
      visual: 'matrix'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // ANALOGIES
  // ═══════════════════════════════════════════════════════════
  analogy() {
    const items = [
      { a: 'Hot', b: 'Cold', c: 'Up', d: 'Down', why: 'Hot and Cold are opposites, just like Up and Down.' },
      { a: 'Puppy', b: 'Dog', c: 'Kitten', d: 'Cat', why: 'A puppy grows into a dog, just like a kitten grows into a cat.' },
      { a: 'Bird', b: 'Nest', c: 'Bee', d: 'Hive', why: 'A bird lives in a nest, just like a bee lives in a hive.' },
      { a: 'Eye', b: 'See', c: 'Ear', d: 'Hear', why: 'Eyes are for seeing, ears are for hearing.' },
      { a: 'Fish', b: 'Swim', c: 'Bird', d: 'Fly', why: 'Fish swim through water, birds fly through air.' },
      { a: 'Author', b: 'Book', c: 'Chef', d: 'Meal', why: 'An author creates a book, a chef creates a meal.' },
      { a: 'Pen', b: 'Write', c: 'Knife', d: 'Cut', why: 'A pen is used to write, a knife is used to cut.' },
      { a: 'Day', b: 'Night', c: 'Summer', d: 'Winter', why: 'Day and night are opposite times, summer and winter are opposite seasons.' },
      { a: 'Cow', b: 'Milk', c: 'Bee', d: 'Honey', why: 'Cows produce milk, bees produce honey.' },
      { a: 'Foot', b: 'Shoe', c: 'Hand', d: 'Glove', why: 'Shoes cover feet, gloves cover hands.' },
      { a: 'Lock', b: 'Key', c: 'Question', d: 'Answer', why: 'A key opens a lock, an answer solves a question.' },
      { a: 'Doctor', b: 'Hospital', c: 'Teacher', d: 'School', why: 'Doctors work in hospitals, teachers work in schools.' },
      { a: 'Moon', b: 'Night', c: 'Sun', d: 'Day', why: 'The moon lights the night, the sun lights the day.' },
      { a: 'Rain', b: 'Wet', c: 'Sun', d: 'Dry', why: 'Rain makes things wet, sun makes things dry.' },
      { a: 'Hungry', b: 'Eat', c: 'Tired', d: 'Sleep', why: 'When hungry you eat, when tired you sleep.' },
      { a: 'Canvas', b: 'Painter', c: 'Stage', d: 'Actor', why: 'A painter performs on canvas, an actor performs on stage.' },
      { a: 'Finger', b: 'Hand', c: 'Toe', d: 'Foot', why: 'Fingers are part of the hand, toes are part of the foot.' },
      { a: 'Leaf', b: 'Tree', c: 'Petal', d: 'Flower', why: 'Leaves grow on trees, petals grow on flowers.' }
    ];
    
    const i = this.pick(items);
    const wrong = items.filter(x => x.d !== i.d).map(x => x.d).slice(0, 3);
    
    return {
      type: 'analogy',
      category: 'verbalReasoning',
      categoryLabel: 'Analogy',
      difficulty: 1.2,
      question: `${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer: i.d,
      options: this.shuffle([i.d, ...this.shuffle(wrong)]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // MENTAL MATH
  // ═══════════════════════════════════════════════════════════
  math() {
    const ops = [
      () => { const a = this.rand(12, 78), b = this.rand(8, 45); return { q: `${a} + ${b}`, a: a+b, w: `${a} + ${b} = ${a+b}` }; },
      () => { const a = this.rand(50, 99), b = this.rand(10, 40); return { q: `${a} - ${b}`, a: a-b, w: `${a} - ${b} = ${a-b}` }; },
      () => { const a = this.rand(4, 12), b = this.rand(4, 12); return { q: `${a} × ${b}`, a: a*b, w: `${a} × ${b} = ${a*b}` }; },
      () => { const b = this.rand(2, 12), a = b * this.rand(3, 12); return { q: `${a} ÷ ${b}`, a: a/b, w: `${a} ÷ ${b} = ${a/b}` }; },
      () => { const n = this.rand(5, 12); return { q: `${n}²`, a: n*n, w: `${n}² = ${n} × ${n} = ${n*n}` }; },
      () => { 
        const b = this.rand(2, 10) * 20, p = [10, 20, 25, 50][this.rand(0,3)]; 
        return { q: `${p}% of ${b}`, a: b*p/100, w: `${p}% of ${b} = ${b} × ${p/100} = ${b*p/100}` }; 
      },
      () => { const a = this.rand(15, 50), b = this.rand(10, 30), c = this.rand(5, 20); return { q: `${a} + ${b} - ${c}`, a: a+b-c, w: `${a} + ${b} = ${a+b}, then ${a+b} - ${c} = ${a+b-c}` }; },
      () => { const a = this.rand(2, 5), b = this.rand(2, 5), c = this.rand(2, 5); return { q: `${a} × ${b} × ${c}`, a: a*b*c, w: `${a} × ${b} = ${a*b}, then × ${c} = ${a*b*c}` }; }
    ];
    
    const p = this.pick(ops)();
    return {
      type: 'math',
      category: 'mentalAgility',
      categoryLabel: 'Mental Math',
      difficulty: 1.1,
      question: `${p.q} = ?`,
      answer: String(p.a),
      options: this.numOpts(p.a).map(String),
      explanation: p.w,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // ODD ONE OUT
  // ═══════════════════════════════════════════════════════════
  oddOut() {
    const sets = [
      { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', why: 'Carrot is a vegetable, the others are fruits.' },
      { items: ['Dog', 'Cat', 'Goldfish', 'Hamster'], odd: 'Goldfish', why: 'Goldfish lives underwater, the others live on land.' },
      { items: ['Red', 'Blue', 'Square', 'Green'], odd: 'Square', why: 'Square is a shape, the others are colors.' },
      { items: ['Piano', 'Guitar', 'Violin', 'Drums'], odd: 'Drums', why: 'Drums are percussion, the others are string/keyboard instruments.' },
      { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 'Moon', why: 'Moon orbits Earth, the others orbit the Sun.' },
      { items: ['Dolphin', 'Shark', 'Whale', 'Seal'], odd: 'Shark', why: 'Shark is a fish, the others are mammals.' },
      { items: ['Python', 'Java', 'French', 'Ruby'], odd: 'French', why: 'French is a human language, the others are programming languages.' },
      { items: ['Gold', 'Silver', 'Diamond', 'Copper'], odd: 'Diamond', why: 'Diamond is a gemstone, the others are metals.' },
      { items: ['Eagle', 'Penguin', 'Sparrow', 'Hawk'], odd: 'Penguin', why: 'Penguins cannot fly, the others can.' },
      { items: ['Coffee', 'Tea', 'Juice', 'Bread'], odd: 'Bread', why: 'Bread is solid food, the others are drinks.' },
      { items: ['Circle', 'Triangle', 'Red', 'Square'], odd: 'Red', why: 'Red is a color, the others are shapes.' },
      { items: ['January', 'Monday', 'March', 'December'], odd: 'Monday', why: 'Monday is a day, the others are months.' },
      { items: ['Hammer', 'Screwdriver', 'Banana', 'Wrench'], odd: 'Banana', why: 'Banana is food, the others are tools.' },
      { items: ['Oxygen', 'Iron', 'Copper', 'Gold'], odd: 'Oxygen', why: 'Oxygen is a gas at room temperature, the others are solid metals.' },
      { items: ['Tennis', 'Chess', 'Basketball', 'Soccer'], odd: 'Chess', why: 'Chess is not a physical sport, the others involve physical activity.' }
    ];
    
    const s = this.pick(sets);
    return {
      type: 'oddOut',
      category: 'logicalReasoning',
      categoryLabel: 'Odd One Out',
      difficulty: 1.0,
      question: 'Which one doesn\'t belong?',
      answer: s.odd,
      options: this.shuffle(s.items),
      explanation: s.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // LOGIC PUZZLES
  // ═══════════════════════════════════════════════════════════
  logic() {
    const puzzles = [
      { q: 'Tom is taller than Sam. Sam is taller than Mike. Who is shortest?', a: 'Mike', w: ['Tom', 'Sam', 'Cannot tell'], why: 'If Tom > Sam > Mike in height, Mike is at the bottom, so he\'s shortest.' },
      { q: 'Amy is older than Beth. Beth is older than Carol. Who is oldest?', a: 'Amy', w: ['Beth', 'Carol', 'Cannot tell'], why: 'Amy > Beth > Carol in age, so Amy is oldest.' },
      { q: 'Box A is heavier than B. Box C is lighter than B. Which is lightest?', a: 'C', w: ['A', 'B', 'Cannot tell'], why: 'A > B > C in weight, so C is lightest.' },
      { q: 'Red is darker than Yellow. Blue is darker than Red. Which is lightest?', a: 'Yellow', w: ['Red', 'Blue', 'Cannot tell'], why: 'Blue > Red > Yellow in darkness, so Yellow is lightest.' },
      { q: 'All cats have tails. Fluffy is a cat. Does Fluffy have a tail?', a: 'Yes', w: ['No', 'Maybe', 'Unknown'], why: 'Since ALL cats have tails and Fluffy IS a cat, Fluffy must have a tail.' },
      { q: 'All birds can fly. Penguins are birds. Can penguins fly?', a: 'The premise is wrong', w: ['Yes', 'No', 'Sometimes'], why: 'The statement "all birds can fly" is false—penguins are birds but can\'t fly.' },
      { q: 'If it rains, the grass is wet. The grass is wet. Did it rain?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'The grass could be wet from a sprinkler or dew. We only know rain causes wetness, not that wetness means rain.' },
      { q: 'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?', a: 'Leo', w: ['Jake', 'Kim', 'Cannot tell'], why: 'Order of arrival: Jake, then Kim, then Leo. Leo arrived last.' },
      { q: 'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'Only SOME dogs bark loudly, not all. Rex might or might not be one of them.' },
      { q: 'No fish can walk. Salmon is a fish. Can salmon walk?', a: 'No', w: ['Yes', 'Maybe', 'Sometimes'], why: 'If NO fish can walk and salmon IS a fish, then salmon cannot walk.' }
    ];
    
    const p = this.pick(puzzles);
    return {
      type: 'logic',
      category: 'logicalReasoning',
      categoryLabel: 'Logic',
      difficulty: 1.3,
      question: p.q,
      answer: p.a,
      options: this.shuffle([p.a, ...p.w]),
      explanation: p.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // VOCABULARY
  // ═══════════════════════════════════════════════════════════
  verbal() {
    const vocab = [
      { q: 'What is the opposite of "ancient"?', a: 'Modern', w: ['Old', 'Historic', 'Antique'], why: 'Ancient means very old; modern means new or current—they\'re opposites.' },
      { q: 'What word means the same as "rapid"?', a: 'Fast', w: ['Slow', 'Steady', 'Calm'], why: 'Rapid and fast both mean quick or speedy.' },
      { q: 'What is the opposite of "expand"?', a: 'Shrink', w: ['Grow', 'Stretch', 'Increase'], why: 'Expand means to get bigger; shrink means to get smaller.' },
      { q: 'What word means the same as "enormous"?', a: 'Huge', w: ['Tiny', 'Small', 'Medium'], why: 'Enormous and huge both mean very large.' },
      { q: 'What is the opposite of "generous"?', a: 'Selfish', w: ['Kind', 'Giving', 'Nice'], why: 'Generous means willing to give; selfish means unwilling to share.' },
      { q: 'What word means the same as "angry"?', a: 'Furious', w: ['Happy', 'Calm', 'Sad'], why: 'Angry and furious both describe strong negative emotion.' },
      { q: 'What is the opposite of "brave"?', a: 'Cowardly', w: ['Bold', 'Strong', 'Fierce'], why: 'Brave means courageous; cowardly means lacking courage.' },
      { q: 'What word means the same as "quiet"?', a: 'Silent', w: ['Loud', 'Noisy', 'Booming'], why: 'Quiet and silent both mean making little or no sound.' },
      { q: 'What is the opposite of "simple"?', a: 'Complex', w: ['Easy', 'Basic', 'Plain'], why: 'Simple means easy to understand; complex means complicated.' },
      { q: 'What word means the same as "intelligent"?', a: 'Smart', w: ['Dumb', 'Slow', 'Simple'], why: 'Intelligent and smart both mean having good mental ability.' }
    ];
    
    const v = this.pick(vocab);
    return {
      type: 'verbal',
      category: 'verbalReasoning',
      categoryLabel: 'Vocabulary',
      difficulty: 1.1,
      question: v.q,
      answer: v.a,
      options: this.shuffle([v.a, ...v.w]),
      explanation: v.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // SPATIAL
  // ═══════════════════════════════════════════════════════════
  spatial() {
    const items = [
      { q: 'Rotate ▲ by 180°', a: '▼', w: ['▲', '◀', '▶'], why: 'Rotating 180° flips it completely upside down.' },
      { q: 'Rotate ▶ by 90° clockwise', a: '▼', w: ['▲', '◀', '▶'], why: 'Turning right 90° makes the arrow point down.' },
      { q: 'Rotate ▼ by 90° counter-clockwise', a: '▶', w: ['▲', '◀', '▼'], why: 'Turning left 90° makes it point right.' },
      { q: 'Mirror ◀ horizontally', a: '▶', w: ['▲', '▼', '◀'], why: 'A horizontal mirror flips left to right.' },
      { q: 'Rotate ▲ by 90° clockwise', a: '▶', w: ['◀', '▼', '▲'], why: 'Turning the up-arrow right 90° makes it point right.' },
      { q: 'Mirror ▲ vertically', a: '▼', w: ['▲', '◀', '▶'], why: 'A vertical mirror flips top to bottom.' },
      { q: 'Rotate ◀ by 180°', a: '▶', w: ['▲', '▼', '◀'], why: 'Rotating 180° reverses the direction completely.' },
      { q: 'Rotate ▼ by 180°', a: '▲', w: ['▼', '◀', '▶'], why: 'Rotating 180° flips it to point upward.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'spatial',
      category: 'spatialAwareness',
      categoryLabel: 'Spatial',
      difficulty: 1.2,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // CODE BREAKING
  // ═══════════════════════════════════════════════════════════
  codeBreak() {
    const items = [
      { q: 'If A=1, B=2, C=3... what is A+B+C?', a: '6', w: ['3', '9', '5'], why: 'A=1, B=2, C=3. So 1+2+3 = 6' },
      { q: 'If ★=5 and ●=3, what is ★+●+★?', a: '13', w: ['11', '8', '15'], why: '5 + 3 + 5 = 13' },
      { q: 'If ◆+◆=10, what is ◆?', a: '5', w: ['10', '4', '6'], why: 'If two ◆ equal 10, one ◆ must be 5.' },
      { q: 'If A=1, B=2... what is D+E?', a: '9', w: ['7', '8', '10'], why: 'D=4, E=5. So 4+5 = 9' },
      { q: 'If ★×★=25, what is ★?', a: '5', w: ['4', '6', '25'], why: '5×5=25, so ★=5' },
      { q: 'If ▲=4, what is ▲+▲+▲?', a: '12', w: ['8', '4', '16'], why: '4+4+4 = 12' },
      { q: 'If ●×3=18, what is ●?', a: '6', w: ['3', '9', '18'], why: '18÷3 = 6' },
      { q: 'If A=1, B=2... what is A×B×C?', a: '6', w: ['3', '9', '12'], why: '1×2×3 = 6' },
      { q: 'If 🔵+🔴=10 and 🔵=4, what is 🔴?', a: '6', w: ['4', '5', '10'], why: '10-4 = 6' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'codeBreak',
      category: 'problemSolving',
      categoryLabel: 'Code Breaker',
      difficulty: 1.2,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // RIDDLES
  // ═══════════════════════════════════════════════════════════
  riddle() {
    const items = [
      { q: 'I have hands but cannot clap. What am I?', a: 'A clock', w: ['A person', 'A robot', 'A tree'], why: 'A clock has "hands" (hour and minute hands) but can\'t clap them.' },
      { q: 'What has keys but no locks?', a: 'A piano', w: ['A door', 'A car', 'A safe'], why: 'A piano has musical keys, not keys for locks.' },
      { q: 'What gets wetter the more it dries?', a: 'A towel', w: ['A sponge', 'Paper', 'The sun'], why: 'A towel absorbs water (gets wet) while drying other things.' },
      { q: 'What has a head and tail but no body?', a: 'A coin', w: ['A snake', 'A fish', 'A ghost'], why: 'Coins have a "heads" side and "tails" side.' },
      { q: 'What can you catch but not throw?', a: 'A cold', w: ['A ball', 'A fish', 'A wave'], why: 'You "catch" a cold (get sick), but can\'t throw it.' },
      { q: 'I\'m tall when young, short when old. What am I?', a: 'A candle', w: ['A person', 'A tree', 'A building'], why: 'Candles are tall when new and get shorter as they burn.' },
      { q: 'What runs but never walks?', a: 'Water', w: ['A dog', 'A car', 'Time'], why: 'Water "runs" (flows) but doesn\'t walk.' },
      { q: 'What has teeth but cannot bite?', a: 'A comb', w: ['A shark', 'A dog', 'A saw'], why: 'A comb has teeth-like prongs for hair, but can\'t bite.' },
      { q: 'What goes up but never comes down?', a: 'Your age', w: ['A balloon', 'A bird', 'Smoke'], why: 'Your age only increases, it never decreases.' },
      { q: 'What can fill a room but takes no space?', a: 'Light', w: ['Air', 'Water', 'Sound'], why: 'Light fills a room but has no physical mass or space.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'riddle',
      category: 'problemSolving',
      categoryLabel: 'Riddle',
      difficulty: 1.2,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // SERIES COMPLETION
  // ═══════════════════════════════════════════════════════════
  series() {
    const items = [
      { q: 'J, F, M, A, M, J, ?', a: 'J', w: ['A', 'S', 'D'], why: 'First letters of months: January, February... July starts with J.' },
      { q: 'S, M, T, W, T, F, ?', a: 'S', w: ['M', 'T', 'W'], why: 'First letters of weekdays: Sunday... ending with Saturday (S).' },
      { q: 'O, T, T, F, F, S, S, ?', a: 'E', w: ['N', 'T', 'S'], why: 'First letters of numbers: One, Two, Three... Eight starts with E.' },
      { q: 'R, O, Y, G, B, I, ?', a: 'V', w: ['P', 'R', 'O'], why: 'Colors of the rainbow: Red, Orange, Yellow, Green, Blue, Indigo, Violet.' },
      { q: 'M, V, E, M, J, S, U, ?', a: 'N', w: ['P', 'E', 'M'], why: 'First letters of planets: Mercury... ending with Neptune (N).' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'series',
      category: 'patternRecognition',
      categoryLabel: 'Complete the Series',
      difficulty: 1.4,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // COMPARISON
  // ═══════════════════════════════════════════════════════════
  comparison() {
    const items = [
      { q: 'Which is larger: 3/4 or 2/3?', a: '3/4', w: ['2/3', 'Equal', 'Cannot tell'], why: '3/4 = 0.75 and 2/3 ≈ 0.67, so 3/4 is larger.' },
      { q: 'Which is larger: 2³ or 3²?', a: '3²', w: ['2³', 'Equal', 'Cannot tell'], why: '2³ = 8 and 3² = 9, so 3² is larger.' },
      { q: 'Which is smaller: 1/3 or 0.5?', a: '1/3', w: ['0.5', 'Equal', 'Cannot tell'], why: '1/3 ≈ 0.33 which is less than 0.5' },
      { q: 'Which is larger: √16 or 3?', a: '√16', w: ['3', 'Equal', 'Cannot tell'], why: '√16 = 4, which is greater than 3.' },
      { q: 'Which is larger: 25% or 1/3?', a: '1/3', w: ['25%', 'Equal', 'Cannot tell'], why: '25% = 0.25 and 1/3 ≈ 0.33, so 1/3 is larger.' },
      { q: 'Which is smaller: 0.1 or 1/8?', a: '1/8', w: ['0.1', 'Equal', 'Cannot tell'], why: '1/8 = 0.125, but wait—0.1 < 0.125, so 0.1 is smaller!' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'comparison',
      category: 'numericalReasoning',
      categoryLabel: 'Compare',
      difficulty: 1.3,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // MISSING NUMBER IN EQUATION
  // ═══════════════════════════════════════════════════════════
  missingNum() {
    const items = [
      () => { const a = this.rand(5,20), b = this.rand(5,20); return { q: `? + ${b} = ${a+b}`, a, why: `${a+b} - ${b} = ${a}` }; },
      () => { const a = this.rand(30,70), b = this.rand(10,25); return { q: `${a} - ? = ${a-b}`, a: b, why: `${a} - ${a-b} = ${b}` }; },
      () => { const a = this.rand(2,9), b = this.rand(2,9); return { q: `? × ${b} = ${a*b}`, a, why: `${a*b} ÷ ${b} = ${a}` }; },
      () => { const a = this.rand(2,10), b = this.rand(2,10); return { q: `${a*b} ÷ ? = ${a}`, a: b, why: `${a*b} ÷ ${a} = ${b}` }; }
    ];
    
    const p = this.pick(items)();
    return {
      type: 'missingNum',
      category: 'mentalAgility',
      categoryLabel: 'Find the Missing Number',
      difficulty: 1.2,
      question: p.q,
      answer: String(p.a),
      options: this.numOpts(p.a).map(String),
      explanation: p.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // NEXT SHAPE PATTERN
  // ═══════════════════════════════════════════════════════════
  nextShape() {
    const items = [
      { q: '○ ○● ○●● → ?', a: '○●●●', w: ['●●●●', '○○●●', '○●○●'], why: 'Each step adds one filled circle. Next is ○●●●' },
      { q: '▲ ▲▲ ▲▲▲ → ?', a: '▲▲▲▲', w: ['▲▲▲', '▲▲', '▲▲▲▲▲'], why: 'Adding one triangle each time. Next is 4 triangles.' },
      { q: '◆ ◇ ◆ ◇ → ?', a: '◆', w: ['◇', '◆◇', '◇◆'], why: 'Alternating filled and empty. Next is filled (◆).' },
      { q: '● ●● ●●● ●●●● → ?', a: '●●●●●', w: ['●●●●', '●●●', '●●●●●●'], why: 'Adding one dot each time. Next is 5 dots.' },
      { q: '↑ → ↓ ← → ?', a: '↑', w: ['→', '↓', '←'], why: 'Rotating clockwise. After left comes up.' },
      { q: '■ □ ■ □ ■ → ?', a: '□', w: ['■', '■□', '□■'], why: 'Alternating filled and empty squares.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'nextShape',
      category: 'patternRecognition',
      categoryLabel: 'Shape Pattern',
      difficulty: 1.1,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // WORD CONNECTIONS
  // ═══════════════════════════════════════════════════════════
  wordLink() {
    const items = [
      { q: 'What word connects: BIRTH ___ LIGHT', a: 'DAY', w: ['SUN', 'NIGHT', 'TIME'], why: 'BIRTHDAY and DAYLIGHT both use DAY.' },
      { q: 'What word connects: RAIN ___ TIE', a: 'BOW', w: ['DROP', 'KNOT', 'WET'], why: 'RAINBOW and BOWTIE both use BOW.' },
      { q: 'What word connects: BUTTER ___ BALL', a: 'FLY', w: ['CUP', 'MILK', 'CREAM'], why: 'BUTTERFLY and FLYBALL both use FLY.' },
      { q: 'What word connects: FIRE ___ OVER', a: 'WORK', w: ['PLACE', 'MAN', 'LIGHT'], why: 'FIREWORK and WORKOUT both use WORK.' },
      { q: 'What word connects: TOOTH ___ KNIFE', a: 'PICK', w: ['BRUSH', 'PASTE', 'SHARP'], why: 'TOOTHPICK and PICKKNIFE... wait, JACKKNIFE—actually TOOTHPICK and POCKET.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'wordLink',
      category: 'verbalReasoning',
      categoryLabel: 'Word Link',
      difficulty: 1.3,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // ESTIMATION
  // ═══════════════════════════════════════════════════════════
  estimation() {
    const items = [
      { q: 'About how many days in a year?', a: '365', w: ['300', '400', '350'], why: 'A year has 365 days (366 in leap years).' },
      { q: 'Roughly how many hours in a week?', a: '168', w: ['100', '200', '150'], why: '24 hours × 7 days = 168 hours.' },
      { q: 'About how many seconds in an hour?', a: '3,600', w: ['360', '6,000', '1,800'], why: '60 seconds × 60 minutes = 3,600.' },
      { q: 'About how many weeks in a year?', a: '52', w: ['48', '56', '42'], why: '365 days ÷ 7 days ≈ 52 weeks.' },
      { q: 'Roughly how many minutes in a day?', a: '1,440', w: ['1,000', '2,000', '1,200'], why: '60 minutes × 24 hours = 1,440.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'estimation',
      category: 'numericalReasoning',
      categoryLabel: 'Estimation',
      difficulty: 1.1,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // ═══════════════════════════════════════════════════════════
  // TIME CALCULATIONS
  // ═══════════════════════════════════════════════════════════
  timeCalc() {
    const items = [
      { q: 'A movie starts at 7:30 PM and lasts 2 hours. When does it end?', a: '9:30 PM', w: ['9:00 PM', '10:00 PM', '8:30 PM'], why: '7:30 + 2 hours = 9:30 PM' },
      { q: 'It\'s 3:45 PM. What time was it 2 hours ago?', a: '1:45 PM', w: ['2:45 PM', '1:15 PM', '12:45 PM'], why: '3:45 - 2 hours = 1:45 PM' },
      { q: 'A train leaves at 8:15 AM and arrives at 10:45 AM. How long is the trip?', a: '2h 30m', w: ['2h', '2h 15m', '3h'], why: 'From 8:15 to 10:45 is 2 hours 30 minutes.' },
      { q: 'If you wake up at 7 AM after 8 hours of sleep, when did you fall asleep?', a: '11 PM', w: ['10 PM', '12 AM', '9 PM'], why: '7 AM - 8 hours = 11 PM the night before.' },
      { q: 'A 90-minute meeting starts at 2:00 PM. When does it end?', a: '3:30 PM', w: ['3:00 PM', '4:00 PM', '3:15 PM'], why: '90 minutes = 1.5 hours. 2:00 + 1:30 = 3:30 PM' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'timeCalc',
      category: 'mentalAgility',
      categoryLabel: 'Time Math',
      difficulty: 1.2,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  }
};