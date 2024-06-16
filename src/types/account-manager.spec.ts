import { test } from '@jest/globals'
import algosdk from 'algosdk'
import { v4 as uuid } from 'uuid'
import { algorandFixture } from '../testing'

describe('AccountManager', () => {
  const localnet = algorandFixture()

  beforeEach(localnet.beforeEach, 10e6)

  test('New account is retrieved and funded', async () => {
    const { algorand } = localnet.context

    const account = await algorand.account.fromEnvironment(uuid())

    const accountInfo = await algorand.account.getInformation(account.addr)
    expect(accountInfo.balance.microAlgos).toBeGreaterThan(0)
  }, 10e6)

  test('Same account is subsequently retrieved', async () => {
    const { algorand } = localnet.context
    const name = uuid()

    const account = await algorand.account.fromEnvironment(name)
    const account2 = await algorand.account.fromEnvironment(name)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.account.sk).toEqual(account2.account.sk)
  }, 10e6)

  test('Environment is used in preference to kmd', async () => {
    const { algorand } = localnet.context
    const name = uuid()
    const account = await algorand.account.fromEnvironment(name)

    const name2 = 'TEST'
    process.env.TEST_MNEMONIC = algosdk.secretKeyToMnemonic(account.account.sk)
    const account2 = await algorand.account.fromEnvironment(name2)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.account.sk).toEqual(account2.account.sk)
  }, 10e6)
})
