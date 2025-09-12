// TODO: Once all the abstractions and http clients have been implement, then this should be removed.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Transaction composer implementation based on the Rust AlgoKit Core composer.
 * This provides a clean interface for building and executing transaction groups.
 */

import { ABIMethod } from '../../abi'
import { ABIReturn } from '../../abi/abi-method'
import { decodeABIValue } from '../../abi/abi-type'
import { getAppAddress } from '../../address'
import { concatArrays } from '../../array'
import { EMPTY_SIGNATURE, MAX_ACCOUNT_REFERENCES, MAX_OVERALL_REFERENCES, MAX_TX_GROUP_SIZE } from '../../constants'
import {
  SignedTransaction,
  Transaction,
  TransactionType,
  assignFee,
  calculateFee,
  encodeSignedTransactions,
  getTransactionId,
  groupTransactions,
} from '../../transact'
import { genesisIdIsLocalNet } from '../clients/network-client'
import {
  ApplicationLocalReference,
  AssetHoldingReference,
  BoxReference,
  PendingTransactionResponse,
  SimulateResponse,
  SimulateUnnamedResourcesAccessed,
  TransactionParams,
} from '../temp'
import {
  AppCallMethodCallParams,
  AppCallParams,
  AppCreateMethodCallParams,
  AppCreateParams,
  AppDeleteMethodCallParams,
  AppDeleteParams,
  AppMethodCallArg,
  AppUpdateMethodCallParams,
  AppUpdateParams,
  ProcessedAppCallMethodCallComposerTransaction,
  ProcessedAppCreateMethodCallComposerTransaction,
  ProcessedAppDeleteMethodCallComposerTransaction,
  ProcessedAppUpdateMethodCallComposerTransaction,
  asProcessedAppCallMethodCallParams,
  buildAppCall,
  buildAppCallMethodCall,
  buildAppCreate,
  buildAppCreateMethodCall,
  buildAppDelete,
  buildAppDeleteMethodCall,
  buildAppUpdate,
  buildAppUpdateMethodCall,
  isComposerTransactionParamsArg,
  isMethodCallComposerTransactionParamsArg,
  isTransactionArg,
  isTransactionWithSignerArg,
  processAppMethodCallArgs,
} from './app-call'
import {
  AssetConfigParams,
  AssetCreateParams,
  AssetDestroyParams,
  buildAssetConfig,
  buildAssetCreate,
  buildAssetDestroy,
} from './asset-config'

import { AssetFreezeParams, AssetUnfreezeParams, buildAssetFreeze, buildAssetUnfreeze } from './asset-freeze'
import {
  AssetClawbackParams,
  AssetOptInParams,
  AssetOptOutParams,
  AssetTransferParams,
  buildAssetClawback,
  buildAssetOptIn,
  buildAssetOptOut,
  buildAssetTransfer,
} from './asset-transfer'
import {
  ComposerTransactionType,
  CommonTransactionParams,
  ProcessedAbstractedComposerTransaction,
  TransactionComposerTransaction,
  TransactionHeader,
  TransactionSigner,
  SignerGetter,
  TransactionWithSigner,
  TransactionWithSignerComposerTransaction,
} from './common'
import { FeeDelta, FeePriority } from './fee-coverage'
import {
  NonParticipationKeyRegistrationParams,
  OfflineKeyRegistrationParams,
  OnlineKeyRegistrationParams,
  buildNonParticipationKeyRegistration,
  buildOfflineKeyRegistration,
  buildOnlineKeyRegistration,
} from './key-registration'
import { AccountCloseParams, PaymentParams, buildAccountClose, buildPayment } from './payment'

// ABI return values are stored in logs with the prefix 0x151f7c75
const ABI_RETURN_PREFIX = new Uint8Array([0x15, 0x1f, 0x7c, 0x75])

export interface SendParams {
  maxRoundsToWaitForConfirmation?: number
}

export interface ResourcePopulation {
  enabled: boolean
  useAccessList: boolean
}

export type ComposerTransaction =
  | TransactionComposerTransaction
  | TransactionWithSignerComposerTransaction
  | ProcessedAbstractedComposerTransaction

