import algosdk, { ABIUintType, Address, OnApplicationComplete, TransactionSigner, TransactionType, getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import * as algokit from '..'
import arc56Json from '../../tests/example-contracts/arc56_templates/artifacts/Templates.arc56_draft.json'
import byteArraysAr56Json from '../../tests/example-contracts/byte_arrays/artifacts/ByteArrays.arc56.json'
import deployErrorAppArc56Json from '../../tests/example-contracts/deploy_error/artifacts/DeployError.arc56.json'
import largeAppArc56Json from '../../tests/example-contracts/extra-pages/large.arc56.json'
import smallAppArc56Json from '../../tests/example-contracts/extra-pages/small.arc56.json'
import errorInnerAppArc56Json from '../../tests/example-contracts/inner_error/artifacts/InnerApp.arc56.json'
import errorMiddleAppArc56Json from '../../tests/example-contracts/inner_error/artifacts/MiddleApp.arc56.json'
import errorOuterAppArc56Json from '../../tests/example-contracts/inner_error/artifacts/OuterApp.arc56.json'
import { getTestingAppContract } from '../../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from '../testing'
import { asJson } from '../util'
import { OnSchemaBreak, OnUpdate } from './app'
import { getArc56Method } from './app-arc56'
import { AppClient } from './app-client'
import { AppFactory } from './app-factory'
import { AppManager } from './app-manager'
import { AppSpec } from './app-spec'

describe('ARC32: app-factory-and-app-client', () => {
  const localnet = algorandFixture()
  beforeEach(async () => {
    await localnet.newScope()
    factory = await localnet.algorand.client.getAppFactory({ appSpec, defaultSender: localnet.context.testAccount })
  }, 10_000)

  let appSpec: AppSpec
  let factory: AppFactory
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async () => {
    const result = await factory.deploy({
      deployTimeParams: { VALUE: 1 },
    })
    return {
      app: result.result,
      client: result.appClient,
    }
  }

  test('Create app', async () => {
    const { result: app } = await factory.send.bare.create({
      deployTimeParams: {
        // It should strip off the TMPL_
        TMPL_UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    expect(app.appId).toBeGreaterThan(0n)
    expect(app.appAddress).toEqual(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex ?? 0n).toBe(app.appId)
    expect(app.compiledApproval).toBeTruthy()
  })

  test('Create app with constructor deployTimeParams', async () => {
    const { algorand, testAccount } = localnet.context

    const factory = algorand.client.getAppFactory({
      appSpec,
      defaultSender: testAccount,
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    const app = await factory.send.bare.create()

    expect(app.result.appId).toBeGreaterThan(0n)
    expect(app.appClient.appId).toBe(app.result.appId)
  })

  test('Create app with oncomplete overload', async () => {
    const { result: app } = await factory.send.bare.create({
      onComplete: OnApplicationComplete.OptInOC,
      updatable: true,
      deletable: true,
      deployTimeParams: {
        VALUE: 1,
      },
    })

    expect(app.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.OptInOC)
    expect(app.appId).toBeGreaterThan(0n)
    expect(app.appAddress).toEqual(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex ?? 0n).toBe(app.appId)
  })

  test('Deploy app - can still deploy when immutable and permanent', async () => {
    await factory.deploy({
      deletable: false,
      updatable: false,
      onSchemaBreak: 'fail',
      onUpdate: 'fail',
      deployTimeParams: {
        VALUE: 1,
      },
    })
  })

  test('Deploy app - create', async () => {
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
    })

    invariant(app.operationPerformed === 'create')
    expect(app.appId).toBeGreaterThan(0n)
    expect(app.appAddress).toEqual(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex ?? 0n).toBe(app.appId)
    expect(app.compiledApproval).toBeTruthy()
    expect(app.compiledClear).toBeTruthy()
  })

  test('Deploy app - create (abi)', async () => {
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      createParams: {
        method: 'create_abi',
        args: ['arg_io'],
      },
    })

    invariant(app.operationPerformed === 'create')
    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toEqual(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex ?? 0n).toBe(app.appId)
    expect(app.return).toBe('arg_io')
  })

  test('Deploy app - update', async () => {
    const { result: createdApp } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      updatable: true,
    })
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'update',
    })

    invariant(app.operationPerformed === 'update')
    expect(app.appId).toBe(createdApp.appId)
    expect(app.appAddress).toBe(createdApp.appAddress)
    invariant(app.confirmation)
    expect(app.createdRound).toBe(createdApp.createdRound)
    expect(app.updatedRound).not.toBe(app.createdRound)
    expect(app.updatedRound).toBe(app.confirmation.confirmedRound ?? 0n)
  })

  test('Deploy app - update (abi)', async () => {
    const { result: createdApp } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      updatable: true,
    })
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'update',
      updateParams: {
        method: 'update_abi',
        args: ['arg_io'],
      },
    })

    invariant(app.operationPerformed === 'update')
    expect(app.appId).toBe(createdApp.appId)
    expect(app.appAddress).toBe(createdApp.appAddress)
    invariant(app.confirmation)
    expect(app.createdRound).toBe(createdApp.createdRound)
    expect(app.updatedRound).not.toBe(app.createdRound)
    expect(app.updatedRound).toBe(app.confirmation.confirmedRound ?? 0n)
    expect(app.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.UpdateApplicationOC)
    expect(app.return).toBe('arg_io')
  })

  test('Deploy app - update detects extra pages as breaking change', async () => {
    let appFactory = localnet.algorand.client.getAppFactory({
      appSpec: asJson(smallAppArc56Json),
      defaultSender: localnet.context.testAccount,
    })

    const { result: appCreateResult } = await appFactory.deploy({
      updatable: true,
    })

    expect(appCreateResult.operationPerformed).toBe('create')

    // Update the app to a larger program which needs more pages
    appFactory = localnet.algorand.client.getAppFactory({
      appSpec: asJson(largeAppArc56Json),
      defaultSender: localnet.context.testAccount,
    })

    // Update fails when OnSchemaBreak.Fail is used
    await expect(async () => {
      await appFactory.deploy({
        updatable: true,
        onSchemaBreak: OnSchemaBreak.Fail,
        onUpdate: OnUpdate.UpdateApp,
      })
    }).rejects.toThrowError(
      'Schema break detected and onSchemaBreak=OnSchemaBreak.Fail, stopping deployment. If you want to try deleting and recreating the app then re-run with onSchemaBreak=OnSchemaBreak.ReplaceApp',
    )

    // Update succeeds when OnSchemaBreak.AppendApp is used
    const { result: appAppendResult } = await appFactory.deploy({
      updatable: true,
      onSchemaBreak: OnSchemaBreak.AppendApp,
      onUpdate: OnUpdate.UpdateApp,
    })

    expect(appAppendResult.operationPerformed).toBe('create')
    expect(appCreateResult.appId).not.toEqual(appAppendResult.appId)
  })

  test('Deploy app - replace', async () => {
    const { result: createdApp } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      deletable: true,
    })
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'replace',
    })

    invariant(app.operationPerformed === 'replace')
    expect(app.appId).toBeGreaterThan(createdApp.appId)
    expect(app.appAddress).toEqual(algosdk.getApplicationAddress(app.appId))
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.applicationCall?.appIndex).toBe(createdApp.appId)
    expect(app.deleteResult.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
  })

  test('Deploy app - replace (abi)', async () => {
    const { result: createdApp } = await factory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      deletable: true,
      populateAppCallResources: false,
    })
    const { result: app } = await factory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'replace',
      createParams: {
        method: 'create_abi',
        args: ['arg_io'],
      },
      deleteParams: {
        method: 'delete_abi',
        args: ['arg2_io'],
      },
      populateAppCallResources: false,
    })

    invariant(app.operationPerformed === 'replace')
    expect(app.appId).toBeGreaterThan(createdApp.appId)
    expect(app.appAddress).toEqual(algosdk.getApplicationAddress(app.appId))
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.applicationCall?.appIndex).toBe(createdApp.appId)
    expect(app.deleteResult.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
    expect(app.return).toBe('arg_io')
    expect(app.deleteReturn).toBe('arg2_io')
  })

  test('Create then call app', async () => {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    const call = await appClient.send.call({
      method: 'call_abi',
      args: ['test'],
    })

    invariant(call.return)
    expect(call.return).toBe('Hello, test')
  })
  test('Call app too many args', async () => {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    await expect(
      appClient.send.call({
        method: 'call_abi',
        args: ['test', 'extra'],
      }),
    ).rejects.toThrow('Unexpected arg at position 1. call_abi only expects 1 args')
  })

  test('Call app with rekey', async () => {
    const { testAccount, algorand } = localnet.context
    const rekeyTo = algorand.account.random()

    const { appClient } = await factory.send.bare.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })
    await appClient.send.optIn({
      method: 'opt_in',
      rekeyTo: rekeyTo,
    })

    // If the rekey didn't work this will throw
    const rekeyedAccount = algorand.account.rekeyed(testAccount, rekeyTo)
    await algorand.send.payment({
      amount: (0).algo(),
      sender: rekeyedAccount,
      receiver: testAccount,
    })
  })

  test('Create app with abi', async () => {
    const { result: call } = await factory.send.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
      method: 'create_abi',
      args: ['string_io'],
    })

    invariant(call.return)
    expect(call.return).toBe('string_io')
  })

  test('Update app with abi', async () => {
    const deployTimeParams = {
      UPDATABLE: 1,
      DELETABLE: 0,
      VALUE: 1,
    }
    const { appClient } = await factory.send.bare.create({
      deployTimeParams,
    })

    const call = await appClient.send.update({
      method: 'update_abi',
      args: ['string_io'],
      deployTimeParams,
    })

    invariant(call.return)
    expect(call.return).toBe('string_io')
    expect(call.compiledApproval).toBeTruthy()
  })

  test('Delete app with abi', async () => {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 1,
        VALUE: 1,
      },
    })

    const call = await appClient.send.delete({
      method: 'delete_abi',
      args: ['string_io'],
    })

    invariant(call.return)
    expect(call.return).toBe('string_io')
  })

  test('Construct transaction with boxes', async () => {
    const { client } = await deploy()

    const call = await client.createTransaction.call({
      method: 'call_abi',
      args: ['test'],
      boxReferences: [{ appId: 0n, name: '1' }],
    })

    const encoder = new TextEncoder()
    expect(call.transactions[0].applicationCall?.boxes).toEqual([{ appIndex: 0n, name: encoder.encode('1') }])

    const call2 = await client.createTransaction.call({
      method: 'call_abi',
      args: ['test'],
      boxReferences: ['1'],
    })

    expect(call2.transactions[0].applicationCall?.boxes).toEqual([{ appIndex: 0n, name: encoder.encode('1') }])
  })

  test('Construct transaction with abi encoding including transaction', async () => {
    const { algorand, testAccount } = localnet.context
    const txn = await algorand.createTransaction.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy()

    const result = await client.send.call({
      method: 'call_abi_txn',
      args: [txn, 'test'],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[1])
    expect(result.transactions.length).toBe(2)
    const returnValue = AppManager.getABIReturn(result.confirmations[1], getArc56Method('call_abi_txn', client.appSpec))
    expect(result.return).toBe(`Sent ${txn.payment?.amount}. test`)
    expect(returnValue?.returnValue).toBe(result.return)
  })

  test('Sign all transactions in group with abi call with transaction arg', async () => {
    const { algorand, testAccount } = localnet.context
    const txn = await algorand.createTransaction.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy()

    let indexes: number[] = []
    const signer: TransactionSigner = (group, indxs) => {
      indexes = indxs
      return algorand.account.getSigner(testAccount)(group, indexes)
    }

    await client.send.call({
      method: 'call_abi_txn',
      args: [txn, 'test'],
      sender: testAccount,
      signer,
    })

    expect(indexes).toEqual([0, 1])
  })

  test('Sign transaction in group with different signer if provided', async () => {
    const { algorand, generateAccount } = localnet.context
    const signer = await generateAccount({ initialFunds: (1).algo() })
    const txn = await algorand.createTransaction.payment({
      sender: signer,
      receiver: signer,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy()

    await client.send.call({
      method: 'call_abi_txn',
      args: [{ txn, signer: signer.signer }, 'test'],
    })
  })

  test('Construct transaction with abi encoding including foreign references not in signature', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy()

    const result = await client.send.call({
      method: 'call_abi_foreign_refs',
      appReferences: [345n],
      accountReferences: [testAccount],
      assetReferences: [567n],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[0])
    expect(result.transactions.length).toBe(1)
    const expectedReturnValue = AppManager.getABIReturn(result.confirmations[0], getArc56Method('call_abi_foreign_refs', client.appSpec))
    const testAccountPublicKey = testAccount.publicKey
    expect(result.return).toBe(`App: 345, Asset: 567, Account: ${testAccountPublicKey[0]}:${testAccountPublicKey[1]}`)
    expect(expectedReturnValue?.returnValue).toBe(result.return)
  })

  describe('Errors', () => {
    const logging = algoKitLogCaptureFixture()
    beforeEach(logging.beforeEach)
    afterEach(logging.afterEach)

    test('Export and import of source map works', async () => {
      const { algorand, testAccount } = localnet.context
      const { client, app } = await deploy()

      const oldSourceMaps = client.exportSourceMaps()
      const newClient = algorand.client.getAppClientById({
        appId: app.appId,
        defaultSender: testAccount,
        appSpec,
      })

      try {
        await newClient.send.call({
          method: 'error',
        })
        invariant(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        expect(e.stack).toContain('assert failed')
      }

      newClient.importSourceMaps(JSON.parse(JSON.stringify(oldSourceMaps)))

      try {
        await newClient.send.call({
          method: 'error',
        })
        invariant(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        expect(e.stack).toMatchInlineSnapshot(`
          "// error
          error_7:
          proto 0 0
          intc_0 // 0
          // Deliberate error
          assert <--- Error
          retsub

          // create
          create_8:"
        `)
        expect(e.led).toMatchObject({
          pc: 885,
          msg: 'assert failed pc=885',
        })
        expect(e.led.txId.length).toBe(52)
      }
    })

    test('Display nice error messages when there is a logic error', async () => {
      const { testAccount } = localnet.context
      const { client, app } = await deploy()

      try {
        await client.send.call({
          method: 'error',
        })
        invariant(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        expect(e.led).toMatchObject({
          pc: 885,
          msg: 'assert failed pc=885',
        })
        expect(e.led.txId.length).toBe(52)
        expect(e.stack).toMatchInlineSnapshot(`
          "// error
          error_7:
          proto 0 0
          intc_0 // 0
          // Deliberate error
          assert <--- Error
          retsub

          // create
          create_8:"
        `)
        expect(e.led.traces.length).toBe(1)
        expect(
          logging.testLogger.getLogSnapshot({
            accounts: [testAccount],
            transactions: app.operationPerformed === 'create' ? [app.transaction, e.led.txId] : [],
            apps: [app.appId],
          }),
        ).toMatchSnapshot()
      }
    })
  })

  test('Fund app account', async () => {
    const { testAccount } = localnet.context
    const fundAmount = algokit.microAlgo(200_000)
    const { client, app } = await deploy()

    const result = await client.fundAppAccount({
      amount: fundAmount,
    })

    expect(result.transaction.payment?.amount).toBe(fundAmount.microAlgo)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(result.transaction.payment?.receiver?.toString()).toBe(app.appAddress.toString())
    expect(result.transaction.sender.toString()).toBe(testAccount.toString())
    invariant(result.confirmation)
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0)
  })

  test('Retrieve state', async () => {
    const { testAccount } = localnet.context
    const { client } = await deploy()

    await client.send.call({ method: 'set_global', args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
    const globalState = await client.getGlobalState()

    invariant(globalState.int1)
    invariant(globalState.int2)
    invariant(globalState.bytes1)
    invariant(globalState.bytes2)
    invariant('valueRaw' in globalState.bytes2)
    expect(Object.keys(globalState).sort()).toEqual(['bytes1', 'bytes2', 'int1', 'int2', 'value'])
    expect(globalState.int1.value).toBe(1n)
    expect(globalState.int2.value).toBe(2n)
    expect(globalState.bytes1.value).toBe('asdf')
    expect(globalState.bytes2.valueRaw).toEqual(new Uint8Array([1, 2, 3, 4]))

    await client.send.optIn({ method: 'opt_in' })
    await client.send.call({ method: 'set_local', args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
    const localState = await client.getLocalState(testAccount)

    invariant(localState.local_int1)
    invariant(localState.local_int2)
    invariant(localState.local_bytes1)
    invariant(localState.local_bytes2)
    invariant('valueRaw' in localState.local_bytes2)
    expect(Object.keys(localState).sort()).toEqual(['local_bytes1', 'local_bytes2', 'local_int1', 'local_int2'])
    expect(localState.local_int1.value).toBe(1n)
    expect(localState.local_int2.value).toBe(2n)
    expect(localState.local_bytes1.value).toBe('asdf')
    expect(localState.local_bytes2.valueRaw).toEqual(new Uint8Array([1, 2, 3, 4]))

    const boxName1 = new Uint8Array([0, 0, 0, 1])
    const boxName1Base64 = Buffer.from(boxName1).toString('base64')
    const boxName2 = new Uint8Array([0, 0, 0, 2])
    const boxName2Base64 = Buffer.from(boxName2).toString('base64')
    await client.fundAppAccount({ amount: algokit.algo(1) })
    await client.send.call({
      method: 'set_box',
      args: [boxName1, 'value1'],
      boxReferences: [boxName1],
    })
    await client.send.call({
      method: 'set_box',
      args: [boxName2, 'value2'],
      boxReferences: [boxName2],
    })

    // HACK: walkaround to wait for the box info to catch up
    for (let i = 0; i < 40; i++) {
      const note = `test${i + 1}`
      await localnet.context.algorand.send.payment({
        sender: localnet.context.testAccount,
        receiver: localnet.context.testAccount,
        amount: algokit.algo(0),
        note,
      })
    }

    const boxValues = await client.getBoxValues()
    const box1Value = await client.getBoxValue(boxName1)
    expect(boxValues.map((b) => b.name.nameBase64).sort()).toEqual([boxName1Base64, boxName2Base64].sort())
    const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)
    expect(box1!.value).toEqual(new Uint8Array(Buffer.from('value1')))
    expect(box1Value).toEqual(box1?.value)
    const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)
    expect(box2!.value).toEqual(new Uint8Array(Buffer.from('value2')))

    const expectedValue = 1234524352
    await client.send.call({
      method: 'set_box',
      args: [boxName1, new ABIUintType(32).encode(expectedValue)],
      boxReferences: [boxName1],
    })
    const boxes = await client.getBoxValuesFromABIType(new ABIUintType(32), (n) => n.nameBase64 === boxName1Base64)
    const box1AbiValue = await client.getBoxValueFromABIType(boxName1, new ABIUintType(32))
    expect(boxes.length).toBe(1)
    const [value] = boxes
    expect(Number(value.value)).toBe(expectedValue)
    expect(Number(box1AbiValue)).toBe(expectedValue)
  })

  describe('Call ABI methods with default arguments', () => {
    test('from const', async () => {
      await testAbiWithDefaultArgMethod('default_value(string)string', 'defined value', 'defined value', 'default value')
    })

    test('from abi method', async () => {
      await testAbiWithDefaultArgMethod('default_value_from_abi(string)string', 'defined value', 'ABI, defined value', 'ABI, default value')
    })

    test('from global state', async () => {
      const globalInt1 = 456n

      await testAbiWithDefaultArgMethod('default_value_from_global_state(uint64)uint64', 123, 123n, globalInt1, async (client) => {
        await client.send.call({ method: 'set_global', args: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
      })
    })

    test('from local state', async () => {
      const localBytes1 = 'bananas'
      await testAbiWithDefaultArgMethod(
        'default_value_from_local_state(string)string',
        'defined value',
        'Local state, defined value',
        `Local state, ${localBytes1}`,
        async (client) => {
          await client.send.optIn({ method: 'opt_in' })
          await client.send.call({ method: 'set_local', args: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])] })
        },
      )
    })

    async function testAbiWithDefaultArgMethod<TArg extends algosdk.ABIValue, TResult>(
      methodSignature: string,
      definedValue: TArg,
      definedValueReturnValue: TResult,
      defaultValueReturnValue: TResult,
      setup?: (client: AppClient) => Promise<void>,
    ) {
      const { client } = await deploy()

      await setup?.(client)

      const definedValueResult = await client.send.call({
        method: methodSignature,
        args: [definedValue],
      })
      expect(definedValueResult.return).toBe(definedValueReturnValue)
      const defaultValueResult = await client.send.call({
        method: methodSignature,
        args: [undefined],
      })
      expect(defaultValueResult.return).toBe(defaultValueReturnValue)
    }
  })
})

describe('ARC56: app-factory-and-app-client', () => {
  let factory: AppFactory

  const localnet = algorandFixture()
  beforeEach(async () => {
    await localnet.newScope()

    factory = localnet.algorand.client.getAppFactory({
      // @ts-expect-error TODO: Fix this
      appSpec: arc56Json,
      defaultSender: localnet.context.testAccount.addr,
    })
  }, 10_000)

  test('ARC56 error messages from inner app error', async () => {
    const innerFactory = localnet.algorand.client.getAppFactory({
      // @ts-expect-error TODO: Fix this
      appSpec: errorInnerAppArc56Json,
      defaultSender: localnet.context.testAccount.addr,
    })

    const { appClient: innerClient } = await innerFactory.deploy({ createParams: { method: 'createApplication' } })

    const middleFactory = localnet.algorand.client.getAppFactory({
      // @ts-expect-error TODO: Fix this
      appSpec: errorMiddleAppArc56Json,
      defaultSender: localnet.context.testAccount.addr,
    })

    const { appClient: middleClient } = await middleFactory.deploy({ createParams: { method: 'createApplication' } })

    const outerFactory = localnet.algorand.client.getAppFactory({
      // @ts-expect-error TODO: Fix this
      appSpec: errorOuterAppArc56Json,
      defaultSender: localnet.context.testAccount.addr,
    })

    const { appClient: outerClient } = await outerFactory.deploy({ createParams: { method: 'createApplication' } })

    await expect(
      outerClient.send.call({ method: 'callMiddle', args: [middleClient.appId, innerClient.appId], extraFee: algokit.microAlgos(2000) }),
    ).rejects.toThrow('custom error message')
  })

  test('ARC56 error message on deploy', async () => {
    const deployErrorFactory = localnet.algorand.client.getAppFactory({
      // @ts-expect-error TODO: Fix this
      appSpec: deployErrorAppArc56Json,
      defaultSender: localnet.context.testAccount.addr,
    })

    await expect(deployErrorFactory.deploy({ createParams: { method: 'createApplication' } })).rejects.toThrow('custom error message')
  })

  test('ARC56 error messages with dynamic template vars (cblock offset)', async () => {
    const { appClient } = await factory.deploy({
      createParams: {
        method: 'createApplication',
      },
      deployTimeParams: { bytes64TmplVar: '0'.repeat(64), uint64TmplVar: 123, bytes32TmplVar: '0'.repeat(32), bytesTmplVar: 'foo' },
    })

    try {
      await appClient.send.call({ method: 'throwError' })
      invariant(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toMatch('this is an error')
    }
  })

  test('AppClient registers error transformer to AlgorandClient', async () => {
    const { testAccount } = localnet.context
    const { appClient } = await factory.deploy({
      createParams: {
        method: 'createApplication',
      },
      deployTimeParams: { bytes64TmplVar: '0'.repeat(64), uint64TmplVar: 123, bytes32TmplVar: '0'.repeat(32), bytesTmplVar: 'foo' },
    })

    try {
      // Don't use the app client to call, but since we've instantiated one the error transformer should be registered
      await appClient.algorand
        .newGroup()
        .addAppCallMethodCall({ appId: appClient.appId, method: appClient.getABIMethod('throwError')!, sender: testAccount })
        .send()
      invariant(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error)
      expect(e.message).toMatch('this is an error')
    }
  })

  test('ARC56 undefined error message with dynamic template vars (cblock offset)', async () => {
    const appId = (
      await factory.deploy({
        createParams: {
          method: 'createApplication',
        },
        deployTimeParams: { bytes64TmplVar: '0'.repeat(64), uint64TmplVar: 0, bytes32TmplVar: '0'.repeat(32), bytesTmplVar: 'foo' },
      })
    ).result.appId

    // Create a new client so that won't have the source map from compilation
    const appClient = localnet.algorand.client.getAppClientById({
      appId,
      defaultSender: localnet.context.testAccount.addr,
      // @ts-expect-error TODO: Fix this
      appSpec: arc56Json,
    })

    try {
      await appClient.send.call({ method: 'tmpl' })
      throw Error('should not get here')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(
        e.stack
          .split('\n')
          .map((l: string) => l.trim())
          .join('\n'),
      ).toMatch(`log

// tests/example-contracts/arc56_templates/templates.algo.ts:14
// assert(this.uint64TmplVar)
intc 1 // TMPL_uint64TmplVar
assert <--- Error
retsub

// specificLengthTemplateVar()void
*abi_route_specificLengthTemplateVar:`)
    }
  })

  describe('Decoding bytes', async () => {
    let appClient: AppClient
    let algorand: algokit.AlgorandClient
    let sender: Address

    beforeAll(async () => {
      await localnet.newScope()
      ;({ algorand } = localnet)
      const { testAccount } = localnet.context
      sender = testAccount.addr
      const factory = new AppFactory({
        algorand,
        appSpec: JSON.stringify(byteArraysAr56Json),
        defaultSender: testAccount,
      })

      ;({ appClient } = await factory.send.create({
        extraFee: algokit.microAlgos(1000),
        method: 'createApplication',
        onComplete: OnApplicationComplete.OptInOC,
      }))

      await algorand.account.ensureFunded(appClient.appAddress, testAccount, algokit.microAlgos(251200))

      const methodCall = await appClient.params.call({ method: 'setBoxValues' })
      // Random extra call to get more txns for resources
      const extraMethodCall = await appClient.params.call({ method: 'dynamicByteArray' })
      await algorand.newGroup().addAppCallMethodCall(methodCall).addAppCallMethodCall(extraMethodCall).send()
    })

    type ByteArraysInStruct = {
      arr1: Uint8Array
      arr2: Uint8Array
      nestedStruct: {
        arr3: Uint8Array
        nonBytes: bigint
      }
    }

    const valueTests = {
      dynamicByteArray: (value: Uint8Array) => {
        expect(value).toBeInstanceOf(Uint8Array)
      },
      staticByteArray: (value: Uint8Array) => {
        expect(value).toBeInstanceOf(Uint8Array)
      },
      nestedByteArrays: (value: Uint8Array[]) => {
        expect(value).toHaveLength(2)
        expect(value[0]).toBeInstanceOf(Uint8Array)
        expect(value[1]).toBeInstanceOf(Uint8Array)
      },
      byteArraysInStruct: (value: ByteArraysInStruct) => {
        expect(value).not.toBeInstanceOf(Array)
        expect(value.arr1).toBeInstanceOf(Uint8Array)
        expect(value.arr2).toBeInstanceOf(Uint8Array)
        expect(value.nestedStruct.arr3).toBeInstanceOf(Uint8Array)
      },
    }

    const valueAccessMethods = {
      'send method call and get return value': async (appClient: AppClient, method: string) => {
        const result = await appClient.send.call({ method })
        return result.return!
      },
      'simulate method call and get return value': async (appClient: AppClient, method: string) => {
        const params = await appClient.params.call({ method })
        const result = await algorand.newGroup().addAppCallMethodCall(params).simulate()
        return result.returns![0].returnValue!
      },
      'global getValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.global.getValue(`${name}Global`)!
      },
      'local getValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.local(sender).getValue(`${name}Local`)!
      },
      'box getValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.box.getValue(`${name}Box`)!
      },
      'global getAll': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.global.getAll()
        return result[`${name}Global`]
      },
      'local getAll': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.local(sender).getAll()
        return result[`${name}Local`]
      },
      'box getAll': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.box.getAll()
        return result[`${name}Box`]
      },
      'global getMapValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.global.getMapValue(`${name}GlobalMap`, 0)!
      },
      'local getMapValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.local(sender).getMapValue(`${name}LocalMap`, 0)!
      },
      'box getMapValue': async (appClient: AppClient, name: string) => {
        return await appClient.state.box.getMapValue(`${name}BoxMap`, 0)!
      },
      'global getMap': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.global.getMap(`${name}GlobalMap`)!
        return [...result.values()][0]
      },
      'local getMap': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.local(sender).getMap(`${name}LocalMap`)!
        return [...result.values()][0]
      },
      'box getMap': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.box.getMap(`${name}BoxMap`)!
        return [...result.values()][0]
      },
      'global getMap key': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.global.getMap(`${name}GlobalMapKey`)!
        return [...result.keys()][0]
      },
      'local getMap key': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.local(sender).getMap(`${name}LocalMapKey`)!
        return [...result.keys()][0]
      },
      'box getMap key': async (appClient: AppClient, name: string) => {
        const result = await appClient.state.box.getMap(`${name}BoxMapKey`)!
        return [...result.keys()][0]
      },
    }

    for (const [desc, getter] of Object.entries(valueAccessMethods)) {
      describe(desc, () => {
        for (const [valueType, tests] of Object.entries(valueTests)) {
          // Simulate is called from a generic composer, not the AppClient, so it doesn't have ARC56 struct data
          // State methods don't attempt to decode as a struct and just give
          if (!desc.startsWith('send') && valueType === 'byteArraysInStruct') continue

          test(valueType, async () => {
            tests(await getter(appClient, valueType))
          })
        }
      })
    }
  })
})
