/**
 * An object that configures simulation execution trace.
 */
export type SimulateTraceConfig = {
  /**
   * A boolean option for opting in execution trace features simulation endpoint.
   */
  enable?: boolean;

  /**
   * A boolean option enabling returning stack changes together with execution trace during simulation.
   */
  stackChange?: boolean;

  /**
   * A boolean option enabling returning scratch slot changes together with execution trace during simulation.
   */
  scratchChange?: boolean;

  /**
   * A boolean option enabling returning application state changes (global, local, and box changes) with the execution trace during simulation.
   */
  stateChange?: boolean;
};
