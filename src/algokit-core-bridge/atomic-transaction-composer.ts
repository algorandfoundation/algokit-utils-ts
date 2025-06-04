import { AlgodApi } from '@algorandfoundation/algokit-algod-api'
import { Address, assignFee, getTransactionId, groupTransactions, Transaction } from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'
import { Config } from '../config'
import { performAtomicTransactionComposerSimulateFoo } from '../transaction'
import { AlgoAmount } from '../types/amount'
import { callWithRetry } from '../types/call-http-with-retry'
import { EventType } from '../types/lifecycle-events'
import { AlgodClient } from './algod-client'
import { handleJSONResponse } from './algod-request-proxies/utils'
import { TransactionSigner } from './transaction-signer'

export type TransactionWithSigner = {
  txn: Transaction
  signer: TransactionSigner
}

/**
 * A function that transforms an error into a new error.
 *
 * In most cases, an ErrorTransformer should first check if it can or should transform the error
 * and return the input error if it cannot or should not transform it.
 */
export type ErrorTransformer = (error: Error) => Promise<Error>

class InvalidErrorTransformerValue extends Error {
  constructor(originalError: unknown, value: unknown) {
    super(`An error transformer returned a non-error value: ${value}. The original error before any transformation: ${originalError}`)
  }
}

class ErrorTransformerError extends Error {
  constructor(originalError: Error, cause: unknown) {
    super(`An error transformer threw an error: ${cause}. The original error before any transformation: ${originalError} `, { cause })
  }
}

// Copied from TransactionParams200Response, removed consensusVersion and fix number types
export type TransactionParams = {
  fee: bigint
  genesisHash: string
  genesisId: string
  lastRound: bigint
  minFee: bigint
}

export type SuggestedParams = {
  firstValid: bigint
  lastValid: bigint
  genesisHash?: Uint8Array
  genesisId?: string
  feePerByte: bigint
  minFee: bigint
}

export type CommonTransactionParams = {
  /** Algorand address of sender */
  sender: Address
  /** Optional, arbitrary data to be stored in the transaction's note field */
  note?: Uint8Array
  /**
   * Optional, 32-byte lease to associate with this transaction.
   *
   * The sender cannot send another transaction with the same lease until the last round of original
   * transaction has passed.
   */
  lease?: Uint8Array
  /** The Algorand address that will be used to authorize all future transactions from the sender, if provided. */
  rekeyTo?: Address
  staticFee?: AlgoAmount
  maxFee?: AlgoAmount
  extraFee?: AlgoAmount
  signer?: TransactionSigner
}

export type PaymentTransactionParams = CommonTransactionParams & {
  /**
   * Algorand address of recipient
   */
  receiver: Address
  /**
   * Integer amount to send, in microAlgos. Must be nonnegative.
   */
  amount: AlgoAmount
  /**
   * Optional, indicates the sender will close their account and the remaining balance will transfer
   * to this account
   */
  closeRemainderTo?: Address
}

export type TransactionWithContext = {
  txn: Transaction
  context: {
    /* The logical max fee for the transaction, if one was supplied. */
    maxFee?: AlgoAmount
    // TODO: abiMethod
    /* The ABI method, if the app call transaction is an ABI method call. */
    // abiMethod?: algosdk.ABIMethod
  }
}

export type TransactionWithSignerAndContext = TransactionWithSigner & TransactionWithContext

export type SendAtomicTransactionComposerResults = {
  transactions: Transaction[]
  /** base64 encoded representation of the group ID of the atomic group */
  groupId: string
  /** The transaction IDs that have been prepared and/or sent */
  txIds: string[]
  /** The responses if the transactions were sent and waited for,
   * the index of the confirmation will match the index of the underlying transaction
   */
  confirmations: algosdk.modelsv2.PendingTransactionResponse[] // TODO: can we convert this yet?
}

