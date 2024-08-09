import algosdk from 'algosdk'
import { AccountInformation, DISPENSER_ACCOUNT, MultisigAccount, SigningAccount, TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ClientManager } from './client-manager'
import { KmdAccountManager } from './kmd-account-manager'
import LogicSigAccount = algosdk.LogicSigAccount
import Account = algosdk.Account
import TransactionSigner = algosdk.TransactionSigner
import AccountInformationModel = algosdk.modelsv2.Account

const memoize = <T = unknown, R = unknown>(fn: (val: T) => R) => {
  const cache = new Map()
  const cached = function (this: unknown, val: T) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val)
  }
  cached.cache = cache
  return cached as (val: T) => R
}

/**
 * Returns a `TransactionSigner` for the given account that can sign a transaction.
 * This function has memoization, so will return the same transaction signer for a given account.
 * @param account An account that can sign a transaction
 * @returns A transaction signer
 */
export const getAccountTransactionSigner = memoize(function (
  account: TransactionSignerAccount | Account | SigningAccount | LogicSigAccount | MultisigAccount,
): TransactionSigner {
  return 'signer' in account
    ? account.signer
    : 'lsig' in account
      ? algosdk.makeLogicSigAccountTransactionSigner(account)
      : algosdk.makeBasicAccountTransactionSigner(account)
})

/** Creates and keeps track of signing accounts that can sign transactions for a sending address. */
export class AccountManager {
  private _clientManager: ClientManager
  private _kmdAccountManager: KmdAccountManager
  private _accounts: { [address: string]: TransactionSignerAccount } = {}
  private _defaultSigner?: algosdk.TransactionSigner

  /**
   * Create a new account manager.
   * @param clientManager The ClientManager client to use for algod and kmd clients
   * @example Create a new account manager
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   * ```
   */
  constructor(clientManager: ClientManager) {
    this._clientManager = clientManager
    this._kmdAccountManager = new KmdAccountManager(clientManager)
  }

  /** KMD account manager that allows you to easily get and create accounts using KMD. */
  public get kmd() {
    return this._kmdAccountManager
  }

  /**
   * Sets the default signer to use if no other signer is specified.
   *
   * If this isn't set an a transaction needs signing for a given sender
   * then an error will be thrown from `getSigner` / `getAccount`.
   * @param signer The signer to use, either a `TransactionSigner` or a `TransactionSignerAccount`
   * @example
   * ```typescript
   * const signer = accountManager.random() // Can be anything that returns a `algosdk.TransactionSigner` or `TransactionSignerAccount`
   * accountManager.setDefaultSigner(signer)
   *
   * // When signing a transaction, if there is no signer registered for the sender then the default signer will be used
   * const signer = accountManager.getSigner("{SENDERADDRESS}")
   * ```
   * @returns The `AccountManager` so method calls can be chained
   */
  public setDefaultSigner(signer: algosdk.TransactionSigner | TransactionSignerAccount): AccountManager {
    this._defaultSigner = 'signer' in signer ? signer.signer : signer
    return this
  }

  /**
   * Records the given account (that can sign) against the address of the provided account for later
   * retrieval and returns a `TransactionSignerAccount` along with the original account in an `account` property.
   */
  private signerAccount<T extends TransactionSignerAccount | Account | SigningAccount | LogicSigAccount | MultisigAccount>(
    account: T,
  ): TransactionSignerAccount & { account: T } {
    const acc = {
      addr: 'addr' in account ? account.addr : account.address(),
      signer: getAccountTransactionSigner(account),
    }
    this._accounts[acc.addr] = acc
    return { ...acc, account }
  }

