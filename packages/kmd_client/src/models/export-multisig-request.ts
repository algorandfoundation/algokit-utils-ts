import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, addressCodec } from '@algorandfoundation/algokit-common'

/**
 * The request for `POST /v1/multisig/export`
 */
export type ExportMultisigRequest = {
  address: Address
  walletHandleToken: string
}

export const ExportMultisigRequestMeta: ObjectModelMetadata<ExportMultisigRequest> = {
  name: 'ExportMultisigRequest',
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
  ],
}
