import algosdk from 'algosdk'
import { beforeEach, describe, expect, test } from 'vitest'
import { microAlgo } from '../amount'
import { algorandFixture } from '../testing'
import { TransactionComposer } from './composer'

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
})

describe('TransactionComposer duplicate detection', () => {
  const fixedSuggestedParams = (): algosdk.SuggestedParams => ({
    fee: 1000n,
    firstValid: 1000n,
    lastValid: 2000n,
    genesisHash: new Uint8Array(32),
    genesisID: 'testnet-v1.0',
    minFee: 1000n,
    flatFee: true,
  })

  const newComposer = () =>
    new TransactionComposer({
      algod: {} as algosdk.Algodv2,
      getSuggestedParams: async () => fixedSuggestedParams(),
      getSigner: () => algosdk.makeEmptyTransactionSigner(),
    })

  test('throws a helpful error when the group contains identical transactions', async () => {
    const account = algosdk.generateAccount()
    const composer = newComposer()

    composer.addPayment({
      sender: account.addr,
      receiver: account.addr,
      amount: microAlgo(1),
    })
    composer.addPayment({
      sender: account.addr,
      receiver: account.addr,
      amount: microAlgo(1),
    })

    await expect(composer.build()).rejects.toThrow(/duplicate transactions/)
    await expect(composer.buildTransactions()).rejects.toThrow(/suggestedParams are cached/)
    await expect(composer.build()).rejects.toThrow(/note, lease, validityWindow/)
  })

  test('allows identical-looking payments when a differentiating note is provided', async () => {
    const account = algosdk.generateAccount()
    const composer = newComposer()

    composer.addPayment({
      sender: account.addr,
      receiver: account.addr,
      amount: microAlgo(1),
      note: 'a',
    })
    composer.addPayment({
      sender: account.addr,
      receiver: account.addr,
      amount: microAlgo(1),
      note: 'b',
    })

    const { transactions } = await composer.build()
    expect(transactions).toHaveLength(2)
    expect(transactions[0].txn.txID()).not.toEqual(transactions[1].txn.txID())
  })
})
