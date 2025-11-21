import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { WalletHandle } from './wallet-handle'
import { WalletHandleMeta } from './wallet-handle'

/**
 * APIV1POSTWalletInfoResponse is the response to `POST /v1/wallet/info`
 * friendly:WalletInfoResponse
 */
export type PostWalletInfoResponse = {
  error?: boolean
  message?: string
  walletHandle?: WalletHandle
}

export const PostWalletInfoResponseMeta: ObjectModelMetadata = {
  name: 'PostWalletInfoResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletHandle',
      wireKey: 'wallet_handle',
      optional: true,
      nullable: false,
      codec: new ModelCodec(WalletHandleMeta),
    },
  ],
}
