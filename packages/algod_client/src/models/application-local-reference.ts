import type { ModelMetadata } from '../core/model-runtime'

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

export const ApplicationLocalReferenceMeta: ModelMetadata = {
  name: 'ApplicationLocalReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'app',
      wireKey: 'app',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
