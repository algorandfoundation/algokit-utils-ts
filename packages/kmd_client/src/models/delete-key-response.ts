import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEKeyResponse is the response to `DELETE /v1/key`
 * friendly:DeleteKeyResponse
 */
export type DeleteKeyResponse = {
  error?: boolean
  message?: string
}

export const DeleteKeyResponseMeta: ObjectModelMetadata = {
  name: 'DeleteKeyResponse',
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
  ],
}
