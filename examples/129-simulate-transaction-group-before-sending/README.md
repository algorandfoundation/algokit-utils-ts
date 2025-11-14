# Simulate Transaction Group Before Sending

This example demonstrates how to **simulate a transaction group** before sending it to the blockchain. Transaction simulation is a powerful feature that allows you to preview execution results, validate logic, estimate costs, and debug smart contracts—all without consuming fees or modifying blockchain state.

Understanding simulation is crucial for:
- Testing complex transaction groups before execution
- Debugging smart contract logic and inspecting logs
- Estimating opcode budget and transaction costs
- Validating that transactions will succeed
- Providing better user experiences by showing expected results

## Core Concept

**Transaction simulation** executes transaction logic locally using the Algorand node's simulate endpoint. It processes transactions as if they were sent to the blockchain, but:
- **Does NOT modify blockchain state** - No permanent changes are made
- **Does NOT consume fees or ALGO** - Completely free to run
- **Returns execution results** - Shows logs, return values, and resource usage
- **Validates transaction logic** - Confirms transactions will succeed

This is fundamentally different from actually sending transactions:
- **Simulation**: Preview, validate, debug (free, no blockchain changes)
- **Sending**: Execute, commit, permanent (costs fees, updates blockchain)

## What This Example Shows

### 1. **Deploying a Smart Contract**
Creates a simple contract with three ABI methods:
- `increment()`: Increments a counter and returns the new value (uint64)
- `get_value()`: Returns the current counter value (uint64)
- `set_message(string)`: Sets a message in global state and returns it (string)

### 2. **Building a Transaction Group**
Constructs an atomic group with 3 transactions:
- **Transaction 1**: App call to `increment()` - increments counter from 0 to 1
- **Transaction 2**: Payment - sends 0.001 ALGO to the app address
- **Transaction 3**: App call to `set_message(string)` - updates the message

### 3. **Simulating the Group**
Runs the entire transaction group through simulation to:
- Verify all transactions will succeed
- Preview return values from ABI methods
- Inspect logs from smart contract execution
- Check for any errors before committing

### 4. **Sending the Actual Group**
After validating via simulation, sends the real transaction group to the blockchain.

### 5. **Comparing Results**
Demonstrates that simulation results match actual execution results, proving simulation is an accurate preview.

## The Simulation API

The core simulation call uses the `simulate()` method on a transaction group:

```typescript
import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

const algorand = AlgorandClient.defaultLocalNet()

// Define ABI methods
const incrementMethod = new algosdk.ABIMethod({
  name: 'increment',
  args: [],
  returns: { type: 'uint64' },
})

// Build and simulate transaction group
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: deployer.addr,
    appId,
    method: incrementMethod,
    args: [],
  })
  .addPayment({
    sender: deployer.addr,
    receiver: appAddress,
    amount: microAlgos(1_000),
  })
  .simulate({ allowEmptySignatures: true })

// Access simulation results
console.log('Number of transactions:', simulateResult.simulateResponse.txnGroups[0].txnResults.length)
console.log('Failed at:', simulateResult.simulateResponse.txnGroups[0].failedAt || 'None')

// Inspect individual transaction results
const txnResults = simulateResult.simulateResponse.txnGroups[0].txnResults
txnResults.forEach((result, index) => {
  if (result.txnResult.logs) {
    console.log(`Transaction ${index + 1} logs:`, result.txnResult.logs)
  }
})
```

## Simulation Options

The `simulate()` method accepts several options:

### `allowEmptySignatures` (recommended)
```typescript
.simulate({ allowEmptySignatures: true })
```
- **What it does**: Skips signature validation during simulation
- **When to use**: Read-only previews, cost estimation, validation
- **Benefits**: Faster simulation, no private keys needed
- **Note**: Transactions still need proper signatures when actually sending

### `allowUnnamedResources`
```typescript
.simulate({ allowUnnamedResources: true })
```
- **What it does**: Allows access to unnamed app/asset resources
- **When to use**: Complex apps that dynamically access resources
- **Benefits**: More flexible simulation for advanced contracts

### `fixSigners`
```typescript
.simulate({ fixSigners: true })
```
- **What it does**: Automatically adds missing transaction fields
- **When to use**: When building transactions programmatically
- **Benefits**: Ensures simulation matches actual execution

## Understanding Simulation Results

The simulation response contains detailed information about execution:

