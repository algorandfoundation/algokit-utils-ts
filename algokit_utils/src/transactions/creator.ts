import { Transaction } from '@algorandfoundation/algokit-transact'
import { TransactionComposer, TransactionComposerConfig } from './composer'

/** Creates Algorand transactions. */
export class TransactionCreator {
  private _newComposer: (params?: TransactionComposerConfig) => TransactionComposer

  constructor(newComposer: (params?: TransactionComposerConfig) => TransactionComposer) {
    this._newComposer = newComposer
  }

  private _transaction<T>(addTransactionGetter: (c: TransactionComposer) => (params: T) => void): (params: T) => Promise<Transaction> {
    return async (params: T) => {
      const composer = this._newComposer()
      addTransactionGetter(composer).apply(composer, [params])
      const txs = await composer.build()
      const tx = txs.at(-1)?.transaction
      return tx!
    }
  }

  private _transactions<T>(addTransactionGetter: (c: TransactionComposer) => (params: T) => void): (params: T) => Promise<Transaction[]> {
    return async (params: T) => {
      const composer = this._newComposer()
      addTransactionGetter(composer).apply(composer, [params])
      const txs = await composer.build()
      return txs.map((t) => t.transaction)
    }
  }

  /**
   * Create a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @returns The payment transaction
   */
  payment = this._transaction((c) => c.addPayment)

  /**
   * Create an account close transaction to close an account and transfer all remaining funds.
   * @param params The parameters for the account close transaction
   * @returns The account close transaction
   */
  accountClose = this._transaction((c) => c.addAccountClose)

  /** Create an Algorand Standard Asset transfer transaction.
   *
   * @param params The parameters for the asset transfer transaction
   * @returns The asset transfer transaction
   */
  assetTransfer = this._transaction((c) => c.addAssetTransfer)

  /** Create an Algorand Standard Asset opt-in transaction.
   *
   * @param params The parameters for the asset opt-in transaction
   * @returns The asset opt-in transaction
   */
  assetOptIn = this._transaction((c) => c.addAssetOptIn)

  /** Create an asset opt-out transaction.
   *
   * **Note:** If the account has a balance of the asset, it will lose those assets
   *
   * @param params The parameters for the asset opt-out transaction
   * @returns The asset opt-out transaction
   */
  assetOptOut = this._transaction((c) => c.addAssetOptOut)

  /**
   * Create an Algorand Standard Asset clawback transaction.
   * @param params The parameters for the asset clawback transaction
   * @returns The asset clawback transaction
   */
  assetClawback = this._transaction((c) => c.addAssetClawback)

  /** Create a create Algorand Standard Asset transaction.
   *
   * The account that sends this transaction will automatically be
   * opted in to the asset and will hold all units after creation.
   *
   * @param params The parameters for the asset creation transaction
   * @returns The asset create transaction
   */
  assetCreate = this._transaction((c) => c.addAssetCreate)

  /** Create an asset config transaction to reconfigure an existing Algorand Standard Asset.
   *
   * **Note:** The manager, reserve, freeze, and clawback addresses
   * are immutably empty if they are not set. If manager is not set then
   * all fields are immutable from that point forward.
   *
   * @param params The parameters for the asset config transaction
   * @returns The asset config transaction
   */
  assetConfig = this._transaction((c) => c.addAssetConfig)

  /** Create an Algorand Standard Asset destroy transaction.
   *
   * Created assets can be destroyed only by the asset manager account.
   * All of the assets must be owned by the creator of the asset before
   * the asset can be deleted.
   *
   * @param params The parameters for the asset destroy transaction
   * @returns The asset destroy transaction
   */
  assetDestroy = this._transaction((c) => c.addAssetDestroy)

  /** Create an Algorand Standard Asset freeze transaction.
   *
   * @param params The parameters for the asset freeze transaction
   * @returns The asset freeze transaction
   */
  assetFreeze = this._transaction((c) => c.addAssetFreeze)

  /**
   * Create an Algorand Standard Asset unfreeze transaction.
   * @param params The parameters for the asset unfreeze transaction
   * @returns The asset unfreeze transaction
   */
  assetUnfreeze = this._transaction((c) => c.addAssetUnfreeze)

  /**
   * Create an online key registration transaction.
   * @param params The parameters for the key registration transaction
   * @returns The online key registration transaction
   */
  onlineKeyRegistration = this._transaction((c) => c.addOnlineKeyRegistration)

  /**
   * Create an offline key registration transaction.
   * @param params The parameters for the key registration transaction
   * @returns The offline key registration transaction
   */
  offlineKeyRegistration = this._transaction((c) => c.addOfflineKeyRegistration)

  /**
   * Create a non-participation key registration transaction.
   * @param params The parameters for the non-participation key registration transaction
   * @returns The non participating key registration transaction
   */
  nonParticipationKeyRegistration = this._transaction((c) => c.addNonParticipationKeyRegistration)

  /** Create an application call transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app call transaction
   * @returns The application call transaction
   */
  appCall = this._transaction((c) => c.addAppCall)

  /** Create an application create transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app creation transaction
   * @returns The application create transaction
   */
  appCreate = this._transaction((c) => c.addAppCreate)

  /** Create an application update transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app update transaction
   * @returns The application update transaction
   */
  appUpdate = this._transaction((c) => c.addAppUpdate)

  /** Create an application delete transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app deletion transaction
   * @returns The application delete transaction
   */
  appDelete = this._transaction((c) => c.addAppDelete)

  /** Create an application call with ABI method call transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the ABI method call transaction
   * @returns The application ABI method call transaction
   */
  appCallMethodCall = this._transactions((c) => c.addAppCallMethodCall)

  /** Create an application create call with ABI method call transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the ABI method creation transaction
   * @returns The application ABI method create transaction
   */
  appCreateMethodCall = this._transactions((c) => c.addAppCreateMethodCall)

  /** Create an application update call with ABI method call transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the ABI method update transaction
   * @returns The application ABI method update transaction
   */
  appUpdateMethodCall = this._transactions((c) => c.addAppUpdateMethodCall)

  /** Create an application delete call with ABI method call transaction.
   *
   * **Note**: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the ABI method deletion transaction
   * @returns The application ABI method delete transaction
   */
  appDeleteMethodCall = this._transactions((c) => c.addAppDeleteMethodCall)
}
