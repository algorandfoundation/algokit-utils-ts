import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { BuildVersion } from './build-version'
import { BuildVersionMeta } from './build-version'

/**
 * algod version information.
 */
export type Version = {
  build: BuildVersion
  genesisHashB64: Uint8Array
  genesisId: string
  versions: string[]
}

export const VersionMeta: ObjectModelMetadata = {
  name: 'Version',
  kind: 'object',
  fields: [
    {
      name: 'build',
      wireKey: 'build',
      optional: false,
      nullable: false,
      codec: new ModelCodec(BuildVersionMeta),
    },
    {
      name: 'genesisHashB64',
      wireKey: 'genesis_hash_b64',
      optional: false,
      nullable: false,
      codec: bytesCodec,
    },
    {
      name: 'genesisId',
      wireKey: 'genesis_id',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'versions',
      wireKey: 'versions',
      optional: false,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
  ],
}
