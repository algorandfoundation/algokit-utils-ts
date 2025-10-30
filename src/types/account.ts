import {
  AccountParticipation,
  Application,
  ApplicationLocalState,
  ApplicationStateSchema,
  Asset,
  AssetHolding,
} from '@algorandfoundation/algod-client'
import { Transaction } from '@algorandfoundation/algokit-transact'
import type { Account } from '@algorandfoundation/sdk'
import * as algosdk from '@algorandfoundation/sdk'
import { Address } from '@algorandfoundation/sdk'
import { appendSignMultisigTransaction, signMultisigTransaction } from '@algorandfoundation/sdk/src/multisigSigning'
import { AlgoAmount } from './amount'
import MultisigMetadata = algosdk.MultisigMetadata
import TransactionSigner = algosdk.TransactionSigner

/**
 * The account name identifier used for fund dispensing in test environments
 */
export const DISPENSER_ACCOUNT = 'DISPENSER'

/** Account wrapper that supports partial or full multisig signing. */
export class MultisigAccount {
  _params: algosdk.MultisigMetadata
  _signingAccounts: (algosdk.Account | SigningAccount)[]
  _addr: Address
  _signer: TransactionSigner

  /** The parameters for the multisig account */
  get params(): Readonly<algosdk.MultisigMetadata> {
    return this._params
  }

  /** The list of accounts that are present to sign */
  get signingAccounts(): Readonly<(algosdk.Account | SigningAccount)[]> {
    return this._signingAccounts
  }

  /** The address of the multisig account */
  get addr(): Readonly<Address> {
    return this._addr
  }

  /** The transaction signer for the multisig account */
  get signer(): TransactionSigner {
    return this._signer
  }

  constructor(multisigParams: MultisigMetadata, signingAccounts: (Account | SigningAccount)[]) {
    this._params = multisigParams
    this._signingAccounts = signingAccounts
    this._addr = algosdk.multisigAddress(multisigParams)
    this._signer = algosdk.makeMultiSigAccountTransactionSigner(
      multisigParams,
      signingAccounts.map((a) => a.sk),
    )
  }

  /**
   * Sign the given transaction
   * @param transaction Either a transaction object or a raw, partially signed transaction
   * @returns The transaction signed by the present signers
   * @example
   * ```typescript
   * const signedTxn = multisigAccount.sign(myTransaction)
   * ```
   */
  public sign(transaction: Transaction | Uint8Array): Uint8Array {
    let signedTxn = 'sender' in transaction ? undefined : transaction
    for (const signer of this._signingAccounts) {
      if (signedTxn) {
        signedTxn = appendSignMultisigTransaction(signedTxn, this._params, signer.sk).blob
      } else {
        signedTxn = signMultisigTransaction(transaction as Transaction, this._params, signer.sk).blob
      }
    }
    return signedTxn!
  }
}

/** Account wrapper that supports a rekeyed account */
export class SigningAccount implements Account {
  private _account: Account
  private _signer: TransactionSigner
  private _sender: Address

  /**
   * Algorand address of the sender
   */
  get addr(): Readonly<Address> {
    return this._sender
  }

  /**
   * Secret key belonging to the signer
   */
  get sk(): Readonly<Uint8Array> {
    return this._account.sk
  }

