import { randomBytes } from 'node:crypto'
import { KmdClient, type ClientConfig } from '@algorandfoundation/kmd-client'

export interface KmdTestConfig {
  kmdBaseUrl: string
  kmdApiToken?: string
  walletPassword: string
}

export function getKmdEnv(): KmdTestConfig {
  return {
    kmdBaseUrl: process.env.KMD_BASE_URL ?? 'http://localhost:4002',
    kmdApiToken: process.env.KMD_API_TOKEN ?? 'a'.repeat(64),
    walletPassword: process.env.KMD_WALLET_PASSWORD ?? 'testpass',
  }
}

export function createKmdClient(config: KmdTestConfig): KmdClient {
  const url = new URL(config.kmdBaseUrl)
  const baseUrl = `${url.protocol}//${url.host}`
  return new KmdClient({
    baseUrl,
    apiToken: config.kmdApiToken,
  } satisfies ClientConfig)
}

export function randomWalletName(prefix = 'test_wallet'): string {
  const suffix = randomBytes(6).toString('hex')
  return `${prefix}_${suffix}`
}
