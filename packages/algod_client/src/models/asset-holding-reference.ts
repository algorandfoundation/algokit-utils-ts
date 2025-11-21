import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * References an asset held by an account.
 */
export type AssetHoldingReference = {
  /**
   * Address of the account holding the asset.
   */
  account: string

  /**
   * Asset ID of the holding.
   */
  asset: bigint
}

export const AssetHoldingReferenceMeta: ObjectModelMetadata = {
  name: 'AssetHoldingReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
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
