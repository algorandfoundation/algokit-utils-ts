import { concatArrays } from '../../../array'
import { LENGTH_ENCODE_BYTE_SIZE } from '../../../constants'
import { ABIType, ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { bigIntToBytes } from '../../bigint'
import { ABITupleType, decodeTuple, encodeTuple } from './tuple'

/**
 *  A dynamic-length array of another ABI type.
 */
export type ABIDynamicArrayType = {
  name: ABITypeName.DynamicArray // TODO: consider renaming this to `type`
  childType: ABIType
}

export type ABIDynamicArrayValue = {
  type: ABITypeName.DynamicArray
  data: ABIValue[]
}

export function encodeDynamicArray(type: ABIDynamicArrayType, value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.DynamicArray) {
    throw new Error(`Encoding Error: value type must be DynamicArray`)
  }

  const tupleType = toABITupleType(type, value.data.length)
  const encodedTuple = encodeTuple(tupleType, { type: ABITypeName.Tuple, data: value.data })
  const encodedLength = bigIntToBytes(tupleType.childTypes.length, LENGTH_ENCODE_BYTE_SIZE)
  return concatArrays(encodedLength, encodedTuple)
}

export function decodeDynamicArray(type: ABIDynamicArrayType, bytes: Uint8Array): ABIDynamicArrayValue {
  const view = new DataView(bytes.buffer, 0, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)

  const tupleType = toABITupleType(type, byteLength)
  const tupleValue = decodeTuple(tupleType, bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length))

  return {
    type: ABITypeName.DynamicArray,
    data: tupleValue.data,
  }
}

function toABITupleType(type: ABIDynamicArrayType, length: number) {
  return {
    childTypes: Array(length).fill(type.childType),
    name: ABITypeName.Tuple,
  } satisfies ABITupleType
}

export function dynamicArrayToString(type: ABIDynamicArrayType): string {
  return `${type.childType}[]`
}
