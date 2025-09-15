import type { ApplicationStateOperation, AvmValue, ScratchChange } from "./index";

/**
 * The set of trace information and effect from evaluating a single opcode.
 */
export type SimulationOpcodeTraceUnit = {
  /**
   * The program counter of the current opcode being evaluated.
   */
  pc: bigint;

  /**
   * The writes into scratch slots.
   */
  scratchChanges?: ScratchChange[];

  /**
   * The operations against the current application's states.
   */
  stateChanges?: ApplicationStateOperation[];

  /**
   * The indexes of the traces for inner transactions spawned by this opcode, if any.
   */
  spawnedInners?: bigint[];

  /**
   * The number of deleted stack values by this opcode.
   */
  stackPopCount?: bigint;

  /**
   * The values added by this opcode to the stack.
   */
  stackAdditions?: AvmValue[];
};
