import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import { afterEach, beforeEach, describe, expect, test, vitest } from 'vitest'
import { algorandFixture } from '../testing'
import { generateTestAsset } from '../testing/_asset'
import { AlgorandClient } from './algorand-client'
import { TestNetDispenserApiClient } from './dispenser-client'

describe('Transfer capability', () => {
  const localnet = algorandFixture()
  const env = process.env

  beforeEach(async () => {
    vitest.resetModules()
    process.env = { ...env }
    await localnet.newScope()
  }, 10_000)

  afterEach(() => {
    process.env = env
  })

  test('Transfer Algo is sent and waited for', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    const result = await algorand.send.payment({
      sender: testAccount,
      receiver: secondAccount,
      amount: (5).algo(),
      note: 'Transfer 5 Algos',
    })

    const accountInfo = await algorand.account.getInformation(secondAccount)

    expect(result.transaction).toBeInstanceOf(algosdk.Transaction)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(result.confirmation.txn.txn.type).toBe('pay')

    expect(result.transaction.payment?.amount).toBe(5_000_000n)
    expect(result.confirmation.txn.txn.payment?.amount).toBe(5_000_000n)

    expect(result.transaction.sender.toString()).toBe(testAccount.toString())
    expect(result.confirmation.txn.txn.sender.toString()).toBe(testAccount.toString())

    expect(accountInfo.balance.microAlgo).toBe(5_000_000n)
  })

  test('Transfer Algo respects string lease', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.send.payment({
      sender: testAccount,
      receiver: secondAccount,
      amount: (1).algo(),
      lease: 'test',
    })

    await expect(
      algorand.send.payment({
        sender: testAccount,
        receiver: secondAccount,
        amount: (2).algo(),
        lease: 'test',
      }),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer Algo respects byte array lease', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.send.payment({
      sender: testAccount,
      receiver: secondAccount,
      amount: (1).algo(),
      lease: new Uint8Array([1, 2, 3, 4]),
    })

    await expect(
      algorand.send.payment({
        sender: testAccount,
        receiver: secondAccount,
        amount: (2).algo(),
        lease: new Uint8Array([1, 2, 3, 4]),
      }),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer ASA, respects lease', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })
    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: secondAccount,
      assetId: dummyAssetId,
      amount: 1n,
      lease: 'test',
    })

    await expect(
      algorand.send.assetTransfer({
        sender: testAccount,
        receiver: secondAccount,
        assetId: dummyAssetId,
        amount: 2n,
        lease: 'test',
      }),
    ).rejects.toThrow(/overlapping lease/)
  }, 10e6)

  test('Transfer ASA, receiver is not opted in', async () => {
    const { algorand, testAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 100)
    const secondAccount = algorand.account.random()

    try {
      await algorand.send.assetTransfer({
        sender: testAccount,
        receiver: secondAccount,
        assetId: dummyAssetId,
        amount: 1n,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      })
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('receiver error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, sender is not opted in', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

    try {
      await algorand.send.assetTransfer({
        sender: testAccount,
        receiver: secondAccount,
        assetId: dummyAssetId,
        amount: 1n,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      })
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('sender error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, asset doesnt exist', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    try {
      await algorand.send.assetTransfer({
        sender: testAccount,
        receiver: secondAccount,
        assetId: 1n,
        amount: 5n,
        note: 'Transfer asset with wrong id',
      })
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('asset 1 missing from')
    }
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: secondAccount,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    const secondAccountInfo = await algorand.asset.getAccountInformation(secondAccount, dummyAssetId)
    expect(secondAccountInfo.balance).toBe(5n)

    const testAccountInfo = await algorand.asset.getAccountInformation(testAccount, dummyAssetId)
    expect(testAccountInfo.balance).toBe(95n)
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account from revocationTarget', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algo() })
    const clawbackAccount = await generateAccount({ initialFunds: (1).algo() })

    await algorand.send.assetOptIn({ sender: secondAccount, assetId: dummyAssetId })

    await algorand.send.assetOptIn({ sender: clawbackAccount, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: clawbackAccount,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    const clawbackFromInfo = await algorand.asset.getAccountInformation(clawbackAccount, dummyAssetId)
    expect(clawbackFromInfo.balance).toBe(5n)

    await algorand.send.assetTransfer({
      sender: testAccount,
      receiver: secondAccount,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
      clawbackTarget: clawbackAccount,
    })

    const secondAccountInfo = await algorand.asset.getAccountInformation(secondAccount, dummyAssetId)
    expect(secondAccountInfo.balance).toBe(5n)

    const clawbackAccountInfo = await algorand.asset.getAccountInformation(clawbackAccount, dummyAssetId)
    expect(clawbackAccountInfo.balance).toBe(0n)

    const testAccountInfo = await algorand.asset.getAccountInformation(testAccount, dummyAssetId)
    expect(testAccountInfo.balance).toBe(95n)
  }, 10e6)

  test('ensureFunded is sent and waited for with correct amount for new account', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    const result = await algorand.account.ensureFunded(secondAccount, testAccount, (1).microAlgo())
    const accountInfo = await algorand.account.getInformation(secondAccount)

    invariant(result)
    expect(result.transactionId).toBe(result.transaction.txID())
    expect(result.amountFunded.microAlgo).toBe(100_001n)
    expect(accountInfo.balance.microAlgo).toBe(100_001n)
  })

  test('ensureFunded respects minimum funding increment', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const secondAccount = await generateAccount({ initialFunds: (100_000).microAlgo() })

    const result = await algorand.account.ensureFunded(secondAccount, testAccount, (1).microAlgo(), {
      minFundingIncrement: (1).algo(),
    })

    invariant(result)
    expect(result.amountFunded.algo).toBe(1)
    const accountInfo = await algorand.account.getInformation(secondAccount)
    expect(accountInfo.balance.microAlgo).toBe(1_100_000n)
  })

  test('ensureFunded uses dispenser account by default', async () => {
    const { algorand } = localnet.context
    const secondAccount = algorand.account.random()
    const dispenser = await algorand.account.dispenserFromEnvironment()

    const result = await algorand.account.ensureFundedFromEnvironment(secondAccount, (1).microAlgo(), {
      minFundingIncrement: (1).algo(),
    })

    invariant(result)
    const resultReceiver = result.confirmation.txn.txn.sender
    expect(resultReceiver.toString()).toBe(dispenser.toString())
    const accountInfo = await algorand.account.getInformation(secondAccount)
    expect(accountInfo.balance.algo).toBe(1)
  })

  test('ensureFunded uses dispenser api with access token successfully', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algorand = AlgorandClient.testNet()

    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: vitest.fn().mockImplementation(() => {
        return Promise.resolve({ txId: 'dummy_tx_id', amount: 200_000 })
      }),
    })

    const accountToFund = algorand.account.random()

    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(accountToFund, dispenserClient, (100).algo(), {
      minFundingIncrement: (0.1).algo(),
    })

    invariant(result)
    expect(result.transactionId).toBeDefined()
    expect(result.amountFunded.algo).toBe(0.2)
  })

  test('ensureFunded uses dispenser api and fails with rejected response', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algorand = AlgorandClient.testNet()

    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: vitest.fn().mockImplementation(() => {
        return Promise.reject(new Error('dummy_error'))
      }),
    })
    const accountToFund = algorand.account.random()

    await expect(
      algorand.account.ensureFundedFromTestNetDispenserApi(accountToFund, dispenserClient, (100).algo(), {
        minFundingIncrement: (1).algo(),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: dummy_error]`)
  })
})

describe('rekey', () => {
  const localnet = algorandFixture()
  const env = process.env

  beforeEach(async () => {
    vitest.resetModules()
    process.env = { ...env }
    await localnet.newScope()
  }, 10_000)

  afterEach(() => {
    process.env = env
  })

  test('Rekey works', async () => {
    const { testAccount, algorand } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.account.rekeyAccount(testAccount, secondAccount, {
      note: 'Rekey',
    })

    // This will throw if the rekey wasn't successful
    await algorand.send.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: (1).microAlgo(),
      signer: secondAccount.signer,
    })
  })
})
