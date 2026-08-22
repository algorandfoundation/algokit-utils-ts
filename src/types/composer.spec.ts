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

describe('TransactionComposer sender signer account', () => {
  const fixedSuggestedParams = (): algosdk.SuggestedParams => ({
    fee: 1000n,
    firstValid: 1000n,
    lastValid: 2000n,
    genesisHash: new Uint8Array(32),
    genesisID: 'testnet-v1.0',
    minFee: 1000n,
    flatFee: true,
  })

  test('uses addr and signer when sender is a TransactionSignerAccount', async () => {
    const account = algosdk.generateAccount()
    const sender = {
      addr: account.addr,
      signer: algosdk.makeBasicAccountTransactionSigner(account),
    }
    const composer = new TransactionComposer({
      algod: {} as algosdk.Algodv2,
      getSuggestedParams: async () => fixedSuggestedParams(),
      getSigner: () => {
        throw new Error(`No signer found for address ${sender}`)
      },
    })

    composer.addPayment({
      sender,
      receiver: sender,
      amount: microAlgo(1),
    })

    const { transactions } = await composer.build()
    expect(transactions).toHaveLength(1)
    expect(transactions[0].txn.sender.toString()).toBe(account.addr.toString())
    expect(transactions[0].txn.payment?.receiver.toString()).toBe(account.addr.toString())
  })
})
