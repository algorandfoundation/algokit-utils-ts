import type { ModelMetadata } from '../core/model-runtime'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Represents a key-value pair in an application store.
 */
export type TealKeyValue = {
  key: string
  value: TealValue
}

export const TealKeyValueMeta: ModelMetadata = {
  name: 'TealKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => TealValueMeta },
    },
  ],
}