```typescript
interface SimulateResponse {
  simulateResponse: {
    txnGroups: Array<{
      txnResults: Array<{
        txnResult: {
          logs?: Uint8Array[]           // Logged data from smart contracts
          poolError?: string            // Error if transaction failed
          appBudgetConsumed?: number    // Opcode budget used
        }
        appCallMessages?: string[]      // App-specific messages
      }>
      failedAt?: number                 // Index of first failed transaction (if any)
      appBudgetAdded?: number          // Total opcode budget added
      appBudgetConsumed?: number       // Total opcode budget consumed
    }>
  }
}
```

### Reading Logs from Simulation

Smart contracts log data using the `log` opcode. Simulation captures these logs:

```typescript
const txnResults = simulateResult.simulateResponse.txnGroups[0].txnResults

txnResults.forEach((result, index) => {
  if (result.txnResult.logs && result.txnResult.logs.length > 0) {
    const lastLog = result.txnResult.logs[result.txnResult.logs.length - 1]
    const logBuffer = Buffer.from(lastLog)

    // Check if it's an ABI return (starts with 0x151f7c75)
    if (logBuffer.length > 4 && logBuffer.readUInt32BE(0) === 0x151f7c75) {
      const returnValue = logBuffer.subarray(4)
      console.log('ABI return value:', returnValue)
    }
  }
})
```

### Checking for Errors

Always verify that simulation succeeded:

```typescript
const txnGroup = simulateResult.simulateResponse.txnGroups[0]

if (txnGroup.failedAt !== undefined) {
  console.error(`Transaction ${txnGroup.failedAt} failed!`)
  const failedTxn = txnGroup.txnResults[txnGroup.failedAt]
  console.error('Error:', failedTxn.txnResult.poolError)
  // Don't send the transaction group!
} else {
  console.log('✅ All transactions will succeed')
  // Safe to send
}
```

## Common Use Cases

### 1. Validating Complex Transaction Groups
Ensure multi-step atomic transactions will all succeed:
```typescript
// Build complex group
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .addAppCallMethodCall({ ... })
  .addAssetTransfer({ ... })
  .simulate({ allowEmptySignatures: true })

// Verify no failures
if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  // Safe to send actual group
  await algorand.newGroup()
    .addAppCallMethodCall({ ... })
    .addPayment({ ... })
    .addAppCallMethodCall({ ... })
    .addAssetTransfer({ ... })
    .send()
}
```

### 2. Estimating Opcode Budget
Preview how much computational budget a transaction will consume:
```typescript
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ sender, appId, method, args })
  .simulate({ allowEmptySignatures: true })

const consumed = simulateResult.simulateResponse.txnGroups[0].appBudgetConsumed
console.log(`This transaction will consume ${consumed} opcode budget`)

// Max budget for a single app call is 700
// Max budget for a group is 700 * number of app calls
if (consumed > 700) {
  console.log('⚠️ Need to use multiple app calls or inner transactions')
}
```

### 3. Debugging Smart Contract Logic
Inspect logs to understand what your contract is doing:
```typescript
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ sender, appId, method, args: [testValue] })
  .simulate({ allowEmptySignatures: true })

// Examine all logs
const txnResults = simulateResult.simulateResponse.txnGroups[0].txnResults
txnResults.forEach((result, idx) => {
  if (result.txnResult.logs) {
    console.log(`Transaction ${idx} logs:`)
    result.txnResult.logs.forEach((log, logIdx) => {
      console.log(`  Log ${logIdx}:`, Buffer.from(log).toString('hex'))
    })
  }
})
```

### 4. Previewing Results for Users
Show users what will happen before they confirm:
```typescript
// Simulate user's transaction
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ sender: user.addr, appId, method: 'swap', args: [tokenA, tokenB, amount] })
  .simulate({ allowEmptySignatures: true })

// Extract return value to show user
const returnValue = parseABIReturn(simulateResult)
console.log(`You will receive ${returnValue} tokens`)

// User confirms, then send actual transaction
if (userConfirms) {
  await algorand.newGroup()
    .addAppCallMethodCall({ sender: user.addr, appId, method: 'swap', args: [tokenA, tokenB, amount] })
    .send()
}
```

### 5. Testing Error Conditions
Verify that invalid inputs are properly rejected:
```typescript
// Test that invalid amount fails
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ sender, appId, method: 'withdraw', args: [invalidAmount] })
  .simulate({ allowEmptySignatures: true })

if (simulateResult.simulateResponse.txnGroups[0].failedAt !== undefined) {
  console.log('✅ Invalid amount correctly rejected')
} else {
  console.log('❌ Contract should have rejected invalid amount!')
}
```

