import algosdk from 'algosdk'
import indexerModels = algosdk.indexerModels

/** @deprecated Use `algosdk.indexerModels.TransactionsResponse`. Indexer result for a transaction search, https://dev.algorand.co/reference/rest-api/indexer#get-v2transactions */
export type TransactionSearchResults = indexerModels.TransactionsResponse

/** @deprecated Use `algosdk.indexerModels.AccountResponse`. Indexer result for an account lookup, https://dev.algorand.co/reference/rest-api/indexer#get-v2accountsaccount-id */
export type AccountLookupResult = indexerModels.AccountResponse

/** @deprecated Use `algosdk.indexerModels.AssetHoldingsResponse`. Indexer result for an account's asset holdings, https://dev.algorand.co/reference/rest-api/indexer#get-v2accountsaccount-idassets */
export type AssetsLookupResult = indexerModels.AssetHoldingsResponse

/** @deprecated Use `algosdk.indexerModels.AssetsResponse`. Indexer result for an account's created assets, https://dev.algorand.co/reference/rest-api/indexer#get-v2accountsaccount-idcreated-assets */
export type AssetsCreatedLookupResult = indexerModels.AssetsResponse

/** @deprecated Use `algosdk.indexerModels.ApplicationsResponse`. Indexer result for an account's created applications, https://dev.algorand.co/reference/rest-api/indexer#get-v2accountsaccount-idcreated-applications */
export type ApplicationCreatedLookupResult = indexerModels.ApplicationsResponse

/** @deprecated Use `algosdk.indexerModels.AssetResponse`. Indexer result for an asset lookup, https://dev.algorand.co/reference/rest-api/indexer#get-v2assetsasset-id */
export type AssetLookupResult = indexerModels.AssetResponse

/** Options when looking up an asset's account holdings, https://dev.algorand.co/reference/rest-api/indexer#get-v2assetsasset-idbalances */
export interface LookupAssetHoldingsOptions {
  /** Results should have a decimal units amount less than this value. */
  currencyLessThan?: number | bigint
  /** Results should have a decimal units amount greater than this value. */
  currencyGreaterThan?: number | bigint
  /** Include all items including closed accounts and opted-out asset holdings. */
  includeAll?: boolean
}

/** @deprecated Use `algosdk.indexerModels.AssetBalancesResponse`. Indexer result for an asset's account holdings, https://dev.algorand.co/reference/rest-api/indexer#get-v2assetsasset-idbalances */
export type AssetBalancesLookupResult = indexerModels.AssetBalancesResponse

/** @deprecated Use `algosdk.indexerModels.TransactionResponse`. Indexer result for a transaction lookup, https://dev.algorand.co/reference/rest-api/indexer#get-v2transactionstxid */
export type TransactionLookupResult = indexerModels.TransactionResponse

/** @deprecated Use `algosdk.indexerModels.ApplicationResponse`. Indexer result for an application lookup, https://dev.algorand.co/reference/rest-api/indexer#get-v2applicationsapplication-id */
export type ApplicationLookupResult = indexerModels.ApplicationResponse

/** @deprecated Use `algosdk.indexerModels.Transaction`. Indexer result for a transaction, https://dev.algorand.co/reference/rest-api/indexer#transaction */
export type TransactionResult = indexerModels.Transaction

/** @deprecated Use `algosdk.indexerModels.Account`. Indexer Account information at a given round https://dev.algorand.co/reference/rest-api/indexer#account */
export type AccountResult = indexerModels.Account

/** @deprecated Use `algosdk.indexerModels.TransactionPayment`. Indexer Fields for a payment transaction https://dev.algorand.co/reference/rest-api/indexer#transactionpayment */
export type PaymentTransactionResult = indexerModels.TransactionPayment

/** @deprecated Use `algosdk.indexerModels.TransactionStateProof`. Indexer Fields for a state proof transaction https://dev.algorand.co/reference/rest-api/indexer#transactionstateproof.
 *
 * See also https://dev.algorand.co/protocol/state-proofs/,
 * https://github.com/algorand/go-algorand/blob/master/data/transactions/stateproof.go,
 * https://github.com/algorand/go-algorand/blob/master/crypto/stateproof/structs.go,
 * https://github.com/algorand/go-algorand/blob/master/data/stateproofmsg/message.go, and
 * https://dev.algorand.co/reference/rest-api/algod/#stateproof.
 */
