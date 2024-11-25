import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'
import { generateTestAsset } from '../testing/_asset'

describe('Asset capability', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 100_000)

  test('Create an asset succeeds', async () => {
    const { testAccount, algorand } = localnet.context
    const accounts = [algorand.account.random(), algorand.account.random(), algorand.account.random(), algorand.account.random()]
    const hash = new Uint8Array(32).fill(1)
    const result = await algorand.send.assetCreate({
      sender: testAccount,
      total: 1000n,
      decimals: 0,
      assetName: 'Test Asset',
      unitName: 'TEST',
      url: 'https://example.com',
      metadataHash: hash,
      manager: accounts[0],
      reserve: accounts[1],
      freeze: accounts[2],
      clawback: accounts[3],
      defaultFrozen: true,
    })

    expect(result.confirmation.assetIndex).toBeGreaterThan(0n)
    const assetData = await algorand.asset.getById(result.assetId)
    expect(assetData.creator).toBe(testAccount.toString())
    expect(assetData.total).toBe(1000n)
    expect(assetData.decimals).toBe(0)
    expect(assetData.defaultFrozen).toBe(true)
    expect(assetData.unitName).toBe('TEST')
    expect(assetData.assetName).toBe('Test Asset')
    expect(assetData.url).toBe('https://example.com')
    expect(assetData.metadataHash).toEqual(hash)
    expect(assetData.manager).toBe(accounts[0].toString())
    expect(assetData.reserve).toBe(accounts[1].toString())
    expect(assetData.freeze).toBe(accounts[2].toString())
    expect(assetData.clawback).toBe(accounts[3].toString())
  })

  test('OptIn an asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 1)
    const dummyAssetIds = [dummyAssetId]
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(0)

    await algorand.asset.bulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const testAccountInfoAfterOptIn = await algorand.account.getInformation(secondAccount)
    expect(testAccountInfoAfterOptIn.totalAssetsOptedIn).toBe(1)
  })

  test('OptIn two batches of asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: bigint[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algo() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algorand.asset.bulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })
    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(20)
  }, 10e6)

  test('OptOut of an asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algorand, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.asset.bulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(2)

    await algorand.asset.bulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  })

  test('OptOut of an not opt-in asset to an account failed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, 1234567n, -132n]
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.asset.bulkOptIn(secondAccount, [dummyAssetId], { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(1)

    await expect(algorand.asset.bulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })).rejects.toThrow(
      `Account ${secondAccount} is not opted-in to Assets 1234567, -132; can't opt-out.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(1)
  })

  test('Bulk OptOut of an non-zero balance asset to an account failed ', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const dummyAssetId2 = await generateTestAsset(algorand, testAccount, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.asset.bulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(2)

    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: secondAccount,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    await expect(algorand.asset.bulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })).rejects.toThrow(
      `Account ${secondAccount} has non-zero balance for Asset ${dummyAssetId}; can't opt-out.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(2)
  })

  test('OptIn and OptOut of a single asset ', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(1)

    await algorand.send.assetOptOut({
      sender: secondAccount,
      creator: testAccount,
      assetId: dummyAssetId,
      ensureZeroBalance: true,
    })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  })

  test('OptOut of non-zero balance single asset to an account fails by default', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: secondAccount,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    await expect(
      algorand.send.assetOptOut({ sender: secondAccount, creator: testAccount, assetId: dummyAssetId, ensureZeroBalance: true }),
    ).rejects.toThrow(`Account ${secondAccount} does not have a zero balance for Asset ${dummyAssetId}; can't opt-out.`)

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(1)
  })

  test('OptOut of two batches of asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: bigint[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algo() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algorand, testAccount, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algorand.asset.bulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })
    const secondAccountInfo = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(20)

    await algorand.asset.bulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  }, 10e6)
})
