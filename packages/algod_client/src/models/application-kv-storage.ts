import type { ModelMetadata } from '../core/model-runtime'
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

export const ApplicationKvStorageMeta: ModelMetadata = {
  name: 'ApplicationKvStorage',
  kind: 'object',
  fields: [
    {
      name: 'kvs',
      wireKey: 'kvs',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AvmKeyValueMeta } },
    },
    {
      name: 'account',
      wireKey: 'account',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
