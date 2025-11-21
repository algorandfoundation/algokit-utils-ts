import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

export type BuildVersion = {
  branch: string
  buildNumber: number
  channel: string
  commitHash: string
  major: number
  minor: number
}

export const BuildVersionMeta: ObjectModelMetadata = {
  name: 'BuildVersion',
  kind: 'object',
  fields: [
    {
      name: 'branch',
      wireKey: 'branch',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'buildNumber',
      wireKey: 'build_number',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'channel',
      wireKey: 'channel',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'commitHash',
      wireKey: 'commit_hash',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'major',
      wireKey: 'major',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'minor',
      wireKey: 'minor',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
