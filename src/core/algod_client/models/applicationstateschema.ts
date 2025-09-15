/**
 * Specifies maximums on the number of each type that may be stored.
 */
export type ApplicationStateSchema = {
  /**
   * \[nui\] num of uints.
   */
  numUint: bigint;

  /**
   * \[nbs\] num of byte slices.
   */
  numByteSlice: bigint;
};
