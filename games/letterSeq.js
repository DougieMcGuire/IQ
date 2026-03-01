// games/letterSeq.js — Letter Sequence patterns
(function () {

  Q.register('letterSeq', function () {
    var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var patterns = [
      function(){ var i=Q.rand(0,19); return { seq:[A[i],A[i+1],A[i+2],A[i+3]], ans:A[i+4], d:0.6, why:'Consecutive letters.' }; },
      function(){ var i=Q.rand(0,15); return { seq:[A[i],A[i+2],A[i+4],A[i+6]], ans:A[i+8], d:0.7, why:'Skip one letter each time.' }; },
      function(){ var i=Q.rand(10,25); return { seq:[A[i],A[i-1],A[i-2],A[i-3]], ans:A[i-4], d:0.6, why:'Backward alphabet.' }; },
      function(){ return { seq:['A','E','I','O'], ans:'U', d:0.7, why:'The five vowels.' }; },
      function(){ return { seq:['B','D','F','H'], ans:'J', d:0.7, why:'Every other letter from B.' }; },
      function(){ return { seq:['Z','X','V','T'], ans:'R', d:0.7, why:'Backwards, skipping one.' }; },
      function(){ var i=Q.rand(0,11); return { seq:[A[i],A[i+3],A[i+6],A[i+9]], ans:A[i+12], d:1.0, why:'Skip two letters.' }; },
      function(){ return { seq:['A','B','D','G'], ans:'K', d:1.0, why:'Gaps: +1,+2,+3,+4.' }; },
      function(){ return { seq:['Z','Y','W','T'], ans:'P', d:1.0, why:'Gaps: -1,-2,-3,-4.' }; },
      function(){ return { seq:['A','C','F','J'], ans:'O', d:1.1, why:'Gaps: +2,+3,+4,+5.' }; },
      function(){ return { seq:['M','N','P','S'], ans:'W', d:1.1, why:'Gaps: +1,+2,+3,+4.' }; },
      function(){ var i=Q.rand(0,8); return { seq:[A[i],A[i+4],A[i+8],A[i+12]], ans:A[i+16], d:1.0, why:'Skip three letters.' }; },
      function(){ return { seq:['Z','X','U','Q'], ans:'L', d:1.2, why:'Gaps: -2,-3,-4,-5.' }; },
      function(){ return { seq:['A','Z','B','Y'], ans:'C', d:1.3, why:'Alternating from start and end.' }; },
      function(){ return { seq:['A','B','D','H'], ans:'P', d:1.6, why:'Positions double: 1,2,4,8,16=P.' }; },
      function(){ return { seq:['C','F','I','L'], ans:'O', d:1.1, why:'Every 3rd letter.' }; },
      function(){ return { seq:['B','E','I','N'], ans:'T', d:1.4, why:'Gaps: +3,+4,+5,+6.' }; },
      function(){ return { seq:['Z','A','Y','B'], ans:'X', d:1.3, why:'Alternating backward from Z and forward from A.' }; },
    ];
    var p = Q.pick(patterns)();
    var wrong = A.split('').filter(function(l){ return l !== p.ans; });
    return {
      type:'letterSeq', category:'patternRecognition', categoryLabel:'Letter Pattern',
      difficulty:p.d, question:'What letter comes next?',
      sequence:p.seq, answer:p.ans,
      options:Q.shuffle([p.ans].concat(Q.shuffle(wrong).slice(0,3))),
      explanation:p.why, visual:'letterSequence'
    };
  }, 4);

})();