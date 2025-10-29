import {
  PendingTransactionResponse,
  SimulateRequest,
  SimulateTransaction,
  SimulateUnnamedResourcesAccessed,
  TransactionParams,
} from '../algod_client'
import {
  OnApplicationComplete,
  SignedTransaction,
  Transaction,
  TransactionType,
  assignFee,
  getTransactionId,
  groupTransactions,
} from '../algokit_transact'
import { Config } from '../config'
import * as algosdk from '../sdk'
import { ABIMethod, ABIType, ABIValue, Address, SdkTransactionParams, abiTypeIsReference, abiTypeIsTransaction } from '../sdk'
import { encodeLease } from '../transaction/transaction'
import { asJson, calculateExtraProgramPages } from '../util'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ABIReturn } from './app'
import { AccessReference, AppManager, BoxIdentifier, BoxReference, getAccessReference } from './app-manager'
import { Expand } from './expand'
import { EventType } from './lifecycle-events'
import { genesisIdIsLocalNet } from './network-client'
import { Arc2TransactionNote, SendAtomicTransactionComposerResults, SendParams } from './transaction'
import TransactionSigner = algosdk.TransactionSigner
import TransactionWithSigner = algosdk.TransactionWithSigner
import isTransactionWithSigner = algosdk.isTransactionWithSigner

export const MAX_TRANSACTION_GROUP_SIZE = 16

/** Options to control a simulate request, that does not require transaction signing */
export type SkipSignaturesSimulateOptions = Expand<
  Omit<RawSimulateOptions, 'fixSigners' | 'allowEmptySignatures'> & {
    /** Whether or not to skip signatures for all built transactions and use an empty signer instead.
     * This will set `fixSigners` and `allowEmptySignatures` when sending the request to the algod API.
     */
    skipSignatures: boolean
  }
>

/** The raw API options to control a simulate request.
 * See algod API docs for more information: https://dev.algorand.co/reference/rest-apis/algod/#simulatetransaction
 */
export type RawSimulateOptions = Expand<Omit<SimulateRequest, 'txnGroups'>>

/** All options to control a simulate request */
export type SimulateOptions = Expand<Partial<SkipSignaturesSimulateOptions> & RawSimulateOptions>

/** Common parameters for defining a transaction. */
export type CommonTransactionParams = {
  /** The address of the account sending the transaction. */
  sender: string | Address
  /** The function used to sign transaction(s); if not specified then
   *  an attempt will be made to find a registered signer for the
   *  given `sender` or use a default signer (if configured).
   */
  signer?: algosdk.TransactionSigner | TransactionSignerAccount
  /** Change the signing key of the sender to the given address.
   *
   * **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
   */
  rekeyTo?: string | Address
  /** Note to attach to the transaction. Max of 1000 bytes. */
  note?: Uint8Array | string
  /** Prevent multiple transactions with the same lease being included within the validity window.
   *
   * A [lease](https://dev.algorand.co/concepts/transactions/leases)
   *  enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).
   */
  lease?: Uint8Array | string
  /** The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. */
  staticFee?: AlgoAmount
  /** The fee to pay IN ADDITION to the suggested fee. Useful for manually covering inner transaction fees. */
  extraFee?: AlgoAmount
  /** Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. */
  maxFee?: AlgoAmount
  /** How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. */
  validityWindow?: number | bigint
  /**
   * Set the first round this transaction is valid.
   * If left undefined, the value from algod will be used.
   *
   * We recommend you only set this when you intentionally want this to be some time in the future.
   */
  firstValidRound?: bigint
  /** The last round this transaction is valid. It is recommended to use `validityWindow` instead. */
  lastValidRound?: bigint
}

