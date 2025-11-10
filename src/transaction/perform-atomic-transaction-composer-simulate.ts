import { AlgodClient, SimulateRequest } from '@algorandfoundation/algokit-algod-client'
import { EMPTY_SIGNATURE } from '@algorandfoundation/algokit-common'
import { RawSimulateOptions, TransactionComposer } from '../types/composer'

/**
 * Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAtomicTransactionComposerSimulate(
  composer: TransactionComposer,
  algod: AlgodClient,
  options?: RawSimulateOptions,
) {
  const transactions = (await composer.buildTransactions()).transactions

  const simulateRequest = {
    ...(options ?? {
      allowEmptySignatures: true,
      fixSigners: true,
      allowMoreLogging: true,
      execTraceConfig: {
        enable: true,
        scratchChange: true,
        stackChange: true,
        stateChange: true,
      },
    }),
    txnGroups: [
      {
        txns: transactions.map((txn) => ({
          txn: txn,
          signature: EMPTY_SIGNATURE,
        })),
      },
    ],
  } satisfies SimulateRequest
  const simulateResult = await algod.simulateTransaction(simulateRequest)
  return simulateResult
}
