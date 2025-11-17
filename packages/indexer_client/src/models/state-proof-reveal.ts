import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { StateProofParticipant } from './state-proof-participant'
import { StateProofParticipantMeta } from './state-proof-participant'
import type { StateProofSigSlot } from './state-proof-sig-slot'
import { StateProofSigSlotMeta } from './state-proof-sig-slot'

export type StateProofReveal = {
  /**
   * The position in the signature and participants arrays corresponding to this entry.
   */
  position?: bigint
  sigSlot?: StateProofSigSlot
  participant?: StateProofParticipant
}

export const StateProofRevealMeta: ModelMetadata = {
  name: 'StateProofReveal',
  kind: 'object',
  fields: [
    {
      name: 'position',
      wireKey: 'position',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'sigSlot',
      wireKey: 'sig-slot',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateProofSigSlotMeta),
    },
    {
      name: 'participant',
      wireKey: 'participant',
      optional: true,
      nullable: false,
      codec: new ModelCodec(StateProofParticipantMeta),
    },
  ],
}
