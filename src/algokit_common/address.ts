import base32 from 'hi-base32'
import sha512 from 'js-sha512'
import { concatArrays } from './array'
import { ADDRESS_LENGTH, CHECKSUM_BYTE_LENGTH, HASH_BYTES_LENGTH, PUBLIC_KEY_BYTE_LENGTH } from './constants'
import { hash } from './crypto'

const APP_ID_PREFIX = new TextEncoder().encode('appID')

export function checksumFromPublicKey(publicKey: Uint8Array): Uint8Array {
  return Uint8Array.from(sha512.sha512_256.array(publicKey).slice(HASH_BYTES_LENGTH - CHECKSUM_BYTE_LENGTH, HASH_BYTES_LENGTH))
}

/**
 * Convert an Ed25519 public key to an Algorand address string
 * @param publicKey - 32-byte Ed25519 public key
 * @returns An Algorand address string
 */
export function addressFromPublicKey(publicKey: Uint8Array): string {
  if (!(publicKey instanceof Uint8Array)) {
    throw new Error(`Expected Uint8Array, got ${typeof publicKey}`)
  }

  if (publicKey.length !== PUBLIC_KEY_BYTE_LENGTH) {
    throw new Error(`Expected public key length ${PUBLIC_KEY_BYTE_LENGTH}, got ${publicKey.length}`)
  }

  const checksum = checksumFromPublicKey(publicKey)
  const addressBytes = new Uint8Array(publicKey.length + checksum.length)
  addressBytes.set(publicKey, 0)
  addressBytes.set(checksum, publicKey.length)
  return base32.encode(addressBytes).slice(0, ADDRESS_LENGTH)
}

/**
 * Extract the Ed25519 public key from an Algorand address string
 * @param address - An Algorand address string
 * @returns 32-byte Ed25519 public key
 */
export function publicKeyFromAddress(address: string): Uint8Array {
  if (address.length !== ADDRESS_LENGTH) {
    throw new Error(`Expected address length ${ADDRESS_LENGTH}, got ${address.length}`)
  }

  // Decode the base32 address
  const decoded = base32.decode.asBytes(address)

  // Check decoded length (32 bytes public key + 4 bytes checksum = 36 bytes)
  const expectedLength = PUBLIC_KEY_BYTE_LENGTH + CHECKSUM_BYTE_LENGTH
  if (decoded.length !== expectedLength) {
    throw new Error(`Expected decoded length ${expectedLength}, got ${decoded.length}`)
  }

  // Extract public key (first 32 bytes) and checksum (last 4 bytes)
  const publicKey = new Uint8Array(decoded.slice(0, PUBLIC_KEY_BYTE_LENGTH))
  const checksum = new Uint8Array(decoded.slice(PUBLIC_KEY_BYTE_LENGTH, expectedLength))

  // Verify checksum
  const expectedChecksum = checksumFromPublicKey(publicKey)

  // Compare checksums
  for (let i = 0; i < CHECKSUM_BYTE_LENGTH; i++) {
    if (checksum[i] !== expectedChecksum[i]) {
      throw new Error('Invalid address checksum')
    }
  }

  return publicKey
}

/**
 *  Computes the escrow address from an application ID.
 * @param appID - The ID of the application.
 * @returns The address corresponding to that application's escrow account.
 */
export function getAppAddress(appId: bigint): string {
  const to_hash = concatArrays(APP_ID_PREFIX, encodeUint64(appId))
  const publicKey = hash(to_hash)
  const checksum = checksumFromPublicKey(publicKey)
  return base32.encode(concatArrays(publicKey, checksum)).slice(0, ADDRESS_LENGTH)
}

function encodeUint64(num: bigint) {
  if (num < 0n || num > BigInt('0xffffffffffffffff')) {
    throw new Error('Input is not a 64-bit unsigned integer')
  }

  const encoded = new Uint8Array(8)
  const view = new DataView(encoded.buffer)
  view.setBigUint64(0, num)
  return encoded
}
