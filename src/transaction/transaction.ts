import { AlgodClient, PendingTransactionResponse, SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { OnApplicationComplete, Transaction, TransactionType, getTransactionId } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { ABIReturnType, TransactionSigner } from '@algorandfoundation/sdk'
import { Config } from '../config'
import { AlgoAmount } from '../types/amount'
import { ABIReturn } from '../types/app'
import { AppCallParams, TransactionComposer } from '../types/composer'
import {
  AdditionalAtomicTransactionComposerContext,
  AtomicTransactionComposerToSend,
  SendAtomicTransactionComposerResults,
  SendParams,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionGroupToSend,
  TransactionNote,
  TransactionToSign,
  TransactionWrapper,
  wrapPendingTransactionResponse,
} from '../types/transaction'
import { asJson, convertABIDecodedBigIntToNumber, convertAbiByteArrays, toNumber } from '../util'

export interface TransactionWithSigner {
  txn: Transaction
  signer: TransactionSigner
}

export const MAX_TRANSACTION_GROUP_SIZE = 16
export const MAX_APP_CALL_FOREIGN_REFERENCES = 8
export const MAX_APP_CALL_ACCOUNT_REFERENCES = 4

/**
 * @deprecated Convert your data to a `string` or `Uint8Array`, if using ARC-2 use `TransactionComposer.arc2Note`.
 *
 * Encodes a transaction note into a byte array ready to be included in an Algorand transaction.
 *
 * @param note The transaction note
 * @returns the transaction note ready for inclusion in a transaction
 *
 *  Case on the value of `data` this either be:
 *   * `null` | `undefined`: `undefined`
 *   * `string`: The string value
 *   * Uint8Array: passthrough
 *   * Arc2TransactionNote object: ARC-0002 compatible transaction note
 *   * Else: The object/value converted into a JSON string representation
 */
export function encodeTransactionNote(note?: TransactionNote): Uint8Array | undefined {
  if (note == null || typeof note === 'undefined') {
    return undefined
  } else if (typeof note === 'object' && note.constructor === Uint8Array) {
    return note
  } else if (typeof note === 'object' && 'dAppName' in note) {
    const arc2Payload = `${note.dAppName}:${note.format}${typeof note.data === 'string' ? note.data : asJson(note.data)}`
    const encoder = new TextEncoder()
    return encoder.encode(arc2Payload)
  } else {
    const n = typeof note === 'string' ? note : asJson(note)
    const encoder = new TextEncoder()
    return encoder.encode(n)
  }
}

/** Encodes a transaction lease into a 32-byte array ready to be included in an Algorand transaction.
 *
 * @param lease The transaction lease as a string or binary array or null/undefined if there is no lease
 * @returns the transaction lease ready for inclusion in a transaction or `undefined` if there is no lease
 * @throws if the length of the data is > 32 bytes or empty
 * @example algokit.encodeLease('UNIQUE_ID')
 * @example algokit.encodeLease(new Uint8Array([1, 2, 3]))
 */
export function encodeLease(lease?: string | Uint8Array): Uint8Array | undefined {
  if (lease === null || typeof lease === 'undefined') {
    return undefined
  } else if (typeof lease === 'object' && lease.constructor === Uint8Array) {
    if (lease.length === 0 || lease.length > 32) {
      throw new Error(
        `Received invalid lease; expected something with length between 1 and 32, but received bytes with length ${lease.length}`,
      )
    }
    if (lease.length === 32) return lease
    const lease32 = new Uint8Array(32)
    lease32.set(lease, 0)
    return lease32
  } else if (typeof lease === 'string') {
    if (lease.length === 0 || lease.length > 32) {
      throw new Error(
        `Received invalid lease; expected something with length between 1 and 32, but received '${lease}' with length ${lease.length}`,
      )
    }
    const encoder = new TextEncoder()
    const lease32 = new Uint8Array(32)
    lease32.set(encoder.encode(lease), 0)
    return lease32
  } else {
    throw new Error(`Unknown lease type received of ${typeof lease}`)
  }
}

/**
 * @deprecated Use `algorand.client` to interact with accounts, and use `.addr` to get the address
 * and/or move from using `SendTransactionFrom` to `TransactionSignerAccount` and use `.addr` instead.
 *
 * Returns the public address of the given transaction sender.
 * @param sender A transaction sender
 * @returns The public address
 */
export const getSenderAddress = function (sender: string | SendTransactionFrom): string {
  return typeof sender === 'string' ? sender : 'addr' in sender ? sender.addr.toString() : sender.address().toString()
}

/**
 * @deprecated Use `AlgorandClient` / `TransactionComposer` to construct transactions instead or
 * construct an `algosdk.TransactionWithSigner` manually instead.
 *
 * Given a transaction in a variety of supported formats, returns a TransactionWithSigner object ready to be passed to an
 * AtomicTransactionComposer's addTransaction method.
 * @param transaction One of: A TransactionWithSigner object (returned as is), a TransactionToSign object (signer is obtained from the
 * signer property), a Transaction object (signer is extracted from the defaultSender parameter), an async SendTransactionResult returned by
 * one of algokit utils' helpers (signer is obtained from the defaultSender parameter)
 * @param defaultSender The default sender to be used to obtain a signer where the object provided to the transaction parameter does not
 * include a signer.
 * @returns A TransactionWithSigner object.
 */
export const getTransactionWithSigner = async (
  transaction: TransactionWithSigner | TransactionToSign | Transaction | Promise<SendTransactionResult>,
  defaultSender?: SendTransactionFrom,
): Promise<TransactionWithSigner> => {
  if ('txn' in transaction) return transaction
  if (defaultSender === undefined)
    throw new Error('Default sender must be provided when passing in a transaction object that does not contain its own signer')
  return transaction instanceof Promise
    ? {
        txn: (await transaction).transaction,
        signer: getSenderTransactionSigner(defaultSender),
      }
    : 'transaction' in transaction
      ? {
          txn: transaction.transaction,
          signer: getSenderTransactionSigner(transaction.signer),
        }
      : {
          txn: transaction,
          signer: getSenderTransactionSigner(defaultSender),
        }
}

const memoize = <T = unknown, R = unknown>(fn: (val: T) => R) => {
  const cache = new Map()
  const cached = function (this: unknown, val: T) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val)
  }
  cached.cache = cache
  return cached as (val: T) => R
}

