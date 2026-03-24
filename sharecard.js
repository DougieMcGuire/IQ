// sharecard.js — Cebear share system
// Formats share text per game type and manages result data for shared links

window.ShareCard = (function(){

  var GAMES = {
    wordle:       { icon: '🟩', name: 'Wordle' },
    ticTacToe:    { icon: '⭕', name: 'Tic Tac Toe' },
    memory:       { icon: '🃏', name: 'Memory Match' },
    simon:        { icon: '🔴', name: 'Simon Says' },
    reaction:     { icon: '⚡', name: 'Reaction Time' },
    wordScramble: { icon: '🔤', name: 'Word Scramble' },
    slidePuzzle:  { icon: '🧩', name: 'Slide Puzzle' },
    colorSort:    { icon: '🎨', name: 'Color Sort' },
    mathRush:     { icon: '➕', name: 'Math Rush' },
    oddTileOut:   { icon: '👁', name: 'Odd Tile Out' },
    stopClock:    { icon: '⏱', name: 'Stop Clock' },
    mini2048:     { icon: '🔢', name: 'Mini 2048' },
    waterSort:    { icon: '🧪', name: 'Water Sort' },
    pipeConnect:  { icon: '🔧', name: 'Pipe Connect' },
    jigsaw:       { icon: '🧩', name: 'Jigsaw' },
    flappy:       { icon: '🐤', name: 'Flappy Bird' },
    wordLadder:   { icon: '🪜', name: 'Word Ladder' },
    connections:  { icon: '🔗', name: 'Connections' }
  };

  function formatResult(type, won, extra) {
    extra = extra || {};
    switch (type) {
      case 'wordle':       return won ? 'Solved in ' + (extra.guesses||'?') + '/6' : 'Failed — X/6';
      case 'ticTacToe':    return won ? 'Beat the bot!' : (extra.draw ? 'Drew vs bot' : 'Lost to bot');
      case 'memory':       return 'Solved in ' + (extra.moves||'?') + ' moves';
      case 'simon':        return won ? 'Cleared all 5 levels!' : 'Reached level ' + (extra.level||'?');
      case 'reaction':     return (extra.ms||'???') + 'ms reaction time';
      case 'wordScramble': return won ? 'Unscrambled it!' : 'Couldn\'t crack it';
      case 'slidePuzzle':  return 'Solved in ' + (extra.moves||'?') + ' moves';
      case 'colorSort':    return won ? 'Sorted perfectly!' : 'Got the order wrong';
      case 'mathRush':     return (extra.score||0) + '/5 correct';
      case 'oddTileOut':   return (extra.score||0) + '/3 spotted';
      case 'stopClock':    return won ? 'Stopped it perfectly!' : 'Missed the target';
      case 'mini2048':     return won ? 'Hit 64!' : 'Score: ' + (extra.score||0);
      case 'waterSort':    return 'Sorted in ' + (extra.pours||'?') + ' pours';
      case 'pipeConnect':  return 'Connected in ' + (extra.moves||'?') + ' rotations';
      case 'jigsaw':       return won ? 'Completed the puzzle!' : 'In progress';
      case 'flappy':       return (extra.score||0) + ' pipes cleared';
      case 'wordLadder':   return 'Solved in ' + (extra.moves||'?') + ' steps';
      case 'connections':  return won ? 'Found all 4 groups!' : (extra.found||0) + '/4 groups found';
      default:             return won ? 'Got it right!' : 'Got it wrong';
    }
  }

  function buildShareText(type, won, extra, username) {
    var g = GAMES[type] || { icon: '🧠', name: 'Brain Challenge' };
    var result = formatResult(type, won, extra);
    var name = username ? '@' + username : 'I';
    return g.icon + ' ' + g.name + ' on Cebear\n' + name + ' ' + result + '\nCan you beat me?';
  }

  function buildResultData(type, won, extra) {
    return {
      type: type,
      won: !!won,
      text: formatResult(type, won, extra),
      extra: extra || {}
    };
  }

  function renderResultBanner(senderName, resultData) {
    if (!resultData || !resultData.text) return '';
    var g = GAMES[resultData.type] || { icon: '🧠', name: 'Challenge' };
    var name = senderName || 'Someone';
    var wonColor = resultData.won ? '#22c55e' : '#ef4444';
    return '<div class="shared-q-banner" style="gap:8px">'
      + '<div style="font-size:20px;flex-shrink:0">' + g.icon + '</div>'
      + '<div style="flex:1;min-width:0">'
      + '<div style="font-size:12px;font-weight:900;color:rgba(255,255,255,.5)">' + g.name + '</div>'
      + '<div style="font-size:14px;font-weight:900;color:' + wonColor + '">'
      + '@' + name + ' ' + resultData.text
      + '</div>'
      + '<div style="font-size:11px;font-weight:700;color:rgba(255,255,255,.4);margin-top:2px">Can you beat this?</div>'
      + '</div></div>';
  }

  return {
    GAMES: GAMES,
    formatResult: formatResult,
    buildShareText: buildShareText,
    buildResultData: buildResultData,
    renderResultBanner: renderResultBanner
  };
})();