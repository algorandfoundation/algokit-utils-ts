import algosdk from 'algosdk'
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import EncodedSignedTransaction = algosdk.EncodedSignedTransaction
import modelsv2 = algosdk.modelsv2

/**
 * Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAtomicTransactionComposerSimulate(atc: AtomicTransactionComposer, algod: Algodv2) {
  const unsignedTransactionsSigners = atc.buildGroup()
  const decodedSignedTransactions = unsignedTransactionsSigners.map((ts) => algosdk.encodeUnsignedSimulateTransaction(ts.txn))

  const simulateRequest = new modelsv2.SimulateRequest({
    allowEmptySignatures: true,
    allowMoreLogging: true,
    execTraceConfig: new modelsv2.SimulateTraceConfig({
      enable: true,
      scratchChange: true,
      stackChange: true,
      stateChange: true,
    }),
    txnGroups: [
      new modelsv2.SimulateRequestTransactionGroup({
        txns: decodedSignedTransactions.map((txn) => algosdk.decodeObj(txn)) as EncodedSignedTransaction[],
      }),
    ],
  })
  const simulateResult = await algod.simulateTransactions(simulateRequest).do()
  return simulateResult
}
