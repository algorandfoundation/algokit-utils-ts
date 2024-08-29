import algosdk from 'algosdk'
import { encodeLease, encodeTransactionNote, sendAtomicTransactionComposer } from '../transaction/transaction'
import { Expand } from '../util'
import { TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { APP_PAGE_MAX_SIZE } from './app'
import { AppManager, BoxIdentifier, BoxReference } from './app-manager'
import { genesisIdIsLocalNet } from './network-client'
import { SendAtomicTransactionComposerResults } from './transaction'
import Transaction = algosdk.Transaction
import TransactionWithSigner = algosdk.TransactionWithSigner
import isTransactionWithSigner = algosdk.isTransactionWithSigner
import encodeAddress = algosdk.encodeAddress

export const MAX_TRANSACTION_GROUP_SIZE = 16

/** Common parameters for defining a transaction. */
export type CommonTransactionParams = {
  /** The address of the account sending the transaction. */
  sender: string
  /** The function used to sign transaction(s); if not specified then
   *  an attempt will be made to find a registered signer for the
   *  given `sender` or use a default signer (if configured).
   */
  signer?: algosdk.TransactionSigner | TransactionSignerAccount
  /** Change the signing key of the sender to the given address.
   *
   * **Warning:** Please be careful with this parameter and be sure to read the [official rekey guidance](https://developer.algorand.org/docs/get-details/accounts/rekey/).
   */
  rekeyTo?: string
  /** Note to attach to the transaction. Max of 1000 bytes. */
  note?: Uint8Array | string
  /** Prevent multiple transactions with the same lease being included within the validity window.
   *
   * A [lease](https://developer.algorand.org/articles/leased-transactions-securing-advanced-smart-contract-design/)
   *  enforces a mutually exclusive transaction (useful to prevent double-posting and other scenarios).
   */
  lease?: Uint8Array | string
  /** The static transaction fee. In most cases you want to use `extraFee` unless setting the fee to 0 to be covered by another transaction. */
  staticFee?: AlgoAmount
  /** The fee to pay IN ADDITION to the suggested fee. Useful for covering inner transaction fees. */
  extraFee?: AlgoAmount
  /** Throw an error if the fee for the transaction is more than this amount; prevents overspending on fees during high congestion periods. */
  maxFee?: AlgoAmount
  /** How many rounds the transaction should be valid for, if not specified then the registered default validity window will be used. */
  validityWindow?: number
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
  receiver: string
  /** Amount to send */
  amount: AlgoAmount
  /** If given, close the sender account and send the remaining balance to this address
   *
   * *Warning:* Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeRemainderTo?: string
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
  manager?: string

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
  reserve?: string

  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  freeze?: string

  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) at asset creation or subsequently set to empty by the manager the field is permanently empty.
   */
  clawback?: string
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
  manager: string | undefined
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
  reserve?: string
  /**
   * The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.
   *
   * If empty, freezing is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  freeze?: string
  /**
   * The address of the optional account that can clawback holdings of this asset from any account.
   *
   * **This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.
   *
   * If empty, clawback is not permitted.
   *
   * If not set (`undefined` or `""`) the field will become permanently empty.
   */
  clawback?: string
}

/** Parameters to define an asset freeze transaction. */
export type AssetFreezeParams = CommonTransactionParams & {
  /** The ID of the asset to freeze/unfreeze */
  assetId: bigint
  /** The address of the account to freeze or unfreeze */
  account: string
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
  receiver: string
  /** Optional address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget?: string
  /** Optional address of an account to close the asset position to.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeAssetTo?: string
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
  creator: string
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

// Not yet exposed because of bug in algosdk
// export type OfflineKeyRegistrationParams = CommonTransactionParams & {
//   /** Prevent this account from ever participating again. On network with rewards enabled, also disable rewards for this account */
//   preventAddressFromEverParticipatingAgain?: boolean
// }

/** Common parameters for defining an application call transaction. */
export type CommonAppCallParams = CommonTransactionParams & {
  /** ID of the application; 0 if the application is being created */
  appId: bigint
  /** The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call. */
  onComplete?: algosdk.OnApplicationComplete
  /** Application arguments */
  args?: Uint8Array[]
  /** Account references */
  accountReferences?: string[]
  /** App references */
  appReferences?: bigint[]
  /** Asset references */
  assetReferences?: bigint[]
  /** Box references - either the name identifier
   *  (which will be set against app ID of `0` i.e.
   *  the current app), or a box identifier with the
   *  name identifier and app ID.
   */
  boxReferences?: (BoxReference | BoxIdentifier)[]
}

export type AppCreateParams = Expand<
  Omit<CommonAppCallParams, 'appId'> & {
    /** The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. */
    onComplete?: Exclude<algosdk.OnApplicationComplete, algosdk.OnApplicationComplete.ClearStateOC>
    /** The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    clearProgram: string | Uint8Array
    /** The state schema for the app. This is immutable. */
    schema?: {
      /** The number of integers saved in global state */
      globalInts: number
      /** The number of byte slices saved in global state */
      globalByteSlices: number
      /** The number of integers saved in local state */
      localInts: number
      /** The number of byte slices saved in local state */
      localByteSlices: number
    }
    /** Number of extra pages required for the programs */
    extraPages?: number

    appId?: never
  }
>

export type AppUpdateParams = Expand<
  CommonAppCallParams & {
    onComplete?: algosdk.OnApplicationComplete.UpdateApplicationOC
    /** The program to execute for all OnCompletes other than ClearState as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    approvalProgram: string | Uint8Array
    /** The program to execute for ClearState OnComplete as raw teal (string) or compiled teal (base 64 encoded as a byte array (Uint8Array)) */
    clearProgram: string | Uint8Array
    /** Number of extra pages required for the programs */
    extraPages?: number

    schema?: never
  }
>

/** Parameters to define an application call transaction. */
export type AppCallParams = CommonAppCallParams & {
  /** The [on-complete](https://developer.algorand.org/docs/get-details/dapps/avm/teal/specification/#oncomplete) action of the call; defaults to no-op. */
  onComplete?: Exclude<algosdk.OnApplicationComplete, algosdk.OnApplicationComplete.UpdateApplicationOC>
  schema?: never
  extraPages?: never
  approvalProgram?: never
  clearProgram?: never
}

/** Parameters to define an application delete call transaction. */
export type AppDeleteParams = CommonAppCallParams & {
  onComplete?: algosdk.OnApplicationComplete.DeleteApplicationOC
}

export type AppCreateMethodCall = AppMethodCall<AppCreateParams>
export type AppUpdateMethodCall = AppMethodCall<AppUpdateParams>
export type AppDeleteMethodCall = AppMethodCall<AppDeleteParams>
export type AppCallMethodCall = AppMethodCall<AppCallParams>

export type AppMethodCall<T> = Expand<Omit<T, 'args'>> & {
  /** The ABI method to call */
  method: algosdk.ABIMethod
  /** Arguments to the ABI method, either:
   * * An ABI value
   * * A transaction with explicit signer
   * * A transaction (where the signer will be automatically assigned)
   * * An unawaited transaction (e.g. from algorand.transactions.transactionType())
   * * Another method call (via method call params object)
   */
  args?: (
    | algosdk.ABIValue
    | TransactionWithSigner
    | Transaction
    | Promise<Transaction>
    | AppMethodCall<AppCreateParams>
    | AppMethodCall<AppUpdateParams>
    | AppMethodCall<AppCallParams>
  )[]
}

type Txn =
  | (PaymentParams & { type: 'pay' })
  | (AssetCreateParams & { type: 'assetCreate' })
  | (AssetConfigParams & { type: 'assetConfig' })
  | (AssetFreezeParams & { type: 'assetFreeze' })
  | (AssetDestroyParams & { type: 'assetDestroy' })
  | (AssetTransferParams & { type: 'assetTransfer' })
  | (AssetOptInParams & { type: 'assetOptIn' })
  | (AssetOptOutParams & { type: 'assetOptOut' })
  | ((AppCallParams | AppCreateParams | AppUpdateParams) & { type: 'appCall' })
  | (OnlineKeyRegistrationParams & { type: 'keyReg' })
  | (algosdk.TransactionWithSigner & { type: 'txnWithSigner' })
  | { atc: algosdk.AtomicTransactionComposer; type: 'atc' }
  | ((AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall) & { type: 'methodCall' })

/** Parameters to configure transaction execution. */
export interface ExecuteParams {
  /** The number of rounds to wait for confirmation. By default until the latest lastValid has past. */
  maxRoundsToWaitForConfirmation?: number
  /** Whether to suppress log messages from transaction send, default: do not suppress. */
  suppressLog?: boolean
}

/** Parameters to create an `AlgoKitComposer`. */
export type AlgoKitComposerParams = {
  /** The algod client to use to get suggestedParams and send the transaction group */
  algod: algosdk.Algodv2
  /** The function used to get the TransactionSigner for a given address */
  getSigner: (address: string) => algosdk.TransactionSigner
  /** The method used to get SuggestedParams for transactions in the group */
  getSuggestedParams?: () => Promise<algosdk.SuggestedParams>
  /** How many rounds a transaction should be valid for by default; if not specified
   * then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).
   */
  defaultValidityWindow?: number
  /** An existing `AppManager` to use to manage app compilation and cache compilation results.
   *
   * If not specified than an ephemeral one will be created.
   */
  appManager?: AppManager
}

/** AlgoKit Composer helps you compose and execute transactions as a transaction group. */
export default class AlgoKitComposer {
  /** The ATC used to compose the group */
  private atc = new algosdk.AtomicTransactionComposer()

  /** Map of txid to ABI method */
  private txnMethodMap: Map<string, algosdk.ABIMethod> = new Map()

  /** Transactions that have not yet been composed */
  private txns: Txn[] = []

  /** The algod client used by the composer. */
  private algod: algosdk.Algodv2

  /** An async function that will return suggested params for the transaction. */
  private getSuggestedParams: () => Promise<algosdk.SuggestedParams>

  /** A function that takes in an address and return a signer function for that address. */
  private getSigner: (address: string) => algosdk.TransactionSigner

  /** The default transaction validity window */
  private defaultValidityWindow = 10

  /** Whether the validity window was explicitly set on construction */
  private defaultValidityWindowIsExplicit = false

  private appManager: AppManager

  /**
   * Create an `AlgoKitComposer`.
   * @param params The configuration for this composer
   */
  constructor(params: AlgoKitComposerParams) {
    this.algod = params.algod
    const defaultGetSuggestedParams = () => params.algod.getTransactionParams().do()
    this.getSuggestedParams = params.getSuggestedParams ?? defaultGetSuggestedParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.defaultValidityWindowIsExplicit = params.defaultValidityWindow !== undefined
    this.appManager = params.appManager ?? new AppManager(params.algod)
  }

  /**
   * Add a payment transaction to the transaction group.
   * @param params The payment transaction parameters
   * @returns The composer so you can chain method calls
   */
  addPayment(params: PaymentParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'pay' })

    return this
  }

  /**
   * Add an asset create transaction to the transaction group.
   * @param params The asset create transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetCreate(params: AssetCreateParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetCreate' })

    return this
  }

  /**
   * Add an asset config transaction to the transaction group.
   * @param params The asset config transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetConfig(params: AssetConfigParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetConfig' })

    return this
  }

  /**
   * Add an asset freeze transaction to the transaction group.
   * @param params The asset freeze transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetFreeze(params: AssetFreezeParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetFreeze' })

    return this
  }

  /**
   * Add an asset destroy transaction to the transaction group.
   * @param params The asset destroy transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetDestroy(params: AssetDestroyParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetDestroy' })

    return this
  }

  /**
   * Add an asset transfer transaction to the transaction group.
   * @param params The asset transfer transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetTransfer(params: AssetTransferParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetTransfer' })

    return this
  }

  /**
   * Add an asset opt-in transaction to the transaction group.
   * @param params The asset opt-in transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetOptIn(params: AssetOptInParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetOptIn' })

    return this
  }

  /**
   * Add an asset opt-out transaction to the transaction group.
   * @param params The asset opt-out transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAssetOptOut(params: AssetOptOutParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'assetOptOut' })

    return this
  }

  /**
   * Add an application create transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application create transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAppCreate(params: AppCreateParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'appCall' })

    return this
  }

  /**
   * Add an application update transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application update transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAppUpdate(params: AppUpdateParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'appCall', onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC })

    return this
  }

  /**
   * Add an application delete transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The application delete transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAppDelete(params: AppDeleteParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'appCall', onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC })

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
   */
  addAppCall(params: AppCallParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'appCall' })

    return this
  }

  /**
   * Add an ABI method create application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI create method application call transaction parameters
   * @returns The composer so you can chain method calls
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
   */
  addAppUpdateMethodCall(params: AppUpdateMethodCall) {
    this.txns.push({ ...params, type: 'methodCall', onComplete: algosdk.OnApplicationComplete.UpdateApplicationOC })
    return this
  }

  /**
   * Add an ABI method delete application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI delete method application call transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAppDeleteMethodCall(params: AppDeleteMethodCall) {
    this.txns.push({ ...params, type: 'methodCall', onComplete: algosdk.OnApplicationComplete.DeleteApplicationOC })
    return this
  }

  /**
   * Add a non-create/non-update ABI method application call transaction to the transaction group.
   *
   * Note: we recommend using app clients to make it easier to make app calls.
   * @param params The ABI method application call transaction parameters
   * @returns The composer so you can chain method calls
   */
  addAppCallMethodCall(params: AppCallMethodCall) {
    this.txns.push({ ...params, type: 'methodCall' })
    return this
  }

  /**
   * Add an online key registration transaction to the transaction group.
   * @param params The online key registration transaction parameters
   * @returns The composer so you can chain method calls
   */
  addOnlineKeyRegistration(params: OnlineKeyRegistrationParams): AlgoKitComposer {
    this.txns.push({ ...params, type: 'keyReg' })

    return this
  }

  /**
   * Add the transactions within an `AtomicTransactionComposer` to the transaction group.
   * @param atc The `AtomicTransactionComposer` to build transactions from and add to the group
   * @returns The composer so you can chain method calls
   */
  addAtc(atc: algosdk.AtomicTransactionComposer): AlgoKitComposer {
    this.txns.push({ atc, type: 'atc' })
    return this
  }

  /** Build an ATC and return transactions ready to be incorporated into a broader set of transactions this composer is composing */
  private buildAtc(
    atc: algosdk.AtomicTransactionComposer,
    processTransaction?: (txn: algosdk.Transaction, index: number) => algosdk.Transaction,
  ): algosdk.TransactionWithSigner[] {
    const group = atc.buildGroup()

    const txnWithSigners = group.map((ts, idx) => {
      // Remove underlying group ID from the transaction since it will be re-grouped when this AlgoKitComposer is built
      ts.txn.group = undefined
      // Process transaction if a function is provided
      ts.txn = processTransaction?.(ts.txn, idx) ?? ts.txn
      // If this was a method call stash the ABIMethod for later
      if (atc['methodCalls'].get(idx)) {
        this.txnMethodMap.set(ts.txn.txID(), atc['methodCalls'].get(idx))
      }
      return ts
    })

    return txnWithSigners
  }

  private commonTxnBuildStep(params: CommonTransactionParams, txn: algosdk.Transaction, suggestedParams: algosdk.SuggestedParams) {
    if (params.lease) txn.addLease(encodeLease(params.lease)!)
    if (params.rekeyTo) txn.addRekey(params.rekeyTo)
    if (params.note) txn.note = encodeTransactionNote(params.note)

    if (params.firstValidRound) {
      txn.firstRound = Number(params.firstValidRound)
    }

    if (params.lastValidRound) {
      txn.lastRound = Number(params.lastValidRound)
    } else {
      // If the validity window isn't set in this transaction or by default and we are pointing at
      //  LocalNet set a bigger window to avoid dead transactions
      const window =
        params.validityWindow ??
        (!this.defaultValidityWindowIsExplicit && genesisIdIsLocalNet(suggestedParams.genesisID) ? 1000 : this.defaultValidityWindow)
      txn.lastRound = txn.firstRound + window
    }

    if (params.staticFee !== undefined && params.extraFee !== undefined) {
      throw Error('Cannot set both staticFee and extraFee')
    }

    if (params.staticFee !== undefined) {
      txn.fee = params.staticFee.microAlgo
    } else {
      txn.fee = txn.estimateSize() * suggestedParams.fee || algosdk.ALGORAND_MIN_TX_FEE
      if (params.extraFee) txn.fee += params.extraFee.microAlgo
    }
    txn.flatFee = true

    if (params.maxFee !== undefined && txn.fee > params.maxFee.microAlgo) {
      throw Error(`Transaction fee ${txn.fee} is greater than maxFee ${params.maxFee}`)
    }

    return txn
  }

  private async buildMethodCall(
    params: AppCallMethodCall | AppCreateMethodCall | AppUpdateMethodCall,
    suggestedParams: algosdk.SuggestedParams,
    includeSigner: boolean,
  ): Promise<algosdk.TransactionWithSigner[]> {
    const methodArgs: algosdk.ABIArgument[] = []
    const isAbiValue = (x: unknown): x is algosdk.ABIValue => {
      if (Array.isArray(x)) return x.length == 0 || x.every(isAbiValue)

      return ['boolean', 'number', 'bigint', 'string', 'Uint8Array'].includes(typeof x)
    }

    for (const arg of params.args ?? []) {
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
        methodArgs.push(...tempTxnWithSigners)
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
            : this.getSigner(encodeAddress(txn.from.publicKey))
          : algosdk.makeEmptyTransactionSigner(),
      })
    }

    const methodAtc = new algosdk.AtomicTransactionComposer()

    const appId = Number('appId' in params ? params.appId : 0n)
    const approvalProgram =
      'approvalProgram' in params
        ? typeof params.approvalProgram === 'string'
          ? (await this.appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
          : params.approvalProgram
        : undefined
    const clearProgram =
      'clearProgram' in params
        ? typeof params.clearProgram === 'string'
          ? (await this.appManager.compileTeal(params.clearProgram)).compiledBase64ToBytes
          : params.clearProgram
        : undefined

    methodAtc.addMethodCall({
      appID: appId,
      sender: params.sender,
      suggestedParams,
      onComplete: params.onComplete ?? algosdk.OnApplicationComplete.NoOpOC,
      appAccounts: params.accountReferences,
      appForeignApps: params.appReferences?.map((x) => Number(x)),
      appForeignAssets: params.assetReferences?.map((x) => Number(x)),
      boxes: params.boxReferences?.map(AppManager.getBoxReference),
      approvalProgram,
      clearProgram,
      extraPages:
        'extraPages' in params && params.extraPages !== undefined
          ? params.extraPages
          : approvalProgram
            ? Math.floor((approvalProgram.length + (clearProgram?.length ?? 0)) / APP_PAGE_MAX_SIZE)
            : undefined,
      numLocalInts: ('schema' in params ? params.schema?.localInts : undefined) ?? (appId === 0 ? 0 : undefined),
      numLocalByteSlices: ('schema' in params ? params.schema?.localByteSlices : undefined) ?? (appId === 0 ? 0 : undefined),
      numGlobalInts: ('schema' in params ? params.schema?.globalInts : undefined) ?? (appId === 0 ? 0 : undefined),
      numGlobalByteSlices: ('schema' in params ? params.schema?.globalByteSlices : undefined) ?? (appId === 0 ? 0 : undefined),
      method: params.method,
      signer: params.signer ? ('signer' in params.signer ? params.signer.signer : params.signer) : this.getSigner(params.sender),
      methodArgs: methodArgs,
      // note, lease, and rekeyTo are set in the common build step
      note: undefined,
      lease: undefined,
      rekeyTo: undefined,
    })

    // Process the ATC to get a set of transactions ready for broader grouping
    //  and with the common build step to set fees and validity rounds
    return this.buildAtc(methodAtc, (txn, idx) =>
      idx === methodAtc.count() - 1 ? this.commonTxnBuildStep(params, txn, suggestedParams) : txn,
    )
  }

  private buildPayment(params: PaymentParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: params.sender,
      to: params.receiver,
      amount: params.amount.microAlgo,
      closeRemainderTo: params.closeRemainderTo,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetCreate(params: AssetCreateParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: params.sender,
      total: params.total,
      decimals: params.decimals ?? 0,
      assetName: params.assetName,
      unitName: params.unitName,
      assetURL: params.url,
      defaultFrozen: params.defaultFrozen ?? false,
      assetMetadataHash: params.metadataHash,
      manager: params.manager,
      reserve: params.reserve,
      freeze: params.freeze,
      clawback: params.clawback,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetConfig(params: AssetConfigParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: Number(params.assetId),
      suggestedParams,
      manager: params.manager,
      reserve: params.reserve,
      freeze: params.freeze,
      clawback: params.clawback,
      strictEmptyAddressChecking: false,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetDestroy(params: AssetDestroyParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: Number(params.assetId),
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetFreeze(params: AssetFreezeParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
      from: params.sender,
      assetIndex: Number(params.assetId),
      freezeTarget: params.account,
      freezeState: params.frozen,
      suggestedParams,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildAssetTransfer(params: AssetTransferParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: params.sender,
      to: params.receiver,
      assetIndex: Number(params.assetId),
      amount: params.amount,
      suggestedParams,
      closeRemainderTo: params.closeAssetTo,
      revocationTarget: params.clawbackTarget,
    })

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private async buildAppCall(params: AppCallParams | AppUpdateParams | AppCreateParams, suggestedParams: algosdk.SuggestedParams) {
    const appId = Number('appId' in params ? params.appId : 0n)
    const approvalProgram =
      'approvalProgram' in params
        ? typeof params.approvalProgram === 'string'
          ? (await this.appManager.compileTeal(params.approvalProgram)).compiledBase64ToBytes
          : params.approvalProgram
        : undefined
    const clearProgram =
      'clearProgram' in params
        ? typeof params.clearProgram === 'string'
          ? (await this.appManager.compileTeal(params.clearProgram)).compiledBase64ToBytes
          : params.clearProgram
        : undefined

    const sdkParams = {
      from: params.sender,
      suggestedParams,
      onComplete: params.onComplete ?? algosdk.OnApplicationComplete.NoOpOC,
      appAccounts: params.accountReferences,
      appForeignApps: params.appReferences?.map((x) => Number(x)),
      appForeignAssets: params.assetReferences?.map((x) => Number(x)),
      boxes: params.boxReferences?.map(AppManager.getBoxReference),
      approvalProgram,
      clearProgram,
      extraPages: 'extraPages' in params ? params.extraPages : undefined,
      numLocalInts: 'schema' in params ? params.schema?.localInts : undefined,
      numLocalByteSlices: 'schema' in params ? params.schema?.localByteSlices : undefined,
      numGlobalInts: 'schema' in params ? params.schema?.globalInts : undefined,
      numGlobalByteSlices: 'schema' in params ? params.schema?.globalByteSlices : undefined,
    }

    let txn: algosdk.Transaction

    if (appId === 0) {
      if (sdkParams.approvalProgram === undefined || sdkParams.clearProgram === undefined) {
        throw new Error('approvalProgram and clearProgram are required for application creation')
      }

      txn = algosdk.makeApplicationCreateTxnFromObject({
        ...sdkParams,
        onComplete: sdkParams.onComplete,
        numLocalInts: sdkParams.numLocalInts ?? 0,
        numLocalByteSlices: sdkParams.numLocalByteSlices ?? 0,
        numGlobalInts: sdkParams.numGlobalInts ?? 0,
        numGlobalByteSlices: sdkParams.numGlobalByteSlices ?? 0,
        approvalProgram: approvalProgram!,
        clearProgram: clearProgram!,
        extraPages: sdkParams.extraPages ?? Math.floor((approvalProgram!.length + clearProgram!.length) / APP_PAGE_MAX_SIZE),
      })
    } else {
      txn = algosdk.makeApplicationCallTxnFromObject({ ...sdkParams, appIndex: appId })
    }

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private buildKeyReg(params: OnlineKeyRegistrationParams, suggestedParams: algosdk.SuggestedParams) {
    const txn = algosdk.makeKeyRegistrationTxnWithSuggestedParams(
      params.sender,
      undefined,
      params.voteKey,
      params.selectionKey,
      Number(params.voteFirst),
      Number(params.voteLast),
      Number(params.voteKeyDilution),
      suggestedParams,
      undefined,
      false,
      params.stateProofKey,
    )

    return this.commonTxnBuildStep(params, txn, suggestedParams)
  }

  private async buildTxn(txn: Txn, suggestedParams: algosdk.SuggestedParams): Promise<algosdk.Transaction[]> {
    switch (txn.type) {
      case 'txnWithSigner':
        return [txn.txn]
      case 'atc':
        return this.buildAtc(txn.atc).map((ts) => ts.txn)
      case 'methodCall':
        return (await this.buildMethodCall(txn, suggestedParams, false)).map((ts) => ts.txn)
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

  private async buildTxnWithSigner(txn: Txn, suggestedParams: algosdk.SuggestedParams): Promise<algosdk.TransactionWithSigner[]> {
    if (txn.type === 'txnWithSigner') {
      return [txn]
    }

    if (txn.type === 'atc') {
      return this.buildAtc(txn.atc)
    }

    if (txn.type === 'methodCall') {
      return await this.buildMethodCall(txn, suggestedParams, true)
    }

    const signer = txn.signer ? ('signer' in txn.signer ? txn.signer.signer : txn.signer) : this.getSigner(txn.sender)

    return (await this.buildTxn(txn, suggestedParams)).map((txn) => ({ txn, signer }))
  }

  /**
   * Compose all of the transactions without signers and return the transaction objects directly along with any ABI method calls.
   *
   * @returns The array of built transactions and any corresponding method calls
   */
  async buildTransactions() {
    const suggestedParams = await this.getSuggestedParams()

    const transactions: algosdk.Transaction[] = []

    for (const txn of this.txns) {
      transactions.push(...(await this.buildTxn(txn, suggestedParams)))
    }

    const methodCalls = new Map<number, algosdk.ABIMethod>()
    for (let i = 0; i < transactions.length; i++) {
      const method = this.txnMethodMap.get(transactions[i].txID())
      if (method) methodCalls.set(i, method)
    }

    return { transactions, methodCalls }
  }

  /**
   * Compose all of the transactions in a single atomic transaction group and an atomic transaction composer.
   *
   * You can then use the transactions standalone, or use the composer to execute or simulate the transactions.
   * @returns The built atomic transaction composer and the transactions
   */
  async build() {
    if (this.atc.getStatus() === algosdk.AtomicTransactionComposerStatus.BUILDING) {
      const suggestedParams = await this.getSuggestedParams()

      // Build all of the transactions
      const txnWithSigners: algosdk.TransactionWithSigner[] = []
      for (const txn of this.txns) {
        txnWithSigners.push(...(await this.buildTxnWithSigner(txn, suggestedParams)))
      }

      // Add all of the transactions to the underlying ATC
      const methodCalls = new Map<number, algosdk.ABIMethod>()
      txnWithSigners.forEach((ts, idx) => {
        this.atc.addTransaction(ts)
        // Populate consolidated set of all ABI method calls
        const method = this.txnMethodMap.get(ts.txn.txID())
        if (method) methodCalls.set(idx, method)
      })
      this.atc['methodCalls'] = methodCalls
    }

    return { atc: this.atc, transactions: this.atc.buildGroup(), methodCalls: this.atc['methodCalls'] }
  }

  /**
   * Rebuild the group, discarding any previously built transactions.
   * This will potentially cause new signers and suggested params to be used if the callbacks return a new value compared to the first build.
   * @returns The newly built atomic transaction composer and the transactions
   */
  async rebuild() {
    this.atc = new algosdk.AtomicTransactionComposer()
    return await this.build()
  }

  /**
   * Compose the atomic transaction group and send it to the network
   * @param params The parameters to control execution with
   * @returns The execution result
   */
  async execute(params?: ExecuteParams): Promise<SendAtomicTransactionComposerResults> {
    const group = (await this.build()).transactions

    let waitRounds = params?.maxRoundsToWaitForConfirmation
    if (waitRounds === undefined) {
      const lastRound = group.reduce((max, txn) => Math.max(txn.txn.lastRound, max), 0)
      const { firstRound } = await this.getSuggestedParams()
      waitRounds = lastRound - firstRound + 1
    }

    return await sendAtomicTransactionComposer(
      {
        atc: this.atc,
        sendParams: { suppressLog: params?.suppressLog, maxRoundsToWaitForConfirmation: waitRounds },
      },
      this.algod,
    )
  }
}
