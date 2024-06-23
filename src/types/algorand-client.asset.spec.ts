import { describe, test } from '@jest/globals'
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
      sender: testAccount.addr,
      total: 1000n,
      decimals: 0,
      assetName: 'Test Asset',
      unitName: 'TEST',
      url: 'https://example.com',
      metadataHash: hash,
      manager: accounts[0].addr,
      reserve: accounts[1].addr,
      freeze: accounts[2].addr,
      clawback: accounts[3].addr,
      defaultFrozen: true,
    })

    expect(result.confirmation.assetIndex).toBeGreaterThan(0n)
    const assetData = await algorand.asset.getById(result.assetId)
    expect(assetData.creator).toBe(testAccount.addr)
    expect(assetData.total).toBe(1000n)
    expect(assetData.decimals).toBe(0)
    expect(assetData.defaultFrozen).toBe(true)
    expect(assetData.unitName).toBe('TEST')
    expect(assetData.assetName).toBe('Test Asset')
    expect(assetData.url).toBe('https://example.com')
    expect(assetData.metadataHash).toEqual(hash)
    expect(assetData.manager).toBe(accounts[0].addr)
    expect(assetData.reserve).toBe(accounts[1].addr)
    expect(assetData.freeze).toBe(accounts[2].addr)
    expect(assetData.clawback).toBe(accounts[3].addr)
  })

  test('OptIn an asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 1)
    const dummyAssetIds = [dummyAssetId]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(0)

    await algorand.account.assetBulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const testAccountInfoAfterOptIn = await algorand.account.getInformation(secondAccount.addr)
    expect(testAccountInfoAfterOptIn.totalAssetsOptedIn).toBe(1)
  })

  test('OptIn two batches of asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: bigint[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algos() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algorand.account.assetBulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })
    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(20)
  }, 10e6)

  test('OptOut of an asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
    const dummyAssetId2 = await generateTestAsset(algorand, testAccount.addr, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.account.assetBulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(2)

    await algorand.account.assetBulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  })

  test('OptOut of an not opt-in asset to an account failed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
    const dummyAssetIds = [dummyAssetId, 1234567n, -132n]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.account.assetBulkOptIn(secondAccount, [dummyAssetId], { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(1)

    await expect(algorand.account.assetBulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })).rejects.toThrow(
      `Account ${secondAccount.addr} is not opted-in to Assets 1234567, -132; can't opt-out.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(1)
  })

  test('Bulk OptOut of an non-zero balance asset to an account failed ', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
    const dummyAssetId2 = await generateTestAsset(algorand, testAccount.addr, 0)
    const dummyAssetIds = [dummyAssetId, dummyAssetId2]
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.account.assetBulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(2)

    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    await expect(algorand.account.assetBulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })).rejects.toThrow(
      `Account ${secondAccount.addr} has non-zero balance for Asset ${dummyAssetId}; can't opt-out.`,
    )

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(2)
  })

  test('OptIn and OptOut of a single asset ', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })

    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(1)

    await algorand.send.assetOptOut({
      sender: secondAccount.addr,
      creator: testAccount.addr,
      assetId: dummyAssetId,
      ensureZeroBalance: true,
    })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  })

  test('OptOut of non-zero balance single asset to an account fails by default', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    await expect(
      algorand.send.assetOptOut({ sender: secondAccount.addr, creator: testAccount.addr, assetId: dummyAssetId, ensureZeroBalance: true }),
    ).rejects.toThrow(`Account ${secondAccount.addr} does not have a zero balance for Asset ${dummyAssetId}; can't opt-out.`)

    const secondAccountInfoAfterFailedOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterFailedOptOut.totalAssetsOptedIn).toBe(1)
  })

  test('OptOut of two batches of asset to an account succeed', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetIds: bigint[] = []
    const secondAccount = await generateAccount({ initialFunds: (3).algos() })
    for (let i = 0; i < 20; i++) {
      const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 0)
      dummyAssetIds.push(dummyAssetId)
    }
    await algorand.account.assetBulkOptIn(secondAccount, dummyAssetIds, { validityWindow: 100 })
    const secondAccountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfo.totalAssetsOptedIn).toBe(20)

    await algorand.account.assetBulkOptOut(secondAccount, dummyAssetIds, { validityWindow: 100 })

    const secondAccountInfoAfterOptOut = await algorand.account.getInformation(secondAccount.addr)
    expect(secondAccountInfoAfterOptOut.totalAssetsOptedIn).toBe(0)
  }, 10e6)
})
