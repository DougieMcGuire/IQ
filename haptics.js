// haptics.js

// Helper: create a hidden switch for iOS
function createSwitch() {
  const id = "haptic_" + Math.random().toString(36).slice(2);
  const el = document.createElement("div");
  el.innerHTML = `<input type="checkbox" id="${id}" switch />
                  <label for="${id}"></label>`;
  el.style.display = "none";
  document.body.appendChild(el);
  return el.querySelector("label");
}

// Trigger a single pattern on one label
function triggerPattern(label, times) {
  times.forEach((t) => {
    setTimeout(() => {
      label.click();
    }, t);
  });
}

// Trigger layered patterns (for heavier / richer feedback)
function layeredPattern(patterns) {
  const switches = [];
  for (let i = 0; i < patterns.length; i++) {
    switches.push(createSwitch());
  }
  for (let i = 0; i < patterns.length; i++) {
    const label = switches[i];
    const times = patterns[i];
    times.forEach((t) => {
      setTimeout(() => label.click(), t);
    });
  }
}

// Public API
window.haptic = function(type) {

  // Android / modern browsers
  if (navigator.vibrate) {
    const vibratePatterns = {
      tap: [10],
      double: [10, 120],
      success: [10, 120, 240],
      error: [0, 60, 120, 180, 240],
      crazy: [
        [0,50,100,150,200],
        [20,70,120,170,220],
        [40,90,140,190,240]
      ]
    };

    const pattern = vibratePatterns[type];

    if (!pattern) return;

    if (Array.isArray(pattern[0])) {
      // layered
      layeredPattern(pattern);
    } else {
      navigator.vibrate(pattern);
    }

    return;
  }

  // iOS fallback (all patterns use switch trick)
  const iosPatterns = {
    tap: [[0]],
    double: [[0, 120]],
    success: [[0, 120, 240]],
    error: [[0, 60, 120, 180, 240]],
    crazy: [
      [0,50,100,150,200],
      [20,70,120,170,220],
      [40,90,140,190,240]
    ]
  };

  const pattern = iosPatterns[type] || [[0]];

  layeredPattern(pattern);
};