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

  private buildSendResult(composerResult: SendTransactionComposerResults): SendResult {
    return {
      transaction: composerResult.transactions.at(-1)!,
      confirmation: composerResult.confirmations.at(-1)!,
      transactionId: composerResult.transactionIds.at(-1)!,
    }
  }

  public async payment(params: PaymentParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addPayment(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetCreate(params: AssetCreateParams): Promise<SendAssetCreateResult> {
    const composer = this.newGroup()
    composer.addAssetCreate(params)
    const result = await composer.send()

    const baseResult = this.buildSendResult(result)

    const assetIndex = baseResult.confirmation.assetIndex
    if (assetIndex === undefined || assetIndex <= 0) {
      throw new Error('Asset creation confirmation missing assetIndex')
    }

    return {
      ...baseResult,
      assetId: assetIndex,
    }
  }

  public async assetConfig(params: AssetConfigParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetConfig(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetFreeze(params: AssetFreezeParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetFreeze(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetDestroy(params: AssetDestroyParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetDestroy(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetTransfer(params: AssetTransferParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetTransfer(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetOptIn(params: AssetOptInParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetOptIn(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetOptOut(params: AssetOptOutParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetOptOut(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async accountClose(params: AccountCloseParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAccountClose(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetClawback(params: AssetClawbackParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetClawback(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  public async assetUnfreeze(params: AssetUnfreezeParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAssetUnfreeze(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  async appCall(params: AppCallParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAppCall(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  async appCreate(params: AppCreateParams): Promise<SendAppCreateResult> {
    const composer = this.newGroup()
    composer.addAppCreate(params)
    const result = await composer.send()

    const baseResult = this.buildSendResult(result)
    const applicationIndex = baseResult.confirmation.applicationIndex
    if (applicationIndex === undefined || applicationIndex <= 0) {
      throw new Error('App creation confirmation missing applicationIndex')
    }

    return {
      ...baseResult,
      appId: applicationIndex,
    }
  }

  async appUpdate(params: AppUpdateParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAppUpdate(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  async appDelete(params: AppDeleteParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addAppDelete(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  private buildSendAppCallMethodCallResult(composerResult: SendTransactionComposerResults): SendAppCallMethodCallResult {
    return {
      transaction: composerResult.transactions.at(-1)!,
      confirmation: composerResult.confirmations.at(-1)!,
      transactionId: composerResult.transactionIds.at(-1)!,
      group: composerResult.group,
      confirmations: composerResult.confirmations,
      transactionIds: composerResult.transactionIds,
      transactions: composerResult.transactions,
      abiReturns: composerResult.abiReturns,
      abiReturn: composerResult.abiReturns.at(-1),
    }
  }

  async appCallMethodCall(params: AppCallMethodCallParams): Promise<SendAppCallMethodCallResult> {
    const composer = this.newGroup()
    composer.addAppCallMethodCall(params)
    const result = await composer.send()

    return this.buildSendAppCallMethodCallResult(result)
  }

  async appCreateMethodCall(params: AppCreateMethodCallParams): Promise<SendAppCreateMethodCallResult> {
    const composer = this.newGroup()
    composer.addAppCreateMethodCall(params)
    const result = await composer.send()

    const baseResult = this.buildSendAppCallMethodCallResult(result)
    const applicationIndex = baseResult.confirmation.applicationIndex
    if (applicationIndex === undefined || applicationIndex <= 0) {
      throw new Error('App creation confirmation missing applicationIndex')
    }

    return {
      ...baseResult,
      appId: applicationIndex,
    }
  }

  async appUpdateMethodCall(params: AppUpdateMethodCallParams): Promise<SendAppCallMethodCallResult> {
    const composer = this.newGroup()
    composer.addAppUpdateMethodCall(params)
    const result = await composer.send()

    return this.buildSendAppCallMethodCallResult(result)
  }

  async appDeleteMethodCall(params: AppDeleteMethodCallParams): Promise<SendAppCallMethodCallResult> {
    const composer = this.newGroup()
    composer.addAppDeleteMethodCall(params)
    const result = await composer.send()

    return this.buildSendAppCallMethodCallResult(result)
  }

  async onlineKeyRegistration(params: OnlineKeyRegistrationParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addOnlineKeyRegistration(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  async offlineKeyRegistration(params: OfflineKeyRegistrationParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addOfflineKeyRegistration(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }

  async nonParticipationKeyRegistration(params: NonParticipationKeyRegistrationParams): Promise<SendResult> {
    const composer = this.newGroup()
    composer.addNonParticipationKeyRegistration(params)
    const result = await composer.send()

    return this.buildSendResult(result)
  }
}
