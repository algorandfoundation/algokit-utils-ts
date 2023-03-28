import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { getTestingAppContract } from '../tests/example-contracts/testing-app/contract'
import * as algokit from './'
import { algoKitLogCaptureFixture, algorandFixture } from './testing'

describe('app', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const logging = algoKitLogCaptureFixture()
  beforeEach(logging.beforeEach)
  afterEach(logging.afterEach)

  test('createApp creates an app', async () => {
    const { algod, testAccount } = localnet.context
    const contract = await getTestingAppContract()

    const app = await algokit.createApp(
      {
        approvalProgram: contract.approvalProgram.replace('TMPL_UPDATABLE', '0').replace('TMPL_DELETABLE', '0').replace('TMPL_VALUE', '1'),
        clearStateProgram: contract.clearStateProgram,
        schema: contract.stateSchema,
        from: testAccount,
      },
      algod,
    )

    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toBe(algosdk.getApplicationAddress(app.appId))
    expect(app.confirmation).toBeTruthy()
    expect(app.confirmation?.['application-index']).toBe(app.appId)
  })
})
