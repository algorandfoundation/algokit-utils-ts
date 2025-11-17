import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEKeyRequest is the request for `DELETE /v1/key`
 */
export type DeleteKeyRequest = {
  address?: string
  walletHandleToken?: string
  walletPassword?: string
}

export const DeleteKeyRequestMeta: ModelMetadata = {
  name: 'DeleteKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
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
