// SELECTION SORT
let arr = [64, 25, 12, 22, 11];
let n = arr.length;

function swap(arr, i, min) {
  let temp = arr[i];
  arr[i] = arr[min];
  arr[min] = temp;
}

function bubbleSort(arr, n) {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}

function selectionSort(arr, N) {
  for (let i = 0; i < N - 1; i++) {
    let min = i;
    for (let j = i + 1; j < N; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
    // swap(arr, i, min);
  }
  return arr;
}

function insertionSort(arr, n) {
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && key < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function quickSort(arr, start, end) {
  // if (arr.length <= 1) {
  //   return arr;
  // }

  // let pivot = arr[arr.length - 1];
  // let left = [];
  // let right = [];
  // for (let i = 0; i < n - 1; i++) {
  //   if (arr[i] < pivot) {
  //     left.push(arr[i]);
  //   } else {
  //     right.push(arr[i]);
  //   }
  // }
  // return quickSort(left).concat(pivot, quickSort(right));

  if (start < end) {
    let pi = partition(arr, start, end);
    quickSort(arr, start, pi - 1);
    quickSort(arr, pi + 1, end);
  }
  return arr;
}

function partition(arr, start, end) {
  let pivot = arr[end];
  let i = start - 1;

  for (let j = start; j <= end - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
  return i + 1;
}

// var solution = bubbleSort(arr, n);
// var solution = selectionSort(arr, n);
// var solution = insertionSort(arr, n);
var solution = quickSort(arr, 0, n - 1);
console.log(solution);
