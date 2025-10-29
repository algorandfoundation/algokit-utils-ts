import type { ModelMetadata } from '../core/model-runtime'

export type GenesisAllocation = {
  addr: string
  comment: string
  state: {
    algo: bigint
    onl: bigint
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
      type: { kind: 'scalar' },
    },
  ],
}
