import type { ModelMetadata } from '../core/model-runtime'

export type StateProofTracking = {
  /**
   * State Proof Type. Note the raw object uses map with this as key.
   */
  type?: bigint

  /**
   * \[v\] Root of a vector commitment containing online accounts that will help sign the proof.
   */
  votersCommitment?: Uint8Array

  /**
   * \[t\] The total number of microalgos held by the online accounts during the StateProof round.
   */
  onlineTotalWeight?: bigint

  /**
   * \[n\] Next round for which we will accept a state proof transaction.
   */
  nextRound?: number
}

export const StateProofTrackingMeta: ModelMetadata = {
  name: 'StateProofTracking',
  kind: 'object',
  fields: [
    {
      name: 'type',
      wireKey: 'type',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'votersCommitment',
      wireKey: 'voters-commitment',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'onlineTotalWeight',
      wireKey: 'online-total-weight',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'nextRound',
      wireKey: 'next-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