/** Parameters to define a payment transaction. */
export type PaymentParams = CommonTransactionParams & {
  /** The address of the account that will receive the Algo */
  receiver: string | Address
  /** Amount to send */
  amount: AlgoAmount
  /** If given, close the sender account and send the remaining balance to this address
   *
   * *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeRemainderTo?: string | Address
}

/** Parameters to define an asset create transaction.
 *
 * The account that sends this transaction will automatically be opted in to the asset and will hold all units after creation.
 */
export type AssetCreateParams = CommonTransactionParams & {
  /** The total amount of the smallest divisible (decimal) unit to create.
   *
   * For example, if `decimals` is, say, 2, then for every 100 `total` there would be 1 whole unit.
   *
   * This field can only be specified upon asset creation.
   */
  total: bigint

  /** The amount of decimal places the asset should have.
   *
   * If unspecified then the asset will be in whole units (i.e. `0`).
   *
   * * If 0, the asset is not divisible;
   * * If 1, the base unit of the asset is in tenths;
   * * If 2, the base unit of the asset is in hundredths;
   * * If 3, the base unit of the asset is in thousandths;
   * * and so on up to 19 decimal places.
   *
   * This field can only be specified upon asset creation.
   */
  decimals?: number

  /** The optional name of the asset.
   *
   * Max size is 32 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  assetName?: string

  /** The optional name of the unit of this asset (e.g. ticker name).
   *
   * Max size is 8 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  unitName?: string

  /** Specifies an optional URL where more information about the asset can be retrieved (e.g. metadata).
   *
   * Max size is 96 bytes.
   *
   * This field can only be specified upon asset creation.
   */
  url?: string

  /** 32-byte hash of some metadata that is relevant to your asset and/or asset holders.
   *
   * The format of this metadata is up to the application.
   *
   * This field can only be specified upon asset creation.
   */
  metadataHash?: string | Uint8Array

  /** Whether the asset is frozen by default for all accounts.
   * Defaults to `false`.
   *
   * If `true` then for anyone apart from the creator to hold the
   * asset it needs to be unfrozen per account using an asset freeze
   * transaction from the `freeze` account, which must be set on creation.
   *
   * This field can only be specified upon asset creation.
   */
  defaultFrozen?: boolean

  /** The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the `manager` the asset becomes permanently immutable.
   */
  manager?: string | Address

  /**
   * The address of the optional account that holds the reserve (uncirculated supply) units of the asset.
   *
   * This address has no specific authority in the protocol itself and is informational only.
   *
   * Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
   * rely on this field to hold meaningful data.
   *
   * It can be used in the case where you want to signal to holders of your asset that the uncirculated units
   * of the asset reside in an account that is different from the default creator account.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  reserve?: string | Address

  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  freeze?: string | Address

  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  clawback?: string | Address
}

/** Parameters to define an asset reconfiguration transaction.
 *
 * **Note:** The manager, reserve, freeze, and clawback addresses
 * are immutably empty if they are not set. If manager is not set then
 * all fields are immutable from that point forward.
 */
export type AssetConfigParams = CommonTransactionParams & {
  /** ID of the asset to reconfigure */
  assetId: bigint
  /** The address of the optional account that can manage the configuration of the asset and destroy it.
   *
   * The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.
   *
   * If not set (`undefined` or `""`) the asset will become permanently immutable.
   */
  manager: string | Address | undefined
  /**
   * The address of the optional account that holds the reserve (uncirculated supply) units of the asset.
   *
   * This address has no specific authority in the protocol itself and is informational only.
   *
   * Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
   * rely on this field to hold meaningful data.
   *
   * It can be used in the case where you want to signal to holders of your asset that the uncirculated units
   * of the asset reside in an account that is different from the default creator account.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  reserve?: string | Address
  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  freeze?: string | Address
  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  clawback?: string | Address
}

/** Parameters to define an asset freeze transaction. */
export type AssetFreezeParams = CommonTransactionParams & {
  /** The ID of the asset to freeze/unfreeze */
  assetId: bigint
  /** The address of the account to freeze or unfreeze */
  account: string | Address
  /** Whether the assets in the account should be frozen */
  frozen: boolean
}

/** Parameters to define an asset destroy transaction.
 *
 * Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.
 */
export type AssetDestroyParams = CommonTransactionParams & {
  /** ID of the asset to destroy */
  assetId: bigint
}

/** Parameters to define an asset transfer transaction. */
export type AssetTransferParams = CommonTransactionParams & {
  /** ID of the asset to transfer. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: string | Address
  /** Optional address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget?: string | Address
  /** Optional address of an account to close the asset position to.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeAssetTo?: string | Address
}

/** Parameters to define an asset opt-in transaction. */
export type AssetOptInParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-in to. */
  assetId: bigint
}

/** Parameters to define an asset opt-out transaction. */
export type AssetOptOutParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-out of. */
  assetId: bigint
  /**
   * The address of the asset creator account to close the asset
   *   position to (any remaining asset units will be sent to this account).
   */
  creator: string | Address
}

/** Parameters to define an online key registration transaction. */
export type OnlineKeyRegistrationParams = CommonTransactionParams & {
  /** The root participation public key */
  voteKey: Uint8Array
  /** The VRF public key */
  selectionKey: Uint8Array
  /** The first round that the participation key is valid. Not to be confused with the `firstValid` round of the keyreg transaction */
  voteFirst: bigint
  /** The last round that the participation key is valid. Not to be confused with the `lastValid` round of the keyreg transaction */
  voteLast: bigint
  /** This is the dilution for the 2-level participation key. It determines the interval (number of rounds) for generating new ephemeral keys */
  voteKeyDilution: bigint
  /** The 64 byte state proof public key commitment */
  stateProofKey?: Uint8Array
}

/** Parameters to define an offline key registration transaction. */
export type OfflineKeyRegistrationParams = CommonTransactionParams & {
  /** Prevent this account from ever participating again. The account will also no longer earn rewards */
  preventAccountFromEverParticipatingAgain?: boolean
}

/** Common parameters for defining an application call transaction. */
export type CommonAppCallParams = CommonTransactionParams & {
  /** ID of the application; 0 if the application is being created. */
  appId: bigint
  /** The [on-complete](https://dev.algorand.co/concepts/smart-contracts/avm#oncomplete) action of the call; defaults to no-op. */
  onComplete?: algosdk.OnApplicationComplete
  /** Any [arguments to pass to the smart contract call](/concepts/smart-contracts/languages/teal/#argument-passing). */
  args?: Uint8Array[]
  /** Any account addresses to add to the [accounts array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  accountReferences?: (string | Address)[]
  /** The ID of any apps to load to the [foreign apps array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  appReferences?: bigint[]
  /** The ID of any assets to load to the [foreign assets array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays). */
  assetReferences?: bigint[]
  /** Any boxes to load to the [boxes array](https://dev.algorand.co/concepts/smart-contracts/resource-usage#what-are-reference-arrays).
   *
   * Either the name identifier (which will be set against app ID of `0` i.e.
   *  the current app), or a box identifier with the name identifier and app ID.
   */
  boxReferences?: (BoxReference | BoxIdentifier)[]
  /** Access references unifies `accountReferences`, `appReferences`, `assetReferences`, and `boxReferences` under a single list. If non-empty, these other reference lists must be empty. If access is empty, those other reference lists may be non-empty. */
  accessReferences?: AccessReference[]
}

/** Parameters to define an app create transaction */
export type AppCreateParams = Expand<
  Omit<CommonAppCallParams, 'appId'> & {
    onComplete?: Exclude<algosdk.OnApplicationComplete, algosdk.OnApplicationComplete.ClearStateOC>
    /** The program to execute for all OnCompletes other than ClearState as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal that will be compiled (string) or compiled teal (encoded as a byte array (Uint8Array)). */
    clearStateProgram: string | Uint8Array
    /** The state schema for the app. This is immutable once the app is created. */
    schema?: {
      /** The number of integers saved in global state. */
      globalInts: number
      /** The number of byte slices saved in global state. */
      globalByteSlices: number
      /** The number of integers saved in local state. */
      localInts: number
      /** The number of byte slices saved in local state. */
      localByteSlices: number
    }
    /** Number of extra pages required for the programs.
     * Defaults to the number needed for the programs in this call if not specified.
     * This is immutable once the app is created. */
    extraProgramPages?: number
  }
>

/** Parameters to define an app update transaction */
export type AppUpdateParams = Expand<
  CommonAppCallParams & {
    onComplete?: algosdk.OnApplicationComplete.UpdateApplicationOC
    /** The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    clearStateProgram: string | Uint8Array
  }
>

/** Parameters to define an application call transaction. */
export type AppCallParams = CommonAppCallParams & {
  onComplete?: Exclude<algosdk.OnApplicationComplete, algosdk.OnApplicationComplete.UpdateApplicationOC>
}

/** Common parameters to define an ABI method call transaction. */
export type AppMethodCallParams = CommonAppCallParams & {
  onComplete?: Exclude<
    algosdk.OnApplicationComplete,
    algosdk.OnApplicationComplete.UpdateApplicationOC | algosdk.OnApplicationComplete.ClearStateOC
  >
}

/** Parameters to define an application delete call transaction. */
export type AppDeleteParams = CommonAppCallParams & {
  onComplete?: algosdk.OnApplicationComplete.DeleteApplicationOC
}

/** Parameters to define an ABI method call create transaction. */
export type AppCreateMethodCall = AppMethodCall<AppCreateParams>
/** Parameters to define an ABI method call update transaction. */
export type AppUpdateMethodCall = AppMethodCall<AppUpdateParams>
/** Parameters to define an ABI method call delete transaction. */
export type AppDeleteMethodCall = AppMethodCall<AppDeleteParams>
/** Parameters to define an ABI method call transaction. */
export type AppCallMethodCall = AppMethodCall<AppMethodCallParams>

/** Types that can be used to define a transaction argument for an ABI call transaction. */
export type AppMethodCallTransactionArgument =
  // The following should match the partial `args` types from `AppMethodCall<T>` below
  | TransactionWithSigner
  | Transaction
  | Promise<Transaction>
  | AppMethodCall<AppCreateParams>
  | AppMethodCall<AppUpdateParams>
  | AppMethodCall<AppMethodCallParams>

/** Parameters to define an ABI method call. */
export type AppMethodCall<T> = Expand<Omit<T, 'args'>> & {
  /** The ABI method to call */
  method: algosdk.ABIMethod
  /** Arguments to the ABI method, either:
   * * An ABI value
   * * A transaction with explicit signer
   * * A transaction (where the signer will be automatically assigned)
   * * An unawaited transaction (e.g. from algorand.createTransaction.{transactionType}())
   * * Another method call (via method call params object)
   * * undefined (this represents a placeholder transaction argument that is fulfilled by another method call argument)
   */
  args?: (
    | algosdk.ABIValue
    | TransactionWithSigner
    | Transaction
    | Promise<Transaction>
    | AppMethodCall<AppCreateParams>
    | AppMethodCall<AppUpdateParams>
    | AppMethodCall<AppMethodCallParams>
    | undefined
  )[]
}

// TODO: PD - rename this to ComposerTransaction
export type Txn =
  | (PaymentParams & { type: 'pay' })
  | (AssetCreateParams & { type: 'assetCreate' })
  | (AssetConfigParams & { type: 'assetConfig' })
  | (AssetFreezeParams & { type: 'assetFreeze' })
  | (AssetDestroyParams & { type: 'assetDestroy' })
  | (AssetTransferParams & { type: 'assetTransfer' })
  | (AssetOptInParams & { type: 'assetOptIn' })
  | (AssetOptOutParams & { type: 'assetOptOut' })
  | ((AppCallParams | AppCreateParams | AppUpdateParams) & { type: 'appCall' })
  | ((OnlineKeyRegistrationParams | OfflineKeyRegistrationParams) & { type: 'keyReg' })
  | (algosdk.TransactionWithSigner & { type: 'txnWithSigner' })
  | ((AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall) & { type: 'methodCall' })

/** Configuration for transaction composer behavior */
export type TransactionComposerConfig = {
  /** Whether to cover inner transaction fees for app call transactions */
  coverAppCallInnerTransactionFees: boolean
  /** Resource population configuration */
  populateAppCallResources: ResourcePopulation
}

/** Resource population configuration */
export interface ResourcePopulation {
  /** Whether resource population is enabled */
  enabled: boolean
  /** Whether to use access list (new format) vs legacy foreign arrays */
  useAccessList: boolean
}

/** New internal transaction representation for the composer */
export type ComposerTransaction = Txn

/** Analysis result for a single transaction in a group */
type TransactionAnalysis = {
  /** Resources accessed by this transaction but not declared */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

/** Analysis result for a transaction group */
type GroupAnalysis = {
  /** Analysis of each transaction in the group */
  transactions: TransactionAnalysis[]
  /** Resources accessed by the group that qualify for group resource sharing */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

/**
 * A function that transforms an error into a new error.
 *
 * In most cases, an ErrorTransformer should first check if it can or should transform the error
 * and return the input error if it cannot or should not transform it.
 */
export type ErrorTransformer = (error: Error) => Promise<Error>

class InvalidErrorTransformerValue extends Error {
  constructor(originalError: unknown, value: unknown) {
    super(`An error transformer returned a non-error value: ${value}. The original error before any transformation: ${originalError}`)
  }
}

class ErrorTransformerError extends Error {
  constructor(originalError: Error, cause: unknown) {
    super(`An error transformer threw an error: ${cause}. The original error before any transformation: ${originalError} `, { cause })
  }
}

/** Parameters to create an `TransactionComposer`. */
export type TransactionComposerParams = {
  /** The algod client to use to get suggestedParams and send the transaction group */
  algod: algosdk.Algodv2
  /** The function used to get the TransactionSigner for a given address */
  getSigner: (address: string | Address) => algosdk.TransactionSigner
  /** The method used to get SuggestedParams for transactions in the group */
  getSuggestedParams?: () => Promise<TransactionParams>
  /** How many rounds a transaction should be valid for by default; if not specified
   * then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).
   */
  defaultValidityWindow?: bigint
  /** An existing `AppManager` to use to manage app compilation and cache compilation results.
   *
   * If not specified then an ephemeral one will be created.
   */
  appManager?: AppManager
  /**
   * An array of error transformers to use when an error is caught in simulate or execute
   * callbacks can later be registered with `registerErrorTransformer`
   */
  errorTransformers?: ErrorTransformer[]
  /**
   * Configuration for transaction composer behavior including resource population and fee coverage.
   * If not specified, defaults will be used.
   */
  composerConfig?: TransactionComposerConfig
}

/** Represents a Transaction with additional context that was used to build that transaction. */
interface TransactionWithContext {
  txn: Transaction
  context: {
    /* The logical max fee for the transaction, if one was supplied. */
    maxFee?: AlgoAmount
    /* The ABI method, if the app call transaction is an ABI method call. */
    abiMethod?: algosdk.ABIMethod
  }
}

/** Represents a TransactionWithSigner with additional context that was used to build that transaction. */
type TransactionWithSignerAndContext = algosdk.TransactionWithSigner & TransactionWithContext

/** Set of transactions built by `TransactionComposer`. */
export interface BuiltTransactions {
  /** The built transactions */
  transactions: Transaction[]
  /** Any `ABIMethod` objects associated with any of the transactions in a map keyed by transaction index. */
  methodCalls: Map<number, algosdk.ABIMethod>
  /** Any `TransactionSigner` objects associated with any of the transactions in a map keyed by transaction index. */
  signers: Map<number, algosdk.TransactionSigner>
}

/** TransactionComposer helps you compose and execute transactions as a transaction group. */
export class TransactionComposer {
  /** Signer used to represent a lack of signer */
  private static NULL_SIGNER: algosdk.TransactionSigner = algosdk.makeEmptyTransactionSigner()

  /** Internal transactions array */
  private transactions: ComposerTransaction[] = []

  /** Cached built transaction group */
  private builtGroup?: TransactionWithSigner[]

  /** Cached signed transaction group */
  private signedGroup?: SignedTransaction[]

  /** Cached method calls map (transaction index to ABIMethod) */
  private builtMethodCalls?: Map<number, ABIMethod>

  /** Configuration for composer behavior */
  private composerConfig: TransactionComposerConfig

  /** The algod client used by the composer. */
  private algod: algosdk.Algodv2

  /** An async function that will return suggested params for the transaction. */
  private getSuggestedParams: () => Promise<TransactionParams>

  /** A function that takes in an address and return a signer function for that address. */
  private getSigner: (address: string | Address) => algosdk.TransactionSigner

  /** The default transaction validity window */
  private defaultValidityWindow = 10n

  /** Whether the validity window was explicitly set on construction */
  private defaultValidityWindowIsExplicit = false

  private appManager: AppManager

  private errorTransformers: ErrorTransformer[]

  private async transformError(originalError: unknown): Promise<unknown> {
    // Transformers only work with Error instances, so immediately return anything else
    if (!(originalError instanceof Error)) {
      return originalError
    }

    let transformedError = originalError

    for (const transformer of this.errorTransformers) {
      try {
        transformedError = await transformer(transformedError)
        if (!(transformedError instanceof Error)) {
          return new InvalidErrorTransformerValue(originalError, transformedError)
        }
      } catch (errorFromTransformer) {
        return new ErrorTransformerError(originalError, errorFromTransformer)
      }
    }

    return transformedError
  }

  /**
   * Create a `TransactionComposer`.
   * @param params The configuration for this composer
   * @returns The `TransactionComposer` instance
   */
  constructor(params: TransactionComposerParams) {
    this.algod = params.algod
    const defaultGetSuggestedParams = () => params.algod.transactionParams()
    this.getSuggestedParams = params.getSuggestedParams ?? defaultGetSuggestedParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.defaultValidityWindowIsExplicit = params.defaultValidityWindow !== undefined
    this.appManager = params.appManager ?? new AppManager(params.algod)
    this.errorTransformers = params.errorTransformers ?? []
    this.composerConfig = params.composerConfig ?? {
      coverAppCallInnerTransactionFees: false,
      populateAppCallResources: { enabled: true, useAccessList: false },
    }
  }

  /**
   * Register a function that will be used to transform an error caught when simulating or executing
   *
   * @returns The composer so you can chain method calls
   */
  registerErrorTransformer(transformer: ErrorTransformer) {
    this.errorTransformers.push(transformer)
    return this
  }

  /**
   * Build transactions from the internal transactions array.
   * This is the new implementation that replaces SDK ATC's buildGroup.
   *
   * @param suggestedParams - Suggested parameters from algod
   * @param defaultValidityWindow - Default validity window
   * @param groupAnalysis - Optional analysis results for resource population
   * @param methodCallsMap - Optional map to populate with method call information
   * @returns Array of built transactions
   */
  private async buildTransactions(
    suggestedParams: TransactionParams,
    defaultValidityWindow: bigint,
    groupAnalysis?: GroupAnalysis,
    methodCallsMap?: Map<number, ABIMethod>, // TODO: PD review this, it's to keep track of the method calls only
  ): Promise<Transaction[]> {
    const builtTransactions: Transaction[] = []

    // Build each transaction from the transactions array
    for (const ctxn of this.transactions) {
      let transaction: Transaction
      const commonParams = getCommonParams(ctxn)
      const header = buildTransactionHeader(commonParams, suggestedParams, defaultValidityWindow)
      let calculateFee = header.fee === undefined

      switch (ctxn.type) {
        // TODO: PD - what to do with 'txn'
        case 'txnWithSigner':
          transaction = ctxn.txn
          calculateFee = false
          break
        case 'methodCall': {
          // Build method call transactions
          const methodTxns = await this.buildMethodCall(ctxn, header, false)
          // Track method calls - the last transaction in the group is the actual method call
          if (methodCallsMap) {
            methodTxns.forEach((txnWithContext, offset) => {
              if (txnWithContext.context.abiMethod) {
                methodCallsMap.set(builtTransactions.length + offset, txnWithContext.context.abiMethod)
              }
            })
          }
          builtTransactions.push(...methodTxns.map((t) => t.txn))
          continue
        }
        case 'pay': {
          transaction = this.buildPayment(ctxn, header)
          break
        }
        case 'assetCreate': {
          transaction = this.buildAssetCreate(ctxn, header)
          break
        }
        case 'assetConfig': {
          transaction = this.buildAssetConfig(ctxn, header)
          break
        }
        case 'assetDestroy': {
          transaction = this.buildAssetDestroy(ctxn, header)
          break
        }
        case 'assetFreeze': {
          transaction = this.buildAssetFreeze(ctxn, header)
          break
        }
        case 'assetTransfer': {
          transaction = this.buildAssetTransfer(ctxn, header)
          break
        }
        case 'assetOptIn': {
          transaction = this.buildAssetTransfer({ ...ctxn, receiver: ctxn.sender, amount: 0n }, header)
          break
        }
        case 'assetOptOut': {
          transaction = this.buildAssetTransfer({ ...ctxn, receiver: ctxn.sender, amount: 0n, closeAssetTo: ctxn.creator }, header)
          break
        }
        case 'appCall': {
          transaction = await this.buildAppCall(ctxn, header)
          break
        }
        case 'keyReg': {
          transaction = this.buildKeyReg(ctxn, header)
          break
        }
        default: {
          const _exhaustiveCheck: never = ctxn
          throw new Error(`Unsupported transaction type: ${(_exhaustiveCheck as ComposerTransaction).type}`)
        }
      }

      if (calculateFee) {
        transaction = assignFee(transaction, {
          feePerByte: suggestedParams.fee,
          minFee: suggestedParams.minFee,
          extraFee: commonParams.extraFee?.microAlgos,
          maxFee: commonParams.maxFee?.microAlgos,
        })
      }

      builtTransactions.push(transaction)
    }

    // Apply resource population if analysis was performed
    if (groupAnalysis) {
      // Apply transaction-level resource population
      groupAnalysis.transactions.forEach((txnAnalysis, groupIndex) => {
        if (txnAnalysis.unnamedResourcesAccessed && builtTransactions[groupIndex].transactionType === TransactionType.AppCall) {
          _populateTransactionResources(builtTransactions[groupIndex], txnAnalysis.unnamedResourcesAccessed, groupIndex)
        }
      })

      // Apply group-level resource population
      if (groupAnalysis.unnamedResourcesAccessed) {
        _populateGroupResources(builtTransactions, groupAnalysis.unnamedResourcesAccessed)
      }
    }

    if (builtTransactions.length > 1) {
      return groupTransactions(builtTransactions)
    }

    return builtTransactions
  }

  /**
   * Gather signers for built transactions.
   * Maps each transaction to its signer based on the composer transaction configuration.
   *
   * @param transactions - Built transactions
   * @returns Array of transactions with signers attached
   */
  private _gatherSigners(transactions: Transaction[]): TransactionWithSigner[] {
    return transactions.map((txn, index) => {
      const ctxn = this.transactions[index]
      const commonParams = _getCommonParams(ctxn)
      let signer = commonParams.signer || this.getSigner(txn.sender)

      // Convert TransactionSignerAccount to TransactionSigner if needed
      if (signer && 'signer' in signer) {
        signer = signer.signer
      }

      return {
        txn,
        signer: signer as algosdk.TransactionSigner,
      }
    })
  }

  /**
   * Analyze the transaction group to determine resource requirements.
   * This performs a simulation to discover what resources (accounts, apps, assets, boxes)
   * are needed by app call transactions.
   *
   * @param suggestedParams - Suggested transaction parameters
   * @param defaultValidityWindow - Default validity window for transactions
   * @returns Analysis results including resource requirements for each transaction
   */
  private async _analyzeGroupRequirements(suggestedParams: TransactionParams, defaultValidityWindow: bigint): Promise<GroupAnalysis> {
    // Build transactions without resource population first
    const builtTransactions = await this.buildTransactions(suggestedParams, defaultValidityWindow)

    // Prepare transactions for simulation - remove group IDs
    let transactionsToSimulate = builtTransactions.map((txn) => {
      const txnToSimulate = { ...txn }
      txnToSimulate.group = undefined
      return txnToSimulate
    })

    // Regroup the transactions if needed
    if (transactionsToSimulate.length > 1) {
      const { groupTransactions } = await import('../algokit_transact')
      transactionsToSimulate = groupTransactions(transactionsToSimulate)
    }

    // Create signed transactions with empty signatures for simulation
    const { EMPTY_SIGNATURE } = await import('../algokit_common')
    const signedTransactions = transactionsToSimulate.map(
      (txn): SignedTransaction => ({
        transaction: txn,
        signature: EMPTY_SIGNATURE,
      }),
    )

    // Build the simulation request
    const simulateRequest: SimulateRequest = {
      txnGroups: [
        {
          txns: signedTransactions,
        },
      ],
      allowUnnamedResources: true,
      allowEmptySignatures: true,
      fixSigners: true,
    }

    // Execute simulation
    const response: SimulateTransaction = await this.algod.simulateTransaction({ body: simulateRequest })
    const groupResponse = response.txnGroups[0]

    // Handle any simulation failures
    if (groupResponse.failureMessage) {
      throw new Error(
        `Error analyzing group requirements via simulate in transaction ${groupResponse.failedAt?.join(', ')}: ${groupResponse.failureMessage}`,
      )
    }

    // Build analysis results for each transaction
    const txnAnalysisResults: TransactionAnalysis[] = groupResponse.txnResults.map((simulateTxnResult) => {
      return {
        unnamedResourcesAccessed: this.composerConfig.populateAppCallResources?.enabled
          ? simulateTxnResult.unnamedResourcesAccessed
          : undefined,
      }
    })

    return {
      transactions: txnAnalysisResults,
      unnamedResourcesAccessed: this.composerConfig.populateAppCallResources?.enabled ? groupResponse.unnamedResourcesAccessed : undefined,
    }
  }

  /**
   * Build the transaction group using the new implementation.
   * This is the new implementation that will replace the SDK ATC-based build.
   *
   * @returns Object containing built transactions with signers and method calls map
   */
  private async _buildNew(): Promise<{ transactions: TransactionWithSigner[]; methodCalls: Map<number, ABIMethod> }> {
    if (this.builtGroup) {
      // If we have a cached build, return it along with the cached method calls
      return { transactions: this.builtGroup, methodCalls: this.builtMethodCalls ?? new Map() }
    }

    const suggestedParams = await this.getSuggestedParams()
    const defaultValidityWindow = BigInt(_getDefaultValidityWindow(suggestedParams.genesisId))

    // Phase 1: Analyze group requirements if needed
    // Check if we need to analyze: either resource population is enabled, or we have app calls
    const shouldAnalyze = this.composerConfig.populateAppCallResources.enabled && this.transactions.some((t) => _isAppCall(t))

    const groupAnalysis = shouldAnalyze ? await this._analyzeGroupRequirements(suggestedParams, defaultValidityWindow) : undefined

    // Phase 2: Build transactions with method call tracking
    const methodCalls = new Map<number, ABIMethod>()
    const transactions = await this.buildTransactions(suggestedParams, defaultValidityWindow, groupAnalysis, methodCalls)

    // Phase 3: Attach signers
    const transactionsWithSigners = this._gatherSigners(transactions)

    // Cache the results
    this.builtGroup = transactionsWithSigners
    this.builtMethodCalls = methodCalls

    return { transactions: this.builtGroup, methodCalls }
  }

  /**
   * Gather signatures for the transaction group.
   * This is the new implementation that replaces SDK ATC's gatherSignatures.
   *
   * @returns Array of signed transactions
   */
  private async _gatherSignaturesNew(): Promise<Uint8Array[]> {
    if (this.signedGroup) {
      // Return cached signed transactions
      return this.signedGroup.map((stxn) => algosdk.encodeSignedTransaction(stxn))
    }

    // Build the group first
    await this._buildNew()

    if (!this.builtGroup || this.builtGroup.length === 0) {
      throw new Error('No transactions available')
    }

    const txnGroup = this.builtGroup.map((txnWithSigner) => txnWithSigner.txn)

    // Group transactions by signer
    const signerGroups = new Map<algosdk.TransactionSigner, number[]>()
    this.builtGroup.forEach(({ signer }, index) => {
      const indexes = signerGroups.get(signer) ?? []
      indexes.push(index)
      signerGroups.set(signer, indexes)
    })

    // Sign transactions in parallel for each signer
    const signerEntries = Array.from(signerGroups)
    const signedGroups = await Promise.all(signerEntries.map(([signer, indexes]) => signer(txnGroup, indexes)))

    // Reconstruct signed transactions in original order
    const signedTransactions = new Array<Uint8Array>(this.builtGroup.length)
    signerEntries.forEach(([, indexes], signerIndex) => {
      const stxs = signedGroups[signerIndex]
      indexes.forEach((txIndex, stxIndex) => {
        signedTransactions[txIndex] = stxs[stxIndex]
      })
    })

    // Verify all transactions were signed
    const unsignedIndexes = signedTransactions
      .map((stxn, index) => (stxn === undefined ? index : null))
      .filter((index): index is number => index !== null)

    if (unsignedIndexes.length > 0) {
      throw new Error(`Transactions at indexes [${unsignedIndexes.join(', ')}] were not signed`)
    }

    // Cache signed transactions as decoded objects
    this.signedGroup = signedTransactions.map((stxn) => algosdk.decodeSignedTransaction(stxn))

    return signedTransactions
  }

  /**
   * Send the transaction group to the network using the new implementation.
   * This replaces the SDK ATC-based send logic.
   *
   * @param params - Send parameters
   * @returns Send results
   */
  private async _sendNew(params?: SendParams): Promise<SendAtomicTransactionComposerResults> {
    // Gather signatures
    const signedTxns = await this._gatherSignaturesNew()

    if (!this.signedGroup || this.signedGroup.length === 0) {
      throw new Error('No transactions available')
    }

    const group = this.signedGroup[0].transaction.group

    // Calculate wait rounds
    let waitRounds = params?.maxRoundsToWaitForConfirmation

    if (waitRounds === undefined) {
      const suggestedParams = await this.getSuggestedParams()
      const firstRound = suggestedParams.lastRound
      const lastRound = this.signedGroup.reduce(
        (max, stxn) => (stxn.transaction.lastValid > max ? stxn.transaction.lastValid : BigInt(max)),
        0n,
      )
      waitRounds = Number(BigInt(lastRound) - BigInt(firstRound)) + 1
    }

    // Concatenate all signed transactions
    const totalLength = signedTxns.reduce((sum, stxn) => sum + stxn.length, 0)
    const merged = new Uint8Array(totalLength)
    let offset = 0
    for (const stxn of signedTxns) {
      merged.set(stxn, offset)
      offset += stxn.length
    }

    // Submit to network
    await this.algod.rawTransaction({ body: merged })

    const transactions = this.signedGroup.map((stxn) => stxn.transaction)
    const transactionIds = transactions.map((txn) => getTransactionId(txn))

    // Wait for confirmations if requested
    const confirmations: PendingTransactionResponse[] = []
    if (params?.maxRoundsToWaitForConfirmation) {
      for (const id of transactionIds) {
        // Use algod's pendingTransactionInformation instead
        const confirmation = await this.algod.pendingTransactionInformation(id)
        confirmations.push(confirmation)
      }
    }

    // Parse ABI return values from method calls
    const abiReturns: ABIReturn[] = []
    if (confirmations.length > 0 && this.builtMethodCalls && this.builtMethodCalls.size > 0) {
      // Iterate through all transactions and check if they are method calls
      for (let i = 0; i < confirmations.length; i++) {
        const method = this.builtMethodCalls.get(i)
        if (method) {
          // This transaction is a method call, extract the return value
          const abiReturn = _extractAbiReturnFromLogs(confirmations[i], method)
          abiReturns.push(abiReturn)
        }
      }
    }

    // Build result in backward-compatible format
    return {
      groupId: group ? Buffer.from(group).toString('base64') : '',
      txIds: transactionIds,
      transactions,
      confirmations,
      returns: abiReturns,
    }
  }

  /**
   * Simulate the transaction group using the new implementation.
   * This replaces the SDK ATC-based simulate logic.
   *
   * @param options - Simulation options
   * @returns Simulation results
   */
  private async _simulateNew(
    options?: SimulateOptions,
  ): Promise<SendAtomicTransactionComposerResults & { simulateResponse: SimulateTransaction }> {
    const { skipSignatures = false, ...rawOptions } = options ?? {}

    let signedTransactions: SignedTransaction[]

    if (skipSignatures) {
      // Build without signatures
      const { transactions } = await this._buildNew()
      signedTransactions = transactions.map(({ txn }) => ({
        transaction: txn,
        signature: new Uint8Array(64), // Empty signature
      }))
    } else {
      // Use real signatures
      await this._gatherSignaturesNew()
      signedTransactions = this.signedGroup!
    }

    const simulateRequest: SimulateRequest = {
      txnGroups: [{ txns: signedTransactions }],
      ...rawOptions,
      ...(skipSignatures
        ? {
            allowEmptySignatures: true,
            fixSigners: true,
          }
        : {}),
    }

    const simulateResponse = await this.algod.simulateTransaction({ body: simulateRequest })

    // Parse results
    const transactions = signedTransactions.map((stxn) => stxn.transaction)
    const transactionIds = transactions.map((txn) => getTransactionId(txn))
    const confirmations = simulateResponse.txnGroups[0].txnResults.map((r) => r.txnResult)

    // Parse ABI return values from method calls
    const abiReturns: ABIReturn[] = []
    if (this.builtMethodCalls && this.builtMethodCalls.size > 0) {
      // Iterate through all transactions and check if they are method calls
      for (let i = 0; i < confirmations.length; i++) {
        const method = this.builtMethodCalls.get(i)
        if (method) {
          // This transaction is a method call, extract the return value
          const abiReturn = _extractAbiReturnFromLogs(confirmations[i], method)
          abiReturns.push(abiReturn)
        }
      }
    }

    return {
      confirmations,
      transactions,
      txIds: transactionIds,
      groupId: transactions[0].group ? Buffer.from(transactions[0].group).toString('base64') : '',
      simulateResponse,
      returns: abiReturns,
    }
  }

  /**
   * Add a pre-built transaction to the transaction group.
   * @param transaction The pre-built transaction
   * @param signer Optional signer override for the transaction
   * @returns The composer so you can chain method calls
   * @example
   * ```typescript
   * composer.addTransaction(txn)
   * ```
   */
  addTransaction(transaction: Transaction, signer?: TransactionSigner): TransactionComposer {
    this.transactions.push({
      txn: transaction,
      signer: signer ?? this.getSigner(transaction.sender),
      type: 'txnWithSigner',
    })

    return this
  }

  /**
   * Add a payment transaction to the transaction group.
   * @param params The payment transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addPayment({
   *   sender: 'SENDERADDRESS',
   *   receiver: 'RECEIVERADDRESS',
   *   amount: (4).algo(),
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addPayment({
   *   amount: (4).algo(),
   *   receiver: 'RECEIVERADDRESS',
   *   sender: 'SENDERADDRESS',
   *   closeRemainderTo: 'CLOSEREMAINDERTOADDRESS',
   *   lease: 'lease',
   *   note: 'note',
   *   // Use this with caution, it's generally better to use algorand.account.rekeyAccount
   *   rekeyTo: 'REKEYTOADDRESS',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   */
  addPayment(params: PaymentParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'pay' })

    return this
  }

  /**
   * Add an asset create transaction to the transaction group.
   * @param params The asset create transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetCreate({ sender: "CREATORADDRESS", total: 100n})
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetCreate({
   *   sender: 'CREATORADDRESS',
   *   total: 100n,
   *   decimals: 2,
   *   assetName: 'asset',
   *   unitName: 'unit',
   *   url: 'url',
   *   metadataHash: 'metadataHash',
   *   defaultFrozen: false,
   *   manager: 'MANAGERADDRESS',
   *   reserve: 'RESERVEADDRESS',
   *   freeze: 'FREEZEADDRESS',
   *   clawback: 'CLAWBACKADDRESS',
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   */
  addAssetCreate(params: AssetCreateParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetCreate' })

    return this
  }

  /**
   * Add an asset config transaction to the transaction group.
   * @param params The asset config transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetConfig({
   *   sender: 'MANAGERADDRESS',
   *   assetId: 123456n,
   *   manager: 'MANAGERADDRESS',
   *   reserve: 'RESERVEADDRESS',
   *   freeze: 'FREEZEADDRESS',
   *   clawback: 'CLAWBACKADDRESS',
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   */
  addAssetConfig(params: AssetConfigParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetConfig' })

    return this
  }

  /**
   * Add an asset freeze transaction to the transaction group.
   * @param params The asset freeze transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetFreeze({
   *   sender: 'MANAGERADDRESS',
   *   assetId: 123456n,
   *   account: 'ACCOUNTADDRESS',
   *   frozen: true,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addAssetFreeze(params: AssetFreezeParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetFreeze' })

    return this
  }

  /**
   * Add an asset destroy transaction to the transaction group.
   * @param params The asset destroy transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetDestroy({
   *   sender: 'MANAGERADDRESS',
   *   assetId: 123456n,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addAssetDestroy(params: AssetDestroyParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetDestroy' })

    return this
  }

  /**
   * Add an asset transfer transaction to the transaction group.
   * @param params The asset transfer transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
   * ```
   * @example Advanced example (with clawback)
   * ```typescript
   * composer.addAssetTransfer({
   *   sender: 'CLAWBACKADDRESS',
   *   assetId: 123456n,
   *   amount: 1n,
   *   receiver: 'RECEIVERADDRESS',
   *   clawbackTarget: 'HOLDERADDRESS',
   *   // This field needs to be used with caution
   *   closeAssetTo: 'ADDRESSTOCLOSETO'
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addAssetTransfer(params: AssetTransferParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetTransfer' })

    return this
  }

  /**
   * Add an asset opt-in transaction to the transaction group.
   * @param params The asset opt-in transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAssetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetOptIn({
   *   sender: 'SENDERADDRESS',
   *   assetId: 123456n,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addAssetOptIn(params: AssetOptInParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetOptIn' })

    return this
  }

  /**
   * Add an asset opt-out transaction to the transaction group.
   * @param params The asset opt-out transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example (without creator, will be retrieved from algod)
   * ```typescript
   * composer.addAssetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Basic example (with creator)
   * ```typescript
   * composer.addAssetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAssetOptOut({
   *   sender: 'SENDERADDRESS',
   *   assetId: 123456n,
   *   creator: 'CREATORADDRESS',
   *   ensureZeroBalance: true,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addAssetOptOut(params: AssetOptOutParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'assetOptOut' })

    return this
  }

  /**
   * Add an application create transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application create transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAppCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAppCreate({
   *  sender: 'CREATORADDRESS',
   *  approvalProgram: "TEALCODE",
   *  clearStateProgram: "TEALCODE",
   *  schema: {
   *    globalInts: 1,
   *    globalByteSlices: 2,
   *    localInts: 3,
   *    localByteSlices: 4
   *  },
   *  extraProgramPages: 1,
   *  onComplete: algosdk.OnApplicationComplete.OptInOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   */
  addAppCreate(params: AppCreateParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'appCall' })

    return this
  }

  /**
   * Add an application update transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application update transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAppUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAppUpdate({
   *  sender: 'CREATORADDRESS',
   *  approvalProgram: "TEALCODE",
   *  clearStateProgram: "TEALCODE",
   *  onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppUpdate(params: AppUpdateParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'appCall', onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC })

    return this
  }

  /**
   * Add an application delete transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application delete transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAppDelete({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAppDelete({
   *  sender: 'CREATORADDRESS',
   *  onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppDelete(params: AppDeleteParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'appCall', onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC })

    return this
  }

  /**
   * Add an application call transaction to the transaction group.
   *
   * If you want to create or update an app use `addAppCreate` or `addAppUpdate`.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application call transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addAppCall({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addAppCall({
   *  sender: 'CREATORADDRESS',
   *  onComplete: algosdk.OnApplicationComplete.OptInOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppCall(params: AppCallParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'appCall' })

    return this
  }

  /**
   * Add an ABI method create application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI create method application call transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppCreateMethodCall({
   *  sender: 'CREATORADDRESS',
   *  method: method,
   *  args: ["arg1_value"],
   *  approvalProgram: "TEALCODE",
   *  clearStateProgram: "TEALCODE",
   *  schema: {
   *    globalInts: 1,
   *    globalByteSlices: 2,
   *    localInts: 3,
   *    localByteSlices: 4
   *  },
   *  extraProgramPages: 1,
   *  onComplete: algosdk.OnApplicationComplete.OptInOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppCreateMethodCall(params: AppCreateMethodCall) {
    this.transactions.push({ ...params, type: 'methodCall' })
    return this
  }

  /**
   * Add an ABI method update application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI update method application call transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppUpdateMethodCall({
   *  sender: 'CREATORADDRESS',
   *  method: method,
   *  args: ["arg1_value"],
   *  approvalProgram: "TEALCODE",
   *  clearStateProgram: "TEALCODE",
   *  onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppUpdateMethodCall(params: AppUpdateMethodCall) {
    this.transactions.push({ ...params, type: 'methodCall', onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC })
    return this
  }

  /**
   * Add an ABI method delete application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI delete method application call transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppDeleteMethodCall({
   *  sender: 'CREATORADDRESS',
   *  method: method,
   *  args: ["arg1_value"],
   *  onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppDeleteMethodCall(params: AppDeleteMethodCall) {
    this.transactions.push({ ...params, type: 'methodCall', onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC })
    return this
  }

  /**
   * Add a non-create/non-update ABI method application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI method application call transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * composer.addAppCallMethodCall({
   *  sender: 'CREATORADDRESS',
   *  method: method,
   *  args: ["arg1_value"],
   *  onComplete: algosdk.OnApplicationComplete.OptInOC,
   *  args: [new Uint8Array(1, 2, 3, 4)]
   *  accountReferences: ["ACCOUNT_1"]
   *  appReferences: [123n, 1234n]
   *  assetReferences: [12345n]
   *  boxReferences: ["box1", {appId: 1234n, name: "box2"}]
   *  accessReferences: [{ appId: 1234n }]
   *  lease: 'lease',
   *  note: 'note',
   *  // You wouldn't normally set this field
   *  firstValidRound: 1000n,
   *  validityWindow: 10,
   *  extraFee: (1000).microAlgo(),
   *  staticFee: (1000).microAlgo(),
   *  // Max fee doesn't make sense with extraFee AND staticFee
   *  //  already specified, but here for completeness
   *  maxFee: (3000).microAlgo(),
   *})
   * ```
   */
  addAppCallMethodCall(params: AppCallMethodCall) {
    this.transactions.push({ ...params, type: 'methodCall' })
    return this
  }

  /**
   * Add an online key registration transaction to the transaction group.
   * @param params The online key registration transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addOnlineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   *   voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
   *   selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
   *   stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
   *   voteFirst: 1n,
   *   voteLast: 1000n,
   *   voteKeyDilution: 1n,
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addOnlineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   *   voteKey: Uint8Array.from(Buffer.from("voteKeyBase64", 'base64')),
   *   selectionKey: Uint8Array.from(Buffer.from("selectionKeyBase64", 'base64')),
   *   stateProofKey: Uint8Array.from(Buffer.from("stateProofKeyBase64", 'base64')),
   *   voteFirst: 1n,
   *   voteLast: 1000n,
   *   voteKeyDilution: 1n,
   *   lease: 'lease',
   *   note: 'note',
   *   // Use this with caution, it's generally better to use algorand.account.rekeyAccount
   *   rekeyTo: 'REKEYTOADDRESS',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addOnlineKeyRegistration(params: OnlineKeyRegistrationParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'keyReg' })

    return this
  }

  /**
   * Add an offline key registration transaction to the transaction group.
   * @param params The offline key registration transaction parameters
   * @returns The composer so you can chain method calls
   * @example Basic example
   * ```typescript
   * composer.addOfflineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * composer.addOfflineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   *   lease: 'lease',
   *   note: 'note',
   *   // Use this with caution, it's generally better to use algorand.account.rekeyAccount
   *   rekeyTo: 'REKEYTOADDRESS',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgo(),
   *   staticFee: (1000).microAlgo(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgo(),
   * })
   * ```
   */
  addOfflineKeyRegistration(params: OfflineKeyRegistrationParams): TransactionComposer {
    this.transactions.push({ ...params, type: 'keyReg' })

    return this
  }

  /** Build an ATC and return transactions ready to be incorporated into a broader set of transactions this composer is composing */
  private buildAtc(atc: algosdk.AtomicTransactionComposer): TransactionWithSignerAndContext[] {
    const group = atc.buildGroup()

    const txnWithSigners = group.map((ts, idx) => {
      // Remove underlying group ID from the transaction since it will be re-grouped when this TransactionComposer is built
      ts.txn.group = undefined
      // If this was a method call return the ABIMethod for later
      if (atc['methodCalls'].get(idx)) {
        return {
          ...ts,
          context: { abiMethod: atc['methodCalls'].get(idx) as algosdk.ABIMethod },
        }
      }
      return {
        ...ts,
        context: {},
      }
    })

    return txnWithSigners
  }

  private commonTxnBuildStep<TParams extends algosdk.CommonTransactionParams>(
    buildTxn: (params: TParams) => Transaction,
    params: CommonTransactionParams,
    txnParams: TParams,
  ): TransactionWithContext {
    // We are going to mutate suggested params, let's create a clone first
    txnParams.suggestedParams = { ...txnParams.suggestedParams }

    if (params.lease) txnParams.lease = encodeLease(params.lease)! satisfies algosdk.Transaction['lease']
    if (params.rekeyTo) txnParams.rekeyTo = params.rekeyTo.toString() satisfies algosdk.Transaction['rekeyTo']
    const encoder = new TextEncoder()
    if (params.note)
      txnParams.note = (typeof params.note === 'string' ? encoder.encode(params.note) : params.note) satisfies algosdk.Transaction['note']

    if (params.firstValidRound) {
      txnParams.suggestedParams.firstRound = params.firstValidRound
    }

    if (params.lastValidRound) {
      txnParams.suggestedParams.lastRound = params.lastValidRound
    } else {
      // If the validity window isn't set in this transaction or by default and we are pointing at
      //  LocalNet set a bigger window to avoid dead transactions
      const window = params.validityWindow
        ? BigInt(params.validityWindow)
        : !this.defaultValidityWindowIsExplicit && genesisIdIsLocalNet(txnParams.suggestedParams.genesisId ?? 'unknown')
          ? 1000n
          : this.defaultValidityWindow
      txnParams.suggestedParams.lastRound = BigInt(txnParams.suggestedParams.firstRound) + window
    }

    if (params.staticFee !== undefined && params.extraFee !== undefined) {
      throw Error('Cannot set both staticFee and extraFee')
    }

    let txn = buildTxn(txnParams)

    if (params.staticFee !== undefined) {
      txn.fee = params.staticFee.microAlgos
    } else {
      txn = assignFee(txn, {
        feePerByte: txnParams.suggestedParams.fee,
        minFee: txnParams.suggestedParams.minFee,
        extraFee: params.extraFee?.microAlgos,
        maxFee: params.maxFee?.microAlgos,
      })
    }

    const logicalMaxFee =
      params.maxFee !== undefined && params.maxFee.microAlgo > (params.staticFee?.microAlgo ?? 0n) ? params.maxFee : params.staticFee

    return { txn, context: { maxFee: logicalMaxFee } }
  }

  /**
   * Builds an ABI method call transaction and any other associated transactions represented in the ABI args.
   * @param includeSigner Whether to include the actual signer for the transactions.
   *  If you are just building transactions without signers yet then set this to `false`.
   */
  private async buildMethodCall(
    params: AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall,
    header: TransactionHeader,
    includeSigner: boolean,
  ): Promise<TransactionWithSignerAndContext[]> {
    const methodArgs: (algosdk.ABIArgument | TransactionWithSignerAndContext)[] = []
    const transactionsForGroup: TransactionWithSignerAndContext[] = []

    const isAbiValue = (x: unknown): x is algosdk.ABIValue => {
      if (Array.isArray(x)) return x.length == 0 || x.every(isAbiValue)

      return (
        typeof x === 'bigint' ||
        typeof x === 'boolean' ||
        typeof x === 'number' ||
        typeof x === 'string' ||
        x instanceof Uint8Array ||
        x instanceof algosdk.Address
      )
    }

    for (let i = (params.args ?? []).length - 1; i >= 0; i--) {
      const arg = params.args![i]
      if (arg === undefined) {
        // An undefined transaction argument signals that the value will be supplied by a method call argument
        if (algosdk.abiTypeIsTransaction(params.method.args[i].type) && transactionsForGroup.length > 0) {
          // Move the last transaction from the group to the method call arguments to appease algosdk
          const placeholderTransaction = transactionsForGroup.splice(-1, 1)[0]
          methodArgs.push(placeholderTransaction)
          continue
        }

        throw Error(`No value provided for argument ${i + 1} within call to ${params.method.name}`)
      }

      if (isAbiValue(arg)) {
        methodArgs.push(arg)
        continue
      }

      if (isTransactionWithSigner(arg)) {
        methodArgs.push(arg)
        continue
      }

      if ('method' in arg) {
        const tempTxnWithSigners = await this.buildMethodCall(arg, suggestedParams, includeSigner)
        // If there is any transaction args, add to the atc
        // Everything else should be added as method args

        methodArgs.push(...tempTxnWithSigners.slice(-1)) // Add the method call itself as a method arg
        transactionsForGroup.push(...tempTxnWithSigners.slice(0, -1).reverse()) // Add any transaction arguments to the atc
        continue
      }

      const txn = await arg
      methodArgs.push({
        txn,
        signer: includeSigner
          ? params.signer
            ? 'signer' in params.signer
              ? params.signer.signer
              : params.signer
            : this.getSigner(txn.sender)
          : TransactionComposer.NULL_SIGNER,
      })
    }

    const methodAtc = new algosdk.AtomicTransactionComposer()
    const maxFees = new Map<number, AlgoAmount>()

    transactionsForGroup.reverse().forEach(({ context, ...txnWithSigner }) => {
      methodAtc.addTransaction(txnWithSigner)
      const atcIndex = methodAtc.count() - 1
      if (context.abiMethod) {
        methodAtc['methodCalls'].set(atcIndex, context.abiMethod)
      }
      if (context.maxFee !== undefined) {
        maxFees.set(atcIndex, context.maxFee)
      }
    })

    // If any of the args are method call transactions, add that info to the methodAtc
    methodArgs
      .filter((arg) => {
        if (typeof arg === 'object' && 'context' in arg) {
          const { context, ...txnWithSigner } = arg
          return isTransactionWithSigner(txnWithSigner)
        }
        return isTransactionWithSigner(arg)
      })
      .reverse()
      .forEach((arg, idx) => {
        if (typeof arg === 'object' && 'context' in arg && arg.context) {
          const atcIndex = methodAtc.count() + idx
          if (arg.context.abiMethod) {
            methodAtc['methodCalls'].set(atcIndex, arg.context.abiMethod)
          }
          if (arg.context.maxFee !== undefined) {
            maxFees.set(atcIndex, arg.context.maxFee)
          }
        }
      })

    const appId = Number('appId' in params ? params.appId : 0n)
    const approvalProgram =
      'approvalProgram' in params
        ? typeof params.approvalProgram === 'string'
          ? (await this.appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
          : params.approvalProgram
        : undefined
    const clearStateProgram =
      'clearStateProgram' in params
        ? typeof params.clearStateProgram === 'string'
          ? (await this.appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
          : params.clearStateProgram
        : undefined

    // If accessReferences is provided, we should not pass legacy foreign arrays
    const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

    const txnParams = {
      appID: appId,
      sender: params.sender,
      suggestedParams,
      onComplete: params.onComplete ?? algosdk.OnApplicationComplete.NoOpOC,
      ...(hasAccessReferences
        ? { access: params.accessReferences?.map(getAccessReference) }
        : {
            appAccounts: params.accountReferences,
            appForeignApps: params.appReferences?.map((x) => Number(x)),
            appForeignAssets: params.assetReferences?.map((x) => Number(x)),
            boxes: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      approvalProgram,
      clearProgram: clearStateProgram,
      extraPages:
        appId === 0
          ? 'extraProgramPages' in params && params.extraProgramPages !== undefined
            ? params.extraProgramPages
            : approvalProgram
              ? calculateExtraProgramPages(approvalProgram, clearStateProgram)
              : 0
          : undefined,
      numLocalInts: appId === 0 ? ('schema' in params ? (params.schema?.localInts ?? 0) : 0) : undefined,
      numLocalByteSlices: appId === 0 ? ('schema' in params ? (params.schema?.localByteSlices ?? 0) : 0) : undefined,
      numGlobalInts: appId === 0 ? ('schema' in params ? (params.schema?.globalInts ?? 0) : 0) : undefined,
      numGlobalByteSlices: appId === 0 ? ('schema' in params ? (params.schema?.globalByteSlices ?? 0) : 0) : undefined,
      method: params.method,
      signer: includeSigner
        ? params.signer
          ? 'signer' in params.signer
            ? params.signer.signer
            : params.signer
          : this.getSigner(params.sender)
        : TransactionComposer.NULL_SIGNER,
      methodArgs: methodArgs
        .map((arg) => {
          if (typeof arg === 'object' && 'context' in arg) {
            const { context, ...txnWithSigner } = arg
            return txnWithSigner
          }
          return arg
        })
        .reverse(),
      // note, lease, and rekeyTo are set in the common build step
      note: undefined,
      lease: undefined,
      rekeyTo: undefined,
    }

    // Build the transaction
    const result = this.commonTxnBuildStep(
      (txnParams) => {
        methodAtc.addMethodCall(txnParams)
        return methodAtc.buildGroup()[methodAtc.count() - 1].txn
      },
      params,
      txnParams,
    )

    // Process the ATC to get a set of transactions ready for broader grouping
    return this.buildAtc(methodAtc).map(({ context: _context, ...txnWithSigner }, idx) => {
      const maxFee = idx === methodAtc.count() - 1 ? result.context.maxFee : maxFees.get(idx)
      // TODO: PD - review this way of assigning fee
      const fee = idx === methodAtc.count() - 1 ? result.txn.fee : txnWithSigner.txn.fee
      const context = {
        ..._context, // Adds method context info
        maxFee,
      }

      return {
        signer: txnWithSigner.signer,
        txn: {
          ...txnWithSigner.txn,
          fee: fee,
        },
        context,
      }
    })
  }

  private buildPayment(params: PaymentParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.Payment,
      payment: {
        receiver: addressToString(params.receiver),
        amount: params.amount.microAlgo,
        closeRemainderTo: optionalAddressToString(params.closeRemainderTo),
      },
    } satisfies Transaction
  }

  private buildAssetCreate(params: AssetCreateParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.AssetConfig,
      assetConfig: {
        assetId: 0n,
        total: params.total,
        decimals: params.decimals ?? 0,
        defaultFrozen: params.defaultFrozen ?? false,
        assetName: params.assetName,
        unitName: params.unitName,
        url: params.url,
        metadataHash: typeof params.metadataHash === 'string' ? Buffer.from(params.metadataHash, 'utf-8') : params.metadataHash,
        manager: optionalAddressToString(params.manager),
        reserve: optionalAddressToString(params.reserve),
        freeze: optionalAddressToString(params.freeze),
        clawback: optionalAddressToString(params.clawback),
      },
    } satisfies Transaction
  }

  private buildAssetConfig(params: AssetConfigParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.AssetConfig,
      assetConfig: {
        assetId: params.assetId,
        manager: optionalAddressToString(params.manager),
        reserve: optionalAddressToString(params.reserve),
        freeze: optionalAddressToString(params.freeze),
        clawback: optionalAddressToString(params.clawback),
      },
    } satisfies Transaction
  }

  private buildAssetDestroy(params: AssetDestroyParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.AssetConfig,
      assetConfig: {
        assetId: params.assetId,
      },
    } satisfies Transaction
  }

  private buildAssetFreeze(params: AssetFreezeParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.AssetFreeze,
      assetFreeze: {
        assetId: params.assetId,
        freezeTarget: addressToString(params.account),
        frozen: params.frozen,
      },
    } satisfies Transaction
  }

  private buildAssetTransfer(params: AssetTransferParams, header: TransactionHeader) {
    return {
      ...header,
      transactionType: TransactionType.AssetTransfer,
      assetTransfer: {
        assetId: params.assetId,
        amount: params.amount,
        receiver: addressToString(params.receiver),
        assetSender: optionalAddressToString(params.clawbackTarget),
        closeRemainderTo: optionalAddressToString(params.closeAssetTo),
      },
    } satisfies Transaction
  }

  private async buildAppCall(params: AppCallParams | AppUpdateParams | AppCreateParams, header: TransactionHeader) {
    const appId = 'appId' in params ? params.appId : 0n
    const approvalProgram =
      'approvalProgram' in params
        ? typeof params.approvalProgram === 'string'
          ? (await this.appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
          : params.approvalProgram
        : undefined
    const clearStateProgram =
      'clearStateProgram' in params
        ? typeof params.clearStateProgram === 'string'
          ? (await this.appManager.compileTeal(params.clearStateProgram)).compiledBase64ToBytes
          : params.clearStateProgram
        : undefined

    if (appId === 0n) {
      if (approvalProgram === undefined || clearStateProgram === undefined) {
        throw new Error('approvalProgram and clearStateProgram are required for application creation')
      }
    }

    // If accessReferences is provided, we should not pass legacy foreign arrays
    const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

    const extraProgramPages =
      appId === 0n && 'extraProgramPages' in params && params.extraProgramPages !== undefined
        ? params.extraProgramPages
        : appId === 0n
          ? calculateExtraProgramPages(approvalProgram!, clearStateProgram!)
          : undefined

    return {
      ...header,
      transactionType: TransactionType.AppCall,
      appCall: {
        appId,
        onComplete: (params.onComplete ?? algosdk.OnApplicationComplete.NoOpOC) as unknown as OnApplicationComplete,
        approvalProgram,
        clearStateProgram,
        globalStateSchema:
          appId === 0n && 'schema' in params
            ? {
                numUints: params.schema?.globalInts ?? 0,
                numByteSlices: params.schema?.globalByteSlices ?? 0,
              }
            : undefined,
        localStateSchema:
          appId === 0n && 'schema' in params
            ? {
                numUints: params.schema?.localInts ?? 0,
                numByteSlices: params.schema?.localByteSlices ?? 0,
              }
            : undefined,
        extraProgramPages,
        args: params.args,
        ...(hasAccessReferences
          ? { access: params.accessReferences?.map(getAccessReference) }
          : {
              accountReferences: params.accountReferences?.map((a) => addressToString(a)),
              appReferences: params.appReferences,
              assetReferences: params.assetReferences,
              boxReferences: params.boxReferences?.map((box) => AppManager.getBoxReference(box)),
            }),
      },
    } satisfies Transaction
  }

  private buildKeyReg(params: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams, header: TransactionHeader) {
    if ('voteKey' in params) {
      return {
        ...header,
        transactionType: TransactionType.KeyRegistration,
        keyRegistration: {
          voteKey: params.voteKey,
          selectionKey: params.selectionKey,
          voteFirst: params.voteFirst,
          voteLast: params.voteLast,
          voteKeyDilution: params.voteKeyDilution,
          stateProofKey: params.stateProofKey,
          nonParticipation: false,
        },
      } satisfies Transaction
    }

    return {
      ...header,
      transactionType: TransactionType.KeyRegistration,
      keyRegistration: {
        nonParticipation: params.preventAccountFromEverParticipatingAgain,
      },
    } satisfies Transaction
  }

  /** Builds all transaction types apart from `txnWithSigner`, `atc` and `methodCall` since those ones can have custom signers that need to be retrieved. */
  private async buildTxn(txn: Txn, suggestedParams: SdkTransactionParams): Promise<TransactionWithContext[]> {
    const commonParams = getCommonParams(txn)
    const header = buildTransactionHeader(commonParams, suggestedParams, this.defaultValidityWindow)

    let transaction: Transaction
    switch (txn.type) {
      case 'pay':
        transaction = this.buildPayment(txn, header)
        break
      case 'assetCreate':
        transaction = this.buildAssetCreate(txn, header)
        break
      case 'appCall':
        transaction = await this.buildAppCall(txn, header)
        break
      case 'assetConfig':
        transaction = this.buildAssetConfig(txn, header)
        break
      case 'assetDestroy':
        transaction = this.buildAssetDestroy(txn, header)
        break
      case 'assetFreeze':
        transaction = this.buildAssetFreeze(txn, header)
        break
      case 'assetTransfer':
        transaction = this.buildAssetTransfer(txn, header)
        break
      case 'assetOptIn':
        transaction = this.buildAssetTransfer({ ...txn, receiver: txn.sender, amount: 0n }, header)
        break
      case 'assetOptOut':
        transaction = this.buildAssetTransfer({ ...txn, receiver: txn.sender, amount: 0n, closeAssetTo: txn.creator }, header)
        break
      case 'keyReg':
        transaction = this.buildKeyReg(txn, header)
        break
      default:
        throw Error(`Unsupported txn type`)
    }

    return [{ txn: transaction, context: {} }]
  }

  // TODO: PD - review if we still need this
  // private async buildTxnWithSigner(txn: Txn, suggestedParams: SdkTransactionParams): Promise<TransactionWithSignerAndContext[]> {
  //   if (txn.type === 'txnWithSigner') {
  //     return [
  //       {
  //         ...txn,
  //         context: {},
  //       },
  //     ]
  //   }

  //   if (txn.type === 'methodCall') {
  //     return await this.buildMethodCall(txn, suggestedParams, true)
  //   }

  //   const signer = txn.signer ? ('signer' in txn.signer ? txn.signer.signer : txn.signer) : this.getSigner(txn.sender)

  //   return (await this.buildTxn(txn, suggestedParams)).map(({ txn, context }) => ({ txn, signer, context }))
  // }

  /**
   * Get the number of transactions currently added to this composer.
   * @returns The number of transactions currently added to this composer
   */
  async count() {
    return this.transactions.length
  }

  /**
   * Compose all of the transactions in a single atomic transaction group and an atomic transaction composer.
   *
   * You can then use the transactions standalone, or use the composer to execute or simulate the transactions.
   *
   * Once this method is called, no further transactions will be able to be added.
   * You can safely call this method multiple times to get the same result.
   * @returns The built atomic transaction composer, the transactions and any corresponding method calls
   * @example
   * ```typescript
   * const { atc, transactions, methodCalls } = await composer.build()
   * ```
   */
  async build() {
    const { transactions, methodCalls } = await this._buildNew()
    return { transactions, methodCalls }
  }

  /**
   * Rebuild the group, discarding any previously built transactions.
   * This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.
   * @returns The newly built transactions and method calls
   * @example
   * ```typescript
   * const { transactions, methodCalls } = await composer.rebuild()
   * ```
   */
  async rebuild() {
    // Clear implementation caches
    this.builtGroup = undefined
    this.signedGroup = undefined
    this.builtMethodCalls = undefined
    return await this.build()
  }

  /**
   * Compose the atomic transaction group and send it to the network.
   * @param params The parameters to control execution with
   * @returns The execution result
   * @example
   * ```typescript
   * const result = await composer.send()
   * ```
   */
  async send(params?: SendParams): Promise<SendAtomicTransactionComposerResults> {
    try {
      return await this._sendNew(params)
    } catch (originalError: unknown) {
      throw await this.transformError(originalError)
    }
  }

  /**
   * @deprecated Use `send` instead.
   *
   * Compose the atomic transaction group and send it to the network
   *
   * An alias for `composer.send(params)`.
   * @param params The parameters to control execution with
   * @returns The execution result
   */
  async execute(params?: SendParams): Promise<SendAtomicTransactionComposerResults> {
    return this.send(params)
  }

  /**
   * Compose the atomic transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate()
   * ```
   */
  async simulate(): Promise<SendAtomicTransactionComposerResults & { simulateResponse: SimulateTransaction }>
  /**
   * Compose the atomic transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate({
   *   skipSignatures: true,
   * })
   * ```
   */
  async simulate(
    options: SkipSignaturesSimulateOptions,
  ): Promise<SendAtomicTransactionComposerResults & { simulateResponse: SimulateTransaction }>
  /**
   * Compose the atomic transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate({
   *   extraOpcodeBudget: 1000,
   * })
   * ```
   */
  async simulate(options: RawSimulateOptions): Promise<SendAtomicTransactionComposerResults & { simulateResponse: SimulateTransaction }>
  async simulate(options?: SimulateOptions): Promise<SendAtomicTransactionComposerResults & { simulateResponse: SimulateTransaction }> {
    try {
      const result = await this._simulateNew(options)

      // Check for failures
      const failedGroup = result.simulateResponse?.txnGroups[0]
      if (failedGroup?.failureMessage) {
        const errorMessage = `Transaction failed at transaction(s) ${failedGroup.failedAt?.join(', ') || 'unknown'} in the group. ${failedGroup.failureMessage}`
        const error = new Error(errorMessage)

        if (Config.debug) {
          await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateResponse: result.simulateResponse })
        }

        throw await this.transformError(error)
      }

      if (Config.debug && Config.traceAll) {
        await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateResponse: result.simulateResponse })
      }

      return result
    } catch (originalError: unknown) {
      throw await this.transformError(originalError)
    }
  }

  /**
   * Create an encoded transaction note that follows the ARC-2 spec.
   *
   * https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
   * @param note The ARC-2 transaction note data
   * @returns The binary encoded transaction note
   */
  static arc2Note(note: Arc2TransactionNote): Uint8Array {
    const arc2Payload = `${note.dAppName}:${note.format}${typeof note.data === 'string' ? note.data : asJson(note.data)}`
    const encoder = new TextEncoder()
    return encoder.encode(arc2Payload)
  }
}

