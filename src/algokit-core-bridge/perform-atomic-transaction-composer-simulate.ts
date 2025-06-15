import { AlgodApi, SimulateRequest, SimulateRequestTransactionGroup, SimulateTraceConfig } from '@algorandfoundation/algokit-algod-api'
import { Transaction as AlgoKitCoreTransaction, encodeSignedTransactions } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'
import { handleMsgPackResponse } from '../algokit-core-bridge/algod-request-proxies/utils'

/**
 * Performs a simulation of the transactions loaded into the given AtomicTransactionComposer.
 * Uses empty transaction signers for all transactions.
 *
 * @param atc The AtomicTransactionComposer with transaction(s) loaded.
 * @param algod An Algod client to perform the simulation.
 * @returns The simulation result, which includes various details about how the transactions would be processed.
 */
export async function performAlgoKitCoreAtomicTransactionComposerSimulate(
  transactions: AlgoKitCoreTransaction[],
  algod: AlgodApi,
): Promise<algosdk.modelsv2.SimulateResponse> {
  // Encoded with an empty signer, as we have allowEmptySignatures enabled
  const encodedSignedTransactions = encodeSignedTransactions(transactions.map((txn) => ({ transaction: txn })))

  const simulateRequest = {
    allowEmptySignatures: true,
    fixSigners: true,
    allowMoreLogging: true,
    execTraceConfig: {
      enable: true,
      scratchChange: true,
      stackChange: true,
      stateChange: true,
    } satisfies SimulateTraceConfig,
    txnGroups: [
      {
        txns: encodedSignedTransactions.map((txn) => Buffer.from(txn).toString('base64')),
      } satisfies SimulateRequestTransactionGroup,
    ],
  } satisfies SimulateRequest

  const simulateResponseContext = await algod.simulateTransactionResponse(simulateRequest, 'msgpack', {
    headers: { 'Content-Type': `application/msgpack` },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  return await handleMsgPackResponse(simulateResponseContext, algosdk.modelsv2.SimulateResponse)
}
