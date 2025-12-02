import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { addressCodec } from '@algorandfoundation/algokit-common'

/**
 * ImportKeyResponse is the response to `POST /v1/key/import`
 */
export type ImportKeyResponse = {
  address: Address
}

export const ImportKeyResponseMeta: ObjectModelMetadata<ImportKeyResponse> = {
  name: 'ImportKeyResponse',
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
