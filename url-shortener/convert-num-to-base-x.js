// Convert a number n to base x
function convert(n, x) {
  let currval = n;
  let digits = [];

  while (currval >= x) {
    let quotient = Math.floor(currval / x);
    let remainder = currval % x;

    // map remainder to a digit in base x and append it to a growing list of digits
    digits.push(remainder);
    currval = quotient;
  }

  // map currval to a digit in base x
  if (currval > 0) {
    digits.push(currval);
  }

  return digits.reverse().join('');
}

// console.log(convert(23, 2));
// console.log(convert(23000, 7));
// console.log(convert(23000000, 10));
console.log(convert(1000, 2));
console.log(convert(1000, 64));