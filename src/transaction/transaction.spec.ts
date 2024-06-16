/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, test } from '@jest/globals'
import algosdk, { makeBasicAccountTransactionSigner } from 'algosdk'
import invariant from 'tiny-invariant'
import externalARC32 from '../../tests/example-contracts/resource-packer/artifacts/ExternalApp.arc32.json'
import v8ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv8.arc32.json'
import v9ARC32 from '../../tests/example-contracts/resource-packer/artifacts/ResourcePackerv9.arc32.json'

import * as algokit from '..'
import { algorandFixture } from '../testing'
import { ApplicationClient } from '../types/app-client'
import { Arc2TransactionNote } from '../types/transaction'
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
    expect(confirmation?.confirmedRound).toBeGreaterThanOrEqual(txn.firstRound)
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
    expect(confirmations[0].confirmedRound).toBeGreaterThanOrEqual(txn1.firstRound)
    expect(confirmations[1].confirmedRound).toBeGreaterThanOrEqual(txn2.firstRound)
    expect(Buffer.from(confirmations[0].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn1.group).toString('hex'))
    expect(Buffer.from(confirmations[1].txn.txn.grp).toString('hex')).toBe(Buffer.from(txn2.group).toString('hex'))
  })

  test('Transaction group is sent with same signer', async () => {
    const { algod, testAccount } = localnet.context
    const txn1 = await getTestTransaction(1)
    const txn2Promise = algokit.transferAlgos(
      {
        amount: algokit.microAlgos(2),
        from: testAccount,
        to: testAccount.addr,
        skipSending: true,
      },
      algod,
    )

    const { confirmations } = await algokit.sendGroupOfTransactions({ transactions: [txn1, txn2Promise], signer: testAccount }, algod)

    const txn2 = (await txn2Promise).transaction
    invariant(confirmations)
    invariant(confirmations[0].txn.txn.grp)
    invariant(confirmations[1].txn.txn.grp)
    invariant(txn1.group)
    invariant(txn2.group)
    expect(confirmations.length).toBe(2)
    expect(confirmations[0].confirmedRound).toBeGreaterThanOrEqual(txn1.firstRound)
    expect(confirmations[1].confirmedRound).toBeGreaterThanOrEqual(txn2.firstRound)
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
    invariant(confirmations[0].confirmedRound)
    invariant(confirmations[1].confirmedRound)
    invariant(confirmations[2].confirmedRound)
    invariant(confirmations[3].confirmedRound)
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

  test('Transaction wait for confirmation http error', async () => {
    const { algod } = localnet.context
    const txn = await getTestTransaction()
    try {
      await algokit.waitForConfirmation(txn.txID(), 5, algod)
    } catch (e: unknown) {
      expect((e as Error).message).toEqual(`Transaction ${txn.txID()} not confirmed after 5 rounds`)
    }
  })

  test('Transaction fails in debug mode, error is enriched using simulate', async () => {
    const { algod, testAccount } = localnet.context
    const txn1 = await getTestTransaction(1)
    const txn2 = await getTestTransaction(9999999999999) // This will fail due to fee being too high

    try {
      await algokit.sendGroupOfTransactions(
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const messageRegex = new RegExp(
        `transaction ${txn2.txID()}: overspend \\(account ${testAccount.addr}, data \\{.*\\}, tried to spend \\{9999999999999\\}\\)`,
      )
      expect(e.traces[0].message).toMatch(messageRegex)
    }
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

const tests = (version: 8 | 9) => () => {
  const fixture = algorandFixture()

  let appClient: ApplicationClient
  let externalClient: ApplicationClient

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    algokit.Config.configure({ populateAppCallResources: true })
    await fixture.beforeEach()
    const { algod, testAccount } = fixture.context

    if (version === 8) {
      appClient = new ApplicationClient(
        {
          app: JSON.stringify(v8ARC32),
          sender: testAccount,
          resolveBy: 'id',
          id: 0,
        },
        algod,
      )
    } else {
      appClient = new ApplicationClient(
        {
          app: JSON.stringify(v9ARC32),
          sender: testAccount,
          resolveBy: 'id',
          id: 0,
        },
        algod,
      )
    }

    await appClient.create({ method: 'createApplication', methodArgs: [] })

    await appClient.fundAppAccount(algokit.microAlgos(2334300))

    await appClient.call({ method: 'bootstrap', methodArgs: [], sendParams: { fee: algokit.microAlgos(3_000) } })

    externalClient = new ApplicationClient(
      {
        app: JSON.stringify(externalARC32),
        sender: testAccount,
        resolveBy: 'id',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: (await appClient.getGlobalState()).externalAppID!.value as bigint,
      },
      algod,
    )
  })

  afterAll(() => {
    algokit.Config.configure({ populateAppCallResources: false })
  })

  let alice: algosdk.Account

  describe('accounts', () => {
    test('addressBalance: invalid Account reference', async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.call({ method: 'addressBalance', methodArgs: [testAccount.addr], sendParams: { populateAppCallResources: false } }),
      ).rejects.toThrow('invalid Account reference')
    })

    test('addressBalance', async () => {
      await appClient.call({ method: 'addressBalance', methodArgs: [alice.addr] })
    })
  })

  describe('boxes', () => {
    test('smallBox: invalid Box reference', async () => {
      await expect(appClient.call({ method: 'smallBox', methodArgs: [], sendParams: { populateAppCallResources: false } })).rejects.toThrow(
        'invalid Box reference',
      )
    })

    test('smallBox', async () => {
      await appClient.call({ method: 'smallBox', methodArgs: [] })
    })

    test('mediumBox', async () => {
      await appClient.call({ method: 'mediumBox', methodArgs: [] })
    })
  })

  describe('apps', () => {
    test('externalAppCall: unavailable App', async () => {
      await expect(
        appClient.call({
          method: 'externalAppCall',
          methodArgs: [],
          sendParams: { populateAppCallResources: false, fee: algokit.microAlgos(2_000) },
        }),
      ).rejects.toThrow('unavailable App')
    })

    test('externalAppCall', async () => {
      await appClient.call({
        method: 'externalAppCall',
        methodArgs: [],
        sendParams: { fee: algokit.microAlgos(2_000) },
      })
    })
  })

  describe('assets', () => {
    test('assetTotal: unavailable Asset', async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.call({ method: 'assetTotal', methodArgs: [], sendParams: { populateAppCallResources: false } }),
      ).rejects.toThrow('unavailable Asset')
    })

    test('assetTotal', async () => {
      await appClient.call({ method: 'assetTotal', methodArgs: [] })
    })
  })

  describe('cross-product references', () => {
    const hasAssetErrorMsg = version === 8 ? 'invalid Account reference' : 'unavailable Account'

    test(`hasAsset: ${hasAssetErrorMsg}`, async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.call({ method: 'hasAsset', methodArgs: [testAccount.addr], sendParams: { populateAppCallResources: false } }),
      ).rejects.toThrow(hasAssetErrorMsg)
    })

    test('hasAsset', async () => {
      const { testAccount } = fixture.context
      await appClient.call({ method: 'hasAsset', methodArgs: [testAccount.addr] })
    })

    test(`externalLocal: ${hasAssetErrorMsg}`, async () => {
      const { testAccount } = fixture.context
      alice = testAccount
      await expect(
        appClient.call({ method: 'externalLocal', methodArgs: [testAccount.addr], sendParams: { populateAppCallResources: false } }),
      ).rejects.toThrow(hasAssetErrorMsg)
    })

    test('externalLocal', async () => {
      const { testAccount } = fixture.context
      await externalClient.optIn({ method: 'optInToApplication', methodArgs: [], sender: testAccount })

      await appClient.call({
        method: 'externalLocal',
        methodArgs: [testAccount.addr],
        sender: testAccount,
      })
    })
  })

  describe('sendTransaction', () => {
    test('addressBalance: invalid Account reference', async () => {
      const { testAccount, algod } = fixture.context
      alice = testAccount

      const atc = new algosdk.AtomicTransactionComposer()

      atc.addMethodCall({
        appID: Number((await appClient.getAppReference()).appId),
        sender: testAccount.addr,
        signer: algosdk.makeBasicAccountTransactionSigner(testAccount),
        method: appClient.getABIMethod('addressBalance')!,
        methodArgs: [algosdk.generateAccount().addr],
        suggestedParams: await fixture.context.algod.getTransactionParams().do(),
      })

      const txn = atc.buildGroup()[0]

      txn.txn.group = undefined

      await expect(
        algokit.sendTransaction({ transaction: txn.txn, from: testAccount, sendParams: { populateAppCallResources: false } }, algod),
      ).rejects.toThrow('invalid Account reference')
    })

    test('addressBalance', async () => {
      const { testAccount, algod } = fixture.context
      alice = testAccount

      const atc = new algosdk.AtomicTransactionComposer()

      atc.addMethodCall({
        appID: Number((await appClient.getAppReference()).appId),
        sender: testAccount.addr,
        signer: algosdk.makeBasicAccountTransactionSigner(testAccount),
        method: appClient.getABIMethod('addressBalance')!,
        methodArgs: [algosdk.generateAccount().addr],
        suggestedParams: await fixture.context.algod.getTransactionParams().do(),
      })

      const txn = atc.buildGroup()[0]

      txn.txn.group = undefined

      await algokit.sendTransaction({ transaction: txn.txn, from: testAccount }, algod)
    })
  })
}

