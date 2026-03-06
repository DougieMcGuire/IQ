// ═══════════════════════════════════════════════════
// FIREBASE SETUP
// ═══════════════════════════════════════════════════
import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
                                 from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp }
                                 from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBQDs2EXmb0YodZob6Hz4cSTm_hB146-No",
  authDomain:        "braindeer-backend.firebaseapp.com",
  projectId:         "braindeer-backend",
  storageBucket:     "braindeer-backend.firebasestorage.app",
  messagingSenderId: "331205139765",
  appId:             "1:331205139765:web:20cfef8194af63fc55c07c",
  measurementId:     "G-9B6885G0X0"
};

const _app = initializeApp(firebaseConfig);
const auth = getAuth(_app);
const db   = getFirestore(_app);

// ═══════════════════════════════════════════════════
// AUTH STATE
// ═══════════════════════════════════════════════════
let currentUser = null;
let _authResolve;
const authReady = new Promise(r => { _authResolve = r; });

onAuthStateChanged(auth, async user => {
  currentUser = user;
  _authResolve(user);
  if (user) await IQData._syncFromCloud();
});

// ═══════════════════════════════════════════════════
// PAGE GUARDS
// ═══════════════════════════════════════════════════
async function requireAuth() {
  await authReady;
  if (!currentUser && !IQData.isGuest()) {
    if (window.parent !== window) { parent.goTo('auth'); }
    else { window.location.href = '/auth.html'; }
  }
}

async function redirectIfLoggedIn() {
  await authReady;
  if (currentUser) {
    if (window.parent !== window) { parent.goTo('improve'); }
    else { window.location.href = '/improve.html'; }
  }
}

// ═══════════════════════════════════════════════════
// IQDATA — all local storage + cloud sync logic
// ═══════════════════════════════════════════════════
const SYNC_EVERY = 10;
let _pendingAnswers = 0;

