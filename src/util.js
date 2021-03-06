let shortid = require('shortid');
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
/*      Actually partial application of one parameter... may be extended to multiple params */
function basic_curry(fn) {
  return function(first) {
    return fn.bind(this,first);
  }
}
module.exports = {shortid, getQueryVariable, basic_curry};