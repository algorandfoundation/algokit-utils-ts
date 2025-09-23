import algosdk, {
  ABIMethod,
  ABIReturnType,
  Address,
  ApplicationTransactionFields,
  stringifyJSON,
  TransactionBoxReference,
  TransactionType,
} from 'algosdk'
import { Buffer } from 'buffer'
import { Config } from '../config'
import { AlgoAmount } from '../types/amount'
import { ABIReturn } from '../types/app'
import { EventType } from '../types/lifecycle-events'
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
} from '../types/transaction'
import { asJson, convertAbiByteArrays, convertABIDecodedBigIntToNumber, toNumber } from '../util'
import { performAtomicTransactionComposerSimulate } from './perform-atomic-transaction-composer-simulate'
import Algodv2 = algosdk.Algodv2
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import modelsv2 = algosdk.modelsv2
import SuggestedParams = algosdk.SuggestedParams
import Transaction = algosdk.Transaction
import TransactionSigner = algosdk.TransactionSigner
import TransactionWithSigner = algosdk.TransactionWithSigner

export const MAX_TRANSACTION_GROUP_SIZE = 16
export const MAX_APP_CALL_FOREIGN_REFERENCES = 8
export const MAX_APP_CALL_ACCOUNT_REFERENCES = 8

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
    ? transaction.signTxn(signer.sk)
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

  let txnToSend = transaction

  const populateAppCallResources = sendParams?.populateAppCallResources ?? Config.populateAppCallResources

  // Populate resources if the transaction is an appcall and populateAppCallResources wasn't explicitly set to false
  if (txnToSend.type === algosdk.TransactionType.appl && populateAppCallResources) {
    const newAtc = new AtomicTransactionComposer()
    newAtc.addTransaction({ txn: txnToSend, signer: getSenderTransactionSigner(from) })
    const atc = await prepareGroupForSending(newAtc, algod, { ...sendParams, populateAppCallResources })
    txnToSend = atc.buildGroup()[0].txn
  }

  const signedTransaction = await signTransaction(txnToSend, from)

  await algod.sendRawTransaction(signedTransaction).do()

  Config.getLogger(suppressLog).verbose(`Sent transaction ID ${txnToSend.txID()} ${txnToSend.type} from ${getSenderAddress(from)}`)

  let confirmation: modelsv2.PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(txnToSend.txID(), maxRoundsToWaitForConfirmation ?? 5, algod)
  }

  return { transaction: txnToSend, confirmation }
}

/**
 * Get the execution info of a transaction group for the given ATC
 * The function uses the simulate endpoint and depending on the sendParams can return the following:
 * - The unnamed resources accessed by the group
 * - The unnamed resources accessed by each transaction in the group
 * - The required fee delta for each transaction in the group. A positive value indicates a fee deficit, a negative value indicates a surplus.
 *
 * @param atc The ATC containing the txn group
 * @param algod The algod client to use for the simulation
 * @param sendParams The send params for the transaction group
 * @param additionalAtcContext Additional ATC context used to determine how best to alter transactions in the group
 * @returns The execution info for the group
 */
