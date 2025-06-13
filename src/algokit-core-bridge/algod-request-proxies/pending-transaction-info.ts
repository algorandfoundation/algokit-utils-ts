import { AlgodApi } from '@algorandfoundation/algokit-algod-api'
import algosdk from 'algosdk'
import { callWithRetry } from '../../types/call-http-with-retry'
import { handleMsgPackResponse } from './utils'

export type PendingTransactionInformationRequest = ReturnType<algosdk.Algodv2['pendingTransactionInformation']>

export class PendingTransactionInformationProxy implements ProxyHandler<PendingTransactionInformationRequest> {
  constructor(
    private algodApi: AlgodApi,
    private txid: string,
  ) {}

  get(target: PendingTransactionInformationRequest, property: string | symbol) {
    if (property !== 'do') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[property]
    }

    return async () => {
      const responseContext = await callWithRetry(() => this.algodApi.pendingTransactionInformationResponse(this.txid, 'msgpack'))
      return handleMsgPackResponse(responseContext, algosdk.modelsv2.PendingTransactionResponse)
    }
  }
}
