import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Stores the TEAL eval step data
 */
export type DryrunState = {
  /**
   * Line number
   */
  line: number

  /**
   * Program counter
   */
  pc: number
  stack: TealValue[]
  scratch?: TealValue[]

  /**
   * Evaluation error if any
   */
  error?: string
}

export const DryrunStateMeta: ObjectModelMetadata<DryrunState> = {
  name: 'DryrunState',
  kind: 'object',
  fields: [
    {
      name: 'line',
      wireKey: 'line',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'pc',
      wireKey: 'pc',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'stack',
      wireKey: 'stack',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(TealValueMeta)),
    },
    {
      name: 'scratch',
      wireKey: 'scratch',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(TealValueMeta)),
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      codec: stringCodec,
    },
  ],
}
