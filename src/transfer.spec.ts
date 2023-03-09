import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import { localnetFixture as localNetFixture } from '../tests/fixtures/localnet-fixture'
import { AlgoAmount } from './algo-amount'
import { transferAlgos } from './transfer'

describe('transfer', () => {
  const localnet = localNetFixture()

  test('Transfer is sent and waited for', async () => {
    const { client, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    const { transaction, confirmation } = await transferAlgos(
      {
        from: testAccount,
        to: secondAccount.addr,
        amount: AlgoAmount.Algos(5),
        note: 'Transfer 5 ALGOs',
      },
      client,
    )
    const accountInfo = await client.accountInformation(secondAccount.addr).do()

    expect(transaction.type).toBe(TransactionType.pay)
    expect(confirmation?.txn.txn.type).toBe('pay')

    expect(transaction.amount).toBe(5_000_000)
    expect(confirmation?.txn.txn.amt).toBe(5_000_000)

    expect(algosdk.encodeAddress(transaction.from.publicKey)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(confirmation!.txn.txn.snd)).toBe(testAccount.addr)

    expect(accountInfo['amount']).toBe(5_000_000)
  })
})
