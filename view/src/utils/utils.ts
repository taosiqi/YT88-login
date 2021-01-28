export function toHex(n: number): string {
  const digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  let result = ''
  let start = true

  for (let i = 32; i > 0; ) {
    i -= 4
    const digit = (n >> i) & 0xf
    if (!start || digit != 0) {
      start = false
      result += digitArray[digit]
    }
  }

  return result == '' ? '0' : result
}
