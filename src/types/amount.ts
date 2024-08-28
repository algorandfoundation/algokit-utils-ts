import algosdk from 'algosdk'

/** Wrapper class to ensure safe, explicit conversion between µAlgo, Algo and numbers */
export class AlgoAmount {
  private amountInMicroAlgo

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
    return algosdk.microalgosToAlgos(this.amountInMicroAlgo)
  }

  /** Return the amount as a number in Algo */
  get algo() {
    return algosdk.microalgosToAlgos(this.amountInMicroAlgo)
  }

  constructor(amount: { algos: number } | { algo: number } | { microAlgos: number } | { microAlgo: number }) {
    this.amountInMicroAlgo =
      'microAlgos' in amount
        ? amount.microAlgos
        : 'microAlgo' in amount
          ? amount.microAlgo
          : 'algos' in amount
            ? algosdk.algosToMicroalgos(amount.algos)
            : algosdk.algosToMicroalgos(amount.algo)
  }

  toString(): string {
    return `${this.microAlgo.toLocaleString('en-US')} µALGO`
  }

  /** valueOf allows you to use `AlgoAmount` in comparison operations such as `<` and `>=` etc.,
   * but it's not recommended to use this to convert to a number, it's much safer to explicitly call
   * the algos or microAlgos properties
   */
  valueOf(): number {
    return this.microAlgo
  }

  /** Create a `AlgoAmount` object representing the given number of Algo */
  static Algos(amount: number) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of Algo */
  static Algo(amount: number) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of µAlgo */
  static MicroAlgos(amount: number) {
    return new AlgoAmount({ microAlgos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of µAlgo */
  static MicroAlgo(amount: number) {
    return new AlgoAmount({ microAlgos: amount })
  }
}
