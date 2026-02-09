import { sha512_256 } from '@noble/hashes/sha2.js'
import { HASH_BYTES_LENGTH } from './constants'

export function hash(bytes: Uint8Array): Uint8Array {
  return sha512_256(bytes).slice(0, HASH_BYTES_LENGTH)
}
