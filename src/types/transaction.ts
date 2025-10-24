import { PendingTransactionResponse } from '../algod_client'
import { Transaction } from '../algokit_transact'
import type { Account } from '../sdk'
import * as algosdk from '../sdk'
import { MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ABIReturn } from './app'
import { Expand } from './expand'
import AtomicTransactionComposer = algosdk.AtomicTransactionComposer
import LogicSigAccount = algosdk.LogicSigAccount

export type TransactionNote = Uint8Array | TransactionNoteData | Arc2TransactionNote
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionNoteData = string | null | undefined | number | any[] | Record<string, any>
/** ARC-0002 compatible transaction note components https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md */
export type Arc2TransactionNote =
  | {
      dAppName: string
      format: 'm' | 'b' | 'u'
      data: string
    }
  | {
      dAppName: string
      format: 'j'
      data: TransactionNoteData
    }

/** The sending configuration for a transaction */
export interface SendTransactionParams {
  /** Whether to skip signing and sending the transaction to the chain (default: transaction signed and sent to chain, unless `atc` specified)
   * and instead just return the raw transaction, e.g. so you can add it to a group of transactions */
  skipSending?: boolean
  /** Whether to skip waiting for the submitted transaction (only relevant if `skipSending` is `false` or unset) */
  skipWaiting?: boolean
  /** An optional `AtomicTransactionComposer` to add the transaction to, if specified then `skipSending: undefined` has the same effect as `skipSending: true` */
  atc?: AtomicTransactionComposer
  /** Whether to suppress log messages from transaction send, default: do not suppress */
  suppressLog?: boolean
  /** The flat fee you want to pay, useful for covering extra fees in a transaction group or app call */
  fee?: AlgoAmount
  /** The maximum fee that you are happy to pay (default: unbounded) - if this is set it's possible the transaction could get rejected during network congestion */
  maxFee?: AlgoAmount
  /** The maximum number of rounds to wait for confirmation, only applies if `skipWaiting` is `undefined` or `false`, default: wait up to 5 rounds */
  maxRoundsToWaitForConfirmation?: number
  /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to true when there are app calls in the group.  */
  populateAppCallResources?: boolean
}

/** Result from sending a single transaction. */
export type SendSingleTransactionResult = Expand<SendAtomicTransactionComposerResults & ConfirmedTransactionResult>

/** The result of sending a transaction */
export interface SendTransactionResult {
  /** The transaction */
  transaction: Transaction
  /** The response if the transaction was sent and waited for */
  confirmation?: PendingTransactionResponse
}

/** The result of preparing and/or sending multiple transactions */
export interface SendTransactionResults {
  /** The transactions that have been prepared and/or sent */
  transactions: Transaction[]
  /** The responses if the transactions were sent and waited for,
   * the index of the confirmation will match the index of the underlying transaction
   */
  confirmations?: PendingTransactionResponse[]
}

/** The result of preparing and/or sending multiple transactions using an `AtomicTransactionComposer` */
export interface SendAtomicTransactionComposerResults extends SendTransactionResults {
  /** base64 encoded representation of the group ID of the atomic group */
  groupId: string
  /** The transaction IDs that have been prepared and/or sent */
  txIds: string[]
  /** If ABI method(s) were called the processed return values */
  returns?: ABIReturn[]
  /** The responses if the transactions were sent and waited for,
   * the index of the confirmation will match the index of the underlying transaction
   */
  confirmations: PendingTransactionResponse[]
}

/** The result of sending and confirming a transaction */
export interface ConfirmedTransactionResult extends SendTransactionResult {
  /** The response from sending and waiting for the transaction */
  confirmation: PendingTransactionResponse
}

/** The result of sending and confirming one or more transactions, but where there is a primary transaction of interest */
export interface ConfirmedTransactionResults extends SendTransactionResult, SendTransactionResults {
  /** The response from sending and waiting for the primary transaction */
  confirmation: PendingTransactionResponse
  /** The response from sending and waiting for the transactions */
  confirmations: PendingTransactionResponse[]
}

