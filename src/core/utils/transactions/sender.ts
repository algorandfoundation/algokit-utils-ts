import { ABIReturn } from '../../abi/abi-method'
import { Expand } from '../../expand'
import { Transaction } from '../../transact'
import { AssetManager } from '../clients/asset-manager'
import { PendingTransactionResponse } from '../temp'
import type {
  AppCallMethodCallParams,
  AppCallParams,
  AppCreateMethodCallParams,
  AppCreateParams,
  AppDeleteMethodCallParams,
  AppDeleteParams,
  AppUpdateMethodCallParams,
  AppUpdateParams,
} from './app-call'
import type { AssetConfigParams, AssetCreateParams, AssetDestroyParams } from './asset-config'
import type { AssetFreezeParams, AssetUnfreezeParams } from './asset-freeze'
import type { AssetClawbackParams, AssetOptInParams, AssetOptOutParams, AssetTransferParams } from './asset-transfer'
import { Composer, TransactionComposerConfig, type SendParams, type SendTransactionComposerResults } from './composer'
import type { NonParticipationKeyRegistrationParams, OfflineKeyRegistrationParams, OnlineKeyRegistrationParams } from './key-registration'
import type { AccountCloseParams, PaymentParams } from './payment'

export type SendResult = {
  transaction: Transaction
  confirmation: PendingTransactionResponse
  transactionId: string
}

export type SendAssetCreateResult = Expand<
  SendResult & {
    assetId: bigint
  }
>

export type SendAppCallMethodCallResult = Expand<
  SendResult & {
    group?: Uint8Array
    transactionIds: string[]
    transactions: Transaction[]
    confirmations: PendingTransactionResponse[]
    abiReturns: ABIReturn[]
    abiReturn?: ABIReturn
  }
>

export type SendAppCreateResult = Expand<
  SendResult & {
    appId: bigint
  }
>

export type SendAppCreateMethodCallResult = Expand<
  SendAppCallMethodCallResult & {
    appId: bigint
  }
>

export class TransactionSender {
  constructor(
    private assetManager: AssetManager,
    private newGroup: (composerConfig?: TransactionComposerConfig) => Composer,
  ) {}

  private async sendSingleTransaction<T>(
    params: T,
    addMethod: (composer: Composer, params: T) => void,
    sendParams?: SendParams,
  ): Promise<SendResult> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send(sendParams)

