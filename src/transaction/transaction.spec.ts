import algosdk, { ABIMethod, ABIType, Account, Address } from 'algosdk'
import invariant from 'tiny-invariant'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import externalARC32 from '../../tests/example-contracts/resource-packer/artifacts/ExternalApp.arc32.json'
import v8ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv8.arc32.json'
import v9ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv9.arc32.json'
import { Config } from '../config'
import { algorandFixture } from '../testing'
import { AlgoAmount } from '../types/amount'
import { AppClient } from '../types/app-client'
import { PaymentParams, TransactionComposer } from '../types/composer'
import { Arc2TransactionNote } from '../types/transaction'
import { getABIReturnValue, waitForConfirmation } from './transaction'

describe('transaction', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 10_000)

  const getTestTransaction = (amount?: AlgoAmount, sender?: string) => {
    return {
      sender: sender ?? localnet.context.testAccount,
      receiver: localnet.context.testAccount,
      amount: amount ?? (1).microAlgo(),
    } as PaymentParams
  }

  test('Transaction is capped by low min txn fee', async () => {
    const { algorand } = localnet.context
    await expect(async () => {
      await algorand.send.payment({ ...getTestTransaction(), maxFee: (1).microAlgo() })
    }).rejects.toThrowError('Transaction fee 1000 µALGO is greater than maxFee 1 µALGO')
  })

  test('Transaction cap is ignored if higher than fee', async () => {
    const { algorand } = localnet.context
    const { confirmation } = await algorand.send.payment({ ...getTestTransaction(), maxFee: (1_000_000).microAlgo() })

    expect(confirmation?.txn.txn.fee).toBe(1000n)
  })

  test('Transaction fee is overridable', async () => {
    const { algorand } = localnet.context
    const fee = (1).algo()
    const { confirmation } = await algorand.send.payment({ ...getTestTransaction(), staticFee: fee })

    expect(confirmation.txn.txn.fee).toBe(fee.microAlgo)
  })

  test('Transaction group is sent', async () => {
    const { algorand } = localnet.context

    const {
      transactions: [txn1, txn2],
      confirmations,
    } = await algorand.newGroup().addPayment(getTestTransaction((1).microAlgo())).addPayment(getTestTransaction((2).microAlgo())).send()

    invariant(confirmations[0].txn.txn.group)
    invariant(confirmations[1].txn.txn.group)
    invariant(txn1.group)
    invariant(txn2.group)
    expect(confirmations.length).toBe(2)
    expect(confirmations[0].confirmedRound).toBeGreaterThanOrEqual(txn1.firstValid)
    expect(confirmations[1].confirmedRound).toBeGreaterThanOrEqual(txn2.firstValid)
    expect(Buffer.from(confirmations[0].txn.txn.group).toString('hex')).toBe(Buffer.from(txn1.group).toString('hex'))
    expect(Buffer.from(confirmations[1].txn.txn.group).toString('hex')).toBe(Buffer.from(txn2.group).toString('hex'))
  })

  test('Multisig single account', async () => {
    const { algorand, testAccount } = localnet.context

    // Setup multisig
    const multisig = algorand.account.multisig(
      {
        addrs: [testAccount],
        threshold: 1,
        version: 1,
      },
      [testAccount],
    )

    // Fund multisig
    await algorand.send.payment({
      sender: testAccount,
      receiver: multisig,
      amount: (1).algo(),
    })

    // Use multisig
    await algorand.send.payment({
      sender: multisig,
      receiver: testAccount,
      amount: (500).microAlgo(),
    })
  })

  test('Multisig double account', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context
    const account2 = await generateAccount({
      initialFunds: (10).algo(),
      suppressLog: true,
    })

    // Setup multisig
    const multisig = algorand.account.multisig(
      {
        addrs: [testAccount, account2],
        threshold: 2,
        version: 1,
      },
      [testAccount, account2],
    )

    // Fund multisig
    await algorand.send.payment({
      sender: testAccount,
      receiver: multisig,
      amount: (1).algo(),
    })

    // Use multisig
    await algorand.send.payment({
      sender: multisig,
      receiver: testAccount,
      amount: (500).microAlgo(),
    })
  })

  test('Transaction wait for confirmation http error', async () => {
    const { algorand, algod } = localnet.context
    const txn = await algorand.createTransaction.payment(getTestTransaction())
    try {
      await waitForConfirmation(txn.txID(), 5, algod)
    } catch (e: unknown) {
      expect((e as Error).message).toEqual(`Transaction ${txn.txID()} not confirmed after 5 rounds`)
    }
  })

  test('Transaction fails in debug mode, error is enriched using simulate', async () => {
    const { algorand, testAccount } = localnet.context
    const txn1 = await algorand.createTransaction.payment(getTestTransaction((1).microAlgo()))
    // This will fail due to fee being too high
    const txn2 = await algorand.createTransaction.payment(getTestTransaction((9999999999999).microAlgo()))
    try {
      await algorand.newGroup().addTransaction(txn1).addTransaction(txn2).send()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const messageRegex = new RegExp(
        `transaction ${txn2.txID()}: overspend \\(account ${testAccount}, data \\{.*\\}, tried to spend \\{9999999999999\\}\\)`,
      )
      expect(e.traces[0].message).toMatch(messageRegex)
    }
  })
})

