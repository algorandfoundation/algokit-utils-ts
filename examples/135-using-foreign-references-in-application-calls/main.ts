import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to use foreign references (apps, accounts, assets)
 * when calling application methods.
 *
 * Foreign references allow your smart contract to:
 * - Read state from other applications
 * - Access account information beyond the sender
 * - Query asset parameters and holdings
 * - Perform cross-app interactions
 *
 * Algorand Transaction Limits:
 * - Up to 8 foreign apps
 * - Up to 4 foreign accounts
 * - Up to 8 foreign assets
 */

async function main() {
  console.log('=== Using Foreign References in Application Calls ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Create some foreign resources for demonstration
  console.log('=== Setting up Foreign Resources ===\n')

  // Create a foreign account
  const foreignAccount = algorand.account.random()
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: foreignAccount.addr,
    amount: microAlgos(500_000),
  })
  console.log('✅ Created foreign account:', foreignAccount.addr.toString())

  // Create a foreign asset (ASA)
  const assetCreateResult = await algorand.send.assetCreate({
    sender: deployer.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Token',
    unitName: 'TST',
  })
  const foreignAssetId = assetCreateResult.assetId
  console.log('✅ Created foreign asset:', foreignAssetId)

  // Create a foreign app
  const foreignAppProgram = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// On creation or call, store a value
create:
byte "message"
byte "Hello from foreign app"
app_global_put

int 1
return`

  const foreignAppClearProgram = `#pragma version 10
