const IQData = {
  KEY: 'iq_profile_v5',
  
  defaults() {
    return {
      age: null,
      ratings: {
        patternRecognition: { r: 1000, n: 0, wins: 0, history: [] },
        problemSolving: { r: 1000, n: 0, wins: 0, history: [] },
        mentalAgility: { r: 1000, n: 0, wins: 0, history: [] },
        workingMemory: { r: 1000, n: 0, wins: 0, history: [] },
        verbalReasoning: { r: 1000, n: 0, wins: 0, history: [] },
        logicalReasoning: { r: 1000, n: 0, wins: 0, history: [] },
        spatialAwareness: { r: 1000, n: 0, wins: 0, history: [] },
        numericalReasoning: { r: 1000, n: 0, wins: 0, history: [] }
      },
      answered: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      iq: null,
      pic: null,
      xp: 0,
      level: 1,
      avgMs: 0,
      fastAnswers: 0,
      sessionStart: null,
      totalSessions: 0
    };
  },
  
  load() {
    try {
      const s = localStorage.getItem(this.KEY);
      if (!s) return this.defaults();
      const d = JSON.parse(s);
      // Migrate from v4 if needed
      const def = this.defaults();
      for (const k of Object.keys(def.ratings)) {
        if (!d.ratings[k]) d.ratings[k] = def.ratings[k];
        if (d.ratings[k].history === undefined) d.ratings[k].history = [];
        if (d.ratings[k].wins === undefined) d.ratings[k].wins = 0;
      }
      if (d.avgMs === undefined) d.avgMs = 0;
      if (d.fastAnswers === undefined) d.fastAnswers = 0;
      if (d.totalSessions === undefined) d.totalSessions = 0;
      return { ...def, ...d };
    } catch { return this.defaults(); }
  },
  
  save(d) {
    try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch {}
  },
  
  needsOnboarding() { return !this.load().age; },
  
  setAge(age) { const d = this.load(); d.age = age; this.save(d); },
  setProfilePic(url) { const d = this.load(); d.pic = url; this.save(d); },
  
  // Get adaptive difficulty for a category (0.5 = easy, 1.0 = medium, 1.5 = hard, 2.0 = expert)
  getDifficulty(cat) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c || c.n < 3) return 0.8; // Start slightly below medium
    // Scale difficulty based on rating
    const norm = (c.r - 600) / 800; // 0 to 1 range
    return 0.5 + norm * 1.5; // 0.5 to 2.0
  },
  
  // Get which category needs more questions (least answered)
  getWeakestCategory() {
    const d = this.load();
    let min = Infinity, weak = null;
    for (const [k, v] of Object.entries(d.ratings)) {
      if (v.n < min) { min = v.n; weak = k; }
    }
    return weak;
  },
  
  // Recent accuracy for a category (last 10)
  getRecentAccuracy(cat) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c || c.history.length === 0) return 0.5;
    const recent = c.history.slice(-10);
    return recent.filter(x => x).length / recent.length;
  },
  
  recordAnswer(cat, correct, diff, ms) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c) return d;
    
    // Elo update with dynamic K-factor
    const exp = 1 / (1 + Math.pow(10, (diff * 400 - (c.r - 1000)) / 400));
    const k = Math.max(16, 48 - c.n * 0.5); // Starts aggressive, settles
    c.r = Math.round(c.r + k * ((correct ? 1 : 0) - exp));
    c.r = Math.max(400, Math.min(1600, c.r));
    c.n++;
    if (correct) c.wins++;
    
    // Track history (keep last 50 per category)
    c.history.push(correct ? 1 : 0);
    if (c.history.length > 50) c.history = c.history.slice(-50);
    
    d.answered++;
    if (correct) {
      d.correct++;
      d.streak++;
      if (d.streak > d.bestStreak) d.bestStreak = d.streak;
    } else {
      d.streak = 0;
    }
    
    // Speed tracking
    d.avgMs = d.answered === 1 ? ms : Math.round(d.avgMs * 0.95 + ms * 0.05);
    if (correct && ms < 3500) d.fastAnswers = (d.fastAnswers || 0) + 1;
    
    // XP with bonuses
    let xp = correct ? 10 : 3;
    if (correct && ms < 3000) xp += 7; // Speed bonus
    else if (correct && ms < 5000) xp += 3;
    if (correct && d.streak >= 3) xp += Math.min(Math.floor(d.streak * 1.5), 20);
    if (correct && diff >= 1.5) xp += 5; // Hard question bonus
    d.xp += xp;
    
    const oldLvl = d.level;
    d.level = Math.floor(d.xp / 150) + 1;
    
    d.iq = this.calcIQ(d);
    this.save(d);
    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },
  
  calcIQ(d) {
    const w = {
      patternRecognition: 0.15,
      problemSolving: 0.14,
      mentalAgility: 0.13,
      workingMemory: 0.14,
      verbalReasoning: 0.13,
      logicalReasoning: 0.13,
      spatialAwareness: 0.09,
      numericalReasoning: 0.09
    };
    
    let sum = 0, wt = 0, games = 0;
    for (const [k, v] of Object.entries(w)) {
      const r = d.ratings[k];
      if (r && r.n > 0) {
        // Confidence ramps up with more questions
        const conf = Math.min(1, r.n / 10);
        sum += r.r * v * conf;
        wt += v * conf;
        games += r.n;
      }
    }
    
    if (wt === 0 || games < 5) return null;
    
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    
    // Confidence factor: IQ stabilizes as you answer more
    const conf = Math.min(1, games / 50);
    iq = 100 + (iq - 100) * conf;
    
    return Math.round(Math.max(55, Math.min(160, iq)));
  },
  
  getAccuracy() {
    const d = this.load();
    return d.answered === 0 ? 0 : Math.round((d.correct / d.answered) * 100);
  },
  
  getStatPercent(cat) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c || c.n === 0) return 50;
    return Math.round(Math.max(0, Math.min(100, ((c.r - 400) / 1200) * 100)));
  },
  
  getCategoryRating(cat) {
    const d = this.load();
    const c = d.ratings[cat];
    return c ? c.r : 1000;
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
  if (!correct) {
    const msgs = ['Keep going!', 'Next one!', 'Stay focused!', 'You got this!', 'Shake it off!', 'Almost!', 'Try again!', 'So close!'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (streak >= 15) return ['Legendary!', 'Unreal!', 'Machine!', 'Transcendent!', 'Flawless!'][Math.floor(Math.random() * 5)];
  if (streak >= 10) return ['Unstoppable!', 'Genius!', 'Incredible!', 'Insane!', 'Dominant!'][Math.floor(Math.random() * 5)];
  if (streak >= 5) return ['Amazing!', 'Brilliant!', 'Excellent!', 'Superb!', 'Crushed it!'][Math.floor(Math.random() * 5)];
  if (streak >= 3) return ['Great!', 'Nice streak!', 'Well done!', 'Keep it up!', 'Smooth!'][Math.floor(Math.random() * 5)];
  return ['Correct!', 'Right!', 'Got it!', 'Yes!', 'Nailed it!', 'Sharp!'][Math.floor(Math.random() * 6)];
}