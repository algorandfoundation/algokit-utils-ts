import { RawSimulateOptions, SimulateOptions, TransactionComposer } from '../types/composer'

/**
 * Performs a simulation of the transactions loaded into the given TransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param composer The TransactionComposer with transaction(s) loaded.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performTransactionComposerSimulate(composer: TransactionComposer, options?: RawSimulateOptions) {
  // NOTE: the existing version takes atc as params, then call atc.buildGroup to get the transactions
  // The state of the atc is unknown, whether it has resource populated or not
  // In this version, we call composer.simulate which doesn't do resource population

  const simulateOptions = {
    ...options,
    allowEmptySignatures: true,
  } satisfies SimulateOptions

  const simulateResult = await composer.simulate(simulateOptions)
  return simulateResult.simulateResponse
}
