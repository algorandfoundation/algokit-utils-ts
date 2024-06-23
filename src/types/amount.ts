import algosdk from 'algosdk'

/** Wrapper class to ensure safe, explicit conversion between µAlgos, Algos and numbers */
export class AlgoAmount {
  private amountInMicroAlgos

  /** Return the amount as a number in µAlgos */
  get microAlgos() {
    return this.amountInMicroAlgos
  }

  /** Return the amount as a number in Algos */
  get algos() {
    return algosdk.microalgosToAlgos(this.amountInMicroAlgos)
  }

  constructor(amount: { algos: number } | { microAlgos: number }) {
    this.amountInMicroAlgos = 'microAlgos' in amount ? amount.microAlgos : algosdk.algosToMicroalgos(amount.algos)
  }

  toString(): string {
    return `${this.microAlgos.toLocaleString('en-US')} µAlgo${this.microAlgos === 1 ? '' : 's'}`
  }

  /** valueOf allows you to use `AlgoAmount` in comparison operations such as `<` and `>=` etc.,
   * but it's not recommended to use this to convert to a number, it's much safer to explicitly call
   * the algos or microAlgos properties
   */
  valueOf(): number {
    return this.microAlgos
  }

  /** Create a `AlgoAmount` object representing the given number of Algos */
  static Algos(amount: number) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a `AlgoAmount` object representing the given number of µAlgos */
  static MicroAlgos(amount: number) {
    return new AlgoAmount({ microAlgos: amount })
  }
}
