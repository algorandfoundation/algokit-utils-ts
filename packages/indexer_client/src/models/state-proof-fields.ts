import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { MerkleArrayProof } from './merkle-array-proof'
import { MerkleArrayProofMeta } from './merkle-array-proof'
import type { StateProofReveal } from './state-proof-reveal'
import { StateProofRevealMeta } from './state-proof-reveal'

/**
 * \[sp\] represents a state proof.
 *
 * Definition:
 * crypto/stateproof/structs.go : StateProof
 */
export type StateProofFields = {
  /**
   * \[c\]
   */
  sigCommit?: Uint8Array

  /**
   * \[w\]
   */
  signedWeight?: bigint
  sigProofs?: MerkleArrayProof
  partProofs?: MerkleArrayProof

  /**
   * \[v\] Salt version of the merkle signature.
   */
  saltVersion?: number

  /**
   * \[r\] Note that this is actually stored as a map[uint64] - Reveal in the actual msgp
   */
  reveals?: StateProofReveal[]

  /**
   * \[pr\] Sequence of reveal positions.
   */
  positionsToReveal?: bigint[]
}

export const StateProofFieldsMeta: ModelMetadata = {
  name: 'StateProofFields',
  kind: 'object',
  fields: [
    {
      name: 'sigCommit',
      wireKey: 'sig-commit',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'signedWeight',
      wireKey: 'signed-weight',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'sigProofs',
      wireKey: 'sig-proofs',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'partProofs',
      wireKey: 'part-proofs',
      optional: true,
      nullable: false,
      codec: new ModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'saltVersion',
      wireKey: 'salt-version',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'reveals',
      wireKey: 'reveals',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(new ModelCodec(StateProofRevealMeta)),
    },
    {
      name: 'positionsToReveal',
      wireKey: 'positions-to-reveal',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(bigIntCodec),
    },
  ],
}
