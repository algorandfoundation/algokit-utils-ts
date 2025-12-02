import type { ClientConfig } from '../src/core/client-config'

export const config: ClientConfig = {
  baseUrl: process.env.MOCK_ALGOD_SERVER || 'http://localhost',
  port: 8000,
  token: process.env.MOCK_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

export const TEST_ADDRESS = '25M5BT2DMMED3V6CWDEYKSNEFGPXX4QBIINCOICLXXRU3UGTSGRMF3MTOE'
export const TEST_APP_ID = 718348254
export const TEST_ASSET_ID = 705457144
export const TEST_ROUND = 24099447
