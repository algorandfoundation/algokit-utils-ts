import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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

export const PostWalletInfoResponseMeta: ObjectModelMetadata<PostWalletInfoResponse> = {
  name: 'PostWalletInfoResponse',
  kind: 'object',
  fields: [
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletHandle',
      wireKey: 'wallet_handle',
      optional: true,
      codec: new ObjectModelCodec(WalletHandleMeta),
    },
  ],
}
