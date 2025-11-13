import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to handle and debug logic errors in smart contracts.
 * 
 * When a smart contract encounters a logic error (like a failed assert), AlgoKit Utils
 * provides detailed debugging information including:
 * - Program Counter (PC): The exact bytecode position where the error occurred
 * - Transaction ID: The ID of the failed transaction
 * - Stack trace: TEAL source code with the error location marked
 * - Traces: Execution traces for step-by-step debugging
 * - LED (Logic Error Details): Comprehensive error metadata
 * 
 * This makes debugging smart contracts much easier compared to raw Algorand errors.
 */

async function demonstrateLogicErrorDebugging() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create a test account
  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')
  
  console.log('Test account address:', testAccount.addr)
  console.log('\nThis example will intentionally trigger a logic error to demonstrate debugging features.\n')
  
  // Get the app client for your deployed contract
  // This should be a contract with an 'error' method that fails
  const appId = 123n // Replace with your deployed app ID
  const appSpec = {} // Replace with your app spec
  
  const client = algorand.client.getAppClientById({
    appId: appId,
    defaultSender: testAccount.addr,
    appSpec: appSpec,
  })
  
  console.log('Calling smart contract method that will fail...')
  
  try {
    // Call a method that intentionally fails (e.g., has a failed assert)
    await client.send.call({
      method: 'error',
    })
    
    // This line should never be reached
    console.log('❌ ERROR: Method should have failed but succeeded!')
    
  } catch (error: any) {
    console.log('\n✅ Logic error caught as expected!\n')
    
    // The error object contains rich debugging information
    console.log('═══════════════════════════════════════════════════')
    console.log('📊 LOGIC ERROR DETAILS (LED)')
    console.log('═══════════════════════════════════════════════════\n')
    
    if (error.led) {
      // Program Counter: The exact position in the bytecode where the error occurred
      console.log('🎯 Program Counter (PC):', error.led.pc)
      console.log('   This is the bytecode position of the failing instruction\n')
      
      // Error message from the blockchain
      console.log('💬 Error Message:', error.led.msg)
      console.log('   Raw error message from the Algorand node\n')
      
      // Transaction ID of the failed transaction
      console.log('🔗 Transaction ID:', error.led.txId)
      console.log('   Use this to look up the transaction on AlgoExplorer\n')
      
      // Execution traces (if available)
      if (error.led.traces && error.led.traces.length > 0) {
        console.log('📋 Execution Traces:', error.led.traces.length, 'trace(s) available')
        console.log('   Traces show the execution path leading to the error\n')
      }
    } else {
      console.log('⚠️  No LED information available (source maps may be missing)\n')
    }
    
    // Stack trace with source code context (when source maps are available)
    if (error.stack) {
      console.log('═══════════════════════════════════════════════════')
      console.log('📄 STACK TRACE WITH SOURCE CODE')
      console.log('═══════════════════════════════════════════════════\n')
      
      console.log(error.stack)
      
      console.log('\n✨ The stack trace shows:')
      console.log('   - The actual TEAL source code')
      console.log('   - The exact line where the error occurred (marked with "<--- Error")')
      console.log('   - Surrounding code context for better understanding')
    } else {
      console.log('⚠️  No stack trace available\n')
    }
    
    console.log('\n═══════════════════════════════════════════════════')
    console.log('💡 DEBUGGING TIPS')
    console.log('═══════════════════════════════════════════════════\n')
    
    console.log('1. Program Counter (PC):')
    console.log('   - Shows exactly where in the bytecode the error occurred')
    console.log('   - Useful for pinpointing issues in compiled code\n')
    
    console.log('2. Source Maps:')
    console.log('   - Enable source maps during compilation for better errors')
    console.log('   - AlgoKit automatically includes source maps in debug builds\n')
    
    console.log('3. Stack Traces:')
    console.log('   - Read the marked line ("<--- Error") to see the failing instruction')
    console.log('   - Review surrounding code to understand the context\n')
    
    console.log('4. Traces:')
    console.log('   - Use traces to follow the execution path')
    console.log('   - Helpful for understanding how the contract reached the error\n')
    
    console.log('5. Transaction ID:')
    console.log('   - Look up on AlgoExplorer for additional details')
    console.log('   - Can view full transaction state and inner transactions\n')
  }
}

// Run the example
demonstratLogicErrorDebugging()
  .then(() => {
    console.log('\n✨ Example completed successfully!')
    console.log('\nYou now know how to debug logic errors in Algorand smart contracts!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Example failed:', error)
    process.exit(1)
  })