import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'

/**
 * A boolean value.
 */
export type ABIBoolType = {
  name: ABITypeName.Bool
}

export type ABIBoolValue = {
  type: ABITypeName.Bool
  data: boolean
}

export function encodeBool(value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.Bool) {
    throw new Error(`Encoding Error: value type must be Bool`)
  }

  return value ? new Uint8Array([0x80]) : new Uint8Array([0x00])
}

export function decodeBool(bytes: Uint8Array): ABIBoolValue {
  if (bytes.length !== 1) {
    throw new Error(`Decoding Error: Expected 1 byte for bool, got ${bytes.length}`)
  }

  return { type: ABITypeName.Bool, data: (bytes[0] & 0x80) !== 0 }
}
