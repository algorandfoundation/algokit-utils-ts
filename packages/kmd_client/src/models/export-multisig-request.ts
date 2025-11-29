import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigExportRequest is the request for `POST /v1/multisig/export`
 */
export type ExportMultisigRequest = {
  address?: string
  walletHandleToken?: string
}

export const ExportMultisigRequestMeta: ObjectModelMetadata<ExportMultisigRequest> = {
  name: 'ExportMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      codec: stringCodec,
    },
  ],
}
