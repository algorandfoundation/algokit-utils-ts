import {
  AlgodClient,
  AlgorandSerializer,
  PendingTransactionResponse,
  SimulateRequest,
  SimulateTransaction,
  SimulateUnnamedResourcesAccessed,
  SimulationTransactionExecTraceMeta,
  SuggestedParams,
  toBase64,
} from '@algorandfoundation/algokit-algod-client'
import { EMPTY_SIGNATURE } from '@algorandfoundation/algokit-common'
import {
  AccessReference,
  OnApplicationComplete,
  SignedTransaction,
  Transaction,
  TransactionType,
  assignFee,
  calculateFee,
  decodeSignedTransaction,
  decodeTransaction,
  encodeSignedTransactions,
  encodeTransactionRaw,
  getTransactionId,
  groupTransactions,
} from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { ABIMethod, Address, TransactionSigner, TransactionWithSigner } from '@algorandfoundation/sdk'
import { Config } from '../config'
import { waitForConfirmation } from '../transaction'
import { asJson } from '../util'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ABIReturn } from './app'
import { AppManager, BoxIdentifier, BoxReference } from './app-manager'
import { deepCloneTransactionParams } from './composer-clone'
import {
  buildAppCall,
  buildAppCallMethodCall,
  buildAppCreate,
  buildAppCreateMethodCall,
  buildAppUpdate,
  buildAppUpdateMethodCall,
  buildAssetConfig,
  buildAssetCreate,
  buildAssetDestroy,
  buildAssetFreeze,
  buildAssetOptIn,
  buildAssetOptOut,
  buildAssetTransfer,
  buildKeyReg,
  buildPayment,
  buildTransactionHeader,
  calculateInnerFeeDelta,
  extractComposerTransactionsFromAppMethodCallParams,
  getDefaultValidityWindow,
  populateGroupResources,
  populateTransactionResources,
  processAppMethodCallArgs,
} from './composer-helper'
import { Expand } from './expand'
import { FeeDelta, FeePriority } from './fee-coverage'
import { EventType } from './lifecycle-events'
import {
  Arc2TransactionNote,
  SendAtomicTransactionComposerResults,
  SendParams,
  TransactionWrapper,
  wrapPendingTransactionResponse,
} from './transaction'

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
  onComplete?: OnApplicationComplete
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
  rejectVersion?: bigint
}

/** Parameters to define an app create transaction */
export type AppCreateParams = Expand<
  Omit<CommonAppCallParams, 'appId'> & {
    onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.ClearState>
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
    onComplete?: OnApplicationComplete.UpdateApplication
    /** The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    clearStateProgram: string | Uint8Array
  }
>

/** Parameters to define an application call transaction. */
export type AppCallParams = CommonAppCallParams & {
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplication>
}

/** Common parameters to define an ABI method call transaction. */
export type AppMethodCallParams = CommonAppCallParams & {
  onComplete?: Exclude<OnApplicationComplete, OnApplicationComplete.UpdateApplication | OnApplicationComplete.ClearState>
}

/** Parameters to define an application delete call transaction. */
export type AppDeleteParams = CommonAppCallParams & {
  onComplete?: OnApplicationComplete.DeleteApplication
}

/** Parameters to define an ABI method call create transaction. */
export type AppCreateMethodCall = Expand<AppMethodCall<AppCreateParams>>
/** Parameters to define an ABI method call update transaction. */
export type AppUpdateMethodCall = Expand<AppMethodCall<AppUpdateParams>>
/** Parameters to define an ABI method call delete transaction. */
export type AppDeleteMethodCall = Expand<AppMethodCall<AppDeleteParams>>
/** Parameters to define an ABI method call transaction. */
export type AppCallMethodCall = Expand<AppMethodCall<AppMethodCallParams>>

export type ProcessedAppCreateMethodCall = Expand<
  Omit<AppCreateMethodCall, 'args'> & {
    args?: (algosdk.ABIValue | undefined)[]
  }
>

export type ProcessedAppUpdateMethodCall = Expand<
  Omit<AppUpdateMethodCall, 'args'> & {
    args?: (algosdk.ABIValue | undefined)[]
  }
>

export type ProcessedAppCallMethodCall = Expand<
  Omit<AppCallMethodCall, 'args'> & {
    args?: (algosdk.ABIValue | undefined)[]
  }
>

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
    // The following should match the above `AppMethodCallTransactionArgument` type above
    | TransactionWithSigner
    | Transaction
    | Promise<Transaction>
    | AppMethodCall<AppCreateParams>
    | AppMethodCall<AppUpdateParams>
    | AppMethodCall<AppMethodCallParams>
    | undefined
  )[]
}

/** A transaction (promise) with an associated signer for signing the transaction */
export type AsyncTransactionWithSigner = {
  /** The transaction (promise) to be signed */
  txn: Promise<Transaction>
  /** The signer to use for signing the transaction */
  signer?: algosdk.TransactionSigner
}

