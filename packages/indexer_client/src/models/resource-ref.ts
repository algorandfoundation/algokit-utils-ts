import type { ModelMetadata } from '../core/model-runtime'
import type { BoxReference } from './box-reference'
import { BoxReferenceMeta } from './box-reference'
import type { HoldingRef } from './holding-ref'
import { HoldingRefMeta } from './holding-ref'
import type { LocalsRef } from './locals-ref'
import { LocalsRefMeta } from './locals-ref'

/**
 * ResourceRef names a single resource. Only one of the fields should be set.
 */
export type ResourceRef = {
  /**
   * \[d\] Account whose balance record is accessible by the executing ApprovalProgram or ClearStateProgram.
   */
  address?: string

  /**
   * \[p\] Application id whose GlobalState may be read by the executing
   * ApprovalProgram or ClearStateProgram.
   */
  applicationId?: bigint

  /**
   * \[s\] Asset whose AssetParams may be read by the executing
   * ApprovalProgram or ClearStateProgram.
   */
  assetId?: bigint
  box?: BoxReference
  holding?: HoldingRef
  local?: LocalsRef
}

export const ResourceRefMeta: ModelMetadata = {
  name: 'ResourceRef',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'box',
      wireKey: 'box',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => BoxReferenceMeta },
    },
    {
      name: 'holding',
      wireKey: 'holding',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => HoldingRefMeta },
    },
    {
      name: 'local',
      wireKey: 'local',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => LocalsRefMeta },
    },
  ],
}