// ====================================
// Helper Functions (Ported from Future Composer)
// ====================================

/**
 * Helper function to check if a transaction is an app call
 */
function _isAppCall(txn: ComposerTransaction): boolean {
  return (
    txn.type === 'appCall' ||
    txn.type === 'methodCall' ||
    (txn.type === 'txnWithSigner' && txn.txn.transactionType === TransactionType.AppCall)
  )
}

/**
 * Extract common transaction parameters from a composer transaction
 */
function _getCommonParams(ctxn: ComposerTransaction): CommonTransactionParams {
  if (ctxn.type === 'txnWithSigner') {
    return {
      sender: ctxn.txn.sender,
      rekeyTo: ctxn.txn.rekeyTo,
      note: ctxn.txn.note,
      lease: ctxn.txn.lease,
      staticFee: ctxn.txn.fee ? AlgoAmount.MicroAlgo(Number(ctxn.txn.fee)) : undefined,
      firstValidRound: ctxn.txn.firstValid,
      lastValidRound: ctxn.txn.lastValid,
      signer: ctxn.signer,
    }
  }

  // For all other types, they have CommonTransactionParams
  return ctxn as unknown as CommonTransactionParams
}

/**
 * Get the logical maximum fee based on staticFee and maxFee
 */
function _getLogicalMaxFee(ctxn: ComposerTransaction): bigint | undefined {
  const commonParams = _getCommonParams(ctxn)
  const maxFee = commonParams.maxFee?.microAlgo
  const staticFee = commonParams.staticFee?.microAlgo

  if (maxFee !== undefined && (staticFee === undefined || maxFee > staticFee)) {
    return maxFee
  }
  return staticFee
}

