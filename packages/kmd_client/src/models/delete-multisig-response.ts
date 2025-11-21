import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEMultisigResponse is the response to POST /v1/multisig/delete`
 * friendly:DeleteMultisigResponse
 */
export type DeleteMultisigResponse = {
  error?: boolean
  message?: string
}

export const DeleteMultisigResponseMeta: ObjectModelMetadata = {
  name: 'DeleteMultisigResponse',
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
