import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  bytesCodec,
} from '@algorandfoundation/algokit-common'

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
      codec: bytesCodec,
    },
    {
      name: 'keyLifetime',
      wireKey: 'key-lifetime',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