/**
 * Add a value to an application call's foreign array. The addition will be as compact as possible,
 * and this function will return an index that can be used to reference `valueToAdd` in `array`.
 *
 * Ported from SDK composer
 *
 * @param valueToAdd - The value to add to the array. If this value is already present in the array,
 *   it will not be added again. Instead, the existing index will be returned.
 * @param array - The existing foreign array. This input may be modified to append `valueToAdd`.
 * @param zeroValue - If provided, this value indicated two things: the 0 value is special for this
 *   array, so all indexes into `array` must start at 1; additionally, if `valueToAdd` equals
 *   `zeroValue`, then `valueToAdd` will not be added to the array, and instead the 0 indexes will
 *   be returned.
 * @returns An index that can be used to reference `valueToAdd` in `array`.
 */
function _populateForeignArray<Type>(valueToAdd: Type, array: Type[], zeroValue?: Type): number {
  if (zeroValue != null && valueToAdd === zeroValue) {
    return 0
  }

  const offset = zeroValue == null ? 0 : 1

  for (let i = 0; i < array.length; i++) {
    if (valueToAdd === array[i]) {
      return i + offset
    }
  }

  array.push(valueToAdd)
  return array.length - 1 + offset
}

/**
 * Get the default validity window based on the genesis ID
 */