  /**
   * Tracks the given account for later signing.
   *
   * Note: If you are generating accounts via the various methods on `AccountManager`
   * (like `random`, `fromMnemonic`, `logicsig`, etc.) then they automatically get tracked.
   * @param account The account to register, which can be a `TransactionSignerAccount` or
   *  a `algosdk.Account`, `algosdk.LogicSigAccount`, `SigningAccount` or `MultisigAccount`
   * @example
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   *  .setSignerFromAccount(algosdk.generateAccount())
   *  .setSignerFromAccount(new algosdk.LogicSigAccount(program, args))
   *  .setSignerFromAccount(new SigningAccount(mnemonic, sender))
   *  .setSignerFromAccount(new MultisigAccount({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]}, [account1, account2]))
   *  .setSignerFromAccount({addr: "SENDERADDRESS", signer: transactionSigner})
   * ```
   * @returns The `AccountManager` instance for method chaining
   */
  public setSignerFromAccount(account: TransactionSignerAccount | Account | LogicSigAccount | SigningAccount | MultisigAccount) {
    this.signerAccount(account)
    return this
  }

  /**
   * Tracks the given `algosdk.TransactionSigner` against the given sender address for later signing.
   * @param sender The sender address to use this signer for
   * @param signer The `algosdk.TransactionSigner` to sign transactions with for the given sender
   * @example
   * ```typescript
   * const accountManager = new AccountManager(clientManager)
   *  .setSigner("SENDERADDRESS", transactionSigner)
   * ```
   * @returns The `AccountManager` instance for method chaining
   */
  public setSigner(sender: string, signer: algosdk.TransactionSigner) {
    this._accounts[sender] = { addr: sender, signer }
    return this
  }

  /**
   * Returns the `TransactionSigner` for the given sender address, ready to sign a transaction for that sender.
   *
   * If no signer has been registered for that address then the default signer is used if registered and
   * if not then an error is thrown.
   *
   * @param sender The sender address
   * @example
   * ```typescript
   * const signer = accountManager.getSigner("SENDERADDRESS")
   * ```
   * @returns The `TransactionSigner` or throws an error if not found and no default signer is set
   */
  public getSigner(sender: string): algosdk.TransactionSigner {
    const signer = this._accounts[sender]?.signer ?? this._defaultSigner
    if (!signer) throw new Error(`No signer found for address ${sender}`)
    return signer
  }

  /**
   * Returns the `TransactionSignerAccount` for the given sender address.
   *
   * If no signer has been registered for that address then an error is thrown.
   * @param sender The sender address
   * @example
   * ```typescript
   * const account = accountManager.random()
   * const sender = account.addr
   * // ...
   * // Returns the `TransactionSignerAccount` for `sender` that has previously been registered
   * const account = accountManager.getAccount(sender)
   * ```
   * @returns The `TransactionSignerAccount` or throws an error if not found
   */
  public getAccount(sender: string): TransactionSignerAccount {
    const account = this._accounts[sender]
    if (!account) throw new Error(`No signer found for address ${sender}`)
    return account
  }

  /**
   * Returns the given sender account's current status, balance and spendable amounts.
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddress)
   * @example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountInfo = await accountManager.getInformation(address);
   * ```
   *
   * @param sender The account / address to look up
   * @returns The account information
   */
  public async getInformation(sender: string | TransactionSignerAccount): Promise<AccountInformation> {
    const account = AccountInformationModel.from_obj_for_encoding(
      await this._clientManager.algod.accountInformation(typeof sender === 'string' ? sender : sender.addr).do(),
    )

    return {
      ...account,
      // None of these can practically overflow 2^53
      amount: Number(account.amount),
      amountWithoutPendingRewards: Number(account.amountWithoutPendingRewards),
      minBalance: Number(account.minBalance),
      pendingRewards: Number(account.pendingRewards),
      rewards: Number(account.rewards),
      round: Number(account.round),
      totalAppsOptedIn: Number(account.totalAppsOptedIn),
      totalAssetsOptedIn: Number(account.totalAssetsOptedIn),
      totalCreatedApps: Number(account.totalCreatedApps),
      totalCreatedAssets: Number(account.totalCreatedAssets),
      appsTotalExtraPages: account.appsTotalExtraPages ? Number(account.appsTotalExtraPages) : undefined,
      rewardBase: account.rewardBase ? Number(account.rewardBase) : undefined,
      totalBoxBytes: account.totalBoxBytes ? Number(account.totalBoxBytes) : undefined,
      totalBoxes: account.totalBoxes ? Number(account.totalBoxes) : undefined,
    }
  }

