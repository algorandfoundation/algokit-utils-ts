import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Represents a TEAL value.
 */
export type TealValue = {
  /**
   * \[tt\] value type. Value `1` refers to **bytes**, value `2` refers to **uint**
   */
  type: number

  /**
   * \[tb\] bytes value.
   */
  bytes: Uint8Array

  /**
   * \[ui\] uint value.
   */
  uint: bigint
}

export const TealValueMeta: ObjectModelMetadata = {
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
