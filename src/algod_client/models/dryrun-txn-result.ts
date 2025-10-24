import type { ModelMetadata } from '../core/model-runtime'
import type { AccountStateDelta } from './account-state-delta'
import { AccountStateDeltaMeta } from './account-state-delta'
import type { DryrunState } from './dryrun-state'
import { DryrunStateMeta } from './dryrun-state'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'

/**
 * DryrunTxnResult contains any LogicSig or ApplicationCall program debug information and state updates from a dryrun.
 */
export type DryrunTxnResult = {
  /**
   * Disassembled program line by line.
   */
  disassembly: string[]

  /**
   * Disassembled lsig program line by line.
   */
  logicSigDisassembly?: string[]
  logicSigTrace?: DryrunState[]
  logicSigMessages?: string[]
  appCallTrace?: DryrunState[]
  appCallMessages?: string[]
  globalDelta?: StateDelta
  localDeltas?: AccountStateDelta[]
  logs?: Uint8Array[]

  /**
   * Budget added during execution of app call transaction.
   */
  budgetAdded?: number

  /**
   * Budget consumed during execution of app call transaction.
   */
  budgetConsumed?: number
}

export const DryrunTxnResultMeta: ModelMetadata = {
  name: 'DryrunTxnResult',
  kind: 'object',
  fields: [
    {
      name: 'disassembly',
      wireKey: 'disassembly',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'logicSigDisassembly',
      wireKey: 'logic-sig-disassembly',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'logicSigTrace',
      wireKey: 'logic-sig-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => DryrunStateMeta } },
    },
    {
      name: 'logicSigMessages',
      wireKey: 'logic-sig-messages',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'appCallTrace',
      wireKey: 'app-call-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => DryrunStateMeta } },
    },
    {
      name: 'appCallMessages',
      wireKey: 'app-call-messages',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'globalDelta',
      wireKey: 'global-delta',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateDeltaMeta },
    },
    {
      name: 'localDeltas',
      wireKey: 'local-deltas',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AccountStateDeltaMeta } },
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar', isBytes: true } },
    },
    {
      name: 'budgetAdded',
      wireKey: 'budget-added',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'budgetConsumed',
      wireKey: 'budget-consumed',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
