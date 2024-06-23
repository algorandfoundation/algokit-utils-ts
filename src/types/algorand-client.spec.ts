/* eslint-disable no-console */
import algosdk from 'algosdk'
import { APP_SPEC, TestContractClient } from '../../tests/example-contracts/client/TestContractClient'
import { algorandFixture } from '../testing'
import { TransactionSignerAccount } from './account'
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
  let alice: TransactionSignerAccount
  let bob: TransactionSignerAccount
  let appClient: TestContractClient
  let appId: bigint

  const fixture = algorandFixture()

  beforeAll(async () => {
    await fixture.beforeEach()

    alice = fixture.context.testAccount
    bob = await fixture.context.generateAccount({ initialFunds: AlgoAmount.MicroAlgos(100_000) })

    algorand = fixture.algorand
    appClient = algorand.client.getTypedAppClientById(TestContractClient, {
      id: 0,
      sender: alice,
    })

    const app = await appClient.create.createApplication({})
    appId = BigInt(app.appId)
  }, 10_000)

  test('sendPayment', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance
    await algorand.send.payment({ sender: alice.addr, receiver: bob.addr, amount: AlgoAmount.MicroAlgos(1) })
    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgos).toBe(alicePreBalance.microAlgos - 1001)
    expect(bobPostBalance.microAlgos).toBe(bobPreBalance.microAlgos + 1)
  })

  test('sendAssetCreate', async () => {
    const createResult = await algorand.send.assetCreate({ sender: alice.addr, total: 100n })

    expect(createResult.assetId).toBeGreaterThan(0)
  })

  test('addAtc from generated client', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance

    const doMathAtc = await appClient.compose().doMath({ a: 1, b: 2, operation: 'sum' }).atc()
    const result = await algorand
      .newGroup()
      .addPayment({ sender: alice.addr, receiver: bob.addr, amount: AlgoAmount.MicroAlgos(1) })
      .addAtc(doMathAtc)
      .execute()

    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgos).toBe(alicePreBalance.microAlgos - 2001)
    expect(bobPostBalance.microAlgos).toBe(bobPreBalance.microAlgos + 1)

    expect(result.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('addMethodCall', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).balance
    const bobPreBalance = (await algorand.account.getInformation(bob)).balance

    const methodRes = await algorand
      .newGroup()
      .addPayment({ sender: alice.addr, receiver: bob.addr, amount: AlgoAmount.MicroAlgos(1), note: new Uint8Array([1]) })
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('doMath')!,
        args: [1, 2, 'sum'],
      })
      .execute()

    const alicePostBalance = (await algorand.account.getInformation(alice)).balance
    const bobPostBalance = (await algorand.account.getInformation(bob)).balance

    expect(alicePostBalance.microAlgos).toBe(alicePreBalance.microAlgos - 2001)
    expect(bobPostBalance.microAlgos).toBe(bobPreBalance.microAlgos + 1)

    expect(methodRes.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('method with txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice.addr, receiver: alice.addr, amount: AlgoAmount.MicroAlgos(0) })],
    }

    const txnRes = await algorand
      .newGroup()
      .addPayment({ sender: alice.addr, receiver: alice.addr, amount: AlgoAmount.MicroAlgos(0), note: new Uint8Array([1]) })
      .addMethodCall(txnArgParams)
      .execute()

    expect(txnRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
  })

  test('method with method call arg', async () => {
    const helloWorldCall = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('helloWorld')!,
    } satisfies MethodCallParams

    const methodArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
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
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice.addr, receiver: alice.addr, amount: AlgoAmount.MicroAlgos(0) })],
    } satisfies MethodCallParams

    const nestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('nestedTxnArg')!,
        args: [txnArgCall],
      })
      .execute()

    expect(nestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(nestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with two method call args that each have a txn arg', async () => {
    const firstTxnCall = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice.addr, receiver: alice.addr, amount: AlgoAmount.MicroAlgos(0) })],
    } satisfies MethodCallParams

    const secondTxnCall = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [algorand.transactions.payment({ sender: alice.addr, receiver: alice.addr, amount: AlgoAmount.MicroAlgos(1) })],
      note: new Uint8Array([1]),
    } satisfies MethodCallParams

    const doubleNestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('doubleNestedTxnArg')!,
        args: [firstTxnCall, secondTxnCall],
      })
      .execute()

    expect(doubleNestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[2].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('assetOptIn', async () => {
    const { algod } = fixture.context
    const assetId = (await algorand.send.assetCreate({ sender: alice.addr, total: 1n })).assetId

    await algorand.send.assetOptIn({
      sender: alice.addr,
      assetId: assetId,
      signer: alice,
    })
    expect(await algod.accountAssetInformation(alice.addr, Number(assetId)).do()).toBeDefined()
  })

  test('methodCall create', async () => {
    const contract = new algosdk.ABIContract(APP_SPEC.contract)

    await algorand.send.methodCall({
      sender: alice.addr,
      appId: 0n,
      method: contract.getMethodByName('createApplication'),
      approvalProgram: await compileProgram(algorand, APP_SPEC.source.approval),
      clearProgram: await compileProgram(algorand, APP_SPEC.source.clear),
    })
  })
})
