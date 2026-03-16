// games/games.js — All Cebear games consolidated

// ── Number Sequences ──────────────────────────────────────────────────────────
(function () {
  Q.register('numSeq', function () {
    var patterns=[
      function(){var add=Q.rand(2,10),s=Q.rand(1,30);return{seq:[s,s+add,s+add*2,s+add*3],ans:s+add*4,d:0.6,why:'+'+add+' each time.'};},
      function(){var sub=Q.rand(2,8),s=Q.rand(40,80);return{seq:[s,s-sub,s-sub*2,s-sub*3],ans:s-sub*4,d:0.7,why:'-'+sub+' each time.'};},
      function(){var s=Q.rand(2,6);return{seq:[s,s*2,s*4,s*8],ans:s*16,d:0.7,why:'Doubles each time.'};},
      function(){var s=Q.rand(1,4);return{seq:[s,s*3,s*9,s*27],ans:s*81,d:0.8,why:'Triples each time.'};},
      function(){return{seq:[2,3,5,7],ans:11,d:0.9,why:'Prime numbers. Next prime after 7 is 11.'};},
      function(){return{seq:[1,3,6,10],ans:15,d:0.8,why:'Triangular numbers: +2,+3,+4,+5.'};},
      function(){var s=Q.rand(1,8);return{seq:[s,s+2,s+5,s+9],ans:s+14,d:0.8,why:'Gaps: +2,+3,+4,+5.'};},
      function(){var s=Q.rand(4,8)*16;return{seq:[s,s/2,s/4,s/8],ans:s/16,d:0.7,why:'Halved each time.'};},
      function(){var o=Q.rand(1,5);return{seq:[o*o,(o+1)**2,(o+2)**2,(o+3)**2],ans:(o+4)**2,d:0.9,why:'Perfect squares.'};},
      function(){var a=Q.rand(1,5),b=Q.rand(2,6),c=a+b,d=b+c,e=c+d;return{seq:[a,b,c,d],ans:e,d:1.0,why:'Each = sum of previous two.'};},
      function(){var o=Q.rand(0,2);return{seq:[2**(o+1),2**(o+2),2**(o+3),2**(o+4)],ans:2**(o+5),d:1.0,why:'Powers of 2.'};},
      function(){var o=Q.rand(1,4);return{seq:[o**3,(o+1)**3,(o+2)**3,(o+3)**3],ans:(o+4)**3,d:1.1,why:'Cube numbers.'};},
      function(){var s=Q.rand(1,8);return{seq:[s,s+2,s+6,s+12],ans:s+20,d:1.1,why:'Gaps double: +2,+4,+6,+8.'};},
      function(){var s=Q.rand(1,5);return{seq:[s,s*2,s*6,s*24],ans:s*120,d:1.2,why:'Multiply by 2,3,4,5.'};},
      function(){var c=Q.rand(1,5);return{seq:[1+c,4+c,9+c,16+c],ans:25+c,d:1.1,why:'Perfect squares + '+c+'.'};},
      function(){var s=Q.rand(1,6);return{seq:[s,s+1,s+3,s+7],ans:s+15,d:1.2,why:'Gaps double: +1,+2,+4,+8.'};},
      function(){var s=Q.rand(2,5);return{seq:[s,s*s,s*s*s,s*s*s*s],ans:s**5,d:1.3,why:'Powers of '+s+'.'};},
      function(){return{seq:[1,1,2,3,5,8],ans:13,d:1.3,why:'Fibonacci: each = sum of previous two.'};},
      function(){return{seq:[1,4,9,16,25],ans:36,d:0.9,why:'Perfect squares 1-6.'};},
      function(){return{seq:[1,8,27,64],ans:125,d:1.0,why:'Cube numbers 1-5.'};},
      function(){return{seq:[2,6,12,20,30],ans:42,d:1.4,why:'n(n+1): 1x2,2x3,...,6x7=42.'};},
      function(){return{seq:[0,1,3,6,10,15],ans:21,d:1.3,why:'Triangular numbers.'};},
      function(){var a=Q.rand(10,30),d=Q.rand(3,9);return{seq:[a,a+d,a+d*3,a+d*6],ans:a+d*10,d:1.5,why:'Gaps: +'+d+',+'+(d*2)+',+'+(d*3)+',+'+(d*4)+'.'};},
    ];
    var p=Q.pick(patterns)();
    return {type:'numSeq',category:'patternRecognition',categoryLabel:'Number Pattern',difficulty:p.d,question:'What comes next?',sequence:p.seq,answer:String(p.ans),options:Q.numOpts(p.ans).map(String),explanation:p.why,visual:'sequence'};
  }, 5);
})();

// ── Letter Sequences ──────────────────────────────────────────────────────────
(function () {
  Q.register('letterSeq', function () {
    var A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var patterns=[
      function(){var i=Q.rand(0,19);return{seq:[A[i],A[i+1],A[i+2],A[i+3]],ans:A[i+4],d:0.6,why:'Consecutive letters.'};},
      function(){var i=Q.rand(0,15);return{seq:[A[i],A[i+2],A[i+4],A[i+6]],ans:A[i+8],d:0.7,why:'Skip one letter each time.'};},
      function(){var i=Q.rand(10,25);return{seq:[A[i],A[i-1],A[i-2],A[i-3]],ans:A[i-4],d:0.6,why:'Backward alphabet.'};},
      function(){return{seq:['A','E','I','O'],ans:'U',d:0.7,why:'The five vowels.'};},
      function(){return{seq:['B','D','F','H'],ans:'J',d:0.7,why:'Every other letter from B.'};},
      function(){return{seq:['Z','X','V','T'],ans:'R',d:0.7,why:'Backwards, skipping one.'};},
      function(){var i=Q.rand(0,11);return{seq:[A[i],A[i+3],A[i+6],A[i+9]],ans:A[i+12],d:1.0,why:'Skip two letters.'};},
      function(){return{seq:['A','B','D','G'],ans:'K',d:1.0,why:'Gaps: +1,+2,+3,+4.'};},
      function(){return{seq:['Z','Y','W','T'],ans:'P',d:1.0,why:'Gaps: -1,-2,-3,-4.'};},
      function(){return{seq:['A','C','F','J'],ans:'O',d:1.1,why:'Gaps: +2,+3,+4,+5.'};},
      function(){return{seq:['M','N','P','S'],ans:'W',d:1.1,why:'Gaps: +1,+2,+3,+4.'};},
      function(){var i=Q.rand(0,8);return{seq:[A[i],A[i+4],A[i+8],A[i+12]],ans:A[i+16],d:1.0,why:'Skip three letters.'};},
      function(){return{seq:['Z','X','U','Q'],ans:'L',d:1.2,why:'Gaps: -2,-3,-4,-5.'};},
      function(){return{seq:['A','Z','B','Y'],ans:'C',d:1.3,why:'Alternating from start and end.'};},
      function(){return{seq:['A','B','D','H'],ans:'P',d:1.6,why:'Positions double: 1,2,4,8,16=P.'};},
      function(){return{seq:['C','F','I','L'],ans:'O',d:1.1,why:'Every 3rd letter.'};},
      function(){return{seq:['B','E','I','N'],ans:'T',d:1.4,why:'Gaps: +3,+4,+5,+6.'};},
      function(){return{seq:['Z','A','Y','B'],ans:'X',d:1.3,why:'Alternating backward from Z and forward from A.'};},
    ];
    var p=Q.pick(patterns)(),wrong=A.split('').filter(function(l){return l!==p.ans;});
    return {type:'letterSeq',category:'patternRecognition',categoryLabel:'Letter Pattern',difficulty:p.d,question:'What letter comes next?',sequence:p.seq,answer:p.ans,options:Q.shuffle([p.ans].concat(Q.shuffle(wrong).slice(0,3))),explanation:p.why,visual:'letterSequence'};
  }, 4);
})();

// ── Matrix Logic ──────────────────────────────────────────────────────────────
(function () {
  Q.register('matrix', function () {
    var type=Q.rand(0,7),grid,ans,why,d;
    if(type===0){var sum=Q.rand(12,27),a=Q.rand(2,8),b=Q.rand(2,8),c=sum-a-b,dd=Q.rand(2,8),e=Q.rand(2,8),f=sum-dd-e,g=Q.rand(2,8),h=Q.rand(2,8);ans=sum-g-h;grid=[a,b,c,dd,e,f,g,h,'?'];why='Each row sums to '+sum+'. '+g+'+'+h+'+?='+sum;d=1.2;}
    else if(type===1){var add=Q.rand(2,6),r=[Q.rand(1,7),Q.rand(1,7),Q.rand(1,7)];grid=[r[0],r[1],r[2],r[0]+add,r[1]+add,r[2]+add,r[0]+add*2,r[1]+add*2,'?'];ans=r[2]+add*2;why='Each column +'+add+' per row.';d=1.1;}
    else if(type===2){var a=Q.rand(2,5),b=Q.rand(2,5),dd=Q.rand(2,5),e=Q.rand(2,5),g=Q.rand(2,5),h=Q.rand(2,5);grid=[a,b,a*b,dd,e,dd*e,g,h,'?'];ans=g*h;why='Each row: col1 x col2 = col3. '+g+'x'+h+'='+ans;d=1.3;}
    else if(type===3){var m=2,a=Q.rand(2,5),b=Q.rand(2,5),c=Q.rand(2,5);grid=[a,b,c,a*m,b*m,c*m,a*m*m,b*m*m,'?'];ans=c*m*m;why='Each row x'+m+'.';d=1.1;}
    else if(type===4){var a=Q.rand(2,6),add=Q.rand(1,4);grid=[a,a+1,a+2,a+add,a+add+1,a+add+2,a+add*2,a+add*2+1,'?'];ans=a+add*2+2;why='+1 across, +'+add+' down.';d=1.2;}
    else if(type===5){var colSum=Q.rand(12,20),a=Q.rand(2,6),dd=Q.rand(2,6),g=colSum-a-dd,b=Q.rand(2,6),e=Q.rand(2,6),h=colSum-b-e,c=Q.rand(2,6),f=Q.rand(2,6);ans=colSum-c-f;grid=[a,b,c,dd,e,f,g,h,'?'];why='Each column sums to '+colSum+'.';d=1.3;}
    else if(type===6){var a=Q.rand(2,9),c=Q.rand(2,9),dd=Q.rand(2,9),f=Q.rand(2,9),e=Math.round((dd+f)/2),g=Q.rand(2,9),i=Q.rand(2,9);ans=Math.round((g+i)/2);grid=[a,Math.round((a+c)/2),c,dd,e,f,g,'?',i];why='Middle = average of first and last in each row.';d=1.5;}
    else{var diag=Q.rand(10,20),a=Q.rand(2,7),e=Q.rand(2,7),i2=diag-a-e,c=Q.rand(2,7),g=Q.rand(2,7);ans=diag-c-g;var b=Q.rand(2,7),d2=Q.rand(2,7),f=Q.rand(2,7),h=Q.rand(2,7);grid=[a,b,c,d2,e,f,g,h,'?'];why='Main diagonal sums to '+diag+'.';d=1.6;}
    return {type:'matrix',category:'patternRecognition',categoryLabel:'Matrix Logic',difficulty:d||1.3,question:'Find the missing number',grid:grid,answer:String(ans),options:Q.numOpts(ans).map(String),explanation:why,visual:'matrix'};
  }, 3);
})();

