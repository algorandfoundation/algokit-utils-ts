/* eslint-disable no-console */
import algosdk from 'algosdk'
import { APP_SPEC, TestContractClient } from '../../tests/example-contracts/client/TestContractClient'
import { algorandFixture } from '../testing'
import AlgorandClient from './algorand-client'
import { AlgoAmount } from './amount'
import { MethodCallParams } from './composer'

async function compileProgram(algorand: AlgorandClient, b64Teal: string) {
  const teal = new Uint8Array(Buffer.from(b64Teal, 'base64'))
  const result = await algorand.client.algod.compile(teal).do()

  return new Uint8Array(Buffer.from(result.result, 'base64'))
}

describe('AlgorandClient', () => {
  let algorand: AlgorandClient
  let alice: string
  let bob: string
  let appClient: TestContractClient
  let appId: bigint

  const fixture = algorandFixture()

  beforeAll(async () => {
    await fixture.beforeEach()

    alice = fixture.context.testAccount.addr
    bob = (await fixture.context.generateAccount({ initialFunds: AlgoAmount.MicroAlgos(100_000) })).addr

    algorand = fixture.algorand
    appClient = algorand.client.getTypedAppClientById(TestContractClient, {
      id: 0,
      sender: algorand.account.getAccount(alice),
    })

    const app = await appClient.create.createApplication({})
    appId = BigInt(app.appId)
  }, 10_000)

  test('sendPayment', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).amount
    const bobPreBalance = (await algorand.account.getInformation(bob)).amount
    await algorand.send.payment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgos(1) })
    const alicePostBalance = (await algorand.account.getInformation(alice)).amount
    const bobPostBalance = (await algorand.account.getInformation(bob)).amount

    expect(alicePostBalance).toBe(alicePreBalance - 1001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)
  })

  test('sendAssetCreate', async () => {
    const createResult = await algorand.send.assetCreate({ sender: alice, total: 100n })

    const assetIndex = Number(createResult.confirmation.assetIndex)

    expect(assetIndex).toBeGreaterThan(0)
  })

  test('addAtc from generated client', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).amount
    const bobPreBalance = (await algorand.account.getInformation(bob)).amount

    const doMathAtc = await appClient.compose().doMath({ a: 1, b: 2, operation: 'sum' }).atc()
    const result = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgos(1) })
      .addAtc(doMathAtc)
      .execute()

    const alicePostBalance = (await algorand.account.getInformation(alice)).amount
    const bobPostBalance = (await algorand.account.getInformation(bob)).amount

    expect(alicePostBalance).toBe(alicePreBalance - 2001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)

    expect(result.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('addMethodCall', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).amount
    const bobPreBalance = (await algorand.account.getInformation(bob)).amount

    const methodRes = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: bob, amount: AlgoAmount.MicroAlgos(1), note: new Uint8Array([1]) })
      .addMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('doMath')!,
        args: [1, 2, 'sum'],
      })
      .execute()

    const alicePostBalance = (await algorand.account.getInformation(alice)).amount
    const bobPostBalance = (await algorand.account.getInformation(bob)).amount

    expect(alicePostBalance).toBe(alicePreBalance - 2001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)

    expect(methodRes.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('method with txn arg', async () => {
    const txnArgParams = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgos(0) })],
    }

    const txnRes = await algorand
      .newGroup()
      .addPayment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgos(0), note: new Uint8Array([1]) })
      .addMethodCall(txnArgParams)
      .execute()

    expect(txnRes.returns?.[0].returnValue?.valueOf()).toBe(alice)
  })

  test('method with method call arg', async () => {
    const helloWorldCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('helloWorld')!,
    } satisfies MethodCallParams

    const methodArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('methodArg')!,
        args: [helloWorldCall],
      })
      .execute()

    expect(methodArgRes.returns?.[0].returnValue?.valueOf()).toBe('Hello, World!')
    expect(methodArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with method call arg that has a txn arg', async () => {
    const txnArgCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgos(0) })],
    } satisfies MethodCallParams

    const nestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('nestedTxnArg')!,
        args: [txnArgCall],
      })
      .execute()

    expect(nestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice)
    expect(nestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with two method call args that each have a txn arg', async () => {
    const firstTxnCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgos(0) })],
    } satisfies MethodCallParams

    const secondTxnCall = {
      sender: alice,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice, receiver: alice, amount: AlgoAmount.MicroAlgos(1) })],
      note: new Uint8Array([1]),
    } satisfies MethodCallParams

    const doubleNestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice,
        appId: appId,
        method: appClient.appClient.getABIMethod('doubleNestedTxnArg')!,
        args: [firstTxnCall, secondTxnCall],
      })
      .execute()

    expect(doubleNestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice)
    expect(doubleNestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(alice)
    expect(doubleNestedTxnArgRes.returns?.[2].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('assetOptIn', async () => {
    const { algod } = fixture.context
    const assetId = BigInt((await algorand.send.assetCreate({ sender: alice, total: 1n })).confirmation.assetIndex!)

    await algorand.send.assetOptIn({
      sender: alice,
      assetId: assetId,
    })
    expect(await algod.accountAssetInformation(alice, Number(assetId)).do()).toBeDefined()
  })

  test('methodCall create', async () => {
    const contract = new algosdk.ABIContract(APP_SPEC.contract)

    await algorand.send.methodCall({
      sender: alice,
      appId: 0n,
      method: contract.getMethodByName('createApplication'),
      approvalProgram: await compileProgram(algorand, APP_SPEC.source.approval),
      clearProgram: await compileProgram(algorand, APP_SPEC.source.clear),
    })
  })

  test('issue more than non-LocalNet default validity window transactions against LocalNet works', async () => {
    const algorand = AlgorandClient.defaultLocalNet()

    const alice = algorand.account.random()

    await algorand.send.payment({
      sender: await algorand.account.localNetDispenser(),
      receiver: alice,
      amount: (2).algos(),
    })

    // Default validity window is 10
    for (let i = 0; i < 10; i++) {
      await algorand.send.payment({ sender: alice, receiver: alice, amount: i.microAlgos() })
    }
  })
})
