import algosdk from 'algosdk'
import { Config } from '../config'
import { AssetManager } from './asset-manager'
import AlgoKitComposer, { AppCreateMethodCall, AppCreateParams, AssetCreateParams, AssetOptOutParams, ExecuteParams } from './composer'
import { SendSingleTransactionResult } from './transaction'
import Transaction = algosdk.Transaction

/** Orchestrates sending transactions for `AlgorandClient`. */
export class AlgorandClientTransactionSender {
  private _newGroup: () => AlgoKitComposer
  private _assetManager: AssetManager

  /**
   * Creates a new `AlgorandClientSender`
   * @param newGroup A lambda that starts a new `AlgoKitComposer` transaction group
   * @param assetManager An `AssetManager` instance
   */
  constructor(newGroup: () => AlgoKitComposer, assetManager: AssetManager) {
    this._newGroup = newGroup
    this._assetManager = assetManager
  }

  private _send<T>(
    c: (c: AlgoKitComposer) => (params: T) => AlgoKitComposer,
    log?: {
      preLog?: (params: T, transaction: Transaction) => string
      postLog?: (params: T, result: SendSingleTransactionResult) => string
    },
  ): (params: T & ExecuteParams) => Promise<SendSingleTransactionResult> {
    return async (params) => {
      const composer = this._newGroup()

      // Ensure `this` is properly populated
      c(composer).apply(composer, [params])

      if (log?.preLog) {
        const transaction = (await composer.build()).transactions.at(-1)!.txn
        Config.getLogger(params?.suppressLog).debug(log.preLog(params, transaction))
      }

      const rawResult = await composer.execute(params)
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

  /**
   * Send a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @example Basic example
   * ```typescript
   * const result = await algorandClient.send.payment({
   *  sender: 'SENDERADDRESS',
   *  receiver: 'RECEIVERADDRESS',
   *  amount: (4).algo(),
   * })
   * ```
   * @example Advanced example
   * ```typescript
   * const result = await algorandClient.send.payment({
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
   *
   * @returns The result of the transaction and the transaction that was sent
   */
  payment = this._send((c) => c.addPayment, {
    preLog: (params, transaction) =>
      `Sending ${params.amount.microAlgo} µALGO from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
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
   * await algorand.send.assetCreate({sender: "CREATORADDRESS", total: 100n})
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetCreate = async (params: AssetCreateParams & ExecuteParams) => {
    const result = await this._send((c) => c.addAssetCreate, {
      postLog: (params, result) =>
        `Created asset${params.assetName ? ` ${params.assetName}` : ''}${params.unitName ? ` (${params.unitName})` : ''} with ${params.total} units and ${params.decimals ?? 0} decimals created by ${params.sender} with ID ${result.confirmation.assetIndex} via transaction ${result.txIds.at(-1)}`,
    })(params)
    return { ...result, assetId: BigInt(result.confirmation.assetIndex ?? 0) }
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
   * await algorand.send.assetConfig({sender: "MANAGERADDRESS", assetId: 123456n, manager: "MANAGERADDRESS" })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetConfig = this._send((c) => c.addAssetConfig, {
    preLog: (params, transaction) => `Configuring asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
  })
  /**
   * Freeze or unfreeze an Algorand Standard Asset for an account.
   *
   * @param params The parameters for the asset freeze transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetFreeze({sender: "MANAGERADDRESS", assetId: 123456n, account: "ACCOUNTADDRESS", frozen: true })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetFreeze = this._send((c) => c.addAssetFreeze, {
    preLog: (params, transaction) => `Freezing asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
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
   * await algorand.send.assetDestroy({sender: "MANAGERADDRESS", assetId: 123456n })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetDestroy = this._send((c) => c.addAssetDestroy, {
    preLog: (params, transaction) => `Destroying asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
  })
  /**
   * Transfer an Algorand Standard Asset.
   *
   * @param params The parameters for the asset transfer transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetTransfer({sender: "HOLDERADDRESS", assetId: 123456n, amount: 1n, receiver: "RECEIVERADDRESS" })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetTransfer = this._send((c) => c.addAssetTransfer, {
    preLog: (params, transaction) =>
      `Transferring ${params.amount} units of asset with ID ${params.assetId} from ${params.sender} to ${params.receiver} via transaction ${transaction.txID()}`,
  })
  /**
   * Opt an account into an Algorand Standard Asset.
   *
   * @param params The parameters for the asset opt-in transaction
   *
   * @example Basic example
   * ```typescript
   * await algorand.send.assetOptIn({sender: "SENDERADDRESS", assetId: 123456n })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetOptIn = this._send((c) => c.addAssetOptIn, {
    preLog: (params, transaction) => `Opting in ${params.sender} to asset with ID ${params.assetId} via transaction ${transaction.txID()}`,
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
   * @example Basic example (without creator)
   * ```typescript
   * await algorand.send.assetOptOut({sender: "SENDERADDRESS", assetId: 123456n, ensureZeroBalance: true })
   * ```
   * @example Basic example (with creator)
   * ```typescript
   * await algorand.send.assetOptOut({sender: "SENDERADDRESS", creator: "CREATORADDRESS", assetId: 123456n, ensureZeroBalance: true })
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
   * @returns The result of the transaction and the transaction that was sent
   */
  assetOptOut = async (
    params: Omit<AssetOptOutParams, 'creator'> & {
      /** Optional asset creator account address; if not specified it will be retrieved from algod */
      creator?: string
      /** Whether or not to check if the account has a zero balance first or not.
       *
       * If this is set to `true` and the account has an asset balance it will throw an error.
       *
       * If this is set to `false` and the account has an asset balance it will lose those assets to the asset creator.
       */
      ensureZeroBalance: boolean
    } & ExecuteParams,
  ) => {
    if (params.ensureZeroBalance) {
      let balance = 0n
      try {
        const accountAssetInfo = await this._assetManager.getAccountInformation(params.sender, params.assetId)
        balance = accountAssetInfo.balance
      } catch (e) {
        throw new Error(`Account ${params.sender} is not opted-in to Asset ${params.assetId}; can't opt-out.`)
      }
      if (balance !== 0n) {
        throw new Error(`Account ${params.sender} does not have a zero balance for Asset ${params.assetId}; can't opt-out.`)
      }
    }

    params.creator = params.creator ?? (await this._assetManager.getById(params.assetId)).creator

    return await this._send((c) => c.addAssetOptOut, {
      preLog: (params, transaction) =>
        `Opting ${params.sender} out of asset with ID ${params.assetId} to creator ${params.creator} via transaction ${transaction.txID()}`,
    })(params as AssetOptOutParams & ExecuteParams)
  }
  /**
   * Create a smart contract.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appCreate = async (params: AppCreateParams & ExecuteParams) => {
    const result = await this._send((c) => c.addAppCreate, {
      postLog: (params, result) =>
        `App created by ${params.sender} with ID ${result.confirmation.applicationIndex} via transaction ${result.txIds.at(-1)}`,
    })(params)
    return { ...result, appId: BigInt(result.confirmation.applicationIndex ?? 0) }
  }

  /**
   * Update a smart contract.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appUpdate = this._send((c) => c.addAppUpdate)

  /**
   * Delete a smart contract.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appDelete = this._send((c) => c.addAppDelete)

  /**
   * Call a smart contract.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appCall = this._send((c) => c.addAppCall)

  /**
   * Create a smart contract via an ABI method.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appCreateMethodCall = async (params: AppCreateMethodCall & ExecuteParams) => {
    const result = await this._send((c) => c.addAppCreateMethodCall, {
      postLog: (params, result) =>
        `App created by ${params.sender} with ID ${result.confirmation.applicationIndex} via transaction ${result.txIds.at(-1)}`,
    })(params)
    return { ...result, appId: BigInt(result.confirmation.applicationIndex ?? 0) }
  }

  /**
   * Update a smart contract via an ABI method.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appUpdateMethodCall = this._send((c) => c.addAppUpdateMethodCall)

  /**
   * Delete a smart contract via an ABI method.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appDeleteMethodCall = this._send((c) => c.addAppDeleteMethodCall)

  /**
   * Call a smart contract via an ABI method.
   *
   * Note: you may prefer to use `algorandClient.client` to get an app client for more advanced functionality.
   */
  appCallMethodCall = this._send((c) => c.addAppCallMethodCall)

  /** Register an online key. */
  onlineKeyRegistration = this._send((c) => c.addOnlineKeyRegistration, {
    preLog: (params, transaction) => `Registering online key for ${params.sender} via transaction ${transaction.txID()}`,
  })
}
