import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import type { Account } from '@algorandfoundation/sdk'
import * as algosdk from '@algorandfoundation/sdk'
import { Address, Kmd } from '@algorandfoundation/sdk'
import { AlgorandClient, Config } from '../'
import { TransactionSignerAccount } from '../types/account'
import { GetTestAccountParams } from '../types/testing'

/**
 * @deprecated Use `getTestAccount(params, algorandClient)` instead. The `algorandClient` object can be created using `AlgorandClient.fromClients({ algod, kmd })`.
 *
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param params The config for the test account to generate
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables and if not found fallback to the default LocalNet KMD client
 * @returns The account, with private key loaded
 */
export async function getTestAccount(
  params: GetTestAccountParams,
  algod: AlgodClient,
  kmd?: Kmd,
): Promise<Address & Account & TransactionSignerAccount>
/**
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param params The config for the test account to generate
 * @param algorand An AlgorandClient client
 * @returns The account, with private key loaded
 */
export async function getTestAccount(
  params: GetTestAccountParams,
  algorand: AlgorandClient,
): Promise<Address & Account & TransactionSignerAccount>
export async function getTestAccount(
  { suppressLog, initialFunds, accountGetter }: GetTestAccountParams,
  algodOrAlgorandClient: AlgodClient | AlgorandClient,
  kmd?: Kmd,
): Promise<Address & Account & TransactionSignerAccount> {
  const algorand =
    algodOrAlgorandClient instanceof AlgorandClient
      ? algodOrAlgorandClient
      : AlgorandClient.fromClients({
          algod: algodOrAlgorandClient,
          kmd,
        })

  const account = accountGetter ? await accountGetter(algorand) : algosdk.generateAccount()

  Config.getLogger(suppressLog).info(
    `New test account created with address '${account.addr}' and mnemonic '${algosdk.secretKeyToMnemonic(account.sk)}'.`,
  )

  const dispenser = await algorand.account.dispenserFromEnvironment()

  await algorand.send.payment({
    sender: dispenser,
    receiver: account.addr,
    amount: initialFunds,
    note: 'Funding test account',
    suppressLog,
  })

  const accountInfo = await algorand.account.getInformation(account.addr)

  Config.getLogger(suppressLog).info('Test account funded; account balance: %d µALGO', accountInfo.balance.microAlgo)

  algorand.setSignerFromAccount(account)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const address = Address.fromString(account.addr.toString()) as any
  address.addr = account.addr
  address.sk = account.sk
  address.signer = algorand.account.getSigner(address)

  return address
}
