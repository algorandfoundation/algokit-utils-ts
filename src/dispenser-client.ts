import { TestNetDispenserApiClient, TestNetDispenserApiClientParams } from './types/dispenser-client'

/**
 * @deprecated Use `clientManager.getTestNetDispenser` or `clientManager.getTestNetDispenserFromEnvironment` instead
 *
 * Create a new TestNetDispenserApiClient instance.
 * Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.
 *
 * @param params An object containing parameters for the TestNetDispenserApiClient class.
 * Or null if you want the client to load the access token from the environment variable `ALGOKIT_DISPENSER_ACCESS_TOKEN`.
 * @example
 * const client = algokit.getTestNetDispenserApiClient(
 *     {
 *       authToken: 'your_auth_token',
 *       requestTimeout: 15,
 *     }
 * )
 *
 * @returns An instance of the TestNetDispenserApiClient class.
 */
export function getTestNetDispenserApiClient(params: TestNetDispenserApiClientParams | null = null) {
  return new TestNetDispenserApiClient(params === null ? undefined : params)
}
