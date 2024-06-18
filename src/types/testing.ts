import algosdk from 'algosdk'
import { TransactionLogger } from '../testing'
import { TestLogger } from '../testing/test-logger'
import { AlgoAmount } from '../types/amount'
import { SendTransactionFrom } from '../types/transaction'
import { TransactionSignerAccount } from './account'
import AlgorandClient from './algorand-client'
import { TransactionLookupResult } from './indexer'
import { AlgoConfig } from './network-client'
import Account = algosdk.Account
import Algodv2 = algosdk.Algodv2
import Indexer = algosdk.Indexer
import Kmd = algosdk.Kmd
import Transaction = algosdk.Transaction

/**
 * Test automation context.
 */
export interface AlgorandTestAutomationContext {
  /** An AlgorandClient instance loaded with the current context, including testAccount and any generated accounts loaded as signers */
  algorand: AlgorandClient
  /** Algod client instance that will log transactions in `transactionLogger` */
  algod: Algodv2
  /** Indexer client instance */
  indexer: Indexer
  /** KMD client instance */
  kmd: Kmd
  /** Transaction logger that will log transaction IDs for all transactions issued by `algod` */
  transactionLogger: TransactionLogger
  /** Default, funded test account that is ephemerally created */
  testAccount: Account & TransactionSignerAccount
  /** Generate and fund an additional ephemerally created account */
  generateAccount: (params: GetTestAccountParams) => Promise<Account & TransactionSignerAccount>
  /** Wait for the indexer to catch up with all transactions logged by `transactionLogger` */
  waitForIndexer: () => Promise<void>
  /** Wait for the indexer to catch up with the given transaction ID */
  waitForIndexerTransaction: (transactionId: string) => Promise<TransactionLookupResult>
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
  accountGetter?: (algorand: AlgorandClient) => Promise<Account>
}

/** Configuration for creating an Algorand testing fixture. */
export interface AlgorandFixtureConfig extends Partial<AlgoConfig> {
  /** An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  algod?: Algodv2
  /** An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  indexer?: Indexer
  /** An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet. */
  kmd?: Kmd
  /** The amount of funds to allocate to the default testing account, if not specified then it will get 10 Algos. */
  testAccountFunding?: AlgoAmount
  /** Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts. */
  accountGetter?: (algod: Algodv2, kmd?: Kmd) => Promise<Account>
}

/** An Algorand automated testing fixture */
export interface AlgorandFixture {
  /**
   * Retrieve the current context.
   * Useful with destructuring.
   * @example
   * ```typescript
   * test('My test', () => {
   *     const {algod, indexer, testAccount, ...} = algorand.context
   * })
   * ```
   */
  get context(): AlgorandTestAutomationContext

  /**
   * Retrieve an `AlgorandClient` loaded with the current context, including testAccount and any generated accounts loaded as signers.
   */
  get algorand(): AlgorandClient

  /**
   * Testing framework agnostic handler method to run before each test to prepare the `context` for that test.
   */
  beforeEach: () => Promise<void>
}

/** Configuration for preparing a captured log snapshot.
 * This helps ensure that the provided configuration items won't appear
 *  with random values in the log snapshot, but rather will get substituted with predictable ids.
 */
export interface LogSnapshotConfig {
  /** Any transaction IDs or transactions to replace the ID for predictably */
  transactions?: (string | Transaction)[]
  /** Any accounts/addresses to replace the address for predictably */
  accounts?: (string | SendTransactionFrom)[]
  /** Any app IDs to replace predictably */
  apps?: (string | number | bigint)[]
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
