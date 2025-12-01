import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, addressCodec } from '@algorandfoundation/algokit-common'

/**
 * References an asset held by an account.
 */
export type AssetHoldingReference = {
  /**
   * Address of the account holding the asset.
   */
  account: Address

  /**
   * Asset ID of the holding.
   */
  asset: bigint
}

export const AssetHoldingReferenceMeta: ObjectModelMetadata<AssetHoldingReference> = {
  name: 'AssetHoldingReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
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
