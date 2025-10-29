import type { ModelMetadata } from '../core/model-runtime'

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

export const TealValueMeta: ModelMetadata = {
  name: 'TealValue',
  kind: 'object',
  fields: [
    {
      name: 'type',
      wireKey: 'type',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'bytes',
      wireKey: 'bytes',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'uint',
      wireKey: 'uint',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
