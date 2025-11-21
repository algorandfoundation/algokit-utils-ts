import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      nullable: false,
      codec: stringCodec,
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
