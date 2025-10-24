import type { ModelMetadata } from '../core/model-runtime'

/**
 * LocalsRef names a local state by referring to an Address and App it belongs to.
 */
export type LocalsRef = {
  /**
   * \[d\] Address in access list, or the sender of the transaction.
   */
  address: string

  /**
   * \[p\] Application ID for app in access list, or zero if referring to the called application.
   */
  app: bigint
}

export const LocalsRefMeta: ModelMetadata = {
  name: 'LocalsRef',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
