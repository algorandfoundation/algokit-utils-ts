import * as algosdk from '@algorandfoundation/sdk'
import { AccountManager } from '../types/account-manager'
import { ClientManager } from '../types/client-manager'

import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/**
 * @deprecated Use `algorand.account.dispenserFromEnvironment()` or `new AccountManager(clientManager).dispenserFromEnvironment()` instead
 *
 * Returns an account (with private key loaded) that can act as a dispenser
 *
 * If running on LocalNet then it will return the default dispenser account automatically,
 *  otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC
 *
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables
 */
export async function getDispenserAccount(algod: Algodv2, kmd?: Kmd) {
  return new AccountManager(new ClientManager({ algod, kmd })).dispenserFromEnvironment()
}
