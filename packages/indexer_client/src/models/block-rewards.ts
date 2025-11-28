import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
} from '@algorandfoundation/algokit-common'

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

export const BlockRewardsMeta: ObjectModelMetadata<BlockRewards> = {
  name: 'BlockRewards',
  kind: 'object',
  fields: [
    {
      name: 'feeSink',
      wireKey: 'fee-sink',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'rewardsCalculationRound',
      wireKey: 'rewards-calculation-round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'rewardsLevel',
      wireKey: 'rewards-level',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'rewardsPool',
      wireKey: 'rewards-pool',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'rewardsRate',
      wireKey: 'rewards-rate',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'rewardsResidue',
      wireKey: 'rewards-residue',
      optional: false,
      codec: bigIntCodec,
    },
  ],
}
