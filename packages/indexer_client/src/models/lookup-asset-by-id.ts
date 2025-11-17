import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Asset } from './asset'
import { AssetMeta } from './asset'

export type LookupAssetById = {
  asset: Asset

  /**
   * Round at which the results were computed.
   */
  currentRound: bigint
}

export const LookupAssetByIdMeta: ModelMetadata = {
  name: 'LookupAssetById',
  kind: 'object',
  fields: [
    {
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      nullable: false,
      codec: new ModelCodec(AssetMeta),
    },
    {
      name: 'currentRound',
      wireKey: 'current-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
