import type { ModelMetadata } from '../core/model-runtime'

/**
 * Represents the message that the state proofs are attesting to.
 */
export type StateProofMessage = {
  /**
   * The vector commitment root on all light block headers within a state proof interval.
   */
  blockHeadersCommitment: Uint8Array

  /**
   * The vector commitment root of the top N accounts to sign the next StateProof.
   */
  votersCommitment: Uint8Array

  /**
   * An integer value representing the natural log of the proven weight with 16 bits of precision. This value would be used to verify the next state proof.
   */
  lnProvenWeight: bigint

  /**
   * The first round the message attests to.
   */
  firstAttestedRound: bigint

  /**
   * The last round the message attests to.
   */
  lastAttestedRound: bigint
}

export const StateProofMessageMeta: ModelMetadata = {
  name: 'StateProofMessage',
  kind: 'object',
  fields: [
    {
      name: 'blockHeadersCommitment',
      wireKey: 'BlockHeadersCommitment',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'votersCommitment',
      wireKey: 'VotersCommitment',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'lnProvenWeight',
      wireKey: 'LnProvenWeight',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'firstAttestedRound',
      wireKey: 'FirstAttestedRound',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastAttestedRound',
      wireKey: 'LastAttestedRound',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
