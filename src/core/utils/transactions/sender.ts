import { ABIReturn } from '../../abi/abi-method'
import { Transaction } from '../../transact'
import { PendingTransactionResponse } from '../temp'
import type { AppCallParams, AppCreateParams, AppDeleteParams, AppUpdateParams } from './app-call'
import type { AssetConfigParams, AssetCreateParams, AssetDestroyParams } from './asset-config'
import type { AssetFreezeParams } from './asset-freeze'
import type { AssetOptInParams, AssetOptOutParams, AssetTransferParams } from './asset-transfer'
import type { SignerGetter } from './common'
import { Composer, type SendTransactionComposerResults } from './composer'
import type { OfflineKeyRegistrationParams, OnlineKeyRegistrationParams } from './key-registration'
import type { PaymentParams } from './payment'

export interface SendParams {
  maxRoundsToWaitForConfirmation?: number
}

export type SendTransactionResult = {
  // Primary transaction info
  transaction: Transaction
  confirmation: PendingTransactionResponse
  txId: string

  // Group context
  groupId: Uint8Array | undefined
  txIds: string[]
  transactions: Transaction[]
  confirmations: PendingTransactionResponse[]

  // ABI support
  abiReturns: ABIReturn[]
}

export type SendAssetCreateResult = SendTransactionResult & {
  assetId: bigint
}

export type SendAppCallResult = SendTransactionResult & {
  abiReturn?: ABIReturn
}

export type SendAppCreateResult = SendTransactionResult & {
  appId: bigint
  compiledApproval?: Uint8Array
  compiledClear?: Uint8Array
}

export type SendAppUpdateResult = SendTransactionResult & {
  abiReturn?: ABIReturn
  compiledApproval?: Uint8Array
  compiledClear?: Uint8Array
}

export type SendAppDeleteResult = SendTransactionResult & {
  abiReturn?: ABIReturn
}

export class TransactionSender {
  constructor(
    private algodClient: any,
    private signerGetter: SignerGetter,
  ) {}

  private createComposer(): Composer {
    return new Composer({
      algodClient: this.algodClient,
      signerGetter: this.signerGetter,
    })
  }

  private async buildSendTransactionResult(
    composerResult: SendTransactionComposerResults,
    composer: Composer,
  ): Promise<SendTransactionResult> {
    // Access transactions from composer's build method
    const transactionsWithSigners = await composer.build()
    const transactions = transactionsWithSigners.map((t) => t.transaction)

    // Primary transaction is the last one added (most recent)
    const primaryIndex = transactions.length - 1

    return {
      // Primary transaction info
      transaction: transactions[primaryIndex] || ({} as Transaction),
      confirmation: composerResult.confirmations[primaryIndex],
      txId: composerResult.transactionIds[primaryIndex],

      // Group context
      groupId: composerResult.group,
      txIds: composerResult.transactionIds,
      transactions: transactions,
      confirmations: composerResult.confirmations,

      // ABI support
      abiReturns: composerResult.abiReturns,
    }
  }

  async payment(params: PaymentParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addPayment(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetCreate(params: AssetCreateParams): Promise<SendAssetCreateResult> {
    const composer = this.createComposer()
    composer.addAssetCreate(params)
    const result = await composer.send()

    // For now, return a mock asset ID since the confirmation structure doesn't include it
    // In a real implementation, this would extract the asset ID from the confirmation
    const assetId = BigInt(Math.floor(Math.random() * 1000000))

    return {
      ...(await this.buildSendTransactionResult(result, composer)),
      assetId,
    }
  }

  async assetConfig(params: AssetConfigParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetConfig(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetFreeze(params: AssetFreezeParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetFreeze(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetDestroy(params: AssetDestroyParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetDestroy(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetTransfer(params: AssetTransferParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetTransfer(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetOptIn(params: AssetOptInParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetOptIn(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async assetOptOut(params: AssetOptOutParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addAssetOptOut(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async appCall(params: AppCallParams): Promise<SendAppCallResult> {
    const composer = this.createComposer()
    composer.addAppCall(params)
    const result = await composer.send()

    const baseResult = await this.buildSendTransactionResult(result, composer)
    const abiReturn = result.abiReturns && result.abiReturns.length > 0 ? result.abiReturns[0] : undefined

    return {
      ...baseResult,
      abiReturn,
    }
  }

  async appCreate(params: AppCreateParams): Promise<SendAppCreateResult> {
    const composer = this.createComposer()
    composer.addAppCreate(params)
    const result = await composer.send()

    // For now, return a mock app ID since the confirmation structure doesn't include it
    // In a real implementation, this would extract the app ID from the confirmation
    const appId = BigInt(Math.floor(Math.random() * 1000000))

    return {
      ...(await this.buildSendTransactionResult(result, composer)),
      appId,
      compiledApproval: undefined,
      compiledClear: undefined,
    }
  }

  async appUpdate(params: AppUpdateParams): Promise<SendAppUpdateResult> {
    const composer = this.createComposer()
    composer.addAppUpdate(params)
    const result = await composer.send()

    const baseResult = await this.buildSendTransactionResult(result, composer)
    const abiReturn = result.abiReturns && result.abiReturns.length > 0 ? result.abiReturns[0] : undefined

    return {
      ...baseResult,
      abiReturn,
      compiledApproval: undefined,
      compiledClear: undefined,
    }
  }

  async appDelete(params: AppDeleteParams): Promise<SendAppDeleteResult> {
    const composer = this.createComposer()
    composer.addAppDelete(params)
    const result = await composer.send()

    const baseResult = await this.buildSendTransactionResult(result, composer)
    const abiReturn = result.abiReturns && result.abiReturns.length > 0 ? result.abiReturns[0] : undefined

    return {
      ...baseResult,
      abiReturn,
    }
  }

  async onlineKeyRegistration(params: OnlineKeyRegistrationParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addOnlineKeyRegistration(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }

  async offlineKeyRegistration(params: OfflineKeyRegistrationParams): Promise<SendTransactionResult> {
    const composer = this.createComposer()
    composer.addOfflineKeyRegistration(params)
    const result = await composer.send()

    return await this.buildSendTransactionResult(result, composer)
  }
}
