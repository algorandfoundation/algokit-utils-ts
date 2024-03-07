import { ABIValue } from 'algosdk'

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
  minSpendingBalance: number,
  currentSpendingBalance: number,
  minFundingIncrement: number,
): number | null => {
  if (minSpendingBalance > currentSpendingBalance) {
    const minFundAmount = minSpendingBalance - currentSpendingBalance
    return Math.max(minFundAmount, minFundingIncrement)
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
 * Checks if the value of x is a valid ABIValue
 * @param x A value to check
 *
 * @returns true if x is a valid ABIValue else false
 */
export function isAbiValue(x: unknown): x is ABIValue {
  if (Array.isArray(x)) return x.length == 0 || x.every(isAbiValue)

  return ['boolean', 'number', 'bigint', 'string', 'Uint8Array'].includes(typeof x)
}
