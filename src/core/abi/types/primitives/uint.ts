import { ABIValue } from '../../abi-value'
import { bigIntToBytes, bytesToBigInt } from '../../bigint'

export type ABIUintType = {
  name: 'Uint'
  bitSize: number
}

function validate(type: ABIUintType) {
  const size = type.bitSize
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new Error(`Validation Error: unsupported uint type bitSize: ${size}`)
  }
}

export function encodeUint(type: ABIUintType, value: ABIValue): Uint8Array {
  validate(type)

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    throw new Error(`Cannot encode value as uint${type.bitSize}: ${value}`)
  }

  if (value >= BigInt(2 ** type.bitSize) || value < BigInt(0)) {
    throw new Error(`${value} is not a non-negative int or too big to fit in size uint${type.bitSize}`)
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new Error(`${value} should be converted into a BigInt before it is encoded`)
  }
  return bigIntToBytes(value, type.bitSize / 8)
}

export function decodeUint(type: ABIUintType, bytes: Uint8Array): ABIValue {
  validate(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a uint${type.bitSize}`)
  }
  return bytesToBigInt(bytes)
}

export function uintToString(type: ABIUintType): string {
  return `uint${type.bitSize}`
}
