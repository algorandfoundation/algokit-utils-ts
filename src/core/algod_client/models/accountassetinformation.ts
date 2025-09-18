import type { AssetHolding, AssetParams } from "./index";

export type AccountAssetInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint;
  assetHolding?: AssetHolding;
  createdAsset?: AssetParams;
};
