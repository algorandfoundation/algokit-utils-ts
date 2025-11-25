import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bytesCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const StateProofMeta: ObjectModelMetadata = {
  name: 'StateProof',
  kind: 'object',
  fields: [
    {
      name: 'message',
      wireKey: 'Message',
      optional: false,
      codec: new ObjectModelCodec(StateProofMessageMeta),
    },
    {
      name: 'stateProof',
      wireKey: 'StateProof',
      optional: false,
      codec: bytesCodec,
    },
  ],
}
