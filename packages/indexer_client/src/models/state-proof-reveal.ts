import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const StateProofRevealMeta: ObjectModelMetadata<StateProofReveal> = {
  name: 'StateProofReveal',
  kind: 'object',
  fields: [
    {
      name: 'position',
      wireKey: 'position',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'sigSlot',
      wireKey: 'sig-slot',
      optional: true,
      codec: new ObjectModelCodec(StateProofSigSlotMeta),
    },
    {
      name: 'participant',
      wireKey: 'participant',
      optional: true,
      codec: new ObjectModelCodec(StateProofParticipantMeta),
    },
  ],
}
