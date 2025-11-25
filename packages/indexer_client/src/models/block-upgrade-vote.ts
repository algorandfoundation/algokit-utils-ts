import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * Fields relating to voting for a protocol upgrade.
 */
export type BlockUpgradeVote = {
  /**
   * \[upgradeyes\] Indicates a yes vote for the current proposal.
   */
  upgradeApprove?: boolean

  /**
   * \[upgradedelay\] Indicates the time between acceptance and execution.
   */
  upgradeDelay?: bigint

  /**
   * \[upgradeprop\] Indicates a proposed upgrade.
   */
  upgradePropose?: string
}

export const BlockUpgradeVoteMeta: ObjectModelMetadata = {
  name: 'BlockUpgradeVote',
  kind: 'object',
  fields: [
    {
      name: 'upgradeApprove',
      wireKey: 'upgrade-approve',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'upgradeDelay',
      wireKey: 'upgrade-delay',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'upgradePropose',
      wireKey: 'upgrade-propose',
      optional: true,
      codec: stringCodec,
    },
  ],
}
