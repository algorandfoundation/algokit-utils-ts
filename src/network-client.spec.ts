import { describe, expect, test } from '@jest/globals'
import { envResetFixture } from '../tests/fixtures/env-fixture'
import {
  getAlgoClient,
  getAlgodConfigFromEnvironment,
  getAlgoIndexerClient,
  getAlgoKmdClient,
  getAlgoNodeConfig,
  getDefaultLocalNetConfig,
  getIndexerConfigFromEnvironment,
  isLocalNet,
} from './network-client'

describe('network-clients', () => {
  envResetFixture()

  describe('Config', () => {
    test('Gets algod config from environment', () => {
      process.env.ALGOD_SERVER = 'http://localhost'
      process.env.ALGOD_PORT = '4001'
      process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = getAlgodConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('4001')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Throws error when getting algod config when no environment defined', () => {
      expect(() => getAlgodConfigFromEnvironment()).toThrowError(
        'Attempt to get default algod configuration without specifying ALGOD_SERVER in the environment variables',
      )
    })

    test('Gets indexer config from environment', () => {
      process.env.INDEXER_SERVER = 'http://localhost'
      process.env.INDEXER_PORT = '8980'
      process.env.INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = getIndexerConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('8980')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Gets AlgoNode config for MainNet algod', () => {
      const config = getAlgoNodeConfig('mainnet', 'algod')
      expect(config.server).toBe('https://mainnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet algod', () => {
      const config = getAlgoNodeConfig('testnet', 'algod')
      expect(config.server).toBe('https://testnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for MainNet indexer', () => {
      const config = getAlgoNodeConfig('mainnet', 'indexer')
      expect(config.server).toBe('https://mainnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet indexer', () => {
      const config = getAlgoNodeConfig('testnet', 'indexer')
      expect(config.server).toBe('https://testnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Throws error when getting indexer config when no environment defined', () => {
      expect(() => getIndexerConfigFromEnvironment()).toThrowError(
        'Attempt to get default indexer configuration without specifying INDEXER_SERVER in the environment variables',
      )
    })

    test('Get working LocalNet algod client', async () => {
      const algod = getAlgoClient(getDefaultLocalNetConfig('algod'))
      await algod.status().do()
    })

    test('Get working LocalNet indexer client', async () => {
      const indexer = getAlgoIndexerClient(getDefaultLocalNetConfig('algod'))
      await indexer.makeHealthCheck().do()
    })

    test('Get working LocalNet kmd client', async () => {
      const kmd = getAlgoKmdClient(getDefaultLocalNetConfig('algod'))
      await kmd.listWallets()
    })

    test('Get working MainNet algod client', async () => {
      const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
      await algod.status().do()
    })

    test('Get working MainNet indexer client', async () => {
      const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
      await indexer.makeHealthCheck().do()
    })

    test('Determine LocalNet algod client is LocalNet', async () => {
      const algod = getAlgoClient(getDefaultLocalNetConfig('algod'))
      const localNet = await isLocalNet(algod)
      expect(localNet).toBe(true)
    })

    test('Determine TestNet algod client is not LocalNet', async () => {
      const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
      const localNet = await isLocalNet(algod)
      expect(localNet).toBe(false)
    })

    test('Determine MainNet algod client is not LocalNet', async () => {
      const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
      const localNet = await isLocalNet(algod)
      expect(localNet).toBe(false)
    })
  })
})