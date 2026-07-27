import * as fs from 'fs'
import * as path from 'path'
import { Transaction, transactionParamsCodec } from '../src'

const dataDir = path.join(__dirname, 'polytest_resources/data-factory/data')

export type SignerInfo = {
  singleSigner?: { SK: string; SignatureVerifier: string }
  msigSigners?: Array<{ SK: string; SignatureVerifier: string }>
  lsig?: string
}

type RawTestData = {
  id: string
  signer: SignerInfo
  stxn: { txn: Record<string, unknown> }
  txnBlob: string
  stxnBlob: string
}

// Helper to read individual test data file
const readTestDataFile = (filename: string): RawTestData => {
  const filePath = path.join(dataDir, `${filename}.json`)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawTestData
}

// Helper to decode base64 to Uint8Array
export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export type TransactionTestData = {
  id: string
  transaction: Transaction
  unsignedBytes: Uint8Array
  signedBytes: Uint8Array
  signer: SignerInfo
}

type TestDataKeys =
  | 'simplePayment'
  | 'optInAssetTransfer'
  | 'simpleAssetTransfer'
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
  | 'lsigPayment'
  | 'msigPayment'
  | 'msigDelegatedPayment'
  | 'singleDelegatedPayment'

const testDataKeys: TestDataKeys[] = [
  'simplePayment',
  'optInAssetTransfer',
  'simpleAssetTransfer',
  'assetCreate',
  'assetDestroy',
  'assetConfig',
  'appCall',
  'appCreate',
  'appUpdate',
  'appDelete',
  'onlineKeyRegistration',
  'offlineKeyRegistration',
  'nonParticipationKeyRegistration',
  'assetFreeze',
  'assetUnfreeze',
  'heartbeat',
  'stateProof',
  'lsigPayment',
  'msigPayment',
  'msigDelegatedPayment',
  'singleDelegatedPayment',
]

export const testData: Record<TestDataKeys, TransactionTestData> = Object.fromEntries(
  testDataKeys.map((key) => {
    const value = readTestDataFile(key)
    return [
      key,
      {
        id: value.id,
        transaction: new Transaction(transactionParamsCodec.decode(value.stxn.txn, 'json')),
        unsignedBytes: base64ToUint8Array(value.txnBlob),
        signedBytes: base64ToUint8Array(value.stxnBlob),
        signer: value.signer,
      },
    ]
  }),
) as Record<TestDataKeys, TransactionTestData>
