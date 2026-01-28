/** Wrapper class to ensure safe, explicit conversion between µAlgo, Algo and numbers */
export class AlgoAmount {
  private amountInMicroAlgo: bigint

  /** Return the amount as a number in µAlgo */
  get microAlgos() {
    return this.amountInMicroAlgo
  }

  /** Return the amount as a number in µAlgo */
  get microAlgo() {
    return this.amountInMicroAlgo
  }

  /** Return the amount as a number in Algo */
  get algos() {
    return microalgosToAlgos(Number(this.amountInMicroAlgo))
  }

  /** Return the amount as a number in Algo */
  get algo() {
    return microalgosToAlgos(Number(this.amountInMicroAlgo))
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
            ? BigInt(algosToMicroalgos(Number(amount.algos)))
            : BigInt(algosToMicroalgos(Number(amount.algo)))
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
const INVALID_MICROALGOS_ERROR_MSG = 'Microalgos should be positive and less than 2^53 - 1.'

/**
 * microalgosToAlgos converts microalgos to algos
 * @param microalgos - number
 * @returns number
 */
function microalgosToAlgos(microalgos: number) {
  if (microalgos < 0 || !Number.isSafeInteger(microalgos)) {
    throw new Error(INVALID_MICROALGOS_ERROR_MSG)
  }
  return microalgos / MICROALGOS_TO_ALGOS_RATIO
}

/**
 * algosToMicroalgos converts algos to microalgos
 * @param algos - number
 * @returns number
 */
function algosToMicroalgos(algos: number) {
  const microalgos = algos * MICROALGOS_TO_ALGOS_RATIO
  return Math.round(microalgos)
}

declare global {
  interface Number {
    /**
     * Returns an `AlgoAmount` using this number of microAlgo.
     */
    microAlgos(this: number): AlgoAmount
    /**
     * Returns an `AlgoAmount` using this number of Algo.
     */
    algos(this: number): AlgoAmount
    /**
     * Returns an `AlgoAmount` using this number of microAlgo.
     */
    microAlgo(this: number): AlgoAmount
    /**
     * Returns an `AlgoAmount` using this number of Algo.
     */
    algo(this: number): AlgoAmount
  }
  interface BigInt {
    /**
     * Returns an `AlgoAmount` using this number of microAlgo.
     */
    microAlgo(this: bigint): AlgoAmount
    /**
     * Returns an `AlgoAmount` using this number of Algo.
     */
    algo(this: bigint): AlgoAmount
  }
}

Number.prototype.microAlgos = function () {
  return AlgoAmount.MicroAlgo(this)
}

Number.prototype.algos = function () {
  return AlgoAmount.Algo(this)
}

Number.prototype.microAlgo = function () {
  return AlgoAmount.MicroAlgo(this)
}

Number.prototype.algo = function () {
  return AlgoAmount.Algo(this)
}

BigInt.prototype.microAlgo = function () {
  return AlgoAmount.MicroAlgo(this)
}

BigInt.prototype.algo = function () {
  return AlgoAmount.Algo(this)
}

/** Returns an amount of Algo using AlgoAmount
 * @param algos The amount of Algo
 */
export const algos = (algos: number | bigint) => {
  return AlgoAmount.Algo(algos)
}

/** Returns an amount of Algo using AlgoAmount
 * @param algos The amount of Algo
 */
export const algo = (algos: number | bigint) => {
  return AlgoAmount.Algo(algos)
}

/** Returns an amount of µAlgo using AlgoAmount
 * @param microAlgos The amount of µAlgo
 */
export const microAlgos = (microAlgos: number | bigint) => {
  return AlgoAmount.MicroAlgo(microAlgos)
}

/** Returns an amount of µAlgo using AlgoAmount
 * @param microAlgos The amount of µAlgo
 */
export const microAlgo = (microAlgos: number | bigint) => {
  return AlgoAmount.MicroAlgo(microAlgos)
}

/** Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount
 * @param numberOfTransactions The of standard transaction fees to return the amount of Algo
 */
export const transactionFees = (numberOfTransactions: number) => {
  return AlgoAmount.MicroAlgo(BigInt(numberOfTransactions) * ALGORAND_MIN_TX_FEE.microAlgo)
}

export const ALGORAND_MIN_TX_FEE = AlgoAmount.MicroAlgo(1_000)
