import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  addressCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const ResourceRefMeta: ObjectModelMetadata<ResourceRef> = {
  name: 'ResourceRef',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: true,
      codec: addressCodec,
    },
    {
      name: 'applicationId',
      wireKey: 'application-id',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'box',
      wireKey: 'box',
      optional: true,
      codec: new ObjectModelCodec(BoxReferenceMeta),
    },
    {
      name: 'holding',
      wireKey: 'holding',
      optional: true,
      codec: new ObjectModelCodec(HoldingRefMeta),
    },
    {
      name: 'local',
      wireKey: 'local',
      optional: true,
      codec: new ObjectModelCodec(LocalsRefMeta),
    },
  ],
}
