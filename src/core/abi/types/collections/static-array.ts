import { ABIValue } from '../../abi-value'
import { DecodingError, EncodingError } from '../../helpers'

export type ABIStaticArrayType = {
  kind: 'static-array'
  elementType: any // Will be ABIType after index.ts is created
  length: number
}

export function createStaticArrayType(elementType: any, length: number): ABIStaticArrayType {
  if (length < 0 || !Number.isInteger(length)) {
    throw new Error(`Array length must be a non-negative integer, got ${length}`)
  }

  return {
    kind: 'static-array',
    elementType,
    length,
  }
}

export function encodeStaticArray(_type: ABIStaticArrayType, _value: ABIValue): Uint8Array {
  // TODO: Implement static array encoding with bool packing optimization
  throw new EncodingError('Static array encoding not yet implemented')
}

export function decodeStaticArray(_type: ABIStaticArrayType, _bytes: Uint8Array): ABIValue {
  // TODO: Implement static array decoding with bool unpacking optimization
  throw new DecodingError('Static array decoding not yet implemented')
}

export function staticArrayToString(type: ABIStaticArrayType): string {
  // TODO: Implement after we have toString for element types
  return `elementType[${type.length}]`
}