describe('arc2 transaction note', () => {
  test('arc-0002', () => {
    expect(
      TransactionComposer.arc2Note({
        dAppName: 'a',
        format: 'u',
        data: 'abc',
      } as Arc2TransactionNote),
    ).toMatchInlineSnapshot(`
      Uint8Array [
        97,
        58,
        117,
        97,
        98,
        99,
      ]
    `)
  })
})

const tests = (version: 8 | 9) => () => {
  const fixture = algorandFixture()

  let appClient: AppClient
  let externalClient: AppClient

  beforeEach(fixture.newScope)

  beforeAll(async () => {
    Config.configure({ populateAppCallResources: true })
    await fixture.newScope()
    const { algorand, testAccount } = fixture.context

    const appFactory = algorand.client.getAppFactory({
      appSpec: JSON.stringify(version === 8 ? v8ARC32 : v9ARC32),
      defaultSender: testAccount,
    })

    appClient = (await appFactory.send.create({ method: 'createApplication' })).appClient

    await appClient.fundAppAccount({ amount: (2334300).microAlgo() })

    await appClient.send.call({ method: 'bootstrap', staticFee: (3_000).microAlgo() })

    externalClient = algorand.client.getAppClientById({
      appSpec: JSON.stringify(externalARC32),
      appId: (await appClient.getGlobalState()).externalAppID.value as bigint,
      defaultSender: testAccount,
    })
  })

  afterAll(() => {
    Config.configure({ populateAppCallResources: false })
  })

  let alice: Address & Account

  describe('accounts', () => {
    test('addressBalance: invalid Account reference', async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.send.call({ method: 'addressBalance', args: [testAccount.toString()], populateAppCallResources: false }),
      ).rejects.toThrow('invalid Account reference')
    })

    test('addressBalance', async () => {
      await appClient.send.call({ method: 'addressBalance', args: [alice.toString()] })
    })
  })

  describe('boxes', () => {
    test('smallBox: invalid Box reference', async () => {
      await expect(appClient.send.call({ method: 'smallBox', populateAppCallResources: false })).rejects.toThrow('invalid Box reference')
    })

    test('smallBox', async () => {
      await appClient.send.call({ method: 'smallBox' })
    })

    test('mediumBox', async () => {
      await appClient.send.call({ method: 'mediumBox' })
    })
  })

  describe('apps', () => {
    test('externalAppCall: unavailable App', async () => {
      await expect(
        appClient.send.call({
          method: 'externalAppCall',
          populateAppCallResources: false,
          staticFee: (2_000).microAlgo(),
        }),
      ).rejects.toThrow('unavailable App')
    })

    test('externalAppCall', async () => {
      await appClient.send.call({
        method: 'externalAppCall',
        staticFee: (2_000).microAlgo(),
      })
    })
  })

  describe('assets', () => {
    test('assetTotal: unavailable Asset', async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(appClient.send.call({ method: 'assetTotal', populateAppCallResources: false })).rejects.toThrow('unavailable Asset')
    })

    test('assetTotal', async () => {
      await appClient.send.call({ method: 'assetTotal' })
    })
  })

  describe('cross-product references', () => {
    const hasAssetErrorMsg = version === 8 ? 'invalid Account reference' : 'unavailable Account'

    test(`hasAsset: ${hasAssetErrorMsg}`, async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.send.call({ method: 'hasAsset', args: [testAccount.toString()], populateAppCallResources: false }),
      ).rejects.toThrow(hasAssetErrorMsg)
    })

    test('hasAsset', async () => {
      const { testAccount } = fixture.context
      await appClient.send.call({ method: 'hasAsset', args: [testAccount.toString()] })
    })

    test(`externalLocal: ${hasAssetErrorMsg}`, async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.send.call({ method: 'externalLocal', args: [testAccount.toString()], populateAppCallResources: false }),
      ).rejects.toThrow(hasAssetErrorMsg)
    })

    test('externalLocal', async () => {
      const { algorand, testAccount } = fixture.context

      await algorand.send.appCallMethodCall(await externalClient.params.optIn({ method: 'optInToApplication', sender: testAccount }))

      await algorand.send.appCallMethodCall(
        await appClient.params.call({
          method: 'externalLocal',
          args: [testAccount.toString()],
          sender: testAccount,
        }),
      )
    })
  })

  describe('sendTransaction', () => {
    test('addressBalance: invalid Account reference', async () => {
      await expect(
        appClient.send.call({
          method: 'addressBalance',
          args: [algosdk.generateAccount().addr.toString()],
          populateAppCallResources: false,
        }),
      ).rejects.toThrow('invalid Account reference')
    })

    test('addressBalance', async () => {
      const result = await appClient.send.call({
        method: 'addressBalance',
        args: [algosdk.generateAccount().addr.toString()],
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
      })

      // Ensure the transaction was not sent via simulate
      await fixture.context.waitForIndexerTransaction(result.txIds[0])
    })
  })
}

