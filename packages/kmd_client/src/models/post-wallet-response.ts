import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1POSTWalletResponse is the response to `POST /v1/wallet`
 * friendly:CreateWalletResponse
 */
export type PostWalletResponse = {
  error?: boolean
  message?: string
  wallet?: Wallet
}

export const PostWalletResponseMeta: ObjectModelMetadata = {
  name: 'PostWalletResponse',
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
      name: 'wallet',
      wireKey: 'wallet',
      optional: true,
      nullable: false,
      codec: new ModelCodec(WalletMeta),
    },
  ],
}
