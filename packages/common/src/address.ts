import base32 from 'hi-base32'
import sha512 from 'js-sha512'
import { CHECKSUM_BYTE_LENGTH, HASH_BYTES_LENGTH } from './constants'
import { arrayEqual, concatArrays } from './array'

export const ALGORAND_ADDRESS_BYTE_LENGTH = 36
export const ALGORAND_CHECKSUM_BYTE_LENGTH = 4
export const ALGORAND_ADDRESS_LENGTH = 58
export const ALGORAND_ZERO_ADDRESS_STRING = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

export const MALFORMED_ADDRESS_ERROR_MSG = 'address seems to be malformed'
export const CHECKSUM_ADDRESS_ERROR_MSG = 'wrong checksum for address'

export function checksumFromPublicKey(publicKey: Uint8Array): Uint8Array {
  return Uint8Array.from(sha512.sha512_256.array(publicKey).slice(HASH_BYTES_LENGTH - CHECKSUM_BYTE_LENGTH, HASH_BYTES_LENGTH))
}

function genericHash(arr: sha512.Message) {
  return sha512.sha512_256.array(arr)
}

function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex')
}

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

/** Symbol used for instanceof checks across packages (CJS/ESM) */
const ADDR_SYMBOL = Symbol.for('algokit_common:Address')

/**
 * Represents an Algorand address
 */
export class Address {
  /**
   * The binary form of the address. For standard accounts, this is the public key.
   */
  public readonly publicKey: Uint8Array;

  /** @internal */
  [ADDR_SYMBOL]: boolean

  /**
   * Create a new Address object from its binary form.
   * @param publicKey - The binary form of the address. Must be 32 bytes.
   */
  constructor(publicKey: Uint8Array) {
    this[ADDR_SYMBOL] = true
    if (publicKey.length !== ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH)
      throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: 0x${bytesToHex(publicKey)}, length ${publicKey.length}`)
    this.publicKey = publicKey
  }

  /**
   * Check if the address is equal to another address.
   */
  equals(other: Address): boolean {
    return other instanceof Address && arrayEqual(this.publicKey, other.publicKey)
  }

  /**
   * Compute the 4 byte checksum of the address.
   */
  checksum(): Uint8Array {
    return checksumFromPublicKey(this.publicKey)
  }

  /**
   * Encode the address into a string form.
   */
  toString(): string {
    const addr = base32.encode(concatArrays(this.publicKey, this.checksum()))
    return addr.slice(0, ALGORAND_ADDRESS_LENGTH) // removing the extra '===='
  }

  /**
   * Decode an address from a string.
   * @param address - The address to decode. Must be 58 characters long.
   * @returns An Address object corresponding to the input string.
   */
  static fromString(address: string): Address {
    if (typeof address !== 'string') throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected string, got ${typeof address}, ${address}`)
    if (address.length !== ALGORAND_ADDRESS_LENGTH)
      throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected length ${ALGORAND_ADDRESS_LENGTH}, got ${address.length}: ${address}`)

    // try to decode
    const decoded = base32.decode.asBytes(address)
    // Sanity check
    if (decoded.length !== ALGORAND_ADDRESS_BYTE_LENGTH)
      throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected byte length ${ALGORAND_ADDRESS_BYTE_LENGTH}, got ${decoded.length}`)

    // Find publickey and checksum
    const pk = new Uint8Array(decoded.slice(0, ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH))
    const cs = new Uint8Array(decoded.slice(ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH, ALGORAND_ADDRESS_BYTE_LENGTH))
    const checksum = checksumFromPublicKey(pk)
    // Check if the checksum and the address are equal
    if (!arrayEqual(checksum, cs)) throw new Error(`${CHECKSUM_ADDRESS_ERROR_MSG}: ${address} (${cs}, ${checksum})`)

    return new Address(pk)
  }

  /**
   * Get the zero address.
   */
  static zeroAddress(): Address {
    return new Address(new Uint8Array(ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH))
  }

  static [Symbol.hasInstance](obj: unknown) {
    return Boolean(obj && typeof obj === 'object' && ADDR_SYMBOL in obj && obj[ADDR_SYMBOL as keyof typeof obj])
  }
}

export interface Addressable {
  addr: Readonly<Address>
}

export type ReadableAddress = Addressable | Address | string

export function getAddress(addr: ReadableAddress): Address {
  if (typeof addr == 'string') {
    return Address.fromString(addr)
  } else if ('addr' in addr) {
    return addr.addr
  } else {
    return addr
  }
}

export function getOptionalAddress(addr: ReadableAddress | undefined): Address | undefined {
  if (addr === undefined) {
    return undefined
  }
  return getAddress(addr)
}

/**
 * isValidAddress checks if a string is a valid Algorand address.
 * @param address - an Algorand address with checksum.
 * @returns true if valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  // Try to decode
  try {
    Address.fromString(address)
  } catch {
    return false
  }
  return true
}

const APP_ID_PREFIX = new TextEncoder().encode('appID')

/**
 * Get the escrow address of an application.
 * @param appID - The ID of the application.
 * @returns The address corresponding to that application's escrow account.
 */
export function getApplicationAddress(appID: number | bigint): Address {
  const toBeSigned = concatArrays(APP_ID_PREFIX, encodeUint64(appID))
  const hash = genericHash(toBeSigned)
  return new Address(Uint8Array.from(hash))
}
