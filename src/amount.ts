import { AlgoAmount } from './types/amount'

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
