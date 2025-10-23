import {
  type Transaction,
  type SignedTransaction,
  encodeTransaction,
  groupTransactions as groupTxns,
} from '@algorandfoundation/algokit-transact'
import algosdk from 'algosdk'
import * as ed from '@noble/ed25519'

export interface AlgodTestConfig {
  algodBaseUrl: string
  algodApiToken?: string
  senderMnemonic?: string
}

export function getAlgodEnv(): AlgodTestConfig {
  return {
    algodBaseUrl: process.env.ALGOD_BASE_URL ?? 'http://localhost:4001',
    // Default token for localnet (Algorand sandbox / Algokit LocalNet)
    algodApiToken: process.env.ALGOD_API_TOKEN ?? 'a'.repeat(64),
    senderMnemonic: process.env.SENDER_MNEMONIC,
  }
}

export async function getSenderMnemonic(): Promise<string> {
  if (process.env.SENDER_MNEMONIC) return process.env.SENDER_MNEMONIC
  const algosdk = (await import('algosdk')).default
  // Try to derive from local KMD defaults
  const kmdBase = process.env.KMD_BASE_URL ?? 'http://localhost:4002'
  const kmdToken = process.env.KMD_API_TOKEN ?? 'a'.repeat(64)
  const url = new URL(kmdBase)
  const server = `${url.protocol}//${url.hostname}`
  const port = Number(url.port || 4002)

  // TODO: Replace with native KMD
  const kmd = new algosdk.Kmd(kmdToken, server, port)
  const wallets = await kmd.listWallets()
  const wallet = wallets.wallets.find((w: { name: string }) => w.name === 'unencrypted-default-wallet') ?? wallets.wallets[0]
  if (!wallet) throw new Error('No KMD wallet found on localnet')
  const handle = await kmd.initWalletHandle(wallet.id, '')
  try {
    const keys = await kmd.listKeys(handle.wallet_handle_token)
    let address: string | undefined = keys.addresses[0]
    if (!address) {
      const gen = await kmd.generateKey(handle.wallet_handle_token)
      address = gen.address
    }
    const exported = await kmd.exportKey(handle.wallet_handle_token, '', address!)
    const sk = new Uint8Array(exported.private_key)
    return algosdk.secretKeyToMnemonic(sk)
  } finally {
    await kmd.releaseWalletHandle(handle.wallet_handle_token)
  }
}

/**
 * Convenience helper: derive the sender account (address + keys) used for tests.
 * Returns:
 *  - address: Algorand address string
 *  - secretKey: 64-byte Ed25519 secret key (private + public)
 *  - mnemonic: the 25-word mnemonic
 */
export async function getSenderAccount(): Promise<{
  address: string
  secretKey: Uint8Array
  mnemonic: string
}> {
  const mnemonic = await getSenderMnemonic()
  const { addr, sk } = algosdk.mnemonicToSecretKey(mnemonic)
  const secretKey = new Uint8Array(sk)
  return { address: typeof addr === 'string' ? addr : addr.toString(), secretKey, mnemonic }
}

export async function signTransaction(transaction: Transaction, secretKey: Uint8Array): Promise<SignedTransaction> {
  const encodedTxn = encodeTransaction(transaction)
  const signature = await ed.signAsync(encodedTxn, secretKey.slice(0, 32))

  return {
    transaction,
    signature,
  }
}

export function groupTransactions(transactions: Transaction[]): Transaction[] {
  return groupTxns(transactions)
}
