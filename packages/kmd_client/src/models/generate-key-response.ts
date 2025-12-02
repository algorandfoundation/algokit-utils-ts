import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { addressCodec } from '@algorandfoundation/algokit-common'

/**
 * GenerateKeyResponse is the response to `POST /v1/key`
 */
export type GenerateKeyResponse = {
  address: Address
}

export const GenerateKeyResponseMeta: ObjectModelMetadata<GenerateKeyResponse> = {
  name: 'GenerateKeyResponse',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
  ],
}
