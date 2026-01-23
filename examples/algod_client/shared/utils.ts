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
  console.log(`\n${  '='.repeat(60)}`)
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
 * Format microAlgo amount to a human-readable string
 */
export function formatMicroAlgo(microAlgo: bigint | number): string {
  const value = typeof microAlgo === 'bigint' ? Number(microAlgo) : microAlgo
  return `${value.toLocaleString('en-US')} µALGO`
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

/**
 * Create a random account and fund it from the dispenser
 */
export async function createRandomAccount(algorand: AlgorandClient, fundingAmount?: AlgoAmount) {
  // Import algo function for default funding
  const { algo } = await import('@algorandfoundation/algokit-utils')

  // Create a random account
  const account = algorand.account.random()

  // Get the dispenser account
  const dispenser = await algorand.account.dispenserFromEnvironment()

  // Fund the new account
  const amount = fundingAmount ?? algo(10)
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: account.addr,
    amount,
  })

  // Register the signer for the new account
  algorand.setSignerFromAccount(account)

  return account
}
