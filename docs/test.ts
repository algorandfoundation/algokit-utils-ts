import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { HelloWorld2Client } from '../artifacts/hello_world2/HelloWorld2Client'

export async function deploy() {
  console.log('=== Deploying HelloWorld2 ===')

  const algorand = AlgorandClient.fromEnvironment()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  const appClient = algorand.client.getTypedAppClientByCreatorAndName(HelloWorld2Client, {
    sender: deployer,
    creatorAddress: deployer.addr,
  })

  const app = await appClient.deploy({
    onSchemaBreak: 'append',
    onUpdate: 'append',
  })

  // If app was just created fund the app account
  if (['create', 'replace'].includes(app.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: app.appAddress,
    })
  }

  const method = 'hello'
  const response = await appClient.hello({ name: 'world' })
  console.log(`Called ${method} on ${app.name} (${app.appId}) with name = world, received: ${response.return}`)
}
