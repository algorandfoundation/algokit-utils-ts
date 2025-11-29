import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { bigIntCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type IndexerStateProofMessage = {
  /**
   * \[b\]
   */
  blockHeadersCommitment?: Uint8Array

  /**
   * \[v\]
   */
  votersCommitment?: Uint8Array

  /**
   * \[P\]
   */
  lnProvenWeight?: bigint

  /**
   * \[f\]
   */
  firstAttestedRound?: bigint

  /**
   * \[l\]
   */
  latestAttestedRound?: bigint
}

export const IndexerStateProofMessageMeta: ObjectModelMetadata<IndexerStateProofMessage> = {
  name: 'IndexerStateProofMessage',
  kind: 'object',
  fields: [
    {
      name: 'blockHeadersCommitment',
      wireKey: 'block-headers-commitment',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'votersCommitment',
      wireKey: 'voters-commitment',
      optional: true,
      codec: bytesCodec,
    },
    {
      name: 'lnProvenWeight',
      wireKey: 'ln-proven-weight',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'firstAttestedRound',
      wireKey: 'first-attested-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'latestAttestedRound',
      wireKey: 'latest-attested-round',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
