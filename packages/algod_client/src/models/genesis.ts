import type { ModelMetadata } from '../core/model-runtime'
import type { GenesisAllocation } from './genesis-allocation'
import { GenesisAllocationMeta } from './genesis-allocation'

export type Genesis = {
  alloc: GenesisAllocation[]
  comment?: string
  devmode?: boolean
  fees: string
  id: string
  network: string
  proto: string
  rwd: string
  timestamp: bigint
}

export const GenesisMeta: ModelMetadata = {
  name: 'Genesis',
  kind: 'object',
  fields: [
    {
      name: 'alloc',
      wireKey: 'alloc',
      optional: false,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => GenesisAllocationMeta } },
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'devmode',
      wireKey: 'devmode',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'fees',
      wireKey: 'fees',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'network',
      wireKey: 'network',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'proto',
      wireKey: 'proto',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rwd',
      wireKey: 'rwd',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'timestamp',
      wireKey: 'timestamp',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
