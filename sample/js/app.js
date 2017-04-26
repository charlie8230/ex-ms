
/*  

*/
console.log(typeof EXMS);
let log = EXMS.logger.log;
EXMS.addModule('hi',
function(ctx){console.log('module');
  ctx.on('event2', (data)=>{ console.log('Inside Hiiii', data);});
  log('returning from hi');
  return {
    init() {
      log('init!')
      log(ctx.el.id);
    },
    onmessage: {
      helloMSG(){
        log('another pattern');
        ctx.broadcast('anotherPatter',{data: 'another'});
      }
    }
  };
});
EXMS.addModule('msg',
function(ctx){
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
});
EXMS.addBehavior('menu', function(context){log('I am a behavior');});
EXMS.addBehavior('menu2',function(context){
  log('I am a behavior2 attached to', context.getElement().id);
  return {
    onclick(e){
      console.log(e, 'was clicked');
    }
  }
});
EXMS.addModule('list',function(ctx){
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
});
EXMS.addService('date',function(App){return new Date();});
EXMS.addService('time',function(App){let dt = App.getService('date'); console.log(dt); return Date.now();});
EXMS.addService('datetime',function(App){let dt = App.getService('date'); /*let t = App.getService('all')*/});
EXMS.addService('all',function(App){let dt = App.getService('time'); let t = App.getService('alltime')});
EXMS.addService('alltime',function(App){let dt = App.getService('time'); let t = App.getService('datetime')});
EXMS.cache = [];
function importModules (r) {
  r.keys().forEach(key => EXMS.cache.push({name:key, fn: r(key), type:'modules'}));
}

importModules(require.context('../modules/', true, /\.js$/));

EXMS.startModules();