type TransactionAnalysis = {
  /** The fee difference required for this transaction */
  requiredFeeDelta?: FeeDelta
  /** Resources accessed by this transaction but not declared */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

type GroupAnalysis = {
  /** Analysis of each transaction in the group */
  transactions: TransactionAnalysis[]
  /** Resources accessed by the group that qualify for group resource sharing */
  unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
}

enum GroupResourceType {
  Account,
  App,
  Asset,
  Box,
  ExtraBoxRef,
  AssetHolding,
  AppLocal,
}

type GroupResourceToPopulate =
  | { type: GroupResourceType.Account; data: string }
  | { type: GroupResourceType.App; data: bigint }
  | { type: GroupResourceType.Asset; data: bigint }
  | { type: GroupResourceType.Box; data: BoxReference }
  | { type: GroupResourceType.ExtraBoxRef }
  | { type: GroupResourceType.AssetHolding; data: AssetHoldingReference }
  | { type: GroupResourceType.AppLocal; data: ApplicationLocalReference }

export type SendTransactionComposerResults = {
  group?: Uint8Array
  transactionIds: string[]
  confirmations: PendingTransactionResponse[]
  abiReturns: ABIReturn[]
}

export type ComposerParams = {
  algodClient: any
  signerGetter: SignerGetter
  composerConfig?: TransactionComposerConfig
}

export type TransactionComposerConfig = {
  coverAppCallInnerTransactionFees: boolean
  populateAppCallResources: ResourcePopulation
}

export class Composer {
  private algodClient: any // TODO: Replace with client once implemented
  private signerGetter: SignerGetter
  private composerConfig: TransactionComposerConfig

  private transactions = new Array<ComposerTransaction>()
  private builtGroup?: TransactionWithSigner[]
  private signedGroup?: SignedTransaction[]

  constructor(params: ComposerParams) {
    this.algodClient = params.algodClient
    this.signerGetter = params.signerGetter
    this.composerConfig = params.composerConfig ?? {
      coverAppCallInnerTransactionFees: false,
      populateAppCallResources: { enabled: true, useAccessList: false },
    }
  }

  private push(...txns: ComposerTransaction[]) {
    if (this.builtGroup) {
      throw new Error('Cannot add new transactions after building')
    }

    if (txns.length + this.transactions.length > MAX_TX_GROUP_SIZE) {
      throw new Error(`Transaction group size exceeds the max limit of: ${MAX_TX_GROUP_SIZE}`)
    }
    this.transactions.push(...txns)
  }

  private addAppMethodCallInternal(args: AppMethodCallArg[], transaction: ProcessedAbstractedComposerTransaction): void {
    const composerTransactions = extractComposerTransactionsFromAppMethodCallParams(args)
    composerTransactions.push(transaction)
    this.push(...composerTransactions)
  }

  public addPayment(params: PaymentParams) {
    this.push({ type: ComposerTransactionType.Payment, data: params })
  }

  public addAccountClose(params: AccountCloseParams) {
    this.push({ type: ComposerTransactionType.AccountClose, data: params })
  }

  public addAssetTransfer(params: AssetTransferParams) {
    this.push({ type: ComposerTransactionType.AssetTransfer, data: params })
  }

  public addAssetOptIn(params: AssetOptInParams) {
    this.push({ type: ComposerTransactionType.AssetOptIn, data: params })
  }

  public addAssetOptOut(params: AssetOptOutParams) {
    this.push({ type: ComposerTransactionType.AssetOptOut, data: params })
  }

  public addAssetClawback(params: AssetClawbackParams) {
    this.push({ type: ComposerTransactionType.AssetClawback, data: params })
  }

  public addAssetCreate(params: AssetCreateParams) {
    this.push({ type: ComposerTransactionType.AssetCreate, data: params })
  }

  public addAssetConfig(params: AssetConfigParams) {
    this.push({ type: ComposerTransactionType.AssetConfig, data: params })
  }

  public addAssetDestroy(params: AssetDestroyParams) {
    this.push({ type: ComposerTransactionType.AssetDestroy, data: params })
  }

  public addAssetFreeze(params: AssetFreezeParams) {
    this.push({ type: ComposerTransactionType.AssetFreeze, data: params })
  }

  public addAssetUnfreeze(params: AssetUnfreezeParams) {
    this.push({ type: ComposerTransactionType.AssetUnfreeze, data: params })
  }

  public addOnlineKeyRegistration(params: OnlineKeyRegistrationParams) {
    this.push({ type: ComposerTransactionType.OnlineKeyRegistration, data: params })
  }

  public addOfflineKeyRegistration(params: OfflineKeyRegistrationParams) {
    this.push({ type: ComposerTransactionType.OfflineKeyRegistration, data: params })
  }

  public addNonParticipationKeyRegistration(params: NonParticipationKeyRegistrationParams) {
    this.push({ type: ComposerTransactionType.NonParticipationKeyRegistration, data: params })
  }

  public addAppCall(params: AppCallParams) {
    this.push({ type: ComposerTransactionType.AppCall, data: params })
  }

  public addAppCreate(params: AppCreateParams) {
    this.push({ type: ComposerTransactionType.AppCreateCall, data: params })
  }

  public addAppUpdate(params: AppUpdateParams) {
    this.push({ type: ComposerTransactionType.AppUpdateCall, data: params })
  }

  public addAppDelete(params: AppDeleteParams) {
    this.push({ type: ComposerTransactionType.AppDeleteCall, data: params })
  }

  public addAppCallMethodCall(params: AppCallMethodCallParams) {
    this.addAppMethodCallInternal(params.args, {
      type: ComposerTransactionType.AppCallMethodCall,
      data: {
        ...params,
        args: processAppMethodCallArgs(params.args),
      },
    } satisfies ProcessedAppCallMethodCallComposerTransaction)
  }

  public addAppCreateMethodCall(params: AppCreateMethodCallParams) {
    this.addAppMethodCallInternal(params.args, {
      type: ComposerTransactionType.AppCreateMethodCall,
      data: {
        ...params,
        args: processAppMethodCallArgs(params.args),
      },
    } satisfies ProcessedAppCreateMethodCallComposerTransaction)
  }

  public addAppUpdateMethodCall(params: AppUpdateMethodCallParams) {
    this.addAppMethodCallInternal(params.args, {
      type: ComposerTransactionType.AppUpdateMethodCall,
      data: {
        ...params,
        args: processAppMethodCallArgs(params.args),
      },
    } satisfies ProcessedAppUpdateMethodCallComposerTransaction)
  }

  public addAppDeleteMethodCall(params: AppDeleteMethodCallParams) {
    this.addAppMethodCallInternal(params.args, {
      type: ComposerTransactionType.AppDeleteMethodCall,
      data: {
        ...params,
        args: processAppMethodCallArgs(params.args),
      },
    } satisfies ProcessedAppDeleteMethodCallComposerTransaction)
  }

  public addTransaction(transaction: Transaction, signer?: TransactionSigner) {
    if (transaction.group && transaction.group.some((v) => v !== 0)) {
      throw new Error('Cannot add a transaction with nonzero group')
    }
    if (signer) {
      this.push({ type: ComposerTransactionType.TransactionWithSigner, data: { transaction, signer } })
    } else {
      this.push({ type: ComposerTransactionType.Transaction, data: transaction })
    }
  }

  private getSigner(address: string) {
    return this.signerGetter.getSigner(address)
  }

  private async getSuggestedParams(): Promise<TransactionParams> {
    // TODO: Add caching with expiration
    return await this.algodClient.getTransactionParams()
  }

  private buildTransactionHeader(
    commonParams: CommonTransactionParams,
    suggestedParams: TransactionParams,
    defaultValidityWindow: number,
  ): TransactionHeader {
    const firstValid = commonParams.firstValidRound ?? suggestedParams.lastRound

    return {
      sender: commonParams.sender,
      rekeyTo: commonParams.rekeyTo,
      note: commonParams.note,
      lease: commonParams.lease,
      fee: commonParams.staticFee,
      genesisId: suggestedParams.genesisId,
      genesisHash: suggestedParams.genesisHash,
      firstValid,
      lastValid:
        commonParams.lastValidRound ??
        (commonParams.validityWindow !== undefined
          ? firstValid + BigInt(commonParams.validityWindow)
          : firstValid + BigInt(defaultValidityWindow)),
      group: undefined,
    }
  }

  private async buildTransactions(
    suggestedParams: TransactionParams,
    defaultValidityWindow: number,
    groupAnalysis?: GroupAnalysis,
  ): Promise<Transaction[]> {
    let builtTransactions = new Array<Transaction>()

    for (const ctxn of this.transactions) {
      let transaction: Transaction
      const commonParams = getCommonParams(ctxn)
      const header = this.buildTransactionHeader(commonParams, suggestedParams, defaultValidityWindow)
      let calculateFee = header.fee === undefined

      switch (ctxn.type) {
        case ComposerTransactionType.Transaction:
          calculateFee = false
          transaction = ctxn.data
          break
        case ComposerTransactionType.TransactionWithSigner:
          calculateFee = false
          transaction = ctxn.data.transaction
          break
        case ComposerTransactionType.Payment:
          transaction = buildPayment(ctxn.data, header)
          break
        case ComposerTransactionType.AccountClose:
          transaction = buildAccountClose(ctxn.data, header)
          break
        case ComposerTransactionType.AssetTransfer:
          transaction = buildAssetTransfer(ctxn.data, header)
          break
        case ComposerTransactionType.AssetOptIn:
          transaction = buildAssetOptIn(ctxn.data, header)
          break
        case ComposerTransactionType.AssetOptOut:
          transaction = buildAssetOptOut(ctxn.data, header)
          break
        case ComposerTransactionType.AssetClawback:
          transaction = buildAssetClawback(ctxn.data, header)
          break
        case ComposerTransactionType.AssetCreate:
          transaction = buildAssetCreate(ctxn.data, header)
          break
        case ComposerTransactionType.AssetConfig:
          transaction = buildAssetConfig(ctxn.data, header)
          break
        case ComposerTransactionType.AssetDestroy:
          transaction = buildAssetDestroy(ctxn.data, header)
          break
        case ComposerTransactionType.AssetFreeze:
          transaction = buildAssetFreeze(ctxn.data, header)
          break
        case ComposerTransactionType.AssetUnfreeze:
          transaction = buildAssetUnfreeze(ctxn.data, header)
          break
        case ComposerTransactionType.AppCall:
          transaction = buildAppCall(ctxn.data, header)
          break
        case ComposerTransactionType.AppCreateCall:
          transaction = buildAppCreate(ctxn.data, header)
          break
        case ComposerTransactionType.AppUpdateCall:
          transaction = buildAppUpdate(ctxn.data, header)
          break
        case ComposerTransactionType.AppDeleteCall:
          transaction = buildAppDelete(ctxn.data, header)
          break
        case ComposerTransactionType.AppCallMethodCall:
          transaction = buildAppCallMethodCall(ctxn.data, header)
          break
        case ComposerTransactionType.AppCreateMethodCall:
          transaction = buildAppCreateMethodCall(ctxn.data, header)
          break
        case ComposerTransactionType.AppUpdateMethodCall:
          transaction = buildAppUpdateMethodCall(ctxn.data, header)
          break
        case ComposerTransactionType.AppDeleteMethodCall:
          transaction = buildAppDeleteMethodCall(ctxn.data, header)
          break
        case ComposerTransactionType.OnlineKeyRegistration:
          transaction = buildOnlineKeyRegistration(ctxn.data, header)
          break
        case ComposerTransactionType.OfflineKeyRegistration:
          transaction = buildOfflineKeyRegistration(ctxn.data, header)
          break
        case ComposerTransactionType.NonParticipationKeyRegistration:
          transaction = buildNonParticipationKeyRegistration(ctxn.data, header)
          break
        default:
          // This should never happen if all cases are covered

          throw new Error(`Unsupported transaction type: ${(ctxn as any).type}`)
      }

      if (calculateFee) {
        transaction = assignFee(transaction, {
          feePerByte: suggestedParams.fee,
          minFee: suggestedParams.minFee,
          extraFee: commonParams.extraFee,
          maxFee: commonParams.maxFee,
        })
      }

      builtTransactions.push(transaction)
    }

    if (groupAnalysis) {
      // Process fee adjustments
      let surplusGroupFees = 0n
      const transactionAnalysis: Array<{
        groupIndex: number
        requiredFeeDelta?: FeeDelta
        priority: FeePriority
        unnamedResourcesAccessed?: SimulateUnnamedResourcesAccessed
      }> = []

      // Process fee adjustments
      groupAnalysis.transactions.forEach((txnAnalysis, groupIndex) => {
        // Accumulate surplus fees
        if (txnAnalysis.requiredFeeDelta && FeeDelta.isSurplus(txnAnalysis.requiredFeeDelta)) {
          surplusGroupFees += FeeDelta.amount(txnAnalysis.requiredFeeDelta)
        }

        // Calculate priority and add to transaction info
        const ctxn = this.transactions[groupIndex]
        const txn = builtTransactions[groupIndex]
        const logicalMaxFee = getLogicalMaxFee(ctxn)
        const isImmutableFee = logicalMaxFee !== undefined && logicalMaxFee === (txn.fee || 0n)

        let priority = FeePriority.Covered
        if (txnAnalysis.requiredFeeDelta && FeeDelta.isDeficit(txnAnalysis.requiredFeeDelta)) {
          const deficitAmount = FeeDelta.amount(txnAnalysis.requiredFeeDelta)
          if (isImmutableFee || txn.transactionType !== TransactionType.AppCall) {
            // High priority: transactions that can't be modified
            priority = FeePriority.ImmutableDeficit(deficitAmount)
          } else {
            // Normal priority: app call transactions that can be modified
            priority = FeePriority.ModifiableDeficit(deficitAmount)
          }
        }

        transactionAnalysis.push({
          groupIndex,
          requiredFeeDelta: txnAnalysis.requiredFeeDelta,
          priority,
          unnamedResourcesAccessed: txnAnalysis.unnamedResourcesAccessed,
        })
      })

      // Sort transactions by priority (highest first)
      transactionAnalysis.sort((a, b) => b.priority.compare(a.priority))

      // Cover any additional fees required for the transactions
      for (const { groupIndex, requiredFeeDelta, unnamedResourcesAccessed } of transactionAnalysis) {
        if (requiredFeeDelta && FeeDelta.isDeficit(requiredFeeDelta)) {
          const deficitAmount = FeeDelta.amount(requiredFeeDelta)
          let additionalFeeDelta: FeeDelta | undefined

          if (surplusGroupFees === 0n) {
            // No surplus group fees, the transaction must cover its own deficit
            additionalFeeDelta = requiredFeeDelta
          } else if (surplusGroupFees >= deficitAmount) {
            // Surplus fully covers the deficit
            surplusGroupFees -= deficitAmount
          } else {
            // Surplus partially covers the deficit
            additionalFeeDelta = FeeDelta.fromBigInt(deficitAmount - surplusGroupFees)
            surplusGroupFees = 0n
          }

          // If there is any additional fee deficit, the transaction must cover it by modifying the fee
          if (additionalFeeDelta && FeeDelta.isDeficit(additionalFeeDelta)) {
            const additionalDeficitAmount = FeeDelta.amount(additionalFeeDelta)

            if (builtTransactions[groupIndex].transactionType === TransactionType.AppCall) {
              const currentFee = builtTransactions[groupIndex].fee || 0n
              const transactionFee = currentFee + additionalDeficitAmount

              const logicalMaxFee = getLogicalMaxFee(this.transactions[groupIndex])
              if (!logicalMaxFee || transactionFee > logicalMaxFee) {
                throw new Error(
                  `Calculated transaction fee ${transactionFee} µALGO is greater than max of ${logicalMaxFee ?? 0n} for transaction ${groupIndex}`,
                )
              }

              builtTransactions[groupIndex].fee = transactionFee
            } else {
              throw new Error(
                `An additional fee of ${additionalDeficitAmount} µALGO is required for non app call transaction ${groupIndex}`,
              )
            }
          }
        }

        // Apply transaction-level resource population
        if (unnamedResourcesAccessed && builtTransactions[groupIndex].transactionType === TransactionType.AppCall) {
          populateTransactionResources(builtTransactions[groupIndex], unnamedResourcesAccessed, groupIndex)
        }
      }

      // Apply group-level resource population
      if (groupAnalysis.unnamedResourcesAccessed) {
        populateGroupResources(builtTransactions, groupAnalysis.unnamedResourcesAccessed)
      }
    }

    if (builtTransactions.length > 1) {
      builtTransactions = groupTransactions(builtTransactions)
    }

    return builtTransactions
  }

  private gatherSigners(transactions: Transaction[]): TransactionWithSigner[] {
    return transactions.map((txn, index) => {
      const ctxn = this.transactions[index]
      const commonParams = getCommonParams(ctxn)
      const signer = commonParams.signer || this.getSigner(txn.sender)

      return {
        transaction: txn,
        signer,
      }
    })
  }

  public async build(): Promise<TransactionWithSigner[]> {
    if (this.builtGroup) {
      return this.builtGroup
    }

    const suggestedParams = await this.getSuggestedParams()
    const defaultValidityWindow = getDefaultValidityWindow(suggestedParams.genesisId)

    const groupAnalysis =
      (this.composerConfig.coverAppCallInnerTransactionFees || this.composerConfig.populateAppCallResources.enabled) &&
      this.transactions.some((t) => isAppCall(t))
        ? await this.analyzeGroupRequirements(suggestedParams, defaultValidityWindow, this.composerConfig)
        : undefined

    const transactions = await this.buildTransactions(suggestedParams, defaultValidityWindow, groupAnalysis)
    const transactionsWithSigners = this.gatherSigners(transactions)

    this.builtGroup = transactionsWithSigners
    return this.builtGroup
  }

  private async analyzeGroupRequirements(
    suggestedParams: TransactionParams,
    defaultValidityWindow: number,
    analysisParams: TransactionComposerConfig,
  ): Promise<GroupAnalysis> {
    const appCallIndexesWithoutMaxFees: number[] = []

    const builtTransactions = await this.buildTransactions(suggestedParams, defaultValidityWindow)

    let transactionsToSimulate = builtTransactions.map((txn, groupIndex) => {
      const ctxn = this.transactions[groupIndex]
      const txnToSimulate = { ...txn }
      txnToSimulate.group = undefined
      if (analysisParams.coverAppCallInnerTransactionFees && txn.transactionType === TransactionType.AppCall) {
        const logicalMaxFee = getLogicalMaxFee(ctxn)
        if (logicalMaxFee !== undefined) {
          txnToSimulate.fee = logicalMaxFee
        } else {
          appCallIndexesWithoutMaxFees.push(groupIndex)
        }
      }

      return txnToSimulate
    })

    // Regroup the transactions, as the transactions have likely been adjusted
    if (transactionsToSimulate.length > 1) {
      transactionsToSimulate = groupTransactions(transactionsToSimulate)
    }

    // Check for required max fees on app calls when fee coverage is enabled
    if (analysisParams.coverAppCallInnerTransactionFees && appCallIndexesWithoutMaxFees.length > 0) {
      throw new Error(
        `Please provide a max fee for each app call transaction when inner transaction fee coverage is enabled. Required for transaction ${appCallIndexesWithoutMaxFees.join(', ')}`,
      )
    }

    const signedTransactions = transactionsToSimulate.map(
      (txn) =>
        ({
          transaction: txn,
          signature: EMPTY_SIGNATURE,
        }) satisfies SignedTransaction,
    )

    const simulateRequest = {
      txnGroups: [
        {
          txns: signedTransactions,
        },
      ],
      allowUnnamedResources: true,
      allowEmptySignatures: true,
      fixSigners: true,
    }

    const response: SimulateResponse = await this.algodClient.simulateTransaction(simulateRequest)
    const groupResponse = response.txnGroups[0]

    // Handle any simulation failures
    if (groupResponse.failureMessage) {
      if (analysisParams.coverAppCallInnerTransactionFees && groupResponse.failureMessage.includes('fee too small')) {
        throw new Error(
          'Fees were too small to analyze group requirements via simulate. You may need to increase an app call transaction max fee.',
        )
      }

      throw new Error(
        `Error analyzing group requirements via simulate in transaction ${groupResponse.failedAt?.join(', ')}: ${groupResponse.failureMessage}`,
      )
    }

    const txnAnalysisResults: TransactionAnalysis[] = groupResponse.txnResults.map((simulateTxnResult, groupIndex) => {
      const btxn = builtTransactions[groupIndex]

      let requiredFeeDelta: FeeDelta | undefined

      if (analysisParams.coverAppCallInnerTransactionFees) {
        const minTxnFee = calculateFee(btxn, {
          feePerByte: suggestedParams.fee,
          minFee: suggestedParams.minFee,
        })
        const txnFee = btxn.fee ?? 0n
        const txnFeeDelta = FeeDelta.fromBigInt(minTxnFee - txnFee)

        if (btxn.transactionType === TransactionType.AppCall) {
          // Calculate inner transaction fee delta
          const innerTxnsFeeDelta = calculateInnerFeeDelta(simulateTxnResult.txnResult.innerTxns, suggestedParams.minFee)
          requiredFeeDelta = FeeDelta.fromBigInt(
            (innerTxnsFeeDelta ? FeeDelta.toBigInt(innerTxnsFeeDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
          )
        } else {
          requiredFeeDelta = txnFeeDelta
        }
      }

      return {
        requiredFeeDelta,
        unnamedResourcesAccessed: analysisParams.populateAppCallResources?.enabled ? simulateTxnResult.unnamedResourcesAccessed : undefined,
      }
    })

    return {
      transactions: txnAnalysisResults,
      unnamedResourcesAccessed: analysisParams.populateAppCallResources?.enabled ? groupResponse.unnamedResourcesAccessed : undefined,
    }
  }

  public async gatherSignatures(): Promise<SignedTransaction[]> {
    if (this.signedGroup) {
      return this.signedGroup
    }

    await this.build()

    if (!this.builtGroup || this.builtGroup.length === 0) {
      throw new Error('No transactions available')
    }

    const txnGroup = this.builtGroup.map((txnWithSigner) => txnWithSigner.transaction)

    // Group transactions by signer
    const signerGroups = new Map<TransactionSigner, number[]>()
    this.builtGroup.forEach(({ signer }, index) => {
      const indexes = signerGroups.get(signer) ?? []
      indexes.push(index)
      signerGroups.set(signer, indexes)
    })

    // Sign transactions in parallel for each signer
    const signerEntries = Array.from(signerGroups)
    const signedGroups = await Promise.all(signerEntries.map(([signer, indexes]) => signer.signTransactions(txnGroup, indexes)))

    // Reconstruct signed transactions in original order
    const signedTransactions = new Array<SignedTransaction>(this.builtGroup.length)
    signerEntries.forEach(([, indexes], signerIndex) => {
      const stxs = signedGroups[signerIndex]
      indexes.forEach((txIndex, stxIndex) => {
        signedTransactions[txIndex] = stxs[stxIndex]
      })
    })

    // Verify all transactions were signed
    const unsignedIndexes = signedTransactions
      .map((stxn, index) => (stxn === undefined ? index : null))
      .filter((index): index is number => index !== null)

    if (unsignedIndexes.length > 0) {
      throw new Error(`Transactions at indexes [${unsignedIndexes.join(', ')}] were not signed`)
    }

    this.signedGroup = signedTransactions
    return this.signedGroup
  }

  public async send(params?: SendParams): Promise<SendTransactionComposerResults> {
    await this.gatherSignatures()

    if (!this.signedGroup || this.signedGroup.length === 0) {
      throw new Error('No transactions available')
    }

    const group = this.signedGroup[0].transaction.group

    let waitRounds = params?.maxRoundsToWaitForConfirmation

    if (waitRounds === undefined) {
      const suggestedParams = await this.getSuggestedParams()
      const firstRound = suggestedParams.lastRound
      const lastRound = this.signedGroup.reduce(
        (max, txn) => (txn.transaction.lastValid > max ? txn.transaction.lastValid : BigInt(max)),
        0n,
      )
      waitRounds = Number(BigInt(lastRound) - BigInt(firstRound)) + 1
    }

    const encodedTxns = encodeSignedTransactions(this.signedGroup)
    const encodedBytes = concatArrays(...encodedTxns)

    await this.algodClient.rawTransaction(encodedBytes)

    const transactionIds = this.signedGroup.map((stxn) => getTransactionId(stxn.transaction))

    const confirmations = new Array<PendingTransactionResponse>()
    if (params?.maxRoundsToWaitForConfirmation) {
      for (const id of transactionIds) {
        const confirmation = await this.waitForConfirmation(id, waitRounds)
        confirmations.push(confirmation)
      }
    }

    return {
      group,
      transactionIds,
      confirmations,
      abiReturns: this.parseAbiReturnValues(confirmations),
    }
  }

  public count(): number {
    return this.transactions.length
  }

  private async waitForConfirmation(txId: string, maxRoundsToWait: number): Promise<PendingTransactionResponse> {
    const status = await this.algodClient.status().do()
    const startRound = status.lastRound + 1
    let currentRound = startRound
    while (currentRound < startRound + BigInt(maxRoundsToWait)) {
      try {
        const pendingInfo = await this.algodClient.pendingTransactionInformation(txId)
        const confirmedRound = pendingInfo.confirmedRound
        if (confirmedRound !== undefined && confirmedRound > 0n) {
          return pendingInfo
        } else {
          const poolError = pendingInfo.poolError
          if (poolError !== undefined && poolError.length > 0) {
            // If there was a pool error, then the transaction has been rejected!
            throw new Error(`Transaction ${txId} was rejected; pool error: ${poolError}`)
          }
        }
      } catch (e: unknown) {
        // TODO: Handle the 404 correctly once algod client is build
        if (e instanceof Error && e.message.includes('404')) {
          currentRound++
          continue
        }
      }
      await this.algodClient.statusAfterBlock(currentRound)
      currentRound++
    }

    throw new Error(`Transaction ${txId} unconfirmed after ${maxRoundsToWait} rounds`)
  }

  private parseAbiReturnValues(confirmations: PendingTransactionResponse[]): ABIReturn[] {
    const abiReturns = new Array<ABIReturn>()

    for (let i = 0; i < confirmations.length; i++) {
      const confirmation = confirmations[i]
      const transaction = this.transactions[i]

      if (transaction) {
        const method = getMethodFromTransaction(transaction)
        if (method) {
          const abiReturn = extractAbiReturnFromLogs(confirmation, method)
          abiReturns.push(abiReturn)
        }
      }
    }

    return abiReturns
  }
}

/**
 * Extracts nested composer transactions from app method call arguments.
 * This function recursively processes the arguments and collects all transaction
 * parameters that need to be added to the composer before the method call itself.
 */
function extractComposerTransactionsFromAppMethodCallParams(methodCallArgs: AppMethodCallArg[]): ComposerTransaction[] {
  const composerTransactions = new Array<ComposerTransaction>()

  for (const arg of methodCallArgs) {
    if (arg === undefined) {
      // is a TransactionOrDefaultValuePlaceholder
      continue
    } else if (isTransactionArg(arg)) {
      composerTransactions.push({ type: ComposerTransactionType.Transaction, data: arg })
      continue
    } else if (isTransactionWithSignerArg(arg)) {
      composerTransactions.push({ type: ComposerTransactionType.TransactionWithSigner, data: arg })
      continue
    } else if (isComposerTransactionParamsArg(arg)) {
      if (isMethodCallComposerTransactionParamsArg(arg)) {
        const nestedComposerTransactions = extractComposerTransactionsFromAppMethodCallParams(arg.data.args)
        composerTransactions.push(...nestedComposerTransactions)
        composerTransactions.push(asProcessedAppCallMethodCallParams(arg))
      } else {
        composerTransactions.push(arg)
      }
    }
  }

  return composerTransactions
}

/**
 * Helper function to check if an app call transaction is below resource limit
 */
function isAppCallBelowResourceLimit(txn: Transaction): boolean {
  if (txn.transactionType !== TransactionType.AppCall) {
    return false
  }

  const accountsCount = txn.appCall?.accountReferences?.length || 0
  const assetsCount = txn.appCall?.assetReferences?.length || 0
  const appsCount = txn.appCall?.appReferences?.length || 0
  const boxesCount = txn.appCall?.boxReferences?.length || 0

  const MAX_OVERALL_REFERENCES = 8
  return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
}

/**
 * Helper function to populate a specific resource into a transaction group
 */
function populateGroupResource(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  resource: GroupResourceToPopulate,
): void {
  // For asset holdings and app locals, first try to find a transaction that already has the account available
  if (resource.type === GroupResourceType.AssetHolding || resource.type === GroupResourceType.AppLocal) {
    const account = resource.data.account

    // Try to find a transaction that already has the account available
    const groupIndex1 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!

      // Check if account is in foreign accounts array
      if (appCall.accountReferences?.includes(account)) {
        return true
      }

      // Check if account is available as an app account
      if (appCall.appReferences) {
        for (const appId of appCall.appReferences) {
          if (account === getAppAddress(appId)) {
            return true
          }
        }
      }

      // Check if account appears in any app call transaction fields
      if (txn.sender === account) {
        return true
      }

      return false
    })

    if (groupIndex1 !== -1) {
      const appCall = transactions[groupIndex1].appCall!
      if (resource.type === GroupResourceType.AssetHolding) {
        appCall.assetReferences = appCall.assetReferences ?? []
        if (!appCall.assetReferences.includes(resource.data.asset)) {
          appCall.assetReferences.push(resource.data.asset)
        }
      } else {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.app)) {
          appCall.appReferences.push(resource.data.app)
        }
      }
      return
    }

    // Try to find a transaction that has the asset/app available and space for account
    const groupIndex2 = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = transactions[groupIndex1].appCall!
      if ((appCall.accountReferences?.length ?? 0) >= MAX_ACCOUNT_REFERENCES) {
        return false
      }

      if (resource.type === GroupResourceType.AssetHolding) {
        return appCall.assetReferences?.includes(resource.data.asset) || false
      } else {
        return appCall.appReferences?.includes(resource.data.app) || appCall.appId === resource.data.app
      }
    })

    if (groupIndex2 !== -1) {
      const appCall = transactions[groupIndex1].appCall!
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(account)) {
        appCall.accountReferences.push(account)
      }
      return
    }
  }

  // For boxes, first try to find a transaction that already has the app available
  if (resource.type === GroupResourceType.Box) {
    const groupIndex = transactions.findIndex((txn) => {
      if (!isAppCallBelowResourceLimit(txn)) {
        return false
      }

      const appCall = txn.appCall!
      return appCall.appReferences?.includes(resource.data.app) || appCall.appId === resource.data.app
    })

    if (groupIndex !== -1) {
      const appCall = transactions[groupIndex].appCall!
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.app &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.app, name: resource.data.name })
      }
      return
    }
  }

  // Find the first transaction that can accommodate the resource
  const groupIndex = transactions.findIndex((txn) => {
    if (txn.transactionType !== TransactionType.AppCall) {
      return false
    }

    const appCall = txn.appCall!
    const accountsCount = appCall.accountReferences?.length ?? 0
    const assetsCount = appCall.assetReferences?.length ?? 0
    const appsCount = appCall.appReferences?.length ?? 0
    const boxesCount = appCall.boxReferences?.length ?? 0

    switch (resource.type) {
      case GroupResourceType.Account:
        return accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.AssetHolding:
      case GroupResourceType.AppLocal:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1 && accountsCount < MAX_ACCOUNT_REFERENCES
      case GroupResourceType.Box:
        if (resource.data.app !== 0n) {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES - 1
        } else {
          return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
        }
      default:
        return accountsCount + assetsCount + appsCount + boxesCount < MAX_OVERALL_REFERENCES
    }
  })

  if (groupIndex === -1) {
    throw new Error('No more transactions below reference limit. Add another app call to the group.')
  }

  const appCall = transactions[groupIndex].appCall!

  switch (resource.type) {
    case GroupResourceType.Account:
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data)) {
        appCall.accountReferences.push(resource.data)
      }
      break
    case GroupResourceType.App:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data)) {
        appCall.appReferences.push(resource.data)
      }
      break
    case GroupResourceType.Box: {
      appCall.boxReferences = appCall.boxReferences ?? []
      const exists = appCall.boxReferences.some(
        (b) =>
          b.appId === resource.data.app &&
          b.name.length === resource.data.name.length &&
          b.name.every((byte, i) => byte === resource.data.name[i]),
      )
      if (!exists) {
        appCall.boxReferences.push({ appId: resource.data.app, name: resource.data.name })
      }
      if (resource.data.app !== 0n) {
        appCall.appReferences = appCall.appReferences ?? []
        if (!appCall.appReferences.includes(resource.data.app)) {
          appCall.appReferences.push(resource.data.app)
        }
      }
      break
    }
    case GroupResourceType.ExtraBoxRef:
      appCall.boxReferences = appCall.boxReferences ?? []
      appCall.boxReferences.push({ appId: 0n, name: new Uint8Array(0) })
      break
    case GroupResourceType.AssetHolding:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data.asset)) {
        appCall.assetReferences.push(resource.data.asset)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.AppLocal:
      appCall.appReferences = appCall.appReferences ?? []
      if (!appCall.appReferences.includes(resource.data.app)) {
        appCall.appReferences.push(resource.data.app)
      }
      appCall.accountReferences = appCall.accountReferences ?? []
      if (!appCall.accountReferences.includes(resource.data.account)) {
        appCall.accountReferences.push(resource.data.account)
      }
      break
    case GroupResourceType.Asset:
      appCall.assetReferences = appCall.assetReferences ?? []
      if (!appCall.assetReferences.includes(resource.data)) {
        appCall.assetReferences.push(resource.data)
      }
      break
  }
}

