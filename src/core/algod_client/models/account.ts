import type { AccountParticipation, Application, ApplicationLocalState, ApplicationStateSchema, Asset, AssetHolding } from "./index";

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
  address: string;

  /**
   * \[algo\] total number of MicroAlgos in the account
   */
  amount: bigint;

  /**
   * MicroAlgo balance required by the account.
   *
   * The requirement grows based on asset and application usage.
   */
  minBalance: bigint;

  /**
   * specifies the amount of MicroAlgos in the account, without the pending rewards.
   */
  amountWithoutPendingRewards: bigint;

  /**
   * \[appl\] applications local data stored in this account.
   *
   * Note the raw object uses `map[int] -> AppLocalState` for this type.
   */
  appsLocalState?: ApplicationLocalState[];

  /**
   * The count of all applications that have been opted in, equivalent to the count of application local data (AppLocalState objects) stored in this account.
   */
  totalAppsOptedIn: bigint;
  appsTotalSchema?: ApplicationStateSchema;

  /**
   * \[teap\] the sum of all extra application program pages for this account.
   */
  appsTotalExtraPages?: bigint;

  /**
   * \[asset\] assets held by this account.
   *
   * Note the raw object uses `map[int] -> AssetHolding` for this type.
   */
  assets?: AssetHolding[];

  /**
   * The count of all assets that have been opted in, equivalent to the count of AssetHolding objects held by this account.
   */
  totalAssetsOptedIn: bigint;

  /**
   * \[appp\] parameters of applications created by this account including app global data.
   *
   * Note: the raw account uses `map[int] -> AppParams` for this type.
   */
  createdApps?: Application[];

  /**
   * The count of all apps (AppParams objects) created by this account.
   */
  totalCreatedApps: bigint;

  /**
   * \[apar\] parameters of assets created by this account.
   *
   * Note: the raw account uses `map[int] -> Asset` for this type.
   */
  createdAssets?: Asset[];

  /**
   * The count of all assets (AssetParams objects) created by this account.
   */
  totalCreatedAssets: bigint;

  /**
   * \[tbx\] The number of existing boxes created by this account's app.
   */
  totalBoxes?: bigint;

  /**
   * \[tbxb\] The total number of bytes used by this account's app's box keys and values.
   */
  totalBoxBytes?: bigint;
  participation?: AccountParticipation;

  /**
   * Whether or not the account can receive block incentives if its balance is in range at proposal time.
   */
  incentiveEligible?: boolean;

  /**
   * amount of MicroAlgos of pending rewards in this account.
   */
  pendingRewards: bigint;

  /**
   * \[ebase\] used as part of the rewards computation. Only applicable to accounts which are participating.
   */
  rewardBase?: bigint;

  /**
   * \[ern\] total rewards of MicroAlgos the account has received, including pending rewards.
   */
  rewards: bigint;

  /**
   * The round for which this information is relevant.
   */
  round: bigint;

  /**
   * \[onl\] delegation status of the account's MicroAlgos
   * * Offline - indicates that the associated account is delegated.
   * *  Online  - indicates that the associated account used as part of the delegation pool.
   * *   NotParticipating - indicates that the associated account is neither a delegator nor a delegate.
   */
  status: string;

  /**
   * Indicates what type of signature is used by this account, must be one of:
   * * sig
   * * msig
   * * lsig
   */
  sigType?: "sig" | "msig" | "lsig";

  /**
   * \[spend\] the address against which signing should be checked. If empty, the address of the current account is used. This field can be updated in any transaction by setting the RekeyTo field.
   */
  authAddr?: string;

  /**
   * The round in which this account last proposed the block.
   */
  lastProposed?: bigint;

  /**
   * The round in which this account last went online, or explicitly renewed their online status.
   */
  lastHeartbeat?: bigint;
};
