import { addressToBytes, bytesToAddress } from '../../../utils'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { EncodingError } from '../../errors'

export type ABIAddressType = {
  name: ABITypeName.Address
}

export function encodeAddress(value: ABIValue): Uint8Array {
  if (typeof value === 'string') {
    return addressToBytes(value)
  }
  throw new EncodingError(`Cannot encode value as address: ${value}`)
}

export function decodeAddress(bytes: Uint8Array): ABIValue {
  return bytesToAddress(bytes)
}
