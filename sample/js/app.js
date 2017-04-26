
/*  

*/
console.log(typeof EXMS);
let log = EXMS.logger.log;
EXMS.stacks = {name:'hi',fn:function(ctx){coznsole.log('module');
  ctx.on('event2', (data)=>{ console.log('Inside Hiiii', data);});
  log('returning from hi');
  return {
    init() {
      lxog('init!')
      log(ctx.el.id);
    },
    onmessage: {
      helloMSG(){
        log('another pattern');
        ctx.broadcast('anotherPatter',{data: 'another'});
      }
    }
  };
},type:'modules'};
EXMS.stacks = {name:'msg',fn:function(ctx){
  log('testing msg on return');
  return {
    init() {
      log('init!')
      log(ctx.el.id);
    },
    actions: ['menu','menu2'],
    messages: ['helloMSG','anotherPattern'],
    onmessage(name, data){
      log(name, data);
    }
  };
},type:'modules'};
EXMS.stacks = {name:'menu', fn: function(context){log('I am a behavior');}, type:'actions'};
EXMS.addAction('menu2',function(context){
  log('I am a behavior2 attached to', context.getElement().id);
  return {
    onclick(e){
      console.log(e, 'was clicked');
    }
  }

});
EXMS.stacks = {name:'list',fn:function(ctx){
  let msg = 'HI!!';
  window.ctx=ctx;
  let t = ctx.getService('time');
  console.log(t);
  console.log('module', ctx)
  let cfg = ctx.getConfig();
  ctx.on('event', (data)=>{ console.log('Inside CTX', msg, data, cfg);});
  return {
    onclick(event){
      console.log(event);
    }
  }
},type:'modules'};
EXMS.stacks = {name: 'date', fn: function(App){return new Date();}, type: 'services'};
EXMS.stacks = {name: 'time', fn: function(App){let dt = EApp.getService('date'); console.log(dt); return Date.now();}, type: 'services'};
EXMS.stacks = {name: 'datetime', fn: function(App){let dt = App.getService('date'); /*let t = App.getService('all')*/}, type: 'services'};
EXMS.stacks = {name: 'all', fn: function(App){let dt = App.getService('time'); let t = App.getService('alltime')}, type: 'services'};
EXMS.stacks = {name: 'alltime', fn: function(App){let dt = App.getService('time'); let t = App.getService('datetime')}, type: 'services'};
EXMS.cache = [];
function importModules (r) {
  r.keys().forEach(key => EXMS.cache.push({name:key, fn: r(key), type:'modules'}));
}

importModules(require.context('../modules/', true, /\.js$/));

EXMS.startModules();
