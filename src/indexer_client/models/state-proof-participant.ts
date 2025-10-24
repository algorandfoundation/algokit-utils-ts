import type { ModelMetadata } from '../core/model-runtime'
import type { StateProofVerifier } from './state-proof-verifier'
import { StateProofVerifierMeta } from './state-proof-verifier'

export type StateProofParticipant = {
  verifier?: StateProofVerifier

  /**
   * \[w\]
   */
  weight?: bigint
}

export const StateProofParticipantMeta: ModelMetadata = {
  name: 'StateProofParticipant',
  kind: 'object',
  fields: [
    {
      name: 'verifier',
      wireKey: 'verifier',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateProofVerifierMeta },
    },
    {
      name: 'weight',
      wireKey: 'weight',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
