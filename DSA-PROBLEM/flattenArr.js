const multiDimensionalArray = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8],
];

const flattenedArray = multiDimensionalArray.reduce((acc, currVal) => {
  return acc.concat(currVal);
}, []);

console.log(flattenedArray);
