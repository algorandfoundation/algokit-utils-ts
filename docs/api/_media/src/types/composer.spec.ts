import { ABIMethod, ABITupleType, ABIType } from '@algorandfoundation/algokit-abi'
import { Address } from '@algorandfoundation/algokit-common'
import { Transaction, TransactionSigner, TransactionType } from '@algorandfoundation/algokit-transact'
import { beforeEach, describe, expect, test, vi } from 'vitest'
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

  describe('transaction validation', () => {
    test('should validate transact transactions when adding', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount

      const txn = new Transaction({
        type: TransactionType.AssetTransfer,
        sender,
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          receiver: sender,
          assetId: 0n,
          amount: 1000n,
        },
      })

      const composer = algorand.newGroup()
      expect(() => composer.addTransaction(txn)).toThrow('Asset transfer validation failed: Asset ID must not be 0')
    })

    test('should validate composer transactions when building', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount

      const composer = algorand.newGroup()
      composer.addAssetTransfer({
        sender,
        receiver: sender,
        assetId: 0n,
        amount: 1000n,
      })

      await expect(composer.build()).rejects.toThrow('Asset transfer validation failed: Asset ID must not be 0')
    })
  })

  describe('send params config handling', () => {
    test('should not reset when send() is called without params and composer has non-default config', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount

      // Create composer with non-default config (populateAppCallResources: false instead of default true)
      const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

      // Spy on the private reset method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resetSpy = vi.spyOn(composer as any, 'reset')

      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
      })

      await composer.send()

      expect(resetSpy).not.toHaveBeenCalled()
    })

    test('should reset when send() params explicitly differ from composer config', async () => {
      const algorand = fixture.context.algorand
      const sender = fixture.context.testAccount

      // Create composer with populateAppCallResources: false
      const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

      // Spy on the private reset method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resetSpy = vi.spyOn(composer as any, 'reset')

      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
      })

      // Send with explicitly different config should trigger reset
      await composer.send({ populateAppCallResources: true })

      // Reset should have been called because we explicitly passed a different value
      expect(resetSpy).toHaveBeenCalled()
    })
  })

  describe('ARC-4 tuple packing', () => {
    const uint8ArrayType = ABIType.from('uint8[]')
    const singleArray = uint8ArrayType.encode([1])
    const twoArrays = new ABITupleType([uint8ArrayType, uint8ArrayType]).encode([[1], [1]])
    const threeArrays = new ABITupleType([uint8ArrayType, uint8ArrayType, uint8ArrayType]).encode([[1], [1], [1]])

    const testCases: { numAbiArgs: number; expectedTxnArgs: number; expectedLastArg: Uint8Array }[] = [
      { numAbiArgs: 1, expectedTxnArgs: 2, expectedLastArg: singleArray },
      { numAbiArgs: 13, expectedTxnArgs: 14, expectedLastArg: singleArray },
      { numAbiArgs: 14, expectedTxnArgs: 15, expectedLastArg: singleArray },
      { numAbiArgs: 15, expectedTxnArgs: 16, expectedLastArg: singleArray },
      { numAbiArgs: 16, expectedTxnArgs: 16, expectedLastArg: twoArrays },
      { numAbiArgs: 17, expectedTxnArgs: 16, expectedLastArg: threeArrays },
    ]

    test.each(testCases)(
      'should handle $numAbiArgs ABI args correctly (expecting $expectedTxnArgs txn args)',
      async ({ numAbiArgs, expectedTxnArgs, expectedLastArg }) => {
        const { algorand, context } = fixture
        const sender = context.testAccount

        // Build method signature with the specified number of uint8[] args
        const argsSignature = Array(numAbiArgs).fill('uint8[]').join(',')
        const method = ABIMethod.fromSignature(`args${numAbiArgs}(${argsSignature})void`)

        const composer = algorand.newGroup({ populateAppCallResources: false, coverAppCallInnerTransactionFees: false })

        composer.addAppCallMethodCall({
          appId: 1234n,
          method,
          sender,
          args: Array(numAbiArgs).fill([1]), // Each arg is [1] (a uint8 array with value 1)
        })

        const built = await composer.build()
        const txn = built.transactions[0].txn

        const args = txn.appCall?.args ?? []
        expect(args.length).toBe(expectedTxnArgs)
        expect(args[0]).toEqual(method.getSelector())
        expect(args[args.length - 1]).toEqual(expectedLastArg)
      },
    )
  })

  describe('gatherSignatures', () => {
    test('should successfully sign a single transaction', async () => {
      const { algorand, context } = fixture
      const sender = context.testAccount

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
      })

      const signedTxns = await composer.gatherSignatures()

      expect(signedTxns).toHaveLength(1)
      expect(signedTxns[0].length).toBeGreaterThan(0)
    })

    test('should successfully sign multiple transactions with the same signer', async () => {
      const { algorand, context } = fixture
      const sender = context.testAccount

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
      })
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(2000),
      })

      const signedTxns = await composer.gatherSignatures()

      expect(signedTxns).toHaveLength(2)
      expect(signedTxns[0].length).toBeGreaterThan(0)
      expect(signedTxns[1].length).toBeGreaterThan(0)
    })

    test('should successfully sign transactions with multiple different signers', async () => {
      const { algorand, context } = fixture
      const sender1 = context.testAccount
      const sender2 = await context.generateAccount({ initialFunds: AlgoAmount.Algos(10) })

      const composer = algorand.newGroup()
      composer.addPayment({
        sender: sender1,
        receiver: sender2,
        amount: AlgoAmount.MicroAlgo(1000),
      })
      composer.addPayment({
        sender: sender2,
        receiver: sender1,
        amount: AlgoAmount.MicroAlgo(1000),
      })

      const signedTxns = await composer.gatherSignatures()

      expect(signedTxns).toHaveLength(2)
      expect(signedTxns[0].length).toBeGreaterThan(0)
      expect(signedTxns[1].length).toBeGreaterThan(0)
    })

    test('should throw error when no transactions to sign', async () => {
      const { algorand } = fixture

      const composer = algorand.newGroup()

      await expect(composer.gatherSignatures()).rejects.toThrow('No transactions available to sign')
    })

    test('should throw error when signer returns fewer signed transactions than expected', async () => {
      const { algorand, context } = fixture
      const sender = context.testAccount

      // Create a faulty signer that returns fewer signed transactions than requested
      const faultySigner: TransactionSigner = async (_group, indexes) => {
        // Only return one signed transaction even if multiple are requested
        const realSigner = algorand.account.getSigner(sender)
        const sigs = await realSigner(_group, [indexes[0]])
        return sigs
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: faultySigner,
      })
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(2000),
        signer: faultySigner,
      })

      await expect(composer.gatherSignatures()).rejects.toThrow('Transactions at indexes [1] were not signed')
    })

    test('should throw error when signer returns null signed transaction', async () => {
      const { algorand, context } = fixture
      const sender = context.testAccount

      // Create a faulty signer that returns array of nulls
      const faultySigner: TransactionSigner = async (_group, indexes) => {
        const result = new Array(indexes.length).fill(null) as unknown as Uint8Array[]
        return result
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: faultySigner,
      })

      await expect(composer.gatherSignatures()).rejects.toThrow('Transactions at indexes [0] were not signed')
    })

    test('should throw error when signer returns empty array', async () => {
      const { algorand, context } = fixture
      const sender = context.testAccount

      // Create a faulty signer that returns empty array
      const faultySigner: TransactionSigner = async () => {
        return []
      }

      const composer = algorand.newGroup()
      composer.addPayment({
        sender,
        receiver: sender,
        amount: AlgoAmount.MicroAlgo(1000),
        signer: faultySigner,
      })

      await expect(composer.gatherSignatures()).rejects.toThrow('Transactions at indexes [0] were not signed')
    })
  })
})
