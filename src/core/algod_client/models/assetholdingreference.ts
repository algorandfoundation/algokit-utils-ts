/**
 * References an asset held by an account.
 */
export type AssetHoldingReference = {
  /**
   * Address of the account holding the asset.
   */
  account: string;

  /**
   * Asset ID of the holding.
   */
  asset: bigint;
};
