import algosdk, {
  Account,
  Algodv2,
  EncodedSignedTransaction,
  LogicSigAccount,
  MultisigMetadata,
  SuggestedParams,
  Transaction,
} from 'algosdk'
import { AlgoAmount } from './algo-amount'
import { AlgoKitConfig } from './config'

/** Account wrapper that supports partial or full multisig signing */
export class MultisigAccount {
  _params: algosdk.MultisigMetadata
  _signingAccounts: (algosdk.Account | SigningAccount)[]
  _addr: string

  get params(): Readonly<algosdk.MultisigMetadata> {
    return this._params
  }

  get signingAccounts(): Readonly<(algosdk.Account | SigningAccount)[]> {
    return this._signingAccounts
  }

  get addr(): Readonly<string> {
    return this._addr
  }

  constructor(multisigParams: MultisigMetadata, signingAccounts: (Account | SigningAccount)[]) {
    this._params = multisigParams
    this._signingAccounts = signingAccounts
    this._addr = algosdk.multisigAddress(multisigParams)
  }

  public sign(transaction: Transaction | Uint8Array): Uint8Array {
    let signedTxn = 'from' in transaction ? undefined : transaction
    for (const signer of this._signingAccounts) {
      if (signedTxn) {
        signedTxn = algosdk.appendSignMultisigTransaction(signedTxn, this._params, signer.sk).blob
      } else {
        signedTxn = algosdk.signMultisigTransaction(transaction as Transaction, this._params, signer.sk).blob
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return signedTxn!
  }
}

/** Account wrapper that supports a rekeyed account */
export class SigningAccount implements Account {
  private _account: Account
  private _sender: string

  /**
   * Algorand address of the sender
   */
  get addr(): Readonly<string> {
    return this._sender
  }

  /**
   * Secret key belonging to the signer
   */
  get sk(): Readonly<Uint8Array> {
    return this._account.sk
  }

  /**
   * Algorand account of the underlying signing account
   */
  get signer(): Account {
    return this._account
  }

  /**
   * Algorand account of the sender address and signer private key
   */
  get sender(): Account {
    return {
      addr: this._sender,
      sk: this._account.sk,
    }
  }

  constructor(account: Account, sender: string | undefined) {
    this._account = account
    this._sender = sender ?? account.addr
  }
}

export type TransactionNote = Uint8Array | TransactionNoteData | Arc2TransactionNote
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionNoteData = string | null | undefined | number | any[] | Record<string, any>
/** ARC-0002 compatible transaction note components, @see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md */
export type Arc2TransactionNote = {
  dAppName: string
  format: 'm' | 'j' | 'b' | 'u'
  data: string
}

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
    const arc2Payload = `${note.dAppName}:${note.format}${note.data}`
    const encoder = new TextEncoder()
    return encoder.encode(arc2Payload)
  } else {
    const n = typeof note === 'string' ? note : JSON.stringify(note)
    const encoder = new TextEncoder()
    return encoder.encode(n)
  }
}

/** The sending configuration for a transaction */
export interface SendTransactionParams {
  /** Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain)
   *   (and instead just return the raw transaction, e.g. so you can add it to a group of transactions) */
  skipSending?: boolean
  /** Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset) */
  skipWaiting?: boolean
  /** Whether to suppress log messages from transaction send, default: do not suppress */
  suppressLog?: boolean
  /** The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion */
  maxFee?: AlgoAmount
  /** The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds */
  maxRoundsToWaitForConfirmation?: number
}

/** The result of sending a transaction */
export interface SendTransactionResult {
  /** The transaction */
  transaction: Transaction
  /** The response if the transaction was sent and waited for */
  confirmation?: PendingTransactionResponse
}

export type SendTransactionFrom = Account | SigningAccount | LogicSigAccount | MultisigAccount

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
 * @param client An algod client
 * @param transaction The unsigned transaction
 * @param from The account to sign the transaction with: either an account with private key loaded or a logic signature account
 * @param config The sending configuration for this transaction
 *
 * @returns An object with transaction (`transaction`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendTransaction = async function (
  client: Algodv2,
  transaction: Transaction,
  from: SendTransactionFrom,
  sendParams?: SendTransactionParams,
): Promise<SendTransactionResult> {
  const { skipSending, skipWaiting, maxFee, suppressLog, maxRoundsToWaitForConfirmation } = sendParams ?? {}
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
      : from.sign(transaction)
  await client.sendRawTransaction(signedTransaction).do()

  if (!suppressLog) {
    AlgoKitConfig.logger.info(`Sent transaction ID ${transaction.txID()} ${transaction.type} from ${getSenderAddress(from)}`)
  }

  let confirmation: PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(client, transaction.txID(), maxRoundsToWaitForConfirmation ?? 5)
  }

  return { transaction, confirmation }
}

/** Defines an unsigned transaction that will appear in a group of transactions along with its signing information */
export interface TransactionToSign {
  /** The unsigned transaction to sign and send */
  transaction: Transaction
  /** The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account */
  signer: Account | SigningAccount | LogicSigAccount
}

