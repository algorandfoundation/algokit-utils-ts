import { addressFromPublicKey, publicKeyFromAddress } from '../../../address'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'

/**
 * An Algorand address.
 */
export type ABIAddressType = {
  name: ABITypeName.Address
}

export type ABIAddressValue = {
  type: ABITypeName.Address
  data: string
}

export function encodeAddress(value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.Address) {
    throw new Error(`Encoding Error: value type must be Address`)
  }

  return publicKeyFromAddress(value.data)
}

export function decodeAddress(bytes: Uint8Array): ABIAddressValue {
  return { type: ABITypeName.Address, data: addressFromPublicKey(bytes) }
}
