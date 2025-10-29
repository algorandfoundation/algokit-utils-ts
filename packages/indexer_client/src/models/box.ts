import type { ModelMetadata } from '../core/model-runtime'

/**
 * Box name and its content.
 */
export type Box = {
  /**
   * The round for which this information is relevant
   */
  round: bigint

  /**
   * \[name\] box name, base64 encoded
   */
  name: Uint8Array

  /**
   * \[value\] box value, base64 encoded.
   */
  value: Uint8Array
}

export const BoxMeta: ModelMetadata = {
  name: 'Box',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'name',
      wireKey: 'name',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'value',
      wireKey: 'value',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
