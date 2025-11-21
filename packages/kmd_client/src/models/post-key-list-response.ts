import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTKeyListResponse is the response to `POST /v1/key/list`
 * friendly:ListKeysResponse
 */
export type PostKeyListResponse = {
  addresses?: string[]
  error?: boolean
  message?: string
}

export const PostKeyListResponseMeta: ObjectModelMetadata = {
  name: 'PostKeyListResponse',
  kind: 'object',
  fields: [
    {
      name: 'addresses',
      wireKey: 'addresses',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
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
