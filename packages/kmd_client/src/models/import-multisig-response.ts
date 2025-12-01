import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * ImportMultisigResponse is the response to `POST /v1/multisig/import`
 */
export type ImportMultisigResponse = {
  address: string
}

export const ImportMultisigResponseMeta: ObjectModelMetadata<ImportMultisigResponse> = {
  name: 'ImportMultisigResponse',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
  ],
}
