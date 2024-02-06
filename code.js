// ........ CALLBACK Function................
// Definition: A callback is a function that is passed as an argument to another function
//             and is executed after the completion of an asynchronous operation.

function fetchData(callback) {
  // Simulating an asynchronous operation
  setTimeout(() => {
    const data = "Async data";
    callback(data);
  }, 1000);
}

fetchData((result) => {
  console.log(result);
});
