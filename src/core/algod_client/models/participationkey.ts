import type { AccountParticipation } from "./index";

/**
 * Represents a participation key used by the node.
 */
export type ParticipationKey = {
  /**
   * The key's ParticipationID.
   */
  id: string;

  /**
   * Address the key was generated for.
   */
  address: string;

  /**
   * When registered, this is the first round it may be used.
   */
  effectiveFirstValid?: bigint;

  /**
   * When registered, this is the last round it may be used.
   */
  effectiveLastValid?: bigint;

  /**
   * Round when this key was last used to vote.
   */
  lastVote?: bigint;

  /**
   * Round when this key was last used to propose a block.
   */
  lastBlockProposal?: bigint;

  /**
   * Round when this key was last used to generate a state proof.
   */
  lastStateProof?: bigint;
  key: AccountParticipation;
};
