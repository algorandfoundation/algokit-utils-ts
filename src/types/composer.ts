import { ABIMethod, ABIReturn } from '@algorandfoundation/algokit-abi'
import {
  AlgodClient,
  PendingTransactionResponse,
  SimulateRequest,
  SimulateResponse,
  SimulateUnnamedResourcesAccessed,
  SuggestedParams,
} from '@algorandfoundation/algokit-algod-client'
import { EMPTY_SIGNATURE } from '@algorandfoundation/algokit-common'
import {
  OnApplicationComplete,
  SignedTransaction,
  Transaction,
  TransactionSigner,
  TransactionType,
  assignFee,
  calculateFee,
  decodeSignedTransaction,
  decodeTransaction,
  encodeSignedTransactions,
  encodeTransactionRaw,
  groupTransactions,
} from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Buffer } from 'buffer'
import { Config } from '../config'
import { TransactionWithSigner, waitForConfirmation } from '../transaction'
import {
  buildAppCall,
  buildAppCreate,
  buildAppUpdate,
  populateGroupResources,
  populateTransactionResources,
  type AppCallParams,
  type AppCreateParams,
  type AppDeleteParams,
  type AppUpdateParams,
} from '../transactions/app-call'
import {
  buildAssetOptIn,
  buildAssetOptOut,
  buildAssetTransfer,
  type AssetOptInParams,
  type AssetOptOutParams,
  type AssetTransferParams,
} from '../transactions/asset-transfer'

import { ReadableAddress } from '@algorandfoundation/algokit-common'
import {
  buildAssetConfig,
  buildAssetCreate,
  buildAssetDestroy,
  buildAssetFreeze,
  type AssetConfigParams,
  type AssetCreateParams,
  type AssetDestroyParams,
  type AssetFreezeParams,
} from '../transactions/asset-config'
import { FeeDelta, FeePriority, calculateInnerFeeDelta } from '../transactions/fee-coverage'
import { buildKeyReg, type OfflineKeyRegistrationParams, type OnlineKeyRegistrationParams } from '../transactions/key-registration'
import {
  AsyncTransactionParams,
  TransactionParams,
  buildAppCallMethodCall,
  buildAppCreateMethodCall,
  buildAppUpdateMethodCall,
  extractComposerTransactionsFromAppMethodCallParams,
  processAppMethodCallArgs,
  type AppCallMethodCall,
  type AppCreateMethodCall,
  type AppDeleteMethodCall,
  type AppUpdateMethodCall,
  type ProcessedAppCallMethodCall,
  type ProcessedAppCreateMethodCall,
  type ProcessedAppUpdateMethodCall,
} from '../transactions/method-call'
import { buildPayment, type PaymentParams } from '../transactions/payment'
import { asJson } from '../util'
import { AlgoAmount } from './amount'
import { AppManager } from './app-manager'
import { Expand } from './expand'
import { EventType } from './lifecycle-events'
import { genesisIdIsLocalNet } from './network-client'
import { Arc2TransactionNote, SendParams, SendTransactionComposerResults } from './transaction'

export const MAX_TRANSACTION_GROUP_SIZE = 16

// Re-export transaction parameter types
export type {
  AppCallParams,
  AppCreateParams,
  AppDeleteParams,
  AppMethodCallParams,
  AppUpdateParams,
  CommonAppCallParams,
} from '../transactions/app-call'
export type { AssetConfigParams, AssetCreateParams, AssetDestroyParams, AssetFreezeParams } from '../transactions/asset-config'
export type { AssetOptInParams, AssetOptOutParams, AssetTransferParams } from '../transactions/asset-transfer'
export type { CommonTransactionParams } from '../transactions/common'
export type { OfflineKeyRegistrationParams, OnlineKeyRegistrationParams } from '../transactions/key-registration'
export type {
  AppCallMethodCall,
  AppCreateMethodCall,
  AppDeleteMethodCall,
  AppMethodCall,
  AppMethodCallTransactionArgument,
  AppUpdateMethodCall,
  ProcessedAppCallMethodCall,
  ProcessedAppCreateMethodCall,
  ProcessedAppUpdateMethodCall,
} from '../transactions/method-call'
export type { PaymentParams } from '../transactions/payment'

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
export type RawSimulateOptions = Expand<Omit<SimulateRequest, 'txnGroups'>> & {
  /** Whether or not to return the result on simulation failure instead of throwing an error */
  resultOnFailure?: boolean
}

