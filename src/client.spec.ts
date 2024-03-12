/* eslint-disable no-console */
import algosdk from 'algosdk'
import { TestContractClient } from '../tests/example-contracts/client/TestContractClient'
import AlgokitClient from './client'
import * as algokit from './index'
import { algorandFixture } from './testing'

describe('client', () => {
  let client: AlgokitClient
  let alice: algosdk.Account
  let bob: algosdk.Account
  let appClient: TestContractClient
  let appID: number

  const fixture = algorandFixture()

  beforeAll(async () => {
    const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))
    client = new AlgokitClient({ algodClient: algod })
    await fixture.beforeEach()

    alice = fixture.context.testAccount
    bob = await fixture.context.generateAccount({ initialFunds: algokit.microAlgos(100_000) })

    client.signers[alice.addr] = algosdk.makeBasicAccountTransactionSigner(alice)
    client.signers[bob.addr] = algosdk.makeBasicAccountTransactionSigner(bob)

    appClient = new TestContractClient(
      {
        id: 0,
        resolveBy: 'id',
        sender: { addr: alice.addr, signer: client.signers[alice.addr] },
      },
      algod,
    )
    await appClient.create.createApplication({})

    appID = Number((await appClient.appClient.getAppReference()).appId)
  })

  test('sendPayment', async () => {
    const alicePreBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPreBalance = (await client.algod.accountInformation(bob.addr).do()).amount
    await client.send.payment({ sender: alice.addr, to: bob.addr, amount: 1 })
    const alicePostBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPostBalance = (await client.algod.accountInformation(bob.addr).do()).amount

    expect(alicePostBalance).toBe(alicePreBalance - 1001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)
  })

  test('sendAssetCreate', async () => {
    const createResult = await client.send.assetCreate({ sender: alice.addr, total: 100 })

    const assetIndex = Number(createResult.confirmations![0].assetIndex)

    expect(assetIndex).toBeGreaterThan(0)
  })

  test('addAtc from generated client', async () => {
    const alicePreBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPreBalance = (await client.algod.accountInformation(bob.addr).do()).amount

    const doMathAtc = await appClient.compose().doMath({ a: 1, b: 2, operation: 'sum' }).atc()
    const result = await client.newGroup().addPayment({ sender: alice.addr, to: bob.addr, amount: 1 }).addAtc(doMathAtc).execute()

    const alicePostBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPostBalance = (await client.algod.accountInformation(bob.addr).do()).amount

    expect(alicePostBalance).toBe(alicePreBalance - 2001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)

    expect(result.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('addMethodCall', async () => {
    const alicePreBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPreBalance = (await client.algod.accountInformation(bob.addr).do()).amount

    const methodRes = await client
      .newGroup()
      .addPayment({ sender: alice.addr, to: bob.addr, amount: 1, note: new Uint8Array([1]) })
      .addMethodCall({
        sender: alice.addr,
        appID: appID,
        method: appClient.appClient.getABIMethod('doMath')!,
        args: [1, 2, 'sum'],
      })
      .execute()

    const alicePostBalance = (await client.algod.accountInformation(alice.addr).do()).amount
    const bobPostBalance = (await client.algod.accountInformation(bob.addr).do()).amount

    expect(alicePostBalance).toBe(alicePreBalance - 2001)
    expect(bobPostBalance).toBe(bobPreBalance + 1)

    expect(methodRes.returns?.[0].returnValue?.valueOf()).toBe(3n)
  })

  test('method with txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appID: appID,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, to: alice.addr, amount: 0 }],
    }

    const txnRes = await client
      .newGroup()
      .addPayment({ sender: alice.addr, to: alice.addr, amount: 0, note: new Uint8Array([1]) })
      .addMethodCall(txnArgParams)
      .execute()

    expect(txnRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
  })

  test('method with method call arg', async () => {
    const helloWorldParams = {
      type: 'methodCall' as const,
      sender: alice.addr,
      appID: appID,
      method: appClient.appClient.getABIMethod('helloWorld')!,
    }

    const methodArgRes = await client
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appID,
        method: appClient.appClient.getABIMethod('methodArg')!,
        args: [helloWorldParams],
      })
      .execute()

    expect(methodArgRes.returns?.[0].returnValue?.valueOf()).toBe('Hello, World!')
    expect(methodArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appID))
  })

  test('method with method call arg that has a txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appID: appID,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, to: alice.addr, amount: 0 }],
    }

    const nestedTxnArgRes = await client
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appID: Number((await appClient.appClient.getAppReference()).appId),
        method: appClient.appClient.getABIMethod('nestedTxnArg')!,
        args: [{ type: 'methodCall', ...txnArgParams }],
      })
      .execute()

    expect(nestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(nestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(BigInt(appID))
  })

  test('method with two method call args that each have a txn arg', async () => {
    const txnArgParams = {
      sender: alice.addr,
      appID: appID,
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, to: alice.addr, amount: 0 }],
    }

    const secondTxnArgParams = {
      type: 'methodCall' as const,
      sender: alice.addr,
      appID: Number((await appClient.appClient.getAppReference()).appId),
      method: appClient.appClient.getABIMethod('txnArg')!,
      args: [{ type: 'pay' as const, sender: alice.addr, to: alice.addr, amount: 1 }],
      note: new Uint8Array([1]),
    }

    const doubleNestedTxnArgRes = await client
      .newGroup()
      .addMethodCall({
        sender: alice.addr,
        appID: Number((await appClient.appClient.getAppReference()).appId),
        method: appClient.appClient.getABIMethod('doubleNestedTxnArg')!,
        args: [{ type: 'methodCall', ...txnArgParams }, secondTxnArgParams],
      })
      .execute()

    expect(doubleNestedTxnArgRes.returns?.[0].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[1].returnValue?.valueOf()).toBe(alice.addr)
    expect(doubleNestedTxnArgRes.returns?.[2].returnValue?.valueOf()).toBe(BigInt(appID))
  })

  test('assetOptIn', async () => {
    const { algod, testAccount } = fixture.context
    const assetID = Number((await client.send.assetCreate({ sender: alice.addr, total: 1 })).confirmations![0].assetIndex)

    await client.send.assetOptIn({
      sender: testAccount.addr,
      assetID: assetID,
      signer: algosdk.makeBasicAccountTransactionSigner(testAccount),
    })
    expect(await algod.accountAssetInformation(testAccount.addr, assetID).do()).toBeDefined()
  })
})
