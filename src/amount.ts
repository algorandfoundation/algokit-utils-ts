import { AlgoAmount } from './types/amount'

/** Returns an amount of Algos using @see AlgoAmount */
export const algos = (algos: number) => {
  return AlgoAmount.Algos(algos)
}

/** Returns an amount of µAlgos using @see AlgoAmount */
export const microAlgos = (microAlgos: number) => {
  return AlgoAmount.MicroAlgos(microAlgos)
}
