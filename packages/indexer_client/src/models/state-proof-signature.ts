import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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

export const StateProofSignatureMeta: ObjectModelMetadata = {
  name: 'StateProofSignature',
  kind: 'object',
  fields: [
    {
      name: 'falconSignature',
      wireKey: 'falcon-signature',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'merkleArrayIndex',
      wireKey: 'merkle-array-index',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'proof',
      wireKey: 'proof',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'verifyingKey',
      wireKey: 'verifying-key',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
  ],
}
