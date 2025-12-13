import { getApplicationAddress } from 'algosdk'
import invariant from 'tiny-invariant'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { getTestingAppCreateParams, getTestingAppDeployParams } from '../tests/example-contracts/testing-app/contract'
import { Config } from './config'
import { algoKitLogCaptureFixture, algorandFixture } from './testing'
import { AppDeployMetadata } from './types/app'
import { AppDeployParams } from './types/app-deployer'
import { AppManager } from './types/app-manager'
import { LogicError } from './types/logic-error'

describe('deploy-app', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope)

  const logging = algoKitLogCaptureFixture()
  beforeEach(logging.beforeEach)
  afterEach(logging.afterEach)

  const name = 'MY_APP'

  test('Created app is retrieved by name with deployment metadata', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await algorand.send.appCreate(await getTestingAppCreateParams(testAccount, creationMetadata))
    await waitForIndexer()

    const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount)

    expect(apps.creator).toBe(testAccount)
    expect(Object.keys(apps.apps)).toEqual([name])
    const app = apps.apps[name]
    expect(app.appId).toBe(app1.appId)
    expect(app.appAddress).toEqual(app1.appAddress)
    expect(app.createdRound).toBe(BigInt(app1.confirmation.confirmedRound!))
    expect(app.createdMetadata).toEqual(creationMetadata)
    expect(app.updatedRound).toBe(app.createdRound)
    expect(app.name).toBe(creationMetadata.name)
    expect(app.updatable).toBe(creationMetadata.updatable)
    expect(app.deletable).toBe(creationMetadata.deletable)
    expect(app.version).toBe(creationMetadata.version)
  })

  test('Latest created app is retrieved', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const creationMetadata = { name, version: '1.0', updatable: true, deletable: false }
    const app1 = await algorand.send.appCreate({ ...(await getTestingAppCreateParams(testAccount, creationMetadata)), lease: '1' })
    const app2 = await algorand.send.appCreate({ ...(await getTestingAppCreateParams(testAccount, creationMetadata)), lease: '2' })
    const app3 = await algorand.send.appCreate({ ...(await getTestingAppCreateParams(testAccount, creationMetadata)), lease: '3' })
    await waitForIndexer()

    const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount)

    expect(apps.apps[name].appId).not.toBe(app1.appId)
    expect(apps.apps[name].appId).not.toBe(app2.appId)
    expect(apps.apps[name].appId).toBe(app3.appId)
  })

  test('Created, updated and deleted apps are retrieved by name with deployment metadata', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context

    const creationMetadata = { name, version: '1.0', updatable: true, deletable: true }
    const name2 = 'APP_2'
    const name3 = 'APP_3'
    const app1 = await algorand.send.appCreate(await getTestingAppCreateParams(testAccount, creationMetadata))
    const app2 = await algorand.send.appCreate(await getTestingAppCreateParams(testAccount, { ...creationMetadata, name: name2 }))
    const app3 = await algorand.send.appCreate(await getTestingAppCreateParams(testAccount, { ...creationMetadata, name: name3 }))

    const updateMetadata = { name, version: '2.0', updatable: false, deletable: false }
    const update1 = await algorand.send.appUpdate({ ...(await getTestingAppCreateParams(testAccount, updateMetadata)), appId: app1.appId })
    const _delete3 = await algorand.send.appDelete({ appId: app3.appId, sender: testAccount })
    await waitForIndexer()

    const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount)

    expect(apps.creator).toBe(testAccount)
    expect(Object.keys(apps.apps).sort()).toEqual([name, name2, name3].sort())
    const app1Data = apps.apps[name]
    expect(app1Data.appId).toBe(app1.appId)
    expect(app1Data.appAddress).toEqual(app1.appAddress)
    expect(app1Data.createdRound).toBe(BigInt(app1.confirmation.confirmedRound!))
    expect(app1Data.createdMetadata).toEqual(creationMetadata)
    expect(app1Data.updatedRound).toBe(BigInt(update1.confirmation.confirmedRound!))
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
    const { algorand, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: getMetadata(),
    })
    const result = await algorand.appDeployer.deploy(deployment)

    invariant('transaction' in result)
    invariant(result.confirmation)
    expect(result.appId).toBe(BigInt(result.confirmation.applicationIndex!))
    expect(result.appAddress).toEqual(getApplicationAddress(result.appId))
    expect(result.createdMetadata).toEqual(deployment.metadata)
    expect(result.createdRound).toBe(BigInt(result.confirmation.confirmedRound!))
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
    const { algorand, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: getMetadata({ updatable: true }),
    })
    deployment.createParams.approvalProgram = deployment.createParams.approvalProgram.replace(/TMPL_UPDATABLE/g, '0')
    await expect(async () => await algorand.appDeployer.deploy(deployment)).rejects.toThrowError(
      'Deploy-time updatability control requested for app deployment, but TMPL_UPDATABLE not present in TEAL code',
    )
  })

  test('Fail to deploy permanent app without TMPL_DELETABLE', async () => {
    const { algorand, testAccount } = localnet.context
    const deployment = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: getMetadata({ deletable: true }),
    })
    deployment.createParams.approvalProgram = deployment.createParams.approvalProgram.replace(/TMPL_DELETABLE/g, '0')
    await expect(async () => await algorand.appDeployer.deploy(deployment)).rejects.toThrowError(
      'Deploy-time deletability control requested for app deployment, but TMPL_DELETABLE not present in TEAL code',
    )
  })

  test('Deploy update to updatable updated app', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ updatable: true })
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'update',
    })
    const result2 = await algorand.appDeployer.deploy(deployment2)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    expect(result2.appId).toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment1.metadata)
    expect(result2.createdRound).toBe(result1.createdRound)
    expect(result2.updatedRound).toBe(BigInt(result2.confirmation.confirmedRound!))
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
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ updatable: false })
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'update',
    })

    try {
      await algorand.appDeployer.deploy(deployment2)
      invariant(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.message).toMatch(/logic eval error: assert failed/)
      const logicError = LogicError.parseLogicError(e)
      invariant('transaction' in result1)
      expect(
        logging.testLogger.getLogSnapshot({
          accounts: [testAccount],
          transactions: [result1.transaction, logicError!.txId],
          apps: [result1.appId],
        }),
      ).toMatchSnapshot()
    }
  })

  test('Deploy failure for updated app fails if onupdate = Fail', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
      codeInjectionValue: 2,
      onUpdate: 'fail',
    })
    await expect(() => algorand.appDeployer.deploy(deployment2)).rejects.toThrow(
      'Update detected and onUpdate=Fail, stopping deployment. Try a different onUpdate value to not fail.',
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
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: true })
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'replace',
    })
    const result2 = await algorand.appDeployer.deploy(deployment2)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    invariant(result2.operationPerformed === 'replace')
    invariant(result2.deleteResult)
    expect(result2.appId).not.toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment2.metadata)
    expect(result2.createdRound).toBe(BigInt(result2.confirmation.confirmedRound!))
    expect(result2.updatedRound).toBe(BigInt(result2.confirmation.confirmedRound!))
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
        filterPredicate: filterVerboseAndDebugLogs,
      }),
    ).toMatchSnapshot()
  })

  test('Deploy failure for replacement of permanent, updated app', async () => {
    Config.configure({ debug: false }) // Remove noise from snapshot
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: false })
    const deployment1 = (await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })) as AppDeployParams

    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = (await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 2,
      onUpdate: 'replace',
    })) as AppDeployParams

    try {
      await algorand.appDeployer.deploy(deployment2)
      invariant(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.message).toMatch(/logic eval error: assert failed/)
      const logicError = LogicError.parseLogicError(e)
      invariant('transaction' in result1)
      expect(
        logging.testLogger.getLogSnapshot({
          accounts: [testAccount],
          transactions: [result1.transaction, logicError!.txId],
          apps: [result1.appId],
          filterPredicate: filterVerboseAndDebugLogs,
        }),
      ).toMatchSnapshot()
    }
  })

  test('Deploy replacement of deletable schema broken app', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: true })
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      breakSchema: true,
      onSchemaBreak: 'replace',
    })
    const result2 = await algorand.appDeployer.deploy(deployment2)

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
        filterPredicate: filterVerboseAndDebugLogs,
      }),
    ).toMatchSnapshot()
  })

  test('Deploy replacement to schema broken, permanent app fails', async () => {
    Config.configure({ debug: false }) // Remove noise from snapshot
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata({ deletable: false })
    const deployment1 = (await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })) as AppDeployParams

    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = (await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      breakSchema: true,
      onSchemaBreak: 'replace',
    })) as AppDeployParams

    try {
      await algorand.appDeployer.deploy(deployment2)
      invariant(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.message).toMatch(/logic eval error: assert failed/)
      const logicError = LogicError.parseLogicError(e)
      invariant('transaction' in result1)
      expect(
        logging.testLogger.getLogSnapshot({
          accounts: [testAccount],
          transactions: [result1.transaction, logicError!.txId],
          apps: [result1.appId],
          filterPredicate: filterVerboseAndDebugLogs,
        }),
      ).toMatchSnapshot()
    }
  })

  test('Deploy failure for replacement of schema broken app fails if onSchemaBreak = Fail', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
      onSchemaBreak: 'fail',
      breakSchema: true,
    })
    await expect(() => algorand.appDeployer.deploy(deployment2)).rejects.toThrow(
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
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const deployment = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: getMetadata(),
    })
    const initialDeployment = await algorand.appDeployer.deploy(deployment)
    await waitForIndexer()
    logging.testLogger.clear()

    const result = await algorand.appDeployer.deploy(deployment)

    invariant('transaction' in initialDeployment)
    invariant(!('transaction' in result))
    expect(result.appId).toBe(initialDeployment.appId)
    expect(result.appAddress).toEqual(getApplicationAddress(initialDeployment.appId))
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

  test('Deploy append for schema broken app if onSchemaBreak = AppendApp', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
      onSchemaBreak: 'append',
      breakSchema: true,
    })
    const result2 = await algorand.appDeployer.deploy(deployment2)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    invariant(result2.operationPerformed === 'create')
    expect(result2.appId).not.toBe(result1.appId)
    expect(result2.createdMetadata).toEqual(deployment1.metadata)
    expect(result2.createdRound).not.toBe(result1.createdRound)
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction, result2.transaction],
        apps: [result1.appId, result2.appId],
      }),
    ).toMatchSnapshot()
  })

  test('Deploy append for update app if onUpdate = AppendApp', async () => {
    const { algorand, testAccount, waitForIndexer } = localnet.context
    const metadata = getMetadata()
    const deployment1 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: metadata,
    })
    const result1 = await algorand.appDeployer.deploy(deployment1)
    await waitForIndexer()
    logging.testLogger.clear()

    const deployment2 = await getTestingAppDeployParams({
      sender: testAccount,
      metadata: { ...metadata, version: '2.0' },
      codeInjectionValue: 3,
      onUpdate: 'append',
    })
    const result2 = await algorand.appDeployer.deploy(deployment2)

    invariant('transaction' in result1)
    invariant('transaction' in result2)
    invariant(result2.confirmation)
    invariant(result2.operationPerformed === 'create')
    expect(result2.appId).not.toBe(result1.appId)
    expect(result2.createdMetadata).not.toEqual(deployment1.metadata)
    expect(result2.createdRound).not.toBe(result1.createdRound)
    expect(result2.name).toBe(deployment2.metadata.name)
    expect(result2.version).toBe(deployment2.metadata.version)
    expect(result2.updatable).toBe(deployment2.metadata.updatable)
    expect(result2.deletable).toBe(deployment2.metadata.deletable)
    expect(result2.deleted).toBe(false)
    expect(
      logging.testLogger.getLogSnapshot({
        accounts: [testAccount],
        transactions: [result1.transaction, result2.transaction],
        apps: [result1.appId, result2.appId],
      }),
    ).toMatchSnapshot()
  })

  const filterVerboseAndDebugLogs = (log: string) => !log.startsWith('VERBOSE:') && !log.startsWith('DEBUG:')
})

