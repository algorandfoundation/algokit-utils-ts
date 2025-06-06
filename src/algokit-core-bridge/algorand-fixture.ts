import algosdk from 'algosdk'
import { algorandFixture as defaultAlgorandFixture } from '../testing/fixtures/algorand-fixture'
import { AlgoHttpClientWithRetry } from '../types/algo-http-client-with-retry'
import { ClientManager } from '../types/client-manager'

export const algorandFixture = () => {
  // If the flag USE_ALGOSDK_CLIENTS is not set
  // the test fixture is created with clients from env or local net
  // in this case, the tests will try to use AlgoKit core clients
  const useAlgoSdkClients = process.env.USE_ALGOSDK_CLIENTS === 'true'

  if (!useAlgoSdkClients) {
    return defaultAlgorandFixture()
  }

  const algoConfig = ClientManager.getConfigFromEnvironmentOrLocalNet()
  const { token, server, port } = algoConfig.algodConfig
  const tokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : (token ?? {})
  const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
  const algosdkAlgod = new algosdk.Algodv2(httpClientWithRetry, server)
  return defaultAlgorandFixture({
    algod: algosdkAlgod,
  })
}
