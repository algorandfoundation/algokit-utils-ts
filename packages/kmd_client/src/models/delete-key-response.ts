import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

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
      codec: booleanCodec,
    },
    {
      name: 'message',
      wireKey: 'message',
      optional: true,
      codec: stringCodec,
    },
  ],
}
