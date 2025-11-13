import { AlgorandClient, LogicError } from '@algorandfoundry/algokit-utils'
import { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'
import algosdk from 'algosdk'

/**
 * This example demonstrates what happens when you try to update an immutable application.
 * 
 * Key concepts:
 * - Deploy an app with updatable=false (immutable)
 * - Attempt to update the immutable app
 * - Catch and parse the resulting logic error
 * - Understand app immutability for security
 */

async function handleImmutableAppUpdate() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  algorand.setLogger(consoleLogger)

  // Get a test account with funds from LocalNet
  const sender = await algorand.account.localNet.dispenser()

  console.log('=== Deploying Immutable App ===')
  
  // Define app metadata with updatable flag set to FALSE
  const metadata = {
    name: 'MyImmutableApp',
    version: '1.0',
    updatable: false, // This makes the app immutable
    deletable: false,
  }

  // Deploy the initial immutable version
  const deployment1 = {
    sender: sender.addr,
    metadata: metadata,
    approvalProgram: await getApprovalProgram(1),
    clearStateProgram: await getClearProgram(),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
  }

  const result1 = await algorand.appDeployer.deploy(deployment1)

  if ('transaction' in result1) {
    console.log(`✓ Immutable app deployed successfully`)
    console.log(`  App ID: ${result1.appId}`)
    console.log(`  Version: ${result1.version}`)
    console.log(`  Updatable: ${result1.updatable}`)
    console.log(`  Transaction ID: ${result1.transaction.txID()}`)
  }

  // Wait for indexer to catch up
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('\n=== Attempting to Update Immutable App ===')

  // Attempt to deploy an update (this will fail)
  const deployment2 = {
    sender: sender.addr,
    metadata: {
      ...metadata,
      version: '2.0',
    },
    approvalProgram: await getApprovalProgram(2), // Different code
    clearStateProgram: await getClearProgram(),
    schema: {
      globalUints: 1,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0,
    },
    onUpdate: 'update' as const,
  }

  try {
    // This will throw an error because the app is immutable
    await algorand.appDeployer.deploy(deployment2)
    
    // We should never reach this line
    console.log('❌ ERROR: Update should have failed but succeeded!')
  } catch (error: any) {
    console.log('✓ Update failed as expected (app is immutable)')
    console.log(`\n=== Error Details ===')
    console.log(`Error message: ${error.message}`)
    
    // Check if it's a logic error
    if (error.message.includes('logic eval error') || error.message.includes('assert failed')) {
      console.log('\nThis is a logic error - the app contract rejected the update.')
      
      // Parse the logic error for more details
      const logicError = LogicError.parseLogicError(error)
      
      if (logicError) {
        console.log('\n=== Parsed Logic Error ===')
        console.log(`Transaction ID: ${logicError.txId}`)
        console.log(`Message: ${logicError.message}`)
        if (logicError.program) {
          console.log(`Failed in: ${logicError.program}`)
        }
        if (logicError.line) {
          console.log(`Line: ${logicError.line}`)
        }
      }
    }
  }

  console.log('\n=== Summary ===')
  console.log('Immutable apps cannot be updated once deployed.')
  console.log('This is a security feature to ensure app logic cannot be changed.')
  console.log('When deploying apps, carefully consider whether they should be updatable.')
  console.log('\nBest practices:')
  console.log('  - Use updatable=false for production apps that should never change')
  console.log('  - Use updatable=true during development or for apps that need upgrades')
  console.log('  - Always handle update errors gracefully in your deployment scripts')
}

/**
 * Helper function to generate approval program
 * The program includes logic to prevent updates when updatable=false
 */
async function getApprovalProgram(version: number): Promise<Uint8Array> {
  const tealCode = `#pragma version 10
  txn ApplicationID
  int 0
  ==
  bnz create
  
  txn OnCompletion
  int UpdateApplication
  ==
  bnz update
  
  int 1
  return
  
  create:
  byte "version"
  int ${version}
  app_global_put
  int 1
  return
  
  update:
  // For immutable apps, this will fail
  // In real deployment templates, this checks the updatable flag
  int 0
  assert
  int 1
  return`
  
  const client = algosdk.makeApplicationClient(
    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))
  )
  const compiled = await algosdk.compileProgram(client, tealCode)
  return compiled.compiledProgram
}

/**
 * Helper function to generate clear state program
 */
async function getClearProgram(): Promise<Uint8Array> {
  const tealCode = `#pragma version 10
  int 1`
  
  const client = algosdk.makeApplicationClient(
    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))
  )
  const compiled = await algosdk.compileProgram(client, tealCode)
  return compiled.compiledProgram
}

// Run the example
handleImmutableAppUpdate().catch(console.error)