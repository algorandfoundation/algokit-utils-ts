import type { ClientConfig } from '../src/core/client-config'

export const config: ClientConfig = {
  baseUrl: process.env.MOCK_INDEXER_SERVER || 'http://localhost:8002',
  apiToken: process.env.MOCK_INDEXER_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

const indexerServer = process.env.INDEXER_SERVER || 'http://localhost'
const indexerPort = process.env.INDEXER_PORT || '8980'
const indexerBaseUrl = `${indexerServer}:${indexerPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: indexerBaseUrl,
  apiToken: process.env.INDEXER_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

// Test data constants - TestNet object mothers from Lora
export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_APP_ID_WITH_BOXES = 742949200 // xgov testnet
export const TEST_BOX_NAME = 'b64:cBbHBNV+zUy/Mz5IRhIrBLxr1on5wmidhXEavV+SasC8'
export const TEST_ASSET_ID = 705457144
export const TEST_TXID = 'VIXTUMAPT7NR4RB2WVOGMETW4QY43KIDA3HWDWWXS3UEDKGTEECQ'
export const TEST_ROUND = 24099447
