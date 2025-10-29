import type { ModelMetadata } from '../core/model-runtime'
import type { StateProofMessage } from './state-proof-message'
import { StateProofMessageMeta } from './state-proof-message'

/**
 * Represents a state proof and its corresponding message
 */
export type StateProof = {
  message: StateProofMessage

  /**
   * The encoded StateProof for the message.
   */
  stateProof: Uint8Array
}

export const StateProofMeta: ModelMetadata = {
  name: 'StateProof',
  kind: 'object',
  fields: [
    {
      name: 'message',
      wireKey: 'Message',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => StateProofMessageMeta },
    },
    {
      name: 'stateProof',
      wireKey: 'StateProof',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
