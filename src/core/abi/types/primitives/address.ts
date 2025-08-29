import { addressFromPublicKey, publicKeyFromAddress } from '../../../address'
import { ABIValue } from '../../abi-value'

/**
 * An Algorand address.
 */
export type ABIAddressType = {
  name: 'Address'
}

export function encodeAddress(value: ABIValue): Uint8Array {
  if (typeof value === 'string') {
    return publicKeyFromAddress(value)
  }
  throw new Error(`Encoding Error: Cannot encode value as address: ${value}`)
}

export function decodeAddress(bytes: Uint8Array): ABIValue {
  return addressFromPublicKey(bytes)
}
