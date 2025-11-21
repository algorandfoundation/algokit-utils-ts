import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyListRequest is the request for `POST /v1/key/list`
 */
export type ListKeysRequest = {
  walletHandleToken?: string
}

export const ListKeysRequestMeta: ModelMetadata = {
  name: 'ListKeysRequest',
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
