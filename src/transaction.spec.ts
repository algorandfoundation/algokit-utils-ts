import { describe, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from './'
import { algorandFixture } from './testing'
import { Arc2TransactionNote } from './types/transaction'

describe('transaction', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const getTestTransaction = async (amount?: number, sender?: string) => {
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender ?? localnet.context.testAccount.addr,
      to: localnet.context.testAccount.addr,
      amount: amount ?? 1,
      suggestedParams: await localnet.context.algod.getTransactionParams().do(),
    })
  }

  test('Transaction is sent and waited for', async () => {
    const { algod, testAccount } = localnet.context
    const txn = await getTestTransaction()
    const { transaction, confirmation } = await algokit.sendTransaction({ transaction: txn, from: testAccount }, algod)

    expect(transaction.txID()).toBe(txn.txID())
    expect(confirmation?.['confirmed-round']).toBeGreaterThanOrEqual(txn.firstRound)
  })

  test('Transaction is capped by low min txn fee', async () => {
    const { algod, testAccount } = localnet.context
    const txn = await getTestTransaction()
    await expect(async () => {
      await algokit.sendTransaction(
        {
          transaction: txn,
          from: testAccount,
          sendParams: {
            maxFee: algokit.microAlgos(1),
          },
        },
        algod,
      )
    }).rejects.toThrowError(
      'Cancelled transaction due to high network congestion fees. ' +
        'Algorand suggested fees would cause this transaction to cost 1000 µALGOs. ' +
        'Cap for this transaction is 1 µALGOs.',
    )
  })

  test('Transaction cap is ignored if flat fee set', async () => {
    const { algod, testAccount } = localnet.context
    const txn = await getTestTransaction()
    txn.flatFee = true
    await algokit.sendTransaction(
      {
        transaction: txn,
        from: testAccount,
        sendParams: {
          maxFee: algokit.microAlgos(1),
        },
      },
      algod,
    )
  })

  test('Transaction cap is ignored if higher than fee', async () => {
    const { algod, testAccount } = localnet.context
    const txn = await getTestTransaction()
    const { confirmation } = await algokit.sendTransaction(
      {
        transaction: txn,
        from: testAccount,
        sendParams: {
          maxFee: algokit.microAlgos(1000_000),
        },
      },
      algod,
    )

    expect(confirmation?.txn.txn.fee).toBe(1000)
  })

  test('Transaction fee is overridable', async () => {
    const { algod, testAccount } = localnet.context
    const txn = await getTestTransaction()
    const fee = algokit.algos(1)
    const result = await algokit.sendTransaction(
      {
        transaction: txn,
        from: testAccount,
        sendParams: {
          fee: fee,
        },
      },
      algod,
    )

    invariant(result.confirmation)
    expect(result.confirmation.txn.txn.fee).toBe(fee.microAlgos)
  })

  test('Transaction group is sent', async () => {
    const { algod, testAccount } = localnet.context
    const txn1 = await getTestTransaction(1)
    const txn2 = await getTestTransaction(2)

    const { confirmations } = await algokit.sendGroupOfTransactions(
      {
        transactions: [
          {
            transaction: txn1,
            signer: testAccount,
          },
          {
            transaction: txn2,
            signer: testAccount,
          },
        ],
      },
      algod,
    )

    invariant(confirmations)
    invariant(confirmations[0].txn.txn.grp)
    invariant(confirmations[1].txn.txn.grp)
    invariant(txn1.group)
    invariant(txn2.group)
    expect(confirmations.length).toBe(2)
    expect(confirmations[0]['confirmed-round']).toBeGreaterThanOrEqual(txn1.firstRound)
    expect(confirmations[1]['confirmed-round']).toBeGreaterThanOrEqual(txn2.firstRound)
    expect(Buffer.from(confirmations[0].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn1.group).toString('hex'))
    expect(Buffer.from(confirmations[1].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn2.group).toString('hex'))
  })

  test('Transaction group is sent with same signer', async () => {
    const { algod, testAccount } = localnet.context
    const txn1 = await getTestTransaction(1)
    const txn2 = await getTestTransaction(2)

    const { confirmations } = await algokit.sendGroupOfTransactions({ transactions: [txn1, txn2], signer: testAccount }, algod)

    invariant(confirmations)
    invariant(confirmations[0].txn.txn.grp)
    invariant(confirmations[1].txn.txn.grp)
    invariant(txn1.group)
    invariant(txn2.group)
    expect(confirmations.length).toBe(2)
    expect(confirmations[0]['confirmed-round']).toBeGreaterThanOrEqual(txn1.firstRound)
    expect(confirmations[1]['confirmed-round']).toBeGreaterThanOrEqual(txn2.firstRound)
    expect(Buffer.from(confirmations[0].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn1.group).toString('hex'))
    expect(Buffer.from(confirmations[1].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn2.group).toString('hex'))
  })

  test('Transaction group is sent using transaction signers', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const account2 = await generateAccount({ suppressLog: true, initialFunds: algokit.algos(10) })
    const txn1 = await getTestTransaction(1)
    const txn2 = await getTestTransaction(2, account2.addr)
    const txn3 = await getTestTransaction(3)
    const txn4 = await getTestTransaction(4, account2.addr)
    const signer1 = algokit.transactionSignerAccount(makeBasicAccountTransactionSigner(testAccount), testAccount.addr)
    const signer2 = algokit.transactionSignerAccount(makeBasicAccountTransactionSigner(account2), account2.addr)

    const { confirmations } = await algokit.sendGroupOfTransactions(
      {
        transactions: [
          {
            transaction: txn1,
            signer: signer1,
          },
          {
            transaction: txn2,
            signer: signer2,
          },
          {
            transaction: txn3,
            signer: signer1,
          },
          {
            transaction: txn4,
            signer: signer2,
          },
        ],
      },
      algod,
    )

    invariant(confirmations)
    invariant(confirmations[0]['confirmed-round'])
    invariant(confirmations[1]['confirmed-round'])
    invariant(confirmations[2]['confirmed-round'])
    invariant(confirmations[3]['confirmed-round'])
    expect(confirmations[0].txn.txn.amt).toBe(1)
    expect(algosdk.encodeAddress(confirmations[0].txn.txn.snd)).toBe(testAccount.addr)
    expect(confirmations[1].txn.txn.amt).toBe(2)
    expect(algosdk.encodeAddress(confirmations[1].txn.txn.snd)).toBe(account2.addr)
    expect(confirmations[2].txn.txn.amt).toBe(3)
    expect(algosdk.encodeAddress(confirmations[2].txn.txn.snd)).toBe(testAccount.addr)
    expect(confirmations[3].txn.txn.amt).toBe(4)
    expect(algosdk.encodeAddress(confirmations[3].txn.txn.snd)).toBe(account2.addr)
  })

  test('Multisig single account', async () => {
    const { algod, testAccount } = localnet.context

    // Setup multisig
    const multisig = algokit.multisigAccount(
      {
        addrs: [testAccount.addr],
        threshold: 1,
        version: 1,
      },
      [testAccount],
    )

    // Fund multisig
    await algokit.transferAlgos(
      {
        from: testAccount,
        to: multisig.addr,
        amount: algokit.algos(1),
      },
      algod,
    )

    // Use multisig
    await algokit.transferAlgos(
      {
        from: multisig,
        to: testAccount.addr,
        amount: algokit.microAlgos(500),
      },
      algod,
    )
  })

  test('Multisig double account', async () => {
    const { algod, testAccount, generateAccount } = localnet.context
    const account2 = await generateAccount({
      initialFunds: algokit.algos(10),
      suppressLog: true,
    })

    // Setup multisig
    const multisig = algokit.multisigAccount(
      {
        addrs: [testAccount.addr, account2.addr],
        threshold: 2,
        version: 1,
      },
      [testAccount, account2],
    )

    // Fund multisig
    await algokit.transferAlgos(
      {
        from: testAccount,
        to: multisig.addr,
        amount: algokit.algos(1),
      },
      algod,
    )

    // Use multisig
    await algokit.transferAlgos(
      {
        from: multisig,
        to: testAccount.addr,
        amount: algokit.microAlgos(500),
      },
      algod,
    )
  })
})

describe('transaction node encoder', () => {
  test('null', () => {
    expect(algokit.encodeTransactionNote(null)).toBeUndefined()
  })
  test('undefined', () => {
    expect(algokit.encodeTransactionNote(undefined)).toBeUndefined()
  })
  test('string', () => {
    expect(algokit.encodeTransactionNote('abc')).toMatchInlineSnapshot(`
      Uint8Array [
        97,
        98,
        99,
      ]
    `)
  })
  test('object', () => {
    expect(algokit.encodeTransactionNote({ a: 'b' })).toMatchInlineSnapshot(`
      Uint8Array [
        123,
        34,
        97,
        34,
        58,
        34,
        98,
        34,
        125,
      ]
    `)
  })
  test('arc-0002', () => {
    expect(
      algokit.encodeTransactionNote({
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
