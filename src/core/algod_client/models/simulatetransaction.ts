import type { SimulateInitialStates, SimulateTraceConfig, SimulateTransactionGroupResult, SimulationEvalOverrides } from "./index";

export type SimulateTransaction = {
  /**
   * The version of this response object.
   */
  version: bigint;

  /**
   * The round immediately preceding this simulation. State changes through this round were used to run this simulation.
   */
  lastRound: bigint;

  /**
   * A result object for each transaction group that was simulated.
   */
  txnGroups: SimulateTransactionGroupResult[];
  evalOverrides?: SimulationEvalOverrides;
  execTraceConfig?: SimulateTraceConfig;
  initialStates?: SimulateInitialStates;
};
