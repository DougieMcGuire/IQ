const IQData = {
  KEY: 'iq_profile_v4',
  
  defaults() {
    return {
      age: null,
      ratings: {
        patternRecognition: { r: 1000, n: 0 },
        problemSolving: { r: 1000, n: 0 },
        mentalAgility: { r: 1000, n: 0 },
        workingMemory: { r: 1000, n: 0 },
        verbalReasoning: { r: 1000, n: 0 },
        logicalReasoning: { r: 1000, n: 0 },
        spatialAwareness: { r: 1000, n: 0 },
        numericalReasoning: { r: 1000, n: 0 }
      },
      answered: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      iq: null,
      pic: null,
      xp: 0,
      level: 1
    };
  },
  
  load() {
    try {
      const s = localStorage.getItem(this.KEY);
      return s ? { ...this.defaults(), ...JSON.parse(s) } : this.defaults();
    } catch { return this.defaults(); }
  },
  
  save(d) {
    try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch {}
  },
  
  needsOnboarding() { return !this.load().age; },
  
  setAge(age) {
    const d = this.load();
    d.age = age;
    this.save(d);
  },
  
  setProfilePic(url) {
    const d = this.load();
    d.pic = url;
    this.save(d);
  },
  
  recordAnswer(cat, correct, diff, ms) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c) return d;
    
    const exp = 1 / (1 + Math.pow(10, (diff * 400 - (c.r - 1000)) / 400));
    const k = Math.max(16, 40 - c.n);
    c.r = Math.round(c.r + k * ((correct ? 1 : 0) - exp));
    c.r = Math.max(400, Math.min(1600, c.r));
    c.n++;
    
    d.answered++;
    if (correct) {
      d.correct++;
      d.streak++;
      if (d.streak > d.bestStreak) d.bestStreak = d.streak;
    } else {
      d.streak = 0;
    }
    
    let xp = correct ? 10 : 3;
    if (correct && ms < 4000) xp += 5;
    if (correct && d.streak >= 3) xp += Math.min(d.streak * 2, 15);
    d.xp += xp;
    
    const oldLvl = d.level;
    d.level = Math.floor(d.xp / 150) + 1;
    
    d.iq = this.calcIQ(d);
    
    this.save(d);
    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },
  
  calcIQ(d) {
    const w = {
      patternRecognition: 0.16,
      problemSolving: 0.14,
      mentalAgility: 0.12,
      workingMemory: 0.14,
      verbalReasoning: 0.14,
      logicalReasoning: 0.14,
      spatialAwareness: 0.08,
      numericalReasoning: 0.08
    };
    
    let sum = 0, wt = 0, games = 0;
    for (const [k, v] of Object.entries(w)) {
      const r = d.ratings[k];
      if (r && r.n > 0) {
        const conf = Math.min(1, r.n / 8);
        sum += r.r * v * conf;
        wt += v * conf;
        games += r.n;
      }
    }
    
    if (wt === 0 || games < 5) return null;
    
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    const conf = Math.min(1, games / 40);
    iq = 100 + (iq - 100) * conf;
    
    return Math.round(Math.max(55, Math.min(145, iq)));
  },
  
  getAccuracy() {
    const d = this.load();
    return d.answered === 0 ? 0 : Math.round((d.correct / d.answered) * 100);
  },
  
  getStatPercent(cat) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c || c.n === 0) return 50;
    return Math.round(((c.r - 400) / 1200) * 100);
  },
  
  reset() { localStorage.removeItem(this.KEY); }
};

function iqToPercentile(iq) {
  const z = (iq - 100) / 15;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? Math.round((1 - p) * 100) : Math.round(p * 100);
}

function formatPercentile(p) {
  if (p <= 1) return '1%';
  if (p >= 99) return '99%';
  return p + '%';
}

function getEncouragement(streak, correct) {
  if (!correct) return ['Keep going!', 'Next one!', 'Stay focused!', 'You got this!'][Math.floor(Math.random() * 4)];
  if (streak >= 10) return ['Unstoppable!', 'Genius!', 'Incredible!', 'On fire!'][Math.floor(Math.random() * 4)];
  if (streak >= 5) return ['Amazing!', 'Brilliant!', 'Excellent!', 'Superb!'][Math.floor(Math.random() * 4)];
  if (streak >= 3) return ['Great!', 'Nice streak!', 'Well done!', 'Keep it up!'][Math.floor(Math.random() * 4)];
  return ['Correct!', 'Right!', 'Got it!', 'Yes!'][Math.floor(Math.random() * 4)];
}