export function mark(num) {
  num += '';

  if (num.length <= 3) return num;

  return num.replace(/\d{1,3}(?=(\d{3})+$)/g, v => v + ',');
}

console.log(mark(1234567)); // 1,234,567

export function mark2(num) {
  num += '';

  if (num.length <= 3) return num;

  const arr = num.split('').reverse();

  for (let i = 2, len = arr.length; i < len; i += 3) {
    arr[i] = ',' + arr[i];
  }

  return arr.reverse().join('');
}

console.log(mark2(1234567)); // 1,234,567
