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
// DAILY TASKS — task pool
// ═══════════════════════════════════════════════════
const TASK_POOL = [
  { id: 'streak_5',       type: 'streak',   target: 5,   label: 'Get a streak of 5',        icon: '🔥', xp: 30  },
  { id: 'streak_10',      type: 'streak',   target: 10,  label: 'Get a streak of 10',       icon: '🔥', xp: 60  },
  { id: 'streak_15',      type: 'streak',   target: 15,  label: 'Get a streak of 15',       icon: '🔥', xp: 100 },
  { id: 'correct_10',     type: 'correct',  target: 10,  label: 'Get 10 correct',            icon: '✅', xp: 25  },
  { id: 'correct_25',     type: 'correct',  target: 25,  label: 'Get 25 correct',            icon: '✅', xp: 50  },
  { id: 'correct_50',     type: 'correct',  target: 50,  label: 'Get 50 correct',            icon: '✅', xp: 90  },
  { id: 'answer_20',      type: 'answered', target: 20,  label: 'Answer 20 questions',       icon: '🧠', xp: 20  },
  { id: 'answer_50',      type: 'answered', target: 50,  label: 'Answer 50 questions',       icon: '🧠', xp: 45  },
  { id: 'answer_100',     type: 'answered', target: 100, label: 'Answer 100 questions',      icon: '🧠', xp: 80  },
  { id: 'accuracy_70',    type: 'accuracy', target: 70,  label: 'Hit 70% accuracy today',    icon: '🎯', xp: 35  },
  { id: 'accuracy_80',    type: 'accuracy', target: 80,  label: 'Hit 80% accuracy today',    icon: '🎯', xp: 55  },
  { id: 'play_wordle',    type: 'game', game: 'wordle',      target: 3, label: 'Play 3 Wordle rounds',     icon: '🟩', xp: 40 },
  { id: 'play_math',      type: 'game', game: 'mathRush',    target: 3, label: 'Play 3 Math Rush rounds',  icon: '➕', xp: 40 },
  { id: 'play_memory',    type: 'game', game: 'memory',      target: 2, label: 'Play 2 Memory games',      icon: '🃏', xp: 35 },
  { id: 'play_reaction',  type: 'game', game: 'reaction',    target: 3, label: 'Play 3 Reaction tests',    icon: '⚡', xp: 30 },
  { id: 'play_ttt',       type: 'game', game: 'ticTacToe',   target: 2, label: 'Play 2 Tic Tac Toe games', icon: '⭕', xp: 30 },
  { id: 'play_simon',     type: 'game', game: 'simon',       target: 2, label: 'Play 2 Simon Says rounds', icon: '🔴', xp: 35 },
  { id: 'play_scramble',  type: 'game', game: 'wordScramble',target: 3, label: 'Unscramble 3 words',       icon: '🔤', xp: 30 },
  { id: 'fast_5',         type: 'fast',     target: 5,   label: 'Answer 5 in under 3.5s',    icon: '⚡', xp: 45  },
  { id: 'fast_10',        type: 'fast',     target: 10,  label: 'Answer 10 in under 3.5s',   icon: '⚡', xp: 70  },
];

function _seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function _getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function _getDailyTaskDefs() {
  const dateKey = _getTodayKey();
  const seed    = dateKey.split('-').reduce((a, n) => a * 31 + parseInt(n), 0);
  const rng     = _seededRandom(seed);
  const pool    = [...TASK_POOL].sort(() => rng() - 0.5);
  return pool.slice(0, 3);
}

// ═══════════════════════════════════════════════════
// DAILY TASKS STORE
// ═══════════════════════════════════════════════════
const TASKS_KEY   = 'bd_daily_tasks_v1';
const SESSION_KEY = 'bd_session_today';

