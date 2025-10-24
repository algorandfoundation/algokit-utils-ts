import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyResponse is the response to `POST /v1/key`
 * friendly:GenerateKeyResponse
 */
export type PostKeyResponse = {
  address?: string
  error?: boolean
  message?: string
}

export const PostKeyResponseMeta: ModelMetadata = {
  name: 'PostKeyResponse',
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
