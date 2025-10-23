import { SimulateRequest, SimulateRequestTransactionGroup, SimulateTraceConfig } from '@algorandfoundation/algod-client'
import { decodeSignedTransaction } from '@algorandfoundation/algokit-transact'
import * as algosdk from '../sdk'
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer

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
  algod: Algodv2,
  options?: Omit<SimulateRequest, 'txnGroups'>,
) {
  const unsignedTransactionsSigners = atc.buildGroup()
  const decodedSignedTransactions = unsignedTransactionsSigners.map((ts) => algosdk.encodeUnsignedSimulateTransaction(ts.txn))

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
        txns: decodedSignedTransactions.map((txn) => decodeSignedTransaction(txn)),
      } satisfies SimulateRequestTransactionGroup,
    ],
  } satisfies SimulateRequest
  const simulateResult = await algod.simulateTransaction({ body: simulateRequest })
  return simulateResult
}
