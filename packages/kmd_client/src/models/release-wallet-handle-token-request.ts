import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTWalletReleaseRequest is the request for `POST /v1/wallet/release`
 */
export type ReleaseWalletHandleTokenRequest = {
  walletHandleToken?: string
}

export const ReleaseWalletHandleTokenRequestMeta: ObjectModelMetadata = {
  name: 'ReleaseWalletHandleTokenRequest',
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