    return {
      transaction: result.transactions.at(-1)!,
      confirmation: result.confirmations.at(-1)!,
      transactionId: result.transactionIds.at(-1)!,
    }
  }

  private async sendSingleTransactionWithResult<T, R>(
    params: T,
    addMethod: (composer: Composer, params: T) => void,
    transformResult: (baseResult: SendResult) => R,
    sendParams?: SendParams,
  ): Promise<R> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send(sendParams)

    const baseResult = this.buildSendResult(result)
    return transformResult(baseResult)
  }

  private async sendMethodCall<T>(
    params: T,
    addMethod: (composer: Composer, params: T) => void,
    sendParams?: SendParams,
  ): Promise<SendAppCallMethodCallResult> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send(sendParams)

    return {
      transaction: result.transactions.at(-1)!,
      confirmation: result.confirmations.at(-1)!,
      transactionId: result.transactionIds.at(-1)!,
      group: result.group,
      confirmations: result.confirmations,
      transactionIds: result.transactionIds,
      transactions: result.transactions,
      abiReturns: result.abiReturns,
      abiReturn: result.abiReturns.at(-1),
    }
  }

  private async sendMethodCallWithResult<T, R>(
    params: T,
    addMethod: (composer: Composer, params: T) => void,
    transformResult: (baseResult: SendAppCallMethodCallResult) => R,
    sendParams?: SendParams,
  ): Promise<R> {
    const baseResult = await this.sendMethodCall(params, addMethod, sendParams)
    return transformResult(baseResult)
  }

  private buildSendResult(composerResult: SendTransactionComposerResults): SendResult {
    return {
      transaction: composerResult.transactions.at(-1)!,
      confirmation: composerResult.confirmations.at(-1)!,
      transactionId: composerResult.transactionIds.at(-1)!,
    }
  }

  /**
   * Send a payment transaction to transfer Algo between accounts.
   * @param params The parameters for the payment transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the payment transaction and the transaction that was sent
   */
  public async payment(params: PaymentParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addPayment(p), sendParams)
  }

  /**
   * Create a new Algorand Standard Asset.
   *
   * The account that sends this transaction will automatically be
   * opted in to the asset and will hold all units after creation.
   *
   * @param params The parameters for the asset creation transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset create transaction and the transaction that was sent
   */
  public async assetCreate(params: AssetCreateParams, sendParams?: SendParams): Promise<SendAssetCreateResult> {
    return this.sendSingleTransactionWithResult(
      params,
      (composer, p) => composer.addAssetCreate(p),
      (baseResult) => {
        const assetIndex = baseResult.confirmation.assetIndex
        if (assetIndex === undefined || assetIndex <= 0) {
          throw new Error('Asset creation confirmation missing assetIndex')
        }
        return {
          ...baseResult,
          assetId: assetIndex,
        }
      },
      sendParams,
    )
  }

  /**
   * Configure an existing Algorand Standard Asset.
   *
   * **Note:** The manager, reserve, freeze, and clawback addresses
   * are immutably empty if they are not set. If manager is not set then
   * all fields are immutable from that point forward.
   *
   * @param params The parameters for the asset config transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset config transaction and the transaction that was sent
   */
  public async assetConfig(params: AssetConfigParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetConfig(p), sendParams)
  }

  /**
   * Freeze an Algorand Standard Asset for an account.
   *
   * @param params The parameters for the asset freeze transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset freeze transaction and the transaction that was sent
   */
  public async assetFreeze(params: AssetFreezeParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetFreeze(p), sendParams)
  }

  /**
   * Destroys an Algorand Standard Asset.
   *
   * Created assets can be destroyed only by the asset manager account.
   * All of the assets must be owned by the creator of the asset before
   * the asset can be deleted.
   *
   * @param params The parameters for the asset destroy transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset destroy transaction and the transaction that was sent
   */
  public async assetDestroy(params: AssetDestroyParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetDestroy(p), sendParams)
  }

  /**
   * Transfer an Algorand Standard Asset.
   *
   * @param params The parameters for the asset transfer transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset transfer transaction and the transaction that was sent
   */
  public async assetTransfer(params: AssetTransferParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetTransfer(p), sendParams)
  }

  /**
   * Opt an account into an Algorand Standard Asset.
   *
   * @param params The parameters for the asset opt-in transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset opt-in transaction and the transaction that was sent
   */
  public async assetOptIn(params: AssetOptInParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetOptIn(p), sendParams)
  }

  /**
   * Opt an account out of an Algorand Standard Asset.
   *
   * *Note:* If the account has a balance of the asset,
   * it will not be able to opt-out unless `ensureZeroBalance`
   * is set to `false` (but then the account will lose the assets).
   *
   * @param params The parameters for the asset opt-out transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset opt-out transaction and the transaction that was sent
   */
  public async assetOptOut(params: AssetOptOutParams & { ensureZeroBalance?: boolean }, sendParams?: SendParams): Promise<SendResult> {
    const shouldCheckBalance = params.ensureZeroBalance ?? false

    // If we need to check balances, verify the balance is zero
    if (shouldCheckBalance) {
      const accountInfo = await this.assetManager.getAccountInformation(params.sender, params.assetId)
      const balance = accountInfo.assetHolding?.amount ?? 0
      if (balance > 0) {
        throw new Error(`Account ${params.sender} has non-zero balance ${balance} for asset ${params.assetId}`)
      }
    }

    // Resolve closeRemainderTo to asset creator if not specified
    let closeRemainderTo = params.closeRemainderTo
    if (!closeRemainderTo) {
      const assetInfo = await this.assetManager.getById(params.assetId)
      closeRemainderTo = assetInfo.creator
    }

    const updatedParams: AssetOptOutParams = {
      ...params,
      closeRemainderTo,
    }

    return this.sendSingleTransaction(updatedParams, (composer, p) => composer.addAssetOptOut(p), sendParams)
  }

  /**
   * Close an account and transfer remaining balance to another account.
   *
   * *Warning:* Be careful this can lead to loss of funds if not used correctly.
   * @param params The parameters for the account close transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the account close transaction and the transaction that was sent
   */
  public async accountClose(params: AccountCloseParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAccountClose(p), sendParams)
  }

  /**
   * Clawback an Algorand Standard Asset from an account.
   *
   * @param params The parameters for the asset clawback transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset clawback transaction and the transaction that was sent
   */
  public async assetClawback(params: AssetClawbackParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetClawback(p), sendParams)
  }

  /**
   * Unfreeze an Algorand Standard Asset for an account.
   *
   * @param params The parameters for the asset unfreeze transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the asset unfreeze transaction and the transaction that was sent
   */
  public async assetUnfreeze(params: AssetUnfreezeParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetUnfreeze(p), sendParams)
  }

  /**
   * Call a smart contract.
   *
   * @param params The parameters for the app call transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the app call transaction and the transaction that was sent
   */
  async appCall(params: AppCallParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppCall(p), sendParams)
  }

  /**
   * Create a smart contract.
   *
   * @param params The parameters for the app creation transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the app create transaction and the transaction that was sent
   */
  async appCreate(params: AppCreateParams, sendParams?: SendParams): Promise<SendAppCreateResult> {
    return this.sendSingleTransactionWithResult(
      params,
      (composer, p) => composer.addAppCreate(p),
      (baseResult) => {
        const applicationIndex = baseResult.confirmation.applicationIndex
        if (applicationIndex === undefined || applicationIndex <= 0) {
          throw new Error('App creation confirmation missing applicationIndex')
        }
        return {
          ...baseResult,
          appId: applicationIndex,
        }
      },
      sendParams,
    )
  }

  /**
   * Update a smart contract.
   *
   * @param params The parameters for the app update transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the app update transaction and the transaction that was sent
   */
  async appUpdate(params: AppUpdateParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppUpdate(p), sendParams)
  }

  /**
   * Delete a smart contract.
   *
   * @param params The parameters for the app deletion transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the app delete transaction and the transaction that was sent
   */
  async appDelete(params: AppDeleteParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppDelete(p), sendParams)
  }

  /**
   * Call a smart contract via an ABI method.
   *
   * @param params The parameters for the app call transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the application ABI method call transaction and the transaction that was sent
   */
  async appCallMethodCall(params: AppCallMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppCallMethodCall(p), sendParams)
  }

  /**
   * Create a smart contract via an ABI method.
   *
   * @param params The parameters for the app creation transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the application ABI method create transaction and the transaction that was sent
   */
  async appCreateMethodCall(params: AppCreateMethodCallParams, sendParams?: SendParams): Promise<SendAppCreateMethodCallResult> {
    return this.sendMethodCallWithResult(
      params,
      (composer, p) => composer.addAppCreateMethodCall(p),
      (baseResult) => {
        const applicationIndex = baseResult.confirmation.applicationIndex
        if (applicationIndex === undefined || applicationIndex <= 0) {
          throw new Error('App creation confirmation missing applicationIndex')
        }
        return {
          ...baseResult,
          appId: applicationIndex,
        }
      },
      sendParams,
    )
  }

  /**
   * Update a smart contract via an ABI method.
   *
   * @param params The parameters for the app update transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the application ABI method update transaction and the transaction that was sent
   */
  async appUpdateMethodCall(params: AppUpdateMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppUpdateMethodCall(p), sendParams)
  }

  /**
   * Delete a smart contract via an ABI method.
   *
   * @param params The parameters for the app deletion transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the application ABI method delete transaction and the transaction that was sent
   */
  async appDeleteMethodCall(params: AppDeleteMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppDeleteMethodCall(p), sendParams)
  }

  /**
   * Register an online key.
   *
   * @param params The parameters for the key registration transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the online key registration transaction and the transaction that was sent
   */
  async onlineKeyRegistration(params: OnlineKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOnlineKeyRegistration(p), sendParams)
  }

  /**
   * Register an offline key.
   *
   * @param params The parameters for the key registration transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the offline key registration transaction and the transaction that was sent
   */
  async offlineKeyRegistration(params: OfflineKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOfflineKeyRegistration(p), sendParams)
  }

  /**
   * Register a non-participation key.
   *
   * @param params The parameters for the key registration transaction
   * @param sendParams Optional parameters for sending the transaction
   * @returns The result of the non-participation key registration transaction and the transaction that was sent
   */
  async nonParticipationKeyRegistration(params: NonParticipationKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addNonParticipationKeyRegistration(p), sendParams)
  }
}
