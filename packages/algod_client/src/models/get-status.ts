import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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
  catchpointTotalAccounts?: number

  /**
   * The number of accounts from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedAccounts?: number

  /**
   * The number of accounts from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedAccounts?: number

  /**
   * The total number of key-values (KVs) included in the current catchpoint
   */
  catchpointTotalKvs?: number

  /**
   * The number of key-values (KVs) from the current catchpoint that have been processed so far as part of the catchup
   */
  catchpointProcessedKvs?: number

  /**
   * The number of key-values (KVs) from the current catchpoint that have been verified so far as part of the catchup
   */
  catchpointVerifiedKvs?: number

  /**
   * The total number of blocks that are required to complete the current catchpoint catchup
   */
  catchpointTotalBlocks?: number

  /**
   * The number of blocks that have already been obtained by the node as part of the catchup
   */
  catchpointAcquiredBlocks?: number

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
  upgradeVotesRequired?: number

  /**
   * Total votes cast for consensus upgrade
   */
  upgradeVotes?: number

  /**
   * Yes votes cast for consensus upgrade
   */
  upgradeYesVotes?: number

  /**
   * No votes cast for consensus upgrade
   */
  upgradeNoVotes?: number

  /**
   * Next protocol round
   */
  upgradeNextProtocolVoteBefore?: bigint

  /**
   * Total voting rounds for current upgrade
   */
  upgradeVoteRounds?: number
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
      codec: bigIntCodec,
    },
    {
      name: 'lastRound',
      wireKey: 'last-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'lastVersion',
      wireKey: 'last-version',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'nextVersion',
      wireKey: 'next-version',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'nextVersionRound',
      wireKey: 'next-version-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'nextVersionSupported',
      wireKey: 'next-version-supported',
      optional: false,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'stoppedAtUnsupportedRound',
      wireKey: 'stopped-at-unsupported-round',
      optional: false,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'timeSinceLastRound',
      wireKey: 'time-since-last-round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'lastCatchpoint',
      wireKey: 'last-catchpoint',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'catchpoint',
      wireKey: 'catchpoint',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'catchpointTotalAccounts',
      wireKey: 'catchpoint-total-accounts',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointProcessedAccounts',
      wireKey: 'catchpoint-processed-accounts',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointVerifiedAccounts',
      wireKey: 'catchpoint-verified-accounts',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointTotalKvs',
      wireKey: 'catchpoint-total-kvs',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointProcessedKvs',
      wireKey: 'catchpoint-processed-kvs',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointVerifiedKvs',
      wireKey: 'catchpoint-verified-kvs',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointTotalBlocks',
      wireKey: 'catchpoint-total-blocks',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'catchpointAcquiredBlocks',
      wireKey: 'catchpoint-acquired-blocks',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'upgradeDelay',
      wireKey: 'upgrade-delay',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'upgradeNodeVote',
      wireKey: 'upgrade-node-vote',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'upgradeVotesRequired',
      wireKey: 'upgrade-votes-required',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'upgradeVotes',
      wireKey: 'upgrade-votes',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'upgradeYesVotes',
      wireKey: 'upgrade-yes-votes',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'upgradeNoVotes',
      wireKey: 'upgrade-no-votes',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'upgradeNextProtocolVoteBefore',
      wireKey: 'upgrade-next-protocol-vote-before',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'upgradeVoteRounds',
      wireKey: 'upgrade-vote-rounds',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
