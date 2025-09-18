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

  public async payment(params: PaymentParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addPayment(p), sendParams)
  }

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

  public async assetConfig(params: AssetConfigParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetConfig(p), sendParams)
  }

  public async assetFreeze(params: AssetFreezeParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetFreeze(p), sendParams)
  }

  public async assetDestroy(params: AssetDestroyParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetDestroy(p), sendParams)
  }

  public async assetTransfer(params: AssetTransferParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetTransfer(p), sendParams)
  }

  public async assetOptIn(params: AssetOptInParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetOptIn(p), sendParams)
  }

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

  public async accountClose(params: AccountCloseParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAccountClose(p), sendParams)
  }

  public async assetClawback(params: AssetClawbackParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetClawback(p), sendParams)
  }

  public async assetUnfreeze(params: AssetUnfreezeParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetUnfreeze(p), sendParams)
  }

  async appCall(params: AppCallParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppCall(p), sendParams)
  }

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

  async appUpdate(params: AppUpdateParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppUpdate(p), sendParams)
  }

  async appDelete(params: AppDeleteParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppDelete(p), sendParams)
  }

  async appCallMethodCall(params: AppCallMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppCallMethodCall(p), sendParams)
  }

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

  async appUpdateMethodCall(params: AppUpdateMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppUpdateMethodCall(p), sendParams)
  }

  async appDeleteMethodCall(params: AppDeleteMethodCallParams, sendParams?: SendParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppDeleteMethodCall(p), sendParams)
  }

  async onlineKeyRegistration(params: OnlineKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOnlineKeyRegistration(p), sendParams)
  }

  async offlineKeyRegistration(params: OfflineKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOfflineKeyRegistration(p), sendParams)
  }

  async nonParticipationKeyRegistration(params: NonParticipationKeyRegistrationParams, sendParams?: SendParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addNonParticipationKeyRegistration(p), sendParams)
  }
}
