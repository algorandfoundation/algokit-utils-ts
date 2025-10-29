/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'
import * as path from 'path'
import { OnApplicationComplete, Transaction, TransactionType } from '../src'
import { Reveal, SigslotCommit, StateProof, StateProofTransactionFields } from '../src/transactions/state-proof'

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

  if (key === 'stateProof' && typeof value === 'object' && value !== null) {
    if (Object.keys(value).includes('stateProof')) {
      const stateProof = value as StateProofTransactionFields
      if (stateProof.stateProofType === undefined) {
        stateProof.stateProofType = 0
      }
      return stateProof
    } else if (Object.keys(value).includes('partProofs')) {
      const stateProof = value as StateProof
      if (stateProof.merkleSignatureSaltVersion === undefined) {
        stateProof.merkleSignatureSaltVersion = 0
      }
      return stateProof
    }
  }

  if (key === 'reveals' && Array.isArray(value)) {
    const reveals = value as Reveal[]
    reveals.forEach((reveal) => {
      if (reveal.position === undefined) {
        reveal.position = 0n
      }
      if (typeof reveal.position === 'number') {
        reveal.position = BigInt(reveal.position)
      }
    })
  }

  if (key === 'sigslot' && typeof value === 'object' && value !== null) {
    const sigSlot = value as SigslotCommit
    if (sigSlot.lowerSigWeight === undefined) {
      sigSlot.lowerSigWeight = 0n
    }
  }

  if (key === 'transactionType') {
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
  multisigAddresses: [string, string]
  multisigSignedBytes: Uint8Array
}

export const testData =
  parseJson<
    Record<
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
      | 'stateProof',
      TransactionTestData
    >
  >(jsonString)
