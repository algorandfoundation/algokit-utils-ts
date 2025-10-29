import type { ModelMetadata } from '../core/model-runtime'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'

/**
 * Represents an AVM key-value pair in an application store.
 */
export type AvmKeyValue = {
  key: Uint8Array
  value: AvmValue
}

export const AvmKeyValueMeta: ModelMetadata = {
  name: 'AvmKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AvmValueMeta },
    },
  ],
}
