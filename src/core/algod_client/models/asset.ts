import type { AssetParams } from "./index";

/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export type Asset = {
  /**
   * unique asset identifier
   */
  index: bigint;
  params: AssetParams;
};
