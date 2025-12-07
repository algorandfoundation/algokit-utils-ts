/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from '@algorandfoundation/algokit-common'
import * as fs from 'fs'
import * as path from 'path'
import { OnApplicationComplete, Transaction, TransactionParams, TransactionType } from '../src'
import { Reveal, SigslotCommit } from '../src/transactions/state-proof'

const jsonString = fs.readFileSync(path.join(__dirname, 'test_data.json'), 'utf-8')

const BIGINT_FIELDS = [
  'fee',
  'amount',
  'firstValid',
  'lastValid',
  'assetId',
  'total',
  'appId',
  'voteFirst',
  'voteLast',
  'voteKeyDilution',
  'keyDilution',
  'lnProvenWeight',
  'firstAttestedRound',
  'lastAttestedRound',
  'signedWeight',
  'weight',
  'keyLifetime',
  'vectorCommitmentIndex',
  'lowerSigWeight',
]

const transactionTypes = Object.fromEntries(Object.entries(TransactionType).map(([key, value]) => [key, value]))
const onApplicationCompleteTypes = Object.fromEntries(Object.entries(OnApplicationComplete).map(([key, value]) => [key, value]))

const defaultReviver = (key: string, value: unknown) => {
  if (Array.isArray(value) && value.every((n) => typeof n === 'number')) {
    // keys that should be arrays of BigInts
    if (key === 'assetReferences' || key === 'appReferences' || key === 'positionsToReveal') {
      return value.map((n) => BigInt(n))
    }

    return new Uint8Array(value)
  }

  const addrKeys = [
    'sender',
    'receiver',
    'closeRemainderTo',
    'rekeyTo',
    'address',
    'freezeTarget',
    'manager',
    'reserve',
    'clawback',
    'freeze',
  ]
  if (addrKeys.includes(key)) {
    return Address.fromString(value as string)
  }

  if (key == 'accountReferences') {
    return (value as string[]).map((addr: string) => Address.fromString(addr))
  }

  if (typeof value === 'number' && BIGINT_FIELDS.includes(key)) {
    return BigInt(value)
  }

  // Handle assetFreeze objects - ensure frozen field defaults to false if missing
  // The Rust side uses #[serde(default)] on the frozen field, which means:
  // 1. When serializing, false values may be omitted from JSON
  // 2. When deserializing, missing values default to false
  if (key === 'assetFreeze' && typeof value === 'object' && value !== null) {
    const assetFreeze = value as any
    if (assetFreeze.frozen === undefined) {
      assetFreeze.frozen = false
    }
    return assetFreeze
  }

  if (key === 'reveals' && Array.isArray(value)) {
    const revealsMap = new Map<bigint, Reveal>()
    const reveals = value as (Reveal & { position: bigint })[]
    reveals.forEach((reveal) => {
      const { position, ...revealWithoutPosition } = reveal
      revealsMap.set(BigInt(reveal.position ?? 0n), revealWithoutPosition)

      if (reveal.position === undefined) {
        reveal.position = 0n
      }
    })

    value = revealsMap
  }

  if (key === 'sigslot' && typeof value === 'object' && value !== null) {
    const sigSlot = value as SigslotCommit
    if (sigSlot.lowerSigWeight === undefined) {
      sigSlot.lowerSigWeight = 0n
    }
  }

  if (key === 'type') {
    return transactionTypes[value as keyof typeof transactionTypes] as TransactionType
  }

  if (key === 'onComplete') {
    return onApplicationCompleteTypes[value as keyof typeof onApplicationCompleteTypes] as OnApplicationComplete
  }

  return value
}

export const parseJson = <T = any>(json: string, reviver: (_: string, value: unknown) => unknown = defaultReviver) => {
  return JSON.parse(json, reviver) as T
}

export type TransactionTestData = {
  transaction: Transaction
  id: string
  idRaw: Uint8Array
  unsignedBytes: Uint8Array
  signedBytes: Uint8Array
  signingPrivateKey: Uint8Array
  rekeyedSenderAuthAddress: string
  rekeyedSenderSignedBytes: Uint8Array
  multisigPublicKeys: [Uint8Array, Uint8Array]
  multisigSignedBytes: Uint8Array
}

export type TransactionTestDataRaw = Omit<TransactionTestData, 'transaction'> & {
  transaction: Record<string, unknown>
}

type TestDataKeys =
  | 'simplePayment'
  | 'optInAssetTransfer'
  | 'assetCreate'
  | 'assetDestroy'
  | 'assetConfig'
  | 'appCall'
  | 'appCreate'
  | 'appUpdate'
  | 'appDelete'
  | 'onlineKeyRegistration'
  | 'offlineKeyRegistration'
  | 'nonParticipationKeyRegistration'
  | 'assetFreeze'
  | 'assetUnfreeze'
  | 'heartbeat'
  | 'stateProof'

// Parse raw JSON data
const rawTestData = parseJson<Record<TestDataKeys, TransactionTestDataRaw>>(jsonString)

// Transform raw data to wrap transactions in Transaction class instances
export const testData: Record<TestDataKeys, TransactionTestData> = Object.fromEntries(
  Object.entries(rawTestData).map(([key, value]) => [
    key,
    {
      ...value,
      transaction: new Transaction(value.transaction as unknown as TransactionParams),
    },
  ]),
) as Record<TestDataKeys, TransactionTestData>