// ── Mental Math ───────────────────────────────────────────────────────────────
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

// ── Analogies ─────────────────────────────────────────────────────────────────
(function () {
  Q.register('analogy', function () {
    var items = [
      {a:'Hot',b:'Cold',c:'Up',d:'Down',why:'Opposites.',df:0.6},{a:'Puppy',b:'Dog',c:'Kitten',d:'Cat',why:'Young to adult.',df:0.6},{a:'Bird',b:'Nest',c:'Bee',d:'Hive',why:'Animal to home.',df:0.7},{a:'Eye',b:'See',c:'Ear',d:'Hear',why:'Organ to function.',df:0.6},{a:'Fish',b:'Swim',c:'Bird',d:'Fly',why:'Animal to movement.',df:0.6},{a:'Pen',b:'Write',c:'Knife',d:'Cut',why:'Tool to action.',df:0.7},{a:'Cow',b:'Milk',c:'Bee',d:'Honey',why:'Producer to product.',df:0.7},{a:'Foot',b:'Shoe',c:'Hand',d:'Glove',why:'Body part to covering.',df:0.7},{a:'Doctor',b:'Hospital',c:'Teacher',d:'School',why:'Worker to workplace.',df:0.7},{a:'Finger',b:'Hand',c:'Toe',d:'Foot',why:'Part to whole.',df:0.6},{a:'Seed',b:'Plant',c:'Egg',d:'Bird',why:'Beginning to grown form.',df:0.7},{a:'Author',b:'Book',c:'Chef',d:'Meal',why:'Creator to creation.',df:1.0},{a:'Day',b:'Night',c:'Summer',d:'Winter',why:'Opposites in pairs.',df:0.9},{a:'Lock',b:'Key',c:'Question',d:'Answer',why:'Problem to solution.',df:1.0},{a:'Leaf',b:'Tree',c:'Petal',d:'Flower',why:'Part to plant.',df:1.0},{a:'Wheel',b:'Car',c:'Wing',d:'Plane',why:'Part to vehicle.',df:1.0},{a:'Library',b:'Books',c:'Museum',d:'Art',why:'Building to contents.',df:1.0},{a:'Carpenter',b:'Wood',c:'Sculptor',d:'Stone',why:'Craftsperson to material.',df:1.1},{a:'Ship',b:'Harbor',c:'Plane',d:'Airport',why:'Vehicle to port.',df:1.0},{a:'Violin',b:'Orchestra',c:'Soldier',d:'Army',why:'Individual to group.',df:1.1},{a:'Telescope',b:'Stars',c:'Microscope',d:'Cells',why:'Tool to what it observes.',df:1.2},{a:'Map',b:'Geography',c:'Clock',d:'Time',why:'Tool to what it measures.',df:1.3},{a:'Pilot',b:'Sky',c:'Captain',d:'Sea',why:'Navigator to domain.',df:1.2},{a:'Prologue',b:'Book',c:'Overture',d:'Opera',why:'Intro section to work.',df:1.5},{a:'Cartographer',b:'Maps',c:'Lexicographer',d:'Dictionaries',why:'Specialist to creation.',df:1.6},{a:'Petal',b:'Flower',c:'Spoke',d:'Wheel',why:'Radiating part to circular whole.',df:1.4},{a:'Archipelago',b:'Islands',c:'Constellation',d:'Stars',why:'Group name to components.',df:1.7},
    ];
    var i=Q.pick(items),wrong=items.filter(function(x){return x.d!==i.d;}).map(function(x){return x.d;});
    return {type:'analogy',category:'verbalReasoning',categoryLabel:'Analogy',difficulty:i.df||1.1,question:i.a+' is to '+i.b+', as '+i.c+' is to _____',answer:i.d,options:Q.shuffle([i.d].concat(Q.shuffle(wrong).slice(0,3))),explanation:i.why,visual:'text'};
  }, 4);
})();

// ── Odd One Out ───────────────────────────────────────────────────────────────
(function () {
  Q.register('oddOut', function () {
    var sets=[
      {items:['Apple','Banana','Carrot','Orange'],odd:'Carrot',why:'Vegetable among fruits.',d:0.5},{items:['Red','Blue','Square','Green'],odd:'Square',why:'Shape, not a color.',d:0.5},{items:['January','Monday','March','December'],odd:'Monday',why:'Day of week, not a month.',d:0.5},{items:['Coffee','Tea','Juice','Bread'],odd:'Bread',why:'Solid food among drinks.',d:0.5},{items:['Hammer','Screwdriver','Banana','Wrench'],odd:'Banana',why:'Food, not a tool.',d:0.5},{items:['Bike','Car','Boat','Truck'],odd:'Boat',why:'Travels on water.',d:0.6},{items:['Eagle','Penguin','Sparrow','Hawk'],odd:'Penguin',why:'Cannot fly.',d:0.7},{items:['Dog','Cat','Goldfish','Hamster'],odd:'Goldfish',why:'Fish among mammals.',d:0.6},{items:['Piano','Guitar','Violin','Drums'],odd:'Drums',why:'Percussion; others are melodic.',d:0.9},{items:['Mars','Venus','Moon','Jupiter'],odd:'Moon',why:'Orbits Earth, not the Sun.',d:0.9},{items:['Dolphin','Shark','Whale','Seal'],odd:'Shark',why:'Fish; others are mammals.',d:0.9},{items:['Python','Java','French','Ruby'],odd:'French',why:'Human language among programming languages.',d:0.9},{items:['Gold','Silver','Diamond','Copper'],odd:'Diamond',why:'Gemstone; others are metals.',d:1.0},{items:['Tennis','Chess','Basketball','Soccer'],odd:'Chess',why:'Board game; others are physical sports.',d:0.9},{items:['Rain','Snow','Hail','Wind'],odd:'Wind',why:'Air movement; others are precipitation.',d:1.0},{items:['Cello','Flute','Violin','Harp'],odd:'Flute',why:'Wind instrument; others are stringed.',d:1.0},{items:['Heart','Lungs','Brain','Femur'],odd:'Femur',why:'Bone; others are organs.',d:1.0},{items:['Atlantic','Pacific','Arctic','Sahara'],odd:'Sahara',why:'Desert; others are oceans.',d:0.9},{items:['Oxygen','Iron','Copper','Gold'],odd:'Oxygen',why:'Gas at room temp; others are solid metals.',d:1.1},{items:['Beethoven','Mozart','Picasso','Bach'],odd:'Picasso',why:'Painter; others were composers.',d:1.2},{items:['Democracy','Monarchy','Republic','Capitalism'],odd:'Capitalism',why:'Economic system; others are government types.',d:1.3},{items:['Meter','Kilogram','Second','Dollar'],odd:'Dollar',why:'Currency; others are SI units.',d:1.2},{items:['Broccoli','Spinach','Strawberry','Kale'],odd:'Strawberry',why:'Fruit; others are leafy greens.',d:1.0},{items:['Sonnet','Haiku','Limerick','Novel'],odd:'Novel',why:'Prose; others are poetry forms.',d:1.3},{items:['Plato','Aristotle','Socrates','Caesar'],odd:'Caesar',why:'Military leader; others were philosophers.',d:1.3},{items:['Simile','Metaphor','Hyperbole','Haiku'],odd:'Haiku',why:'Poetry form; others are figures of speech.',d:1.4},
    ];
    var s=Q.pick(sets);
    return {type:'oddOut',category:'logicalReasoning',categoryLabel:'Odd One Out',difficulty:s.d||1.0,question:"Which one doesn't belong?",answer:s.odd,options:Q.shuffle(s.items),explanation:s.why,visual:'text'};
  }, 4);
})();

// ── Riddles ───────────────────────────────────────────────────────────────────
(function () {
  Q.register('riddle', function () {
    var items=[
      {q:'I have hands but cannot clap. What am I?',a:'A clock',w:['A person','A robot','A tree'],why:'Clock hands tell time.',d:0.6},{q:'What has keys but no locks?',a:'A piano',w:['A door','A car','A safe'],why:'Piano has musical keys.',d:0.6},{q:'What gets wetter the more it dries?',a:'A towel',w:['A sponge','Paper','The sun'],why:'Towels absorb water as they dry things.',d:0.7},{q:'What has a head and tail but no body?',a:'A coin',w:['A snake','A fish','A ghost'],why:'Coins have heads and tails.',d:0.7},{q:'What can you catch but not throw?',a:'A cold',w:['A ball','A fish','A wave'],why:'You catch a cold.',d:0.7},{q:'What has teeth but cannot bite?',a:'A comb',w:['A shark','A dog','A saw'],why:'A comb has teeth for hair.',d:0.6},{q:'What goes up but never comes down?',a:'Your age',w:['A balloon','A bird','Smoke'],why:'Age only increases.',d:0.7},{q:'What has one eye but cannot see?',a:'A needle',w:['A pirate','A cyclops','A camera'],why:'Needle eye holds thread.',d:0.7},{q:'What has words but never speaks?',a:'A book',w:['A parrot','A phone','A radio'],why:'Books have words but cannot talk.',d:0.6},{q:'What runs but never walks?',a:'Water',w:['A dog','A car','Time'],why:'Water runs and flows.',d:0.7},{q:'The more you take, the more you leave behind. What?',a:'Footsteps',w:['Money','Time','Breath'],why:'Walking leaves footsteps.',d:1.0},{q:'What can fill a room but takes no space?',a:'Light',w:['Air','Water','Sound'],why:'Light fills space with no mass.',d:1.0},{q:'What can travel the world while staying in a corner?',a:'A stamp',w:['A compass','The internet','A satellite'],why:'Stamps stay in envelope corners.',d:1.0},{q:'I have cities but no houses, mountains but no trees. What am I?',a:'A map',w:['A planet','A dream','A story'],why:'Maps show geography without real objects.',d:1.0},{q:'The more there is, the less you see. What am I?',a:'Darkness',w:['Light','Fog','Space'],why:'More darkness = less visibility.',d:1.0},{q:'I speak without a mouth and hear without ears. What am I?',a:'An echo',w:['A ghost','Music','The wind'],why:'Echoes are sound reflections.',d:1.1},{q:'The more you remove from me, the bigger I get. What am I?',a:'A hole',w:['A balloon','A shadow','A debt'],why:'Removing material makes a hole bigger.',d:1.1},{q:'What is so fragile that saying its name breaks it?',a:'Silence',w:['Glass','A dream','A secret'],why:'Speaking breaks silence.',d:1.3},{q:'I have no life but I can die. What am I?',a:'A battery',w:['A robot','A flame','A ghost'],why:'Batteries die when drained.',d:1.3},{q:'What gets sharper the more you use it?',a:'Your mind',w:['A knife','A pencil','A saw'],why:'Mental ability sharpens with practice.',d:1.2},{q:"I'm light as a feather but the strongest man can't hold me for 5 minutes.",a:'Your breath',w:['Air','A thought','A cloud'],why:"Nobody can hold their breath that long.",d:1.2},{q:'What has 13 hearts but no other organs?',a:'A deck of cards',w:['A hospital','A town','A garden'],why:'13 hearts in the suit.',d:1.4},{q:'What tastes better than it smells?',a:'Your tongue',w:['Coffee','Perfume','Bacon'],why:'Your tongue tastes but cannot smell.',d:1.5},{q:"The person who makes it doesn't need it. The buyer doesn't use it. The user doesn't know it.",a:'A coffin',w:['A pill','A gift','A trap'],why:'Coffins: made, bought, and used this way.',d:1.5},
    ];
    var i=Q.pick(items);
    return {type:'riddle',category:'problemSolving',categoryLabel:'Riddle',difficulty:i.d||1.1,question:i.q,answer:i.a,options:Q.shuffle([i.a].concat(i.w)),explanation:i.why,visual:'text'};
  }, 4);
})();

