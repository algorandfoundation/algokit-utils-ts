import * as ed from '@noble/ed25519'
import { describe, expect, test } from 'vitest'
import { testData } from './common'
import {
  decodeSignedTransactions,
  encodeSignedTransaction,
  encodeSignedTransactions,
  SignedTransaction,
} from '../src/transactions/signed-transaction'
import { decodeTransactions, encodeTransaction, encodeTransactions, groupTransactions } from '../src/transactions/transaction'

const simplePayment = testData.simplePayment
const optInAssetTransfer = testData.optInAssetTransfer

const simpleGroup = () => {
  const expectedGroupId = Uint8Array.from([
    202, 79, 82, 7, 197, 237, 213, 55, 117, 226, 131, 74, 221, 85, 86, 215, 64, 133, 212, 7, 58, 234, 248, 162, 222, 53, 161, 29, 141, 101,
    133, 49,
  ])
  const txs = [simplePayment.transaction, optInAssetTransfer.transaction]

  return {
    txs,
    expectedGroupId,
  }
}

describe('Transaction Group', () => {
  // Polytest Suite: Transaction Group

  describe('Transaction Group Tests', () => {
    // Polytest Group: Transaction Group Tests

    test("group transactions", () => {
      const { txs, expectedGroupId } = simpleGroup()
      const groupedTxs = groupTransactions(txs)

      expect(groupedTxs.length).toBe(txs.length)
      for (let i = 0; i < txs.length; i++) {
        expect(txs[i].group).toBeUndefined()
        expect(groupedTxs[i].group).toEqual(expectedGroupId)
      }
    })

    test("encode transactions", () => {
      const { txs } = simpleGroup()
      const groupedTxs = groupTransactions(txs)

      const encodedGroupedTxs = encodeTransactions(groupedTxs)

      expect(encodedGroupedTxs.length).toBe(txs.length)
      for (let i = 0; i < encodedGroupedTxs.length; i++) {
        expect(encodedGroupedTxs[i]).toEqual(encodeTransaction(groupedTxs[i]))
      }

      const decodedGroupedTxs = decodeTransactions(encodedGroupedTxs)
      expect(decodedGroupedTxs).toEqual(groupedTxs)
    })

    test("encode signed transactions", async () => {
      const { txs } = simpleGroup()
      const groupedTxs = groupTransactions(txs)
      const encodedGroupedTxs = encodeTransactions(groupedTxs)
      const txSignatures = [
        await ed.signAsync(encodedGroupedTxs[0], simplePayment.signingPrivateKey),
        await ed.signAsync(encodedGroupedTxs[1], optInAssetTransfer.signingPrivateKey),
      ]

      const signedGroupedTxs = groupedTxs.map((tx, i) => {
        return {
          transaction: tx,
          signature: txSignatures[i],
        } as SignedTransaction
      })

      const encodedSignedGroupedTxs = encodeSignedTransactions(signedGroupedTxs)

      expect(encodedSignedGroupedTxs.length).toBe(txs.length)
      for (let i = 0; i < encodedSignedGroupedTxs.length; i++) {
        expect(encodedSignedGroupedTxs[i]).toEqual(
          encodeSignedTransaction({
            transaction: groupedTxs[i],
            signature: txSignatures[i],
          }),
        )
      }

      const decodedSignedGroupedTxs = decodeSignedTransactions(encodedSignedGroupedTxs)
      expect(decodedSignedGroupedTxs).toEqual(signedGroupedTxs)
    })
  })
})