  /**
   * Returns the given sender account's asset holding for a given asset.
   *
   * @example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const assetId = 123345;
   * const accountInfo = await accountManager.getAccountAssetInformation(address, assetId);
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/#get-v2accountsaddressassetsasset-id)
   * @param sender The address of the sender/account to look up
   * @param assetId The ID of the asset to return a holding for
   * @returns The account asset holding information
   */
  public async getAssetInformation(sender: string | TransactionSignerAccount, assetId: number | bigint) {
    const info = await this._clientManager.algod
      .accountAssetInformation(typeof sender === 'string' ? sender : sender.addr, Number(assetId))
      .do()

    return {
      assetId: BigInt(assetId),
      balance: BigInt(info['asset-holding']['amount']),
      frozen: info['asset-holding']['is-frozen'] === true,
      round: BigInt(info['round']),
    }
  }

  /**
   * Tracks and returns an Algorand account with secret key loaded (i.e. that can sign transactions) by taking the mnemonic secret.
   *
   * @example
   * ```typescript
   * const account = await account.fromMnemonic("mnemonic secret ...")
   * const rekeyedAccount = await account.fromMnemonic("mnemonic secret ...", "SENDERADDRESS...")
   * ```
   * @param mnemonicSecret The mnemonic secret representing the private key of an account; **Note: Be careful how the mnemonic is handled**,
   *  never commit it into source control and ideally load it from the environment (ideally via a secret storage service) rather than the file system.
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @returns The account
   */
  public fromMnemonic(mnemonicSecret: string, sender?: string) {
    const account = algosdk.mnemonicToSecretKey(mnemonicSecret)
    return this.signerAccount(new SigningAccount(account, sender))
  }

  /**
   * Tracks and returns an Algorand account that is a rekeyed version of the given account to a new sender.
   *
   * @example
   * ```typescript
   * const account = await account.fromMnemonic("mnemonic secret ...")
   * const rekeyedAccount = await account.rekeyed(account, "SENDERADDRESS...")
   * ```
   * @param account The account to use as the signer for this new rekeyed account
   * @param sender The sender address to use as the new sender
   * @returns The account
   */
  public rekeyed(account: TransactionSignerAccount, sender: string) {
    return this.signerAccount({ addr: sender, signer: account.signer })
  }

  /**
   * Tracks and returns an Algorand account with private key loaded by convention from environment variables based on the given name identifier.
   *
   * Note: This function expects to run in a Node.js environment.
   *
   * ## Convention:
   * * **Non-LocalNet:** will load process.env['\{NAME\}_MNEMONIC'] as a mnemonic secret; **Note: Be careful how the mnemonic is handled**,
   *  never commit it into source control and ideally load it via a secret storage service rather than the file system.
   *   If process.env['\{NAME\}_SENDER'] is defined then it will use that for the sender address (i.e. to support rekeyed accounts)
   * * **LocalNet:** will load the account from a KMD wallet called \{NAME\} and if that wallet doesn't exist it will create it and fund the account for you
   *
   * This allows you to write code that will work seamlessly in production and local development (LocalNet) without manual config locally (including when you reset the LocalNet).
   *
   * @example Default
   *
   * If you have a mnemonic secret loaded into `process.env.MY_ACCOUNT_MNEMONIC` then you can call the following to get that private key loaded into an account object:
   * ```typescript
   * const account = await account.fromEnvironment('MY_ACCOUNT', algod)
   * ```
   *
   * If that code runs against LocalNet then a wallet called `MY_ACCOUNT` will automatically be created with an account that is automatically funded with 1000 (default) ALGOs from the default LocalNet dispenser.
   * If not running against LocalNet then it will use proces.env.MY_ACCOUNT_MNEMONIC as the private key and (if present) process.env.MY_ACCOUNT_SENDER as the sender address.
   *
   * @param name The name identifier of the account
   * @param fundWith The optional amount to fund the account with when it gets created (when targeting LocalNet), if not specified then 1000 Algos will be funded from the dispenser account
   * @returns The account
   */
  public async fromEnvironment(name: string, fundWith?: AlgoAmount) {
    if (!process || !process.env) {
      throw new Error('Attempt to get account with private key from a non Node.js context; this is not supported!')
    }

    const accountMnemonic = process.env[`${name.toUpperCase()}_MNEMONIC`]
    const sender = process.env[`${name.toUpperCase()}_SENDER`]

    if (accountMnemonic) {
      const signer = algosdk.mnemonicToSecretKey(accountMnemonic)
      return this.signerAccount(new SigningAccount(signer, sender))
    }

    if (await this._clientManager.isLocalNet()) {
      const account = await this._kmdAccountManager.getOrCreateWalletAccount(name, fundWith)
      return this.signerAccount(account.account)
    }

    throw new Error(`Missing environment variable ${name.toUpperCase()}_MNEMONIC when looking for account ${name}`)
  }

