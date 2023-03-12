import { describe, test } from '@jest/globals'
import { readFile } from 'fs/promises'
import path from 'path'
import { localNetFixture } from '../tests/fixtures/localnet-fixture'
import { AppStorageSchema, callApp, createApp, updateApp } from './app'
import { AppDeployMetadata, APP_DEPLOY_NOTE_PREFIX, getCreatorAppsByName, replaceDeployTimeControlParams } from './deploy-app'
import { SendTransactionFrom } from './transaction'

describe('deploy-app', () => {
  const localnet = localNetFixture()

  const name = 'MY_APP'

  const getAppParams = async (from: SendTransactionFrom, metadata: AppDeployMetadata) => {
    const appSpecFile = await readFile(path.join(__dirname, '..', 'tests', 'example-contracts', 'bare-call', 'application.json'))
    const appSpec = JSON.parse(await appSpecFile.toString('utf-8'))
    return {
      from: from,
      approvalProgram: replaceDeployTimeControlParams(Buffer.from(appSpec.source.approval, 'base64').toString('utf-8'), metadata),
      clearProgram: Buffer.from(appSpec.source.clear, 'base64').toString('utf-8'),
      schema: getStorageSchemaFromAppSpec(appSpec),
      note: `${APP_DEPLOY_NOTE_PREFIX}${JSON.stringify(metadata)}`,
    }
  }

  test('Created app is retrieved by name with deployment metadata', async () => {
    const { client, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await createApp(await getAppParams(testAccount, creationMetadata), client)
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
    const { client, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: true }
    const name2 = 'APP_2'
    const name3 = 'APP_3'
    const app1 = await createApp(await getAppParams(testAccount, creationMetadata), client)
    const app2 = await createApp(await getAppParams(testAccount, { ...creationMetadata, name: name2 }), client)
    const app3 = await createApp(await getAppParams(testAccount, { ...creationMetadata, name: name3 }), client)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updateMetadata = { name, version: '2.0', updatable: false, deletable: false }
    const update1 = await updateApp({ ...(await getAppParams(testAccount, updateMetadata)), appIndex: app1.appIndex }, client)
    const delete3 = await callApp({ appIndex: app3.appIndex, callType: 'delete', from: testAccount }, client)
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
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStorageSchemaFromAppSpec(appSpec: any): AppStorageSchema {
  return {
    globalByteSlices: appSpec.state.global.num_byte_slices,
    globalInts: appSpec.state.global.num_uints,
    localByteSlices: appSpec.state.local.num_byte_slices,
    localInts: appSpec.state.local.num_byte_slices,
  }
}
