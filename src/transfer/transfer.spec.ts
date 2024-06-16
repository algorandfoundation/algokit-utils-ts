import { describe, test } from '@jest/globals'
import algosdk, { TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from '..'
import { algorandFixture } from '../testing'
import { generateTestAsset } from '../testing/_asset'
import { ClientManager } from '../types/client-manager'
import { TestNetDispenserApiClient } from '../types/dispenser-client'

describe('transfer', () => {
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
    const { algod, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    const { transaction, confirmation } = await algokit.transferAlgos(
      {
        from: testAccount,
        to: secondAccount.addr,
        amount: algokit.algos(5),
        note: 'Transfer 5 ALGOs',
      },
      algod,
    )
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()

    expect(transaction).toBeInstanceOf(algosdk.Transaction)
    expect(transaction.type).toBe(TransactionType.pay)
    expect(confirmation?.txn.txn.type).toBe('pay')

    expect(transaction.amount).toBe(5_000_000)
    expect(confirmation?.txn.txn.amt).toBe(5_000_000)

    expect(algosdk.encodeAddress(transaction.from.publicKey)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(confirmation!.txn.txn.snd)).toBe(testAccount.addr)

    expect(accountInfo['amount']).toBe(5_000_000)
  })

  test('Transfer Algo respects string lease', async () => {
    const { algod, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    await algokit.transferAlgos(
      {
        from: testAccount,
        to: secondAccount.addr,
        amount: algokit.algos(1),
        lease: 'test',
      },
      algod,
    )

    await expect(
      algokit.transferAlgos(
        {
          from: testAccount,
          to: secondAccount.addr,
          amount: algokit.algos(1),
          lease: 'test',
        },
        algod,
      ),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer Algo respects byte array lease', async () => {
    const { algod, testAccount } = localnet.context
    const secondAccount = algosdk.generateAccount()

    await algokit.transferAlgos(
      {
        from: testAccount,
        to: secondAccount.addr,
        amount: algokit.algos(1),
        lease: new Uint8Array([1, 2, 3, 4]),
      },
      algod,
    )

    await expect(
      algokit.transferAlgos(
        {
          from: testAccount,
          to: secondAccount.addr,
          amount: algokit.algos(1),
          lease: new Uint8Array([1, 2, 3, 4]),
        },
        algod,
      ),
    ).rejects.toThrow(/overlapping lease/)
  })

  test('Transfer ASA, receiver is not opted in', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })
    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)
    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 1,
        lease: 'test',
      },
      algod,
    )

    await expect(
      algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetId: dummyAssetId,
          amount: 1,
          lease: 'test',
        },
        algod,
      ),
    ).rejects.toThrow(/overlapping lease/)
  }, 10e6)

  test('Transfer ASA respects lease', async () => {
    const { algod, testAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetId: dummyAssetId,
          amount: 5,
          note: `Transfer 5 assets with id ${dummyAssetId}`,
        },
        algod,
      )
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('receiver error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, sender is not opted in', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetId: dummyAssetId,
          amount: 5,
          note: `Transfer 5 assets with id ${dummyAssetId}`,
        },
        algod,
      )
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('sender error: must optin')
    }
  }, 10e6)

  test('Transfer ASA, asset doesnt exist', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    try {
      await algokit.transferAsset(
        {
          from: testAccount,
          to: secondAccount.addr,
          assetId: 1,
          amount: 5,
          note: `Transfer asset with wrong id`,
        },
        algod,
      )
    } catch (e: unknown) {
      expect((e as Error).name).toEqual('URLTokenBaseHTTPError')
      expect((e as Error).message).toContain('asset 1 missing from')
    }
  }, 10e6)

  test('Transfer ASA, without sending', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    const response = await algokit.transferAsset(
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
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      },
      algod,
    )

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetId).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetId).do()
    expect(testAccountInfo['asset-holding']['amount']).toBe(95)
  }, 10e6)

  test('Transfer ASA, asset is transfered to another account from revocationTarget', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })
    const clawbackAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.assetOptIn({ account: secondAccount, assetId: dummyAssetId }, algod)

    await algokit.assetOptIn({ account: clawbackAccount, assetId: dummyAssetId }, algod)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: clawbackAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
      },
      algod,
    )

    const clawbackFromInfo = await algod.accountAssetInformation(clawbackAccount.addr, dummyAssetId).do()
    expect(clawbackFromInfo['asset-holding']['amount']).toBe(5)

    await algokit.transferAsset(
      {
        from: testAccount,
        to: secondAccount.addr,
        assetId: dummyAssetId,
        amount: 5,
        note: `Transfer 5 assets with id ${dummyAssetId}`,
        clawbackFrom: clawbackAccount,
      },
      algod,
    )

    const secondAccountInfo = await algod.accountAssetInformation(secondAccount.addr, dummyAssetId).do()
    expect(secondAccountInfo['asset-holding']['amount']).toBe(5)

    const clawbackAccountInfo = await algod.accountAssetInformation(clawbackAccount.addr, dummyAssetId).do()
    expect(clawbackAccountInfo['asset-holding']['amount']).toBe(0)

    const testAccountInfo = await algod.accountAssetInformation(testAccount.addr, dummyAssetId).do()
    expect(testAccountInfo['asset-holding']['amount']).toBe(95)
  }, 10e6)

  test('ensureFunded is sent and waited for with correct amount for new account', async () => {
    const { algod, kmd, testAccount, algorand } = localnet.context
    const secondAccount = algorand.account.random()

    const result = await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        fundingSource: testAccount,
        minSpendingBalance: algokit.microAlgos(1),
      },
      algod,
      kmd,
    )
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()

    invariant(result)
    expect(result.transactionId).toBeDefined()
    expect(result.amount).toBeDefined()
    const txnInfo = await algod.pendingTransactionInformation(result.transactionId).do()

    expect(txnInfo.txn.txn.type).toBe('pay')

    expect(result.amount).toBe(100_001)
    expect(txnInfo.txn.txn.amt).toBe(100_001)
    expect(accountInfo['amount']).toBe(100_001)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(txnInfo.txn.txn.snd)).toBe(testAccount.addr)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(algosdk.encodeAddress(txnInfo.txn.txn.rcv!)).toBe(secondAccount.addr)
  })

  test('ensureFunded respects minimum funding increment', async () => {
    const { algod, testAccount, kmd, generateAccount } = localnet.context
    const secondAccount = await generateAccount({ initialFunds: (1).algos() })

    await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        fundingSource: testAccount,
        minSpendingBalance: algokit.microAlgos(1),
        minFundingIncrement: algokit.algos(1),
      },
      algod,
      kmd,
    )

    const accountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(accountInfo['amount']).toBe(1_000_000)
  })

  test('ensureFunded uses dispenser account by default', async () => {
    const { algod, kmd, algorand } = localnet.context
    const secondAccount = algorand.account.random()
    const dispenser = await algorand.account.dispenserFromEnvironment()

    const result = await algokit.ensureFunded(
      {
        accountToFund: secondAccount,
        minSpendingBalance: algokit.microAlgos(1),
        minFundingIncrement: algokit.algos(1),
      },
      algod,
      kmd,
    )

    invariant(result)
    const txnInfo = await algod.pendingTransactionInformation(result.transactionId).do()
    const resultReceiver = algosdk.encodeAddress(txnInfo.txn.txn.snd)
    expect(resultReceiver).toBe(dispenser.addr)
    const accountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(accountInfo['amount']).toBe(1_000_000)
  })

  test('ensureFunded uses dispenser api with access token successfully', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algodClient = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))
    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: jest.fn().mockImplementation(() => {
        return Promise.resolve({ txId: 'dummy_tx_id', amount: 200_000 })
      }),
    })

    const accountToFund = algosdk.generateAccount()

    const result = await algokit.ensureFunded(
      {
        accountToFund: accountToFund,
        minSpendingBalance: algokit.algos(100),
        minFundingIncrement: algokit.algos(0.1),
        fundingSource: dispenserClient,
      },
      algodClient,
    )

    invariant(result)
    expect(result.transactionId).toBeDefined()
    expect(result.amount).toBe(200_000)
  })

  test('ensureFunded uses dispenser api and fails with rejected response', async () => {
    process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'dummy_token'

    const algodClient = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))
    const dispenserClient = new TestNetDispenserApiClient()
    Object.assign(dispenserClient, {
      fund: jest.fn().mockImplementation(() => {
        return Promise.reject(new Error('dummy_error'))
      }),
    })
    const accountToFund = algosdk.generateAccount()

    await expect(
      algokit.ensureFunded(
        {
          accountToFund: accountToFund,
          minSpendingBalance: algokit.algos(100),
          minFundingIncrement: algokit.algos(1),
          fundingSource: dispenserClient,
        },
        algodClient,
      ),
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
    const { algod, testAccount, algorand } = localnet.context
    const secondAccount = algorand.account.random()

    await algokit.rekeyAccount(
      {
        from: testAccount,
        rekeyTo: secondAccount,
        note: 'Rekey',
      },
      algod,
    )

    // This will throw if the rekey wasn't successful
    const rekeyedAccount = algorand.account.rekeyed(secondAccount, testAccount.addr)
    await algokit.transferAlgos(
      {
        amount: (1).microAlgos(),
        from: rekeyedAccount,
        to: testAccount.addr,
      },
      algod,
    )
  })
})
