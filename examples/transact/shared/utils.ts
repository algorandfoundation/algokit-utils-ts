import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { AlgodClient } from '@algorandfoundation/algokit-utils/algod-client'
import { KmdClient } from '@algorandfoundation/algokit-utils/kmd-client'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { ALGOD_CONFIG, KMD_CONFIG } from './constants.js'

/**
 * Creates an AlgodClient configured for LocalNet
 */
export function createAlgodClient(): AlgodClient {
  return new AlgodClient({
    baseUrl: ALGOD_CONFIG.server,
    port: ALGOD_CONFIG.port,
    token: ALGOD_CONFIG.token,
  })
}

/**
 * Creates a KmdClient configured for LocalNet
 */
export function createKmdClient(): KmdClient {
  return new KmdClient({
    baseUrl: KMD_CONFIG.server,
    port: KMD_CONFIG.port,
    token: KMD_CONFIG.token,
  })
}

/**
 * Gets a funded account from LocalNet KMD (the default dispenser account)
 * @param algorand The AlgorandClient instance
 * @returns A funded account with signing capability
 */
export async function getFundedAccount(algorand: AlgorandClient) {
  return await algorand.account.kmd.getLocalNetDispenserAccount()
}

/**
 * Creates a new random account and optionally funds it
 * @param algorand The AlgorandClient instance
 * @param fundWithAlgo Optional amount of Algo to fund the new account with
 * @returns A new random account with signing capability
 */
export async function createRandomAccount(algorand: AlgorandClient, fundWithAlgo?: number) {
  const account = algorand.account.random()

  if (fundWithAlgo !== undefined && fundWithAlgo > 0) {
    const dispenser = await getFundedAccount(algorand)
    await algorand.send.payment({
      sender: dispenser,
      receiver: account.addr,
      amount: algo(fundWithAlgo),
    })
  }

  return account
}

/**
 * Waits for a transaction to be confirmed
 * @param algod The AlgodClient instance
 * @param txId The transaction ID to wait for
 * @param maxRounds Maximum number of rounds to wait (default: 5)
 * @returns The pending transaction response once confirmed
 */
export async function waitForConfirmation(
  algod: AlgodClient,
  txId: string,
  maxRounds: number = 5
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
 * @param algorand The AlgorandClient instance
 * @param address The account address to check
 * @returns The account balance as an AlgoAmount
 */
export async function getAccountBalance(
  algorand: AlgorandClient,
  address: string
): Promise<AlgoAmount> {
  const info = await algorand.account.getInformation(address)
  return AlgoAmount.MicroAlgo(info.balance.microAlgo)
}

/**
 * Formats a microAlgo amount to a human-readable Algo string
 * @param microAlgos The amount in microAlgos
 * @param decimals Number of decimal places to show (default: 6)
 * @returns Formatted string like "1.234567 ALGO"
 */
export function formatAlgo(microAlgos: bigint | number, decimals: number = 6): string {
  const amount = AlgoAmount.MicroAlgo(microAlgos)
  return `${amount.algo.toFixed(decimals)} ALGO`
}

/**
 * Prints a header/title for an example section
 * @param title The title to display
 */
export function printHeader(title: string): void {
  const line = '='.repeat(60)
  console.log(`\n${line}`)
  console.log(`  ${title}`)
  console.log(`${line}\n`)
}

/**
 * Prints a numbered step in an example
 * @param step The step number
 * @param description The step description
 */
export function printStep(step: number, description: string): void {
  console.log(`\n--- Step ${step}: ${description} ---`)
}

/**
 * Prints an informational message
 * @param message The message to display
 */
export function printInfo(message: string): void {
  console.log(`[INFO] ${message}`)
}

/**
 * Prints a success message
 * @param message The message to display
 */
export function printSuccess(message: string): void {
  console.log(`[SUCCESS] ${message}`)
}

/**
 * Shortens an Algorand address for display
 * @param address The full address to shorten
 * @param chars Number of characters to show at start and end (default: 6)
 * @returns Shortened address like "ABC123...XYZ789"
 */
export function shortenAddress(address: string, chars: number = 6): string {
  if (address.length <= chars * 2 + 3) {
    return address
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
