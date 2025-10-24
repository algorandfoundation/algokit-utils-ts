import type { ModelMetadata } from '../core/model-runtime'
import type { StateProofSignature } from './state-proof-signature'
import { StateProofSignatureMeta } from './state-proof-signature'

export type StateProofSigSlot = {
  signature?: StateProofSignature

  /**
   * \[l\] The total weight of signatures in the lower-numbered slots.
   */
  lowerSigWeight?: bigint
}

export const StateProofSigSlotMeta: ModelMetadata = {
  name: 'StateProofSigSlot',
  kind: 'object',
  fields: [
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => StateProofSignatureMeta },
    },
    {
      name: 'lowerSigWeight',
      wireKey: 'lower-sig-weight',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
