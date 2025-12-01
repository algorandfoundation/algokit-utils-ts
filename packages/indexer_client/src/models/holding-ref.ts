import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, addressCodec } from '@algorandfoundation/algokit-common'

/**
 * HoldingRef names a holding by referring to an Address and Asset it belongs to.
 */
export type HoldingRef = {
  /**
   * \[d\] Address in access list, or the sender of the transaction.
   */
  address: Address

  /**
   * \[s\] Asset ID for asset in access list.
   */
  asset: bigint
}

export const HoldingRefMeta: ObjectModelMetadata<HoldingRef> = {
  name: 'HoldingRef',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
