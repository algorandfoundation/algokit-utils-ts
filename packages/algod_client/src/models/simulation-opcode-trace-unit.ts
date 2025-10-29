import type { ModelMetadata } from '../core/model-runtime'
import type { ApplicationStateOperation } from './application-state-operation'
import { ApplicationStateOperationMeta } from './application-state-operation'
import type { AvmValue } from './avm-value'
import { AvmValueMeta } from './avm-value'
import type { ScratchChange } from './scratch-change'
import { ScratchChangeMeta } from './scratch-change'

/**
 * The set of trace information and effect from evaluating a single opcode.
 */
export type SimulationOpcodeTraceUnit = {
  /**
   * The program counter of the current opcode being evaluated.
   */
  pc: bigint

  /**
   * The writes into scratch slots.
   */
  scratchChanges?: ScratchChange[]

  /**
   * The operations against the current application's states.
   */
  stateChanges?: ApplicationStateOperation[]

  /**
   * The indexes of the traces for inner transactions spawned by this opcode, if any.
   */
  spawnedInners?: bigint[]

  /**
   * The number of deleted stack values by this opcode.
   */
  stackPopCount?: bigint

  /**
   * The values added by this opcode to the stack.
   */
  stackAdditions?: AvmValue[]
}

export const SimulationOpcodeTraceUnitMeta: ModelMetadata = {
  name: 'SimulationOpcodeTraceUnit',
  kind: 'object',
  fields: [
    {
      name: 'pc',
      wireKey: 'pc',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'scratchChanges',
      wireKey: 'scratch-changes',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ScratchChangeMeta } },
    },
    {
      name: 'stateChanges',
      wireKey: 'state-changes',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationStateOperationMeta } },
    },
    {
      name: 'spawnedInners',
      wireKey: 'spawned-inners',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
    {
      name: 'stackPopCount',
      wireKey: 'stack-pop-count',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stackAdditions',
      wireKey: 'stack-additions',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AvmValueMeta } },
    },
  ],
}
