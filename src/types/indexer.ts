import { TransactionType } from 'algosdk'
import { TealKeyValue } from 'algosdk/dist/types/client/v2/algod/models/types'

/** Indexer result for a transaction search, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2transactions */
export interface TransactionSearchResults {
  /** Round at which the results were computed. */
  'current-round': number
  /** Used for pagination, when making another request provide this token with the next parameter. */
  'next-token': string
  /** The returned transactions */
  transactions: TransactionResult[]
}

/** Indexer result for an account lookup, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-id */
export interface AccountLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** The returned account */
  account: AccountResult
}

/** Indexer result for an account's asset holdings, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idassets */
export interface AssetsLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** Used for pagination, when making another request provide this token with the next parameter. */
  'next-token': string
  /** The returned asset holdings */
  assets: AssetHolding[]
}

/** Indexer result for an account's created assets, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idcreated-assets */
export interface AssetsCreatedLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** Used for pagination, when making another request provide this token with the next parameter. */
  'next-token': string
  /** The returned assets */
  assets: AssetResult[]
}

/** Indexer result for an account's created applications, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idcreated-applications */
export interface ApplicationCreatedLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** Used for pagination, when making another request provide this token with the next parameter. */
  'next-token': string
  /** The returned applications */
  applications: ApplicationResult[]
}

/** Indexer result for an asset lookup, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-id */
export interface AssetLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** The returned asset */
  asset: AssetResult
}

/** Indexer result for a transaction lookup, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2transactionstxid */
export interface TransactionLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** The returned transaction */
  transaction: TransactionResult
}

/** Indexer result for an application lookup, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-id */
export interface ApplicationLookupResult {
  /** Round at which the results were computed. */
  'current-round': number
  /** The returned application */
  application: ApplicationResult
}

/** Indexer result for a transaction, https://developer.algorand.org/docs/rest-apis/indexer/#transaction */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TransactionResult extends Record<string, any> {
  /** Transaction ID */
  id: string
  /** [type] Indicates what type of transaction this is. Different types have different fields. */
  'tx-type': TransactionType
  /** [fee] Transaction fee. */
  fee: number
  /** [snd] Sender's address. */
  sender: string
  /** [fv] First valid round for this transaction. */
  'first-valid': number
  /** [lv] Last valid round for this transaction. */
  'last-valid': number
  /** Round when the transaction was confirmed. */
  'confirmed-round'?: number
  /** [grp] Base64 encoded byte array of a sha512/256 digest.
   *
   * When present indicates that this transaction is part of a transaction group
   *  and the value is the sha512/256 hash of the transactions in that group.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  group?: string
  /**
   * [note] Free form data.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  note?: string
  /** [lg] Logs for the application being executed by this transaction. */
  logs?: string[]
  /** Time when the block this transaction is in was confirmed. */
  'round-time'?: number
  /** Offset into the round where this transaction was confirmed. */
  'intra-round-offset'?: number
  /** Signature of the transaction */
  signature?: TransactionSignature
  /** If the transaction is an `appl` transaction this will be populated see `tx-type` */
  'application-transaction'?: ApplicationTransactionResult
  /** If the transaction is an `appl` transaction that resulted in an application creation then this
   * specifies the application index (ID) of that application.
   */
  'created-application-index'?: number
  /** If the transaction is an `acfg` transaction this will be populated see `tx-type` */
  'asset-config-transaction': AssetConfigTransactionResult
  /** If the transaction is an `acfg` transaction that resulted in an asset creation then this
   * specifies the asset index (ID) of that asset.
   */
  'created-asset-index'?: number
  /** If the transaction is an `afrz` transaction this will be populated see `tx-type` */
  'asset-freeze-transaction'?: AssetFreezeTransactionResult
  /** If the transaction is an `axfer` transaction this will be populated see `tx-type` */
  'asset-transfer-transaction'?: AssetTransferTransactionResult
  /** If the transaction is a `keyreg` transaction this will be populated see `tx-type` */
  'keyreg-transaction'?: KeyRegistrationTransactionResult
  /** If the transaction is a `pay` transaction this will be populated see `tx-type` */
  'payment-transaction'?: PaymentTransactionResult
  /** [sgnr] this is included with signed transactions when the signing address does not equal the sender.
   * The backend can use this to ensure that auth addr is equal to the accounts auth addr.
   */
  'auth-addr'?: string
  /** [ca] closing amount for transaction. */
  'closing-amount'?: number
  /** [gh] Hash of genesis block.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'genesis-hash'?: string
  /** [gen] genesis block ID. */
  'genesis-id'?: string
  /** Inner transactions produced by application execution. */
  'inner-txns'?: TransactionResult[]
  /** [rekey] when included in a valid transaction, the accounts auth addr will be updated with
   * this value and future signatures must be signed with the key represented by this address.
   */
  'rekey-to'?: string
  /** [lx] Base64 encoded 32-byte array. Lease enforces mutual exclusion of transactions.
   *
   * If this field is nonzero, then once the transaction is confirmed, it acquires the lease
   * identified by the (Sender, Lease) pair of the transaction until the LastValid round passes.
   *
   * While this transaction possesses the lease, no other transaction specifying this lease can be confirmed.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  lease?: string
  /** [ld] Local state key/value changes for the application being executed by this transaction. */
  'local-state-delta'?: Record<string, EvalDelta>[]
  /** [gd] Global state key/value changes for the application being executed by this transaction. */
  'global-state-delta'?: Record<string, EvalDelta>[]
  /** [rr] rewards applied to receiver account. */
  'receiver-rewards'?: number
  /** [rs] rewards applied to sender account. */
  'sender-rewards'?: number
  /** [rc] rewards applied to close-remainder-to account. */
  'close-rewards'?: number
}

