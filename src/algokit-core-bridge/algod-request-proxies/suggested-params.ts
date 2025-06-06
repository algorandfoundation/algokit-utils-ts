import { AlgodApi } from '@algorandfoundation/algokit-algod-api'
import algosdk from 'algosdk'
import { callWithRetry } from '../../types/call-http-with-retry'
import { handleJSONResponse } from './utils'

export type SuggestedParamsRequest = ReturnType<algosdk.Algodv2['getTransactionParams']>

/**
 * This is a copy of the type `SuggestedParamsFromAlgod` from algosdk
 */
export type SuggestedParams = {
  flatFee: boolean
  fee: bigint
  minFee: bigint
  firstValid: bigint
  lastValid: bigint
  genesisID: string
  genesisHash: Uint8Array
  consensusVersion: string
}

export class SuggestedParamsProxy implements ProxyHandler<SuggestedParamsRequest> {
  constructor(private algodApi: AlgodApi) {}

  get(target: SuggestedParamsRequest, property: string | symbol) {
    if (property !== 'do') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any)[property]
    }

    return async () => {
      const responseContext = await callWithRetry(() => this.algodApi.transactionParamsResponse())
      const rawParams = await handleJSONResponse(responseContext, algosdk.modelsv2.TransactionParametersResponse)

      // This mapping logic was lifted from algosdk to ensure that we keep the same behaviour
      return {
        flatFee: false,
        fee: rawParams.fee,
        firstValid: rawParams.lastRound,
        lastValid: rawParams.lastRound + BigInt(1000),
        genesisID: rawParams.genesisId,
        genesisHash: rawParams.genesisHash,
        minFee: rawParams.minFee,
        consensusVersion: rawParams.consensusVersion,
      } satisfies SuggestedParams
    }
  }
}
