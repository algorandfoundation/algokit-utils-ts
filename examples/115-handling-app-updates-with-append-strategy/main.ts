import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import { Config } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use the 'append' strategy when deploying apps.
 * The append strategy creates a new app instead of updating or replacing the existing one,
 * which is useful for:
 * - Blue-green deployments
 * - Gradual migrations
 * - Maintaining multiple app versions simultaneously
 * - Handling schema breaks without deleting the old app
 */

async function demonstrateAppendStrategies() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const sender = algorand.account.localNetDispenser()

  console.log('=== App Deployment with Append Strategies ===')
  console.log()

  // ===== Example 1: Handling Schema Breaks with Append =====
  console.log('Example 1: Schema Break with onSchemaBreak=append')
  console.log('---------------------------------------------------')

  // Initial app deployment
  const metadata1 = {
    name: 'MyApp',
    version: '1.0',
    updatable: true,
    deletable: true,
  }

  const deployment1 = {
    sender,
    metadata: metadata1,
    deployTimeParams: {},
    schema: {
      globalInts: 1,
      globalBytes: 0,
      localInts: 0,
      localBytes: 0,
    },
    approvalProgram: `#pragma version 8
int 1
return`,
    clearStateProgram: `#pragma version 8
int 1
return`,
  }

  console.log('Deploying initial app with schema: globalInts=1, globalBytes=0')
  const result1 = await algorand.appDeployer.deploy(deployment1)
  console.log(`✓ Created app with ID: ${result1.appId}`)
  console.log(`  Operation: ${result1.operationPerformed}`)
  console.log(`  Version: ${result1.version}`)
  console.log()

  // Deploy with schema break using 'append' strategy
  // This will create a NEW app instead of replacing the old one
  const deployment2 = {
    sender,
    metadata: metadata1, // Same metadata
    onSchemaBreak: 'append' as const, // Key: Use append strategy
    deployTimeParams: {},
    schema: {
      globalInts: 2, // BREAKING CHANGE: Different schema
      globalBytes: 1,
      localInts: 0,
      localBytes: 0,
    },
    approvalProgram: `#pragma version 8
int 1
return`,
    clearStateProgram: `#pragma version 8
int 1
return`,
  }

  console.log('Deploying with schema break (globalInts=2, globalBytes=1) and onSchemaBreak=append')
  const result2 = await algorand.appDeployer.deploy(deployment2)
  console.log(`✓ Created NEW app with ID: ${result2.appId}`)
  console.log(`  Operation: ${result2.operationPerformed}`)
  console.log(`  Old app ID: ${result1.appId} (still exists)`)
  console.log(`  New app ID: ${result2.appId}`)
  console.log(`  Both apps are now running simultaneously!`)
  console.log()

  // ===== Example 2: Version Updates with Append =====
  console.log('Example 2: Version Update with onUpdate=append')
  console.log('-----------------------------------------------')

  // Initial app deployment with version 1.0
  const metadata3 = {
    name: 'MyVersionedApp',
    version: '1.0',
    updatable: true,
    deletable: true,
  }

  const deployment3 = {
    sender,
    metadata: metadata3,
    deployTimeParams: { VALUE: 1 },
    schema: {
      globalInts: 1,
      globalBytes: 0,
      localInts: 0,
      localBytes: 0,
    },
    approvalProgram: `#pragma version 8
int TMPL_VALUE
return`,
    clearStateProgram: `#pragma version 8
int 1
return`,
  }

  console.log('Deploying app version 1.0 with VALUE=1')
  const result3 = await algorand.appDeployer.deploy(deployment3)
  console.log(`✓ Created app with ID: ${result3.appId}`)
  console.log(`  Version: ${result3.version}`)
  console.log()

  // Deploy version 2.0 with 'append' strategy
  // This creates a new app instead of updating the existing one
  const metadata4 = {
    name: 'MyVersionedApp',
    version: '2.0', // New version
    updatable: true,
    deletable: true,
  }

  const deployment4 = {
    sender,
    metadata: metadata4,
    onUpdate: 'append' as const, // Key: Use append strategy for updates
    deployTimeParams: { VALUE: 3 }, // Different template value
    schema: {
      globalInts: 1,
      globalBytes: 0,
      localInts: 0,
      localBytes: 0,
    },
    approvalProgram: `#pragma version 8
int TMPL_VALUE
return`,
    clearStateProgram: `#pragma version 8
int 1
return`,
  }

  console.log('Deploying version 2.0 with VALUE=3 and onUpdate=append')
  const result4 = await algorand.appDeployer.deploy(deployment4)
  console.log(`✓ Created NEW app with ID: ${result4.appId}`)
  console.log(`  Operation: ${result4.operationPerformed}`)
  console.log(`  Version 1.0 app ID: ${result3.appId} (still running)`)
  console.log(`  Version 2.0 app ID: ${result4.appId} (newly created)`)
  console.log()

  console.log('=== Summary ===')
  console.log('The append strategy allows you to:')
  console.log('1. Keep old apps running while deploying new versions')
  console.log('2. Perform gradual migrations by routing traffic between versions')
  console.log('3. Rollback quickly by switching back to the old app')
  console.log('4. Test new versions in production without replacing the old version')
}

// Run the example
demonstrateAppendStrategies().catch(console.error)