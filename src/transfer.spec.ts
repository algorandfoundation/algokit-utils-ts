import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from './'
import { algorandFixture } from './testing'
import { generateTestAsset } from './testing/asset'

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

    const { transaction, confirmation } = await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetID: dummyAssetID,
        amount: 5,
        note: `Transfer 5 assets wit id ${dummyAssetID}`,
      },
      algod,
    )

    // TODO: Expect this invocation to throw URLTokenBaseHTTPError and receiver to no be opted in
  }, 10e6)

  // TODO: Implement test for when sender is not opted in to the asset

  // TODO: Implement test for malformed sender AND receiver address

  // TODO: Implement test for happy path, receiver is opted and recievs the assets

  // TODO: Implement test for clawback, create 3 accounts. 1 creator, 1 clawback target and 1 recipient. Opt in both clawback target account and recipient and transfer some amount to clawback target. Then in actual test perform a transfer from sender to receipient with clawback from specified. Assert that clawback target no longer has the specified amount after Txn and that sender's balance is left unchanged.

  // TOOD: If asset id is non existent, expect this to throw an error (figure out the exact error type based on algo sdk response)

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
