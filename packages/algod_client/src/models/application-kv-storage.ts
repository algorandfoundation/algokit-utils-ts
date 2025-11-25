import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  addressCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { AvmKeyValue } from './avm-key-value'
import { AvmKeyValueMeta } from './avm-key-value'

/**
 * An application's global/local/box state.
 */
export type ApplicationKvStorage = {
  /**
   * Key-Value pairs representing application states.
   */
  kvs: AvmKeyValue[]

  /**
   * The address of the account associated with the local state.
   */
  account?: string
}

export const ApplicationKvStorageMeta: ObjectModelMetadata = {
  name: 'ApplicationKvStorage',
  kind: 'object',
  fields: [
    {
      name: 'kvs',
      wireKey: 'kvs',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(AvmKeyValueMeta)),
    },
    {
      name: 'account',
      wireKey: 'account',
      optional: true,
      codec: addressCodec,
    },
  ],
}
