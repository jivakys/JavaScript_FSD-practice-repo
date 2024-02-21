let str = "javascript is a programming language";

function countStringCharecters(str) {
  str = str.split("");
  let letterCount = str.reduce((acc, char) => {
    if (char != " ") {
      acc[char] = acc[char] ? acc[char] + 1 : 1;
    }
    return acc;
  }, {});

  return letterCount;
}

console.log(countStringCharecters(str));
