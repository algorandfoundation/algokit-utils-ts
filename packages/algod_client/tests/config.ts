import type { ClientConfig } from '../src/core/client-config'

export const config: ClientConfig = {
  baseUrl: process.env.MOCK_ALGOD_SERVER || 'http://localhost:8000',
  apiToken: process.env.MOCK_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

const algodServer = process.env.ALGOD_SERVER || 'http://localhost'
const algodPort = process.env.ALGOD_PORT || '4001'
const algodBaseUrl = `${algodServer}:${algodPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: algodBaseUrl,
  apiToken: process.env.ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_ASSET_ID = 705457144
export const TEST_ROUND = 24099447
