import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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

export const GetWalletsResponseMeta: ObjectModelMetadata<GetWalletsResponse> = {
  name: 'GetWalletsResponse',
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
      name: 'wallets',
      wireKey: 'wallets',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(WalletMeta)),
    },
  ],
}
