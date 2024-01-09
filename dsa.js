const people = [
  {
    name: "bob",
    age: 23,
  },
  {
    name: "marle",
    age: 25,
  },
  {
    name: "jon",
    age: 30,
  },
  {
    name: "merry",
    age: 18,
  },
];

const sumOfage = people.reduce((total, p) => total + p.age, 0);
const avg = sumOfage / people.length;
console.log("average age is =", avg);

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

// Valid Stack Sequence
n = 5;
let arr1 = [1, 2, 3, 4, 5];
let arr2 = [4, 5, 3, 2, 1];
// 5
// 1 2 3 4 5
// 4 3 5 1 2
function validSequence(n, arr1, arr2) {
  let count = 0;
  let stack = [];
  for (let i = 0; i < n; i++) {
    stack.push(arr1[i]);
    while (
      stack.length != 0 &&
      count < n &&
      stack[stack.length - 1] == arr2[count]
    ) {
      stack.pop();
      count++;
    }
  }
  if (stack.length === 0) {
    console.log("Valid");
  } else {
    console.log("Invalid");
  }
}

// Stack Next Greater

let length = 4;
let array = [1, 3, 2, 4];
function greaterEle(n, arr) {
  let stack = [];
  let ans = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length != 0 && stack[stack.length - 1] <= arr[i]) {
      stack.pop();
    }
    if (stack.length == 0) {
      ans.push(-1);
    } else {
      ans.push(stack[stack.length - 1]);
    }
    stack.push(arr[i]);
  }
  console.log(ans.reverse().join(" "));
}

// Stack Next Smaller
let N = 8;
let narr = [39, 27, 11, 4, 24, 32, 32, 1];
function smallNeighbour(N, arr) {
  let res = [];
  let ans = [];
  for (let i = 0; i < N; i++) {
    while (res.length != 0 && res[res.length - 1] >= arr[i]) {
      res.pop();
    }
    if (res.length == 0) {
      ans.push(-1);
    } else {
      ans.push(res[res.length - 1]);
    }
    res.push(arr[i]);
  }
  console.log(ans.join(" "));
}

// FIND DUPLICATE || WAR OF MINION

function duplicateEncounter(str) {
  let stack = [];
  for (let i = 0; i < str.length; i++) {
    if (stack[stack.length - 1] == str[i]) {
      stack.pop();
    } else {
      stack.push(str[i]);
    }
  }
  if (stack.length === 0) {
    console.log("Empty String");
  } else {
    console.log(stack.join(""));
  }
}

function runProgram(input) {
  input = input.trim().split("\n");
  let str = input[0].trim();
  duplicateEncounter(str);
}

// Pattern N
function patternOfN(N) {
  // Write code here

  let count = 1;
  for (let i = 1; i <= N; i++) {
    let bag = "";
    for (let j = 1; j <= N; j++) {
      bag = bag + count + " ";
      count++;
    }
    console.log(count);
  }
}

// DETECT GIVEN Number PALINDROM or NOT
function detectPalindrome(num) {
  num = num.toString();
  let new_num = "";

  for (let i = num.length - 1; i >= 0; i--) {
    new_num = new_num + num[i];
  }
  if (num == new_num) {
    console.log("Yes");
  } else {
    console.log("No");
  }

  let rev = 0;
  let temp = num;
  while (num > 0) {
    rem = num % 10;
    rev = rev * 10 + rem;
    num = Math.floor(num / 10);
  }
  if (temp == rev) {
    console.log("Yes");
  } else {
    console.log("No");
  }
}

// Perform Merging
function merging(N, arr1, arr2) {
  let arr3 = new Array(N + N);
  let i = 0,
    j = 0,
    k = 0;
  while (i < N && j < N) {
    if (arr1[i] < arr2[j]) {
      arr3[k] = arr1[i];
      i++;
      k++;
    } else {
      arr3[k] = arr2[j];
      j++;
      k++;
    }
  }
  while (i < N) {
    arr3[k] = arr1[i];
    i++;
    k++;
  }
  while (j < N) {
    arr3[k] = arr2[j];
    j++;
    k++;
  }
  console.log(arr3.join(" "));
}

// binary search - target

let k = 5;
function bs(arr, k) {
  //   arr.sort((a, b) => a - b);
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (k === arr[mid]) {
      console.log(mid);
      return;
    } else if (k > arr[mid]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  console.log(left);
}

bs(arr, k);

// Daily Temperatures
// 2
let nn = 4;
let tempArr = [30, 40, 50, 60];
//let nn = 8
//let tempArr = 73 74 75 71 69 72 76 73

function temp(n, arr) {
  let stack = [];
  let ans = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length != 0 && arr[i] >= arr[stack[stack.length - 1]]) {
      stack.pop();
    }
    if (stack.length != 0) {
      ans.push(stack[stack.length - 1] - i);
    } else {
      ans.push(0);
    }
    stack.push(i);
  }
  console.log(ans.reverse().join(" "));
}
