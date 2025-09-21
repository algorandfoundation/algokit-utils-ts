import algosdk, {
  ABIUintType,
  Account,
  Address,
  Algodv2,
  getApplicationAddress,
  Indexer,
  OnApplicationComplete,
  TransactionSigner,
  TransactionType,
} from 'algosdk'
import invariant from 'tiny-invariant'
import { afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import * as algokit from '..'
import { algo } from '..'
import boxMapAppSpec from '../../tests/example-contracts/box_map/artifacts/BoxMapTest.arc56.json'
import { getTestingAppContract } from '../../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from '../testing'
import { AlgoAmount } from './amount'
import { ABIAppCallArg } from './app'
import { getABIDecodedValue } from './app-arc56'
import { AppClient, ApplicationClient } from './app-client'
import { AppManager } from './app-manager'
import { AppSpec } from './app-spec'

describe('application-client', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 10_000)

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async (account: Address & Account, algod: Algodv2, indexer: Indexer) => {
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: account,
        creatorAddress: account,
        findExistingUsing: indexer,
      },
      algod,
    )
    const app = await client.deploy({
      deployTimeParams: { VALUE: 1 },
    })
    return { client, app }
  }

  test('Create app', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )

    const app = await client.create({
      //allowUpdate: true,
      //allowDelete: true,
      deployTimeParams: {
        // It should strip off the TMPL_
        TMPL_UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appId).toString())
    expect(app.confirmation?.applicationIndex).toBe(BigInt(app.appId))
    expect(app.compiledApproval).toBeTruthy()
  })

  test('Create app with constructor deployTimeParams', async () => {
    const { algod, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
        deployTimeParams: {
          UPDATABLE: 0,
          DELETABLE: 0,
          VALUE: 1,
        },
      },
      algod,
    )

    const app = await client.create()

    expect(app.appId).toBeGreaterThan(0)
  })

  test('Create app with oncomplete overload', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )

    const app = await client.create({
      onCompleteAction: 'opt_in',
      updatable: true,
      deletable: true,
      deployTimeParams: {
        VALUE: 1,
      },
    })

    expect(app.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.OptInOC)
    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appId).toString())
    expect(app.confirmation?.applicationIndex).toBe(BigInt(app.appId))
  })

  test('Deploy app - can still deploy when immutable and permanent', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )

    await client.deploy({
      allowDelete: false,
      allowUpdate: false,
      onSchemaBreak: 'fail',
      onUpdate: 'fail',
      deployTimeParams: {
        VALUE: 1,
      },
    })
  })

  test('Deploy app - create', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )

    const app = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
    })

    invariant(app.operationPerformed === 'create')
    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appId).toString())
    expect(app.confirmation?.applicationIndex).toBe(BigInt(app.appId))
    expect(app.compiledApproval).toBeTruthy()
  })

  test('Deploy app - create (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )

    const app = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
      createArgs: {
        method: 'create_abi',
        methodArgs: ['arg_io'],
      },
    })

    invariant(app.operationPerformed === 'create')
    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appId).toString())
    expect(app.confirmation?.applicationIndex).toBe(BigInt(app.appId))
    expect(app.return?.returnValue).toBe('arg_io')
  })

  test('Deploy app - update', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )
    const createdApp = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
      allowUpdate: true,
    })
    const app = await client.deploy({
      version: '1.0',
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
    expect(app.updatedRound).toBe(Number(app.confirmation.confirmedRound))
  })

  test('Deploy app - update (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )
    const createdApp = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
      allowUpdate: true,
    })
    const app = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'update',
      updateArgs: {
        method: 'update_abi',
        methodArgs: ['arg_io'],
      },
    })

    invariant(app.operationPerformed === 'update')
    expect(app.appId).toBe(createdApp.appId)
    expect(app.appAddress).toBe(createdApp.appAddress)
    invariant(app.confirmation)
    expect(app.createdRound).toBe(createdApp.createdRound)
    expect(app.updatedRound).not.toBe(app.createdRound)
    expect(app.updatedRound).toBe(Number(app.confirmation.confirmedRound))
    expect(app.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.UpdateApplicationOC)
    expect(app.return?.returnValue).toBe('arg_io')
  })

  test('Deploy app - replace', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )
    const createdApp = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
      allowDelete: true,
    })
    const app = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'replace',
    })

    invariant(app.operationPerformed === 'replace')
    expect(app.appId).toBeGreaterThan(createdApp.appId)
    expect(app.appAddress).toBe(algosdk.getApplicationAddress(app.appId).toString())
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.applicationCall?.appIndex).toBe(BigInt(createdApp.appId))
    expect(app.deleteResult.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
  })

  test('Deploy app - replace (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount,
        findExistingUsing: indexer,
      },
      algod,
    )
    const createdApp = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 1,
      },
      allowDelete: true,
      sendParams: { populateAppCallResources: false },
    })
    const app = await client.deploy({
      version: '1.0',
      deployTimeParams: {
        VALUE: 2,
      },
      onUpdate: 'replace',
      createArgs: {
        method: 'create_abi',
        methodArgs: ['arg_io'],
      },
      deleteArgs: {
        method: 'delete_abi',
        methodArgs: ['arg2_io'],
      },
      sendParams: { populateAppCallResources: false },
    })

    invariant(app.operationPerformed === 'replace')
    expect(app.appId).toBeGreaterThan(createdApp.appId)
    expect(app.appAddress).toBe(algosdk.getApplicationAddress(app.appId).toString())
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.applicationCall?.appIndex).toBe(BigInt(createdApp.appId))
    expect(app.deleteResult.transaction.applicationCall?.onComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
    expect(app.return?.returnValue).toBe('arg_io')
    expect(app.deleteReturn?.returnValue).toBe('arg2_io')
  })

  test('Create then call app', async () => {
    const { algod, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
      },
      algod,
    )
    await client.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    const call = await client.call({
      method: 'call_abi',
      methodArgs: ['test'],
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('Hello, test')
  })

  test('Call app with rekey', async () => {
    const { algod, testAccount, algorand } = localnet.context
    const rekeyTo = algorand.account.random()
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
      },
      algod,
    )
    await client.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })
    await client.optIn({
      method: 'opt_in',
      methodArgs: [],
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
    const { algod, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
      },
      algod,
    )

    const call = await client.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
      method: 'create_abi',
      methodArgs: ['string_io'],
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('string_io')
  })

  test('Update app with abi', async () => {
    const { algod, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
      },
      algod,
    )
    const deployTimeParams = {
      UPDATABLE: 1,
      DELETABLE: 0,
      VALUE: 1,
    }
    await client.create({
      deployTimeParams,
    })

    const call = await client.update({
      method: 'update_abi',
      methodArgs: ['string_io'],
      deployTimeParams,
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('string_io')
    expect(call.compiledApproval).toBeTruthy()
  })

  test('Delete app with abi', async () => {
    const { algod, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'id',
        app: appSpec,
        sender: testAccount,
        id: 0,
      },
      algod,
    )
    await client.create({
      deployTimeParams: {
        UPDATABLE: 0,
        DELETABLE: 1,
        VALUE: 1,
      },
    })

    const call = await client.delete({
      method: 'delete_abi',
      methodArgs: ['string_io'],
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('string_io')
  })

  test('Construct transaction with boxes', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    const call = await client.call({
      method: 'call_abi',
      methodArgs: ['test'],
      boxes: [{ appId: 0, name: '1' }],
      sendParams: { skipSending: true },
    })

    const encoder = new TextEncoder()
    expect(call.transaction.applicationCall?.boxes).toEqual([{ appIndex: 0n, name: encoder.encode('1') }])
  })

  test('Construct transaction with abi encoding including transaction', async () => {
    const { algod, algorand, indexer, testAccount } = localnet.context
    const txn = await algorand.createTransaction.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy(testAccount, algod, indexer)

    const result = await client.call({
      method: 'call_abi_txn',
      methodArgs: [txn, 'test'],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[1])
    expect(result.transactions.length).toBe(2)
    const returnValue = AppManager.getABIReturn(result.confirmations[1], client.getABIMethod('call_abi_txn')!)
    expect(returnValue?.returnValue).toBe(`Sent ${txn.payment?.amount}. test`)
  })

  test('Sign all transactions in group with abi call with transaction arg', async () => {
    const { algod, algorand, indexer, testAccount } = localnet.context
    const txn = await algorand.createTransaction.payment({
      sender: testAccount,
      receiver: testAccount,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy(testAccount, algod, indexer)

    let indexes: number[] = []
    const signer: TransactionSigner = (group, indxs) => {
      indexes = indxs
      return algokit.getSenderTransactionSigner(testAccount)(group, indexes)
    }

    await client.call({
      method: 'call_abi_txn',
      methodArgs: [txn, 'test'],
      sender: { addr: testAccount, signer },
    })

    expect(indexes).toEqual([0, 1])
  })

  test('Sign transaction in group with different signer if provided', async () => {
    const { algod, algorand, indexer, testAccount, generateAccount } = localnet.context
    const signer = await generateAccount({ initialFunds: (1).algo() })
    const transaction = await algorand.createTransaction.payment({
      sender: signer,
      receiver: signer,
      amount: algokit.microAlgo(Math.ceil(Math.random() * 10000)),
    })
    const { client } = await deploy(testAccount, algod, indexer)

    await client.call({
      method: 'call_abi_txn',
      methodArgs: [{ transaction, signer }, 'test'],
      sender: testAccount,
    })
  })

  test('Construct transaction with abi encoding including foreign references not in signature', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    const result = await client.call({
      method: 'call_abi_foreign_refs',
      methodArgs: [],
      apps: [345],
      accounts: [testAccount],
      assets: [567],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[0])
    expect(result.transactions.length).toBe(1)
    const returnValue = AppManager.getABIReturn(result.confirmations[0], client.getABIMethod('call_abi_foreign_refs')!)
    const testAccountPublicKey = testAccount.publicKey
    expect(returnValue?.returnValue).toBe(`App: 345, Asset: 567, Account: ${testAccountPublicKey[0]}:${testAccountPublicKey[1]}`)
  })

  describe('Errors', () => {
    const logging = algoKitLogCaptureFixture()
    beforeEach(logging.beforeEach)
    afterEach(logging.afterEach)

    test('Export and import of source map works', async () => {
      const { algod, indexer, testAccount } = localnet.context
      const { client, app } = await deploy(testAccount, algod, indexer)

      const oldSourceMaps = client.exportSourceMaps()
      const newClient = algokit.getAppClient(
        {
          resolveBy: 'id',
          id: app.appId,
          sender: testAccount,
          app: appSpec,
        },
        algod,
      )

      try {
        await newClient.call({
          method: 'error',
          methodArgs: [],
        })
        invariant(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        expect(e.stack).toContain('assert failed')
      }

      newClient.importSourceMaps(JSON.parse(JSON.stringify(oldSourceMaps)))

      try {
        await newClient.call({
          method: 'error',
          methodArgs: [],
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
      const { algod, indexer, testAccount } = localnet.context
      const { client, app } = await deploy(testAccount, algod, indexer)

      try {
        await client.call({
          method: 'error',
          methodArgs: [],
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
    const { algod, indexer, testAccount } = localnet.context
    const fundAmount = algokit.microAlgo(200_000)
    const { client, app } = await deploy(testAccount, algod, indexer)

    const result = await client.fundAppAccount({
      amount: fundAmount,
    })

    expect(result.transaction.payment?.amount).toBe(fundAmount.microAlgo)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(result.transaction.payment?.receiver?.toString()).toBe(app.appAddress)
    expect(result.transaction.sender.toString()).toBe(testAccount.toString())
    invariant(result.confirmation)
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('Retrieve state', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    await client.call({ method: 'set_global', methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
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

    await client.optIn({ method: 'opt_in', methodArgs: [] })
    await client.call({ method: 'set_local', methodArgs: [1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
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
    await client.fundAppAccount(algokit.algo(1))
    await client.call({
      method: 'set_box',
      methodArgs: [boxName1, 'value1'],
      boxes: [boxName1],
    })
    await client.call({
      method: 'set_box',
      methodArgs: [boxName2, 'value2'],
      boxes: [boxName2],
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
    await client.call({
      method: 'set_box',
      methodArgs: [boxName1, new ABIUintType(32).encode(expectedValue)],
      boxes: [boxName1],
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
        await client.call({ method: 'set_global', methodArgs: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])] })
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
          await client.optIn({ method: 'opt_in', methodArgs: [] })
          await client.call({ method: 'set_local', methodArgs: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])] })
        },
      )
    })

    async function testAbiWithDefaultArgMethod<TArg extends ABIAppCallArg, TResult>(
      methodSignature: string,
      definedValue: TArg,
      definedValueReturnValue: TResult,
      defaultValueReturnValue: TResult,
      setup?: (client: ApplicationClient) => Promise<void>,
    ) {
      const { algod, indexer, testAccount } = localnet.context
      const { client } = await deploy(testAccount, algod, indexer)

      await setup?.(client)

      const definedValueResult = await client.call({
        method: methodSignature,
        methodArgs: [definedValue],
      })
      expect(definedValueResult.return?.returnValue).toBe(definedValueReturnValue)
      const defaultValueResult = await client.call({
        method: methodSignature,
        methodArgs: [undefined],
      })
      expect(defaultValueResult.return?.returnValue).toBe(defaultValueReturnValue)
    }
  })
})

describe('app-client', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 10_000)

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async (account: Account, appName?: string) => {
    const appFactory = localnet.algorand.client.getAppFactory({
      appSpec,
      defaultSender: account.addr,
      appName: appName,
    })

    const { appClient } = await appFactory.deploy({
      deployTimeParams: { VALUE: 1 },
    })

    return appClient
  }

  test('clone overriding the defaultSender and inheriting appName', async () => {
    const { testAccount } = localnet.context
    const appClient = await deploy(testAccount, 'overridden')
    const testAccount2 = await localnet.context.generateAccount({ initialFunds: algo(0.1) })

    const clonedAppClient = appClient.clone({
      defaultSender: testAccount2.addr,
    })

    expect(appClient.appName).toBe('overridden')
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe(appClient.appName)
    expect(algosdk.encodeAddress((await clonedAppClient.createTransaction.bare.call()).sender.publicKey)).toBe(testAccount2.addr.toString())
  })

  test('clone overriding appName', async () => {
    const { testAccount } = localnet.context
    const appClient = await deploy(testAccount)

    const clonedAppClient = appClient.clone({
      appName: 'cloned',
    })
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe('cloned')
  })

  test('clone inheriting appName based on default handling', async () => {
    const { testAccount } = localnet.context
    const appClient = await deploy(testAccount, 'overridden')

    const clonedAppClient = appClient.clone({
      appName: undefined,
    })

    expect(appClient.appName).toBe('overridden')
    expect(clonedAppClient.appId).toBe(appClient.appId)
    expect(clonedAppClient.appName).toBe(appSpec.contract.name)
  })

  test('simulated transaction group result should match sent transaction group result', async () => {
    const { testAccount } = localnet.context
    const appClient = await deploy(testAccount)

    const appCall1Params = {
      sender: testAccount,
      appId: appClient.appId,
      method: algosdk.ABIMethod.fromSignature('set_global(uint64,uint64,string,byte[4])void'),
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
      method: algosdk.ABIMethod.fromSignature('call_abi(string)string'),
      args: ['test'],
    }

    const simulateResult = await appClient
      .newGroup()
      .addAppCallMethodCall(appCall1Params)
      .addPayment(paymentParams)
      .addAppCallMethodCall(appCall2Params)
      .simulate({ skipSignatures: true })

    const sendResult = await appClient
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
    beforeEach(async () => {
      localnet.newScope()
    })

    describe('BoxMap', () => {
      let appClient: AppClient

      beforeEach(async () => {
        const { testAccount, algorand } = localnet.context
        const factory = algorand.client.getAppFactory({
          appSpec: JSON.stringify(boxMapAppSpec),
          defaultSender: testAccount,
        })

        appClient = (await factory.send.create({ method: 'createApplication' })).appClient

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
        const decoded = getABIDecodedValue(new Uint8Array([0, 1, 0, 4, 0, 5, 119, 111, 114, 108, 100]), 'User', {
          User: [
            { name: 'userId', type: 'uint16' },
            { name: 'name', type: 'string' },
          ],
        }) as { userId: number; name: string }

        expect(typeof decoded.userId).toBe('number')
        expect(decoded.userId).toBe(1)
        expect(typeof decoded.name).toBe('string')
        expect(decoded.name).toBe('world')
      })

      test.each(
        // Generate all valid ABI uint bit lengths
        Array.from({ length: 64 }, (_, i) => (i + 1) * 8),
      )('correctly decodes a uint%i', (bitLength) => {
        const encoded = new ABIUintType(bitLength).encode(1)
        const decoded = getABIDecodedValue(encoded, `uint${bitLength}`, {})

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
