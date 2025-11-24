import type { ModelMetadata } from '../core/model-runtime'

export type BuildVersion = {
  branch: string
  buildNumber: bigint
  channel: string
  commitHash: string
  major: bigint
  minor: bigint
}

export const BuildVersionMeta: ModelMetadata = {
  name: 'BuildVersion',
  kind: 'object',
  fields: [
    {
      name: 'branch',
      wireKey: 'branch',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'buildNumber',
      wireKey: 'build_number',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'channel',
      wireKey: 'channel',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'commitHash',
      wireKey: 'commit_hash',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'major',
      wireKey: 'major',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'minor',
      wireKey: 'minor',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
