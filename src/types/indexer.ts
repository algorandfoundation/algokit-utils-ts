/** Options when looking up an asset's account holdings, https://dev.algorand.co/reference/rest-apis/indexer#get-v2assetsasset-idbalances */
export interface LookupAssetHoldingsOptions {
  /** Results should have a decimal units amount less than this value. */
  currencyLessThan?: number | bigint
  /** Results should have a decimal units amount greater than this value. */
  currencyGreaterThan?: number | bigint
  /** Include all items including closed accounts and opted-out asset holdings. */
  includeAll?: boolean
}

/** Defines the what additional actions occur with the transaction https://dev.algorand.co/reference/rest-apis/indexer/#oncompletion */
export enum ApplicationOnComplete {
  noop = 'noop',
  optin = 'optin',
  closeout = 'closeout',
  clear = 'clear',
  update = 'update',
  delete = 'delete',
}

/** Type of signature used by an account */
export enum SignatureType {
  /** Normal signature */
  sig = 'sig',
  /** Multisig */
  msig = 'msig',
  /** Logic signature */
  lsig = 'lsig',
}

/** Delegation status of the account */
export enum AccountStatus {
  /** Indicates that the associated account is delegated */
  Offline = 'Offline',
  /** Indicates that the associated account used as part of the delegation pool */
  Online = 'Online',
  /** Indicates that the associated account is neither a delegator nor a delegate */
  NotParticipating = 'NotParticipating',
}
