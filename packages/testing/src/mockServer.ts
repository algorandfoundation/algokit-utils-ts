/**
 * Mock server infrastructure for algod/indexer/kmd client testing.
 *
 * Connects to externally managed mock servers that replay pre-recorded HAR files.
 * The mock server must be started separately (via GitHub Action in CI, or manually via bun for local dev).
 *
 * Set MOCK_ALGOD_URL / MOCK_INDEXER_URL / MOCK_KMD_URL environment variables to specify server URLs.
 */

/** Supported client types for mock servers */
export type ClientType = 'algod' | 'indexer' | 'kmd'

/** Environment variable names for external mock server URLs */
export const EXTERNAL_URL_ENV_VARS: Record<ClientType, string> = {
  algod: 'MOCK_ALGOD_URL',
  indexer: 'MOCK_INDEXER_URL',
  kmd: 'MOCK_KMD_URL',
}

/** Default token used for mock server authentication */
export const DEFAULT_TOKEN = 'a'.repeat(64)

/** Default ports for mock servers when running locally (matches algokit-polytest defaults) */
export const MOCK_PORTS = {
  algod: { host: 8000 },
  indexer: { host: 8002 },
  kmd: { host: 8001 },
} as const

/** Mock server instance representing a connection to an external server */
export interface MockServer {
  /** Base URL of the mock server */
  baseUrl: string
  /** Type of client this server mocks */
  clientType: ClientType
}

/**
 * Check if a server is reachable by performing a health check.
 *
 * @param url - The base URL of the server to check
 * @param timeout - Maximum time to wait for the server to respond (default: 5000ms)
 * @returns Promise resolving to true if server is healthy, false otherwise
 */
export async function checkServerHealth(url: string, timeout = 5000): Promise<boolean> {
  const healthUrl = `${url.replace(/\/$/, '')}/health`
  const start = Date.now()

  while (Date.now() - start < timeout) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      try {
        await fetch(healthUrl, { signal: controller.signal })
        clearTimeout(timeoutId)
        // Any HTTP response (including 500) indicates the server is reachable
        // The mock server returns 500 for unrecorded endpoints like /health
        return true
      } catch (error) {
        clearTimeout(timeoutId)
        // If it's a network error, retry
        if (error instanceof Error && error.name === 'AbortError') {
          await new Promise((resolve) => setTimeout(resolve, 200))
          continue
        }
        throw error
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  return false
}

/**
 * Get a mock server instance for the specified client type.
 *
 * Reads the appropriate environment variable (MOCK_ALGOD_URL, MOCK_INDEXER_URL, or MOCK_KMD_URL)
 * and validates that the server is reachable before returning a MockServer instance.
 *
 * @param clientType - The type of client to get a mock server for ('algod', 'indexer', or 'kmd')
 * @returns Promise resolving to a MockServer instance
 * @throws Error if the environment variable is not set or the server is not reachable
 *
 * @example
 * ```typescript
 * const server = await getMockServer('algod')
 * const client = new AlgodClient(DEFAULT_TOKEN, server.baseUrl)
 * // ... run tests ...
 * ```
 */
export async function getMockServer(clientType: ClientType): Promise<MockServer> {
  const envVar = EXTERNAL_URL_ENV_VARS[clientType]
  const externalUrl = process.env[envVar]

  if (!externalUrl) {
    throw new Error(
      `Environment variable ${envVar} is not set. ` +
        `Please start the mock server externally and set the URL. ` +
        `See the "Mock Server for Client Tests" section in README.md for local development setup.`,
    )
  }

  const isHealthy = await checkServerHealth(externalUrl)
  if (!isHealthy) {
    throw new Error(
      `Mock ${clientType} server at ${externalUrl} is not reachable. ` + `Please ensure the server is running and accessible.`,
    )
  }

  return {
    baseUrl: externalUrl.replace(/\/$/, ''),
    clientType,
  }
}

// Test data constants matching mock server recordings
export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_APP_ID_WITH_BOXES = 742949200
export const TEST_BOX_NAME = 'b64:cBbHBNV+zUy/Mz5IRhIrBLxr1on5wmidhXEavV+SasC8'
export const TEST_ASSET_ID = 705457144
export const TEST_TXID = 'VIXTUMAPT7NR4RB2WVOGMETW4QY43KIDA3HWDWWXS3UEDKGTEECQ'
export const TEST_ROUND = 24099447

// Separate constants for transaction proof endpoint (uses different round/txid in HAR file)
export const TEST_TXID_PROOF = '7KOOPZMUTVFHZ2PKXBGSOR6KZUYJA7P5QY257XNJZLR4NQ7IOW7A'
export const TEST_ROUND_PROOF = 57624474
