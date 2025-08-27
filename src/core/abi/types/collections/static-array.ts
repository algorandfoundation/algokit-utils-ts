import { ABIType } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { ABITupleType, decodeTuple, encodeTuple } from './tuple'

export type ABIStaticArrayType = {
  kind: 'static-array'
  childType: ABIType
  length: number
}

export function encodeStaticArray(type: ABIStaticArrayType, value: ABIValue): Uint8Array {
  if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
    throw new Error(`Cannot encode value as ${staticArrayToString(type)}: ${value}`)
  }
  if (value.length !== type.length) {
    throw new Error(`Value array does not match static array length. Expected ${type.length}, got ${value.length}`)
  }
  const convertedTuple = toABITupleType(type)
  return encodeTuple(convertedTuple, value)
}

export function decodeStaticArray(type: ABIStaticArrayType, bytes: Uint8Array): ABIValue {
  const convertedTuple = toABITupleType(type)
  return decodeTuple(convertedTuple, bytes)
}

export function staticArrayToString(type: ABIStaticArrayType): string {
  return `${type.childType}[${type.length}]`
}

function toABITupleType(type: ABIStaticArrayType) {
  return {
    childTypes: Array(type.length).fill(type.childType),
    kind: 'tuple',
  } satisfies ABITupleType
}
