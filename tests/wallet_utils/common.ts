import { AssetHolding } from '@algorandfoundation/algokit-algod-client'
import { peikertXHdWalletGenerator } from '@algorandfoundation/algokit-crypto'
import { generateAddressWithSigners } from '@algorandfoundation/algokit-transact'
import { mnemonicFromSeed, seedFromMnemonic } from '@algorandfoundation/algokit-algo25'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { Addressable, AlgorandClient } from '../../src'
import { AssetInformation } from '../../src/asset-manager'

export async function balance(algorand: AlgorandClient, account: Addressable) {
  const { amount } = await algorand.client.algod.accountInformation(account)

  return amount
}

export async function deriveHdAccountsFromMnemonic(opts: { numAccounts: number }) {
  const { accountGenerator } = await peikertXHdWalletGenerator(await bip39.mnemonicToSeed(bip39.generateMnemonic(wordlist, 256)))

  const accounts = []

  for (let i = 0; i < opts.numAccounts; i++) {
    const generated = await accountGenerator(i, 0)
    const addrWithSigners = generateAddressWithSigners(generated)
    accounts.push(addrWithSigners)
  }

  return accounts
}

export function generateAlgo25Mnemonic(): string {
  const seed = new Uint8Array(32)
  crypto.getRandomValues(seed)
  return mnemonicFromSeed(seed)
}

export async function deriveHdAccountsFromBip39Mnemonic(mnemonic: string, numAccounts: number) {
  const { accountGenerator } = await peikertXHdWalletGenerator(await bip39.mnemonicToSeed(mnemonic))
  const accounts = []
  for (let i = 0; i < numAccounts; i++) {
    const generated = await accountGenerator(i, 0)
    accounts.push(generateAddressWithSigners(generated))
  }
  return accounts
}

export async function deriveHdAccountsFromAlgo25Mnemonic(mnemonic: string, numAccounts: number) {
  const seed = seedFromMnemonic(mnemonic)
  const { accountGenerator } = await peikertXHdWalletGenerator(seed)
  const accounts = []
  for (let i = 0; i < numAccounts; i++) {
    const generated = await accountGenerator(i, 0)
    accounts.push(generateAddressWithSigners(generated))
  }
  return accounts
}

export async function getAssetBalance(algorand: AlgorandClient, account: Addressable, assetId: bigint): Promise<bigint> {
  try {
    const info = await algorand.asset.getAccountInformation(account.addr, assetId)
    return info.balance
  } catch {
    return 0n
  }
}

export async function getAccountAssets(algorand: AlgorandClient, account: Addressable): Promise<AssetHolding[]> {
  const info = await algorand.account.getInformation(account)
  return info.assets ?? []
}

export async function getAssetInfo(algorand: AlgorandClient, assetId: bigint): Promise<AssetInformation> {
  return await algorand.asset.getById(assetId)
}