export type StateProofTransactionResult = indexerModels.TransactionStateProof

/** @deprecated Use `algosdk.indexerModels.MerkleArrayProof`. Indexer Merkle array Proof.
 *
 * Proof is used to convince a verifier about membership of leaves: h0,h1...hn
 * at indexes i0,i1...in on a tree. The verifier has a trusted value of the tree
 * root hash.
 *
 * Path is bounded by MaxNumLeaves since there could be multiple reveals, and
 * given the distribution of the elt positions and the depth of the tree,
 * the path length can increase up to 2^MaxTreeDepth / 2
 *
 * Consider two different reveals for the same tree:
 * ```
 * .                z5
 * .         z3              z4
 * .     y       z       z1      z2
 * .   q   r   s   t   u   v   w   x
 * .  a b c d e f g h i j k l m n o p
 * .    ^
 * . hints: [a, r, z, z4]
 * . len(hints) = 4
 * ```
 * You need a to combine with b to get q, need r to combine with the computed q and get y, and so on.
 *
 * The worst case is this:
 * ```
 * .               z5
 * .        z3              z4
 * .    y       z       z1      z2
 * .  q   r   s   t   u   v   w   x
 * . a b c d e f g h i j k l m n o p
 * . ^   ^     ^   ^ ^   ^     ^   ^
 * .
 * . hints: [b, d, e, g, j, l, m, o]
 * . len(hints) = 2^4/2
 * ```
 */
export type MerkleArrayProof = indexerModels.MerkleArrayProof

/** @deprecated Use `algosdk.indexerModels.TransactionApplication`. Indexer Fields for an application transaction https://dev.algorand.co/reference/rest-api/indexer#transactionapplication */
export type ApplicationTransactionResult = indexerModels.TransactionApplication

/** @deprecated Use `algosdk.indexerModels.TransactionAssetConfig`. Indexer Fields for asset allocation, re-configuration, and destruction.
 * https://dev.algorand.co/reference/rest-api/indexer#transactionassetconfig
 *
 * A zero value for asset-id indicates asset creation. A zero value for the params indicates asset destruction.
 */
export type AssetConfigTransactionResult = indexerModels.TransactionAssetConfig

/** @deprecated Use `algosdk.indexerModels.TransactionAssetFreeze`. Indexer Fields for an asset freeze transaction. https://dev.algorand.co/reference/rest-api/indexer#transactionassetfreeze */
export type AssetFreezeTransactionResult = indexerModels.TransactionAssetFreeze

/** @deprecated Use `algosdk.indexerModels.TransactionAssetTransfer`. Indexer Fields for an asset transfer transaction. https://dev.algorand.co/reference/rest-api/indexer#transactionassettransfer */
export type AssetTransferTransactionResult = indexerModels.TransactionAssetTransfer

/** @deprecated Use `algosdk.indexerModels.TransactionKeyreg`. Indexer Fields for a `keyreg` transaction https://dev.algorand.co/reference/rest-api/indexer#transactionkeyreg */
export type KeyRegistrationTransactionResult = indexerModels.TransactionKeyreg

/** @deprecated Use `algosdk.indexerModels.Asset`. Indexer Fields to specify both the unique identifier and the parameters for an asset. https://dev.algorand.co/reference/rest-api/indexer#asset */
export type AssetResult = indexerModels.Asset

/** @deprecated Use `algosdk.indexerModels.Application`. Indexer result of looking up an application
 */
export type ApplicationResult = indexerModels.Application

/** @deprecated Use `algosdk.indexerModels.TransactionSignature`. Indexer Validation signature associated with some data. Only one of the signatures should be provided. https://dev.algorand.co/reference/rest-api/indexer#transactionsignature */
export type TransactionSignature = indexerModels.TransactionSignature

