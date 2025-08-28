import sha512 from 'js-sha512'
import { HASH_BYTES_LENGTH } from './constants'

export function hash(bytes: Uint8Array): Uint8Array {
  return Uint8Array.from(sha512.sha512_256.array(bytes).slice(0, HASH_BYTES_LENGTH))
}
