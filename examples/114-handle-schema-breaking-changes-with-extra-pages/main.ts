import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandClient, OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils'
import smallAppArc56Json from './artifacts/small-app.arc56.json'
import largeAppArc56Json from './artifacts/large-app.arc56.json'

/**
 * This example demonstrates how to handle schema breaking changes,
 * specifically when extra program pages are needed.
 * 
 * Key concepts:
 * - Detecting schema breaks (extra pages requirement)
 * - Using OnSchemaBreak.Fail to prevent breaking updates
 * - Using OnSchemaBreak.AppendApp to create a new app when schema breaks
 * - Understanding deployment strategies for breaking changes
 */

async function handleSchemaBreakExample() {
  // Setup: Initialize Algorand client and test account
  const localnet = await algorandFixture()
  const algorand = localnet.algorand

  console.log('Step 1: Deploy small application (no extra pages)')
  // Create factory with small app spec
  let appFactory = algorand.client.getAppFactory({
    appSpec: smallAppArc56Json,
    defaultSender: localnet.context.testAccount.addr,
  })

  const { result: appCreateResult } = await appFactory.deploy({
    updatable: true, // Allow updates
  })

  console.log(`Small app created with ID: ${appCreateResult.appId}`)
  console.log(`Operation performed: ${appCreateResult.operationPerformed}`) // 'create'
  console.log(`App address: ${appCreateResult.appAddress}`)

  console.log('\nStep 2: Attempt to update to larger app (requires extra pages)')
  // Update factory to use large app spec that requires more pages
  appFactory = algorand.client.getAppFactory({
    appSpec: largeAppArc56Json, // This app needs extra pages
    defaultSender: localnet.context.testAccount.addr,
  })

  console.log('\nAttempt 1: Using OnSchemaBreak.Fail (will fail)')
  try {
    await appFactory.deploy({
      updatable: true,
      onSchemaBreak: OnSchemaBreak.Fail, // Fail if schema breaks
      onUpdate: OnUpdate.UpdateApp,
    })
    console.log('❌ Unexpected: Update should have failed')
  } catch (error) {
    console.log('✓ Expected error caught:')
    console.log(`  ${error instanceof Error ? error.message : error}`)
    console.log('\n  Schema break detected! Extra pages would break the schema.')
    console.log('  The deployment was stopped to prevent breaking changes.')
  }

  console.log('\nAttempt 2: Using OnSchemaBreak.AppendApp (will create new app)')
  // This time, allow creating a new app when schema breaks
  const { result: appAppendResult } = await appFactory.deploy({
    updatable: true,
    onSchemaBreak: OnSchemaBreak.AppendApp, // Create new app if schema breaks
    onUpdate: OnUpdate.UpdateApp,
  })

  console.log(`\n✓ New app created successfully!`)
  console.log(`Operation performed: ${appAppendResult.operationPerformed}`) // 'create'
  console.log(`New app ID: ${appAppendResult.appId}`)
  console.log(`Original app ID: ${appCreateResult.appId}`)
  console.log(`App IDs are different: ${appCreateResult.appId !== appAppendResult.appId}`)
  
  console.log('\nSummary:')
  console.log('- OnSchemaBreak.Fail: Prevents deployment when schema breaks detected')
  console.log('- OnSchemaBreak.AppendApp: Creates a new app when schema breaks')
  console.log('- Extra pages are detected as a breaking change')
  console.log('- This protects your app from incompatible updates')
}

// Run the example
handleSchemaBreakExample().catch(console.error)