import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'

/**
 * Application state delta.
 */
export type AccountStateDelta = {
  address: string
  delta: StateDelta
}

export const AccountStateDeltaMeta: ModelMetadata = {
  name: 'AccountStateDelta',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'delta',
      wireKey: 'delta',
      optional: false,
      nullable: false,
      codec: new ModelCodec(StateDeltaMeta),
    },
  ],
}
