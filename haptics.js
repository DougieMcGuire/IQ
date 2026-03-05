// haptics.js
const Haptics = (() => {
  let iosFallbackEl;

  // Create iOS "switch" fallback
  function setupIOSFallback() {
    if (iosFallbackEl) return;
    iosFallbackEl = document.createElement('div');
    iosFallbackEl.innerHTML =
      '<input type="checkbox" id="haptic-ios-switch" switch />' +
      '<label for="haptic-ios-switch"></label>';
    iosFallbackEl.style.position = 'absolute';
    iosFallbackEl.style.top = '-9999px';
    document.body.appendChild(iosFallbackEl);
  }

  const canVibrate = 'vibrate' in navigator;

  const patterns = {
    success: [50, 20, 50],
    error:   [100, 30, 100, 30, 100],
    warning: [70, 40, 70],
    light:   [20],
    medium:  [40, 20, 40],
    heavy:   [80, 40, 80],
  };

  function vibrate(pattern) {
    if (canVibrate) {
      navigator.vibrate(pattern);
    } else {
      // iOS fallback
      setupIOSFallback();
      const checkbox = iosFallbackEl.querySelector('input');
      checkbox.checked = !checkbox.checked; // toggle triggers haptic
    }
  }

  return {
    trigger(type = 'light') {
      if (typeof type === 'string' && patterns[type]) {
        vibrate(patterns[type]);
      } else if (Array.isArray(type)) {
        vibrate(type);
      } else {
        vibrate(patterns.light);
      }
    }
  };
})();

export default Haptics;