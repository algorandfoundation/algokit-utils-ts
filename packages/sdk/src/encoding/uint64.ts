/**
 * encodeUint64 converts an integer to its binary representation.
 * @param num - The number to convert. This must be an unsigned integer less than
 *   2^64.
 * @returns An 8-byte typed array containing the big-endian encoding of the input
 *   integer.
 */
export function encodeUint64(num: number | bigint) {
  const isInteger = typeof num === 'bigint' || Number.isInteger(num)

  if (!isInteger || num < 0 || num > BigInt('0xffffffffffffffff')) {
    throw new Error('Input is not a 64-bit unsigned integer')
  }

  const encoding = new Uint8Array(8)
  const view = new DataView(encoding.buffer)
  view.setBigUint64(0, BigInt(num))

  return encoding
}
