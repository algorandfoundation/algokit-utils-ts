import algosdk from 'algosdk'
import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'

describe('TransactionComposer', () => {
  const fixture = algorandFixture()

  beforeEach(async () => {
    await fixture.beforeEach()
  })

  test('infers extra pages for ABI creation when extraProgramPages is undefined', async () => {
    const { algorand, testAccount } = fixture.context
    const transaction = await algorand.createTransaction.appCreateMethodCall({
      sender: testAccount,
      method: new algosdk.ABIMethod({ name: 'create', args: [], returns: { type: 'void' } }),
      approvalProgram: new Uint8Array(2049),
      clearStateProgram: new Uint8Array(),
      extraProgramPages: undefined,
    })

    expect(transaction.transactions.at(-1)?.applicationCall?.extraPages).toBe(1)
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
})
