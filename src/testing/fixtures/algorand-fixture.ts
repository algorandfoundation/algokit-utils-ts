import { getTestAccount, runWhenIndexerCaughtUp, TransactionLogger } from '../'
import {
  algos,
  Config,
  getAlgoClient,
  getAlgoIndexerClient,
  getAlgoKmdClient,
  getConfigFromEnvOrDefaults,
  lookupTransactionById,
} from '../../'
import { AlgoConfig } from '../../types/network-client'
import { AlgorandFixture, AlgorandFixtureConfig, AlgorandTestAutomationContext, GetTestAccountParams } from '../../types/testing'

/** @deprecated use algorandFixture(fixtureConfig: AlgorandFixtureConfig | undefined, config: AlgoConfig) instead
 * Creates a test fixture for automated testing against Algorand.
 * By default it tests against an environment variable specified client
 *  if the standard environment variables are specified, otherwise against
 *  a default LocalNet instance, but you can pass in an algod, indexer
 *  and/or kmd if you want to test against an explicitly defined network.
 *
 * @example ```typescript
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
 * @param fixtureConfig The fixture configuration
 * @returns The fixture
 */
export function algorandFixture(fixtureConfig?: AlgorandFixtureConfig): AlgorandFixture

/**
 * Creates a test fixture for automated testing against Algorand.
 * By default it tests against an environment variable specified client
 *  if the standard environment variables are specified, otherwise against
 *  a default LocalNet instance, but you can pass in an algod, indexer
 *  and/or kmd if you want to test against an explicitly defined network.
 *
 * @example ```typescript
 * const algorand = algorandFixture(undefined, getConfigFromEnvOrDefaults())
 *
 * beforeEach(algorand.beforeEach, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = algorand.context
 *     // test things...
 * })
 * ```
 *
 * @param fixtureConfig The fixture configuration
 * @param config The algo configuration
 * @returns The fixture
 */
export function algorandFixture(fixtureConfig: AlgorandFixtureConfig | undefined, config: AlgoConfig): AlgorandFixture

/**
 * Creates a test fixture for automated testing against Algorand.
 * By default it tests against an environment variable specified client
 *  if the standard environment variables are specified, otherwise against
 *  a default LocalNet instance, but you can pass in an algod, indexer
 *  and/or kmd if you want to test against an explicitly defined network.
 *
 * @example ```typescript
 * const algorand = algorandFixture(undefined, getConfigFromEnvOrDefaults())
 *
 * beforeEach(algorand.beforeEach, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = algorand.context
 *     // test things...
 * })
 * ```
 *
 * @param fixtureConfig The fixture configuration
 * @param config The algo configuration
 * @returns The fixture
 */
export function algorandFixture(fixtureConfig?: AlgorandFixtureConfig, config?: AlgoConfig): AlgorandFixture {
  config = config || getConfigFromEnvOrDefaults()

  const algod = fixtureConfig?.algod ?? getAlgoClient(config.algodConfig)
  const indexer = fixtureConfig?.indexer ?? getAlgoIndexerClient(config.indexerConfig)
  const kmd = fixtureConfig?.kmd ?? getAlgoKmdClient(config.kmdConfig)
  let context: AlgorandTestAutomationContext

  const beforeEach = async () => {
    Config.configure({ debug: true })
    const transactionLogger = new TransactionLogger()
    const transactionLoggerAlgod = transactionLogger.capture(algod)
    context = {
      algod: transactionLoggerAlgod,
      indexer: indexer,
      kmd: kmd,
      testAccount: await getTestAccount(
        { initialFunds: fixtureConfig?.testAccountFunding ?? algos(10), suppressLog: true },
        transactionLoggerAlgod,
        kmd,
      ),
      generateAccount: (params: GetTestAccountParams) => getTestAccount(params, transactionLoggerAlgod, kmd),
      transactionLogger: transactionLogger,
      waitForIndexer: () => transactionLogger.waitForIndexer(indexer),
      waitForIndexerTransaction: (transactionId: string) => runWhenIndexerCaughtUp(() => lookupTransactionById(transactionId, indexer)),
    }
  }

  return {
    get context() {
      return context
    },
    beforeEach,
  }
}