/** All options to control a simulate request */
export type SimulateOptions = Expand<Partial<SkipSignaturesSimulateOptions> & RawSimulateOptions>

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
  | { data: TransactionParams; type: 'txn' }
  | { data: AsyncTransactionParams; type: 'asyncTxn' }
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

type GroupAnalysis = {
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
  getSigner: (address: ReadableAddress) => algosdk.TransactionSigner
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
  methodCalls: Map<number, ABIMethod>
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
  private getSigner: (address: ReadableAddress) => algosdk.TransactionSigner

  /** The default transaction validity window */
  private defaultValidityWindow = 10n

  /** Whether the validity window was explicitly set on construction */
  private defaultValidityWindowIsExplicit = false

  private appManager: AppManager

  private errorTransformers: ErrorTransformer[]

  private composerConfig: TransactionComposerConfig

  private transactionsWithSigners?: TransactionWithSigner[]

  private signedTransactions?: SignedTransaction[]

  // Cache the raw transactions before resource population for error handling
  private rawBuildTransactions?: Transaction[]

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
    const defaultGetSuggestedParams = () => params.algod.suggestedParams()
    this.getSuggestedParams = params.getSuggestedParams ?? defaultGetSuggestedParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.defaultValidityWindowIsExplicit = params.defaultValidityWindow !== undefined
    this.appManager = params.appManager ?? new AppManager(params.algod)
    this.errorTransformers = params.errorTransformers ?? []
    this.composerConfig = params.composerConfig ?? {
      coverAppCallInnerTransactionFees: false,
      populateAppCallResources: true,
    }
  }

  private cloneTransaction(txn: Txn): Txn {
    // The transaction params aren't meant to be mutated therefore a shallow clone is ok here
    // Only exceptions are txn and asyncTxn where they are encoded, then decoded
    switch (txn.type) {
      case 'pay':
        return {
          type: 'pay',
          data: { ...txn.data },
        }
      case 'assetCreate':
        return {
          type: 'assetCreate',
          data: { ...txn.data },
        }
      case 'assetConfig':
        return {
          type: 'assetConfig',
          data: { ...txn.data },
        }
      case 'assetFreeze':
        return {
          type: 'assetFreeze',
          data: { ...txn.data },
        }
      case 'assetDestroy':
        return {
          type: 'assetDestroy',
          data: { ...txn.data },
        }
      case 'assetTransfer':
        return {
          type: 'assetTransfer',
          data: { ...txn.data },
        }
      case 'assetOptIn':
        return {
          type: 'assetOptIn',
          data: { ...txn.data },
        }
      case 'assetOptOut':
        return {
          type: 'assetOptOut',
          data: { ...txn.data },
        }
      case 'appCall':
        return {
          type: 'appCall',
          data: { ...txn.data },
        }
      case 'keyReg':
        return {
          type: 'keyReg',
          data: { ...txn.data },
        }
      case 'txn': {
        const { txn: transaction, signer, maxFee } = txn.data
        const encoded = encodeTransactionRaw(transaction)
        const clonedTxn = decodeTransaction(encoded)
        delete clonedTxn.group
        return {
          type: 'txn',
          data: {
            txn: clonedTxn,
            signer,
            maxFee,
          },
        }
      }
      case 'asyncTxn': {
        const { txn: txnPromise, signer, maxFee } = txn.data
        // Create a new promise that resolves to a deep cloned transaction without the group field
        const newTxnPromise = txnPromise.then((resolvedTxn) => {
          const encoded = encodeTransactionRaw(resolvedTxn)
          const clonedTxn = decodeTransaction(encoded)
          delete clonedTxn.group
          return clonedTxn
        })
        return {
          type: 'asyncTxn',
          data: {
            txn: newTxnPromise,
            signer,
            maxFee: maxFee,
          },
        }
      }
      case 'methodCall':
        return {
          type: 'methodCall',
          data: { ...txn.data },
        }
    }
  }

  private push(...txns: Txn[]): void {
    if (this.transactionsWithSigners) {
      throw new Error('Cannot add new transactions after building')
    }
    const newSize = this.txns.length + txns.length
    if (newSize > MAX_TRANSACTION_GROUP_SIZE) {
      throw new Error(
        `Adding ${txns.length} transaction(s) would exceed the maximum group size. Current: ${this.txns.length}, Maximum: ${MAX_TRANSACTION_GROUP_SIZE}`,
      )
    }
    this.txns.push(...txns)
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
      newComposer.txns.push(this.cloneTransaction(txn))
    })

    newComposer.defaultValidityWindowIsExplicit = this.defaultValidityWindowIsExplicit

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
    if (transaction.group) {
      throw new Error('Cannot add a transaction to the composer because it is already in a group')
    }
    this.push({
      data: {
        txn: transaction,
        signer: signer ?? this.getSigner(transaction.sender),
      },
      type: 'txn',
    })

    return this
  }

  /**
   * Add another transaction composer to the current transaction composer.
   * The transaction params of the input transaction composer will be added.
   * If the input transaction composer is updated, it won't affect the current transaction composer.
   * @param composer The transaction composer to add
   * @returns The composer so you can chain method calls
   * @example
   * ```typescript
   * const innerComposer = algorand.newGroup()
   *   .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (1).algo() })
   *   .addPayment({ sender: 'SENDER', receiver: 'RECEIVER', amount: (2).algo() })
   *
   * composer.addTransactionComposer(innerComposer)
   * ```
   */
  public addTransactionComposer(composer: TransactionComposer): TransactionComposer {
    const clonedTxns = composer.txns.map((txn) => this.cloneTransaction(txn))
    this.push(...clonedTxns)

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
    this.push({ data: params, type: 'pay' })

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
    this.push({ data: params, type: 'assetCreate' })

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
    this.push({ data: params, type: 'assetConfig' })

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
    this.push({ data: params, type: 'assetFreeze' })

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
    this.push({ data: params, type: 'assetDestroy' })

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
    this.push({ data: params, type: 'assetTransfer' })

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
    this.push({ data: params, type: 'assetOptIn' })

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
    this.push({ data: params, type: 'assetOptOut' })

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
    this.push({ data: params, type: 'appCall' })

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
    this.push({ data: { ...params, onComplete: OnApplicationComplete.UpdateApplication }, type: 'appCall' })

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
    this.push({ data: { ...params, onComplete: OnApplicationComplete.DeleteApplication }, type: 'appCall' })

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
    this.push({ data: params, type: 'appCall' })

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

    // Push all transaction arguments and the method call itself
    this.push(...txnArgs, {
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

    // Push all transaction arguments and the method call itself
    this.push(...txnArgs, {
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

    // Push all transaction arguments and the method call itself
    this.push(...txnArgs, {
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

    // Push all transaction arguments and the method call itself
    this.push(...txnArgs, {
      data: { ...params, args: processAppMethodCallArgs(params.args) },
      type: 'methodCall',
    })

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
    this.push({ data: params, type: 'keyReg' })

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
    this.push({ data: params, type: 'keyReg' })

    return this
  }

  /**
   * Get the number of transactions currently added to this composer.
   * @returns The number of transactions currently added to this composer
   */
  count() {
    return this.txns.length
  }

  /**
   * Build the transaction composer.
   *
   * This method performs resource population and inner transaction fee coverage if these options are set in the composer.
   *
   * Once this method is called, no further transactions will be able to be added.
   * You can safely call this method multiple times to get the same result.
   * @returns The built transaction composer, the transactions and any corresponding method calls
   * @example
   * ```typescript
   * const { transactions, methodCalls } = await composer.build()
   * ```
   */
  public async build() {
    if (!this.transactionsWithSigners) {
      const suggestedParams = await this.getSuggestedParams()
      const builtTransactions = await this._buildTransactions(suggestedParams)

      // Cache the raw transactions before resource population for error handling
      this.rawBuildTransactions = builtTransactions.transactions

      const groupAnalysis =
        (this.composerConfig.coverAppCallInnerTransactionFees || this.composerConfig.populateAppCallResources) &&
        builtTransactions.transactions.some((txn) => txn.type === TransactionType.AppCall)
          ? await this.analyzeGroupRequirements(builtTransactions.transactions, suggestedParams, this.composerConfig)
          : undefined

      this.populateTransactionAndGroupResources(builtTransactions.transactions, groupAnalysis)

      this.transactionsWithSigners = builtTransactions.transactions.map((txn, index) => {
        return {
          txn,
          signer: builtTransactions.signers.get(index) ?? this.getSigner(txn.sender),
        }
      })
    }

    const methodCalls = new Map<number, ABIMethod>()
    this.txns.forEach((txn, index) => {
      if (txn.type === 'methodCall') {
        methodCalls.set(index, txn.data.method)
      }
    })

    return {
      transactions: this.transactionsWithSigners,
      methodCalls,
    }
  }

  private async _buildTransactions(suggestedParams: SuggestedParams) {
    const defaultValidityWindow =
      !this.defaultValidityWindowIsExplicit && genesisIdIsLocalNet(suggestedParams.genesisId ?? 'unknown')
        ? 1000n
        : this.defaultValidityWindow
    const signers = new Map<number, algosdk.TransactionSigner>()
    const transactions = new Array<Transaction>()

    let transactionIndex = 0
    for (const ctxn of this.txns) {
      if (ctxn.type === 'txn') {
        transactions.push(ctxn.data.txn)
        if (ctxn.data.signer) {
          signers.set(transactionIndex, ctxn.data.signer)
        }
        transactionIndex++
      } else if (ctxn.type === 'asyncTxn') {
        transactions.push(await ctxn.data.txn)
        if (ctxn.data.signer) {
          signers.set(transactionIndex, ctxn.data.signer)
        }
        transactionIndex++
      } else {
        let transaction: Transaction

        switch (ctxn.type) {
          case 'pay':
            transaction = buildPayment(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetCreate':
            transaction = buildAssetCreate(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetConfig':
            transaction = buildAssetConfig(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetFreeze':
            transaction = buildAssetFreeze(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetDestroy':
            transaction = buildAssetDestroy(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetTransfer':
            transaction = buildAssetTransfer(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetOptIn':
            transaction = buildAssetOptIn(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'assetOptOut':
            transaction = buildAssetOptOut(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'appCall':
            if (!('appId' in ctxn.data)) {
              transaction = await buildAppCreate(ctxn.data, this.appManager, suggestedParams, defaultValidityWindow)
            } else if ('approvalProgram' in ctxn.data && 'clearStateProgram' in ctxn.data) {
              transaction = await buildAppUpdate(ctxn.data, this.appManager, suggestedParams, defaultValidityWindow)
            } else {
              transaction = buildAppCall(ctxn.data, suggestedParams, defaultValidityWindow)
            }
            break
          case 'keyReg':
            transaction = buildKeyReg(ctxn.data, suggestedParams, defaultValidityWindow)
            break
          case 'methodCall':
            if (!('appId' in ctxn.data)) {
              transaction = await buildAppCreateMethodCall(ctxn.data, this.appManager, suggestedParams, defaultValidityWindow)
            } else if ('approvalProgram' in ctxn.data && 'clearStateProgram' in ctxn.data) {
              transaction = await buildAppUpdateMethodCall(ctxn.data, this.appManager, suggestedParams, defaultValidityWindow)
            } else {
              transaction = await buildAppCallMethodCall(ctxn.data, suggestedParams, defaultValidityWindow)
            }
            break
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error(`Unsupported transaction type: ${(ctxn as any).type}`)
        }

        if (transaction.fee === undefined) {
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
          signers.set(transactionIndex, signer)
        }
        transactionIndex++
      }
    }

    // Validate that the total group size doesn't exceed the maximum
    if (transactions.length > MAX_TRANSACTION_GROUP_SIZE) {
      throw new Error(`Transaction group size ${transactions.length} exceeds the maximum limit of ${MAX_TRANSACTION_GROUP_SIZE}`)
    }

    const methodCalls = new Map<number, ABIMethod>()
    this.txns.forEach((txn, index) => {
      if (txn.type === 'methodCall') {
        methodCalls.set(index, txn.data.method)
      }
    })

    return { transactions, methodCalls, signers }
  }

  /**
   * Builds all transactions in the composer and returns them along with method calls and signers.
   *
   * Note: This method only builds the transactions as-is without resource population or automatic grouping.
   * Use this when you need the raw transactions.
   * @returns An object containing the array of built transactions, method calls, and signers
   * @example
   * ```typescript
   * const { transactions, methodCalls, signers } = await composer.buildTransactions()
   * ```
   */
  public async buildTransactions(): Promise<BuiltTransactions> {
    const suggestedParams = await this.getSuggestedParams()
    const buildResult = await this._buildTransactions(suggestedParams)
    return {
      ...buildResult,
      transactions: buildResult.transactions,
    }
  }

  private populateTransactionAndGroupResources(transactions: Transaction[], groupAnalysis?: GroupAnalysis): Transaction[] {
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

  private async analyzeGroupRequirements(
    transactions: Transaction[],
    suggestedParams: SuggestedParams,
    analysisParams: TransactionComposerConfig,
  ): Promise<GroupAnalysis> {
    const appCallIndexesWithoutMaxFees: number[] = []

    let transactionsToSimulate = transactions.map((txn, groupIndex) => {
      const ctxn = this.txns[groupIndex]
      const params = txn.toParams()
      delete params.group
      if (analysisParams.coverAppCallInnerTransactionFees && txn.type === TransactionType.AppCall) {
        const logicalMaxFee = getLogicalMaxFee(ctxn)
        if (logicalMaxFee !== undefined) {
          params.fee = logicalMaxFee
        } else {
          appCallIndexesWithoutMaxFees.push(groupIndex)
        }
      }

      return new Transaction(params)
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
      allowMoreLogging: true,
      execTraceConfig: {
        enable: true,
        scratchChange: true,
        stackChange: true,
        stateChange: true,
      },
    }

    const response = await this.algod.simulateTransactions(simulateRequest)
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
   * @returns The newly built transaction composer and the transactions
   * @example
   * ```typescript
   * const { atc, transactions, methodCalls } = await composer.rebuild()
   * ```
   */
  async rebuild() {
    this.reset()
    return await this.build()
  }

  private reset() {
    this.signedTransactions = undefined
    this.transactionsWithSigners = undefined
  }

  /**
   * Compose the transaction group and send it to the network.
   * @param params The parameters to control execution with
   * @returns The execution result
   * @example
   * ```typescript
   * const result = await composer.send()
   * ```
   */
  async send(params?: SendParams): Promise<SendTransactionComposerResults> {
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

      this.reset()
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
      const transactionIds = transactionsToSend.map((txn) => txn.txID())

      if (transactionsToSend.length > 1) {
        const groupId = transactionsToSend[0].group ? Buffer.from(transactionsToSend[0].group).toString('base64') : ''
        Config.getLogger(params?.suppressLog).verbose(`Sending group of ${transactionsToSend.length} transactions (${groupId})`, {
          transactionsToSend,
        })

        Config.getLogger(params?.suppressLog).debug(`Transaction IDs (${groupId})`, transactionIds)
      }

      if (Config.debug && Config.traceAll) {
        await this.simulate({
          allowEmptySignatures: true,
          fixSigners: true,
          allowMoreLogging: true,
          execTraceConfig: {
            enable: true,
            scratchChange: true,
            stackChange: true,
            stateChange: true,
          },
          resultOnFailure: true,
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
          `Group transaction (${Buffer.from(group).toString('base64')}) sent with ${transactionsToSend.length} transactions`,
        )
      } else {
        Config.getLogger(params?.suppressLog).verbose(
          `Sent transaction ID ${transactionsToSend[0].txID()} ${transactionsToSend[0].type} from ${transactionsToSend[0].sender}`,
        )
      }

      let confirmations = new Array<PendingTransactionResponse>()
      if (params?.maxRoundsToWaitForConfirmation !== 0) {
        confirmations = await Promise.all(transactionIds.map(async (id) => await waitForConfirmation(id, waitRounds, this.algod)))
      }

      const abiReturns = this.parseAbiReturnValues(confirmations)

      return {
        groupId: group ? Buffer.from(group).toString('base64') : undefined,
        transactions: transactionsToSend,
        txIds: transactionIds,
        returns: abiReturns,
        confirmations: confirmations,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (originalError: any) {
      const errorMessage = originalError.body?.message ?? originalError.message ?? 'Received error executing Transaction Composer'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = new Error(errorMessage) as any
      err.cause = originalError

      if (typeof originalError === 'object') {
        err.name = originalError.name
      }

      // Resolve transactions for error handling - use transactionsWithSigners if available,
      // otherwise fall back to rawBuildTransactions
      let sentTransactions: Transaction[] | undefined
      if (this.transactionsWithSigners) {
        sentTransactions = this.transactionsWithSigners.map((t) => t.txn)
      } else if (this.rawBuildTransactions) {
        sentTransactions = this.rawBuildTransactions.length > 1 ? groupTransactions(this.rawBuildTransactions) : this.rawBuildTransactions
      }

      if (Config.debug && typeof originalError === 'object' && sentTransactions) {
        err.traces = []
        Config.getLogger(params?.suppressLog).error(
          'Received error executing Transaction Composer and debug flag enabled; attempting simulation to get more information',
          err,
        )

        const transactionsWithEmptySigners: TransactionWithSigner[] = sentTransactions.map((txn) => ({
          txn,
          signer: algosdk.makeEmptyTransactionSigner(),
        }))
        const signedTransactions = await this.signTransactions(transactionsWithEmptySigners)
        const simulateResponse = await this.algod.simulateTransactions({
          txnGroups: [{ txns: signedTransactions }],
          allowEmptySignatures: true,
          fixSigners: true,
          allowMoreLogging: true,
          execTraceConfig: {
            enable: true,
            scratchChange: true,
            stackChange: true,
            stateChange: true,
          },
        })

        if (Config.debug && !Config.traceAll) {
          // Emit the event only if traceAll: false, as it should have already been emitted above
          await Config.events.emitAsync(EventType.TxnGroupSimulated, {
            simulateResponse,
          })
        }

        if (simulateResponse && simulateResponse.txnGroups[0].failedAt) {
          for (const txn of simulateResponse.txnGroups[0].txnResults) {
            err.traces.push({
              trace: txn.execTrace,
              appBudget: txn.appBudgetConsumed,
              logicSigBudget: txn.logicSigBudgetConsumed,
              logs: txn.txnResult.logs,
              message: simulateResponse.txnGroups[0].failureMessage,
            })
          }
        }
      } else {
        Config.getLogger(params?.suppressLog).error(
          'Received error executing Transaction Composer, for more information enable the debug flag',
          err,
        )
      }

      // Attach the sent transactions so we can use them in error transformers
      err.sentTransactions = sentTransactions ?? []

      throw await this.transformError(err)
    }
  }

  /**
   * Compose the transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate()
   * ```
   */
  async simulate(): Promise<SendTransactionComposerResults & { simulateResponse: SimulateResponse }>
  /**
   * Compose the transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate({
   *   skipSignatures: true,
   * })
   * ```
   */
  async simulate(options: SkipSignaturesSimulateOptions): Promise<SendTransactionComposerResults & { simulateResponse: SimulateResponse }>
  /**
   * Compose the transaction group and simulate sending it to the network
   * @returns The simulation result
   * @example
   * ```typescript
   * const result = await composer.simulate({
   *   extraOpcodeBudget: 1000,
   * })
   * ```
   */
  async simulate(options: RawSimulateOptions): Promise<SendTransactionComposerResults & { simulateResponse: SimulateResponse }>
  async simulate(options?: SimulateOptions): Promise<SendTransactionComposerResults & { simulateResponse: SimulateResponse }> {
    const { skipSignatures = false, resultOnFailure = false, ...rawOptions } = options ?? {}

    if (skipSignatures) {
      rawOptions.allowEmptySignatures = true
      rawOptions.fixSigners = true
    }

    let transactionsWithSigner: TransactionWithSigner[]
    if (!this.transactionsWithSigners) {
      const builtTransactions = await this.buildTransactions()
      const transactions =
        builtTransactions.transactions.length > 0 ? groupTransactions(builtTransactions.transactions) : builtTransactions.transactions

      transactionsWithSigner = transactions.map((txn, index) => ({
        txn: txn,
        signer: skipSignatures
          ? algosdk.makeEmptyTransactionSigner()
          : (builtTransactions.signers.get(index) ?? algosdk.makeEmptyTransactionSigner()),
      }))
    } else {
      transactionsWithSigner = this.transactionsWithSigners.map((e) => ({
        txn: e.txn,
        signer: skipSignatures ? algosdk.makeEmptyTransactionSigner() : e.signer,
      }))
    }

    const transactions = transactionsWithSigner.map((e) => e.txn)
    const signedTransactions = await this.signTransactions(transactionsWithSigner)

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

    const simulateResponse = await this.algod.simulateTransactions(simulateRequest)
    const simulateResult = simulateResponse.txnGroups[0]

    if (simulateResult?.failureMessage && !resultOnFailure) {
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
      confirmations: simulateResult.txnResults.map((t) => t.txnResult),
      transactions: transactions,
      txIds: transactions.map((t) => t.txID()),
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
      const txn = this.txns[i]
      if (txn?.type !== 'methodCall') continue

      const method = txn.data.method
      if (method.returns.type !== 'void') {
        const abiReturn = AppManager.getABIReturn(confirmation, method)
        if (abiReturn !== undefined) {
          abiReturns.push(abiReturn)
        }
      }
    }

    return abiReturns
  }

  public setMaxFees(maxFees: Map<number, AlgoAmount>) {
    maxFees.forEach((_, index) => {
      if (index > this.txns.length - 1) {
        throw new Error(`Index ${index} is out of range. The composer only contains ${this.txns.length} transactions`)
      }
    })

    maxFees.forEach((maxFee, index) => {
      this.txns[index].data.maxFee = new AlgoAmount({ microAlgos: maxFee.microAlgos })
    })
  }
}

/** Get the logical maximum fee based on staticFee and maxFee */
function getLogicalMaxFee(ctxn: Txn): bigint | undefined {
  if (ctxn.type === 'txn' || ctxn.type === 'asyncTxn') {
    return undefined
  }

  const maxFee = ctxn.data.maxFee
  const staticFee = ctxn.data.staticFee

  if (maxFee !== undefined && (staticFee === undefined || maxFee.microAlgos > staticFee.microAlgos)) {
    return maxFee.microAlgos
  }
  return staticFee?.microAlgos
}
