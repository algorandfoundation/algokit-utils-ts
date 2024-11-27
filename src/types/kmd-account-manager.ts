import algosdk, { Address } from 'algosdk'
import { Config } from '../config'
import { SigningAccount, TransactionSignerAccount } from './account'
import { AlgoAmount } from './amount'
import { ClientManager } from './client-manager'
import { TransactionComposer } from './composer'

/** Provides abstractions over a [KMD](https://github.com/algorand/go-algorand/blob/master/daemon/kmd/README.md) instance
 * that makes it easier to get and manage accounts using KMD. */
export class KmdAccountManager {
  private _clientManager: Omit<ClientManager, 'kmd'>
  private _kmd?: algosdk.Kmd | null

  /**
   * Create a new KMD manager.
   * @param clientManager A ClientManager client to use for algod and kmd clients
   */
  constructor(clientManager: ClientManager) {
    this._clientManager = clientManager
    try {
      this._kmd = clientManager.kmd
    } catch {
      this._kmd = undefined
    }
  }

  async kmd(): Promise<algosdk.Kmd> {
    if (this._kmd === undefined) {
      if (await this._clientManager.isLocalNet()) {
        const { kmdConfig } = ClientManager.getConfigFromEnvironmentOrLocalNet()
        if (kmdConfig) {
          this._kmd = ClientManager.getKmdClient(kmdConfig)
          return this._kmd
        }
      }
      this._kmd = null
    }

    if (!this._kmd) {
      throw new Error('Attempt to use Kmd client in AlgoKit instance with no Kmd configured')
    }

    return this._kmd
  }

  /**
   * Returns an Algorand signing account with private key loaded from the given KMD wallet (identified by name).
   *
   * @param walletName The name of the wallet to retrieve an account from
   * @param predicate An optional filter to use to find the account (otherwise it will return a random account from the wallet)
   * @param sender The optional sender address to use this signer for (aka a rekeyed account)
   * @example Get default funded account in a LocalNet
   *
   * ```typescript
   * const defaultDispenserAccount = await kmdAccountManager.getWalletAccount(
   *   'unencrypted-default-wallet',
   *   a => a.status !== 'Offline' && a.amount > 1_000_000_000
   * )
   * ```
   * @returns The signing account (with private key loaded) or undefined if no matching wallet or account was found
   */
  public async getWalletAccount(
    walletName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate?: (account: Record<string, any>) => boolean,
    sender?: string | Address,
  ): Promise<(TransactionSignerAccount & { account: SigningAccount }) | undefined> {
    const kmd = await this.kmd()

    const walletsResponse = await kmd.listWallets()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wallet = walletsResponse.wallets.filter((w: any) => w.name === walletName)
    if (wallet.length === 0) {
      return undefined
    }

    const walletId = wallet[0].id

    const walletHandle = (await kmd.initWalletHandle(walletId, '')).wallet_handle_token
    const addresses = (await kmd.listKeys(walletHandle)).addresses

    let i = 0
    if (predicate) {
      for (i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        const account = await this._clientManager.algod.accountInformation(address).do()
        if (predicate(account)) {
          break
        }
      }
    }

    if (i >= addresses.length) {
      return undefined
    }

    const accountKey = (await kmd.exportKey(walletHandle, '', addresses[i])).private_key

    const accountMnemonic = algosdk.secretKeyToMnemonic(accountKey)

    const account = algosdk.mnemonicToSecretKey(accountMnemonic)
    const signingAccount = new SigningAccount(account, sender)

    return {
      account: signingAccount,
      addr: signingAccount.addr,
      signer: signingAccount.signer,
    }
  }

  /**
   * Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.
   *
   * This is useful to get idempotent accounts from LocalNet without having to specify the private key (which will change when resetting the LocalNet).
   *
   * This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh LocalNet.
   *
   * If this is used via `mnemonicAccountFromEnvironment`, then you can even use the same code that runs on production without changes for local development!
   *
   * @param name The name of the wallet to retrieve / create
   * @param fundWith The number of Algo to fund the account with when it gets created, if not specified then 1000 ALGO will be funded from the dispenser account
   *
   * @example
   * ```typescript
   * // Idempotently get (if exists) or crate (if it doesn't exist yet) an account by name using KMD
   * // if creating it then fund it with 2 ALGO from the default dispenser account
   * const newAccount = await kmdAccountManager.getOrCreateWalletAccount('account1', (2).algo())
   * // This will return the same account as above since the name matches
   * const existingAccount = await kmdAccountManager.getOrCreateWalletAccount('account1')
   * ```
   *
   * @returns An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you
   */
  public async getOrCreateWalletAccount(
    name: string,
    fundWith?: AlgoAmount,
  ): Promise<TransactionSignerAccount & { account: SigningAccount }> {
    // Get an existing account from the KMD wallet
    const existing = await this.getWalletAccount(name)
    if (existing) {
      return existing
    }

    const kmd = await this.kmd()

    // None existed: create the KMD wallet instead
    const walletId = (await kmd.createWallet(name, '')).wallet.id
    const walletHandle = (await kmd.initWalletHandle(walletId, '')).wallet_handle_token
    await kmd.generateKey(walletHandle)

    // Get the account from the new KMD wallet
    const account = (await this.getWalletAccount(name))!

    Config.logger.info(
      `LocalNet account '${name}' doesn't yet exist; created account ${account.addr} with keys stored in KMD and funding with ${
        fundWith?.algo ?? 1000
      } ALGO`,
    )

    // Fund the account from the dispenser
    const dispenser = await this.getLocalNetDispenserAccount()
    await new TransactionComposer({
      algod: this._clientManager.algod,
      getSigner: () => dispenser.signer,
      getSuggestedParams: () => this._clientManager.algod.getTransactionParams().do(),
    })
      .addPayment({
        amount: fundWith ?? AlgoAmount.Algo(1000),
        receiver: account.addr,
        sender: dispenser.addr,
      })
      .send()

    return account
  }

  /**
   * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts).
   * @example
   * ```typescript
   * const dispenser = await kmdAccountManager.getLocalNetDispenserAccount()
   * ```
   * @returns The default LocalNet dispenser account
   */
  public async getLocalNetDispenserAccount() {
    if (!(await this._clientManager.isLocalNet())) {
      throw new Error("Can't get LocalNet dispenser account from non LocalNet network")
    }

    const dispenser = await this.getWalletAccount('unencrypted-default-wallet', (a) => a.status !== 'Offline' && a.amount > 1_000_000_000)
    if (!dispenser) {
      throw new Error("Error retrieving LocalNet dispenser account; couldn't find the default account in KMD")
    }

    return dispenser
  }
}
