// games/slidePuzzle.js — 3x3 Sliding Number Puzzle
(function () {
  Q.register('slidePuzzle',function(){var goal=[1,2,3,4,5,6,7,8,0],board;do{board=Q.shuffle(goal.slice());}while(!isSolvable(board)||boardEq(board,goal));function isSolvable(b){var inv=0;for(var i=0;i<9;i++)for(var j=i+1;j<9;j++)if(b[i]&&b[j]&&b[i]>b[j])inv++;return inv%2===0;}function boardEq(a,b){for(var i=0;i<9;i++)if(a[i]!==b[i])return false;return true;}return{type:'slidePuzzle',category:'problemSolving',categoryLabel:'Slide Puzzle',difficulty:1.3,question:'Slide tiles to order 1-8!',board:board,answer:'complete',options:[],explanation:'Spatial reasoning & planning.',visual:'custom'};},3);
  Q.registerRenderer('slidePuzzle',{
    render:function(q,idx){var cells='';for(var i=0;i<9;i++){var v=q.board[i];cells+='<button class="slide-cell'+(v===0?' slide-empty':'')+'" data-si="'+idx+'" data-sc="'+i+'">'+(v||'')+'</button>';}return '<div class="qcard" style="gap:10px"><div class="category">🧩 Slide Puzzle</div><div class="question">'+q.question+'</div><div class="slide-moves" id="slide-moves-'+idx+'">Moves: 0</div><div class="slide-grid" id="slide-grid-'+idx+'">'+cells+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div><div class="branding">cebear.com</div></div>';},
    attach:function(slideEl,q,idx,ctx){
      var grid=slideEl.querySelector('#slide-grid-'+idx),movesEl=slideEl.querySelector('#slide-moves-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!grid)return;
      var board=q.board.slice(),moves=0,done=false,goal=[1,2,3,4,5,6,7,8,0];
      grid.addEventListener('click',function(e){
        var btn=e.target.closest('.slide-cell');if(!btn||done)return;
        var ci=parseInt(btn.dataset.sc),blank=board.indexOf(0),canMove=false;
        if(ci===blank-1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank+1&&Math.floor(ci/3)===Math.floor(blank/3))canMove=true;if(ci===blank-3||ci===blank+3)canMove=true;
        if(!canMove){H.light&&H.light();return;}H.medium&&H.medium();board[blank]=board[ci];board[ci]=0;moves++;movesEl.textContent='Moves: '+moves;
        var cells=grid.querySelectorAll('.slide-cell');for(var i=0;i<9;i++){cells[i].textContent=board[i]||'';cells[i].className='slide-cell'+(board[i]===0?' slide-empty':'');cells[i].dataset.sc=i;}
        var won=true;for(var j=0;j<9;j++)if(board[j]!==goal[j]){won=false;break;}if(won)finish();
      });
      function finish(){done=true;var ms=Date.now()-ctx.answerStartRef.get(),optimal=moves<=25,data=ctx.IQData.recordAnswer(q.category,true,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('slidePuzzle');if(ctx.onAnswer)ctx.onAnswer(true,ms);optimal?(H.streak&&H.streak()):(H.success&&H.success());movesEl.textContent='Solved in '+moves+' moves!';movesEl.style.color='var(--green)';grid.querySelectorAll('.slide-cell').forEach(function(c){if(c.textContent)c.classList.add('slide-win');});ctx.flashEl.className='flash green show';ctx.spawnConfetti(optimal?25:12);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=optimal?'Efficient solver! 🧠':'Solved in '+moves+' moves. Optimal is ~22.';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    }
  });
})();