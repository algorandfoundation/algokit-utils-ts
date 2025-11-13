import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'
import * as deployErrorAppArc56Json from './deploy-error-app.arc56.json'
import * as templateVarsErrorAppArc56Json from './template-vars-error-app.arc56.json'
import * as errorInnerAppArc56Json from './error-inner-app.arc56.json'
import * as errorMiddleAppArc56Json from './error-middle-app.arc56.json'
import * as errorOuterAppArc56Json from './error-outer-app.arc56.json'

/**
 * ARC56 Error Handling Examples
 * 
 * This example demonstrates how to handle custom error messages from ARC56-compliant
 * smart contracts in three scenarios:
 * 1. Errors during application deployment
 * 2. Errors in method calls with dynamic template variables
 * 3. Error propagation through nested inner application calls
 */

async function main() {
  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a funded test account
  const testAccount = await algorand.account.fromEnvironment('LOCALNET_ACCOUNT')
  
  console.log('=== ARC56 Error Handling Examples ===')
  console.log()
  
  // ========================================
  // Example 1: Deployment Error Handling
  // ========================================
  console.log('1. Testing deployment error handling...')
  try {
    // Create a factory for an app that throws an error during deployment
    const deployErrorFactory = algorand.client.getAppFactory({
      appSpec: deployErrorAppArc56Json as any,
      defaultSender: testAccount.addr,
    })
    
    // Attempt to deploy the app - this will fail with a custom error message
    await deployErrorFactory.deploy({ 
      createParams: { method: 'createApplication' } 
    })
    
    console.log('❌ Expected an error but deployment succeeded')
  } catch (error: any) {
    // The ARC56 error message is extracted and surfaced here
    console.log('✅ Deployment error caught successfully!')
    console.log(`   Error message: "${error.message}"`)
    console.log('   Expected: "custom error message"')
  }
  console.log()
  
  // ========================================
  // Example 2: Error Messages with Template Variables
  // ========================================
  console.log('2. Testing error messages with dynamic template variables...')
  try {
    // Create a factory for an app with template variables
    const templateVarsFactory = algorand.client.getAppFactory({
      appSpec: templateVarsErrorAppArc56Json as any,
      defaultSender: testAccount.addr,
    })
    
    // Deploy the app with specific template variable values
    // These template variables can affect the program counter (cblock offset),
    // but error messages should still be correctly identified
    const { appClient } = await templateVarsFactory.deploy({
      createParams: {
        method: 'createApplication',
      },
      deployTimeParams: {
        bytes64TmplVar: '0'.repeat(64),
        uint64TmplVar: 123,
        bytes32TmplVar: '0'.repeat(32),
        bytesTmplVar: 'foo',
      },
    })
    
    console.log(`   App deployed successfully with ID: ${appClient.appId}`)
    
    // Call a method that throws an error
    await appClient.send.call({ method: 'throwError' })
    
    console.log('❌ Expected an error but method call succeeded')
  } catch (error: any) {
    // Even with template variables affecting code offsets,
    // the ARC56 error message is correctly extracted
    console.log('✅ Error caught successfully with template variables!')
    console.log(`   Error message: "${error.message}"`)
    console.log('   Expected: "this is an error"')
  }
  console.log()
  
  // ========================================
  // Example 3: Nested Inner App Error Propagation
  // ========================================
  console.log('3. Testing error propagation through nested inner app calls...')
  try {
    // Deploy the innermost application
    const innerFactory = algorand.client.getAppFactory({
      appSpec: errorInnerAppArc56Json as any,
      defaultSender: testAccount.addr,
    })
    const { appClient: innerClient } = await innerFactory.deploy({ 
      createParams: { method: 'createApplication' } 
    })
    console.log(`   Inner app deployed with ID: ${innerClient.appId}`)
    
    // Deploy the middle application
    const middleFactory = algorand.client.getAppFactory({
      appSpec: errorMiddleAppArc56Json as any,
      defaultSender: testAccount.addr,
    })
    const { appClient: middleClient } = await middleFactory.deploy({ 
      createParams: { method: 'createApplication' } 
    })
    console.log(`   Middle app deployed with ID: ${middleClient.appId}`)
    
    // Deploy the outer application
    const outerFactory = algorand.client.getAppFactory({
      appSpec: errorOuterAppArc56Json as any,
      defaultSender: testAccount.addr,
    })
    const { appClient: outerClient } = await outerFactory.deploy({ 
      createParams: { method: 'createApplication' } 
    })
    console.log(`   Outer app deployed with ID: ${outerClient.appId}`)
    
    // Call the outer app, which calls the middle app, which calls the inner app
    // The inner app will throw an error that should propagate up
    // Note: Extra fee is needed for inner transactions
    await outerClient.send.call({ 
      method: 'callMiddle', 
      args: [middleClient.appId, innerClient.appId], 
      extraFee: microAlgos(2000) 
    })
    
    console.log('❌ Expected an error but nested call succeeded')
  } catch (error: any) {
    // The error from the innermost app is propagated through the call chain
    // and the ARC56 error message is correctly extracted
    console.log('✅ Nested inner app error caught and propagated successfully!')
    console.log(`   Error message: "${error.message}"`)
    console.log('   Expected: "custom error message"')
    console.log('   This error originated from the innermost app and propagated up')
  }
  console.log()
  
  console.log('=== All ARC56 error handling examples completed ===')
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})