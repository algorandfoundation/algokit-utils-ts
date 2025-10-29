import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1DELETEKeyResponse is the response to `DELETE /v1/key`
 * friendly:DeleteKeyResponse
 */
export type DeleteKeyResponse = {
  error?: boolean
  message?: string
}

export const DeleteKeyResponseMeta: ModelMetadata = {
  name: 'DeleteKeyResponse',
  kind: 'object',
  fields: [
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