/**
 * @deprecated Use `TransactionSignerAccount` instead of `SendTransactionFrom` or use
 * `algosdk.makeBasicAccountTransactionSigner` / `algosdk.makeLogicSigAccountTransactionSigner`.
 *
 * Returns a `TransactionSigner` for the given transaction sender.
 * This function has memoization, so will return the same transaction signer for a given sender.
 * @param sender A transaction sender
 * @returns A transaction signer
 */
export const getSenderTransactionSigner = memoize(function (sender: SendTransactionFrom): TransactionSigner {
  return 'signer' in sender
    ? sender.signer
    : 'lsig' in sender
      ? algosdk.makeLogicSigAccountTransactionSigner(sender)
      : algosdk.makeBasicAccountTransactionSigner(sender)
})

/**
 * @deprecated Use `AlgorandClient` / `TransactionComposer` to sign transactions
 * or use the relevant underlying `account.signTxn` / `algosdk.signLogicSigTransactionObject`
 * / `multiSigAccount.sign` / `TransactionSigner` methods directly.
 *
 * Signs a single transaction by the given signer.
 * @param transaction The transaction to sign
 * @param signer The signer to sign
 * @returns The signed transaction as a `Uint8Array`
 */
export const signTransaction = async (transaction: Transaction, signer: SendTransactionFrom) => {
  return 'sk' in signer
    ? algosdk.signTransaction(transaction, signer.sk).blob
    : 'lsig' in signer
      ? algosdk.signLogicSigTransactionObject(transaction, signer).blob
      : 'sign' in signer
        ? signer.sign(transaction)
        : (await signer.signer([transaction], [0]))[0]
}

/**
 * @deprecated Use `AlgorandClient` / `TransactionComposer` to send transactions.
 *
 * Prepares a transaction for sending and then (if instructed) signs and sends the given transaction to the chain.
 *
 * @param send The details for the transaction to prepare/send, including:
 *   * `transaction`: The unsigned transaction
 *   * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account
 *   * `config`: The sending configuration for this transaction
 * @param algod An algod client
 *
 * @returns An object with transaction (`transaction`) and (if `skipWaiting` is `false` or `undefined`) confirmation (`confirmation`)
 */
