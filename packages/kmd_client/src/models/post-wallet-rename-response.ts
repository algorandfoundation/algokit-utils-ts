import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1POSTWalletRenameResponse is the response to `POST /v1/wallet/rename`
 * friendly:RenameWalletResponse
 */
export type PostWalletRenameResponse = {
  error?: boolean
  message?: string
  wallet?: Wallet
}

export const PostWalletRenameResponseMeta: ModelMetadata = {
  name: 'PostWalletRenameResponse',
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
