import { mnemonicToSecretKey } from '@algorandfoundation/sdk'
import { AlgorandClient } from '../../../src/types/algorand-client'
import { AlgoAmount } from '../../../src/types/amount'
import type { AlgodClient } from '../src/client'
import type { ClientConfig } from '../src/core/client-config'

export const config: ClientConfig = {
  baseUrl: process.env.MOCK_ALGOD_SERVER || 'http://localhost:8000',
  apiToken: process.env.MOCK_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

const algodServer = process.env.ALGOD_SERVER || 'http://localhost'
const algodPort = process.env.ALGOD_PORT || '4001'
const algodBaseUrl = `${algodServer}:${algodPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: algodBaseUrl,
  apiToken: process.env.ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_APP_ID_BOXES = 742949200 // xgov
export const TEST_APP_ID_BOX_NAME = 'cBbHBNV+zUy/Mz5IRhIrBLxr1on5wmidhXEavV+SasC8'
export const TEST_ASSET_ID = 705457144
export const TEST_ROUND = 24099447

export const ACCOUNT_A_MNEMONIC =
  'auction inquiry lava second expand liberty glass involve ginger illness length room item discover ahead table doctor term tackle cement bonus profit right above catch'

export async function getAccount(client: AlgodClient, mnemonic: string) {
  const account = mnemonicToSecretKey(mnemonic)

  // Check if funded
  const accountInfo = await client.accountInformation(account.addr.toString())

  // Fund if needed
  if (accountInfo.amount < AlgoAmount.Algos(10).microAlgo) {
    const algorand = AlgorandClient.fromClients({ algod: client })
    const dispenser = await algorand.account.dispenserFromEnvironment()

    await algorand.send.payment({
      sender: dispenser,
      receiver: account.addr.toString(),
      amount: AlgoAmount.Algos(10),
      suppressLog: true,
    })
  }

  return account
}
