import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to compose method calls where one method accepts
 * another method call as an argument. This enables powerful composability patterns
 * in smart contract interactions.
 */

async function nestedMethodCallExample() {
  console.log('=== Nested Method Calls - Method Call as Argument ===')
  console.log()
  console.log('This example demonstrates the API pattern for calling a method')
  console.log('that accepts another method call as an argument.')
  console.log()
  console.log('IMPORTANT: This example requires a deployed smart contract with:')
  console.log('  - helloWorld() method that returns a string')
  console.log('  - methodArg(appl) method that accepts an app call and returns uint64')
  console.log()
  console.log('See the test at src/types/algorand-client.spec.ts for a working example.')
  console.log()
  console.log('---')
  console.log()

  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get account from LocalNet
  const alice = (await algorand.account.localNetDispenser()).account

  console.log('Account:', alice.addr.toString())
  console.log()

  // NOTE: In a real scenario, you would deploy your app first
  // For this example, we'll show the API pattern without executing
  const appId = 1234n // Replace with your actual deployed app ID

  // Define ABI methods
  // In a real scenario, you'd import these from your contract's ABI JSON
  const helloWorldMethod = new algosdk.ABIMethod({
    name: 'helloWorld',
    args: [],
    returns: { type: 'string', desc: 'Returns a greeting message' },
  })

  const methodArgMethod = new algosdk.ABIMethod({
    name: 'methodArg',
    args: [{ type: 'appl', name: 'innerCall', desc: 'An inner application call to execute' }],
    returns: { type: 'uint64', desc: 'Returns the app ID of the inner call' },
  })

  console.log('=== API Pattern ===')
  console.log()
  console.log('Step 1: Define the inner method call as an argument')
  console.log()

  // Define the inner method call that will be used as an argument
  // This call will be executed as part of the outer method
  const helloWorldCall: AppCallMethodCall = {
    sender: alice.addr,
    appId: appId,
    method: helloWorldMethod,
  }

  console.log('const helloWorldCall: AppCallMethodCall = {')
  console.log('  sender: alice.addr,')
  console.log('  appId: appId,')
  console.log('  method: helloWorldMethod,')
  console.log('}')
  console.log()

  console.log('Step 2: Pass the method call as an argument to another method')
  console.log()
  console.log('await algorand')
  console.log('  .newGroup()')
  console.log('  .addAppCallMethodCall({')
  console.log('    sender: alice.addr,')
  console.log('    appId: appId,')
  console.log('    method: methodArgMethod,')
  console.log('    args: [helloWorldCall], // Inner method call as argument')
  console.log('  })')
  console.log('  .send()')
  console.log()

  console.log('=== What Happens ===')
  console.log()
  console.log('1. The helloWorld() method call is composed as a transaction')
  console.log('2. It is passed as an argument to methodArg()')
  console.log('3. Both transactions are grouped and executed atomically')
  console.log('4. Return values from both methods are available in the result')
  console.log()

  console.log('=== Expected Results ===')
  console.log()
  console.log('methodArgResult.returns[0] -> "Hello, World!" (from helloWorld)')
  console.log('methodArgResult.returns[1] -> appId (from methodArg)')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log()
  console.log('✓ Methods can accept other method calls as arguments (type: appl)')
  console.log('✓ Enables powerful composability patterns in smart contracts')
  console.log('✓ Inner method calls execute as part of the outer method')
  console.log('✓ Both inner and outer methods can return values')
  console.log('✓ Use cases: DeFi protocols, multi-step workflows, contract orchestration')
  console.log()

  console.log('=== Common Patterns ===')
  console.log()
  console.log('- Oracle data fetching followed by processing')
  console.log('- Multi-contract interactions in DeFi')
  console.log('- Modular contract architectures')
  console.log('- Multi-step validation workflows')
  console.log()

  console.log('✨ Example completed successfully!')
  console.log()
  console.log('To run this with a real contract:')
  console.log('1. Deploy a contract with helloWorld() and methodArg(appl) methods')
  console.log('2. Replace appId with your deployed app ID')
  console.log('3. Uncomment the execution code below')
  console.log()

  // Uncomment this code after deploying your contract:
  /*
  const methodArgResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: alice.addr,
      appId: appId,
      method: methodArgMethod,
      args: [helloWorldCall],
    })
    .send()

  console.log('Transaction IDs:', methodArgResult.txIds)
  console.log('Inner call result:', methodArgResult.returns?.[0].returnValue?.valueOf())
  console.log('Outer call result:', methodArgResult.returns?.[1].returnValue?.valueOf())
  */
}

// Run the example
nestedMethodCallExample().catch(console.error)
