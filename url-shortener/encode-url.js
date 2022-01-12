// init base 64 map
const base64Map = [];
for (let i = 0; i < 62; i ++) {
  if (i < 10) {
    base64Map[i] = i;
  }
  
  if (i >= 10 && i < 36) {
    // 65 - 90 is the utf 16 char code for 'A - Z'
    base64Map[i] = String.fromCharCode(i+55);
  }

  if (i >= 36) {
    // 97 - 122 is the utf 16 char code for 'a-z'
    base64Map[i] = String.fromCharCode(i+61);
  }
}

base64Map[62] = '-';
base64Map[63] = '_';

function convertToBase64(n) {
  let currval = n;
  let digits = [];
  let quotient;
  let remainder;

  while (currval >= 64) {
    quotient = Math.floor(currval / 64);
    remainder = currval % 64;

    digits.push(base64Map[remainder]);
    currval = quotient;
  }

  // map currval to a digit in base x
  if (currval > 0) {
    digits.push(base64Map[currval]);
  }

  return digits.reverse().join('');
}

let counter = 1000000;
const map = {};
function encode(longUrl) {
  counter++;
  const shortUrl = convertToBase64(counter);
  map[shortUrl] = longUrl; 

  return `http://bit.ly/${shortUrl}`
}

function decode(shortUrl) {
  const backHalf = shortUrl.split('ly/')[1];
  return map[backHalf];
}

console.log(encode('https://badge.example.com/base/advice.aspx#alarm'));
console.log(decode('http://bit.ly/3q91'));