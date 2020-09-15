
exports.longDate = function (){
let today = new Date();
const options = {
  weekday:'long',
  month:'long',
  day:'numeric'
}
 return today.toLocaleDateString("en-US",options);
}
exports.shortDate = function (){
let today = new Date();
const options = {
  weekday:'long'
}
return today.toLocaleDateString("en-US",options);
}
console.log(module.exports);
