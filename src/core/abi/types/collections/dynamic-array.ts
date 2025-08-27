import { ABIValue } from '../../abi-value'
import { DecodingError, EncodingError } from '../../helpers'

export type ABIDynamicArrayType = {
  kind: 'dynamic-array'
  elementType: any // Will be ABIType after index.ts is created
}

export function createDynamicArrayType(elementType: any): ABIDynamicArrayType {
  return {
    kind: 'dynamic-array',
    elementType,
  }
}

export function encodeDynamicArray(_type: ABIDynamicArrayType, value: ABIValue): Uint8Array {
  if (value.kind !== 'array') {
    throw new EncodingError(`Expected array value, got ${value.kind}`)
  }

  const elements = value.value
  const length = elements.length

  if (length > 65535) {
    throw new EncodingError(`Dynamic array too long: ${length} elements (max 65535)`)
  }

  // TODO: Implement dynamic array encoding with element encoding
  // Format: length (2 bytes big-endian) + encoded elements
  const result = new Uint8Array(2)
  result[0] = (length >> 8) & 0xff
  result[1] = length & 0xff

  // For now, just return length header
  // Real implementation would encode each element and concatenate
  return result
}

export function decodeDynamicArray(_type: ABIDynamicArrayType, bytes: Uint8Array): ABIValue {
  if (bytes.length < 2) {
    throw new DecodingError(`Dynamic array requires at least 2 bytes for length, got ${bytes.length}`)
  }

  // Decode length from first 2 bytes (big-endian)
  // const length = (bytes[0] << 8) | bytes[1]

  // TODO: Implement dynamic array decoding with element decoding
  // For now, return empty array
  const elements: ABIValue[] = []

  return { kind: 'array', value: elements }
}

export function dynamicArrayToString(_type: ABIDynamicArrayType): string {
  // TODO: Implement after we have toString for element types
  return 'elementType[]'
}
