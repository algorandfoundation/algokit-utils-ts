import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const DryrunStateMeta: ObjectModelMetadata = {
  name: 'DryrunState',
  kind: 'object',
  fields: [
    {
      name: 'line',
      wireKey: 'line',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'pc',
      wireKey: 'pc',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'stack',
      wireKey: 'stack',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(TealValueMeta)),
    },
    {
      name: 'scratch',
      wireKey: 'scratch',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(TealValueMeta)),
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