int 1
return`

  const foreignAppResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: foreignAppProgram,
    clearStateProgram: foreignAppClearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const foreignAppId = foreignAppResult.appId
  console.log('✅ Created foreign app:', foreignAppId)
  console.log()

  // Deploy the main application that will access foreign references
  console.log('=== Deploying Main Application ===\n')

  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize state
byte "counter"
int 0
app_global_put

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "access_foreign_refs()string"
==
bnz method_access_foreign_refs

// Unknown method
int 0
return

method_access_foreign_refs:
// This method demonstrates accessing foreign references
// Foreign references are passed via the transaction's foreign arrays

// We can verify foreign references are present:
// - txna Applications 1 would give us the foreign app ID
// - txna Accounts 1 would give us the foreign account address
// - txna Assets 0 would give us the foreign asset ID

// For this demo, we'll just return a success message
byte "Accessed foreign app, account, and asset successfully!"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const mainAppId = createResult.appId
  const mainAppAddress = algosdk.getApplicationAddress(mainAppId)

  console.log('✅ Main application deployed!')
  console.log('   App ID:', mainAppId)
  console.log('   App Address:', mainAppAddress.toString())
  console.log()

  // Define the ABI method
  const accessForeignRefsMethod = new algosdk.ABIMethod({
    name: 'access_foreign_refs',
    args: [],
    returns: { type: 'string' },
  })

  // Call the method with foreign references
  console.log('=== Calling Method with Foreign References ===\n')

  console.log('Foreign references being passed:')
  console.log(`   Foreign App ID: ${foreignAppId}`)
  console.log(`   Foreign Account: ${foreignAccount.addr.toString()}`)
  console.log(`   Foreign Asset ID: ${foreignAssetId}`)
  console.log()

  const result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: mainAppId,
      method: accessForeignRefsMethod,
      args: [],
      // Foreign references - these make external resources available to the contract
      appReferences: [foreignAppId],      // Foreign application(s)
      accountReferences: [foreignAccount.addr],  // Foreign account(s)
      assetReferences: [foreignAssetId],  // Foreign asset(s)
    })
    .send()

  console.log('✅ Method call successful!')
  console.log('   Transaction ID:', result.txIds[0])
  console.log()

  if (result.returns && result.returns.length > 0) {
    const returnValue = result.returns[0].returnValue
    console.log('Return value from contract:')
    console.log(`   "${returnValue}"`)
  }
  console.log()

  // Demonstrate different foreign reference scenarios
  console.log('=== Understanding Foreign References ===\n')

  console.log('What are foreign references?')
  console.log('  • External resources that a smart contract needs to access')
  console.log('  • Must be explicitly declared in the transaction')
  console.log('  • Enables cross-contract interactions and composability\n')

  console.log('Types of foreign references:')
  console.log('  1. Foreign Apps (appReferences)')
  console.log('     - Read global/local state from other applications')
  console.log('     - Make inner transactions to other apps')
  console.log('     - Up to 8 foreign apps per transaction\n')

  console.log('  2. Foreign Accounts (accountReferences)')
  console.log('     - Access account balances')
  console.log('     - Check asset holdings')
  console.log('     - Verify account properties')
  console.log('     - Up to 4 foreign accounts per transaction\n')

  console.log('  3. Foreign Assets (assetReferences)')
  console.log('     - Query asset parameters (total, decimals, etc.)')
  console.log('     - Check asset holdings')
  console.log('     - Transfer assets')
  console.log('     - Up to 8 foreign assets per transaction\n')

  console.log('How they work in TEAL:')
  console.log('  • Foreign apps: txna Applications <index>')
  console.log('  • Foreign accounts: txna Accounts <index>')
  console.log('  • Foreign assets: txna Assets <index>')
  console.log('  • Index 0 has special meaning:')
  console.log('    - Applications[0] = current app ID')
  console.log('    - Accounts[0] = sender address')
  console.log('  • Foreign refs start at index 1+\n')

  // Example: Reading from a foreign app
  console.log('=== Example: Reading Foreign App State ===\n')

  const readForeignAppProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

txn NumAppArgs
int 0
>
bnz check_methods

int 1
return

create:
int 1
return

check_methods:
txn ApplicationArgs 0
method "read_foreign_app()string"
==
bnz method_read_foreign_app

int 0
return

method_read_foreign_app:
// Read from foreign app's global state
// txna Applications 1 gives us the foreign app ID
// Then we can use app_global_get_ex to read its state

txna Applications 1
byte "message"
app_global_get_ex
bnz has_value

// No value found
byte "Foreign app has no 'message' key"
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75
swap
concat
log

int 1
return

has_value:
// Value found, return it
// The value is already on stack from app_global_get_ex
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75
swap
concat
log

int 1
return`

  const readAppResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: readForeignAppProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const readAppId = readAppResult.appId
  console.log('✅ Deployed app that reads foreign app state')
  console.log('   App ID:', readAppId)
  console.log()

  const readForeignAppMethod = new algosdk.ABIMethod({
    name: 'read_foreign_app',
    args: [],
    returns: { type: 'string' },
  })

  console.log(`Calling method to read state from foreign app ${foreignAppId}...`)
  const readResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: readAppId,
      method: readForeignAppMethod,
      args: [],
      appReferences: [foreignAppId],  // Pass foreign app as reference
    })
    .send()

  if (readResult.returns && readResult.returns.length > 0) {
    const value = readResult.returns[0].returnValue
    console.log(`✅ Read from foreign app: "${value}"`)
  }
  console.log()

  // Summary
  console.log('=== Common Use Cases ===\n')

  console.log('1. DEX/AMM Pools')
  console.log('   - Reference other pool contracts')
  console.log('   - Access liquidity provider accounts')
  console.log('   - Query asset reserves\n')

  console.log('2. Governance Systems')
  console.log('   - Read voting records from other apps')
  console.log('   - Verify token holdings of voters')
  console.log('   - Access proposal states\n')

  console.log('3. NFT Marketplaces')
  console.log('   - Reference NFT asset IDs')
  console.log('   - Verify owner accounts')
  console.log('   - Check collection contracts\n')

  console.log('4. Lending Protocols')
  console.log('   - Access oracle price feeds (foreign apps)')
  console.log('   - Check collateral holdings (foreign assets)')
  console.log('   - Verify borrower accounts\n')

  console.log('5. Cross-Chain Bridges')
  console.log('   - Reference wrapped asset contracts')
  console.log('   - Access validator accounts')
  console.log('   - Query bridge state\n')

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
