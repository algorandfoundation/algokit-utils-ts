/**
 * Represents an AVM value.
 */
export type AvmValue = {
  /**
   * value type. Value `1` refers to **bytes**, value `2` refers to **uint64**
   */
  type: bigint;

  /**
   * bytes value.
   */
  bytes?: string;

  /**
   * uint value.
   */
  uint?: bigint;
};
