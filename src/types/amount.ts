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

  /** Create a @see {AlgoAmount} object representing the given number of Algos */
  static Algos(amount: number) {
    return new AlgoAmount({ algos: amount })
  }

  /** Create a @see {AlgoAmount} object representing the given number of µAlgos */
  static MicroAlgos(amount: number) {
    return new AlgoAmount({ microAlgos: amount })
  }
}
