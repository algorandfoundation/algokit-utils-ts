import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, booleanCodec } from '@algorandfoundation/algokit-common'

/**
 * APIV1DELETEMultisigResponse is the response to POST /v1/multisig/delete`
 * friendly:DeleteMultisigResponse
 */
export type DeleteMultisigResponse = {
  error?: boolean
  message?: string
}

export const DeleteMultisigResponseMeta: ObjectModelMetadata<DeleteMultisigResponse> = {
  name: 'DeleteMultisigResponse',
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
