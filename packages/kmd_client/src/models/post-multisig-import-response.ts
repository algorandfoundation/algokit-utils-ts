import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTMultisigImportResponse is the response to `POST /v1/multisig/import`
 * friendly:ImportMultisigResponse
 */
export type PostMultisigImportResponse = {
  address?: string
  error?: boolean
  message?: string
}

export const PostMultisigImportResponseMeta: ModelMetadata = {
  name: 'PostMultisigImportResponse',
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
