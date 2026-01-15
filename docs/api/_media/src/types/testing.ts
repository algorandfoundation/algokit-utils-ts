import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Address } from '@algorandfoundation/algokit-common'
import { IndexerClient, TransactionResponse } from '@algorandfoundation/algokit-indexer-client'
import { KmdClient } from '@algorandfoundation/algokit-kmd-client'
import {
  AddressWithSigners,
  AddressWithTransactionSigner,
  LogicSigAccount,
  MultisigAccount,
  Transaction,
} from '@algorandfoundation/algokit-transact'
import { TransactionLogger } from '../testing'
import { TestLogger } from '../testing/test-logger'
import { AlgoAmount } from '../types/amount'
import { AlgorandClient } from './algorand-client'
import { AlgoConfig } from './network-client'

/**
 * Test automation context.
 */
export interface AlgorandTestAutomationContext {
  /** An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers */
  algorand: AlgorandClient
  /** Algod client instance that will log transactions in `transactionLogger` */
  algod: AlgodClient
  /** Indexer client instance */
  indexer: IndexerClient
  /** KMD client instance */
  kmd: KmdClient
  /** Transaction logger that will log transaction IDs for all transactions issued by `algod` */
  transactionLogger: TransactionLogger
  /** Default, funded test account that is ephemerally created */
  testAccount: Address & AddressWithSigners
  /** Generate and fund an additional ephemerally created account */
  generateAccount: (params: GetTestAccountParams) => Promise<Address & AddressWithSigners>
  /** Wait for the indexer to catch up with all transactions logged by `transactionLogger` */
  waitForIndexer: () => Promise<void>
  /** Wait for the indexer to catch up with the given transaction ID */
  waitForIndexerTransaction: (transactionId: string) => Promise<TransactionResponse>
}

/**
 * Parameters for the `getTestAccount` function.
 */
export interface GetTestAccountParams {
  /** Initial funds to ensure the account has */
  initialFunds: AlgoAmount
  /** Whether to suppress the log (which includes a mnemonic) or not (default: do not suppress the log) */
  suppressLog?: boolean
  /** Optional override for how to get a test account; this allows you to retrieve accounts from a known or cached list of accounts. */
  accountGetter?: (algorand: AlgorandClient) => Promise<Address & AddressWithSigners>
}

/** Configuration for creating an Algorand testing fixture. */
export interface AlgorandFixtureConfig extends Partial<AlgoConfig> {
  /** An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  algod?: AlgodClient
  /** An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  indexer?: IndexerClient
  /** An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  kmd?: KmdClient
  /** The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGO. */
  testAccountFunding?: AlgoAmount
  /** Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts. */
  accountGetter?: (algorand: AlgorandClient) => Promise<Address & AddressWithSigners>
}

/** An Algorand automated testing fixture */
export interface AlgorandFixture {
  /**
   * Retrieve the current context.
   * Useful with destructuring.
   *
   * If you haven't called `newScope` then this will throw an error.
   * @example
   * ```typescript
   * test('My test', () => {
   *     const {algod, indexer, testAccount, ...} = fixture.context
   * })
   * ```
   */
  get context(): AlgorandTestAutomationContext

  /**
   * Retrieve an `AlgorandClient` loaded with the current context, including testAccount and any generated accounts loaded as signers.
   */
  get algorand(): AlgorandClient

  /**
   * @deprecated Use newScope instead.
   * Testing framework agnostic handler method to run before each test to prepare the `context` for that test with per test isolation.
   */
  beforeEach: () => Promise<void>

  /**
   * Creates a new isolated fixture scope (clean transaction logger, AlgorandClient, testAccount, etc.).
   *
   * You can call this from any testing framework specific hook method to control when you want a new scope.
   *
   * @example Jest / vitest - per test isolation (beforeEach)
   * ```typescript
   * describe('MY MODULE', () => {
   *   const fixture = algorandFixture()
   *   beforeEach(fixture.newScope)
   *
   *   test('MY TEST', async () => {
   *     const { algorand, testAccount } = fixture.context
   *
   *     // Test stuff!
   *   })
   * })
   * ```
   *
   * @example Jest / vitest - test suite isolation (beforeAll)
   * ```typescript
   * describe('MY MODULE', () => {
   *   const fixture = algorandFixture()
   *   beforeAll(fixture.newScope)
   *
   *   test('test1', async () => {
   *     const { algorand, testAccount } = fixture.context
   *
   *     // Test stuff!
   *   })
   *   test('test2', async () => {
   *     const { algorand, testAccount } = fixture.context
   *     // algorand and testAccount are the same as in test1
   *   })
   * })
   * ```
   *
   */
  newScope: () => Promise<void>
}

/** Configuration for preparing a captured log snapshot.
 * This helps ensure that the provided configuration items won't appear
 *  with random values in the log snapshot, but rather will get substituted with predictable ids.
 */
export interface LogSnapshotConfig {
  /** Any transaction IDs or transactions to replace the ID for predictably */
  transactions?: (string | Transaction)[]
  /** Any accounts/addresses to replace the address for predictably */
  accounts?: (string | Address | LogicSigAccount | MultisigAccount | AddressWithTransactionSigner)[]
  /** Any app IDs to replace predictably */
  apps?: (string | number | bigint)[]
  /** Optional filter predicate to filter out logs */
  filterPredicate?: (log: string) => boolean
}

export interface AlgoKitLogCaptureFixture {
  /** The test logger instance for the current test */
  get testLogger(): TestLogger
  /**
   * Testing framework agnostic handler method to run before each test to prepare the `testLogger` for that test.
   */
  beforeEach: () => void
  /**
   * Testing framework agnostic handler method to run after each test to reset the logger.
   */
  afterEach: () => void
}
