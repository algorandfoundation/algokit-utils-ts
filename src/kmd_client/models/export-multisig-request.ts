import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigExportRequest is the request for `POST /v1/multisig/export`
 */
export type ExportMultisigRequest = {
  address?: string
  walletHandleToken?: string
}

export const ExportMultisigRequestMeta: ModelMetadata = {
  name: 'ExportMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