/** @deprecated Use `algosdk.indexerModels.TransactionSignatureLogicsig`. Indexer [lsig] Programatic transaction signature.
 *
 * https://dev.algorand.co/reference/rest-api/indexer#transactionsignaturelogicsig
 *
 * https://dev.algorand.co/concepts/smart-contracts/logic-sigs
 */
export type LogicTransactionSignature = indexerModels.TransactionSignatureLogicsig

/** @deprecated Use `algosdk.indexerModels.TransactionSignatureMultisig`. Indexer [msig] structure holding multiple subsignatures. https://dev.algorand.co/reference/rest-api/indexer#transactionsignaturemultisig */
export type MultisigTransactionSignature = indexerModels.TransactionSignatureMultisig

/** @deprecated Use `algosdk.indexerModels.TransactionSignatureMultisigSubsignature`. Indexer Sub-signature for a multisig signature https://dev.algorand.co/reference/rest-api/indexer#transactionsignaturemultisigsubsignature */
export type MultisigTransactionSubSignature = indexerModels.TransactionSignatureMultisigSubsignature

/** @deprecated Use `algosdk.indexerModels.EvalDeltaKeyValue`. */
export type EvalDeltaKeyValue = indexerModels.EvalDeltaKeyValue

/** @deprecated Use `algosdk.indexerModels.AccountStateDelta`. */
export type AccountStateDelta = indexerModels.AccountStateDelta

/** @deprecated Use `algosdk.indexerModels.EvalDeltaKeyValue[]`. */
export type StateDelta = EvalDeltaKeyValue[]

/** @deprecated Use `algosdk.indexerModels.EvalDelta`. Indexer Represents a TEAL value delta. https://dev.algorand.co/reference/rest-api/indexer#evaldelta */
export type EvalDelta = indexerModels.EvalDelta

/** @deprecated Use `algosdk.indexerModels.ApplicationParams`. Indexer Stores the global information associated with an application https://dev.algorand.co/reference/rest-api/indexer#applicationparams */
export type ApplicationParams = indexerModels.ApplicationParams

/** @deprecated Use `algosdk.indexerModels.StateSchema`. Indexer Represents a [apls] local-state or [apgs] global-state schema.
 * https://dev.algorand.co/reference/rest-api/indexer#stateschema
 *
 * These schemas determine how much storage may be used in a local-state or global-state for an application.
 *
 * The more space used, the larger minimum balance must be maintained in the account holding the data.
 */
export type StateSchema = indexerModels.StateSchema

/** Defines the what additional actions occur with the transaction https://dev.algorand.co/reference/rest-api/indexer/#oncompletion */
export enum ApplicationOnComplete {
  noop = 'noop',
  optin = 'optin',
  closeout = 'closeout',
  clear = 'clear',
  update = 'update',
  delete = 'delete',
}

/** @deprecated Use `algosdk.indexerModels.AssetParams`. Indexer AssetParams specifies the parameters for an asset. https://dev.algorand.co/reference/rest-api/indexer#assetparams */
export type AssetParams = indexerModels.AssetParams

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

/** @deprecated Use `algosdk.indexerModels.AccountParticipation`. Indexer AccountParticipation describes the parameters used by this account in consensus protocol. https://dev.algorand.co/reference/rest-api/indexer#accountparticipation */
export type AccountParticipation = indexerModels.AccountParticipation

/** @deprecated Use `algosdk.indexerModels.ApplicationLocalState`. Indexer Stores local state associated with an application. https://dev.algorand.co/reference/rest-api/indexer#applicationlocalstate */
export type AppLocalState = indexerModels.ApplicationLocalState

/** @deprecated Use `algosdk.indexerModels.AssetHolding`. Indexer Describes an asset held by an account. https://dev.algorand.co/reference/rest-api/indexer#assetholding */
export type AssetHolding = indexerModels.AssetHolding

/** @deprecated Use `algosdk.indexerModels.MiniAssetHolding`. Indexer Describes an asset holding for an account of a known asset. https://dev.algorand.co/reference/rest-api/indexer#miniassetholding */
export type MiniAssetHolding = indexerModels.MiniAssetHolding