/** Parameters to create an `TransactionComposer`. */
export type TransactionComposerParams = {
  /** The algod client to use to get suggestedParams and send the transaction group */
  algodClient: AlgodClient
  /** The function used to get the TransactionSigner for a given address */
  getSigner: (address: string | Address) => TransactionSigner
  /** The method used to get SuggestedParams for transactions in the group */
  getTransactionParams?: () => Promise<TransactionParams>
  /** How many rounds a transaction should be valid for by default; if not specified
   * then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).
   */
  defaultValidityWindow?: bigint
  /**
   * An array of error transformers to use when an error is caught in simulate or execute
   * callbacks can later be registered with `registerErrorTransformer`
   */
  errorTransformers?: ErrorTransformer[]
  defaultValidityWindowIsExplicit?: boolean
}

export type Txn = PaymentTransactionParams & { type: 'pay' }

export class TransactionComposer {
  private algosdkAlgod: algosdk.Algodv2
  private algod: AlgodApi
  private getTransactionParams: () => Promise<TransactionParams>
  private getSigner: (address: string | Address) => TransactionSigner
  /** The default transaction validity window */
  private defaultValidityWindow = 10n
  /** Whether the validity window was explicitly set on construction */
  private defaultValidityWindowIsExplicit = false
  errorTransformers: ErrorTransformer[]
  private txns: Txn[] = []

  /**
   * Create a `TransactionComposer`.
   * @param params The configuration for this composer
   * @returns The `TransactionComposer` instance
   */
  constructor(params: TransactionComposerParams) {
    this.algod = params.algodClient.algoKitCoreAlgod
    this.algosdkAlgod = params.algodClient

    const defaultgetTransactionParams = async (): Promise<TransactionParams> => {
      const response = await this.algod.transactionParams()
      return {
        fee: BigInt(response.fee),
        lastRound: BigInt(response.lastRound),
        minFee: BigInt(response.minFee),
        genesisId: response.genesisId,
        genesisHash: response.genesisHash,
      }
    }
    this.getTransactionParams = params.getTransactionParams ?? defaultgetTransactionParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.defaultValidityWindowIsExplicit = params.defaultValidityWindowIsExplicit !== undefined
    this.errorTransformers = params.errorTransformers ?? []
  }

  private async transformError(originalError: unknown): Promise<unknown> {
    // Transformers only work with Error instances, so immediately return anything else
    if (!(originalError instanceof Error)) {
      return originalError
    }

    let transformedError = originalError

    for (const transformer of this.errorTransformers) {
      try {
        transformedError = await transformer(transformedError)
        if (!(transformedError instanceof Error)) {
          return new InvalidErrorTransformerValue(originalError, transformedError)
        }
      } catch (errorFromTransformer) {
        return new ErrorTransformerError(originalError, errorFromTransformer)
      }
    }

    return transformedError
  }

  addPayment(params: PaymentTransactionParams): TransactionComposer {
    this.txns.push({ ...params, type: 'pay' })
    return this
  }

  private commonTxnBuildStep<TParams extends CommonTransactionParams>(
    buildTxn: (txnParams: TParams, txnSuggestedParams: SuggestedParams) => Transaction,
    params: TParams,
    suggestedParams: SuggestedParams,
  ): TransactionWithContext {
    if (params.staticFee !== undefined && params.extraFee !== undefined) {
      throw Error('Cannot set both staticFee and extraFee')
    }

    const txn = buildTxn(params, suggestedParams)

    const logicalMaxFee =
      params.maxFee !== undefined && params.maxFee.microAlgo > (params.staticFee?.microAlgo ?? 0n) ? params.maxFee : params.staticFee

    return { txn, context: { maxFee: logicalMaxFee } }
  }

  private async getSuggestedParams(): Promise<SuggestedParams> {
    const transactionParams = await this.getTransactionParams()
    return {
      feePerByte: transactionParams.fee,
      firstValid: transactionParams.lastRound,
      lastValid: transactionParams.lastRound + BigInt(1000),
      minFee: transactionParams.minFee,
      genesisHash: new Uint8Array(Buffer.from(transactionParams.genesisHash, 'base64')),
      genesisId: transactionParams.genesisId,
    }
  }

