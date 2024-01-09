async function getdata() {
  return await Promise.resolve("I made It");
}
const data = getdata();
console.log(data);