### 6. Estimating Transaction Fees
Calculate total fees before sending:
```typescript
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .addAppCallMethodCall({ ... })
  .simulate({ allowEmptySignatures: true })

// Each transaction typically costs 1000 microAlgos (0.001 ALGO)
const numTxns = simulateResult.simulateResponse.txnGroups[0].txnResults.length
const totalFees = numTxns * 1000
console.log(`Total fees: ${totalFees} microAlgos (${totalFees / 1_000_000} ALGO)`)
```

### 7. Validating State Changes
Verify that state will be updated as expected:
```typescript
// Read current state
const appInfo = await algorand.client.algod.getApplicationByID(appId).do()
const currentCounter = readGlobalState(appInfo, 'counter')

// Simulate increment
const simulateResult = await algorand
  .newGroup()
  .addAppCallMethodCall({ sender, appId, method: incrementMethod, args: [] })
  .simulate({ allowEmptySignatures: true })

// Extract return value (new counter value)
const newCounter = parseABIReturn(simulateResult)
console.log(`Counter will change from ${currentCounter} to ${newCounter}`)
```

## Best Practices

### ✅ 1. Always Simulate Complex Groups
Before sending any multi-transaction atomic group:
```typescript
// ❌ BAD: Send complex group without simulation
await algorand.newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .addAppCallMethodCall({ ... })
  .send()  // Might fail on-chain!

// ✅ GOOD: Simulate first, then send
const simulateResult = await algorand.newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .addAppCallMethodCall({ ... })
  .simulate({ allowEmptySignatures: true })

if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  await algorand.newGroup()
    .addAppCallMethodCall({ ... })
    .addPayment({ ... })
    .addAppCallMethodCall({ ... })
    .send()
}
```

### ✅ 2. Use allowEmptySignatures for Read-Only Previews
Skip expensive signing operations when just previewing:
```typescript
// ✅ GOOD: Fast simulation without signing
.simulate({ allowEmptySignatures: true })

// ❌ SLOW: Unnecessary signing during simulation
.simulate({ allowEmptySignatures: false })
```

### ✅ 3. Check for failedAt
Always verify that all transactions succeeded:
```typescript
// ✅ GOOD: Check for errors
const txnGroup = simulateResult.simulateResponse.txnGroups[0]
if (txnGroup.failedAt !== undefined) {
  console.error(`Transaction ${txnGroup.failedAt} failed`)
  return  // Don't send!
}

// ❌ BAD: Assume simulation succeeded
// Just send without checking
```

### ✅ 4. Inspect Logs for Expected Behavior
Verify that your contract is doing what you expect:
```typescript
// ✅ GOOD: Validate contract behavior via logs
const txnResults = simulateResult.simulateResponse.txnGroups[0].txnResults
const logs = txnResults[0].txnResult.logs || []

if (logs.length === 0) {
  console.warn('Expected logs but got none - contract may not be working correctly')
}

// ❌ BAD: Ignore logs, assume everything is correct
```

### ✅ 5. Don't Rely on Simulation for Production Logic
Simulation is for validation, not as a substitute for sending:
```typescript
// ❌ BAD: Use simulation results as if they modified state
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
const newBalance = getBalanceFromSimulation(simulateResult)
// State wasn't actually changed!

// ✅ GOOD: Simulate to validate, then send to actually modify state
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  const sendResult = await algorand.newGroup().addAppCallMethodCall({ ... }).send()
  const newBalance = readActualState(sendResult)
}
```

### ✅ 6. Be Aware of State Changes Between Simulation and Send
Blockchain state may change between simulation and actual send:
```typescript
// ✅ GOOD: Aware of potential state changes
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })

if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  try {
    await algorand.newGroup().addAppCallMethodCall({ ... }).send()
  } catch (error) {
    // State may have changed between simulation and send
    console.error('Transaction failed despite successful simulation:', error)
  }
}

// ❌ BAD: Assume simulation guarantees success
// If simulation passed, send will always succeed (not true!)
```

### ✅ 7. Use Simulation for All Environments
Simulate in development, testing, and production:
```typescript
// ✅ GOOD: Always simulate before sending
async function sendTransactionSafely(txnGroup) {
  const simulateResult = await txnGroup.simulate({ allowEmptySignatures: true })

  if (simulateResult.simulateResponse.txnGroups[0].failedAt !== undefined) {
    throw new Error('Simulation failed - transaction would fail on-chain')
  }

  return await txnGroup.send()
}

// Use in all environments
await sendTransactionSafely(algorand.newGroup().addAppCallMethodCall({ ... }))
```

## Common Pitfalls

