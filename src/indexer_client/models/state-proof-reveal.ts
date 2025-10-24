import type { ModelMetadata } from '../core/model-runtime'
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
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'sigSlot',
      wireKey: 'sig-slot',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateProofSigSlotMeta },
    },
    {
      name: 'participant',
      wireKey: 'participant',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateProofParticipantMeta },
    },
  ],
}
