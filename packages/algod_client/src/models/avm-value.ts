import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Represents an AVM value.
 */
export type AvmValue = {
  /**
   * value type. Value `1` refers to **bytes**, value `2` refers to **uint64**
   */
  type: number

  /**
   * bytes value.
   */
  bytes?: Uint8Array

  /**
   * uint value.
   */
  uint?: bigint
}

export const AvmValueMeta: ModelMetadata = {
  name: 'AvmValue',
  kind: 'object',
  fields: [
    {
      name: 'type',
      wireKey: 'type',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'bytes',
      wireKey: 'bytes',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
