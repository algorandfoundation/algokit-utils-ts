import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to handle and debug logic errors in smart contracts.
 *
 * When a smart contract encounters a logic error (like a failed assert), AlgoKit Utils
 * provides detailed debugging information including:
 * - The error message and transaction details
 * - Program Counter (PC): The exact bytecode position where the error occurred
 * - Source maps: When available, maps bytecode to source code
 * - Stack traces: Shows the execution path and error location
 *
 * This makes debugging smart contracts much easier compared to raw Algorand errors.
 */

async function demonstrateLogicErrorDebugging() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a test account
  const testAccount = algorand.account.random()
  await algorand.account.ensureFunded(testAccount, dispenser, (5).algos())

  console.log('Test account address:', testAccount.addr.toString())
  console.log()

  console.log('=== Deploying Test Application ===')
  console.log()
  console.log('This application has an "error" method that deliberately fails.')
  console.log()

  // Deploy the TestingApp which has an error() method that always fails
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: testAccount.addr,
  })

  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })

  console.log('✅ App deployed successfully!')
  console.log('App ID:', appClient.appId)
  console.log()

  console.log('=== Triggering Logic Error ===')
  console.log()
  console.log('Calling the "error" method which deliberately fails with assert(0)...')
  console.log()

  try {
    // Call the error() method which intentionally fails
    await appClient.send.error({ args: [] })

    // This line should never be reached
    console.log('❌ ERROR: Method should have failed but succeeded!')
  } catch (error: any) {
    console.log('✅ Logic error caught as expected!')
    console.log()

    console.log('═══════════════════════════════════════════════════')
    console.log('📊 ERROR INFORMATION')
    console.log('═══════════════════════════════════════════════════')
    console.log()

    // Display the error message
    console.log('🔴 Error Message:')
    console.log(`   ${error.message}`)
    console.log()

    // Check if this is a logic error with detailed information
    if (error.traces) {
      console.log('📋 Execution Traces Available:', error.traces.length > 0 ? 'Yes' : 'No')
      if (error.traces.length > 0) {
        console.log('   Traces contain step-by-step execution information')
      }
      console.log()
    }

    // Display transaction information if available
    if (error.transaction) {
      console.log('🔗 Transaction Information:')
      console.log(`   Transaction ID: ${error.transaction.txID()}`)
      console.log()
    }

    // Stack trace with error details
    if (error.stack) {
      console.log('═══════════════════════════════════════════════════')
      console.log('📄 STACK TRACE')
      console.log('═══════════════════════════════════════════════════')
      console.log()

      // Show first part of stack trace (the most relevant part)
      const stackLines = error.stack.split('\n').slice(0, 15)
      console.log(stackLines.join('\n'))
      console.log()

      if (error.stack.split('\n').length > 15) {
        console.log('... (truncated for brevity)')
        console.log()
      }
    }

    console.log('═══════════════════════════════════════════════════')
    console.log('💡 DEBUGGING TIPS')
    console.log('═══════════════════════════════════════════════════')
    console.log()

    console.log('1. Error Message:')
    console.log('   - Read the error message carefully')
    console.log('   - It often indicates the type of failure (assert, stack overflow, etc.)')
    console.log()

    console.log('2. Stack Trace:')
    console.log('   - Shows the JavaScript call stack leading to the error')
    console.log('   - Helps identify where in your code the error originated')
    console.log()

    console.log('3. Transaction ID:')
    console.log('   - Use to look up the transaction on AlgoExplorer or Goal')
    console.log('   - Can view full transaction details and inner transactions')
    console.log()

    console.log('4. Execution Traces:')
    console.log('   - When available, traces show step-by-step execution')
    console.log('   - Helpful for understanding the contract execution path')
    console.log()

    console.log('5. Common Logic Errors:')
    console.log('   - assert(0): Deliberate assertion failure')
    console.log('   - Stack overflow: Too much recursion or stack usage')
    console.log('   - Invalid operation: Division by zero, invalid bytecode, etc.')
    console.log('   - Budget exceeded: Program used too many compute units')
    console.log()

    console.log('6. Debugging Workflow:')
    console.log('   - Add log statements in your contract')
    console.log('   - Test with smaller inputs to isolate the issue')
    console.log('   - Use simulation mode to test without committing')
    console.log('   - Review the TEAL source code and approval program')
    console.log()
  }

  console.log('═══════════════════════════════════════════════════')
  console.log('✨ Example Completed Successfully')
  console.log('═══════════════════════════════════════════════════')
  console.log()

  console.log('You now understand how AlgoKit Utils helps debug smart contract logic errors!')
  console.log()
  console.log('Key Takeaways:')
  console.log('  • Errors provide detailed information for debugging')
  console.log('  • Stack traces help locate issues in your code')
  console.log('  • Transaction IDs can be used for further investigation')
  console.log('  • AlgoKit Utils catches and enriches error information')
}

// Run the example
demonstrateLogicErrorDebugging().catch(console.error)
