import type { ModelMetadata } from '../core/model-runtime'
import type { AccountParticipation } from './account-participation'
import { AccountParticipationMeta } from './account-participation'

/**
 * Represents a participation key used by the node.
 */
export type ParticipationKey = {
  /**
   * The key's ParticipationID.
   */
  id: string

  /**
   * Address the key was generated for.
   */
  address: string

  /**
   * When registered, this is the first round it may be used.
   */
  effectiveFirstValid?: bigint

  /**
   * When registered, this is the last round it may be used.
   */
  effectiveLastValid?: bigint

  /**
   * Round when this key was last used to vote.
   */
  lastVote?: bigint

  /**
   * Round when this key was last used to propose a block.
   */
  lastBlockProposal?: bigint

  /**
   * Round when this key was last used to generate a state proof.
   */
  lastStateProof?: bigint
  key: AccountParticipation
}

export const ParticipationKeyMeta: ModelMetadata = {
  name: 'ParticipationKey',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'effectiveFirstValid',
      wireKey: 'effective-first-valid',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'effectiveLastValid',
      wireKey: 'effective-last-valid',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastVote',
      wireKey: 'last-vote',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'lastBlockProposal',
      wireKey: 'last-block-proposal',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'lastStateProof',
      wireKey: 'last-state-proof',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'key',
      wireKey: 'key',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => AccountParticipationMeta },
    },
  ],
}
