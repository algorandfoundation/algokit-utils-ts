import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { StateProofVerifier } from './state-proof-verifier'
import { StateProofVerifierMeta } from './state-proof-verifier'

export type StateProofParticipant = {
  verifier?: StateProofVerifier

  /**
   * \[w\]
   */
  weight?: bigint
}

export const StateProofParticipantMeta: ObjectModelMetadata<StateProofParticipant> = {
  name: 'StateProofParticipant',
  kind: 'object',
  fields: [
    {
      name: 'verifier',
      wireKey: 'verifier',
      optional: true,
      codec: new ObjectModelCodec(StateProofVerifierMeta),
    },
    {
      name: 'weight',
      wireKey: 'weight',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
