import algosdk from 'algosdk'
import { AlgorandClient, Config } from '../'
import { GetTestAccountParams } from '../types/testing'
import Account = algosdk.Account

/**
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param param0 The config for the test account to generate
 * @param algorand An AlgorandClient client
 * @returns The account, with private key loaded
 */
export async function getTestAccount(
  { suppressLog, initialFunds, accountGetter }: GetTestAccountParams,
  algorand: AlgorandClient,
): Promise<Account> {
  const account = accountGetter ? await accountGetter(algorand) : algosdk.generateAccount()

  Config.getLogger(suppressLog).info(
    `New test account created with address '${account.addr}' and mnemonic '${algosdk.secretKeyToMnemonic(account.sk)}'.`,
  )

  const dispenser = await algorand.account.dispenserFromEnvironment()

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: account.addr,
    amount: initialFunds,
    note: 'Funding test account',
    suppressLog,
  })

  const accountInfo = await algorand.account.getInformation(account.addr)

  Config.getLogger(suppressLog).info('Test account funded; account balance: %d µAlgos', accountInfo.balance.microAlgos)

  return account
}
