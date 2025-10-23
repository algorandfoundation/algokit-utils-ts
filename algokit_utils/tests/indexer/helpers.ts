import { describe } from 'vitest'
import algosdk from 'algosdk'
import * as ed from '@noble/ed25519'
import { Buffer } from 'node:buffer'

import {
  type Transaction,
  type SignedTransaction,
  TransactionType,
  OnApplicationComplete,
  encodeTransaction,
  encodeSignedTransaction,
  getTransactionId,
} from '@algorandfoundation/algokit-transact'
import { IndexerClient } from '@algorandfoundation/indexer-client'
import { runWhenIndexerCaughtUp } from '../../src/testing/indexer'

export interface IndexerTestConfig {
  indexerBaseUrl: string
  indexerApiToken?: string
}

export interface CreatedAssetInfo {
  assetId: bigint
  txId: string
}

export interface CreatedAppInfo {
  appId: bigint
  txId: string
}

export async function getSenderMnemonic(): Promise<string> {
  if (process.env.SENDER_MNEMONIC) return process.env.SENDER_MNEMONIC

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
      const generated = await kmd.generateKey(handle.wallet_handle_token)
      address = generated.address
    }
    const exported = await kmd.exportKey(handle.wallet_handle_token, '', address!)
    const sk = new Uint8Array(exported.private_key)
    return algosdk.secretKeyToMnemonic(sk)
  } finally {
    await kmd.releaseWalletHandle(handle.wallet_handle_token)
  }
}

async function getSenderAccount(): Promise<{ address: string; secretKey: Uint8Array; mnemonic: string }> {
  const mnemonic = await getSenderMnemonic()
  const { addr, sk } = algosdk.mnemonicToSecretKey(mnemonic)
  const address = typeof addr === 'string' ? addr : addr.toString()
  return { address, secretKey: new Uint8Array(sk), mnemonic }
}

function getAlgodClient(): algosdk.Algodv2 {
  const algodBase = process.env.ALGOD_BASE_URL ?? 'http://localhost:4001'
  const algodToken = process.env.ALGOD_API_TOKEN ?? 'a'.repeat(64)
  const url = new URL(algodBase)
  const server = `${url.protocol}//${url.hostname}`
  const port = Number(url.port || 4001)
  return new algosdk.Algodv2(algodToken, server, port)
}

function decodeGenesisHash(genesisHash: string | Uint8Array): Uint8Array {
  if (genesisHash instanceof Uint8Array) {
    return new Uint8Array(genesisHash)
  }
  return new Uint8Array(Buffer.from(genesisHash, 'base64'))
}

async function signTransaction(transaction: Transaction, secretKey: Uint8Array): Promise<SignedTransaction> {
  const encodedTxn = encodeTransaction(transaction)
  const signature = await ed.signAsync(encodedTxn, secretKey.slice(0, 32))
  return {
    transaction,
    signature,
  }
}

async function submitTransaction(transaction: Transaction, algod: algosdk.Algodv2, secretKey: Uint8Array): Promise<{ txId: string }> {
  const signed = await signTransaction(transaction, secretKey)
  const raw = encodeSignedTransaction(signed)
  const txId = getTransactionId(transaction)
  await algod.sendRawTransaction(raw).do()
  await algosdk.waitForConfirmation(algod, txId, 10)
  return { txId }
}

export async function createDummyAsset(): Promise<CreatedAssetInfo> {
  const { address, secretKey } = await getSenderAccount()
  const algod = getAlgodClient()
  const sp = await algod.getTransactionParams().do()

  const firstValid = BigInt(sp.firstValid ?? sp.lastValid)
  const lastValid = firstValid + 1_000n

  const transaction: Transaction = {
    transactionType: TransactionType.AssetConfig,
    sender: address,
    firstValid,
    lastValid,
    genesisHash: decodeGenesisHash(sp.genesisHash),
    genesisId: sp.genesisID,
    fee: sp.minFee,
    assetConfig: {
      assetId: 0n,
      total: 1_000_000n,
      decimals: 0,
      defaultFrozen: false,
      assetName: 'DummyAsset',
      unitName: 'DUM',
      manager: address,
      reserve: address,
      freeze: address,
      clawback: address,
    },
  }

  const { txId } = await submitTransaction(transaction, algod, secretKey)

  const assetId = (await algod.pendingTransactionInformation(txId).do()).assetIndex as bigint | undefined
  if (!assetId) {
    throw new Error('Asset creation transaction confirmed without returning an asset id')
  }

  return { assetId, txId }
}

export async function createDummyApp(): Promise<CreatedAppInfo> {
  const { address, secretKey } = await getSenderAccount()
  const algod = getAlgodClient()
  const sp = await algod.getTransactionParams().do()

  const approvalProgramSource = '#pragma version 8\nint 1'
  const clearProgramSource = '#pragma version 8\nint 1'

  const compile = async (source: string) => {
    const result = await algod.compile(source).do()
    return new Uint8Array(Buffer.from(result.result, 'base64'))
  }

  const approvalProgram = await compile(approvalProgramSource)
  const clearProgram = await compile(clearProgramSource)

  const firstValid = BigInt(sp.firstValid ?? sp.lastValid)
  const lastValid = firstValid + 1_000n

  const transaction: Transaction = {
    transactionType: TransactionType.AppCall,
    sender: address,
    firstValid,
    fee: sp.minFee,
    lastValid,
    genesisHash: decodeGenesisHash(sp.genesisHash),
    genesisId: sp.genesisID,
    appCall: {
      appId: 0n,
      onComplete: OnApplicationComplete.NoOp,
      approvalProgram,
      clearStateProgram: clearProgram,
      globalStateSchema: {
        numUints: 1,
        numByteSlices: 1,
      },
      localStateSchema: {
        numUints: 0,
        numByteSlices: 0,
      },
    },
  }

  const { txId } = await submitTransaction(transaction, algod, secretKey)

  const appId = (await algod.pendingTransactionInformation(txId).do()).applicationIndex
  if (!appId) {
    throw new Error('Application creation transaction confirmed without returning an app id')
  }

  return { appId, txId }
}

export function getIndexerEnv(): IndexerTestConfig {
  return {
    indexerBaseUrl: process.env.INDEXER_BASE_URL ?? 'http://localhost:8980',
    indexerApiToken: process.env.INDEXER_API_TOKEN ?? 'a'.repeat(64),
  }
}

export function maybeDescribe(name: string, fn: (env: IndexerTestConfig) => void) {
  describe(name, () => fn(getIndexerEnv()))
}

export async function waitForIndexerTransaction(indexer: IndexerClient, txId: string): Promise<void> {
  await runWhenIndexerCaughtUp(async () => {
    await indexer.lookupTransaction(txId)
  })
}
