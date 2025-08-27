import { ABIValue } from '../../abi-value'
import { DecodingError, EncodingError } from '../../helpers'

export type ABITupleType = {
  kind: 'tuple'
  childTypes: any[] // Will be ABIType[] after index.ts is created
}

export function createTupleType(childTypes: any[]): ABITupleType {
  return {
    kind: 'tuple',
    childTypes,
  }
}

export function encodeTuple(_type: ABITupleType, _value: ABIValue): Uint8Array {
  // TODO: Implement complex tuple encoding with dynamic/static type handling
  throw new EncodingError('Tuple encoding not yet implemented')
}

export function decodeTuple(_type: ABITupleType, _bytes: Uint8Array): ABIValue {
  // TODO: Implement complex tuple decoding with dynamic/static type handling
  throw new DecodingError('Tuple decoding not yet implemented')
}

export function tupleToString(type: ABITupleType): string {
  // TODO: Implement after we have toString for child types
  return `(${type.childTypes.length} types)`
}
