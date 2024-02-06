var length = 10;
function fn() {
  console.log(this.length);
}

var obj = {
  length: 5,
  method: function (fn) {
    fn();
    arguments[0]();
  },
};

obj.method(fn, 1);

let a = 0;
function foo(x) {
  if (a == 0) {
    a++;
    return -x;
  } else {
    return x;
  }
}
const result1 = foo(foo(-5));
// const result2 = foo(foo(-5));
console.log("result1 = ", result1);
// console.log("result2 = ", result2);

// function-1
function reverseFunc(str) {
  let sentence = str.split(" ").reverse().join(" ");
  return sentence;
}

// function-2
// function reverseFunc(str) {
//   str = str.split(" ");
//   console.log("str==", str);
//   let arr = [];
//   for (let i = str.length; i >= 0; i--) {
//     arr.push(str[i]);
//   }
//   return arr.join(" ").trim();
// }

// // Test case
// const inputSentence = "This is a good day";
// const reversedOutput = reverseFunc(inputSentence);
// console.log(reversedOutput);

function huntAndHunting(str) {
  str = str.split(" ");

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "Hunt") {
      str[i] = "123";
    } else if (str[i] === "Hunting") {
      str[i] = "xyz";
    }
  }

  const newSentence = str.join(" ");
  return newSentence;
}

// // Test case
// const inputSentence = "Hunt in Hunting";
// const output = huntAndHunting(inputSentence);
// console.log(output);
