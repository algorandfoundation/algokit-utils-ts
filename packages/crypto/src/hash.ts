import { sha512_256 } from '@noble/hashes/sha2.js'
import { HASH_BYTES_LENGTH } from '@algorandfoundation/algokit-common'

/**
 * Computes an Algorand-compatible SHA-512/256 hash.
 */
export function hash(bytes: Uint8Array): Uint8Array {
  return sha512_256(bytes).slice(0, HASH_BYTES_LENGTH)
}
