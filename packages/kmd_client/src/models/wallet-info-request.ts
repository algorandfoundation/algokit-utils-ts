import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletInfoRequest is the request for `POST /v1/wallet/info`
 */
export type WalletInfoRequest = {
  walletHandleToken?: string
}

export const WalletInfoRequestMeta: ObjectModelMetadata = {
  name: 'WalletInfoRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
