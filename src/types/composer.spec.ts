import { algorandFixture } from '../testing'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

const fixture = algorandFixture()
describe('TransactionComposer', () => {
  beforeEach(async () => {
    await fixture.beforeEach()
  })

  describe('error map functions', () => {
    const errorMapFunction = async (e: unknown) => {
      let errorString: string
      if (e instanceof Error) {
        errorString = e.message
      } else {
        errorString = JSON.stringify(e)
      }

      if (errorString.includes('missing from')) {
        return new Error('ASSET MISSING!')
      }

      return e
    }

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

      composer.registerErrorMapFunction(errorMapFunction)

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

      composer.registerErrorMapFunction(errorMapFunction)

      await expect(composer.send()).rejects.toThrow('ASSET MISSING!')
    })
  })
})