// ── Code Breaker ──────────────────────────────────────────────────────────────
(function () {
  Q.register('codeBreak', function () {
    var items = [
      {q:'If A=1, B=2, C=3, what is A+B+C?',a:'6',w:['3','9','5'],why:'1+2+3=6',d:0.7},{q:'If N+N=10, what is N?',a:'5',w:['10','4','6'],why:'2N=10, N=5',d:0.7},{q:'If X × X = 25, what is X?',a:'5',w:['4','6','25'],why:'5×5=25',d:0.7},{q:'If P × 3 = 18, what is P?',a:'6',w:['3','9','18'],why:'18/3=6',d:0.7},{q:'If X/2 = 7, what is X?',a:'14',w:['7','9','12'],why:'X=7×2=14',d:0.7},{q:'If A=1, B=2... what is Z?',a:'26',w:['24','25','28'],why:'Z is the 26th letter.',d:0.8},{q:'If X=5 and Y=3, what is X+Y+X?',a:'13',w:['11','8','15'],why:'5+3+5=13',d:0.9},{q:'If A=1, B=2... what is D+E?',a:'9',w:['7','8','10'],why:'D=4, E=5. 4+5=9',d:0.9},{q:'If M=4, what is M×M−M?',a:'12',w:['8','16','0'],why:'16-4=12',d:1.0},{q:'If 2X − 3 = 7, what is X?',a:'5',w:['4','6','7'],why:'2X=10, X=5',d:1.0},{q:'If A=2, B=4, C=6... what is E?',a:'10',w:['8','12','5'],why:'Each letter=position×2. E=5th=10.',d:1.1},{q:'If N×N×N = 27, what is N?',a:'3',w:['9','6','4'],why:'3×3×3=27',d:1.0},{q:'If X+X+X+X = 48, what is X?',a:'12',w:['8','16','24'],why:'4X=48, X=12',d:1.0},{q:'If X²=Y and Y=81, what is X?',a:'9',w:['8','10','27'],why:'X²=81, X=9',d:1.2},{q:'If 3X + 2Y = 20 and X=4, what is Y?',a:'4',w:['2','6','8'],why:'12+2Y=20, 2Y=8, Y=4',d:1.4},{q:'STAR=58 (each letter = alphabet position). What does DOG equal?',a:'26',w:['30','22','29'],why:'D=4, O=15, G=7. 4+15+7=26',d:1.5},{q:'If RED=27, GREEN=49, what is BLUE?',a:'40',w:['35','45','38'],why:'B+L+U+E = 2+12+21+5 = 40',d:1.7},{q:'If A=1, B=2... what is the product of the first 4 letters?',a:'24',w:['10','12','48'],why:'1×2×3×4=24',d:1.3},
    ];
    var i=Q.pick(items);
    return {type:'codeBreak',category:'problemSolving',categoryLabel:'Code Breaker',difficulty:i.d||1.2,question:i.q,answer:i.a,options:Q.shuffle([i.a].concat(i.w)),explanation:i.why,visual:'text'};
  }, 3);
})();