  /**
   * Tracks and returns an Algorand account with private key loaded from the given KMD wallet (identified by name).
   *
   * @param name The name of the wallet to retrieve an account from
   * @param predicate An optional filter to use to find the account (otherwise it will return a random account from the wallet)
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @example Get default funded account in a LocalNet
   *
   * ```typescript
   * const defaultDispenserAccount = await account.fromKmd('unencrypted-default-wallet',
   *   a => a.status !== 'Offline' && a.amount > 1_000_000_000
   * )
   * ```
   * @returns The account
   */
  public async fromKmd(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate?: (account: Record<string, any>) => boolean,
    sender?: string,
  ) {
    const account = await this.kmd.getWalletAccount(name, predicate, sender)
    if (!account) throw new Error(`Unable to find KMD account ${name}${predicate ? ' with predicate' : ''}`)
    return this.signerAccount(account.account)
  }

  /**
   * Tracks and returns an account that supports partial or full multisig signing.
   *
   * @example
   * ```typescript
   * const account = await account.multisig({version: 1, threshold: 1, addrs: ["ADDRESS1...", "ADDRESS2..."]},
   *  await account.fromEnvironment('ACCOUNT1'))
   * ```
   * @param multisigParams The parameters that define the multisig account
   * @param signingAccounts The signers that are currently present
   * @returns A multisig account wrapper
   */
  public multisig(multisigParams: algosdk.MultisigMetadata, signingAccounts: (algosdk.Account | SigningAccount)[]) {
    return this.signerAccount(new MultisigAccount(multisigParams, signingAccounts))
  }

  /**
   * Tracks and returns an account that represents a logic signature.
   *
   * @example
   * ```typescript
   * const account = await account.logicsig(program, [new Uint8Array(3, ...)])
   * ```
   * @param program The bytes that make up the compiled logic signature
   * @param args The (binary) arguments to pass into the logic signature
   * @returns A logic signature account wrapper
   */
  public logicsig(program: Uint8Array, args?: Array<Uint8Array>) {
    return this.signerAccount(new LogicSigAccount(program, args))
  }

  /**
   * Tracks and returns a new, random Algorand account with secret key loaded.
   *
   * @example
   * ```typescript
   * const account = await account.random()
   * ```
   * @returns The account
   */
  public random() {
    return this.signerAccount(algosdk.generateAccount())
  }

  /**
   * Returns an account (with private key loaded) that can act as a dispenser from
   * environment variables, or against default LocalNet if no environment variables present.
   *
   * Note: requires a Node.js environment to execute.
   *
   * If present, it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC and optionally
   * process.env.DISPENSER_SENDER if it's a rekeyed account.
   *
   * @example
   * ```typescript
   * const account = await account.dispenserFromEnvironment()
   * ```
   *
   * @returns The account
   */
  public async dispenserFromEnvironment() {
    if (!process || !process.env) {
      throw new Error('Attempt to get dispenser from environment from a non Node.js context; this is not supported!')
    }

    return process.env[`${DISPENSER_ACCOUNT.toUpperCase()}_MNEMONIC`]
      ? await this.fromEnvironment(DISPENSER_ACCOUNT)
      : await this.localNetDispenser()
  }

  /**
   * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).
   *
   * @example
   * ```typescript
   * const account = await account.localNetDispenser()
   * ```
   * @returns The account
   */
  public async localNetDispenser() {
    const dispenser = await this._kmdAccountManager.getLocalNetDispenserAccount()
    return this.signerAccount(dispenser.account)
  }
}