describe('Resource Packer: AVM8', tests(8))
describe('Resource Packer: AVM9', tests(9))
describe('Resource Packer: Mixed', () => {
  const fixture = algorandFixture()

  let v9Client: ApplicationClient

  let v8Client: ApplicationClient

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    algokit.Config.configure({ populateAppCallResources: true })

    await fixture.beforeEach()
    const { algod, testAccount } = fixture.context

    v9Client = new ApplicationClient(
      {
        app: JSON.stringify(v9ARC32),
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod,
    )

    v8Client = new ApplicationClient(
      {
        app: JSON.stringify(v8ARC32),
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod,
    )

    await v9Client.create({ method: 'createApplication', methodArgs: [] })
    await v8Client.create({ method: 'createApplication', methodArgs: [] })
  })

  afterAll(() => {
    algokit.Config.configure({ populateAppCallResources: false })
  })

  // Temporarily skip this until this algod bug is fixed: https://github.com/algorand/go-algorand/issues/5914
  test.skip('same account', async () => {
    const { algod, testAccount } = fixture.context
    const acct = algosdk.generateAccount()
    const atc = new algosdk.AtomicTransactionComposer()

    const v8ID = Number((await v8Client.getAppReference()).appId)
    const v9ID = Number((await v9Client.getAppReference()).appId)
    const suggestedParams = await algod.getTransactionParams().do()

    const rekeyedTo = algosdk.generateAccount()
    const rekeyTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: testAccount.addr,
      to: testAccount.addr,
      amount: 0,
      rekeyTo: rekeyedTo.addr,
      suggestedParams: await algod.getTransactionParams().do(),
    })

    await algokit.sendTransaction({ transaction: rekeyTxn, from: testAccount }, algod)

    atc.addMethodCall({
      appID: v8ID,
      sender: testAccount.addr,
      signer: algosdk.makeBasicAccountTransactionSigner(rekeyedTo),
      method: v8Client.getABIMethod('addressBalance')!,
      methodArgs: [acct.addr],
      suggestedParams,
    })

    atc.addMethodCall({
      appID: v9ID,
      sender: testAccount.addr,
      signer: algosdk.makeBasicAccountTransactionSigner(rekeyedTo),
      method: v9Client.getABIMethod('addressBalance')!,
      methodArgs: [acct.addr],
      suggestedParams,
    })

    const packedAtc = await algokit.populateAppCallResources(atc, fixture.context.algod)

    const v8CallAccts = packedAtc.buildGroup()[0].txn.appAccounts
    const v9CallAccts = packedAtc.buildGroup()[1].txn.appAccounts

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(v8CallAccts!.length + v9CallAccts!.length).toBe(1)
    await packedAtc.execute(algod, 3)
  })

  test('app account', async () => {
    const { algod, testAccount } = fixture.context

    await v8Client.fundAppAccount(algokit.microAlgos(328500))
    await v8Client.call({ method: 'bootstrap', methodArgs: [], sendParams: { fee: algokit.microAlgos(3_000) } })

    const externalAppID = (await v8Client.getGlobalState()).externalAppID!.value as bigint

    const atc = new algosdk.AtomicTransactionComposer()
    const v8ID = Number((await v8Client.getAppReference()).appId)
    const v9ID = Number((await v9Client.getAppReference()).appId)
    const suggestedParams = await algod.getTransactionParams().do()

    atc.addMethodCall({
      appID: v8ID,
      sender: testAccount.addr,
      signer: algosdk.makeBasicAccountTransactionSigner(testAccount),
      method: v8Client.getABIMethod('externalAppCall')!,
      methodArgs: [],
      suggestedParams: { ...suggestedParams, fee: 2_000 },
    })

    atc.addMethodCall({
      appID: v9ID,
      sender: testAccount.addr,
      signer: algosdk.makeBasicAccountTransactionSigner(testAccount),
      method: v9Client.getABIMethod('addressBalance')!,
      methodArgs: [algosdk.getApplicationAddress(externalAppID)],
      suggestedParams,
    })

    const packedAtc = await algokit.populateAppCallResources(atc, fixture.context.algod)

    const v8CallApps = packedAtc.buildGroup()[0].txn.appForeignApps
    const v9CallAccts = packedAtc.buildGroup()[1].txn.appAccounts

    expect(v8CallApps!.length + v9CallAccts!.length).toBe(1)
    await packedAtc.execute(algod, 3)
  })
})
describe('Resource Packer: meta', () => {
  const fixture = algorandFixture()

  let externalClient: ApplicationClient

  beforeEach(fixture.beforeEach)

  beforeAll(async () => {
    await fixture.beforeEach()
    const { testAccount, algod } = fixture.context
    algokit.Config.configure({ populateAppCallResources: true })

    externalClient = new ApplicationClient(
      {
        app: JSON.stringify(externalARC32),
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algod,
    )

    await externalClient.create({ method: 'createApplication', methodArgs: [] })
  })

  afterAll(() => {
    algokit.Config.configure({ populateAppCallResources: false })
  })

  test('error during simulate', async () => {
    await expect(externalClient.call({ method: 'error', methodArgs: [] })).rejects.toThrow(
      'Error during resource population simulation in transaction 0',
    )
  })

  test('box with txn arg', async () => {
    const { testAccount, algod } = fixture.context

    const payment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: testAccount.addr,
      to: testAccount.addr,
      suggestedParams: await algod.getTransactionParams().do(),
      amount: 0,
    })

    await externalClient.fundAppAccount(algokit.microAlgos(106100))

    await externalClient.call({ method: 'boxWithPayment', methodArgs: [{ transaction: payment, signer: testAccount }] })
  })

  test('sender asset holding', async () => {
    await externalClient.fundAppAccount(algokit.microAlgos(200_000))

    await externalClient.call({
      method: 'createAsset',
      methodArgs: [],
      sendParams: { fee: algokit.microAlgos(2_000) },
    })
    const res = await externalClient.call({ method: 'senderAssetBalance', methodArgs: [] })

    expect(res.transaction.appAccounts?.length || 0).toBe(0)
  })

  test('rekeyed account', async () => {
    const { testAccount } = fixture.context
    const { algorand } = fixture

    const authAddr = algorand.account.random().account

    await algorand.send.rekey({
      sender: testAccount.addr,
      rekeyTo: authAddr.addr,
    })

    await externalClient.fundAppAccount(algokit.microAlgos(200_000))

    await externalClient.call({
      method: 'createAsset',
      methodArgs: [],
      sendParams: { fee: algokit.microAlgos(2_000) },
      sender: { addr: testAccount.addr, signer: algosdk.makeBasicAccountTransactionSigner(authAddr) },
    })
    const res = await externalClient.call({
      method: 'senderAssetBalance',
      methodArgs: [],
      sender: { addr: testAccount.addr, signer: algosdk.makeBasicAccountTransactionSigner(authAddr) },
    })

    expect(res.transaction.appAccounts?.length || 0).toBe(0)
  })
})
