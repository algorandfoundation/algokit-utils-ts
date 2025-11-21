import {
  AlgodClient,
  SimulateRequest,
  SimulateRequestTransactionGroup,
  SimulateTraceConfig,
} from '@algorandfoundation/algokit-algod-client'
import { EMPTY_SIGNATURE } from '@algorandfoundation/algokit-common'
import { AtomicTransactionComposer } from '@algorandfoundation/sdk'

/**
 * Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAtomicTransactionComposerSimulate(
  atc: AtomicTransactionComposer,
  algod: AlgodClient,
  options?: Omit<SimulateRequest, 'txnGroups'>,
) {
  const transactionsWithSigners = atc.buildGroup()

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
      } satisfies SimulateTraceConfig,
    }),
    txnGroups: [
      {
        txns: transactionsWithSigners.map((txn) => ({
          txn: txn.txn,
          signature: EMPTY_SIGNATURE,
        })),
      } satisfies SimulateRequestTransactionGroup,
    ],
  } satisfies SimulateRequest
  const simulateResult = await algod.simulateTransaction(simulateRequest)
  return simulateResult
}
