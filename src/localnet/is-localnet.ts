import { AlgodClient } from '@algorandfoundation/algod-client'
import { ClientManager } from '../types/client-manager'

/** @deprecated Use `await algorand.client.isLocalNet()` or `await new ClientManager({ algod }).isLocalNet()` instead.
 *
 * Returns true if the algod client is pointing to a LocalNet Algorand network
 */
export async function isLocalNet(algod: AlgodClient): Promise<boolean> {
  return await new ClientManager({ algod }).isLocalNet()
}
