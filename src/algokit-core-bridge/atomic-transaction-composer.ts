import { AlgodApi } from '@algorandfoundation/algokit-algod-api'
import algosdk, { TransactionSigner } from 'algosdk'
import { callWithRetry } from '../types/call-http-with-retry'
import { handleJSONResponse } from './algod-request-proxies/utils'

export type ExecuteParams = {
  maxRoundsToWaitForConfirmation?: number
}

export class AtomicTransactionComposer {
  private _algodApi: AlgodApi

  constructor(private _algodClient: algosdk.Algodv2) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const algodClient = (this._algodClient as any)._algoKitCoreAlgod as AlgodApi

    if (!algodClient) {
      throw new Error('The input algod client must be the AlgoKit core algod client')
    }

    this._algodApi = algodClient
  }

  // Inspired by algosdk AtomicTransactionComposer.gatherSignatures
  private async signTransactions(transactionsWithSigner: algosdk.TransactionWithSigner[]) {
    const txnGroup = transactionsWithSigner.map((txnWithSigner) => txnWithSigner.txn)

    const indexesPerSigner: Map<TransactionSigner, number[]> = new Map()

    for (let i = 0; i < transactionsWithSigner.length; i++) {
      const { signer } = transactionsWithSigner[i]

      if (!indexesPerSigner.has(signer)) {
        indexesPerSigner.set(signer, [])
      }

      indexesPerSigner.get(signer)!.push(i)
    }

    const orderedSigners = Array.from(indexesPerSigner)

    const batchedSigs = await Promise.all(orderedSigners.map(([signer, indexes]) => signer(txnGroup, indexes)))

    const signedTxns = orderedSigners.reduce((acc, [, indexes], signerIndex) => {
      indexes.forEach((txnIndex, i) => {
        acc[txnIndex] = batchedSigs[signerIndex][i]
      })
      return acc
    }, Array<Uint8Array | null>(transactionsWithSigner.length).fill(null))

    const fullyPopulated = signedTxns.every((s) => s != null)
    if (!fullyPopulated) {
      throw new Error(`Missing signatures. Got ${signedTxns}`)
    }

    return signedTxns as Array<Uint8Array>
  }

  public async execute(
    transactionsWithSigner: algosdk.TransactionWithSigner[],
    params: ExecuteParams,
  ): Promise<{
    confirmedRound: bigint
    txIDs: string[]
    methodResults: algosdk.ABIResult[]
  }> {
    const txIDs = transactionsWithSigner.map(({ txn }) => txn.txID())
    const signedTxns = await this.signTransactions(transactionsWithSigner)

    const responseContext = await callWithRetry(() => this._algodApi.rawTransactionResponse(new File(signedTxns, '')))
    // Call handle response for error handling purposes only
    await handleJSONResponse(responseContext, algosdk.modelsv2.PostTransactionsResponse)

    // TODO: when app call is supported, this should be the txId of the first app call txn
    const txIDToWaitFor = txIDs[0]

    const confirmedTxnInfo = await algosdk.waitForConfirmation(this._algodClient, txIDToWaitFor, params.maxRoundsToWaitForConfirmation ?? 5)

    return {
      confirmedRound: confirmedTxnInfo.confirmedRound!,
      txIDs,
      methodResults: [],
    }
  }
}