/**
 * Populate group-level resources for app call transactions
 */
function populateGroupResources(
  transactions: Transaction[], // NOTE: transactions are mutated in place
  groupResources: SimulateUnnamedResourcesAccessed,
): void {
  let remainingAccounts = [...(groupResources.accounts ?? [])]
  let remainingApps = [...(groupResources.apps ?? [])]
  let remainingAssets = [...(groupResources.assets ?? [])]
  const remainingBoxes = [...(groupResources.boxes ?? [])]

  // Process cross-reference resources first (app locals and asset holdings) as they are most restrictive
  if (groupResources.appLocals) {
    groupResources.appLocals.forEach((appLocal) => {
      populateGroupResource(transactions, { type: GroupResourceType.AppLocal, data: appLocal })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== appLocal.account)
      remainingApps = remainingApps.filter((app) => app !== appLocal.app)
    })
  }

  if (groupResources.assetHoldings) {
    groupResources.assetHoldings.forEach((assetHolding) => {
      populateGroupResource(transactions, { type: GroupResourceType.AssetHolding, data: assetHolding })
      // Remove resources from remaining if we're adding them here
      remainingAccounts = remainingAccounts.filter((acc) => acc !== assetHolding.account)
      remainingAssets = remainingAssets.filter((asset) => asset !== assetHolding.asset)
    })
  }

  // Process accounts next because account limit is 4
  remainingAccounts.forEach((account) => {
    populateGroupResource(transactions, { type: GroupResourceType.Account, data: account })
  })

  // Process boxes
  remainingBoxes.forEach((boxRef) => {
    populateGroupResource(transactions, { type: GroupResourceType.Box, data: boxRef })
    // Remove apps as resource if we're adding it here
    remainingApps = remainingApps.filter((app) => app !== boxRef.app)
  })

  // Process assets
  remainingAssets.forEach((asset) => {
    populateGroupResource(transactions, { type: GroupResourceType.Asset, data: asset })
  })

  // Process remaining apps
  remainingApps.forEach((app) => {
    populateGroupResource(transactions, { type: GroupResourceType.App, data: app })
  })

  // Handle extra box refs
  if (groupResources.extraBoxRefs) {
    for (let i = 0; i < groupResources.extraBoxRefs; i++) {
      populateGroupResource(transactions, { type: GroupResourceType.ExtraBoxRef })
    }
  }
}

