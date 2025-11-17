import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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

export const IndexerStateProofMessageMeta: ModelMetadata = {
  name: 'IndexerStateProofMessage',
  kind: 'object',
  fields: [
    {
      name: 'blockHeadersCommitment',
      wireKey: 'block-headers-commitment',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'votersCommitment',
      wireKey: 'voters-commitment',
      optional: true,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'lnProvenWeight',
      wireKey: 'ln-proven-weight',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'firstAttestedRound',
      wireKey: 'first-attested-round',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'latestAttestedRound',
      wireKey: 'latest-attested-round',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