/** Core account abstraction when signing/sending transactions
 *
 * This type is used across the entire AlgoKit Utils library and allows you to pass through
 * many types of accounts, including:
 * * `Account` - The in-built `algosdk.Account` type for mnemonic accounts
 * * `SigningAccount` - An AlgoKit Utils class that wraps Account to provide support for rekeyed accounts
 * * `LogicSigAccount` - The in-built `algosdk.LogicSigAccount` type for logic signatures
 * * `MultisigAccount` - An AlgoKit Utils class that wraps a multisig account and provides mechanisms to get a multisig account
 * * `TransactionSignerAccount` - An AlgoKit Utils class that wraps the in-built `algosdk.TransactionSigner` along with the sender address
 */
export type SendTransactionFrom = Account | SigningAccount | LogicSigAccount | MultisigAccount | TransactionSignerAccount

/** Defines an unsigned transaction that will appear in a group of transactions along with its signing information */
export interface TransactionToSign {
  /** The unsigned transaction to sign and send */
  transaction: Transaction
  /** The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account */
  signer: SendTransactionFrom
}

/** A group of transactions to send together as an atomic group
 * https://dev.algorand.co/concepts/transactions/atomic-txn-groups/
 */
export interface TransactionGroupToSend {
  /** Any parameters to control the semantics of the send to the network */
  sendParams?: Omit<SendTransactionParams, 'fee' | 'maxFee' | 'skipSending' | 'atc'>
  /** The list of transactions to send, which can either be a raw transaction (in which case `signer` is required),
   *   the async result of an AlgoKit utils method that returns a `SendTransactionResult` (saves unwrapping the promise, be sure to pass `skipSending: true`, `signer` is also required)
   *   or the transaction with its signer (`signer` is ignored)
   **/
  transactions: (TransactionToSign | Transaction | Promise<SendTransactionResult>)[]
  /** Optional signer to pass in, required if at least one transaction provided is just the transaction, ignored otherwise */
  signer?: SendTransactionFrom
}

/** Parameters to configure transaction sending. */
export interface SendParams {
  /** The number of rounds to wait for confirmation. By default until the latest lastValid has past. */
  maxRoundsToWaitForConfirmation?: number
  /** Whether to suppress log messages from transaction send, default: do not suppress. */
  suppressLog?: boolean
  /** Whether to use simulate to automatically populate app call resources in the txn objects. Defaults to `Config.populateAppCallResources`. */
  populateAppCallResources?: boolean
  /** Whether to use simulate to automatically calculate required app call inner transaction fees and cover them in the parent app call transaction fee */
  coverAppCallInnerTransactionFees?: boolean
}

/** Additional context about the `AtomicTransactionComposer`. */
export interface AdditionalAtomicTransactionComposerContext {
  /** A map of transaction index in the `AtomicTransactionComposer` to the max fee that can be calculated for a transaction in the group */
  maxFees: Map<number, AlgoAmount>

  /* The suggested params info relevant to transactions in the `AtomicTransactionComposer` */
  suggestedParams: Pick<algosdk.SdkTransactionParams, 'fee' | 'minFee'>
}

/** An `AtomicTransactionComposer` with transactions to send. */
export interface AtomicTransactionComposerToSend extends SendParams {
  /** The `AtomicTransactionComposer` with transactions loaded to send */
  atc: AtomicTransactionComposer
  /**
   * @deprecated - set the parameters at the top level instead
   * Any parameters to control the semantics of the send to the network */
  sendParams?: Omit<SendTransactionParams, 'fee' | 'maxFee' | 'skipSending' | 'atc'>

  /**
   * Additional `AtomicTransactionComposer` context used when building the transaction group that is sent.
   * This additional context is used and must be supplied when coverAppCallInnerTransactionFees is set to true.
   **/
  additionalAtcContext?: AdditionalAtomicTransactionComposerContext
}
