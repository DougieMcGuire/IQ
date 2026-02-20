// IQ calculation based on Item Response Theory concepts
// Maps performance to bell curve with mean 100, SD 15

const IQData = {
  STORAGE_KEY: 'iq_profile_v3',
  
  defaults() {
    return {
      age: null,
      ratings: {
        patternRecognition: { elo: 1000, games: 0 },
        problemSolving: { elo: 1000, games: 0 },
        mentalAgility: { elo: 1000, games: 0 },
        workingMemory: { elo: 1000, games: 0 },
        verbalReasoning: { elo: 1000, games: 0 },
        logicalReasoning: { elo: 1000, games: 0 },
        spatialAwareness: { elo: 1000, games: 0 },
        processingSpeed: { elo: 1000, games: 0 }
      },
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      totalStreak: 0,
      iq: null,
      profilePic: null,
      level: 1,
      xp: 0,
      dailyGoal: 20,
      dailyProgress: 0,
      lastPlayDate: null,
      daysPlayed: 0,
      fastAnswers: 0,
      perfectRounds: 0,
      milestones: []
    };
  },
  
  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return { ...this.defaults(), ...data };
      }
    } catch (e) {}
    return this.defaults();
  },
  
  save(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  },
  
  needsOnboarding() {
    return !this.load().age;
  },
  
  setAge(age) {
    const data = this.load();
    data.age = age;
    this.save(data);
  },
  
  setProfilePic(dataUrl) {
    const data = this.load();
    data.profilePic = dataUrl;
    this.save(data);
  },
  
  // ELO-based rating update
  updateRating(current, expected, actual, k = 32) {
    return Math.round(current + k * (actual - expected));
  },
  
  // Calculate expected score based on difficulty
  expectedScore(rating, difficulty) {
    const diff = (difficulty * 400) - (rating - 1000);
    return 1 / (1 + Math.pow(10, diff / 400));
  },
  
  recordAnswer(category, correct, difficulty, timeMs) {
    const data = this.load();
    const cat = data.ratings[category];
    
    if (!cat) {
      console.warn('Unknown category:', category);
      return data;
    }
    
    // Calculate expected and update ELO
    const expected = this.expectedScore(cat.elo, difficulty);
    const actual = correct ? 1 : 0;
    const kFactor = Math.max(16, 40 - cat.games); // Higher K for fewer games
    
    cat.elo = this.updateRating(cat.elo, expected, actual, kFactor);
    cat.elo = Math.max(400, Math.min(1600, cat.elo)); // Clamp
    cat.games++;
    
    // Update stats
    data.questionsAnswered++;
    if (correct) {
      data.correctAnswers++;
      data.streak++;
      data.totalStreak++;
      if (data.streak > data.bestStreak) {
        data.bestStreak = data.streak;
      }
      // Fast answer bonus (under 5 seconds)
      if (timeMs && timeMs < 5000) {
        data.fastAnswers++;
      }
    } else {
      data.streak = 0;
    }
    
    // XP system
    let xpGain = correct ? 10 : 2;
    if (correct && timeMs && timeMs < 3000) xpGain += 5; // Speed bonus
    if (correct && data.streak >= 3) xpGain += Math.min(data.streak, 10); // Streak bonus
    data.xp += xpGain;
    
    // Level up (every 100 XP)
    const newLevel = Math.floor(data.xp / 100) + 1;
    const leveledUp = newLevel > data.level;
    data.level = newLevel;
    
    // Daily tracking
    const today = new Date().toDateString();
    if (data.lastPlayDate !== today) {
      data.lastPlayDate = today;
      data.dailyProgress = 0;
      data.daysPlayed++;
    }
    data.dailyProgress++;
    
    // Milestones
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    milestones.forEach(m => {
      if (data.questionsAnswered >= m && !data.milestones.includes(m)) {
        data.milestones.push(m);
      }
    });
    
    // Calculate IQ
    data.iq = this.calculateIQ(data);
    
    this.save(data);
    return { ...data, xpGain, leveledUp };
  },
  
  calculateIQ(data) {
    const weights = {
      patternRecognition: 0.18,
      problemSolving: 0.16,
      mentalAgility: 0.12,
      workingMemory: 0.14,
      verbalReasoning: 0.14,
      logicalReasoning: 0.14,
      spatialAwareness: 0.06,
      processingSpeed: 0.06
    };
    
    let totalWeight = 0;
    let weightedSum = 0;
    let totalGames = 0;
    
    for (const [cat, weight] of Object.entries(weights)) {
      const rating = data.ratings[cat];
      if (rating && rating.games > 0) {
        // More weight for categories with more data
        const confidence = Math.min(1, rating.games / 10);
        const effectiveWeight = weight * confidence;
        weightedSum += rating.elo * effectiveWeight;
        totalWeight += effectiveWeight;
        totalGames += rating.games;
      }
    }
    
    if (totalWeight === 0 || totalGames < 5) return null;
    
    const avgElo = weightedSum / totalWeight;
    
    // Convert ELO (400-1600, mean 1000) to IQ (55-145, mean 100)
    // ELO 1000 = IQ 100, each 100 ELO = 15 IQ points
    let iq = 100 + ((avgElo - 1000) / 100) * 15;
    
    // Confidence adjustment - scores converge to 100 with fewer questions
    const confidence = Math.min(1, totalGames / 50);
    iq = 100 + (iq - 100) * confidence;
    
    // Age adjustment (slight bonus for young/old)
    if (data.age) {
      if (data.age < 16) iq += (16 - data.age) * 0.5;
      else if (data.age > 60) iq += (data.age - 60) * 0.2;
    }
    
    return Math.round(Math.max(55, Math.min(145, iq)));
  },
  
  getAccuracy() {
    const data = this.load();
    if (data.questionsAnswered === 0) return 0;
    return Math.round((data.correctAnswers / data.questionsAnswered) * 100);
  },
  
  getStatPercent(category) {
    const data = this.load();
    const cat = data.ratings[category];
    if (!cat || cat.games === 0) return 50;
    // Convert ELO 400-1600 to 0-100
    return Math.round(((cat.elo - 400) / 1200) * 100);
  },
  
  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// IQ to percentile conversion (normal distribution)
function iqToPercentile(iq) {
  // Using standard normal CDF approximation
  const z = (iq - 100) / 15;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? Math.round((1 - p) * 100) : Math.round(p * 100);
}

function formatPercentile(pct) {
  if (pct <= 1) return '1%';
  if (pct >= 99) return '1%';
  return pct + '%';
}

// Get encouraging message based on performance
function getEncouragement(streak, correct) {
  if (!correct) {
    const msgs = ['Keep going!', 'You got this!', 'Next one!', 'Stay sharp!'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (streak >= 10) return ['Unstoppable! 🔥', 'Genius mode! 🧠', 'On fire! 🌟', 'Incredible! ⚡'][Math.floor(Math.random() * 4)];
  if (streak >= 5) return ['Amazing! 🎯', 'Brilliant! ✨', 'Superb! 💪', 'Crushing it! 🚀'][Math.floor(Math.random() * 4)];
  if (streak >= 3) return ['Nice streak!', 'Great job!', 'Well done!', 'Keep it up!'][Math.floor(Math.random() * 4)];
  return ['Correct! ✓', 'Right! ✓', 'Yes! ✓', 'Got it! ✓'][Math.floor(Math.random() * 4)];
}