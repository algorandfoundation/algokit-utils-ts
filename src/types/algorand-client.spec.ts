/* eslint-disable no-console */
import algosdk, { Account, Address } from 'algosdk'
import { APP_SPEC, TestContractClient } from '../../tests/example-contracts/client/TestContractClient'
import { algorandFixture } from '../testing'
import { AlgorandClient } from './algorand-client'
import { AlgoAmount } from './amount'
import { AppCallMethodCall } from './composer'

async function compileProgram(algorand: AlgorandClient, b64Teal: string) {
  const teal = new Uint8Array(Buffer.from(b64Teal, 'base64'))
  const result = await algorand.client.algod.compile(teal).do()

  return new Uint8Array(Buffer.from(result.result, 'base64'))
}

describe('AlgorandClient', () => {
  let algorand: AlgorandClient
  let alice: Address & Account
  let bob: Address & Account
  let appClient: TestContractClient
  let appId: bigint

  const fixture = algorandFixture()

  beforeAll(async () => {
    await fixture.beforeEach()

    alice = fixture.context.testAccount
    bob = await fixture.context.generateAccount({ initialFunds: AlgoAmount.MicroAlgo(100_000) })

    algorand = fixture.algorand
    appClient = new TestContractClient(
      {
        sender: alice,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod,
    )

    const app = await appClient.create.createApplication({})
    appId = BigInt(app.appId)
  }, 10_000)

  test('sendPayment', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance
    await algorand.send.payment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgo(1) })
    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgo).toBe(alicePreBalance.microAlgo - 1001n)
    expect(bobPostBalance.microAlgo).toBe(bobPreBalance.microAlgo + 1n)
  })

  test('sendAssetCreate', async () => {
    const createResult = await algorand.send.assetCreate({ sender: alice, total: 100n })

    expect(createResult.assetId).toBeGreaterThan(0)
  })

  test('addAtc from generated client', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance

    const doMathAtc = await appClient.compose().doMath({ a: 1, b: 2, operation: 'sum' }).atc()
    const result = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgo(1) })
      .addAtc(doMathAtc)
      .send()

    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgo).toBe(alicePreBalance.microAlgo - 2001n)
    expect(bobPostBalance.microAlgo).toBe(bobPreBalance.microAlgo + 1n)

    expect(result.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('addAppCallMethodCall', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance

    const methodRes = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgo(1), note: new Uint8Array([1]) })
      .addAppCallMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('doMath')!,
        args: [1, 2, 'sum'],
        note: 'addAppCallMethodCall',
      })
      .send()

    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgo).toBe(alicePreBalance.microAlgo - 2001n)
    expect(bobPostBalance.microAlgo).toBe(bobPreBalance.microAlgo + 1n)

    expect(methodRes.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('addAppCall', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance

    const res = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgo(1), note: new Uint8Array([1]) })
      .addAppCall({
        sender: alice,
        appId: appId,
        args: [
          appClient.appClient.getABIMethod('doMath')!.getSelector(),
          algosdk.encodeUint64(1),
          algosdk.encodeUint64(2),
          Uint8Array.from(Buffer.from('AANzdW0=', 'base64')), //sum
        ],
        note: 'addAppCall',
      })
      .execute()

    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgo).toBe(alicePreBalance.microAlgo - 2001n)
    expect(bobPostBalance.microAlgo).toBe(bobPreBalance.microAlgo + 1n)
    expect(Buffer.from(res.confirmations[1].logs![0]).toString('hex')).toBe('151f7c750000000000000003')
  })

  test('method with txn arg', async () => {
    const txnRes = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgo(0), note: new Uint8Array([1]) })
      .addAppCallMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('txnArg')!,
        args: [algorand.createTransaction.payment({ sender: alice, receiver: alice, amount: (0).microAlgo() })],
      })
      .send()

    expect(txnRes.returns?.[0].returnValue?.valueOf()).toBe(alice.toString())
  })

  test('method with method call arg', async () => {
    const helloWorldCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('helloWorld')!,
    } satisfies AppCallMethodCall

    const methodArgRes = await algorand
      .newGroup()
      .addAppCallMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('methodArg')!,
        args: [helloWorldCall],
      })
      .send()

    expect(methodArgRes.returns?.[0].returnValue?.valueOf()).toBe('Hello, World!')
    expect(methodArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with method call arg that has a txn arg', async () => {
    const txnArgCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.createTransaction.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgo(0) })],
    } satisfies AppCallMethodCall

    const nestedTxnArgRes = await algorand
      .newGroup()
      .addAppCallMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('nestedTxnArg')!,
        args: [txnArgCall],
      })
      .send()

    expect(nestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.toString())
    expect(nestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with two method call args that each have a txn arg', async () => {
    const firstTxnCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.createTransaction.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgo(0) })],
    } satisfies AppCallMethodCall

    const secondTxnCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.createTransaction.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgo(1) })],
      note: new Uint8Array([1]),
    } satisfies AppCallMethodCall

    const doubleNestedTxnArgRes = await algorand
      .newGroup()
      .addAppCallMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('doubleNestedTxnArg')!,
        args: [firstTxnCall, secondTxnCall],
      })
      .send()

    expect(doubleNestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.toString())
    expect(doubleNestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(alice.toString())
    expect(doubleNestedTxnArgRes.returns?.[2].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('assetOptIn', async () => {
    const { algod } = fixture.context
    const assetId = (await algorand.send.assetCreate({ sender: alice, total: 1n })).assetId

    await algorand.send.assetOptIn({
      sender: alice,
      assetId: assetId,
    })
    expect(await algod.accountAssetInformation(alice, Number(assetId)).do()).toBeDefined()
  })

  test('methodCall create', async () => {
    const contract = new algosdk.ABIContract(APP_SPEC.contract)

    await algorand.send.appCreateMethodCall({
      sender: alice,
      method: contract.getMethodByName('createApplication'),
      approvalProgram: await compileProgram(algorand, APP_SPEC.source.approval),
      clearStateProgram: await compileProgram(algorand, APP_SPEC.source.clear),
    })
  })

  test('issue more than non-LocalNet default validity window transactions against LocalNet works', async () => {
    const algorand = AlgorandClient.defaultLocalNet()

    const alice = algorand.account.random()

    await algorand.send.payment({
      sender: await algorand.account.localNetDispenser(),
      receiver: alice,
      amount: (2).algo(),
    })

    // Default validity window is 10
    for (let i = 0; i < 10; i++) {
      await algorand.send.payment({ sender: alice, receiver: alice, amount: i.microAlgo() })
    }
  })
})
