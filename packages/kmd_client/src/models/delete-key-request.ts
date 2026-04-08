import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, addressCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `DELETE /v1/key`
 */
export type DeleteKeyRequest = {
  address: Address
  walletHandleToken: string
  walletPassword?: string
}

export const DeleteKeyRequestMeta: ObjectModelMetadata<DeleteKeyRequest> = {
  name: 'DeleteKeyRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
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
      optional: true,
      codec: stringCodec,
    },
  ],
}
