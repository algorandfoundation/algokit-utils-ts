import type { AlgoClientConfig } from '@algorandfoundation/algokit-utils/types/network-client'

/**
 * Default LocalNet algod server URL
 */
export const ALGOD_SERVER = 'http://localhost'

/**
 * Default LocalNet algod port
 */
export const ALGOD_PORT = 4001

/**
 * Default LocalNet algod token (64 character 'a' string)
 */
export const ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/**
 * Default LocalNet KMD server URL
 */
export const KMD_SERVER = 'http://localhost'

/**
 * Default LocalNet KMD port
 */
export const KMD_PORT = 4002

/**
 * Default LocalNet KMD token (64 character 'a' string)
 */
export const KMD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/**
 * Default LocalNet indexer server URL
 */
export const INDEXER_SERVER = 'http://localhost'

/**
 * Default LocalNet indexer port
 */
export const INDEXER_PORT = 8980

/**
 * Default LocalNet indexer token (64 character 'a' string)
 */
export const INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/**
 * Default LocalNet algod configuration
 */
export const ALGOD_CONFIG: AlgoClientConfig = {
  server: ALGOD_SERVER,
  port: ALGOD_PORT,
  token: ALGOD_TOKEN,
}

/**
 * Default LocalNet KMD configuration
 */
export const KMD_CONFIG: AlgoClientConfig = {
  server: KMD_SERVER,
  port: KMD_PORT,
  token: KMD_TOKEN,
}

/**
 * Default LocalNet indexer configuration
 */
export const INDEXER_CONFIG: AlgoClientConfig = {
  server: INDEXER_SERVER,
  port: INDEXER_PORT,
  token: INDEXER_TOKEN,
}
