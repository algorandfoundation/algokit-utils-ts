import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * APIV1GETWalletsResponse is the response to `GET /v1/wallets`
 * friendly:ListWalletsResponse
 */
export type GetWalletsResponse = {
  error?: boolean
  message?: string
  wallets?: Wallet[]
}

export const GetWalletsResponseMeta: ModelMetadata = {
  name: 'GetWalletsResponse',
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
      name: 'wallets',
      wireKey: 'wallets',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(WalletMeta)),
    },
  ],
}
