import algosdk from 'algosdk'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { getTestingAppContract } from '../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from './testing'

describe('app', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope)

  const logging = algoKitLogCaptureFixture()
  beforeEach(logging.beforeEach)
  afterEach(logging.afterEach)
  test('appCreate creates an app', async () => {
    const { algorand, testAccount } = localnet.context
    const contract = await getTestingAppContract()

    const app = await algorand.send.appCreate({
      approvalProgram: contract.approvalProgram.replace('TMPL_UPDATABLE', '0').replace('TMPL_DELETABLE', '0').replace('TMPL_VALUE', '1'),
      clearStateProgram: contract.clearStateProgram,
      schema: contract.stateSchema,
      sender: testAccount,
    })

    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toEqual(algosdk.getApplicationAddress(app.appId))
    expect(app.confirmation).toBeTruthy()
    expect(BigInt(app.confirmation?.applicationIndex ?? 0)).toBe(app.appId)
  })

  /** Creates an updatable instance of the testing app and returns it along with the programs and schema it was created with. */
  const createUpdatableApp = async () => {
    const { algorand, testAccount } = localnet.context
    const contract = await getTestingAppContract()
    const programs = {
      approvalProgram: contract.approvalProgram.replace('TMPL_UPDATABLE', '1').replace('TMPL_DELETABLE', '0').replace('TMPL_VALUE', '1'),
      clearStateProgram: contract.clearStateProgram,
    }

    const app = await algorand.send.appCreate({ ...programs, schema: contract.stateSchema, sender: testAccount })

    return { appId: app.appId, programs, schema: contract.stateSchema }
  }

  test('appUpdate expands the global state schema', async () => {
    const { algorand, testAccount } = localnet.context
    const { appId, programs, schema } = await createUpdatableApp()

    await algorand.send.appUpdate({
      appId,
      ...programs,
      appSize: {
        globalInts: schema.globalInts + 2,
        globalByteSlices: schema.globalByteSlices + 1,
        extraProgramPages: 0,
      },
      sender: testAccount,
    })

    const updated = await algorand.app.getById(appId)
    expect(updated.globalInts).toBe(schema.globalInts + 2)
    expect(updated.globalByteSlices).toBe(schema.globalByteSlices + 1)
    // The local state schema is immutable once an app is created
    expect(updated.localInts).toBe(schema.localInts)
    expect(updated.localByteSlices).toBe(schema.localByteSlices)
  })

  test('appUpdate adds extra program pages', async () => {
    const { algorand, testAccount } = localnet.context
    const { appId, programs, schema } = await createUpdatableApp()

    await algorand.send.appUpdate({
      appId,
      ...programs,
      appSize: { globalInts: schema.globalInts, globalByteSlices: schema.globalByteSlices, extraProgramPages: 1 },
      sender: testAccount,
    })

    const updated = await algorand.app.getById(appId)
    expect(updated.extraProgramPages).toBe(1)
    expect(updated.globalInts).toBe(schema.globalInts)
    expect(updated.globalByteSlices).toBe(schema.globalByteSlices)
  })

  test('appUpdate without an app size keeps the existing app size', async () => {
    const { algorand, testAccount } = localnet.context
    const { appId, programs, schema } = await createUpdatableApp()

    await algorand.send.appUpdate({ appId, ...programs, sender: testAccount })

    const updated = await algorand.app.getById(appId)
    expect(updated.globalInts).toBe(schema.globalInts)
    expect(updated.globalByteSlices).toBe(schema.globalByteSlices)
    expect(updated.extraProgramPages).toBe(0)
  })

  test('appCreate with rekey performs rekey', async () => {
    const { algorand, testAccount } = localnet.context
    const rekeyTo = algorand.account.random()
    const contract = await getTestingAppContract()
    await algorand.send.appCreate({
      approvalProgram: contract.approvalProgram.replace('TMPL_UPDATABLE', '0').replace('TMPL_DELETABLE', '0').replace('TMPL_VALUE', '1'),
      clearStateProgram: contract.clearStateProgram,
      schema: contract.stateSchema,
      sender: testAccount,
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
})
