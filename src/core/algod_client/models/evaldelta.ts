/**
 * Represents a TEAL value delta.
 */
export type EvalDelta = {
  /**
   * \[at\] delta action.
   */
  action: bigint;

  /**
   * \[bs\] bytes value.
   */
  bytes?: string;

  /**
   * \[ui\] uint value.
   */
  uint?: bigint;
};
