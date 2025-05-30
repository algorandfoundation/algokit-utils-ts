import { PromiseAlgodApi as AlgodApi } from '@algorandfoundation/algokit-algod-api/types/PromiseAPI'
import algosdk, { SignedTransaction, TransactionType, decodeSignedTransaction } from 'algosdk'
import { callWithRetry } from '../../types/call-http-with-retry'
import { handleJSONResponse } from './utils'

export type SendRawTransactionRequest = ReturnType<algosdk.Algodv2['sendRawTransaction']>

export class SendRawTransactionProxy implements ProxyHandler<SendRawTransactionRequest> {
  constructor(
    private algodApi: AlgodApi,
    private stxOrStxs: Uint8Array | Uint8Array[],
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(target: SendRawTransactionRequest, property: string | symbol, receiver: any) {
    if (property !== 'do') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[property]
    }

    return async () => {
      // Currently, a single payment transaction is sent with the new algod-api
      // The rest are sent with algosdk Algod
      const txnBytes = !Array.isArray(this.stxOrStxs) ? this.stxOrStxs : this.stxOrStxs.length === 1 ? this.stxOrStxs[0] : undefined
      if (txnBytes) {
        let signedTxn: SignedTransaction | undefined = undefined
        try {
          // Try to decode the data into a single transaction
          signedTxn = decodeSignedTransaction(txnBytes)
        } catch {
          // Ignore errors here
        }
        if (signedTxn && signedTxn.txn.type === TransactionType.pay) {
          const responseContext = await callWithRetry(() => this.algodApi.rawTransactionResponse(new File([txnBytes], '')))

          return handleJSONResponse(responseContext, algosdk.modelsv2.PostTransactionsResponse)
        }
      }

      return target[property].call(receiver)
    }
  }
}
