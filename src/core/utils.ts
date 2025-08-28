import base32 from 'hi-base32'
import {
  ALGORAND_ADDRESS_BYTE_LENGTH,
  ALGORAND_ADDRESS_LENGTH,
  ALGORAND_CHECKSUM_BYTE_LENGTH,
  CHECKSUM_ADDRESS_ERROR_MSG,
  MALFORMED_ADDRESS_ERROR_MSG,
} from './constants'
import * as nacl from './nacl/naclWrappers'

/**
 * Check whether the environment is ReactNative
 * @returns True if ReactNative, false otherwise
 */
export function isReactNative() {
  const { navigator } = globalThis as { navigator?: { product?: string } }
  if (typeof navigator === 'object' && navigator.product === 'ReactNative') {
    return true
  }
  return false
}

export function arrayEqual<T>(a: ArrayLike<T>, b: ArrayLike<T>): boolean {
  if (a.length !== b.length) {
    return false
  }
  return Array.from(a).every((val, i) => val === b[i])
}

export function concatArrays(...arrs: ArrayLike<number>[]) {
  const size = arrs.reduce((sum, arr) => sum + arr.length, 0)
  const c = new Uint8Array(size)

  let offset = 0
  for (let i = 0; i < arrs.length; i++) {
    c.set(arrs[i], offset)
    offset += arrs[i].length
  }

  return c
}

/**
 * bigIntToBytes converts a BigInt to a big-endian Uint8Array for encoding.
 * @param bi - The bigint to convert.
 * @param size - The size of the resulting byte array.
 * @returns A byte array containing the big-endian encoding of the input bigint
 */
export function bigIntToBytes(bi: bigint | number, size: number) {
  let hex = bi.toString(16)
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
 * bytesToBigInt produces a bigint from a binary representation.
 *
 * @param bytes - The Uint8Array to convert.
 * @returns The bigint that was encoded in the input data.
 */
export function bytesToBigInt(bytes: Uint8Array) {
  let res = BigInt(0)
  const buf = new DataView(bytes.buffer, bytes.byteOffset)
  for (let i = 0; i < bytes.length; i++) {
    res = BigInt(Number(buf.getUint8(i))) + res * BigInt(256)
  }
  return res
}

// TODO: this will be replaced by the real logic when this branch is merged
export function addressToBytes(address: string): Uint8Array {
  if (typeof address !== 'string') throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected string, got ${typeof address}, ${address}`)
  if (address.length !== ALGORAND_ADDRESS_LENGTH)
    throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected length ${ALGORAND_ADDRESS_LENGTH}, got ${address.length}: ${address}`)

  // try to decode
  const decoded = base32.decode.asBytes(address)
  // Sanity check
  if (decoded.length !== ALGORAND_ADDRESS_BYTE_LENGTH)
    throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected byte length ${ALGORAND_ADDRESS_BYTE_LENGTH}, got ${decoded.length}`)

  // Find publickey and checksum
  const publicKey = new Uint8Array(decoded.slice(0, ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH))
  const checksum = new Uint8Array(decoded.slice(nacl.PUBLIC_KEY_LENGTH, ALGORAND_ADDRESS_BYTE_LENGTH))
  const expectedChecksum = checksumFromPublicKey(publicKey)
  // Check if the checksum and the address are equal
  if (!arrayEqual(expectedChecksum, checksum)) throw new Error(CHECKSUM_ADDRESS_ERROR_MSG)

  return publicKey
}

function checksumFromPublicKey(pk: Uint8Array): Uint8Array {
  return Uint8Array.from(nacl.genericHash(pk).slice(nacl.HASH_BYTES_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH, nacl.HASH_BYTES_LENGTH))
}

export function bytesToAddress(bytes: Uint8Array): string {
  if (bytes.byteLength !== 32) {
    throw new Error(`bytes must be 32 bytes long for an address`)
  }
  const checksumBytes = checksumFromPublicKey(bytes)
  const addr = base32.encode(concatArrays(bytes, checksumBytes))
  return addr.slice(0, ALGORAND_ADDRESS_LENGTH) // removing the extra '===='
}
