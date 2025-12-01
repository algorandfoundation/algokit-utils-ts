import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * ListKeysResponse is the response to `POST /v1/key/list`
 */
export type ListKeysResponse = {
  addresses: string[]
}

export const ListKeysResponseMeta: ObjectModelMetadata<ListKeysResponse> = {
  name: 'ListKeysResponse',
  kind: 'object',
  fields: [
    {
      name: 'addresses',
      wireKey: 'addresses',
      optional: false,
      codec: stringArrayCodec,
    },
  ],
}
