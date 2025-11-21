import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * Participation account data that needs to be checked/acted on by the network.
 */
export type ParticipationUpdates = {
  /**
   * \[partupdrmv\] a list of online accounts that needs to be converted to offline since their participation key expired.
   */
  expiredParticipationAccounts?: string[]

  /**
   * \[partupabs\] a list of online accounts that need to be suspended.
   */
  absentParticipationAccounts?: string[]
}

export const ParticipationUpdatesMeta: ObjectModelMetadata = {
  name: 'ParticipationUpdates',
  kind: 'object',
  fields: [
    {
      name: 'expiredParticipationAccounts',
      wireKey: 'expired-participation-accounts',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
    {
      name: 'absentParticipationAccounts',
      wireKey: 'absent-participation-accounts',
      optional: true,
      nullable: false,
      codec: new ArrayCodec(stringCodec),
    },
  ],
}
