import algosdk from 'algosdk'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { getTestingAppContract } from '../tests/example-contracts/testing-app/contract'
import { algoKitLogCaptureFixture, algorandFixture } from './testing'

describe('app', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.newScope, 10_000)

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
      sender: testAccount.addr,
    })

    expect(app.appId).toBeGreaterThan(0)
    expect(app.appAddress).toEqual(algosdk.getApplicationAddress(app.appId))
    expect(app.confirmation).toBeTruthy()
    expect(BigInt(app.confirmation?.applicationIndex ?? 0)).toBe(app.appId)
  })

  test('appCreate with rekey performs rekey', async () => {
    const { algorand, testAccount } = localnet.context
    const rekeyTo = algorand.account.random()
    const contract = await getTestingAppContract()
    await algorand.send.appCreate({
      approvalProgram: contract.approvalProgram.replace('TMPL_UPDATABLE', '0').replace('TMPL_DELETABLE', '0').replace('TMPL_VALUE', '1'),
      clearStateProgram: contract.clearStateProgram,
      schema: contract.stateSchema,
      sender: testAccount.addr,
      rekeyTo: rekeyTo.addr,
    })

    // If the rekey didn't work this will throw
    const rekeyedAccount = algorand.account.rekeyed(testAccount.addr, rekeyTo)
    await algorand.send.payment({
      amount: (0).algo(),
      sender: rekeyedAccount.addr,
      receiver: testAccount.addr,
    })
  })
})
