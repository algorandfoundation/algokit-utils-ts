import type { ModelMetadata } from '../core/model-runtime'
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

export const VersionMeta: ModelMetadata = {
  name: 'Version',
  kind: 'object',
  fields: [
    {
      name: 'build',
      wireKey: 'build',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => BuildVersionMeta },
    },
    {
      name: 'genesisHashB64',
      wireKey: 'genesis_hash_b64',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBytes: true },
    },
    {
      name: 'genesisId',
      wireKey: 'genesis_id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'versions',
      wireKey: 'versions',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'scalar' } },
    },
  ],
}
