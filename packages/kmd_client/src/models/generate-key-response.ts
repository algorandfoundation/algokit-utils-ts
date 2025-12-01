import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec } from '@algorandfoundation/algokit-common'

/**
 * GenerateKeyResponse is the response to `POST /v1/key`
 */
export type GenerateKeyResponse = {
  address: string
}

export const GenerateKeyResponseMeta: ObjectModelMetadata<GenerateKeyResponse> = {
  name: 'GenerateKeyResponse',
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
