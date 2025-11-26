import { ABIMethod } from '@algorandfoundation/algokit-abi'
import { Transaction, getTransactionId } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { Buffer } from 'buffer'
import { Config } from '../config'
import { asJson, defaultJsonValueReplacer } from '../util'
import { SendAppCreateTransactionResult, SendAppTransactionResult, SendAppUpdateTransactionResult } from './app'
import { AppManager } from './app-manager'
import { AssetManager } from './asset-manager'
import {
  AppCallMethodCall,
  AppCallParams,
  AppCreateMethodCall,
  AppCreateParams,
  AppDeleteMethodCall,
  AppDeleteParams,
  AppUpdateMethodCall,
  AppUpdateParams,
  AssetCreateParams,
  AssetOptOutParams,
  TransactionComposer,
  TransactionComposerConfig,
} from './composer'
import { SendParams, SendSingleTransactionResult } from './transaction'
import { getAddress, ReadableAddress } from '@algorandfoundation/algokit-common'

const getMethodCallForLog = ({ method, args }: { method: ABIMethod; args?: unknown[] }) => {
  return `${method.name}(${(args ?? []).map((a) =>
    typeof a === 'object'
      ? asJson(a, (k, v) => {
          const newV = defaultJsonValueReplacer(k, v)
          return newV instanceof Uint8Array ? Buffer.from(newV).toString('base64') : newV
        })
      : a,
  )})`
}

/** Orchestrates sending transactions for `AlgorandClient`. */
export class AlgorandClientTransactionSender {
  private _newGroup: () => TransactionComposer
  private _assetManager: AssetManager
  private _appManager: AppManager

  /**
   * Creates a new `AlgorandClientSender`
   * @param newGroup A lambda that starts a new `TransactionComposer` transaction group
   * @param assetManager An `AssetManager` instance
   * @param appManager An `AppManager` instance
   * @example
   * ```typescript
   * const transactionSender = new AlgorandClientTransactionSender(() => new TransactionComposer(), assetManager, appManager)
   * ```
   */
  constructor(newGroup: (config?: TransactionComposerConfig) => TransactionComposer, assetManager: AssetManager, appManager: AppManager) {
    this._newGroup = newGroup
    this._assetManager = assetManager
    this._appManager = appManager
  }

  /**
   * Start a new `TransactionComposer` transaction group
   * @returns A new instance of `TransactionComposer`.
   * @example
   * const composer = AlgorandClient.mainNet().send.newGroup();
   * const result = await composer.addTransaction(payment).send()
   */
  newGroup() {
    return this._newGroup()
  }

  private _send<T>(
    c: (c: TransactionComposer) => (params: T) => TransactionComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & SendParams) => Promise<SendSingleTransactionResult> {
    return async (params) => {
      const composer = this._newGroup()

      // Ensure `this` is properly populated
      c(composer).apply(composer, [params])

      if (log?.preLog) {
        const transaction = (await composer.build()).transactions.at(-1)!.txn
        Config.getLogger(params?.suppressLog).debug(log.preLog(params, transaction))
      }

      const rawResult = await composer.send(params)
      const result = {
        // Last item covers when a group is created by an app call with ABI transaction parameters
        transaction: rawResult.transactions.at(-1)!,
        confirmation: rawResult.confirmations.at(-1)!,
        txId: rawResult.txIds.at(-1)!,
        ...rawResult,
      }

      if (log?.postLog) {
        Config.getLogger(params?.suppressLog).debug(log.postLog(params, result))
      }

      return result
    }
  }

  private _sendAppCall<
    T extends
      | AppCreateParams
      | AppUpdateParams
      | AppCallParams
      | AppDeleteParams
      | AppCreateMethodCall
      | AppUpdateMethodCall
      | AppCallMethodCall
      | AppDeleteMethodCall,
  >(
    c: (c: TransactionComposer) => (params: T) => TransactionComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & SendParams) => Promise<SendAppTransactionResult> {
    return async (params) => {
      const result = await this._send(c, log)(params)

      return { ...result, return: AppManager.getABIReturn(result.confirmation, 'method' in params ? params.method : undefined) }
    }
  }

