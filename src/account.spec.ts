import { test } from '@jest/globals'
import { v4 as uuid } from 'uuid'
import * as algokit from './'
import { algorandFixture } from './testing'

describe('account', () => {
  const localnet = algorandFixture()

  beforeEach(localnet.beforeEach, 10_000)

  test('New account is retrieved and funded', async () => {
    const { algod, kmd } = localnet.context

    const account = await algokit.getAccount(uuid(), algod, kmd)
    const accountInfo = await algod.accountInformation(account.addr).do()

    expect(accountInfo['amount']).toBeGreaterThan(0)
  })

  test('Same account is subsequently retrieved', async () => {
    const { algod, kmd } = localnet.context
    const name = uuid()

    const account = await algokit.getAccount(name, algod, kmd)
    const account2 = await algokit.getAccount(name, algod, kmd)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.sk).toEqual(account2.sk)
  })
})