import { getTestAccount, runWhenIndexerCaughtUp, TransactionLogger } from '../'
import {
  algos,
  Config,
  getAlgoClient,
  getAlgodConfigFromEnvironment,
  getAlgoIndexerClient,
  getAlgoKmdClient,
  getDefaultLocalNetConfig,
  getIndexerConfigFromEnvironment,
  lookupTransactionById,
} from '../../'
import { AlgoClientConfig } from '../../types/network-client'
import { AlgorandFixture, AlgorandFixtureConfig, AlgorandTestAutomationContext, GetTestAccountParams } from '../../types/testing'

/**
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
export const algorandFixture = (fixtureConfig?: AlgorandFixtureConfig): AlgorandFixture => {
  const algodConfig: AlgoClientConfig =
    process && process.env && process.env.ALGOD_SERVER ? getAlgodConfigFromEnvironment() : getDefaultLocalNetConfig('algod')
  const indexerConfig: AlgoClientConfig =
    process && process.env && process.env.INDEXER_SERVER ? getIndexerConfigFromEnvironment() : getDefaultLocalNetConfig('indexer')
  const kmdConfig: AlgoClientConfig =
    process && process.env && process.env.ALGOD_SERVER
      ? { ...algodConfig, port: process?.env?.KMD_PORT ?? '4002' }
      : getDefaultLocalNetConfig('kmd')

  const algod = fixtureConfig?.algod ?? getAlgoClient(algodConfig)
  const indexer = fixtureConfig?.indexer ?? getAlgoIndexerClient(indexerConfig)
  const kmd = fixtureConfig?.kmd ?? getAlgoKmdClient(kmdConfig)
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
