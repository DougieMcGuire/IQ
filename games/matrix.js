// games/matrix.js — 3x3 Matrix Logic puzzles
(function () {

  Q.register('matrix', function () {
    var type = Q.rand(0, 7);
    var grid, ans, why, d;

    if (type === 0) {
      var sum=Q.rand(12,27),a=Q.rand(2,8),b=Q.rand(2,8),c=sum-a-b;
      var dd=Q.rand(2,8),e=Q.rand(2,8),f=sum-dd-e;
      var g=Q.rand(2,8),h=Q.rand(2,8);
      ans=sum-g-h; grid=[a,b,c,dd,e,f,g,h,'?'];
      why='Each row sums to '+sum+'. '+g+'+'+h+'+?='+sum; d=1.2;
    } else if (type === 1) {
      var add=Q.rand(2,6),r=[Q.rand(1,7),Q.rand(1,7),Q.rand(1,7)];
      grid=[r[0],r[1],r[2],r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];
      ans=r[2]+add*2; why='Each column +'+add+' per row.'; d=1.1;
    } else if (type === 2) {
      var a=Q.rand(2,5),b=Q.rand(2,5),dd=Q.rand(2,5),e=Q.rand(2,5),g=Q.rand(2,5),h=Q.rand(2,5);
      grid=[a,b,a*b,dd,e,dd*e,g,h,'?']; ans=g*h;
      why='Each row: col1 x col2 = col3. '+g+'x'+h+'='+ans; d=1.3;
    } else if (type === 3) {
      var m=2,a=Q.rand(2,5),b=Q.rand(2,5),c=Q.rand(2,5);
      grid=[a,b,c,a*m,b*m,c*m,a*m*m,b*m*m,'?']; ans=c*m*m;
      why='Each row x'+m+'.'; d=1.1;
    } else if (type === 4) {
      var a=Q.rand(2,6),add=Q.rand(1,4);
      grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?'];
      ans=a+add*2+2; why='+1 across, +'+add+' down.'; d=1.2;
    } else if (type === 5) {
      var colSum=Q.rand(12,20),a=Q.rand(2,6),dd=Q.rand(2,6),g=colSum-a-dd;
      var b=Q.rand(2,6),e=Q.rand(2,6),h=colSum-b-e;
      var c=Q.rand(2,6),f=Q.rand(2,6); ans=colSum-c-f;
      grid=[a,b,c,dd,e,f,g,h,'?']; why='Each column sums to '+colSum+'.'; d=1.3;
    } else if (type === 6) {
      var a=Q.rand(2,9),c=Q.rand(2,9);
      var dd=Q.rand(2,9),f=Q.rand(2,9),e=Math.round((dd+f)/2);
      var g=Q.rand(2,9),i=Q.rand(2,9); ans=Math.round((g+i)/2);
      grid=[a,Math.round((a+c)/2),c,dd,e,f,g,'?',i];
      why='Middle = average of first and last in each row.'; d=1.5;
    } else {
      var diag=Q.rand(10,20),a=Q.rand(2,7),e=Q.rand(2,7);
      var i=diag-a-e; var c=Q.rand(2,7),g=Q.rand(2,7);
      ans=diag-c-g; var b=Q.rand(2,7),d2=Q.rand(2,7),f=Q.rand(2,7),h=Q.rand(2,7);
      grid=[a,b,c,d2,e,f,g,h,'?']; why='Main diagonal sums to '+diag+'.'; d=1.6;
    }

    return {
      type:'matrix', category:'patternRecognition', categoryLabel:'Matrix Logic',
      difficulty:d||1.3, question:'Find the missing number',
      grid:grid, answer:String(ans), options:Q.numOpts(ans).map(String),
      explanation:why, visual:'matrix'
    };
  }, 3);

})();