import { DispenserApiTestnetClient, DispenserApiTestnetClientParams } from './types/dispenser-client'

/**
 * Create a new DispenserApiTestnetClient instance.
 * Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.
 *
 * @param params An object containing parameters for the DispenserApiTestnetClient class.
 * Or null if you want the client to load the access token from the environment variable `ALGOKIT_DISPENSER_ACCESS_TOKEN`.
 * @example
 * const client = algokit.getDispenserApiTestnetClient(
 *     {
 *       authToken: 'your_auth_token',
 *       requestTimeout: 15,
 *     }
 * )
 *
 * @returns An instance of the DispenserApiTestnetClient class.
 */
export function getDispenserApiTestnetClient(params: DispenserApiTestnetClientParams | null = null) {
  return new DispenserApiTestnetClient(params)
}
