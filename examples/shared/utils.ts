import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AlgodClient } from '@algorandfoundation/algokit-utils/algod-client'
import { IndexerClient } from '@algorandfoundation/algokit-utils/indexer-client'
import { KmdClient } from '@algorandfoundation/algokit-utils/kmd-client'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { ALGOD_CONFIG, INDEXER_CONFIG, KMD_CONFIG } from './constants.js'

// Get the directory of this file for resolving artifact paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ============================================================================
// Console Output Helpers
// ============================================================================

/**
 * Print a header for an example section
 */
export function printHeader(title: string): void {
  const line = '='.repeat(60)
  console.log(`\n${line}`)
  console.log(`🚀 ${title}`)
  console.log(`${line}\n`)
}

/**
 * Print a step in the example
 */
export function printStep(step: number, description: string): void {
  console.log(`\n📋 Step ${step}: ${description}`)
}

/**
 * Print informational message
 */
export function printInfo(message: string): void {
  console.log(`ℹ️  ${message}`)
}

/**
 * Print success message
 */
export function printSuccess(message: string): void {
  console.log(`✅ ${message}`)
}

/**
 * Print error message
 */
export function printError(message: string): void {
  console.log(`❌ ${message}`)
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Format an AlgoAmount or microAlgo value to a human-readable string
 */
export function formatAlgo(amount: AlgoAmount | bigint | number, decimals: number = 6): string {
  if (typeof amount === 'bigint' || typeof amount === 'number') {
    const algoAmount = AlgoAmount.MicroAlgo(amount)
    return `${algoAmount.algo.toFixed(decimals)} ALGO`
  }
  return `${amount.algo.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ALGO`
}

/**
 * Format a microAlgo amount to a human-readable string
 */
export function formatMicroAlgo(microAlgo: bigint | number): string {
  const value = typeof microAlgo === 'bigint' ? Number(microAlgo) : microAlgo
  return `${value.toLocaleString('en-US')} microALGO`
}

/**
 * Shorten an Algorand address for display
 */
export function shortenAddress(address: string, prefixLength = 6, suffixLength = 4): string {
  if (address.length <= prefixLength + suffixLength + 3) {
    return address
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}

/**
 * Formats a byte array as a readable string showing length and preview
 */
export function formatBytes(bytes: Uint8Array, maxPreviewBytes = 8): string {
  const preview = Array.from(bytes.slice(0, maxPreviewBytes))
    .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
    .join(', ')
  const suffix = bytes.length > maxPreviewBytes ? ', ...' : ''
  return `${bytes.length} bytes: [${preview}${suffix}]`
}

/**
 * Formats a byte array as a hexadecimal string
 */
export function formatHex(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `0x${hex}`
}

// ============================================================================
// Client Creation Helpers
// ============================================================================

/**
 * Create an Algod client using default LocalNet configuration
 */
export function createAlgodClient(): AlgodClient {
  return new AlgodClient({
    baseUrl: ALGOD_CONFIG.server,
    port: ALGOD_CONFIG.port,
    token: ALGOD_CONFIG.token as string,
  })
}

/**
 * Create a KMD client using default LocalNet configuration
 */
export function createKmdClient(): KmdClient {
  return new KmdClient({
    baseUrl: KMD_CONFIG.server,
    port: KMD_CONFIG.port,
    token: KMD_CONFIG.token as string,
  })
}

/**
 * Create an Indexer client using default LocalNet configuration
 */
export function createIndexerClient(): IndexerClient {
  return new IndexerClient({
    baseUrl: INDEXER_CONFIG.server,
    port: INDEXER_CONFIG.port,
    token: INDEXER_CONFIG.token as string,
  })
}

/**
 * Create an AlgorandClient configured for LocalNet
 */
export function createAlgorandClient(): AlgorandClient {
  return AlgorandClient.defaultLocalNet()
}

// ============================================================================
// KMD Helpers
// ============================================================================

/**
 * Generate a unique wallet name for testing
 */
function generateWalletName(): string {
  return `test-wallet-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Create a test wallet for examples
 * Returns the wallet ID, name, and handle token for further operations
 */
export async function createTestWallet(
  kmd: KmdClient,
  password = '',
): Promise<{ walletId: string; walletName: string; walletHandleToken: string }> {
  const walletName = generateWalletName()

  // Create the wallet
  const createResult = await kmd.createWallet({
    walletName,
    walletPassword: password,
    walletDriverName: 'sqlite',
  })

  const walletId = createResult.wallet.id

  // Initialize the wallet handle (unlock the wallet)
  const initResult = await kmd.initWalletHandle({
    walletId,
    walletPassword: password,
  })

  return {
    walletId,
    walletName,
    walletHandleToken: initResult.walletHandleToken,
  }
}

/**
 * Cleanup a test wallet by releasing its handle token
 * Note: KMD doesn't support deleting wallets, so we just release the handle
 */
export async function cleanupTestWallet(kmd: KmdClient, walletHandleToken: string): Promise<void> {
  try {
    await kmd.releaseWalletHandleToken({ walletHandleToken })
  } catch (error) {
    // Ignore errors during cleanup (handle may have already expired)
    console.warn('Failed to release wallet handle during cleanup:', error)
  }
}

// ============================================================================
// Transaction Helpers
// ============================================================================

/**
 * Waits for a transaction to be confirmed
 * @param algod - The AlgodClient instance
 * @param txId - The transaction ID to wait for
 * @param maxRounds - Maximum number of rounds to wait (default: 5)
 * @returns The pending transaction response once confirmed
 */
export async function waitForConfirmation(
  algod: AlgodClient,
  txId: string,
  maxRounds: number = 5,
): Promise<Record<string, unknown>> {
  const status = await algod.status()
  let currentRound = BigInt(status.lastRound)
  const endRound = currentRound + BigInt(maxRounds)

  while (currentRound < endRound) {
    const pendingInfo = await algod.pendingTransactionInformation(txId)

    if (pendingInfo.confirmedRound && pendingInfo.confirmedRound > 0) {
      return pendingInfo as unknown as Record<string, unknown>
    }

    if (pendingInfo.poolError && pendingInfo.poolError.length > 0) {
      throw new Error(`Transaction rejected: ${pendingInfo.poolError}`)
    }

    await algod.statusAfterBlock(currentRound)
    currentRound++
  }

  throw new Error(`Transaction ${txId} not confirmed after ${maxRounds} rounds`)
}

/**
 * Gets the balance of an account in microAlgos
 * @param algorand - The AlgorandClient instance
 * @param address - The account address to check
 * @returns The account balance as an AlgoAmount
 */
export async function getAccountBalance(algorand: AlgorandClient, address: string): Promise<AlgoAmount> {
  const info = await algorand.account.getInformation(address)
  return AlgoAmount.MicroAlgo(info.balance.microAlgo)
}

// ============================================================================
// Account Helpers
// ============================================================================

/**
 * Get a funded account from the LocalNet dispenser
 * Returns an account with signing capabilities
 */
export async function getFundedAccount(algorand: AlgorandClient) {
  const dispenser = await algorand.account.dispenserFromEnvironment()
  return dispenser
}

/**
 * Create a random account and fund it from the dispenser
 */
export async function createRandomAccount(algorand: AlgorandClient, fundingAmount?: AlgoAmount) {
  const { algo } = await import('@algorandfoundation/algokit-utils')

  const account = algorand.account.random()
  const dispenser = await algorand.account.dispenserFromEnvironment()

  const amount = fundingAmount ?? algo(10)
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: account.addr,
    amount,
  })

  algorand.setSignerFromAccount(account)

  return account
}

// ============================================================================
// TEAL Loader
// ============================================================================

/**
 * Load TEAL source code from the shared artifacts directory
 * @param filename - The name of the TEAL file to load (e.g., 'approval.teal')
 * @returns The TEAL source code as a string
 */
export function loadTealSource(filename: string): string {
  const artifactsPath = join(__dirname, 'artifacts', filename)
  return readFileSync(artifactsPath, 'utf-8')
}
