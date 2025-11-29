import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  addressCodec,
} from '@algorandfoundation/algokit-common'

/**
 * LocalsRef names a local state by referring to an Address and App it belongs to.
 */
export type LocalsRef = {
  /**
   * \[d\] Address in access list, or the sender of the transaction.
   */
  address: Address

  /**
   * \[p\] Application ID for app in access list, or zero if referring to the called application.
   */
  app: bigint
}

export const LocalsRefMeta: ObjectModelMetadata<LocalsRef> = {
  name: 'LocalsRef',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