const DailyTasks = {

  _load() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  _save(data) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(data));
  },

  getState() {
    const stored = this._load();
    const today  = _getTodayKey();

    if (stored && stored.date === today) return stored;

    const prevStreak = (stored && stored.allDone && this._wasYesterday(stored.date))
      ? (stored.dailyStreak || 0) + 1
      : (stored && this._wasYesterday(stored.date) ? stored.dailyStreak || 0 : 0);

    const fresh = {
      date:        today,
      tasks:       _getDailyTaskDefs().map(def => ({ ...def, progress: 0, done: false, claimed: false })),
      allDone:     false,
      allClaimed:  false,
      dailyStreak: prevStreak,
    };
    this._save(fresh);
    return fresh;
  },

  _wasYesterday(dateStr) {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split('-').map(Number);
    const prev      = new Date(y, m - 1, d);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return prev.toDateString() === yesterday.toDateString();
  },

  hasBadge() {
    const s = this.getState();
    return !s.allClaimed;
  },

  getSessionStats() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      const s   = raw ? JSON.parse(raw) : null;
      if (!s || s.date !== _getTodayKey()) {
        const fresh = { date: _getTodayKey(), answered: 0, correct: 0, fast: 0 };
        localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return s;
    } catch {
      return { date: _getTodayKey(), answered: 0, correct: 0, fast: 0 };
    }
  },

  updateSessionStats(correct, ms) {
    const s = this.getSessionStats();
    s.answered++;
    if (correct) s.correct++;
    if (correct && ms < 3500) s.fast++;
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    return s;
  },

  onAnswer({ correct, streak, ms, totalAnsweredToday, totalCorrectToday, fastAnswersToday }) {
    const state   = this.getState();
    let changed   = false;

    state.tasks.forEach(task => {
      if (task.done) return;
      const prev = task.progress;

      switch (task.type) {
        case 'streak':   task.progress = Math.max(task.progress, streak);            break;
        case 'correct':  task.progress = totalCorrectToday;                           break;
        case 'answered': task.progress = totalAnsweredToday;                          break;
        case 'accuracy':
          task.progress = totalAnsweredToday > 0
            ? Math.round((totalCorrectToday / totalAnsweredToday) * 100) : 0;         break;
        case 'fast':     task.progress = fastAnswersToday;                            break;
      }

      if (task.progress !== prev) changed = true;
      if (task.progress >= task.target && !task.done) { task.done = true; changed = true; }
    });

    if (!state.allDone && state.tasks.every(t => t.done)) {
      state.allDone = true;
      changed = true;
    }

    if (changed) this._save(state);
    return state;
  },

  onGamePlayed(gameType) {
    const state = this.getState();
    let changed = false;

    state.tasks.forEach(task => {
      if (task.type !== 'game' || task.game !== gameType || task.done) return;
      task.progress = Math.min(task.progress + 1, task.target);
      if (task.progress >= task.target) task.done = true;
      changed = true;
    });

    if (!state.allDone && state.tasks.every(t => t.done)) {
      state.allDone = true;
      changed = true;
    }

    if (changed) this._save(state);
    return state;
  },

  claimTask(taskId) {
    const state = this.getState();
    const task  = state.tasks.find(t => t.id === taskId && t.done && !t.claimed);
    if (!task) return null;
    task.claimed = true;
    if (state.tasks.every(t => t.claimed)) state.allClaimed = true;
    this._save(state);
    return task.xp;
  },
};

// ═══════════════════════════════════════════════════
// LEADERBOARD SNAPSHOT HELPER
// ═══════════════════════════════════════════════════
const SNAPSHOT_DEBOUNCE_MS = 30_000;
let _snapshotTimer = null;
let _snapshotDirty = false;

