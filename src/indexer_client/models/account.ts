import type { ModelMetadata } from '../core/model-runtime'
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
  appsTotalExtraPages?: bigint

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
  totalAppsOptedIn: bigint

  /**
   * The count of all assets that have been opted in, equivalent to the count of AssetHolding objects held by this account.
   */
  totalAssetsOptedIn: bigint

  /**
   * For app-accounts only. The total number of bytes allocated for the keys and values of boxes which belong to the associated application.
   */
  totalBoxBytes: bigint

  /**
   * For app-accounts only. The total number of boxes which belong to the associated application.
   */
  totalBoxes: bigint

  /**
   * The count of all apps (AppParams objects) created by this account.
   */
  totalCreatedApps: bigint

  /**
   * The count of all assets (AssetParams objects) created by this account.
   */
  totalCreatedAssets: bigint

  /**
   * The address against which signing should be checked. If empty, the address of the current account is used. This field can be updated in any transaction by setting the RekeyTo field.
   */
  authAddr?: string

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

export const AccountMeta: ModelMetadata = {
  name: 'Account',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'minBalance',
      wireKey: 'min-balance',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'amountWithoutPendingRewards',
      wireKey: 'amount-without-pending-rewards',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'appsLocalState',
      wireKey: 'apps-local-state',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationLocalStateMeta } },
    },
    {
      name: 'appsTotalSchema',
      wireKey: 'apps-total-schema',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => ApplicationStateSchemaMeta },
    },
    {
      name: 'appsTotalExtraPages',
      wireKey: 'apps-total-extra-pages',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'assets',
      wireKey: 'assets',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AssetHoldingMeta } },
    },
    {
      name: 'createdApps',
      wireKey: 'created-apps',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => ApplicationMeta } },
    },
    {
      name: 'createdAssets',
      wireKey: 'created-assets',
      optional: true,
      nullable: false,
      type: { kind: 'array', item: { kind: 'model', meta: () => AssetMeta } },
    },
    {
      name: 'participation',
      wireKey: 'participation',
      optional: true,
      nullable: false,
      type: { kind: 'model', meta: () => AccountParticipationMeta },
    },
    {
      name: 'incentiveEligible',
      wireKey: 'incentive-eligible',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'pendingRewards',
      wireKey: 'pending-rewards',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'rewardBase',
      wireKey: 'reward-base',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'rewards',
      wireKey: 'rewards',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'round',
      wireKey: 'round',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'status',
      wireKey: 'status',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'sigType',
      wireKey: 'sig-type',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalAppsOptedIn',
      wireKey: 'total-apps-opted-in',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalAssetsOptedIn',
      wireKey: 'total-assets-opted-in',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalBoxBytes',
      wireKey: 'total-box-bytes',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalBoxes',
      wireKey: 'total-boxes',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalCreatedApps',
      wireKey: 'total-created-apps',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'totalCreatedAssets',
      wireKey: 'total-created-assets',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'authAddr',
      wireKey: 'auth-addr',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'lastProposed',
      wireKey: 'last-proposed',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'lastHeartbeat',
      wireKey: 'last-heartbeat',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'createdAtRound',
      wireKey: 'created-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'closedAtRound',
      wireKey: 'closed-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
