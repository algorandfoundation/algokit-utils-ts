import { LENGTH_ENCODE_BYTE_SIZE } from 'algosdk'
import { bigIntToBytes } from '../../../utils'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { EncodingError } from '../../errors'

export type ABIStringType = {
  name: ABITypeName.String
}

export function encodeString(value: ABIValue): Uint8Array {
  if (typeof value !== 'string') {
    throw new EncodingError(`Cannot encode value as string: ${value}`)
  }

  let encodedBytes: Uint8Array
  if (typeof value === 'string') {
    encodedBytes = new TextEncoder().encode(value)
  } else {
    encodedBytes = value
  }
  const encodedLength = bigIntToBytes(encodedBytes.length, LENGTH_ENCODE_BYTE_SIZE)
  const mergedBytes = new Uint8Array(encodedBytes.length + LENGTH_ENCODE_BYTE_SIZE)
  mergedBytes.set(encodedLength)
  mergedBytes.set(encodedBytes, LENGTH_ENCODE_BYTE_SIZE)
  return mergedBytes
}

export function decodeString(_type: ABIStringType, bytes: Uint8Array): ABIValue {
  if (bytes.length < LENGTH_ENCODE_BYTE_SIZE) {
    throw new Error(
      `byte string is too short to be decoded. Actual length is ${bytes.length}, but expected at least ${LENGTH_ENCODE_BYTE_SIZE}`,
    )
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, LENGTH_ENCODE_BYTE_SIZE)
  const byteLength = view.getUint16(0)
  const byteValue = bytes.slice(LENGTH_ENCODE_BYTE_SIZE, bytes.length)
  if (byteLength !== byteValue.length) {
    throw new Error(`string length bytes do not match the actual length of string. Expected ${byteLength}, got ${byteValue.length}`)
  }
  return new TextDecoder('utf-8').decode(byteValue)
}
