import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { bigIntToBytes, bytesToBigInt } from '../../bigint'

/**
 * An unsigned integer of a specific bit size.
 */
export type ABIUintType = {
  name: ABITypeName.Uint
  bitSize: number
}

export type ABIUintValue = {
  type: ABITypeName.Uint
  data: number | bigint
}

function validate(type: ABIUintType) {
  const size = type.bitSize
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new Error(`Validation Error: unsupported uint type bitSize: ${size}`)
  }
}

export function encodeUint(type: ABIUintType, value: ABIValue): Uint8Array {
  if (value.type !== ABITypeName.Uint) {
    throw new Error(`Encoding Error: value type must be Uint`)
  }

  validate(type)

  const data = value.data
  if (data >= BigInt(2 ** type.bitSize) || data < BigInt(0)) {
    throw new Error(`${data} is not a non-negative int or too big to fit in size uint${type.bitSize}`)
  }
  if (typeof data === 'number' && !Number.isSafeInteger(data)) {
    throw new Error(`${data} should be converted into a BigInt before it is encoded`)
  }
  return bigIntToBytes(data, type.bitSize / 8)
}

export function decodeUint(type: ABIUintType, bytes: Uint8Array): ABIUintValue {
  validate(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a uint${type.bitSize}`)
  }
  const value = bytesToBigInt(bytes)
  return { type: ABITypeName.Uint, data: type.bitSize < 53 ? Number(value) : value }
}

export function uintToString(type: ABIUintType): string {
  return `uint${type.bitSize}`
}