export const sendTransaction = async function (
  send: {
    transaction: Transaction
    from: SendTransactionFrom
    sendParams?: SendTransactionParams
  },
  algod: AlgodClient,
): Promise<SendTransactionResult> {
  const { transaction, from, sendParams } = send
  const { skipSending, skipWaiting, fee, maxFee, suppressLog, maxRoundsToWaitForConfirmation, transactionComposer } = sendParams ?? {}

  controlFees(transaction, { fee, maxFee })

  if (transactionComposer) {
    transactionComposer.addTransaction(transaction, getSenderTransactionSigner(from))
    return { transaction: new TransactionWrapper(transaction) }
  }

  if (skipSending) {
    return { transaction: new TransactionWrapper(transaction) }
  }

  const composer = new TransactionComposer({
    composerConfig: {
      populateAppCallResources: sendParams?.populateAppCallResources ?? Config.populateAppCallResources,
      coverAppCallInnerTransactionFees: false,
    },
    algod: algod,
    getSigner: (address) => {
      throw new Error(`Signer not found for address ${address.toString()}`)
    },
  })
  composer.addTransaction(transaction, getSenderTransactionSigner(from))

  const sendResult = await composer.send({
    // if skipWaiting to true, do not wait
    // if skipWaiting to set, wait for maxRoundsToWaitForConfirmation or 5 rounds
    maxRoundsToWaitForConfirmation: skipWaiting ? 0 : (maxRoundsToWaitForConfirmation ?? 5),
    suppressLog: suppressLog,
  })

  Config.getLogger(suppressLog).verbose(
    `Sent transaction ID ${getTransactionId(transaction)} ${transaction.type} from ${getSenderAddress(from)}`,
  )

  const confirmation = sendResult.confirmations.at(-1)!
  return {
    transaction: new TransactionWrapper(transaction),
    confirmation: confirmation ? wrapPendingTransactionResponse(confirmation) : undefined,
  }
}

/**
 * Take an existing Atomic Transaction Composer and return a new one with the required
 * app call resources populated into it
 *
 * @param algod The algod client to use for the simulation
 * @param atc The ATC containing the txn group
 * @returns A new ATC with the resources populated into the transactions
 *
 * @privateRemarks
 *
 * This entire function will eventually be implemented in simulate upstream in algod. The simulate endpoint will return
 * an array of refference arrays for each transaction, so this eventually will eventually just call simulate and set the
 * reference arrays in the transactions to the reference arrays returned by simulate.
 *
 * See https://github.com/algorand/go-algorand/pull/5684
 *
 */
export async function populateAppCallResources(composer: TransactionComposer) {
  return await prepareGroupForSending(composer, { populateAppCallResources: true })
}

/**
 * Take an existing Transaction Composer and return a new one with changes applied to the transactions
 * based on the supplied sendParams to prepare it for sending.
 *
 * @param composer The Transaction Composer containing the txn group
 * @param sendParams The send params for the transaction group
 * @param additionalAtcContext Additional context used to determine how best to change the transactions in the group
 * @returns A new Transaction Composer with the changes applied
 *
 * @privateRemarks
 * Parts of this function will eventually be implemented in algod. Namely:
 * - Simulate will return information on how to populate reference arrays, see https://github.com/algorand/go-algorand/pull/6015
 */
export async function prepareGroupForSending(
  composer: TransactionComposer,
  sendParams: SendParams,
  additionalAtcContext?: AdditionalAtomicTransactionComposerContext,
) {
  const transactionsWithSigners = (await composer.build()).transactions

  // TODO: should we support suggestedParams in clone?
  const newComposer = composer.clone({
    coverAppCallInnerTransactionFees: sendParams.coverAppCallInnerTransactionFees ?? false,
    populateAppCallResources: sendParams.populateAppCallResources ?? true,
  })

  transactionsWithSigners.forEach((txnWithSigner, index) => {
    if (txnWithSigner.txn.type !== TransactionType.AppCall) {
      newComposer.addTransaction(txnWithSigner.txn)
    } else {
      const orignalAppCallTxn = txnWithSigner.txn
      const appCallFields = orignalAppCallTxn.appCall!
      const maxFee = additionalAtcContext?.maxFees.get(index)

      const commonParams = {
        sender: orignalAppCallTxn.sender,
        args: appCallFields.args,
        lease: orignalAppCallTxn.lease,
        note: orignalAppCallTxn.note,
        firstValidRound: orignalAppCallTxn.firstValid,
        lastValidRound: orignalAppCallTxn.lastValid,
        signer: txnWithSigner.signer,
        rekeyTo: orignalAppCallTxn.rekeyTo,
        maxFee: maxFee,
        staticFee: orignalAppCallTxn.fee ? AlgoAmount.MicroAlgos(orignalAppCallTxn.fee) : undefined,
        rejectVersion: appCallFields.rejectVersion,
        accessReferences: appCallFields.accessReferences,
        accountReferences: appCallFields.accountReferences,
        appReferences: appCallFields.appReferences,
        assetReferences: appCallFields.assetReferences,
        boxReferences: appCallFields.boxReferences,
      } satisfies Omit<AppCallParams, 'appId' | 'onComplete'>

      if (appCallFields.appId === 0n) {
        newComposer.addAppCreate({
          ...commonParams,
          approvalProgram: appCallFields.approvalProgram!,
          clearStateProgram: appCallFields.clearStateProgram!,
          extraProgramPages: appCallFields.extraProgramPages,
          schema:
            appCallFields.localStateSchema || appCallFields.globalStateSchema
              ? {
                  globalByteSlices: appCallFields.globalStateSchema?.numByteSlices ?? 0,
                  globalInts: appCallFields.globalStateSchema?.numUints ?? 0,
                  localByteSlices: appCallFields.localStateSchema?.numByteSlices ?? 0,
                  localInts: appCallFields.localStateSchema?.numUints ?? 0,
                }
              : undefined,
        })
      } else if (appCallFields.onComplete === OnApplicationComplete.UpdateApplication) {
        newComposer.addAppUpdate({
          ...commonParams,
          appId: appCallFields.appId,
          approvalProgram: appCallFields.approvalProgram!,
          clearStateProgram: appCallFields.clearStateProgram!,
        })
      } else {
        newComposer.addAppCall({
          ...commonParams,
          appId: appCallFields.appId,
          onComplete: appCallFields.onComplete,
        })
      }
    }
  })

  await newComposer.build()

  return newComposer
}

