import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { OptOut, optIn } from './asset'
import { algorandFixture } from './testing'
import { ensureFunds, generateTestAsset } from './testing/asset'

describe('asset', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  test('OptIn', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 1)
    const secondAccount = algosdk.generateAccount()

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(0)

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    const testAccountInfoAfterOptIn = await algod.accountInformation(secondAccount.addr).do()
    expect(testAccountInfoAfterOptIn['total-assets-opted-in']).toBe(1)
  })

  test('OptIn twice', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 1)
    const secondAccount = algosdk.generateAccount()

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(1)

    await expect(async () => await await optIn(algod, secondAccount, dummyAssetId)).rejects.toThrow(
      `Account ${secondAccount.addr} have already opt-in to asset ${dummyAssetId}`,
    )
  })

  test('OptOut', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = algosdk.generateAccount()

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId2)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(2)

    await OptOut(algod, secondAccount, dummyAssetIds)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  })
})
