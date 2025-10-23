import * as algosdk from '../sdk'
import { ClientManager } from '../types/client-manager'
import { KmdAccountManager } from '../types/kmd-account-manager'
import type { Account } from '../sdk'
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
 * @deprecated use `algorand.account.kmd.getWalletAccount(name, predicate)` or `new KMDAccountManager(clientManager).getWalletAccount(name, predicate)` instead.
 *
 * Returns an Algorand account with private key loaded from the given KMD wallet (identified by name).
 *
 * @param walletAccount The details of the wallet, with:
 *   * `name`: The name of the wallet to retrieve an account from
 *   * `predicate`: An optional filter to use to find the account (otherwise it will return a random account from the wallet)
 * @param algod An algod client
 * @param kmdClient A KMD client, if not specified then a default KMD client will be loaded from environment variables
 * @example Get default funded account in a LocalNet
 *
 * ```typescript
 * const defaultDispenserAccount = await getKmdWalletAccount(algod,
 *   'unencrypted-default-wallet',
 *   a => a.status !== 'Offline' && a.amount > 1_000_000_000
 * )
 * ```
 */
export async function getKmdWalletAccount(
  walletAccount: {
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    predicate?: (account: Record<string, any>) => boolean
  },
  algod: Algodv2,
  kmdClient?: Kmd,
): Promise<Account | undefined> {
  return (
    await new KmdAccountManager(new ClientManager({ algod, kmd: kmdClient })).getWalletAccount(walletAccount.name, walletAccount.predicate)
  )?.account
}
