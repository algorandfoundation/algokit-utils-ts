import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec } from '@algorandfoundation/algokit-common'

export type BuildVersion = {
  branch: string
  buildNumber: number
  channel: string
  commitHash: string
  major: number
  minor: number
}

export const BuildVersionMeta: ObjectModelMetadata<BuildVersion> = {
  name: 'BuildVersion',
  kind: 'object',
  fields: [
    {
      name: 'branch',
      wireKey: 'branch',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'buildNumber',
      wireKey: 'build_number',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'channel',
      wireKey: 'channel',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'commitHash',
      wireKey: 'commit_hash',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'major',
      wireKey: 'major',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'minor',
      wireKey: 'minor',
      optional: false,
      codec: numberCodec,
    },
  ],
}
