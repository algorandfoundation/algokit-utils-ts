import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { localnetFixture as localNetFixture } from '../tests/fixtures/localnet-fixture'
import { AlgoAmount } from './algo-amount'
import { Arc2TransactionNote, encodeTransactionNote, sendGroupOfTransactions, sendTransaction } from './transaction'

describe('transaction', () => {
  const localnet = localNetFixture()

  const getTestTransaction = async (amount?: number) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: localnet.context.testAccount.addr,
      to: localnet.context.testAccount.addr,
      amount: amount ?? 1,
      suggestedParams: await localnet.context.client.getTransactionParams().do(),
    })
  }

  test('Transaction is sent and waited for', async () => {
    const { client, testAccount } = localnet.context
    const txn = await getTestTransaction()
    const { transaction, confirmation } = await sendTransaction(client, txn, testAccount)

    expect(transaction.txID()).toBe(txn.txID())
    expect(confirmation?.['confirmed-round']).toBeGreaterThanOrEqual(txn.firstRound)
  })

  test('Transaction is capped by low min txn fee', async () => {
    const { client, testAccount } = localnet.context
    const txn = await getTestTransaction()
    await expect(async () => {
      await sendTransaction(client, txn, testAccount, {
        maxFee: AlgoAmount.MicroAlgos(1),
      })
    }).rejects.toThrowError(
      'Cancelled transaction due to high network congestion fees. ' +
        'Algorand suggested fees would cause this transaction to cost 1000 µALGOs. ' +
        'Cap for this transaction is 1 µALGOs.',
    )
  })

  test('Transaction cap is ignored if flat fee set', async () => {
    const { client, testAccount } = localnet.context
    const txn = await getTestTransaction()
    txn.flatFee = true
    await sendTransaction(client, txn, testAccount, {
      maxFee: AlgoAmount.MicroAlgos(1),
    })
  })

  test('Transaction cap is ignored if higher than fee', async () => {
    const { client, testAccount } = localnet.context
    const txn = await getTestTransaction()
    const { confirmation } = await sendTransaction(client, txn, testAccount, {
      maxFee: AlgoAmount.MicroAlgos(1000_000),
    })

    expect(confirmation?.txn.txn.fee).toBe(1000)
  })

  test('Transaction group is sent', async () => {
    const { client, testAccount } = localnet.context
    const txn1 = await getTestTransaction(1)
    const txn2 = await getTestTransaction(2)

    const { confirmation } = await sendGroupOfTransactions(client, [
      {
        transaction: txn1,
        signer: testAccount,
      },
      {
        transaction: txn2,
        signer: testAccount,
      },
    ])

    expect(confirmation?.['confirmed-round']).toBeGreaterThanOrEqual(txn1.firstRound)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(Buffer.from(confirmation!.txn.txn.grp!).toString('hex')).toBe(Buffer.from(txn1.group!).toString('hex'))
  })
})

describe('transaction node encoder', () => {
  test('null', () => {
    expect(encodeTransactionNote(null)).toBeUndefined()
  })
  test('undefined', () => {
    expect(encodeTransactionNote(undefined)).toBeUndefined()
  })
  test('string', () => {
    expect(encodeTransactionNote('abc')).toMatchInlineSnapshot(`
      Uint8Array [
        97,
        98,
        99,
      ]
    `)
  })
  test('object', () => {
    expect(encodeTransactionNote({ a: 'b' })).toMatchInlineSnapshot(`
      Uint8Array [
        123,
        34,
        97,
        34,
        58,
        34,
        98,
        34,
        125,
      ]
    `)
  })
  test('arc-0002', () => {
    expect(
      encodeTransactionNote({
        dAppName: 'a',
        format: 'u',
        data: 'abc',
      } as Arc2TransactionNote),
    ).toMatchInlineSnapshot(`
      Uint8Array [
        97,
        58,
        117,
        97,
        98,
        99,
      ]
    `)
  })
})