function _getDefaultValidityWindow(genesisId: string): number {
  const isLocalNet = genesisIdIsLocalNet(genesisId)
  if (isLocalNet) {
    return 1000 // LocalNet gets bigger window to avoid dead transactions
  } else {
    return 10 // Standard default validity window
  }
}

/**
 * Populate transaction-level resources for app call transactions.
 * Mutates the transaction in place to add missing resource references.
 *
 * @param transaction - The transaction to populate (will be mutated)
 * @param resourcesAccessed - Resources discovered via simulation
 * @param groupIndex - Index of transaction in the group (for error messages)
 */
function _populateTransactionResources(
  transaction: Transaction,
  resourcesAccessed: SimulateUnnamedResourcesAccessed,
  groupIndex: number,
): void {
  if (transaction.transactionType !== TransactionType.AppCall || transaction.appCall === undefined) {
    return
  }

  // Check for unexpected resources at transaction level
  if (resourcesAccessed.boxes || resourcesAccessed.extraBoxRefs) {
    throw new Error('Unexpected boxes at the transaction level')
  }
  if (resourcesAccessed.appLocals) {
    throw new Error('Unexpected app locals at the transaction level')
  }
  if (resourcesAccessed.assetHoldings) {
    throw new Error('Unexpected asset holdings at the transaction level')
  }

  const MAX_ACCOUNT_REFERENCES = 4
  const MAX_OVERALL_REFERENCES = 8

  let accountsCount = 0
  let appsCount = 0
  let assetsCount = 0
  const boxesCount = transaction.appCall.boxReferences?.length ?? 0

  // Populate accounts
  if (resourcesAccessed.accounts) {
    transaction.appCall.accountReferences = transaction.appCall.accountReferences ?? []
    for (const account of resourcesAccessed.accounts) {
      if (!transaction.appCall.accountReferences.includes(account)) {
        transaction.appCall.accountReferences.push(account)
      }
    }
    accountsCount = transaction.appCall.accountReferences.length
  }

  // Populate apps
  if (resourcesAccessed.apps) {
    transaction.appCall.appReferences = transaction.appCall.appReferences ?? []
    for (const appId of resourcesAccessed.apps) {
      if (!transaction.appCall.appReferences.includes(appId)) {
        transaction.appCall.appReferences.push(appId)
      }
    }
    appsCount = transaction.appCall.appReferences.length
  }

  // Populate assets
  if (resourcesAccessed.assets) {
    transaction.appCall.assetReferences = transaction.appCall.assetReferences ?? []
    for (const assetId of resourcesAccessed.assets) {
      if (!transaction.appCall.assetReferences.includes(assetId)) {
        transaction.appCall.assetReferences.push(assetId)
      }
    }
    assetsCount = transaction.appCall.assetReferences.length
  }

  // Validate reference limits
  if (accountsCount > MAX_ACCOUNT_REFERENCES) {
    throw new Error(`Account reference limit of ${MAX_ACCOUNT_REFERENCES} exceeded in transaction ${groupIndex}`)
  }

  if (accountsCount + assetsCount + appsCount + boxesCount > MAX_OVERALL_REFERENCES) {
    throw new Error(`Resource reference limit of ${MAX_OVERALL_REFERENCES} exceeded in transaction ${groupIndex}`)
  }
}

