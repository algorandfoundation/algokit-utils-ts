import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigListRequest is the request for `POST /v1/multisig/list`
 */
export type ListMultisigRequest = {
  walletHandleToken?: string
}

export const ListMultisigRequestMeta: ModelMetadata = {
  name: 'ListMultisigRequest',
  kind: 'object',
  fields: [
    {
      name: 'walletHandleToken',
      wireKey: 'wallet_handle_token',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
