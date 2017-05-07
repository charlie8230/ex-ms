// Context is passed on to the module factory functions
let {emitterAPI} = require('./events');
let {logger, debugMode}  = require('./logger');

function Context (elem, App, util){
    let id = elem.id || '',
        shortid = util.shortid.generate(),
        _id = id || shortid;
    this.el = this.elem = elem;
    this._id = _id;
    this.el.id = `module-${this._id}`;
    this.el.dataset._id = _id;
    this.status = 'created';
    /*  Needs to be abstracted out of App */  
    this.getService = App.getService.bind(App);
    //  this.getSubModule = App.asSubModule.bind(App);
    this.getGlobal = App.getGlobal.bind(App);
}

Context.prototype = Object.assign(Context.prototype,emitterAPI,{
  getElement(){
    return this.el;
  },
  getConfig(item=null){
    let children = this.el.children;
    let config = null;
    try {
      [].forEach.call(children,elem=>{
        if(!config && elem.type=="text/x-config") {
          config = JSON.parse(elem.innerHTML);
        }
      });
    } catch(e) {
      logger.log('Could not Parse config');
    }
    if (item && config) {
      if (item in config) {
        return config[item];
      }
      return false;
    }

    return config||{};
  },
  destroy(){
    this.el = null;
    this.status = null;
  }
});


module.exports = Context;
