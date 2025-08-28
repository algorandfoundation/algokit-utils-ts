/**
 * Represents a key registration transaction that registers an account online or offline
 * for participation in Algorand consensus.
 */
export interface KeyRegistrationTransactionFields {
  /**
   * Root participation public key (32 bytes).
   */
  voteKey?: Uint8Array

  /**
   * VRF public key (32 bytes).
   */
  selectionKey?: Uint8Array

  /**
   * State proof key (64 bytes).
   */
  stateProofKey?: Uint8Array

  /**
   * First round for which the participation key is valid.
   */
  voteFirst?: bigint

  /**
   * Last round for which the participation key is valid.
   */
  voteLast?: bigint

  /**
   * Key dilution for the 2-level participation key.
   */
  voteKeyDilution?: bigint

  /**
   * Mark account as non-reward earning.
   */
  nonParticipation?: boolean
}
