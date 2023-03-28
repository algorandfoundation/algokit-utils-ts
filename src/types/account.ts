import algosdk, { Account, MultisigMetadata, Transaction, TransactionSigner } from 'algosdk'

/**
 * The account name identifier used for fund dispensing in test environments
 */
export const DISPENSER_ACCOUNT = 'DISPENSER'

/** Account wrapper that supports partial or full multisig signing. */
export class MultisigAccount {
  _params: algosdk.MultisigMetadata
  _signingAccounts: (algosdk.Account | SigningAccount)[]
  _addr: string

  /** The parameters for the multisig account */
  get params(): Readonly<algosdk.MultisigMetadata> {
    return this._params
  }

  /** The list of accounts that are present to sign */
  get signingAccounts(): Readonly<(algosdk.Account | SigningAccount)[]> {
    return this._signingAccounts
  }

  /** The address of the multisig account */
  get addr(): Readonly<string> {
    return this._addr
  }

  constructor(multisigParams: MultisigMetadata, signingAccounts: (Account | SigningAccount)[]) {
    this._params = multisigParams
    this._signingAccounts = signingAccounts
    this._addr = algosdk.multisigAddress(multisigParams)
  }

  /**
   * Sign the given transaction
   * @param transaction Either a transaction object or a raw, partially signed transaction
   * @returns The transaction signed by the present signers
   */
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

/** A wrapper around @see {TransactionSigner} that also has the sender address. */
export interface TransactionSignerAccount {
  addr: Readonly<string>
  signer: TransactionSigner
}
