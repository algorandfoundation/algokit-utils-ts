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
    this.amountInMicroAlgo =
      'microAlgos' in amount
        ? BigInt(amount.microAlgos)
        : 'microAlgo' in amount
          ? BigInt(amount.microAlgo)
          : 'algos' in amount
            ? algosToMicroalgos(Number(amount.algos))
            : algosToMicroalgos(Number(amount.algo))
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

const MICROALGOS_TO_ALGOS_RATIO = 1e6
const MICROALGOS_IS_NOT_SAFE_NUMBER_ERROR_MSG = 'Microalgos must be a safe integer. Use bigint for values greater than 2^53 - 1.'
const MICROALGOS_NEGATIVE_ERROR_MSG = 'Microalgos should be positive.'

/**
 * microalgosToAlgos converts microalgos to algos
 * @param microalgos - number or bigint
 * @returns number
 */
function microalgosToAlgos(microalgos: number | bigint): number {
  if (typeof microalgos === 'bigint') {
    if (microalgos < 0n) {
      throw new Error(MICROALGOS_NEGATIVE_ERROR_MSG)
    }
    const whole = microalgos / BigInt(MICROALGOS_TO_ALGOS_RATIO)
    const remainder = microalgos % BigInt(MICROALGOS_TO_ALGOS_RATIO)
    return Number(whole) + Number(remainder) / 1e6
  }

  if (microalgos < 0) {
    throw new Error(MICROALGOS_NEGATIVE_ERROR_MSG)
  }
  if (!Number.isSafeInteger(microalgos)) {
    throw new Error(MICROALGOS_IS_NOT_SAFE_NUMBER_ERROR_MSG)
  }
  return microalgos / MICROALGOS_TO_ALGOS_RATIO
}

/**
 * algosToMicroalgos converts algos to microalgos
 * @param algos - number
 * @returns bigint
 */
function algosToMicroalgos(algos: number) {
  return BigInt(Math.round(algos * MICROALGOS_TO_ALGOS_RATIO))
}
