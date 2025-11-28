import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberCodec,
  bigIntCodec,
  bytesCodec,
  ArrayCodec,
  bigIntArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
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

export const StateProofFieldsMeta: ObjectModelMetadata<StateProofFields> = {
  name: 'StateProofFields',
  kind: 'object',
  fields: [
    {
      name: 'sigCommit',
      wireKey: 'sig-commit',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'signedWeight',
      wireKey: 'signed-weight',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'sigProofs',
      wireKey: 'sig-proofs',
      optional: true,
      codec: new ObjectModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'partProofs',
      wireKey: 'part-proofs',
      optional: true,
      codec: new ObjectModelCodec(MerkleArrayProofMeta),
    },
    {
      name: 'saltVersion',
      wireKey: 'salt-version',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'reveals',
      wireKey: 'reveals',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(StateProofRevealMeta)),
    },
    {
      name: 'positionsToReveal',
      wireKey: 'positions-to-reveal',
      optional: true,
      codec: bigIntArrayCodec,
    },
  ],
}
