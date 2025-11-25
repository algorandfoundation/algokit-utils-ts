import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bytesCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Represents a key-value pair in an application store.
 */
export type TealKeyValue = {
  key: Uint8Array
  value: TealValue
}

export const TealKeyValueMeta: ObjectModelMetadata = {
  name: 'TealKeyValue',
  kind: 'object',
  fields: [
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      codec: new ObjectModelCodec(TealValueMeta),
    },
  ],
}