/**
 * Signs and sends a group of [up to 16](https://developer.algorand.org/docs/get-details/atomic_transfers/#create-transactions) transactions to the chain
 *
 * @param client An algod client
 * @param transactions The array of transactions to send along with their signing account
 * @param skipWaiting Whether or not the transaction should be waited until it's confirmed (default: wait for the transaction confirmation)
 * @returns An object with group transaction ID (`groupTransactionId`) and (if `skipWaiting` is `false` or unset) confirmation (`confirmation`)
 */
export const sendGroupOfTransactions = async function (client: Algodv2, transactions: TransactionToSign[], skipWaiting = false) {
  const transactionsToSend = transactions.map((t) => {
    return t.transaction
  })

  const group = algosdk.assignGroupID(transactionsToSend)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groupId = Buffer.from(group[0].group!).toString('base64')

  AlgoKitConfig.logger.info(`Sending group of transactions (${groupId})`, { transactionsToSend })

  const signedTransactions = group.map((groupedTransaction, index) => {
    const signer = transactions[index].signer
    return 'sk' in signer ? groupedTransaction.signTxn(signer.sk) : algosdk.signLogicSigTransactionObject(groupedTransaction, signer).blob
  })

  AlgoKitConfig.logger.debug(
    `Signer IDs (${groupId})`,
    transactions.map((t) => getSenderAddress(t.signer)),
  )

  AlgoKitConfig.logger.debug(
    `Transaction IDs (${groupId})`,
    transactionsToSend.map((t) => t.txID()),
  )

  // https://developer.algorand.org/docs/rest-apis/algod/v2/#post-v2transactions
  const { txId } = (await client.sendRawTransaction(signedTransactions).do()) as { txId: string }

  AlgoKitConfig.logger.info(`Group transaction (${groupId}) sent with transaction ID ${txId}`)

  let confirmation: PendingTransactionResponse | undefined = undefined
  if (!skipWaiting) {
    confirmation = await waitForConfirmation(client, txId, 5)
  }

  return { groupTransactionId: txId, confirmation }
}

/** The response from the pending transaction API @see https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspendingtxid */
export interface PendingTransactionResponse {
  /**
   * The application index if the transaction was found and it created an
   * application.
   */
  'application-index'?: number
  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  'asset-closing-amount'?: number
  /**
   * The asset index if the transaction was found and it created an asset.
   */
  'asset-index'?: number
  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  'close-rewards'?: number
  /**
   * Closing amount for the transaction.
   */
  'closing-amount'?: number
  /**
   * The round where this transaction was confirmed, if present.
   */
  'confirmed-round'?: number
  /**
   * (gd) Global state key/value changes for the application being executed by this
   * transaction.
   */
  'global-state-delta'?: Record<string, AlgodEvalDelta>[]
  /**
   * Inner transactions produced by application execution.
   */
  'inner-txns'?: PendingTransactionResponse[]
  /**
   * (ld) Local state key/value changes for the application being executed by this
   * transaction.
   */
  'local-state-delta'?: Record<string, AlgodEvalDelta>[]
  /**
   * (lg) Logs for the application being executed by this transaction.
   */
  logs?: Uint8Array[]
  /** Indicates that the transaction was kicked out of this node's transaction pool (and specifies why that happened).
   * An empty string indicates the transaction wasn't kicked out of this node's txpool due to an error. */
  'pool-error': string
  /**
   * Rewards in µALGOs applied to the receiver account.
   */
  'receiver-rewards'?: number
  /**
   * Rewards in µALGOs applied to the sender account.
   */
  'sender-rewards'?: number
  /**
   * The raw signed transaction.
   */
  txn: EncodedSignedTransaction
}

export interface AlgodEvalDelta {
  action: number
  bytes: string
  uint: number
}

/**
 * Wait until the transaction is confirmed or rejected, or until `timeout`
 * number of rounds have passed.
 *
 * @param client An algod client
 * @param transactionId The transaction ID to wait for
 * @param timeout Maximum number of rounds to wait
 *
 * @return Pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next `timeout` rounds
 */
export const waitForConfirmation = async function (
  client: Algodv2,
  transactionId: string,
  timeout: number,
): Promise<PendingTransactionResponse> {
  if (timeout < 0) {
    throw new Error(`Invalid timeout, received ${timeout}, expected > 0`)
  }

  // Get current round
  const status = await client.status().do()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  // Loop for up to `timeout` rounds looking for a confirmed transaction
  const startRound = status['last-round'] + 1
  let currentRound = startRound
  while (currentRound < startRound + timeout) {
    const pendingInfo = (await client.pendingTransactionInformation(transactionId).do()) as PendingTransactionResponse
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

    await client.statusAfterBlock(currentRound).do()
    currentRound++
  }

  throw new Error(`Transaction ${transactionId} not confirmed after ${timeout} rounds`)
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
      AlgoKitConfig.logger.warn(
        `Algorand network congestion fees are in effect. This transaction will incur a fee of ${transaction.fee} µALGOs.`,
      )
    }

    // Now set the flat on the transaction. Otherwise the network may increase the fee above our cap and perform the transaction.
    transaction.flatFee = true
  }
}

/**
 * Returns suggested transaction parameters from algod unless some are already provided.
 * @param params Optionally provide parameters to use
 * @param client Algod client
 * @returns The suggested transaction parameters
 */
export async function getTransactionParams(params: SuggestedParams | undefined, client: Algodv2) {
  return params ?? (await client.getTransactionParams().do())
}
