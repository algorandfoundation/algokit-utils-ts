import { ABIReturn } from '../../abi/abi-method'
import { AlgodClient } from '../../algod_client'
import { Expand } from '../../expand'
import { Transaction } from '../../transact'
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
import type { SignerGetter } from './common'
import { Composer, type SendTransactionComposerResults } from './composer'
import type { NonParticipationKeyRegistrationParams, OfflineKeyRegistrationParams, OnlineKeyRegistrationParams } from './key-registration'
import type { AccountCloseParams, PaymentParams } from './payment'

export type SendParams = {
  maxRoundsToWaitForConfirmation?: number
}

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
    private algodClient: AlgodClient,
    private signerGetter: SignerGetter,
  ) {}

  private newGroup(): Composer {
    return new Composer({
      algodClient: this.algodClient,
      signerGetter: this.signerGetter,
    })
  }

  private async sendSingleTransaction<T>(params: T, addMethod: (composer: Composer, params: T) => void): Promise<SendResult> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send()

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
  ): Promise<R> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send()

    const baseResult = this.buildSendResult(result)
    return transformResult(baseResult)
  }

  private async sendMethodCall<T>(params: T, addMethod: (composer: Composer, params: T) => void): Promise<SendAppCallMethodCallResult> {
    const composer = this.newGroup()
    addMethod(composer, params)
    const result = await composer.send()

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
  ): Promise<R> {
    const baseResult = await this.sendMethodCall(params, addMethod)
    return transformResult(baseResult)
  }

  private buildSendResult(composerResult: SendTransactionComposerResults): SendResult {
    return {
      transaction: composerResult.transactions.at(-1)!,
      confirmation: composerResult.confirmations.at(-1)!,
      transactionId: composerResult.transactionIds.at(-1)!,
    }
  }

  public async payment(params: PaymentParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addPayment(p))
  }

  public async assetCreate(params: AssetCreateParams): Promise<SendAssetCreateResult> {
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
    )
  }

  public async assetConfig(params: AssetConfigParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetConfig(p))
  }

  public async assetFreeze(params: AssetFreezeParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetFreeze(p))
  }

  public async assetDestroy(params: AssetDestroyParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetDestroy(p))
  }

  public async assetTransfer(params: AssetTransferParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetTransfer(p))
  }

  public async assetOptIn(params: AssetOptInParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetOptIn(p))
  }

  // TODO: this logic is wrong, check with Rust core
  public async assetOptOut(params: AssetOptOutParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetOptOut(p))
  }

  public async accountClose(params: AccountCloseParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAccountClose(p))
  }

  public async assetClawback(params: AssetClawbackParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetClawback(p))
  }

  public async assetUnfreeze(params: AssetUnfreezeParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAssetUnfreeze(p))
  }

  async appCall(params: AppCallParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppCall(p))
  }

  async appCreate(params: AppCreateParams): Promise<SendAppCreateResult> {
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
    )
  }

  async appUpdate(params: AppUpdateParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppUpdate(p))
  }

  async appDelete(params: AppDeleteParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addAppDelete(p))
  }

  async appCallMethodCall(params: AppCallMethodCallParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppCallMethodCall(p))
  }

  async appCreateMethodCall(params: AppCreateMethodCallParams): Promise<SendAppCreateMethodCallResult> {
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
    )
  }

  async appUpdateMethodCall(params: AppUpdateMethodCallParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppUpdateMethodCall(p))
  }

  async appDeleteMethodCall(params: AppDeleteMethodCallParams): Promise<SendAppCallMethodCallResult> {
    return this.sendMethodCall(params, (composer, p) => composer.addAppDeleteMethodCall(p))
  }

  async onlineKeyRegistration(params: OnlineKeyRegistrationParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOnlineKeyRegistration(p))
  }

  async offlineKeyRegistration(params: OfflineKeyRegistrationParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addOfflineKeyRegistration(p))
  }

  async nonParticipationKeyRegistration(params: NonParticipationKeyRegistrationParams): Promise<SendResult> {
    return this.sendSingleTransaction(params, (composer, p) => composer.addNonParticipationKeyRegistration(p))
  }
}
