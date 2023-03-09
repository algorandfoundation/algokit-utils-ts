import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { localnetFixture as localNetFixture } from '../tests/fixtures/localnet-fixture'
import { AlgoAmount } from './algo-amount'
import { sendTransaction } from './transaction'

describe('transaction', () => {
  const localnet = localNetFixture()

  const getTestTransaction = async () => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: localnet.context.testAccount.addr,
      to: localnet.context.testAccount.addr,
      amount: 1,
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
})
