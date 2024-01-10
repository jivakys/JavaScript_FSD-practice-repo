// async function getdata() {
//   return await Promise.resolve("I made It");
// }
// const data = getdata();
// console.log(data);

function print1() {
  return console.log("Hello");
}
function print2(x) {
  return x;
}
console.log(print1() && print2(55));
