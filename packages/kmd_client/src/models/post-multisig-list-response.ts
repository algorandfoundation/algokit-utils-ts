import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
  stringArrayCodec,
} from '@algorandfoundation/algokit-common'

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
