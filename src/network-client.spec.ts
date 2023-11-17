import { describe, expect, test } from '@jest/globals'
import { envResetFixture } from '../tests/fixtures/env-fixture'
import * as algokit from './'

// Don't spam algonode all the time, remove the `skip` to run these manually
describe.skip('network-clients', () => {
  envResetFixture()

  describe('Retry', () => {
    test('Retries indexer calls', async () => {
      const indexer = await algokit.getAlgoIndexerClient(algokit.getAlgoNodeConfig('testnet', 'indexer'))

      await Promise.all(
        new Array(70).fill(0).map(async (_) => {
          await indexer.lookupAccountByID('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA').do()
        }),
      )
    })
    test('Retries algod calls', async () => {
      const algod = await algokit.getAlgoClient(algokit.getAlgoNodeConfig('testnet', 'algod'))

      await Promise.all(
        new Array(150).fill(0).map(async (_) => {
          await algod.accountInformation('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA').do()
        }),
      )
    })
  })

  describe('Config', () => {
    test('Gets algod config from environment', () => {
      process.env.ALGOD_SERVER = 'http://localhost'
      process.env.ALGOD_PORT = '4001'
      process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = algokit.getAlgodConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('4001')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Throws error when getting algod config when no environment defined', () => {
      process.env.ALGOD_SERVER = undefined
      process.env.ALGOD_PORT = undefined
      process.env.ALGOD_TOKEN = undefined
      expect(() => algokit.getAlgodConfigFromEnvironment()).toThrowError(
        'Attempt to get default algod configuration without specifying ALGOD_SERVER in the environment variables',
      )
    })

    test('Gets indexer config from environment', () => {
      process.env.INDEXER_SERVER = 'http://localhost'
      process.env.INDEXER_PORT = '8980'
      process.env.INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = algokit.getIndexerConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('8980')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Gets AlgoNode config for MainNet algod', () => {
      const config = algokit.getAlgoNodeConfig('mainnet', 'algod')
      expect(config.server).toBe('https://mainnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet algod', () => {
      const config = algokit.getAlgoNodeConfig('testnet', 'algod')
      expect(config.server).toBe('https://testnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for MainNet indexer', () => {
      const config = algokit.getAlgoNodeConfig('mainnet', 'indexer')
      expect(config.server).toBe('https://mainnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet indexer', () => {
      const config = algokit.getAlgoNodeConfig('testnet', 'indexer')
      expect(config.server).toBe('https://testnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Throws error when getting indexer config when no environment defined', () => {
      process.env.INDEXER_SERVER = undefined
      process.env.INDEXER_PORT = undefined
      process.env.INDEXER_TOKEN = undefined
      expect(() => algokit.getIndexerConfigFromEnvironment()).toThrowError(
        'Attempt to get default indexer configuration without specifying INDEXER_SERVER in the environment variables',
      )
    })

    test('Get working LocalNet algod client', async () => {
      const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))
      await algod.status().do()
    })

    test('Get working LocalNet indexer client', async () => {
      const indexer = algokit.getAlgoIndexerClient(algokit.getDefaultLocalNetConfig('algod'))
      await indexer.makeHealthCheck().do()
    })

    test('Get working LocalNet kmd client', async () => {
      const kmd = algokit.getAlgoKmdClient(algokit.getDefaultLocalNetConfig('algod'))
      await kmd.listWallets()
    })

    test('Get working MainNet algod client', async () => {
      const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('mainnet', 'algod'))
      await algod.status().do()
    })

    test('Get working MainNet indexer client', async () => {
      const indexer = algokit.getAlgoIndexerClient(algokit.getAlgoNodeConfig('mainnet', 'indexer'))
      await indexer.makeHealthCheck().do()
    })

    test('Determine LocalNet algod client is LocalNet', async () => {
      const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))
      const localNet = await algokit.isLocalNet(algod)
      expect(localNet).toBe(true)
    })

    test('Determine TestNet algod client is not LocalNet', async () => {
      const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('testnet', 'algod'))
      const localNet = await algokit.isLocalNet(algod)
      expect(localNet).toBe(false)
    })

    test('Determine MainNet algod client is not LocalNet', async () => {
      const algod = algokit.getAlgoClient(algokit.getAlgoNodeConfig('mainnet', 'algod'))
      const localNet = await algokit.isLocalNet(algod)
      expect(localNet).toBe(false)
    })
  })
})
