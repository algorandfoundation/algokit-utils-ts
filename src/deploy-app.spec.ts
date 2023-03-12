import { describe, test } from '@jest/globals'
import { getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import { getBareCallContractCreateParams, getBareCallContractDeployParams } from '../tests/example-contracts/bare-call/contract'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { logCaptureFixture } from '../tests/fixtures/log-capture-fixture'
import { callApp, createApp, updateApp } from './app'
import { AppDeployMetadata, deployApp, getCreatorAppsByName } from './deploy-app'

describe('deploy-app', () => {
  const localnet = localNetFixture()
  const logging = logCaptureFixture()

  const name = 'MY_APP'

  test('Created app is retrieved by name with deployment metadata', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await createApp(await getBareCallContractCreateParams(testAccount, creationMetadata), algod)
    await waitForIndexer()

    const apps = await getCreatorAppsByName(indexer, testAccount)

    expect(apps.creator).toBe(testAccount.addr)
    expect(Object.keys(apps.apps)).toEqual([name])
    const app = apps.apps[name]
    expect(app.appIndex).toBe(app1.appIndex)
    expect(app.appAddress).toBe(app1.appAddress)
    expect(app.createdRound).toBe(app1.confirmation?.['confirmed-round'])
    expect(app.createdMetadata).toEqual(creationMetadata)
    expect(app.updatedRound).toBe(app.createdRound)
    expect(app.name).toBe(creationMetadata.name)
    expect(app.updatable).toBe(creationMetadata.updatable)
    expect(app.deletable).toBe(creationMetadata.deletable)
    expect(app.version).toBe(creationMetadata.version)
  })

  test('Created, updated and deleted apps are retrieved by name with deployment metadata', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: true }
    const name2 = 'APP_2'
    const name3 = 'APP_3'
    const app1 = await createApp(await getBareCallContractCreateParams(testAccount, creationMetadata), algod)
    const app2 = await createApp(await getBareCallContractCreateParams(testAccount, { ...creationMetadata, name: name2 }), algod)
    const app3 = await createApp(await getBareCallContractCreateParams(testAccount, { ...creationMetadata, name: name3 }), algod)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updateMetadata = { name, version: '2.0', updatable: false, deletable: false }
    const update1 = await updateApp(
      { ...(await getBareCallContractCreateParams(testAccount, updateMetadata)), appIndex: app1.appIndex },
      algod,
    )
    const delete3 = await callApp({ appIndex: app3.appIndex, callType: 'delete', from: testAccount }, algod)
    await waitForIndexer()

    const apps = await getCreatorAppsByName(indexer, testAccount)

    expect(apps.creator).toBe(testAccount.addr)
    expect(Object.keys(apps.apps).sort()).toEqual([name, name2, name3].sort())
    const app1Data = apps.apps[name]
    expect(app1Data.appIndex).toBe(app1.appIndex)
    expect(app1Data.appAddress).toBe(app1.appAddress)
    expect(app1Data.createdRound).toBe(app1.confirmation?.['confirmed-round'])
    expect(app1Data.createdMetadata).toEqual(creationMetadata)
    expect(app1Data.updatedRound).toBe(update1.confirmation?.['confirmed-round'])
    expect(app1Data.name).toBe(updateMetadata.name)
    expect(app1Data.updatable).toBe(updateMetadata.updatable)
    expect(app1Data.deletable).toBe(updateMetadata.deletable)
    expect(app1Data.version).toBe(updateMetadata.version)
    expect(app1Data.deleted).toBe(false)

    const app2Data = apps.apps[name2]
    expect(app2Data.appIndex).toBe(app2.appIndex)
    expect(app2Data.deleted).toBe(false)

    const app3Data = apps.apps[name3]
    expect(app3Data.appIndex).toBe(app3.appIndex)
    expect(app3Data.deleted).toBe(true)
  })

  test('Deploy new app', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const deployment = await getBareCallContractDeployParams({
      from: testAccount,
      metadata: getMetadata(),
    })
    const result = await deployApp(deployment, algod, indexer)

    invariant('transaction' in result)
    invariant(result.confirmation)
    expect(result.appIndex).toBe(result.confirmation['application-index'])
    expect(result.appAddress).toBe(getApplicationAddress(result.appIndex))
    expect(result.createdMetadata).toEqual(deployment.metadata)
    expect(result.createdRound).toBe(result.confirmation['confirmed-round'])
    expect(result.updatedRound).toBe(result.createdRound)
    expect(result.name).toBe(deployment.metadata.name)
    expect(result.version).toBe(deployment.metadata.version)
    expect(result.updatable).toBe(deployment.metadata.updatable)
    expect(result.deletable).toBe(deployment.metadata.deletable)
    expect(result.deleted).toBe(false)
    logging.testLogger.snapshot({
      accounts: [testAccount],
      transactions: [result.transaction],
      apps: [result.appIndex],
    })
  })

  test('Deploy update to updatable app', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ updatable: true })
    const deployment1 = await getBareCallContractDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getBareCallContractDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      value: 2,
      onUpdate: 'update',
    })
    const result2 = await deployApp(deployment2, algod, indexer)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    expect(result2.appIndex).toBe(result1.appIndex)
    expect(result2.createdMetadata).toEqual(deployment1.metadata)
    expect(result2.createdRound).toBe(result1.createdRound)
    expect(result2.updatedRound).toBe(result2.confirmation['confirmed-round'])
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    logging.testLogger.snapshot({
      accounts: [testAccount],
      transactions: [result1.transaction, result2.transaction],
      apps: [result1.appIndex],
    })
  })
})

function getMetadata(overrides?: Partial<AppDeployMetadata>): AppDeployMetadata {
  return {
    name: 'test',
    version: '1.0',
    updatable: false,
    deletable: false,
    ...(overrides ?? {}),
  }
}
