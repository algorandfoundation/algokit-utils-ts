import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bytesCodec, stringArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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

export const VersionMeta: ObjectModelMetadata<Version> = {
  name: 'Version',
  kind: 'object',
  fields: [
    {
      name: 'build',
      wireKey: 'build',
      optional: false,
      codec: new ObjectModelCodec(BuildVersionMeta),
    },
    {
      name: 'genesisHashB64',
      wireKey: 'genesis_hash_b64',
      optional: false,
      codec: bytesCodec,
    },
    {
      name: 'genesisId',
      wireKey: 'genesis_id',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'versions',
      wireKey: 'versions',
      optional: false,
      codec: stringArrayCodec,
    },
  ],
}
