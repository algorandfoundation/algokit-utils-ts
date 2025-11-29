import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Represents a key-value pair in an application store.
 */
export type TealKeyValue = {
  key: string
  value: TealValue
}

export const TealKeyValueMeta: ObjectModelMetadata<TealKeyValue> = {
  name: 'TealKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      codec: new ObjectModelCodec(TealValueMeta),
    },
  ],
}