/**
 * Populate group-level resources across multiple app call transactions.
 * Mutates transactions in place to distribute resource references optimally.
 *
 * @param transactions - Array of transactions to populate (will be mutated)
 * @param groupResources - Group-level resources discovered via simulation
 */
function _populateGroupResources(transactions: Transaction[], groupResources: SimulateUnnamedResourcesAccessed): void {
  // For now, implement a simplified version that adds resources to the first app call transaction
  // A full implementation would distribute resources optimally across transactions

  // Find the first app call transaction
  const firstAppCallIndex = transactions.findIndex((txn) => txn.transactionType === TransactionType.AppCall)

  if (firstAppCallIndex === -1) {
    // No app call transactions, nothing to populate
    return
  }

  const firstAppCall = transactions[firstAppCallIndex]
  if (!firstAppCall.appCall) {
    return
  }

  // Populate accounts
  if (groupResources.accounts) {
    firstAppCall.appCall.accountReferences = firstAppCall.appCall.accountReferences ?? []
    for (const account of groupResources.accounts) {
      if (!firstAppCall.appCall.accountReferences.includes(account)) {
        firstAppCall.appCall.accountReferences.push(account)
      }
    }
  }

  // Populate apps
  if (groupResources.apps) {
    firstAppCall.appCall.appReferences = firstAppCall.appCall.appReferences ?? []
    for (const appId of groupResources.apps) {
      if (!firstAppCall.appCall.appReferences.includes(appId)) {
        firstAppCall.appCall.appReferences.push(appId)
      }
    }
  }

  // Populate assets
  if (groupResources.assets) {
    firstAppCall.appCall.assetReferences = firstAppCall.appCall.assetReferences ?? []
    for (const assetId of groupResources.assets) {
      if (!firstAppCall.appCall.assetReferences.includes(assetId)) {
        firstAppCall.appCall.assetReferences.push(assetId)
      }
    }
  }

  // Populate boxes
  if (groupResources.boxes) {
    firstAppCall.appCall.boxReferences = firstAppCall.appCall.boxReferences ?? []
    for (const boxRef of groupResources.boxes) {
      // Check if this box reference already exists
      const exists = firstAppCall.appCall.boxReferences.some(
        (existing) => existing.appId === boxRef.app && existing.name.toString() === boxRef.name.toString(),
      )
      if (!exists) {
        firstAppCall.appCall.boxReferences.push({
          appId: boxRef.app,
          name: boxRef.name,
        })
      }
    }
  }

  // TODO: Handle appLocals, assetHoldings, and extraBoxRefs for a more complete implementation
}

