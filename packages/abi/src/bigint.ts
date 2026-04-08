/**
 * Converts a BigInt or number to a big-endian Uint8Array for encoding.
 * @param value - The bigint or number to convert.
 * @param size - The size of the resulting byte array.
 * @returns A byte array containing the big-endian encoding of the input bigint
 */
export function bigIntToBytes(value: bigint | number, size: number) {
  let hex = value.toString(16)
  // Pad the hex with zeros so it matches the size in bytes
  if (hex.length !== size * 2) {
    hex = hex.padStart(size * 2, '0')
  }
  const byteArray = new Uint8Array(hex.length / 2)
  for (let i = 0, j = 0; i < hex.length / 2; i++, j += 2) {
    byteArray[i] = parseInt(hex.slice(j, j + 2), 16)
  }
  return byteArray
}

/**
 * Converts a big-endian Uint8Array to bigint.
 *
 * @param bytes - The Uint8Array to convert.
 * @returns The decoded bigint
 */
export function bytesToBigInt(bytes: Uint8Array) {
  let res = BigInt(0)
  const buf = new DataView(bytes.buffer, bytes.byteOffset)
  for (let i = 0; i < bytes.length; i++) {
    res = BigInt(Number(buf.getUint8(i))) + res * BigInt(256)
  }
  return res
}
