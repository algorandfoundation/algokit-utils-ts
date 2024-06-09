import algosdk from 'algosdk'
import { ClientManager } from '../types/client-manager'
import Algodv2 = algosdk.Algodv2

/** @deprecated Use `await algorandClient.client.isLocalNet()` or `await new ClientManager({ algod }).isLocalNet()` instead.
 *
 * Returns true if the algod client is pointing to a LocalNet Algorand network
 */
export async function isLocalNet(algod: Algodv2): Promise<boolean> {
  return await new ClientManager({ algod }).isLocalNet()
}
