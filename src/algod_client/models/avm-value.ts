import type { ModelMetadata } from '../core/model-runtime'

/**
 * Represents an AVM value.
 */
export type AvmValue = {
  /**
   * value type. Value `1` refers to **bytes**, value `2` refers to **uint64**
   */
  type: bigint

  /**
   * bytes value.
   */
  bytes?: string

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
      type: { kind: 'scalar', isBigint: true },
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