// ABI return values are stored in logs with the prefix 0x151f7c75
const ABI_RETURN_PREFIX = new Uint8Array([0x15, 0x1f, 0x7c, 0x75])

/**
 * Check if a log entry has the ABI return prefix
 */
function _hasAbiReturnPrefix(log: Uint8Array): boolean {
  if (log.length < ABI_RETURN_PREFIX.length) {
    return false
  }
  for (let i = 0; i < ABI_RETURN_PREFIX.length; i++) {
    if (log[i] !== ABI_RETURN_PREFIX[i]) {
      return false
    }
  }
  return true
}

/**
 * Extract ABI return value from transaction logs
 * @param confirmation - Transaction confirmation response
 * @param method - ABI method definition
 * @returns Parsed ABI return value
 */
function _extractAbiReturnFromLogs(confirmation: PendingTransactionResponse, method: ABIMethod): ABIReturn {
  // Check if method has return type
  const returnType = method.returns.type
  if (returnType === 'void' || returnType.toString() === 'void') {
    return {
      method,
      rawReturnValue: new Uint8Array(0),
      returnValue: new Uint8Array(0), // Empty Uint8Array for void returns
      decodeError: undefined,
    }
  }

  // Non-void method - must examine the last log
  const logs = confirmation.logs
  if (!logs || logs.length === 0) {
    return {
      decodeError: new Error(`No logs found for method ${method.name} which requires a return type`),
    }
  }

  const lastLog = logs[logs.length - 1]

  // Check if the last log entry has the ABI return prefix
  if (!_hasAbiReturnPrefix(lastLog)) {
    return {
      decodeError: new Error(`Transaction log for method ${method.name} doesn't match with ABI return value format`),
    }
  }

  // Extract the return value bytes (skip the prefix)
  const returnBytes = lastLog.slice(ABI_RETURN_PREFIX.length)

  try {
    // Decode the return value using the method's return type
    // returnType is an ABIType which has a decode method
    const returnValue = typeof returnType !== 'string' ? returnType.decode(returnBytes) : new Uint8Array(0)
    return {
      method,
      rawReturnValue: returnBytes,
      returnValue,
      decodeError: undefined,
    }
  } catch (e) {
    return {
      decodeError: new Error(`Failed to decode ABI return value for method ${method.name}: ${e}`),
    }
  }
}

