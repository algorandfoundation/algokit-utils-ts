import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigListResponse is the response to `POST /v1/multisig/list`
 * friendly:ListMultisigResponse
 */
export type PostMultisigListResponse = {
  addresses?: string[]
  error?: boolean
  message?: string
}

export const PostMultisigListResponseMeta: ObjectModelMetadata = {
  name: 'PostMultisigListResponse',
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