const IQData = {
  KEY: 'iq_profile_v6',

  defaults() {
    return {
      version:      6,
      uid:          null,
      username:     null,
      pic:          null,
      age:          null,
      iq:           null,
      xp:           0,
      level:        1,
      answered:     0,
      correct:      0,
      streak:       0,
      bestStreak:   0,
      avgMs:        0,
      fastAnswers:  0,
      totalSessions:0,
      sessionStart: null,
      calibrated:   false, // Has the user done the initial IQ calibration?
      ratings: {
        patternRecognition: { r: 1000, n: 0, wins: 0, history: [] },
        problemSolving:     { r: 1000, n: 0, wins: 0, history: [] },
        mentalAgility:      { r: 1000, n: 0, wins: 0, history: [] },
        workingMemory:      { r: 1000, n: 0, wins: 0, history: [] },
        verbalReasoning:    { r: 1000, n: 0, wins: 0, history: [] },
        logicalReasoning:   { r: 1000, n: 0, wins: 0, history: [] },
        spatialAwareness:   { r: 1000, n: 0, wins: 0, history: [] },
        numericalReasoning: { r: 1000, n: 0, wins: 0, history: [] },
      }
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaults();
      const d = JSON.parse(raw);
      const def = this.defaults();
      for (const k of Object.keys(def.ratings)) {
        if (!d.ratings[k]) d.ratings[k] = def.ratings[k];
      }
      // Migration: add calibrated field if missing
      if (d.calibrated === undefined) d.calibrated = false;
      return d;
    } catch { return this.defaults(); }
  },

  save(d) {
    localStorage.setItem(this.KEY, JSON.stringify(d));
  },

  isGuest() { return localStorage.getItem('iq_guest') === '1'; },
  getCurrentUser() { return currentUser; },

  signOut() {
    signOut(auth).then(() => {
      localStorage.removeItem('iq_guest');
      if (window.parent !== window) { parent.goTo('auth'); }
      else { window.location.href = '/auth.html'; }
    });
  },

  // Only prompt age if NEITHER local nor cloud have it
  needsOnboarding() {
    const d = this.load();
    return !d.age;
  },

  // Has user done the 5-question calibration?
  needsCalibration() {
    const d = this.load();
    return !d.calibrated && d.answered < 5;
  },

  markCalibrated(iq) {
    const d = this.load();
    d.calibrated = true;
    d.iq = iq;
    this.save(d);
    this._pushToCloud(d);
  },

  // ─── Profile setters ──────────────────────────────
  setAge(age) {
    const d = this.load(); d.age = age; this.save(d);
    this._pushToCloud(d);
  },

  setProfilePic(url) {
    const d = this.load(); d.pic = url; this.save(d);
    this._pushToCloud(d);
  },

  setUsername(name) {
    const d = this.load(); d.username = name; this.save(d);
    this._pushToCloud(d);
  },

  // ─── Cloud sync ───────────────────────────────────
  async _syncFromCloud() {
    if (!currentUser) return;
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        const cloud  = snap.data();
        const local  = this.load();
        const merged = this._merge(local, cloud);
        merged.uid      = currentUser.uid;
        merged.username = cloud.username || currentUser.displayName || local.username || null;
        merged.pic      = cloud.pic || currentUser.photoURL || local.pic;
        // Persist age from cloud if local doesn't have it
        if (!local.age && cloud.age) merged.age = cloud.age;
        // Persist calibrated from cloud
        if (cloud.calibrated) merged.calibrated = true;
        this.save(merged);
      } else {
        const d = this.load();
        d.uid       = currentUser.uid;
        d.username  = currentUser.displayName || null;
        d.pic       = currentUser.photoURL || null;
        d.createdAt = new Date().toISOString();
        this.save(d);
        await this._pushToCloud(d);
      }
    } catch (e) {
      console.warn('[IQData] Cloud sync failed, using local:', e.message);
    }
  },

  _merge(local, cloud) {
    const m = { ...this.defaults(), ...local };
    for (const k of Object.keys(m.ratings)) {
      const lc = local.ratings?.[k];
      const cc = cloud.ratings?.[k];
      if (cc && cc.n > (lc?.n || 0)) m.ratings[k] = cc;
    }
    const hi = (a, b) => Math.max(a || 0, b || 0);
    m.answered      = hi(local.answered, cloud.answered);
    m.correct       = hi(local.correct, cloud.correct);
    m.bestStreak    = hi(local.bestStreak, cloud.bestStreak);
    m.xp            = hi(local.xp, cloud.xp);
    m.level         = Math.max(local.level || 1, cloud.level || 1);
    m.fastAnswers   = hi(local.fastAnswers, cloud.fastAnswers);
    m.totalSessions = hi(local.totalSessions, cloud.totalSessions);
    if (cloud.iq && cloud.answered >= local.answered) m.iq = cloud.iq;
    m.age = cloud.age || local.age;
    m.calibrated = local.calibrated || cloud.calibrated || false;
    return m;
  },

  async _pushToCloud(dataOverride) {
    if (!currentUser) return;
    try {
      const d = dataOverride ? { ...dataOverride } : { ...this.load() };
      for (const k of Object.keys(d.ratings)) {
        d.ratings[k] = { ...d.ratings[k] };
        d.ratings[k].history = (d.ratings[k].history || []).slice(-20);
      }
      delete d.sessionStart;
      d.lastSeen = serverTimestamp();
      await setDoc(doc(db, 'users', currentUser.uid), d, { merge: true });
    } catch (e) {
      console.warn('[IQData] Push failed:', e.message);
    }
  },

  async _maybeSync() {
    if (!currentUser) return;
    _pendingAnswers++;
    if (_pendingAnswers >= SYNC_EVERY) {
      _pendingAnswers = 0;
      await this._pushToCloud();
    }
  },

  // ─── Difficulty & categories ──────────────────────
  getDifficulty(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || c.n < 3) return 0.8;
    return 0.5 + ((c.r - 600) / 800) * 1.5;
  },

  getWeakestCategory() {
    const d = this.load();
    let min = Infinity, weak = null;
    for (const [k, v] of Object.entries(d.ratings)) {
      if (v.n < min) { min = v.n; weak = k; }
    }
    return weak;
  },

  getRecentAccuracy(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || !c.history.length) return 0.5;
    const r = c.history.slice(-10);
    return r.filter(x => x).length / r.length;
  },

  // ─── Core: record an answer ───────────────────────
  recordAnswer(cat, correct, diff, ms) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c) return d;

    const expected = 1 / (1 + Math.pow(10, (diff * 400 - (c.r - 1000)) / 400));
    const K = Math.max(16, 48 - c.n * 0.5);
    c.r = Math.round(c.r + K * ((correct ? 1 : 0) - expected));
    c.r = Math.max(400, Math.min(1600, c.r));
    c.n++;
    if (correct) c.wins++;
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

    d.avgMs = d.answered === 1 ? ms : Math.round(d.avgMs * 0.95 + ms * 0.05);
    if (correct && ms < 3500) d.fastAnswers++;

    let xp = correct ? 10 : 3;
    if (correct && ms < 3000)      xp += 7;
    else if (correct && ms < 5000) xp += 3;
    if (correct && d.streak >= 3)  xp += Math.min(Math.floor(d.streak * 1.5), 20);
    if (correct && diff >= 1.5)    xp += 5;
    d.xp += xp;

    const oldLvl = d.level;
    d.level = Math.floor(d.xp / 150) + 1;
    d.iq = this.calcIQ(d);
    this.save(d);
    this._maybeSync();

    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },

  // ─── IQ calculation ───────────────────────────────
  calcIQ(d) {
    const w = {
      patternRecognition: 0.15, problemSolving: 0.14,
      mentalAgility: 0.13, workingMemory: 0.14,
      verbalReasoning: 0.13, logicalReasoning: 0.13,
      spatialAwareness: 0.09, numericalReasoning: 0.09,
    };
    let sum = 0, wt = 0, games = 0;
    for (const [k, v] of Object.entries(w)) {
      const r = d.ratings[k];
      if (r && r.n > 0) {
        const conf = Math.min(1, r.n / 10);
        sum += r.r * v * conf;
        wt  += v * conf;
        games += r.n;
      }
    }
    if (wt === 0 || games < 5) return d.iq || null; // Keep calibrated IQ until enough data
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    iq = 100 + (iq - 100) * Math.min(1, games / 50);
    return Math.round(Math.max(55, Math.min(160, iq)));
  },

  // ─── Stats helpers ────────────────────────────────
  getAccuracy() {
    const d = this.load();
    return d.answered === 0 ? 0 : Math.round((d.correct / d.answered) * 100);
  },

  getStatPercent(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || c.n === 0) return 50;
    return Math.round(Math.max(0, Math.min(100, ((c.r - 400) / 1200) * 100)));
  },

  getCategoryRating(cat) {
    const d = this.load(), c = d.ratings[cat];
    return c ? c.r : 1000;
  },

  startSession() {
    const d = this.load();
    d.sessionStart   = Date.now();
    d.totalSessions  = (d.totalSessions || 0) + 1;
    this.save(d);
  },

  endSession() {
    _pendingAnswers = 0;
    this._pushToCloud();
  },

  reset() {
    localStorage.removeItem(this.KEY);
    if (currentUser) {
      const fresh = this.defaults();
      fresh.uid = currentUser.uid;
      this._pushToCloud(fresh);
    }
  }
};

