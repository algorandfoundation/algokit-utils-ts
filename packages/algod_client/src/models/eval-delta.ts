import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
  bytes?: Uint8Array

  /**
   * \[ui\] uint value.
   */
  uint?: bigint
}

export const EvalDeltaMeta: ModelMetadata = {
  name: 'EvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'action',
      wireKey: 'action',
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