/**
 * Populate transaction-level resources for app call transactions
 */
function populateTransactionResources(
  transaction: Transaction, // NOTE: transaction is mutated in place
  resourcesAccessed: SimulateUnnamedResourcesAccessed,
  groupIndex: number,
): void {
  if (transaction.transactionType !== TransactionType.AppCall || transaction.appCall === undefined) {
    return
  }

  // Check for unexpected resources at transaction level
  if (resourcesAccessed.boxes || resourcesAccessed.extraBoxRefs) {
    throw new Error('Unexpected boxes at the transaction level')
  }
  if (resourcesAccessed.appLocals) {
    throw new Error('Unexpected app locals at the transaction level')
  }
  if (resourcesAccessed.assetHoldings) {
    throw new Error('Unexpected asset holdings at the transaction level')
  }

  let accountsCount = 0
  let appsCount = 0
  let assetsCount = 0
  const boxesCount = transaction.appCall.boxReferences?.length ?? 0

  // Populate accounts
  if (resourcesAccessed.accounts) {
    transaction.appCall.accountReferences = transaction.appCall.accountReferences ?? []
    for (const account of resourcesAccessed.accounts) {
      if (!transaction.appCall.accountReferences.includes(account)) {
        transaction.appCall.accountReferences.push(account)
      }
    }
    accountsCount = transaction.appCall.accountReferences.length
  }

  // Populate apps
  if (resourcesAccessed.apps) {
    transaction.appCall.appReferences = transaction.appCall.appReferences ?? []
    for (const appId of resourcesAccessed.apps) {
      if (!transaction.appCall.appReferences.includes(appId)) {
        transaction.appCall.appReferences.push(appId)
      }
    }
    appsCount = transaction.appCall.appReferences.length
  }

  // Populate assets
  if (resourcesAccessed.assets) {
    transaction.appCall.assetReferences = transaction.appCall.assetReferences ?? []
    for (const assetId of resourcesAccessed.assets) {
      if (!transaction.appCall.assetReferences.includes(assetId)) {
        transaction.appCall.assetReferences.push(assetId)
      }
    }
    assetsCount = transaction.appCall.assetReferences.length
  }

  // Validate reference limits
  if (accountsCount > MAX_ACCOUNT_REFERENCES) {
    throw new Error(`Account reference limit of ${MAX_ACCOUNT_REFERENCES} exceeded in transaction ${groupIndex}`)
  }

  if (accountsCount + assetsCount + appsCount + boxesCount > MAX_OVERALL_REFERENCES) {
    throw new Error(`Resource reference limit of ${MAX_OVERALL_REFERENCES} exceeded in transaction ${groupIndex}`)
  }
}

