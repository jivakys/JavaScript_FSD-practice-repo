let arr = [1, 2, 3, 4, 6, 7];
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
