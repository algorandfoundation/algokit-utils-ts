import type { ClientConfig } from '../src/core/client-config'

export const config: ClientConfig = {
  baseUrl: process.env.MOCK_ALGOD_SERVER || 'http://localhost:8000',
  apiToken: process.env.MOCK_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}