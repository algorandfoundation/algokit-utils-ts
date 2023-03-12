import { describe, test } from '@jest/globals'
import { v4 as uuid } from 'uuid'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { getAccount } from './account'

describe('account', () => {
  const localnet = localNetFixture()

  test('New account is retrieved and funded', async () => {
    const { algod } = localnet.context

    const account = await getAccount(uuid(), algod)
    const accountInfo = await algod.accountInformation(account.addr).do()

    expect(accountInfo['amount']).toBeGreaterThan(0)
  })

  test('Same account is subsequently retrieved', async () => {
    const { algod } = localnet.context
    const name = uuid()

    const account = await getAccount(name, algod)
    const account2 = await getAccount(name, algod)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.sk).toEqual(account2.sk)
  })
})
