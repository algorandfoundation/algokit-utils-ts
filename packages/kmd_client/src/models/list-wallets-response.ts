import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { Wallet } from './wallet'
import { WalletMeta } from './wallet'

/**
 * ListWalletsResponse is the response to `GET /v1/wallets`
 */
export type ListWalletsResponse = {
  wallets: Wallet[]
}

export const ListWalletsResponseMeta: ObjectModelMetadata<ListWalletsResponse> = {
  name: 'ListWalletsResponse',
  kind: 'object',
  fields: [
    {
      name: 'wallets',
      wireKey: 'wallets',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(WalletMeta)),
    },
  ],
}
