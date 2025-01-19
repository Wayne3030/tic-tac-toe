const arr = Array.from({ length: 9 }, (value, index) => {
  console.log(value, index);
  return index * 2;
});
console.log(arr); // 输出: [0, 1, 2, 3, 4, 5, 6, 7, 8]
