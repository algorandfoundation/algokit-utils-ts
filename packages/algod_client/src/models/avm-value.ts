import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

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

export const AvmValueMeta: ObjectModelMetadata<AvmValue> = {
  name: 'AvmValue',
  kind: 'object',
  fields: [
    {
      name: 'type',
      wireKey: 'type',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'bytes',
      wireKey: 'bytes',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
