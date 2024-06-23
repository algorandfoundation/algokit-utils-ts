import { describe, test } from '@jest/globals'
import algosdk, {
  ABIUintType,
  Account,
  Algodv2,
  Indexer,
  OnApplicationComplete,
  TransactionSigner,
  TransactionType,
  getApplicationAddress,
} from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from '..'
import { getTestingAppContract } from '../../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from '../testing'
import { ABIAppCallArg } from './app'
import { ApplicationClient } from './app-client'
import { AppSpec } from './app-spec'

describe('application-client', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async (account: Account, algod: Algodv2, indexer: Indexer) => {
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: account,
        creatorAddress: account.addr,
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
        creatorAddress: testAccount.addr,
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
    expect(app.appAddress).toBe(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex).toBe(app.appId)
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
        creatorAddress: testAccount.addr,
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

    expect(app.transaction.appOnComplete).toBe(OnApplicationComplete.OptInOC)
    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex).toBe(app.appId)
  })

  test('Deploy app - can still deploy when immutable and permanent', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
        creatorAddress: testAccount.addr,
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
    expect(app.appAddress).toBe(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex).toBe(app.appId)
    expect(app.compiledApproval).toBeTruthy()
  })

  test('Deploy app - create (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
    expect(app.appAddress).toBe(getApplicationAddress(app.appId))
    expect(app.confirmation?.applicationIndex).toBe(app.appId)
    expect(app.return?.returnValue).toBe('arg_io')
  })

  test('Deploy app - update', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
    expect(app.updatedRound).toBe(app.confirmation.confirmedRound)
  })

  test('Deploy app - update (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
    expect(app.updatedRound).toBe(app.confirmation.confirmedRound)
    expect(app.transaction.appOnComplete).toBe(OnApplicationComplete.UpdateApplicationOC)
    expect(app.return?.returnValue).toBe('arg_io')
  })

  test('Deploy app - replace', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
    expect(app.appAddress).toBe(algosdk.getApplicationAddress(app.appId))
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.appIndex).toBe(createdApp.appId)
    expect(app.deleteResult.transaction.appOnComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
  })

  test('Deploy app - replace (abi)', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
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
    expect(app.appAddress).toBe(algosdk.getApplicationAddress(app.appId))
    invariant(app.confirmation)
    invariant(app.deleteResult)
    invariant(app.deleteResult.confirmation)
    expect(app.deleteResult.transaction.appIndex).toBe(createdApp.appId)
    expect(app.deleteResult.transaction.appOnComplete).toBe(OnApplicationComplete.DeleteApplicationOC)
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
    const rekeyedAccount = algorand.account.rekeyed(testAccount.addr, rekeyTo)
    await algokit.transferAlgos(
      {
        amount: (0).algos(),
        from: rekeyedAccount,
        to: testAccount,
      },
      algod,
    )
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
    expect(call.transaction.boxes).toEqual([{ appIndex: 0, name: encoder.encode('1') }])
  })

  test('Construct transaction with abi encoding including transaction', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const txn = await algokit.transferAlgos(
      {
        from: testAccount,
        to: testAccount.addr,
        amount: algokit.microAlgos(Math.ceil(Math.random() * 10000)),
        skipSending: true,
      },
      algod,
    )
    const { client } = await deploy(testAccount, algod, indexer)

    const result = await client.call({
      method: 'call_abi_txn',
      methodArgs: [txn.transaction, 'test'],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[1])
    expect(result.transactions.length).toBe(2)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const returnValue = algokit.getABIReturn({ method: client.getABIMethod('call_abi_txn')!, methodArgs: [] }, result.confirmations[1])
    expect(returnValue?.returnValue).toBe(`Sent ${txn.transaction.amount}. test`)
  })

  test('Sign all transactions in group with abi call with transaction arg', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const txn = await algokit.transferAlgos(
      {
        from: testAccount,
        to: testAccount.addr,
        amount: algokit.microAlgos(Math.ceil(Math.random() * 10000)),
        skipSending: true,
      },
      algod,
    )
    const { client } = await deploy(testAccount, algod, indexer)

    let indexes: number[] = []
    const signer: TransactionSigner = (group, indxs) => {
      indexes = indxs
      return algokit.getSenderTransactionSigner(testAccount)(group, indexes)
    }

    await client.call({
      method: 'call_abi_txn',
      methodArgs: [txn.transaction, 'test'],
      sender: { addr: testAccount.addr, signer },
    })

    expect(indexes).toEqual([0, 1])
  })

  test('Sign transaction in group with different signer if provided', async () => {
    const { algod, indexer, testAccount, generateAccount } = localnet.context
    const signer = await generateAccount({ initialFunds: (1).algos() })
    const transaction = (
      await algokit.transferAlgos(
        {
          from: signer,
          to: signer.addr,
          amount: algokit.microAlgos(Math.ceil(Math.random() * 10000)),
          skipSending: true,
        },
        algod,
      )
    ).transaction
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
      accounts: [testAccount.addr],
      assets: [567],
    })

    invariant(result.confirmations)
    invariant(result.confirmations[0])
    expect(result.transactions.length).toBe(1)
    const returnValue = algokit.getABIReturn(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { method: client.getABIMethod('call_abi_foreign_refs')!, methodArgs: [] },
      result.confirmations[0],
    )
    const testAccountPublicKey = algosdk.decodeAddress(testAccount.addr).publicKey
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
    const fundAmount = algokit.microAlgos(200_000)
    const { client, app } = await deploy(testAccount, algod, indexer)

    const result = await client.fundAppAccount({
      amount: fundAmount,
    })

    expect(result.transaction.amount).toBe(fundAmount.microAlgos)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(algosdk.encodeAddress(result.transaction.to.publicKey)).toBe(app.appAddress)
    expect(algosdk.encodeAddress(result.transaction.from.publicKey)).toBe(testAccount.addr)
    invariant(result.confirmation)
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0)
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
    expect(globalState.int1.value).toBe(1)
    expect(globalState.int2.value).toBe(2)
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
    expect(localState.local_int1.value).toBe(1)
    expect(localState.local_int2.value).toBe(2)
    expect(localState.local_bytes1.value).toBe('asdf')
    expect(localState.local_bytes2.valueRaw).toEqual(new Uint8Array([1, 2, 3, 4]))

    const boxName1 = new Uint8Array([0, 0, 0, 1])
    const boxName1Base64 = Buffer.from(boxName1).toString('base64')
    const boxName2 = new Uint8Array([0, 0, 0, 2])
    const boxName2Base64 = Buffer.from(boxName2).toString('base64')
    await client.fundAppAccount(algokit.algos(1))
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(box1!.value).toEqual(new Uint8Array(Buffer.from('value1')))
    expect(box1Value).toEqual(box1?.value)
    const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