test('Strip comments remove comments without removing commands', async () => {
  const tealCode = `//comment
op arg //comment
op "arg" //comment
op "//" //comment
op "  //comment  " //comment
op "\\" //" //comment
op ""     //comment
//
op 123
op 123 // something
op "" // more comments
op "//" //op "//"
op "//"

pushbytes base64(//8=)
pushbytes b64(//8=)
pushbytes base64(//8=)  // pushbytes base64(//8=)
pushbytes b64(//8=)     // pushbytes b64(//8=)
pushbytes "base64(//8=)"  // pushbytes "base64(//8=)"
pushbytes "b64(//8=)"     // pushbytes "b64(//8=)"
pushbytes base64 //8=
pushbytes b64 //8=
pushbytes base64 //8=  // pushbytes base64 //8=
pushbytes b64 //8=     // pushbytes b64 //8=
pushbytes "base64 //8="  // pushbytes "base64 //8="
pushbytes "b64 //8="     // pushbytes "b64 //8="
`
  const tealCodeResult = `
op arg
op "arg"
op "//"
op "  //comment  "
op "\\" //"
op ""

op 123
op 123
op ""
op "//"
op "//"

pushbytes base64(//8=)
pushbytes b64(//8=)
pushbytes base64(//8=)
pushbytes b64(//8=)
pushbytes "base64(//8=)"
pushbytes "b64(//8=)"
pushbytes base64 //8=
pushbytes b64 //8=
pushbytes base64 //8=
pushbytes b64 //8=
pushbytes "base64 //8="
pushbytes "b64 //8="
`

  const result = AppManager.stripTealComments(tealCode)

  expect(result).toBe(tealCodeResult)
})

