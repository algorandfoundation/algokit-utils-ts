import * as ed from '@noble/ed25519'
import { expect } from 'vitest'
import {
  SignedTransaction,
  assignFee,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransaction,
  encodeTransactionRaw,
  estimateTransactionSize,
  getEncodedTransactionType,
} from '../src'
import { TransactionTestData } from './common'

// Helper to decode base64 to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

// Helper to get the private key from signer info
// Note: The SK in the JSON is 64 bytes (Go's ed25519 format: 32-byte seed + 32-byte public key)
// @noble/ed25519 expects just the 32-byte seed
const getPrivateKey = (testData: TransactionTestData): Uint8Array => {
  if (testData.signer.singleSigner) {
    const fullKey = base64ToUint8Array(testData.signer.singleSigner.SK)
    return fullKey.slice(0, 32) // Return only the seed portion
  }
  throw new Error('No single signer available for this test data')
}

export const assertExample = async (label: string, testData: TransactionTestData) => {
  if (!testData.signer.singleSigner) {
    // Skip tests that require single signer when not available
    return
  }
  const privateKey = getPrivateKey(testData)
  // encodeTransaction adds "TX" prefix which is required for signing
  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    sig: await ed.signAsync(encodeTransaction(testData.transaction), privateKey),
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)
  expect(encodedSignedTxn, label).toEqual(testData.signedBytes)
}

export const assertTransactionId = (label: string, testData: TransactionTestData) => {
  expect(testData.transaction.txId(), label).toEqual(testData.id)
}

export const assertEncodedTransactionType = (label: string, testData: TransactionTestData) => {
  // unsignedBytes is raw msgpack (no TX prefix), getEncodedTransactionType expects raw bytes
  expect(getEncodedTransactionType(testData.unsignedBytes), label).toBe(testData.transaction.type)
}

export const assertDecodeWithoutPrefix = (label: string, testData: TransactionTestData) => {
  // unsignedBytes is already raw msgpack without prefix, so decode directly
  const decoded = decodeTransaction(testData.unsignedBytes)
  expect(decoded, label).toEqual(testData.transaction)
}

export const assertDecodeWithPrefix = (label: string, testData: TransactionTestData) => {
  // Test that decode works with TX prefix - add the prefix to raw bytes
  const prefixBytes = new TextEncoder().encode('TX')
  const withPrefix = new Uint8Array(prefixBytes.length + testData.unsignedBytes.length)
  withPrefix.set(prefixBytes)
  withPrefix.set(testData.unsignedBytes, prefixBytes.length)
  const decoded = decodeTransaction(withPrefix)
  expect(decoded, label).toEqual(testData.transaction)
}

export const assertEncodeWithSignature = async (label: string, testData: TransactionTestData) => {
  if (!testData.signer.singleSigner) {
    // Skip tests that require single signer when not available
    return
  }
  const privateKey = getPrivateKey(testData)
  // Signing requires "TX" prefix, so use encodeTransaction
  const sig = await ed.signAsync(encodeTransaction(testData.transaction), privateKey)
  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    sig: sig,
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)

  expect(encodedSignedTxn, label).toEqual(testData.signedBytes)
}

export const assertEncode = (label: string, testData: TransactionTestData) => {
  // unsignedBytes is raw msgpack without prefix, use encodeTransactionRaw to match
  expect(encodeTransactionRaw(testData.transaction), label).toEqual(testData.unsignedBytes)
}

export const assertAssignFee = (label: string, testData: TransactionTestData) => {
  const minFee = BigInt(2000)
  const txnWithFee1 = assignFee(testData.transaction, { feePerByte: 0n, minFee })
  expect(txnWithFee1.fee, label).toEqual(minFee)

  const extraFee = BigInt(3000)
  const txnWithFee2 = assignFee(testData.transaction, { feePerByte: 0n, minFee, extraFee })
  expect(txnWithFee2.fee, label).toEqual(minFee + extraFee)

  const feePerByte = BigInt(100)
  const txnWithFee3 = assignFee(testData.transaction, { feePerByte, minFee: 1000n })
  const txnSize = estimateTransactionSize(testData.transaction)
  expect(txnWithFee3.fee, label).toEqual(txnSize * feePerByte)
}
