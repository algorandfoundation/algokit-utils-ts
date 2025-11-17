import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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

export const BlockUpgradeVoteMeta: ModelMetadata = {
  name: 'BlockUpgradeVote',
  kind: 'object',
  fields: [
    {
      name: 'upgradeApprove',
      wireKey: 'upgrade-approve',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'upgradeDelay',
      wireKey: 'upgrade-delay',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'upgradePropose',
      wireKey: 'upgrade-propose',
      optional: true,
      nullable: false,
      codec: stringCodec,
    },
  ],
}
