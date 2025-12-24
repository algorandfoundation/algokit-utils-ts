const MICROALGOS_TO_ALGOS_RATIO = 1e6
const NOT_SAFE_INTEGER_ERROR_MSG = 'Number must be a safe integer. Use bigint for values greater than 2^53 - 1.'
const MICROALGOS_NOT_INTEGER_ERROR_MSG = 'microAlgos must be a whole number.'
const NEGATIVE_VALUE_ERROR_MSG = 'Value must be positive.'
// Max microAlgos before precision loss in algo conversion: MAX_SAFE_INTEGER * 1e6
// This is ~9 quadrillion microAlgos (~9 billion algos), well above Algorand's 10 billion max supply
const MAX_MICROALGOS = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(MICROALGOS_TO_ALGOS_RATIO)
const EXCEEDS_MAX_MICROALGOS_ERROR_MSG = `microAlgos cannot exceed ${MAX_MICROALGOS} to maintain precision.`

/**
 * microalgosToAlgos converts microalgos to algos
 * @param microalgos - bigint
 * @returns number
 */
function microalgosToAlgos(microalgos: bigint): number {
  // If within safe integer range, convert to number for simpler calculation
  if (microalgos <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(microalgos) / MICROALGOS_TO_ALGOS_RATIO
  }

  // For large values, split into whole and remainder to preserve precision
  const whole = microalgos / BigInt(MICROALGOS_TO_ALGOS_RATIO)
  const remainder = microalgos % BigInt(MICROALGOS_TO_ALGOS_RATIO)
  return Number(whole) + Number(remainder) / MICROALGOS_TO_ALGOS_RATIO
}

/** Wrapper class to ensure safe, explicit conversion between µAlgo, Algo and numbers */
export class AlgoAmount {
  private amountInMicroAlgo: bigint

  /** Return the amount as a bigint in µAlgo */
  get microAlgos() {
    return this.amountInMicroAlgo
  }

  /** Return the amount as a bigint in µAlgo */
  get microAlgo() {
    return this.amountInMicroAlgo
  }

  /** Return the amount as a number in Algo */
  get algos() {
    return microalgosToAlgos(this.amountInMicroAlgo)
  }

  /** Return the amount as a number in Algo */
  get algo() {
    return microalgosToAlgos(this.amountInMicroAlgo)
  }

  /**
   * Create a new `AlgoAmount` instance.
   *
   * @param amount - An object specifying the amount in Algo or µALGO. Use the key 'algo' for Algo amounts and 'microAlgo' for µALGO.
   * @returns A new instance of `AlgoAmount` representing the specified amount.
   * @example
   * ```typescript
   * const amount = new AlgoAmount({ algo: 5 });
   * ```
   */
  constructor(
    amount: { algos: number | bigint } | { algo: number | bigint } | { microAlgos: number | bigint } | { microAlgo: number | bigint },
  ) {
    // Handle microAlgos input - the smallest unit, must be a whole number
    if ('microAlgos' in amount || 'microAlgo' in amount) {
      const value = 'microAlgos' in amount ? amount.microAlgos : amount.microAlgo
      if (typeof value === 'bigint') {
        if (value < 0n) {
          throw new Error(NEGATIVE_VALUE_ERROR_MSG)
        }
        if (value > MAX_MICROALGOS) {
          throw new Error(EXCEEDS_MAX_MICROALGOS_ERROR_MSG)
        }
        this.amountInMicroAlgo = value
      } else {
        // Numbers must be whole (microAlgos is indivisible) and within safe integer range
        if (value < 0) {
          throw new Error(NEGATIVE_VALUE_ERROR_MSG)
        }
        if (!Number.isInteger(value)) {
          throw new Error(MICROALGOS_NOT_INTEGER_ERROR_MSG)
        }
        if (value > Number.MAX_SAFE_INTEGER) {
          throw new Error(NOT_SAFE_INTEGER_ERROR_MSG)
        }
        this.amountInMicroAlgo = BigInt(value)
      }
    } else {
      // Handle algos input - convert to microAlgos (multiply by 1,000,000)
      const value = 'algos' in amount ? amount.algos : amount.algo
      if (typeof value === 'bigint') {
        if (value < 0n) {
          throw new Error(NEGATIVE_VALUE_ERROR_MSG)
        }
        const microAlgos = value * BigInt(MICROALGOS_TO_ALGOS_RATIO)
        if (microAlgos > MAX_MICROALGOS) {
          throw new Error(EXCEEDS_MAX_MICROALGOS_ERROR_MSG)
        }
        this.amountInMicroAlgo = microAlgos
      } else {
        // Numbers can be fractional (e.g., 1.5 algos), but must be within safe range
        // Use Math.round to handle floating-point precision (e.g., 0.000001 * 1e6 = 0.9999...)
        if (value < 0) {
          throw new Error(NEGATIVE_VALUE_ERROR_MSG)
        }
        if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
          throw new Error(NOT_SAFE_INTEGER_ERROR_MSG)
        }
        this.amountInMicroAlgo = BigInt(Math.round(value * MICROALGOS_TO_ALGOS_RATIO))
      }
    }
  }

  toString(): string {
    return `${this.microAlgo.toLocaleString('en-US')} µALGO`
  }

  /** valueOf allows you to use `AlgoAmount` in comparison operations such as `<` and `>=` etc.,
   * but it's not recommended to use this to convert to a number, it's much safer to explicitly call
   * the algos or microAlgos properties
   */
  valueOf(): number {
    return Number(this.microAlgo)
  }

  /** Create a `AlgoAmount` object representing the given number of Algo */
  static Algos(amount: number | bigint) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of Algo */
  static Algo(amount: number | bigint) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of µAlgo */
  static MicroAlgos(amount: number | bigint) {
    return new AlgoAmount({ microAlgos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of µAlgo */
  static MicroAlgo(amount: number | bigint) {
    return new AlgoAmount({ microAlgos: amount })
  }
}
