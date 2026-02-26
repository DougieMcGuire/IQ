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

const _app  = initializeApp(firebaseConfig);
const auth  = getAuth(_app);
const db    = getFirestore(_app);

// ═══════════════════════════════════════════════════
// AUTH STATE
// Resolves once Firebase tells us who the user is (or null)
// Every other module can await authReady before doing anything
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
// PAGE GUARDS  (call at top of each page)
// ═══════════════════════════════════════════════════

// Protected pages: improve.html, profile.html
// If visitor is neither logged-in nor a guest → send to auth
async function requireAuth() {
  await authReady;
  if (!currentUser && !IQData.isGuest()) {
    window.location.href = '/auth.html';
  }
}

// auth.html: already logged in? skip straight to the app
async function redirectIfLoggedIn() {
  await authReady;
  if (currentUser) window.location.href = '/improve.html';
}

// ═══════════════════════════════════════════════════
// SYNC STRATEGY  (stay well inside free tier)
// Free tier: 20K writes / day
// We write every 10 correct answers + on page unload + on session end
// A single user would need 200K answers/day to hit the cap — impossible
// ═══════════════════════════════════════════════════
const SYNC_EVERY = 10;
let _pendingAnswers = 0;

// ═══════════════════════════════════════════════════
// IQData — the single source of truth
// ═══════════════════════════════════════════════════
const IQData = {
  KEY:       'iq_profile_v6',
  GUEST_KEY: 'iq_guest',

  // ─── Schema ──────────────────────────────────────
  defaults() {
    return {
      uid:      null,
      username: null,
      age:      null,
      ratings: {
        patternRecognition: { r:1000, n:0, wins:0, history:[] },
        problemSolving:     { r:1000, n:0, wins:0, history:[] },
        mentalAgility:      { r:1000, n:0, wins:0, history:[] },
        workingMemory:      { r:1000, n:0, wins:0, history:[] },
        verbalReasoning:    { r:1000, n:0, wins:0, history:[] },
        logicalReasoning:   { r:1000, n:0, wins:0, history:[] },
        spatialAwareness:   { r:1000, n:0, wins:0, history:[] },
        numericalReasoning: { r:1000, n:0, wins:0, history:[] }
      },
      answered:      0,
      correct:       0,
      streak:        0,
      bestStreak:    0,
      iq:            null,
      pic:           null,
      xp:            0,
      level:         1,
      avgMs:         0,
      fastAnswers:   0,
      totalSessions: 0,
      createdAt:     null,
      lastSeen:      null,
    };
  },

  // ─── Local storage ───────────────────────────────
  load() {
    try {
      const s = localStorage.getItem(this.KEY);
      if (!s) return this.defaults();
      const d    = JSON.parse(s);
      const def  = this.defaults();
      // Migrate: fill any missing rating keys
      for (const k of Object.keys(def.ratings)) {
        if (!d.ratings[k])                    d.ratings[k]         = def.ratings[k];
        if (d.ratings[k].history === undefined) d.ratings[k].history = [];
        if (d.ratings[k].wins   === undefined) d.ratings[k].wins   = 0;
      }
      // Migrate: fill any missing top-level keys
      for (const k of Object.keys(def)) {
        if (d[k] === undefined) d[k] = def[k];
      }
      return d;
    } catch { return this.defaults(); }
  },

  save(d) {
    try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch {}
  },

  // ─── Guest mode ──────────────────────────────────
  // Guest: plays without an account; data is local-only
  isGuest()     { return localStorage.getItem(this.GUEST_KEY) === '1'; },
  setGuest(v)   { localStorage.setItem(this.GUEST_KEY, v ? '1' : '0'); },

  // ─── Auth helpers ────────────────────────────────
  isLoggedIn()     { return !!currentUser; },
  getCurrentUser() { return currentUser; },

  async signOut() {
    await this._pushToCloud();          // save before leaving
    await signOut(auth);
    localStorage.removeItem(this.KEY);
    localStorage.removeItem(this.GUEST_KEY);
    window.location.href = '/auth.html';
  },

  // ─── Profile setters ─────────────────────────────
  needsOnboarding() { return !this.load().age; },

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

  // ─── Cloud sync ──────────────────────────────────

  // Pull Firestore → merge → save locally
  async _syncFromCloud() {
    if (!currentUser) return;
    try {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) {
        const cloud  = snap.data();
        const local  = this.load();
        const merged = this._merge(local, cloud);
        merged.uid      = currentUser.uid;
        merged.username = cloud.username || currentUser.displayName || null;
        merged.pic      = cloud.pic || currentUser.photoURL || local.pic;
        this.save(merged);
      } else {
        // First ever login — push local progress to cloud
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

  // Merge strategy: always keep the higher / more-progressed value
  _merge(local, cloud) {
    const m = { ...this.defaults(), ...local };
    for (const k of Object.keys(m.ratings)) {
      const lc = local.ratings?.[k];
      const cc = cloud.ratings?.[k];
      if (cc && cc.n > (lc?.n || 0)) m.ratings[k] = cc;
    }
    const hi = (a, b) => Math.max(a || 0, b || 0);
    m.answered      = hi(local.answered,      cloud.answered);
    m.correct       = hi(local.correct,       cloud.correct);
    m.bestStreak    = hi(local.bestStreak,    cloud.bestStreak);
    m.xp            = hi(local.xp,            cloud.xp);
    m.level         = Math.max(local.level || 1, cloud.level || 1);
    m.fastAnswers   = hi(local.fastAnswers,   cloud.fastAnswers);
    m.totalSessions = hi(local.totalSessions, cloud.totalSessions);
    if (cloud.iq && cloud.answered >= local.answered) m.iq = cloud.iq;
    m.age = cloud.age || local.age;
    return m;
  },

  // Push local state → Firestore (fire-and-forget, never blocks gameplay)
  async _pushToCloud(dataOverride) {
    if (!currentUser) return;
    try {
      const d = dataOverride ? { ...dataOverride } : { ...this.load() };

      // Trim history to last 20 entries per category to save Firestore bytes
      for (const k of Object.keys(d.ratings)) {
        d.ratings[k] = { ...d.ratings[k] };
        d.ratings[k].history = (d.ratings[k].history || []).slice(-20);
      }

      // Ephemeral fields — don't persist these
      delete d.streak;        // resets each session anyway
      delete d.sessionStart;

      d.lastSeen = serverTimestamp();
      await setDoc(doc(db, 'users', currentUser.uid), d, { merge: true });
    } catch (e) {
      console.warn('[IQData] Push failed:', e.message);
      // Silent fail — local data intact, will retry next answer batch
    }
  },

  // Call after recording each answer
  async _maybeSync() {
    if (!currentUser) return;
    _pendingAnswers++;
    if (_pendingAnswers >= SYNC_EVERY) {
      _pendingAnswers = 0;
      await this._pushToCloud();
    }
  },

  // ─── Difficulty & categories ─────────────────────
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

  // ─── Core: record an answer ──────────────────────
  recordAnswer(cat, correct, diff, ms) {
    const d = this.load();
    const c = d.ratings[cat];
    if (!c) return d;

    // Elo — dynamic K (aggressive early, settles after ~64 games)
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

    // Speed (exponential moving average)
    d.avgMs = d.answered === 1 ? ms : Math.round(d.avgMs * 0.95 + ms * 0.05);
    if (correct && ms < 3500) d.fastAnswers++;

    // XP
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
    this._maybeSync();                  // non-blocking

    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },

  // ─── IQ calculation ──────────────────────────────
  calcIQ(d) {
    const w = {
      patternRecognition: 0.15,
      problemSolving:     0.14,
      mentalAgility:      0.13,
      workingMemory:      0.14,
      verbalReasoning:    0.13,
      logicalReasoning:   0.13,
      spatialAwareness:   0.09,
      numericalReasoning: 0.09,
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
    if (wt === 0 || games < 5) return null;
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    iq = 100 + (iq - 100) * Math.min(1, games / 50);
    return Math.round(Math.max(55, Math.min(160, iq)));
  },

  // ─── Stats helpers ───────────────────────────────
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

  // ─── Session ─────────────────────────────────────
  startSession() {
    const d = this.load();
    d.sessionStart   = Date.now();
    d.totalSessions  = (d.totalSessions || 0) + 1;
    this.save(d);
  },

  endSession() {
    _pendingAnswers = 0;
    this._pushToCloud();  // always sync on session end
  },

  // ─── Reset ───────────────────────────────────────
  reset() {
    localStorage.removeItem(this.KEY);
    if (currentUser) {
      const fresh = this.defaults();
      fresh.uid = currentUser.uid;
      this._pushToCloud(fresh);
    }
  }
};

// Always push before the tab closes — safety net
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
  if (p <= 1)  return 'top 99%';
  if (p >= 99) return 'top 1%';
  return `top ${100 - p}%`;
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