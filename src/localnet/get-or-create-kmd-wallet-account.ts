import * as algosdk from '../sdk'
import { AlgoAmount } from '../types/amount'
import { ClientManager } from '../types/client-manager'
import { KmdAccountManager } from '../types/kmd-account-manager'
import type { Account } from '../sdk'
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
 * @deprecated use `algorand.account.kmd.getOrCreateWalletAccount(name, fundWith)` or `new KMDAccountManager(clientManager).getOrCreateWalletAccount(name, fundWith)` instead.
 *
 * Gets an account with private key loaded from a KMD wallet of the given name, or alternatively creates one with funds in it via a KMD wallet of the given name.
 *
 * This is useful to get idempotent accounts from LocalNet without having to specify the private key (which will change when resetting the LocalNet).
 *
 * This significantly speeds up local dev time and improves experience since you can write code that *just works* first go without manual config in a fresh LocalNet.
 *
 * If this is used via `mnemonicAccountFromEnvironment`, then you can even use the same code that runs on production without changes for local development!
 *
 * @param walletAccount The wallet details with:
 *   * `name`: The name of the wallet to retrieve / create
 *   * `fundWith`: The number of Algo to fund the account with when it gets created, if not specified then 1000 ALGO will be funded from the dispenser account
 * @param algod An algod client
 * @param kmdClient A KMD client, if not specified then a default KMD client will be loaded from environment variables
 *
 * @returns An Algorand account with private key loaded - either one that already existed in the given KMD wallet, or a new one that is funded for you
 */
export async function getOrCreateKmdWalletAccount(
  walletAccount: { name: string; fundWith?: AlgoAmount },
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account> {
  return (
    await new KmdAccountManager(new ClientManager({ algod, kmd: kmdClient })).getOrCreateWalletAccount(
      walletAccount.name,
      walletAccount.fundWith,
    )
  ).account
}
