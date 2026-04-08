import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * Participation account data that needs to be checked/acted on by the network.
 */
export type ParticipationUpdates = {
  /**
   * \[partupdrmv\] a list of online accounts that needs to be converted to offline since their participation key expired.
   */
  expiredParticipationAccounts: string[]

  /**
   * \[partupabs\] a list of online accounts that need to be suspended.
   */
  absentParticipationAccounts: string[]
}

export const ParticipationUpdatesMeta: ObjectModelMetadata<ParticipationUpdates> = {
  name: 'ParticipationUpdates',
  kind: 'object',
  fields: [
    {
      name: 'expiredParticipationAccounts',
      wireKey: 'expired-participation-accounts',
      optional: false,
      codec: stringArrayCodec,
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'absent-participation-accounts',
      optional: false,
      codec: stringArrayCodec,
    },
  ],
}
