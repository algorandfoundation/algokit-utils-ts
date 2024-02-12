import { test } from '@jest/globals'
import algosdk from 'algosdk'
import { v4 as uuid } from 'uuid'
import * as algokit from '..'
import { algorandFixture } from '../testing'

describe('account', () => {
  const localnet = algorandFixture()

  beforeEach(localnet.beforeEach, 10e6)

  test('New account is retrieved and funded', async () => {
    const { algod, kmd } = localnet.context

    const account = await algokit.mnemonicAccountFromEnvironment(uuid(), algod, kmd)

    const accountInfo = await algod.accountInformation(account.addr).do()
    expect(accountInfo['amount']).toBeGreaterThan(0)
  }, 10e6)

  test('Same account is subsequently retrieved', async () => {
    const { algod, kmd } = localnet.context
    const name = uuid()

    const account = await algokit.mnemonicAccountFromEnvironment(name, algod, kmd)
    const account2 = await algokit.mnemonicAccountFromEnvironment(name, algod, kmd)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.sk).toEqual(account2.sk)
  }, 10e6)

  test('Environment is used in preference to kmd', async () => {
    const { algod, kmd } = localnet.context
    const name = uuid()
    const account = await algokit.mnemonicAccountFromEnvironment(name, algod, kmd)

    const name2 = 'TEST'
    process.env.TEST_MNEMONIC = algosdk.secretKeyToMnemonic(account.sk)
    const account2 = await algokit.mnemonicAccountFromEnvironment(name2, algod, kmd)

    expect(account).not.toBe(account2)
    expect(account.addr).toBe(account2.addr)
    expect(account.sk).toEqual(account2.sk)
  }, 10e6)

  test('Deprecated signature 1 still works', async () => {
    const { algod, kmd } = localnet.context

    const account = await algokit.getAccount(uuid(), algod, kmd)

    const accountInfo = await algod.accountInformation(account.addr).do()
    expect(accountInfo['amount']).toBeGreaterThan(0)
  }, 10e6)

  test('Deprecated signature 2 still works', async () => {
    const { algod, kmd } = localnet.context

    const config = algokit.getAccountConfigFromEnvironment(uuid())
    const account = await algokit.getAccount({ config }, algod, kmd)

    const accountInfo = await algod.accountInformation(account.addr).do()
    expect(accountInfo['amount']).toBeGreaterThan(0)
  }, 10e6)
})
