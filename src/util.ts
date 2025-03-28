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