type Txn =
  | { data: PaymentParams; type: 'pay' }
  | { data: AssetCreateParams; type: 'assetCreate' }
  | { data: AssetConfigParams; type: 'assetConfig' }
  | { data: AssetFreezeParams; type: 'assetFreeze' }
  | { data: AssetDestroyParams; type: 'assetDestroy' }
  | { data: AssetTransferParams; type: 'assetTransfer' }
  | { data: AssetOptInParams; type: 'assetOptIn' }
  | { data: AssetOptOutParams; type: 'assetOptOut' }
  | { data: AppCallParams | AppCreateParams | AppUpdateParams; type: 'appCall' }
  | { data: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams; type: 'keyReg' }
  | { data: algosdk.TransactionWithSigner; type: 'txnWithSigner' }
  | { data: AsyncTransactionWithSigner; type: 'asyncTxn' }
  | { data: ProcessedAppCallMethodCall | ProcessedAppCreateMethodCall | ProcessedAppUpdateMethodCall; type: 'methodCall' }

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

export type TransactionComposerConfig = {
  coverAppCallInnerTransactionFees: boolean
  populateAppCallResources: boolean
}

type TransactionAnalysis = {
  /** The fee difference required for this transaction */
  requiredFeeDelta?: FeeDelta
  /** Resources accessed by this transaction but not declared */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

export type GroupAnalysis = {
  /** Analysis of each transaction in the group */
  transactions: TransactionAnalysis[]
  /** Resources accessed by the group that qualify for group resource sharing */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

/** Parameters to create an `TransactionComposer`. */
export type TransactionComposerParams = {
  /** The algod client to use to get suggestedParams and send the transaction group */
  algod: AlgodClient
  /** The function used to get the TransactionSigner for a given address */
  getSigner: (address: string | Address) => algosdk.TransactionSigner
  /** The method used to get SuggestedParams for transactions in the group */
  getSuggestedParams?: () => Promise<SuggestedParams>
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
  composerConfig?: TransactionComposerConfig
}

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
  /** Transactions that have not yet been composed */
  private txns: Txn[] = []

  /** The algod client used by the composer. */
  private algod: AlgodClient

  /** An async function that will return suggested params for the transaction. */
  private getSuggestedParams: () => Promise<SuggestedParams>

  /** A function that takes in an address and return a signer function for that address. */
  private getSigner: (address: string | Address) => algosdk.TransactionSigner

  /** The default transaction validity window */
  private defaultValidityWindow = 10n

  private appManager: AppManager

  private errorTransformers: ErrorTransformer[]

  private composerConfig: TransactionComposerConfig

  private transactionsWithSigners?: TransactionWithSigner[]

  private signedTransactions?: SignedTransaction[]

  private async transformError(originalError: unknown): Promise<unknown> {
    // Transformers only work with Error instances, so immediately return anything else
    if (!(originalError instanceof Error)) {
      return originalError
    }

    let transformedError = originalError

    // If this is an ApiError with a body message, create a new error with that message
    // so that error transformers can work with the detailed error message
    // Preserve other properties like traces for debugging
    if (
      'body' in transformedError &&
      transformedError.body &&
      typeof transformedError.body === 'object' &&
      'message' in transformedError.body
    ) {
      const newError = new Error(transformedError.body.message as string)
      // Preserve important properties from the original error or body
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const traces = (transformedError as any).traces || (transformedError.body as any).traces
      if (traces) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(newError as any).traces = traces
      }
      transformedError = newError
    }

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
    const defaultGetSuggestedParams = () => params.algod.suggestedParams()
    this.getSuggestedParams = params.getSuggestedParams ?? defaultGetSuggestedParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.appManager = params.appManager ?? new AppManager(params.algod)
    this.errorTransformers = params.errorTransformers ?? []
    this.composerConfig = params.composerConfig ?? {
      coverAppCallInnerTransactionFees: false,
      populateAppCallResources: true,
    }
  }

  public clone(composerConfig?: TransactionComposerConfig) {
    const newComposer = new TransactionComposer({
      algod: this.algod,
      getSuggestedParams: this.getSuggestedParams,
      getSigner: this.getSigner,
      defaultValidityWindow: this.defaultValidityWindow,
      appManager: this.appManager,
      errorTransformers: this.errorTransformers,
      composerConfig: {
        ...this.composerConfig,
        ...composerConfig,
      },
    })

    this.txns.forEach((txn) => {
      switch (txn.type) {
        case 'pay':
          newComposer.txns.push({
            type: 'pay',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetCreate':
          newComposer.txns.push({
            type: 'assetCreate',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetConfig':
          newComposer.txns.push({
            type: 'assetConfig',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetFreeze':
          newComposer.txns.push({
            type: 'assetFreeze',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetDestroy':
          newComposer.txns.push({
            type: 'assetDestroy',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetTransfer':
          newComposer.txns.push({
            type: 'assetTransfer',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetOptIn':
          newComposer.txns.push({
            type: 'assetOptIn',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'assetOptOut':
          newComposer.txns.push({
            type: 'assetOptOut',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'appCall':
          newComposer.txns.push({
            type: 'appCall',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'keyReg':
          newComposer.txns.push({
            type: 'keyReg',
            data: deepCloneTransactionParams(txn.data),
          })
          break
        case 'txnWithSigner': {
          const { txn: transaction, signer } = txn.data
          // Deep clone the transaction using encode/decode and remove group field
          const encoded = encodeTransactionRaw(transaction)
          const clonedTxn = decodeTransaction(encoded)
          clonedTxn.group = undefined
          newComposer.txns.push({
            type: 'txnWithSigner',
            data: {
              txn: clonedTxn,
              signer,
            },
          })
          break
        }
        case 'asyncTxn': {
          const { txn: txnPromise, signer } = txn.data
          // Create a new promise that resolves to a deep cloned transaction without the group field
          const newTxnPromise = txnPromise.then((resolvedTxn) => {
            const encoded = encodeTransactionRaw(resolvedTxn)
            const clonedTxn = decodeTransaction(encoded)
            clonedTxn.group = undefined
            return clonedTxn
          })
          newComposer.txns.push({
            type: 'asyncTxn',
            data: {
              txn: newTxnPromise,
              signer,
            },
          })
          break
        }
        case 'methodCall':
          // Method calls have already been processed and their transaction args extracted
          // Deep clone all data to avoid shared references
          newComposer.txns.push({
            type: 'methodCall',
            data: deepCloneTransactionParams(txn.data),
          })
          break
      }
    })

    return newComposer
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

  // TODO: PD - logic to enforce max group size
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
    this.txns.push({
      data: {
        txn: transaction,
        signer: signer ?? this.getSigner(transaction.sender),
      },
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
    this.txns.push({ data: params, type: 'pay' })

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
    this.txns.push({ data: params, type: 'assetCreate' })

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
    this.txns.push({ data: params, type: 'assetConfig' })

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
    this.txns.push({ data: params, type: 'assetFreeze' })

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
    this.txns.push({ data: params, type: 'assetDestroy' })

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
    this.txns.push({ data: params, type: 'assetTransfer' })

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
    this.txns.push({ data: params, type: 'assetOptIn' })

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
    this.txns.push({ data: params, type: 'assetOptOut' })

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
   *  onComplete: OnApplicationComplete.OptIn,
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
    this.txns.push({ data: params, type: 'appCall' })

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
   *  onComplete: OnApplicationComplete.UpdateApplication,
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
    this.txns.push({ data: { ...params, onComplete: OnApplicationComplete.UpdateApplication }, type: 'appCall' })

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
   *  onComplete: OnApplicationComplete.DeleteApplication,
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
    this.txns.push({ data: { ...params, onComplete: OnApplicationComplete.DeleteApplication }, type: 'appCall' })

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
   *  onComplete: OnApplicationComplete.OptIn,
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
    this.txns.push({ data: params, type: 'appCall' })

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
   *  onComplete: OnApplicationComplete.OptIn,
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
    const txnArgs = extractComposerTransactionsFromAppMethodCallParams(params)
    this.txns.push(...txnArgs)

    this.txns.push({
      data: { ...params, args: processAppMethodCallArgs(params.args) },
      type: 'methodCall',
    })
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
   *  onComplete: OnApplicationComplete.UpdateApplication,
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
    const txnArgs = extractComposerTransactionsFromAppMethodCallParams(params)
    this.txns.push(...txnArgs)

    this.txns.push({
      data: { ...params, args: processAppMethodCallArgs(params.args), onComplete: OnApplicationComplete.UpdateApplication },
      type: 'methodCall',
    })
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
   *  onComplete: OnApplicationComplete.DeleteApplication,
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
    const txnArgs = extractComposerTransactionsFromAppMethodCallParams(params)
    this.txns.push(...txnArgs)

    this.txns.push({
      data: { ...params, args: processAppMethodCallArgs(params.args), onComplete: OnApplicationComplete.DeleteApplication },
      type: 'methodCall',
    })
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
   *  onComplete: OnApplicationComplete.OptIn,
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
    const txnArgs = extractComposerTransactionsFromAppMethodCallParams(params)
    this.txns.push(...txnArgs)

    this.txns.push({ data: { ...params, args: processAppMethodCallArgs(params.args) }, type: 'methodCall' })
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
    this.txns.push({ data: params, type: 'keyReg' })

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
    this.txns.push({ data: params, type: 'keyReg' })

    return this
  }

  /**
   * Get the number of transactions currently added to this composer.
   * @returns The number of transactions currently added to this composer
   */
  async count() {
    return (await this.buildTransactions()).transactions.length
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
  public async build() {
    if (!this.transactionsWithSigners) {
      const suggestedParams = await this.getSuggestedParams()
      const builtTransactions = await this.buildTransactionsSuggestedParamsProvided(suggestedParams)

      const groupAnalysis =
        (this.composerConfig.coverAppCallInnerTransactionFees || this.composerConfig.populateAppCallResources) &&
        this.txns.some((t) => isAppCall(t))
          ? await this.analyzeGroupRequirements(builtTransactions.transactions, suggestedParams, this.composerConfig)
          : undefined

      await this.populateResourcesAndGroupTransactions(builtTransactions.transactions, groupAnalysis)

      this.transactionsWithSigners = this.gatherSigners(builtTransactions)
    }

    const methodCalls = new Map(
      this.txns
        .map((t, index) => (t.type === 'methodCall' ? ([index, t.data.method] as const) : null))
        .filter((entry): entry is [number, ABIMethod] => entry !== null),
    )

    return {
      transactions: this.transactionsWithSigners,
      methodCalls: methodCalls,
    }
  }

  private async buildTransactionsSuggestedParamsProvided(suggestedParams: SuggestedParams) {
    const defaultValidityWindow = getDefaultValidityWindow(suggestedParams.genesisId)

    const signers = new Map<number, algosdk.TransactionSigner>()

    const transactions = new Array<Transaction>()

    for (let i = 0; i < this.txns.length; i++) {
      const ctxn = this.txns[i]

      if (ctxn.type === 'txnWithSigner') {
        transactions.push(ctxn.data.txn)
        signers.set(i, ctxn.data.signer)
      } else if (ctxn.type === 'asyncTxn') {
        transactions.push(await ctxn.data.txn)
        // Use the signer that was set when the asyncTxn was added
        if (ctxn.data.signer) {
          signers.set(i, ctxn.data.signer)
        }
      } else {
        let transaction: Transaction
        const header = buildTransactionHeader(ctxn.data, suggestedParams, defaultValidityWindow)
        const calculateFee = header?.fee === undefined

        switch (ctxn.type) {
          case 'pay':
            transaction = buildPayment(ctxn.data, header)
            break
          case 'assetCreate':
            transaction = buildAssetCreate(ctxn.data, header)
            break
          case 'assetConfig':
            transaction = buildAssetConfig(ctxn.data, header)
            break
          case 'assetFreeze':
            transaction = buildAssetFreeze(ctxn.data, header)
            break
          case 'assetDestroy':
            transaction = buildAssetDestroy(ctxn.data, header)
            break
          case 'assetTransfer':
            transaction = buildAssetTransfer(ctxn.data, header)
            break
          case 'assetOptIn':
            transaction = buildAssetOptIn(ctxn.data, header)
            break
          case 'assetOptOut':
            transaction = buildAssetOptOut(ctxn.data, header)
            break
          case 'appCall':
            if (!('appId' in ctxn.data)) {
              transaction = await buildAppCreate(ctxn.data, this.appManager, header)
            } else if ('approvalProgram' in ctxn.data && 'clearStateProgram' in ctxn.data) {
              transaction = await buildAppUpdate(ctxn.data, this.appManager, header)
            } else {
              transaction = buildAppCall(ctxn.data, header)
            }
            break
          case 'keyReg':
            transaction = buildKeyReg(ctxn.data, header)
            break
          case 'methodCall':
            if (!('appId' in ctxn.data)) {
              transaction = await buildAppCreateMethodCall(ctxn.data, this.appManager, header)
            } else if ('approvalProgram' in ctxn.data && 'clearStateProgram' in ctxn.data) {
              transaction = await buildAppUpdateMethodCall(ctxn.data, this.appManager, header)
            } else {
              transaction = await buildAppCallMethodCall(ctxn.data, header)
            }
            break
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error(`Unsupported transaction type: ${(ctxn as any).type}`)
        }

        if (calculateFee) {
          transaction = assignFee(transaction, {
            feePerByte: suggestedParams.fee,
            minFee: suggestedParams.minFee,
            extraFee: ctxn.data.extraFee?.microAlgos,
            maxFee: ctxn.data.maxFee?.microAlgos,
          })
        }

        transactions.push(transaction)

        if (ctxn.data.signer) {
          const signer = 'signer' in ctxn.data.signer ? ctxn.data.signer.signer : ctxn.data.signer
          signers.set(i, signer)
        }
      }
    }

    const methodCalls = new Map(
      this.txns
        .map((t, index) => (t.type === 'methodCall' ? ([index, t.data.method] as const) : null))
        .filter((entry): entry is [number, ABIMethod] => entry !== null),
    )

    return { transactions, methodCalls, signers }
  }

  // TODO: PD - port this over https://github.com/algorandfoundation/algokit-utils-ts/pull/456
  // TODO: PD - can we make this private?
  public async buildTransactions(): Promise<BuiltTransactions> {
    const suggestedParams = await this.getSuggestedParams()
    return this.buildTransactionsSuggestedParamsProvided(suggestedParams)
  }

  private async populateResourcesAndGroupTransactions(transactions: Transaction[], groupAnalysis?: GroupAnalysis): Promise<Transaction[]> {
    if (groupAnalysis) {
      // Process fee adjustments
      let surplusGroupFees = 0n
      const transactionAnalysis: Array<{
        groupIndex: number
        requiredFeeDelta?: FeeDelta
        priority: FeePriority
        unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
      }> = []

      // Process fee adjustments
      groupAnalysis.transactions.forEach((txnAnalysis, groupIndex) => {
        // Accumulate surplus fees
        if (txnAnalysis.requiredFeeDelta && FeeDelta.isSurplus(txnAnalysis.requiredFeeDelta)) {
          surplusGroupFees += FeeDelta.amount(txnAnalysis.requiredFeeDelta)
        }

        // Calculate priority and add to transaction info
        const ctxn = this.txns[groupIndex]
        const txn = transactions[groupIndex]
        const logicalMaxFee = getLogicalMaxFee(ctxn)
        const isImmutableFee = logicalMaxFee !== undefined && logicalMaxFee === (txn.fee || 0n)

        let priority = FeePriority.Covered
        if (txnAnalysis.requiredFeeDelta && FeeDelta.isDeficit(txnAnalysis.requiredFeeDelta)) {
          const deficitAmount = FeeDelta.amount(txnAnalysis.requiredFeeDelta)
          if (isImmutableFee || txn.type !== TransactionType.AppCall) {
            // High priority: transactions that can't be modified
            priority = FeePriority.ImmutableDeficit(deficitAmount)
          } else {
            // Normal priority: app call transactions that can be modified
            priority = FeePriority.ModifiableDeficit(deficitAmount)
          }
        }

        transactionAnalysis.push({
          groupIndex,
          requiredFeeDelta: txnAnalysis.requiredFeeDelta,
          priority,
          unnamedResourcesAccessed: txnAnalysis.unnamedResourcesAccessed,
        })
      })

      // Sort transactions by priority (highest first)
      transactionAnalysis.sort((a, b) => b.priority.compare(a.priority))

      const indexesWithAccessReferences: number[] = []

      for (const { groupIndex, requiredFeeDelta, unnamedResourcesAccessed } of transactionAnalysis) {
        // Cover any additional fees required for the transactions
        if (requiredFeeDelta && FeeDelta.isDeficit(requiredFeeDelta)) {
          const deficitAmount = FeeDelta.amount(requiredFeeDelta)
          let additionalFeeDelta: FeeDelta | undefined

          if (surplusGroupFees === 0n) {
            // No surplus group fees, the transaction must cover its own deficit
            additionalFeeDelta = requiredFeeDelta
          } else if (surplusGroupFees >= deficitAmount) {
            // Surplus fully covers the deficit
            surplusGroupFees -= deficitAmount
          } else {
            // Surplus partially covers the deficit
            additionalFeeDelta = FeeDelta.fromBigInt(deficitAmount - surplusGroupFees)
            surplusGroupFees = 0n
          }

          // If there is any additional fee deficit, the transaction must cover it by modifying the fee
          if (additionalFeeDelta && FeeDelta.isDeficit(additionalFeeDelta)) {
            const additionalDeficitAmount = FeeDelta.amount(additionalFeeDelta)

            if (transactions[groupIndex].type === TransactionType.AppCall) {
              const currentFee = transactions[groupIndex].fee || 0n
              const transactionFee = currentFee + additionalDeficitAmount

              const logicalMaxFee = getLogicalMaxFee(this.txns[groupIndex])
              if (!logicalMaxFee || transactionFee > logicalMaxFee) {
                throw new Error(
                  `Calculated transaction fee ${transactionFee} µALGO is greater than max of ${logicalMaxFee ?? 0n} for transaction ${groupIndex}`,
                )
              }

              transactions[groupIndex].fee = transactionFee
            } else {
              throw new Error(
                `An additional fee of ${additionalDeficitAmount} µALGO is required for non app call transaction ${groupIndex}`,
              )
            }
          }
        }

        // Apply transaction-level resource population
        if (unnamedResourcesAccessed && transactions[groupIndex].type === TransactionType.AppCall) {
          const hasAccessReferences =
            transactions[groupIndex].appCall?.accessReferences && transactions[groupIndex].appCall?.accessReferences?.length
          if (!hasAccessReferences) {
            populateTransactionResources(transactions[groupIndex], unnamedResourcesAccessed, groupIndex)
          } else {
            indexesWithAccessReferences.push(groupIndex)
          }
        }
      }

      if (indexesWithAccessReferences.length > 0) {
        Config.logger.warn(
          `Resource population will be skipped for transaction indexes ${indexesWithAccessReferences.join(', ')} as they use access references.`,
        )
      }

      // Apply group-level resource population
      if (groupAnalysis.unnamedResourcesAccessed) {
        populateGroupResources(transactions, groupAnalysis.unnamedResourcesAccessed)
      }
    }

    if (transactions.length > 1) {
      const groupedTransactions = groupTransactions(transactions)
      // Mutate the input transactions so that the group is updated for any transaction passed into the composer
      transactions.forEach((t) => (t.group = groupedTransactions[0].group))
      return transactions
    } else {
      return transactions
    }
  }

  private gatherSigners(builtTransactions: BuiltTransactions): TransactionWithSigner[] {
    return builtTransactions.transactions.map((txn, index) => {
      return {
        txn,
        signer: builtTransactions.signers.get(index) ?? this.getSigner(txn.sender),
      }
    })
  }

  private async analyzeGroupRequirements(
    transactions: Transaction[],
    suggestedParams: SuggestedParams,
    analysisParams: TransactionComposerConfig,
  ): Promise<GroupAnalysis> {
    const appCallIndexesWithoutMaxFees: number[] = []

    let transactionsToSimulate = transactions.map((txn, groupIndex) => {
      const ctxn = this.txns[groupIndex]
      const txnToSimulate = { ...txn }
      txnToSimulate.group = undefined
      if (analysisParams.coverAppCallInnerTransactionFees && txn.type === TransactionType.AppCall) {
        const logicalMaxFee = getLogicalMaxFee(ctxn)
        if (logicalMaxFee !== undefined) {
          txnToSimulate.fee = logicalMaxFee
        } else {
          appCallIndexesWithoutMaxFees.push(groupIndex)
        }
      }

      return txnToSimulate
    })

    // Regroup the transactions, as the transactions have likely been adjusted
    if (transactionsToSimulate.length > 1) {
      transactionsToSimulate = groupTransactions(transactionsToSimulate)
    }

    // Check for required max fees on app calls when fee coverage is enabled
    if (analysisParams.coverAppCallInnerTransactionFees && appCallIndexesWithoutMaxFees.length > 0) {
      throw new Error(
        `Please provide a maxFee for each app call transaction when coverAppCallInnerTransactionFees is enabled. Required for transaction ${appCallIndexesWithoutMaxFees.join(', ')}`,
      )
    }

    const signedTransactions = transactionsToSimulate.map(
      (txn) =>
        ({
          txn: txn,
          signature: EMPTY_SIGNATURE,
        }) satisfies SignedTransaction,
    )

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

    const response: SimulateTransaction = await this.algod.simulateTransaction(simulateRequest)
    const groupResponse = response.txnGroups[0]

    // Handle any simulation failures
    if (groupResponse.failureMessage) {
      if (analysisParams.coverAppCallInnerTransactionFees && groupResponse.failureMessage.includes('fee too small')) {
        throw new Error(
          'Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.',
        )
      }

      throw new Error(
        `Error resolving execution info via simulate in transaction ${groupResponse.failedAt?.join(', ')}: ${groupResponse.failureMessage}`,
      )
    }

    const txnAnalysisResults: TransactionAnalysis[] = groupResponse.txnResults.map((simulateTxnResult, groupIndex) => {
      const btxn = transactions[groupIndex]

      let requiredFeeDelta: FeeDelta | undefined

      if (analysisParams.coverAppCallInnerTransactionFees) {
        const minTxnFee = calculateFee(btxn, {
          feePerByte: suggestedParams.fee,
          minFee: suggestedParams.minFee,
        })
        const txnFee = btxn.fee ?? 0n
        const txnFeeDelta = FeeDelta.fromBigInt(minTxnFee - txnFee)

        if (btxn.type === TransactionType.AppCall) {
          // Calculate inner transaction fee delta
          const innerTxnsFeeDelta = calculateInnerFeeDelta(simulateTxnResult.txnResult.innerTxns, suggestedParams.minFee)
          requiredFeeDelta = FeeDelta.fromBigInt(
            (innerTxnsFeeDelta ? FeeDelta.toBigInt(innerTxnsFeeDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
          )
        } else {
          requiredFeeDelta = txnFeeDelta
        }
      }

      return {
        requiredFeeDelta,
        unnamedResourcesAccessed: analysisParams.populateAppCallResources ? simulateTxnResult.unnamedResourcesAccessed : undefined,
      }
    })

    // TODO: PD - confirm if this is done in python too
    const sortedResources = groupResponse.unnamedResourcesAccessed

    // NOTE: We explicitly want to avoid localeCompare as that can lead to different results in different environments
    const compare = (a: string | bigint, b: string | bigint) => (a < b ? -1 : a > b ? 1 : 0)

    if (sortedResources) {
      sortedResources.accounts?.sort((a, b) => compare(a.toString(), b.toString()))
      sortedResources.assets?.sort(compare)
      sortedResources.apps?.sort(compare)
      sortedResources.boxes?.sort((a, b) => {
        const aStr = `${a.app}-${a.name}`
        const bStr = `${b.app}-${b.name}`
        return compare(aStr, bStr)
      })
      sortedResources.appLocals?.sort((a, b) => {
        const aStr = `${a.app}-${a.account}`
        const bStr = `${b.app}-${b.account}`
        return compare(aStr, bStr)
      })
      sortedResources.assetHoldings?.sort((a, b) => {
        const aStr = `${a.asset}-${a.account}`
        const bStr = `${b.asset}-${b.account}`
        return compare(aStr, bStr)
      })
    }

    return {
      transactions: txnAnalysisResults,
      unnamedResourcesAccessed: analysisParams.populateAppCallResources ? sortedResources : undefined,
    }
  }

  /**
   * Rebuild the group, discarding any previously built transactions.
   * This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.
   * @returns The newly built atomic transaction composer and the transactions
   * @example
   * ```typescript
   * const { atc, transactions, methodCalls } = await composer.rebuild()
   * ```
   */
  async rebuild() {
    this.transactionsWithSigners = undefined
    return await this.build()
  }

  // TODO: PD - clone and other missing methods from the atc

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
    if (
      this.composerConfig.coverAppCallInnerTransactionFees !== (params?.coverAppCallInnerTransactionFees ?? false) ||
      this.composerConfig.populateAppCallResources !== (params?.populateAppCallResources ?? true)
    ) {
      // If the params are different to the composer config, reset the builtGroup
      // to ensure that the SendParams overwrites the composer config
      this.composerConfig = {
        coverAppCallInnerTransactionFees: params?.coverAppCallInnerTransactionFees ?? false,
        populateAppCallResources: params?.populateAppCallResources ?? true,
      }

      this.transactionsWithSigners = undefined
      this.signedTransactions = undefined
    }

    try {
      await this.gatherSignatures()

      if (
        !this.transactionsWithSigners ||
        this.transactionsWithSigners.length === 0 ||
        !this.signedTransactions ||
        this.signedTransactions.length === 0
      ) {
        throw new Error('No transactions available')
      }

      const transactionsToSend = this.transactionsWithSigners.map((stxn) => stxn.txn)
      const transactionIds = transactionsToSend.map((txn) => getTransactionId(txn))

      if (transactionsToSend.length > 1) {
        const groupId = transactionsToSend[0].group ? Buffer.from(transactionsToSend[0].group).toString('base64') : ''
        Config.getLogger(params?.suppressLog).verbose(`Sending group of ${transactionsToSend.length} transactions (${groupId})`, {
          transactionsToSend,
        })

        Config.getLogger(params?.suppressLog).debug(`Transaction IDs (${groupId})`, transactionIds)
      }

      if (Config.debug && Config.traceAll) {
        const simulateResponse = await this.simulateTransactionsWithNoSigner(
          this.transactionsWithSigners.map((transactionWithSigner) => transactionWithSigner.txn),
        )
        await Config.events.emitAsync(EventType.TxnGroupSimulated, {
          simulateResponse,
        })
      }

      const group = this.signedTransactions[0].txn.group

      let waitRounds = params?.maxRoundsToWaitForConfirmation

      if (waitRounds === undefined) {
        const suggestedParams = await this.getSuggestedParams()
        const firstRound = suggestedParams.firstValid
        const lastRound = this.signedTransactions.reduce((max, txn) => (txn.txn.lastValid > max ? txn.txn.lastValid : max), 0n)
        waitRounds = Number(lastRound - firstRound) + 1
      }

      const encodedTxns = encodeSignedTransactions(this.signedTransactions)
      await this.algod.sendRawTransaction(encodedTxns)

      if (transactionsToSend.length > 1 && group) {
        Config.getLogger(params?.suppressLog).verbose(
          `Group transaction (${toBase64(group)}) sent with ${transactionsToSend.length} transactions`,
        )
      } else {
        Config.getLogger(params?.suppressLog).verbose(
          `Sent transaction ID ${getTransactionId(transactionsToSend[0])} ${transactionsToSend[0].type} from ${transactionsToSend[0].sender}`,
        )
      }

      const confirmations = new Array<PendingTransactionResponse>()
      if (params?.maxRoundsToWaitForConfirmation !== 0) {
        for (const id of transactionIds) {
          const confirmation = await waitForConfirmation(id, waitRounds, this.algod)
          confirmations.push(confirmation)
        }
      }

      const abiReturns = this.parseAbiReturnValues(confirmations)

      return {
        groupId: group ? Buffer.from(group).toString('base64') : undefined,
        transactions: transactionsToSend.map((t) => new TransactionWrapper(t)),
        txIds: transactionIds,
        returns: abiReturns,
        confirmations: confirmations.map((c) => wrapPendingTransactionResponse(c)),
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (originalError: any) {
      const errorMessage = originalError.body?.message ?? originalError.message ?? 'Received error executing Atomic Transaction Composer'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = new Error(errorMessage) as any
      err.cause = originalError
      if (typeof originalError === 'object') {
        err.name = originalError.name
      }

      // There could be simulate errors occur during the resource population process
      // In that case, the transactionsWithSigners is not set, fallback to buildTransactions() to get the raw transactions
      let sentTransactions: Transaction[]
      if (this.transactionsWithSigners) {
        sentTransactions = this.transactionsWithSigners.map((transactionWithSigner) => transactionWithSigner.txn)
      } else {
        sentTransactions = (await this.buildTransactions()).transactions
        sentTransactions = groupTransactions(sentTransactions)
      }

      if (Config.debug && typeof originalError === 'object') {
        err.traces = []
        Config.getLogger(params?.suppressLog).error(
          'Received error executing Atomic Transaction Composer and debug flag enabled; attempting simulation to get more information',
          err,
        )

        const simulateResponse = await this.simulateTransactionsWithNoSigner(sentTransactions)

        if (Config.debug && !Config.traceAll) {
          // Emit the event only if traceAll: false, as it should have already been emitted above
          await Config.events.emitAsync(EventType.TxnGroupSimulated, {
            simulateResponse,
          })
        }

        if (simulateResponse && simulateResponse.txnGroups[0].failedAt) {
          for (const txn of simulateResponse.txnGroups[0].txnResults) {
            err.traces.push({
              trace: AlgorandSerializer.encode(txn.execTrace, SimulationTransactionExecTraceMeta, 'map'),
              appBudget: txn.appBudgetConsumed,
              logicSigBudget: txn.logicSigBudgetConsumed,
              logs: txn.txnResult.logs,
              message: simulateResponse.txnGroups[0].failureMessage,
            })
          }
        }
      } else {
        Config.getLogger(params?.suppressLog).error(
          'Received error executing Atomic Transaction Composer, for more information enable the debug flag',
          err,
        )
      }

      // Attach the sent transactions so we can use them in error transformers
      err.sentTransactions = sentTransactions.map((t) => new TransactionWrapper(t))

      throw await this.transformError(err)
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
    const { skipSignatures = false, ...rawOptions } = options ?? {}

    const builtTransactions = await this.buildTransactions()
    const transactions =
      builtTransactions.transactions.length > 0 ? groupTransactions(builtTransactions.transactions) : builtTransactions.transactions

    let signedTransactions: SignedTransaction[]
    // Build the transactions
    if (skipSignatures) {
      rawOptions.allowEmptySignatures = true
      rawOptions.fixSigners = true

      // Build transactions uses empty signers
      signedTransactions = transactions.map((txn) => ({
        txn: txn,
        signature: EMPTY_SIGNATURE,
      }))
    } else {
      // Build creates real signatures
      const transactionsWithSigners = this.gatherSigners({ ...builtTransactions, transactions })
      signedTransactions = await this.signTransactions(transactionsWithSigners)
    }

    const simulateRequest = {
      txnGroups: [
        {
          txns: signedTransactions,
        },
      ],
      ...rawOptions,
      ...(Config.debug
        ? {
            allowEmptySignatures: true,
            fixSigners: true,
            allowMoreLogging: true,
            execTraceConfig: {
              enable: true,
              scratchChange: true,
              stackChange: true,
              stateChange: true,
            },
          }
        : undefined),
    } satisfies SimulateRequest

    const simulateResponse = await this.algod.simulateTransaction(simulateRequest)
    const simulateResult = simulateResponse.txnGroups[0]

    if (simulateResult?.failureMessage) {
      const errorMessage = `Transaction failed at transaction(s) ${simulateResult.failedAt?.join(', ') || 'unknown'} in the group. ${simulateResult.failureMessage}`
      const error = new Error(errorMessage)

      if (Config.debug) {
        await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateTransaction: simulateResponse })
      }

      throw await this.transformError(error)
    }

    if (Config.debug && Config.traceAll) {
      await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateTransaction: simulateResponse })
    }

    const abiReturns = this.parseAbiReturnValues(simulateResult.txnResults.map((t) => t.txnResult))

    return {
      confirmations: simulateResult.txnResults.map((t) => wrapPendingTransactionResponse(t.txnResult)),
      transactions: transactions.map((t) => new TransactionWrapper(t)),
      txIds: transactions.map((t) => getTransactionId(t)),
      groupId: Buffer.from(transactions[0].group ?? new Uint8Array()).toString('base64'),
      simulateResponse,
      returns: abiReturns,
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

  public async gatherSignatures(): Promise<SignedTransaction[]> {
    if (this.signedTransactions) {
      return this.signedTransactions
    }

    await this.build()

    if (!this.transactionsWithSigners || this.transactionsWithSigners.length === 0) {
      throw new Error('No transactions available to sign')
    }

    this.signedTransactions = await this.signTransactions(this.transactionsWithSigners)
    return this.signedTransactions
  }

  private async signTransactions(transactionsWithSigners: TransactionWithSigner[]): Promise<SignedTransaction[]> {
    if (transactionsWithSigners.length === 0) {
      throw new Error('No transactions available to sign')
    }

    const transactions = transactionsWithSigners.map((txnWithSigner) => txnWithSigner.txn)

    // Group transactions by signer
    const signerGroups = new Map<TransactionSigner, number[]>()
    transactionsWithSigners.forEach(({ signer }, index) => {
      const indexes = signerGroups.get(signer) ?? []
      indexes.push(index)
      signerGroups.set(signer, indexes)
    })

    // Sign transactions in parallel for each signer
    const signerEntries = Array.from(signerGroups)
    const signedGroups = await Promise.all(signerEntries.map(([signer, indexes]) => signer(transactions, indexes)))

    // Reconstruct signed transactions in original order
    const signedTransactions = new Array<SignedTransaction>(transactionsWithSigners.length)
    signerEntries.forEach(([, indexes], signerIndex) => {
      const stxs = signedGroups[signerIndex]
      indexes.forEach((txIndex, stxIndex) => {
        signedTransactions[txIndex] = decodeSignedTransaction(stxs[stxIndex])
      })
    })

    // Verify all transactions were signed
    const unsignedIndexes = signedTransactions
      .map((stxn, index) => (stxn === undefined ? index : null))
      .filter((index): index is number => index !== null)

    if (unsignedIndexes.length > 0) {
      throw new Error(`Transactions at indexes [${unsignedIndexes.join(', ')}] were not signed`)
    }

    return signedTransactions
  }

  private parseAbiReturnValues(confirmations: PendingTransactionResponse[]): ABIReturn[] {
    const abiReturns = new Array<ABIReturn>()

    for (let i = 0; i < confirmations.length; i++) {
      const confirmation = confirmations[i]
      const transaction = this.txns[i]

      if (transaction) {
        const method = getMethodFromTransaction(transaction)
        if (method && method.returns.type !== 'void') {
          const abiReturn = AppManager.getABIReturn(confirmation, method)
          if (abiReturn !== undefined) {
            abiReturns.push(abiReturn)
          }
        }
      }
    }

    return abiReturns
  }

  private async simulateTransactionsWithNoSigner(transactions: Transaction[]) {
    const simulateRequest = {
      allowEmptySignatures: true,
      fixSigners: true,
      allowMoreLogging: true,
      execTraceConfig: {
        enable: true,
        scratchChange: true,
        stackChange: true,
        stateChange: true,
      },
      txnGroups: [
        {
          txns: transactions.map((txn) => ({
            txn: txn,
            signature: EMPTY_SIGNATURE,
          })),
        },
      ],
    } satisfies SimulateRequest
    const simulateResult = await this.algod.simulateTransaction(simulateRequest)
    return simulateResult
  }
}

function isAppCall(ctxn: Txn): boolean {
  return (
    ctxn.type === 'appCall' ||
    ctxn.type === 'methodCall' ||
    (ctxn.type === 'txnWithSigner' && ctxn.data.txn.type === TransactionType.AppCall)
  )
}

export function getMethodFromTransaction(transaction: Txn): ABIMethod | undefined {
  switch (transaction.type) {
    case 'methodCall':
      return transaction.data.method
    default:
      return undefined
  }
}

/** Get the logical maximum fee based on staticFee and maxFee */
function getLogicalMaxFee(ctxn: Txn): bigint | undefined {
  if (ctxn.type === 'txnWithSigner' || ctxn.type === 'asyncTxn') {
    return undefined
  }

  const maxFee = ctxn.data.maxFee
  const staticFee = ctxn.data.staticFee

  if (maxFee !== undefined && (staticFee === undefined || maxFee.microAlgos > staticFee.microAlgos)) {
    return maxFee.microAlgos
  }
  return staticFee?.microAlgos
}
