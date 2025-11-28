import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

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

export const StateProofTrackingMeta: ObjectModelMetadata<StateProofTracking> = {
  name: 'StateProofTracking',
  kind: 'object',
  fields: [
    {
      name: 'type',
      wireKey: 'type',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'votersCommitment',
      wireKey: 'voters-commitment',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'onlineTotalWeight',
      wireKey: 'online-total-weight',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'nextRound',
      wireKey: 'next-round',
      optional: true,
      codec: numberCodec,
    },
  ],
}
