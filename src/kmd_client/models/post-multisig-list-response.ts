import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigListResponse is the response to `POST /v1/multisig/list`
 * friendly:ListMultisigResponse
 */
export type PostMultisigListResponse = {
  addresses?: string[]
  error?: boolean
  message?: string
}

export const PostMultisigListResponseMeta: ModelMetadata = {
  name: 'PostMultisigListResponse',
  kind: 'object',
  fields: [
    {
      name: 'addresses',
      wireKey: 'addresses',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