/** Account information at a given round https://developer.algorand.org/docs/rest-apis/indexer/#account */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AccountResult extends Record<string, any> {
  /** the account public key */
  address: string
  /** [algo] total number of MicroAlgos in the account */
  amount: number
  /** specifies the amount of MicroAlgos in the account, without the pending rewards. */
  'amount-without-pending-rewards': number
  /** [appl] applications local data stored in this account.
   *
   * Note the raw object uses map[int] -> AppLocalState for this type.
   */
  'apps-local-state'?: AppLocalState[]
  /** [teap] the sum of all extra application program pages for this account. */
  'apps-total-extra-pages'?: number
  /** [tsch] stores the sum of all of the local schemas and global schemas in this account.
   *
   * Note: the raw account uses StateSchema for this type.
   */
  'apps-total-schema'?: StateSchema
  /** [asset] assets held by this account.
   *
   * Note the raw object uses map[int] -> AssetHolding for this type.
   */
  assets?: AssetHolding[]
  /** [spend] the address against which signing should be checked.
   *
   * If empty, the address of the current account is used.
   *
   * This field can be updated in any transaction by setting the RekeyTo field.
   */
  'auth-addr'?: string
  /** Round during which this account was most recently closed. */
  'closed-at-round'?: number
  /** [appp] parameters of applications created by this account including app global data.
   *
   * Note: the raw account uses map[int] -> AppParams for this type.
   */
  'created-apps'?: ApplicationResult[]
  /** [apar] parameters of assets created by this account.
   *
   * Note: the raw account uses map[int] -> Asset for this type.
   */
  'created-assets'?: AssetResult[]
  /** Round during which this account first appeared in a transaction. */
  'created-at-round'?: number
  /** Whether or not this account is currently closed. */
  deleted?: boolean
  /** If participating in consensus, the parameters used by this account in the consensus protocol. */
  participation?: AccountParticipation
  /** amount of MicroAlgos of pending rewards in this account. */
  'pending-rewards': number
  /** [ebase] used as part of the rewards computation. Only applicable to accounts which are participating. */
  'reward-base'?: number
  /** [ern] total rewards of MicroAlgos the account has received, including pending rewards. */
  rewards: number
  /** The round for which this information is relevant. */
  round: number
  /** Indicates what type of signature is used by this account */
  'sig-type': SignatureType
  /** [onl] delegation status of the account's MicroAlgos */
  status: AccountStatus
  /** The count of all applications that have been opted in, equivalent to the count of application local data (AppLocalState objects) stored in this account. */
  'total-apps-opted-in': number
  /** The count of all assets that have been opted in, equivalent to the count of AssetHolding objects held by this account. */
  'total-assets-opted-in': number
  /** For app-accounts only. The total number of bytes allocated for the keys and values of boxes which belong to the associated application. */
  'total-box-bytes': number
  /** For app-accounts only. The total number of boxes which belong to the associated application. */
  'total-boxes': number
  /** The count of all apps (AppParams objects) created by this account. */
  'total-created-apps': number
  /** The count of all assets (AssetParams objects) created by this account. */
  'total-created-assets': number
}