/**
 * Signs and sends transactions that have been collected by an `AtomicTransactionComposer`.
 * @param atcSend The parameters controlling the send, including `atc` The `AtomicTransactionComposer` and params to control send behaviour
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendAtomicTransactionComposer = async function (
  atcSend: AtomicTransactionComposerToSend,
): Promise<SendAtomicTransactionComposerResults> {
  const { transactionComposer: givenComposer, sendParams, ...executeParams } = atcSend

  return atcSend.transactionComposer.send({
    ...sendParams,
    ...executeParams,
  })
}

/**
 * Takes an algosdk `ABIResult` and converts it to an `ABIReturn`.
 * Converts `bigint`'s for Uint's < 64 to `number` for easier use.
 * @param result The `ABIReturn`
 */
export function getABIReturnValue(result: algosdk.ABIResult, type: ABIReturnType): ABIReturn {
  if (result.decodeError) {
    return {
      decodeError: result.decodeError,
    }
  }

  const returnValue = convertAbiByteArrays(
    result.returnValue !== undefined && result.method.returns.type !== 'void'
      ? convertABIDecodedBigIntToNumber(result.returnValue, result.method.returns.type)
      : result.returnValue!,
    type,
  )

  return {
    method: result.method,
    rawReturnValue: result.rawReturnValue,
    decodeError: undefined,
    returnValue,
  }
}

/**
 * @deprecated Use `TransactionComposer` (`algorand.newGroup()`) or `AtomicTransactionComposer` to construct and send group transactions instead.
 *
 * Signs and sends a group of [up to 16](https://dev.algorand.co/concepts/transactions/atomic-txn-groups/#create-transactions) transactions to the chain
 *
 * @param groupSend The group details to send, with:
 *   * `transactions`: The array of transactions to send along with their signing account
 *   * `sendParams`: The parameters to dictate how the group is sent
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendGroupOfTransactions = async function (
  groupSend: TransactionGroupToSend,
  algod: AlgodClient,
): Promise<Omit<SendAtomicTransactionComposerResults, 'returns'>> {
  const { transactions, signer, sendParams } = groupSend

  const defaultTransactionSigner = signer ? getSenderTransactionSigner(signer) : undefined

  const transactionsWithSigner = await Promise.all(
    transactions.map(async (t) => {
      if ('signer' in t)
        return {
          txn: t.transaction,
          signer: getSenderTransactionSigner(t.signer),
        }

      const txn = 'then' in t ? (await t).transaction : t
      if (!signer) {
        throw new Error(
          `Attempt to send transaction ${getTransactionId(txn)} as part of a group transaction, but no signer parameter was provided.`,
        )
      }

      return {
        txn,
        signer: defaultTransactionSigner!,
      }
    }),
  )

  const composer = new TransactionComposer({
    algod: algod,
    getSigner: (address) => {
      throw new Error(`No signer for address ${address}`)
    },
  })
  transactionsWithSigner.forEach((txnWithSigner) => composer.addTransaction(txnWithSigner.txn, txnWithSigner.signer))

  const result = await composer.send(sendParams)
  return result
}

/**
 * Wait until the transaction is confirmed or rejected, or until `timeout`
 * number of rounds have passed.
 *
 * @param algod An algod client
 * @param transactionId The transaction ID to wait for
 * @param maxRoundsToWait Maximum number of rounds to wait
 *
 * @return Pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds
 */
