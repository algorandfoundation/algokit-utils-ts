import { Address } from '@algorandfoundation/algokit-common'
import { KmdClient } from '@algorandfoundation/algokit-kmd-client'
import * as ed from '@noble/ed25519'
import { DEFAULT_WALLET_NAME, DEFAULT_WALLET_PASSWORD, localnetKmdConfig } from './config'

/**
 * Gets a funded account from the default LocalNet wallet.
 * Returns the first account in the wallet along with a signer function.
 */
export async function getLocalNetDefaultAccount(kmdClient?: KmdClient): Promise<{
  address: Address
  privateKey: Uint8Array
  sign: (data: Uint8Array) => Promise<Uint8Array>
}> {
  const kmd = kmdClient ?? new KmdClient(localnetKmdConfig)

  // Find the default wallet
  const walletsResponse = await kmd.listWallets()
  const wallet = walletsResponse.wallets.find((w) => w.name === DEFAULT_WALLET_NAME)
  if (!wallet) {
    throw new Error(`Default wallet '${DEFAULT_WALLET_NAME}' not found`)
  }

  // Get wallet handle
  const handleResponse = await kmd.initWalletHandle({
    walletId: wallet.id,
    walletPassword: DEFAULT_WALLET_PASSWORD,
  })
  const walletHandleToken = handleResponse.walletHandleToken

  // List keys and get the first address
  const keysResponse = await kmd.listKeysInWallet({ walletHandleToken })
  if (keysResponse.addresses.length === 0) {
    throw new Error('No accounts found in default wallet')
  }
  const address = keysResponse.addresses[0]

  // Export the private key
  const keyResponse = await kmd.exportKey({
    walletHandleToken,
    address,
  })
  const privateKey = keyResponse.privateKey

  // Release the wallet handle
  await kmd.releaseWalletHandleToken({ walletHandleToken })

  // The private key from KMD is 64 bytes (seed + public key), we need just the seed (first 32 bytes)
  const seed = privateKey.slice(0, 32)

  return {
    address,
    privateKey,
    sign: async (data: Uint8Array) => ed.signAsync(data, seed),
  }
}