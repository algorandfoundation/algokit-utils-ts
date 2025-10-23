export type TokenHeader = string | { [key: string]: string }

/** Config for an Algorand SDK client. */
export interface AlgoClientConfig {
  /** Base URL of the server e.g. http://localhost, https://testnet-api.algonode.cloud/, etc. */
  server: string
  /** Optional port to use e.g. 4001, 443, etc. */
  port?: string | number
  /**  Optional token to use for API authentication */
  token?: TokenHeader
}

/** Configuration for algod, indexer and kmd clients. */
export interface AlgoConfig {
  /** Algod client configuration */
  algodConfig: AlgoClientConfig
  /** Indexer client configuration */
  indexerConfig?: AlgoClientConfig
  /** Kmd client configuration */
  kmdConfig?: AlgoClientConfig
}

/**
 * Returns true if the given network genesisId is associated with a LocalNet network.
 * @param genesisId The network genesis ID
 * @returns Whether the given genesis ID is associated with a LocalNet network
 */
export function genesisIdIsLocalNet(genesisId: string) {
  return genesisId === 'devnet-v1' || genesisId === 'sandnet-v1' || genesisId === 'dockernet-v1'
}
