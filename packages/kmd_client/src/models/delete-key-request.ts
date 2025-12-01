import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEKeyRequest is the request for `DELETE /v1/key`
 */
export type DeleteKeyRequest = {
  address: string
  walletHandleToken: string
  walletPassword: string
}

export const DeleteKeyRequestMeta: ObjectModelMetadata<DeleteKeyRequest> = {
  name: 'DeleteKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'walletPassword',
      wireKey: 'wallet_password',
      optional: false,
      codec: stringCodec,
    },
  ],
}