window.addEventListener('beforeunload', () => {
  if (currentUser && _pendingAnswers > 0) IQData._pushToCloud();
});

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════
function iqToPercentile(iq) {
  const z = (iq - 100) / 15;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? Math.round((1 - p) * 100) : Math.round(p * 100);
}

function formatPercentile(p) {
  if (p <= 1)  return '1%';
  if (p >= 99) return '99%';
  return `${100 - p}%`;
}

function getEncouragement(streak, correct) {
  if (!correct) {
    return ['Keep going!','Next one!','Stay focused!','You got this!','Shake it off!','Almost!','Try again!','So close!']
      [Math.floor(Math.random() * 8)];
  }
  if (streak >= 15) return ['Legendary!','Unreal!','Machine!','Transcendent!','Flawless!'][Math.floor(Math.random() * 5)];
  if (streak >= 10) return ['Unstoppable!','Genius!','Incredible!','Insane!','Dominant!'][Math.floor(Math.random() * 5)];
  if (streak >= 5)  return ['Amazing!','Brilliant!','Excellent!','Superb!','Crushed it!'][Math.floor(Math.random() * 5)];
  if (streak >= 3)  return ['Great!','Nice streak!','Well done!','Keep it up!','Smooth!'][Math.floor(Math.random() * 5)];
  return ['Correct!','Right!','Got it!','Yes!','Nailed it!','Sharp!'][Math.floor(Math.random() * 6)];
}

export {
  IQData, auth, db,
  authReady, requireAuth, redirectIfLoggedIn,
  iqToPercentile, formatPercentile, getEncouragement
};