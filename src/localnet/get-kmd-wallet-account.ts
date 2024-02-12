import algosdk from 'algosdk'
import { mnemonicAccount } from '../account/mnemonic-account'
import { getAlgoKmdClient } from '../network-client'
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
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
  const { name, predicate } = walletAccount
  const kmd = kmdClient ?? getAlgoKmdClient()
  const wallets = await kmd.listWallets()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wallet = wallets.wallets.filter((w: any) => w.name === name)
  if (wallet.length === 0) {
    return undefined
  }

  const walletId = wallet[0].id

  const walletHandle = (await kmd.initWalletHandle(walletId, '')).wallet_handle_token
  const keyIds = (await kmd.listKeys(walletHandle)).addresses

  let i = 0
  if (predicate) {
    for (i = 0; i < keyIds.length; i++) {
      const key = keyIds[i]
      const account = await algod.accountInformation(key).do()
      if (predicate(account)) {
        break
      }
    }
  }

  if (i >= keyIds.length) {
    return undefined
  }

  const accountKey = (await kmd.exportKey(walletHandle, '', keyIds[i])).private_key

  const accountMnemonic = algosdk.secretKeyToMnemonic(accountKey)
  return mnemonicAccount(accountMnemonic)
}