describe('Resource Packer: AVM8', tests(8))
describe('Resource Packer: AVM9', tests(9))
describe('Resource Packer: Mixed', () => {
  const fixture = algorandFixture()

  let v9Client: AppClient
  let v8Client: AppClient

  beforeEach(fixture.newScope)

  beforeAll(async () => {
    Config.configure({ populateAppCallResources: true })

    await fixture.newScope()

    const testAccount = fixture.context.testAccount

    const v8AppFactory = fixture.algorand.client.getAppFactory({
      appSpec: JSON.stringify(v8ARC32),
      defaultSender: testAccount,
    })

    const v9AppFactory = fixture.algorand.client.getAppFactory({
      appSpec: JSON.stringify(v9ARC32),
      defaultSender: testAccount,
    })

    const v8Result = await v8AppFactory.send.create({ method: 'createApplication' })
    const v9Result = await v9AppFactory.send.create({ method: 'createApplication' })
    v8Client = v8Result.appClient
    v9Client = v9Result.appClient
  })

  afterAll(() => {
    Config.configure({ populateAppCallResources: false })
  })

  test('same account', async () => {
    const { algorand, testAccount } = fixture.context
    const acct = algosdk.generateAccount()

    const rekeyedTo = algorand.account.random()
    await algorand.account.rekeyAccount(testAccount, rekeyedTo)

    const { transactions } = await algorand.send
      .newGroup()
      .addAppCallMethodCall(await v8Client.params.call({ method: 'addressBalance', args: [acct.addr.toString()], sender: testAccount }))
      .addAppCallMethodCall(await v9Client.params.call({ method: 'addressBalance', args: [acct.addr.toString()], sender: testAccount }))
      .send({ populateAppCallResources: true })

    const v8CallAccts = transactions[0].applicationCall?.accounts ?? []
    const v9CallAccts = transactions[1].applicationCall?.accounts ?? []

    expect(v8CallAccts.length + v9CallAccts.length).toBe(1)
  })

  test('app account', async () => {
    const { algorand, testAccount } = fixture.context

    await v8Client.fundAppAccount({ amount: (328500).microAlgo() })
    await v8Client.send.call({ method: 'bootstrap', staticFee: (3_000).microAlgo() })

    const externalAppID = (await v8Client.getGlobalState()).externalAppID!.value as bigint

    const { transactions } = await algorand.send
      .newGroup()
      .addAppCallMethodCall(await v8Client.params.call({ method: 'externalAppCall', staticFee: (2_000).microAlgo(), sender: testAccount }))
      .addAppCallMethodCall(
        await v9Client.params.call({
          method: 'addressBalance',
          args: [algosdk.getApplicationAddress(externalAppID).toString()],
          sender: testAccount,
        }),
      )
      .send({ populateAppCallResources: true })

    const v8CallApps = transactions[0].applicationCall?.foreignApps ?? []
    const v9CallAccts = transactions[1].applicationCall?.accounts ?? []

    expect(v8CallApps!.length + v9CallAccts!.length).toBe(1)
  })
})

