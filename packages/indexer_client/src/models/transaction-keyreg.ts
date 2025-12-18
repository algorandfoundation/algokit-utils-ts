import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, booleanCodec, fixedBytes32Codec, fixedBytes64Codec } from '@algorandfoundation/algokit-common'

/**
 * Fields for a keyreg transaction.
 *
 * Definition:
 * data/transactions/keyreg.go : KeyregTxnFields
 */
export type TransactionKeyreg = {
  /**
   * \[nonpart\] Mark the account as participating or non-participating.
   */
  nonParticipation?: boolean

  /**
   * \[selkey\] Public key used with the Verified Random Function (VRF) result during committee selection.
   */
  selectionParticipationKey?: Uint8Array

  /**
   * \[votefst\] First round this participation key is valid.
   */
  voteFirstValid?: bigint

  /**
   * \[votekd\] Number of subkeys in each batch of participation keys.
   */
  voteKeyDilution?: bigint

  /**
   * \[votelst\] Last round this participation key is valid.
   */
  voteLastValid?: bigint

  /**
   * \[votekey\] Participation public key used in key registration transactions.
   */
  voteParticipationKey?: Uint8Array

  /**
   * \[sprfkey\] State proof key used in key registration transactions.
   */
  stateProofKey?: Uint8Array
}

export const TransactionKeyregMeta: ObjectModelMetadata<TransactionKeyreg> = {
  name: 'TransactionKeyreg',
  kind: 'object',
  fields: [
    {
      name: 'nonParticipation',
      wireKey: 'non-participation',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'selectionParticipationKey',
      wireKey: 'selection-participation-key',
      optional: true,
      codec: fixedBytes32Codec,
    },
    {
      name: 'voteFirstValid',
      wireKey: 'vote-first-valid',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'voteKeyDilution',
      wireKey: 'vote-key-dilution',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'voteLastValid',
      wireKey: 'vote-last-valid',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'voteParticipationKey',
      wireKey: 'vote-participation-key',
      optional: true,
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
