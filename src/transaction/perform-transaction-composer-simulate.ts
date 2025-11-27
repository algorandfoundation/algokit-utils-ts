import { RawSimulateOptions, SimulateOptions, TransactionComposer } from '../types/composer'

/**
 * @deprecated Use `composer.simulate` with
 *  - `allowEmptySignatures` flag set to true
 *  - `resultOnFailure` flag set to true
 *
 * Performs a simulation of the transactions loaded into the given TransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param composer The TransactionComposer with transaction(s) loaded.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performTransactionComposerSimulate(composer: TransactionComposer, options?: RawSimulateOptions) {
  const simulateOptions = {
    ...(options ?? {
      skipSignatures: true,
      allowEmptySignatures: true,
      fixSigners: true,
      allowMoreLogging: true,
      execTraceConfig: {
        enable: true,
        scratchChange: true,
        stackChange: true,
        stateChange: true,
      },
      resultOnFailure: true,
    }),
  } satisfies SimulateOptions

  const simulateResult = await composer.simulate(simulateOptions)
  return simulateResult.simulateResponse
}
