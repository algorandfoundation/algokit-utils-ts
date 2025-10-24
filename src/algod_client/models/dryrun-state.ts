import type { ModelMetadata } from '../core/model-runtime'
import type { TealValue } from './teal-value'
import { TealValueMeta } from './teal-value'

/**
 * Stores the TEAL eval step data
 */
export type DryrunState = {
  /**
   * Line number
   */
  line: bigint

  /**
   * Program counter
   */
  pc: bigint
  stack: TealValue[]
  scratch?: TealValue[]

  /**
   * Evaluation error if any
   */
  error?: string
}

export const DryrunStateMeta: ModelMetadata = {
  name: 'DryrunState',
  kind: 'object',
  fields: [
    {
      name: 'line',
      wireKey: 'line',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'pc',
      wireKey: 'pc',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stack',
      wireKey: 'stack',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TealValueMeta } },
    },
    {
      name: 'scratch',
      wireKey: 'scratch',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => TealValueMeta } },
    },
    {
      name: 'error',
      wireKey: 'error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
