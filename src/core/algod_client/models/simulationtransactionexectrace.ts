import type { SimulationOpcodeTraceUnit } from "./index";

/**
 * The execution trace of calling an app or a logic sig, containing the inner app call trace in a recursive way.
 */
export type SimulationTransactionExecTrace = {
  /**
   * Program trace that contains a trace of opcode effects in an approval program.
   */
  approvalProgramTrace?: SimulationOpcodeTraceUnit[];

  /**
   * SHA512_256 hash digest of the approval program executed in transaction.
   */
  approvalProgramHash?: string;

  /**
   * Program trace that contains a trace of opcode effects in a clear state program.
   */
  clearStateProgramTrace?: SimulationOpcodeTraceUnit[];

  /**
   * SHA512_256 hash digest of the clear state program executed in transaction.
   */
  clearStateProgramHash?: string;

  /**
   * If true, indicates that the clear state program failed and any persistent state changes it produced should be reverted once the program exits.
   */
  clearStateRollback?: boolean;

  /**
   * The error message explaining why the clear state program failed. This field will only be populated if clear-state-rollback is true and the failure was due to an execution error.
   */
  clearStateRollbackError?: string;

  /**
   * Program trace that contains a trace of opcode effects in a logic sig.
   */
  logicSigTrace?: SimulationOpcodeTraceUnit[];

  /**
   * SHA512_256 hash digest of the logic sig executed in transaction.
   */
  logicSigHash?: string;

  /**
   * An array of SimulationTransactionExecTrace representing the execution trace of any inner transactions executed.
   */
  innerTrace?: SimulationTransactionExecTrace[];
};
