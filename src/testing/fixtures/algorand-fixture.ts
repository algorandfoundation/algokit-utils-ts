import { algos, Config } from '../../'
import { AlgorandClient } from '../../types/algorand-client'
import { ClientManager } from '../../types/client-manager'
import { AlgoConfig } from '../../types/network-client'
import { AlgorandFixture, AlgorandFixtureConfig, AlgorandTestAutomationContext, GetTestAccountParams } from '../../types/testing'
import { getTestAccount } from '../account'
import { runWhenIndexerCaughtUp } from '../indexer'
import { TransactionLogger } from '../transaction-logger'

/**
 * Creates a test fixture for automated testing against Algorand.
 * By default it tests against an environment variable specified client
 *  if the standard environment variables are specified, otherwise against
 *  a default LocalNet instance, but you can pass in an algod, indexer
 *  and/or kmd (or their respective config) if you want to test against
 * an explicitly defined network.
 *
 * @example No config
 * ```typescript
 * const algorand = algorandFixture()
 *
 * beforeEach(algorand.beforeEach, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = algorand.context
 *     // test things...
 * })
 * ```
 *
 * @example With config
 * ```typescript
 * const algorand = algorandFixture({
 *  algod: new Algodv2('localhost', 12345, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
 *  // ...
 * })
 *
 * beforeEach(algorand.beforeEach, 10_000)
 *
 * test('My test', async () => {
 *     const {algorand, testAccount, ...} = algorand.context
 *     // test things...
 * })
 * ```
 *
 * @param fixtureConfig The fixture configuration
 * @returns The fixture
 */
export function algorandFixture(fixtureConfig?: AlgorandFixtureConfig): AlgorandFixture

/**
 * @deprecated Config can be passed in directly to fixture config now.
 *
 * Creates a test fixture for automated testing against Algorand.
 * By default it tests against an environment variable specified client
 *  if the standard environment variables are specified, otherwise against
 *  a default LocalNet instance, but you can pass in an algod, indexer
 *  and/or kmd if you want to test against an explicitly defined network.
 *
 * @example
 * ```typescript
 * const algorand = algorandFixture(undefined, getConfigFromEnvOrDefaults())
 *
 * beforeEach(algorand.beforeEach, 10_000)
 *
 * test('My test', async () => {
 *     const {algorand, testAccount, ...} = algorand.context
 *     // test things...
 * })
 * ```
 *
 * @param fixtureConfig The fixture configuration
 * @param config The fixture configuration
 * @returns The fixture
 */
export function algorandFixture(fixtureConfig: AlgorandFixtureConfig | undefined, config: AlgoConfig): AlgorandFixture

export function algorandFixture(fixtureConfig?: AlgorandFixtureConfig, config?: AlgoConfig): AlgorandFixture {
  fixtureConfig = { ...fixtureConfig, ...config }
  if (!fixtureConfig.algod || !fixtureConfig.indexer || !fixtureConfig.kmd) {
    fixtureConfig = { ...ClientManager.getConfigFromEnvironmentOrLocalNet(), ...fixtureConfig }
  }

  const algod = fixtureConfig.algod ?? ClientManager.getAlgodClient(fixtureConfig.algodConfig!)
  const indexer = fixtureConfig.indexer ?? ClientManager.getIndexerClient(fixtureConfig.indexerConfig!)
  const kmd = fixtureConfig.kmd ?? ClientManager.getKmdClient(fixtureConfig.kmdConfig!)
  let context: AlgorandTestAutomationContext
  let algorand: AlgorandClient
  let globalTransactionLogger: TransactionLogger

  // If the algorandScope is fixture then we want to share the algorand client and transaction logger across tests.
  if (fixtureConfig.algorandScope === 'fixture') {
    globalTransactionLogger = new TransactionLogger()
    const transactionLoggerAlgod = globalTransactionLogger.capture(algod)
    algorand = AlgorandClient.fromClients({ algod: transactionLoggerAlgod, indexer, kmd })
  } else {
    // If we are relying on the developer calling `beforeEach` then in the meantime we can add a default AlgorandClient to the fixture.
    // This might be useful for use in beforeAll calls etc.
    algorand = AlgorandClient.fromClients({ algod, indexer, kmd })
  }

  const beforeEach = async () => {
    Config.configure({ debug: true })
    // If the algorandScope is fixture then we want to share the transaction logger across tests.
    const transactionLogger = fixtureConfig?.algorandScope === 'fixture' ? globalTransactionLogger : new TransactionLogger()

    // If the algorandScope is test then we want to recreate the algorand client and transaction logger for each test.
    if (fixtureConfig?.algorandScope !== 'fixture') {
      const transactionLoggerAlgod = transactionLogger.capture(algod)
      algorand = AlgorandClient.fromClients({ algod: transactionLoggerAlgod, indexer, kmd })
    }

    const testAccount = await getTestAccount({ initialFunds: fixtureConfig?.testAccountFunding ?? algos(10), suppressLog: true }, algorand)
    algorand.setSignerFromAccount(testAccount).setSuggestedParamsCacheTimeout(0)
    // If running against LocalNet we are likely in dev mode and we need to set a much higher validity window
    //  otherwise we are more likely to get invalid transactions.
    if (await algorand.client.isLocalNet()) {
      algorand.setDefaultValidityWindow(1000)
    }
    algorand.account.setSignerFromAccount(testAccount)
    context = {
      algorand,
      algod: algorand.client.algod,
      indexer: algorand.client.indexer,
      kmd: algorand.client.kmd,
      testAccount,
      generateAccount: async (params: GetTestAccountParams) => {
        const account = await getTestAccount(params, algorand)
        algorand.setSignerFromAccount(account)
        return account
      },
      transactionLogger: transactionLogger,
      waitForIndexer: () => transactionLogger.waitForIndexer(indexer),
      waitForIndexerTransaction: (transactionId: string) => runWhenIndexerCaughtUp(() => indexer.lookupTransactionByID(transactionId).do()),
    }
  }

  return {
    get context() {
      return context
    },
    get algorand() {
      return algorand
    },
    beforeEach,
  }
}