async function getGroupExecutionInfo(
  atc: algosdk.AtomicTransactionComposer,
  algod: algosdk.Algodv2,
  sendParams: SendParams,
  additionalAtcContext?: AdditionalAtomicTransactionComposerContext,
) {
  const simulateRequest = new algosdk.modelsv2.SimulateRequest({
    txnGroups: [],
    allowUnnamedResources: true,
    allowEmptySignatures: true,
    fixSigners: true,
  })

  const nullSigner = algosdk.makeEmptyTransactionSigner()

  const emptySignerAtc = atc.clone()

  const appCallIndexesWithoutMaxFees: number[] = []
  emptySignerAtc['transactions'].forEach((t: algosdk.TransactionWithSigner, i: number) => {
    t.signer = nullSigner

    if (sendParams.coverAppCallInnerTransactionFees && t.txn.type === TransactionType.appl) {
      if (!additionalAtcContext?.suggestedParams) {
        throw Error(`Please provide additionalAtcContext.suggestedParams when coverAppCallInnerTransactionFees is enabled`)
      }

      const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo
      if (maxFee === undefined) {
        appCallIndexesWithoutMaxFees.push(i)
      } else {
        t.txn.fee = maxFee
      }
    }
  })

  if (sendParams.coverAppCallInnerTransactionFees && appCallIndexesWithoutMaxFees.length > 0) {
    throw Error(
      `Please provide a maxFee for each app call transaction when coverAppCallInnerTransactionFees is enabled. Required for transaction ${appCallIndexesWithoutMaxFees.join(', ')}`,
    )
  }

  const perByteTxnFee = BigInt(additionalAtcContext?.suggestedParams.fee ?? 0n)
  const minTxnFee = BigInt(additionalAtcContext?.suggestedParams.minFee ?? 1000n)

  const result = await emptySignerAtc.simulate(algod, simulateRequest)

  const groupResponse = result.simulateResponse.txnGroups[0]

  if (groupResponse.failureMessage) {
    if (sendParams.coverAppCallInnerTransactionFees && groupResponse.failureMessage.match(/fee too small/)) {
      throw Error(`Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.`)
    }

    throw Error(`Error resolving execution info via simulate in transaction ${groupResponse.failedAt}: ${groupResponse.failureMessage}`)
  }

  return {
    groupUnnamedResourcesAccessed: sendParams.populateAppCallResources ? groupResponse.unnamedResourcesAccessed : undefined,
    txns: groupResponse.txnResults.map((txn, i) => {
      const originalTxn = atc['transactions'][i].txn as algosdk.Transaction

      let requiredFeeDelta = 0n
      if (sendParams.coverAppCallInnerTransactionFees) {
        // Min fee calc is lifted from algosdk https://github.com/algorand/js-algorand-sdk/blob/6973ff583b243ddb0632e91f4c0383021430a789/src/transaction.ts#L710
        // 75 is the number of bytes added to a txn after signing it
        const parentPerByteFee = perByteTxnFee * BigInt(originalTxn.toByte().length + 75)
        const parentMinFee = parentPerByteFee < minTxnFee ? minTxnFee : parentPerByteFee
        const parentFeeDelta = parentMinFee - originalTxn.fee
        if (originalTxn.type === TransactionType.appl) {
          const calculateInnerFeeDelta = (itxns: algosdk.modelsv2.PendingTransactionResponse[], acc: bigint = 0n): bigint => {
            // Surplus inner transaction fees do not pool up to the parent transaction.
            // Additionally surplus inner transaction fees only pool from sibling transactions that are sent prior to a given inner transaction, hence why we iterate in reverse order.
            return itxns.reverse().reduce((acc, itxn) => {
              const currentFeeDelta =
                (itxn.innerTxns && itxn.innerTxns.length > 0 ? calculateInnerFeeDelta(itxn.innerTxns, acc) : acc) +
                (minTxnFee - itxn.txn.txn.fee) // Inner transactions don't require per byte fees
              return currentFeeDelta < 0n ? 0n : currentFeeDelta
            }, acc)
          }

          const innerFeeDelta = calculateInnerFeeDelta(txn.txnResult.innerTxns ?? [])
          requiredFeeDelta = innerFeeDelta + parentFeeDelta
        } else {
          requiredFeeDelta = parentFeeDelta
        }
      }

      return {
        unnamedResourcesAccessed: sendParams.populateAppCallResources ? txn.unnamedResourcesAccessed : undefined,
        requiredFeeDelta,
      }
    }),
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
export async function populateAppCallResources(atc: algosdk.AtomicTransactionComposer, algod: algosdk.Algodv2) {
  return await prepareGroupForSending(atc, algod, { populateAppCallResources: true })
}

/**
 * Take an existing Atomic Transaction Composer and return a new one with changes applied to the transactions
 * based on the supplied sendParams to prepare it for sending.
 * Please note, that before calling `.execute()` on the returned ATC, you must call `.buildGroup()`.
 *
 * @param algod The algod client to use for the simulation
 * @param atc The ATC containing the txn group
 * @param sendParams The send params for the transaction group
 * @param additionalAtcContext Additional ATC context used to determine how best to change the transactions in the group
 * @returns A new ATC with the changes applied
 *
 * @privateRemarks
 * Parts of this function will eventually be implemented in algod. Namely:
 * - Simulate will return information on how to populate reference arrays, see https://github.com/algorand/go-algorand/pull/6015
 */
export async function prepareGroupForSending(
  atc: algosdk.AtomicTransactionComposer,
  algod: algosdk.Algodv2,
  sendParams: SendParams,
  additionalAtcContext?: AdditionalAtomicTransactionComposerContext,
) {
  const executionInfo = await getGroupExecutionInfo(atc, algod, sendParams, additionalAtcContext)
  const group = atc.buildGroup()

  const [_, additionalTransactionFees] = sendParams.coverAppCallInnerTransactionFees
    ? executionInfo.txns
        .map((txn, i) => {
          const groupIndex = i
          const txnInGroup = group[groupIndex].txn
          const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo
          const immutableFee = maxFee !== undefined && maxFee === txnInGroup.fee
          // Because we don't alter non app call transaction, they take priority
          const priorityMultiplier =
            txn.requiredFeeDelta > 0n && (immutableFee || txnInGroup.type !== algosdk.TransactionType.appl) ? 1_000n : 1n

          return {
            ...txn,
            groupIndex,
            // Measures the priority level of covering the transaction fee using the surplus group fees. The higher the number, the higher the priority.
            surplusFeePriorityLevel: txn.requiredFeeDelta > 0n ? txn.requiredFeeDelta * priorityMultiplier : -1n,
          }
        })
        .sort((a, b) => {
          return a.surplusFeePriorityLevel > b.surplusFeePriorityLevel ? -1 : a.surplusFeePriorityLevel < b.surplusFeePriorityLevel ? 1 : 0
        })
        .reduce(
          (acc, { groupIndex, requiredFeeDelta }) => {
            if (requiredFeeDelta > 0n) {
              // There is a fee deficit on the transaction
              let surplusGroupFees = acc[0]
              const additionalTransactionFees = acc[1]
              const additionalFeeDelta = requiredFeeDelta - surplusGroupFees
              if (additionalFeeDelta <= 0n) {
                // The surplus group fees fully cover the required fee delta
                surplusGroupFees = -additionalFeeDelta
              } else {
                // The surplus group fees do not fully cover the required fee delta, use what is available
                additionalTransactionFees.set(groupIndex, additionalFeeDelta)
                surplusGroupFees = 0n
              }
              return [surplusGroupFees, additionalTransactionFees] as const
            }
            return acc
          },
          [
            executionInfo.txns.reduce((acc, { requiredFeeDelta }) => {
              if (requiredFeeDelta < 0n) {
                return acc + -requiredFeeDelta
              }
              return acc
            }, 0n),
            new Map<number, bigint>(),
          ] as const,
        )
    : [0n, new Map<number, bigint>()]

  const appCallHasAccessReferences = (txn: algosdk.Transaction) => {
    return txn.type === TransactionType.appl && txn.applicationCall?.access && txn.applicationCall?.access.length > 0
  }

  const indexesWithAccessReferences: number[] = []

  executionInfo.txns.forEach(({ unnamedResourcesAccessed: r }, i) => {
    // Populate Transaction App Call Resources
    if (sendParams.populateAppCallResources && group[i].txn.type === TransactionType.appl) {
      const hasAccessReferences = appCallHasAccessReferences(group[i].txn)

      if (hasAccessReferences && (r || executionInfo.groupUnnamedResourcesAccessed)) {
        indexesWithAccessReferences.push(i)
      }

      if (r && !hasAccessReferences) {
        if (r.boxes || r.extraBoxRefs) throw Error('Unexpected boxes at the transaction level')
        if (r.appLocals) throw Error('Unexpected app local at the transaction level')
        if (r.assetHoldings)
          throw Error('Unexpected asset holding at the transaction level')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(group[i].txn as any)['applicationCall'] = {
          ...group[i].txn.applicationCall,
          accounts: [...(group[i].txn?.applicationCall?.accounts ?? []), ...(r.accounts ?? [])],
          foreignApps: [...(group[i].txn?.applicationCall?.foreignApps ?? []), ...(r.apps ?? [])],
          foreignAssets: [...(group[i].txn?.applicationCall?.foreignAssets ?? []), ...(r.assets ?? [])],
          boxes: [...(group[i].txn?.applicationCall?.boxes ?? []), ...(r.boxes ?? [])],
        } satisfies Partial<ApplicationTransactionFields>

        const accounts = group[i].txn.applicationCall?.accounts?.length ?? 0
        if (accounts > MAX_APP_CALL_ACCOUNT_REFERENCES)
          throw Error(`Account reference limit of ${MAX_APP_CALL_ACCOUNT_REFERENCES} exceeded in transaction ${i}`)
        const assets = group[i].txn.applicationCall?.foreignAssets?.length ?? 0
        const apps = group[i].txn.applicationCall?.foreignApps?.length ?? 0
        const boxes = group[i].txn.applicationCall?.boxes?.length ?? 0
        if (accounts + assets + apps + boxes > MAX_APP_CALL_FOREIGN_REFERENCES) {
          throw Error(`Resource reference limit of ${MAX_APP_CALL_FOREIGN_REFERENCES} exceeded in transaction ${i}`)
        }
      }
    }

    // Cover App Call Inner Transaction Fees
    if (sendParams.coverAppCallInnerTransactionFees) {
      const additionalTransactionFee = additionalTransactionFees.get(i)

      if (additionalTransactionFee !== undefined) {
        if (group[i].txn.type !== algosdk.TransactionType.appl) {
          throw Error(`An additional fee of ${additionalTransactionFee} µALGO is required for non app call transaction ${i}`)
        }
        const transactionFee = group[i].txn.fee + additionalTransactionFee
        const maxFee = additionalAtcContext?.maxFees?.get(i)?.microAlgo
        if (maxFee === undefined || transactionFee > maxFee) {
          throw Error(
            `Calculated transaction fee ${transactionFee} µALGO is greater than max of ${maxFee ?? 'undefined'} for transaction ${i}`,
          )
        }
        group[i].txn.fee = transactionFee
      }
    }
  })

  // Populate Group App Call Resources
  if (sendParams.populateAppCallResources) {
    if (indexesWithAccessReferences.length > 0) {
      Config.logger.warn(
        `Resource population will be skipped for transaction indexes ${indexesWithAccessReferences.join(', ')} as they use access references.`,
      )
    }

    const populateGroupResource = (
      txns: algosdk.TransactionWithSigner[],
      reference:
        | string
        | algosdk.modelsv2.BoxReference
        | algosdk.modelsv2.ApplicationLocalReference
        | algosdk.modelsv2.AssetHoldingReference
        | bigint
        | number
        | Address,
      type: 'account' | 'assetHolding' | 'appLocal' | 'app' | 'box' | 'asset',
    ): void => {
      const isApplBelowLimit = (t: algosdk.TransactionWithSigner) => {
        if (t.txn.type !== algosdk.TransactionType.appl) return false
        if (appCallHasAccessReferences(t.txn)) return false

        const accounts = t.txn.applicationCall?.accounts?.length ?? 0
        const assets = t.txn.applicationCall?.foreignAssets?.length ?? 0
        const apps = t.txn.applicationCall?.foreignApps?.length ?? 0
        const boxes = t.txn.applicationCall?.boxes?.length ?? 0

        return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES
      }

      // If this is a asset holding or app local, first try to find a transaction that already has the account available
      if (type === 'assetHolding' || type === 'appLocal') {
        const { account } = reference as algosdk.modelsv2.ApplicationLocalReference | algosdk.modelsv2.AssetHoldingReference

        let txnIndex = txns.findIndex((t) => {
          if (!isApplBelowLimit(t)) return false

          return (
            // account is in the foreign accounts array
            t.txn.applicationCall?.accounts?.map((a) => a.toString()).includes(account.toString()) ||
            // account is available as an app account
            t.txn.applicationCall?.foreignApps?.map((a) => algosdk.getApplicationAddress(a).toString()).includes(account.toString()) ||
            // account is available since it's in one of the fields
            Object.values(t.txn).some((f) =>
              stringifyJSON(f, (_, v) => (v instanceof Address ? v.toString() : v))?.includes(account.toString()),
            )
          )
        })

        if (txnIndex > -1) {
          if (type === 'assetHolding') {
            const { asset } = reference as algosdk.modelsv2.AssetHoldingReference
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(txns[txnIndex].txn as any)['applicationCall'] = {
              ...txns[txnIndex].txn.applicationCall,
              foreignAssets: [...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []), ...[asset]],
            } satisfies Partial<ApplicationTransactionFields>
          } else {
            const { app } = reference as algosdk.modelsv2.ApplicationLocalReference
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(txns[txnIndex].txn as any)['applicationCall'] = {
              ...txns[txnIndex].txn.applicationCall,
              foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
            } satisfies Partial<ApplicationTransactionFields>
          }
          return
        }

        // Now try to find a txn that already has that app or asset available
        txnIndex = txns.findIndex((t) => {
          if (!isApplBelowLimit(t)) return false

          // check if there is space in the accounts array
          if ((t.txn.applicationCall?.accounts?.length ?? 0) >= MAX_APP_CALL_ACCOUNT_REFERENCES) return false

          if (type === 'assetHolding') {
            const { asset } = reference as algosdk.modelsv2.AssetHoldingReference
            return t.txn.applicationCall?.foreignAssets?.includes(asset)
          } else {
            const { app } = reference as algosdk.modelsv2.ApplicationLocalReference
            return t.txn.applicationCall?.foreignApps?.includes(app) || t.txn.applicationCall?.appIndex === app
          }
        })

        if (txnIndex > -1) {
          const { account } = reference as algosdk.modelsv2.AssetHoldingReference | algosdk.modelsv2.ApplicationLocalReference

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(txns[txnIndex].txn as any)['applicationCall'] = {
            ...txns[txnIndex].txn.applicationCall,
            accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
          } satisfies Partial<ApplicationTransactionFields>

          return
        }
      }

      // If this is a box, first try to find a transaction that already has the app available
      if (type === 'box') {
        const { app, name } = reference as algosdk.modelsv2.BoxReference

        const txnIndex = txns.findIndex((t) => {
          if (!isApplBelowLimit(t)) return false

          // If the app is in the foreign array OR the app being called, then we know it's available
          return t.txn.applicationCall?.foreignApps?.includes(app) || t.txn.applicationCall?.appIndex === app
        })

        if (txnIndex > -1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(txns[txnIndex].txn as any)['applicationCall'] = {
            ...txns[txnIndex].txn.applicationCall,
            boxes: [...(txns[txnIndex].txn?.applicationCall?.boxes ?? []), ...[{ appIndex: app, name } satisfies TransactionBoxReference]],
          } satisfies Partial<ApplicationTransactionFields>

          return
        }
      }

      // Find the txn index to put the reference(s)
      const txnIndex = txns.findIndex((t) => {
        if (t.txn.type !== algosdk.TransactionType.appl) return false
        if (appCallHasAccessReferences(t.txn)) return false

        const accounts = t.txn.applicationCall?.accounts?.length ?? 0
        if (type === 'account') return accounts < MAX_APP_CALL_ACCOUNT_REFERENCES

        const assets = t.txn.applicationCall?.foreignAssets?.length ?? 0
        const apps = t.txn.applicationCall?.foreignApps?.length ?? 0
        const boxes = t.txn.applicationCall?.boxes?.length ?? 0

        // If we're adding local state or asset holding, we need space for the acocunt and the other reference
        if (type === 'assetHolding' || type === 'appLocal') {
          return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES - 1 && accounts < MAX_APP_CALL_ACCOUNT_REFERENCES
        }

        // If we're adding a box, we need space for both the box ref and the app ref
        if (type === 'box' && BigInt((reference as algosdk.modelsv2.BoxReference).app) !== BigInt(0)) {
          return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES - 1
        }

        return accounts + assets + apps + boxes < MAX_APP_CALL_FOREIGN_REFERENCES
      })

      if (txnIndex === -1) {
        throw Error('No more transactions below reference limit. Add another app call to the group.')
      }

      if (type === 'account') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[reference as Address]],
        } satisfies Partial<ApplicationTransactionFields>
      } else if (type === 'app') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          foreignApps: [
            ...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []),
            ...[typeof reference === 'bigint' ? reference : BigInt(reference as number)],
          ],
        } satisfies Partial<ApplicationTransactionFields>
      } else if (type === 'box') {
        const { app, name } = reference as algosdk.modelsv2.BoxReference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          boxes: [...(txns[txnIndex].txn?.applicationCall?.boxes ?? []), ...[{ appIndex: app, name } satisfies TransactionBoxReference]],
        } satisfies Partial<ApplicationTransactionFields>

        if (app.toString() !== '0') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(txns[txnIndex].txn as any)['applicationCall'] = {
            ...txns[txnIndex].txn.applicationCall,
            foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
          } satisfies Partial<ApplicationTransactionFields>
        }
      } else if (type === 'assetHolding') {
        const { asset, account } = reference as algosdk.modelsv2.AssetHoldingReference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          foreignAssets: [...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []), ...[asset]],
          accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
        } satisfies Partial<ApplicationTransactionFields>
      } else if (type === 'appLocal') {
        const { app, account } = reference as algosdk.modelsv2.ApplicationLocalReference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          foreignApps: [...(txns[txnIndex].txn?.applicationCall?.foreignApps ?? []), ...[app]],
          accounts: [...(txns[txnIndex].txn?.applicationCall?.accounts ?? []), ...[account]],
        } satisfies Partial<ApplicationTransactionFields>
      } else if (type === 'asset') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(txns[txnIndex].txn as any)['applicationCall'] = {
          ...txns[txnIndex].txn.applicationCall,
          foreignAssets: [
            ...(txns[txnIndex].txn?.applicationCall?.foreignAssets ?? []),
            ...[typeof reference === 'bigint' ? reference : BigInt(reference as number)],
          ],
        } satisfies Partial<ApplicationTransactionFields>
      }
    }

    const g = executionInfo.groupUnnamedResourcesAccessed

    if (g) {
      // Do cross-reference resources first because they are the most restrictive in terms
      // of which transactions can be used
      g.appLocals?.forEach((a) => {
        populateGroupResource(group, a, 'appLocal')

        // Remove resources from the group if we're adding them here
        g.accounts = g.accounts?.filter((acc) => acc !== a.account)
        g.apps = g.apps?.filter((app) => BigInt(app) !== BigInt(a.app))
      })

      g.assetHoldings?.forEach((a) => {
        populateGroupResource(group, a, 'assetHolding')

        // Remove resources from the group if we're adding them here
        g.accounts = g.accounts?.filter((acc) => acc !== a.account)
        g.assets = g.assets?.filter((asset) => BigInt(asset) !== BigInt(a.asset))
      })

      // Do accounts next because the account limit is 4
      g.accounts?.forEach((a) => {
        populateGroupResource(group, a, 'account')
      })

      g.boxes?.forEach((b) => {
        populateGroupResource(group, b, 'box')

        // Remove apps as resource from the group if we're adding it here
        g.apps = g.apps?.filter((app) => BigInt(app) !== BigInt(b.app))
      })

      g.assets?.forEach((a) => {
        populateGroupResource(group, a, 'asset')
      })

      g.apps?.forEach((a) => {
        populateGroupResource(group, a, 'app')
      })

      if (g.extraBoxRefs) {
        for (let i = 0; i < g.extraBoxRefs; i += 1) {
          const ref = new algosdk.modelsv2.BoxReference({ app: 0, name: new Uint8Array(0) })
          populateGroupResource(group, ref, 'box')
        }
      }
    }
  }

  const newAtc = new algosdk.AtomicTransactionComposer()

  group.forEach((t) => {
    t.txn.group = undefined
    newAtc.addTransaction(t)
  })

  newAtc['methodCalls'] = atc['methodCalls']
  return newAtc
}

