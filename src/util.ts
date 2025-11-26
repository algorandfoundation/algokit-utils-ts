import {
  ABIArrayDynamicType,
  ABIArrayStaticType,
  ABIByteType,
  ABIReturnType,
  ABITupleType,
  ABIType,
  ABIUintType,
  ABIValue,
} from '@algorandfoundation/sdk'
import { APP_PAGE_MAX_SIZE } from './types/app'

/**
 * Converts a value which might be a number or a bigint into a number to be used with apis that don't support bigint.
 *
 * Throws an UnsafeConversionError if the conversion would result in an unsafe integer for the Number type
 * @param value
 */
export const toNumber = (value: number | bigint) => {
  if (typeof value === 'number') return value

  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new UnsafeConversionError(
      `Cannot convert ${value} to a Number as it is larger than the maximum safe integer the Number type can hold.`,
    )
  } else if (value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new UnsafeConversionError(
      `Cannot convert ${value} to a Number as it is smaller than the minimum safe integer the Number type can hold.`,
    )
  }
  return Number(value)
}

export class UnsafeConversionError extends Error {}

/**
 * Calculates the amount of funds to add to a wallet to bring it up to the minimum spending balance.
 * @param minSpendingBalance The minimum spending balance for the wallet
 * @param currentSpendingBalance The current spending balance for the wallet
 * @param minFundingIncrement The minimum amount of funds that can be added to the wallet
 * @returns The amount of funds to add to the wallet or null if the wallet is already above the minimum spending balance
 */
export const calculateFundAmount = (
  minSpendingBalance: bigint,
  currentSpendingBalance: bigint,
  minFundingIncrement: bigint,
): bigint | null => {
  if (minSpendingBalance > currentSpendingBalance) {
    const minFundAmount = minSpendingBalance - currentSpendingBalance
    return BigInt(Math.max(Number(minFundAmount), Number(minFundingIncrement)))
  } else {
    return null
  }
}

/**
 * Checks if the current environment is Node.js
 *
 * @returns A boolean indicating whether the current environment is Node.js
 */
export const isNode = () => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

/**
 * Returns the given array split into chunks of `batchSize` batches.
 * @param array The array to chunk
 * @param batchSize The size of batches to split the array into
 * @returns A generator that yields the array split into chunks of `batchSize` batches
 */
export function* chunkArray<T>(array: T[], batchSize: number): Generator<T[], void> {
  for (let i = 0; i < array.length; i += batchSize) yield array.slice(i, i + batchSize)
}

/**
 * Memoize calls to the given function in an in-memory map.
 * @param fn The function to memoize
 * @returns The memoized function
 */
export const memoize = <T = unknown, R = unknown>(fn: (val: T) => R) => {
  const cache = new Map()
  const cached = function (this: unknown, val: T) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val)
  }
  cached.cache = cache
  return cached as (val: T) => R
}

export const binaryStartsWith = (base: Uint8Array, startsWith: Uint8Array): boolean => {
  if (startsWith.length > base.length) return false
  for (let i = 0; i < startsWith.length; i++) {
    if (base[i] !== startsWith[i]) return false
  }
  return true
}

export const defaultJsonValueReplacer = (key: string, value: unknown) => {
  if (typeof value === 'bigint') {
    try {
      return toNumber(value)
    } catch {
      return value.toString()
    }
  }
  return value
}
export const asJson = (
  value: unknown,
  replacer: (key: string, value: unknown) => unknown = defaultJsonValueReplacer,
  space?: string | number,
) => {
  return JSON.stringify(value, replacer, space)
}

/** Calculate minimum number of extra program pages required for provided approval and clear state programs */
export const calculateExtraProgramPages = (approvalProgram: Uint8Array, clearStateProgram?: Uint8Array): number => {
  return Math.floor((approvalProgram.length + (clearStateProgram?.length ?? 0) - 1) / APP_PAGE_MAX_SIZE)
}

/** Take a decoded ABI value and convert all byte arrays (including nested ones) from number[] to Uint8Arrays */
export function convertAbiByteArrays(value: ABIValue, type: ABIReturnType): ABIValue {
  // Return value as is if the type doesn't have any bytes or if it's already an Uint8Array
  if (!type.toString().includes('byte') || value instanceof Uint8Array) {
    return value
  }

  // Handle byte arrays (byte[N] or byte[])
  if (
    (type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) &&
    type.childType instanceof ABIByteType &&
    Array.isArray(value)
  ) {
    return new Uint8Array(value as number[])
  }

  // Handle other arrays (for nested structures)
  if ((type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType) && Array.isArray(value)) {
    const result = []
    for (let i = 0; i < value.length; i++) {
      result.push(convertAbiByteArrays(value[i], type.childType))
    }
    return result
  }

  // Handle tuples (for nested structures)
  if (type instanceof ABITupleType && Array.isArray(value)) {
    const result = []
    for (let i = 0; i < value.length && i < type.childTypes.length; i++) {
      result.push(convertAbiByteArrays(value[i], type.childTypes[i]))
    }
    return result
  }

  // For other types, return the value as is
  return value
}

/**
 * Convert bigint values to numbers for uint types with bit size < 53
 */
export const convertABIDecodedBigIntToNumber = (value: ABIValue, type: ABIType): ABIValue => {
  if (typeof value === 'bigint') {
    if (type instanceof ABIUintType) {
      return type.bitSize < 53 ? Number(value) : value
    } else {
      return value
    }
  } else if (Array.isArray(value) && (type instanceof ABIArrayStaticType || type instanceof ABIArrayDynamicType)) {
    return value.map((v) => convertABIDecodedBigIntToNumber(v, type.childType))
  } else if (Array.isArray(value) && type instanceof ABITupleType) {
    return value.map((v, i) => convertABIDecodedBigIntToNumber(v, type.childTypes[i]))
  } else {
    return value
  }
}
