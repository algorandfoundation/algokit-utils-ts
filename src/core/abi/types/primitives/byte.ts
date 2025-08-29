import { ABIValue } from '../../abi-value'

/**
 * A single byte.
 */
export type ABIByteType = {
  name: 'Byte'
}

export function encodeByte(value: ABIValue): Uint8Array {
  if (typeof value !== 'number' && typeof value !== 'bigint') {
    throw new Error(`Validation Error: Cannot encode value as byte: ${value}`)
  }
  const numberValue = typeof value === 'bigint' ? Number(value) : value
  if (value < 0 || value > 255) {
    throw new Error(`Encoding Error: Byte value must be between 0 and 255, got ${numberValue}`)
  }

  return new Uint8Array([numberValue])
}

export function decodeByte(bytes: Uint8Array): ABIValue {
  if (bytes.length !== 1) {
    throw new Error(`DecodingError: Expected 1 byte for byte type, got ${bytes.length}`)
  }

  return bytes[0]
}