export const waitForConfirmation = async function (
  transactionId: string,
  maxRoundsToWait: number | bigint,
  algod: AlgodClient,
): Promise<PendingTransactionResponse> {
  if (maxRoundsToWait < 0) {
    throw new Error(`Invalid timeout, received ${maxRoundsToWait}, expected > 0`)
  }

  // Get current round
  const status = await algod.getStatus()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  // Loop for up to `timeout` rounds looking for a confirmed transaction
  const startRound = BigInt(status.lastRound) + 1n
  let currentRound = startRound
  while (currentRound < startRound + BigInt(maxRoundsToWait)) {
    try {
      const pendingInfo = await algod.pendingTransactionInformation(transactionId)

      if (pendingInfo !== undefined) {
        const confirmedRound = pendingInfo.confirmedRound
        if (confirmedRound && confirmedRound > 0) {
          return pendingInfo
        } else {
          const poolError = pendingInfo.poolError
          if (poolError != null && poolError.length > 0) {
            // If there was a pool error, then the transaction has been rejected!
            throw new Error(`Transaction ${transactionId} was rejected; pool error: ${poolError}`)
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if ('status' in e && e.status === 404) {
        currentRound++
        continue
      }
    }

    await algod.waitForBlock(toNumber(currentRound))
    currentRound++
  }

  throw new Error(`Transaction ${transactionId} not confirmed after ${maxRoundsToWait} rounds`)
}

/**
 * @deprecated Use `TransactionComposer` and the `maxFee` field in the transaction params instead.
 *
 * Limit the acceptable fee to a defined amount of µAlgo.
 * This also sets the transaction to be flatFee to ensure the transaction only succeeds at
 * the estimated rate.
 * @param transaction The transaction to cap or suggested params object about to be used to create a transaction
 * @param maxAcceptableFee The maximum acceptable fee to pay
 */
export function capTransactionFee(transaction: Transaction | SuggestedParams, maxAcceptableFee: AlgoAmount) {
  // If a flat fee hasn't already been defined
  if (!('flatFee' in transaction) || !transaction.flatFee) {
    // Once a transaction has been constructed by algosdk, transaction.fee indicates what the total transaction fee
    // Will be based on the current suggested fee-per-byte value.
    if ((transaction.fee ?? 0n) > maxAcceptableFee.microAlgo) {
      throw new Error(
        `Cancelled transaction due to high network congestion fees. Algorand suggested fees would cause this transaction to cost ${transaction.fee} µALGO. Cap for this transaction is ${maxAcceptableFee.microAlgo} µALGO.`,
      )
    } else if ((transaction.fee ?? 0n) > 1_000_000) {
      Config.logger.warn(`Algorand network congestion fees are in effect. This transaction will incur a fee of ${transaction.fee} µALGO.`)
    }

    // Now set the flat on the transaction. Otherwise the network may increase the fee above our cap and perform the transaction.
    if ('flatFee' in transaction) {
      transaction.flatFee = true
    }
  }
}

/**
 * @deprecated Use `TransactionComposer` and the `maxFee` and `staticFee` fields in the transaction params instead.
 *
 * Allows for control of fees on a `Transaction` or `SuggestedParams` object
 * @param transaction The transaction or suggested params
 * @param feeControl The fee control parameters
 */
export function controlFees<T extends SuggestedParams | Transaction>(
  transaction: T,
  feeControl: { fee?: AlgoAmount; maxFee?: AlgoAmount },
) {
  const { fee, maxFee } = feeControl
  if (fee) {
    transaction.fee = fee.microAlgo
    if ('flatFee' in transaction) {
      transaction.flatFee = true
    }
  }

  if (maxFee !== undefined) {
    capTransactionFee(transaction, maxFee)
  }

  return transaction
}

/**
 * @deprecated Use `suggestedParams ? { ...suggestedParams } : await algod.getTransactionParams().do()` instead
 *
 * Returns suggested transaction parameters from algod unless some are already provided.
 * @param params Optionally provide parameters to use
 * @param algod Algod algod
 * @returns The suggested transaction parameters
 */
export async function getTransactionParams(params: SuggestedParams | undefined, algod: AlgodClient): Promise<SuggestedParams> {
  if (params) {
    return { ...params }
  }
  return await algod.suggestedParams()
}

/**
 * @deprecated Use `atc.clone().buildGroup()` instead.
 *
 * Returns the array of transactions currently present in the given `AtomicTransactionComposer`
 * @param atc The atomic transaction composer
 * @returns The array of transactions with signers
 */
export async function getAtomicTransactionComposerTransactions(composer: TransactionComposer) {
  try {
    return await composer.clone().build()
  } catch {
    return []
  }
}
