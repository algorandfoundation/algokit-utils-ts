import { Address } from '@algorandfoundation/algokit-common'
import * as ed from '@noble/ed25519'
import { expect } from 'vitest'
import {
  SignedTransaction,
  applyMultisigSubsignature,
  assignFee,
  decodeTransaction,
  encodeSignedTransaction,
  encodeTransaction,
  estimateTransactionSize,
  getEncodedTransactionType,
  mergeMultisignatures,
  newMultisigSignature,
} from '../src'
import { TransactionTestData } from './common'

export const assertExample = async (label: string, testData: TransactionTestData) => {
  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    sig: await ed.signAsync(encodeTransaction(testData.transaction), testData.signingPrivateKey),
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)
  expect(encodedSignedTxn, label).toEqual(testData.signedBytes)
}

export const assertTransactionId = (label: string, testData: TransactionTestData) => {
  expect(testData.transaction.txID(), label).toEqual(testData.id)
}

export const assertEncodedTransactionType = (label: string, testData: TransactionTestData) => {
  expect(getEncodedTransactionType(testData.unsignedBytes), label).toBe(testData.transaction.type)
}

export const assertDecodeWithoutPrefix = (label: string, testData: TransactionTestData) => {
  const decoded = decodeTransaction(testData.unsignedBytes.slice(2))
  expect(decoded, label).toEqual(testData.transaction)
}

export const assertDecodeWithPrefix = (label: string, testData: TransactionTestData) => {
  const decoded = decodeTransaction(testData.unsignedBytes)
  expect(decoded, label).toEqual(testData.transaction)
}

export const assertEncodeWithAuthAddress = async (label: string, testData: TransactionTestData) => {
  const sig = await ed.signAsync(testData.unsignedBytes, testData.signingPrivateKey)
  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    sig: sig,
    authAddress: Address.fromString(testData.rekeyedSenderAuthAddress),
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)

  expect(encodedSignedTxn, label).toEqual(testData.rekeyedSenderSignedBytes)
}

export const assertEncodeWithSignature = async (label: string, testData: TransactionTestData) => {
  const sig = await ed.signAsync(testData.unsignedBytes, testData.signingPrivateKey)
  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    sig: sig,
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)

  expect(encodedSignedTxn, label).toEqual(testData.signedBytes)
}

export const assertEncode = (label: string, testData: TransactionTestData) => {
  expect(encodeTransaction(testData.transaction), label).toEqual(testData.unsignedBytes)
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

export const assertMultisigExample = async (label: string, testData: TransactionTestData) => {
  const singleSig = await ed.signAsync(encodeTransaction(testData.transaction), testData.signingPrivateKey)

  const unsignedMultisigSignature = newMultisigSignature(1, 2, testData.multisigPublicKeys)
  const multisigSignature0 = applyMultisigSubsignature(unsignedMultisigSignature, testData.multisigPublicKeys[0], singleSig)
  const multisigSignature1 = applyMultisigSubsignature(unsignedMultisigSignature, testData.multisigPublicKeys[1], singleSig)

  const multisigSignature = mergeMultisignatures(multisigSignature0, multisigSignature1)

  const signedTxn: SignedTransaction = {
    txn: testData.transaction,
    msig: multisigSignature,
  }
  const encodedSignedTxn = encodeSignedTransaction(signedTxn)

  expect(encodedSignedTxn, label).toEqual(testData.multisigSignedBytes)
}
