/**
 * Vitest global setup factory for mock server lifecycle.
 * Set MOCK_ALGOD_URL / MOCK_INDEXER_URL / MOCK_KMD_URL to use an external server.
 */

import { config } from 'dotenv'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getMockServer, type ClientType, type MockServer } from './mockServer'

const currentDir = resolve(fileURLToPath(import.meta.url), '..')
const projectRoot = resolve(currentDir, '..', '..', '..')
config({ path: resolve(projectRoot, '.env') })

const debug = process.env.DEBUG_MOCK_SERVER === 'true'
const log = debug ? console.log.bind(console) : () => {}

export function createGlobalSetup(clientType: ClientType) {
  let mockServer: MockServer | null = null

  return async function setup(): Promise<() => Promise<void>> {
    log(`[MockServer] Connecting to ${clientType} mock server...`)

    try {
      mockServer = await getMockServer(clientType)
      log(`[MockServer] ${clientType} server ready at ${mockServer.baseUrl}`)

      return async () => {
        log(`[MockServer] Disconnecting from ${clientType} mock server...`)
        log(`[MockServer] ${clientType} server disconnected`)
      }
    } catch (error) {
      console.error(`[MockServer] Failed to connect to ${clientType} server:`, error)
      throw error
    }
  }
}

export const algodGlobalSetup = createGlobalSetup('algod')
export const indexerGlobalSetup = createGlobalSetup('indexer')
export const kmdGlobalSetup = createGlobalSetup('kmd')
