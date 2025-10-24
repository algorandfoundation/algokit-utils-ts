import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTKeyExportResponse is the response to `POST /v1/key/export`
 * friendly:ExportKeyResponse
 */
export type PostKeyExportResponse = {
  error?: boolean
  message?: string
  privateKey?: Uint8Array
}

export const PostKeyExportResponseMeta: ModelMetadata = {
  name: 'PostKeyExportResponse',
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
    {
      name: 'privateKey',
      wireKey: 'private_key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
