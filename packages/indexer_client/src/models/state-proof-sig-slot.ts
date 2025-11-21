import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
      nullable: false,
      codec: new ModelCodec(StateProofSignatureMeta),
    },
    {
      name: 'lowerSigWeight',
      wireKey: 'lower-sig-weight',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
