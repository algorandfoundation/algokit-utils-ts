import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { ApplicationParams } from './application-params'
import { ApplicationParamsMeta } from './application-params'

/**
 * Application index and its parameters
 */
export type Application = {
  /**
   * \[appidx\] application index.
   */
  id: bigint
  params: ApplicationParams
}

export const ApplicationMeta: ObjectModelMetadata<Application> = {
  name: 'Application',
  kind: 'object',
  fields: [
    {
      name: 'id',
      wireKey: 'id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'params',
      wireKey: 'params',
      optional: false,
      codec: new ObjectModelCodec(ApplicationParamsMeta),
    },
  ],
}
