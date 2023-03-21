import { Account, LogicSigAccount, Transaction } from 'algosdk'
import { MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { PendingTransactionResponse } from './algod'
import { AlgoAmount } from './amount'

export type TransactionNote = Uint8Array | TransactionNoteData | Arc2TransactionNote
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionNoteData = string | null | undefined | number | any[] | Record<string, any>
/** ARC-0002 compatible transaction note components, @see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md */
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

/** The result of sending and confirming a transaction */
export interface ConfirmedTransactionResult extends SendTransactionResult {
  /** The response if the transaction was sent and waited for */
  confirmation: PendingTransactionResponse
}

export type SendTransactionFrom = Account | SigningAccount | LogicSigAccount | MultisigAccount | TransactionSignerAccount

/** Defines an unsigned transaction that will appear in a group of transactions along with its signing information */
export interface TransactionToSign {
  /** The unsigned transaction to sign and send */
  transaction: Transaction
  /** The account to use to sign the transaction, either an account (with private key loaded) or a logic signature account */
  signer: SendTransactionFrom
}
