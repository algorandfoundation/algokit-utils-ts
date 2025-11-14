import { getABIMethod } from '@algorandfoundation/algokit-abi'
import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'
import { AlgoAmount } from './amount'

describe('TransactionComposer', () => {
  const fixture = algorandFixture()

  beforeEach(async () => {
    await fixture.newScope()
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

  describe('clone composers', () => {
    test('async transaction argument can be cloned correctly', async () => {
      const { algorand, context } = fixture

      const testAccount = context.testAccount

      const composer1 = context.algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })
      composer1.addAppCallMethodCall({
        appId: 123n,
        sender: testAccount,
        method: getABIMethod('createBoxInNewApp(pay)void'),
        args: [
          algorand.createTransaction.payment({
            sender: testAccount,
            receiver: testAccount,
            amount: AlgoAmount.Algos(1),
          }),
        ],
      })

      const composer2 = composer1.clone()
      composer2.addPayment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(2),
      })

      const composer2Transactions = (await composer2.build()).transactions
      expect(composer2Transactions[0].txn.group).toBeDefined()

      const composer1Transactions = (await composer1.build()).transactions
      expect(composer1Transactions[0].txn.group).toBeDefined()

      expect(composer2Transactions[0].txn.group).not.toEqual(composer1Transactions[0].txn.group)
    })

    test('transaction argument can be cloned correctly', async () => {
      const { algorand, context } = fixture

      const testAccount = context.testAccount
      const paymentTxn = await algorand.createTransaction.payment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(1),
      })

      const composer1 = context.algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })
      composer1.addAppCallMethodCall({
        appId: 123n,
        sender: testAccount,
        method: getABIMethod('createBoxInNewApp(pay)void'),
        args: [paymentTxn],
      })

      const composer2 = composer1.clone()
      composer2.addPayment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(2),
      })

      const composer2Transactions = (await composer2.build()).transactions
      expect(composer2Transactions[0].txn.group).toBeDefined()

      const composer1Transactions = (await composer1.build()).transactions
      expect(composer1Transactions[0].txn.group).toBeDefined()

      expect(composer2Transactions[0].txn.group).not.toEqual(composer1Transactions[0].txn.group)
      expect(paymentTxn.group).toEqual(composer1Transactions[0].txn.group)
    })
  })
})
