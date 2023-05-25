import algosdk, { Algodv2, Indexer, Kmd } from 'algosdk'
import type { TokenHeader } from 'algosdk/dist/types/client/urlTokenBaseHTTPClient'
import { AlgoHttpClientWithRetry } from './types/algo-http-client-with-retry'
import { AlgoClientConfig } from './types/network-client'

/** Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment not algod-side) */
export function getAlgodConfigFromEnvironment(): AlgoClientConfig {
  if (!process || !process.env) {
    throw new Error('Attempt to get default algod configuration from a non Node.js context; supply the config instead')
  }

  if (!process.env.ALGOD_SERVER) {
    throw new Error('Attempt to get default algod configuration without specifying ALGOD_SERVER in the environment variables')
  }

  return {
    server: process.env.ALGOD_SERVER,
    port: process.env.ALGOD_PORT,
    token: process.env.ALGOD_TOKEN,
  }
}

/** Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment not algod-side) */
export function getIndexerConfigFromEnvironment(): AlgoClientConfig {
  if (!process || !process.env) {
    throw new Error('Attempt to get default indexer configuration from a non Node.js context; supply the config instead')
  }

  if (!process.env.INDEXER_SERVER) {
    throw new Error('Attempt to get default indexer configuration without specifying INDEXER_SERVER in the environment variables')
  }

  return {
    server: process.env.INDEXER_SERVER,
    port: process.env.INDEXER_PORT,
    token: process.env.INDEXER_TOKEN,
  }
}

/** Returns the Algorand configuration to point to the AlgoNode service
 *
 * @param network Which network to connect to - TestNet or MainNet
 * @param config Which algod config to return - Algod or Indexer
 */
export function getAlgoNodeConfig(network: 'testnet' | 'mainnet', config: 'algod' | 'indexer'): AlgoClientConfig {
  return {
    server: `https://${network}-${config === 'algod' ? 'api' : 'idx'}.algonode.cloud/`,
    port: 443,
  }
}

/** Returns the Algorand configuration to point to the default LocalNet
 *
 * @param configOrPort Which algod config to return - algod, kmd, or indexer OR a port number
 */
export function getDefaultLocalNetConfig(configOrPort: 'algod' | 'indexer' | 'kmd' | number): AlgoClientConfig {
  return {
    server: `http://localhost`,
    port: configOrPort === 'algod' ? 4001 : configOrPort === 'indexer' ? 8980 : configOrPort === 'kmd' ? 4002 : configOrPort,
    token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  }
}

function getAlgoTokenHeader(server: string, token?: string | TokenHeader, defaultHeader?: string): TokenHeader {
  // Purestake uses a slightly different API key header than the default
  if (server.includes('purestake.io') && typeof token === 'string') return { 'X-API-Key': token }

  // Because we override the default HTTP Client construction (to get retries) we need to put a string token into the standard header ourselves
  return typeof token === 'string' ? { [defaultHeader ?? 'X-Algo-API-Token']: token } : token ?? {}
}

/** Returns an algod SDK client that automatically retries on idempotent calls
 *
 * @param config The config if you want to override the default (getting config from process.env)
 * @example Default (load from environment variables)
 *
 *  ```typescript
 *  // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
 *  // Automatically detects if you are using PureStake to switch in the right header name for ALGOD_TOKEN
 *  const algod = getAlgoClient()
 *  await algod.healthCheck().do()
 *  ```
 * @example AlgoNode (testnet)
 * ```typescript
 *  const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
 *  await algod.healthCheck().do()
 * ```
 * @example AlgoNode (mainnet)
 * ```typescript
 *  const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
 *  await algod.healthCheck().do()
 * ```
 * @example Custom (e.g. default LocalNet, although we recommend loading this into a .env and using the Default option instead)
 * ```typescript
 *  const algod = getAlgoClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 *  await algod.healthCheck().do()
 * ```
 */
export function getAlgoClient(config?: AlgoClientConfig): Algodv2 {
  const { token, server, port } = config ?? getAlgodConfigFromEnvironment()
  const httpClientWithRetry = new AlgoHttpClientWithRetry(getAlgoTokenHeader(server, token), server, port)
  return new algosdk.Algodv2(httpClientWithRetry, server)
}

/** Returns an indexer SDK client that automatically retries on idempotent calls
 *
 * @param config The config if you want to override the default (getting config from process.env)
 * @example Default (load from environment variables)
 *
 *  ```typescript
 *  // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 *  // Automatically detects if you are using PureStake to switch in the right header name for INDEXER_TOKEN
 *  const indexer = getAlgoIndexerClient()
 *  await indexer.makeHealthCheck().do()
 *  ```
 * @example AlgoNode (testnet)
 * ```typescript
 *  const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
 *  await indexer.makeHealthCheck().do()
 * ```
 * @example AlgoNode (mainnet)
 * ```typescript
 *  const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
 *  await indexer.makeHealthCheck().do()
 * ```
 * @example Custom (e.g. default LocalNet, although we recommend loading this into a .env and using the Default option instead)
 * ```typescript
 *  const indexer = getAlgoIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 *  await indexer.makeHealthCheck().do()
 * ```
 */
export function getAlgoIndexerClient(config?: AlgoClientConfig): Indexer {
  const { token, server, port } = config ?? getIndexerConfigFromEnvironment()
  const httpClientWithRetry = new AlgoHttpClientWithRetry(getAlgoTokenHeader(server, token, 'X-Indexer-API-Token'), server, port)
  return new Indexer(httpClientWithRetry)
}

/**
 * Returns a KMD SDK client that automatically retries on idempotent calls
 *
 * KMD client allows you to export private keys, which is useful to get the default account in a LocalNet network.
 *
 * @param config The config if you want to override the default (getting config from process.env)
 * @example Default (load from environment variables)
 *
 *  ```typescript
 *  // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 *  const kmd = getAlgoKmdClient()
 *  ```
 * @example Custom (e.g. default LocalNet, although we recommend loading this into a .env and using the Default option instead)
 * ```typescript
 *  const kmd = getAlgoKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 * ```
 */
export function getAlgoKmdClient(config?: AlgoClientConfig): Kmd {
  const { token, server } = config ?? getAlgodConfigFromEnvironment()
  // We can only use Kmd on the LocalNet otherwise it's not exposed so this makes some assumptions
  // (e.g. same token and server as algod and port 4002 by default)
  return new Kmd(token as string, server, process?.env?.KMD_PORT ?? '4002')
}

export { isLocalNet } from './localnet'
