import { describe, test } from '@jest/globals'
import { getApplicationAddress } from 'algosdk'
import { getBareCallContractData } from '../tests/example-contracts/bare-call/contract'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { ApplicationClient } from './application-client'

describe('application-client', () => {
  const localnet = localNetFixture()

  test('Create app', async () => {
    const { algod, indexer, testAccount } = localnet.context

    const client = new ApplicationClient(
      {
        app: (await getBareCallContractData()).appSpec,
        creatorAddress: testAccount.addr,
        sender: testAccount,
      },
      algod,
      indexer,
    )

    const app = await client.create({
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
        app: (await getBareCallContractData()).appSpec,
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
        app: (await getBareCallContractData()).appSpec,
        sender: testAccount,
        index: 0,
      },
      algod,
      indexer,
    )
    const app = await client.create({
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

    console.log(call)
  })
})
