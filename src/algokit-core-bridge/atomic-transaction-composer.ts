import { AlgodApi, PendingTransactionResponse, TransactionParams200Response } from '@algorandfoundation/algokit-algod-api'
import {
  Address,
  addressFromString,
  assignFee,
  getTransactionId,
  groupTransactions,
  Transaction,
} from '@algorandfoundation/algokit-transact'
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

export type SuggestedParams = {
  firstValid: bigint
  lastValid: bigint
  genesisHash: Uint8Array
  genesisId: string
  feePerByte: bigint
  minFee: bigint
}

export type CommonTransactionParams = {
  /** Algorand address of sender */
  sender: string | Address
  /** Suggested parameters relevant to the network that will accept this transaction */
  suggestedParams: SuggestedParams
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
  rekeyTo?: string | Address
  staticFee?: AlgoAmount
  maxFee?: AlgoAmount
  extraFee?: AlgoAmount
}

export type PaymentTransactionParams = CommonTransactionParams & {
  /**
   * Algorand address of recipient
   */
  receiver: string | Address
  /**
   * Integer amount to send, in microAlgos. Must be nonnegative.
   */
  amount: AlgoAmount
  /**
   * Optional, indicates the sender will close their account and the remaining balance will transfer
   * to this account
   */
  closeRemainderTo?: string | Address
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

export type SendAtomicTransactionComposerResults = {
  transactions: Transaction[]
  /** base64 encoded representation of the group ID of the atomic group */
  groupId: string
  /** The transaction IDs that have been prepared and/or sent */
  txIds: string[]
  /** The responses if the transactions were sent and waited for,
   * the index of the confirmation will match the index of the underlying transaction
   */
  confirmations: PendingTransactionResponse[]
}

/** Parameters to create an `TransactionComposer`. */
export type TransactionComposerParams = {
  /** The algod client to use to get suggestedParams and send the transaction group */
  algodClient: AlgodClient
  /** The function used to get the TransactionSigner for a given address */
  getSigner: (address: string | Address) => TransactionSigner
  /** The method used to get SuggestedParams for transactions in the group */
  getTransactionParams?: () => Promise<TransactionParams200Response>
  /** How many rounds a transaction should be valid for by default; if not specified
   * then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).
   */
  defaultValidityWindow?: bigint
  /**
   * An array of error transformers to use when an error is caught in simulate or execute
   * callbacks can later be registered with `registerErrorTransformer`
   */
  errorTransformers?: ErrorTransformer[]
}

export class TransactionComposer {
  private algosdkAlgod: algosdk.Algodv2
  private algod: AlgodApi
  private getTransactionParams: () => Promise<TransactionParams200Response>
  private getSigner: (address: string | Address) => TransactionSigner
  /** The default transaction validity window */
  private defaultValidityWindow = 10n
  /** Whether the validity window was explicitly set on construction */
  private defaultValidityWindowIsExplicit = false
  errorTransformers: ErrorTransformer[]

  /**
   * Create a `TransactionComposer`.
   * @param params The configuration for this composer
   * @returns The `TransactionComposer` instance
   */
  constructor(params: TransactionComposerParams) {
    this.algod = params.algodClient.algoKitCoreAlgod
    this.algosdkAlgod = params.algodClient

    const defaultgetTransactionParams = () => this.algod.transactionParams()
    this.getTransactionParams = params.getTransactionParams ?? defaultgetTransactionParams
    this.getSigner = params.getSigner
    this.defaultValidityWindow = params.defaultValidityWindow ?? this.defaultValidityWindow
    this.defaultValidityWindowIsExplicit = params.defaultValidityWindow !== undefined
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

  private commonTxnBuildStepCore<TParams extends CommonTransactionParams>(
    buildTxn: (txnParams: TParams) => Transaction,
    params: TParams,
  ): TransactionWithContext {
    if (params.staticFee !== undefined && params.extraFee !== undefined) {
      throw Error('Cannot set both staticFee and extraFee')
    }

    const txn = buildTxn(params)

    const logicalMaxFee =
      params.maxFee !== undefined && params.maxFee.microAlgo > (params.staticFee?.microAlgo ?? 0n) ? params.maxFee : params.staticFee

    return { txn, context: { maxFee: logicalMaxFee } }
  }

  buildPaymentStep({
    sender,
    receiver,
    amount,
    closeRemainderTo,
    rekeyTo,
    note,
    lease,
    suggestedParams,
    staticFee,
    maxFee,
    extraFee,
  }: PaymentTransactionParams) {
    const baseTxn: Transaction = {
      sender: getAlgoKitCoreAddress(sender),
      transactionType: 'Payment',
      fee: staticFee?.microAlgo,
      firstValid: suggestedParams.firstValid,
      lastValid: suggestedParams.lastValid,
      genesisHash: suggestedParams.genesisHash,
      genesisId: suggestedParams.genesisId,
      rekeyTo: rekeyTo ? getAlgoKitCoreAddress(rekeyTo) : undefined,
      note: note,
      lease: lease,
      payment: {
        amount: amount.microAlgo,
        receiver: getAlgoKitCoreAddress(receiver),
        closeRemainderTo: closeRemainderTo ? getAlgoKitCoreAddress(closeRemainderTo) : undefined,
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

  private buildPayment(params: PaymentTransactionParams) {
    return this.commonTxnBuildStepCore(this.buildPaymentStep, params)
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

  public async send(
    transactionsWithSigner: TransactionWithSigner[],
    params: {
      suppressLog?: boolean
      maxRoundsToWaitForConfirmation?: number
      skipWaiting?: boolean // TODO: confirm, this doesn't seem to be used
    },
  ): Promise<SendAtomicTransactionComposerResults> {
    let transactionsToSend = transactionsWithSigner.map((txnWithSigner) => txnWithSigner.txn)

    try {
      if (transactionsToSend.length > 1) {
        transactionsToSend = groupTransactions(transactionsToSend)
      }

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

      let confirmations: PendingTransactionResponse[] | undefined = undefined
      if (!params.skipWaiting) {
        confirmations = await Promise.all(txIDs.map(async (txID) => await this.algod.pendingTransactionInformation(txID)))
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

export function getAlgoKitCoreAddress(address: string | Address) {
  return addressFromString(typeof address === 'string' ? address : address.toString())
}