  private _sendAppUpdateCall<T extends AppCreateParams | AppUpdateParams | AppCreateMethodCall | AppUpdateMethodCall>(
    c: (c: TransactionComposer) => (params: T) => TransactionComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & SendParams) => Promise<SendAppUpdateTransactionResult> {
    return async (params) => {
      const result = await this._sendAppCall(c, log)(params)

      const compiledApproval =
        typeof params.approvalProgram === 'string' ? this._appManager.getCompilationResult(params.approvalProgram) : undefined
      const compiledClear =
        typeof params.clearStateProgram === 'string' ? this._appManager.getCompilationResult(params.clearStateProgram) : undefined

      return { ...result, compiledApproval, compiledClear }
    }
  }

  private _sendAppCreateCall<T extends AppCreateParams | AppCreateMethodCall>(
    c: (c: TransactionComposer) => (params: T) => TransactionComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & SendParams) => Promise<SendAppCreateTransactionResult> {
    return async (params) => {
      const result = await this._sendAppUpdateCall(c, log)(params)

      return {
        ...result,
        appId: BigInt(result.confirmation.appId!),
        appAddress: algosdk.getApplicationAddress(result.confirmation.appId!),
      }
    }
  }

  /**
   * Send a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @example Basic example
   * ```typescript
   * const result = await algorand.send.payment({
   *  sender: 'SENDERADDRESS',
   *  receiver: 'RECEIVERADDRESS',
   *  amount: (4).algo(),
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * const result = await algorand.send.payment({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the payment transaction and the transaction that was sent
   */
  payment = this._send((c) => c.addPayment, {
    preLog: (params, transaction) =>
      `Sending ${params.amount.microAlgo} µALGO from ${params.sender} to ${params.receiver} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Create a new Algorand Standard Asset.
   *
   * The account that sends this transaction will automatically be
   * opted in to the asset and will hold all units after creation.
   *
   * @param params The parameters for the asset creation transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetCreate({ sender: "CREATORADDRESS", total: 100n})
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetCreate({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset create transaction and the transaction that was sent
   */
  assetCreate = async (params: AssetCreateParams & SendParams) => {
    const result = await this._send((c) => c.addAssetCreate, {
      postLog: (params, result) =>
        `Created asset${params.assetName ? ` ${params.assetName}` : ''}${params.unitName ? ` (${params.unitName})` : ''} with ${params.total} units and ${params.decimals ?? 0} decimals created by ${params.sender} with ID ${result.confirmation.assetId} via transaction ${result.txIds.at(-1)}`,
    })(params)
    return { ...result, assetId: BigInt(result.confirmation.assetId ?? 0) }
  }
  /**
   * Configure an existing Algorand Standard Asset.
   *
   * **Note:** The manager, reserve, freeze, and clawback addresses
   * are immutably empty if they are not set. If manager is not set then
   * all fields are immutable from that point forward.
   *
   * @param params The parameters for the asset config transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetConfig({ sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetConfig({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset config transaction and the transaction that was sent
   */
  assetConfig = this._send((c) => c.addAssetConfig, {
    preLog: (params, transaction) => `Configuring asset with ID ${params.assetId} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Freeze or unfreeze an Algorand Standard Asset for an account.
   *
   * @param params The parameters for the asset freeze transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetFreeze({ sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetFreeze({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset freeze transaction and the transaction that was sent
   */
  assetFreeze = this._send((c) => c.addAssetFreeze, {
    preLog: (params, transaction) => `Freezing asset with ID ${params.assetId} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Destroys an Algorand Standard Asset.
   *
   * Created assets can be destroyed only by the asset manager account.
   * All of the assets must be owned by the creator of the asset before
   * the asset can be deleted.
   *
   * @param params The parameters for the asset destroy transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetDestroy({ sender: "MANAGERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetDestroy({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset destroy transaction and the transaction that was sent
   */
  assetDestroy = this._send((c) => c.addAssetDestroy, {
    preLog: (params, transaction) => `Destroying asset with ID ${params.assetId} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Transfer an Algorand Standard Asset.
   *
   * @param params The parameters for the asset transfer transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetTransfer({ sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
   * ```
   * @example Advanced example (with clawback)
   * ```typescript
   * await algorand.send.assetTransfer({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset transfer transaction and the transaction that was sent
   */
  assetTransfer = this._send((c) => c.addAssetTransfer, {
    preLog: (params, transaction) =>
      `Transferring ${params.amount} units of asset with ID ${params.assetId} from ${params.sender} to ${params.receiver} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Opt an account into an Algorand Standard Asset.
   *
   * @param params The parameters for the asset opt-in transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetOptIn({ sender: "SENDERADDRESS", assetId: 123456n })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetOptIn({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset opt-in transaction and the transaction that was sent
   */
  assetOptIn = this._send((c) => c.addAssetOptIn, {
    preLog: (params, transaction) =>
      `Opting in ${params.sender} to asset with ID ${params.assetId} via transaction ${getTransactionId(transaction)}`,
  })
  /**
   * Opt an account out of an Algorand Standard Asset.
   *
   * *Note:* If the account has a balance of the asset,
   * it will not be able to opt-out unless `ensureZeroBalance`
   * is set to `false` (but then the account will lose the assets).
   *
   * @param params The parameters for the asset opt-out transaction
   *
   * @example Basic example (without creator, will be retrieved from algod)
   * ```typescript
   * await algorand.send.assetOptOut({ sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Basic example (with creator)
   * ```typescript
   * await algorand.send.assetOptOut({ sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.assetOptOut({
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
   *   // Signer only needed if you want to provide one,
   *   //  generally you'd register it with AlgorandClient
   *   //  against the sender and not need to pass it in
   *   signer: transactionSigner,
   *   maxRoundsToWaitForConfirmation: 5,
   *   suppressLog: true,
   * })
   * ```
   * @returns The result of the asset opt-out transaction and the transaction that was sent
   */
  assetOptOut = async (
    params: Omit<AssetOptOutParams, 'creator'> & {
      /** Optional asset creator account address; if not specified it will be retrieved from algod */
      creator?: ReadableAddress
      /** Whether or not to check if the account has a zero balance first or not.
       *
       * If this is set to `true` and the account has an asset balance it will throw an error.
       *
       * If this is set to `false` and the account has an asset balance it will lose those assets to the asset creator.
       */
      ensureZeroBalance: boolean
    } & SendParams,
  ) => {
    if (params.ensureZeroBalance) {
      let balance = 0n
      try {
        const accountAssetInfo = await this._assetManager.getAccountInformation(getAddress(params.sender), params.assetId)
        balance = accountAssetInfo.balance
      } catch {
        throw new Error(`Account ${params.sender} is not opted-in to Asset ${params.assetId}; can't opt-out.`)
      }
      if (balance !== 0n) {
        throw new Error(`Account ${params.sender} does not have a zero balance for Asset ${params.assetId}; can't opt-out.`)
      }
    }

    params.creator = params.creator ?? (await this._assetManager.getById(params.assetId)).creator

    return await this._send((c) => c.addAssetOptOut, {
      preLog: (params, transaction) =>
        `Opting ${params.sender} out of asset with ID ${params.assetId} to creator ${params.creator} via transaction ${getTransactionId(transaction)}`,
    })(params as AssetOptOutParams & SendParams)
  }
  /**
   * Create a smart contract.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app creation transaction
   * @example Basic example
   * ```typescript
   * const result = await algorand.send.appCreate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * const createdAppId = result.appId
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.appCreate({
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
   * @returns The result of the app create transaction and the transaction that was sent
   */
  appCreate = this._sendAppCreateCall((c) => c.addAppCreate, {
    postLog: (params, result) =>
      `App created by ${params.sender} with ID ${result.confirmation.appId} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Update a smart contract.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app update transaction
   * @example Basic example
   * ```typescript
   * await algorand.send.appUpdate({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.appUpdate({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the app update transaction and the transaction that was sent
   */
  appUpdate = this._sendAppUpdateCall((c) => c.addAppUpdate, {
    postLog: (params, result) =>
      `App ${params.appId} updated ${params.args ? ` with ${params.args.map((a) => Buffer.from(a).toString('base64'))}` : ''} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Delete a smart contract.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app deletion transaction
   * @example Basic example
   * ```typescript
   * await algorand.send.appDelete({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.appDelete({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the app delete transaction and the transaction that was sent
   */
  appDelete = this._sendAppCall((c) => c.addAppDelete, {
    postLog: (params, result) =>
      `App ${params.appId} deleted ${params.args ? ` with ${params.args.map((a) => Buffer.from(a).toString('base64'))}` : ''} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Call a smart contract.
   *
   * Note: you may prefer to use `algorand.client` to get an app client for more advanced functionality.
   *
   * @param params The parameters for the app call transaction
   * @example Basic example
   * ```typescript
   * await algorand.send.appCall({ sender: 'CREATORADDRESS' })
   * ```
   * @example Advanced example
   * ```typescript
   * await algorand.send.appCall({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the app call transaction and the transaction that was sent
   */
  appCall = this._sendAppCall((c) => c.addAppCall, {
    postLog: (params, result) =>
      `App ${params.appId} called ${params.args ? ` with ${params.args.map((a) => Buffer.from(a).toString('base64'))}` : ''} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Create a smart contract via an ABI method.
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
   * const result = await algorand.send.appCreateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * const createdAppId = result.appId
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.send.appCreateMethodCall({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the application ABI method create transaction and the transaction that was sent
   */
  appCreateMethodCall = this._sendAppCreateCall((c) => c.addAppCreateMethodCall, {
    postLog: (params, result) =>
      `App created by ${params.sender} with ID ${result.confirmation.appId} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Update a smart contract via an ABI method.
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
   * await algorand.send.appUpdateMethodCall({ sender: 'CREATORADDRESS', approvalProgram: 'TEALCODE', clearStateProgram: 'TEALCODE', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.send.appUpdateMethodCall({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the application ABI method update transaction and the transaction that was sent
   */
  appUpdateMethodCall = this._sendAppUpdateCall((c) => c.addAppUpdateMethodCall, {
    postLog: (params, result) =>
      `App ${params.appId} updated with ${getMethodCallForLog(params)} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Delete a smart contract via an ABI method.
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
   * await algorand.send.appDeleteMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.send.appDeleteMethodCall({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the application ABI method delete transaction and the transaction that was sent
   */
  appDeleteMethodCall = this._sendAppCall((c) => c.addAppDeleteMethodCall, {
    postLog: (params, result) =>
      `App ${params.appId} deleted with ${getMethodCallForLog(params)} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Call a smart contract via an ABI method.
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
   * await algorand.send.appCallMethodCall({ sender: 'CREATORADDRESS', method: method, args: ["arg1_value"] })
   * ```
   * @example Advanced example
   * ```typescript
   * const method = new ABIMethod({
   *   name: 'method',
   *   args: [{ name: 'arg1', type: 'string' }],
   *   returns: { type: 'string' },
   * })
   * await algorand.send.appCallMethodCall({
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
   *  // Signer only needed if you want to provide one,
   *  //  generally you'd register it with AlgorandClient
   *  //  against the sender and not need to pass it in
   *  signer: transactionSigner,
   *  maxRoundsToWaitForConfirmation: 5,
   *  suppressLog: true,
   *})
   * ```
   * @returns The result of the application ABI method call transaction and the transaction that was sent
   */
  appCallMethodCall = this._sendAppCall((c) => c.addAppCallMethodCall, {
    postLog: (params, result) =>
      `App ${params.appId} called with ${getMethodCallForLog(params)} by ${params.sender} via transaction ${result.txIds.at(-1)}`,
  })

  /**
   * Register an online key.
   * @param params The parameters for the key registration transaction
   * @example Basic example
   * ```typescript
   * const result = await algorand.send.onlineKeyRegistration({
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
   * const result = await algorand.send.onlineKeyRegistration({
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
   * @returns The result of the online key registration transaction and the transaction that was sent
   */
  onlineKeyRegistration = this._send((c) => c.addOnlineKeyRegistration, {
    preLog: (params, transaction) => `Registering online key for ${params.sender} via transaction ${getTransactionId(transaction)}`,
  })

  /**
   * Register an offline key.
   * @param params The parameters for the key registration transaction
   * @example Basic example
   * ```typescript
   * const result = await algorand.send.offlineKeyRegistration({
   *   sender: 'SENDERADDRESS',
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * const result = await algorand.send.offlineKeyRegistration({
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
   * @returns The result of the offline key registration transaction and the transaction that was sent
   */
  offlineKeyRegistration = this._send((c) => c.addOfflineKeyRegistration, {
    preLog: (params, transaction) => `Registering offline key for ${params.sender} via transaction ${getTransactionId(transaction)}`,
  })
}
