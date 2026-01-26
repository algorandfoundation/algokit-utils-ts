import type { AlgoClientConfig } from '@algorandfoundation/algokit-utils/types/network-client'

/**
 * Default LocalNet algod configuration
 */
export const ALGOD_CONFIG: AlgoClientConfig = {
  server: 'http://localhost',
  port: 4001,
  token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

/**
 * Default LocalNet KMD configuration
 */
export const KMD_CONFIG: AlgoClientConfig = {
  server: 'http://localhost',
  port: 4002,
  token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}
