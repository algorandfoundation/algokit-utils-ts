import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, ArrayCodec, numberArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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
  pc: number

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
  spawnedInners?: number[]

  /**
   * The number of deleted stack values by this opcode.
   */
  stackPopCount?: number

  /**
   * The values added by this opcode to the stack.
   */
  stackAdditions?: AvmValue[]
}

export const SimulationOpcodeTraceUnitMeta: ObjectModelMetadata<SimulationOpcodeTraceUnit> = {
  name: 'SimulationOpcodeTraceUnit',
  kind: 'object',
  fields: [
    {
      name: 'pc',
      wireKey: 'pc',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'scratchChanges',
      wireKey: 'scratch-changes',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ScratchChangeMeta)),
    },
    {
      name: 'stateChanges',
      wireKey: 'state-changes',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationStateOperationMeta)),
    },
    {
      name: 'spawnedInners',
      wireKey: 'spawned-inners',
      optional: true,
      codec: numberArrayCodec,
    },
    {
      name: 'stackPopCount',
      wireKey: 'stack-pop-count',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'stackAdditions',
      wireKey: 'stack-additions',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AvmValueMeta)),
    },
  ],
}
