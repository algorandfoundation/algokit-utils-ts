import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec, ModelCodec } from '@algorandfoundation/algokit-common'
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
  timestamp?: number
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
      codec: new ArrayCodec(new ModelCodec(GenesisAllocationMeta)),
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'devmode',
      wireKey: 'devmode',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'fees',
      wireKey: 'fees',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'network',
      wireKey: 'network',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'proto',
      wireKey: 'proto',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'rwd',
      wireKey: 'rwd',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'timestamp',
      wireKey: 'timestamp',
      optional: true,
      nullable: false,
      codec: numberCodec,
    },
  ],
}
