import type { StateProofMessage } from "./index";

/**
 * Represents a state proof and its corresponding message
 */
export type StateProof = {
  message: StateProofMessage;

  /**
   * The encoded StateProof for the message.
   */
  stateProof: string;
};
