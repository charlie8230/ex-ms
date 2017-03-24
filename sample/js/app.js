
/*  

*/
console.log(typeof EXMS);
let log = EXMS.logger.log;
EXMS.stacks = {name:'hi',fn:function(ctx){console.log('module');
  ctx.on('event2', (data)=>{ console.log('Inside Hiiii', data);});
  log('returning from hi');
  return {
    init() {
      log('init!')
      log(ctx.el.id);
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
    messages: ['helloMSG'],
    onmessage(name, data){
      log(name, data);
    }
  };
},type:'modules'};
EXMS.stacks = {name:'list',fn:function(ctx){
  let msg = 'HI!!';
  window.ctx=ctx;
  let t = ctx.getService('time');
  console.log(t);
  console.log('module', ctx)
  ctx.on('event', (data)=>{ console.log('Inside CTX', msg, data);})
},type:'modules'};
EXMS.stacks = {name: 'date', fn: function(App){return new Date();}, type: 'services'};
EXMS.stacks = {name: 'time', fn: function(App){let dt = App.getService('date'); console.log(dt); return Date.now();}, type: 'services'};
EXMS.stacks = {name: 'datetime', fn: function(App){let dt = App.getService('date'); /*let t = App.getService('all')*/}, type: 'services'};
EXMS.stacks = {name: 'all', fn: function(App){let dt = App.getService('time'); let t = App.getService('alltime')}, type: 'services'};
EXMS.stacks = {name: 'alltime', fn: function(App){let dt = App.getService('time'); let t = App.getService('datetime')}, type: 'services'};
EXMS.startModules();
