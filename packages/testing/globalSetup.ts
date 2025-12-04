/**
 * Vitest global setup factory for mock server lifecycle.
 * Set MOCK_ALGOD_URL / MOCK_INDEXER_URL / MOCK_KMD_URL to use an external server.
 */

import { config } from 'dotenv'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startMockServer, stopAllMockServers, type ClientType, type MockServer, MOCK_PORTS } from './mockServer'

const currentDir = resolve(fileURLToPath(import.meta.url), '..')
const projectRoot = resolve(currentDir, '..', '..')
config({ path: resolve(projectRoot, '.env') })

export function createGlobalSetup(clientType: ClientType) {
  let mockServer: MockServer | null = null

  return async function setup(): Promise<() => Promise<void>> {
    console.log(`[MockServer] Starting ${clientType} mock server...`)

    try {
      mockServer = await startMockServer(clientType)
      console.log(`[MockServer] ${clientType} server ready at ${mockServer.baseUrl}`)

      process.env[`MOCK_${clientType.toUpperCase()}_SERVER`] = mockServer.baseUrl
      process.env[`MOCK_${clientType.toUpperCase()}_PORT`] = String(MOCK_PORTS[clientType].host)

      return async () => {
        console.log(`[MockServer] Stopping ${clientType} mock server...`)
        if (mockServer) await mockServer.stop()
        await stopAllMockServers()
        console.log(`[MockServer] ${clientType} server stopped`)
      }
    } catch (error) {
      console.error(`[MockServer] Failed to start ${clientType} server:`, error)
      throw error
    }
  }
}

export const algodGlobalSetup = createGlobalSetup('algod')
export const indexerGlobalSetup = createGlobalSetup('indexer')
export const kmdGlobalSetup = createGlobalSetup('kmd')
