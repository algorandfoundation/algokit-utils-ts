import algosdk from 'algosdk'
import { getKmdWalletAccount } from './get-kmd-wallet-account'
import { isLocalNet } from './is-localnet'
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd
/**
 * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)
 *
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables
 */
export async function getLocalNetDispenserAccount(algod: Algodv2, kmd?: Kmd): Promise<Account> {
  if (!(await isLocalNet(algod))) {
    throw "Can't get default account from non LocalNet network"
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (await getKmdWalletAccount(
    { name: 'unencrypted-default-wallet', predicate: (a) => a.status !== 'Offline' && a.amount > 1_000_000_000 },
    algod,
    kmd,
  ))!
}
