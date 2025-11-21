import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      nullable: false,
      codec: new ModelCodec(StateProofMessageMeta),
    },
    {
      name: 'stateProof',
      wireKey: 'StateProof',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