function calculateInnerFeeDelta(
  innerTransactions?: PendingTransactionResponse[],
  minTransactionFee: bigint = 1000n,
  acc?: FeeDelta,
): FeeDelta | undefined {
  if (!innerTransactions) {
    return acc
  }

  // Surplus inner transaction fees do not pool up to the parent transaction.
  // Additionally surplus inner transaction fees only pool from sibling transactions
  // that are sent prior to a given inner transaction, hence why we iterate in reverse order.
  return innerTransactions.reduceRight((acc, innerTxn) => {
    const recursiveDelta = calculateInnerFeeDelta(innerTxn.innerTxns, minTransactionFee, acc)

    // Inner transactions don't require per byte fees
    const txnFeeDelta = FeeDelta.fromBigInt(minTransactionFee - (innerTxn.txn.transaction.fee ?? 0n))

    const currentFeeDelta = FeeDelta.fromBigInt(
      (recursiveDelta ? FeeDelta.toBigInt(recursiveDelta) : 0n) + (txnFeeDelta ? FeeDelta.toBigInt(txnFeeDelta) : 0n),
    )

    // If after the recursive inner fee calculations we have a surplus,
    // return undefined to avoid pooling up surplus fees, which is not allowed.
    if (currentFeeDelta && FeeDelta.isSurplus(currentFeeDelta)) {
      return undefined
    }

    return currentFeeDelta
  }, acc)
}

