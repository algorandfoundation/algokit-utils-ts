import { ABIMethod } from '@algorandfoundation/algokit-abi'
import { Address } from '@algorandfoundation/algokit-common'
import { beforeEach, describe, expect, test } from 'vitest'
import { algorandFixture } from '../testing'
import { AlgoAmount } from './amount'

describe('TransactionComposer', () => {
  const fixture = algorandFixture()

  beforeEach(async () => {
    await fixture.newScope()
  })

  describe('error transformers', () => {
    const errorTransformers = [
      async (e: Error) => {
        if (e.message.includes('missing from')) {
          return new Error('ASSET MISSING???')
        }

        return e
      },
      async (e: Error) => {
        if (e.message == 'ASSET MISSING???') {
          return new Error('ASSET MISSING!')
        }

        return e
      },
    ]

    test('throws correct error from simulate', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const composer = algorand.newGroup()

      composer.addAssetTransfer({
        amount: 1n,
        assetId: 1337n,
        sender,
        receiver: sender,
      })

      errorTransformers.forEach((errorTransformer) => {
        composer.registerErrorTransformer(errorTransformer)
      })

      await expect(composer.simulate()).rejects.toThrow('ASSET MISSING!')
    })

    test('throws correct error from send', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const composer = algorand.newGroup()

      composer.addAssetTransfer({
        amount: 1n,
        assetId: 1337n,
        sender,
        receiver: sender,
      })

      errorTransformers.forEach((errorTransformer) => {
        composer.registerErrorTransformer(errorTransformer)
      })

      await expect(composer.send()).rejects.toThrow('ASSET MISSING!')
    })

    test('not throw error from simulate when the flag is set', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const composer = algorand.newGroup()

      composer.addAssetTransfer({
        amount: 1n,
        assetId: 1337n,
        sender,
        receiver: sender,
      })

      errorTransformers.forEach((errorTransformer) => {
        composer.registerErrorTransformer(errorTransformer)
      })

      const simulateResult = await composer.simulate({ resultOnFailure: true })
      expect(simulateResult).toBeDefined()
    })
  })

  describe('clone composers', () => {
    test('async transaction argument can be cloned correctly', async () => {
      const { algorand, context } = fixture

      const testAccount = context.testAccount

      const composer1 = context.algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })
      composer1.addAppCallMethodCall({
        appId: 123n,
        sender: testAccount,
        method: ABIMethod.fromSignature('createBoxInNewApp(pay)void'),
        args: [
          algorand.createTransaction.payment({
            sender: testAccount,
            receiver: testAccount,
            amount: AlgoAmount.Algos(1),
          }),
        ],
      })

      const composer2 = composer1.clone()
      composer2.addPayment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(2),
      })

      const composer2Transactions = (await composer2.build()).transactions
      expect(composer2Transactions[0].txn.group).toBeDefined()

      const composer1Transactions = (await composer1.build()).transactions
      expect(composer1Transactions[0].txn.group).toBeDefined()

      expect(composer2Transactions[0].txn.group).not.toEqual(composer1Transactions[0].txn.group)
    })

    test('transaction argument can be cloned correctly', async () => {
      const { algorand, context } = fixture

      const testAccount = context.testAccount
      const paymentTxn = await algorand.createTransaction.payment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(1),
      })

      const composer1 = context.algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })
      composer1.addAppCallMethodCall({
        appId: 123n,
        sender: testAccount,
        method: ABIMethod.fromSignature('createBoxInNewApp(pay)void'),
        args: [paymentTxn],
      })

      const composer2 = composer1.clone()
      composer2.addPayment({
        sender: testAccount,
        receiver: testAccount,
        amount: AlgoAmount.Algos(2),
      })

      const composer2Transactions = (await composer2.build()).transactions
      expect(composer2Transactions[0].txn.group).toBeDefined()

      const composer1Transactions = (await composer1.build()).transactions
      expect(composer1Transactions[0].txn.group).toBeDefined()

      expect(composer2Transactions[0].txn.group).not.toEqual(composer1Transactions[0].txn.group)
      expect(paymentTxn.group).toEqual(composer1Transactions[0].txn.group)
    })
  })

  test('should properly accept foreign array objects in addAppCallMethodCall', async () => {
    const { algorand, context } = fixture
    const sender = context.testAccount

    const method = ABIMethod.fromSignature('add(application)uint8')
    const foreignAcct = 'E4VCHISDQPLIZWMALIGNPK2B2TERPDMR64MZJXE3UL75MUDXZMADX5OWXM'

    const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

    // Create method call using TransactionComposer.
    // The foreign apps array argument should be packed before the method argument.
    composer.addAppCallMethodCall({
      appId: 7n,
      method,
      sender,
      args: [2n],
      accountReferences: [foreignAcct],
      appReferences: [1n],
      assetReferences: [124n],
    })

    // The built group should have one txn.
    const built = await composer.build()
    const txn = built.transactions[0].txn

    // Assert that foreign objects were passed in and ordering was correct.
    expect(txn.appCall?.appReferences?.length).toBe(2)
    expect(txn.appCall?.appReferences?.[0]).toBe(1n)
    expect(txn.appCall?.appReferences?.[1]).toBe(2n)

    expect(txn.appCall?.assetReferences?.length).toBe(1)
    expect(txn.appCall?.assetReferences?.[0]).toBe(124n)

    expect(txn.appCall?.accountReferences?.length).toBe(1)
    expect(txn.appCall?.accountReferences?.[0]).toEqual(Address.fromString(foreignAcct))
  })

  test('should properly handle Uint8Array account reference arg in addAppCallMethodCall', async () => {
    const { algorand, context } = fixture
    const sender = context.testAccount

    const method = ABIMethod.fromSignature('add(account)uint8')
    const account = Address.fromString('E4VCHISDQPLIZWMALIGNPK2B2TERPDMR64MZJXE3UL75MUDXZMADX5OWXM')

    const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

    // Create method call using TransactionComposer.
    // The foreign apps array argument should be packed before the method argument.
    composer.addAppCallMethodCall({
      appId: 7n,
      method,
      sender,
      args: [account.publicKey],
      accountReferences: [],
      appReferences: [],
      assetReferences: [],
    })

    // The built group should have one txn.
    const built = await composer.build()
    const txn = built.transactions[0].txn

    expect(txn.appCall?.appReferences?.length).toBe(0)

    expect(txn.appCall?.assetReferences?.length).toBe(0)

    expect(txn.appCall?.accountReferences?.length).toBe(1)
    expect(txn.appCall?.accountReferences?.[0]).toEqual(account)
  })

  test('should properly populate foreign array objects in addAppCallMethodCall', async () => {
    const { algorand, context } = fixture
    const sender = context.testAccount

    const method = ABIMethod.fromSignature('call_with_references(asset,account,application)uint64')

    const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

    // Create method call using TransactionComposer.
    // The foreign apps array argument should be packed before the method argument.
    composer.addAppCallMethodCall({
      appId: 7n,
      method,
      sender,
      args: [1234n, context.testAccount.addr.toString(), 123n],
    })

    const built = await composer.build()
    const txn = built.transactions[0].txn

    expect(txn.appCall?.assetReferences?.length).toBe(1)
    expect(txn.appCall?.assetReferences?.[0]).toBe(1234n)

    expect(txn.appCall?.accountReferences?.length).toBe(0)

    expect(txn.appCall?.appReferences?.length).toBe(1)
    expect(txn.appCall?.appReferences?.[0]).toBe(123n)

    expect(txn.appCall?.args).toEqual([new Uint8Array([254, 253, 241, 30]), new Uint8Array([0]), new Uint8Array([0]), new Uint8Array([1])])
  })

  test('should properly accept accessReferences parameter in addAppCallMethodCall', async () => {
    const { algorand, context } = fixture
    const sender = context.testAccount

    const method = ABIMethod.fromSignature('add(application)uint8')
    const foreignAcct = 'E4VCHISDQPLIZWMALIGNPK2B2TERPDMR64MZJXE3UL75MUDXZMADX5OWXM'

    const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

    // Create method call using TransactionComposer with accessReferences parameter
    composer.addAppCallMethodCall({
      appId: 7n,
      method,
      sender,
      args: [2n],
      accessReferences: [{ appId: 1n }, { assetId: 124n }, { address: Address.fromString(foreignAcct) }],
    })

    // The built group should have one txn.
    const built = await composer.build()
    const txn = built.transactions[0].txn

    // Assert that accessReferences parameter was correctly processed
    expect(txn.appCall?.accessReferences?.length).toBe(3)
    expect(txn.appCall?.accessReferences?.[0]?.appId).toBe(1n)
    expect(txn.appCall?.accessReferences?.[1]?.assetId).toBe(124n)
    expect(txn.appCall?.accessReferences?.[2]?.address).toEqual(Address.fromString(foreignAcct))

    // When using accessReferences parameter, legacy foreign arrays should be empty
    // (method arguments are processed differently and don't populate foreign arrays when accessReferences is used)
    expect(txn.appCall?.appReferences).toBeUndefined()
    expect(txn.appCall?.assetReferences).toBeUndefined()
    expect(txn.appCall?.accountReferences).toBeUndefined()
  })

  test('should throw error when both accessReferences and legacy reference arrays are specified', () => {
    const { algorand, context } = fixture
    const sender = context.testAccount

    const method = ABIMethod.fromSignature('add(application)uint8')
    const foreignAcct = 'E4VCHISDQPLIZWMALIGNPK2B2TERPDMR64MZJXE3UL75MUDXZMADX5OWXM'

    const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

    // Should throw error when adding method call with both accessReferences and legacy arrays
    expect(() =>
      composer.addAppCallMethodCall({
        appId: 7n,
        method,
        sender,
        args: [2n],
        accountReferences: [foreignAcct],
        appReferences: [1n],
        assetReferences: [124n],
        accessReferences: [{ appId: 1n }, { assetId: 124n }, { address: Address.fromString(foreignAcct) }],
      }),
    ).toThrow('Cannot specify both `accessReferences` and reference arrays (`appReferences`, `assetReferences`, `boxReferences`).')
  })

  describe('simulate', () => {
    test('should not group a single transaction', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount
      const simulateResult = await algorand
        .newGroup()
        .addPayment({
          amount: AlgoAmount.MicroAlgo(1000),
          sender,
          receiver: sender,
        })
        .simulate({ resultOnFailure: true })

      expect(simulateResult).toBeDefined()
      expect(simulateResult.groupId).toBe('')
      expect(simulateResult.simulateResponse.txnGroups[0].txnResults[0].txnResult.txn.txn.group).toBeUndefined()
    })
  })
})
