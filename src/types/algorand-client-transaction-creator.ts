import algosdk from 'algosdk'
import AlgoKitComposer, { MethodCallParams } from './composer'

import Transaction = algosdk.Transaction

/** Orchestrates creating transactions for `AlgorandClient`. */
export class AlgorandClientTransactionCreator {
  private _newGroup: () => AlgoKitComposer

  /**
   * Creates a new `AlgorandClientTransactionCreator`
   * @param newGroup A lambda that starts a new `AlgoKitComposer` transaction group
   */
  constructor(newGroup: () => AlgoKitComposer) {
    this._newGroup = newGroup
  }

  private _transaction<T>(c: (c: AlgoKitComposer) => (params: T) => AlgoKitComposer): (params: T) => Promise<Transaction> {
    return async (params: T) => {
      const composer = this._newGroup()
      const result = await c(composer).apply(composer, [params]).buildTransactions()
      return result[result.length - 1]
    }
  }

  /**
   * Create a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @example Basic example
   * ```typescript
   * const result = await algorandClient.send.payment({
   *  sender: 'SENDERADDRESS',
   *  receiver: 'RECEIVERADDRESS',
   *  amount: (4).algos(),
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * const result = await algorandClient.send.payment({
   *   amount: (4).algos(),
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
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   *
   * @returns The payment transaction
   */
  payment = this._transaction((c) => c.addPayment)
  /** Create a create Algorand Standard Asset transaction.
   *
   * The account that sends this transaction will automatically be
   * opted in to the asset and will hold all units after creation.
   *
   * @param params The parameters for the asset creation transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetCreate({sender: "CREATORADDRESS", total: 100n})
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetCreate({
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
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
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
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetConfig({
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
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The asset config transaction
   */
  assetConfig = this._transaction((c) => c.addAssetConfig)
  /** Create an Algorand Standard Asset freeze transaction.
   *
   * @param params The parameters for the asset freeze transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetFreeze({
   *   sender: 'MANAGERADDRESS',
   *   assetId: 123456n,
   *   account: 'ACCOUNTADDRESS',
   *   frozen: true,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The asset freeze transaction
   */
  assetFreeze = this._transaction((c) => c.addAssetFreeze)
  /** Create an Algorand Standard Asset destroy transaction.
   *
   * Created assets can be destroyed only by the asset manager account.
   * All of the assets must be owned by the creator of the asset before
   * the asset can be deleted.
   *
   * @param params The parameters for the asset destroy transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetDestroy({
   *   sender: 'MANAGERADDRESS',
   *   assetId: 123456n,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The asset destroy transaction
   */
  assetDestroy = this._transaction((c) => c.addAssetDestroy)
  /** Create an Algorand Standard Asset transfer transaction.
   *
   * @param params The parameters for the asset transfer transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
   * ```
   * @example Advanced example (with clawback)
   * ```typescript
   * await algorand.transaction.assetTransfer({
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
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The result of the asset transfer transaction
   */
  assetTransfer = this._transaction((c) => c.addAssetTransfer)
  /** Create an Algorand Standard Asset opt-in transaction.
   *
   * @param params The parameters for the asset opt-in transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetOptIn({
   *   sender: 'SENDERADDRESS',
   *   assetId: 123456n,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The asset opt-in transaction
   */
  assetOptIn = this._transaction((c) => c.addAssetOptIn)
  /** Create an asset opt-out transaction.
   *
   * *Note:* If the account has a balance of the asset,
   * it will lose those assets
   *
   * @param params The parameters for the asset opt-out transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.transaction.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.transaction.assetOptIn({
   *   sender: 'SENDERADDRESS',
   *   assetId: 123456n,
   *   creator: 'CREATORADDRESS',
   *   ensureZeroBalance: true,
   *   lease: 'lease',
   *   note: 'note',
   *   // You wouldn't normally set this field
   *   firstValidRound: 1000n,
   *   validityWindow: 10,
   *   extraFee: (1000).microAlgos(),
   *   staticFee: (1000).microAlgos(),
   *   // Max fee doesn't make sense with extraFee AND staticFee
   *   //  already specified, but here for completeness
   *   maxFee: (3000).microAlgos(),
   * })
   * ```
   * @returns The asset opt-out transaction
   */
  assetOptOut = this._transaction((c) => c.addAssetOptOut)
  /** Create an application call transaction. */
  appCall = this._transaction((c) => c.addAppCall)
  /** Create an application call with ABI method call transaction. */
  methodCall = async (params: MethodCallParams) => {
    return await this._newGroup().addMethodCall(params).buildTransactions()
  }
  /** Create an online key registration transaction. */
  onlineKeyRegistration = this._transaction((c) => c.addOnlineKeyRegistration)
}
