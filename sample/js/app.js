
/*  

*/
console.log(typeof EXMS);

EXMS.stacks = {name:'hi',fn:function(ctx){console.log('module');
  ctx.on('event2', (data)=>{ console.log('Inside Hiiii', data);})
},type:'modules'};
EXMS.stacks = {name:'list',fn:function(ctx){
  let msg = 'HI!!';
  window.ctx=ctx;
  console.log('module', ctx)
  ctx.on('event', (data)=>{ console.log('Inside CTX', msg, data);})
},type:'modules'};

EXMS.startModules();
