const IQData = {
  KEY: 'iq_profile',
  
  defaults: {
    profilePic: null,
    age: null,
    iq: null,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    stats: {
      problemSolving: { correct: 0, total: 0, rating: 1000 },
      memory: { correct: 0, total: 0, rating: 1000 },
      patternRecognition: { correct: 0, total: 0, rating: 1000 },
      commonSense: { correct: 0, total: 0, rating: 1000 },
      mentalAgility: { correct: 0, total: 0, rating: 1000 },
      emotionalIntelligence: { correct: 0, total: 0, rating: 1000 },
      verbalReasoning: { correct: 0, total: 0, rating: 1000 },
      spatialAwareness: { correct: 0, total: 0, rating: 1000 }
    }
  },

  load() {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const merged = { ...this.defaults, ...data };
        merged.stats = { ...this.defaults.stats };
        if (data.stats) {
          for (const k in this.defaults.stats) {
            merged.stats[k] = { ...this.defaults.stats[k], ...data.stats[k] };
          }
        }
        return merged;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaults));
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  setAge(age) {
    const data = this.load();
    data.age = parseInt(age);
    this.save(data);
  },

  setProfilePic(base64) {
    const data = this.load();
    data.profilePic = base64;
    this.save(data);
  },

  needsOnboarding() {
    return this.load().age === null;
  },

  recordAnswer(category, isCorrect, difficulty) {
    const data = this.load();
    const stat = data.stats[category];
    if (!stat) return data;
    
    stat.total++;
    if (isCorrect) {
      stat.correct++;
      data.correctAnswers++;
      data.streak++;
      if (data.streak > data.bestStreak) data.bestStreak = data.streak;
    } else {
      data.streak = 0;
    }
    
    const k = 32 * difficulty;
    const expected = 1 / (1 + Math.pow(10, (1000 - stat.rating) / 400));
    stat.rating = Math.max(400, Math.min(1600, stat.rating + k * ((isCorrect ? 1 : 0) - expected)));
    
    data.questionsAnswered++;
    data.iq = this.calcIQ(data.stats);
    
    this.save(data);
    return data;
  },

  calcIQ(stats) {
    const weights = {
      problemSolving: 0.18,
      memory: 0.12,
      patternRecognition: 0.22,
      commonSense: 0.08,
      mentalAgility: 0.15,
      emotionalIntelligence: 0.05,
      verbalReasoning: 0.12,
      spatialAwareness: 0.08
    };

    let sum = 0, total = 0, questions = 0;
    for (const [k, w] of Object.entries(weights)) {
      const s = stats[k];
      if (s && s.total > 0) {
        sum += s.rating * w;
        total += w;
        questions += s.total;
      }
    }

    if (total === 0 || questions < 3) return null;

    const avg = sum / total;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    const conf = Math.min(1, questions / 25);
    iq = 100 + (iq - 100) * conf;
    
    return Math.round(Math.max(55, Math.min(195, iq)));
  },

  getStatPercent(category) {
    const data = this.load();
    const stat = data.stats[category];
    if (!stat) return 33;
    return Math.round(((stat.rating - 400) / 1200) * 100);
  },

  getAccuracy() {
    const data = this.load();
    if (data.questionsAnswered === 0) return 0;
    return Math.round((data.correctAnswers / data.questionsAnswered) * 100);
  },

  reset() {
    localStorage.removeItem(this.KEY);
  }
};

function erf(x) {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const s = x < 0 ? -1 : 1; x = Math.abs(x);
  const t = 1/(1+p*x);
  return s*(1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));
}

function iqToPercentile(iq) {
  if (!iq) return 50;
  const z = (iq - 100) / 15;
  return (1 - 0.5 * (1 + erf(z / Math.sqrt(2)))) * 100;
}

function formatPercentile(p) {
  if (p >= 10) return Math.round(p) + '%';
  if (p >= 1) return p.toFixed(1) + '%';
  if (p >= 0.1) return p.toFixed(2) + '%';
  return p.toFixed(3) + '%';
}