import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * References an account's local state for an application.
 */
export type ApplicationLocalReference = {
  /**
   * Address of the account with the local state.
   */
  account: string

  /**
   * Application ID of the local state application.
   */
  app: bigint
}

export const ApplicationLocalReferenceMeta: ObjectModelMetadata = {
  name: 'ApplicationLocalReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
