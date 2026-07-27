import * as fs from 'fs'
import * as path from 'path'
import { describe, expect, test } from 'vitest'
import { decodeSignedTransaction, encodeSignedTransactions, encodeTransactionRaw, groupTransactions, Transaction } from '../src'
import { base64ToUint8Array, testData } from './common'

const dataDir = path.join(__dirname, 'polytest_resources/data-factory/data')

type TxGroupTestData = {
  groupID: string
  stxnBlobs: string[]
  txnBlobs: string[]
  txns: string[]
}

const txGroupData: TxGroupTestData = JSON.parse(fs.readFileSync(path.join(dataDir, 'txGroup.json'), 'utf-8'))

const expectedTxnBlobs = txGroupData.txnBlobs.map(base64ToUint8Array)

const expectedStxnBlobs = txGroupData.stxnBlobs.map(base64ToUint8Array)

const signedTransactionsWithGroup = expectedStxnBlobs.map(decodeSignedTransaction)
const transactionsWithGroup = signedTransactionsWithGroup.map((stxn) => stxn.txn)

const sourceTransactions = txGroupData.txns.map((txnKey) => {
  const data = testData[txnKey as keyof typeof testData]
  // Create a new transaction without the group field
  return new Transaction({
    ...data.transaction,
    group: undefined,
  })
})

describe('Transaction Group', () => {
  // Polytest Suite: Transaction Group

  describe('Transaction Group Tests', () => {
    // Polytest Group: Transaction Group Tests

    test('encode signed transactions', () => {
      const encodedStxns = encodeSignedTransactions(signedTransactionsWithGroup)
      expect(encodedStxns).toEqual(expectedStxnBlobs)
    })

    test('encode transactions', () => {
      const encodedTxns = transactionsWithGroup.map(encodeTransactionRaw)
      expect(encodedTxns).toEqual(expectedTxnBlobs)
    })

    test('group transactions', () => {
      const groupedTransactions = groupTransactions(sourceTransactions)

      for (let i = 0; i < groupedTransactions.length; i++) {
        expect(groupedTransactions[i].group).toEqual(transactionsWithGroup[i].group)
      }

      const encodedTxns = groupedTransactions.map(encodeTransactionRaw)
      expect(encodedTxns).toEqual(expectedTxnBlobs)
    })
  })
})
