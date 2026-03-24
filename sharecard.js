// sharecard.js — generates 1080x1080 share card images per game
window.ShareCard=(function(){
var W=1080,H=1080;

var GAMES={
  wordle:{icon:'🟩',name:'Wordle',bg:'#166534',accent:'#22c55e'},
  ticTacToe:{icon:'⭕',name:'Tic Tac Toe',bg:'#1e3a8a',accent:'#3b82f6'},
  memory:{icon:'🃏',name:'Memory Match',bg:'#4c1d95',accent:'#8b5cf6'},
  simon:{icon:'🔴',name:'Simon Says',bg:'#7f1d1d',accent:'#ef4444'},
  reaction:{icon:'⚡',name:'Reaction Time',bg:'#78350f',accent:'#f59e0b'},
  wordScramble:{icon:'🔤',name:'Word Scramble',bg:'#164e63',accent:'#06b6d4'},
  slidePuzzle:{icon:'🧩',name:'Slide Puzzle',bg:'#7c2d12',accent:'#f97316'},
  colorSort:{icon:'🎨',name:'Color Sort',bg:'#831843',accent:'#ec4899'},
  mathRush:{icon:'➕',name:'Math Rush',bg:'#064e3b',accent:'#10b981'},
  oddTileOut:{icon:'👁',name:'Odd Tile Out',bg:'#312e81',accent:'#6366f1'},
  stopClock:{icon:'⏱',name:'Stop Clock',bg:'#78350f',accent:'#f59e0b'},
  mini2048:{icon:'🔢',name:'Mini 2048',bg:'#7c2d12',accent:'#f97316'},
  waterSort:{icon:'🧪',name:'Water Sort',bg:'#134e4a',accent:'#14b8a6'},
  pipeConnect:{icon:'🔧',name:'Pipe Connect',bg:'#14532d',accent:'#22c55e'},
  jigsaw:{icon:'🧩',name:'Jigsaw',bg:'#581c87',accent:'#a855f7'},
  flappy:{icon:'🐤',name:'Flappy Bird',bg:'#1e3a8a',accent:'#0474fc'},
  wordLadder:{icon:'🪜',name:'Word Ladder',bg:'#0c4a6e',accent:'#0ea5e9'},
  connections:{icon:'🔗',name:'Connections',bg:'#4c1d95',accent:'#8b5cf6'},
  _default:{icon:'🧠',name:'Brain Challenge',bg:'#0358c4',accent:'#0474fc'}
};

function cfg(t){return GAMES[t]||GAMES._default;}

function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();}

function fmtResult(type,won,ex){
  ex=ex||{};
  switch(type){
    case'wordle':return won?(ex.guesses||'?')+'/6':'X/6';
    case'ticTacToe':return won?'WIN':ex.draw?'DRAW':'LOSS';
    case'memory':return(ex.moves||'?')+' moves';
    case'simon':return won?'5/5 levels':'Level '+(ex.level||'?');
    case'reaction':return(ex.ms||'???')+'ms';
    case'wordScramble':return won?'SOLVED':'MISSED';
    case'slidePuzzle':return(ex.moves||'?')+' moves';
    case'colorSort':return won?'PERFECT':'WRONG';
    case'mathRush':return(ex.score||0)+'/5';
    case'oddTileOut':return(ex.score||0)+'/3';
    case'stopClock':return won?'NAILED IT':'MISSED';
    case'mini2048':return won?'64!':'Score '+(ex.score||0);
    case'waterSort':return(ex.pours||'?')+' pours';
    case'pipeConnect':return(ex.moves||'?')+' rotations';
    case'jigsaw':return won?'COMPLETE':'INCOMPLETE';
    case'flappy':return(ex.score||0)+' pipes';
    case'wordLadder':return(ex.moves||'?')+' steps';
    case'connections':return won?'4/4':(ex.found||0)+'/4';
    default:return won?'CORRECT':'WRONG';
  }
}

function fmtSub(type,won,ex){
  ex=ex||{};
  switch(type){
    case'wordle':return won?'Solved it!':'Better luck next time';
    case'reaction':return(ex.ms||999)<250?'Lightning fast!':((ex.ms||999)<400?'Nice reflexes':'Can you go faster?');
    case'flappy':return won?'Challenge cleared!':'How far can you get?';
    case'memory':return won?'All pairs found!':'Memory training';
    case'mathRush':return won?'Quick math!':'True or false speed';
    default:return won?'Can you beat this?':'Try this challenge!';
  }
}

// Draw a game-specific visual element in the center of the card
function drawGameVisual(c,type,won,ex){
  ex=ex||{};
  var cx=W/2,cy=420;
  switch(type){
    case'wordle':
      // Draw wordle-style grid
      var rows=ex.guesses||4,colors=['#22c55e','#f59e0b','#64748b'];
      for(var r=0;r<Math.min(rows,6);r++){
        for(var col=0;col<5;col++){
          var tx=cx-130+col*54,ty=cy-80+r*54;
          var clr=r<rows-1?colors[Math.floor(Math.random()*3)]:(won?'#22c55e':colors[2]);
          if(r===rows-1&&won)clr='#22c55e';
          rr(c,tx,ty,48,48,8);c.fillStyle=clr;c.fill();
        }
      }
      break;
    case'reaction':
      // Big circle with ms
      c.fillStyle=won?'#22c55e':'#f59e0b';
      c.beginPath();c.arc(cx,cy,100,0,Math.PI*2);c.fill();
      c.fillStyle='#fff';c.font='900 56px Nunito,sans-serif';c.textAlign='center';c.textBaseline='middle';
      c.fillText((ex.ms||'???')+'ms',cx,cy);
      break;
    case'flappy':
      // Bird + pipes
      c.fillStyle='#fff';c.beginPath();c.arc(cx-60,cy,24,0,Math.PI*2);c.fill();
      c.fillStyle='#1e293b';c.beginPath();c.arc(cx-52,cy-6,5,0,Math.PI*2);c.fill();
      c.fillStyle='#f59e0b';c.beginPath();c.moveTo(cx-40,cy-3);c.lineTo(cx-30,cy+2);c.lineTo(cx-40,cy+7);c.closePath();c.fill();
      // Pipes
      for(var p=0;p<3;p++){
        var px=cx+40+p*80;
        c.fillStyle='rgba(255,255,255,0.15)';
        rr(c,px,cy-140,36,100,6);c.fill();
        rr(c,px,cy+40,36,100,6);c.fill();
      }
      break;
    case'ticTacToe':
      // Grid with X and O
      var gs=160,gx=cx-gs/2,gy=cy-gs/2,cs=gs/3;
      c.strokeStyle='rgba(255,255,255,0.2)';c.lineWidth=3;
      c.beginPath();c.moveTo(gx+cs,gy);c.lineTo(gx+cs,gy+gs);c.stroke();
      c.beginPath();c.moveTo(gx+cs*2,gy);c.lineTo(gx+cs*2,gy+gs);c.stroke();
      c.beginPath();c.moveTo(gx,gy+cs);c.lineTo(gx+gs,gy+cs);c.stroke();
      c.beginPath();c.moveTo(gx,gy+cs*2);c.lineTo(gx+gs,gy+cs*2);c.stroke();
      c.font='900 36px Nunito,sans-serif';c.textAlign='center';c.textBaseline='middle';
      var marks=['X','O','X','','X','O','O','','X'];
      marks.forEach(function(m,i){
        if(!m)return;
        c.fillStyle=m==='X'?'#3b82f6':'#ef4444';
        c.fillText(m,gx+cs*(i%3)+cs/2,gy+cs*Math.floor(i/3)+cs/2);
      });
      break;
    case'memory':
      // Card grid
      for(var mr=0;mr<2;mr++){
        for(var mc=0;mc<3;mc++){
          var mx=cx-100+mc*72,my=cy-50+mr*72;
          rr(c,mx,my,64,64,10);
          c.fillStyle=won?'#22c55e':'rgba(255,255,255,0.12)';c.fill();
          c.strokeStyle='rgba(255,255,255,0.2)';c.lineWidth=2;c.stroke();
          if(won){c.font='28px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';
          c.fillText(['🐻','🧠','⚡','🐻','🧠','⚡'][mr*3+mc],mx+32,my+32);}
        }
      }
      break;
    default:
      // Generic — big result circle
      c.fillStyle='rgba(255,255,255,0.08)';
      c.beginPath();c.arc(cx,cy,90,0,Math.PI*2);c.fill();
      c.strokeStyle='rgba(255,255,255,0.15)';c.lineWidth=3;c.stroke();
      break;
  }
}

function generate(type,won,ex,userData){
  var g=cfg(type);
  var cv=document.createElement('canvas');cv.width=W;cv.height=H;
  var c=cv.getContext('2d');

  // Background — game's dark color
  c.fillStyle=g.bg;c.fillRect(0,0,W,H);
  // Subtle gradient
  var grad=c.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,g.bg);grad.addColorStop(1,'rgba(0,0,0,0.3)');
  c.fillStyle=grad;c.fillRect(0,0,W,H);

  // Top — game name + icon
  c.textAlign='center';c.textBaseline='middle';
  c.font='48px sans-serif';c.fillStyle='rgba(255,255,255,0.9)';
  c.fillText(g.icon,W/2,80);
  c.font='900 32px Nunito,sans-serif';c.fillStyle='rgba(255,255,255,0.5)';
  c.fillText(g.name.toUpperCase(),W/2,130);

  // Accent line
  c.fillStyle=g.accent;
  rr(c,W/2-40,158,80,5,3);c.fill();

  // Game visual
  drawGameVisual(c,type,won,ex);

  // Big result
  var result=fmtResult(type,won,ex);
  c.textAlign='center';c.textBaseline='middle';
  c.font='900 80px Nunito,sans-serif';c.fillStyle='#fff';
  c.fillText(result,W/2,640);

  // Sub text
  var sub=fmtSub(type,won,ex);
  c.font='800 28px Nunito,sans-serif';c.fillStyle='rgba(255,255,255,0.5)';
  c.fillText(sub,W/2,700);

  // Win/lose bar
  c.fillStyle=won?'#22c55e':'#ef4444';
  rr(c,W/2-50,735,100,6,3);c.fill();

  // Bottom — user info
  var uname='@'+(userData.username||'player');
  var iq=userData.iq||'--';

  // User line
  c.font='800 26px Nunito,sans-serif';c.fillStyle='rgba(255,255,255,0.6)';
  c.fillText(uname+'  ·  IQ '+iq,W/2,830);

  // CTA
  c.font='900 24px Nunito,sans-serif';c.fillStyle=g.accent;
  c.fillText('Can you beat me?',W/2,890);

  // Branding
  c.font='800 20px Nunito,sans-serif';c.fillStyle='rgba(255,255,255,0.2)';
  c.fillText('cebear.com',W/2,960);

  // Corner accent dots
  c.fillStyle=g.accent;c.globalAlpha=0.15;
  c.beginPath();c.arc(60,60,30,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(W-60,60,20,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(60,H-60,20,0,Math.PI*2);c.fill();
  c.beginPath();c.arc(W-60,H-60,30,0,Math.PI*2);c.fill();
  c.globalAlpha=1;

  return cv;
}

async function share(type,won,ex,shareUrl){
  var d;
  try{
    var iqd=window.IQData?IQData.load():{};
    d={username:iqd.username||'player',iq:iqd.iq||'--'};
  }catch(e){d={username:'player',iq:'--'};}

  var cv=generate(type,won,ex,d);
  var g=cfg(type);
  var result=fmtResult(type,won,ex);
  var text=g.icon+' '+g.name+': '+result+'\nCan you beat me?\n'+shareUrl;

  // Try sharing with image
  if(navigator.share&&navigator.canShare){
    try{
      var blob=await new Promise(function(r){cv.toBlob(r,'image/png');});
      var file=new File([blob],'cebear-'+type+'.png',{type:'image/png'});
      if(navigator.canShare({files:[file]})){
        await navigator.share({files:[file],title:g.name+' — Cebear',text:text});
        return'shared';
      }
    }catch(e){if(e.name==='AbortError')return'cancelled';}
  }
  // Fallback — share URL with text
  if(navigator.share){
    try{await navigator.share({title:g.name+' — Cebear',text:text,url:shareUrl});return'shared';}
    catch(e){return'cancelled';}
  }
  // Clipboard
  try{await navigator.clipboard.writeText(text);return'copied';}
  catch(e){return'failed';}
}

return{generate:generate,share:share,fmtResult:fmtResult,cfg:cfg,GAMES:GAMES};
})();