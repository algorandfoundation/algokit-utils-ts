import type { ModelMetadata } from '../core/model-runtime'

export type HashFactory = {
  /**
   * \[t\]
   */
  hashType?: bigint
}

export const HashFactoryMeta: ModelMetadata = {
  name: 'HashFactory',
  kind: 'object',
  fields: [
    {
      name: 'hashType',
      wireKey: 'hash-type',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
