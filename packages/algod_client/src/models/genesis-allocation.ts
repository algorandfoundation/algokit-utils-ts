import type { ModelMetadata } from '../core/model-runtime'

const GenesisAllocationStateMeta: ModelMetadata = {
  name: 'GenesisAllocationStateMeta',
  kind: 'object',
  fields: [
    {
      name: 'algo',
      wireKey: 'algo',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'onl',
      wireKey: 'onl',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'sel',
      wireKey: 'sel',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'stprf',
      wireKey: 'stprf',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'vote',
      wireKey: 'vote',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'voteKd',
      wireKey: 'voteKD',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'voteFst',
      wireKey: 'voteFst',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'voteLst',
      wireKey: 'voteLst',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
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
      type: { kind: 'scalar' },
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'state',
      wireKey: 'state',
      optional: false,
      nullable: false,
      type: { kind: 'model', meta: () => GenesisAllocationStateMeta },
    },
  ],
}
