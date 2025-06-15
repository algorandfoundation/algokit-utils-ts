import algosdk from 'algosdk'
import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../algokit-core-bridge/algorand-fixture'
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

  describe('payment transaction groups', () => {
    const amount = AlgoAmount.Algo(0.01)

    test('send single', async () => {
      const { algorand, testAccount: sender, generateAccount } = fixture.context
      const receiver = await generateAccount({ initialFunds: AlgoAmount.Algo(1) })

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver,
          amount,
        })
        .send()

      expect(result.groupId).toBeFalsy() // A single transaction is not grouped
      expect(result.txIds).toHaveLength(1)

      expect(result.transactions).toHaveLength(1)
      expect(result.transactions[0].type).toBe(algosdk.TransactionType.pay)
      expect(result.transactions[0].sender.toString()).toBe(sender.toString())
      expect(result.transactions[0].payment?.receiver?.toString()).toBe(receiver.toString())
      expect(result.transactions[0].payment?.amount).toBe(amount.microAlgo)
      expect(result.transactions[0].group).toBeFalsy()

      expect(result.confirmations).toHaveLength(1)
      expect(result.confirmations[0].confirmedRound).toBeGreaterThan(0n)
    })

    test('simulate single', async () => {
      const { algorand, testAccount: sender, generateAccount } = fixture.context
      const receiver = await generateAccount({ initialFunds: AlgoAmount.Algo(1) })

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver,
          amount,
        })
        .simulate()

      expect(result.groupId).toBeFalsy() // A single transaction is not grouped
      expect(result.txIds).toHaveLength(1)

      expect(result.simulateResponse).toBeDefined()
      expect(result.simulateResponse.txnGroups).toHaveLength(1)

      expect(result.transactions).toHaveLength(1)
      expect(result.transactions[0].type).toBe(algosdk.TransactionType.pay)
      expect(result.transactions[0].sender.toString()).toBe(sender.toString())
      expect(result.transactions[0].payment?.receiver?.toString()).toBe(receiver.toString())
      expect(result.transactions[0].payment?.amount).toBe(amount.microAlgo)
      expect(result.transactions[0].group).toBeFalsy()

      expect(result.confirmations).toHaveLength(1)
      expect(result.confirmations[0].confirmedRound).toBeUndefined()
    })

    test('send multiple', async () => {
      const { algorand, testAccount: sender, generateAccount } = fixture.context
      const receiver = await generateAccount({ initialFunds: AlgoAmount.Algo(1) })

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver,
          amount,
          note: 'Payment 1',
        })
        .addPayment({
          sender,
          receiver,
          amount,
          note: 'Payment 2',
        })
        .send()

      expect(result.groupId).toBeTruthy()
      expect(result.txIds).toHaveLength(2)

      expect(result.transactions).toHaveLength(2)
      result.transactions.forEach((txn) => {
        expect(txn.type).toBe(algosdk.TransactionType.pay)
        expect(txn.sender.toString()).toBe(sender.toString())
        expect(txn.payment?.receiver?.toString()).toBe(receiver.toString())
        expect(txn.payment?.amount).toBe(amount.microAlgo)
        expect(txn.group).toBeTruthy()
        expect(Buffer.from(txn.group!).toString('base64')).toBe(result.groupId)
      })

      expect(result.confirmations).toHaveLength(2)
      result.confirmations.forEach((confirmation) => {
        expect(confirmation.confirmedRound).toBeGreaterThan(0n)
      })
    })

    test('simulate multiple', async () => {
      const { algorand, testAccount: sender, generateAccount } = fixture.context
      const receiver = await generateAccount({ initialFunds: AlgoAmount.Algo(1) })

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver,
          amount,
          note: 'Simulated payment 1',
        })
        .addPayment({
          sender,
          receiver,
          amount,
          note: 'Simulated payment 2',
        })
        .simulate()

      expect(result.groupId).toBeTruthy()
      expect(result.txIds).toHaveLength(2)

      expect(result.simulateResponse).toBeDefined()
      expect(result.simulateResponse.txnGroups).toHaveLength(1)

      expect(result.transactions).toHaveLength(2)
      result.transactions.forEach((txn) => {
        expect(txn.type).toBe(algosdk.TransactionType.pay)
        expect(txn.sender.toString()).toBe(sender.toString())
        expect(txn.payment?.receiver?.toString()).toBe(receiver.toString())
        expect(txn.payment?.amount).toBe(amount.microAlgo)
        expect(txn.group).toBeTruthy()
        expect(Buffer.from(txn.group!).toString('base64')).toBe(result.groupId)
      })

      expect(result.confirmations).toHaveLength(2)
      result.confirmations.forEach((confirmation) => {
        expect(confirmation.confirmedRound).toBeUndefined()
      })
    })

    test('simulate with skipSignatures', async () => {
      const { algorand, testAccount: sender, generateAccount } = fixture.context
      const receiver = await generateAccount({ initialFunds: AlgoAmount.Algo(1) })

      const result = await algorand
        .newGroup()
        .addPayment({
          sender,
          receiver,
          amount,
          // Attach a signer, which produces an invalid signature
          signer: () => {
            return Promise.resolve([new Uint8Array([1, 2, 3])])
          },
        })
        .simulate({ skipSignatures: true })

      expect(result.simulateResponse).toBeDefined()
      expect(result.simulateResponse.txnGroups).toHaveLength(1)

      expect(result.transactions).toHaveLength(1)

      expect(result.confirmations).toHaveLength(1)
    })
  })
})