/** Fields for a payment transaction https://developer.algorand.org/docs/rest-apis/indexer/#transactionpayment */
export interface PaymentTransactionResult {
  /** [amt] number of MicroAlgos intended to be transferred. */
  amount: number
  /** Number of MicroAlgos that were sent to the close-remainder-to address when closing the sender account. */
  'close-amount'?: number
  /** [close] when set, indicates that the sending account should be closed and all remaining funds be transferred to this address. */
  'close-remainder-to'?: string
  /** [rcv] receiver's address. */
  receiver: string
}

/** Fields for an application transaction https://developer.algorand.org/docs/rest-apis/indexer/#transactionapplication */
export interface ApplicationTransactionResult extends Omit<ApplicationParams, 'creator' | 'global-state'> {
  /** [apat] List of accounts in addition to the sender that may be accessed from the application's approval-program and clear-state-program. */
  accounts?: string[]
  /** [apaa] transaction specific arguments accessed from the application's approval-program and clear-state-program. */
  'application-args'?: string[]
  /** [apid] ID of the application being configured or empty if creating. */
  'application-id': number
  /** [apfa] Lists the applications in addition to the application-id whose global states may be accessed by this application's approval-program and clear-state-program. The access is read-only. */
  'foreign-apps'?: number[]
  /** [apas] lists the assets whose parameters may be accessed by this application's ApprovalProgram and ClearStateProgram. The access is read-only. */
  'foreign-assets'?: number[]
  /** [apan] defines the what additional actions occur with the transaction. */
  'on-completion': ApplicationOnComplete
}

/** Fields for asset allocation, re-configuration, and destruction.
 * https://developer.algorand.org/docs/rest-apis/indexer/#transactionassetconfig
 *
 * A zero value for asset-id indicates asset creation. A zero value for the params indicates asset destruction.
 */
export interface AssetConfigTransactionResult {
  /** [xaid] ID of the asset being configured or empty if creating. */
  'asset-id': number
  /** [apar] the parameters for the asset. */
  params: AssetParams
}

/** Fields for an asset freeze transaction. https://developer.algorand.org/docs/rest-apis/indexer/#transactionassetfreeze */
export interface AssetFreezeTransactionResult {
  /** [fadd] Address of the account whose asset is being frozen or thawed. */
  address: string
  /** [faid] ID of the asset being frozen or thawed. */
  'asset-id': number
  /** [afrz] The new freeze status. */
  'new-freeze-status': boolean
}

/** Fields for an asset transfer transaction. https://developer.algorand.org/docs/rest-apis/indexer/#transactionassettransfer */
export interface AssetTransferTransactionResult {
  /** [aamt] Amount of asset to transfer. A zero amount transferred to self allocates that asset in the account's Assets map. */
  amount: number
  /** [xaid] ID of the asset being transferred. */
  'asset-id': number
  /** Number of assets transfered to the close-to account as part of the transaction. */
  'close-amount'?: number
  /** [aclose] Indicates that the asset should be removed from the account's Assets map, and specifies where the remaining asset holdings should be transferred. It's always valid to transfer remaining asset holdings to the creator account. */
  'close-to'?: string
  /** [arcv] Recipient address of the transfer. */
  receiver: string
  /** [asnd] The effective sender during a clawback transactions. If this is not a zero value, the real transaction sender must be the Clawback address from the AssetParams. */
  sender?: string
}

