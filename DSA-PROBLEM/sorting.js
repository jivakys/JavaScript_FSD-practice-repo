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

function mergeSort() {}

// var solution = bubbleSort(arr, n);
// var solution = selectionSort(arr, n);
// var solution = insertionSort(arr, n);
console.log(solution);
