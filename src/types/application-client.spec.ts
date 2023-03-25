import { describe, test } from '@jest/globals'
import algosdk, { ABIMethod, ABIStringType, ABIUintType, Account, Algodv2, getApplicationAddress, Indexer, TransactionType } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from '../'
import { getTestingAppContract } from '../../tests/example-contracts/testing-app/contract'
import { algorandFixture } from '../testing'
import { AppSpec } from './appspec'

describe('application-client', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getTestingAppContract()).appSpec
  })

  const deploy = async (account: Account, algod: Algodv2, indexer: Indexer) => {
    const client = algokit.getApplicationClient(
      {
        app: appSpec,
        sender: account,
        creatorAddress: account.addr,
        indexer: indexer,
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

    const client = algokit.getApplicationClient(
      {
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
        indexer,
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
    expect(app.confirmation?.['application-index']).toBe(app.appId)
  })

  test('Deploy app', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = algokit.getApplicationClient(
      {
        app: appSpec,
        sender: testAccount,
        creatorAddress: testAccount.addr,
        indexer,
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
    expect(app.confirmation?.['application-index']).toBe(app.appId)
  })

  test('Create then call app', async () => {
    const { algod, testAccount } = localnet.context
    const client = algokit.getApplicationClient(
      {
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

  test('Construct transaction with boxes', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    const call = await client.call({
      method: 'call_abi',
      methodArgs: { args: ['test'], boxes: [{ appId: 0, name: '1' }] },
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
        amount: algokit.microAlgos(1),
        skipSending: true,
      },
      algod,
    )
    const { client } = await deploy(testAccount, algod, indexer)

    const call = await client.call({
      method: 'call_abi_txn',
      methodArgs: { args: [txn.transaction, 'test'] },
      sendParams: { skipSending: true },
    })

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const methodSelector = new ABIMethod(client.getABIMethodParams('call_abi_txn')!).getSelector()
    const methodArg = new ABIStringType().encode('test')
    expect(call.transaction.appArgs).toEqual([methodSelector, methodArg])
  })

  test('Display nice error messages when there is a logic error', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const { client } = await deploy(testAccount, algod, indexer)

    try {
      await client.call({
        method: 'error',
        methodArgs: [],
      })
    } catch (e: any) {
      expect(e.toString()).toMatchInlineSnapshot(`"Error: assert failed pc=607. at:315"`)
      expect(e.stack).toMatchInlineSnapshot(`
        "
        // error
        error_5:
        proto 0 0
        intc_0 // 0
        assert <--- Error
        retsub

        // create
        create_6:"
      `)
    }
  })

  test('Fund app account', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const fundAmount = algokit.microAlgos(200_000)
    const { client, app } = await deploy(testAccount, algod, indexer)

    const result = await client.fundAppAccount({
      amount: fundAmount,
    })

    expect(result.transaction.amount).toBe(+fundAmount)
    expect(result.transaction.type).toBe(TransactionType.pay)
    expect(algosdk.encodeAddress(result.transaction.to.publicKey)).toBe(app.appAddress)
    expect(algosdk.encodeAddress(result.transaction.from.publicKey)).toBe(testAccount.addr)
    invariant(result.confirmation)
    expect(result.confirmation['confirmed-round']).toBeGreaterThan(0)
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
      methodArgs: {
        args: [boxName1, 'value1'],
        boxes: [boxName1],
      },
    })
    await client.call({
      method: 'set_box',
      methodArgs: {
        args: [boxName2, 'value2'],
        boxes: [boxName2],
      },
    })

    const boxValues = await client.getBoxValues()
    expect(boxValues.map((b) => b.name.nameBase64).sort()).toEqual([boxName1Base64, boxName2Base64].sort())
    const box1 = boxValues.find((b) => b.name.nameBase64 === boxName1Base64)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(box1!.value).toEqual(new Uint8Array(Buffer.from('value1')))
    const box2 = boxValues.find((b) => b.name.nameBase64 === boxName2Base64)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(box2!.value).toEqual(new Uint8Array(Buffer.from('value2')))

    const expectedValue = 1234524352
    await client.call({
      method: 'set_box',
      methodArgs: {
        args: [boxName1, new ABIUintType(32).encode(expectedValue)],
        boxes: [boxName1],
      },
    })
    const boxes = await client.getBoxValuesAsABIType(new ABIUintType(32), (n) => n.nameBase64 === boxName1Base64)
    expect(boxes.length).toBe(1)
    const [value] = boxes
    expect(Number(value.value)).toBe(expectedValue)
  })
})
