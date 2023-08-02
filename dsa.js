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
