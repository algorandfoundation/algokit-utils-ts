import type { AssetHolding, AssetParams } from "./index";

/**
 * AccountAssetHolding describes the account's asset holding and asset parameters (if either exist) for a specific asset ID.
 */
export type AccountAssetHolding = {
  assetHolding: AssetHolding;
  assetParams?: AssetParams;
};
