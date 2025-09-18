/**
 * Represents a TEAL value.
 */
export type TealValue = {
  /**
   * \[tt\] value type. Value `1` refers to **bytes**, value `2` refers to **uint**
   */
  type: bigint;

  /**
   * \[tb\] bytes value.
   */
  bytes: string;

  /**
   * \[ui\] uint value.
   */
  uint: bigint;
};
