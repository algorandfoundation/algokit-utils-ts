import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'sig',
      wireKey: 'sig',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
