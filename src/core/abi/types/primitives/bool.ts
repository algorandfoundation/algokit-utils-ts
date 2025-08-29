import { ABIValue } from '../../abi-value'

/**
 * A boolean value.
 */
export type ABIBoolType = {
  name: 'Bool'
}

export function encodeBool(value: ABIValue): Uint8Array {
  if (typeof value !== 'boolean') {
    throw new Error(`Cannot encode value as bool: ${value}`)
  }

  return value ? new Uint8Array([0x80]) : new Uint8Array([0x00])
}

export function decodeBool(bytes: Uint8Array): ABIValue {
  if (bytes.length !== 1) {
    throw new Error(`DecodingError: Expected 1 byte for bool, got ${bytes.length}`)
  }

  return (bytes[0] & 0x80) !== 0
}
