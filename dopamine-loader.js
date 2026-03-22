// dopamine-loader.js — Injects dopamine CSS overrides at runtime
// Add to improve.html: <script src="dopamine-loader.js"></script> (before </head>)
(function(){
  var s=document.createElement('style');
  s.id='dopamine-patch';
  s.textContent=`/* CEBEAR DOPAMINE PATCH */
@keyframes correctSlam{0%{transform:scale(1)}20%{transform:scale(1.12) rotate(-1deg)}40%{transform:scale(.95) rotate(.5deg)}60%{transform:scale(1.03)}100%{transform:scale(1)}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}10%{transform:translateX(-8px) rotate(-1deg)}20%{transform:translateX(8px) rotate(1deg)}30%{transform:translateX(-6px)}40%{transform:translateX(6px)}50%{transform:translateX(-4px)}60%{transform:translateX(4px)}70%{transform:translateX(-2px)}80%{transform:translateX(2px)}}
@keyframes streakFire{0%{text-shadow:0 0 4px rgba(245,158,11,.4)}50%{text-shadow:0 0 12px rgba(245,158,11,.8),0 0 20px rgba(245,158,11,.3)}100%{text-shadow:0 0 4px rgba(245,158,11,.4)}}
@keyframes xpPulse{0%{box-shadow:0 0 0 0 rgba(4,116,252,.4)}70%{box-shadow:0 0 0 8px rgba(4,116,252,0)}100%{box-shadow:0 0 0 0 rgba(4,116,252,0)}}
@keyframes tileReveal{0%{transform:scale(0) rotateY(90deg);opacity:0}50%{transform:scale(1.1) rotateY(0);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes cardSlideIn{0%{opacity:.8;transform:translateY(10px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes glowPulse{0%,100%{box-shadow:0 6px 0 #0247a3}50%{box-shadow:0 6px 0 #0247a3,0 0 20px rgba(4,116,252,.3)}}
@keyframes popBounce{0%{transform:scale(0.3);opacity:0}50%{transform:scale(1.08);opacity:1}70%{transform:scale(0.95)}100%{transform:scale(1)}}
@keyframes successGlow{0%{box-shadow:0 4px 0 var(--green-dark)}50%{box-shadow:0 4px 0 var(--green-dark),0 0 16px rgba(34,197,94,.4)}100%{box-shadow:0 4px 0 var(--green-dark)}}
#streak-pill{transition:all .3s}
#streak-pill .cv{animation:streakFire 2s ease-in-out infinite}
.xp-bar-in{transition:width .6s cubic-bezier(.34,1.56,.64,1)!important}
.slide.entering .qcard{animation:cardSlideIn .25s cubic-bezier(.34,1.56,.64,1) both!important}
.opt{transition:transform .08s,box-shadow .08s,background .15s,color .15s,border-color .15s!important}
.opt:hover:not(.correct):not(.wrong):not(.dim){background:#f0f7ff!important;border-color:var(--blue)!important}
.opt.correct{animation:correctSlam .5s cubic-bezier(.34,1.56,.64,1)!important;box-shadow:0 4px 0 var(--green-dark),0 0 12px rgba(34,197,94,.3)!important}
.opt.wrong{animation:wrongShake .5s ease!important}
.opt.show-correct{animation:popBounce .4s ease-out!important}
.wordle-tile.reveal-correct{box-shadow:0 3px 0 var(--green-dark),0 0 8px rgba(34,197,94,.3)!important;animation:tileReveal .3s ease-out both!important}
.wordle-tile.reveal-present{box-shadow:0 3px 0 var(--gold-dark),0 0 8px rgba(245,158,11,.3)!important;animation:tileReveal .3s ease-out both!important}
.wordle-tile.reveal-absent{animation:tileReveal .3s ease-out both!important}
.wordle-tile.has-letter{animation:popBounce .15s ease-out!important}
.mem-card{transition:transform .2s cubic-bezier(.34,1.56,.64,1),background .2s,border-color .2s!important}
.mem-card.mem-flip{transform:scale(1.08) rotateY(5deg)!important}
.mem-card.mem-matched{animation:correctSlam .4s cubic-bezier(.34,1.56,.64,1)!important;box-shadow:0 3px 0 var(--green-dark),0 0 10px rgba(34,197,94,.3)!important}
.ttt-cell.ttt-win{animation:correctSlam .5s cubic-bezier(.34,1.56,.64,1),successGlow 1s ease-in-out infinite!important}
.simon-pad{transition:opacity .15s,transform .1s,box-shadow .15s!important}
.simon-pad.simon-lit{opacity:1!important;transform:scale(1.1)!important;box-shadow:0 0 20px currentColor!important}
.react-circle{transition:all .2s cubic-bezier(.34,1.56,.64,1)!important}
.react-circle.react-go{animation:popBounce .35s ease-out!important;box-shadow:0 6px 0 var(--green-dark),0 0 30px rgba(34,197,94,.4)!important}
.react-circle.react-success{font-size:32px!important}
.conn-grid{gap:7px!important}
.conn-word{background:#fff!important;color:var(--text)!important;border:2.5px solid #e8e2d6!important;border-radius:12px!important;box-shadow:0 4px 0 #d6cfc0!important;padding:clamp(11px,2.8vw,15px) 6px!important;font-size:clamp(10px,2.5vw,12px)!important;transition:all .12s cubic-bezier(.34,1.56,.64,1)!important}
.conn-word:active{transform:translateY(4px)!important;box-shadow:none!important}
.conn-word.conn-sel{background:#e8f2ff!important;border-color:var(--blue)!important;color:var(--blue)!important;box-shadow:0 4px 0 var(--blue-dark)!important;transform:translateY(-3px) scale(1.03)!important}
.conn-word.conn-shake{animation:wrongShake .5s ease!important}
.conn-cat{border-radius:14px!important;padding:12px 10px!important;animation:popBounce .4s cubic-bezier(.34,1.56,.64,1)!important;box-shadow:0 3px 0 rgba(0,0,0,.2)!important}
.conn-cat-nm{font-size:11px!important;color:#fff!important}
.conn-cat-wds{font-size:12px!important;color:rgba(255,255,255,.9)!important}
.conn-dot{width:13px!important;height:13px!important;background:var(--gold)!important;box-shadow:0 2px 0 var(--gold-dark)!important;transition:all .3s cubic-bezier(.34,1.56,.64,1)!important}
.conn-dot.gone{background:rgba(255,255,255,.1)!important;transform:scale(.5)!important;box-shadow:none!important}
.conn-sub{background:#fff!important;color:var(--text)!important;border:2.5px solid #e8e2d6!important;border-radius:14px!important;box-shadow:0 4px 0 #d6cfc0!important;padding:11px 30px!important;font-size:15px!important}
.conn-sub:active{transform:translateY(4px)!important;box-shadow:none!important}
.conn-sub.ready{background:var(--green)!important;border-color:var(--green)!important;color:#fff!important;box-shadow:0 4px 0 var(--green-dark)!important;animation:glowPulse 1.5s ease-in-out infinite!important}
.conn-sub:disabled{opacity:.3!important}
.conn-msg{color:rgba(255,255,255,.65)!important;font-size:14px!important}
.conn-reveal-row{border-radius:14px!important;padding:12px 14px!important;animation:popBounce .3s ease-out!important}
.conn-reveal-nm{font-size:11px!important}
.conn-reveal-wds{color:rgba(255,255,255,.8)!important;font-size:13px!important}
.m48-wrap{border-radius:18px!important;padding:8px!important;gap:6px!important}
.m48-cell{border-radius:12px!important;font-weight:900!important;transition:all .12s cubic-bezier(.34,1.56,.64,1)!important}
.m48-cell[data-v="2"]{background:#fff!important;color:var(--blue)!important;box-shadow:0 2px 0 #d6cfc0!important}
.m48-cell[data-v="4"]{background:#e8f2ff!important;color:#0358c4!important;box-shadow:0 2px 0 #bdd4f0!important}
.m48-cell[data-v="8"]{background:var(--orange)!important;color:#fff!important;box-shadow:0 2px 0 var(--orange-dark)!important}
.m48-cell[data-v="16"]{background:var(--red)!important;color:#fff!important;box-shadow:0 2px 0 var(--red-dark)!important}
.m48-cell[data-v="32"]{background:var(--green)!important;color:#fff!important;box-shadow:0 2px 0 var(--green-dark)!important;animation:correctSlam .3s!important}
.m48-cell[data-v="64"]{background:var(--gold)!important;color:#fff!important;box-shadow:0 2px 0 var(--gold-dark)!important;animation:correctSlam .3s!important}
.m48-cell[data-v="128"]{background:var(--purple)!important;color:#fff!important;box-shadow:0 2px 0 var(--purple-dark)!important;animation:correctSlam .3s!important}
.ws2-tube{width:clamp(32px,8.5vw,42px)!important;border-radius:0 0 12px 12px!important;border-width:3px!important}
.ws2-tube.ws2-sel{border-color:#fff!important;transform:translateY(-12px)!important;box-shadow:0 6px 12px rgba(0,0,0,.3)!important}
.ws2-tube.ws2-done{border-color:var(--green)!important;animation:successGlow 1s infinite!important}
.ws2-layer{height:clamp(18px,5vw,24px)!important;border-radius:1px!important}
.slide-cell{transition:all .12s cubic-bezier(.34,1.56,.64,1)!important}
.slide-cell:not(.slide-empty):hover{transform:scale(1.05)!important}
.slide-cell.slide-win{animation:correctSlam .5s cubic-bezier(.34,1.56,.64,1)!important}
.ws-src{transition:all .1s cubic-bezier(.34,1.56,.64,1)!important}
.ws-src:hover:not(.ws-used){transform:translateY(-2px)!important;box-shadow:0 5px 0 #d6cfc0!important}
.ws-slot.ws-correct{animation:correctSlam .35s!important}
.confetti i{width:14px!important;height:14px!important;border-radius:4px!important}
@keyframes cf{0%{opacity:1;transform:translateY(0) rotate(0) scale(1)}30%{opacity:1;transform:translateY(30vh) rotate(180deg) scale(.9)}100%{opacity:0;transform:translateY(100vh) rotate(720deg) scale(.3)}}
.flash.green{background:radial-gradient(circle,rgba(34,197,94,.25) 0%,transparent 60%)!important}
.flash.red{background:radial-gradient(circle,rgba(239,68,68,.2) 0%,transparent 60%)!important}
@keyframes fl{0%{opacity:1;transform:scale(.95)}100%{opacity:0;transform:scale(1.1)}}
.streak-popup.show{animation:popBounce .5s cubic-bezier(.34,1.56,.64,1)!important}
.streak-popup .num{font-size:108px!important;text-shadow:0 6px 0 rgba(0,0,0,.2)!important}
.oto-tile{border-radius:14px!important;border-width:3px!important;transition:all .12s cubic-bezier(.34,1.56,.64,1)!important}
.oto-tile:hover{transform:scale(1.05)!important}
.oto-tile.oto-correct{animation:correctSlam .4s!important;box-shadow:0 0 0 4px var(--green),0 4px 0 var(--green-dark)!important}
.oto-tile.oto-wrong{animation:wrongShake .4s!important;opacity:.3!important}
.pc-grid{border-radius:18px!important;padding:8px!important;gap:5px!important}
.pc-cell{border-radius:12px!important;transition:all .15s cubic-bezier(.34,1.56,.64,1)!important}
.pc-cell:active:not(.pc-wall):not(.pc-src):not(.pc-snk){transform:rotate(90deg) scale(.9)!important}
.pc-cell.pc-lit{background:rgba(34,197,94,.2)!important}
.pc-cell.pc-lit .pc-dot{box-shadow:0 0 8px rgba(34,197,94,.6)!important}
.wl-cur-tile{transition:all .12s cubic-bezier(.34,1.56,.64,1)!important}
.wl-cur-tile.wl-sel{transform:translateY(-4px) scale(1.05)!important}
.wl-cur-tile.wl-match{animation:popBounce .3s!important}
.wl-lbtn{transition:all .1s!important}
.wl-lbtn:hover:not(.wl-same){transform:translateY(-2px)!important;box-shadow:0 5px 0 #d6cfc0!important}
.category{animation:popBounce .3s ease-out!important;box-shadow:0 2px 0 rgba(0,0,0,.1)!important}
.mr-timer{transition:color .2s,font-size .2s!important}
.mr-eq{transition:all .2s cubic-bezier(.34,1.56,.64,1)!important}
.mr-eq.mr-correct{animation:correctSlam .4s!important}
.mr-eq.mr-wrong{animation:wrongShake .4s!important}
.mr-dot-active{animation:xpPulse 1s ease-in-out infinite!important}
.mr-dot-done{animation:popBounce .3s!important}
`;
  document.head.appendChild(s);
})();
