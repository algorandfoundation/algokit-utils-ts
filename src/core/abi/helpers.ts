import base32 from 'hi-base32'
import * as nacl from '../nacl/naclWrappers'
import { arrayEqual, concatArrays } from '../utils'

export class ABIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ABIError'
  }
}

export class ValidationError extends ABIError {
  constructor(message: string) {
    super(`Validation Error: ${message}`)
    this.name = 'ValidationError'
  }
}

export class EncodingError extends ABIError {
  constructor(message: string) {
    super(`Encoding Error: ${message}`)
    this.name = 'EncodingError'
  }
}

export class DecodingError extends ABIError {
  constructor(message: string) {
    super(`Decoding Error: ${message}`)
    this.name = 'DecodingError'
  }
}

// TODO: check for duplicates
const BITS_PER_BYTE = 8
const MAX_BIT_SIZE = 512
const MAX_PRECISION = 160
const ALGORAND_PUBLIC_KEY_BYTE_LENGTH = 32

export class BitSize {
  private readonly bits: number

  constructor(bits: number) {
    if (bits < BITS_PER_BYTE || bits > MAX_BIT_SIZE || bits % BITS_PER_BYTE !== 0) {
      throw new ValidationError(
        `Bit size must be between ${BITS_PER_BYTE} and ${MAX_BIT_SIZE} and divisible by ${BITS_PER_BYTE}, got ${bits}`,
      )
    }
    this.bits = bits
  }

  value(): number {
    return this.bits
  }
}

export class Precision {
  private readonly precision: number

  constructor(precision: number) {
    if (precision < 0 || precision > MAX_PRECISION) {
      throw new ValidationError(`Precision must be between 0 and ${MAX_PRECISION}, got ${precision}`)
    }
    this.precision = precision
  }

  value(): number {
    return this.precision
  }
}

export const CONSTANTS = {
  BITS_PER_BYTE,
  MAX_BIT_SIZE,
  MAX_PRECISION,
  ALGORAND_PUBLIC_KEY_BYTE_LENGTH,
}

export const STATIC_ARRAY_REGEX = /^(.+)\[(\d+)\]$/
export const UFIXED_REGEX = /^ufixed(\d+)x(\d+)$/

export const MALFORMED_ADDRESS_ERROR_MSG = 'address seems to be malformed'
export const CHECKSUM_ADDRESS_ERROR_MSG = 'wrong checksum for address'
export const ALGORAND_ADDRESS_LENGTH = 58
export const ALGORAND_ADDRESS_BYTE_LENGTH = 36
export const ALGORAND_CHECKSUM_BYTE_LENGTH = 4
export const LENGTH_ENCODE_BYTE_SIZE = 2

// TODO: this will be replaced by the real logic when this branch is merged
export function convertAddressToBytes(address: string): Uint8Array {
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

export function convertBytesToAddress(bytes: Uint8Array): string {
  if (bytes.byteLength !== 32) {
    throw new Error(`byte string must be 32 bytes long for an address`)
  }
  const checksumBytes = checksumFromPublicKey(bytes)
  const addr = base32.encode(concatArrays(bytes, checksumBytes))
  return addr.slice(0, ALGORAND_ADDRESS_LENGTH) // removing the extra '===='
}
