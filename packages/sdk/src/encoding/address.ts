import * as nacl from '../nacl/naclWrappers.js'
import * as utils from '../utils/utils.js'
import { encodeUint64 } from './uint64.js'
import { Address } from '@algorandfoundation/algokit-common'
export { Address } from '@algorandfoundation/algokit-common'

export const ALGORAND_ADDRESS_BYTE_LENGTH = 36
export const ALGORAND_CHECKSUM_BYTE_LENGTH = 4
export const ALGORAND_ADDRESS_LENGTH = 58
export const ALGORAND_ZERO_ADDRESS_STRING = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

export const MALFORMED_ADDRESS_ERROR_MSG = 'address seems to be malformed'
export const CHECKSUM_ADDRESS_ERROR_MSG = 'wrong checksum for address'

/**
 * decodeAddress takes an Algorand address in string form and decodes it into a Uint8Array.
 * @param address - an Algorand address with checksum.
 * @returns the decoded form of the address's public key and checksum
 */
export function decodeAddress(address: string): Address {
  return Address.fromString(address)
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

/**
 * encodeAddress takes an Algorand address as a Uint8Array and encodes it into a string with checksum.
 * @param address - a raw Algorand address
 * @returns the address and checksum encoded as a string.
 */
export function encodeAddress(address: Uint8Array): string {
  return new Address(address).toString()
}

const APP_ID_PREFIX = new TextEncoder().encode('appID')

/**
 * Get the escrow address of an application.
 * @param appID - The ID of the application.
 * @returns The address corresponding to that application's escrow account.
 */
export function getApplicationAddress(appID: number | bigint): Address {
  const toBeSigned = utils.concatArrays(APP_ID_PREFIX, encodeUint64(appID))
  const hash = nacl.genericHash(toBeSigned)
  return new Address(Uint8Array.from(hash))
}
