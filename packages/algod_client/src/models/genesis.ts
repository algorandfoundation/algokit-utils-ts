import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, numberCodec, booleanCodec, ArrayCodec, ObjectModelCodec } from '@algorandfoundation/algokit-common'
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

export const GenesisMeta: ObjectModelMetadata<Genesis> = {
  name: 'Genesis',
  kind: 'object',
  fields: [
    {
      name: 'alloc',
      wireKey: 'alloc',
      optional: false,
      codec: new ArrayCodec(new ObjectModelCodec(GenesisAllocationMeta)),
    },
    {
      name: 'comment',
      wireKey: 'comment',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'devmode',
      wireKey: 'devmode',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'fees',
      wireKey: 'fees',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'network',
      wireKey: 'network',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'proto',
      wireKey: 'proto',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'rwd',
      wireKey: 'rwd',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'timestamp',
      wireKey: 'timestamp',
      optional: true,
      codec: numberCodec,
    },
  ],
}
