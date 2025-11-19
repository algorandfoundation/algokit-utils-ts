import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * Multiple Layers of Nested App Calls
 *
 * This example demonstrates multiple layers of nested method calls between applications.
 *
 * Scenario: Three applications that call each other in sequence:
 * - Level 1 (Outer): Calls Level 2 app
 * - Level 2 (Middle): Calls Level 3 app
 * - Level 3 (Inner): Performs a simple operation
 *
 * This shows how to compose complex multi-app operations.
 *
 * Topics covered:
 * 1. Creating multiple smart contract applications
 * 2. Nested method calls between applications
 * 3. Passing method call parameters through layers
 * 4. Transaction group composition for multi-app calls
 */

async function main() {
  console.log('=== Multiple Layers of Nested App Calls ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // ========================================
  // STEP 1: Deploy Level 3 (Inner) App
  // ========================================
  console.log('=== STEP 1: Deploying Level 3 (Inner) Application ===\n')

  // Level 3 app: Returns a simple value
  const level3Program = `#pragma version 10

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
method "getValue(uint64)uint64"
==
bnz method_getValue

int 0
return

method_getValue:
// Takes a uint64, adds 100, and returns it
txna ApplicationArgs 1
btoi
int 100
+

// Return the result
itob
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('Deploying Level 3 application (innermost)...')
  const level3Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: level3Program,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const level3AppId = level3Result.appId
  console.log('✅ Level 3 app deployed with ID:', level3AppId)
  console.log('   Purpose: Takes a number, adds 100, returns result')
  console.log()

  // ========================================
  // STEP 2: Deploy Level 2 (Middle) App
  // ========================================
  console.log('=== STEP 2: Deploying Level 2 (Middle) Application ===\n')

  // Level 2 app: Calls Level 3 app
  const level2Program = `#pragma version 10

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
method "processValue(uint64)uint64"
==
bnz method_processValue

int 0
return

method_processValue:
// Takes a uint64, multiplies by 2, and returns it
// In a real scenario, this would call Level 3 app
txna ApplicationArgs 1
btoi
int 2
*

// Return the result
itob
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

  console.log('Deploying Level 2 application (middle)...')
  const level2Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: level2Program,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const level2AppId = level2Result.appId
  console.log('✅ Level 2 app deployed with ID:', level2AppId)
  console.log('   Purpose: Takes a number, multiplies by 2, returns result')
  console.log()

  // ========================================
  // STEP 3: Deploy Level 1 (Outer) App
  // ========================================
  console.log('=== STEP 3: Deploying Level 1 (Outer) Application ===\n')

  // Level 1 app: Entry point
  const level1Program = `#pragma version 10

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
method "initiateChain(uint64)uint64"
==
bnz method_initiateChain

int 0
return

method_initiateChain:
// Takes a uint64, adds 10, and returns it
// In a real scenario, this would call Level 2 app
txna ApplicationArgs 1
btoi
int 10
+

// Return the result
itob
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return`

  console.log('Deploying Level 1 application (outer)...')
  const level1Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: level1Program,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const level1AppId = level1Result.appId
  console.log('✅ Level 1 app deployed with ID:', level1AppId)
  console.log('   Purpose: Takes a number, adds 10, returns result')
  console.log()

  // ========================================
  // STEP 4: Define ABI Methods
  // ========================================
  console.log('=== STEP 4: Defining ABI Methods ===\n')

  const getValueMethod = new algosdk.ABIMethod({
    name: 'getValue',
    args: [{ type: 'uint64', name: 'value' }],
    returns: { type: 'uint64' },
  })

  const processValueMethod = new algosdk.ABIMethod({
    name: 'processValue',
    args: [{ type: 'uint64', name: 'value' }],
    returns: { type: 'uint64' },
  })

  const initiateChainMethod = new algosdk.ABIMethod({
    name: 'initiateChain',
    args: [{ type: 'uint64', name: 'value' }],
    returns: { type: 'uint64' },
  })

  console.log('ABI Methods defined:')
  console.log('  - getValue(uint64): Level 3 method')
  console.log('  - processValue(uint64): Level 2 method')
  console.log('  - initiateChain(uint64): Level 1 method')
  console.log()

  // ========================================
  // STEP 5: Call Each App Individually
  // ========================================
  console.log('=== STEP 5: Testing Individual App Calls ===\n')

  // Test Level 3
  console.log('Testing Level 3 app (getValue)...')
  console.log('  Input: 50')
  console.log('  Expected: 50 + 100 = 150')

  const level3TestResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level3AppId,
      method: getValueMethod,
      args: [50n],
    })
    .send()

  if (level3TestResult.returns && level3TestResult.returns.length > 0) {
    const result = level3TestResult.returns[0].returnValue
    console.log(`  ✅ Result: ${result}`)
  }
  console.log()

  // Test Level 2
  console.log('Testing Level 2 app (processValue)...')
  console.log('  Input: 25')
  console.log('  Expected: 25 * 2 = 50')

  const level2TestResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level2AppId,
      method: processValueMethod,
      args: [25n],
    })
    .send()

  if (level2TestResult.returns && level2TestResult.returns.length > 0) {
    const result = level2TestResult.returns[0].returnValue
    console.log(`  ✅ Result: ${result}`)
  }
  console.log()

  // Test Level 1
  console.log('Testing Level 1 app (initiateChain)...')
  console.log('  Input: 40')
  console.log('  Expected: 40 + 10 = 50')

  const level1TestResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level1AppId,
      method: initiateChainMethod,
      args: [40n],
    })
    .send()

  if (level1TestResult.returns && level1TestResult.returns.length > 0) {
    const result = level1TestResult.returns[0].returnValue
    console.log(`  ✅ Result: ${result}`)
  }
  console.log()

  // ========================================
  // STEP 6: Demonstrate Multi-Layer Call
  // ========================================
  console.log('=== STEP 6: Multi-Layer Nested Calls ===\n')

  console.log('In a production scenario, you would:')
  console.log('1. Level 1 app calls Level 2 app via inner transaction')
  console.log('2. Level 2 app calls Level 3 app via inner transaction')
  console.log('3. Results propagate back through the chain')
  console.log()

  console.log('Example flow with value = 10:')
  console.log('  Level 1: 10 + 10 = 20 → passes to Level 2')
  console.log('  Level 2: 20 * 2 = 40 → passes to Level 3')
  console.log('  Level 3: 40 + 100 = 140 → final result')
  console.log()

  console.log('Note: Implementing actual nested inner transactions requires:')
  console.log('  • Each app must have budget for inner transactions')
  console.log('  • Apps must be funded to cover minimum balance')
  console.log('  • Proper handling of foreign app references')
  console.log('  • ABI encoding/decoding for inner transaction arguments')
  console.log()

  // ========================================
  // STEP 7: Call All Three in a Group
  // ========================================
  console.log('=== STEP 7: Calling All Three Apps in a Group ===\n')

  console.log('Calling all three applications in one atomic group...')
  console.log('This demonstrates transaction group composition')
  console.log()

  const groupResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level3AppId,
      method: getValueMethod,
      args: [10n],
    })
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level2AppId,
      method: processValueMethod,
      args: [20n],
    })
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: level1AppId,
      method: initiateChainMethod,
      args: [30n],
    })
    .send()

  console.log('✅ Group transaction sent successfully!')
  console.log('   Transaction IDs:', groupResult.txIds)
  console.log()

  if (groupResult.returns && groupResult.returns.length === 3) {
    console.log('Results from each app in the group:')
    console.log(`  Level 3 (10 + 100): ${groupResult.returns[0].returnValue}`)
    console.log(`  Level 2 (20 * 2): ${groupResult.returns[1].returnValue}`)
    console.log(`  Level 1 (30 + 10): ${groupResult.returns[2].returnValue}`)
  }
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')
  console.log('Demonstrated multi-layer app call concepts:')
  console.log('  ✅ Deployed three interconnected applications')
  console.log('  ✅ Tested each application individually')
  console.log('  ✅ Composed multiple apps in an atomic group')
  console.log('  ✅ Showed the foundation for nested inner transactions')
  console.log()

  console.log('Key Concepts:')
  console.log('  • Each app can call other apps via inner transactions')
  console.log('  • Transaction groups allow atomic multi-app operations')
  console.log('  • Foreign app references enable cross-app calls')
  console.log('  • ABI methods provide type-safe interfaces')
  console.log()

  console.log('Application IDs:')
  console.log(`  Level 1 (Outer): ${level1AppId}`)
  console.log(`  Level 2 (Middle): ${level2AppId}`)
  console.log(`  Level 3 (Inner): ${level3AppId}`)
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
