import { describe, test } from '@jest/globals'
import { v4 as uuid } from 'uuid'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { getAccount } from './account'

describe('account', () => {
  const localnet = localNetFixture()

  test('New account is retrieved and funded', async () => {
    const { client } = localnet.context

    const account = await getAccount(uuid(), client)
    const accountInfo = await client.accountInformation(account.addr).do()

    expect(accountInfo['amount']).toBeGreaterThan(0)
  })

  test('Same account is subsequently retrieved', async () => {
    const { client } = localnet.context
    const name = uuid()

    const account = await getAccount(name, client)
    const account2 = await getAccount(name, client)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.sk).toEqual(account2.sk)
  })
})