/**
 * Signs and sends transactions that have been collected by an `AtomicTransactionComposer`.
 * @param atcSend The parameters controlling the send, including `atc` The `AtomicTransactionComposer` and params to control send behaviour
 * @param algod An algod client
 * @returns An object with transaction IDs, transactions, group transaction ID (`groupTransactionId`) if more than 1 transaction sent, and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendAtomicTransactionComposer = async function (atcSend: AtomicTransactionComposerToSend, algod: Algodv2) {
  const { atc: givenAtc, sendParams, additionalAtcContext, ...executeParams } = atcSend

  let atc: AtomicTransactionComposer

  atc = givenAtc
  try {
    const transactionsWithSigner = atc.buildGroup()

    // If populateAppCallResources is true OR if populateAppCallResources is undefined and there are app calls, then populate resources
    const populateAppCallResources =
      executeParams?.populateAppCallResources ?? sendParams?.populateAppCallResources ?? Config.populateAppCallResources
    const coverAppCallInnerTransactionFees = executeParams?.coverAppCallInnerTransactionFees

    if (
      (populateAppCallResources || coverAppCallInnerTransactionFees) &&
      transactionsWithSigner.map((t) => t.txn.type).includes(algosdk.TransactionType.appl)
    ) {
      atc = await prepareGroupForSending(
        givenAtc,
        algod,
        { ...executeParams, populateAppCallResources, coverAppCallInnerTransactionFees },
        additionalAtcContext,
      )
    }

    // atc.buildGroup() is needed to ensure that any changes made by prepareGroupForSending are reflected and the group id is set
    const transactionsToSend = atc.buildGroup().map((t) => {
      return t.txn
    })
    let groupId: string | undefined = undefined
    if (transactionsToSend.length > 1) {
      groupId = transactionsToSend[0].group ? Buffer.from(transactionsToSend[0].group).toString('base64') : ''
      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).verbose(
        `Sending group of ${transactionsToSend.length} transactions (${groupId})`,
        {
          transactionsToSend,
        },
      )

      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).debug(
        `Transaction IDs (${groupId})`,
        transactionsToSend.map((t) => t.txID()),
      )
    }

    if (Config.debug && Config.traceAll) {
      // Emit the simulate response for use with AlgoKit AVM debugger
      const simulateResponse = await performAtomicTransactionComposerSimulate(atc, algod)
      await Config.events.emitAsync(EventType.TxnGroupSimulated, {
        simulateResponse,
      })
    }
    const result = await atc.execute(
      algod,
      executeParams?.maxRoundsToWaitForConfirmation ?? sendParams?.maxRoundsToWaitForConfirmation ?? 5,
    )

    if (transactionsToSend.length > 1) {
      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).verbose(
        `Group transaction (${groupId}) sent with ${transactionsToSend.length} transactions`,
      )
    } else {
      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).verbose(
        `Sent transaction ID ${transactionsToSend[0].txID()} ${transactionsToSend[0].type} from ${transactionsToSend[0].sender.toString()}`,
      )
    }

    let confirmations: modelsv2.PendingTransactionResponse[] | undefined = undefined
    if (!sendParams?.skipWaiting) {
      confirmations = await Promise.all(transactionsToSend.map(async (t) => await algod.pendingTransactionInformation(t.txID()).do()))
    }

    const methodCalls = [...(atc['methodCalls'] as Map<number, ABIMethod>).values()]

    return {
      groupId,
      confirmations,
      txIds: transactionsToSend.map((t) => t.txID()),
      transactions: transactionsToSend,
      returns: result.methodResults.map((r, i) => getABIReturnValue(r, methodCalls[i]!.returns.type)),
    } as SendAtomicTransactionComposerResults
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
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
      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).error(
        'Received error executing Atomic Transaction Composer and debug flag enabled; attempting simulation to get more information',
        err,
      )
      const simulate = await performAtomicTransactionComposerSimulate(atc, algod)
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
      Config.getLogger(executeParams?.suppressLog ?? sendParams?.suppressLog).error(
        'Received error executing Atomic Transaction Composer, for more information enable the debug flag',
        err,
      )
    }

    // Attach the sent transactions so we can use them in error transformers
    err.sentTransactions = atc.buildGroup().map((t) => t.txn)
    throw err
  }
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
        signer: defaultTransactionSigner!,
        sender: signer,
      }
    }),
  )

  const atc = new AtomicTransactionComposer()
  transactionsWithSigner.forEach((txn) => atc.addTransaction(txn))

  return (await sendAtomicTransactionComposer({ atc, sendParams }, algod)) as Omit<SendAtomicTransactionComposerResults, 'returns'>
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
  algod: Algodv2,
): Promise<modelsv2.PendingTransactionResponse> {
  if (maxRoundsToWait < 0) {
    throw new Error(`Invalid timeout, received ${maxRoundsToWait}, expected > 0`)
  }

  // Get current round
  const status = await algod.status().do()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  // Loop for up to `timeout` rounds looking for a confirmed transaction
  const startRound = BigInt(status.lastRound) + 1n
  let currentRound = startRound
  while (currentRound < startRound + BigInt(maxRoundsToWait)) {
    try {
      const pendingInfo = await algod.pendingTransactionInformation(transactionId).do()

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
    } catch (e: unknown) {
      if ((e as Error).name === 'URLTokenBaseHTTPError') {
        currentRound++
        continue
      }
    }

    await algod.statusAfterBlock(toNumber(currentRound)).do()
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
export function capTransactionFee(transaction: algosdk.Transaction | SuggestedParams, maxAcceptableFee: AlgoAmount) {
  // If a flat fee hasn't already been defined
  if (!('flatFee' in transaction) || !transaction.flatFee) {
    // Once a transaction has been constructed by algosdk, transaction.fee indicates what the total transaction fee
    // Will be based on the current suggested fee-per-byte value.
    if (transaction.fee > maxAcceptableFee.microAlgo) {
      throw new Error(
        `Cancelled transaction due to high network congestion fees. Algorand suggested fees would cause this transaction to cost ${transaction.fee} µALGO. Cap for this transaction is ${maxAcceptableFee.microAlgo} µALGO.`,
      )
    } else if (transaction.fee > 1_000_000) {
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
    transaction.fee = Number(fee.microAlgo)
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
export async function getTransactionParams(params: SuggestedParams | undefined, algod: Algodv2): Promise<SuggestedParams> {
  if (params) {
    return { ...params }
  }
  const p = await algod.getTransactionParams().do()
  return {
    fee: p.fee,
    firstValid: p.firstValid,
    lastValid: p.lastValid,
    genesisID: p.genesisID,
    genesisHash: p.genesisHash,
    minFee: p.minFee,
  }
}

/**
 * @deprecated Use `atc.clone().buildGroup()` instead.
 *
 * Returns the array of transactions currently present in the given `AtomicTransactionComposer`
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
