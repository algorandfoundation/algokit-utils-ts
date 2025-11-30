import { afterEach, describe, expect, test, vitest } from 'vitest'
import { Config } from '..'
import { envResetFixture } from '../../tests/fixtures/env-fixture'
import { ClientManager } from './client-manager'

describe('ClientManager', () => {
  envResetFixture()

  // Don't spam algonode all the time, remove the `skip` to run these manually
  describe.skip('Retry', () => {
    /*
	    *https://nodely.io/api/*
	    The API requests are rate limited per source IP address with request shaping.
	    A burst of 90 rps is allowed and all responses are delayed artificially to make sure that (if called sequentially) they will not exceed the quota.
	    Queries exceeding the 90rps in burst or sustained 60rps will get HTTP 429 error.
	    */
    // Create a mock logger to track the number of retries
    const myLogger = {
      error: vitest.fn(),
      warn: vitest.fn(),
      info: vitest.fn(),
      debug: vitest.fn(),
      verbose: vitest.fn(),
    }
    Config.configure({ logger: myLogger })
    afterEach(() => {
      vitest.clearAllMocks()
    })
    test('Retries indexer calls', async () => {
      const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('testnet', 'indexer'))

      const response = await Promise.all(
        new Array(150).fill(0).map(async (_) => {
          return await indexer.lookupAccountById('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA')
        }),
      )
      expect(response.length).toBe(150)
      expect(myLogger.warn).toHaveBeenCalledWith(
        'algosdk request failed 1 times. Retrying in 0ms: URLTokenBaseHTTPError: Network request error. Received status 429 (Too Many Requests)',
      )
    }, 10_000)
    test('Retries algod calls', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))

      const response = await Promise.all(
        new Array(150).fill(0).map(async (_) => {
          return await algod.accountInformation('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA')
        }),
      )
      expect(response.length).toBe(150)
      expect(myLogger.warn).toHaveBeenCalledWith(
        'algosdk request failed 1 times. Retrying in 0ms: URLTokenBaseHTTPError: Network request error. Received status 429 (Too Many Requests)',
      )
    }, 10_000)
  })

  describe('Config', () => {
    test('Gets algod config from environment', () => {
      process.env.ALGOD_SERVER = 'http://localhost'
      process.env.ALGOD_PORT = '4001'
      process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = ClientManager.getAlgodConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('4001')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Throws error when getting algod config when no environment defined', () => {
      process.env.ALGOD_SERVER = undefined
      process.env.ALGOD_PORT = undefined
      process.env.ALGOD_TOKEN = undefined
      expect(() => ClientManager.getAlgodConfigFromEnvironment()).toThrowError(
        'Attempt to get default algod configuration without specifying ALGOD_SERVER in the environment variables',
      )
    })

    test('Gets indexer config from environment', () => {
      process.env.INDEXER_SERVER = 'http://localhost'
      process.env.INDEXER_PORT = '8980'
      process.env.INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      const config = ClientManager.getIndexerConfigFromEnvironment()

      expect(config.server).toBe('http://localhost')
      expect(config.port).toBe('8980')
      expect(config.token).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })

    test('Gets AlgoNode config for MainNet algod', () => {
      const config = ClientManager.getAlgoNodeConfig('mainnet', 'algod')
      expect(config.server).toBe('https://mainnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet algod', () => {
      const config = ClientManager.getAlgoNodeConfig('testnet', 'algod')
      expect(config.server).toBe('https://testnet-api.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for MainNet indexer', () => {
      const config = ClientManager.getAlgoNodeConfig('mainnet', 'indexer')
      expect(config.server).toBe('https://mainnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Gets AlgoNode config for TestNet indexer', () => {
      const config = ClientManager.getAlgoNodeConfig('testnet', 'indexer')
      expect(config.server).toBe('https://testnet-idx.algonode.cloud/')
      expect(config.port).toBe(443)
    })

    test('Throws error when getting indexer config when no environment defined', () => {
      process.env.INDEXER_SERVER = undefined
      process.env.INDEXER_PORT = undefined
      process.env.INDEXER_TOKEN = undefined
      expect(() => ClientManager.getIndexerConfigFromEnvironment()).toThrowError(
        'Attempt to get default indexer configuration without specifying INDEXER_SERVER in the environment variables',
      )
    })

    test('Get working LocalNet algod client', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getDefaultLocalNetConfig('algod'))
      await algod.getStatus()
    })

    test('Get working LocalNet indexer client', async () => {
      const indexer = ClientManager.getIndexerClient(ClientManager.getDefaultLocalNetConfig('indexer'))
      await indexer.makeHealthCheck()
    })

    test('Get working LocalNet kmd client', async () => {
      const kmd = ClientManager.getKmdClient(ClientManager.getDefaultLocalNetConfig('kmd'))
      await kmd.listWallets()
    })

    test('Get working MainNet algod client', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('mainnet', 'algod'))
      await algod.getStatus()
    })

    test('Get working MainNet indexer client', async () => {
      const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('mainnet', 'indexer'))
      await indexer.makeHealthCheck()
    })

    test('Determine LocalNet algod client is LocalNet', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getDefaultLocalNetConfig('algod'))
      const localNet = await new ClientManager({ algod }).isLocalNet()
      expect(localNet).toBe(true)
    })

    test('Determine TestNet algod client is not LocalNet', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))
      const localNet = await new ClientManager({ algod }).isLocalNet()
      expect(localNet).toBe(false)
    })

    test('Determine MainNet algod client is not LocalNet', async () => {
      const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('mainnet', 'algod'))
      const localNet = await new ClientManager({ algod }).isLocalNet()
      expect(localNet).toBe(false)
    })
  })
})
