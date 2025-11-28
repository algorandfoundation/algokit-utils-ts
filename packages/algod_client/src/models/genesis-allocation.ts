import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'

const GenesisAllocationStateMeta: ObjectModelMetadata<GenesisAllocation['state']> = {
  name: 'GenesisAllocationStateMeta',
  kind: 'object',
  fields: [
    {
      name: 'algo',
      wireKey: 'algo',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'onl',
      wireKey: 'onl',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'sel',
      wireKey: 'sel',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'stprf',
      wireKey: 'stprf',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'vote',
      wireKey: 'vote',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'voteKd',
      wireKey: 'voteKD',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'voteFst',
      wireKey: 'voteFst',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'voteLst',
      wireKey: 'voteLst',
      optional: true,
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

export const GenesisAllocationMeta: ObjectModelMetadata<GenesisAllocation> = {
  name: 'GenesisAllocation',
  kind: 'object',
  fields: [
    {
      name: 'addr',
      wireKey: 'addr',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'state',
      wireKey: 'state',
      optional: false,
      codec: new ObjectModelCodec(GenesisAllocationStateMeta),
    },
  ],
}
