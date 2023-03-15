import { describe, test } from '@jest/globals'
import { getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import { getBareCallContractData } from '../tests/example-contracts/bare-call/contract'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { ApplicationClient } from './application-client'
import { AppSpec } from './types/appspec'

describe('application-client', () => {
  const localnet = localNetFixture()

  let appSpec: AppSpec
  beforeAll(async () => {
    appSpec = (await getBareCallContractData()).appSpec
  })

  test('Create app', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = new ApplicationClient(
      {
        app: appSpec,
        creatorAddress: testAccount.addr,
        sender: testAccount,
      },
      algod,
      indexer,
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

    expect(app.appIndex).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appIndex))
    expect(app.confirmation?.['application-index']).toBe(app.appIndex)
  })

  test('Deploy app', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = new ApplicationClient(
      {
        app: appSpec,
        creatorAddress: testAccount.addr,
        sender: testAccount,
      },
      algod,
      indexer,
    )

    const app = await client.deploy({
      version: '1.0',
      deployTimeParameters: {
        VALUE: 1,
      },
    })

    expect(app.appIndex).toBeGreaterThan(0)
    expect(app.appAddress).toBe(getApplicationAddress(app.appIndex))
    expect(app.confirmation?.['application-index']).toBe(app.appIndex)
  })

  test('Create then call app', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const client = new ApplicationClient(
      {
        app: appSpec,
        sender: testAccount,
        index: 0,
      },
      algod,
      indexer,
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
      callType: 'normal',
    })

    invariant(call.return)
    expect(call.return.decodeError).toBeUndefined()
    expect(call.return.returnValue).toBe('Hello, test')
  })
})
