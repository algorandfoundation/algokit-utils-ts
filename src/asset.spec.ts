import { describe, test } from '@jest/globals'
import * as algokit from './'
import { algorandFixture } from './testing'
import { generateTestAsset } from './testing/_asset'

describe('asset', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 100_000)

  test('OptIn an asset to an account succeed', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 1)
    const dummyAssetIds = [dummyAssetId]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(0)

    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const testAccountInfoAfterOptIn = await algod.accountInformation(secondAccount.addr).do()
    expect(testAccountInfoAfterOptIn['total-assets-opted-in']).toBe(1)
  })

  test('OptIn assets to an account second attempt failed ', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(2)

    // await optIn(algod, secondAccount, dummyAssetIds)
    await expect(algokit.assetBulkOptIn({ account: secondAccount, assetIds: [dummyAssetId] }, algod)).rejects.toThrow(
      `Asset ${dummyAssetId} cannot be opted in. Ensure that they are valid and that the account has not previously opted into them.`,
    )
  }, 10e6)

  test('OptIn two batches of asset to an account succeed', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: number[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algos() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)
    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(20)
  }, 10e6)

  test('OptOut of an asset to an account succeed', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(2)

    await algokit.assetBulkOptOut({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  })

  test('OptOut of an not opt-in asset to an account failed', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, 1234567, -132]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: [dummyAssetId] }, algod)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(1)

    await expect(algokit.assetBulkOptOut({ account: secondAccount, assetIds: dummyAssetIds }, algod)).rejects.toThrow(
      'Assets 1234567, -132 cannot be opted out. Ensure that they are valid and that the account has previously opted into them and holds zero balance.',
    )

    const secondAccountInfoAfterFailedOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterFailedOptOut['total-assets-opted-in']).toBe(1)
  })

  test('Bulk OptOut of an non-zero balance asset to an account failed ', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(2)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      },
      algod,
    )

    await expect(algokit.assetBulkOptOut({ account: secondAccount, assetIds: dummyAssetIds }, algod)).rejects.toThrow(
      `Asset ${dummyAssetId} cannot be opted out. Ensure that they are valid and that the account has previously opted into them and holds zero balance.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterFailedOptOut['total-assets-opted-in']).toBe(2)
  })

  test('OptIn and OptOut of a single asset ', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(1)

    await algokit.assetOptOut({ account: secondAccount, assetId: dummyAssetId }, algod)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  })

  test('OptOut of non-zero balance single asset to an account fails by default', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      },
      algod,
    )

    await expect(algokit.assetOptOut({ account: secondAccount, assetId: dummyAssetId }, algod)).rejects.toThrow(
      `Asset ${dummyAssetId} cannot be opted out. Ensure that they are valid and that the account has previously opted into them and holds zero balance.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterFailedOptOut['total-assets-opted-in']).toBe(1)
  })

  test('OptOut of two batches of asset to an account succeed', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: number[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algos() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algokit.assetBulkOptIn({ account: secondAccount, assetIds: dummyAssetIds }, algod)
    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(20)

    await algokit.assetBulkOptOut({ account: secondAccount, assetIds: dummyAssetIds }, algod)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  }, 10e6)
})
