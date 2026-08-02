var findKthPositive = function (arr, k) {
  let i = 0;
  let num = 1;
  while (true) {
    if (arr[i] === num) {
      i++;
    } else {
      k--;
      if (k === 0) {
        return num;
      }
    }
    num++;
  }
};
