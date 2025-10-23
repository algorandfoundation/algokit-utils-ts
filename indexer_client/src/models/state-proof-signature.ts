import type { ModelMetadata } from '../core/model-runtime'
import type { MerkleArrayProof } from './merkle-array-proof'
import { MerkleArrayProofMeta } from './merkle-array-proof'

export type StateProofSignature = {
  falconSignature?: Uint8Array
  merkleArrayIndex?: bigint
  proof?: MerkleArrayProof

  /**
   * \[vkey\]
   */
  verifyingKey?: Uint8Array
}

export const StateProofSignatureMeta: ModelMetadata = {
  name: 'StateProofSignature',
  kind: 'object',
  fields: [
    {
      name: 'falconSignature',
      wireKey: 'falcon-signature',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'merkleArrayIndex',
      wireKey: 'merkle-array-index',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'proof',
      wireKey: 'proof',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => MerkleArrayProofMeta },
    },
    {
      name: 'verifyingKey',
      wireKey: 'verifying-key',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
  ],
}
