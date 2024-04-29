function findSecLarge(arr) {
  let largest = arr[0];
  let secondLarge = -Infinity;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > largest) {
      secondLarge = largest;
      largest = arr[i];
    } else if (arr[i] < largest && arr[i] > secondLarge) {
      secondLarge = arr[i];
    }
  }

  console.log(secondLarge);
  //   let secondLarge = [...new Set(arr)].sort((a, b) => a - b);
  //   console.log(secondLarge[secondLarge.length - 2]);
}

let arr = [1, 2, 3, 4, 5, 5, 6, 8, 4];
findSecLarge(arr);
