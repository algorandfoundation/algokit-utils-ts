/* eslint-disable no-console -- examples print their results to demonstrate output */
/**
 * Demonstrates the application layer — app factories, app clients, idempotent
 * deployment, state access, and logic-error handling.
 *
 * This maps to the Concepts -> Applications docs page. Two app specs are used:
 *   - examples/artifacts/HelloWorld.arc56.json (factory creation and deployment)
 *   - examples/artifacts/State.arc56.json (ABI methods, global/local/box state,
 *     and deploy-time template variables)
 *
 * The app-spec paths are relative to the repo ROOT, so run this from the repo root.
 *
 * Prerequisites: a running LocalNet (`algokit localnet start`).
 * Run with: tsx --tsconfig examples/tsconfig.json examples/concepts/applications.algo.ts
 */

import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'
import { readFileSync } from 'fs'
import { setupLocalNetEnvironment } from './_helpers.algo'

// Minimal approve-everything TEAL pair for the raw-layer create call.
const APPROVAL_TEAL = '#pragma version 12\nint 1'
const CLEAR_STATE_TEAL = '#pragma version 12\nint 1'

async function deployHelloWorld(algorand: AlgorandClient, deployer: TransactionSignerAccount) {
  // example: GET_APP_FACTORY
  const appSpec = readFileSync('examples/artifacts/HelloWorld.arc56.json', 'utf-8')
  const factory = algorand.client.getAppFactory({ appSpec, defaultSender: deployer.addr })
  // example: GET_APP_FACTORY

  // example: DEPLOY_APP
  const { appClient, result: deployResult } = await factory.deploy({})
  console.log(`${deployResult.operationPerformed}: app ${appClient.appId} at ${appClient.appAddress}`)
  // example: DEPLOY_APP

  // example: FUND_APP_ACCOUNT
  await appClient.send.fundAppAccount({ amount: algo(1) })
  // example: FUND_APP_ACCOUNT

  // example: FUND_APP_ACCOUNT_ON_CREATE
  // Fund the app account only when the deployment created a fresh app instance
  if (deployResult.operationPerformed === 'create' || deployResult.operationPerformed === 'replace') {
    await appClient.send.fundAppAccount({ amount: algo(1) })
  }
  // example: FUND_APP_ACCOUNT_ON_CREATE

  if (deployResult.operationPerformed !== 'create') throw new Error('Expected app to be created')
}

async function templateVariablesAndRedeploy(algorand: AlgorandClient, deployer: TransactionSignerAccount): Promise<AppClient> {
  // example: TEMPLATE_VARIABLES
  const appSpec = readFileSync('examples/artifacts/State.arc56.json', 'utf-8')
  const factory = algorand.client.getAppFactory({ appSpec, defaultSender: deployer.addr })
  const { appClient, result: deployResult } = await factory.deploy({
    deployTimeParams: { VALUE: 1 },
    updatable: true,
    deletable: true,
  })
  // example: TEMPLATE_VARIABLES
  if (deployResult.operationPerformed !== 'create') throw new Error('Expected app to be created')

  // example: REDEPLOY_APP
  // Deploying unchanged code performs no transactions
  const { result: redeployResult } = await factory.deploy({
    deployTimeParams: { VALUE: 1 },
    updatable: true,
    deletable: true,
  })
  console.log(redeployResult.operationPerformed) // nothing

  // A change in the compiled program becomes an in-place update;
  // a schema break would deploy a fresh app rather than fail
  const { result: updateResult } = await factory.deploy({
    onUpdate: OnUpdate.UpdateApp,
    onSchemaBreak: OnSchemaBreak.AppendApp,
    deployTimeParams: { VALUE: 2 },
    updatable: true,
    deletable: true,
  })
  console.log(updateResult.operationPerformed) // update
  // example: REDEPLOY_APP
  if (redeployResult.operationPerformed !== 'nothing') throw new Error('Expected no operation on identical redeploy')
  if (updateResult.operationPerformed !== 'update') throw new Error('Expected app to be updated')

  // example: GET_APP_CLIENT
  const sameAppClient = algorand.client.getAppClientById({
    appSpec,
    appId: appClient.appId,
    defaultSender: deployer.addr,
  })
  // example: GET_APP_CLIENT
  if (sameAppClient.appId !== appClient.appId) throw new Error('Expected same app id')

  return appClient
}

