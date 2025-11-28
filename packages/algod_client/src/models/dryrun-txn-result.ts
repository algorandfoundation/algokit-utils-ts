import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  ArrayCodec,
  bytesArrayCodec,
  stringArrayCodec,
  ObjectModelCodec,
  ArrayModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const DryrunTxnResultMeta: ObjectModelMetadata<DryrunTxnResult> = {
  name: 'DryrunTxnResult',
  kind: 'object',
  fields: [
    {
      name: 'disassembly',
      wireKey: 'disassembly',
      optional: false,
      codec: stringArrayCodec,
    },
    {
      name: 'logicSigDisassembly',
      wireKey: 'logic-sig-disassembly',
      optional: true,
      codec: stringArrayCodec,
    },
    {
      name: 'logicSigTrace',
      wireKey: 'logic-sig-trace',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(DryrunStateMeta)),
    },
    {
      name: 'logicSigMessages',
      wireKey: 'logic-sig-messages',
      optional: true,
      codec: stringArrayCodec,
    },
    {
      name: 'appCallTrace',
      wireKey: 'app-call-trace',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(DryrunStateMeta)),
    },
    {
      name: 'appCallMessages',
      wireKey: 'app-call-messages',
      optional: true,
      codec: stringArrayCodec,
    },
    {
      name: 'globalDelta',
      wireKey: 'global-delta',
      optional: true,
      codec: new ArrayModelCodec(StateDeltaMeta),
    },
    {
      name: 'localDeltas',
      wireKey: 'local-deltas',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AccountStateDeltaMeta)),
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: true,
      codec: bytesArrayCodec,
    },
    {
      name: 'budgetAdded',
      wireKey: 'budget-added',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'budgetConsumed',
      wireKey: 'budget-consumed',
      optional: true,
      codec: numberCodec,
    },
  ],
}
