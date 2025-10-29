import type { ModelMetadata } from '../core/model-runtime'

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
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradeDelay',
      wireKey: 'upgrade-delay',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'upgradePropose',
      wireKey: 'upgrade-propose',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
