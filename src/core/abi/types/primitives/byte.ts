import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'

/**
 * A single byte.
 */
export type ABIByteType = {
  name: ABITypeName.Byte
}

export type ABIByteValue = {
  type: ABITypeName.Byte
  data: number
}

export function encodeByte(value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.Byte) {
    throw new Error(`Encoding Error: value type must be Byte`)
  }

  const data = value.data
  if (data < 0 || data > 255) {
    throw new Error(`Encoding Error: Byte value must be between 0 and 255, got ${data}`)
  }

  return new Uint8Array([data])
}

export function decodeByte(bytes: Uint8Array): ABIByteValue {
  if (bytes.length !== 1) {
    throw new Error(`Decoding Error: Expected 1 byte for byte type, got ${bytes.length}`)
  }

  return {
    type: ABITypeName.Byte,
    data: bytes[0],
  }
}
