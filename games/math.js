// games/math.js — Mental Math
(function () {
  Q.register('math', function () {
    var ops=[
      function(){var a=Q.rand(5,25),b=Q.rand(5,25);return{q:a+' + '+b,a:a+b,d:0.5};},
      function(){var a=Q.rand(20,60),b=Q.rand(5,20);return{q:a+' − '+b,a:a-b,d:0.5};},
      function(){var a=Q.rand(2,9),b=Q.rand(2,9);return{q:a+' × '+b,a:a*b,d:0.6};},
      function(){var b=Q.rand(2,6),a=b*Q.rand(2,8);return{q:a+' ÷ '+b,a:a/b,d:0.6};},
      function(){var n=Q.rand(2,10);return{q:n+' squared',a:n*n,d:0.7};},
      function(){var b=Q.rand(2,8)*10,p=[10,20,25,50][Q.rand(0,3)];return{q:p+'% of '+b,a:b*p/100,d:0.8};},
      function(){var a=Q.rand(12,88),b=Q.rand(8,55);return{q:a+' + '+b,a:a+b,d:0.9};},
      function(){var a=Q.rand(3,14),b=Q.rand(3,14);return{q:a+' × '+b,a:a*b,d:1.0};},
      function(){var a=Q.rand(15,60),b=Q.rand(10,30),c=Q.rand(5,20);return{q:a+' + '+b+' − '+c,a:a+b-c,d:1.0};},
      function(){var a=Q.rand(2,6),b=Q.rand(2,6),c=Q.rand(2,6);return{q:a+' × '+b+' × '+c,a:a*b*c,d:1.1};},
      function(){var a=Q.rand(2,9),b=Q.rand(2,9);return{q:a+'² + '+b+'²',a:a*a+b*b,d:1.1};},
      function(){var n=Q.rand(4,12);return{q:n+' cubed',a:n**3,d:1.2};},
      function(){var a=Q.rand(100,300),b=Q.rand(100,300);return{q:a+' + '+b,a:a+b,d:1.2};},
      function(){var a=Q.rand(11,25),b=Q.rand(2,9);return{q:a+' × '+b,a:a*b,d:1.2};},
      function(){var n=Q.rand(10,50)*2;return{q:'Half of '+n+' plus a quarter of '+n,a:n/2+n/4,d:1.3};},
      function(){var a=Q.rand(5,15),b=Q.rand(5,15);return{q:a+' × '+b+' + '+a,a:a*b+a,d:1.3};},
      function(){var a=Q.rand(2,8),b=Q.rand(2,8);return{q:'('+a+' + '+b+')²',a:(a+b)**2,d:1.4};},
      function(){var n=Q.rand(2,9);return{q:'√'+(n**4),a:n*n,d:1.5};},
    ];
    var p=Q.pick(ops)();
    return {type:'math',category:'mentalAgility',categoryLabel:'Mental Math',difficulty:p.d||1.0,question:p.q+' = ?',answer:String(p.a),options:Q.numOpts(p.a).map(String),explanation:p.q+'='+p.a,visual:'text'};
  }, 5);
})();