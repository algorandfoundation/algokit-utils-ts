import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  ArrayCodec,
  bigIntArrayCodec,
  addressArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { ApplicationLocalReference } from './application-local-reference'
import { ApplicationLocalReferenceMeta } from './application-local-reference'
import type { AssetHoldingReference } from './asset-holding-reference'
import { AssetHoldingReferenceMeta } from './asset-holding-reference'
import type { BoxReference } from './box-reference'
import { BoxReferenceMeta } from './box-reference'

/**
 * These are resources that were accessed by this group that would normally have caused failure, but were allowed in simulation. Depending on where this object is in the response, the unnamed resources it contains may or may not qualify for group resource sharing. If this is a field in SimulateTransactionGroupResult, the resources do qualify, but if this is a field in SimulateTransactionResult, they do not qualify. In order to make this group valid for actual submission, resources that qualify for group sharing can be made available by any transaction of the group; otherwise, resources must be placed in the same transaction which accessed them.
 */
export type SimulateUnnamedResourcesAccessed = {
  /**
   * The unnamed accounts that were referenced. The order of this array is arbitrary.
   */
  accounts?: string[]

  /**
   * The unnamed assets that were referenced. The order of this array is arbitrary.
   */
  assets?: bigint[]

  /**
   * The unnamed applications that were referenced. The order of this array is arbitrary.
   */
  apps?: bigint[]

  /**
   * The unnamed boxes that were referenced. The order of this array is arbitrary.
   */
  boxes?: BoxReference[]

  /**
   * The number of extra box references used to increase the IO budget. This is in addition to the references defined in the input transaction group and any referenced to unnamed boxes.
   */
  extraBoxRefs?: number

  /**
   * The unnamed asset holdings that were referenced. The order of this array is arbitrary.
   */
  assetHoldings?: AssetHoldingReference[]

  /**
   * The unnamed application local states that were referenced. The order of this array is arbitrary.
   */
  appLocals?: ApplicationLocalReference[]
}

export const SimulateUnnamedResourcesAccessedMeta: ObjectModelMetadata<SimulateUnnamedResourcesAccessed> = {
  name: 'SimulateUnnamedResourcesAccessed',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: true,
      codec: addressArrayCodec,
    },
    {
      name: 'assets',
      wireKey: 'assets',
      optional: true,
      codec: bigIntArrayCodec,
    },
    {
      name: 'apps',
      wireKey: 'apps',
      optional: true,
      codec: bigIntArrayCodec,
    },
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(BoxReferenceMeta)),
    },
    {
      name: 'extraBoxRefs',
      wireKey: 'extra-box-refs',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'assetHoldings',
      wireKey: 'asset-holdings',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AssetHoldingReferenceMeta)),
    },
    {
      name: 'appLocals',
      wireKey: 'app-locals',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationLocalReferenceMeta)),
    },
  ],
}
