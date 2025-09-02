import { ABIType, ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { ABITupleType, decodeTuple, encodeTuple } from './tuple'

/**
 * A static-length array of another ABI type.
 */
export type ABIStaticArrayType = {
  name: ABITypeName.StaticArray
  childType: ABIType
  length: number
}

export function encodeStaticArray(type: ABIStaticArrayType, value: ABIValue): Uint8Array {
  if (value.type !== 'Array') {
    throw new Error(`Cannot encode value as ${staticArrayToString(type)}, expect an array`)
  }
  if (value.data.length !== type.length) {
    throw new Error(`Value array does not match static array length. Expected ${type.length}, got ${value.data.length}`)
  }
  const convertedTuple = toABITupleType(type)
  return encodeTuple(convertedTuple, value)
}

export function decodeStaticArray(type: ABIStaticArrayType, bytes: Uint8Array): ABIValue {
  const convertedTuple = toABITupleType(type)
  return { type: 'Array', data: decodeTuple(convertedTuple, bytes) }
}

export function staticArrayToString(type: ABIStaticArrayType): string {
  return `${type.childType}[${type.length}]`
}

function toABITupleType(type: ABIStaticArrayType) {
  return {
    childTypes: Array(type.length).fill(type.childType),
    name: ABITypeName.Tuple,
  } satisfies ABITupleType
}
