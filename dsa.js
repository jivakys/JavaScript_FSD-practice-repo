// palindrom
let num = 13;
let count = 0;
for (let i = 1; i <= num; i++) {
  if (num % i == 0) {
    count++;
  }
}
if (count == 2) {
  console.log("it is prime");
} else {
  console.log("it is not prime");
}

for (let i = str.length; i > 0; i--) {
  new_str = new_str + str[i];
}
if (new_str == str) {
  console.log("it is palindrome");
} else {
  console.log("it is not palindrome");
}

// prime number
for (let i = 1; i <= num; i++) {
  if (num % i == 0) {
    count++;
  }
}
if (count == 2) {
  console.log("it is prime");
} else {
  console.log("it is not prime");
}

// SECOND LARGEST NUMBER
function findSecondLargest(a, n) {
  a = a.sort();
  let second_largest = 0;

  for (let i = n - 2; i >= 0; i--) {
    if (a[i] != a[n - 1]) {
      second_largest = a[i];
      break;
    }
  }
  return second_largest;

  // ********Easy way ************
  // let narr = [...new Set(a)].sort((a,b) => a-b);
  // return narr[narr.length-2]
}

const a = [12, 35, 1, 10, 34];
let n = a.length;
let answer = findSecondLargest(a, n);
console.log("The second largest element in the array is: " + answer);

// Rotate Clock
function rotateMatrix(matrix) {
  // Transpose the matrix
  for (var i = 0; i < matrix.length; i++) {
    for (var j = i + 1; j < matrix.length; j++) {
      var temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }

  // Reverse each row of the transposed matrix
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = matrix[i].reverse();
  }

  return matrix;
}

// Example usage
var inputMatrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
var result = rotateMatrix(inputMatrix);
console.log(result);
// Output:
// [
//   [7, 4, 1],
//   [8, 5, 2],
//   [9, 6, 3]
// ]

//// Duplicate remove
function rd(str) {
  let res = "";
  for (let i = 0; i < str.length; i++) {
    if (res.indexOf(str[i]) === -1) {
      res += str[i];
    }
  }
  return res;
}

let ans = rd("Hello");
console.log(ans);

// STACK PUSH POP
let arr = [];
let top = -1;
let size = 5;

function push(data) {
  if (top == size - 1) {
    console.log("overflow");
    return arr;
  }
  top++;
  arr[top] = data;
}

function pop() {
  if (top == -1) {
    console.log("Empty Stack");
  }
  let ans = arr[top];
  top--;
  return ans;
}

function peek() {
  if (top == -1) {
    console.log("underflow");
  }
  return arr[top];
}
push(45);
push(2);
push(52);
push(10);
pop();
push(68);
console.log(arr);
console.log(peek());
