/**
 * Describes an asset held by an account.
 *
 * Definition:
 * data/basics/userBalance.go : AssetHolding
 */
export type AssetHolding = {
  /**
   * \[a\] number of units held.
   */
  amount: bigint;

  /**
   * Asset ID of the holding.
   */
  assetId: bigint;

  /**
   * \[f\] whether or not the holding is frozen.
   */
  isFrozen: boolean;
};
