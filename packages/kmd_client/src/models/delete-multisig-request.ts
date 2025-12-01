import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEMultisigRequest is the request for `DELETE /v1/multisig`
 */
export type DeleteMultisigRequest = {
  address: string
  walletHandleToken: string
  walletPassword: string
}

export const DeleteMultisigRequestMeta: ObjectModelMetadata<DeleteMultisigRequest> = {
  name: 'DeleteMultisigRequest',
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
