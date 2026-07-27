import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { addressArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * ListMultisigResponse is the response to `POST /v1/multisig/list`
 */
export type ListMultisigResponse = {
  addresses: Address[]
}

export const ListMultisigResponseMeta: ObjectModelMetadata<ListMultisigResponse> = {
  name: 'ListMultisigResponse',
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
