import algosdk from 'algosdk'

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
    return algosdk.microalgosToAlgos(Number(this.amountInMicroAlgo))
  }

  /** Return the amount as a number in Algo */
  get algo() {
    return algosdk.microalgosToAlgos(Number(this.amountInMicroAlgo))
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
            ? BigInt(algosdk.algosToMicroalgos(Number(amount.algos)))
            : BigInt(algosdk.algosToMicroalgos(Number(amount.algo)))
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
