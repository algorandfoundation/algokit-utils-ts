import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * APIV1POSTMultisigImportResponse is the response to `POST /v1/multisig/import`
 * friendly:ImportMultisigResponse
 */
export type PostMultisigImportResponse = {
  address?: string
  error?: boolean
  message?: string
}

export const PostMultisigImportResponseMeta: ObjectModelMetadata = {
  name: 'PostMultisigImportResponse',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: stringCodec,
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
