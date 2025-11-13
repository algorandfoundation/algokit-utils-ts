import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to create (deploy) a new Algorand application
 * from scratch using TEAL source code.
 *
 * It covers:
 * - Defining TEAL approval and clear state programs
 * - Configuring state schema (storage requirements)
 * - Creating the application using algorand.send.appCreate
 * - Verifying the app ID and deriving the app address
 * - Confirming the transaction
 */

async function createApplication() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded test account from the LocalNet dispenser
  const sender = await algorand.account.dispenserFromEnvironment()
  console.log('Deploying application from account:', sender.addr.toString())

  // For this example, we'll use a simple application
  // The TEAL source code will be automatically compiled by the API
  const approvalProgram = `#pragma version 8
int 1
return`

  const clearStateProgram = `#pragma version 8
int 1
return`

  // Define the state schema (storage requirements)
  const schema = {
    globalInts: 1,       // Number of global uint64 values
    globalByteSlices: 1, // Number of global byte slice values
    localInts: 0,        // Number of local uint64 values per account
    localByteSlices: 0,  // Number of local byte slice values per account
  }

  console.log('\nCreating application...')

  // Create the application
  const app = await algorand.send.appCreate({
    sender: sender.addr,
    approvalProgram: approvalProgram,
    clearStateProgram: clearStateProgram,
    schema: schema,
  })

  // Display results
  console.log('\n✅ Application created successfully!')
  console.log('App ID:', app.appId.toString())
  console.log('App Address:', app.appAddress.toString())
  console.log('Transaction ID:', app.txIds[0])
  console.log('Confirmation Round:', app.confirmations?.[0]?.confirmedRound)

  // Verify the app address matches the expected address derived from app ID
  const expectedAddress = algosdk.getApplicationAddress(app.appId).toString()
  const actualAddress = app.appAddress.toString()
  console.log('\n✓ App address verification:', actualAddress === expectedAddress ? 'PASSED' : 'FAILED')

  return app
}

// Run the example
createApplication()
  .then(() => console.log('\nExample completed successfully'))
  .catch((error) => {
    console.error('Error:', error.message)
    process.exit(1)
  })