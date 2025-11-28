import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletRenameRequest is the request for `POST /v1/wallet/rename`
 */
export type RenameWalletRequest = {
  walletId?: string
  walletName?: string
  walletPassword?: string
}

export const RenameWalletRequestMeta: ObjectModelMetadata<RenameWalletRequest> = {
  name: 'RenameWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletId',
      wireKey: 'wallet_id',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletName',
      wireKey: 'wallet_name',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      codec: stringCodec,
    },
  ],
}
