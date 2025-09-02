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
  name: ABITypeName.DynamicArray
  childType: ABIType
}

export function encodeDynamicArray(type: ABIDynamicArrayType, value: ABIValue): Uint8Array {
  if (value.type !== 'Array') {
    throw new Error(`Cannot encode value as ${dynamicArrayToString(type)}, expect an array`)
  }
  const data = value.data
  const convertedTuple = toABITupleType(type, data.length)
  const encodedTuple = encodeTuple(convertedTuple, value)
  const encodedLength = bigIntToBytes(convertedTuple.childTypes.length, LENGTH_ENCODE_BYTE_SIZE)
  return concatArrays(encodedLength, encodedTuple)
}

export function decodeDynamicArray(type: ABIDynamicArrayType, bytes: Uint8Array): ABIValue {
  const view = new DataView(bytes.buffer, 0, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)
  const convertedTuple = toABITupleType(type, byteLength)
  return {
    type: 'Array',
    data: decodeTuple(convertedTuple, bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length)),
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
