import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { numberCodec, bytesCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
import type { MerkleArrayProof } from './merkle-array-proof'
import { MerkleArrayProofMeta } from './merkle-array-proof'

export type StateProofSignature = {
  falconSignature?: Uint8Array
  merkleArrayIndex?: number
  proof?: MerkleArrayProof

  /**
   * \[vkey\]
   */
  verifyingKey?: Uint8Array
}

export const StateProofSignatureMeta: ObjectModelMetadata<StateProofSignature> = {
  name: 'StateProofSignature',
  kind: 'object',
  fields: [
    {
      name: 'falconSignature',
      wireKey: 'falcon-signature',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'merkleArrayIndex',
      wireKey: 'merkle-array-index',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'proof',
      wireKey: 'proof',
      optional: true,
      codec: new ObjectModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'verifyingKey',
      wireKey: 'verifying-key',
      optional: true,
      codec: bytesCodec,
    },
  ],
}
