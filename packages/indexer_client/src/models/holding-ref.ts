import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
      codec: stringCodec,
    },
    {
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