### ❌ Pitfall 1: Not Checking failedAt
```typescript
// ❌ WRONG: Ignore potential failures
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
await algorand.newGroup().addAppCallMethodCall({ ... }).send()  // Might fail!

// ✅ CORRECT: Check failedAt first
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
if (simulateResult.simulateResponse.txnGroups[0].failedAt !== undefined) {
  throw new Error('Simulation failed')
}
await algorand.newGroup().addAppCallMethodCall({ ... }).send()
```

### ❌ Pitfall 2: Using Simulation Results as Actual State
```typescript
// ❌ WRONG: Treat simulation as if it modified state
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
const balance = extractBalanceFromSimulation(simulateResult)
console.log(`New balance: ${balance}`)  // State wasn't actually changed!

// ✅ CORRECT: Send transaction to actually modify state
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  const sendResult = await algorand.newGroup().addAppCallMethodCall({ ... }).send()
  const balance = readActualBalance()
  console.log(`New balance: ${balance}`)
}
```

### ❌ Pitfall 3: Forgetting allowEmptySignatures
```typescript
// ❌ SLOW: Signing transactions during simulation
const simulateResult = await algorand.newGroup()
  .addAppCallMethodCall({ sender, appId, method, args })
  .simulate()  // Will try to sign!

// ✅ FAST: Skip signatures during simulation
const simulateResult = await algorand.newGroup()
  .addAppCallMethodCall({ sender, appId, method, args })
  .simulate({ allowEmptySignatures: true })
```

### ❌ Pitfall 4: Not Simulating Before Sending
```typescript
// ❌ RISKY: Send without validation
await algorand.newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .send()  // Might fail and waste fees!

// ✅ SAFE: Simulate first
const simulateResult = await algorand.newGroup()
  .addAppCallMethodCall({ ... })
  .addPayment({ ... })
  .simulate({ allowEmptySignatures: true })

if (simulateResult.simulateResponse.txnGroups[0].failedAt === undefined) {
  await algorand.newGroup()
    .addAppCallMethodCall({ ... })
    .addPayment({ ... })
    .send()
}
```

### ❌ Pitfall 5: Ignoring Opcode Budget
```typescript
// ❌ WRONG: Don't check budget usage
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
await algorand.newGroup().addAppCallMethodCall({ ... }).send()  // Might exceed budget!

// ✅ CORRECT: Check opcode budget
const simulateResult = await algorand.newGroup().addAppCallMethodCall({ ... }).simulate({ ... })
const consumed = simulateResult.simulateResponse.txnGroups[0].appBudgetConsumed

if (consumed > 700) {
  console.error('Transaction exceeds opcode budget!')
  return
}

await algorand.newGroup().addAppCallMethodCall({ ... }).send()
```

### ❌ Pitfall 6: Simulating Different Transactions Than Sending
```typescript
// ❌ WRONG: Simulate different parameters than actual send
await algorand.newGroup().addAppCallMethodCall({ args: [100] }).simulate({ ... })
await algorand.newGroup().addAppCallMethodCall({ args: [200] }).send()  // Different args!

// ✅ CORRECT: Simulate exact transaction you'll send
const buildTxnGroup = () => algorand.newGroup().addAppCallMethodCall({ args: [100] })

await buildTxnGroup().simulate({ allowEmptySignatures: true })
await buildTxnGroup().send()
```

## Simulation vs Actual Execution

| Aspect | Simulation | Actual Execution |
|--------|------------|------------------|
| **Blockchain State** | Not modified | Modified permanently |
| **Fees** | Free (no fees) | Costs fees (1000 µALGO/txn) |
| **Speed** | Fast (local) | Slower (network + consensus) |
| **Purpose** | Validate & preview | Commit changes |
| **Signatures** | Optional (allowEmptySignatures) | Required |
| **Return Values** | Returned in logs | Returned in logs |
| **Errors** | Preview errors | Errors consume fees |
| **When to Use** | Before sending | When ready to commit |

## Running the Example

