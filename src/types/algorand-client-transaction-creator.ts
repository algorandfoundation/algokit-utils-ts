import algosdk from 'algosdk'
import { BuiltTransactions, TransactionComposer } from './composer'
import { Expand } from './expand'

import Transaction = algosdk.Transaction

/** Orchestrates creating transactions for `AlgorandClient`. */
export class AlgorandClientTransactionCreator {
  private _newGroup: () => TransactionComposer

  /**
   * Creates a new `AlgorandClientTransactionCreator`
   * @param newGroup A lambda that starts a new `TransactionComposer` transaction group
   * @example
   * ```typescript
   * const transactionCreator = new AlgorandClientTransactionCreator(() => new TransactionComposer())
   * ```
   */
  constructor(newGroup: () => TransactionComposer) {
    this._newGroup = newGroup
  }

  private _transaction<T>(c: (c: TransactionComposer) => (params: T) => TransactionComposer): (params: T) => Promise<Transaction> {
    return async (params: T) => {
      const composer = this._newGroup()
      const result = await c(composer).apply(composer, [params]).buildTransactions()
      return result.transactions.at(-1)!
    }
  }

  private _transactions<T>(
    c: (c: TransactionComposer) => (params: T) => TransactionComposer,
  ): (params: T) => Promise<Expand<BuiltTransactions>> {
    return async (params: T) => {
      const composer = this._newGroup()
      return await c(composer).apply(composer, [params]).buildTransactions()
    }
  }

  /**
   * Create a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.payment({
   *   sender: 'SENDERADDRESS',
   *   receiver: 'RECEIVERADDRESS',
   *   amount: (4).algo(),
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.payment({
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
   * ```
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
   * await algorand.createTransaction.assetCreate({ sender: "CREATORADDRESS", total: 100n})
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetCreate({
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
   * await algorand.createTransaction.assetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetConfig({
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
   * await algorand.createTransaction.assetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetFreeze({
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
   * await algorand.createTransaction.assetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetDestroy({
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
   * @returns The asset destroy transaction
   */
  assetDestroy = this._transaction((c) => c.addAssetDestroy)
  /** Create an Algorand Standard Asset transfer transaction.
   *
   * @param params The parameters for the asset transfer transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.assetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
   * ```
   * @example Advanced example (with clawback)
   * ```typescript
   * await algorand.createTransaction.assetTransfer({
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
   * @returns The result of the asset transfer transaction
   */
  assetTransfer = this._transaction((c) => c.addAssetTransfer)
  /** Create an Algorand Standard Asset opt-in transaction.
   *
   * @param params The parameters for the asset opt-in transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.assetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetOptIn({
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
   * @example Basic example (without creator, will be retrieved from algod)
   * ```typescript
   * await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Basic example (with creator)
   * ```typescript
   * await algorand.createTransaction.assetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.assetOptOut({
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
   * @returns The asset opt-out transaction
   */
  assetOptOut = this._transaction((c) => c.addAssetOptOut)
  /** Create an application create transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app creation transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.appCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.appCreate({
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
   *})
   * ```
   * @returns The application create transaction
   */
  appCreate = this._transaction((c) => c.addAppCreate)
  /** Create an application update transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app update transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.appUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.appUpdate({
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
   * @returns The application update transaction
   */
  appUpdate = this._transaction((c) => c.addAppUpdate)
  /** Create an application delete transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app deletion transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.appDelete({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.appDelete({
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
   * @returns The application delete transaction
   */
  appDelete = this._transaction((c) => c.addAppDelete)
  /** Create an application call transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app call transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.appCall({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.appCall({
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
   * @returns The application call transaction
   */
  appCall = this._transaction((c) => c.addAppCall)
  /** Create an application create call with ABI method call transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app creation transaction
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appCreateMethodCall({
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
   * @returns The application ABI method create transaction
   */
  appCreateMethodCall = this._transactions((c) => c.addAppCreateMethodCall)
  /** Create an application update call with ABI method call transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app update transaction
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appUpdateMethodCall({
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
   * @returns The application ABI method update transaction
   */
  appUpdateMethodCall = this._transactions((c) => c.addAppUpdateMethodCall)
  /** Create an application delete call with ABI method call transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app deletion transaction
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appDeleteMethodCall({
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
   * @returns The application ABI method delete transaction
   */
  appDeleteMethodCall = this._transactions((c) => c.addAppDeleteMethodCall)
  /** Create an application call with ABI method call transaction.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app call transaction
   * @example Basic example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.createTransaction.appCallMethodCall({
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
   * @returns The application ABI method call transaction
   */
  appCallMethodCall = this._transactions((c) => c.addAppCallMethodCall)
  /**
   * Create an online key registration transaction.
   * @param params The parameters for the key registration transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.onlineKeyRegistration({
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
   * await algorand.createTransaction.onlineKeyRegistration({
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
   * @returns The online key registration transaction
   */
  onlineKeyRegistration = this._transaction((c) => c.addOnlineKeyRegistration)
  /**
   * Create an offline key registration transaction.
   * @param params The parameters for the key registration transaction
   * @example Basic example
   * ```typescript
   * await algorand.createTransaction.offlineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.createTransaction.offlineKeyRegistration({
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
   * @returns The offline key registration transaction
   */
  offlineKeyRegistration = this._transaction((c) => c.addOfflineKeyRegistration)
}
