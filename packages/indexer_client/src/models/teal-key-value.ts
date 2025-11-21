import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Represents a key-value pair in an application store.
 */
export type TealKeyValue = {
  key: string
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
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      codec: new ModelCodec(TealValueMeta),
    },
  ],
}
