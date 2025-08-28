import { addressFromPublicKey, publicKeyFromAddress } from '../../../address'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'

export type ABIAddressType = {
  name: ABITypeName.Address
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