  /**
   * Transaction signer for the underlying signing account
   */
  get signer(): TransactionSigner {
    return this._signer
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

  constructor(account: Account, sender: string | Address | undefined) {
    this._account = account
    this._sender = typeof sender === 'string' ? Address.fromString(sender) : (sender ?? account.addr)
    this._signer = algosdk.makeBasicAccountTransactionSigner(account)
  }
}

/** A wrapper around `TransactionSigner` that also has the sender address. */
export interface TransactionSignerAccount {
  addr: Readonly<Address>
  signer: TransactionSigner
}

/** Account information at a given round. */
export type AccountInformation = {
  /**
   * The account public key
   */
  address: Address

  /** The balance of Algo currently held by the account. */
  balance: AlgoAmount

  /**
   * The amount of Algo in the account, without the pending rewards.
   */
  amountWithoutPendingRewards: AlgoAmount

  /**
   * Algo balance required to be held by the account.
   *
   * The requirement grows based on asset and application usage.
   */
  minBalance: AlgoAmount
  /**
   * Amount of Algo of pending rewards in this account.
   */
  pendingRewards: AlgoAmount

  /**
   * Total rewards of Algo the account has received, including pending
   * rewards.
   */
  rewards: AlgoAmount

  /**
   * The round number for which this information is relevant.
   */
  validAsOfRound: bigint

  /**
   * Delegation status of the account's Algo:
   * * Offline - indicates that the associated account is delegated.
   * * Online - indicates that the associated account used as part of the delegation pool.
   * * NotParticipating - indicates that the associated account is neither a delegator nor a delegate.
   */
  status: string

  /**
   * The count of all applications that have been opted in, equivalent to the count
   * of application local data (AppLocalState objects) stored in this account.
   */
  totalAppsOptedIn: number

  /**
   * The count of all assets that have been opted in, equivalent to the count of
   * AssetHolding objects held by this account.
   */
  totalAssetsOptedIn: number

  /**
   * The count of all apps (AppParams objects) created by this account.
   */
  totalCreatedApps: number

  /**
   * The count of all assets (AssetParams objects) created by this account.
   */
  totalCreatedAssets: number

  /**
   * Applications local data stored in this account.
   */
  appsLocalState?: ApplicationLocalState[]

  /**
   * The sum of all extra application program pages for this account.
   */
  appsTotalExtraPages?: number
  /**
   * (tsch) stores the sum of all of the local schemas and global schemas in this
   * account.
   * Note: the raw account uses `StateSchema` for this type.
   */
  appsTotalSchema?: ApplicationStateSchema

  /**
   * Assets held by this account.
   */
  assets?: AssetHolding[]

  /**
   * The address against which signing should be checked. If empty, the
   * address of the current account is used. This field can be updated in any
   * transaction by setting the `RekeyTo` field.
   */
  authAddr?: Address

  /**
   * Parameters of applications created by this account including app global data.
   */
  createdApps?: Application[]

  /**
   * (apar) parameters of assets created by this account.
   * Note: the raw account uses `map[int] -> Asset` for this type.
   */
  createdAssets?: Asset[]

  /**
   * AccountParticipation describes the parameters used by this account in consensus
   * protocol.
   */
  participation?: AccountParticipation

  /**
   * Used as part of the rewards computation. Only applicable to accounts
   * which are participating.
   */
  rewardBase?: number

  /**
   * Indicates what type of signature is used by this account, must be one of:
   * * sig
   * * msig
   * * lsig
   */
  sigType?: string

  /**
   * The total number of bytes used by this account's app's box keys and
   * values.
   */
  totalBoxBytes?: number

  /**
   * The number of existing boxes created by this account's app.
   */
  totalBoxes?: number

  /**
   * The round in which this account last went online, or explicitly renewed their
   * online status.
   */
  lastHeartbeatRound?: bigint

  /**
   * The round in which this account last proposed the block.
   */
  lastProposedRound?: bigint
}

/** Account asset holding information at a given round. */
export type AccountAssetInformation = {
  /** The ID of the asset held. */
  assetId: bigint
  /** The current balance of that asset holding. */
  balance: bigint
  /** Whether or not the asset is frozen for the account. */
  frozen: boolean
  /** The round as at which the holding was correct. */
  round: bigint
}

/**
 * @deprecated The methods that use this can be achieved using `AccountManager` instead.
 * Config for an account config */
export interface AccountConfig {
  /** Mnemonic for an account */
  accountMnemonic: string
  /** Address of a rekeyed account */
  senderAddress?: string
  /** Account name used to retrieve config */
  accountName: string

  /** @deprecated Renamed to senderAddress in 2.3.1 */
  senderMnemonic?: string
}
