/**
 * AccountParticipation describes the parameters used by this account in consensus protocol.
 */
export type AccountParticipation = {
  /**
   * \[sel\] Selection public key (if any) currently registered for this round.
   */
  selectionParticipationKey: string;

  /**
   * \[voteFst\] First round for which this participation is valid.
   */
  voteFirstValid: bigint;

  /**
   * \[voteKD\] Number of subkeys in each batch of participation keys.
   */
  voteKeyDilution: bigint;

  /**
   * \[voteLst\] Last round for which this participation is valid.
   */
  voteLastValid: bigint;

  /**
   * \[vote\] root participation public key (if any) currently registered for this round.
   */
  voteParticipationKey: string;

  /**
   * \[stprf\] Root of the state proof key (if any)
   */
  stateProofKey?: string;
};
