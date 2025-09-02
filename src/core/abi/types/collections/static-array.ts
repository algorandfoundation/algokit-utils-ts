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

export type ABIStaticArrayValue = {
  type: ABITypeName.StaticArray
  data: ABIValue[]
}

export function encodeStaticArray(type: ABIStaticArrayType, value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.StaticArray) {
    throw new Error(`Encoding Error: value type must be StaticArray`)
  }

  if (value.data.length !== type.length) {
    throw new Error(`Encoding Error: Value array does not match static array length. Expected ${type.length}, got ${value.data.length}`)
  }
  const tupleType = toABITupleType(type)
  return encodeTuple(tupleType, { type: ABITypeName.Tuple, data: value.data })
}

export function decodeStaticArray(type: ABIStaticArrayType, bytes: Uint8Array): ABIStaticArrayValue {
  const tupleType = toABITupleType(type)
  const decodedTuple = decodeTuple(tupleType, bytes)
  return { type: ABITypeName.StaticArray, data: decodedTuple.data }
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
