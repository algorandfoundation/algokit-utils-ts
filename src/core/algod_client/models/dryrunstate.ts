import type { TealValue } from "./index";

/**
 * Stores the TEAL eval step data
 */
export type DryrunState = {
  /**
   * Line number
   */
  line: bigint;

  /**
   * Program counter
   */
  pc: bigint;
  stack: TealValue[];
  scratch?: TealValue[];

  /**
   * Evaluation error if any
   */
  error?: string;
};
