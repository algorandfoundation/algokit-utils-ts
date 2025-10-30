import { AlgodClient, SimulateRequest, SimulateTransaction, TransactionParams } from '@algorandfoundation/algod-client'
import { OnApplicationComplete, Transaction, assignFee, getTransactionId } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { ABIMethod, Address, SdkTransactionParams } from '@algorandfoundation/sdk'
import { Config } from '../config'
import { encodeLease, getABIReturnValue, sendAtomicTransactionComposer } from '../transaction/transaction'
import { asJson, calculateExtraProgramPages } from '../util'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { AccessReference, AppManager, BoxIdentifier, BoxReference, getAccessReference } from './app-manager'
import { Expand } from './expand'
import { EventType } from './lifecycle-events'
import { genesisIdIsLocalNet } from './network-client'
import { Arc2TransactionNote, SendAtomicTransactionComposerResults, SendParams } from './transaction'
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
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
  onComplete?: Exclude<
    OnApplicationComplete,
    OnApplicationComplete.UpdateApplication | OnApplicationComplete.ClearState
  >
}

/** Parameters to define an application delete call transaction. */
export type AppDeleteParams = CommonAppCallParams & {
  onComplete?: OnApplicationComplete.DeleteApplication
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
  | { atc: algosdk.AtomicTransactionComposer; type: 'atc' }
  | ((AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall) & { type: 'methodCall' })

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
  algod: AlgodClient
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

  /** The ATC used to compose the group */
  private atc = new algosdk.AtomicTransactionComposer()

  /** Map of transaction index in the atc to a max logical fee.
   * This is set using the value of either maxFee or staticFee.
   */
  private txnMaxFees: Map<number, AlgoAmount> = new Map()

  /** Transactions that have not yet been composed */
  private txns: Txn[] = []

  /** The algod client used by the composer. */
  private algod: AlgodClient

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
    this.txns.push({ ...params, type: 'pay' })

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
    this.txns.push({ ...params, type: 'assetCreate' })

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
    this.txns.push({ ...params, type: 'assetConfig' })

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
    this.txns.push({ ...params, type: 'assetFreeze' })

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
    this.txns.push({ ...params, type: 'assetDestroy' })

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
    this.txns.push({ ...params, type: 'assetTransfer' })

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
    this.txns.push({ ...params, type: 'assetOptIn' })

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
    this.txns.push({ ...params, type: 'assetOptOut' })

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
    this.txns.push({ ...params, type: 'appCall' })

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
    this.txns.push({ ...params, type: 'appCall', onComplete: OnApplicationComplete.UpdateApplication })

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
    this.txns.push({ ...params, type: 'appCall', onComplete: OnApplicationComplete.DeleteApplication })

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
    this.txns.push({ ...params, type: 'appCall' })

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
    this.txns.push({ ...params, type: 'methodCall' })
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
    this.txns.push({ ...params, type: 'methodCall', onComplete: OnApplicationComplete.UpdateApplication })
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
    this.txns.push({ ...params, type: 'methodCall', onComplete: OnApplicationComplete.DeleteApplication })
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
    this.txns.push({ ...params, type: 'methodCall' })
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
    this.txns.push({ ...params, type: 'keyReg' })

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
    this.txns.push({ ...params, type: 'keyReg' })

    return this
  }

  /**
   * Add the transactions within an `AtomicTransactionComposer` to the transaction group.
   * @param atc The `AtomicTransactionComposer` to build transactions from and add to the group
   * @returns The composer so you can chain method calls
   * @example
   * ```typescript
   * const atc = new AtomicTransactionComposer()
   *   .addPayment({ sender: 'SENDERADDRESS', receiver: 'RECEIVERADDRESS', amount: 1000n })
   * composer.addAtc(atc)
   * ```
   */
  addAtc(atc: algosdk.AtomicTransactionComposer): TransactionComposer {
    this.txns.push({ atc, type: 'atc' })
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

    if (params.lease) txnParams.lease = encodeLease(params.lease)! satisfies Transaction['lease']
    if (params.rekeyTo) txnParams.rekeyTo = params.rekeyTo.toString() satisfies Transaction['rekeyTo']
    const encoder = new TextEncoder()
    if (params.note)
      txnParams.note = (typeof params.note === 'string' ? encoder.encode(params.note) : params.note) satisfies Transaction['note']

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
    suggestedParams: SdkTransactionParams,
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
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
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

  private buildPayment(params: PaymentParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makePaymentTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      receiver: params.receiver,
      amount: params.amount.microAlgo,
      closeRemainderTo: params.closeRemainderTo,
      suggestedParams,
    })
  }

  private buildAssetCreate(params: AssetCreateParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      total: params.total,
      decimals: params.decimals ?? 0,
      assetName: params.assetName,
      unitName: params.unitName,
      assetURL: params.url,
      defaultFrozen: params.defaultFrozen ?? false,
      assetMetadataHash: typeof params.metadataHash === 'string' ? Buffer.from(params.metadataHash, 'utf-8') : params.metadataHash,
      manager: params.manager,
      reserve: params.reserve,
      freeze: params.freeze,
      clawback: params.clawback,
      suggestedParams,
    })
  }

  private buildAssetConfig(params: AssetConfigParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      assetIndex: params.assetId,
      suggestedParams,
      manager: params.manager,
      reserve: params.reserve,
      freeze: params.freeze,
      clawback: params.clawback,
      strictEmptyAddressChecking: false,
    })
  }

  private buildAssetDestroy(params: AssetDestroyParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      assetIndex: params.assetId,
      suggestedParams,
    })
  }

  private buildAssetFreeze(params: AssetFreezeParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      assetIndex: params.assetId,
      freezeTarget: params.account,
      frozen: params.frozen,
      suggestedParams,
    })
  }

  private buildAssetTransfer(params: AssetTransferParams, suggestedParams: SdkTransactionParams) {
    return this.commonTxnBuildStep(algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      receiver: params.receiver,
      assetIndex: params.assetId,
      amount: params.amount,
      suggestedParams,
      closeRemainderTo: params.closeAssetTo,
      assetSender: params.clawbackTarget,
    })
  }

  private async buildAppCall(params: AppCallParams | AppUpdateParams | AppCreateParams, suggestedParams: SdkTransactionParams) {
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

    // If accessReferences is provided, we should not pass legacy foreign arrays
    const hasAccessReferences = params.accessReferences && params.accessReferences.length > 0

    const sdkParams = {
      sender: params.sender,
      suggestedParams,
      appArgs: params.args,
      onComplete: params.onComplete ?? OnApplicationComplete.NoOp,
      ...(hasAccessReferences
        ? { access: params.accessReferences?.map(getAccessReference) }
        : {
            accounts: params.accountReferences,
            foreignApps: params.appReferences?.map((x) => Number(x)),
            foreignAssets: params.assetReferences?.map((x) => Number(x)),
            boxes: params.boxReferences?.map(AppManager.getBoxReference),
          }),
      approvalProgram,
      clearProgram: clearStateProgram,
    }

    if (appId === 0n) {
      if (sdkParams.approvalProgram === undefined || sdkParams.clearProgram === undefined) {
        throw new Error('approvalProgram and clearStateProgram are required for application creation')
      }

      return this.commonTxnBuildStep(algosdk.makeApplicationCreateTxnFromObject, params, {
        ...sdkParams,
        extraPages:
          'extraProgramPages' in params && params.extraProgramPages !== undefined
            ? params.extraProgramPages
            : calculateExtraProgramPages(approvalProgram!, clearStateProgram!),
        numLocalInts: 'schema' in params ? (params.schema?.localInts ?? 0) : 0,
        numLocalByteSlices: 'schema' in params ? (params.schema?.localByteSlices ?? 0) : 0,
        numGlobalInts: 'schema' in params ? (params.schema?.globalInts ?? 0) : 0,
        numGlobalByteSlices: 'schema' in params ? (params.schema?.globalByteSlices ?? 0) : 0,
        approvalProgram: approvalProgram!,
        clearProgram: clearStateProgram!,
      })
    } else {
      return this.commonTxnBuildStep(algosdk.makeApplicationCallTxnFromObject, params, { ...sdkParams, appIndex: appId })
    }
  }

  private buildKeyReg(params: OnlineKeyRegistrationParams | OfflineKeyRegistrationParams, suggestedParams: SdkTransactionParams) {
    if ('voteKey' in params) {
      return this.commonTxnBuildStep(algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject, params, {
        sender: params.sender,
        voteKey: params.voteKey,
        selectionKey: params.selectionKey,
        voteFirst: params.voteFirst,
        voteLast: params.voteLast,
        voteKeyDilution: params.voteKeyDilution,
        suggestedParams,
        nonParticipation: false,
        stateProofKey: params.stateProofKey,
      })
    }

    return this.commonTxnBuildStep(algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject, params, {
      sender: params.sender,
      suggestedParams,
      nonParticipation: params.preventAccountFromEverParticipatingAgain,
    })
  }

  /** Builds all transaction types apart from `txnWithSigner`, `atc` and `methodCall` since those ones can have custom signers that need to be retrieved. */
  private async buildTxn(txn: Txn, suggestedParams: SdkTransactionParams): Promise<TransactionWithContext[]> {
    switch (txn.type) {
      case 'pay':
        return [this.buildPayment(txn, suggestedParams)]
      case 'assetCreate':
        return [this.buildAssetCreate(txn, suggestedParams)]
      case 'appCall':
        return [await this.buildAppCall(txn, suggestedParams)]
      case 'assetConfig':
        return [this.buildAssetConfig(txn, suggestedParams)]
      case 'assetDestroy':
        return [this.buildAssetDestroy(txn, suggestedParams)]
      case 'assetFreeze':
        return [this.buildAssetFreeze(txn, suggestedParams)]
      case 'assetTransfer':
        return [this.buildAssetTransfer(txn, suggestedParams)]
      case 'assetOptIn':
        return [this.buildAssetTransfer({ ...txn, receiver: txn.sender, amount: 0n }, suggestedParams)]
      case 'assetOptOut':
        return [this.buildAssetTransfer({ ...txn, receiver: txn.sender, amount: 0n, closeAssetTo: txn.creator }, suggestedParams)]
      case 'keyReg':
        return [this.buildKeyReg(txn, suggestedParams)]
      default:
        throw Error(`Unsupported txn type`)
    }
  }

  private async buildTxnWithSigner(txn: Txn, suggestedParams: SdkTransactionParams): Promise<TransactionWithSignerAndContext[]> {
    if (txn.type === 'txnWithSigner') {
      return [
        {
          ...txn,
          context: {},
        },
      ]
    }

    if (txn.type === 'atc') {
      return this.buildAtc(txn.atc)
    }

    if (txn.type === 'methodCall') {
      return await this.buildMethodCall(txn, suggestedParams, true)
    }

    const signer = txn.signer ? ('signer' in txn.signer ? txn.signer.signer : txn.signer) : this.getSigner(txn.sender)

    return (await this.buildTxn(txn, suggestedParams)).map(({ txn, context }) => ({ txn, signer, context }))
  }

  /**
   * Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.
   *
   * @returns The array of built transactions and any corresponding method calls
   * @example
   * ```typescript
   * const { transactions, methodCalls, signers } = await composer.buildTransactions()
   * ```
   */
  async buildTransactions(): Promise<BuiltTransactions> {
    const suggestedParams = await this.getSuggestedParams()
    const sdkTransactionParams: SdkTransactionParams = {
      ...suggestedParams,
      firstRound: suggestedParams.lastRound,
      lastRound: suggestedParams.lastRound + 1000n,
    }

    const transactions: Transaction[] = []
    const methodCalls = new Map<number, algosdk.ABIMethod>()
    const signers = new Map<number, algosdk.TransactionSigner>()

    for (const txn of this.txns) {
      if (!['txnWithSigner', 'atc', 'methodCall'].includes(txn.type)) {
        transactions.push(...(await this.buildTxn(txn, sdkTransactionParams)).map((txn) => txn.txn))
      } else {
        const transactionsWithSigner =
          txn.type === 'txnWithSigner'
            ? [txn]
            : txn.type === 'atc'
              ? this.buildAtc(txn.atc)
              : txn.type === 'methodCall'
                ? await this.buildMethodCall(txn, sdkTransactionParams, false)
                : []

        transactionsWithSigner.forEach((ts) => {
          transactions.push(ts.txn)
          const groupIdx = transactions.length - 1

          if (ts.signer && ts.signer !== TransactionComposer.NULL_SIGNER) {
            signers.set(groupIdx, ts.signer)
          }
          if ('context' in ts && ts.context.abiMethod) {
            methodCalls.set(groupIdx, ts.context.abiMethod)
          }
        })
      }
    }

    return { transactions, methodCalls, signers }
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
  async build() {
    if (this.atc.getStatus() === algosdk.AtomicTransactionComposerStatus.BUILDING) {
      const suggestedParams = await this.getSuggestedParams()
      const sdkTransactionParams: SdkTransactionParams = {
        ...suggestedParams,
        firstRound: suggestedParams.lastRound,
        lastRound: suggestedParams.lastRound + 1000n,
      }
      // Build all of the transactions
      const txnWithSigners: TransactionWithSignerAndContext[] = []
      for (const txn of this.txns) {
        txnWithSigners.push(...(await this.buildTxnWithSigner(txn, sdkTransactionParams)))
      }

      // Add all of the transactions to the underlying ATC
      const methodCalls = new Map<number, algosdk.ABIMethod>()
      txnWithSigners.forEach(({ context, ...ts }, idx) => {
        this.atc.addTransaction(ts)

        // Populate consolidated set of all ABI method calls
        if (context.abiMethod) {
          methodCalls.set(idx, context.abiMethod)
        }

        if (context.maxFee !== undefined) {
          this.txnMaxFees.set(idx, context.maxFee)
        }
      })
      this.atc['methodCalls'] = methodCalls
    }

    return { atc: this.atc, transactions: this.atc.buildGroup(), methodCalls: this.atc['methodCalls'] }
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
    this.atc = new algosdk.AtomicTransactionComposer()
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
    const group = (await this.build()).transactions

    let waitRounds = params?.maxRoundsToWaitForConfirmation

    const suggestedParams =
      waitRounds === undefined || params?.coverAppCallInnerTransactionFees ? await this.getSuggestedParams() : undefined

    if (waitRounds === undefined) {
      const lastRound = group.reduce((max, txn) => (txn.txn.lastValid > max ? txn.txn.lastValid : BigInt(max)), 0n)
      const { lastRound: firstRound } = suggestedParams! // TODO: document suggested params doesn't have first round anymore
      waitRounds = Number(BigInt(lastRound) - BigInt(firstRound)) + 1
    }

    try {
      return await sendAtomicTransactionComposer(
        {
          atc: this.atc,
          suppressLog: params?.suppressLog,
          maxRoundsToWaitForConfirmation: waitRounds,
          populateAppCallResources: params?.populateAppCallResources,
          coverAppCallInnerTransactionFees: params?.coverAppCallInnerTransactionFees,
          additionalAtcContext: params?.coverAppCallInnerTransactionFees
            ? {
                maxFees: this.txnMaxFees,
                suggestedParams: suggestedParams!,
              }
            : undefined,
        },
        this.algod,
      )
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
    const { skipSignatures = false, ...rawOptions } = options ?? {}
    const atc = skipSignatures ? new AtomicTransactionComposer() : this.atc

    // Build the transactions
    if (skipSignatures) {
      rawOptions.allowEmptySignatures = true
      rawOptions.fixSigners = true
      // Build transactions uses empty signers
      const transactions = await this.buildTransactions()
      for (const txn of transactions.transactions) {
        atc.addTransaction({ txn, signer: TransactionComposer.NULL_SIGNER })
      }
      atc['methodCalls'] = transactions.methodCalls
    } else {
      // Build creates real signatures
      await this.build()
    }

    const { methodResults, simulateResponse } = await atc.simulate(this.algod, {
      txnGroups: [],
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
    } satisfies SimulateRequest)

    const failedGroup = simulateResponse?.txnGroups[0]
    if (failedGroup?.failureMessage) {
      const errorMessage = `Transaction failed at transaction(s) ${failedGroup.failedAt?.join(', ') || 'unknown'} in the group. ${failedGroup.failureMessage}`
      const error = new Error(errorMessage)

      if (Config.debug) {
        await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateResponse })
      }

      throw await this.transformError(error)
    }

    if (Config.debug && Config.traceAll) {
      await Config.events.emitAsync(EventType.TxnGroupSimulated, { simulateResponse })
    }

    const transactions = atc.buildGroup().map((t) => t.txn)
    const methodCalls = [...(atc['methodCalls'] as Map<number, ABIMethod>).values()]
    return {
      confirmations: simulateResponse.txnGroups[0].txnResults.map((t) => t.txnResult),
      transactions: transactions,
      txIds: transactions.map((t) => getTransactionId(t)),
      groupId: Buffer.from(transactions[0].group ?? new Uint8Array()).toString('base64'),
      simulateResponse,
      returns: methodResults.map((r, i) => getABIReturnValue(r, methodCalls[i]!.returns.type)),
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
