import { describe, test } from '@jest/globals'
import algosdk from 'algosdk'
import { optIn } from './asset'
import { algorandFixture } from './testing'
import { ensureFundsAndOptIn, generateTestAsset } from './testing/asset'

describe('asset', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  test('OptIn', async () => {
    const { algod, testAccount, kmd } = localnet.context
    const dummyAssetId = await generateTestAsset(algod, testAccount, 100)
    const secondAccount = algosdk.generateAccount()

    const secondAccountInfo = await algod.accountInformation(secondAccount.addr).do()
    expect(secondAccountInfo['total-assets-opted-in']).toBe(0)

    await ensureFundsAndOptIn(algod, secondAccount, dummyAssetId, kmd)
    await optIn(algod, secondAccount, dummyAssetId)

    const testAccountInfoAfterOptIn = await algod.accountInformation(secondAccount.addr).do()
    expect(testAccountInfoAfterOptIn['total-assets-opted-in']).toBe(1)
  })
})
