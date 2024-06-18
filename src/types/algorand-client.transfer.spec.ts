import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import { transferAsset } from '..'
import { algorandFixture } from '../testing'
import { generateTestAsset } from '../testing/_asset'
import { AlgorandClient } from './algorand-client'
import { TestNetDispenserApiClient } from './dispenser-client'

describe('Transfer capability', () => {
  const localnet = algorandFixture()
  const env = process.env

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...env }
    await localnet.beforeEach()
  }, 10_000)

  afterEach(() => {
    process.env = env
  })

  test('Transfer Algo is sent and waited for', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    const result = await algorand.send.payment({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      amount: (5).algos(),
      note: 'Transfer 5 ALGOs',
    })

    const accountInfo = await algorand.account.getInformation(secondAccount.addr)

    expect(result.transaction).toBeInstanceOf(algosdk.Transaction)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(result.confirmation.txn.txn.type).toBe('pay')

    expect(result.transaction.amount).toBe(5_000_000)
    expect(result.confirmation.txn.txn.amt).toBe(5_000_000)

    expect(algosdk.encodeAddress(result.transaction.from.publicKey)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(result.confirmation.txn.txn.snd)).toBe(testAccount.addr)

    expect(accountInfo.balance.microAlgos).toBe(5_000_000)
  })

  test('Transfer Algo respects string lease', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.send.payment({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      amount: (1).algos(),
      lease: 'test',
    })

    await expect(
      algorand.send.payment({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
        amount: (2).algos(),
        lease: 'test',
      }),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer Algo respects byte array lease', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.send.payment({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      amount: (1).algos(),
      lease: new Uint8Array([1, 2, 3, 4]),
    })

    await expect(
      algorand.send.payment({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
        amount: (2).algos(),
        lease: new Uint8Array([1, 2, 3, 4]),
      }),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer ASA, respects lease', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })
    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      assetId: dummyAssetId,
      amount: 1n,
      lease: 'test',
    })

    await expect(
      algorand.send.assetTransfer({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 2n,
        lease: 'test',
      }),
    ).rejects.toThrow(/overlapping lease/)
  }, 10e6)

  test('Transfer ASA, receiver is not opted in', async () => {
    const { algorand, testAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 100)
    const secondAccount = algorand.account.random()

    try {
      await algorand.send.assetTransfer({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
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
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })

    try {
      await algorand.send.assetTransfer({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
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
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    try {
      await algorand.send.assetTransfer({
        sender: testAccount.addr,
        receiver: secondAccount.addr,
        assetId: 1n,
        amount: 5n,
        note: 'Transfer asset with wrong id',
      })
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('asset 1 missing from')
    }
  }, 10e6)

  // @deprecated test - remove when removing transferAsset
  test('Transfer ASA, without sending', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    const response = await transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: 1,
        amount: 5,
        note: `Transfer asset with wrong id`,
        skipSending: true,
      },
      algod,
    )

    expect(response.transaction).toBeDefined()
    expect(response.confirmation).toBeUndefined()
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    const secondAccountInfo = await algorand.account.getAssetInformation(secondAccount.addr, dummyAssetId)
    expect(secondAccountInfo.balance).toBe(5n)

    const testAccountInfo = await algorand.account.getAssetInformation(testAccount.addr, dummyAssetId)
    expect(testAccountInfo.balance).toBe(95n)
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account from revocationTarget', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algorand, testAccount.addr, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })
    const clawbackAccount = await generateAccount({ initialFunds: (1).algos() })

    await algorand.send.assetOptIn({ sender: secondAccount.addr, assetId: dummyAssetId })

    await algorand.send.assetOptIn({ sender: clawbackAccount.addr, assetId: dummyAssetId })

    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: clawbackAccount.addr,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
    })

    const clawbackFromInfo = await algorand.account.getAssetInformation(clawbackAccount.addr, dummyAssetId)
    expect(clawbackFromInfo.balance).toBe(5n)

    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: secondAccount.addr,
      assetId: dummyAssetId,
      amount: 5n,
      note: `Transfer 5 assets with id ${dummyAssetId}`,
      clawbackTarget: clawbackAccount.addr,
    })

    const secondAccountInfo = await algorand.account.getAssetInformation(secondAccount.addr, dummyAssetId)
    expect(secondAccountInfo.balance).toBe(5n)

    const clawbackAccountInfo = await algorand.account.getAssetInformation(clawbackAccount.addr, dummyAssetId)
    expect(clawbackAccountInfo.balance).toBe(0n)

    const testAccountInfo = await algorand.account.getAssetInformation(testAccount.addr, dummyAssetId)
    expect(testAccountInfo.balance).toBe(95n)
  }, 10e6)

  test('ensureFunded is sent and waited for with correct amount for new account', async () => {
    const { algorand, testAccount } = localnet.context
    const secondAccount = algorand.account.random()

    const result = await algorand.account.ensureFunded(secondAccount, testAccount, (1).microAlgos())
    const accountInfo = await algorand.account.getInformation(secondAccount.addr)

    invariant(result)
    expect(result.transactionId).toBe(result.transaction.txID())
    expect(result.amountFunded.microAlgos).toBe(100_001)
    expect(accountInfo.balance.microAlgos).toBe(100_001)
  })

  test('ensureFunded respects minimum funding increment', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const secondAccount = await generateAccount({ initialFunds: (100_000).microAlgos() })

    const result = await algorand.account.ensureFunded(secondAccount, testAccount, (1).microAlgos(), {
      minFundingIncrement: (1).algos(),
    })

    invariant(result)
    expect(result.amountFunded.algos).toBe(1)
    const accountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(accountInfo.balance.microAlgos).toBe(1_100_000)
  })

  test('ensureFunded uses dispenser account by default', async () => {
    const { algorand } = localnet.context
    const secondAccount = algorand.account.random()
    const dispenser = await algorand.account.dispenserFromEnvironment()

    const result = await algorand.account.ensureFundedFromEnvironment(secondAccount, (1).microAlgos(), {
      minFundingIncrement: (1).algos(),
    })

    invariant(result)
    const resultReceiver = algosdk.encodeAddress(result.confirmation.txn.txn.snd)
    expect(resultReceiver).toBe(dispenser.addr)
    const accountInfo = await algorand.account.getInformation(secondAccount.addr)
    expect(accountInfo.balance.algos).toBe(1)
  })

  test('ensureFunded uses dispenser api with access token successfully', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algorand = AlgorandClient.testNet()

    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: jest.fn().mockImplementation(() => {
        return Promise.resolve({ txId: 'dummy_tx_id', amount: 200_000 })
      }),
    })

    const accountToFund = algorand.account.random()

    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(accountToFund, dispenserClient, (100).algos(), {
      minFundingIncrement: (0.1).algos(),
    })

    invariant(result)
    expect(result.transactionId).toBeDefined()
    expect(result.amountFunded.algos).toBe(0.2)
  })

  test('ensureFunded uses dispenser api and fails with rejected response', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algorand = AlgorandClient.testNet()

    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('dummy_error'))
      }),
    })
    const accountToFund = algorand.account.random()

    await expect(
      algorand.account.ensureFundedFromTestNetDispenserApi(accountToFund, dispenserClient, (100).algos(), {
        minFundingIncrement: (1).algos(),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot('"dummy_error"')
  })
})

describe('rekey', () => {
  const localnet = algorandFixture()
  const env = process.env

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...env }
    await localnet.beforeEach()
  }, 10_000)

  afterEach(() => {
    process.env = env
  })

  test('Rekey works', async () => {
    const { testAccount, algorand } = localnet.context
    const secondAccount = algorand.account.random()

    await algorand.account.rekeyAccount(testAccount.addr, secondAccount.addr, {
      note: 'Rekey',
    })

    // This will throw if the rekey wasn't successful
    await algorand.send.payment({
      sender: testAccount.addr,
      receiver: testAccount.addr,
      amount: (1).microAlgos(),
      signer: secondAccount.signer,
    })
  })
})
