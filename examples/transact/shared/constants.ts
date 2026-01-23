/**
 * LocalNet configuration constants for Algorand development
 */

/** Default LocalNet algod server URL */
export const ALGOD_SERVER = 'http://localhost'

/** Default LocalNet algod port */
export const ALGOD_PORT = 4001

/** Default LocalNet algod token (64 character 'a' string) */
export const ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/** Default LocalNet KMD server URL */
export const KMD_SERVER = 'http://localhost'

/** Default LocalNet KMD port */
export const KMD_PORT = 4002

/** Default LocalNet KMD token (64 character 'a' string) */
export const KMD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/** Default LocalNet indexer server URL */
export const INDEXER_SERVER = 'http://localhost'

/** Default LocalNet indexer port */
export const INDEXER_PORT = 8980

/** Default LocalNet indexer token (64 character 'a' string) */
export const INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

/** Algod client configuration for LocalNet */
export const ALGOD_CONFIG = {
  server: ALGOD_SERVER,
  port: ALGOD_PORT,
  token: ALGOD_TOKEN,
}

/** KMD client configuration for LocalNet */
export const KMD_CONFIG = {
  server: KMD_SERVER,
  port: KMD_PORT,
  token: KMD_TOKEN,
}

/** Indexer client configuration for LocalNet */
export const INDEXER_CONFIG = {
  server: INDEXER_SERVER,
  port: INDEXER_PORT,
  token: INDEXER_TOKEN,
}
