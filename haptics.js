// haptics.js — BrainDeer
// iOS: hidden checkbox[switch] elements — each label.click() = one haptic pulse
// Layered = multiple switches firing offset patterns = heavier/richer feel
// Android: navigator.vibrate() fallback

const Haptics = (() => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const canVibrate = 'vibrate' in navigator;

  // Create a hidden switch and return its label
  function createSwitch() {
    const id = 'hap_' + Math.random().toString(36).slice(2);
    const el = document.createElement('div');
    el.innerHTML = `<input type="checkbox" id="${id}" switch /><label for="${id}"></label>`;
    el.style.cssText = 'display:none;position:absolute;top:-9999px;';
    document.body.appendChild(el);
    return el.querySelector('label');
  }

  // Fire layered pattern: array of arrays of ms timestamps
  // Each inner array = one switch channel. More channels = heavier feel on iOS.
  function layered(patterns) {
    if (!document.body) return;
    patterns.forEach(times => {
      const label = createSwitch();
      times.forEach(t => setTimeout(() => label.click(), t));
      // Clean up after pattern finishes
      setTimeout(() => label.parentElement?.remove(), Math.max(...times) + 300);
    });
  }

  function vibe(pattern) {
    if (canVibrate) navigator.vibrate(pattern);
  }

  // ── Pattern library ──
  // iOS patterns: arrays of timestamp arrays (ms). More channels = heavier.
  // Android patterns: [vibrate, pause, vibrate, ...] ms arrays.
  const PATTERNS = {

    // Single feather tap — nav buttons, toggles, minor UI
    light: {
      ios: [[0]],
      android: [25],
    },

    // Solid tap — buttons, filter tabs, refresh
    medium: {
      ios: [[0], [15]],
      android: [45, 15, 45],
    },

    // Correct answer ✓ — satisfying 2-pulse thud
    success: {
      ios: [[0, 90], [25, 115], [50]],
      android: [35, 20, 70],
    },

    // Wrong answer ✗ — sharp buzzy error
    error: {
      ios: [[0, 45, 90], [15, 60, 105], [30, 75]],
      android: [70, 30, 70, 30, 70],
    },

    // Streak milestone 🔥 — rapid celebration
    streak: {
      ios: [[0, 55, 110, 165], [20, 75, 130], [40, 95, 150, 205]],
      android: [35, 15, 35, 15, 70, 15, 35],
    },

    // Level up ⚡ — big satisfying escalating thump
    levelUp: {
      ios: [[0, 50, 100], [15, 65, 115], [30, 80, 130], [45, 95]],
      android: [80, 25, 80, 25, 120],
    },

    // Privacy / hide toggle — feels like a switch click
    toggle: {
      ios: [[0], [20], [40]],
      android: [30, 20, 60],
    },

    // Warning — double buzz, feels like "nope"
    warning: {
      ios: [[0, 70], [35, 105]],
      android: [55, 35, 55],
    },

    // Scroll nudge / swipe hint
    nudge: {
      ios: [[0, 180]],
      android: [25, 120, 25],
    },

    // ── Game-specific ──

    // Wordle: each tile typed
    tilePop: {
      ios: [[0]],
      android: [18],
    },

    // Wordle: invalid word — row shakes
    wordleWrong: {
      ios: [[0, 40, 80, 120], [20, 60, 100]],
      android: [45, 25, 45, 25, 45],
    },

    // Wordle: win — cascading tile reveal celebration
    wordleWin: {
      ios: [[0, 80, 160, 240], [30, 110, 190], [60, 140, 220, 300]],
      android: [40, 15, 40, 15, 80, 15, 60],
    },

    // Simon: pad press
    simonPad: {
      ios: [[0], [18]],
      android: [30, 12, 30],
    },

    // Memory: card flip
    cardFlip: {
      ios: [[0], [25]],
      android: [25, 15, 25],
    },

    // Memory: pair matched
    cardMatch: {
      ios: [[0, 70], [25, 95], [50]],
      android: [35, 15, 70],
    },

    // Reaction: tap the circle
    reactionTap: {
      ios: [[0], [10], [20]],
      android: [50, 10, 80],
    },
  };

  return {
    trigger(type = 'light') {
      const p = PATTERNS[type] || PATTERNS.light;
      if (isIOS) {
        layered(p.ios);
      } else {
        vibe(p.android);
      }
    },

    // Shorthand methods — call these everywhere in the app
    light()        { this.trigger('light'); },
    medium()       { this.trigger('medium'); },
    success()      { this.trigger('success'); },
    error()        { this.trigger('error'); },
    streak()       { this.trigger('streak'); },
    levelUp()      { this.trigger('levelUp'); },
    toggle()       { this.trigger('toggle'); },
    warning()      { this.trigger('warning'); },
    nudge()        { this.trigger('nudge'); },
    tilePop()      { this.trigger('tilePop'); },
    wordleWrong()  { this.trigger('wordleWrong'); },
    wordleWin()    { this.trigger('wordleWin'); },
    simonPad()     { this.trigger('simonPad'); },
    cardFlip()     { this.trigger('cardFlip'); },
    cardMatch()    { this.trigger('cardMatch'); },
    reactionTap()  { this.trigger('reactionTap'); },
  };
})();

export default Haptics;