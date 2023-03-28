import algosdk from 'algosdk'
import { AlgoAmount } from './types/amount'

/** Returns an amount of Algos using @see AlgoAmount */
export const algos = (algos: number) => {
  return AlgoAmount.Algos(algos)
}

/** Returns an amount of µAlgos using @see AlgoAmount */
export const microAlgos = (microAlgos: number) => {
  return AlgoAmount.MicroAlgos(microAlgos)
}

/** Returns an amount of µAlgos to cover standard fees for the given number of transactions using @see AlgoAmount */
export const transactionFees = (numberOfTransactions: number) => {
  return AlgoAmount.MicroAlgos(numberOfTransactions * algosdk.ALGORAND_MIN_TX_FEE)
}
