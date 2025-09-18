/**
 * The set of parameters and limits override during simulation. If this set of parameters is present, then evaluation parameters may differ from standard evaluation in certain ways.
 */
export type SimulationEvalOverrides = {
  /**
   * If true, transactions without signatures are allowed and simulated as if they were properly signed.
   */
  allowEmptySignatures?: boolean;

  /**
   * If true, allows access to unnamed resources during simulation.
   */
  allowUnnamedResources?: boolean;

  /**
   * The maximum log calls one can make during simulation
   */
  maxLogCalls?: bigint;

  /**
   * The maximum byte number to log during simulation
   */
  maxLogSize?: bigint;

  /**
   * The extra opcode budget added to each transaction group during simulation
   */
  extraOpcodeBudget?: bigint;

  /**
   * If true, signers for transactions that are missing signatures will be fixed during evaluation.
   */
  fixSigners?: boolean;
};
