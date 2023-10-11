import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import * as algokit from './'
import { algos, microAlgos } from './amount'
import { optIn, optOut } from './asset'
import { algorandFixture } from './testing'
import { ensureFunds, generateTestAsset } from './testing/asset'
import { ensureFunded } from './transfer'

describe('asset', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 100_000)

  test('OptIn of an asset to an account succeed', async () => {
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

  test('OptIn of an asset to an account second attempt failed ', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 1)
    const secondAccount = algosdk.generateAccount()

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(1)

    await expect(optIn(algod, secondAccount, dummyAssetId)).rejects.toThrow(
      `Account ${secondAccount.addr} have already opt-in to asset ${dummyAssetId}`,
    )
  })

  test('OptOut of an asset to an account succeed', async () => {
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

    await optOut(algod, secondAccount, dummyAssetIds)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  })

  test('OptOut of an not opt-in asset to an account failed ', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, 1234567, -132]
    const secondAccount = algosdk.generateAccount()

    await ensureFunds(algod, secondAccount, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(1)

    await expect(optOut(algod, secondAccount, dummyAssetIds)).rejects.toThrow(
      'Assets 1234567, -132 cannot be opted out. Ensure that they are valid and that the account has previously opted into them.',
    )

    const secondAccountInfoAfterFailedOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterFailedOptOut['total-assets-opted-in']).toBe(1)
  })

  test('OptOut of an non-zero balance asset to an account failed ', async () => {
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

    await expect(optOut(algod, secondAccount, dummyAssetIds)).rejects.toThrow(
      `Assets ${dummyAssetId} cannot be opted out. Ensure that they are valid and that the account has previously opted into them.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterFailedOptOut['total-assets-opted-in']).toBe(2)
  })

  test('OptOut of an two batches of asset to an account succeed', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetIds: number[] = []
    const secondAccount = algosdk.generateAccount()
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algod, testAccount, 0)
      dummyAssetIds.push(dummyAssetId)
      await ensureFunded(
        {
          accountToFund: secondAccount,
          minSpendingBalance: microAlgos(1),
          minFundingIncrement: algos(3),
        },
        algod,
        kmd,
      )
      await optIn(algod, secondAccount, dummyAssetId)
    }

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(20)

    await optOut(algod, secondAccount, dummyAssetIds)

    const secondAccountInfoAfterOptOut = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfoAfterOptOut['total-assets-opted-in']).toBe(0)
  }, 10e6)
})
