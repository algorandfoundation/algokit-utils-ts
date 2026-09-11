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

  describe('app update resizing', () => {
    const smallProgram = `#pragma version 10
int 1
return`
    // Needs an extra program page once compiled; the constants are unique so the assembler can't pool them
    const largeProgram = `#pragma version 10
${Array.from({ length: 70 }, (_, i) => `pushbytes "${i.toString().padStart(32, 'x')}"\npop`).join('\n')}
int 1
return`

    const createApp = async (extraProgramPages?: number) => {
      const { algorand, testAccount } = fixture.context
      const { appId } = await algorand.send.appCreate({
        sender: testAccount,
        approvalProgram: smallProgram,
        clearStateProgram: smallProgram,
        schema: { globalInts: 3, globalByteSlices: 2, localInts: 1, localByteSlices: 1 },
        extraProgramPages,
      })
      return appId
    }

    const getSizes = async (appId: bigint) => {
      const app = await fixture.context.algorand.app.getById(appId)
      return { globalInts: app.globalInts, globalByteSlices: app.globalByteSlices, extraPages: app.extraProgramPages ?? 0 }
    }

    test('an update without a resize leaves the app sizes alone', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp(2)

      await algorand.send.appUpdate({
        sender: testAccount,
        appId,
        approvalProgram: smallProgram,
        clearStateProgram: smallProgram,
      })

      expect(await getSizes(appId)).toEqual({ globalInts: 3, globalByteSlices: 2, extraPages: 2 })
    })

    test('an update that needs more pages grows them without dropping the global schema', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp()

      await algorand.send.appUpdate({
        sender: testAccount,
        appId,
        approvalProgram: largeProgram,
        clearStateProgram: smallProgram,
      })

      expect(await getSizes(appId)).toEqual({ globalInts: 3, globalByteSlices: 2, extraPages: 1 })
    })

    test('a resize of the global schema leaves extra pages alone', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp(2)

      await algorand.send.appUpdate({
        sender: testAccount,
        appId,
        approvalProgram: smallProgram,
        clearStateProgram: smallProgram,
        resize: { schema: { globalInts: 5, globalByteSlices: 4 } },
      })

      expect(await getSizes(appId)).toEqual({ globalInts: 5, globalByteSlices: 4, extraPages: 2 })
    })

    test('a resize of extra pages leaves the global schema alone', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp(2)

      await algorand.send.appUpdate({
        sender: testAccount,
        appId,
        approvalProgram: smallProgram,
        clearStateProgram: smallProgram,
        resize: { extraPages: 1 },
      })

      expect(await getSizes(appId)).toEqual({ globalInts: 3, globalByteSlices: 2, extraPages: 1 })
    })

    test('an explicit resize can shrink an app', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp(2)

      await algorand.send.appUpdate({
        sender: testAccount,
        appId,
        approvalProgram: smallProgram,
        clearStateProgram: smallProgram,
        resize: { schema: { globalInts: 1, globalByteSlices: 0 }, extraPages: 0 },
      })

      expect(await getSizes(appId)).toEqual({ globalInts: 1, globalByteSlices: 0, extraPages: 0 })
    })

    test('a resize of everything to zero is rejected', async () => {
      const { algorand, testAccount } = fixture.context
      const appId = await createApp(2)

      await expect(
        algorand.send.appUpdate({
          sender: testAccount,
          appId,
          approvalProgram: smallProgram,
          clearStateProgram: smallProgram,
          resize: { schema: { globalInts: 0, globalByteSlices: 0 }, extraPages: 0 },
        }),
      ).rejects.toThrow(`Can't resize app ${appId} to a global schema of 0 ints and 0 byte slices with 0 extra program pages`)

      expect(await getSizes(appId)).toEqual({ globalInts: 3, globalByteSlices: 2, extraPages: 2 })
    })
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
