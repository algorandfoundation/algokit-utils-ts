import { describe, test } from '@jest/globals'
import { getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from '../'
import { getBareCallContractData } from '../../tests/example-contracts/bare-call/contract'
import { algorandFixture } from '../testing'
import { AppSpec } from './appspec'

describe('application-client', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getBareCallContractData()).appSpec
  })

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
      deployTimeParameters: {
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
      deployTimeParameters: {
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
      deployTimeParameters: {
        UPDATABLE: 0,
        DELETABLE: 0,
        VALUE: 1,
      },
    })

    const call = await client.call({
      method: 'call',
      methodArgs: ['test'],
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('Hello, test')
  })
})
