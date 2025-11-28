import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
} from '@algorandfoundation/algokit-common'

export type HashFactory = {
  /**
   * \[t\]
   */
  hashType?: number
}

export const HashFactoryMeta: ObjectModelMetadata<HashFactory> = {
  name: 'HashFactory',
  kind: 'object',
  fields: [
    {
      name: 'hashType',
      wireKey: 'hash-type',
      optional: true,
      codec: numberCodec,
    },
  ],
}
