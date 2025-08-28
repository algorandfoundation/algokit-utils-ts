import { bigIntToBytes } from 'algosdk'
import { bytesToBigInt } from '../../../utils'
import { ABITypeName } from '../../abi-type'
import { ABIValue } from '../../abi-value'
import { ValidationError } from '../../helpers'

export type ABIUFixedType = {
  name: ABITypeName.Ufixed
  bitSize: number
  precision: number
}

function validate(type: ABIUFixedType) {
  const size = type.bitSize
  const precision = type.precision
  if (size % 8 !== 0 || size < 8 || size > 512) {
    throw new ValidationError(`unsupported ufixed type bitSize: ${size}`)
  }
  if (precision > 160 || precision < 1) {
    throw new ValidationError(`unsupported ufixed type precision: ${precision}`)
  }
}

export function encodeUFixed(type: ABIUFixedType, value: ABIValue): Uint8Array {
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

export function decodeUFixed(type: ABIUFixedType, bytes: Uint8Array): ABIValue {
  validate(type)

  if (bytes.length !== type.bitSize / 8) {
    throw new Error(`byte string must correspond to a ${ufixedToString(type)}`)
  }
  return bytesToBigInt(bytes)
}

export function ufixedToString(type: ABIUFixedType): string {
  return `ufixed${type.bitSize}x${type.precision}`
}
