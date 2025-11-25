import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Represents a TEAL value delta.
 */
export type EvalDelta = {
  /**
   * \[at\] delta action.
   */
  action: number

  /**
   * \[bs\] bytes value.
   */
  bytes?: string

  /**
   * \[ui\] uint value.
   */
  uint?: bigint
}

export const EvalDeltaMeta: ObjectModelMetadata = {
  name: 'EvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'action',
      wireKey: 'action',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'bytes',
      wireKey: 'bytes',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