function getCommonParams(ctxn: ComposerTransaction): CommonTransactionParams {
  switch (ctxn.type) {
    case ComposerTransactionType.Transaction:
      return {
        sender: ctxn.data.sender,
        rekeyTo: ctxn.data.rekeyTo,
        note: ctxn.data.note,
        lease: ctxn.data.lease,
        staticFee: ctxn.data.fee,
        firstValidRound: ctxn.data.firstValid,
        lastValidRound: ctxn.data.lastValid,
      }
    case ComposerTransactionType.TransactionWithSigner:
      return {
        sender: ctxn.data.transaction.sender,
        signer: ctxn.data.signer,
        rekeyTo: ctxn.data.transaction.rekeyTo,
        note: ctxn.data.transaction.note,
        lease: ctxn.data.transaction.lease,
        staticFee: ctxn.data.transaction.fee,
        firstValidRound: ctxn.data.transaction.firstValid,
        lastValidRound: ctxn.data.transaction.lastValid,
      }
    default:
      return {
        sender: ctxn.data.sender,
        signer: ctxn.data.signer,
        rekeyTo: ctxn.data.rekeyTo,
        note: ctxn.data.note,
        lease: ctxn.data.lease,
        staticFee: ctxn.data.staticFee,
        extraFee: ctxn.data.extraFee,
        maxFee: ctxn.data.maxFee,
        validityWindow: ctxn.data.validityWindow,
        firstValidRound: ctxn.data.firstValidRound,
        lastValidRound: ctxn.data.lastValidRound,
      }
  }
}

