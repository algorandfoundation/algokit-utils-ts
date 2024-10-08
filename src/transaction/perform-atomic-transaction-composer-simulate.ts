import algosdk, { SignedTransaction, decodeMsgpack } from 'algosdk'
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

  // Don't trigger any actual signatures
  const signer = algosdk.makeEmptyTransactionSigner()
  const signedTxns = await signer(
    unsignedTransactionsSigners.map((t) => t.txn),
    unsignedTransactionsSigners.map((_, i) => i),
  )

  // todo: This won't be needed once the fixSigners option is available
  const authAddrs = Object.fromEntries(
    (
      await Promise.all(
        unsignedTransactionsSigners.map((t) => t.txn.sender.toString()).map(async (s) => await algod.accountInformation(s).do()),
      )
    ).map((a) => [a.address, a.authAddr]),
  )

  const simulateRequest = new modelsv2.SimulateRequest({
    ...(options ?? {
      allowEmptySignatures: true,
      allowUnnamedResources: true,
      //todo: fixSigners: true, waiting for 3.26 to roll out https://github.com/algorand/go-algorand/pull/5942
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
        txns: signedTxns.map((txn) => {
          const stxn = decodeMsgpack(txn, SignedTransaction)
          // todo: This won't be needed once the fixSigners option is available
          const sender = stxn.txn.sender.toString()
          if (authAddrs[sender]) {
            const data = stxn.toEncodingData()
            data.set('sgnr', authAddrs[sender])
            return SignedTransaction.fromEncodingData(data)
          }
          return stxn
        }),
      }),
    ],
  })
  const simulateResult = await algod.simulateTransactions(simulateRequest).do()
  return simulateResult
}
