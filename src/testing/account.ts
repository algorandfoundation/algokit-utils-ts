import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Address } from '@algorandfoundation/algokit-common'
import {
  AddressWithSigners,
  AddressWithTransactionSigner,
} from '@algorandfoundation/algokit-transact'
import { KmdClient } from '@algorandfoundation/algokit-kmd-client'
import { AlgorandClient, Config } from '../'
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
  kmd?: KmdClient,
): Promise<Address & AddressWithTransactionSigner>
/**
 * Creates an ephemeral Algorand account for the purposes of testing.
 * Returns a newly created random test account that is funded from the dispenser
 * DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
 * Note: By default this will log the mnemonic of the account.
 * @param params The config for the test account to generate
 * @param algorand An AlgorandClient client
 * @returns The account, with private key loaded
 */
export async function getTestAccount(params: GetTestAccountParams, algorand: AlgorandClient): Promise<Address & AddressWithSigners>
export async function getTestAccount(
  { suppressLog, initialFunds, accountGetter }: GetTestAccountParams,
  algodOrAlgorandClient: AlgodClient | AlgorandClient,
  kmd?: KmdClient,
): Promise<Address & AddressWithSigners> {
  const algorand =
    algodOrAlgorandClient instanceof AlgorandClient
      ? algodOrAlgorandClient
      : AlgorandClient.fromClients({
          algod: algodOrAlgorandClient,
          kmd,
        })

  const account = accountGetter ? await accountGetter(algorand) : algorand.account.random()

  Config.getLogger(suppressLog).info(`New test account created with address '${account.addr}'.`)

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

  const address = Address.fromString(account.addr.toString()) as Address & AddressWithSigners
  for (const key of Object.keys(account as AddressWithSigners)) {
    if (!(key in address)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(address as any)[key] = (account as any)[key]
    }
  }

  return address
}
