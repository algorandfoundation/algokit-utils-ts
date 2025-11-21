import type { ModelMetadata } from '../core/model-runtime'

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

export const TransactionKeyregMeta: ModelMetadata = {
  name: 'TransactionKeyreg',
  kind: 'object',
  fields: [
    {
      name: 'nonParticipation',
      wireKey: 'non-participation',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'selectionParticipationKey',
      wireKey: 'selection-participation-key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'voteFirstValid',
      wireKey: 'vote-first-valid',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'voteKeyDilution',
      wireKey: 'vote-key-dilution',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'voteLastValid',
      wireKey: 'vote-last-valid',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'voteParticipationKey',
      wireKey: 'vote-participation-key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'stateProofKey',
      wireKey: 'state-proof-key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