  buildPaymentStep(
    { sender, receiver, amount, closeRemainderTo, rekeyTo, note, lease, staticFee, maxFee, extraFee }: PaymentTransactionParams,
    suggestedParams: SuggestedParams,
  ) {
    const baseTxn: Transaction = {
      sender: sender,
      transactionType: 'Payment',
      fee: staticFee?.microAlgo,
      firstValid: suggestedParams.firstValid,
      lastValid: suggestedParams.lastValid,
      genesisHash: suggestedParams.genesisHash,
      genesisId: suggestedParams.genesisId,
      rekeyTo: rekeyTo,
      note: note,
      lease: lease,
      payment: {
        amount: amount.microAlgo,
        receiver: receiver,
        closeRemainderTo: closeRemainderTo,
      },
    }

    if (baseTxn.fee !== undefined) {
      return baseTxn
    } else {
      const txn = assignFee(baseTxn, {
        feePerByte: suggestedParams.feePerByte,
        minFee: suggestedParams.minFee,
        maxFee: maxFee?.microAlgo,
        extraFee: extraFee?.microAlgo,
      })
      return txn
    }
  }

  public buildPayment(params: PaymentTransactionParams, suggestedParams: SuggestedParams) {
    return this.commonTxnBuildStep(this.buildPaymentStep, params, suggestedParams)
  }

  // Inspired by algosdk AtomicTransactionComposer.gatherSignatures
  private async signTransactions(transactionsWithSigner: TransactionWithSigner[]): Promise<Uint8Array[]> {
    const unsignedTxns = transactionsWithSigner.map((txnWithSigner) => txnWithSigner.txn)

    const indexesPerSigner: Map<TransactionSigner, number[]> = new Map()

    for (let i = 0; i < transactionsWithSigner.length; i++) {
      const { signer } = transactionsWithSigner[i]

      if (!indexesPerSigner.has(signer)) {
        indexesPerSigner.set(signer, [])
      }

      indexesPerSigner.get(signer)!.push(i)
    }

    const orderedSigners = Array.from(indexesPerSigner)

    const batchedSigs = await Promise.all(orderedSigners.map(([signer, indexes]) => signer(unsignedTxns, indexes)))

    const signedTxns = orderedSigners.reduce((acc, [, indexes], signerIndex) => {
      indexes.forEach((txnIndex, i) => {
        acc[txnIndex] = batchedSigs[signerIndex][i]
      })
      return acc
    }, Array<Uint8Array | null>(transactionsWithSigner.length).fill(null))

    const fullyPopulated = signedTxns.every((s) => s != null)
    if (!fullyPopulated) {
      throw new Error(`Missing signatures. Got ${signedTxns}`)
    }

    return signedTxns
  }

  private async buildTxn(txn: Txn, suggestedParams: SuggestedParams) {
    switch (txn.type) {
      case 'pay':
        return [this.buildPayment(txn, suggestedParams)]
    }
  }

  private async buildTxnWithSigner(txn: Txn, suggestedParams: SuggestedParams): Promise<TransactionWithSigner[]> {
    const signer = txn.signer ? txn.signer : this.getSigner(txn.sender)

    return (await this.buildTxn(txn, suggestedParams)).map(({ txn, context }) => ({ txn, signer, context }))
  }

  public async build() {
    const suggestedParams = await this.getSuggestedParams()
    const txnWithSigners: TransactionWithSigner[] = []
    for (const txn of this.txns) {
      txnWithSigners.push(...(await this.buildTxnWithSigner(txn, suggestedParams)))
    }

    const txns = txnWithSigners.map((txnWithSigner) => txnWithSigner.txn)
    if (txns.length > 1) {
      const txnsWithGroup = groupTransactions(txns)
      txnWithSigners.forEach((txnWithSigner, index) => (txnWithSigner.txn = txnsWithGroup[index]))
    }

    return {
      transactions: txnWithSigners,
    }
  }

