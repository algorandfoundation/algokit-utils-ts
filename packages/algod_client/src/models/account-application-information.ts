import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

export type AccountApplicationInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint
  appLocalState?: ApplicationLocalState
  createdApp?: ApplicationParams
}

export const AccountApplicationInformationMeta: ObjectModelMetadata = {
  name: 'AccountApplicationInformation',
  kind: 'object',
  fields: [
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'appLocalState',
      wireKey: 'app-local-state',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationLocalStateMeta),
    },
    {
      name: 'createdApp',
      wireKey: 'created-app',
      optional: true,
      nullable: false,
      codec: new ModelCodec(ApplicationParamsMeta),
    },
  ],
}
