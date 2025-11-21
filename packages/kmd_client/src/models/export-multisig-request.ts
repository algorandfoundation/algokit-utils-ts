import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigExportRequest is the request for `POST /v1/multisig/export`
 */
export type ExportMultisigRequest = {
  address?: string
  walletHandleToken?: string
}

export const ExportMultisigRequestMeta: ObjectModelMetadata = {
  name: 'ExportMultisigRequest',
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
  ],
}
