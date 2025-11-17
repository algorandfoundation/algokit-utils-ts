import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletRenameRequest is the request for `POST /v1/wallet/rename`
 */
export type RenameWalletRequest = {
  walletId?: string
  walletName?: string
  walletPassword?: string
}

export const RenameWalletRequestMeta: ModelMetadata = {
  name: 'RenameWalletRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletId',
      wireKey: 'wallet_id',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletName',
      wireKey: 'wallet_name',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
