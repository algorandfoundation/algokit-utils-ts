import * as algosdk from '../sdk'
import { decodeSignedTransaction } from '@algorandfoundation/algokit-transact'
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import modelsv2 = algosdk.modelsv2

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
  options?: Omit<ConstructorParameters<typeof modelsv2.SimulateRequest>[0], 'txnGroups'>,
) {
  const unsignedTransactionsSigners = atc.buildGroup()
  const decodedSignedTransactions = unsignedTransactionsSigners.map((ts) => algosdk.encodeUnsignedSimulateTransaction(ts.txn))

  const simulateRequest = new modelsv2.SimulateRequest({
    ...(options ?? {
      allowEmptySignatures: true,
      fixSigners: true,
      allowMoreLogging: true,
      execTraceConfig: new modelsv2.SimulateTraceConfig({
        enable: true,
        scratchChange: true,
        stackChange: true,
        stateChange: true,
      }),
    }),
    txnGroups: [
      new modelsv2.SimulateRequestTransactionGroup({
        txns: decodedSignedTransactions.map((txn) => decodeSignedTransaction(txn)),
      }),
    ],
  })
  const simulateResult = await algod.simulateTransactions(simulateRequest).do()
  return simulateResult
}
