import { LENGTH_ENCODE_BYTE_SIZE } from 'algosdk'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { bigIntToBytes } from '../../bigint'

/**
 * A dynamic-length string.
 */
export type ABIStringType = {
  name: ABITypeName.String
}

export type ABIStringValue = {
  type: ABITypeName.String
  data: string
}

export function encodeString(value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.String) {
    throw new Error(`Encoding Error: value type must be String`)
  }

  const encodedBytes = new TextEncoder().encode(value.data)
  const encodedLength = bigIntToBytes(encodedBytes.length, LENGTH_ENCODE_BYTE_SIZE)
  const mergedBytes = new Uint8Array(encodedBytes.length + LENGTH_ENCODE_BYTE_SIZE)
  mergedBytes.set(encodedLength)
  mergedBytes.set(encodedBytes, LENGTH_ENCODE_BYTE_SIZE)
  return mergedBytes
}

export function decodeString(_type: ABIStringType, bytes: Uint8Array): ABIStringValue {
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
  return { type: ABITypeName.String, data: new TextDecoder('utf-8').decode(byteValue) }
}