/** Get the logical maximum fee based on staticFee and maxFee */
function getLogicalMaxFee(ctxn: ComposerTransaction): bigint | undefined {
  const commonParams = getCommonParams(ctxn)
  const maxFee = commonParams.maxFee
  const staticFee = commonParams.staticFee

  if (maxFee !== undefined && (staticFee === undefined || maxFee > staticFee)) {
    return maxFee
  }
  return staticFee
}

function getDefaultValidityWindow(genesisId: string): number {
  const isLocalNet = genesisIdIsLocalNet(genesisId)
  if (isLocalNet) {
    return 1000 // LocalNet gets bigger window to avoid dead transactions
  } else {
    return 10 // Standard default validity window
  }
}

function isAppCall(ctxn: ComposerTransaction): boolean {
  return (
    ctxn.type === ComposerTransactionType.AppCall ||
    ctxn.type === ComposerTransactionType.AppCreateCall ||
    ctxn.type === ComposerTransactionType.AppUpdateCall ||
    ctxn.type === ComposerTransactionType.AppDeleteCall ||
    ctxn.type === ComposerTransactionType.AppCallMethodCall ||
    ctxn.type === ComposerTransactionType.AppCreateMethodCall ||
    ctxn.type === ComposerTransactionType.AppUpdateMethodCall ||
    ctxn.type === ComposerTransactionType.AppDeleteMethodCall ||
    (ctxn.type === ComposerTransactionType.Transaction && ctxn.data.transactionType === TransactionType.AppCall) ||
    (ctxn.type === ComposerTransactionType.TransactionWithSigner && ctxn.data.transaction.transactionType === TransactionType.AppCall)
  )
}

