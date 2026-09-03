import algosdk from 'algosdk'
import { Buffer } from 'buffer'
import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'
import { AlgoAmount } from './amount'

describe('TransactionComposer', () => {
  const fixture = algorandFixture()

  beforeEach(async () => {
    await fixture.beforeEach()
  })

  describe('error transformers', () => {
    const errorTransformers = [
      async (e: Error) => {
        if (e.message.includes('missing from')) {
          return new Error('ASSET MISSING???')
        }

        return e
      },
      async (e: Error) => {
        if (e.message == 'ASSET MISSING???') {
          return new Error('ASSET MISSING!')
        }

        return e
      },
    ]

    test('throws correct error from simulate', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const composer = algorand.newGroup()

      composer.addAssetTransfer({
        amount: 1n,
        assetId: 1337n,
        sender,
        receiver: sender,
      })

      errorTransformers.forEach((errorTransformer) => {
        composer.registerErrorTransformer(errorTransformer)
      })

      await expect(composer.simulate()).rejects.toThrow('ASSET MISSING!')
    })

    test('throws correct error from send', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const composer = algorand.newGroup()

      composer.addAssetTransfer({
        amount: 1n,
        assetId: 1337n,
        sender,
        receiver: sender,
      })

      errorTransformers.forEach((errorTransformer) => {
        composer.registerErrorTransformer(errorTransformer)
      })

      await expect(composer.send()).rejects.toThrow('ASSET MISSING!')
    })
  })

  describe('signers that mutate transactions', () => {
    const note = new TextEncoder().encode('mutated by the wallet')

    /** Return a copy of the transaction with a note added, as a signer that alters what it is given would */
    const withNote = (txn: algosdk.Transaction) => {
      const encodingData = txn.toEncodingData()
      encodingData.set('note', note)
      return algosdk.Transaction.fromEncodingData(encodingData)
    }

    test('should use the mutated transaction when waiting for confirmation of a single transaction', async () => {
      const { algorand, testAccount: sender } = fixture.context

      let builtTxId: string | undefined
      const mutatingSigner: algosdk.TransactionSigner = async (group, indexes) => {
        builtTxId = group[0].txID()
        return await algorand.account.getSigner(sender)(group.map(withNote), indexes)
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: mutatingSigner,
      })

      const result = await composer.send()

      expect(result.transactions[0].note).toEqual(note)
      expect(result.txIds[0]).not.toBe(builtTxId)
      expect(result.txIds[0]).toBe(result.transactions[0].txID())
      expect(result.confirmations).toHaveLength(1)
      expect(result.confirmations[0].txn.txn.txID()).toBe(result.txIds[0])
    })

    test('should use the mutated transactions when waiting for confirmation of a group', async () => {
      const { algorand, testAccount: sender } = fixture.context

      let builtTxIds: string[] = []
      let builtGroupId: string | undefined
      const mutatingSigner: algosdk.TransactionSigner = async (group, indexes) => {
        builtTxIds = group.map((txn) => txn.txID())
        builtGroupId = Buffer.from(group[0].group!).toString('base64')
        // A signer that mutates a grouped transaction must regroup, as the group ID no longer matches
        const mutated = group.map(withNote)
        mutated.forEach((txn) => (txn.group = undefined))
        return await algorand.account.getSigner(sender)(algosdk.assignGroupID(mutated), indexes)
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: mutatingSigner,
      })
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(2000),
        signer: mutatingSigner,
      })

      const result = await composer.send()

      expect(result.txIds).toHaveLength(2)
      expect(result.txIds).not.toEqual(builtTxIds)
      expect(result.txIds).toEqual(result.transactions.map((txn) => txn.txID()))
      expect(result.groupId).not.toBe(builtGroupId)
      expect(result.groupId).toBe(Buffer.from(result.transactions[0].group!).toString('base64'))
      expect(result.confirmations.map((c) => c.txn.txn.txID())).toEqual(result.txIds)
    })

    test('should report the mutated transaction IDs from simulate', async () => {
      const { algorand, testAccount: sender } = fixture.context

      let builtTxId: string | undefined
      const mutatingSigner: algosdk.TransactionSigner = async (group, indexes) => {
        builtTxId = group[0].txID()
        return await algorand.account.getSigner(sender)(group.map(withNote), indexes)
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: mutatingSigner,
      })

      const result = await composer.simulate()

      expect(result.transactions[0].note).toEqual(note)
      expect(result.txIds[0]).not.toBe(builtTxId)
      expect(result.txIds[0]).toBe(result.transactions[0].txID())
    })
  })
})
