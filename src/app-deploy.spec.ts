import { describe, test } from '@jest/globals'
import { getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import * as algokit from '.'
import { getTestingAppCreateParams, getTestingAppDeployParams } from '../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from './testing'
import { AppDeployMetadata } from './types/app'

describe('deploy-app', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const logging = algoKitLogCaptureFixture()
  beforeEach(logging.beforeEach)
  afterEach(logging.afterEach)

  const name = 'MY_APP'

  test('Created app is retrieved by name with deployment metadata', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await algokit.createApp(await getTestingAppCreateParams(testAccount, creationMetadata), algod)
    await waitForIndexer()

    const apps = await algokit.getCreatorAppsByName(testAccount, indexer)

    expect(apps.creator).toBe(testAccount.addr)
    expect(Object.keys(apps.apps)).toEqual([name])
    const app = apps.apps[name]
    expect(app.appId).toBe(app1.appId)
    expect(app.appAddress).toBe(app1.appAddress)
    expect(app.createdRound).toBe(app1.confirmation?.confirmedRound)
    expect(app.createdMetadata).toEqual(creationMetadata)
    expect(app.updatedRound).toBe(app.createdRound)
    expect(app.name).toBe(creationMetadata.name)
    expect(app.updatable).toBe(creationMetadata.updatable)
    expect(app.deletable).toBe(creationMetadata.deletable)
    expect(app.version).toBe(creationMetadata.version)
  })

  test('Latest created app is retrieved', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await algokit.createApp(await getTestingAppCreateParams(testAccount, creationMetadata), algod)
    const app2 = await algokit.createApp(await getTestingAppCreateParams(testAccount, creationMetadata), algod)
    const app3 = await algokit.createApp(await getTestingAppCreateParams(testAccount, creationMetadata), algod)
    await waitForIndexer()

    const apps = await algokit.getCreatorAppsByName(testAccount, indexer)

    expect(apps.apps[name].appId).not.toBe(app1.appId)
    expect(apps.apps[name].appId).not.toBe(app2.appId)
    expect(apps.apps[name].appId).toBe(app3.appId)
  })

  test('Created, updated and deleted apps are retrieved by name with deployment metadata', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: true }
    const name2 = 'APP_2'
    const name3 = 'APP_3'
    const app1 = await algokit.createApp(await getTestingAppCreateParams(testAccount, creationMetadata), algod)
    const app2 = await algokit.createApp(await getTestingAppCreateParams(testAccount, { ...creationMetadata, name: name2 }), algod)
    const app3 = await algokit.createApp(await getTestingAppCreateParams(testAccount, { ...creationMetadata, name: name3 }), algod)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updateMetadata = { name, version: '2.0', updatable: false, deletable: false }
    const update1 = await algokit.updateApp({ ...(await getTestingAppCreateParams(testAccount, updateMetadata)), appId: app1.appId }, algod)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const delete3 = await algokit.callApp({ appId: app3.appId, callType: 'delete_application', from: testAccount }, algod)
    await waitForIndexer()

    const apps = await algokit.getCreatorAppsByName(testAccount, indexer)

    expect(apps.creator).toBe(testAccount.addr)
    expect(Object.keys(apps.apps).sort()).toEqual([name, name2, name3].sort())
    const app1Data = apps.apps[name]
    expect(app1Data.appId).toBe(app1.appId)
    expect(app1Data.appAddress).toBe(app1.appAddress)
    expect(app1Data.createdRound).toBe(app1.confirmation?.confirmedRound)
    expect(app1Data.createdMetadata).toEqual(creationMetadata)
    expect(app1Data.updatedRound).toBe(update1.confirmation?.confirmedRound)
    expect(app1Data.name).toBe(updateMetadata.name)
    expect(app1Data.updatable).toBe(updateMetadata.updatable)
    expect(app1Data.deletable).toBe(updateMetadata.deletable)
    expect(app1Data.version).toBe(updateMetadata.version)
    expect(app1Data.deleted).toBe(false)

    const app2Data = apps.apps[name2]
    expect(app2Data.appId).toBe(app2.appId)
    expect(app2Data.deleted).toBe(false)

    const app3Data = apps.apps[name3]
    expect(app3Data.appId).toBe(app3.appId)
    expect(app3Data.deleted).toBe(true)
  })

  test('Deploy new app', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      from: testAccount,
      metadata: getMetadata(),
    })
    const result = await algokit.deployApp(deployment, algod, indexer)

    invariant('transaction' in result)
    invariant(result.confirmation)
    expect(result.appId).toBe(result.confirmation.applicationIndex)
    expect(result.appAddress).toBe(getApplicationAddress(result.appId))
    expect(result.createdMetadata).toEqual(deployment.metadata)
    expect(result.createdRound).toBe(result.confirmation.confirmedRound)
    expect(result.updatedRound).toBe(result.createdRound)
    expect(result.name).toBe(deployment.metadata.name)
    expect(result.version).toBe(deployment.metadata.version)
    expect(result.updatable).toBe(deployment.metadata.updatable)
    expect(result.deletable).toBe(deployment.metadata.deletable)
    expect(result.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result.transaction],
        apps: [result.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Fail to deploy immutable app without TMPL_UPDATABLE', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      from: testAccount,
      metadata: getMetadata({ updatable: true }),
    })
    deployment.approvalProgram = deployment.approvalProgram.replace(/TMPL_UPDATABLE/g, '0')
    await expect(async () => await algokit.deployApp(deployment, algod, indexer)).rejects.toThrowError(
      'Deploy-time updatability control requested for app deployment, but TMPL_UPDATABLE not present in TEAL code',
    )
  })

  test('Fail to deploy permanent app without TMPL_DELETABLE', async () => {
    const { algod, indexer, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      from: testAccount,
      metadata: getMetadata({ deletable: true }),
    })
    deployment.approvalProgram = deployment.approvalProgram.replace(/TMPL_DELETABLE/g, '0')
    await expect(async () => await algokit.deployApp(deployment, algod, indexer)).rejects.toThrowError(
      'Deploy-time deletability control requested for app deployment, but TMPL_DELETABLE not present in TEAL code',
    )
  })

  test('Deploy update to updatable updated app', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ updatable: true })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'update',
    })
    const result2 = await algokit.deployApp(deployment2, algod, indexer)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    expect(result2.appId).toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment1.metadata)
    expect(result2.createdRound).toBe(result1.createdRound)
    expect(result2.updatedRound).toBe(result2.confirmation.confirmedRound)
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction, result2.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy update to immutable updated app fails', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ updatable: false })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'update',
    })
    await expect(() => algokit.deployApp(deployment2, algod, indexer)).rejects.toThrow(/logic eval error: assert failed/)

    invariant('transaction' in result1)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy failure for updated app fails if onupdate = Fail', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
      codeInjectionValue: 2,
      onUpdate: 'fail',
    })
    await expect(() => algokit.deployApp(deployment2, algod, indexer)).rejects.toThrow(
      'Update detected and onUpdate=Fail, stopping deployment. ' +
        'If you want to try deleting and recreating the app then ' +
        're-run with onUpdate=UpdateApp',
    )

    invariant('transaction' in result1)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy replacement to deletable, updated app', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: true })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'replace',
    })
    const result2 = await algokit.deployApp(deployment2, algod, indexer)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    invariant(result2.operationPerformed === 'replace')
    invariant(result2.deleteResult)
    expect(result2.appId).not.toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment2.metadata)
    expect(result2.createdRound).toBe(result2.confirmation.confirmedRound)
    expect(result2.updatedRound).toBe(result2.confirmation.confirmedRound)
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction, result2.transaction, result2.deleteResult.transaction],
        apps: [result1.appId, result2.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy failure for replacement of permanent, updated app', async () => {
    algokit.Config.configure({ debug: false }) // Remove noise from snapshot
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: false })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'replace',
    })

    await expect(() => algokit.deployApp(deployment2, algod, indexer)).rejects.toThrow(/logic eval error: assert failed/)

    invariant('transaction' in result1)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy replacement of deletable schema broken app', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: true })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      breakSchema: true,
      onSchemaBreak: 'replace',
    })
    const result2 = await algokit.deployApp(deployment2, algod, indexer)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    invariant(result2.operationPerformed === 'replace')
    invariant(result2.deleteResult)
    expect(result2.appId).not.toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment2.metadata)
    expect(result2.createdRound).toBe(result2.createdRound)
    expect(result2.updatedRound).toBe(result2.createdRound)
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction, result2.transaction, result2.deleteResult.transaction],
        apps: [result1.appId, result2.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy replacement to schema broken, permanent app fails', async () => {
    algokit.Config.configure({ debug: false }) // Remove noise from snapshot
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: false })
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: { ...metadata, version: '2.0' },
      breakSchema: true,
      onSchemaBreak: 'replace',
    })
    await expect(() => algokit.deployApp(deployment2, algod, indexer)).rejects.toThrow(/logic eval error: assert failed/)

    invariant('transaction' in result1)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy failure for replacement of schema broken app fails if onSchemaBreak = Fail', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
    })
    const result1 = await algokit.deployApp(deployment1, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      from: testAccount,
      metadata: metadata,
      onSchemaBreak: 'fail',
      breakSchema: true,
    })
    await expect(() => algokit.deployApp(deployment2, algod, indexer)).rejects.toThrow(
      'Schema break detected and onSchemaBreak=OnSchemaBreak.Fail, stopping deployment. ' +
        'If you want to try deleting and recreating the app then ' +
        're-run with onSchemaBreak=OnSchemaBreak.ReplaceApp',
    )

    invariant('transaction' in result1)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction],
        apps: [result1.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Do nothing if deploying app with no changes', async () => {
    const { algod, indexer, testAccount, waitForIndexer } = localnet.context
    const deployment = await getTestingAppDeployParams({
      from: testAccount,
      metadata: getMetadata(),
    })
    const initialDeployment = await algokit.deployApp(deployment, algod, indexer)
    await waitForIndexer()
    logging.testLogger.clear()

    const result = await algokit.deployApp(deployment, algod, indexer)

    invariant('transaction' in initialDeployment)
    invariant(!('transaction' in result))
    expect(result.appId).toBe(initialDeployment.appId)
    expect(result.appAddress).toBe(getApplicationAddress(initialDeployment.appId))
    expect(result.createdMetadata).toEqual(deployment.metadata)
    expect(result.createdRound).toBe(initialDeployment.createdRound)
    expect(result.updatedRound).toBe(initialDeployment.createdRound)
    expect(result.name).toBe(deployment.metadata.name)
    expect(result.version).toBe(deployment.metadata.version)
    expect(result.updatable).toBe(deployment.metadata.updatable)
    expect(result.deletable).toBe(deployment.metadata.deletable)
    expect(result.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [initialDeployment.transaction],
        apps: [result.appId],
      }),
    ).toMatchSnapshot()
  })
})

test('Strip comments remove comments without removing commands', async () => {
  const tealCode =
    '//comment\nop arg //comment\nop "arg" //comment\nop "//" //comment\nop "  //comment  " //comment\nop "" //" //comment\nop "" //comment\n//\nop 123\nop 123 // something\nop "" // more comments\nop "//" //op "//"\nop "//"'
  const tealCodeResult = '\nop arg\nop "arg"\nop "//"\nop "  //comment  "\nop "" //"\nop ""\n\nop 123\nop 123\nop ""\nop "//"\nop "//"'

  const result = algokit.stripTealComments(tealCode)

  expect(result).toBe(tealCodeResult)
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
