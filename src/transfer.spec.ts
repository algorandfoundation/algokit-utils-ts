import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from './'
import { algorandFixture } from './testing'
import { ensureFundsAndOptIn, generateTestAsset, optIn } from './testing/asset'

describe('transfer', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  test('Transfer Algo is sent and waited for', async () => {
    const { algod, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    const { transaction, confirmation } = await algokit.transferAlgos(
      {
        from: testAccount,
        to: secondAccount.addr,
        amount: algokit.algos(5),
        note: 'Transfer 5 ALGOs',
      },
      algod,
    )
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()

    expect(transaction.type).toBe(TransactionType.pay)
    expect(confirmation?.txn.txn.type).toBe('pay')

    expect(transaction.amount).toBe(5_000_000)
    expect(confirmation?.txn.txn.amt).toBe(5_000_000)

    expect(algosdk.encodeAddress(transaction.from.publicKey)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(confirmation!.txn.txn.snd)).toBe(testAccount.addr)

    expect(accountInfo['amount']).toBe(5_000_000)
  })

  test('Transfer ASA, receiver is not opted in', async () => {
    const { algod, testAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    try {
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
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('receiver error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, sender is not opted in', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)

    try {
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
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('sender error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, asset doesnt exist', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)
    await optIn(algod, testAccount, dummyAssetId)
    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetId: 1,
          amount: 5,
          note: `Transfer asset with wrong id`,
        },
        algod,
      )
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('asset 1 missing from')
    }
  }, 10e6)

  test('Transfer ASA, without sending', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)
    await optIn(algod, testAccount, dummyAssetId)
    const response = await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: 1,
        amount: 5,
        note: `Transfer asset with wrong id`,
        skipSending: true,
      },
      algod,
    )

    expect(response.transaction).toBeDefined()
    expect(response.confirmation).toBeUndefined()
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)
    await optIn(algod, testAccount, dummyAssetId)

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

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetId).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetId).do()
    expect(testAccountInfo['asset-holding']['amount']).toBe(95)
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account from revocationTarget', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()
    const clawbackAccount = algosdk.generateAccount()

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)
    await ensureFundsAndOptIn(algod, clawbackAccount, dummyAssetId, kmd)
    await optIn(algod, testAccount, dummyAssetId)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: clawbackAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      },
      algod,
    )

    const clawbackFromInfo = await algod.accountAssetInformation(clawbackAccount.addr, dummyAssetId).do()
    expect(clawbackFromInfo['asset-holding']['amount']).toBe(5)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
        clawbackFrom: clawbackAccount,
      },
      algod,
    )

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetId).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const clawbackAccountInfo = await algod.accountAssetInformation(clawbackAccount.addr, dummyAssetId).do()
    expect(clawbackAccountInfo['asset-holding']['amount']).toBe(0)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetId).do()
    expect(testAccountInfo['asset-holding']['amount']).toBe(95)
  }, 10e6)

  test('ensureFunded is sent and waited for with correct amount for new account', async () => {
    const { algod, kmd, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    const result = await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        fundingSource: testAccount,
        minSpendingBalance: algokit.microAlgos(1),
      },
      algod,
      kmd,
    )
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()

    invariant(result)
    const { transaction, confirmation } = result
    expect(transaction.type).toBe(TransactionType.pay)
    expect(confirmation?.txn.txn.type).toBe('pay')

    expect(transaction.amount).toBe(100_001)
    expect(confirmation?.txn.txn.amt).toBe(100_001)
    expect(accountInfo['amount']).toBe(100_001)

    expect(algosdk.encodeAddress(transaction.from.publicKey)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(confirmation!.txn.txn.snd)).toBe(testAccount.addr)

    expect(algosdk.encodeAddress(transaction.to.publicKey)).toBe(secondAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(confirmation!.txn.txn.rcv!)).toBe(secondAccount.addr)
  })

  test('ensureFunded respects minimum funding increment', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const secondAccount = algosdk.generateAccount()

    await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        fundingSource: testAccount,
        minSpendingBalance: algokit.microAlgos(1),
        minFundingIncrement: algokit.algos(1),
      },
      algod,
      kmd,
    )

    const accountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(accountInfo['amount']).toBe(1_000_000)
  })

  test('ensureFunded uses dispenser account by default', async () => {
    const { algod, kmd } = localnet.context
    const secondAccount = algosdk.generateAccount()
    const dispenser = await algokit.getDispenserAccount(algod, kmd)

    const result = await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        minSpendingBalance: algokit.microAlgos(1),
        minFundingIncrement: algokit.algos(1),
      },
      algod,
      kmd,
    )

    invariant(result)
    const { transaction } = result
    expect(algosdk.encodeAddress(transaction.from.publicKey)).toBe(dispenser.addr)
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(accountInfo['amount']).toBe(1_000_000)
  })
})