describe('Resource Packer: meta', () => {
  const fixture = algorandFixture()

  let externalClient: AppClient

  beforeEach(fixture.newScope)

  beforeAll(async () => {
    await fixture.newScope()
    const { algorand, testAccount } = fixture.context
    Config.configure({ populateAppCallResources: true })

    const factory = algorand.client.getAppFactory({
      appSpec: JSON.stringify(externalARC32),
      defaultSender: testAccount,
    })

    const result = await factory.send.create({ method: 'createApplication' })
    externalClient = result.appClient
  })

  afterAll(() => {
    Config.configure({ populateAppCallResources: false })
  })

  test('error during simulate', async () => {
    try {
      await externalClient.send.call({ method: 'error' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.stack).toMatch(`err <--- Error`)
      expect(e.message).toMatch('Error during resource population simulation in transaction 0')
    }
  })

  test('box with txn arg', async () => {
    const { testAccount, algorand } = fixture.context

    const payment = await algorand.createTransaction.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: (0).microAlgo(),
    })

    await externalClient.fundAppAccount({ amount: (106100).microAlgo() })

    await externalClient.send.call({ method: 'boxWithPayment', args: [{ txn: payment, signer: testAccount.signer }] })
  })

  test('sender asset holding', async () => {
    await externalClient.fundAppAccount({ amount: (200_000).microAlgo() })

    await externalClient.send.call({
      method: 'createAsset',
      staticFee: (2_000).microAlgo(),
    })
    const res = await externalClient.send.call({ method: 'senderAssetBalance' })

    expect(res.transaction.applicationCall?.accounts?.length || 0).toBe(0)
  })

  test('rekeyed account', async () => {
    const { testAccount } = fixture.context
    const { algorand } = fixture

    const authAddr = algorand.account.random()

    await algorand.account.rekeyAccount(testAccount, authAddr)

    await externalClient.fundAppAccount({ amount: (200_001).microAlgo() })

    await externalClient.send.call({
      method: 'createAsset',
      staticFee: (2_001).microAlgo(),
    })
    const res = await externalClient.send.call({
      method: 'senderAssetBalance',
    })

    expect(res.transaction.applicationCall?.accounts?.length || 0).toBe(0)
  })
})