function getMethodFromTransaction(transaction: ComposerTransaction): ABIMethod | undefined {
  switch (transaction.type) {
    case ComposerTransactionType.AppCallMethodCall:
      return transaction.data.method
    case ComposerTransactionType.AppCreateMethodCall:
      return transaction.data.method
    case ComposerTransactionType.AppUpdateMethodCall:
      return transaction.data.method
    case ComposerTransactionType.AppDeleteMethodCall:
      return transaction.data.method
    default:
      return undefined
  }
}

function extractAbiReturnFromLogs(confirmation: PendingTransactionResponse, method: ABIMethod): ABIReturn {
  // Check if method has return type
  const returnType = method.returns.type
  if (returnType === 'void') {
    return {
      method,
      rawReturnValue: new Uint8Array(0),
    }
  }

  // Non-void method - must examine the last log
  const logs = confirmation.logs
  if (!logs || logs.length === 0) {
    return {
      method,
      rawReturnValue: new Uint8Array(0),
      decodeError: new Error(`No logs found for method ${method.name} which requires a return type`),
    }
  }

  const lastLog = logs[logs.length - 1]

  // Check if the last log entry has the ABI return prefix
  if (!hasAbiReturnPrefix(lastLog)) {
    return {
      method,
      rawReturnValue: new Uint8Array(0),
      decodeError: new Error(`Transaction log for method ${method.name} doesn't match with ABI return value format`),
    }
  }

  // Extract the return value bytes (skip the prefix)
  const returnBytes = lastLog.slice(ABI_RETURN_PREFIX.length)

  try {
    // Decode the return value using the method's return type
    const returnValue = decodeABIValue(returnType, returnBytes)
    return {
      method,
      rawReturnValue: returnBytes,
      returnValue,
    }
  } catch (e) {
    return {
      method,
      rawReturnValue: new Uint8Array(0),
      decodeError: new Error(`Failed to decode ABI return value for method ${method.name}: ${e}`),
    }
  }
}

function hasAbiReturnPrefix(log: Uint8Array): boolean {
  if (log.length < ABI_RETURN_PREFIX.length) {
    return false
  }
  for (let i = 0; i < ABI_RETURN_PREFIX.length; i++) {
    if (log[i] !== ABI_RETURN_PREFIX[i]) {
      return false
    }
  }
  return true
}
