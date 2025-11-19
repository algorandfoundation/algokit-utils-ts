import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how AlgoKit Utils provides enhanced error messages
 * when TEAL logic errors occur during smart contract execution.
 *
 * The SDK automatically enriches errors with:
 * - TEAL stack traces showing the exact instruction that failed
 * - Program Counter (PC) information
 * - Transaction details and IDs
 * - Execution traces for step-by-step debugging
 * - Human-readable error messages
 *
 * This makes debugging smart contract logic errors much easier compared to raw errors.
 */

async function demonstrateEnhancedErrorMessages() {
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
    console.log('📊 ENHANCED ERROR INFORMATION')
    console.log('═══════════════════════════════════════════════════')
    console.log()

    // Display the enhanced error message
    console.log('🔴 Error Message:')
    console.log(`   ${error.message}`)
    console.log()

    // The error message includes several key pieces of information:
    // 1. Error type (e.g., "assert failed")
    // 2. Program Counter (PC) - the bytecode position
    // 3. Line number in TEAL source (if available)
    // 4. Transaction details

    // Parse the error message to highlight key information
    const pcMatch = error.message.match(/pc=(\d+)/)
    if (pcMatch) {
      console.log('📍 Program Counter (PC):')
      console.log(`   ${pcMatch[1]} - This is the bytecode position where the error occurred`)
      console.log()
    }

    const lineMatch = error.message.match(/at:(\d+)/)
    if (lineMatch) {
      console.log('📄 TEAL Source Line:')
      console.log(`   Line ${lineMatch[1]} in the TEAL source code`)
      console.log()
    }

    // Check if execution traces are available
    if (error.traces) {
      console.log('📋 Execution Traces:')
      console.log(`   Available: ${error.traces.length > 0 ? 'Yes' : 'No'}`)
      if (error.traces.length > 0) {
        console.log(`   Number of trace entries: ${error.traces.length}`)
        console.log('   These traces show step-by-step execution of your contract')
      }
      console.log()
    }

    // Display transaction information if available
    if (error.transaction) {
      console.log('🔗 Transaction Information:')
      console.log(`   Transaction ID: ${error.transaction.txID()}`)
      console.log('   You can use this ID to look up the transaction on AlgoExplorer')
      console.log()
    }

    // Stack trace with TEAL source code
    if (error.stack) {
      console.log('═══════════════════════════════════════════════════')
      console.log('📄 TEAL STACK TRACE')
      console.log('═══════════════════════════════════════════════════')
      console.log()

      // Show the relevant part of the stack trace
      const stackLines = error.stack.split('\n')

      // Find the error line in the stack trace
      let errorLineIndex = -1
      for (let i = 0; i < stackLines.length; i++) {
        if (stackLines[i].includes('<--- Error')) {
          errorLineIndex = i
          break
        }
      }

      if (errorLineIndex !== -1) {
        // Show context around the error (5 lines before, the error line, and 5 lines after)
        const startIndex = Math.max(0, errorLineIndex - 5)
        const endIndex = Math.min(stackLines.length, errorLineIndex + 6)

        const relevantLines = stackLines.slice(startIndex, endIndex)
        console.log(relevantLines.join('\n'))
        console.log()

        console.log('The line marked "<--- Error" shows exactly where the failure occurred!')
        console.log()
      } else {
        // Show first 15 lines if we couldn't find the error marker
        const stackPreview = stackLines.slice(0, 15)
        console.log(stackPreview.join('\n'))
        console.log()
      }
    }

    console.log('═══════════════════════════════════════════════════')
    console.log('💡 WHAT MAKES THESE ERROR MESSAGES ENHANCED?')
    console.log('═══════════════════════════════════════════════════')
    console.log()

    console.log('Without AlgoKit Utils, you would get:')
    console.log('  ❌ Generic error: "TransactionPool.Remember: transaction <ID>: logic eval error"')
    console.log('  ❌ No indication of where in your code the error occurred')
    console.log('  ❌ No TEAL source code context')
    console.log('  ❌ Difficult to debug and fix')
    console.log()

    console.log('With AlgoKit Utils enhanced errors, you get:')
    console.log('  ✅ Exact error type (assert failed, budget exceeded, etc.)')
    console.log('  ✅ Program Counter (PC) - bytecode position')
    console.log('  ✅ Line number in TEAL source code')
    console.log('  ✅ TEAL stack trace with error location marked')
    console.log('  ✅ Transaction ID for further investigation')
    console.log('  ✅ Execution traces for step-by-step debugging')
    console.log()

    console.log('This dramatically reduces debugging time!')
  }

  console.log('═══════════════════════════════════════════════════')
  console.log('✨ Example Completed Successfully')
  console.log('═══════════════════════════════════════════════════')
  console.log()

  console.log('You now understand how AlgoKit Utils provides enhanced error messages!')
  console.log()
  console.log('Key Takeaways:')
  console.log('  • AlgoKit Utils automatically enriches error messages')
  console.log('  • You get TEAL stack traces showing exactly where errors occur')
  console.log('  • Program Counter and line numbers help pinpoint issues')
  console.log('  • Transaction IDs and traces enable deeper debugging')
  console.log('  • This makes debugging smart contracts much easier!')
}

// Run the example
demonstrateEnhancedErrorMessages().catch(console.error)
