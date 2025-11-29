import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec, stringArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyListResponse is the response to `POST /v1/key/list`
 * friendly:ListKeysResponse
 */
export type PostKeyListResponse = {
  addresses?: string[]
  error?: boolean
  message?: string
}

export const PostKeyListResponseMeta: ObjectModelMetadata<PostKeyListResponse> = {
  name: 'PostKeyListResponse',
  kind: 'object',
  fields: [
    {
      name: 'addresses',
      wireKey: 'addresses',
      optional: true,
      codec: stringArrayCodec,
    },
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
