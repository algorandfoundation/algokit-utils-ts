import type { ModelMetadata } from '../core/model-runtime'
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
  extraBoxRefs?: bigint

  /**
   * The unnamed asset holdings that were referenced. The order of this array is arbitrary.
   */
  assetHoldings?: AssetHoldingReference[]

  /**
   * The unnamed application local states that were referenced. The order of this array is arbitrary.
   */
  appLocals?: ApplicationLocalReference[]
}

export const SimulateUnnamedResourcesAccessedMeta: ModelMetadata = {
  name: 'SimulateUnnamedResourcesAccessed',
  kind: 'object',
  fields: [
    {
      name: 'accounts',
      wireKey: 'accounts',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'assets',
      wireKey: 'assets',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBigint: true } },
    },
    {
      name: 'apps',
      wireKey: 'apps',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBigint: true } },
    },
    {
      name: 'boxes',
      wireKey: 'boxes',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => BoxReferenceMeta } },
    },
    {
      name: 'extraBoxRefs',
      wireKey: 'extra-box-refs',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'assetHoldings',
      wireKey: 'asset-holdings',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AssetHoldingReferenceMeta } },
    },
    {
      name: 'appLocals',
      wireKey: 'app-locals',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationLocalReferenceMeta } },
    },
  ],
}
