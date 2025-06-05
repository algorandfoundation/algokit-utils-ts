import algosdk from 'algosdk'
import { algorandFixture as defaultAlgorandFixture } from '../testing/fixtures/algorand-fixture'
import { AlgoHttpClientWithRetry } from '../types/algo-http-client-with-retry'
import { ClientManager } from '../types/client-manager'

export const algorandFixture = () => {
  const useAlgoSdk = process.env.USE_ALGOSDK === 'true'
  if (!useAlgoSdk) {
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
