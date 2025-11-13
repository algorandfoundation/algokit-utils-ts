import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to compose method calls where one method accepts
 * another method call as an argument. This enables powerful composability patterns
 * in smart contract interactions.
 */

async function nestedMethodCallExample() {
  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get account from LocalNet
  const alice = (await algorand.account.localNetDispenser()).account

  // Deploy or reference your application
  const appId = 1234 // Replace with your actual app ID

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

  console.log('Creating a method call that takes another method call as an argument...')

  // Define the inner method call that will be used as an argument
  // This call will be executed as part of the outer method
  const helloWorldCall: AppCallMethodCall = {
    sender: alice.addr,
    appId: appId,
    method: helloWorldMethod,
  }

  console.log('\nInner method call: helloWorld()')
  console.log('Outer method call: methodArg(helloWorldCall)')

  // Create a transaction group with a method that accepts another method call as an argument
  const methodArgResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: alice.addr,
      appId: appId,
      method: methodArgMethod,
      // Pass the helloWorld method call as an argument
      args: [helloWorldCall],
    })
    .send()

  console.log('\nNested method call executed successfully!')
  console.log(`Transaction ID: ${methodArgResult.txIds[0]}`)

  // Process return values
  // The first return value is from the inner helloWorld call
  // The second return value is from the outer methodArg call
  if (methodArgResult.returns && methodArgResult.returns.length > 0) {
    console.log('\nReturn values:')

    // Return value from the inner helloWorld call
    const innerReturnValue = methodArgResult.returns[0].returnValue?.valueOf()
    console.log(`Inner call (helloWorld) returned: ${innerReturnValue}`)

    // Return value from the outer methodArg call
    if (methodArgResult.returns.length > 1) {
      const outerReturnValue = methodArgResult.returns[1].returnValue?.valueOf()
      console.log(`Outer call (methodArg) returned: ${outerReturnValue}`)
      console.log(`Expected app ID: ${appId}`)
      console.log(`Match: ${outerReturnValue === BigInt(appId)}`)
    }
  }

  console.log('\nKey takeaways:')
  console.log('- Methods can accept other method calls as arguments')
  console.log('- This enables powerful composability and modularity in smart contracts')
  console.log('- Inner method calls are executed as part of the outer method')
  console.log('- Both inner and outer methods can return values')
  console.log('- Use cases: DeFi protocols, multi-step workflows, contract orchestration')
  console.log('\nCommon patterns:')
  console.log('- Oracle data fetching followed by processing')
  console.log('- Multi-contract interactions in DeFi')
  console.log('- Modular contract architectures')
}

// Run the example
nestedMethodCallExample().catch(console.error)
