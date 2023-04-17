import algosdk, { Algodv2, AtomicTransactionComposer, SuggestedParams, Transaction, TransactionSigner } from 'algosdk'
import { Buffer } from 'buffer'
import { Config } from './'
import { PendingTransactionResponse } from './types/algod'
import { AlgoAmount } from './types/amount'
import { ABIReturn } from './types/app'
import {
  AtomicTransactionComposerToSend,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionGroupToSend,
  TransactionNote,
} from './types/transaction'

/** Encodes a transaction note into a byte array ready to be included in an Algorand transaction.
 *
 * @param note The transaction note
 * @returns the transaction note ready for inclusion in a transaction
 *
 *  Case on the value of `data` this either either be:
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
    const arc2Payload = `${note.dAppName}:${note.format}${typeof note.data === 'string' ? note.data : JSON.stringify(note.data)}`
    const encoder = new TextEncoder()
    return encoder.encode(arc2Payload)
  } else {
    const n = typeof note === 'string' ? note : JSON.stringify(note)
    const encoder = new TextEncoder()
    return encoder.encode(n)
  }
}

/**
 * Returns the public address of the given transaction sender.
 * @param sender A transaction sender
 * @returns The public address
 */
export const getSenderAddress = function (sender: SendTransactionFrom) {
  return 'addr' in sender ? sender.addr : sender.address()
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
 * Returns a @see TransactionSigner for the given transaction sender.
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

/** Prepares a transaction for sending and then (if instructed) signs and sends the given transaction to the chain.
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
  algod: Algodv2,
): Promise<SendTransactionResult> {
  const { transaction, from, sendParams } = send
  const { skipSending, skipWaiting, fee, maxFee, suppressLog, maxRoundsToWaitForConfirmation, atc } = sendParams ?? {}

  controlFees(transaction, { fee, maxFee })

  if (atc) {
    atc.addTransaction({ txn: transaction, signer: getSenderTransactionSigner(from) })
    return { transaction }
  }

  if (skipSending) {
    return { transaction }
  }

  const signedTransaction =
    'sk' in from
      ? transaction.signTxn(from.sk)
      : 'lsig' in from
      ? algosdk.signLogicSigTransactionObject(transaction, from).blob
      : 'sign' in from
      ? from.sign(transaction)
      : (await from.signer([transaction], [0]))[0]

  await algod.sendRawTransaction(signedTransaction).do()

  Config.getLogger(suppressLog).info(`Sent transaction ID ${transaction.txID()} ${transaction.type} from ${getSenderAddress(from)}`)

  let confirmation: PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(transaction.txID(), maxRoundsToWaitForConfirmation ?? 5, algod)
  }

  return { transaction, confirmation }
}

/**
 * Signs and sends transactions that have been collected by an @see AtomicTransactionComposer.
 * @param atcSend The parameters controlling the send, including:
 *  * `atc` The @see AtomicTransactionComposer
 *  * `sendParams` The parameters to control the send behaviour
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendAtomicTransactionComposer = async function (atcSend: AtomicTransactionComposerToSend, algod: Algodv2) {
  const { atc, sendParams } = atcSend

  const transactionsWithSigner = atc.buildGroup()

  const transactionsToSend = transactionsWithSigner.map((t) => {
    return t.txn
  })
  let groupId: string | undefined = undefined
  if (transactionsToSend.length > 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    groupId = transactionsToSend[0].group ? Buffer.from(transactionsToSend[0].group).toString('base64') : ''
    Config.getLogger(sendParams?.suppressLog).info(`Sending group of ${transactionsToSend.length} transactions (${groupId})`, {
      transactionsToSend,
    })

    Config.getLogger(sendParams?.suppressLog).debug(
      `Transaction IDs (${groupId})`,
      transactionsToSend.map((t) => t.txID()),
    )
  }

  try {
    const result = await atc.execute(algod, sendParams?.maxRoundsToWaitForConfirmation ?? 5)

    if (transactionsToSend.length > 1) {
      Config.getLogger(sendParams?.suppressLog).info(`Group transaction (${groupId}) sent with ${transactionsToSend.length} transactions`)
    } else {
      Config.getLogger(sendParams?.suppressLog).info(
        `Sent transaction ID ${transactionsToSend[0].txID()} ${transactionsToSend[0].type} from ${algosdk.encodeAddress(
          transactionsToSend[0].from.publicKey,
        )}`,
      )
    }

    let confirmations: PendingTransactionResponse[] | undefined = undefined
    if (!sendParams?.skipWaiting) {
      confirmations = await Promise.all(
        transactionsToSend.map(async (t) => (await algod.pendingTransactionInformation(t.txID()).do()) as PendingTransactionResponse),
      )
    }

    return {
      groupId,
      confirmations,
      txIds: transactionsToSend.map((t) => t.txID()),
      transactions: transactionsToSend,
      returns: result.methodResults.map(
        (r) =>
          ({
            decodeError: r.decodeError,
            returnValue: r.returnValue,
            rawReturnValue: r.rawReturnValue,
          } as ABIReturn),
      ),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (Config.debug) {
      Config.logger.debug(
        'Received error executing Atomic Transaction Composer and debug flag enabled; attempting dry run to get more information',
      )
      const dryrun = await performAtomicTransactionComposerDryrun(atc, algod)
      if (dryrun.error) {
        Config.logger.error('Received the following error when attempting a dryrun of failed transaction(s)', { error: dryrun.error })
      }
      for (const txn of dryrun.txns) {
        if (txn.appCallRejected()) {
          Config.logger.error(`Received the following application error when executing dry run of transaction`, {
            trace: txn.appTrace(),
            cost: txn.cost,
            logs: txn.logs,
          })
        }
      }
    }

    throw e
  }
}

/**
 * Performs a dry run of the transactions loaded into the given @see AtomicTransactionComposer
 * @param atc The @see AtomicTransactionComposer with transaction(s) loaded
 * @param algod An Algod client
 * @returns The dryrun result
 */
export async function performAtomicTransactionComposerDryrun(atc: AtomicTransactionComposer, algod: Algodv2) {
  const signedTransactions = await atc.gatherSignatures()
  const txns = signedTransactions.map((t) => {
    return algosdk.decodeSignedTransaction(t)
  })
  const dryrun = await algosdk.createDryrun({ client: algod, txns })
  return new algosdk.DryrunResult(await algod.dryrun(dryrun).do())
}

/**
 * Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain
 *
 * @param groupSend The group details to send, with:
 *   * `transactions`: The array of transactions to send along with their signing account
 *   * `sendParams`: The parameters to dictate how the group is sent
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendGroupOfTransactions = async function (groupSend: TransactionGroupToSend, algod: Algodv2) {
  const { transactions, signer, sendParams } = groupSend

  const defaultTransactionSigner = signer ? getSenderTransactionSigner(signer) : undefined

  const transactionsWithSigner = await Promise.all(
    transactions.map(async (t) => {
      if ('signer' in t)
        return {
          txn: t.transaction,
          signer: getSenderTransactionSigner(t.signer),
          sender: t.signer,
        }

      const txn = 'then' in t ? (await t).transaction : t
      if (!signer) {
        throw new Error(`Attempt to send transaction ${txn.txID()} as part of a group transaction, but no signer parameter was provided.`)
      }

      return {
        txn,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signer: defaultTransactionSigner!,
        sender: signer,
      }
    }),
  )

  const atc = new AtomicTransactionComposer()
  transactionsWithSigner.forEach((txn) => atc.addTransaction(txn))

  return await sendAtomicTransactionComposer({ atc, sendParams }, algod)
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
  maxRoundsToWait: number,
  algod: Algodv2,
): Promise<PendingTransactionResponse> {
  if (maxRoundsToWait < 0) {
    throw new Error(`Invalid timeout, received ${maxRoundsToWait}, expected > 0`)
  }

  // Get current round
  const status = await algod.status().do()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  // Loop for up to `timeout` rounds looking for a confirmed transaction
  const startRound = status['last-round'] + 1
  let currentRound = startRound
  while (currentRound < startRound + maxRoundsToWait) {
    const pendingInfo = (await algod.pendingTransactionInformation(transactionId).do()) as PendingTransactionResponse
    if (pendingInfo !== undefined) {
      const confirmedRound = pendingInfo['confirmed-round']
      if (confirmedRound && confirmedRound > 0) {
        return pendingInfo
      } else {
        const poolError = pendingInfo['pool-error']
        if (poolError != null && poolError.length > 0) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error(`Transaction ${transactionId} was rejected; pool error: ${poolError}`)
        }
      }
    }

    await algod.statusAfterBlock(currentRound).do()
    currentRound++
  }

  throw new Error(`Transaction ${transactionId} not confirmed after ${maxRoundsToWait} rounds`)
}

/**
 * Limit the acceptable fee to a defined amount of µALGOs.
 * This also sets the transaction to be flatFee to ensure the transaction only succeeds at
 * the estimated rate.
 * @param transaction The transaction to cap or suggested params object about to be used to create a transaction
 * @param maxAcceptableFee The maximum acceptable fee to pay
 */
export function capTransactionFee(transaction: algosdk.Transaction | SuggestedParams, maxAcceptableFee: AlgoAmount) {
  // If a flat fee hasn't already been defined
  if (!transaction.flatFee) {
    // Once a transaction has been constructed by algosdk, transaction.fee indicates what the total transaction fee
    // Will be based on the current suggested fee-per-byte value.
    if (transaction.fee > maxAcceptableFee.microAlgos) {
      throw new Error(
        `Cancelled transaction due to high network congestion fees. Algorand suggested fees would cause this transaction to cost ${transaction.fee} µALGOs. Cap for this transaction is ${maxAcceptableFee.microAlgos} µALGOs.`,
      )
    } else if (transaction.fee > algosdk.ALGORAND_MIN_TX_FEE) {
      Config.logger.warn(`Algorand network congestion fees are in effect. This transaction will incur a fee of ${transaction.fee} µALGOs.`)
    }

    // Now set the flat on the transaction. Otherwise the network may increase the fee above our cap and perform the transaction.
    transaction.flatFee = true
  }
}

/**
 * Allows for control of fees on a @see Transaction or @see SuggestedParams object
 * @param transaction The transaction or suggested params
 * @param feeControl The fee control parameters
 */
export function controlFees<T extends SuggestedParams | Transaction>(
  transaction: T,
  feeControl: { fee?: AlgoAmount; maxFee?: AlgoAmount },
) {
  const { fee, maxFee } = feeControl
  if (fee) {
    transaction.fee = fee.microAlgos
    transaction.flatFee = true
  }

  if (maxFee !== undefined) {
    capTransactionFee(transaction, maxFee)
  }

  return transaction
}

/**
 * Returns suggested transaction parameters from algod unless some are already provided.
 * @param params Optionally provide parameters to use
 * @param algod Algod algod
 * @returns The suggested transaction parameters
 */
export async function getTransactionParams(params: SuggestedParams | undefined, algod: Algodv2) {
  return params ? { ...params } : await algod.getTransactionParams().do()
}

/**
 * Returns the array of transactions currently present in the given @see AtomicTransactionComposer
 * @param atc The atomic transaction composer
 * @returns The array of transactions with signers
 */
export function getAtomicTransactionComposerTransactions(atc: AtomicTransactionComposer) {
  try {
    return atc.clone().buildGroup()
  } catch {
    return []
  }
}
