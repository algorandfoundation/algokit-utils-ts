import {
  ABIValue,
  decodeABIValue,
  encodeABIValue,
  findABIMethod,
  getABIMethod,
  getABIStructType,
  getABIType,
} from '@algorandfoundation/algokit-abi'
import { OnApplicationComplete, TransactionType } from '@algorandfoundation/algokit-transact'
import * as algosdk from '@algorandfoundation/sdk'
import { TransactionSigner, getApplicationAddress } from '@algorandfoundation/sdk'
import invariant from 'tiny-invariant'
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import * as algokit from '..'
import { algo } from '..'
import boxMapAppSpec from '../../tests/example-contracts/box_map/artifacts/BoxMapTest.arc56.json'
import { getTestingAppContract } from '../../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from '../testing'
import { AlgoAmount } from './amount'
import { AppClient } from './app-client'
import { AppFactory } from './app-factory'
import { AppManager } from './app-manager'
import { AppSpec } from './app-spec'

describe('app-client', () => {
  const localnet = algorandFixture()
  beforeEach(async () => {
    await localnet.newScope()
    defaultFactory = localnet.algorand.client.getAppFactory({
      appSpec,
      defaultSender: localnet.context.testAccount,
    })
  }, 10_000)

  let appSpec: AppSpec
  let defaultFactory: AppFactory
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async (appName?: string) => {
    const appFactory = localnet.algorand.client.getAppFactory({
      appSpec,
      defaultSender: localnet.context.testAccount,
      appName,
    })

    const { result, appClient } = await appFactory.deploy({
      deployTimeParams: { VALUE: 1 },
    })

    return { result, client: appClient }
  }

  test('Create app', async () => {
    const { result } = await defaultFactory.send.bare.create({
      deployTimeParams: {
        // It should strip off the TMPL_
        TMPL_UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    expect(result.appId).toBeGreaterThan(0n)
    expect(result.appAddress).toEqual(getApplicationAddress(result.appId))
    expect(result.confirmation?.appId ?? 0n).toBe(result.appId)
    expect(result.compiledApproval).toBeTruthy()
  })

  test('Create app with constructor deployTimeParams', async () => {
    const { algorand, testAccount } = localnet.context

    const newFactory = algorand.client.getAppFactory({
      appSpec,
      defaultSender: testAccount,
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    const { result, appClient } = await newFactory.send.bare.create()

    expect(result.appId).toBeGreaterThan(0n)
    expect(appClient.appId).toBe(result.appId)
  })

  test('Create app with oncomplete overload', async () => {
    const { result } = await defaultFactory.send.bare.create({
      onComplete: OnApplicationComplete.OptIn,
      updatable: true,
      deletable: true,
      deployTimeParams: {
        VALUE: 1,
      },
    })

    expect(result.transaction.appCall?.onComplete).toBe(OnApplicationComplete.OptIn)
    expect(result.appId).toBeGreaterThan(0n)
    expect(result.appAddress).toEqual(getApplicationAddress(result.appId))
    expect(result.confirmation?.appId ?? 0n).toBe(result.appId)
  })

  test('Deploy app - can still deploy when immutable and permanent', async () => {
    await defaultFactory.deploy({
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
    const { result } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
    })

    invariant(result.operationPerformed === 'create')
    expect(result.appId).toBeGreaterThan(0n)
    expect(result.appAddress).toEqual(getApplicationAddress(result.appId))
    expect(result.confirmation?.appId ?? 0n).toBe(result.appId)
    expect(result.compiledApproval).toBeTruthy()
  })

  test('Deploy app - create (abi)', async () => {
    const { result } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      createParams: {
        method: 'create_abi',
        args: ['arg_io'],
      },
    })

    invariant(result.operationPerformed === 'create')
    expect(result.appId).toBeGreaterThan(0n)
    expect(result.appAddress).toEqual(getApplicationAddress(result.appId))
    expect(result.confirmation?.appId ?? 0n).toBe(result.appId)
    expect(result.return).toBe('arg_io')
  })

  test('Deploy app - update', async () => {
    const { result: createdResult } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      updatable: true,
    })
    const { result } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'update',
    })

    invariant(result.operationPerformed === 'update')
    expect(result.appId).toBe(createdResult.appId)
    expect(result.appAddress).toBe(createdResult.appAddress)
    invariant(result.confirmation)
    expect(result.createdRound).toBe(createdResult.createdRound)
    expect(result.updatedRound).not.toBe(result.createdRound)
    expect(result.updatedRound).toBe(result.confirmation.confirmedRound ?? 0n)
  })

  test('Deploy app - update (abi)', async () => {
    const { result: createdResult } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      updatable: true,
    })
    const { result } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'update',
      updateParams: {
        method: 'update_abi',
        args: ['arg_io'],
      },
    })

    invariant(result.operationPerformed === 'update')
    expect(result.appId).toBe(createdResult.appId)
    expect(result.appAddress).toBe(createdResult.appAddress)
    invariant(result.confirmation)
    expect(result.createdRound).toBe(createdResult.createdRound)
    expect(result.updatedRound).not.toBe(result.createdRound)
    expect(result.updatedRound).toBe(result.confirmation.confirmedRound ?? 0n)
    expect(result.transaction.appCall?.onComplete).toBe(OnApplicationComplete.UpdateApplication)
    expect(result.return).toBe('arg_io')
  })

  test('Deploy app - replace', async () => {
    const { result: createdResult } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      deletable: true,
    })
    const { result } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'replace',
    })

    invariant(result.operationPerformed === 'replace')
    expect(result.appId).toBeGreaterThan(createdResult.appId)
    expect(result.appAddress).toEqual(algosdk.getApplicationAddress(result.appId))
    invariant(result.confirmation)
    invariant(result.deleteResult)
    invariant(result.deleteResult.confirmation)
    expect(result.deleteResult.transaction.appCall?.appId).toBe(createdResult.appId)
    expect(result.deleteResult.transaction.appCall?.onComplete).toBe(OnApplicationComplete.DeleteApplication)
  })

  test('Deploy app - replace (abi)', async () => {
    const { result: createdResult } = await defaultFactory.deploy({
      deployTimeParams: {
        VALUE: 1,
      },
      deletable: true,
      populateAppCallResources: false,
    })
    const { result } = await defaultFactory.deploy({
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

    invariant(result.operationPerformed === 'replace')
    expect(result.appId).toBeGreaterThan(createdResult.appId)
    expect(result.appAddress).toEqual(algosdk.getApplicationAddress(result.appId))
    invariant(result.confirmation)
    invariant(result.deleteResult)
    invariant(result.deleteResult.confirmation)
    expect(result.deleteResult.transaction.appCall?.appId).toBe(createdResult.appId)
    expect(result.deleteResult.transaction.appCall?.onComplete).toBe(OnApplicationComplete.DeleteApplication)
    expect(result.return).toBe('arg_io')
    expect(result.deleteReturn).toBe('arg2_io')
  })

  test('Create then call app', async () => {
    const { appClient } = await defaultFactory.send.bare.create({
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

  test('Call app with rekey', async () => {
    const { testAccount, algorand } = localnet.context
    const rekeyTo = algorand.account.random()

    const { appClient } = await defaultFactory.send.bare.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    await appClient.send.optIn({
      method: 'opt_in',
      rekeyTo,
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
    const { result: call } = await defaultFactory.send.create({
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
    const { appClient } = await defaultFactory.send.bare.create({
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
    const { appClient } = await defaultFactory.send.bare.create({
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
    expect(call.transactions[0].appCall?.boxReferences).toEqual([{ appId: 0n, name: encoder.encode('1') }])
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
    const returnValue = AppManager.getABIReturn(result.confirmations[1], findABIMethod('call_abi_txn', client.appSpec))
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
    const signerAccount = await generateAccount({ initialFunds: (1).algo() })
    const txn = await algorand.createTransaction.payment({
      sender: signerAccount,
      receiver: signerAccount,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy()

    await client.send.call({
      method: 'call_abi_txn',
      args: [{ txn, signer: signerAccount.signer }, 'test'],
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
      populateAppCallResources: false,
    })

    invariant(result.confirmations)
    invariant(result.confirmations[0])
    expect(result.transactions.length).toBe(1)
    const testAccountPublicKey = testAccount.publicKey
    expect(result.return).toBe(`App: 345, Asset: 567, Account: ${testAccountPublicKey[0]}:${testAccountPublicKey[1]}`)
  })

  describe('Errors', () => {
    const logging = algoKitLogCaptureFixture()
    beforeEach(logging.beforeEach)
    afterEach(logging.afterEach)

    test('Export and import of source map works', async () => {
      const { algorand, testAccount } = localnet.context
      const { client, result } = await deploy()

      const oldSourceMaps = client.exportSourceMaps()
      const newClient = algorand.client.getAppClientById({
        appId: result.appId,
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
        expect(e.message).toContain('assert failed')
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
      const { client, result } = await deploy()

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
            transactions: result.operationPerformed === 'create' ? [result.transaction, e.led.txId] : [],
            apps: [result.appId],
          }),
        ).toMatchSnapshot()
      }
    })
  })

  test('Fund app account', async () => {
    const { testAccount } = localnet.context
    const fundAmount = algokit.microAlgo(200_000)
    const { client, result: deployResult } = await deploy()

    const fundResult = await client.fundAppAccount({
      amount: fundAmount,
    })

    expect(fundResult.transaction.payment?.amount).toBe(fundAmount.microAlgo)
    expect(fundResult.transaction.type).toBe(TransactionType.Payment)
    expect(fundResult.transaction.payment?.receiver?.toString()).toBe(deployResult.appAddress.toString())
    expect(fundResult.transaction.sender.toString()).toBe(testAccount.toString())
    invariant(fundResult.confirmation)
    expect(fundResult.confirmation.confirmedRound).toBeGreaterThan(0n)
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
      args: [boxName1, encodeABIValue(getABIType('uint32'), expectedValue)],
      boxReferences: [boxName1],
    })
    const boxes = await client.getBoxValuesFromABIType(getABIType('uint32'), (n) => n.nameBase64 === boxName1Base64)
    const box1AbiValue = await client.getBoxValueFromABIType(boxName1, getABIType('uint32'))
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

    async function testAbiWithDefaultArgMethod<TArg extends ABIValue, TResult>(
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

  test('clone overriding the defaultSender and inheriting appName', async () => {
    const { client: appClient } = await deploy('overridden')
    const testAccount2 = await localnet.context.generateAccount({ initialFunds: algo(2) })

    const clonedAppClient = appClient.clone({
      defaultSender: testAccount2.addr,
    })

    expect(appClient.appName).toBe('overridden')
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe(appClient.appName)
    expect((await clonedAppClient.createTransaction.bare.call()).sender.toString()).toBe(testAccount2.addr.toString())
  })

  test('clone overriding appName', async () => {
    const { client: appClient } = await deploy()

    const clonedAppClient = appClient.clone({
      appName: 'cloned',
    })
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe('cloned')
  })

  test('clone inheriting appName based on default handling', async () => {
    const { client: appClient } = await deploy('overridden')

    const clonedAppClient = appClient.clone({
      appName: undefined,
    })

    expect(appClient.appName).toBe('overridden')
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe(appSpec.contract.name)
  })

  test('simulated transaction group result should match sent transaction group result', async () => {
    const { testAccount } = localnet.context
    const { client: appClient } = await deploy()

    const appCall1Params = {
      sender: testAccount,
      appId: appClient.appId,
      method: getABIMethod('set_global(uint64,uint64,string,byte[4])void'),
      args: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])],
    }

    const paymentParams = {
      sender: testAccount,
      receiver: testAccount,
      amount: algo(0.01),
    }

    const appCall2Params = {
      sender: testAccount,
      appId: appClient.appId,
      method: getABIMethod('call_abi(string)string'),
      args: ['test'],
    }

    const simulateResult = await appClient.algorand
      .newGroup()
      .addAppCallMethodCall(appCall1Params)
      .addPayment(paymentParams)
      .addAppCallMethodCall(appCall2Params)
      .simulate({ skipSignatures: true })

    const sendResult = await appClient.algorand
      .newGroup()
      .addAppCallMethodCall(appCall1Params)
      .addPayment(paymentParams)
      .addAppCallMethodCall(appCall2Params)
      .send()

    expect(simulateResult.transactions.length).toBe(sendResult.transactions.length)
    expect(simulateResult.returns!.length).toBe(sendResult.returns!.length)
    expect(simulateResult.returns![0]).toEqual(sendResult.returns![0])
    expect(simulateResult.returns![1]).toEqual(sendResult.returns![1])
  })

  describe('ARC56', () => {
    describe('BoxMap', () => {
      let appClient: AppClient

      beforeEach(async () => {
        const { testAccount, algorand } = localnet.context
        const boxMapFactory = algorand.client.getAppFactory({
          appSpec: JSON.stringify(boxMapAppSpec),
          defaultSender: testAccount,
        })

        appClient = (await boxMapFactory.send.create({ method: 'createApplication' })).appClient

        await algorand.account.ensureFunded(appClient.appAddress, testAccount, AlgoAmount.Algo(1))

        await appClient.send.call({ method: 'setValue', args: [1n, 'foo'] })
      })

      test('getMap with prefix', async () => {
        expect(await appClient.state.box.getMap('bMap')).toEqual(new Map().set(1n, 'foo'))
      })

      test('getMapValue with prefix', async () => {
        expect(await appClient.state.box.getMapValue('bMap', 1n)).toEqual('foo')
      })
    })

    describe('getABIDecodedValue', () => {
      test('correctly decodes a struct containing a uint16', () => {
        const structType = getABIStructType('User', {
          User: [
            { name: 'userId', type: 'uint16' },
            { name: 'name', type: 'string' },
          ],
        })

        const decoded = decodeABIValue(structType, new Uint8Array([0, 1, 0, 4, 0, 5, 119, 111, 114, 108, 100])) as {
          userId: number
          name: string
        }

        expect(typeof decoded.userId).toBe('number')
        expect(decoded.userId).toBe(1)
        expect(typeof decoded.name).toBe('string')
        expect(decoded.name).toBe('world')
      })

      test.each(
        // Generate all valid ABI uint bit lengths
        Array.from({ length: 64 }, (_, i) => (i + 1) * 8),
      )('correctly decodes a uint%i', (bitLength) => {
        const encoded = encodeABIValue(getABIType(`uint${bitLength}`), 1)
        const decoded = decodeABIValue(getABIType(`uint${bitLength}`), encoded)

        if (bitLength < 53) {
          expect(typeof decoded).toBe('number')
          expect(decoded).toBe(1)
        } else {
          expect(typeof decoded).toBe('bigint')
          expect(decoded).toBe(1n)
        }
      })
    })
  })
})
