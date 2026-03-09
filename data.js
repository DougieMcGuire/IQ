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
// IRT ENGINE — 3-Parameter Logistic Model
//
// P(correct | θ) = c + (1-c) / (1 + exp(-a*(θ - b)))
//   θ (theta) = latent ability  [IQ = 100 + θ*15]
//   a = discrimination  (higher = better item)
//   b = difficulty      (-2=very easy … +2.5=very hard)
//   c = guessing floor  (1/n_options, typically 0.25)
//
// Ability estimation: Newton-Raphson Maximum Likelihood
// Item selection:     Maximum Fisher Information
// ═══════════════════════════════════════════════════
const IRT = {
  iqToTheta: iq  => (iq - 100) / 15,
  thetaToIQ: t   => Math.round(Math.max(55, Math.min(160, 100 + t * 15))),

  // 3PL probability
  p3pl(theta, a, b, c) {
    return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  },

  // First derivative of log-likelihood
  dL(theta, responses) {
    let d = 0;
    for (const r of responses) {
      const { a, b, c, correct } = r;
      const P = this.p3pl(theta, a, b, c);
      const W = (P - c) / ((1 - c) * P + 1e-9);
      d += a * W * ((correct ? 1 : 0) - P);
    }
    return d;
  },

  // Second derivative (for Newton-Raphson step)
  d2L(theta, responses) {
    let d2 = 0;
    for (const r of responses) {
      const { a, b, c } = r;
      const P  = this.p3pl(theta, a, b, c);
      const Q  = 1 - P;
      const W  = (P - c) / ((1 - c) * P + 1e-9);
      d2 -= a * a * W * W * P * Q;
    }
    return d2;
  },

  // Fisher Information at theta for one item
  info(theta, a, b, c) {
    const P = this.p3pl(theta, a, b, c);
    const Q = 1 - P;
    const W = (P - c) / ((1 - c) * P + 1e-9);
    return a * a * W * W * P * Q;
  },

  // MLE via Newton-Raphson — returns { theta, se }
  estimate(responses, initTheta = 0) {
    if (responses.length === 0) return { theta: 0, se: 2.0 };
    const allCorrect = responses.every(r => r.correct);
    const allWrong   = responses.every(r => !r.correct);
    let theta = allCorrect ? 1.5 : allWrong ? -1.5 : initTheta;

    for (let iter = 0; iter < 40; iter++) {
      const d1   = this.dL(theta, responses);
      const d2   = this.d2L(theta, responses);
      if (Math.abs(d2) < 1e-9) break;
      const step = d1 / d2;
      theta -= step;
      theta  = Math.max(-3.5, Math.min(3.5, theta));
      if (Math.abs(step) < 1e-7) break;
    }

    const I  = responses.reduce((s, r) => s + this.info(theta, r.a, r.b, r.c), 0);
    const se = I > 0 ? 1 / Math.sqrt(I) : 2.0;
    return { theta, se };
  },

  // Select item with highest Fisher Information at current theta
  selectItem(theta, answeredIds, items) {
    let best = null, bestInfo = -Infinity;
    for (const item of items) {
      if (answeredIds.has(item.id)) continue;
      const info = this.info(theta, item.irt.a, item.irt.b, item.irt.c);
      if (info > bestInfo) { bestInfo = info; best = item; }
    }
    if (!best) {
      const pool = items.filter(i => !answeredIds.has(i.id));
      return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    }
    return best;
  }
};

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
  KEY: 'iq_profile_v7',  // bumped — IRT replaces Elo

  defaults() {
    return {
      version:       7,
      uid:           null,
      username:      null,
      pic:           null,
      age:           null,
      iq:            null,
      xp:            0,
      level:         1,
      answered:      0,
      correct:       0,
      streak:        0,
      bestStreak:    0,
      avgMs:         0,
      fastAnswers:   0,
      totalSessions: 0,
      sessionStart:  null,
      calibrated:    false,
      // IRT state — persisted so MLE can resume across sessions
      irt: {
        theta:     0,      // current ability estimate
        se:        2.0,    // standard error (shrinks as you answer more)
        responses: [],     // [{a, b, c, correct}] — last 200 kept for MLE
        answeredIds: [],   // item ids already seen
      },
      // Per-category tracking (kept for profile stats / radar chart)
      ratings: {
        patternRecognition: { n: 0, wins: 0 },
        problemSolving:     { n: 0, wins: 0 },
        mentalAgility:      { n: 0, wins: 0 },
        workingMemory:      { n: 0, wins: 0 },
        verbalReasoning:    { n: 0, wins: 0 },
        logicalReasoning:   { n: 0, wins: 0 },
        spatialAwareness:   { n: 0, wins: 0 },
        numericalReasoning: { n: 0, wins: 0 },
      }
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaults();
      const d   = JSON.parse(raw);
      const def = this.defaults();
      // Back-fill any missing keys
      if (!d.irt) d.irt = def.irt;
      if (!d.irt.responses)   d.irt.responses   = [];
      if (!d.irt.answeredIds) d.irt.answeredIds  = [];
      if (d.irt.se === undefined) d.irt.se = 2.0;
      for (const k of Object.keys(def.ratings)) {
        if (!d.ratings[k]) d.ratings[k] = def.ratings[k];
      }
      if (d.calibrated === undefined) d.calibrated = false;
      return d;
    } catch { return this.defaults(); }
  },

  save(d) { localStorage.setItem(this.KEY, JSON.stringify(d)); },

  isGuest()        { return localStorage.getItem('iq_guest') === '1'; },
  getCurrentUser() { return currentUser; },

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
    const d = this.load();
    d.calibrated  = true;
    d.iq          = iq;
    d.irt.theta   = IRT.iqToTheta(iq);
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
  setUsername(name) {
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
    const m   = { ...this.defaults(), ...local };
    const hi  = (a, b) => Math.max(a || 0, b || 0);
    m.answered     = hi(local.answered,     cloud.answered);
    m.correct      = hi(local.correct,      cloud.correct);
    m.bestStreak   = hi(local.bestStreak,   cloud.bestStreak);
    m.xp           = hi(local.xp,           cloud.xp);
    m.level        = Math.max(local.level || 1, cloud.level || 1);
    m.fastAnswers  = hi(local.fastAnswers,  cloud.fastAnswers);
    m.totalSessions= hi(local.totalSessions,cloud.totalSessions);
    m.age          = cloud.age || local.age;
    m.calibrated   = local.calibrated || cloud.calibrated || false;

    // IRT: prefer whichever has more responses (more data = better estimate)
    const localN  = local.irt?.responses?.length  || 0;
    const cloudN  = cloud.irt?.responses?.length  || 0;
    if (cloudN > localN) {
      m.irt = cloud.irt;
    }

    // Per-category: prefer higher n
    for (const k of Object.keys(m.ratings)) {
      const lc = local.ratings?.[k], cc = cloud.ratings?.[k];
      if (cc && (cc.n || 0) > (lc?.n || 0)) m.ratings[k] = cc;
    }

    if (cloud.iq && cloud.answered >= local.answered) m.iq = cloud.iq;
    return m;
  },

  async _pushToCloud(dataOverride) {
    if (!currentUser) return;
    try {
      const d = dataOverride ? { ...dataOverride } : { ...this.load() };
      // Trim IRT responses to last 200 before saving
      if (d.irt?.responses) d.irt.responses = d.irt.responses.slice(-200);
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

  // ── IRT helpers exposed for the feed ──
  getTheta() { return this.load().irt.theta; },
  getSE()    { return this.load().irt.se; },
  getAnsweredIds() { return new Set(this.load().irt.answeredIds); },

  // Select next best question from an item bank
  selectItem(itemBank) {
    const d = this.load();
    return IRT.selectItem(d.irt.theta, new Set(d.irt.answeredIds), itemBank);
  },

  // Category stat % for profile radar
  getStatPercent(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || c.n === 0) return 50;
    const acc = c.n > 0 ? (c.wins / c.n) : 0.5;
    // Scale accuracy to 0-100 with some stretch
    return Math.round(Math.max(5, Math.min(95, acc * 100)));
  },

  getDifficulty(cat) {
    // Keep for compatibility with Q.generate — derive from IRT theta
    const d = this.load();
    return 0.5 + ((d.irt.theta + 2) / 4) * 1.5;
  },

  getWeakestCategory() {
    const d = this.load(); let min = Infinity, weak = null;
    for (const [k, v] of Object.entries(d.ratings)) {
      if ((v.n || 0) < min) { min = v.n; weak = k; }
    }
    return weak;
  },

  getRecentAccuracy(cat) {
    // Kept for compatibility
    const d = this.load(), c = d.ratings[cat];
    if (!c || !c.n) return 0.5;
    return c.wins / c.n;
  },

  // ── Core answer recording — now IRT-powered ──
  recordAnswer(cat, correct, irtParams, ms) {
    // irtParams = { a, b, c, id }  OR  diff (number, legacy fallback)
    const d = this.load();
    const isLegacy = typeof irtParams === 'number';

    // --- IRT update ---
    let a = 1.2, b = 0, cGuess = 0.25;
    if (!isLegacy) {
      a      = irtParams.a      ?? 1.2;
      b      = irtParams.b      ?? 0;
      cGuess = irtParams.c      ?? 0.25;
    } else {
      // Legacy: map difficulty float to b parameter
      b = (irtParams - 1.0) * 2;
    }

    d.irt.responses.push({ a, b, c: cGuess, correct });
    if (d.irt.responses.length > 200) d.irt.responses = d.irt.responses.slice(-200);

    if (!isLegacy && irtParams.id) {
      if (!d.irt.answeredIds.includes(irtParams.id)) d.irt.answeredIds.push(irtParams.id);
      if (d.irt.answeredIds.length > 500) d.irt.answeredIds = d.irt.answeredIds.slice(-500);
    }

    const est    = IRT.estimate(d.irt.responses, d.irt.theta);
    d.irt.theta  = est.theta;
    d.irt.se     = est.se;

    // --- Per-category stats ---
    const cat_r = d.ratings[cat] || { n: 0, wins: 0 };
    cat_r.n++;
    if (correct) cat_r.wins++;
    d.ratings[cat] = cat_r;

    // --- Global counters ---
    d.answered++;
    if (correct) { d.correct++; d.streak++; if (d.streak > d.bestStreak) d.bestStreak = d.streak; }
    else         { d.streak = 0; }

    d.avgMs = d.answered === 1 ? ms : Math.round(d.avgMs * 0.95 + ms * 0.05);
    if (correct && ms < 3500) d.fastAnswers++;

    // --- XP ---
    let xp = correct ? 10 : 3;
    if (correct && ms < 3000) xp += 7; else if (correct && ms < 5000) xp += 3;
    if (correct && d.streak >= 3) xp += Math.min(Math.floor(d.streak * 1.5), 20);
    if (correct && b >= 1.5) xp += 5;  // bonus for hard IRT items
    d.xp += xp;

    const oldLvl = d.level;
    d.level = Math.floor(d.xp / 150) + 1;

    // --- IQ from IRT theta ---
    if (d.answered >= 5) d.iq = IRT.thetaToIQ(d.irt.theta);

    this.save(d);
    this._maybeSync();
    _scheduleSnapshotFlush();

    return {
      ...d,
      xpGain:   xp,
      leveledUp: d.level > oldLvl,
      iqDelta:  d.iq ? (d.iq - IRT.thetaToIQ(d.irt.theta - (est.theta - d.irt.theta))) : 0,
      thetaSE:  est.se,
    };
  },

  // IQ confidence interval (95%) in IQ points
  getIQConfidenceInterval() {
    const d   = this.load();
    const se  = d.irt.se * 15;  // convert theta SE → IQ SE
    const iq  = d.iq || 100;
    return {
      iq,
      low:  Math.max(55,  Math.round(iq - 1.96 * se)),
      high: Math.min(160, Math.round(iq + 1.96 * se)),
      se:   Math.round(se),
    };
  },

  calcIQ(d) {
    // Direct from IRT theta — much more accurate than weighted Elo average
    if (!d.irt || d.answered < 5) return d.iq || null;
    return IRT.thetaToIQ(d.irt.theta);
  },

  getAccuracy() {
    const d = this.load();
    return d.answered === 0 ? 0 : Math.round((d.correct / d.answered) * 100);
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
  IQData, IRT, auth, db,
  authReady, requireAuth, redirectIfLoggedIn,
  iqToPercentile, formatPercentile, getEncouragement
};