import { AlgodClient, PendingTransactionResponse } from '@algorandfoundation/algokit-algod-client'
import { Transaction } from '@algorandfoundation/algokit-transact'
import { TransactionSigner } from '@algorandfoundation/sdk'
import { TransactionComposer } from '../types/composer'
import {
  AdditionalTransactionComposerContext,
  SendParams,
  SendTransactionComposerResults,
  TransactionComposerToSend,
} from '../types/transaction'
import { toNumber } from '../util'

/** Represents an unsigned transactions and a signer that can authorize that transaction. */
export interface TransactionWithSigner {
  /** An unsigned transaction */
  txn: Transaction
  /** A transaction signer that can authorize txn */
  signer: TransactionSigner
}

export const MAX_TRANSACTION_GROUP_SIZE = 16
export const MAX_APP_CALL_FOREIGN_REFERENCES = 8
export const MAX_APP_CALL_ACCOUNT_REFERENCES = 4

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
 * @deprecated Use `composer.build()` directly
 * Take an existing Transaction Composer and return a new one with the required
 * app call resources populated into it
 *
 * @param algod The algod client to use for the simulation
 * @param composer The composer containing the txn group
 * @returns A new composer with the resources populated into the transactions
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
  await composer.build()
  return composer
}

/**
 * @deprecated Use `composer.setMaxFees()` instead if you need to set max fees for transactions.
 * Use `composer.build()` instead if you need to build transactions with resource population.
 *
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
  additionalAtcContext?: AdditionalTransactionComposerContext,
) {
  const newComposer = composer.clone({
    coverAppCallInnerTransactionFees: sendParams.coverAppCallInnerTransactionFees ?? false,
    populateAppCallResources: sendParams.populateAppCallResources ?? true,
  })

  if (additionalAtcContext?.maxFees) {
    newComposer.setMaxFees(additionalAtcContext?.maxFees)
  }

  await newComposer.build()

  return newComposer
}

/**
 * @deprecated Use `composer.send()` directly
 * Signs and sends transactions that have been collected by an `TransactionComposer`.
 * @param atcSend The parameters controlling the send, including `atc` The `TransactionComposer` and params to control send behaviour
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendTransactionComposer = async function (atcSend: TransactionComposerToSend): Promise<SendTransactionComposerResults> {
  const { transactionComposer: givenComposer, ...executeParams } = atcSend

  return atcSend.transactionComposer.send({
    ...executeParams,
  })
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
