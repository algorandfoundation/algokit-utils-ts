import type { ModelMetadata } from '../core/model-runtime'

/**
 * Fields relating to rewards,
 */
export type BlockRewards = {
  /**
   * \[fees\] accepts transaction fees, it can only spend to the incentive pool.
   */
  feeSink: string

  /**
   * \[rwcalr\] number of leftover MicroAlgos after the distribution of rewards-rate MicroAlgos for every reward unit in the next round.
   */
  rewardsCalculationRound: bigint

  /**
   * \[earn\] How many rewards, in MicroAlgos, have been distributed to each RewardUnit of MicroAlgos since genesis.
   */
  rewardsLevel: bigint

  /**
   * \[rwd\] accepts periodic injections from the fee-sink and continually redistributes them as rewards.
   */
  rewardsPool: string

  /**
   * \[rate\] Number of new MicroAlgos added to the participation stake from rewards at the next round.
   */
  rewardsRate: bigint

  /**
   * \[frac\] Number of leftover MicroAlgos after the distribution of RewardsRate/rewardUnits MicroAlgos for every reward unit in the next round.
   */
  rewardsResidue: bigint
}

export const BlockRewardsMeta: ModelMetadata = {
  name: 'BlockRewards',
  kind: 'object',
  fields: [
    {
      name: 'feeSink',
      wireKey: 'fee-sink',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rewardsCalculationRound',
      wireKey: 'rewards-calculation-round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rewardsLevel',
      wireKey: 'rewards-level',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rewardsPool',
      wireKey: 'rewards-pool',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rewardsRate',
      wireKey: 'rewards-rate',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'rewardsResidue',
      wireKey: 'rewards-residue',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
