// games/numSeq.js — Number Sequence patterns
(function () {

  Q.register('numSeq', function () {
    var patterns = [
      function(){ var add=Q.rand(2,10),s=Q.rand(1,30); return { seq:[s,s+add,s+add*2,s+add*3], ans:s+add*4, d:0.6, why:'+'+add+' each time.' }; },
      function(){ var sub=Q.rand(2,8),s=Q.rand(40,80); return { seq:[s,s-sub,s-sub*2,s-sub*3], ans:s-sub*4, d:0.7, why:'-'+sub+' each time.' }; },
      function(){ var s=Q.rand(2,6); return { seq:[s,s*2,s*4,s*8], ans:s*16, d:0.7, why:'Doubles each time.' }; },
      function(){ var s=Q.rand(1,4); return { seq:[s,s*3,s*9,s*27], ans:s*81, d:0.8, why:'Triples each time.' }; },
      function(){ return { seq:[2,3,5,7], ans:11, d:0.9, why:'Prime numbers. Next prime after 7 is 11.' }; },
      function(){ return { seq:[1,3,6,10], ans:15, d:0.8, why:'Triangular numbers: +2,+3,+4,+5.' }; },
      function(){ var s=Q.rand(1,8); return { seq:[s,s+2,s+5,s+9], ans:s+14, d:0.8, why:'Gaps: +2,+3,+4,+5.' }; },
      function(){ var s=Q.rand(4,8)*16; return { seq:[s,s/2,s/4,s/8], ans:s/16, d:0.7, why:'Halved each time.' }; },
      function(){ var o=Q.rand(1,5); return { seq:[o*o,(o+1)**2,(o+2)**2,(o+3)**2], ans:(o+4)**2, d:0.9, why:'Perfect squares.' }; },
      function(){ var a=Q.rand(1,5),b=Q.rand(2,6),c=a+b,d=b+c,e=c+d; return { seq:[a,b,c,d], ans:e, d:1.0, why:'Each = sum of previous two.' }; },
      function(){ var o=Q.rand(0,2); return { seq:[2**(o+1),2**(o+2),2**(o+3),2**(o+4)], ans:2**(o+5), d:1.0, why:'Powers of 2.' }; },
      function(){ var o=Q.rand(1,4); return { seq:[o**3,(o+1)**3,(o+2)**3,(o+3)**3], ans:(o+4)**3, d:1.1, why:'Cube numbers.' }; },
      function(){ var s=Q.rand(1,8); return { seq:[s,s+2,s+6,s+12], ans:s+20, d:1.1, why:'Gaps double: +2,+4,+6,+8.' }; },
      function(){ var s=Q.rand(1,5); return { seq:[s,s*2,s*6,s*24], ans:s*120, d:1.2, why:'Multiply by 2,3,4,5.' }; },
      function(){ var c=Q.rand(1,5); return { seq:[1+c,4+c,9+c,16+c], ans:25+c, d:1.1, why:'Perfect squares + '+c+'.' }; },
      function(){ var s=Q.rand(1,6); return { seq:[s,s+1,s+3,s+7], ans:s+15, d:1.2, why:'Gaps double: +1,+2,+4,+8.' }; },
      function(){ var s=Q.rand(2,5); return { seq:[s,s*s,s*s*s,s*s*s*s], ans:s**5, d:1.3, why:'Powers of '+s+'.' }; },
      function(){ return { seq:[1,1,2,3,5,8], ans:13, d:1.3, why:'Fibonacci: each = sum of previous two.' }; },
      function(){ return { seq:[1,4,9,16,25], ans:36, d:0.9, why:'Perfect squares 1-6.' }; },
      function(){ return { seq:[1,8,27,64], ans:125, d:1.0, why:'Cube numbers 1-5.' }; },
      function(){ return { seq:[2,6,12,20,30], ans:42, d:1.4, why:'n(n+1): 1x2,2x3,...,6x7=42.' }; },
      function(){ return { seq:[0,1,3,6,10,15], ans:21, d:1.3, why:'Triangular numbers.' }; },
      function(){ var a=Q.rand(10,30),d=Q.rand(3,9); return { seq:[a,a+d,a+d*3,a+d*6], ans:a+d*10, d:1.5, why:'Gaps: +'+d+',+'+(d*2)+',+'+(d*3)+',+'+(d*4)+'.' }; },
    ];
    var p = Q.pick(patterns)();
    return {
      type:'numSeq', category:'patternRecognition', categoryLabel:'Number Pattern',
      difficulty:p.d, question:'What comes next?',
      sequence:p.seq, answer:String(p.ans),
      options:Q.numOpts(p.ans).map(String), explanation:p.why, visual:'sequence'
    };
  }, 5);

})();