### Prerequisites
1. **AlgoKit installed**: `brew install algorand/tap/algokit` (or see [installation guide](https://github.com/algorandfoundation/algokit-cli#install))
2. **Docker installed**: Required for LocalNet
3. **Node.js installed**: Version 18 or higher

### Setup
```bash
# Start LocalNet
algokit localnet start

# Verify algod is running
curl http://localhost:4001/health
```

### Install Dependencies
```bash
npm install
```

### Run the Example
```bash
npm start
```

## Expected Output

The example will:

1. **Deploy smart contract**:
   ```
   === Step 1: Deploy Smart Contract ===
   Contract features:
     - increment(): Increments counter and returns new value
     - get_value(): Returns current counter value
     - set_message(string): Sets a message and returns confirmation

   ✅ App deployed successfully!
      App ID: 1143n
      App Address: NSVPB2ENQLSEBXGKCWUBNU7WJRUYWZ6WDXNTYJ5C4GVDUJQCFZ7HJXNYAY

   Initial Global State:
      counter: 0
      message: initialized
   ```

2. **Simulate transaction group**:
   ```
   === Step 3: Simulate Transaction Group ===
   Simulating without committing to blockchain...

   Simulation Results:
      Number of transactions: 3
      Failed transactions: None

   Transaction Results:

      Transaction 1:
         Logs: 1 log(s)
         ABI Return (raw): 0000000000000001
         ABI Return (decoded): 1 (counter value)

      Transaction 2:

      Transaction 3:
         Logs: 1 log(s)
         ABI Return (raw): 0018001648656c6c6f2066726f6d2073696d756c6174696f6e21
         ABI Return (decoded): "Hello from simulation!"
   ```

3. **Send actual transaction group**:
   ```
   === Step 4: Send Actual Transaction Group ===
   Now sending the transaction group to the blockchain...

   ✅ Transaction group sent successfully!
      Transaction IDs: [
     'NGW4JMYFJEADXI62OBVMY6LMYLHN6KNYOXUWRASAFNWMUYHFLMZA',
     'J6U7UTCE7YU6T7KIUXJ4FM2QNFDGZZDG3BUKY5PUI6INTOF37N2A',
     '75HIHPDSWZ7FJEA5JLJMA5BHI2UCDFWVZRNVNEBR4H2XFIJI4HQQ'
   ]

   Actual Execution Results:
      Return 1: 1n (counter incremented to 1)
      Return 2: "Hello from actual execution!"

   Final Global State (after execution):
      counter: 1
      message: Hello from actual execution!
   ```

4. **Compare results**:
   ```
   === Comparison ===

   Simulation vs Actual Execution:
      Simulated transaction count: 3
      Actual transaction count: 3
      Counts match: ✅ YES

   Key Differences:
      • Simulation: No blockchain changes, no fees consumed
      • Actual: Blockchain updated, fees paid, state changed
      • Simulation: Used for validation and testing
      • Actual: Used for production execution
   ```

5. **Educational content** explaining use cases and best practices

## Key Takeaways

1. **Simulation is free** - No fees, no blockchain changes, unlimited testing
2. **Validates before committing** - Ensures transactions will succeed before spending fees
3. **Returns preview results** - See return values and logs without modifying state
4. **Use allowEmptySignatures** - Skip signing for faster read-only simulation
5. **Check failedAt** - Always verify simulation succeeded before sending
6. **Opcode budget matters** - Simulation shows if you'll exceed computational limits
7. **State may change** - Blockchain state can change between simulation and send
8. **Not a substitute for sending** - Simulation validates, sending commits

## Related Examples

- **128-search-transactions-with-filters-and-pagination**: Query historical transactions after sending
- **124-replace-app-with-schema-breaking-changes**: Using simulation to test app updates

## Production Considerations

When deploying to MainNet or TestNet:

1. **Always simulate first** - Validate transactions before sending to save fees on failures
2. **Handle simulation errors** - Provide useful error messages when simulation fails
3. **Monitor opcode usage** - Track computational costs to optimize contracts
4. **Implement retry logic** - If blockchain state changes between simulation and send
5. **Cache simulation results** - For read-only previews (e.g., showing swap amounts)
6. **Test edge cases** - Use simulation to test error conditions and boundary cases
7. **Log simulation data** - Keep records of simulations for debugging and analytics

## Example Details

```json
{
  "example_id": "129-simulate-transaction-group-before-sending",
  "title": "Simulate Transaction Group Before Sending",
  "summary": "Demonstrates how to simulate a transaction group before sending it to validate logic, preview results, and estimate costs without consuming fees.",
  "language": "typescript",
  "complexity": "moderate",
  "use_case_category": "transaction simulation",
  "specific_use_case": "Simulate a multi-transaction group with app calls and payments, then compare simulation results with actual execution",
  "target_users": [
    "Smart contract developers",
    "Application developers",
    "SDK developers",
    "DApp developers"
  ],
  "features_tested": [
    "transaction simulation",
    "transaction groups",
    "ABI method calls",
    "allowEmptySignatures",
    "log inspection",
    "return value decoding"
  ],
  "feature_tags": [
    "transaction-group",
    "simulation",
    "testing",
    "abi-method-call",
    "payment",
    "validation",
    "debugging"
  ]
}
```
