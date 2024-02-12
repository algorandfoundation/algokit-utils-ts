import algosdk from 'algosdk'
import { getLocalNetDispenserAccount } from '../localnet/get-localnet-dispenser-account'
import { isLocalNet } from '../localnet/is-localnet'
import { DISPENSER_ACCOUNT } from '../types/account'
import { getAccount } from './get-account'

import Algodv2 = algosdk.Algodv2
import Kmd = algosdk.Kmd

/** Returns an account (with private key loaded) that can act as a dispenser
 *
 * If running on LocalNet then it will return the default dispenser account automatically,
 *  otherwise it will load the account mnemonic stored in process.env.DISPENSER_MNEMONIC
 *
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables
 */
export async function getDispenserAccount(algod: Algodv2, kmd?: Kmd) {
  // If we are running against LocalNet we can use the default account within it, otherwise use an automation account specified via environment variables and ensure it's populated with ALGOs
  const canFundFromDefaultAccount = await isLocalNet(algod)
  return canFundFromDefaultAccount ? await getLocalNetDispenserAccount(algod, kmd) : await getAccount(DISPENSER_ACCOUNT, algod)
}
