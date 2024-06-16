import { describe, test } from '@jest/globals'
import invariant from 'tiny-invariant'
import * as algokit from './'
import { algorandFixture } from './testing'
import { generateTestAsset } from './testing/_asset'

describe('asset', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 100_000)

  test('Create an asset succeeds', async () => {
    const { algod, testAccount, algorand } = localnet.context
    const accounts = [algorand.account.random(), algorand.account.random(), algorand.account.random(), algorand.account.random()]
    const hash = new Uint8Array(32).fill(1)
    const result = await algokit.createAsset(
      {
        creator: testAccount,
        total: 1000,
        decimals: 0,
        name: 'Test Asset',
        unit: 'TEST',
        url: 'https://example.com',
        metadataHash: hash,
        manager: accounts[0].addr,
        reserveAccount: accounts[1].addr,
        freezeAccount: accounts[2].addr,
        clawbackAccount: accounts[3].addr,
        frozenByDefault: true,
      },
      algod,
    )

    expect(result.confirmation?.assetIndex).toBeGreaterThan(0)
    invariant(result.confirmation)
    invariant(typeof result.confirmation!.assetIndex! === 'number')
    const assetData = await algod.getAssetByID(result.confirmation.assetIndex).do()
    expect(assetData.params.total).toBe(1000)
    expect(assetData.params.decimals).toBe(0)
    expect(assetData.params['default-frozen']).toBe(true)
    expect(assetData.params['unit-name']).toBe('TEST')
    expect(assetData.params.name).toBe('Test Asset')
    expect(assetData.params.url).toBe('https://example.com')
    expect(assetData.params['metadata-hash']).toBe(Buffer.from(hash).toString('base64'))
    expect(assetData.params.manager).toBe(accounts[0].addr)
    expect(assetData.params.reserve).toBe(accounts[1].addr)
    expect(assetData.params.freeze).toBe(accounts[2].addr)
    expect(assetData.params.clawback).toBe(accounts[3].addr)
  })

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
      `Account ${secondAccount.addr} is not opted-in to Assets 1234567, -132; can't opt-out.`,
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
      `Account ${secondAccount.addr} has non-zero balance for Asset ${dummyAssetId}; can't opt-out.`,
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
      `Account ${secondAccount.addr} does not have a zero balance for Asset ${dummyAssetId}; can't opt-out.`,
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
