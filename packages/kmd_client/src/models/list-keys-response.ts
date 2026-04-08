import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { addressArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * ListKeysResponse is the response to `POST /v1/key/list`
 */
export type ListKeysResponse = {
  addresses: Address[]
}

export const ListKeysResponseMeta: ObjectModelMetadata<ListKeysResponse> = {
  name: 'ListKeysResponse',
  kind: 'object',
  fields: [
    {
      name: 'addresses',
      wireKey: 'addresses',
      optional: false,
      codec: addressArrayCodec,
    },
  ],
}