/** Fields for a `keyreg` transaction https://developer.algorand.org/docs/rest-apis/indexer/#transactionkeyreg */
export interface KeyRegistrationTransactionResult {
  /** [nonpart] Mark the account as participating or non-participating. */
  'non-participation'?: boolean
  /** [selkey] Public key used with the Verified Random Function (VRF) result during committee selection.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'selection-participation-key'?: string
  /** [selkey] Public key used with the Verified Random Function (VRF) result during committee selection.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'state-proof-key'?: string
  /** [votefst] First round this participation key is valid. */
  'vote-first-valid'?: number
  /** [votekd] Number of subkeys in each batch of participation keys. */
  'vote-key-dilution'?: number
  /** [votelst] Last round this participation key is valid. */
  'vote-last-valid'?: number
  /** [votekey] Participation public key used in key registration transactions.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'vote-participation-key'?: string
}

/** Specifies both the unique identifier and the parameters for an asset. https://developer.algorand.org/docs/rest-apis/indexer/#asset */
export interface AssetResult {
  /** Unique asset identifier. */
  index: number
  /** Whether or not this asset is currently deleted. */
  deleted?: boolean
  /** Round during which this asset was created. */
  'created-at-round'?: number
  /** Round during which this asset was destroyed. */
  'destroyed-at-round'?: number
  /** The parameters for the asset */
  params: AssetParams
}

/**
 * The result of looking up an application
 */
export interface ApplicationResult {
  id: number
  params: ApplicationParams
  'created-at-round'?: number
  deleted?: boolean
  'deleted-at-round'?: number
}

/** Validation signature associated with some data. Only one of the signatures should be provided. https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignature */
export interface TransactionSignature {
  /** Logicsig signature */
  logicsig: LogicTransactionSignature
  /** Multisig signature */
  multisig: MultisigTransactionSignature
  /** [sig] Standard ed25519 signature.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  sig: string
}

/** [lsig] Programatic transaction signature.
 *
 * https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignaturelogicsig
 *
 * https://developer.algorand.org/docs/get-details/transactions/signatures/#logic-signatures
 */
export interface LogicTransactionSignature {
  /** [arg] Logic arguments, base64 encoded. */
  args?: string[]
  /** [l] Program signed by a signature or multi signature, or hashed to be the address of ana ccount.
   *
   * Base64 encoded TEAL program.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  logic: string
  /** The signature of the multisig the logic signature delegating the logicsig. https://developer.algorand.org/docs/get-details/dapps/smart-contracts/smartsigs/modes/#delegated-approval */
  'multisig-signature'?: MultisigTransactionSignature
  /** [sig] Standard ed25519 signature delegating the logicsig. https://developer.algorand.org/docs/get-details/dapps/smart-contracts/smartsigs/modes/#delegated-approval
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  signature?: string
}

/** [msig] structure holding multiple subsignatures. https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignaturemultisig */
export interface MultisigTransactionSignature {
  /** [subsig] Holds pairs of public key and signatures. */
  subsignature: MultisigTransactionSubSignature
  /** [thr] The threshold of signatures required for the multisig */
  threshold: number
  /** [v] The version of the multisig */
  version: number
}

/** Sub-signature for a multisig signature https://developer.algorand.org/docs/rest-apis/indexer/#transactionsignaturemultisigsubsignature */
export interface MultisigTransactionSubSignature {
  /** [pk] The public key of the account making the signature
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'public-key': string
  /** [s] The signature
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  signature: string
}

/** Represents a TEAL value delta. https://developer.algorand.org/docs/rest-apis/indexer/#evaldelta */
export interface EvalDelta {
  /** [at] delta action. */
  action: number
  /** [bs] bytes value. */
  bytes?: string
  /** [ui] uint value. */
  uint?: number
}

/** Stores the global information associated with an application https://developer.algorand.org/docs/rest-apis/indexer/#applicationparams */
export interface ApplicationParams {
  /** The address that created this application. This is the address where the parameters and global state for this application can be found. */
  creator: string
  /**
   * [apap]/[approv] Logic executed for every application transaction, except when on-completion is set to "clear".
   *
   * It can read and write global state for the application, as well as account-specific local state.
   *
   * Approval programs may reject the transaction.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'approval-program': string
  /**
   * [apsu]/[clearp] Logic executed for application transactions with on-completion set to "clear".
   *
   * It can read and write global state for the application, as well as account-specific local state.
   *
   * Clear state programs cannot reject the transaction.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'clear-state-program': string
  /** [epp] the amount of extra program pages available to this app. */
  'extra-program-pages'?: number
  /** [gs] global schema */
  'global-state': TealKeyValue[]
  /** [gsch] global schema */
  'global-state-schema'?: StateSchema
  /** [lsch] local schema */
  'local-state-schema'?: StateSchema
}

/** Represents a [apls] local-state or [apgs] global-state schema.
 * https://developer.algorand.org/docs/rest-apis/indexer/#stateschema
 *
 * These schemas determine how much storage may be used in a local-state or global-state for an application.
 *
 * The more space used, the larger minimum balance must be maintained in the account holding the data.
 */
export interface StateSchema {
  /** Maximum number of TEAL byte slices that may be stored in the key/value store. */
  'num-byte-slice': number
  /** Maximum number of TEAL uints that may be stored in the key/value store. */
  'num-uint': number
}

/** Defines the what additional actions occur with the transaction https://developer.algorand.org/docs/rest-apis/indexer/#oncompletion */
export enum ApplicationOnComplete {
  noop = 'noop',
  optin = 'optin',
  closeout = 'closeout',
  clear = 'clear',
  update = 'update',
  delete = 'delete',
}

/** AssetParams specifies the parameters for an asset. https://developer.algorand.org/docs/rest-apis/indexer/#assetparams */
export interface AssetParams {
  /**
   * The address that created this asset. This is the address where the parameters
   * for this asset can be found, and also the address where unwanted asset units can
   * be sent in the worst case.
   */
  creator: string
  /**
   * (dc) The number of digits to use after the decimal point when displaying this
   * asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in
   * tenths. If 2, the base unit of the asset is in hundredths, and so on. This value
   * must be between 0 and 19 (inclusive).
   */
  decimals: number | bigint
  /**
   * (t) The total number of units of this asset.
   */
  total: number | bigint
  /**
   * (c) Address of account used to clawback holdings of this asset. If empty,
   * clawback is not permitted.
   */
  clawback?: string
  /**
   * (df) Whether holdings of this asset are frozen by default.
   */
  'default-frozen'?: boolean
  /**
   * (f) Address of account used to freeze holdings of this asset. If empty, freezing
   * is not permitted.
   */
  freeze?: string
  /**
   * (m) Address of account used to manage the keys of this asset and to destroy it.
   */
  manager?: string
  /**
   * (am) A commitment to some unspecified asset metadata. The format of this
   * metadata is up to the application.
   */
  'metadata-hash'?: Uint8Array
  /**
   * (an) Name of this asset, as supplied by the creator. Included only when the
   * asset name is composed of printable utf-8 characters.
   */
  name?: string
  /**
   * Base64 encoded name of this asset, as supplied by the creator.
   */
  'name-b64'?: Uint8Array
  /**
   * (r) Address of account holding reserve (non-minted) units of this asset.
   */
  reserve?: string
  /**
   * (un) Name of a unit of this asset, as supplied by the creator. Included only
   * when the name of a unit of this asset is composed of printable utf-8 characters.
   */
  'unit-name'?: string
  /**
   * Base64 encoded name of a unit of this asset, as supplied by the creator.
   */
  'unit-name-b64'?: Uint8Array
  /**
   * (au) URL where more information about the asset can be retrieved. Included only
   * when the URL is composed of printable utf-8 characters.
   */
  url?: string
  /**
   * Base64 encoded URL where more information about the asset can be retrieved.
   */
  'url-b64'?: Uint8Array
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

/** AccountParticipation describes the parameters used by this account in consensus protocol. https://developer.algorand.org/docs/rest-apis/indexer/#accountparticipation */
export interface AccountParticipation {
  /** [sel] Selection public key (if any) currently registered for this round.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'selection-participation-key': string
  /** [stprf] Root of the state proof key (if any).
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'state-proof-key'?: string
  /** [voteFst] First round for which this participation is valid. */
  'vote-first-valid': number
  /** [voteKD] Number of subkeys in each batch of participation keys. */
  'vote-key-dilution': number
  /** [voteLst] Last round for which this participation is valid. */
  'vote-last-valid': number
  /** [vote] root participation public key (if any) currently registered for this round.
   *
   * *Pattern:* `"^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==\|[A-Za-z0-9+/]{3}=)?$"`
   */
  'vote-participation-key': string
}

/** Stores local state associated with an application. https://developer.algorand.org/docs/rest-apis/indexer/#applicationlocalstate */
export interface AppLocalState {
  /** Round when account closed out of the application. */
  'closed-out-at-round'?: number
  /** Whether or not the application local state is currently deleted from its account. */
  deleted?: boolean
  /** The application which this local state is for. */
  id: number
  /** [tkv] storage. */
  'key-value'?: TealKeyValue[]
  /** Round when the account opted into the application. */
  'opted-in-at-round'?: number
  /** [hsch] schema. */
  schema: StateSchema
}

/** Describes an asset held by an account. https://developer.algorand.org/docs/rest-apis/indexer/#assetholding */
export interface AssetHolding {
  /**
   * (a) number of units held.
   */
  amount: number
  /**
   * Asset ID of the holding.
   */
  'asset-id': number
  /** Whether or not the asset holding is currently deleted from its account. */
  deleted?: boolean
  /**
   * [f] whether or not the holding is frozen.
   */
  'is-frozen': boolean
  /** Round during which the account opted into this asset holding. */
  'opted-in-at-round': number
  /** Round during which the account opted out of this asset holding. */
  'opted-out-at-round': number
}
