import type { AccountAssetHolding } from "./index";

export type AccountAssetsInformation = {
  /**
   * The round for which this information is relevant.
   */
  round: bigint;

  /**
   * Used for pagination, when making another request provide this token with the next parameter.
   */
  nextToken?: string;
  assetHoldings?: AccountAssetHolding[];
};
