function randomFunc() {
  var obj1 = { name: "Vivian", age: 45 };

  return function () {
    console.log(obj1.name + " is " + "awesome");
  };
}

var initialiseClosure = randomFunc();

initialiseClosure();
