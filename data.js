import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQDs2EXmb0YodZob6Hz4cSTm_hB146-No",
  authDomain: "braindeer-backend.firebaseapp.com",
  projectId: "braindeer-backend",
  storageBucket: "braindeer-backend.firebasestorage.app",
  messagingSenderId: "331205139765",
  appId: "1:331205139765:web:20cfef8194af63fc55c07c",
  measurementId: "G-9B6885G0X0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const IQData = {
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
      xp: 0,
      level: 1,
      totalSessions: 0
    };
  },

  // local session info (kept in localStorage)
  loadSession() {
    try {
      const s = localStorage.getItem(this.KEY);
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  },

  saveSession(sessionData) {
    try { localStorage.setItem(this.KEY, JSON.stringify(sessionData)); } catch {}
  },

  async load(uid) {
    if (!uid) return this.defaults(); // fallback
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, { ...this.defaults(), createdAt: serverTimestamp() });
        return this.defaults();
      }
      const data = docSnap.data();
      // Migrate missing fields if needed
      const def = this.defaults();
      for (const k of Object.keys(def.ratings)) {
        if (!data.ratings[k]) data.ratings[k] = def.ratings[k];
        if (data.ratings[k].history === undefined) data.ratings[k].history = [];
        if (data.ratings[k].wins === undefined) data.ratings[k].wins = 0;
      }
      return { ...def, ...data };
    } catch (err) {
      console.error("Failed to load user data:", err);
      return this.defaults();
    }
  },

  async save(uid, d) {
    if (!uid) return;
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, { ...d, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error("Failed to save user data:", err);
    }
  },

  needsOnboarding(sessionData) {
    return !(sessionData.age || this.loadSession().age);
  },

  setAge(uid, age) {
    const session = this.loadSession();
    session.age = age;
    this.saveSession(session);
    if (uid) this.load(uid).then(d => { d.age = age; this.save(uid, d); });
  },

  // Adaptive difficulty
  getDifficulty(cat, sessionData) {
    const d = sessionData || this.loadSession();
    const c = d.ratings?.[cat];
    if (!c || c.n < 3) return 0.8;
    const norm = (c.r - 600) / 800;
    return 0.5 + norm * 1.5;
  },

  getWeakestCategory(sessionData) {
    const d = sessionData || this.loadSession();
    let min = Infinity, weak = null;
    for (const [k, v] of Object.entries(d.ratings || {})) {
      if (v.n < min) { min = v.n; weak = k; }
    }
    return weak;
  },

  recordAnswer(uid, cat, correct, diff, ms) {
    const session = this.loadSession();
    const d = { ...session };
    if (!d.ratings) d.ratings = this.defaults().ratings;
    const c = d.ratings[cat];
    if (!c) return session;

    // Elo update
    const exp = 1 / (1 + Math.pow(10, (diff * 400 - (c.r - 1000)) / 400));
    const kFactor = Math.max(16, 48 - c.n * 0.5);
    c.r = Math.round(c.r + kFactor * ((correct ? 1 : 0) - exp));
    c.r = Math.max(400, Math.min(1600, c.r));
    c.n++;
    if (correct) c.wins++;

    c.history.push(correct ? 1 : 0);
    if (c.history.length > 50) c.history = c.history.slice(-50);

    d.answered = (d.answered || 0) + 1;
    if (correct) {
      d.correct = (d.correct || 0) + 1;
      d.streak = (d.streak || 0) + 1;
      d.bestStreak = Math.max(d.bestStreak || 0, d.streak);
    } else {
      d.streak = 0;
    }

    // XP
    let xp = correct ? 10 : 3;
    if (correct && ms < 3000) xp += 7;
    else if (correct && ms < 5000) xp += 3;
    if (correct && d.streak >= 3) xp += Math.min(Math.floor(d.streak * 1.5), 20);
    if (correct && diff >= 1.5) xp += 5;
    d.xp = (d.xp || 0) + xp;
    const oldLvl = d.level || 1;
    d.level = Math.floor(d.xp / 150) + 1;

    d.iq = this.calcIQ(d);

    this.saveSession(d); // save locally immediately
    if (uid) this.save(uid, d); // push to Firebase async

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
        const conf = Math.min(1, r.n / 10);
        sum += r.r * v * conf;
        wt += v * conf;
        games += r.n;
      }
    }
    if (wt === 0 || games < 5) return null;
    const avg = sum / wt;
    let iq = 100 + ((avg - 1000) / 100) * 15;
    const conf = Math.min(1, games / 50);
    iq = 100 + (iq - 100) * conf;
    return Math.round(Math.max(55, Math.min(160, iq)));
  },

  reset() {
    localStorage.removeItem(this.KEY);
  }
};