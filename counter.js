let x = 0;
console.log(x);

const addOne = (num) => {
  return num += 1;
}

console.log(addOne(x));
console.log(addOne(addOne(x)));