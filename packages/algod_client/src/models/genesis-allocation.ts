import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'

const GenesisAllocationStateMeta: ModelMetadata = {
  name: 'GenesisAllocationStateMeta',
  kind: 'object',
  fields: [
    {
      name: 'algo',
      wireKey: 'algo',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'onl',
      wireKey: 'onl',
      optional: false,
      nullable: false,
      codec: numberCodec,
    },
    {
      name: 'sel',
      wireKey: 'sel',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'stprf',
      wireKey: 'stprf',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'vote',
      wireKey: 'vote',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'voteKd',
      wireKey: 'voteKD',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteFst',
      wireKey: 'voteFst',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'voteLst',
      wireKey: 'voteLst',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}

export type GenesisAllocation = {
  addr: string
  comment: string
  state: {
    algo: bigint
    onl: number
    sel?: string
    stprf?: string
    vote?: string
    voteKd?: bigint
    voteFst?: bigint
    voteLst?: bigint
  }
}

export const GenesisAllocationMeta: ModelMetadata = {
  name: 'GenesisAllocation',
  kind: 'object',
  fields: [
    {
      name: 'addr',
      wireKey: 'addr',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'state',
      wireKey: 'state',
      optional: false,
      nullable: false,
      codec: new ModelCodec(GenesisAllocationStateMeta),
    },
  ],
}
