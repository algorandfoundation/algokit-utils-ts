import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * AccountParticipation describes the parameters used by this account in consensus protocol.
 */
export type AccountParticipation = {
  /**
   * Selection public key (if any) currently registered for this round.
   */
  selectionParticipationKey: Uint8Array

  /**
   * First round for which this participation is valid.
   */
  voteFirstValid: bigint

  /**
   * Number of subkeys in each batch of participation keys.
   */
  voteKeyDilution: bigint

  /**
   * Last round for which this participation is valid.
   */
  voteLastValid: bigint

  /**
   * root participation public key (if any) currently registered for this round.
   */
  voteParticipationKey: Uint8Array

  /**
   * Root of the state proof key (if any)
   */
  stateProofKey?: Uint8Array
}

export const AccountParticipationMeta: ModelMetadata = {
  name: 'AccountParticipation',
  kind: 'object',
  fields: [
    {
      name: 'selectionParticipationKey',
      wireKey: 'selection-participation-key',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'voteFirstValid',
      wireKey: 'vote-first-valid',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteKeyDilution',
      wireKey: 'vote-key-dilution',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteLastValid',
      wireKey: 'vote-last-valid',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteParticipationKey',
      wireKey: 'vote-participation-key',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'stateProofKey',
      wireKey: 'state-proof-key',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
