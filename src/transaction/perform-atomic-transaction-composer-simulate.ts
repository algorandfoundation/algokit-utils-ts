import { RawSimulateOptions, TransactionComposer } from 'src/types/composer'

/**
 * Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAtomicTransactionComposerSimulate(composer: TransactionComposer, options?: RawSimulateOptions) {
  const simulateOptions = options ?? {
    allowEmptySignatures: true,
    fixSigners: true,
    allowMoreLogging: true,
    execTraceConfig: {
      enable: true,
      scratchChange: true,
      stackChange: true,
      stateChange: true,
    },
    skipSignatures: true,
  }
  const { simulateResponse } = await composer.simulate(simulateOptions)
  return simulateResponse
}
