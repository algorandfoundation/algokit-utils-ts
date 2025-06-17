import algosdk, { ABIMethod, ABIType, Account, Address } from 'algosdk'
import invariant from 'tiny-invariant'
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { APP_SPEC as nestedContractAppSpec } from '../../tests/example-contracts/client/TestContractClient'
import innerFeeContract from '../../tests/example-contracts/inner-fee/application.json'
import externalARC32 from '../../tests/example-contracts/resource-packer/artifacts/ExternalApp.arc32.json'
import v8ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv8.arc32.json'
import v9ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv9.arc32.json'
import { AlgodClient } from '../algokit-core-bridge/algod-client'
import { algorandFixture } from '../algokit-core-bridge/algorand-fixture'
import { algo, algos, microAlgo } from '../amount'
import { Config } from '../config'
import { getTestAccount } from '../testing'
import { AlgoHttpClientWithRetry } from '../types/algo-http-client-with-retry'
import { AlgorandClient } from '../types/algorand-client'
import { AlgoAmount } from '../types/amount'
import { AppClient } from '../types/app-client'
import { ClientManager } from '../types/client-manager'
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
    }).rejects.toThrowError('Transaction fee 1000 µALGO is greater than max fee 1 µALGO')
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

  describe('Cover app call inner transaction fees', async () => {
    let appClient1: AppClient
    let appClient2: AppClient
    let appClient3: AppClient

    beforeEach(async () => {
      const { algorand, testAccount } = localnet.context
      Config.configure({ populateAppCallResources: true })

      const appFactory = algorand.client.getAppFactory({
        appSpec: JSON.stringify(innerFeeContract),
        defaultSender: testAccount,
      })

      appClient1 = (await appFactory.send.bare.create({ note: 'app1' })).appClient
      appClient2 = (await appFactory.send.bare.create({ note: 'app2' })).appClient
      appClient3 = (await appFactory.send.bare.create({ note: 'app3' })).appClient

      await appClient1.fundAppAccount({ amount: algo(2) })
      await appClient2.fundAppAccount({ amount: algo(2) })
      await appClient3.fundAppAccount({ amount: algo(2) })
    })

    test('throws when no max fee is supplied', async () => {
      const params = {
        method: 'no_op',
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      await expect(async () => await appClient1.send.call(params)).rejects.toThrow(
        'Please provide a maxFee for each app call transaction when coverAppCallInnerTransactionFees is enabled. Required for transaction 0',
      )
    })

    test('throws when inner transaction fees are not covered and coverAppCallInnerTransactionFees is disabled', async () => {
      const expectedFee = 7000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: false,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      await expect(async () => await appClient1.send.call(params)).rejects.toThrow(/fee too small/)
    })

    test('does not alter fee when app call has no inners', async () => {
      const expectedFee = 1000n
      const params = {
        method: 'no_op',
        coverAppCallInnerTransactionFees: true,
        maxFee: microAlgo(2000),
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('throws when max fee is too small to cover inner transaction fees', async () => {
      const expectedFee = 7000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
        maxFee: microAlgo(expectedFee - 1n),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      await expect(async () => await appClient1.send.call(params)).rejects.toThrow(
        'Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.',
      )
    })

    test('throws when static fee is too small to cover inner transaction fees', async () => {
      const expectedFee = 7000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
        staticFee: microAlgo(expectedFee - 1n),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      await expect(async () => await appClient1.send.call(params)).rejects.toThrow(
        'Fees were too small to resolve execution info via simulate. You may need to increase an app call transaction maxFee.',
      )
    })

    test('alters fee, handling when no inner fees have been covered', async () => {
      const expectedFee = 7000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling when all inner fees have been covered', async () => {
      const expectedFee = 1000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [1000n, 1000n, 1000n, 1000n, [1000n, 1000n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling when some inner fees have been covered or partially covered', async () => {
      const expectedFee = 5300n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [1000n, 0n, 200n, 0n, [500n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling when some inner fees have a surplus', async () => {
      const expectedFee = 2000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 1000n, 5000n, 0n, [0n, 50n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling multiple app calls in a group that send inners with varying fees', async () => {
      const txn1ExpectedFee = 5800n
      const txn2ExpectedFee = 6000n

      const txn1Params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 1000n, 0n, 0n, [200n, 0n]]],
        staticFee: microAlgo(txn1ExpectedFee),
        note: 'txn1',
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      const txn2Params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [1000n, 0n, 0n, 0n, [0n, 0n]]],
        maxFee: microAlgo(txn2ExpectedFee),
        note: 'txn2',
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

      const result = await appClient1.algorand
        .newGroup()
        .addAppCallMethodCall(await appClient1.params.call(txn1Params))
        .addAppCallMethodCall(await appClient1.params.call(txn2Params))
        .send({
          coverAppCallInnerTransactionFees: true,
        })

      expect(result.transactions[0].fee).toBe(txn1ExpectedFee)
      await assertMinFee(appClient1, txn1Params, txn1ExpectedFee)
      expect(result.transactions[1].fee).toBe(txn2ExpectedFee)
      await assertMinFee(appClient1, txn2Params, txn2ExpectedFee)
    })

    test('does not alter a static fee with surplus', async () => {
      const expectedFee = 6000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [1000n, 0n, 200n, 0n, [500n, 0n]]],
        staticFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
    })

    test('alters fee, handling a large inner fee surplus pooling to lower siblings', async () => {
      // Inner transaction fees only pool to lower sibling transactions
      const expectedFee = 7_000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n, 20_000n, 0n, 0n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling a inner fee surplus pooling to some lower siblings', async () => {
      // Inner transaction fees only pool to lower sibling transactions
      const expectedFee = 6300n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 2200n, 0n, [0n, 0n, 2500n, 0n, 0n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling a large inner fee surplus with no pooling', async () => {
      // Inner transaction fees only pool to lower sibling transactions
      const expectedFee = 10_000n
      const params = {
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n, 0n, 0n, 0n, 20_000n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('alters fee, handling multiple inner fee surplus poolings to lower siblings', async () => {
      // Inner transaction fees only pool to lower sibling transactions
      const expectedFee = 7100n
      const params = {
        method: 'send_inners_with_fees_2',
        args: [appClient2.appId, appClient3.appId, [0n, 1200n, [0n, 0n, 4900n, 0n, 0n, 0n], 200n, 1100n, [0n, 0n, 2500n, 0n, 0n, 0n]]],
        maxFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      await assertMinFee(appClient1, params, expectedFee)
    })

    test('does not alter fee when another transaction in the group covers the inner fees', async () => {
      const { testAccount } = localnet.context
      const expectedFee = 8000n

      const result = await appClient1.algorand
        .newGroup()
        .addPayment({
          sender: testAccount.addr,
          receiver: testAccount.addr,
          amount: microAlgo(0),
          staticFee: microAlgo(expectedFee),
        })
        .addAppCallMethodCall(
          await appClient1.params.call({
            method: 'send_inners_with_fees',
            args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
            maxFee: microAlgo(expectedFee),
          }),
        )
        .send({
          coverAppCallInnerTransactionFees: true,
        })

      expect(result.transactions[0].fee).toBe(expectedFee)
      // We could technically reduce the below to 0, however it adds more complexity and is probably unlikely to be a common use case
      expect(result.transactions[1].fee).toBe(1000n)
    })

    test('alters fee, allocating surplus fees to the most fee constrained transaction first', async () => {
      const { testAccount } = localnet.context
      const result = await appClient1.algorand
        .newGroup()
        .addAppCallMethodCall(
          await appClient1.params.call({
            method: 'send_inners_with_fees',
            args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
            maxFee: microAlgo(2000n),
          }),
        )
        .addPayment({
          sender: testAccount.addr,
          receiver: testAccount.addr,
          amount: microAlgo(0),
          staticFee: microAlgo(7500),
        })
        .addPayment({
          sender: testAccount.addr,
          receiver: testAccount.addr,
          amount: microAlgo(0),
          staticFee: microAlgo(0),
        })
        .send({
          coverAppCallInnerTransactionFees: true,
        })

      expect(result.transactions[0].fee).toBe(1500n)
      expect(result.transactions[1].fee).toBe(7500n)
      expect(result.transactions[2].fee).toBe(0n)
      expect(result.groupId).not.toBe('')
      await Promise.all(
        result.transactions.map(async (txn) => {
          expect(Buffer.from(txn.group!).toString('base64')).toBe(result.groupId)
          await localnet.context.waitForIndexerTransaction(txn.txID())
        }),
      )
    })

    test('alters fee, handling nested abi method calls', async () => {
      const { algorand, testAccount } = localnet.context

      const appFactory = algorand.client.getAppFactory({
        appSpec: nestedContractAppSpec,
        defaultSender: testAccount.addr,
      })

      const { appClient } = await appFactory.send.create({
        method: 'createApplication',
      })

      const txnArgCall = await appClient1.params.call({
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 2000n, 0n, [0n, 0n]]],
        maxFee: microAlgo(4000),
      })

      const paymentParams = {
        sender: testAccount.addr,
        receiver: testAccount.addr,
        amount: microAlgo(0),
        staticFee: microAlgo(1500),
      } satisfies PaymentParams

      const expectedFee = 2000n
      const params = {
        method: 'nestedTxnArg',
        args: [algorand.createTransaction.payment(paymentParams), txnArgCall],
        staticFee: microAlgo(expectedFee),
        coverAppCallInnerTransactionFees: true,
      }
      const result = await appClient.send.call(params)

      expect(result.transactions.length).toBe(3)
      expect(result.transactions[0].fee).toBe(1500n)
      expect(result.transactions[1].fee).toBe(3500n)
      expect(result.transactions[2].fee).toBe(expectedFee)
      await assertMinFee(
        appClient,
        {
          ...params,
          args: [algorand.createTransaction.payment(paymentParams), txnArgCall],
        },
        expectedFee,
      )
    })

    test('throws when maxFee is below the calculated fee', async () => {
      await expect(
        async () =>
          await appClient1.algorand
            .newGroup()
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'send_inners_with_fees',
                args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
                maxFee: microAlgo(1200),
              }),
            )
            // This transactions allow this state to be possible, without it the simulate call to get the execution info would fail
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'no_op',
                maxFee: microAlgo(10_000),
              }),
            )
            .send({
              coverAppCallInnerTransactionFees: true,
            }),
      ).rejects.toThrow('Calculated transaction fee 7000 µALGO is greater than max of 1200 for transaction 0')
    })

    test('throws when nested maxFee is below the calculated fee', async () => {
      const { algorand, testAccount } = localnet.context

      const appFactory = algorand.client.getAppFactory({
        appSpec: nestedContractAppSpec,
        defaultSender: testAccount.addr,
      })

      const { appClient } = await appFactory.send.create({
        method: 'createApplication',
      })

      const txnArgCall = await appClient1.params.call({
        method: 'send_inners_with_fees',
        args: [appClient2.appId, appClient3.appId, [0n, 0n, 2000n, 0n, [0n, 0n]]],
        maxFee: microAlgo(2000),
      })

      await expect(
        async () =>
          await appClient.send.call({
            method: 'nestedTxnArg',
            args: [
              algorand.createTransaction.payment({
                sender: testAccount.addr,
                receiver: testAccount.addr,
                amount: microAlgo(0),
              }),
              txnArgCall,
            ],
            coverAppCallInnerTransactionFees: true,
            maxFee: microAlgo(10_000),
          }),
      ).rejects.toThrow('Calculated transaction fee 5000 µALGO is greater than max of 2000 for transaction 1')
    })

    test('throws when staticFee is below the calculated fee', async () => {
      await expect(
        async () =>
          await appClient1.algorand
            .newGroup()
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'send_inners_with_fees',
                args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
                staticFee: microAlgo(5000),
              }),
            )
            // This transactions allow this state to be possible, without it the simulate call to get the execution info would fail
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'no_op',
                maxFee: microAlgo(10_000),
              }),
            )
            .send({
              coverAppCallInnerTransactionFees: true,
            }),
      ).rejects.toThrow('Calculated transaction fee 7000 µALGO is greater than max of 5000 for transaction 0')
    })

    test('throws when staticFee for non app call transaction is too low', async () => {
      const { testAccount } = localnet.context
      await expect(
        async () =>
          await appClient1.algorand
            .newGroup()
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'send_inners_with_fees',
                args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
                staticFee: microAlgo(13_000n),
                maxFee: microAlgo(14_000n),
              }),
            )
            .addAppCallMethodCall(
              await appClient1.params.call({
                method: 'send_inners_with_fees',
                args: [appClient2.appId, appClient3.appId, [0n, 0n, 0n, 0n, [0n, 0n]]],
                staticFee: microAlgo(1000n),
              }),
            )
            .addPayment({
              sender: testAccount.addr,
              receiver: testAccount.addr,
              amount: microAlgo(0),
              staticFee: microAlgo(500),
            })
            .send({
              coverAppCallInnerTransactionFees: true,
            }),
      ).rejects.toThrow('An additional fee of 500 µALGO is required for non app call transaction 2')
    })

    test('alters fee, handling expensive abi method calls that use ensure_budget to op-up', async () => {
      const expectedFee = 10_000n
      const params = {
        method: 'burn_ops',
        args: [6200],
        coverAppCallInnerTransactionFees: true,
        maxFee: microAlgo(12_000),
      } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
      const result = await appClient1.send.call(params)

      expect(result.transaction.fee).toBe(expectedFee)
      expect(result.confirmation.innerTxns?.length).toBe(9) // Op up transactions sent by ensure_budget
      await assertMinFee(appClient1, params, expectedFee)
    })

    describe('readonly', () => {
      test('alters fee, handling expensive abi method calls that use ensure_budget to op-up', async () => {
        // The expectedFee differs to non readonly method call, as we don't want to run simulate twice (once for resolving the minimum fee and once for the actual transaction result).
        // Because no fees are actually paid with readonly calls, we simply use the maxFee value and skip any minimum fee calculations.
        const expectedFee = 12_000n
        const params = {
          method: 'burn_ops_readonly',
          args: [6200],
          coverAppCallInnerTransactionFees: true,
          maxFee: microAlgo(expectedFee),
        } satisfies Parameters<(typeof appClient1)['send']['call']>[0]
        const result = await appClient1.send.call(params)

        expect(result.transaction.fee).toBe(expectedFee)
        expect(result.confirmation.innerTxns?.length).toBe(9) // Op up transactions sent by ensure_budget
      })

      test('throws when no max fee is supplied', async () => {
        const params = {
          method: 'burn_ops_readonly',
          coverAppCallInnerTransactionFees: true,
        } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

        await expect(async () => await appClient1.send.call(params)).rejects.toThrow(
          'Please provide a maxFee for the transaction when coverAppCallInnerTransactionFees is enabled.',
        )
      })

      test('throws when inner transaction fees are not covered and coverAppCallInnerTransactionFees is disabled', async () => {
        const expectedFee = 7000n
        const params = {
          method: 'burn_ops_readonly',
          args: [6200],
          maxFee: microAlgo(expectedFee),
          coverAppCallInnerTransactionFees: false,
        } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

        await expect(async () => await appClient1.send.call(params)).rejects.toThrow(/fee too small/)
      })

      test('throws when max fee is too small to cover inner transaction fees', async () => {
        const expectedFee = 7000n
        const params = {
          method: 'burn_ops_readonly',
          args: [6200],
          coverAppCallInnerTransactionFees: true,
          maxFee: microAlgo(expectedFee),
        } satisfies Parameters<(typeof appClient1)['send']['call']>[0]

        await expect(async () => await appClient1.send.call(params)).rejects.toThrow(
          'Fees were too small. You may need to increase the transaction maxFee.',
        )
      })
    })

    const assertMinFee = async (appClient: AppClient, args: Parameters<(typeof appClient)['send']['call']>[0], fee: bigint) => {
      if (fee === 1000n) {
        return
      }

      await expect(
        async () =>
          await appClient.send.call({
            ...args,
            coverAppCallInnerTransactionFees: false,
            staticFee: microAlgo(fee - 1n),
            extraFee: undefined,
            suppressLog: true,
          }),
      ).rejects.toThrowError(/fee too small/)
    }
  })

  test('Close remainder when making payment transaction', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context

    const alice = await generateAccount({ initialFunds: (0).microAlgo(), suppressLog: true })

    const senderAddr = testAccount.addr ?? testAccount
    const senderInfoBefore = await algorand.account.getInformation(senderAddr)

    const paymentTransaction = await algorand.send.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: (0).microAlgo(),
      closeRemainderTo: alice.addr,
    })

    const senderInfoAfter = await algorand.account.getInformation(senderAddr)
    expect(senderInfoAfter.balance.algos).toBe(0)

    const aliceInfo = await algorand.account.getInformation(alice.addr)
    expect(aliceInfo.balance.microAlgos).toBe(senderInfoBefore.balance.microAlgos - paymentTransaction.transaction.fee)
  })

  test('Sign payment transaction with rekey account', async () => {
    const { algorand, testAccount, generateAccount } = localnet.context

    // Create Alice and Tom
    const alice = await generateAccount({ initialFunds: (0).microAlgo(), suppressLog: true })
    const tom = await generateAccount({ initialFunds: (0).microAlgo(), suppressLog: true })

    // Send some algos to Tom, rekey testAccount to Alice
    await algorand.send.payment({
      sender: testAccount,
      receiver: tom.addr,
      amount: (100_000).microAlgo(),
      rekeyTo: alice.addr,
    })

    // Transaction from testAccount, signed by Alice (should succeed)
    await expect(
      algorand.send.payment({
        sender: testAccount,
        receiver: tom.addr,
        amount: (1_000).microAlgo(),
        signer: alice.signer,
      }),
    ).resolves.toBeDefined()

    // Transaction from testAccount, default signer (should fail)
    await expect(
      algorand.send.payment({
        sender: testAccount,
        receiver: tom.addr,
        amount: (1_000).microAlgo(),
      }),
    ).rejects.toThrow(
      new RegExp(
        `Network request error\\. Received status 400 \\(Bad Request\\): TransactionPool\\.Remember: transaction [A-Z0-9]{52}: should have been authorized by ${alice.addr.toString()} but was actually authorized by ${testAccount.addr.toString()}`,
      ),
    )
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

const resourcePopulationTests = (version: 8 | 9) => () => {
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

describe('Resource population: AVM8', resourcePopulationTests(8))
describe('Resource population: AVM9', resourcePopulationTests(9))
describe('Resource population: Mixed', () => {
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

describe('Resource population: meta', () => {
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
      expect(e.message).toMatch('Error resolving execution info via simulate in transaction 0')
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

describe('When creating algorand client with config from environment', () => {
  test('payment transactions are sent and waited for by algokit core algod client', async () => {
    const algorandClient = AlgorandClient.fromConfig(ClientManager.getConfigFromEnvironmentOrLocalNet())
    const algodClient = algorandClient.client.algod as AlgodClient
    const sendRawTransactionWithAlgoKitCoreAlgod = vi.spyOn(algodClient.algoKitCoreAlgod, 'rawTransactionResponse')

    const sendPendingTransactionInformationResponseWithAlgoKitCoreAlgod = vi.spyOn(
      algodClient.algoKitCoreAlgod,
      'pendingTransactionInformationResponse',
    )

    const testAccount = await getTestAccount({ initialFunds: algos(10), suppressLog: true }, algorandClient)
    algorandClient.setSignerFromAccount(testAccount)

    const testPayTransaction = {
      sender: testAccount,
      receiver: testAccount,
      amount: (1).microAlgo(),
    } as PaymentParams

    const fee = (1).algo()
    const { confirmation } = await algorandClient.send.payment({ ...testPayTransaction, staticFee: fee })

    expect(sendRawTransactionWithAlgoKitCoreAlgod).toBeCalledTimes(2)
    expect(sendPendingTransactionInformationResponseWithAlgoKitCoreAlgod).toBeCalled()
    expect(confirmation.txn.txn.fee).toBe(fee.microAlgo)
  })

  test('transaction suggested params are requested by algokit core algod client', async () => {
    const algorandClient = AlgorandClient.fromConfig(ClientManager.getConfigFromEnvironmentOrLocalNet())
    const algodClient = algorandClient.client.algod as AlgodClient

    const getTransactionParamsWithAlgoKitCoreAlgod = vi.spyOn(algodClient.algoKitCoreAlgod, 'transactionParamsResponse')
    const testAccount = await getTestAccount({ initialFunds: algos(10), suppressLog: true }, algorandClient)
    algorandClient.setSignerFromAccount(testAccount)

    const testPayTransaction = {
      sender: testAccount,
      receiver: testAccount,
      amount: (1).microAlgo(),
    } as PaymentParams

    const fee = (1).algo()
    const { confirmation } = await algorandClient.send.payment({ ...testPayTransaction, staticFee: fee })

    expect(getTransactionParamsWithAlgoKitCoreAlgod).toBeCalledTimes(2)
    expect(confirmation.txn.txn.fee).toBe(fee.microAlgo)
  })
})

describe('When creating algorand client with a custom algod', () => {
  test('payment transactions should be sent by the custom algod', async () => {
    const algoConfig = ClientManager.getConfigFromEnvironmentOrLocalNet()
    const { token, server, port } = algoConfig.algodConfig
    const tokenHeader = typeof token === 'string' ? { 'X-Algo-API-Token': token } : (token ?? {})
    const httpClientWithRetry = new AlgoHttpClientWithRetry(tokenHeader, server, port)
    const algosdkAlgod = new algosdk.Algodv2(httpClientWithRetry, server)

    const algorandClient = AlgorandClient.fromClients({
      algod: algosdkAlgod,
    })

    const sendRawTransactionSpy = vi.spyOn(algosdkAlgod, 'sendRawTransaction')
    const getPendingTransactionInfoSpy = vi.spyOn(algosdkAlgod, 'pendingTransactionInformation')

    const testAccount = await getTestAccount({ initialFunds: algos(10), suppressLog: true }, algorandClient)
    algorandClient.setSignerFromAccount(testAccount)

    const testPayTransaction = {
      sender: testAccount,
      receiver: testAccount,
      amount: (1).microAlgo(),
    } as PaymentParams

    const fee = (1).algo()
    const { confirmation } = await algorandClient.send.payment({ ...testPayTransaction, staticFee: fee })

    expect(sendRawTransactionSpy).toBeCalledTimes(2)
    expect(getPendingTransactionInfoSpy).toBeCalled()
    expect(confirmation.txn.txn.fee).toBe(fee.microAlgo)
  })
})
