import { bigIntToBytes } from 'algosdk'
import { ABIValue } from '../../abi-value'
import { bytesToBigInt } from '../../bigint'

/**
 * A fixed-point number of a specific bit size and precision.
 */
export type ABIUfixedType = {
  name: 'Ufixed'
  bitSize: number
  precision: number
}

function validate(type: ABIUfixedType) {
  const size = type.bitSize
  const precision = type.precision
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new Error(`Validation Error: unsupported ufixed type bitSize: ${size}`)
  }
  if (precision > 160 || precision < 1) {
    throw new Error(`Validation Error: unsupported ufixed type precision: ${precision}`)
  }
}

export function encodeUfixed(type: ABIUfixedType, value: ABIValue): Uint8Array {
  validate(type)

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    throw new Error(`Cannot encode value as ${ufixedToString(type)}: ${value}`)
  }
  if (value >= BigInt(2 ** type.bitSize) || value < BigInt(0)) {
    throw new Error(`${value} is not a non-negative int or too big to fit in size ${type.toString()}`)
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new Error(`${value} should be converted into a BigInt before it is encoded`)
  }
  return bigIntToBytes(value, type.bitSize / 8)
}

export function decodeUfixed(type: ABIUfixedType, bytes: Uint8Array): ABIValue {
  validate(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a ${ufixedToString(type)}`)
  }

  const value = bytesToBigInt(bytes)
  return type.bitSize < 53 ? Number(value) : value
}

export function ufixedToString(type: ABIUfixedType): string {
  return `ufixed${type.bitSize}x${type.precision}`
}
