/* eslint-disable no-console */
import { TestContractClient } from '../../tests/example-contracts/client/TestContractClient'
import * as algokit from '../index'
import { algorandFixture } from '../testing'
import { TransactionSignerAccount } from './account'
import AlgorandClient from './algorand-client'

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
    bob = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000) })

    algorand = fixture.algorand
    appClient = algorand.client.getTypedAppClientById(TestContractClient, {
      id: 0,
      sender: alice,
    })

    const app = await appClient.create.createApplication({})
    appId = BigInt(app.appId)
  })

  test('sendPayment', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).amount
    const bobPreBalance = (await algorand.account.getInformation(bob)).amount
    await algorand.send.payment({ sender: alice.addr, receiver: bob.addr, amount: algokit.microAlgos(1) })
    const alicePostBalance = (await algorand.account.getInformation(alice)).amount
    const bobPostBalance = (await algorand.account.getInformation(bob)).amount

    expect(alicePostBalance).toBe(alicePreBalance - 1001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)
  })

  test('sendAssetCreate', async () => {
    const createResult = await algorand.send.assetCreate({ sender: alice.addr, total: 100n })

    const assetIndex = Number(createResult.confirmation.assetIndex)

    expect(assetIndex).toBeGreaterThan(0)
  })

  test('addAtc from generated client', async () => {
    const alicePreBalance = (await algorand.account.getInformation(alice)).amount
    const bobPreBalance = (await algorand.account.getInformation(bob)).amount

    const doMathAtc = await appClient.compose().doMath({ a: 1, b: 2, operation: 'sum' }).atc()
    const result = await algorand
      .newGroup()
      .addPayment({ sender: alice.addr, receiver: bob.addr, amount: algokit.microAlgos(1) })
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
      .addPayment({ sender: alice.addr, receiver: bob.addr, amount: algokit.microAlgos(1), note: new Uint8Array([1]) })
      .addMethodCall({
        sender: alice.addr,
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
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, receiver: alice.addr, amount: algokit.microAlgos(0) }],
    }

    const txnRes = await algorand
      .newGroup()
      .addPayment({ sender: alice.addr, receiver: alice.addr, amount: algokit.microAlgos(0), note: new Uint8Array([1]) })
      .addMethodCall(txnArgParams)
      .execute()

    expect(txnRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
  })

  test('method with method call arg', async () => {
    const helloWorldParams = {
      type: 'methodCall' as const,
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('helloWorld')!,
    }

    const methodArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('methodArg')!,
        args: [helloWorldParams],
      })
      .execute()

    expect(methodArgRes.returns?.[0].returnValue?.valueOf()).toBe('Hello, World!')
    expect(methodArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with method call arg that has a txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, receiver: alice.addr, amount: algokit.microAlgos(0) }],
    }

    const nestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('nestedTxnArg')!,
        args: [{ type: 'methodCall', ...txnArgParams }],
      })
      .execute()

    expect(nestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(nestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('method with two method call args that each have a txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, receiver: alice.addr, amount: algokit.microAlgos(0) }],
    }

    const secondTxnArgParams = {
      type: 'methodCall' as const,
      sender: alice.addr,
      appId: appId,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, receiver: alice.addr, amount: algokit.microAlgos(1) }],
      note: new Uint8Array([1]),
    }

    const doubleNestedTxnArgRes = await algorand
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appId: appId,
        method: appClient.appClient.getABIMethod('doubleNestedTxnArg')!,
        args: [{ type: 'methodCall', ...txnArgParams }, secondTxnArgParams],
      })
      .execute()

    expect(doubleNestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[2].returnValue?.valueOf()).toBe(BigInt(appId))
  })

  test('assetOptIn', async () => {
    const { algod } = fixture.context
    const assetId = BigInt((await algorand.send.assetCreate({ sender: alice.addr, total: 1n })).confirmation.assetIndex!)

    await algorand.send.assetOptIn({
      sender: alice.addr,
      assetId: assetId,
      signer: alice,
    })
    expect(await algod.accountAssetInformation(alice.addr, Number(assetId)).do()).toBeDefined()
  })
})
