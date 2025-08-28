import { concatArrays } from '../../../array'
import { LENGTH_ENCODE_BYTE_SIZE } from '../../../constants'
import { ABIType } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { bigIntToBytes } from '../../bigint'
import { ABITupleType, decodeTuple, encodeTuple } from './tuple'

export type ABIDynamicArrayType = {
  name: 'DynamicArray'
  childType: ABIType
}

export function encodeDynamicArray(type: ABIDynamicArrayType, value: ABIValue): Uint8Array {
  if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
    throw new Error(`Cannot encode value as ${dynamicArrayToString(type)}: ${value}`)
  }
  const convertedTuple = toABITupleType(type, value.length)
  const encodedTuple = encodeTuple(convertedTuple, value)
  const encodedLength = bigIntToBytes(convertedTuple.childTypes.length, LENGTH_ENCODE_BYTE_SIZE)
  return concatArrays(encodedLength, encodedTuple)
}

export function decodeDynamicArray(type: ABIDynamicArrayType, bytes: Uint8Array): ABIValue {
  const view = new DataView(bytes.buffer, 0, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)
  const convertedTuple = toABITupleType(type, byteLength)
  return decodeTuple(convertedTuple, bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length))
}

function toABITupleType(type: ABIDynamicArrayType, length: number) {
  return {
    childTypes: Array(length).fill(type.childType),
    name: 'Tuple',
  } satisfies ABITupleType
}

export function dynamicArrayToString(type: ABIDynamicArrayType): string {
  return `${type.childType}[]`
}
