import { AlgorandClient } from '../../src'

/**
 * Example: Deploying a smart contract using AppFactory.
 *
 * This example demonstrates how to:
 * - Create an AlgorandClient connected to LocalNet
 * - Load an ARC-56 or ARC-32 app spec
 * - Create an AppFactory for the contract
 * - Deploy the contract with idempotent deployment
 * - Call methods on the deployed contract
 *
 * ## Create AppFactory
 *
 * Set up the AlgorandClient and create an AppFactory from your app spec:
 *
 * {@includeCode ./deploy-app.ts#factory}
 *
 * ## Deploy the App
 *
 * Use idempotent deployment to create, update, or skip based on the current state:
 *
 * {@includeCode ./deploy-app.ts#deploy}
 *
 * ## Call ABI Methods
 *
 * Call methods on your deployed contract:
 *
 * {@includeCode ./deploy-app.ts#call}
 *
 * @param appSpec - The ARC-56 or ARC-32 app specification
 * @returns The app client and deployment result
 */
export async function deployAppExample(appSpec: any) {
  //#region factory
  // Create an AlgorandClient connected to LocalNet
  const algorand = AlgorandClient.fromEnvironment()

  // Get the deployer account from environment
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  console.log(`Deployer address: ${deployer.addr}`)

  // Create an AppFactory from the app spec
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  //#endregion factory

  //#region deploy
  // Deploy the app - this is idempotent, so it will:
  // - Create the app if it doesn't exist
  // - Update the app if the code has changed
  // - Do nothing if the app is already up to date
  const { appClient, result } = await factory.deploy({
    onUpdate: 'update',
    onSchemaBreak: 'replace',
  })

  console.log(`App ID: ${appClient.appId}`)
  console.log(`App Address: ${appClient.appAddress}`)
  console.log(`Operation performed: ${result.operationPerformed}`)
  //#endregion deploy

  //#region call
  // If there's an ABI method called 'hello', call it
  // (This is just an example - your contract may have different methods)
  try {
    const helloResult = await appClient.send.call({
      method: 'hello',
      args: ['World'],
    })
    console.log(`Hello result: ${helloResult.return}`)
  } catch {
    console.log('No hello method found on this contract')
  }
  //#endregion call

  return { appClient, result }
}

/**
 * Example: Creating an app client for an existing app.
 *
 * Use this when you already know the app ID and just want to interact with it.
 *
 * ## Get App Client by ID
 *
 * Connect to an existing app using its ID:
 *
 * {@includeCode ./deploy-app.ts#existing}
 *
 * ## Read Global State
 *
 * Access the app's global state:
 *
 * {@includeCode ./deploy-app.ts#state}
 *
 * @param appSpec - The ARC-56 or ARC-32 app specification
 * @param appId - The ID of the existing app
 * @returns The app client
 */
export async function getExistingAppClient(appSpec: any, appId: bigint) {
  //#region existing
  const algorand = AlgorandClient.fromEnvironment()
  const sender = await algorand.account.fromEnvironment('SENDER')

  // Get an app client for an existing app by ID
  const appClient = algorand.client.getAppClientById({
    appSpec,
    appId,
    defaultSender: sender.addr,
  })

  console.log(`Connected to app ${appClient.appId}`)
  console.log(`App address: ${appClient.appAddress}`)
  //#endregion existing

  //#region state
  // Read global state
  const globalState = await appClient.getGlobalState()
  console.log('Global state:', globalState)
  //#endregion state

  return appClient
}
