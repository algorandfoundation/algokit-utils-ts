import type { ModelMetadata } from '../core/model-runtime'

/**
 * APIV1POSTProgramSignResponse is the response to `POST /v1/data/sign`
 * friendly:SignProgramResponse
 */
export type PostProgramSignResponse = {
  error?: boolean
  message?: string
  sig?: Uint8Array
}

export const PostProgramSignResponseMeta: ModelMetadata = {
  name: 'PostProgramSignResponse',
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
      name: 'sig',
      wireKey: 'sig',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
