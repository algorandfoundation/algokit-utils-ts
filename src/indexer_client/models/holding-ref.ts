import type { ModelMetadata } from '../core/model-runtime'

/**
 * HoldingRef names a holding by referring to an Address and Asset it belongs to.
 */
export type HoldingRef = {
  /**
   * \[d\] Address in access list, or the sender of the transaction.
   */
  address: string

  /**
   * \[s\] Asset ID for asset in access list.
   */
  asset: bigint
}

export const HoldingRefMeta: ModelMetadata = {
  name: 'HoldingRef',
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
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
