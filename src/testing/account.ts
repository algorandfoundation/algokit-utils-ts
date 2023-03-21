import algosdk, { Account, Algodv2, Kmd } from 'algosdk'
import { Config } from '../'
import { getDispenserAccount } from '../account'
import { transferAlgos } from '../transfer'
import { GetTestAccountParams } from '../types/testing'

/**
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser @see {getDispenserAccount}
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param param0 The config for the test account to generate
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables @see {getAlgoKmdClient}
 * @returns The account, with private key loaded
 */
export async function getTestAccount({ suppressLog, initialFunds }: GetTestAccountParams, algod: Algodv2, kmd?: Kmd): Promise<Account> {
  const account = algosdk.generateAccount()

  Config.getLogger(suppressLog).info(
    `New test account created with address '${account.addr}' and mnemonic '${algosdk.secretKeyToMnemonic(account.sk)}'.`,
  )

  const dispenser = await getDispenserAccount(algod, kmd)

  await transferAlgos({ from: dispenser, to: account.addr, amount: initialFunds, note: 'Funding test account', suppressLog }, algod)

  const accountInfo = await algod.accountInformation(account.addr).do()

  Config.getLogger(suppressLog).info('Test account funded; account balance: %d µAlgos', accountInfo.amount)

  return account
}