// ── Wordle ────────────────────────────────────────────────────────────────────
(function () {
  const ANSWERS_URL = 'https://gist.githubusercontent.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b/raw/wordle-answers-alphabetical.txt';
  const GUESSES_URL = 'https://gist.githubusercontent.com/cfreshman/cdcdf777450c5b5301e439061d29694c/raw/b9f4f46b690e8a7c0643be16d239e824a3232b1b/wordle-allowed-guesses.txt';
  const SEED_EASY = ['BRAIN','LIGHT','SMART','THINK','QUICK','LEARN','POWER','DREAM','HEART','WORLD','SHARP','FOCUS','ALERT','GRASP','CLEAR','DEPTH','RAISE','SCORE','STAGE','TRACE','VALUE','WATCH','PLACE','SPACE','VOICE','BLEND','BRAVE','CATCH','DANCE','EARLY','GIANT','HAPPY','JUDGE','LARGE','NIGHT','OCEAN','PAINT','REACH','SOLAR','TIRED','WATER','YOUNG','AFTER','CLOSE','DAILY','EARTH','FIRST','HOUSE','MAGIC','ORDER','STORM','TOWER','FORCE','GRADE','LUNCH','MAYOR','NURSE','PILOT','RIVER','SIGHT','TRAIN','ULTRA','VALID','WHEAT','EXTRA','FLAIR','GLOBE','HUMOR','INPUT','JOINT'];
  const SEED_MEDIUM = ['FLINT','CRISP','KNACK','GRACE','PROXY','PLUMB','SWEPT','CLUMP','BRISK','CIVIC','DWARF','EXPEL','FROZE','GRUMP','HATCH','JOUST','KNEEL','LATCH','MOURN','NOTCH','PERCH','QUIRK','REVEL','SNOWY','THEFT','VOUCH','WALTZ','YACHT','ABHOR','BLUNT','CHANT','DEPOT','EVOKE','GUSTO','HEIST','INEPT','JUMPY','KNAVE','LODGE','MERIT','NEXUS','ONSET','PARCH','QUELL','RISKY','SCALP','TAUNT','UNFIT','VENOM','WRATH','YEARN','ZESTY','BLAZE','CHORD','DECOY','ENVOY','FROTH','GRAFT','HASTY','INFER','LIBEL','MAXIM','NIFTY','PLAIT','QUASH','REALM','SCORN','VIVID','WHIFF'];
  const SEED_HARD = ['GLYPH','TRYST','CRYPT','PYGMY','GYPSY','BORAX','CYNIC','EPOXY','FJORD','GHOUL','ICHOR','KUDZU','MYRRH','NYMPH','OKAPI','PSYCH','QUAFF','SYNTH','TABBY','ULCER','AXIOM','BUSHY','CHIMP','DUCHY','ELFIN','FETID','GAUZE','HUSKY','IGLOO','JUICY','KITTY','LUSTY','MURKY','NUTTY','OUGHT','PERKY','QUALM','RUSTY','SAVVY','TAWNY','VERVE','WITTY','FIZZY','GAUDY','HIPPO','IMPLY','JUMBO','KNOLL','LYRIC','NADIR','OVULE','PIXEL','RABID','SCOFF','UNZIP','VEXED','WIZEN','EXPEL'];
  var WORDS = { easy: SEED_EASY.slice(), medium: SEED_MEDIUM.slice(), hard: SEED_HARD.slice() };
  var VALID_WORDS = new Set(SEED_EASY.concat(SEED_MEDIUM, SEED_HARD));
  var COMMON_BIGRAMS = new Set(['TH','HE','IN','ER','AN','RE','ON','EN','AT','ND','ST','ES','NG','ED','TE','OR','TI','IS','IT','AR','AL','LE','NT','IC','OU','TO','LY','RA','IO','RI']);
  function wordFreqScore(w){var s=0;for(var i=0;i<4;i++)if(COMMON_BIGRAMS.has(w.slice(i,i+2)))s++;return s;}
  function classifyWords(words){var scored=words.map(function(w){return{w:w,s:wordFreqScore(w)};});scored.sort(function(a,b){return b.s-a.s;});var t=Math.floor(scored.length/3);WORDS.easy=scored.slice(0,t).map(function(x){return x.w;});WORDS.medium=scored.slice(t,t*2).map(function(x){return x.w;});WORDS.hard=scored.slice(t*2).map(function(x){return x.w;});}
  (function(){var ar=false,gr=false,aa=[];function tm(){if(!ar||!gr)return;if(aa.length)classifyWords(aa);}fetch(ANSWERS_URL).then(function(r){return r.text();}).then(function(t){aa=t.trim().split(/\s+/).map(function(w){return w.trim().toUpperCase();}).filter(function(w){return/^[A-Z]{5}$/.test(w);});aa.forEach(function(w){VALID_WORDS.add(w);});ar=true;tm();}).catch(function(){ar=true;tm();});fetch(GUESSES_URL).then(function(r){return r.text();}).then(function(t){t.trim().split(/\s+/).forEach(function(w){var x=w.trim().toUpperCase();if(/^[A-Z]{5}$/.test(x))VALID_WORDS.add(x);});gr=true;tm();}).catch(function(){gr=true;tm();});})();
  const TIERS=['easy','medium','hard'],DIFFS=[0.8,1.2,1.7];
  const KB_ROWS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['ENTER','Z','X','C','V','B','N','M','⌫']];
  Q.register('wordle', function () {
    var tier=this.rand(0,2),list=WORDS[TIERS[tier]],word=this.pick(list.length?list:SEED_EASY);
    return {type:'wordle',category:'verbalReasoning',categoryLabel:'Wordle',difficulty:DIFFS[tier],question:'Guess the 5-letter word',answer:word,options:[],explanation:'The word was '+word+'.',visual:'wordle',maxGuesses:6};
  }, 4);
  Q.registerRenderer('wordle', {
    render: function (q, idx) {
      var grid='';
      for(var r=0;r<6;r++){var row='';for(var c=0;c<5;c++)row+='<div class="wordle-tile" id="wt-'+idx+'-'+r+'-'+c+'"></div>';grid+='<div class="wordle-row" style="gap:3px">'+row+'</div>';}
      var kb=KB_ROWS.map(function(row){return '<div class="wordle-kb-row" style="gap:3px">'+row.map(function(k){return '<button class="wk'+(k==='ENTER'||k==='⌫'?' wide':'')+'" data-wk="'+k+'" data-wi="'+idx+'">'+k+'</button>';}).join('')+'</div>';}).join('');
      return '<div class="qcard" style="gap:3px;padding:6px 8px;overflow-y:auto">'+
        '<div class="category">🟩 Wordle</div>'+
        '<div class="question" style="font-size:clamp(11px,2.8vw,13px);margin:0">Guess the 5-letter word</div>'+
        '<div class="wordle-grid" style="gap:3px">'+grid+'</div>'+
        '<div class="wordle-msg" id="wm-'+idx+'"></div>'+
        '<div class="wordle-kb" style="gap:3px">'+kb+'</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explain" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>'+
        '<div class="scroll-hint" id="hint-'+idx+'"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>Swipe for next</div>';
    },
    attach: function (slideEl, q, idx, ctx) {
      var feed=ctx.feed,flashEl=ctx.flashEl,IQData=ctx.IQData,updateUI=ctx.updateUI,checkMore=ctx.checkMore,spawnConfetti=ctx.spawnConfetti,answerStartRef=ctx.answerStartRef,H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      var st={answer:q.answer,category:q.category,difficulty:q.difficulty,guesses:[],current:'',done:false,keyColors:{}};
      slideEl.addEventListener('click',function(e){var btn=e.target.closest('[data-wk]');if(!btn||+btn.dataset.wi!==idx)return;handleKey(btn.dataset.wk);});
      document.addEventListener('keydown',function(e){if(st.done)return;var vi=Math.round(feed.scrollTop/(feed.clientHeight||1));if(feed.children[vi]!==slideEl)return;if(e.key==='Enter')handleKey('ENTER');else if(e.key==='Backspace')handleKey('⌫');else if(/^[a-zA-Z]$/.test(e.key))handleKey(e.key.toUpperCase());});
      function handleKey(key){
        if(st.done)return;
        var msgEl=document.getElementById('wm-'+idx);
        if(key==='⌫'){if(st.current.length>0)H.light&&H.light();st.current=st.current.slice(0,-1);updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';return;}
        if(key==='ENTER'){
          if(st.current.length<5){H.warning&&H.warning();msgEl.className='wordle-msg error';msgEl.textContent='Not enough letters';shakeRow(st.guesses.length);return;}
          if(!VALID_WORDS.has(st.current)){H.wordleWrong&&H.wordleWrong();msgEl.className='wordle-msg error';msgEl.textContent='Not a valid word!';shakeRow(st.guesses.length);return;}
          submitGuess();return;
        }
        if(st.current.length<5){H.tilePop&&H.tilePop();st.current+=key;updateCurrentRow();msgEl.className='wordle-msg';msgEl.textContent='';}
      }
      function updateCurrentRow(){var row=st.guesses.length;for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;var l=st.current[c]||'';t.textContent=l;t.className='wordle-tile'+(l?' has-letter':'');}}
      function shakeRow(row){for(var c=0;c<5;c++){var t=document.getElementById('wt-'+idx+'-'+row+'-'+c);if(!t)continue;t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');(function(el){setTimeout(function(){el.classList.remove('shake');},400);})(t);}}
      function scoreGuess(guess,answer){var res=[null,null,null,null,null],pool=answer.split(''),i;for(i=0;i<5;i++)res[i]='absent';for(i=0;i<5;i++)if(guess[i]===pool[i]){res[i]='correct';pool[i]=null;}for(i=0;i<5;i++){if(res[i]==='correct')continue;var j=pool.indexOf(guess[i]);if(j!==-1){res[i]='present';pool[j]=null;}}return res;}
      function submitGuess(){
        var guess=st.current,result=scoreGuess(guess,st.answer),row=st.guesses.length;
        st.guesses.push({word:guess,result:result});st.current='';
        var FH=200,FD=400,ST=100;
        for(var t=0;t<5;t++)(function(i){setTimeout(function(){H.tilePop&&H.tilePop();},i*ST);})(t);
        for(var c=0;c<5;c++)(function(col){var tile=document.getElementById('wt-'+idx+'-'+row+'-'+col);if(!tile)return;setTimeout(function(){tile.style.transition='transform '+FH+'ms ease-in';tile.style.transform='rotateX(-90deg)';setTimeout(function(){tile.textContent=guess[col];tile.className='wordle-tile reveal-'+result[col];tile.style.transition='transform '+FH+'ms ease-out';tile.style.transform='rotateX(0deg)';},FH);},col*ST);})(c);
        setTimeout(function(){updateKeyboard(guess,result);var won=result.every(function(r){return r==='correct';});var lost=!won&&st.guesses.length>=6;if(won||lost)finishWordle(won);},4*ST+FD+50);
      }
      function updateKeyboard(guess,result){var p={correct:3,present:2,absent:1};for(var i=0;i<5;i++){var l=guess[i];if(!st.keyColors[l]||p[result[i]]>p[st.keyColors[l]])st.keyColors[l]=result[i];}document.querySelectorAll('[data-wi="'+idx+'"]').forEach(function(btn){var s=st.keyColors[btn.dataset.wk];if(!s)return;btn.classList.remove('st-correct','st-present','st-absent');btn.classList.add('st-'+s);});}
      function finishWordle(won){
        st.done=true;
        var msgEl=document.getElementById('wm-'+idx),expEl=document.getElementById('exp-'+idx),hintEl=document.getElementById('hint-'+idx);
        var ms=Date.now()-answerStartRef.get(),data=IQData.recordAnswer(st.category,won,st.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordle');
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){var bg=['Ace! 🎯','Brilliant! 🧠','Nailed it! ⚡','Great! 🔥','Nice! 💡','Phew! 😅'];msgEl.className='wordle-msg success';msgEl.textContent=bg[st.guesses.length-1]||'Yes!';st.guesses.length===1?(H.streak&&H.streak()):(H.wordleWin&&H.wordleWin());flashEl.className='flash green show';spawnConfetti(st.guesses.length===1?30:14);setTimeout(function(){flashEl.className='flash';},350);}
        else{msgEl.className='wordle-msg error';msgEl.textContent='The word was '+st.answer;H.error&&H.error();flashEl.className='flash red show';setTimeout(function(){flashEl.className='flash';},350);}
        if(expEl){expEl.textContent=won?'Solved in '+st.guesses.length+' guess'+(st.guesses.length===1?'':'es')+'!':'The answer was "'+st.answer+'". Keep going!';setTimeout(function(){expEl.classList.add('show');},200);}
        setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);
        updateUI(data);
        if(won&&data.streak>0&&data.streak%5===0){setTimeout(function(){H.streak&&H.streak();var sn=document.getElementById('streak-num'),sp=document.getElementById('streak-popup');if(sn)sn.textContent=data.streak;if(sp){sp.classList.add('show');spawnConfetti(25);setTimeout(function(){sp.classList.remove('show');},1800);}},600);}
        checkMore();answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Tic Tac Toe ───────────────────────────────────────────────────────────────
(function () {
  var DIFFS=[0.6,1.0,1.5],LABELS=['Easy','Medium','Hard'];
  Q.register('ticTacToe',function(){var tier=this.rand(0,2);return{type:'ticTacToe',category:'problemSolving',categoryLabel:'Tic Tac Toe',difficulty:DIFFS[tier],question:'Beat the bot! ('+LABELS[tier]+')',answer:'win',options:[],explanation:'',visual:'ticTacToe',botLevel:tier};},3);
  Q.registerRenderer('ticTacToe',{
    render:function(q,idx){
      var cells='';for(var i=0;i<9;i++)cells+='<button class="ttt-cell" data-ti="'+idx+'" data-tc="'+i+'"></button>';
      return '<div class="qcard" style="gap:10px">'+
        '<div class="category">❌ Tic Tac Toe</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="ttt-status" id="ttt-status-'+idx+'">Your turn (X)</div>'+
        '<div class="ttt-grid" id="ttt-grid-'+idx+'">'+cells+'</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explain" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>'+
        '<div class="scroll-hint" id="hint-'+idx+'"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>Swipe for next</div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var IQData=ctx.IQData,flashEl=ctx.flashEl,updateUI=ctx.updateUI,checkMore=ctx.checkMore,spawnConfetti=ctx.spawnConfetti,answerStartRef=ctx.answerStartRef,H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      var board=[0,0,0,0,0,0,0,0,0],done=false,botLevel=q.botLevel;
      var WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      slideEl.addEventListener('click',function(e){
        var btn=e.target.closest('[data-tc]');if(!btn||+btn.dataset.ti!==idx||done)return;
        var cell=+btn.dataset.tc;if(board[cell]!==0)return;
        H.medium&&H.medium();board[cell]=1;renderBoard();
        var w=checkWin();if(w){finish(w);return;}if(isFull()){finish('draw');return;}
        setStatus('Bot thinking...');done=true;
        setTimeout(function(){done=false;var move=botMove();board[move]=2;H.light&&H.light();renderBoard();var w2=checkWin();if(w2){finish(w2);return;}if(isFull()){finish('draw');return;}setStatus('Your turn (X)');},350);
      });
      function renderBoard(){for(var i=0;i<9;i++){var el=slideEl.querySelector('[data-tc="'+i+'"]');if(!el)continue;if(board[i]===1){el.textContent='X';el.classList.add('ttt-x');el.classList.remove('ttt-o');}else if(board[i]===2){el.textContent='O';el.classList.add('ttt-o');el.classList.remove('ttt-x');}}}
      function setStatus(txt){var el=document.getElementById('ttt-status-'+idx);if(el)el.textContent=txt;}
      function checkWin(){for(var i=0;i<WINS.length;i++){var a=WINS[i][0],b=WINS[i][1],c=WINS[i][2];if(board[a]&&board[a]===board[b]&&board[b]===board[c]){highlightWin(WINS[i]);return board[a]===1?'player':'bot';}}return null;}
      function highlightWin(cells){for(var i=0;i<cells.length;i++){var el=slideEl.querySelector('[data-tc="'+cells[i]+'"]');if(el)el.classList.add('ttt-win');}}
      function isFull(){for(var i=0;i<9;i++)if(board[i]===0)return false;return true;}
      function empties(){var e=[];for(var i=0;i<9;i++)if(board[i]===0)e.push(i);return e;}
      function botMove(){if(botLevel===0)return botEasy();if(botLevel===1)return botMedium();return botHard();}
      function botEasy(){var e=empties();return e[Math.floor(Math.random()*e.length)];}
      function botMedium(){var w=findWinMove(2);if(w!==-1)return w;var b=findWinMove(1);if(b!==-1)return b;if(board[4]===0)return 4;return botEasy();}
      function botHard(){var best=-Infinity,move=-1,e=empties();for(var i=0;i<e.length;i++){board[e[i]]=2;var s=minimax(false,0);board[e[i]]=0;if(s>best){best=s;move=e[i];}}return move;}
      function minimax(isMax,depth){var w=checkWinner();if(w===2)return 10-depth;if(w===1)return depth-10;if(isFull())return 0;var e=empties();if(isMax){var best=-Infinity;for(var i=0;i<e.length;i++){board[e[i]]=2;best=Math.max(best,minimax(false,depth+1));board[e[i]]=0;}return best;}else{var best=Infinity;for(var i=0;i<e.length;i++){board[e[i]]=1;best=Math.min(best,minimax(true,depth+1));board[e[i]]=0;}return best;}}
      function checkWinner(){for(var i=0;i<WINS.length;i++){var a=WINS[i][0],b=WINS[i][1],c=WINS[i][2];if(board[a]&&board[a]===board[b]&&board[b]===board[c])return board[a];}return 0;}
      function findWinMove(piece){var e=empties();for(var i=0;i<e.length;i++){board[e[i]]=piece;if(checkWinner()===piece){board[e[i]]=0;return e[i];}board[e[i]]=0;}return -1;}
      function finish(result){
        done=true;
        var won=result==='player',draw=result==='draw',ms=Date.now()-answerStartRef.get();
        if(won){setStatus('You win! 🎉');H.success&&H.success();}else if(draw){setStatus("It's a draw! 🤝");H.toggle&&H.toggle();}else{setStatus('Bot wins! 🤖');H.error&&H.error();}
        var data=IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('ticTacToe');
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){flashEl.className='flash green show';spawnConfetti(16);setTimeout(function(){flashEl.className='flash';},350);}
        else if(!draw){flashEl.className='flash red show';setTimeout(function(){flashEl.className='flash';},350);}
        var expEl=document.getElementById('exp-'+idx),hintEl=document.getElementById('hint-'+idx);
        if(expEl){expEl.textContent=won?'Nice strategy!':draw?'A draw is respectable against this bot.':'The bot outsmarted you this time.';setTimeout(function(){expEl.classList.add('show');},200);}
        setTimeout(function(){if(hintEl)hintEl.classList.add('show');},500);
        updateUI(data);
        if(won&&data.streak>0&&data.streak%5===0){setTimeout(function(){H.streak&&H.streak();var sn=document.getElementById('streak-num'),sp=document.getElementById('streak-popup');if(sn)sn.textContent=data.streak;if(sp){sp.classList.add('show');spawnConfetti(25);setTimeout(function(){sp.classList.remove('show');},1800);}},600);}
        checkMore();answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Memory Match ──────────────────────────────────────────────────────────────
(function () {
  var EMOJIS=['🐻','🧠','⚡','🔥','🎯','💡','🌟','🎪','🎨','🎮','🏆','💎','🚀','🌈','🎵','🍕'];
  Q.register('memory',function(){var size=Q.rand(0,2),pairs=[3,4,6][size],picks=Q.shuffle(EMOJIS.slice()).slice(0,pairs),cards=Q.shuffle(picks.concat(picks));return{type:'memory',category:'memory',categoryLabel:'Memory Match',difficulty:[0.7,1.1,1.5][size],question:'Find all matching pairs!',cards:cards,pairs:pairs,answer:'complete',options:[],explanation:'Memory training strengthens recall.',visual:'custom'};},4);
  Q.registerRenderer('memory',{
    render:function(q,idx){
      var cols=q.pairs<=3?3:4,cells='';
      for(var i=0;i<q.cards.length;i++)cells+='<button class="mem-card" data-mi="'+idx+'" data-mc="'+i+'" data-mv="'+q.cards[i]+'"><span class="mem-front">?</span><span class="mem-back">'+q.cards[i]+'</span></button>';
      return '<div class="qcard" style="gap:10px">'+
        '<div class="category">🧠 Memory Match</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="mem-status" id="mem-status-'+idx+'">Tap to flip</div>'+
        '<div class="mem-grid mem-cols-'+cols+'" id="mem-grid-'+idx+'">'+cells+'</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var grid=slideEl.querySelector('#mem-grid-'+idx),status=slideEl.querySelector('#mem-status-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!grid)return;
      var flipped=[],matched=0,moves=0,locked=false,totalPairs=q.pairs;
      grid.addEventListener('click',function(e){
        var btn=e.target.closest('.mem-card');if(!btn||locked||btn.classList.contains('mem-flip')||btn.classList.contains('mem-matched'))return;
        H.cardFlip&&H.cardFlip();btn.classList.add('mem-flip');flipped.push(btn);
        if(flipped.length===2){moves++;locked=true;var a=flipped[0],b=flipped[1];
          if(a.dataset.mv===b.dataset.mv){setTimeout(function(){H.cardMatch&&H.cardMatch();},150);a.classList.add('mem-matched');b.classList.add('mem-matched');matched++;flipped=[];locked=false;if(matched===totalPairs){finish(true);}else{status.textContent=matched+'/'+totalPairs+' pairs';}}
          else{setTimeout(function(){H.light&&H.light();},300);setTimeout(function(){a.classList.remove('mem-flip');b.classList.remove('mem-flip');flipped=[];locked=false;},600);}
        }
      });
      function finish(won){
        var ms=Date.now()-ctx.answerStartRef.get(),perfect=moves<=totalPairs+1,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('memory');if(ctx.onAnswer)ctx.onAnswer(won,ms);
        perfect?(H.streak&&H.streak()):(H.success&&H.success());status.textContent='Done in '+moves+' moves!';status.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?25:10);setTimeout(function(){ctx.flashEl.className='flash';},350);
        var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Perfect memory! 🎯':'Solved in '+moves+' moves';expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Simon Says ────────────────────────────────────────────────────────────────
(function () {
  var COLORS=['#e8443a','#3fba4f','#e8a817','#3a7df2'];
  Q.register('simon',function(){return{type:'simon',category:'memory',categoryLabel:'Simon Says',difficulty:1.2,question:'Repeat the pattern!',answer:'complete',options:[],explanation:'Working memory and pattern repetition.',visual:'custom'};},3);
  Q.registerRenderer('simon',{
    render:function(q,idx){
      var pads='';for(var i=0;i<4;i++)pads+='<button class="simon-pad" data-si="'+idx+'" data-sc="'+i+'" style="background:'+COLORS[i]+'"></button>';
      return '<div class="qcard" style="gap:10px">'+
        '<div class="category">🔴 Simon Says</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="simon-level" id="simon-level-'+idx+'">Level 1</div>'+
        '<div class="simon-grid" id="simon-grid-'+idx+'">'+pads+'</div>'+
        '<div class="simon-status" id="simon-status-'+idx+'">Watch the pattern...</div>'+
        '<div id="simon-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0">'+
          '<button id="simon-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button>'+
        '</div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var grid=slideEl.querySelector('#simon-grid-'+idx),status=slideEl.querySelector('#simon-status-'+idx),levelEl=slideEl.querySelector('#simon-level-'+idx),readyWrap=slideEl.querySelector('#simon-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#simon-ready-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!grid)return;
      var sequence=[],playerSeq=[],level=0,accepting=false,done=false,maxLevel=5;
      function getPad(i){return grid.querySelector('[data-sc="'+i+'"]');}
      function flashPad(i,dur){var p=getPad(i);if(!p)return;p.classList.add('simon-lit');setTimeout(function(){p.classList.remove('simon-lit');},dur||400);}
      function playSequence(){accepting=false;status.textContent='Watch the pattern...';var delay=600;sequence.forEach(function(c,i){setTimeout(function(){H.light&&H.light();flashPad(c,350);},delay+i*600);});setTimeout(function(){accepting=true;status.textContent='Your turn! Repeat it.';playerSeq=[];},delay+sequence.length*600);}
      readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';ctx.answerStartRef.set(Date.now());nextLevel();});
      function nextLevel(){level++;levelEl.textContent='Level '+level;sequence.push(Math.floor(Math.random()*4));playSequence();}
      grid.addEventListener('click',function(e){
        var btn=e.target.closest('.simon-pad');if(!btn||!accepting||done)return;
        var ci=parseInt(btn.dataset.sc);H.medium&&H.medium();flashPad(ci,200);playerSeq.push(ci);
        var pos=playerSeq.length-1;
        if(playerSeq[pos]!==sequence[pos]){done=true;accepting=false;H.error&&H.error();status.textContent='Wrong! Got to level '+level;finish(false);return;}
        if(playerSeq.length===sequence.length){
          if(level>=maxLevel){done=true;accepting=false;H.success&&H.success();status.textContent='You beat it! 🎉';finish(true);}
          else{status.textContent='Level '+level+' done! ✓';setTimeout(nextLevel,800);}
        }
      });
      function finish(won){
        var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('simon');if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){ctx.flashEl.className='flash green show';ctx.spawnConfetti(20);}else{ctx.flashEl.className='flash red show';}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=won?'Excellent memory! All 5 levels!':'Reached level '+level+'. Keep training!';expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Reaction Time ─────────────────────────────────────────────────────────────
(function () {
  Q.register('reaction',function(){return{type:'reaction',category:'mentalAgility',categoryLabel:'Reaction Time',difficulty:1.0,question:'Tap as soon as the circle turns GREEN!',answer:'complete',options:[],explanation:'Tests your reaction speed.',visual:'custom'};},3);
  Q.registerRenderer('reaction',{
    render:function(q,idx){
      return '<div class="qcard" style="gap:10px">'+
        '<div class="category">⚡ Reaction Time</div>'+
        '<div class="question">Tap GREEN as fast as you can!</div>'+
        '<div id="react-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:8px 0">'+
          '<button id="react-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:14px 36px;font-family:Nunito,sans-serif;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button>'+
        '</div>'+
        '<div class="react-zone" id="react-zone-'+idx+'" style="display:none">'+
          '<div class="react-circle" id="react-circle-'+idx+'">Wait...</div>'+
        '</div>'+
        '<div class="react-result" id="react-result-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'">'+q.explanation+'</div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var readyWrap=slideEl.querySelector('#react-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#react-ready-'+idx),zone=slideEl.querySelector('#react-zone-'+idx),circle=slideEl.querySelector('#react-circle-'+idx),result=slideEl.querySelector('#react-result-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!circle)return;
      var state='idle',goTime=0,timer=null,done=false;
      readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';zone.style.display='flex';state='waiting';ctx.answerStartRef.set(Date.now());var delay=1500+Math.random()*2500;timer=setTimeout(function(){if(done)return;state='go';goTime=Date.now();H.nudge&&H.nudge();circle.classList.add('react-go');circle.textContent='TAP!';},delay);});
      circle.addEventListener('click',function(){
        if(done||state==='idle')return;
        if(state==='waiting'){done=true;clearTimeout(timer);H.error&&H.error();circle.classList.add('react-fail');circle.textContent='Too early!';result.textContent='Wait for green next time';result.style.color='var(--red)';finish(false,0);}
        else if(state==='go'){done=true;var rms=Date.now()-goTime,good=rms<400,great=rms<250;H.reactionTap&&H.reactionTap();circle.classList.remove('react-go');circle.classList.add(good?'react-success':'react-slow');circle.textContent=rms+'ms';result.textContent=great?'Lightning fast! ⚡':good?'Nice reflexes!':'A bit slow, try again!';result.style.color=good?'var(--green)':'var(--gold)';finish(good,rms);}
      });
      function finish(won,ms){var totalMs=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,totalMs);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('reaction');if(ctx.onAnswer)ctx.onAnswer(won,totalMs);if(won){setTimeout(function(){ms<250?(H.streak&&H.streak()):(H.success&&H.success());},120);ctx.flashEl.className='flash green show';ctx.spawnConfetti(ms<250?20:8);}else{ctx.flashEl.className='flash red show';}setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=ms>0?'Your reaction: '+ms+'ms. Average is ~250ms.':'Patience is key!';expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    }
  });
})();

// ── Word Scramble ─────────────────────────────────────────────────────────────
(function () {
  var WORDS={easy:[{w:'BRAIN',h:'Think with it'},{w:'SMART',h:'Opposite of dumb'},{w:'LIGHT',h:'Turn it on'},{w:'QUICK',h:'Very fast'},{w:'HEART',h:'Beats in your chest'},{w:'DREAM',h:'Happens when you sleep'},{w:'OCEAN',h:'Big body of water'},{w:'HAPPY',h:'Feeling of joy'},{w:'MUSIC',h:'Melody and rhythm'},{w:'DANCE',h:'Move to the beat'},{w:'TIGER',h:'Striped big cat'},{w:'GRAPE',h:'Small purple fruit'},{w:'STORM',h:'Thunder and lightning'},{w:'RIVER',h:'Flowing water'},{w:'CANDY',h:'Sweet treat'}],medium:[{w:'PUZZLE',h:'Brain teaser'},{w:'GENIUS',h:'Very smart person'},{w:'ROCKET',h:'Goes to space'},{w:'FROZEN',h:'Turned to ice'},{w:'MYSTIC',h:'Mysterious'},{w:'BRIDGE',h:'Crosses a gap'},{w:'JUNGLE',h:'Dense forest'},{w:'GALAXY',h:'Stars and planets'},{w:'TROPHY',h:'Winner gets one'},{w:'ZOMBIE',h:'Undead creature'},{w:'KNIGHT',h:'Medieval warrior'},{w:'WHISPER',h:'Speak very softly'}],hard:[{w:'QUANTUM',h:'Physics of the very small'},{w:'PARADOX',h:'Contradicts itself'},{w:'PHOENIX',h:'Rises from ashes'},{w:'ECLIPSE',h:'Sun or moon blocked'},{w:'ALCHEMY',h:'Medieval chemistry'},{w:'TSUNAMI',h:'Giant ocean wave'},{w:'CRYPTIC',h:'Hard to understand'},{w:'LABYRINTH',h:'Complex maze'},{w:'SYMPHONY',h:'Orchestral composition'}]};
  Q.register('wordScramble',function(){var tier=['easy','medium','hard'][Q.rand(0,2)],item=Q.pick(WORDS[tier]),word=item.w,sc;do{sc=Q.shuffle(word.split('')).join('');}while(sc===word);return{type:'wordScramble',category:'verbalReasoning',categoryLabel:'Word Scramble',difficulty:{easy:0.7,medium:1.1,hard:1.5}[tier],question:'Unscramble the word!',scrambled:sc,word:word,hint:item.h,answer:word,options:[],explanation:'Hint: '+item.h,visual:'custom'};},4);
  Q.registerRenderer('wordScramble',{
    render:function(q,idx){
      var srct='',anst='';
      for(var i=0;i<q.scrambled.length;i++)srct+='<button class="ws-tile ws-src" data-wi="'+idx+'" data-wc="'+i+'" data-wl="'+q.scrambled[i]+'">'+q.scrambled[i]+'</button>';
      for(var j=0;j<q.word.length;j++)anst+='<div class="ws-tile ws-slot" data-wi="'+idx+'" data-ws="'+j+'"></div>';
      return '<div class="qcard" style="gap:10px"><div class="category">🔤 Word Scramble</div><div class="question">'+q.question+'</div><div class="ws-hint" id="ws-hint-'+idx+'">💡 '+q.hint+'</div><div class="ws-answer" id="ws-answer-'+idx+'">'+anst+'</div><div class="ws-source" id="ws-source-'+idx+'">'+srct+'</div><div class="ws-status" id="ws-status-'+idx+'"></div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div><div class="branding">cebear.com</div></div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var sourceEl=slideEl.querySelector('#ws-source-'+idx),answerEl=slideEl.querySelector('#ws-answer-'+idx),statusEl=slideEl.querySelector('#ws-status-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!sourceEl)return;
      var placed=[],done=false,slots=answerEl.querySelectorAll('.ws-slot');
      sourceEl.addEventListener('click',function(e){
        var btn=e.target.closest('.ws-src');if(!btn||done||btn.classList.contains('ws-used'))return;
        H.tilePop&&H.tilePop();btn.classList.add('ws-used');var letter=btn.dataset.wl;placed.push({letter:letter,btn:btn});slots[placed.length-1].textContent=letter;slots[placed.length-1].classList.add('ws-filled');
        if(placed.length===q.word.length){var attempt=placed.map(function(p){return p.letter;}).join('');if(attempt===q.word){finish(true);}else{H.wordleWrong&&H.wordleWrong();answerEl.classList.add('ws-shake');statusEl.textContent='Not quite! Try again.';statusEl.style.color='var(--red)';setTimeout(function(){answerEl.classList.remove('ws-shake');placed.forEach(function(p){p.btn.classList.remove('ws-used');});slots.forEach(function(s){s.textContent='';s.classList.remove('ws-filled');});placed=[];statusEl.textContent='';},700);}}
      });
      answerEl.addEventListener('click',function(e){var slot=e.target.closest('.ws-slot');if(!slot||done||!slot.classList.contains('ws-filled'))return;H.light&&H.light();var si=Array.from(slots).indexOf(slot);while(placed.length>si){var p=placed.pop();p.btn.classList.remove('ws-used');slots[placed.length].textContent='';slots[placed.length].classList.remove('ws-filled');}});
      function finish(won){done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('wordScramble');if(ctx.onAnswer)ctx.onAnswer(won,ms);H.success&&H.success();slots.forEach(function(s){s.classList.add('ws-correct');});statusEl.textContent='Nice! 🎉';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);setTimeout(function(){ctx.flashEl.className='flash';},350);var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=q.word+' — '+q.hint;expEl.classList.add('show');}ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());}
    }
  });
})();

// ── Slide Puzzle ──────────────────────────────────────────────────────────────
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

// ── Color Sort ────────────────────────────────────────────────────────────────
(function () {
  var PALETTES=[{name:'Rainbow',colors:['#FF0000','#FF7700','#FFDD00','#00CC44','#0066FF','#8833FF'],labels:['Red','Orange','Yellow','Green','Blue','Purple']},{name:'Warm\u2192Cool',colors:['#FF2200','#FF6600','#FFAA00','#44BBFF','#2266FF','#1133AA'],labels:['Hot Red','Orange','Warm','Sky','Blue','Deep Blue']},{name:'Light\u2192Dark',colors:['#FFFFFF','#CCCCCC','#999999','#666666','#333333','#111111'],labels:['White','Light','Silver','Gray','Dark','Black']}];
  Q.register('colorSort',function(){var size=Q.rand(0,1),pal=Q.pick(PALETTES),count=size===0?4:6,correct=pal.colors.slice(0,count),labels=pal.labels.slice(0,count),scrambled=Q.shuffle(correct.map(function(c,i){return{color:c,label:labels[i],idx:i};}));return{type:'colorSort',category:'patternRecognition',categoryLabel:'Color Sort',difficulty:size===0?0.7:1.1,question:'Sort '+pal.name+' in order!',scrambled:scrambled,correctOrder:correct,answer:'complete',options:[],explanation:'Visual pattern recognition.',visual:'custom'};},3);
  Q.registerRenderer('colorSort',{
    render:function(q,idx){
      var tiles='';
      for(var i=0;i<q.scrambled.length;i++){
        var s=q.scrambled[i];
        var lightColors=['#FFFFFF','#CCCCCC','#FFDD00','#FFAA00','#44BBFF','#FF7700'];
        var tc=lightColors.indexOf(s.color)!==-1?'#333':'#fff';
        var bs=s.color==='#FFFFFF'?'border:2px solid #999;':'';
        tiles+='<button class="csort-tile" data-orig-idx="'+s.idx+'" style="background:'+s.color+';color:'+tc+';'+bs+'">'+s.label+'</button>';
      }
      return '<div class="qcard" style="gap:10px"><div class="category">\uD83C\uDFA8 Color Sort</div><div class="question">'+q.question+'</div><div class="csort-status" id="csort-status-'+idx+'">Tap colors in order (1st \u2192 last)</div><div class="csort-placed" id="csort-placed-'+idx+'"></div><div class="csort-pool" id="csort-pool-'+idx+'">'+tiles+'</div><div id="wa-'+idx+'"></div><div class="explanation" id="exp-'+idx+'"></div><div class="branding">cebear.com</div></div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var pool=slideEl.querySelector('#csort-pool-'+idx),placed=slideEl.querySelector('#csort-placed-'+idx),statusEl=slideEl.querySelector('#csort-status-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!pool)return;var placedOrder=[],done=false;
      pool.addEventListener('click',function(e){
        var btn=e.target.closest('.csort-tile');if(!btn||done||btn.classList.contains('csort-used'))return;
        H.medium&&H.medium();btn.classList.add('csort-used');
        var oi=parseInt(btn.dataset.origIdx);placedOrder.push(oi);
        var div=document.createElement('div');div.className='csort-placed-tile';div.style.background=btn.style.background;
        if(btn.style.background==='rgb(255, 255, 255)')div.style.border='2px solid #999';
        placed.appendChild(div);statusEl.textContent=placedOrder.length+'/'+q.correctOrder.length+' placed';
        if(placedOrder.length===q.correctOrder.length){var won=true;for(var k=0;k<placedOrder.length;k++)if(placedOrder[k]!==k){won=false;break;}finish(won);}
      });
      function finish(won){
        done=true;var ms=Date.now()-ctx.answerStartRef.get(),data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){H.success&&H.success();statusEl.textContent='Perfect!';statusEl.style.color='var(--green)';ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}
        else{H.error&&H.error();statusEl.textContent='Wrong order!';statusEl.style.color='var(--red)';ctx.flashEl.className='flash red show';}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        var expEl=slideEl.querySelector('#exp-'+idx);
        if(expEl){var sl=q.scrambled.slice().sort(function(a,b){return a.idx-b.idx;}).map(function(s){return s.label;});expEl.textContent=won?'Colors sorted correctly!':'Correct: '+sl.join(' \u2192 ');expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Math Rush ─────────────────────────────────────────────────────────────────
(function () {
  Q.register('mathRush',function(){var eqs=[];for(var i=0;i<5;i++){var a=Q.rand(2,20),b=Q.rand(2,20),op=['+','-','\xD7'][Q.rand(0,2)],real;if(op==='+')real=a+b;else if(op==='-'){if(a<b){var t=a;a=b;b=t;}real=a-b;}else real=a*b;var isTrue=Math.random()>0.4,shown=isTrue?real:real+(Q.rand(0,1)?Q.rand(1,5):-Q.rand(1,5));if(shown===real)isTrue=true;eqs.push({text:a+' '+op+' '+b+' = '+shown,correct:isTrue});}return{type:'mathRush',category:'mentalAgility',categoryLabel:'Math Rush',difficulty:1.0,question:'True or False? (5 rounds, 5s each!)',equations:eqs,answer:'complete',options:[],explanation:'Speed + accuracy = brain power.',visual:'custom'};},3);
  Q.registerRenderer('mathRush',{
    render:function(q,idx){
      return '<div class="qcard" style="gap:8px">'+
        '<div class="category">\uD83C\uDFC3 Math Rush</div>'+
        '<div class="question">True or False?</div>'+
        '<div class="mr-timer" id="mr-timer-'+idx+'"></div>'+
        '<div class="mr-eq" id="mr-eq-'+idx+'">Get ready...</div>'+
        '<div class="mr-btns" id="mr-btns-'+idx+'" style="display:none">'+
          '<button class="mr-btn mr-true" data-rv="true">\u2713 True</button>'+
          '<button class="mr-btn mr-false" data-rv="false">\u2717 False</button>'+
        '</div>'+
        '<div id="mr-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:6px 0">'+
          '<button id="mr-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button>'+
        '</div>'+
        '<div class="mr-score" id="mr-score-'+idx+'"></div>'+
        '<div class="mr-progress" id="mr-progress-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach:function(slideEl,q,idx,ctx){
      var eqEl=slideEl.querySelector('#mr-eq-'+idx),scoreEl=slideEl.querySelector('#mr-score-'+idx),timerEl=slideEl.querySelector('#mr-timer-'+idx),btnsEl=slideEl.querySelector('#mr-btns-'+idx),progressEl=slideEl.querySelector('#mr-progress-'+idx),readyWrap=slideEl.querySelector('#mr-ready-wrap-'+idx),readyBtn=slideEl.querySelector('#mr-ready-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!eqEl)return;
      var round=0,score=0,done=false,roundTimer=null,tickTimer=null,lastTickSecond=-1;
      readyBtn.addEventListener('click',function(){H.medium&&H.medium();readyWrap.style.display='none';btnsEl.style.display='flex';ctx.answerStartRef.set(Date.now());showRound();});
      function showRound(){
        if(round>=q.equations.length){finish();return;}
        eqEl.textContent=q.equations[round].text;eqEl.className='mr-eq';
        var dots='';for(var i=0;i<q.equations.length;i++)dots+='<span class="mr-dot'+(i<round?' mr-dot-done':i===round?' mr-dot-active':'')+'"></span>';
        progressEl.innerHTML=dots;var timeLeft=5.0;lastTickSecond=5;timerEl.textContent='5.0s';timerEl.style.color='var(--cream)';clearInterval(roundTimer);clearInterval(tickTimer);
        roundTimer=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){clearInterval(roundTimer);H.warning&&H.warning();eqEl.classList.add('mr-wrong');round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);}else{timerEl.textContent=timeLeft.toFixed(1)+'s';var cs=Math.ceil(timeLeft);if(cs!==lastTickSecond){lastTickSecond=cs;if(timeLeft<=2){H.warning&&H.warning();timerEl.style.color='var(--red)';}else{H.light&&H.light();}}}},100);
      }
      btnsEl.addEventListener('click',function(e){var btn=e.target.closest('.mr-btn');if(!btn||done)return;clearInterval(roundTimer);clearInterval(tickTimer);var ans=btn.dataset.rv==='true',correct=q.equations[round].correct===ans;if(correct){H.medium&&H.medium();score++;eqEl.classList.add('mr-correct');}else{H.error&&H.error();eqEl.classList.add('mr-wrong');}round++;scoreEl.textContent=score+'/'+q.equations.length;setTimeout(showRound,500);});
      function finish(){
        done=true;clearInterval(roundTimer);clearInterval(tickTimer);
        var ms=Date.now()-ctx.answerStartRef.get(),won=score>=3,perfect=score===q.equations.length,data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.notifyGamePlayed)ctx.notifyGamePlayed('mathRush');if(ctx.onAnswer)ctx.onAnswer(won,ms);
        eqEl.textContent=score+'/'+q.equations.length+(perfect?' Perfect!':won?' Nice!':' Try harder!');eqEl.className='mr-eq '+(won?'mr-correct':'mr-wrong');timerEl.textContent='';btnsEl.style.display='none';
        if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?22:10);}else{H.error&&H.error();ctx.flashEl.className='flash red show';}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        var expEl=slideEl.querySelector('#exp-'+idx);if(expEl){expEl.textContent=perfect?'Flawless! \uD83D\uDD25':score+' correct. Speed and accuracy!';expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }
    }
  });
})();

// ── Odd Tile Out ──────────────────────────────────────────────────────────────
(function () {
  function hslToStr(h,s,l){return'hsl('+h+','+s+'%,'+l+'%)';}
  function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

  var LEVELS=[
    // [gridSize, hueDiff, satDiff, lightDiff, difficulty]
    {g:3,hd:40,sd:0,ld:0,d:0.5},
    {g:3,hd:25,sd:0,ld:0,d:0.7},
    {g:4,hd:20,sd:0,ld:0,d:0.9},
    {g:4,hd:12,sd:0,ld:0,d:1.1},
    {g:4,hd:0,sd:0,ld:14,d:1.2},
    {g:5,hd:10,sd:0,ld:0,d:1.3},
    {g:5,hd:0,sd:0,ld:10,d:1.4},
    {g:5,hd:7,sd:0,ld:0,d:1.6},
    {g:5,hd:0,sd:0,ld:7,d:1.7},
    {g:6,hd:6,sd:0,ld:0,d:1.9},
  ];

  Q.register('oddTileOut', function () {
    var lv=LEVELS[randInt(0,LEVELS.length-1)];
    var g=lv.g, total=g*g;
    var baseH=randInt(0,359), baseS=randInt(55,80), baseL=randInt(40,65);
    // odd tile gets a shifted hue/lightness
    var oddH=(baseH+(lv.hd||0)+360)%360;
    var oddL=baseL+(lv.ld||0);
    var oddIdx=randInt(0,total-1);
    var tiles=[];
    for(var i=0;i<total;i++){
      tiles.push(i===oddIdx?hslToStr(oddH,baseS,oddL):hslToStr(baseH,baseS,baseL));
    }
    return {
      type:'oddTileOut',category:'patternRecognition',categoryLabel:'Odd Tile Out',
      difficulty:lv.d,question:'Find the different tile!',
      tiles:tiles,oddIdx:oddIdx,gridSize:g,
      answer:'complete',options:[],explanation:'Color perception & visual attention.',visual:'custom'
    };
  }, 4);

  Q.registerRenderer('oddTileOut', {
    render: function(q, idx) {
      return '<div class="qcard" style="gap:8px">'+
        '<div class="category">🎨 Odd Tile Out</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div class="oto-rounds" id="oto-rounds-'+idx+'">'+
          '<span class="oto-dot oto-dot-active"></span>'+
          '<span class="oto-dot"></span>'+
          '<span class="oto-dot"></span>'+
        '</div>'+
        '<div id="oto-grid-wrap-'+idx+'"></div>'+
        '<div class="oto-status" id="oto-status-'+idx+'"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var wrap=slideEl.querySelector('#oto-grid-wrap-'+idx),statusEl=slideEl.querySelector('#oto-status-'+idx),H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!wrap)return;

      var TOTAL_ROUNDS=3,round=0,score=0,done=false;

      function makePuzzle(){
        var lv=LEVELS[randInt(0,LEVELS.length-1)];
        var g=lv.g,total=g*g;
        var baseH=randInt(0,359),baseS=randInt(55,80),baseL=randInt(40,65);
        var oddH=(baseH+(lv.hd||0)+360)%360,oddL=baseL+(lv.ld||0);
        var oddIdx=randInt(0,total-1),tiles=[];
        for(var i=0;i<total;i++)tiles.push(i===oddIdx?hslToStr(oddH,baseS,oddL):hslToStr(baseH,baseS,baseL));
        return{g:g,tiles:tiles,oddIdx:oddIdx,d:lv.d};
      }

      function updateDots(){
        var dots=slideEl.querySelectorAll('.oto-dot');
        dots.forEach(function(d,i){
          d.className='oto-dot'+(i<round?' oto-dot-done':i===round?' oto-dot-active':'');
        });
      }

      function showRound(){
        var p=makePuzzle();
        var size='clamp('+Math.floor(240/p.g)+'px,'+Math.floor(56/p.g)+'vw,'+Math.floor(290/p.g)+'px)';
        var cells='';
        for(var i=0;i<p.tiles.length;i++)
          cells+='<button class="oto-tile" data-oi="'+idx+'" data-oc="'+i+'" data-odd="'+p.oddIdx+'" style="background:'+p.tiles[i]+';width:'+size+';height:'+size+'"></button>';
        wrap.innerHTML='<div class="oto-grid" style="grid-template-columns:repeat('+p.g+',1fr)">'+cells+'</div>';
        statusEl.textContent='';statusEl.style.color='';
        updateDots();

        wrap.querySelector('.oto-grid').addEventListener('click',function(e){
          var btn=e.target.closest('.oto-tile');if(!btn||done)return;
          var tapped=parseInt(btn.dataset.oc),oddI=parseInt(btn.dataset.odd),won=tapped===oddI;
          var tiles=wrap.querySelectorAll('.oto-tile');
          tiles[oddI].classList.add('oto-correct');
          if(!won){H.error&&H.error();btn.classList.add('oto-wrong');}
          else{H.medium&&H.medium();score++;}
          statusEl.textContent=won?'✓ Got it!':'✗ Missed';
          statusEl.style.color=won?'var(--green)':'var(--red)';
          round++;
          if(round>=TOTAL_ROUNDS){
            setTimeout(function(){finish();},600);
          }else{
            setTimeout(function(){showRound();},700);
          }
        },{once:true});
      }

      function finish(){
        done=true;
        var won=score>=2,perfect=score===TOTAL_ROUNDS;
        var ms=Date.now()-ctx.answerStartRef.get();
        var data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){perfect?(H.streak&&H.streak()):(H.success&&H.success());ctx.flashEl.className='flash green show';ctx.spawnConfetti(perfect?20:10);}
        else{H.error&&H.error();ctx.flashEl.className='flash red show';}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        statusEl.textContent=perfect?'Perfect! 3/3 🎯':won?score+'/3 — Nice!':score+'/3 — Keep training!';
        statusEl.style.color=won?'var(--green)':'var(--red)';
        var expEl=slideEl.querySelector('#exp-'+idx);
        if(expEl){expEl.textContent=perfect?'Flawless color vision!':'Spotted '+score+' of 3 odd tiles.';expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      }

      showRound();
    }
  });
})();

// ── Stop the Clock ────────────────────────────────────────────────────────────
(function () {
  var TARGETS=[
    {label:'12 o\'clock',angle:0,d:0.6},
    {label:'3 o\'clock',angle:90,d:0.6},
    {label:'6 o\'clock',angle:180,d:0.6},
    {label:'9 o\'clock',angle:270,d:0.6},
    {label:'the red zone',angle:null,d:0.8},
    {label:'the red zone',angle:null,d:1.0},
    {label:'the red zone',angle:null,d:1.2},
    {label:'the red zone',angle:null,d:1.5},
  ];

  Q.register('stopClock', function () {
    var useZone=Q.rand(0,1)===1;
    var targetAngle=useZone?Q.rand(0,359):TARGETS[Q.rand(0,3)].angle;
    var zoneSize=useZone?[30,22,16,12][Q.rand(0,3)]:null;
    var speed=[1.5,2,2.5,3][Q.rand(0,3)]; // seconds per revolution
    var d=useZone?(zoneSize<=16?1.5:zoneSize<=22?1.2:0.9):0.6;
    return {
      type:'stopClock',category:'mentalAgility',categoryLabel:'Stop the Clock',
      difficulty:d,question:'Tap to stop the needle '+(useZone?'in the red zone!':'at '+TARGETS[Q.rand(0,3)].label+'!'),
      targetAngle:targetAngle,zoneSize:zoneSize,speed:speed,useZone:useZone,
      answer:'complete',options:[],explanation:'Timing and precision.',visual:'custom'
    };
  }, 3);

  Q.registerRenderer('stopClock', {
    render: function(q, idx) {
      return '<div class="qcard" style="gap:10px">'+
        '<div class="category">⏱ Stop the Clock</div>'+
        '<div class="question">'+q.question+'</div>'+
        '<div id="stc-ready-wrap-'+idx+'" style="display:flex;justify-content:center;margin:4px 0">'+
          '<button id="stc-ready-'+idx+'" style="background:var(--gold);color:#2a1800;border:none;border-radius:14px;padding:12px 32px;font-family:Nunito,sans-serif;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 4px 0 var(--goldd);">Tap to Start!</button>'+
        '</div>'+
        '<canvas id="stc-canvas-'+idx+'" width="220" height="220" style="display:none;border-radius:50%;cursor:pointer;touch-action:manipulation"></canvas>'+
        '<div class="stc-result" id="stc-result-'+idx+'" style="font-size:15px;font-weight:800;text-align:center;min-height:22px;color:var(--cream)"></div>'+
        '<div id="wa-'+idx+'"></div>'+
        '<div class="explanation" id="exp-'+idx+'"></div>'+
        '<div class="branding">cebear.com</div>'+
        '</div>';
    },
    attach: function(slideEl, q, idx, ctx) {
      var readyWrap=slideEl.querySelector('#stc-ready-wrap-'+idx);
      var readyBtn=slideEl.querySelector('#stc-ready-'+idx);
      var canvas=slideEl.querySelector('#stc-canvas-'+idx);
      var resultEl=slideEl.querySelector('#stc-result-'+idx);
      var H=ctx.Haptics||{};
      var actEl=slideEl.querySelector('#wa-'+idx);if(actEl&&ctx.addShareBtn)ctx.addShareBtn(actEl,q);
      if(!canvas)return;

      var cx=canvas.getContext('2d');
      var angle=0, raf=null, done=false, running=false;
      var degreesPerMs=360/(q.speed*1000);
      var lastTime=null;

      // target zone setup
      var targetAngle=q.targetAngle!=null?q.targetAngle:Q.rand(0,359);
      var zoneSize=q.zoneSize||25;
      var zoneStart=(targetAngle-zoneSize/2+360)%360;
      var zoneEnd=(targetAngle+zoneSize/2)%360;

      function drawClock(a){
        var W=220,R=100,cx2=W/2,cy2=W/2;
        cx.clearRect(0,0,W,W);
        // face
        cx.beginPath();cx.arc(cx2,cy2,R,0,Math.PI*2);
        cx.fillStyle='rgba(240,234,214,0.08)';cx.fill();
        cx.strokeStyle='rgba(240,234,214,0.2)';cx.lineWidth=2;cx.stroke();
        // red zone if useZone
        if(q.useZone){
          var s2=(zoneStart-90)*Math.PI/180,e2=(zoneEnd-90)*Math.PI/180;
          // handle wrap-around
          if(zoneEnd<zoneStart)e2+=(Math.PI*2);
          cx.beginPath();cx.moveTo(cx2,cy2);
          cx.arc(cx2,cy2,R,s2,e2);cx.closePath();
          cx.fillStyle='rgba(232,68,58,0.35)';cx.fill();
          cx.strokeStyle='rgba(232,68,58,0.7)';cx.lineWidth=1.5;cx.stroke();
        }else{
          // tick marks at target
          var ta=(targetAngle-90)*Math.PI/180;
          cx.beginPath();
          cx.moveTo(cx2+Math.cos(ta)*85,cy2+Math.sin(ta)*85);
          cx.lineTo(cx2+Math.cos(ta)*100,cy2+Math.sin(ta)*100);
          cx.strokeStyle='var(--green)';cx.lineWidth=3;cx.stroke();
        }
        // hour ticks
        for(var i=0;i<12;i++){
          var ta2=(i*30-90)*Math.PI/180;
          cx.beginPath();
          cx.moveTo(cx2+Math.cos(ta2)*88,cy2+Math.sin(ta2)*88);
          cx.lineTo(cx2+Math.cos(ta2)*98,cy2+Math.sin(ta2)*98);
          cx.strokeStyle='rgba(240,234,214,0.3)';cx.lineWidth=1.5;cx.stroke();
        }
        // needle
        var ra=(a-90)*Math.PI/180;
        cx.beginPath();cx.moveTo(cx2,cy2);
        cx.lineTo(cx2+Math.cos(ra)*78,cy2+Math.sin(ra)*78);
        cx.strokeStyle='var(--cream)';cx.lineWidth=3;cx.lineCap='round';cx.stroke();
        // center dot
        cx.beginPath();cx.arc(cx2,cy2,5,0,Math.PI*2);cx.fillStyle='var(--gold)';cx.fill();
      }

      function loop(ts){
        if(!running||done)return;
        if(lastTime)angle=(angle+degreesPerMs*(ts-lastTime))%360;
        lastTime=ts;
        drawClock(angle);
        raf=requestAnimationFrame(loop);
      }

      readyBtn.addEventListener('click',function(){
        H.medium&&H.medium();
        readyWrap.style.display='none';
        canvas.style.display='block';
        running=true;lastTime=null;
        ctx.answerStartRef.set(Date.now());
        raf=requestAnimationFrame(loop);
      });

      canvas.addEventListener('click',function(){
        if(!running||done)return;
        done=true;running=false;
        cancelAnimationFrame(raf);
        drawClock(angle);
        // score: how far from target
        var diff=Math.abs(angle-targetAngle);
        if(diff>180)diff=360-diff;
        var won,msg;
        if(q.useZone){
          // check if angle is in zone
          var inZone=false;
          if(zoneEnd>zoneStart){inZone=angle>=zoneStart&&angle<=zoneEnd;}
          else{inZone=angle>=zoneStart||angle<=zoneEnd;}
          won=inZone;
          msg=won?'In the zone! ✅':'Missed by '+(diff.toFixed(0))+'°';
        }else{
          won=diff<=15;
          msg=won?'Nailed it! ✅':'Off by '+(diff.toFixed(0))+'°';
        }
        var ms=Date.now()-ctx.answerStartRef.get();
        var data=ctx.IQData.recordAnswer(q.category,won,q.difficulty,ms);
        if(ctx.onAnswer)ctx.onAnswer(won,ms);
        if(won){H.success&&H.success();ctx.flashEl.className='flash green show';ctx.spawnConfetti(14);}
        else{H.error&&H.error();ctx.flashEl.className='flash red show';}
        setTimeout(function(){ctx.flashEl.className='flash';},350);
        resultEl.textContent=msg;
        resultEl.style.color=won?'var(--green)':'var(--red)';
        var expEl=slideEl.querySelector('#exp-'+idx);
        if(expEl){expEl.textContent=won?'Perfect timing!':'Off by '+diff.toFixed(0)+'°. Target was '+(q.useZone?'the red zone':targetAngle+'°')+'.';expEl.classList.add('show');}
        ctx.updateUI(data);ctx.checkMore();ctx.answerStartRef.set(Date.now());
      });
    }
  });
})();