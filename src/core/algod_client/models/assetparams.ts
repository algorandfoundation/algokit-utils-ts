/**
 * AssetParams specifies the parameters for an asset.
 *
 * \[apar\] when part of an AssetConfig transaction.
 *
 * Definition:
 * data/transactions/asset.go : AssetParams
 */
export type AssetParams = {
  /**
   * \[c\] Address of account used to clawback holdings of this asset.  If empty, clawback is not permitted.
   */
  clawback?: string;

  /**
   * The address that created this asset. This is the address where the parameters for this asset can be found, and also the address where unwanted asset units can be sent in the worst case.
   */
  creator: string;

  /**
   * \[dc\] The number of digits to use after the decimal point when displaying this asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in tenths. If 2, the base unit of the asset is in hundredths, and so on. This value must be between 0 and 19 (inclusive).
   */
  decimals: bigint;

  /**
   * \[df\] Whether holdings of this asset are frozen by default.
   */
  defaultFrozen?: boolean;

  /**
   * \[f\] Address of account used to freeze holdings of this asset.  If empty, freezing is not permitted.
   */
  freeze?: string;

  /**
   * \[m\] Address of account used to manage the keys of this asset and to destroy it.
   */
  manager?: string;

  /**
   * \[am\] A commitment to some unspecified asset metadata. The format of this metadata is up to the application.
   */
  metadataHash?: string;

  /**
   * \[an\] Name of this asset, as supplied by the creator. Included only when the asset name is composed of printable utf-8 characters.
   */
  name?: string;

  /**
   * Base64 encoded name of this asset, as supplied by the creator.
   */
  nameB64?: string;

  /**
   * \[r\] Address of account holding reserve (non-minted) units of this asset.
   */
  reserve?: string;

  /**
   * \[t\] The total number of units of this asset.
   */
  total: bigint;

  /**
   * \[un\] Name of a unit of this asset, as supplied by the creator. Included only when the name of a unit of this asset is composed of printable utf-8 characters.
   */
  unitName?: string;

  /**
   * Base64 encoded name of a unit of this asset, as supplied by the creator.
   */
  unitNameB64?: string;

  /**
   * \[au\] URL where more information about the asset can be retrieved. Included only when the URL is composed of printable utf-8 characters.
   */
  url?: string;

  /**
   * Base64 encoded URL where more information about the asset can be retrieved.
   */
  urlB64?: string;
};
