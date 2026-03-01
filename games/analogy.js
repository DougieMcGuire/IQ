// games/analogy.js — Analogies ("X is to Y as...")
(function () {

  Q.register('analogy', function () {
    var items = [
      { a:'Hot',b:'Cold',c:'Up',d:'Down',why:'Opposites.',df:0.6 },
      { a:'Puppy',b:'Dog',c:'Kitten',d:'Cat',why:'Young to adult.',df:0.6 },
      { a:'Bird',b:'Nest',c:'Bee',d:'Hive',why:'Animal to home.',df:0.7 },
      { a:'Eye',b:'See',c:'Ear',d:'Hear',why:'Organ to function.',df:0.6 },
      { a:'Fish',b:'Swim',c:'Bird',d:'Fly',why:'Animal to movement.',df:0.6 },
      { a:'Pen',b:'Write',c:'Knife',d:'Cut',why:'Tool to action.',df:0.7 },
      { a:'Cow',b:'Milk',c:'Bee',d:'Honey',why:'Producer to product.',df:0.7 },
      { a:'Foot',b:'Shoe',c:'Hand',d:'Glove',why:'Body part to covering.',df:0.7 },
      { a:'Doctor',b:'Hospital',c:'Teacher',d:'School',why:'Worker to workplace.',df:0.7 },
      { a:'Finger',b:'Hand',c:'Toe',d:'Foot',why:'Part to whole.',df:0.6 },
      { a:'Seed',b:'Plant',c:'Egg',d:'Bird',why:'Beginning to grown form.',df:0.7 },
      { a:'Author',b:'Book',c:'Chef',d:'Meal',why:'Creator to creation.',df:1.0 },
      { a:'Day',b:'Night',c:'Summer',d:'Winter',why:'Opposites in pairs.',df:0.9 },
      { a:'Lock',b:'Key',c:'Question',d:'Answer',why:'Problem to solution.',df:1.0 },
      { a:'Leaf',b:'Tree',c:'Petal',d:'Flower',why:'Part to plant.',df:1.0 },
      { a:'Wheel',b:'Car',c:'Wing',d:'Plane',why:'Part to vehicle.',df:1.0 },
      { a:'Library',b:'Books',c:'Museum',d:'Art',why:'Building to contents.',df:1.0 },
      { a:'Carpenter',b:'Wood',c:'Sculptor',d:'Stone',why:'Craftsperson to material.',df:1.1 },
      { a:'Ship',b:'Harbor',c:'Plane',d:'Airport',why:'Vehicle to port.',df:1.0 },
      { a:'Violin',b:'Orchestra',c:'Soldier',d:'Army',why:'Individual to group.',df:1.1 },
      { a:'Telescope',b:'Stars',c:'Microscope',d:'Cells',why:'Tool to what it observes.',df:1.2 },
      { a:'Map',b:'Geography',c:'Clock',d:'Time',why:'Tool to what it measures.',df:1.3 },
      { a:'Pilot',b:'Sky',c:'Captain',d:'Sea',why:'Navigator to domain.',df:1.2 },
      { a:'Prologue',b:'Book',c:'Overture',d:'Opera',why:'Intro section to work.',df:1.5 },
      { a:'Cartographer',b:'Maps',c:'Lexicographer',d:'Dictionaries',why:'Specialist to creation.',df:1.6 },
      { a:'Petal',b:'Flower',c:'Spoke',d:'Wheel',why:'Radiating part to circular whole.',df:1.4 },
      { a:'Archipelago',b:'Islands',c:'Constellation',d:'Stars',why:'Group name to components.',df:1.7 },
    ];
    var i = Q.pick(items);
    var wrong = items.filter(function(x){ return x.d !== i.d; }).map(function(x){ return x.d; });
    return {
      type:'analogy', category:'verbalReasoning', categoryLabel:'Analogy',
      difficulty:i.df||1.1, question:i.a+' is to '+i.b+', as '+i.c+' is to _____',
      answer:i.d, options:Q.shuffle([i.d].concat(Q.shuffle(wrong).slice(0,3))),
      explanation:i.why, visual:'text'
    };
  }, 4);

})();