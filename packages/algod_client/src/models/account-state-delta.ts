import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  addressCodec,
  ArrayModelCodec,
} from '@algorandfoundation/algokit-common'
import type { StateDelta } from './state-delta'
import { StateDeltaMeta } from './state-delta'

/**
 * Application state delta.
 */
export type AccountStateDelta = {
  address: string
  delta: StateDelta
}

export const AccountStateDeltaMeta: ObjectModelMetadata = {
  name: 'AccountStateDelta',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'delta',
      wireKey: 'delta',
      optional: false,
      codec: new ArrayModelCodec(StateDeltaMeta),
    },
  ],
}
