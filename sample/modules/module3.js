module.exports = function add(context){
  console.log('this is module 3', context._id);
  return {
    a: context._id
  };
};