describe('abi return', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getABIResult = (type: string, value: any) => {
    const abiType = ABIType.from(type)
    const result = {
      method: new ABIMethod({ name: '', args: [], returns: { type: type } }),
      rawReturnValue: abiType.encode(value),
      returnValue: abiType.decode(abiType.encode(value)),
      txID: '',
    } as algosdk.ABIResult
    return getABIReturnValue(result)
  }

  test('uint32', () => {
    expect(getABIResult('uint32', 0).returnValue).toBe(0)
    expect(getABIResult('uint32', 0n).returnValue).toBe(0)
    expect(getABIResult('uint32', 1).returnValue).toBe(1)
    expect(getABIResult('uint32', 1n).returnValue).toBe(1)
    expect(getABIResult('uint32', 2 ** 32 - 1).returnValue).toBe(2 ** 32 - 1)
    expect(getABIResult('uint32', 2n ** 32n - 1n).returnValue).toBe(2 ** 32 - 1)
  })

  test('uint64', () => {
    expect(getABIResult('uint64', 0).returnValue).toBe(0n)
    expect(getABIResult('uint64', 1).returnValue).toBe(1n)
    expect(getABIResult('uint64', 2 ** 32 - 1).returnValue).toBe(2n ** 32n - 1n)
    expect(getABIResult('uint64', 2n ** 64n - 1n).returnValue).toBe(2n ** 64n - 1n)
  })

  test('uint32[]', () => {
    expect(getABIResult('uint32[]', [0]).returnValue).toEqual([0])
    expect(getABIResult('uint32[]', [0n]).returnValue).toEqual([0])
    expect(getABIResult('uint32[]', [1]).returnValue).toEqual([1])
    expect(getABIResult('uint32[]', [1n]).returnValue).toEqual([1])
    expect(getABIResult('uint32[]', [1, 2, 3]).returnValue).toEqual([1, 2, 3])
    expect(getABIResult('uint32[]', [1n, 2n, 3]).returnValue).toEqual([1, 2, 3])
    expect(getABIResult('uint32[]', [2 ** 32 - 1]).returnValue).toEqual([2 ** 32 - 1])
    expect(getABIResult('uint32[]', [2n ** 32n - 1n, 1]).returnValue).toEqual([2 ** 32 - 1, 1])
  })

  test('uint32[n]', () => {
    expect(getABIResult('uint32[1]', [0]).returnValue).toEqual([0])
    expect(getABIResult('uint32[1]', [0n]).returnValue).toEqual([0])
    expect(getABIResult('uint32[1]', [1]).returnValue).toEqual([1])
    expect(getABIResult('uint32[1]', [1n]).returnValue).toEqual([1])
    expect(getABIResult('uint32[3]', [1, 2, 3]).returnValue).toEqual([1, 2, 3])
    expect(getABIResult('uint32[3]', [1n, 2n, 3]).returnValue).toEqual([1, 2, 3])
    expect(getABIResult('uint32[1]', [2 ** 32 - 1]).returnValue).toEqual([2 ** 32 - 1])
    expect(getABIResult('uint32[2]', [2n ** 32n - 1n, 1]).returnValue).toEqual([2 ** 32 - 1, 1])
  })

  test('uint64[]', () => {
    expect(getABIResult('uint64[]', [0]).returnValue).toEqual([0n])
    expect(getABIResult('uint64[]', [0n]).returnValue).toEqual([0n])
    expect(getABIResult('uint64[]', [1]).returnValue).toEqual([1n])
    expect(getABIResult('uint64[]', [1n]).returnValue).toEqual([1n])
    expect(getABIResult('uint64[]', [1, 2, 3]).returnValue).toEqual([1n, 2n, 3n])
    expect(getABIResult('uint64[]', [1n, 2n, 3]).returnValue).toEqual([1n, 2n, 3n])
    expect(getABIResult('uint64[]', [2 ** 32 - 1]).returnValue).toEqual([2n ** 32n - 1n])
    expect(getABIResult('uint64[]', [2n ** 64n - 1n, 1]).returnValue).toEqual([2n ** 64n - 1n, 1n])
  })

  test('uint64[n]', () => {
    expect(getABIResult('uint64[1]', [0]).returnValue).toEqual([0n])
    expect(getABIResult('uint64[1]', [0n]).returnValue).toEqual([0n])
    expect(getABIResult('uint64[1]', [1]).returnValue).toEqual([1n])
    expect(getABIResult('uint64[1]', [1n]).returnValue).toEqual([1n])
    expect(getABIResult('uint64[3]', [1, 2, 3]).returnValue).toEqual([1n, 2n, 3n])
    expect(getABIResult('uint64[3]', [1n, 2n, 3]).returnValue).toEqual([1n, 2n, 3n])
    expect(getABIResult('uint64[1]', [2 ** 32 - 1]).returnValue).toEqual([2n ** 32n - 1n])
    expect(getABIResult('uint64[2]', [2n ** 64n - 1n, 1]).returnValue).toEqual([2n ** 64n - 1n, 1n])
  })

  test('(uint32,uint64,(uint32,uint64),uint32[],uint64[])', () => {
    const type = '(uint32,uint64,(uint32,uint64),uint32[],uint64[])'
    expect(getABIResult(type, [0, 0, [0, 0], [0], [0]]).returnValue).toEqual([0, 0n, [0, 0n], [0], [0n]])
    expect(getABIResult(type, [1, 1, [1, 1], [1], [1]]).returnValue).toEqual([1, 1n, [1, 1n], [1], [1n]])
    expect(getABIResult(type, [2 ** 32 - 1, 2n ** 64n - 1n, [2 ** 32 - 1, 2n ** 64n - 1n], [1, 2, 3], [1, 2, 3]]).returnValue).toEqual([
      2 ** 32 - 1,
      2n ** 64n - 1n,
      [2 ** 32 - 1, 2n ** 64n - 1n],
      [1, 2, 3],
      [1n, 2n, 3n],
    ])
  })
})
