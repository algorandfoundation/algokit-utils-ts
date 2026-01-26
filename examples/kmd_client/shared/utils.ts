import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AlgodClient } from '@algorandfoundation/algokit-utils/algod-client'
import { KmdClient } from '@algorandfoundation/algokit-utils/kmd-client'
import type { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { ALGOD_CONFIG, KMD_CONFIG } from './constants.js'

// ============================================================================
// Console Output Helpers
// ============================================================================

/**
 * Print a header for an example section
 */
export function printHeader(title: string): void {
  console.log(`\n${'='.repeat(60)}`)
  console.log(title)
  console.log('='.repeat(60))
}

/**
 * Print a step in the example
 */
export function printStep(step: number, description: string): void {
  console.log(`\n[Step ${step}] ${description}`)
  console.log('-'.repeat(40))
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
 * Format an AlgoAmount to a human-readable string
 */
export function formatAlgo(amount: AlgoAmount): string {
  return `${amount.algo.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ALGO`
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

// ============================================================================
// Client Creation Helpers
// ============================================================================

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
 * Create an AlgorandClient configured for LocalNet
 */
export function createAlgorandClient(): AlgorandClient {
  return AlgorandClient.defaultLocalNet()
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

// ============================================================================
// Test Wallet Helpers
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
