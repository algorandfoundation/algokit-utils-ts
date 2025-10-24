import type { ModelMetadata } from '../core/model-runtime'

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

export const EvalDeltaMeta: ModelMetadata = {
  name: 'EvalDelta',
  kind: 'object',
  fields: [
    {
      name: 'action',
      wireKey: 'action',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'bytes',
      wireKey: 'bytes',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
