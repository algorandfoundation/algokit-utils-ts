import { ABIValue } from '../../abi-value'
import { convertAddressToBytes, convertBytesToAddress, EncodingError } from '../../helpers'

export type ABIAddressType = {
  kind: 'address'
}

export function encodeAddress(value: ABIValue): Uint8Array {
  if (typeof value === 'string') {
    return convertAddressToBytes(value)
  }
  throw new EncodingError(`Cannot encode value as address: ${value}`)
}

export function decodeAddress(bytes: Uint8Array): ABIValue {
  return convertBytesToAddress(bytes)
}
