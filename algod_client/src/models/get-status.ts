import type { ModelMetadata } from '../core/model-runtime'

/**
 * NodeStatus contains the information about a node status
 */
export type GetStatus = {
  /**
   * CatchupTime in nanoseconds
   */
  catchupTime: bigint

  /**
   * LastRound indicates the last round seen
   */
  lastRound: bigint

  /**
   * LastVersion indicates the last consensus version supported
   */
  lastVersion: string

  /**
   * NextVersion of consensus protocol to use
   */
  nextVersion: string

  /**
   * NextVersionRound is the round at which the next consensus version will apply
   */
  nextVersionRound: bigint

  /**
   * NextVersionSupported indicates whether the next consensus version is supported by this node
   */
  nextVersionSupported: boolean

  /**
   * StoppedAtUnsupportedRound indicates that the node does not support the new rounds and has stopped making progress
   */
  stoppedAtUnsupportedRound: boolean

  /**
   * TimeSinceLastRound in nanoseconds
   */
  timeSinceLastRound: bigint

  /**
   * The last catchpoint seen by the node
   */
  lastCatchpoint?: string

  /**
   * The current catchpoint that is being caught up to
   */
  catchpoint?: string

  /**
   * The total number of accounts included in the current catchpoint
   */
  catchpointTotalAccounts?: bigint

  /**
   * The number of accounts from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedAccounts?: bigint

  /**
   * The number of accounts from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedAccounts?: bigint

  /**
   * The total number of key-values (KVs) included in the current catchpoint
   */
  catchpointTotalKvs?: bigint

  /**
   * The number of key-values (KVs) from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedKvs?: bigint

  /**
   * The number of key-values (KVs) from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedKvs?: bigint

  /**
   * The total number of blocks that are required to complete the current catchpoint catchup
   */
  catchpointTotalBlocks?: bigint

  /**
   * The number of blocks that have already been obtained by the node as part of the catchup
   */
  catchpointAcquiredBlocks?: bigint

  /**
   * Upgrade delay
   */
  upgradeDelay?: bigint

  /**
   * This node's upgrade vote
   */
  upgradeNodeVote?: boolean

  /**
   * Yes votes required for consensus upgrade
   */
  upgradeVotesRequired?: bigint

  /**
   * Total votes cast for consensus upgrade
   */
  upgradeVotes?: bigint

  /**
   * Yes votes cast for consensus upgrade
   */
  upgradeYesVotes?: bigint

  /**
   * No votes cast for consensus upgrade
   */
  upgradeNoVotes?: bigint

  /**
   * Next protocol round
   */
  upgradeNextProtocolVoteBefore?: bigint

  /**
   * Total voting rounds for current upgrade
   */
  upgradeVoteRounds?: bigint
}

export const GetStatusMeta: ModelMetadata = {
  name: 'GetStatus',
  kind: 'object',
  fields: [
    {
      name: 'catchupTime',
      wireKey: 'catchup-time',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastVersion',
      wireKey: 'last-version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextVersion',
      wireKey: 'next-version',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextVersionRound',
      wireKey: 'next-version-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextVersionSupported',
      wireKey: 'next-version-supported',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stoppedAtUnsupportedRound',
      wireKey: 'stopped-at-unsupported-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'timeSinceLastRound',
      wireKey: 'time-since-last-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastCatchpoint',
      wireKey: 'last-catchpoint',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'catchpoint',
      wireKey: 'catchpoint',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'catchpointTotalAccounts',
      wireKey: 'catchpoint-total-accounts',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointProcessedAccounts',
      wireKey: 'catchpoint-processed-accounts',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointVerifiedAccounts',
      wireKey: 'catchpoint-verified-accounts',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointTotalKvs',
      wireKey: 'catchpoint-total-kvs',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointProcessedKvs',
      wireKey: 'catchpoint-processed-kvs',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointVerifiedKvs',
      wireKey: 'catchpoint-verified-kvs',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointTotalBlocks',
      wireKey: 'catchpoint-total-blocks',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'catchpointAcquiredBlocks',
      wireKey: 'catchpoint-acquired-blocks',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'upgradeDelay',
      wireKey: 'upgrade-delay',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeNodeVote',
      wireKey: 'upgrade-node-vote',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeVotesRequired',
      wireKey: 'upgrade-votes-required',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeVotes',
      wireKey: 'upgrade-votes',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeYesVotes',
      wireKey: 'upgrade-yes-votes',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeNoVotes',
      wireKey: 'upgrade-no-votes',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeNextProtocolVoteBefore',
      wireKey: 'upgrade-next-protocol-vote-before',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeVoteRounds',
      wireKey: 'upgrade-vote-rounds',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
