/**
 * NodeStatus contains the information about a node status
 */
export type GetStatus = {
  /**
   * CatchupTime in nanoseconds
   */
  catchupTime: bigint;

  /**
   * LastRound indicates the last round seen
   */
  lastRound: bigint;

  /**
   * LastVersion indicates the last consensus version supported
   */
  lastVersion: string;

  /**
   * NextVersion of consensus protocol to use
   */
  nextVersion: string;

  /**
   * NextVersionRound is the round at which the next consensus version will apply
   */
  nextVersionRound: bigint;

  /**
   * NextVersionSupported indicates whether the next consensus version is supported by this node
   */
  nextVersionSupported: boolean;

  /**
   * StoppedAtUnsupportedRound indicates that the node does not support the new rounds and has stopped making progress
   */
  stoppedAtUnsupportedRound: boolean;

  /**
   * TimeSinceLastRound in nanoseconds
   */
  timeSinceLastRound: bigint;

  /**
   * The last catchpoint seen by the node
   */
  lastCatchpoint?: string;

  /**
   * The current catchpoint that is being caught up to
   */
  catchpoint?: string;

  /**
   * The total number of accounts included in the current catchpoint
   */
  catchpointTotalAccounts?: bigint;

  /**
   * The number of accounts from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedAccounts?: bigint;

  /**
   * The number of accounts from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedAccounts?: bigint;

  /**
   * The total number of key-values (KVs) included in the current catchpoint
   */
  catchpointTotalKvs?: bigint;

  /**
   * The number of key-values (KVs) from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedKvs?: bigint;

  /**
   * The number of key-values (KVs) from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedKvs?: bigint;

  /**
   * The total number of blocks that are required to complete the current catchpoint catchup
   */
  catchpointTotalBlocks?: bigint;

  /**
   * The number of blocks that have already been obtained by the node as part of the catchup
   */
  catchpointAcquiredBlocks?: bigint;

  /**
   * Upgrade delay
   */
  upgradeDelay?: bigint;

  /**
   * This node's upgrade vote
   */
  upgradeNodeVote?: boolean;

  /**
   * Yes votes required for consensus upgrade
   */
  upgradeVotesRequired?: bigint;

  /**
   * Total votes cast for consensus upgrade
   */
  upgradeVotes?: bigint;

  /**
   * Yes votes cast for consensus upgrade
   */
  upgradeYesVotes?: bigint;

  /**
   * No votes cast for consensus upgrade
   */
  upgradeNoVotes?: bigint;

  /**
   * Next protocol round
   */
  upgradeNextProtocolVoteBefore?: bigint;

  /**
   * Total voting rounds for current upgrade
   */
  upgradeVoteRounds?: bigint;
};