async function _flushSnapshotEntry() {
  _snapshotTimer = null;
  if (!currentUser) return;
  const d = IQData.load();
  if (!d.calibrated || (d.answered || 0) < 5) return;

  const myEntry = {
    uid:        currentUser.uid,
    username:   d.username   || 'Anonymous',
    iq:         d.iq         || 0,
    level:      d.level      || 1,
    bestStreak: d.bestStreak || 0,
    answered:   d.answered   || 0,
    correct:    d.correct    || 0,
    pic:        d.pic        || '',
    hidden:     !!d.hideFromLeaderboard,
    updatedAt:  Date.now(),
  };

  try {
    const ref      = doc(db, 'leaderboard', 'snapshot');
    const snap     = await getDoc(ref);
    let users      = snap.exists() ? (snap.data().users || []) : [];
    users          = users.filter(u => u.uid !== currentUser.uid);
    if (!myEntry.hidden) users.push(myEntry);
    users.sort((a, b) => (b.iq || 0) - (a.iq || 0));
    if (users.length > 500) users = users.slice(0, 500);
    await setDoc(ref, { users, updatedAt: Date.now() });
    try { sessionStorage.removeItem('bd_lb_snapshot'); } catch {}
  } catch (e) {
    console.warn('[data.js] snapshot flush failed:', e.message);
  }
}

function _scheduleSnapshotFlush() {
  if (_snapshotTimer) { _snapshotDirty = true; return; }
  _snapshotTimer = setTimeout(async () => {
    await _flushSnapshotEntry();
    if (_snapshotDirty) {
      _snapshotDirty = false;
      _scheduleSnapshotFlush();
    }
  }, SNAPSHOT_DEBOUNCE_MS);
}

