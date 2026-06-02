import { beforeEach, describe, expect, test } from 'vitest'
import { algo } from '../../src'
import { algorandFixture } from '../../src/testing'

describe('devportal asset examples', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 100_000)

  test('asset create', async () => {
    const { testAccount: randomAccountA, algorand } = localnet.context

    // example: ASSET_CREATE_TRANSACTION

    /**
     * Send an asset create transaction creating a fungible ASA with 10 million units
     *
     * Parameters for creating a new asset:
     * - sender: The address of the account that will send the transaction
     * - total: The total amount of the smallest divisible unit to create
     * - decimals: The amount of decimal places the asset should have, defaults to undefined
     * - defaultFrozen: Whether the asset is frozen by default in the creator address, defaults to undefined
     * - manager: The address that can change the manager, reserve, clawback, and freeze addresses, defaults to undefined
     * - reserve: The address that holds the uncirculated supply, defaults to undefined
     * - freeze: The address that can freeze the asset in any account, defaults to undefined
     * - clawback: The address that can clawback the asset from any account, defaults to undefined
     * - unitName: The short ticker name for the asset, defaults to undefined
     * - assetName: The full name of the asset, defaults to undefined
     */
    const createFungibleResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 10_000_000n,
      decimals: 6,
      defaultFrozen: false,
      manager: randomAccountA,
      reserve: randomAccountA,
      freeze: randomAccountA,
      clawback: randomAccountA,
      unitName: 'MYA',
      assetName: 'My Asset',
    })

    /**
     * Send an asset create transaction creating a 1 to 1 unique NFT
     */
    const createNFTResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 1n,
      assetName: 'My NFT',
      unitName: 'MNFT',
      decimals: 0,
      url: 'metadata URL',
      metadataHash: new Uint8Array(32).fill(1),
    })

    // example: ASSET_CREATE_TRANSACTION

    expect(createFungibleResult.assetId).toBeGreaterThan(0n)
    expect(createNFTResult.assetId).toBeGreaterThan(0n)
  })

  test('asset transfer', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Transfer Test Asset',
      unitName: 'TTA',
    })
    const assetId = createResult.assetId

    // Opt in randomAccountB to the asset
    await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    // example: ASSET_TRANSFER_TRANSACTION

    /**
     * Send an asset transfer transaction of 1 asset with asset id 1234 from randomAccountA to randomAccountB
     *
     * Parameters for an asset transfer transaction:
     * - sender: The address of the account that will send the asset
     * - assetId: The asset id of the asset to transfer
     * - amount: Amount of the asset to transfer (smallest divisible unit)
     * - receiver: The address of the account to send the asset to
     */
    const transferResult = await algorand.send.assetTransfer({
      sender: randomAccountA,
      assetId: assetId,
      receiver: randomAccountB,
      amount: 1n,
    })

    // example: ASSET_TRANSFER_TRANSACTION

    const receiverHolding = await algorand.asset.getAccountInformation(randomAccountB, assetId)

    expect(transferResult).toBeDefined()
    expect(receiverHolding.balance).toBe(1n)
  })

  test('asset clawback', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset with clawback set to randomAccountA
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Clawback Test Asset',
      unitName: 'CTA',
      clawback: randomAccountA,
    })
    const assetId = createResult.assetId

    // Opt in randomAccountB and transfer some assets
    await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    await algorand.send.assetTransfer({
      sender: randomAccountA,
      assetId: assetId,
      receiver: randomAccountB,
      amount: 10n,
    })

    // example: ASSET_CLAWBACK_TRANSACTION

    /**
     * An asset clawback transaction is an asset transfer transaction with the
     * `clawbackTarget` set to the account that is being clawed back from.
     *
     * Parameters for an asset transfer transaction:
     * - sender: The address of the account that will send the transaction
     * - assetId: ID of the asset
     * - amount: Amount of the asset to transfer (smallest divisible unit)
     * - receiver: The account to send the asset to
     * - clawbackTarget: The account to take the asset from, defaults to undefined
     */
    const txnResult = await algorand.send.assetTransfer({
      sender: randomAccountA, // Must be the clawback address for the asset
      assetId: assetId,
      amount: 1n,
      receiver: randomAccountA,
      clawbackTarget: randomAccountB, // account that is being clawed back from
    })

    // example: ASSET_CLAWBACK_TRANSACTION

    expect(txnResult).toBeDefined()
  })

  test('asset freeze', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Freeze Test Asset',
      unitName: 'FTA',
      freeze: randomAccountA,
    })
    const assetId = createResult.assetId

    // Opt in randomAccountB to the asset
    await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    // example: ASSET_FREEZE_TRANSACTION

    /**
     * Send an asset freeze transaction freezing an asset with asset id 1234
     *
     * Parameters for freezing an asset:
     * - sender: The address of the account that will send the transaction
     * - assetId: The ID of the asset
     * - freezeTarget: The account to freeze or unfreeze
     * - frozen: Whether the assets in the account should be frozen
     */
    const freezeResult = await algorand.send.assetFreeze({
      sender: randomAccountA,
      assetId: assetId,
      freezeTarget: randomAccountB, // The account to freeze or unfreeze
      frozen: true,
    })

    /**
     * Send an asset unfreeze transaction unfreezing an asset with asset id 1234
     */
    const unfreezeResult = await algorand.send.assetFreeze({
      sender: randomAccountA,
      assetId: assetId,
      freezeTarget: randomAccountB, // The account to freeze or unfreeze
      frozen: false,
    })

    // example: ASSET_FREEZE_TRANSACTION

    const frozenHolding = await algorand.asset.getAccountInformation(randomAccountB, assetId)

    expect(freezeResult).toBeDefined()
    expect(unfreezeResult).toBeDefined()
    expect(frozenHolding.frozen).toBe(false)
  })

  test('asset update', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first with randomAccountA as manager
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Update Test Asset',
      unitName: 'UTA',
      manager: randomAccountA,
      reserve: randomAccountA,
      freeze: randomAccountA,
      clawback: randomAccountA,
    })
    const assetId = createResult.assetId

    // example: ASSET_UPDATE_TRANSACTION

    /**
     * Send an asset config transaction updating four mutable fields of an asset:
     * manager, reserve, freeze, clawback. This operation is only possible if the sender is
     * the asset manager and the asset has all four mutable fields set.
     *
     * Parameters for configuring an existing asset:
     * - sender: The address of the account that will send the transaction
     * - assetId: ID of the asset
     * - manager: The address that can change the manager, reserve, clawback, and freeze addresses, defaults to undefined
     * - reserve: The address that holds the uncirculated supply, defaults to undefined
     * - freeze: The address that can freeze the asset in any account, defaults to undefined
     * - clawback: The address that can clawback the asset from any account, defaults to undefined
     */
    const txnResult = await algorand.send.assetConfig({
      sender: randomAccountA,
      assetId: assetId,
      manager: randomAccountB,
      reserve: randomAccountB,
      freeze: randomAccountB,
      clawback: randomAccountB,
    })

    // example: ASSET_UPDATE_TRANSACTION

    expect(txnResult).toBeDefined()
  })

  test('asset destroy', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first (with manager set to creator so they can destroy it)
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Destroy Test Asset',
      unitName: 'DTA',
      manager: randomAccountA,
    })
    const assetId = createResult.assetId

    // Opt in randomAccountB and transfer some assets there
    await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    await algorand.send.assetTransfer({
      sender: randomAccountA,
      assetId: assetId,
      receiver: randomAccountB,
      amount: 1n,
    })

    // Transfer assets back to creator (required before destroy)
    await algorand.send.assetTransfer({
      sender: randomAccountB,
      assetId: assetId,
      receiver: randomAccountA,
      amount: 1n,
    })

    // example: ASSET_DESTROY_TRANSACTION

    /**
     * Send an asset destroy transaction destroying an asset with asset id 1234
     * All of the assets must be owned by the creator of the asset before the asset can be deleted.
     *
     * Parameters for destroying an asset:
     * - sender: The address of the account that will send the transaction
     * - assetId: ID of the asset
     */
    const destroyResult = await algorand.send.assetDestroy({
      sender: randomAccountA,
      assetId: assetId,
    })

    // example: ASSET_DESTROY_TRANSACTION

    expect(destroyResult).toBeDefined()
    await expect(algorand.asset.getById(assetId)).rejects.toThrow()
  })

  test('asset opt-in', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'OptIn Test Asset',
      unitName: 'OTA',
    })
    const assetId = createResult.assetId

    // example: ASSET_OPT_IN_TRANSACTION

    /**
     * Send an asset opt in transaction for randomAccountB opting in to asset with asset id 1234
     *
     * Parameters for an asset opt in transaction:
     * - sender: The address of the account that will opt in to the asset
     * - assetId: ID of the asset
     */
    const optInResult = await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    // example: ASSET_OPT_IN_TRANSACTION

    expect(optInResult).toBeDefined()
  })

  test('asset opt-out', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create an asset first
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'OptOut Test Asset',
      unitName: 'OOTA',
    })
    const assetId = createResult.assetId

    // Opt in first
    await algorand.send.assetOptIn({
      sender: randomAccountB,
      assetId: assetId,
    })

    // Transfer asset to randomAccountB then back to ensure zero balance
    await algorand.send.assetTransfer({
      sender: randomAccountA,
      assetId: assetId,
      receiver: randomAccountB,
      amount: 1n,
    })

    await algorand.send.assetTransfer({
      sender: randomAccountB,
      assetId: assetId,
      receiver: randomAccountA,
      amount: 1n,
    })

    // example: ASSET_OPT_OUT_TRANSACTION

    /**
     * Send an asset opt out transaction for randomAccountB opting out of asset with asset id 1234
     *
     * Parameters for an asset opt out transaction:
     * - sender: The address of the account that will opt out of the asset
     * - assetId: ID of the asset
     * - creator: The creator address of the asset
     * - ensureZeroBalance: Check if account has zero balance before opt-out, defaults to true
     */
    const optOutResult = await algorand.send.assetOptOut({
      sender: randomAccountB,
      assetId: assetId,
      creator: randomAccountA,
      ensureZeroBalance: true,
    })

    // example: ASSET_OPT_OUT_TRANSACTION

    expect(optOutResult).toBeDefined()
  })

  test('asset bulk opt-in', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create two assets
    const createResult1 = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Bulk Asset 1',
      unitName: 'BA1',
    })
    const createResult2 = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Bulk Asset 2',
      unitName: 'BA2',
    })
    const assetIds = [createResult1.assetId, createResult2.assetId]

    // example: ASSET_BULK_OPT_IN_TRANSACTION

    /**
     * Opt an account in to a list of Algorand Standard Assets.
     *
     * Transactions will be sent in batches of 16 as transaction groups.
     *
     * @param account The account to opt-in
     * @param assetIds The list of asset IDs to opt-in to
     * @param options Any parameters to control the transaction or execution of the transaction
     *
     * @returns An array of records matching asset ID to transaction ID of the opt in
     */
    const bulkOptInResult = await algorand.asset.bulkOptIn(randomAccountB, assetIds)

    // example: ASSET_BULK_OPT_IN_TRANSACTION

    expect(bulkOptInResult).toBeDefined()
    expect(bulkOptInResult.length).toBe(2)
  })

  test('asset bulk opt-out', async () => {
    const { testAccount: randomAccountA, algorand, generateAccount } = localnet.context
    const randomAccountB = await generateAccount({ initialFunds: algo(1) })

    // Create two assets
    const createResult1 = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Bulk Asset 3',
      unitName: 'BA3',
    })
    const createResult2 = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Bulk Asset 4',
      unitName: 'BA4',
    })
    const assetIds = [createResult1.assetId, createResult2.assetId]

    // Bulk opt-in first
    await algorand.asset.bulkOptIn(randomAccountB, assetIds)

    // example: ASSET_BULK_OPT_OUT_TRANSACTION

    /**
     * Opt an account out of a list of Algorand Standard Assets.
     *
     * Transactions will be sent in batches of 16 as transaction groups.
     *
     * @param account The account to opt-out
     * @param assetIds The list of asset IDs to opt-out of
     * @param options Any parameters to control the transaction or execution of the transaction
     *
     * @returns An array of records matching asset ID to transaction ID of the opt out
     */
    const bulkOptOutResult = await algorand.asset.bulkOptOut(randomAccountB, assetIds)

    // example: ASSET_BULK_OPT_OUT_TRANSACTION

    expect(bulkOptOutResult).toBeDefined()
    expect(bulkOptOutResult.length).toBe(2)
  })

  test('get asset information', async () => {
    const { testAccount: randomAccountA, algorand } = localnet.context

    // Create an asset first
    const createResult = await algorand.send.assetCreate({
      sender: randomAccountA,
      total: 100n,
      assetName: 'Info Test Asset',
      unitName: 'ITA',
      decimals: 0,
    })
    const assetId = createResult.assetId

    // example: GET_ASSET_INFORMATION

    /**
     * Get information about an Algorand Standard Asset (ASA).
     *
     * - assetId: The ID of the asset
     * - creator: The address of the account that created the asset
     * - total: The total amount of the smallest divisible units that were created of the asset
     * - decimals: The amount of decimal places the asset was created with
     * - defaultFrozen: Whether the asset was frozen by default for all accounts, defaults to undefined
     * - manager: The address of the optional account that can manage the configuration of the asset and destroy it,
     *     defaults to undefined
     * - reserve: The address of the optional account that holds the reserve (uncirculated supply) units of the asset,
     *     defaults to undefined
     * - freeze: The address of the optional account that can be used to freeze or unfreeze holdings of this asset,
     *     defaults to undefined
     * - clawback: The address of the optional account that can clawback holdings of this asset from any account,
     *     defaults to undefined
     * - unitName: The optional name of the unit of this asset (e.g. ticker name), defaults to undefined
     * - unitNameAsBytes: The optional name of the unit of this asset as bytes, defaults to undefined
     * - assetName: The optional name of the asset, defaults to undefined
     * - assetNameAsBytes: The optional name of the asset as bytes, defaults to undefined
     * - url: Optional URL where more information about the asset can be retrieved, defaults to undefined
     * - urlAsBytes: Optional URL where more information about the asset can be retrieved as bytes, defaults to undefined
     * - metadataHash: 32-byte hash of some metadata that is relevant to the asset and/or asset holders,
     *     defaults to undefined
     */
    const assetInfo = await algorand.asset.getById(assetId)

    // example: GET_ASSET_INFORMATION

    expect(assetInfo).toBeDefined()
    expect(assetInfo.assetName).toBe('Info Test Asset')
    expect(assetInfo.total).toBe(100n)
  })
})
