import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, bigIntCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Represents a TEAL value.
 */
export type TealValue = {
  /**
   * type of the value. Value `1` refers to **bytes**, value `2` refers to **uint**
   */
  type: number

  /**
   * bytes value.
   */
  bytes: Uint8Array

  /**
   * uint value.
   */
  uint: bigint
}

export const TealValueMeta: ObjectModelMetadata<TealValue> = {
  name: 'TealValue',
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
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
