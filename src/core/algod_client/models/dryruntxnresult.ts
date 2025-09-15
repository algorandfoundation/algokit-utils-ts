import type { AccountStateDelta, DryrunState, StateDelta } from "./index";

/**
 * DryrunTxnResult contains any LogicSig or ApplicationCall program debug information and state updates from a dryrun.
 */
export type DryrunTxnResult = {
  /**
   * Disassembled program line by line.
   */
  disassembly: string[];

  /**
   * Disassembled lsig program line by line.
   */
  logicSigDisassembly?: string[];
  logicSigTrace?: DryrunState[];
  logicSigMessages?: string[];
  appCallTrace?: DryrunState[];
  appCallMessages?: string[];
  globalDelta?: StateDelta;
  localDeltas?: AccountStateDelta[];
  logs?: string[];

  /**
   * Budget added during execution of app call transaction.
   */
  budgetAdded?: bigint;

  /**
   * Budget consumed during execution of app call transaction.
   */
  budgetConsumed?: bigint;
};
