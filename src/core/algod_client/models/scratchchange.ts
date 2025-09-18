import type { AvmValue } from "./index";

/**
 * A write operation into a scratch slot.
 */
export type ScratchChange = {
  /**
   * The scratch slot written.
   */
  slot: bigint;
  newValue: AvmValue;
};
