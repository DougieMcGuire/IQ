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
// Writes only the current user's entry into leaderboard/snapshot.
// Called after stats change — debounced so rapid answers don't spam writes.
// Cost: 1 read + 1 write, at most once per SNAPSHOT_DEBOUNCE_MS window.

const SNAPSHOT_DEBOUNCE_MS = 30_000; // at most 1 snapshot write per 30s per session
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
    const snap     = await getDoc(ref);                                    // 1 read
    let users      = snap.exists() ? (snap.data().users || []) : [];
    users          = users.filter(u => u.uid !== currentUser.uid);        // remove stale entry
    if (!myEntry.hidden) users.push(myEntry);                             // add updated entry
    users.sort((a, b) => (b.iq || 0) - (a.iq || 0));
    if (users.length > 500) users = users.slice(0, 500);
    await setDoc(ref, { users, updatedAt: Date.now() });                   // 1 write
    // Bust leaderboard session cache so next view is fresh
    try { sessionStorage.removeItem('bd_lb_snapshot'); } catch {}
  } catch (e) {
    console.warn('[data.js] snapshot flush failed:', e.message);
  }
}

function _scheduleSnapshotFlush() {
  // If a timer is already pending, just mark dirty — it'll flush when it fires
  if (_snapshotTimer) { _snapshotDirty = true; return; }
  _snapshotTimer = setTimeout(async () => {
    await _flushSnapshotEntry();
    // If more writes came in while we were flushing, schedule one more
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
    _scheduleSnapshotFlush(); // ← snapshot hook: calibration sets up initial entry
  },

  setAge(age)        { const d = this.load(); d.age = age;       this.save(d); this._pushToCloud(d); },
  setProfilePic(url) {
    const d = this.load(); d.pic = url; this.save(d);
    this._pushToCloud(d);
    _scheduleSnapshotFlush(); // ← snapshot hook: pic change should show on leaderboard
  },
  setUsername(name)  {
    const d = this.load(); d.username = name; this.save(d);
    this._pushToCloud(d);
    _scheduleSnapshotFlush(); // ← snapshot hook: username change should show on leaderboard
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

  getDifficulty(cat) {
    const d = this.load(), c = d.ratings[cat];
    if (!c || c.n < 3) return 0.8;
    return 0.5 + ((c.r - 600) / 800) * 1.5;
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

    const expected = 1 / (1 + Math.pow(10, (diff * 400 - (c.r - 1000)) / 400));
    const K = Math.max(16, 48 - c.n * 0.5);
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

    // ← Snapshot hook: schedule a debounced leaderboard update after stats change.
    // Debounced to 30s so answering 100 questions = 1 snapshot write, not 100.
    _scheduleSnapshotFlush();

    return { ...d, xpGain: xp, leveledUp: d.level > oldLvl };
  },

  calcIQ(d) {
    const w = {
      patternRecognition: 0.15, problemSolving: 0.14, mentalAgility: 0.13,
      workingMemory: 0.14, verbalReasoning: 0.13, logicalReasoning: 0.13,
      spatialAwareness: 0.09, numericalReasoning: 0.09,
    };
    let sum = 0, wt = 0, games = 0;
    for (const [k, v] of Object.entries(w)) {
      const r = d.ratings[k];
      if (r && r.n > 0) {
        const conf = Math.min(1, r.n / 10);
        sum += r.r * v * conf; wt += v * conf; games += r.n;
      }
    }
    if (wt === 0 || games < 5) return d.iq || null;
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    iq = 100 + (iq - 100) * Math.min(1, games / 50);
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
    // Flush any pending snapshot immediately on session end (tab close / nav away)
    if (_snapshotTimer) {
      clearTimeout(_snapshotTimer);
      _snapshotTimer = null;
      _flushSnapshotEntry(); // fire-and-forget on unload
    }
  },

  reset() {
    localStorage.removeItem(this.KEY);
    if (currentUser) { const f = this.defaults(); f.uid = currentUser.uid; this._pushToCloud(f); }
  }
};

window.addEventListener('beforeunload', () => {
  if (currentUser && _pendingAnswers > 0) IQData._pushToCloud();
  // Also flush snapshot if dirty
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
