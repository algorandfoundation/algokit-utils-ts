import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

export type AccountApplicationResponse = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint
  appLocalState?: ApplicationLocalState
  createdApp?: ApplicationParams
}

export const AccountApplicationResponseMeta: ObjectModelMetadata<AccountApplicationResponse> = {
  name: 'AccountApplicationResponse',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'appLocalState',
      wireKey: 'app-local-state',
      optional: true,
      codec: new ObjectModelCodec(ApplicationLocalStateMeta),
    },
    {
      name: 'createdApp',
      wireKey: 'created-app',
      optional: true,
      codec: new ObjectModelCodec(ApplicationParamsMeta),
    },
  ],
}
