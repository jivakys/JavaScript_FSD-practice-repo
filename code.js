// ........ CALLBACK Function................
// Definition: A callback is a function that is passed as an argument to another function
//             and is executed after the completion of an asynchronous operation.

function callfetchData(callback) {
  // Simulating an asynchronous operation
  setTimeout(() => {
    const data = "Async data";
    callback(data);
  }, 1000);
}

callfetchData((result) => {
  console.log(result);
});

// ....... PROMISE..........

function profetchData() {
  return new Promise((resolve, reject) => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      const data = "Async data";
      resolve(data);
      // or reject("Error occurred");
    }, 1000);
  });
}

profetchData()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