test('Can substitute template variable with multiple underscores', async () => {
  const testTeal = `
  int TMPL_SOME_VALUE
  return
  `
  const testParams = {
    SOME_VALUE: 123,
  }
  const substituted = AppManager.replaceTealTemplateParams(testTeal, testParams)
  expect(substituted).toBe(`
  int 123
  return
  `)
})

test('Can substitue both bytes and int uint64', async () => {
  const testTeal = `
  int TMPL_SOME_VALUE
  pushint TMPL_SOME_VALUE
  bytes TMPL_SOME_VALUE
  pushbytes TMPL_SOME_VALUE
  return
  `
  const testParams = {
    SOME_VALUE: 123,
  }
  const substituted = AppManager.replaceTealTemplateParams(testTeal, testParams)
  expect(substituted).toBe(`
  int 123
  pushint 123
  bytes 0x000000000000007b
  pushbytes 0x000000000000007b
  return
  `)
})

test('Does not substitute template variables in comments or when quoted', async () => {
  const testTeal = `
test TMPL_INT // TMPL_INT
test TMPL_INT
no change
test TMPL_STR // TMPL_STR
TMPL_STR
TMPL_STR // TMPL_INT
TMPL_STR // foo //
TMPL_STR // bar
test "TMPL_STR" // not replaced
test "TMPL_STRING" // not replaced
test TMPL_STRING // not replaced
test TMPL_STRI // not replaced
test TMPL_STR TMPL_INT TMPL_INT TMPL_STR // TMPL_STR TMPL_INT TMPL_INT TMPL_STR
test TMPL_INT TMPL_STR TMPL_STRING "TMPL_INT TMPL_STR TMPL_STRING" //TMPL_INT TMPL_STR TMPL_STRING
test TMPL_INT TMPL_INT TMPL_STRING TMPL_STRING TMPL_STRING TMPL_INT TMPL_STRING //keep
TMPL_STR TMPL_STR TMPL_STR
TMPL_STRING
test NOTTMPL_STR // not replaced
NOTTMPL_STR // not replaced
TMPL_STR // replaced
  `
  const testParams = {
    INT: 123,
    STR: 'ABC',
  }
  const substituted = AppManager.replaceTealTemplateParams(testTeal, testParams)
  expect(substituted).toBe(`
test 123 // TMPL_INT
test 123
no change
test 0x414243 // TMPL_STR
0x414243
0x414243 // TMPL_INT
0x414243 // foo //
0x414243 // bar
test "TMPL_STR" // not replaced
test "TMPL_STRING" // not replaced
test TMPL_STRING // not replaced
test TMPL_STRI // not replaced
test 0x414243 123 123 0x414243 // TMPL_STR TMPL_INT TMPL_INT TMPL_STR
test 123 0x414243 TMPL_STRING "TMPL_INT TMPL_STR TMPL_STRING" //TMPL_INT TMPL_STR TMPL_STRING
test 123 123 TMPL_STRING TMPL_STRING TMPL_STRING 123 TMPL_STRING //keep
0x414243 0x414243 0x414243
TMPL_STRING
test NOTTMPL_STR // not replaced
NOTTMPL_STR // not replaced
0x414243 // replaced
  `)
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
