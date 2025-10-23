import * as algosdk from '../sdk'
import { v4 as uuid } from 'uuid'
import { beforeEach, describe, expect, test } from 'vitest'
import { algo } from '../amount'
import { algorandFixture } from '../testing'

describe('AccountManager', () => {
  const localnet = algorandFixture()

  beforeEach(localnet.newScope, 10e6)

  test('New account is retrieved and funded', async () => {
    const { algorand } = localnet.context

    const account = await algorand.account.fromEnvironment(uuid())

    const accountInfo = await algorand.account.getInformation(account.addr)
    expect(accountInfo.balance.microAlgo).toBeGreaterThan(0)
  }, 10e6)

  test('Same account is subsequently retrieved', async () => {
    const { algorand } = localnet.context
    const name = uuid()

    const account = await algorand.account.fromEnvironment(name)
    const account2 = await algorand.account.fromEnvironment(name)

    expect(account).not.toBe(account2)
    expect(account.addr).toEqual(account2.addr)
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
    expect(account.addr).toEqual(account2.addr)
    expect(account.account.sk).toEqual(account2.account.sk)
  }, 10e6)

  test('Rekeyed account is retrievable', async () => {
    const { algorand, generateAccount } = localnet.context

    const rekeyed = await generateAccount({ initialFunds: algo(1) })
    const rekeyTo = await generateAccount({ initialFunds: algo(0.1) })

    await algorand.account.rekeyAccount(rekeyed.addr, rekeyTo)

    const accountInfo = await algorand.account.getInformation(rekeyed.addr)
    expect(accountInfo.address.toString()).toBe(rekeyed.addr.toString())
    expect(accountInfo.authAddr!.toString()).toBe(rekeyTo.addr.toString())
  }, 10e6)
})
