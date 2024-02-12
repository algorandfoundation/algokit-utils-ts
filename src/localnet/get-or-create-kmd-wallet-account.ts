import algosdk from 'algosdk'
import { Config } from '../config'
import { getAlgoKmdClient } from '../network-client'
import { transferAlgos } from '../transfer/transfer-algos'
import { AlgoAmount } from '../types/amount'
import { getKmdWalletAccount } from './get-kmd-wallet-account'
import { getLocalNetDispenserAccount } from './get-localnet-dispenser-account'
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
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
 *   * `fundWith`: The number of Algos to fund the account with when it gets created, if not specified then 1000 Algos will be funded from the dispenser account
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
  const kmd = kmdClient ?? getAlgoKmdClient()

  // Get an existing account from the KMD wallet
  const existing = await getKmdWalletAccount(walletAccount, algod, kmd)
  if (existing) {
    return existing
  }

  // None existed: create the KMD wallet instead
  const walletId = (await kmd.createWallet(walletAccount.name, '')).wallet.id
  const walletHandle = (await kmd.initWalletHandle(walletId, '')).wallet_handle_token
  await kmd.generateKey(walletHandle)

  // Get the account from the new KMD wallet
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const account = (await getKmdWalletAccount(walletAccount, algod, kmd))!

  Config.logger.info(
    `LocalNet account '${walletAccount.name}' doesn't yet exist; created account ${account.addr} with keys stored in KMD and funding with ${
      walletAccount.fundWith?.algos ?? 1000
    } ALGOs`,
  )

  // Fund the account from the dispenser
  await transferAlgos(
    {
      amount: walletAccount.fundWith ?? AlgoAmount.Algos(1000),
      from: await getLocalNetDispenserAccount(algod, kmd),
      to: account.addr,
    },
    algod,
  )

  return account
}
