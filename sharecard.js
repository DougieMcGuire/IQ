// sharecard.js — Cebear share card generator
// Generates 1200x630 canvas images per game type
// Usage: ShareCard.generate(gameType, resultData, userData) → Promise<Blob>

window.ShareCard = (function(){
  var W = 1200, H = 630;
  var BLUE = '#0474fc', DARK = '#0358c4', BG = '#f5f0e8';
  var GREEN = '#22c55e', RED = '#ef4444', GOLD = '#f59e0b';
  var TEXT = '#1e293b', DIM = '#64748b';

  // Game display configs
  var GAMES = {
    wordle:       { icon: '🟩', label: 'Wordle',        color: '#22c55e', bg: '#166534' },
    ticTacToe:    { icon: '⭕', label: 'Tic Tac Toe',   color: '#3b82f6', bg: '#1e3a8a' },
    memory:       { icon: '🃏', label: 'Memory Match',  color: '#8b5cf6', bg: '#4c1d95' },
    simon:        { icon: '🔴', label: 'Simon Says',    color: '#ef4444', bg: '#7f1d1d' },
    reaction:     { icon: '⚡', label: 'Reaction Time', color: '#f59e0b', bg: '#78350f' },
    wordScramble: { icon: '🔤', label: 'Word Scramble', color: '#06b6d4', bg: '#164e63' },
    slidePuzzle:  { icon: '🧩', label: 'Slide Puzzle',  color: '#f97316', bg: '#7c2d12' },
    colorSort:    { icon: '🎨', label: 'Color Sort',    color: '#ec4899', bg: '#831843' },
    mathRush:     { icon: '➕', label: 'Math Rush',     color: '#10b981', bg: '#064e3b' },
    oddTileOut:   { icon: '👁', label: 'Odd Tile Out',  color: '#6366f1', bg: '#312e81' },
    stopClock:    { icon: '⏱', label: 'Stop Clock',    color: '#f59e0b', bg: '#78350f' },
    mini2048:     { icon: '🔢', label: 'Mini 2048',     color: '#f97316', bg: '#7c2d12' },
    waterSort:    { icon: '🧪', label: 'Water Sort',    color: '#14b8a6', bg: '#134e4a' },
    pipeConnect:  { icon: '🔧', label: 'Pipe Connect',  color: '#22c55e', bg: '#14532d' },
    jigsaw:       { icon: '🧩', label: 'Jigsaw',        color: '#a855f7', bg: '#581c87' },
    flappy:       { icon: '🐤', label: 'Flappy Bird',   color: '#0474fc', bg: '#1e3a8a' },
    wordLadder:   { icon: '🪜', label: 'Word Ladder',   color: '#0ea5e9', bg: '#0c4a6e' },
    connections:  { icon: '🔗', label: 'Connections',   color: '#8b5cf6', bg: '#4c1d95' },
    _default:     { icon: '🧠', label: 'Brain Challenge', color: BLUE, bg: DARK }
  };

  function getConfig(type) {
    return GAMES[type] || GAMES._default;
  }

  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x+r, y); c.lineTo(x+w-r, y);
    c.quadraticCurveTo(x+w, y, x+w, y+r); c.lineTo(x+w, y+h-r);
    c.quadraticCurveTo(x+w, y+h, x+w-r, y+h); c.lineTo(x+r, y+h);
    c.quadraticCurveTo(x, y+h, x, y+h-r); c.lineTo(x, y+r);
    c.quadraticCurveTo(x, y, x+r, y); c.closePath();
  }

  function fillRR(c, x, y, w, h, r, fill) {
    rr(c, x, y, w, h, r);
    c.fillStyle = fill; c.fill();
  }

  function loadImg(src) {
    return new Promise(function(res) {
      if (!src) { res(null); return; }
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() { res(img); };
      img.onerror = function() { res(null); };
      img.src = src;
    });
  }

  // Main card layout:
  // ┌─────────────────────────────────────┐
  // │  [Game Icon] GAME NAME              │  ← top bar (dark accent)
  // │                                     │
  // │        BIG RESULT TEXT              │  ← center (blue bg)
  // │        subtitle                     │
  // │                                     │
  // │  [Avatar] @user · IQ 115   cebear  │  ← bottom bar
  // └─────────────────────────────────────┘

  async function generate(gameType, result, userData) {
    var cfg = getConfig(gameType);
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');

    // ── Background ──
    c.fillStyle = BLUE;
    c.fillRect(0, 0, W, H);

    // Top accent bar
    fillRR(c, 0, 0, W, 90, 0, cfg.bg);
    // Subtle gradient overlay
    var grad = c.createLinearGradient(0, 90, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = grad;
    c.fillRect(0, 90, W, H - 90);

    // ── Top bar: icon + game name ──
    c.font = '900 38px Nunito, sans-serif';
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.fillText(cfg.icon + '  ' + cfg.label.toUpperCase(), 56, 48);

    // "Can you beat me?" right side
    c.textAlign = 'right';
    c.font = '800 24px Nunito, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.4)';
    c.fillText('Can you beat me?', W - 56, 48);

    // ── Center: big result ──
    var mainText = result.main || 'Challenge';
    var subText = result.sub || '';
    var isWin = result.won !== false;

    // Result badge background
    var badgeY = 200, badgeH = 220;
    fillRR(c, W/2 - 300, badgeY - 30, 600, badgeH, 32, 'rgba(255,255,255,0.08)');
    c.strokeStyle = 'rgba(255,255,255,0.1)';
    c.lineWidth = 2;
    rr(c, W/2 - 300, badgeY - 30, 600, badgeH, 32);
    c.stroke();

    // Big text
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '900 96px Nunito, sans-serif';
    c.fillStyle = '#fff';
    c.fillText(mainText, W/2, badgeY + 60);

    // Sub text
    if (subText) {
      c.font = '800 28px Nunito, sans-serif';
      c.fillStyle = 'rgba(255,255,255,0.55)';
      c.fillText(subText, W/2, badgeY + 130);
    }

    // Win/lose indicator dot
    fillRR(c, W/2 - 40, badgeY + 155, 80, 6, 3, isWin ? GREEN : RED);

    // ── Bottom bar ──
    var botY = H - 100;
    c.fillStyle = 'rgba(0,0,0,0.15)';
    c.fillRect(0, botY - 10, W, H - botY + 10);

    // User info left
    var uname = '@' + (userData.username || 'player');
    var iq = userData.iq || '--';
    var avatarSrc = userData.avatarIMG || userData.pic || '';

    // Avatar circle
    var avX = 56, avY = botY + 30, avR = 26;
    if (avatarSrc) {
      var avImg = await loadImg(avatarSrc);
      if (avImg) {
        c.save();
        c.beginPath(); c.arc(avX + avR, avY, avR, 0, Math.PI * 2); c.clip();
        c.drawImage(avImg, avX, avY - avR, avR * 2, avR * 2);
        c.restore();
      } else {
        drawAvatarPlaceholder(c, avX + avR, avY, avR, uname);
      }
    } else {
      drawAvatarPlaceholder(c, avX + avR, avY, avR, uname);
    }

    // Avatar ring
    c.strokeStyle = 'rgba(255,255,255,0.3)';
    c.lineWidth = 3;
    c.beginPath(); c.arc(avX + avR, avY, avR + 2, 0, Math.PI * 2); c.stroke();

    // Username + IQ
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.font = '900 26px Nunito, sans-serif';
    c.fillStyle = '#fff';
    c.fillText(uname, avX + avR * 2 + 16, avY - 8);
    c.font = '800 20px Nunito, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.45)';
    c.fillText('IQ ' + iq, avX + avR * 2 + 16, avY + 18);

    // Logo + cebear.com right
    var logoImg = await loadImg('logo.png');
    var brandX = W - 56;
    c.textAlign = 'right';
    c.font = '900 28px Nunito, sans-serif';
    c.fillStyle = 'rgba(255,255,255,0.35)';
    var brandW = c.measureText('cebear.com').width;
    c.fillText('cebear.com', brandX, avY);
    if (logoImg) {
      c.drawImage(logoImg, brandX - brandW - 44, avY - 16, 32, 32);
    }

    return cv;
  }

  function drawAvatarPlaceholder(c, cx, cy, r, uname) {
    var grad = c.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, '#667eea');
    grad.addColorStop(1, '#764ba2');
    c.fillStyle = grad;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
    c.font = '900 22px Nunito, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,0.8)';
    c.fillText((uname.replace('@','')[0] || 'C').toUpperCase(), cx, cy);
  }

  // ── Result formatters per game type ──
  function formatResult(gameType, q, won, extra) {
    extra = extra || {};
    switch (gameType) {
      case 'wordle':
        return { main: won ? (extra.guesses || '?') + '/6' : 'X/6', sub: won ? 'Solved!' : 'The word was ' + (q.answer || '?'), won: won };
      case 'ticTacToe':
        return { main: won ? '🏆 WIN' : (extra.draw ? '🤝 DRAW' : '💀 LOSS'), sub: 'vs Bot', won: won };
      case 'memory':
        return { main: (extra.moves || '?') + ' moves', sub: won ? 'All pairs found!' : 'Memory training', won: won };
      case 'simon':
        return { main: 'Level ' + (extra.level || '?'), sub: won ? 'All 5 levels!' : 'Pattern memory', won: won };
      case 'reaction':
        return { main: (extra.ms || '???') + 'ms', sub: extra.ms < 250 ? 'Lightning fast!' : extra.ms < 400 ? 'Nice reflexes' : 'Can you go faster?', won: won };
      case 'wordScramble':
        return { main: won ? '✓ SOLVED' : '✗ MISSED', sub: q.word || 'Unscramble the word', won: won };
      case 'slidePuzzle':
        return { main: (extra.moves || '?') + ' moves', sub: won ? 'Puzzle solved!' : 'Slide to order 1-8', won: won };
      case 'colorSort':
        return { main: won ? '✓ PERFECT' : '✗ WRONG', sub: q.question || 'Sort the colors', won: won };
      case 'mathRush':
        return { main: (extra.score || 0) + '/5', sub: won ? 'Quick math!' : 'True or false speed', won: won };
      case 'oddTileOut':
        return { main: (extra.score || 0) + '/3', sub: 'Spot the difference', won: won };
      case 'stopClock':
        return { main: won ? '🎯 NAILED' : '✗ MISSED', sub: 'Stop the clock', won: won };
      case 'mini2048':
        return { main: won ? '64!' : 'Score ' + (extra.score || 0), sub: 'Merge tiles', won: won };
      case 'waterSort':
        return { main: (extra.pours || '?') + ' pours', sub: won ? 'All sorted!' : 'Sort the liquids', won: won };
      case 'pipeConnect':
        return { main: (extra.moves || '?') + ' rotations', sub: won ? 'Connected!' : 'Rotate the pipes', won: won };
      case 'jigsaw':
        return { main: won ? '✓ COMPLETE' : 'In progress', sub: 'Jigsaw puzzle', won: won };
      case 'flappy':
        return { main: (extra.score || 0) + ' pipes', sub: won ? 'Challenge cleared!' : 'Flappy Bird', won: won };
      case 'wordLadder':
        return { main: (extra.moves || '?') + ' steps', sub: (q.start || '?') + ' → ' + (q.end || '?'), won: won };
      case 'connections':
        return { main: won ? '4/4 GROUPS' : (extra.found || 0) + '/4', sub: 'Find the connections', won: won };
      default:
        return { main: won ? '✓ CORRECT' : '✗ WRONG', sub: q.categoryLabel || 'Brain Training', won: won };
    }
  }

  // ── Share with image ──
  async function shareWithCard(gameType, q, won, extra, shareUrl) {
    var d;
    try {
      var iqd = window.IQData ? window.IQData.load() : {};
      var fb = (window.parent !== window ? window.parent.firebase : window.firebase) || null;
      var u = fb ? fb.auth().currentUser : null;
      d = {
        username: iqd.username || (u && u.displayName) || 'player',
        iq: iqd.iq || '--',
        avatarIMG: iqd.avatarIMG || (u && u.photoURL) || '',
        pic: iqd.pic || ''
      };
    } catch(e) {
      d = { username: 'player', iq: '--', avatarIMG: '', pic: '' };
    }

    var result = formatResult(gameType, q, won, extra);
    var cv = await generate(gameType, result, d);

    // Try sharing with image file
    if (navigator.share && navigator.canShare) {
      try {
        var blob = await new Promise(function(res) { cv.toBlob(res, 'image/png'); });
        var file = new File([blob], 'cebear-' + gameType + '.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Cebear — ' + (GAMES[gameType] || GAMES._default).label,
            text: result.main + ' — Can you beat me? ' + shareUrl,
          });
          return 'shared';
        }
      } catch(e) {
        if (e.name === 'AbortError') return 'cancelled';
      }
    }

    // Fallback: share URL only
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cebear Brain Challenge',
          text: (GAMES[gameType] || GAMES._default).label + ': ' + result.main + ' — Can you beat me?',
          url: shareUrl,
        });
        return 'shared';
      } catch(e) {
        return 'cancelled';
      }
    }

    // Final fallback: copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      return 'copied';
    } catch(e) {
      return 'failed';
    }
  }

  return {
    generate: generate,
    formatResult: formatResult,
    shareWithCard: shareWithCard,
    getConfig: getConfig
  };
})();