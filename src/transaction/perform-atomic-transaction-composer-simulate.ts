import { AlgodClient, SimulateRequest } from '@algorandfoundation/algokit-algod-client'
import { EMPTY_SIGNATURE } from '@algorandfoundation/algokit-common'
import { groupTransactions } from '@algorandfoundation/algokit-transact'
import { RawSimulateOptions, TransactionComposer } from '../types/composer'

/**
 * Performs a simulation of the transactions loaded into the given TransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param composer The TransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAtomicTransactionComposerSimulate(
  composer: TransactionComposer,
  algod: AlgodClient,
  options?: RawSimulateOptions,
) {
  // NOTE: the existing version takes atc as params, then call atc.buildGroup to get the transactions
  // The state of the atc is unknown, whether it has resource populated or not
  // In this version, we use the raw transactions because there is a chance that resource population would fail

  let transactions = (await composer.buildTransactions()).transactions
  if (transactions.length > 1) {
    transactions = groupTransactions(transactions)
  }

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