async function methodCalls(algorand: AlgorandClient, appClient: AppClient, deployer: TransactionSignerAccount) {
  // example: CALL_APP_METHOD
  const callResult = await appClient.send.call({ method: 'call_abi', args: ['from the docs'] })
  console.log(callResult.return) // Hello, from the docs
  // example: CALL_APP_METHOD
  if (callResult.return !== 'Hello, from the docs') throw new Error('Unexpected ABI return')

  // example: DEFAULT_ARGUMENTS
  const defaultResult = await appClient.send.call({ method: 'default_value', args: [undefined] })
  // example: DEFAULT_ARGUMENTS
  if (defaultResult.return !== 'default value') throw new Error('Unexpected default ABI return')

  // example: CALL_APP_METHOD_WITH_TXN_ARG
  const payment = await algorand.createTransaction.payment({
    sender: deployer.addr,
    receiver: appClient.appAddress,
    amount: algo(1),
  })
  const txnArgResult = await appClient.send.call({ method: 'call_abi_txn', args: [payment, 'with payment'] })
  console.log(txnArgResult.return) // Sent 1000000. with payment
  // example: CALL_APP_METHOD_WITH_TXN_ARG
  if (txnArgResult.return !== 'Sent 1000000. with payment') throw new Error('Unexpected txn-arg ABI return')
}

async function stateAndErrors(appClient: AppClient, deployer: TransactionSignerAccount) {
  // example: READ_GLOBAL_STATE
  // set_global stores its arguments in the global state keys int1, int2, bytes1, bytes2
  await appClient.send.call({ method: 'set_global', args: [10, 20, 'text', new Uint8Array([49, 50, 51, 52])] })
  const int1 = await appClient.state.global.getValue('int1') // 10
  const allGlobalState = await appClient.state.global.getAll()
  // example: READ_GLOBAL_STATE
  if (int1 !== 10n) throw new Error('Unexpected global int1')
  if (allGlobalState['int2'] !== 20n) throw new Error('Unexpected global int2')

  // example: READ_LOCAL_STATE
  // set_local stores its arguments in the caller's local state keys local_int1, local_int2, ...
  await appClient.send.optIn({ method: 'opt_in' })
  await appClient.send.call({ method: 'set_local', args: [1, 2, 'text', new Uint8Array([49, 50, 51, 52])] })
  const localInt1 = await appClient.state.local(deployer.addr).getValue('local_int1') // 1
  // example: READ_LOCAL_STATE
  if (localInt1 !== 1n) throw new Error('Unexpected local int1')

  // Box storage requires the app account to cover the box minimum balance requirement
  await appClient.send.fundAppAccount({ amount: algo(1) })

  // example: READ_BOX_STATE
  // This contract's "box" map is keyed by byte[4] values
  const boxKey = new Uint8Array([0, 0, 0, 1])
  await appClient.send.call({ method: 'set_box', args: [boxKey, 'box content'], boxReferences: [boxKey] })

  const boxValue = await appClient.state.box.getMapValue('box', boxKey)
  const boxMap = await appClient.state.box.getMap('box')
  // example: READ_BOX_STATE
  if (boxValue !== 'box content') throw new Error('Unexpected box value')
  void boxMap

  // example: HANDLE_LOGIC_ERROR
  try {
    await appClient.send.call({ method: 'error' })
  } catch (e) {
    if (e instanceof LogicError) {
      console.log(`Call failed at TEAL line ${e.teal_line}: ${e.message}`)
    } else {
      throw e
    }
  }
  // example: HANDLE_LOGIC_ERROR
}

async function rawLayer(algorand: AlgorandClient, deployer: TransactionSignerAccount) {
  // example: CREATE_AND_READ_APP
  // Send a bare creation transaction through the transaction layer
  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: APPROVAL_TEAL,
    clearStateProgram: CLEAR_STATE_TEAL,
  })

  // Read the app back through the AppManager
  const appInfo = await algorand.app.getById(createResult.appId)
  console.log(`App ${appInfo.appId} created at address ${appInfo.appAddress}`)
  // example: CREATE_AND_READ_APP
  if (appInfo.appId !== createResult.appId) throw new Error('Unexpected app id')
  if (appInfo.creator.toString() !== deployer.addr.toString()) throw new Error('Unexpected creator')
}

async function main() {
  const env = await setupLocalNetEnvironment()
  const algorand = env.algorand
  const deployer = env.accountA

  await deployHelloWorld(algorand, deployer)
  const appClient = await templateVariablesAndRedeploy(algorand, deployer)
  await methodCalls(algorand, appClient, deployer)
  await stateAndErrors(appClient, deployer)
  await rawLayer(algorand, deployer)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
