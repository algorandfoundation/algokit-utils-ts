import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, fixedBytes32Codec, fixedBytes64Codec } from '@algorandfoundation/algokit-common'

/**
 * AccountParticipation describes the parameters used by this account in consensus protocol.
 */
export type AccountParticipation = {
  /**
   * \[sel\] Selection public key (if any) currently registered for this round.
   */
  selectionParticipationKey: Uint8Array

  /**
   * \[voteFst\] First round for which this participation is valid.
   */
  voteFirstValid: bigint

  /**
   * \[voteKD\] Number of subkeys in each batch of participation keys.
   */
  voteKeyDilution: bigint

  /**
   * \[voteLst\] Last round for which this participation is valid.
   */
  voteLastValid: bigint

  /**
   * \[vote\] root participation public key (if any) currently registered for this round.
   */
  voteParticipationKey: Uint8Array

  /**
   * \[stprf\] Root of the state proof key (if any)
   */
  stateProofKey?: Uint8Array
}

export const AccountParticipationMeta: ObjectModelMetadata<AccountParticipation> = {
  name: 'AccountParticipation',
  kind: 'object',
  fields: [
    {
      name: 'selectionParticipationKey',
      wireKey: 'selection-participation-key',
      optional: false,
      codec: fixedBytes32Codec,
    },
    {
      name: 'voteFirstValid',
      wireKey: 'vote-first-valid',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteKeyDilution',
      wireKey: 'vote-key-dilution',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteLastValid',
      wireKey: 'vote-last-valid',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteParticipationKey',
      wireKey: 'vote-participation-key',
      optional: false,
      codec: fixedBytes32Codec,
    },
    {
      name: 'stateProofKey',
      wireKey: 'state-proof-key',
      optional: true,
      codec: fixedBytes64Codec,
    },
  ],
}
