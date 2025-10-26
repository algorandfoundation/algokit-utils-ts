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
 * @example No config (per-test isolation)
 * ```typescript
 * const fixture = algorandFixture()
 *
 * beforeEach(fixture.newScope, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = fixture.context
 *     // test things...
 * })
 * ```
 *
 * @example No config (test suite isolation)
 * ```typescript
 * const fixture = algorandFixture()
 *
 * beforeAll(fixture.newScope, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = fixture.context
 *     // test things...
 * })
 * ```
 *
 * @example With config
 * ```typescript
 * const fixture = algorandFixture({
 *  algod: new Algodv2('localhost', 12345, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
 *  // ...
 * })
 *
 * beforeEach(fixture.newScope, 10_000)
 *
 * test('My test', async () => {
 *     const {algod, indexer, testAccount, ...} = fixture.context
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

  const newScope = async () => {
    Config.configure({ debug: true })
    const transactionLogger = new TransactionLogger()
    // TODO: implement the logic for wait for indexer
    // const transactionLoggerAlgod = transactionLogger.capture(algod)

    algorand = AlgorandClient.fromClients({ algod: algod, indexer, kmd }).setSuggestedParamsCacheTimeout(0)

    const testAccount = await getTestAccount({ initialFunds: fixtureConfig?.testAccountFunding ?? algos(10), suppressLog: true }, algorand)
    algorand.setSignerFromAccount(testAccount)

    // If running against LocalNet we are likely in dev mode and we need to set a much higher validity window
    //  otherwise we are more likely to get invalid transactions.
    if (await algorand.client.isLocalNet()) {
      algorand.setDefaultValidityWindow(1000)
    }
    context = {
      algorand,
      algod: algod,
      indexer: indexer,
      kmd: kmd,
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
      if (!context) throw new Error('Context not initialised; make sure to call fixture.newScope() before accessing context.')
      return context
    },
    get algorand() {
      return algorand
    },
    beforeEach: newScope,
    newScope,
  }
}
