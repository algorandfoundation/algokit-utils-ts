import algosdk, { Algodv2, SuggestedParams, Transaction } from 'algosdk'
import { Buffer } from 'buffer'
import { Config } from './'
import { TransactionSignerAccount } from './types/account'
import { PendingTransactionResponse } from './types/algod'
import { AlgoAmount } from './types/amount'
import { SendTransactionFrom, SendTransactionParams, SendTransactionResult, TransactionNote, TransactionToSign } from './types/transaction'

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

/** Signs and sends the given transaction to the chain
 *
 * @param send The details for the transaction to send, including:
 *   * `transaction`: The unsigned transaction
 *   * `from`: The account to sign the transaction with: either an account with private key loaded or a logic signature account
 *   * `config`: The sending configuration for this transaction
 * @param algod An algod client
 *
 * @returns An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
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
  const { skipSending, skipWaiting, fee, maxFee, suppressLog, maxRoundsToWaitForConfirmation } = sendParams ?? {}

  if (fee) {
    transaction.fee = fee.microAlgos
    transaction.flatFee = true
  }

  if (maxFee !== undefined) {
    capTransactionFee(transaction, maxFee)
  }

  if (skipSending) {
    return { transaction }
  }

  const signedTransaction =
    'sk' in from
      ? transaction.signTxn(from.sk)
      : 'lsig' in from
      ? algosdk.signLogicSigTransactionObject(transaction, from).blob
      : 'signer' in from
      ? (await from.signer([transaction], [0]))[0]
      : from.sign(transaction)
  await algod.sendRawTransaction(signedTransaction).do()

  Config.getLogger(suppressLog).info(`Sent transaction ID ${transaction.txID()} ${transaction.type} from ${getSenderAddress(from)}`)

  let confirmation: PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(transaction.txID(), maxRoundsToWaitForConfirmation ?? 5, algod)
  }

  return { transaction, confirmation }
}

const groupBy = <T>(array: T[], predicate: (value: T, id: number, array: T[]) => string) =>
  array.reduce((acc, value, id, array) => {
    ;(acc[predicate(value, id, array)] ||= []).push(value)
    return acc
  }, {} as { [key: string]: T[] })

/**
 * Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain
 *
 * @param groupSend The group details to send, with:
 *   * `transactions`: The array of transactions to send along with their signing account
 *   * `sendParams`: The parameters to dictate how the group is sent
 * @param algod An algod client
 * @returns An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendGroupOfTransactions = async function (
  groupSend: { transactions: TransactionToSign[]; sendParams?: Omit<Omit<SendTransactionParams, 'maxFee'>, 'skipSending'> },
  algod: Algodv2,
) {
  const { transactions, sendParams } = groupSend
  const transactionsToSend = transactions.map((t) => {
    return t.transaction
  })

  const group = algosdk.assignGroupID(transactionsToSend)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groupId = Buffer.from(group[0].group!).toString('base64')

  Config.getLogger(sendParams?.suppressLog).info(`Sending group of transactions (${groupId})`, { transactionsToSend })

  // Sign transactions either using TransactionSigners, or not
  let signedTransactions: Uint8Array[]
  if (transactions.find((t) => 'signer' in t.signer)) {
    // Validate all or nothing for transaction signers
    if (transactions.find((t) => !('signer' in t.signer))) {
      throw new Error(
        "When issuing a group transaction the signers should either all be TransactionSignerAccount's or all not. " +
          'Received at least one TransactionSignerAccount, but not all of them so failing the send.',
      )
    }

    // Group transaction signers by signer
    const groupedBySigner = groupBy(
      transactions.map((t, i) => ({
        signer: t.signer as TransactionSignerAccount,
        id: i,
      })),
      (t) => t.signer.addr,
    )

    // Perform the signature, grouped by signer
    const signed = (
      await Promise.all(
        Object.values(groupedBySigner).map(async (signature) => {
          const indexes = signature.map((s) => s.id)
          const signed = await signature[0].signer.signer(group, indexes)
          return signed.map((txn, i) => ({
            txn,
            id: indexes[i],
          }))
        }),
      )
    ).flatMap((a) => a)

    // Extract the signed transactions in order
    signedTransactions = signed.sort((s1, s2) => s1.id - s2.id).map((s) => s.txn)
  } else {
    signedTransactions = group.map((groupedTransaction, id) => {
      const signer = transactions[id].signer
      return 'sk' in signer
        ? groupedTransaction.signTxn(signer.sk)
        : 'lsig' in signer
        ? algosdk.signLogicSigTransactionObject(groupedTransaction, signer).blob
        : 'sign' in signer
        ? signer.sign(groupedTransaction)
        : // This bit will never happen because above if statement
          new Uint8Array()
    })
  }

  Config.getLogger(sendParams?.suppressLog).debug(
    `Signer IDs (${groupId})`,
    transactions.map((t) => getSenderAddress(t.signer)),
  )

  Config.getLogger(sendParams?.suppressLog).debug(
    `Transaction IDs (${groupId})`,
    transactionsToSend.map((t) => t.txID()),
  )

  // https://developer.algorand.org/docs/rest-apis/algod/v2/#post-v2transactions
  await algod.sendRawTransaction(signedTransactions).do()

  Config.getLogger(sendParams?.suppressLog).info(`Group transaction (${groupId}) sent with ${transactionsToSend.length} transactions`)

  let confirmations: PendingTransactionResponse[] | undefined = undefined
  if (!sendParams?.skipWaiting) {
    confirmations = await Promise.all(
      transactionsToSend.map(async (t) => await waitForConfirmation(t.txID(), sendParams?.maxRoundsToWaitForConfirmation ?? 5, algod)),
    )
  }

  return {
    groupId,
    confirmations,
    txIds: transactionsToSend.map((t) => t.txID()),
  }
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
 * @param transaction The transaction to cap
 * @param maxAcceptableFee The maximum acceptable fee to pay
 */
export function capTransactionFee(transaction: algosdk.Transaction, maxAcceptableFee: AlgoAmount) {
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
 * Returns suggested transaction parameters from algod unless some are already provided.
 * @param params Optionally provide parameters to use
 * @param algod Algod algod
 * @returns The suggested transaction parameters
 */
export async function getTransactionParams(params: SuggestedParams | undefined, algod: Algodv2) {
  return params ?? (await algod.getTransactionParams().do())
}
