import { describe, test } from '@jest/globals'
import { Account, Algodv2, Indexer } from 'algosdk'
import * as algokit from '..'
import SampleRefTxnAppSpec from '../../tests/example-contracts/sample-reference-transaction/sample-reference-transaction.arc32.json'
import { algorandFixture } from '../testing'
import { AlgoAmount } from './amount'
import { AppSpec } from './app-spec'
import { AppCallMethodCall } from './composer'

describe('app-client-sample-ref-txn', () => {
  const localnet = algorandFixture()
  beforeEach(localnet.beforeEach, 10_000)

  const deploy = async (account: Account, algod: Algodv2, indexer: Indexer) => {
    const client = algokit.getAppClient(
      {
        resolveBy: 'creatorAndName',
        app: SampleRefTxnAppSpec as AppSpec,
        sender: account,
        creatorAddress: account.addr,
        findExistingUsing: indexer,
      },
      algod,
    )
    const app = await client.deploy({
      deployTimeParams: { VALUE: 1 },
    })
    return { client, app }
  }

  describe('call method with txn arg', () => {
    test('should return txn amount', async () => {
      const { algod, algorand, indexer, testAccount } = localnet.context
      const testAccount2 = await localnet.context.generateAccount({ initialFunds: algokit.algo(0) })

      const { app } = await deploy(testAccount, algod, indexer)

      const appClient = algorand.client.getAppClientById({
        appId: BigInt(app.appId),
        appSpec: SampleRefTxnAppSpec as AppSpec,
      })

      const paymentTxn = algorand.createTransaction.payment({
        sender: testAccount.addr,
        receiver: testAccount2.addr,
        amount: AlgoAmount.Algo(3),
      })
      const appCallTxn = await appClient.send.call({
        sender: testAccount.addr,
        method: 'get_pay_txn_amount',
        args: [paymentTxn],
      })

      expect(appCallTxn.return).toBe(3000000n)
    })
  })

  describe('method call arg that has a txn arg', () => {
    test('should return txn amount', async () => {
      const { algod, algorand, indexer, testAccount } = localnet.context
      const testAccount2 = await localnet.context.generateAccount({ initialFunds: algokit.algo(0) })

      const { app } = await deploy(testAccount, algod, indexer)

      const appClient = algorand.client.getAppClientById({
        appId: BigInt(app.appId),
        appSpec: SampleRefTxnAppSpec as AppSpec,
      })

      const paymentTxn = algorand.createTransaction.payment({
        sender: testAccount.addr,
        receiver: testAccount2.addr,
        amount: AlgoAmount.Algo(3),
      })

      const methodCallArg = {
        sender: testAccount.addr,
        appId: BigInt(app.appId),
        method: appClient.getABIMethod('get_pay_txn_amount')!,
        args: [paymentTxn],
      } satisfies AppCallMethodCall

      const appCallTxn = await appClient.send.call({
        sender: testAccount.addr,
        method: 'get_returned_value_of_app_call_txn',
        args: [methodCallArg],
      })

      expect(appCallTxn.return).toBe(3000000n)
    })
  })
})
