const intervals = [
  [1, 3],
  [2, 6],
  [8, 10],
  [9, 18],
];

function mergeIntervals(intervals) {
  intervals = intervals.sort((a, b) => a[0] - b[0]);
  let merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] <= merged[merged.length - 1][1]) {
      merged[merged.length - 1][1] = Math.max(
        intervals[i][1],
        merged[merged.length - 1][1]
      );
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}

console.log(mergeIntervals(intervals));
