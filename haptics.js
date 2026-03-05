// haptics.js
const Haptics = (() => {
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
    if (!canVibrate) return;
    navigator.vibrate(pattern);
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