// ═══════════════════════════════════════════════════
// IQDATA
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
      calibrated:   false,
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
      if (d.calibrated === undefined) d.calibrated = false;
      return d;
    } catch { return this.defaults(); }
  },

  save(d) { localStorage.setItem(this.KEY, JSON.stringify(d)); },

  isGuest()       { return localStorage.getItem('iq_guest') === '1'; },
  getCurrentUser(){ return currentUser; },

  signOut() {
    signOut(auth).then(() => {
      localStorage.removeItem('iq_guest');
      if (window.parent !== window) { parent.goTo('auth'); }
      else { window.location.href = '/auth.html'; }
    });
  },

  needsOnboarding()  { return !this.load().age; },
  needsCalibration() { const d = this.load(); return !d.calibrated && d.answered < 5; },

  markCalibrated(iq) {
    const d = this.load(); d.calibrated = true; d.iq = iq;
    this.save(d);
    this._pushToCloud(d);
    _scheduleSnapshotFlush();
  },

  setAge(age)        { const d = this.load(); d.age = age;       this.save(d); this._pushToCloud(d); },
  setProfilePic(url) {
    const d = this.load(); d.pic = url; this.save(d);
    this._pushToCloud(d);
    _scheduleSnapshotFlush();
  },
  setUsername(name)  {
    const d = this.load(); d.username = name; this.save(d);
    this._pushToCloud(d);
    _scheduleSnapshotFlush();
  },

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
        if (!local.age && cloud.age) merged.age = cloud.age;
        if (cloud.calibrated) merged.calibrated = true;
        this.save(merged);
      } else {
        const d = this.load();
        d.uid = currentUser.uid; d.username = currentUser.displayName || null;
        d.pic = currentUser.photoURL || null; d.createdAt = new Date().toISOString();
        this.save(d); await this._pushToCloud(d);
      }
    } catch (e) { console.warn('[IQData] Cloud sync failed:', e.message); }
  },

  _merge(local, cloud) {
    const m = { ...this.defaults(), ...local };
    for (const k of Object.keys(m.ratings)) {
      const lc = local.ratings?.[k], cc = cloud.ratings?.[k];
      if (cc && cc.n > (lc?.n || 0)) m.ratings[k] = cc;
    }
    const hi = (a, b) => Math.max(a || 0, b || 0);
    m.answered = hi(local.answered, cloud.answered); m.correct = hi(local.correct, cloud.correct);
    m.bestStreak = hi(local.bestStreak, cloud.bestStreak); m.xp = hi(local.xp, cloud.xp);
    m.level = Math.max(local.level || 1, cloud.level || 1);
    m.fastAnswers = hi(local.fastAnswers, cloud.fastAnswers);
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
    } catch (e) { console.warn('[IQData] Push failed:', e.message); }
  },

  async _maybeSync() {
    if (!currentUser) return;
    _pendingAnswers++;
    if (_pendingAnswers >= SYNC_EVERY) { _pendingAnswers = 0; await this._pushToCloud(); }
  },

  // ───────────────────────────────────────────────
  // DIFFICULTY → ELO MAPPING (used by question generators)
  //
  // difficulty is a float roughly 0.0–2.0 that question generators use.
  // We map it to an "opponent Elo" so the Elo math stays meaningful.
  //
  //   diff 0.0  → Elo  600  (very easy)
  //   diff 0.5  → Elo  800
  //   diff 1.0  → Elo 1000  (medium — matches starting player)
  //   diff 1.5  → Elo 1200
  //   diff 2.0  → Elo 1400  (very hard)
  //
  // This is a clean linear map: opponentElo = 600 + diff * 400
  // ───────────────────────────────────────────────
  _diffToElo(diff) {
    return 600 + Math.max(0, Math.min(2.0, diff)) * 400;
  },

  getDifficulty(cat) {
    const d = this.load(), c = d.ratings[cat];
    // Map player's Elo back to difficulty float for question generators
    // Inverse of _diffToElo: diff = (elo - 600) / 400
    if (!c || c.n < 3) return 0.8; // slightly below medium for new players
    const diff = (c.r - 600) / 400;
    return Math.max(0.1, Math.min(2.0, diff));
  },

  getWeakestCategory() {
    const d = this.load(); let min = Infinity, weak = null;
    for (const [k, v] of Object.entries(d.ratings)) { if (v.n < min) { min = v.n; weak = k; } }
    return weak;
  },

  getRecentAccuracy(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || !c.history.length) return 0.5;
    const r = c.history.slice(-10);
    return r.filter(x => x).length / r.length;
  },

  recordAnswer(cat, correct, diff, ms) {
    const d = this.load(), c = d.ratings[cat];
    if (!c) return d;

    // ── Elo update ──
    // Convert question difficulty to an opponent Elo rating
    const opponentElo = this._diffToElo(diff);

    // Standard Elo expected score: E = 1 / (1 + 10^((opponent - player) / 400))
    const expected = 1 / (1 + Math.pow(10, (opponentElo - c.r) / 400));

    // K-factor: starts high (64) for fast initial convergence,
    // decays slower than before — reaches floor of 20 after ~120 questions
    // in this category. Higher floor (20 vs 16) keeps it responsive long-term.
    const K = Math.max(20, 64 - c.n * 0.37);

    c.r = Math.round(c.r + K * ((correct ? 1 : 0) - expected));
    c.r = Math.max(400, Math.min(1600, c.r));
    c.n++; if (correct) c.wins++;
    c.history.push(correct ? 1 : 0);
    if (c.history.length > 50) c.history = c.history.slice(-50);

    d.answered++;
    if (correct) { d.correct++; d.streak++; if (d.streak > d.bestStreak) d.bestStreak = d.streak; }
    else { d.streak = 0; }

    d.avgMs = d.answered === 1 ? ms : Math.round(d.avgMs * 0.95 + ms * 0.05);
    if (correct && ms < 3500) d.fastAnswers++;

    let xp = correct ? 10 : 3;
    if (correct && ms < 3000) xp += 7; else if (correct && ms < 5000) xp += 3;
    if (correct && d.streak >= 3) xp += Math.min(Math.floor(d.streak * 1.5), 20);
    if (correct && diff >= 1.5) xp += 5;
    d.xp += xp;

    const oldLvl = d.level;
    d.level = Math.floor(d.xp / 150) + 1;
    d.iq    = this.calcIQ(d);
    this.save(d);
    this._maybeSync();

    _scheduleSnapshotFlush();

    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },

  // ───────────────────────────────────────────────
  // IQ CALCULATION
  //
  // Maps Elo ratings across 8 cognitive categories to an IQ score.
  //
  // Real IQ tests (WAIS-IV, etc) measure similar domains and weight
  // them roughly equally. Our Elo center (1000) maps to IQ 100, and
  // we use the standard 15-point SD scale.
  //
  // Key accuracy improvements over the previous version:
  //
  // 1. Per-category confidence uses a sigmoid curve (tanh) instead of
  //    a linear ramp. This means:
  //    - 5 questions → ~46% confidence (was 50% — similar)
  //    - 10 questions → ~76% confidence (was 100% — way too soon)
  //    - 20 questions → ~96% confidence (realistic convergence)
  //    This prevents 10 lucky answers from showing IQ 145.
  //
  // 2. Global confidence uses total games across ALL categories with
  //    the same sigmoid, centered at 30 total answers. This replaces
  //    the linear /50 ramp that kept IQ pinned near 100 too long for
  //    good players, and let it swing too wildly once it "unlocked".
  //
  // 3. Category weights reflect approximate real IQ test weightings.
  //    (Fluid reasoning + working memory matter most on WAIS-IV.)
  //
  // 4. The final clamp is 55–160 (same as before). Scores outside
  //    this range aren't meaningful from an adaptive online test.
  // ───────────────────────────────────────────────
  calcIQ(d) {
    // Category weights — loosely modeled on WAIS-IV index contributions
    const w = {
      patternRecognition: 0.15,   // fluid reasoning (perceptual)
      problemSolving:     0.14,   // fluid reasoning (analytical)
      logicalReasoning:   0.13,   // fluid reasoning (deductive)
      workingMemory:      0.14,   // working memory index
      mentalAgility:      0.13,   // processing speed index
      verbalReasoning:    0.13,   // verbal comprehension
      spatialAwareness:   0.09,   // visual-spatial
      numericalReasoning: 0.09,   // quantitative reasoning
    };

    let sum = 0, wt = 0, totalGames = 0;

    for (const [k, weight] of Object.entries(w)) {
      const r = d.ratings[k];
      if (r && r.n > 0) {
        // Per-category confidence: sigmoid centered at 12 questions
        // tanh(n/12) gives: n=5→0.39, n=10→0.71, n=15→0.87, n=20→0.94, n=30→0.99
        const catConf = Math.tanh(r.n / 12);
        sum += r.r * weight * catConf;
        wt  += weight * catConf;
        totalGames += r.n;
      }
    }

    // Need at least some data to produce an IQ
    if (wt === 0 || totalGames < 5) return d.iq || null;

    // Weighted average Elo across categories
    const avgElo = sum / wt;

    // Map Elo to IQ scale: 1000 Elo → 100 IQ, each 100 Elo = 15 IQ points
    let rawIQ = 100 + ((avgElo - 1000) / 100) * 15;

    // Global confidence: how much do we trust this overall?
    // Sigmoid centered at 30 total answers across all categories.
    // tanh(30/30) ≈ 0.76, tanh(50/30) ≈ 0.93, tanh(80/30) ≈ 0.99
    // This pulls extreme scores toward 100 when data is thin.
    const globalConf = Math.tanh(totalGames / 30);
    let iq = 100 + (rawIQ - 100) * globalConf;

    return Math.round(Math.max(55, Math.min(160, iq)));
  },

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
    d.sessionStart  = Date.now();
    d.totalSessions = (d.totalSessions || 0) + 1;
    this.save(d);
  },

  endSession() {
    _pendingAnswers = 0;
    this._pushToCloud();
    if (_snapshotTimer) {
      clearTimeout(_snapshotTimer);
      _snapshotTimer = null;
      _flushSnapshotEntry();
    }
  },

  reset() {
    localStorage.removeItem(this.KEY);
    if (currentUser) { const f = this.defaults(); f.uid = currentUser.uid; this._pushToCloud(f); }
  }
};

window.addEventListener('beforeunload', () => {
  if (currentUser && _pendingAnswers > 0) IQData._pushToCloud();
  if (_snapshotTimer) { clearTimeout(_snapshotTimer); _flushSnapshotEntry(); }
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