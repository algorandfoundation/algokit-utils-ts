/**
 * Mock server infrastructure for algod/indexer/kmd client testing.
 *
 * Uses Docker-based mock servers that replay pre-recorded HAR files.
 * Set MOCK_ALGOD_URL / MOCK_INDEXER_URL / MOCK_KMD_URL to use an external server.
 */

import { execSync } from 'node:child_process'
import { createConnection } from 'node:net'

export type ClientType = 'algod' | 'indexer' | 'kmd'

export const MOCK_PORTS: Record<ClientType, { host: number; container: number }> = {
  algod: { host: 18000, container: 8000 },
  indexer: { host: 18002, container: 8002 },
  kmd: { host: 18001, container: 8001 },
}

export const EXTERNAL_URL_ENV_VARS: Record<ClientType, string> = {
  algod: 'MOCK_ALGOD_URL',
  indexer: 'MOCK_INDEXER_URL',
  kmd: 'MOCK_KMD_URL',
}

export const DEFAULT_TOKEN = 'a'.repeat(64)
export const CONTAINER_PREFIX = 'algokit_utils_ts_mock'
export const MOCK_SERVER_IMAGE = 'ghcr.io/aorumbayev/polytest-mock-server:latest'

const startedContainers = new Set<string>()

export interface MockServer {
  containerId: string
  name: string
  clientType: ClientType
  port: number
  isOwner: boolean
  baseUrl: string
  stop: () => Promise<void>
}

async function waitForPort(port: number, timeout = 30000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = createConnection({ host: '127.0.0.1', port }, () => {
          socket.destroy()
          resolve()
        })
        socket.on('error', reject)
        socket.setTimeout(1000, () => {
          socket.destroy()
          reject(new Error('timeout'))
        })
      })
      return true
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  return false
}

async function waitForHealth(port: number, timeout = 30000): Promise<boolean> {
  const start = Date.now()
  const url = `http://127.0.0.1:${port}/health`

  while (Date.now() - start < timeout) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      try {
        await fetch(url, { method: 'GET', signal: controller.signal })
        clearTimeout(timeoutId)
        return true
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  return false
}

function getContainerId(name: string): string | null {
  try {
    const result = execSync(`docker ps -q -f "name=^${name}$"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return result.trim() || null
  } catch {
    return null
  }
}

function getExternalServerUrl(clientType: ClientType): string | undefined {
  return process.env[EXTERNAL_URL_ENV_VARS[clientType]]
}

async function checkExternalServer(url: string, timeout = 5000): Promise<{ isHealthy: boolean; port: number }> {
  const parsedUrl = new URL(url)
  const port = parsedUrl.port ? parseInt(parsedUrl.port) : 80
  const healthUrl = `${url.replace(/\/$/, '')}/health`

  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      try {
        await fetch(healthUrl, { method: 'GET', signal: controller.signal })
        clearTimeout(timeoutId)
        return { isHealthy: true, port }
      } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof TypeError && error.message.includes('fetch')) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          continue
        }
        return { isHealthy: true, port }
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  return { isHealthy: false, port }
}

function createMockServer(containerId: string, name: string, clientType: ClientType, port: number, isOwner: boolean): MockServer {
  return {
    containerId,
    name,
    clientType,
    port,
    isOwner,
    baseUrl: `http://127.0.0.1:${port}`,
    stop: async () => {
      if (!isOwner) return
      if (startedContainers.has(name)) {
        try {
          execSync(`docker rm -f ${containerId}`, { stdio: 'pipe' })
        } catch {
          // Ignore cleanup errors
        }
        startedContainers.delete(name)
      }
    },
  }
}

/**
 * Start or connect to a mock server.
 * Priority: external URL > existing container > new container
 */
export async function startMockServer(clientType: ClientType): Promise<MockServer> {
  const externalUrl = getExternalServerUrl(clientType)
  if (externalUrl) {
    const { isHealthy, port } = await checkExternalServer(externalUrl)
    if (isHealthy) {
      return createMockServer('external', 'external', clientType, port, false)
    }
    throw new Error(`${EXTERNAL_URL_ENV_VARS[clientType]}=${externalUrl} set but server not responding`)
  }

  const { host: hostPort, container: containerPort } = MOCK_PORTS[clientType]
  const containerName = `${CONTAINER_PREFIX}_${clientType}`

  const existingId = getContainerId(containerName)
  if (existingId) {
    const isReady = await waitForPort(hostPort)
    if (!isReady) {
      throw new Error(`Existing ${clientType} server not responding on port ${hostPort}`)
    }
    return createMockServer(existingId, containerName, clientType, hostPort, false)
  }

  try {
    execSync(`docker rm -f ${containerName}`, { stdio: 'pipe' })
  } catch {
    // Container doesn't exist
  }

  const cmd = [
    'docker run -d',
    `--name ${containerName}`,
    `-p ${hostPort}:${containerPort}`,
    `-e ${clientType.toUpperCase()}_PORT=${containerPort}`,
    MOCK_SERVER_IMAGE,
    clientType,
  ].join(' ')

  let containerId: string
  try {
    containerId = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch (error) {
    throw new Error(`Failed to start ${clientType} mock server: ${error instanceof Error ? error.message : error}`)
  }

  startedContainers.add(containerName)

  const portReady = await waitForPort(hostPort)
  if (!portReady) {
    try {
      execSync(`docker rm -f ${containerId}`, { stdio: 'pipe' })
    } catch {
      // Ignore
    }
    startedContainers.delete(containerName)
    throw new Error(`${clientType} mock server failed to start`)
  }

  const healthReady = await waitForHealth(hostPort, 30000)
  if (!healthReady) {
    try {
      execSync(`docker rm -f ${containerId}`, { stdio: 'pipe' })
    } catch {
      // Ignore
    }
    startedContainers.delete(containerName)
    throw new Error(`${clientType} mock server health check failed`)
  }

  return createMockServer(containerId, containerName, clientType, hostPort, true)
}

export async function stopAllMockServers(): Promise<void> {
  for (const name of startedContainers) {
    try {
      execSync(`docker rm -f ${name}`, { stdio: 'pipe' })
    } catch {
      // Ignore
    }
  }
  startedContainers.clear()
}

export function getStartedContainers(): string[] {
  return Array.from(startedContainers)
}

// Test data constants matching mock server recordings
export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_APP_ID_WITH_BOXES = 742949200
export const TEST_BOX_NAME = 'b64:cBbHBNV+zUy/Mz5IRhIrBLxr1on5wmidhXEavV+SasC8'
export const TEST_ASSET_ID = 705457144
export const TEST_TXID = 'VIXTUMAPT7NR4RB2WVOGMETW4QY43KIDA3HWDWWXS3UEDKGTEECQ'
export const TEST_ROUND = 24099447
