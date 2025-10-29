import type { ModelMetadata } from '../core/model-runtime'
import { getModelMeta, registerModelMeta } from '../core/model-runtime'
import type { SignedTxnInBlock } from './signed-txn-in-block'
import type { BlockStateDelta } from './block-state-delta'
import { BlockStateDeltaMeta } from './block-state-delta'

/**
 * State changes from application execution, including inner transactions and logs.
 */
export interface BlockAppEvalDelta {
  /** [gd] Global state delta for the application. */
  globalDelta?: BlockStateDelta
  /** [ld] Local state deltas keyed by address index. */
  localDeltas?: Record<string, BlockStateDelta>
  /** [itx] Inner transactions produced by this application execution. */
  innerTxns?: SignedTxnInBlock[]
  /** [sa] Shared accounts referenced by local deltas. */
  sharedAccounts?: Uint8Array[]
  /** [lg] Application log outputs. */
  logs?: Uint8Array[]
}

export const BlockAppEvalDeltaMeta: ModelMetadata = {
  name: 'BlockAppEvalDelta',
  kind: 'object',
  fields: [
    { name: 'globalDelta', wireKey: 'gd', optional: true, nullable: false, type: { kind: 'model', meta: () => BlockStateDeltaMeta } },
    {
      name: 'localDeltas',
      wireKey: 'ld',
      optional: true,
      nullable: false,
      type: { kind: 'record', value: { kind: 'model', meta: () => BlockStateDeltaMeta } },
    },
    {
      name: 'innerTxns',
      wireKey: 'itx',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => getModelMeta('SignedTxnInBlock') } },
    },
    {
      name: 'sharedAccounts',
      wireKey: 'sa',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    { name: 'logs', wireKey: 'lg', optional: true, nullable: false, type: { kind: 'array', item: { kind: 'scalar', isBytes: true } } },
  ],
}

registerModelMeta('BlockAppEvalDelta', BlockAppEvalDeltaMeta)
