import type { ModelMetadata } from '../core/model-runtime'
import type { SimulationOpcodeTraceUnit } from './simulation-opcode-trace-unit'
import { SimulationOpcodeTraceUnitMeta } from './simulation-opcode-trace-unit'

/**
 * The execution trace of calling an app or a logic sig, containing the inner app call trace in a recursive way.
 */
export type SimulationTransactionExecTrace = {
  /**
   * Program trace that contains a trace of opcode effects in an approval program.
   */
  approvalProgramTrace?: SimulationOpcodeTraceUnit[]

  /**
   * SHA512_256 hash digest of the approval program executed in transaction.
   */
  approvalProgramHash?: Uint8Array

  /**
   * Program trace that contains a trace of opcode effects in a clear state program.
   */
  clearStateProgramTrace?: SimulationOpcodeTraceUnit[]

  /**
   * SHA512_256 hash digest of the clear state program executed in transaction.
   */
  clearStateProgramHash?: Uint8Array

  /**
   * If true, indicates that the clear state program failed and any persistent state changes it produced should be reverted once the program exits.
   */
  clearStateRollback?: boolean

  /**
   * The error message explaining why the clear state program failed. This field will only be populated if clear-state-rollback is true and the failure was due to an execution error.
   */
  clearStateRollbackError?: string

  /**
   * Program trace that contains a trace of opcode effects in a logic sig.
   */
  logicSigTrace?: SimulationOpcodeTraceUnit[]

  /**
   * SHA512_256 hash digest of the logic sig executed in transaction.
   */
  logicSigHash?: Uint8Array

  /**
   * An array of SimulationTransactionExecTrace representing the execution trace of any inner transactions executed.
   */
  innerTrace?: SimulationTransactionExecTrace[]
}

export const SimulationTransactionExecTraceMeta: ModelMetadata = {
  name: 'SimulationTransactionExecTrace',
  kind: 'object',
  fields: [
    {
      name: 'approvalProgramTrace',
      wireKey: 'approval-program-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulationOpcodeTraceUnitMeta } },
    },
    {
      name: 'approvalProgramHash',
      wireKey: 'approval-program-hash',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'clearStateProgramTrace',
      wireKey: 'clear-state-program-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulationOpcodeTraceUnitMeta } },
    },
    {
      name: 'clearStateProgramHash',
      wireKey: 'clear-state-program-hash',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'clearStateRollback',
      wireKey: 'clear-state-rollback',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'clearStateRollbackError',
      wireKey: 'clear-state-rollback-error',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'logicSigTrace',
      wireKey: 'logic-sig-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulationOpcodeTraceUnitMeta } },
    },
    {
      name: 'logicSigHash',
      wireKey: 'logic-sig-hash',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'innerTrace',
      wireKey: 'inner-trace',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => SimulationTransactionExecTraceMeta } },
    },
  ],
}