  public async send(params: {
    suppressLog?: boolean
    maxRoundsToWaitForConfirmation?: number
    skipWaiting?: boolean // TODO: confirm, this doesn't seem to be used
  }): Promise<SendAtomicTransactionComposerResults> {
    const { transactions: transactionsWithSigner } = await this.build()
    const transactionsToSend = transactionsWithSigner.map((txnWithSigner) => txnWithSigner.txn)

    try {
      const txIDs = transactionsToSend.map((txn) => getTransactionId(txn))

      let groupId: string | undefined = undefined
      if (transactionsToSend.length > 1) {
        groupId = transactionsToSend[0].group ? Buffer.from(transactionsToSend[0].group).toString('base64') : ''
        Config.getLogger(params.suppressLog).verbose(`Sending group of ${transactionsToSend.length} transactions (${groupId})`, {
          transactionsToSend,
        })

        Config.getLogger(params.suppressLog).debug(`Transaction IDs (${groupId})`, txIDs)
      }

      if (Config.debug && Config.traceAll) {
        // Emit the simulate response for use with AlgoKit AVM debugger
        const simulateResponse = await performAtomicTransactionComposerSimulateFoo(transactionsToSend, this.algosdkAlgod)
        await Config.events.emitAsync(EventType.TxnGroupSimulated, {
          simulateResponse,
        })
      }

      const signedTxns = await this.signTransactions(transactionsWithSigner)

      const responseContext = await callWithRetry(() => this.algod.rawTransactionResponse(new File(signedTxns, '')))
      // Call handle response for error handling purposes only
      await handleJSONResponse(responseContext, algosdk.modelsv2.PostTransactionsResponse)

      // TODO: when app call is supported, this should be the txId of the first app call txn
      const txIDToWaitFor = txIDs[0]

      // TODO: can we use utils waitForConfirmation here?
      // use core for waitForConfirmation?
      await algosdk.waitForConfirmation(this.algosdkAlgod, txIDToWaitFor, params.maxRoundsToWaitForConfirmation ?? 5)

      if (transactionsToSend.length > 1) {
        Config.getLogger(params.suppressLog).verbose(`Group transaction (${groupId}) sent with ${transactionsToSend.length} transactions`)
      } else {
        Config.getLogger(params.suppressLog).verbose(
          `Sent transaction ID ${txIDs[0]} ${transactionsToSend[0].transactionType} from ${transactionsToSend[0].sender.address}`,
        )
      }

      let confirmations: algosdk.modelsv2.PendingTransactionResponse[] | undefined = undefined
      if (!params.skipWaiting) {
        confirmations = await Promise.all(txIDs.map(async (txID) => await this.algosdkAlgod.pendingTransactionInformation(txID).do()))
      }

      return {
        groupId: groupId ?? '',
        confirmations: confirmations ?? [],
        transactions: transactionsToSend,
        txIds: txIDs,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // TODO: the error message can be different

      // Create a new error object so the stack trace is correct (algosdk throws an error with a more limited stack trace)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = new Error(typeof e === 'object' ? e?.message : 'Received error executing Atomic Transaction Composer') as any as any
      err.cause = e
      if (typeof e === 'object') {
        // Remove headers as it doesn't have anything useful.
        delete e.response?.headers
        err.response = e.response
        // body property very noisy
        if (e.response && 'body' in e.response) delete err.response.body
        err.name = e.name
      }

      if (Config.debug && typeof e === 'object') {
        err.traces = []
        Config.getLogger(params.suppressLog).error(
          'Received error executing Atomic Transaction Composer and debug flag enabled; attempting simulation to get more information',
          err,
        )
        const simulate = await performAtomicTransactionComposerSimulateFoo(transactionsToSend, this.algosdkAlgod)
        if (Config.debug && !Config.traceAll) {
          // Emit the event only if traceAll: false, as it should have already been emitted above
          await Config.events.emitAsync(EventType.TxnGroupSimulated, {
            simulateResponse: simulate,
          })
        }

        if (simulate && simulate.txnGroups[0].failedAt) {
          for (const txn of simulate.txnGroups[0].txnResults) {
            err.traces.push({
              trace: txn.execTrace?.toEncodingData(),
              appBudget: txn.appBudgetConsumed,
              logicSigBudget: txn.logicSigBudgetConsumed,
              logs: txn.txnResult.logs,
              message: simulate.txnGroups[0].failureMessage,
            })
          }
        }
      } else {
        Config.getLogger(params.suppressLog).error(
          'Received error executing Atomic Transaction Composer, for more information enable the debug flag',
          err,
        )
      }

      // Attach the sent transactions so we can use them in error transformers
      err.sentTransactions = transactionsToSend
      throw err
    }
  }
}
