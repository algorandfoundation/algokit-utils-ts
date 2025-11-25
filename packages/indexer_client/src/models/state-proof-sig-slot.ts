import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { StateProofSignature } from './state-proof-signature'
import { StateProofSignatureMeta } from './state-proof-signature'

export type StateProofSigSlot = {
  signature?: StateProofSignature

  /**
   * \[l\] The total weight of signatures in the lower-numbered slots.
   */
  lowerSigWeight?: bigint
}

export const StateProofSigSlotMeta: ObjectModelMetadata = {
  name: 'StateProofSigSlot',
  kind: 'object',
  fields: [
    {
      name: 'signature',
      wireKey: 'signature',
      optional: true,
      codec: new ObjectModelCodec(StateProofSignatureMeta),
    },
    {
      name: 'lowerSigWeight',
      wireKey: 'lower-sig-weight',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
