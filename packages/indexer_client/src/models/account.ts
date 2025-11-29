import type { Address, ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  numberCodec,
  bigIntCodec,
  booleanCodec,
  addressCodec,
  ArrayCodec,
  ObjectModelCodec,
} from '@algorandfoundation/algokit-common'
import type { AccountParticipation } from './account-participation'
import { AccountParticipationMeta } from './account-participation'
import type { Application } from './application'
import { ApplicationMeta } from './application'
import type { ApplicationLocalState } from './application-local-state'
import { ApplicationLocalStateMeta } from './application-local-state'
import type { ApplicationStateSchema } from './application-state-schema'
import { ApplicationStateSchemaMeta } from './application-state-schema'
import type { Asset } from './asset'
import { AssetMeta } from './asset'
import type { AssetHolding } from './asset-holding'
import { AssetHoldingMeta } from './asset-holding'

/**
 * Account information at a given round.
 *
 * Definition:
 * data/basics/userBalance.go : AccountData
 */
export type Account = {
  /**
   * the account public key
   */
  address: string

  /**
   * total number of MicroAlgos in the account
   */
  amount: bigint

  /**
   * MicroAlgo balance required by the account.
   *
   * The requirement grows based on asset and application usage.
   */
  minBalance: bigint

  /**
   * specifies the amount of MicroAlgos in the account, without the pending rewards.
   */
  amountWithoutPendingRewards: bigint

  /**
   * application local data stored in this account.
   *
   * Note the raw object uses `map[int] -> AppLocalState` for this type.
   */
  appsLocalState?: ApplicationLocalState[]
  appsTotalSchema?: ApplicationStateSchema

  /**
   * the sum of all extra application program pages for this account.
   */
  appsTotalExtraPages?: number

  /**
   * assets held by this account.
   *
   * Note the raw object uses `map[int] -> AssetHolding` for this type.
   */
  assets?: AssetHolding[]

  /**
   * parameters of applications created by this account including app global data.
   *
   * Note: the raw account uses `map[int] -> AppParams` for this type.
   */
  createdApps?: Application[]

  /**
   * parameters of assets created by this account.
   *
   * Note: the raw account uses `map[int] -> Asset` for this type.
   */
  createdAssets?: Asset[]
  participation?: AccountParticipation

  /**
   * can the account receive block incentives if its balance is in range at proposal time.
   */
  incentiveEligible?: boolean

  /**
   * amount of MicroAlgos of pending rewards in this account.
   */
  pendingRewards: bigint

  /**
   * used as part of the rewards computation. Only applicable to accounts which are participating.
   */
  rewardBase?: bigint

  /**
   * total rewards of MicroAlgos the account has received, including pending rewards.
   */
  rewards: bigint

  /**
   * The round for which this information is relevant.
   */
  round: bigint

  /**
   * voting status of the account's MicroAlgos
   * * Offline - indicates that the associated account is delegated.
   * *  Online  - indicates that the associated account used as part of the delegation pool.
   * *   NotParticipating - indicates that the associated account is neither a delegator nor a delegate.
   */
  status: string

  /**
   * the type of signature used by this account, must be one of:
   * * sig
   * * msig
   * * lsig
   * * or null if unknown
   */
  sigType?: 'sig' | 'msig' | 'lsig'

  /**
   * The count of all applications that have been opted in, equivalent to the count of application local data (AppLocalState objects) stored in this account.
   */
  totalAppsOptedIn: number

  /**
   * The count of all assets that have been opted in, equivalent to the count of AssetHolding objects held by this account.
   */
  totalAssetsOptedIn: number

  /**
   * For app-accounts only. The total number of bytes allocated for the keys and values of boxes which belong to the associated application.
   */
  totalBoxBytes: number

  /**
   * For app-accounts only. The total number of boxes which belong to the associated application.
   */
  totalBoxes: number

  /**
   * The count of all apps (AppParams objects) created by this account.
   */
  totalCreatedApps: number

  /**
   * The count of all assets (AssetParams objects) created by this account.
   */
  totalCreatedAssets: number

  /**
   * The address against which signing should be checked. If empty, the address of the current account is used. This field can be updated in any transaction by setting the RekeyTo field.
   */
  authAddr?: Address

  /**
   * The round in which this account last proposed the block.
   */
  lastProposed?: bigint

  /**
   * The round in which this account last went online, or explicitly renewed their online status.
   */
  lastHeartbeat?: bigint

  /**
   * Whether or not this account is currently closed.
   */
  deleted?: boolean

  /**
   * Round during which this account first appeared in a transaction.
   */
  createdAtRound?: bigint

  /**
   * Round during which this account was most recently closed.
   */
  closedAtRound?: bigint
}

export const AccountMeta: ObjectModelMetadata<Account> = {
  name: 'Account',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'minBalance',
      wireKey: 'min-balance',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'amountWithoutPendingRewards',
      wireKey: 'amount-without-pending-rewards',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'appsLocalState',
      wireKey: 'apps-local-state',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationLocalStateMeta)),
    },
    {
      name: 'appsTotalSchema',
      wireKey: 'apps-total-schema',
      optional: true,
      codec: new ObjectModelCodec(ApplicationStateSchemaMeta),
    },
    {
      name: 'appsTotalExtraPages',
      wireKey: 'apps-total-extra-pages',
      optional: true,
      codec: numberCodec,
    },
    {
      name: 'assets',
      wireKey: 'assets',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AssetHoldingMeta)),
    },
    {
      name: 'createdApps',
      wireKey: 'created-apps',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(ApplicationMeta)),
    },
    {
      name: 'createdAssets',
      wireKey: 'created-assets',
      optional: true,
      codec: new ArrayCodec(new ObjectModelCodec(AssetMeta)),
    },
    {
      name: 'participation',
      wireKey: 'participation',
      optional: true,
      codec: new ObjectModelCodec(AccountParticipationMeta),
    },
    {
      name: 'incentiveEligible',
      wireKey: 'incentive-eligible',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'pendingRewards',
      wireKey: 'pending-rewards',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'rewardBase',
      wireKey: 'reward-base',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'rewards',
      wireKey: 'rewards',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'status',
      wireKey: 'status',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'sigType',
      wireKey: 'sig-type',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'totalAppsOptedIn',
      wireKey: 'total-apps-opted-in',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'totalAssetsOptedIn',
      wireKey: 'total-assets-opted-in',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'totalBoxBytes',
      wireKey: 'total-box-bytes',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'totalBoxes',
      wireKey: 'total-boxes',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'totalCreatedApps',
      wireKey: 'total-created-apps',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'totalCreatedAssets',
      wireKey: 'total-created-assets',
      optional: false,
      codec: numberCodec,
    },
    {
      name: 'authAddr',
      wireKey: 'auth-addr',
      optional: true,
      codec: addressCodec,
    },
    {
      name: 'lastProposed',
      wireKey: 'last-proposed',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'lastHeartbeat',
      wireKey: 'last-heartbeat',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'closedAtRound',
      wireKey: 'closed-at-round',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
