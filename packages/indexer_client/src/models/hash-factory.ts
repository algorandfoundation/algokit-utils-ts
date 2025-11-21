import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type HashFactory = {
  /**
   * \[t\]
   */
  hashType?: number
}

export const HashFactoryMeta: ObjectModelMetadata = {
  name: 'HashFactory',
  kind: 'object',
  fields: [
    {
      name: 'hashType',
      wireKey: 'hash-type',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
