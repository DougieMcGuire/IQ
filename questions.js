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
      'estimation',
      'timeCalc',
      'wordLink', 'wordLink',
      'memoryTask', 'memoryTask',
      'emotionalIQ', 'emotionalIQ'
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

  // NUMBER SEQUENCES
  numSeq() {
    const patterns = [
      () => {
        const add = this.rand(3, 15);
        const start = this.rand(2, 40);
        return {
          seq: [start, start+add, start+add*2, start+add*3],
          ans: start+add*4,
          why: `Each number increases by ${add}. So ${start+add*3} + ${add} = ${start+add*4}`
        };
      },
      () => {
        const sub = this.rand(3, 9);
        const start = this.rand(50, 90);
        return {
          seq: [start, start-sub, start-sub*2, start-sub*3],
          ans: start-sub*4,
          why: `Each number decreases by ${sub}. So ${start-sub*3} - ${sub} = ${start-sub*4}`
        };
      },
      () => {
        const start = this.rand(2, 6);
        return {
          seq: [start, start*2, start*4, start*8],
          ans: start*16,
          why: `Each number doubles. So ${start*8} x 2 = ${start*16}`
        };
      },
      () => {
        const start = this.rand(1, 3);
        return {
          seq: [start, start*3, start*9, start*27],
          ans: start*81,
          why: `Each number triples. So ${start*27} x 3 = ${start*81}`
        };
      },
      () => {
        const off = this.rand(1, 5);
        return {
          seq: [off*off, (off+1)**2, (off+2)**2, (off+3)**2],
          ans: (off+4)**2,
          why: `Perfect squares: ${off}², ${off+1}², ${off+2}², ${off+3}², ${off+4}² = ${(off+4)**2}`
        };
      },
      () => {
        const a = this.rand(1, 4), b = this.rand(2, 5);
        const c = a+b, d = b+c, e = c+d;
        return {
          seq: [a, b, c, d],
          ans: e,
          why: `Each number is the sum of the two before it. ${c} + ${d} = ${e}`
        };
      },
      () => {
        const s = this.rand(1, 8);
        return {
          seq: [s, s+2, s+5, s+9],
          ans: s+14,
          why: `The gaps increase by 1 each time: +2, +3, +4, +5. So ${s+9} + 5 = ${s+14}`
        };
      },
      () => {
        return {
          seq: [2, 3, 5, 7],
          ans: 11,
          why: `These are prime numbers (only divisible by 1 and themselves). After 7 comes 11.`
        };
      },
      () => {
        return {
          seq: [1, 3, 6, 10],
          ans: 15,
          why: `Triangular numbers: add 2, then 3, then 4, then 5. So 10 + 5 = 15`
        };
      },
      () => {
        const start = this.rand(4, 8) * 16;
        return {
          seq: [start, start/2, start/4, start/8],
          ans: start/16,
          why: `Each number is halved. ${start/8} / 2 = ${start/16}`
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

  // LETTER SEQUENCES
  letterSeq() {
    const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const patterns = [
      () => {
        const i = this.rand(0, 18);
        return { seq: [alpha[i], alpha[i+1], alpha[i+2], alpha[i+3]], ans: alpha[i+4], why: `Consecutive letters in alphabetical order.` };
      },
      () => {
        const i = this.rand(0, 14);
        return { seq: [alpha[i], alpha[i+2], alpha[i+4], alpha[i+6]], ans: alpha[i+8], why: `Skip one letter each time (every other letter).` };
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

  // MATRIX PATTERNS
  matrix() {
    const type = this.rand(0, 3);
    let grid, ans, why;
    
    if (type === 0) {
      const sum = this.rand(15, 24);
      const a = this.rand(3, 7), b = this.rand(3, 7), c = sum - a - b;
      const d = this.rand(3, 7), e = this.rand(3, 7), f = sum - d - e;
      const g = this.rand(3, 7), h = this.rand(3, 7);
      ans = sum - g - h;
      grid = [a, b, c, d, e, f, g, h, '?'];
      why = `Each row adds up to ${sum}. In the last row: ${g} + ${h} + ? = ${sum}, so ? = ${ans}`;
    } else if (type === 1) {
      const add = this.rand(2, 5);
      const r = [this.rand(2, 6), this.rand(2, 6), this.rand(2, 6)];
      grid = [...r, r[0]+add, r[1]+add, r[2]+add, r[0]+add*2, r[1]+add*2, '?'];
      ans = r[2] + add*2;
      why = `Each column increases by ${add} going down. The third column: ${r[2]}, ${r[2]+add}, ${ans}`;
    } else if (type === 2) {
      const a = this.rand(2, 4), b = this.rand(2, 4);
      const d = this.rand(2, 4), e = this.rand(2, 4);
      const g = this.rand(2, 4), h = this.rand(2, 4);
      grid = [a, b, a*b, d, e, d*e, g, h, '?'];
      ans = g * h;
      why = `In each row, the third number = first x second. ${g} x ${h} = ${ans}`;
    } else {
      const mult = 2;
      const a = this.rand(2, 5), b = this.rand(2, 5), c = this.rand(2, 5);
      grid = [a, b, c, a*mult, b*mult, c*mult, a*mult*mult, b*mult*mult, '?'];
      ans = c*mult*mult;
      why = `Each row multiplies the previous by ${mult}. So ${c*mult} x ${mult} = ${ans}`;
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

  // ANALOGIES
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
      { a: 'Finger', b: 'Hand', c: 'Toe', d: 'Foot', why: 'Fingers are part of the hand, toes are part of the foot.' },
      { a: 'Leaf', b: 'Tree', c: 'Petal', d: 'Flower', why: 'Leaves grow on trees, petals grow on flowers.' },
      { a: 'Painter', b: 'Canvas', c: 'Writer', d: 'Paper', why: 'A painter works on a canvas, a writer works on paper.' },
      { a: 'Wheel', b: 'Car', c: 'Wing', d: 'Plane', why: 'A wheel is part of a car, a wing is part of a plane.' },
      { a: 'Library', b: 'Books', c: 'Museum', d: 'Art', why: 'A library stores books, a museum stores art.' }
    ];
    
    const i = this.pick(items);
    const wrong = items.filter(x => x.d !== i.d).map(x => x.d);
    
    return {
      type: 'analogy',
      category: 'verbalReasoning',
      categoryLabel: 'Analogy',
      difficulty: 1.2,
      question: `${i.a} is to ${i.b}, as ${i.c} is to _____`,
      answer: i.d,
      options: this.shuffle([i.d, ...this.shuffle(wrong).slice(0, 3)]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // MENTAL MATH
  math() {
    const ops = [
      () => { const a = this.rand(12, 78), b = this.rand(8, 45); return { q: `${a} + ${b}`, a: a+b, w: `${a} + ${b} = ${a+b}` }; },
      () => { const a = this.rand(50, 99), b = this.rand(10, 40); return { q: `${a} - ${b}`, a: a-b, w: `${a} - ${b} = ${a-b}` }; },
      () => { const a = this.rand(4, 12), b = this.rand(4, 12); return { q: `${a} x ${b}`, a: a*b, w: `${a} x ${b} = ${a*b}` }; },
      () => { const b = this.rand(2, 12), a = b * this.rand(3, 12); return { q: `${a} / ${b}`, a: a/b, w: `${a} / ${b} = ${a/b}` }; },
      () => { const n = this.rand(5, 12); return { q: `${n} squared`, a: n*n, w: `${n} x ${n} = ${n*n}` }; },
      () => { 
        const b = this.rand(2, 10) * 20, p = [10, 20, 25, 50][this.rand(0,3)]; 
        return { q: `${p}% of ${b}`, a: b*p/100, w: `${p}% of ${b} = ${b*p/100}` }; 
      },
      () => { const a = this.rand(15, 50), b = this.rand(10, 30), c = this.rand(5, 20); return { q: `${a} + ${b} - ${c}`, a: a+b-c, w: `${a} + ${b} = ${a+b}, then - ${c} = ${a+b-c}` }; },
      () => { const a = this.rand(2, 5), b = this.rand(2, 5), c = this.rand(2, 5); return { q: `${a} x ${b} x ${c}`, a: a*b*c, w: `${a} x ${b} = ${a*b}, then x ${c} = ${a*b*c}` }; }
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

  // ODD ONE OUT
  oddOut() {
    const sets = [
      { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', why: 'Carrot is a vegetable, the others are fruits.' },
      { items: ['Dog', 'Cat', 'Goldfish', 'Hamster'], odd: 'Goldfish', why: 'Goldfish lives underwater, the others live on land.' },
      { items: ['Red', 'Blue', 'Square', 'Green'], odd: 'Square', why: 'Square is a shape, the others are colors.' },
      { items: ['Piano', 'Guitar', 'Violin', 'Drums'], odd: 'Drums', why: 'Drums are percussion, the others produce melodic notes.' },
      { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 'Moon', why: 'Moon orbits Earth, the others orbit the Sun.' },
      { items: ['Dolphin', 'Shark', 'Whale', 'Seal'], odd: 'Shark', why: 'Shark is a fish, the others are mammals.' },
      { items: ['Python', 'Java', 'French', 'Ruby'], odd: 'French', why: 'French is a human language, the others are programming languages.' },
      { items: ['Gold', 'Silver', 'Diamond', 'Copper'], odd: 'Diamond', why: 'Diamond is a gemstone, the others are metals.' },
      { items: ['Eagle', 'Penguin', 'Sparrow', 'Hawk'], odd: 'Penguin', why: 'Penguins cannot fly, the others can.' },
      { items: ['Coffee', 'Tea', 'Juice', 'Bread'], odd: 'Bread', why: 'Bread is solid food, the others are drinks.' },
      { items: ['Circle', 'Triangle', 'Red', 'Square'], odd: 'Red', why: 'Red is a color, the others are shapes.' },
      { items: ['January', 'Monday', 'March', 'December'], odd: 'Monday', why: 'Monday is a day of the week, the others are months.' },
      { items: ['Hammer', 'Screwdriver', 'Banana', 'Wrench'], odd: 'Banana', why: 'Banana is food, the others are tools.' },
      { items: ['Oxygen', 'Iron', 'Copper', 'Gold'], odd: 'Oxygen', why: 'Oxygen is a gas at room temperature, the others are solid metals.' },
      { items: ['Tennis', 'Chess', 'Basketball', 'Soccer'], odd: 'Chess', why: 'Chess is a board game, the others are physical sports.' },
      { items: ['Bike', 'Car', 'Boat', 'Truck'], odd: 'Boat', why: 'Boat travels on water, the others travel on roads.' },
      { items: ['Rain', 'Snow', 'Hail', 'Wind'], odd: 'Wind', why: 'Wind is air movement, the others are forms of precipitation.' },
      { items: ['Cello', 'Flute', 'Violin', 'Harp'], odd: 'Flute', why: 'Flute is a wind instrument, the others are stringed.' }
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

  // LOGIC PUZZLES
  logic() {
    const puzzles = [
      { q: 'Tom is taller than Sam. Sam is taller than Mike. Who is shortest?', a: 'Mike', w: ['Tom', 'Sam', 'Cannot tell'], why: 'If Tom > Sam > Mike in height, Mike is at the bottom, so he\'s shortest.' },
      { q: 'Amy is older than Beth. Beth is older than Carol. Who is oldest?', a: 'Amy', w: ['Beth', 'Carol', 'Cannot tell'], why: 'Amy > Beth > Carol in age, so Amy is oldest.' },
      { q: 'Box A is heavier than B. Box C is lighter than B. Which is lightest?', a: 'C', w: ['A', 'B', 'Cannot tell'], why: 'A > B > C in weight, so C is lightest.' },
      { q: 'Red is darker than Yellow. Blue is darker than Red. Which is lightest?', a: 'Yellow', w: ['Red', 'Blue', 'Cannot tell'], why: 'Blue > Red > Yellow in darkness, so Yellow is lightest.' },
      { q: 'All cats have tails. Fluffy is a cat. Does Fluffy have a tail?', a: 'Yes', w: ['No', 'Maybe', 'Unknown'], why: 'Since ALL cats have tails and Fluffy IS a cat, Fluffy must have a tail.' },
      { q: 'If it rains, the grass is wet. The grass is wet. Did it rain?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'The grass could be wet from a sprinkler. We only know rain causes wetness, not that wetness means rain.' },
      { q: 'Jake arrived before Kim. Kim arrived before Leo. Who arrived last?', a: 'Leo', w: ['Jake', 'Kim', 'Cannot tell'], why: 'Order of arrival: Jake, then Kim, then Leo. Leo arrived last.' },
      { q: 'Some dogs bark loudly. Rex is a dog. Does Rex bark loudly?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'Only SOME dogs bark loudly, not all. Rex might or might not.' },
      { q: 'No fish can walk. Salmon is a fish. Can salmon walk?', a: 'No', w: ['Yes', 'Maybe', 'Sometimes'], why: 'If NO fish can walk and salmon IS a fish, then salmon cannot walk.' },
      { q: 'All roses are flowers. Some flowers fade quickly. Do all roses fade quickly?', a: 'Not necessarily', w: ['Yes', 'No', 'Always'], why: 'Only SOME flowers fade quickly. Roses are flowers but might not be in that group.' },
      { q: 'Lisa runs faster than Mia. Mia runs faster than Nora. Who is fastest?', a: 'Lisa', w: ['Mia', 'Nora', 'Cannot tell'], why: 'Lisa > Mia > Nora in speed, so Lisa is fastest.' }
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

  // VOCABULARY
  verbal() {
    const vocab = [
      { q: 'What is the opposite of "ancient"?', a: 'Modern', w: ['Old', 'Historic', 'Antique'], why: 'Ancient means very old; modern means new or current.' },
      { q: 'What word means the same as "rapid"?', a: 'Fast', w: ['Slow', 'Steady', 'Calm'], why: 'Rapid and fast both mean quick or speedy.' },
      { q: 'What is the opposite of "expand"?', a: 'Shrink', w: ['Grow', 'Stretch', 'Increase'], why: 'Expand means to get bigger; shrink means to get smaller.' },
      { q: 'What word means the same as "enormous"?', a: 'Huge', w: ['Tiny', 'Small', 'Medium'], why: 'Enormous and huge both mean very large.' },
      { q: 'What is the opposite of "generous"?', a: 'Selfish', w: ['Kind', 'Giving', 'Nice'], why: 'Generous means willing to give; selfish means unwilling to share.' },
      { q: 'What word means the same as "angry"?', a: 'Furious', w: ['Happy', 'Calm', 'Sad'], why: 'Angry and furious both describe strong negative emotion.' },
      { q: 'What is the opposite of "brave"?', a: 'Cowardly', w: ['Bold', 'Strong', 'Fierce'], why: 'Brave means courageous; cowardly means lacking courage.' },
      { q: 'What word means the same as "quiet"?', a: 'Silent', w: ['Loud', 'Noisy', 'Booming'], why: 'Quiet and silent both mean making little or no sound.' },
      { q: 'What is the opposite of "simple"?', a: 'Complex', w: ['Easy', 'Basic', 'Plain'], why: 'Simple means easy to understand; complex means complicated.' },
      { q: 'What word means the same as "intelligent"?', a: 'Smart', w: ['Dumb', 'Slow', 'Simple'], why: 'Intelligent and smart both mean having good mental ability.' },
      { q: 'What is the opposite of "reveal"?', a: 'Conceal', w: ['Show', 'Expose', 'Display'], why: 'Reveal means to show; conceal means to hide.' },
      { q: 'What word means the same as "wealthy"?', a: 'Rich', w: ['Poor', 'Cheap', 'Broke'], why: 'Wealthy and rich both mean having a lot of money.' },
      { q: 'What is the opposite of "temporary"?', a: 'Permanent', w: ['Brief', 'Short', 'Fleeting'], why: 'Temporary means lasting a short time; permanent means lasting forever.' },
      { q: 'What word means the same as "cautious"?', a: 'Careful', w: ['Reckless', 'Bold', 'Wild'], why: 'Cautious and careful both mean avoiding risk.' }
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

  // SPATIAL
  spatial() {
    const items = [
      { q: 'Rotate arrow pointing UP by 180 degrees', a: 'Down', w: ['Up', 'Left', 'Right'], why: 'Rotating 180 degrees flips it completely, so up becomes down.' },
      { q: 'Rotate arrow pointing RIGHT by 90 degrees clockwise', a: 'Down', w: ['Up', 'Left', 'Right'], why: 'Turning right 90 degrees clockwise makes it point down.' },
      { q: 'Rotate arrow pointing DOWN by 90 degrees counter-clockwise', a: 'Right', w: ['Up', 'Left', 'Down'], why: 'Turning down 90 degrees counter-clockwise makes it point right.' },
      { q: 'Mirror arrow pointing LEFT horizontally', a: 'Right', w: ['Up', 'Down', 'Left'], why: 'A horizontal mirror flips left to right.' },
      { q: 'Rotate arrow pointing UP by 90 degrees clockwise', a: 'Right', w: ['Left', 'Down', 'Up'], why: 'Turning the up-arrow right 90 degrees makes it point right.' },
      { q: 'Rotate arrow pointing LEFT by 180 degrees', a: 'Right', w: ['Up', 'Down', 'Left'], why: 'Rotating 180 degrees reverses the direction completely.' },
      { q: 'Rotate arrow pointing DOWN by 180 degrees', a: 'Up', w: ['Down', 'Left', 'Right'], why: 'Rotating 180 degrees flips it to point upward.' },
      { q: 'Rotate arrow pointing LEFT by 90 degrees clockwise', a: 'Up', w: ['Down', 'Right', 'Left'], why: 'Turning left 90 degrees clockwise makes it point up.' },
      { q: 'Rotate arrow pointing UP by 270 degrees clockwise', a: 'Left', w: ['Right', 'Down', 'Up'], why: '270 degrees clockwise is the same as 90 degrees counter-clockwise. Up becomes left.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'spatial',
      category: 'numericalReasoning',
      categoryLabel: 'Spatial',
      difficulty: 1.2,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // CODE BREAKING
  codeBreak() {
    const items = [
      { q: 'If A=1, B=2, C=3... what is A+B+C?', a: '6', w: ['3', '9', '5'], why: 'A=1, B=2, C=3. So 1+2+3 = 6' },
      { q: 'If X=5 and Y=3, what is X+Y+X?', a: '13', w: ['11', '8', '15'], why: '5 + 3 + 5 = 13' },
      { q: 'If N+N=10, what is N?', a: '5', w: ['10', '4', '6'], why: 'If two N equal 10, one N must be 5.' },
      { q: 'If A=1, B=2... what is D+E?', a: '9', w: ['7', '8', '10'], why: 'D=4, E=5. So 4+5 = 9' },
      { q: 'If X times X = 25, what is X?', a: '5', w: ['4', '6', '25'], why: '5 x 5 = 25, so X = 5' },
      { q: 'If M=4, what is M+M+M?', a: '12', w: ['8', '4', '16'], why: '4+4+4 = 12' },
      { q: 'If P times 3 = 18, what is P?', a: '6', w: ['3', '9', '18'], why: '18 / 3 = 6' },
      { q: 'If A=1, B=2... what is A x B x C?', a: '6', w: ['3', '9', '12'], why: '1 x 2 x 3 = 6' },
      { q: 'If X + Y = 10 and X = 4, what is Y?', a: '6', w: ['4', '5', '10'], why: '10 - 4 = 6' },
      { q: 'If A=2, B=4, C=6... what is E?', a: '10', w: ['8', '12', '5'], why: 'Each letter doubles its position: A=2, B=4, C=6, D=8, E=10' },
      { q: 'If X/2 = 7, what is X?', a: '14', w: ['7', '9', '12'], why: 'If X divided by 2 equals 7, then X = 7 x 2 = 14' }
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

  // RIDDLES
  riddle() {
    const items = [
      { q: 'I have hands but cannot clap. What am I?', a: 'A clock', w: ['A person', 'A robot', 'A tree'], why: 'A clock has "hands" (hour and minute hands) but cannot clap them.' },
      { q: 'What has keys but no locks?', a: 'A piano', w: ['A door', 'A car', 'A safe'], why: 'A piano has musical keys, not keys for locks.' },
      { q: 'What gets wetter the more it dries?', a: 'A towel', w: ['A sponge', 'Paper', 'The sun'], why: 'A towel absorbs water (gets wet) while drying other things.' },
      { q: 'What has a head and tail but no body?', a: 'A coin', w: ['A snake', 'A fish', 'A ghost'], why: 'Coins have a "heads" side and "tails" side.' },
      { q: 'What can you catch but not throw?', a: 'A cold', w: ['A ball', 'A fish', 'A wave'], why: 'You "catch" a cold (get sick), but you cannot throw it.' },
      { q: 'I am tall when young, short when old. What am I?', a: 'A candle', w: ['A person', 'A tree', 'A building'], why: 'Candles are tall when new and get shorter as they burn.' },
      { q: 'What runs but never walks?', a: 'Water', w: ['A dog', 'A car', 'Time'], why: 'Water "runs" (flows) but does not walk.' },
      { q: 'What has teeth but cannot bite?', a: 'A comb', w: ['A shark', 'A dog', 'A saw'], why: 'A comb has teeth-like prongs for hair, but cannot bite.' },
      { q: 'What goes up but never comes down?', a: 'Your age', w: ['A balloon', 'A bird', 'Smoke'], why: 'Your age only increases, it never decreases.' },
      { q: 'What can fill a room but takes no space?', a: 'Light', w: ['Air', 'Water', 'Sound'], why: 'Light fills a room but has no physical mass or space.' },
      { q: 'What has a neck but no head?', a: 'A bottle', w: ['A giraffe', 'A shirt', 'A guitar'], why: 'A bottle has a narrow neck but no head.' },
      { q: 'What has one eye but cannot see?', a: 'A needle', w: ['A pirate', 'A cyclops', 'A camera'], why: 'A needle has an "eye" for thread but cannot see.' }
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

  // SERIES COMPLETION
  series() {
    const items = [
      { q: 'J, F, M, A, M, J, ?', a: 'J', w: ['A', 'S', 'D'], why: 'First letters of months: January, February... July starts with J.' },
      { q: 'S, M, T, W, T, F, ?', a: 'S', w: ['M', 'T', 'W'], why: 'First letters of weekdays: Sunday... ending with Saturday (S).' },
      { q: 'O, T, T, F, F, S, S, ?', a: 'E', w: ['N', 'T', 'S'], why: 'First letters of numbers: One, Two, Three... Eight starts with E.' },
      { q: 'R, O, Y, G, B, I, ?', a: 'V', w: ['P', 'R', 'O'], why: 'Colors of the rainbow: Red, Orange, Yellow, Green, Blue, Indigo, Violet.' },
      { q: 'M, V, E, M, J, S, U, ?', a: 'N', w: ['P', 'E', 'M'], why: 'First letters of planets: Mercury, Venus... Neptune (N).' }
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

  // COMPARISON
  comparison() {
    const items = [
      { q: 'Which is larger: 3/4 or 2/3?', a: '3/4', w: ['2/3', 'Equal', 'Cannot tell'], why: '3/4 = 0.75 and 2/3 = 0.67, so 3/4 is larger.' },
      { q: 'Which is larger: 2 cubed or 3 squared?', a: '3 squared', w: ['2 cubed', 'Equal', 'Cannot tell'], why: '2 cubed = 8 and 3 squared = 9, so 3 squared is larger.' },
      { q: 'Which is smaller: 1/3 or 0.5?', a: '1/3', w: ['0.5', 'Equal', 'Cannot tell'], why: '1/3 = 0.33 which is less than 0.5' },
      { q: 'Which is larger: square root of 16 or 3?', a: 'Square root of 16', w: ['3', 'Equal', 'Cannot tell'], why: 'Square root of 16 = 4, which is greater than 3.' },
      { q: 'Which is larger: 25% or 1/3?', a: '1/3', w: ['25%', 'Equal', 'Cannot tell'], why: '25% = 0.25 and 1/3 = 0.33, so 1/3 is larger.' },
      { q: 'Which is smaller: 0.1 or 1/8?', a: '0.1', w: ['1/8', 'Equal', 'Cannot tell'], why: '0.1 = 0.1 and 1/8 = 0.125, so 0.1 is smaller.' },
      { q: 'Which is larger: 5 squared or 4 cubed?', a: '4 cubed', w: ['5 squared', 'Equal', 'Cannot tell'], why: '5 squared = 25 and 4 cubed = 64, so 4 cubed is larger.' },
      { q: 'Which is larger: 2/5 or 3/8?', a: '2/5', w: ['3/8', 'Equal', 'Cannot tell'], why: '2/5 = 0.40 and 3/8 = 0.375, so 2/5 is larger.' }
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

  // MISSING NUMBER IN EQUATION
  missingNum() {
    const items = [
      () => { const a = this.rand(5,20), b = this.rand(5,20); return { q: `? + ${b} = ${a+b}`, a, why: `${a+b} - ${b} = ${a}` }; },
      () => { const a = this.rand(30,70), b = this.rand(10,25); return { q: `${a} - ? = ${a-b}`, a: b, why: `${a} - ${a-b} = ${b}` }; },
      () => { const a = this.rand(2,9), b = this.rand(2,9); return { q: `? x ${b} = ${a*b}`, a, why: `${a*b} / ${b} = ${a}` }; },
      () => { const a = this.rand(2,10), b = this.rand(2,10); return { q: `${a*b} / ? = ${a}`, a: b, why: `${a*b} / ${a} = ${b}` }; }
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

  // ESTIMATION
  estimation() {
    const items = [
      { q: 'About how many days in a year?', a: '365', w: ['300', '400', '350'], why: 'A year has 365 days (366 in leap years).' },
      { q: 'Roughly how many hours in a week?', a: '168', w: ['100', '200', '150'], why: '24 hours x 7 days = 168 hours.' },
      { q: 'About how many seconds in an hour?', a: '3600', w: ['360', '6000', '1800'], why: '60 seconds x 60 minutes = 3600.' },
      { q: 'About how many weeks in a year?', a: '52', w: ['48', '56', '42'], why: '365 days / 7 days = about 52 weeks.' },
      { q: 'Roughly how many minutes in a day?', a: '1440', w: ['1000', '2000', '1200'], why: '60 minutes x 24 hours = 1440.' },
      { q: 'How many months have 31 days?', a: '7', w: ['5', '6', '8'], why: 'Jan, Mar, May, Jul, Aug, Oct, Dec = 7 months.' },
      { q: 'About how many bones in the adult human body?', a: '206', w: ['150', '300', '106'], why: 'An adult human has 206 bones.' }
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

  // TIME CALCULATIONS
  timeCalc() {
    const items = [
      { q: 'A movie starts at 7:30 PM and lasts 2 hours. When does it end?', a: '9:30 PM', w: ['9:00 PM', '10:00 PM', '8:30 PM'], why: '7:30 + 2 hours = 9:30 PM' },
      { q: 'It is 3:45 PM. What time was it 2 hours ago?', a: '1:45 PM', w: ['2:45 PM', '1:15 PM', '12:45 PM'], why: '3:45 - 2 hours = 1:45 PM' },
      { q: 'A train leaves at 8:15 AM and arrives at 10:45 AM. How long is the trip?', a: '2h 30m', w: ['2h', '2h 15m', '3h'], why: 'From 8:15 to 10:45 is 2 hours 30 minutes.' },
      { q: 'If you wake up at 7 AM after 8 hours of sleep, when did you fall asleep?', a: '11 PM', w: ['10 PM', '12 AM', '9 PM'], why: '7 AM - 8 hours = 11 PM the night before.' },
      { q: 'A 90-minute meeting starts at 2:00 PM. When does it end?', a: '3:30 PM', w: ['3:00 PM', '4:00 PM', '3:15 PM'], why: '90 minutes = 1.5 hours. 2:00 + 1:30 = 3:30 PM' },
      { q: 'A flight departs at 11:45 AM and is 3 hours long. Landing time?', a: '2:45 PM', w: ['2:15 PM', '3:45 PM', '1:45 PM'], why: '11:45 + 3 hours = 2:45 PM' }
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
  },

  // WORD LINK - What word connects FIRST ___ SECOND
  wordLink() {
    const items = [
      { first: 'FIRE', second: 'OUT', a: 'WORK', w: ['LIGHT', 'MAN', 'PLACE'], why: 'FIREWORK and WORKOUT both use WORK.' },
      { first: 'BOOK', second: 'HOLE', a: 'WORM', w: ['CASE', 'MARK', 'SHELF'], why: 'BOOKWORM and WORMHOLE both use WORM.' },
      { first: 'SUN', second: 'HOUSE', a: 'LIGHT', w: ['BURN', 'RISE', 'SET'], why: 'SUNLIGHT and LIGHTHOUSE both use LIGHT.' },
      { first: 'FOOT', second: 'ROOM', a: 'BALL', w: ['STEP', 'NOTE', 'PRINT'], why: 'FOOTBALL and BALLROOM both use BALL.' },
      { first: 'HEAD', second: 'STAND', a: 'BAND', w: ['LINE', 'SET', 'PHONE'], why: 'HEADBAND and BANDSTAND both use BAND.' },
      { first: 'RAIN', second: 'TIE', a: 'BOW', w: ['DROP', 'COAT', 'FALL'], why: 'RAINBOW and BOWTIE both use BOW.' },
      { first: 'TOOTH', second: 'POCKET', a: 'PICK', w: ['BRUSH', 'PASTE', 'ACHE'], why: 'TOOTHPICK and PICKPOCKET both use PICK.' },
      { first: 'DOOR', second: 'TOWER', a: 'BELL', w: ['KNOB', 'STEP', 'WAY'], why: 'DOORBELL and BELLTOWER both use BELL.' },
      { first: 'BASE', second: 'GAME', a: 'BALL', w: ['LINE', 'CAMP', 'BOARD'], why: 'BASEBALL and BALLGAME both use BALL.' },
      { first: 'BACK', second: 'WORK', a: 'FIRE', w: ['HAND', 'YARD', 'BONE'], why: 'BACKFIRE and FIREWORK both use FIRE.' },
      { first: 'OUT', second: 'LINE', a: 'SIDE', w: ['BACK', 'RUN', 'LAW'], why: 'OUTSIDE and SIDELINE both use SIDE.' },
      { first: 'DAY', second: 'HOUSE', a: 'LIGHT', w: ['TIME', 'BREAK', 'DREAM'], why: 'DAYLIGHT and LIGHTHOUSE both use LIGHT.' },
      { first: 'AIR', second: 'HOLE', a: 'PORT', w: ['LINE', 'CRAFT', 'PLANE'], why: 'AIRPORT and PORTHOLE both use PORT.' },
      { first: 'HAND', second: 'DOWN', a: 'SHAKE', w: ['MADE', 'CUFF', 'RAIL'], why: 'HANDSHAKE and SHAKEDOWN both use SHAKE.' },
      { first: 'SNOW', second: 'PARK', a: 'BALL', w: ['FLAKE', 'MAN', 'DRIFT'], why: 'SNOWBALL and BALLPARK both use BALL.' },
      { first: 'WATER', second: 'OUT', a: 'FALL', w: ['MARK', 'PROOF', 'SIDE'], why: 'WATERFALL and FALLOUT both use FALL.' },
      { first: 'BED', second: 'TEMPERATURE', a: 'ROOM', w: ['TIME', 'SIDE', 'SHEET'], why: 'BEDROOM and ROOM TEMPERATURE both use ROOM.' },
      { first: 'STAR', second: 'TANK', a: 'FISH', w: ['LIGHT', 'SHIP', 'DUST'], why: 'STARFISH and FISHTANK both use FISH.' },
      { first: 'SAND', second: 'WORK', a: 'PAPER', w: ['CASTLE', 'STORM', 'BOX'], why: 'SANDPAPER and PAPERWORK both use PAPER.' },
      { first: 'EYE', second: 'STICK', a: 'LID', w: ['BALL', 'BROW', 'LASH'], why: 'EYELID and LIDSTICK... wait no. Actually: think of LIPSTICK. Hmm.' }
    ];
    
    // Remove the last one, it's iffy
    const safeItems = items.slice(0, -1);
    const i = this.pick(safeItems);
    
    return {
      type: 'wordLink',
      category: 'verbalReasoning',
      categoryLabel: 'Word Link',
      difficulty: 1.3,
      question: `What word connects: ${i.first} ___ ${i.second}`,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  },

  // WORKING MEMORY - Mental manipulation tasks
  memoryTask() {
    const items = [
      () => {
        const word = this.pick(['BRAIN', 'SMART', 'THINK', 'LEARN', 'QUICK', 'POWER', 'LIGHT', 'DREAM', 'SPACE', 'WORLD', 'HEART', 'STONE', 'FLAME', 'CLOUD', 'STORM']);
        const rev = word.split('').reverse().join('');
        const wrong = [
          word.split('').reverse().map((c,i) => i === 1 ? word[1] : c).join(''),
          word.split('').reverse().map((c,i) => i === 0 ? word[0] : c).join(''),
          word
        ];
        return { q: `What is "${word}" spelled backwards?`, a: rev, w: wrong.filter(w => w !== rev).slice(0, 3), why: `Reading ${word} backwards letter by letter gives ${rev}.` };
      },
      () => {
        const nums = [this.rand(2,9), this.rand(2,9), this.rand(2,9), this.rand(2,9)];
        const sum = nums.reduce((a,b) => a+b, 0);
        return { q: `Add these in your head: ${nums.join(', ')}`, a: String(sum), w: [String(sum+2), String(sum-1), String(sum+3)], why: `${nums.join(' + ')} = ${sum}` };
      },
      () => {
        const nums = [this.rand(10,50), this.rand(10,50), this.rand(10,50)];
        const sorted = [...nums].sort((a,b) => a-b);
        return { q: `What is the middle value of: ${nums.join(', ')}?`, a: String(sorted[1]), w: [String(sorted[0]), String(sorted[2]), String(sorted[1]+1)], why: `Sorted: ${sorted.join(', ')}. The middle value is ${sorted[1]}.` };
      },
      () => {
        const a = this.rand(2, 8), b = this.rand(2, 8), c = this.rand(2, 8);
        const ans = a * b + c;
        return { q: `${a} x ${b}, then + ${c} = ?`, a: String(ans), w: [String(ans+2), String(ans-3), String(a+b+c)], why: `${a} x ${b} = ${a*b}, then + ${c} = ${ans}` };
      },
      () => {
        const word = this.pick(['PLANET', 'GARDEN', 'CASTLE', 'BRIDGE', 'SILVER', 'ORANGE', 'WINTER', 'FOREST', 'SUNSET', 'VOYAGE']);
        const pos = this.rand(2, 4);
        const letter = word[pos];
        return { q: `In "${word}", what is the ${['','','3rd','4th','5th'][pos]} letter?`, a: letter, w: this.shuffle(word.split('').filter(l => l !== letter)).slice(0, 3), why: `Counting the letters: ${word.split('').map((l,i) => i === pos ? `[${l}]` : l).join('')}. The ${['','','3rd','4th','5th'][pos]} letter is ${letter}.` };
      },
      () => {
        const a = this.rand(20, 60), b = this.rand(10, 30), c = this.rand(5, 15);
        const ans = a - b + c;
        return { q: `Start at ${a}, subtract ${b}, add ${c}. Result?`, a: String(ans), w: [String(ans+3), String(ans-2), String(a-b-c)], why: `${a} - ${b} = ${a-b}, then + ${c} = ${ans}` };
      },
      () => {
        const items = this.shuffle(['Red', 'Blue', 'Green', 'Yellow', 'Purple']);
        const pos = this.rand(0, 4);
        const ordinals = ['first', 'second', 'third', 'fourth', 'last'];
        return { q: `In this list: ${items.join(', ')} - which is ${ordinals[pos]}?`, a: items[pos], w: this.shuffle(items.filter(i => i !== items[pos])).slice(0, 3), why: `Counting through the list, ${items[pos]} is in the ${ordinals[pos]} position.` };
      }
    ];
    
    const gen = this.pick(items)();
    return {
      type: 'memoryTask',
      category: 'workingMemory',
      categoryLabel: 'Working Memory',
      difficulty: 1.2,
      question: gen.q,
      answer: gen.a,
      options: this.shuffle([gen.a, ...gen.w.filter(w => w !== gen.a).slice(0, 3)]),
      explanation: gen.why,
      visual: 'text'
    };
  },

  // EMOTIONAL INTELLIGENCE
  emotionalIQ() {
    const items = [
      { q: 'Your friend cancels plans last minute. They seem stressed. Best response?', a: 'Ask if they\'re okay', w: ['Get angry at them', 'Ignore them', 'Cancel on them next time'], why: 'Showing concern for their wellbeing builds trust and shows empathy.' },
      { q: 'A coworker takes credit for your idea. Best first step?', a: 'Talk to them privately', w: ['Yell at them publicly', 'Do nothing', 'Complain to everyone'], why: 'A private conversation addresses the issue directly without creating conflict.' },
      { q: 'Someone is visibly upset but says "I\'m fine." What do they likely mean?', a: 'They\'re not fine but don\'t want to talk', w: ['They are actually fine', 'They want you to leave', 'They\'re testing you'], why: 'Body language often contradicts words. They may need space or gentle support.' },
      { q: 'You made a mistake at work. Best approach?', a: 'Own it and fix it', w: ['Hide it', 'Blame someone else', 'Wait and hope no one notices'], why: 'Taking responsibility shows integrity and usually leads to faster resolution.' },
      { q: 'A friend is venting about their day. What do they most likely want?', a: 'Someone to listen', w: ['Advice on what to do', 'To be told to calm down', 'Solutions to their problems'], why: 'Most people who vent want to feel heard, not necessarily given advice.' },
      { q: 'You disagree with a group decision. Best approach?', a: 'Share your view respectfully', w: ['Go along silently', 'Refuse to participate', 'Argue until you win'], why: 'Expressing disagreement respectfully leads to better group outcomes.' },
      { q: 'Someone gives you harsh feedback. Best initial reaction?', a: 'Listen and consider it', w: ['Defend yourself immediately', 'Walk away', 'Give them harsh feedback back'], why: 'Even harsh feedback can contain useful truth. Listening first keeps options open.' },
      { q: 'You notice a new person at school/work sitting alone. Best response?', a: 'Introduce yourself', w: ['Assume they want to be alone', 'Wait for them to approach you', 'Ignore them'], why: 'A simple introduction can make someone feel welcome and included.' },
      { q: 'Your friend just failed an important exam. What should you say?', a: 'Acknowledge their feelings, offer support', w: ['Tell them it\'s not a big deal', 'List what they did wrong', 'Share how well you did'], why: 'Validating their feelings first shows empathy before offering solutions.' },
      { q: 'Two friends are in an argument and both want you to pick a side. Best move?', a: 'Stay neutral, encourage them to talk', w: ['Pick the friend you like more', 'Avoid both of them', 'Tell them both they\'re wrong'], why: 'Staying neutral preserves both relationships and encourages direct resolution.' },
      { q: 'You feel overwhelmed with tasks. Best coping strategy?', a: 'Break tasks into smaller steps', w: ['Ignore everything', 'Try to do it all at once', 'Complain to everyone'], why: 'Breaking things down makes them manageable and reduces anxiety.' },
      { q: 'Someone apologizes to you sincerely. Best response?', a: 'Accept it gracefully', w: ['Make them feel guilty', 'Say "whatever"', 'Demand more apologies'], why: 'Accepting a sincere apology allows both people to move forward.' }
    ];
    
    const i = this.pick(items);
    return {
      type: 'emotionalIQ',
      category: 'spatialAwareness',
      categoryLabel: 'Emotional',
      difficulty: 1.1,
      question: i.q,
      answer: i.a,
      options: this.shuffle([i.a, ...i.w]),
      explanation: i.why,
      visual: 'text'
    };
  }
};