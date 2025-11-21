import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type StateProofVerifier = {
  /**
   * \[cmt\] Represents the root of the vector commitment tree.
   */
  commitment?: Uint8Array

  /**
   * \[lf\] Key lifetime.
   */
  keyLifetime?: bigint
}

export const StateProofVerifierMeta: ObjectModelMetadata = {
  name: 'StateProofVerifier',
  kind: 'object',
  fields: [
    {
      name: 'commitment',
      wireKey: 'commitment',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'keyLifetime',
      wireKey: 'key-lifetime',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
