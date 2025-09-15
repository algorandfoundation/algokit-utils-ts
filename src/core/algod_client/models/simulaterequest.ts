import type { SimulateRequestTransactionGroup, SimulateTraceConfig } from "./index";

/**
 * Request type for simulation endpoint.
 */
export type SimulateRequest = {
  /**
   * The transaction groups to simulate.
   */
  txnGroups: SimulateRequestTransactionGroup[];

  /**
   * If provided, specifies the round preceding the simulation. State changes through this round will be used to run this simulation. Usually only the 4 most recent rounds will be available (controlled by the node config value MaxAcctLookback). If not specified, defaults to the latest available round.
   */
  round?: bigint;

  /**
   * Allows transactions without signatures to be simulated as if they had correct signatures.
   */
  allowEmptySignatures?: boolean;

  /**
   * Lifts limits on log opcode usage during simulation.
   */
  allowMoreLogging?: boolean;

  /**
   * Allows access to unnamed resources during simulation.
   */
  allowUnnamedResources?: boolean;

  /**
   * Applies extra opcode budget during simulation for each transaction group.
   */
  extraOpcodeBudget?: bigint;
  execTraceConfig?: SimulateTraceConfig;

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean;
};
