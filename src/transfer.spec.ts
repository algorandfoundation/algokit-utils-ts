import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from './'
import { algorandFixture } from './testing'
import { assureFundsAndOptIn, generateTestAsset, optIn } from './testing/asset'

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
    const dummyAssetID = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetID: dummyAssetID,
          amount: 5,
          note: `Transfer 5 assets wit id ${dummyAssetID}`,
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
    const dummyAssetID = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await assureFundsAndOptIn(algod, secondAccount, dummyAssetID, kmd)

    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetID: dummyAssetID,
          amount: 5,
          note: `Transfer 5 assets wit id ${dummyAssetID}`,
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
    const dummyAssetID = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await assureFundsAndOptIn(algod, secondAccount, dummyAssetID, kmd)
    await optIn(algod, testAccount, dummyAssetID)
    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetID: 1,
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

  test('Transfer ASA, asset is transfered to another account', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetID = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    await assureFundsAndOptIn(algod, secondAccount, dummyAssetID, kmd)
    await optIn(algod, testAccount, dummyAssetID)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetID: dummyAssetID,
        amount: 5,
        note: `Transfer 5 assets wit id ${dummyAssetID}`,
      },
      algod,
    )

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetID).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetID).do()
    expect(testAccountInfo['asset-holding']['amount']).toBe(95)
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetID = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()
    const clawbackAccount = algosdk.generateAccount()

    await assureFundsAndOptIn(algod, secondAccount, dummyAssetID, kmd)
    await assureFundsAndOptIn(algod, clawbackAccount, dummyAssetID, kmd)
    await optIn(algod, testAccount, dummyAssetID)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: clawbackAccount.addr,
        assetID: dummyAssetID,
        amount: 5,
        note: `Transfer 5 assets wit id ${dummyAssetID}`,
      },
      algod,
    )

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetID: dummyAssetID,
        amount: 5,
        note: `Transfer 5 assets wit id ${dummyAssetID}`,
        clawbackFrom: clawbackAccount,
      },
      algod,
    )

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetID).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const clawbackAccountInfo = await algod.accountAssetInformation(clawbackAccount.addr, dummyAssetID).do()
    expect(clawbackAccountInfo['asset-holding']['amount']).toBe(0)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetID).do()
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
