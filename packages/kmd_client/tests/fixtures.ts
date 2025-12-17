import { decodeAddress, encodeAddress } from '@algorandfoundation/algokit-common'
import type { KmdClient } from '../src/client'
import { MULTISIG_KEY_COUNT, MULTISIG_THRESHOLD, MULTISIG_VERSION, TEST_WALLET_DRIVER, TEST_WALLET_PASSWORD } from './config'

/**
 * Generates a unique wallet name for testing
 */
export function generateWalletName(): string {
  return `test-wallet-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Creates a test wallet and returns wallet ID and name
 */
export async function createTestWallet(
  client: KmdClient,
  password: string = TEST_WALLET_PASSWORD,
): Promise<{ walletId: string; walletName: string }> {
  const walletName = generateWalletName()
  const result = await client.createWallet({
    walletName,
    walletPassword: password,
    walletDriverName: TEST_WALLET_DRIVER,
  })
  return {
    walletId: result.wallet.id,
    walletName: result.wallet.name,
  }
}

/**
 * Creates a wallet and initializes a wallet handle token (unlocks wallet)
 */
export async function getWalletHandle(
  client: KmdClient,
  password: string = TEST_WALLET_PASSWORD,
): Promise<{
  walletHandleToken: string
  walletId: string
  walletName: string
}> {
  // Create wallet
  const { walletId, walletName } = await createTestWallet(client, password)

  // Initialize handle (unlock)
  const initResult = await client.initWalletHandle({
    walletId,
    walletPassword: password,
  })

  return {
    walletHandleToken: initResult.walletHandleToken,
    walletId,
    walletName,
  }
}

/**
 * Releases a wallet handle token (locks wallet)
 * Used for cleanup in tests
 */
export async function releaseWalletHandle(client: KmdClient, walletHandleToken: string): Promise<void> {
  try {
    await client.releaseWalletHandleToken({ walletHandleToken })
  } catch (error) {
    // Ignore errors during cleanup (handle may have already expired)
    console.warn('Failed to release wallet handle:', error)
  }
}

/**
 * Generates a key in the wallet and returns the address
 */
export async function generateTestKey(client: KmdClient, walletHandleToken: string): Promise<string> {
  const result = await client.generateKey({
    walletHandleToken,
  })
  return result.address.toString()
}

/**
 * Generates multiple keys for multisig tests
 */
export async function generateMultipleKeys(
  client: KmdClient,
  walletHandleToken: string,
  count: number = MULTISIG_KEY_COUNT,
): Promise<string[]> {
  const addresses: string[] = []
  for (let i = 0; i < count; i++) {
    const address = await generateTestKey(client, walletHandleToken)
    addresses.push(address)
  }
  return addresses
}

/**
 * Converts an Algorand address string to a public key (Uint8Array)
 */
export function addressToPublicKey(address: string): Uint8Array {
  return decodeAddress(address).publicKey
}

/**
 * Converts a public key (Uint8Array) to an Algorand address string
 */
export function publicKeyToAddress(publicKey: Uint8Array): string {
  return encodeAddress(publicKey)
}

/**
 * Creates a multisig account with test keys
 */
export async function createTestMultisig(
  client: KmdClient,
  walletHandleToken: string,
  threshold: number = MULTISIG_THRESHOLD,
  keyCount: number = MULTISIG_KEY_COUNT,
): Promise<{
  multisigAddress: string
  publicKeys: Uint8Array[]
  addresses: string[]
  threshold: number
}> {
  // Generate keys
  const addresses = await generateMultipleKeys(client, walletHandleToken, keyCount)

  const publicKeys = addresses.map((addr) => addressToPublicKey(addr))
  // Convert to number[] - the API expects number arrays for public keys
  const publicKeysAsNumbers = publicKeys.map((pk) => Array.from(pk).map((byte) => Number(byte)))

  // Import multisig
  const result = await client.importMultisig({
    walletHandleToken,
    multisigVersion: MULTISIG_VERSION,
    threshold: threshold,
    pks: publicKeysAsNumbers,
  })

  return {
    multisigAddress: result.address.toString(),
    publicKeys,
    addresses,
    threshold,
  }
}