function buildTransactionHeader(
  commonParams: CommonTransactionParams,
  suggestedParams: TransactionParams,
  defaultValidityWindow: bigint,
): TransactionHeader {
  const firstValid = commonParams.firstValidRound ?? suggestedParams.lastRound
  const note =
    commonParams.note !== undefined
      ? typeof commonParams.note === 'string'
        ? new TextEncoder().encode(commonParams.note)
        : commonParams.note
      : undefined

  return {
    sender: addressToString(commonParams.sender),
    rekeyTo: optionalAddressToString(commonParams.rekeyTo),
    note: note,
    lease: encodeLease(commonParams.lease),
    fee: commonParams.staticFee?.microAlgos,
    genesisId: suggestedParams.genesisId,
    genesisHash: suggestedParams.genesisHash,
    firstValid,
    lastValid:
      commonParams.lastValidRound ??
      (commonParams.validityWindow !== undefined
        ? firstValid + BigInt(commonParams.validityWindow)
        : firstValid + BigInt(defaultValidityWindow)),
    group: undefined,
  }
}

function getCommonParams(ctxn: ComposerTransaction): CommonTransactionParams {
  switch (ctxn.type) {
    // TODO: PD - where is just transaction
    case 'txnWithSigner':
      return {
        sender: ctxn.txn.sender,
        signer: ctxn.signer,
        rekeyTo: ctxn.txn.rekeyTo,
        note: ctxn.txn.note,
        lease: ctxn.txn.lease,
        staticFee: ctxn.txn.fee ? new AlgoAmount({ microAlgos: ctxn.txn.fee }) : undefined,
        firstValidRound: ctxn.txn.firstValid,
        lastValidRound: ctxn.txn.lastValid,
      }
    default:
      return {
        sender: ctxn.sender,
        signer: ctxn.signer,
        rekeyTo: ctxn.rekeyTo,
        note: ctxn.note,
        lease: ctxn.lease,
        staticFee: ctxn.staticFee,
        extraFee: ctxn.extraFee,
        maxFee: ctxn.maxFee,
        validityWindow: ctxn.validityWindow,
        firstValidRound: ctxn.firstValidRound,
        lastValidRound: ctxn.lastValidRound,
      }
  }
}

type AppMethodCallArgs = AppMethodCall<unknown>['args']

/**
 * Populate reference arrays from processed ABI method call arguments
 */
function populateMethodArgsIntoReferenceArrays(
  sender: string,
  appId: bigint,
  method: ABIMethod,
  methodArgs: AppMethodCallArgs,
  accountReferences?: string[],
  appReferences?: bigint[],
  assetReferences?: bigint[],
): { accountReferences: string[]; appReferences: bigint[]; assetReferences: bigint[] } {
  const accounts = accountReferences ?? []
  const assets = assetReferences ?? []
  const apps = appReferences ?? []

  methodArgs?.forEach((arg, i) => {
    const argType = method.args[i].type
    if (abiTypeIsReference(argType)) {
      switch (argType) {
        case 'account':
          if (typeof arg === 'string' && arg !== sender && !accounts.includes(arg)) {
            accounts.push(arg)
          }
          break
        case 'asset':
          if (typeof arg === 'bigint' && !assets.includes(arg)) {
            assets.push(arg)
          }
          break
        case 'application':
          if (typeof arg === 'bigint' && arg !== appId && !apps.includes(arg)) {
            apps.push(arg)
          }
          break
      }
    }
  })

  return { accountReferences: accounts, appReferences: apps, assetReferences: assets }
}

const ARGS_TUPLE_PACKING_THRESHOLD = 14 // 14+ args trigger tuple packing, excluding the method selector

/**
 * Encode ABI method arguments with tuple packing support
 */
function encodeMethodArguments(
  method: ABIMethod,
  args: AppMethodCallArgs[],
  sender: string,
  appId: bigint,
  accountReferences: string[],
  appReferences: bigint[],
  assetReferences: bigint[],
): Uint8Array[] {
  const encodedArgs = new Array<Uint8Array>()

  // Insert method selector at the front
  encodedArgs.push(method.getSelector())

  // Get ABI types for non-transaction arguments
  const abiTypes = new Array<ABIType>()
  const abiValues = new Array<ABIValue>()

  // Process each method argument
  for (let i = 0; i < method.args.length; i++) {
    const methodArg = method.args[i]
    const argValue = args[i]

    if (abiTypeIsTransaction(methodArg.type)) {
      // Transaction arguments are not ABI encoded - they're handled separately
      continue
    }

    if (abiTypeIsReference(methodArg.type)) {
      // Reference types are encoded as uint8 indexes
      const referenceType = methodArg.type
      if (typeof argValue === 'string' || typeof argValue === 'bigint') {
        const foreignIndex = calculateMethodArgReferenceArrayIndex(
          argValue,
          referenceType,
          sender,
          appId,
          accountReferences,
          appReferences,
          assetReferences,
        )

        abiTypes.push(new algosdk.ABIUintType(8))
        abiValues.push(foreignIndex)
      } else {
        throw new Error(`Invalid reference value for ${referenceType}: ${argValue}`)
      }
    } else if (argValue !== undefined) {
      // Regular ABI value
      abiTypes.push(methodArg.type)
      abiValues.push(argValue)
    }
    // Skip undefined values (transaction placeholders or arc56 default values)
  }

  if (abiValues.length !== abiTypes.length) {
    throw new Error('Mismatch in length of non-transaction arguments')
  }

  // Apply ARC-4 tuple packing for methods with more than 14 arguments
  // 14 instead of 15 in the ARC-4 because the first argument (method selector) is added separately
  if (abiTypes.length > ARGS_TUPLE_PACKING_THRESHOLD) {
    encodedArgs.push(...encodeArgsWithTuplePacking(abiTypes, abiValues))
  } else {
    encodedArgs.push(...encodeArgsIndividually(abiTypes, abiValues))
  }

  return encodedArgs
}

/**
 * Calculate array index for ABI reference values
 */
function calculateMethodArgReferenceArrayIndex(
  refValue: string | bigint,
  referenceType: 'account' | 'asset' | 'application',
  sender: string,
  appId: bigint,
  accountReferences: string[],
  appReferences: bigint[],
  assetReferences: bigint[],
): number {
  switch (referenceType) {
    case 'account':
      if (typeof refValue === 'string') {
        // If address is the same as sender, use index 0
        if (refValue === sender) return 0
        const index = accountReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Account ${refValue} not found in reference array`)
        return index + 1
      }
      throw new Error('Account reference must be a string')
    case 'asset':
      if (typeof refValue === 'bigint') {
        const index = assetReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Asset ${refValue} not found in reference array`)
        return index
      }
      throw new Error('Asset reference must be a bigint')
    case 'application':
      if (typeof refValue === 'bigint') {
        // If app ID is the same as the current app, use index 0
        if (refValue === appId) return 0
        const index = appReferences.indexOf(refValue)
        if (index === -1) throw new Error(`Application ${refValue} not found in reference array`)
        return index + 1
      }
      throw new Error('Application reference must be a bigint')
    default:
      throw new Error(`Unknown reference type: ${referenceType}`)
  }
}

/**
 * Encode individual ABI values
 */
function encodeArgsIndividually(abiTypes: ABIType[], abiValues: ABIValue[]): Uint8Array[] {
  const encodedArgs: Uint8Array[] = []

  for (let i = 0; i < abiTypes.length; i++) {
    const abiType = abiTypes[i]
    const abiValue = abiValues[i]
    const encoded = abiType.encode(abiValue)
    encodedArgs.push(encoded)
  }

  return encodedArgs
}

/**
 * Encode ABI values with tuple packing for methods with many arguments
 */
function encodeArgsWithTuplePacking(abiTypes: ABIType[], abiValues: ABIValue[]): Uint8Array[] {
  const encodedArgs: Uint8Array[] = []

  // Encode first 14 arguments individually
  const first14AbiTypes = abiTypes.slice(0, ARGS_TUPLE_PACKING_THRESHOLD)
  const first14AbiValues = abiValues.slice(0, ARGS_TUPLE_PACKING_THRESHOLD)
  encodedArgs.push(...encodeArgsIndividually(first14AbiTypes, first14AbiValues))

  // Pack remaining arguments into tuple at position 15
  const remainingAbiTypes = abiTypes.slice(ARGS_TUPLE_PACKING_THRESHOLD)
  const remainingAbiValues = abiValues.slice(ARGS_TUPLE_PACKING_THRESHOLD)

  if (remainingAbiTypes.length > 0) {
    const tupleType = new algosdk.ABITupleType(remainingAbiTypes)
    const tupleValue = remainingAbiValues
    const tupleEncoded = tupleType.encode(tupleValue)
    encodedArgs.push(tupleEncoded)
  }

  return encodedArgs
}

type TransactionHeader = {
  sender: string
  fee?: bigint
  firstValid: bigint
  lastValid: bigint
  genesisHash?: Uint8Array
  genesisId?: string
  note?: Uint8Array
  rekeyTo?: string
  lease?: Uint8Array
  group?: Uint8Array
}

// Helper function to convert Address to string
function addressToString(addr: string | Address): string {
  return typeof addr === 'string' ? addr : addr.toString()
}

function optionalAddressToString(addr: string | Address | undefined): string | undefined {
  if (addr === undefined) return undefined
  return typeof addr === 'string' ? addr : addr.toString()
}
