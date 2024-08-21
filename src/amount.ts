import algosdk from 'algosdk'
import { AlgoAmount } from './types/amount'

declare global {
  interface Number {
    microAlgos(this: number): AlgoAmount
    algos(this: number): AlgoAmount
  }
}

Number.prototype.microAlgos = function () {
  return AlgoAmount.MicroAlgos(this)
}

Number.prototype.algos = function () {
  return AlgoAmount.Algos(this)
}

/** Returns an amount of Algo using AlgoAmount
 * @param algos The amount of Algo
 */
export const algos = (algos: number) => {
  return AlgoAmount.Algos(algos)
}

/** Returns an amount of µAlgo using AlgoAmount
 * @param microAlgos The amount of µAlgo
 */
export const microAlgos = (microAlgos: number) => {
  return AlgoAmount.MicroAlgos(microAlgos)
}

/** Returns an amount of µAlgo to cover standard fees for the given number of transactions using AlgoAmount
 * @param numberOfTransactions The of standard transaction fees to return the amount of Algo
 */
export const transactionFees = (numberOfTransactions: number) => {
  return AlgoAmount.MicroAlgos(numberOfTransactions * algosdk.ALGORAND_MIN_TX_FEE)
}
