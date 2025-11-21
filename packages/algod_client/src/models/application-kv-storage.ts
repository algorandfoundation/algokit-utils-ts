import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(AvmKeyValueMeta)),
    },
    {
      name: 'account',
      wireKey: 'account',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
