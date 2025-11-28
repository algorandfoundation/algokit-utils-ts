import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  bigIntCodec,
  addressCodec,
} from '@algorandfoundation/algokit-common'

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

export const ApplicationLocalReferenceMeta: ObjectModelMetadata<ApplicationLocalReference> = {
  name: 'ApplicationLocalReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      codec: addressCodec,
    },
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
