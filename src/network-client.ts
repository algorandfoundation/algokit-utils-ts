import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Indexer, Kmd } from '@algorandfoundation/sdk'
import { ClientManager } from './types/client-manager'
import { AlgoClientConfig, AlgoConfig } from './types/network-client'

/**
 * @deprecated Use `ClientManager.getConfigFromEnvironmentOrLocalNet()` instead.
 *
 * Retrieve configurations from environment variables when defined or get defaults (expects to be called from a Node.js environment not algod-side)
 */
export function getConfigFromEnvOrDefaults(): AlgoConfig {
  return ClientManager.getConfigFromEnvironmentOrLocalNet()
}

/**
 * @deprecated Use `ClientManager.getAlgodConfigFromEnvironment()` instead.
 *
 * Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment not algod-side)
 */
export function getAlgodConfigFromEnvironment(): AlgoClientConfig {
  return ClientManager.getAlgodConfigFromEnvironment()
}

/**
 * @deprecated Use `ClientManager.getIndexerConfigFromEnvironment()` instead.
 *
 * Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment not algod-side)
 */
export function getIndexerConfigFromEnvironment(): AlgoClientConfig {
  return ClientManager.getIndexerConfigFromEnvironment()
}

/**
 * @deprecated Use `ClientManager.getAlgoNodeConfig(network, config)` instead.
 *
 * Returns the Algorand configuration to point to the AlgoNode service
 *
 * @param network Which network to connect to - TestNet or MainNet
 * @param config Which algod config to return - Algod or Indexer
 */
export function getAlgoNodeConfig(network: 'testnet' | 'mainnet', config: 'algod' | 'indexer'): AlgoClientConfig {
  return ClientManager.getAlgoNodeConfig(network, config)
}

/**
 * @deprecated Use `ClientManager.getDefaultLocalNetConfig(configOrPort)` instead.
 *
 * Returns the Algorand configuration to point to the default LocalNet
 *
 * @param configOrPort Which algod config to return - algod, kmd, or indexer OR a port number
 */
export function getDefaultLocalNetConfig(configOrPort: 'algod' | 'indexer' | 'kmd' | number): AlgoClientConfig {
  return ClientManager.getDefaultLocalNetConfig(configOrPort)
}

/**
 * @deprecated Use `ClientManager.getAlgodClient(config)` or `ClientManager.getAlgodClientFromEnvironment()` instead.
 *
 * Returns an algod SDK client that automatically retries transient failures on idempotent calls
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
export function getAlgoClient(config?: AlgoClientConfig): AlgodClient {
  return config ? ClientManager.getAlgodClient(config) : ClientManager.getAlgodClientFromEnvironment()
}

/**
 * @deprecated Use `ClientManager.getIndexerClient(config, overrideIntDecoding)` or `ClientManager.getIndexerClientFromEnvironment(overrideIntDecoding)` instead.
 *
 * Returns an indexer SDK client that automatically retries transient failures on idempotent calls
 *
 * @param config The config if you want to override the default (getting config from process.env)
 * @example Default (load from environment variables)
 *
 *  ```typescript
 *  // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
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
  return config ? ClientManager.getIndexerClient(config) : ClientManager.getIndexerClientFromEnvironment()
}

/**
 * @deprecated Use `ClientManager.getKmdClient(config)` or `ClientManager.getKmdClientFromEnvironment()` instead.
 *
 * Returns a KMD SDK client that automatically retries transient failures on idempotent calls.
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
  return config ? ClientManager.getKmdClient(config) : ClientManager.getKmdClientFromEnvironment()
}

/** @deprecated Use `await algorand.client.isTestNet()` or `await new ClientManager({ algod }).isTestNet()` instead. */
export async function isTestNet(algod: AlgodClient): Promise<boolean> {
  return await new ClientManager({ algod }).isTestNet()
}

/** @deprecated Use `await algorand.client.isMainNet()` or `await new ClientManager({ algod }).isMainNet()` instead. */
export async function isMainNet(algod: AlgodClient): Promise<boolean> {
  return await new ClientManager({ algod }).isMainNet()
}
