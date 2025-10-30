import * as algosdk from '@algorandfoundation/sdk'
import { AlgodClient } from '@algorandfoundation/algod-client'
import { AccountManager } from '../types/account-manager'
import { ClientManager } from '../types/client-manager'
import type { Account } from '@algorandfoundation/sdk'
import Kmd = algosdk.Kmd
/**
 * @deprecated Use `algorand.account.kmd.getLocalNetDispenserAccount()` instead.
 *
 * Returns an Algorand account with private key loaded for the default LocalNet dispenser account (that can be used to fund other accounts)
 *
 * @param algod An algod client
 * @param kmd A KMD client, if not specified then a default KMD client will be loaded from environment variables
 */
export async function getLocalNetDispenserAccount(algod: AlgodClient, kmd?: Kmd): Promise<Account> {
  return (await new AccountManager(new ClientManager({ algod, kmd })).kmd.getLocalNetDispenserAccount()).account
}
