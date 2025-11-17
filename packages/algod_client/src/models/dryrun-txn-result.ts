import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'logicSigDisassembly',
      wireKey: 'logic-sig-disassembly',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'logicSigTrace',
      wireKey: 'logic-sig-trace',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(DryrunStateMeta)),
    },
    {
      name: 'logicSigMessages',
      wireKey: 'logic-sig-messages',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'appCallTrace',
      wireKey: 'app-call-trace',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(DryrunStateMeta)),
    },
    {
      name: 'appCallMessages',
      wireKey: 'app-call-messages',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'globalDelta',
      wireKey: 'global-delta',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateDeltaMeta),
    },
    {
      name: 'localDeltas',
      wireKey: 'local-deltas',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(AccountStateDeltaMeta)),
    },
    {
      name: 'logs',
      wireKey: 'logs',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(bytesCodec),
    },
    {
      name: 'budgetAdded',
      wireKey: 'budget-added',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'budgetConsumed',
      wireKey: 'budget-consumed',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
