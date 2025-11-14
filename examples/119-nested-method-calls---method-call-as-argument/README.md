# Example 119: Nested Method Calls - Method Call as Argument

This example demonstrates how to compose method calls where one method accepts another method call as an argument, enabling advanced ABI composability patterns in Algorand smart contracts.

## Core Concept

In Algorand's ABI (Application Binary Interface), methods can accept various types of arguments including primitive types (uint64, string, etc.) and complex types like **application calls** (`appl` type). This enables powerful composability where one method can execute another method and use its result.

Key characteristics:
- **Method composition**: Methods can call other methods as part of their execution
- **ABI type `appl`**: Special argument type representing an application call
- **Atomic execution**: Inner and outer method calls execute together in a transaction group
- **Return value access**: Both inner and outer methods can return values
- **Cross-contract orchestration**: Enables complex multi-contract workflows

## What This Example Shows

This example demonstrates:

1. **Defining ABI methods**: Creating method signatures with application call arguments
2. **Inner method call composition**: Structuring a method call to be used as an argument
3. **Passing method calls as arguments**: Using `AppCallMethodCall` type
4. **Transaction group formation**: How nested calls become grouped transactions
5. **Educational API pattern**: Understanding the pattern without requiring deployment

## Method Composition Structure

```
Outer Method Call: methodArg(appl)
├─ Argument: Inner Method Call
│  └─ Method: helloWorld()
│     Returns: string
├─ Executes: helloWorld() first
├─ Processes: Result from helloWorld()
└─ Returns: uint64 (app ID)

Transaction Group:
┌─────────────────────────────────────────┐
│ [0] Inner App Call                      │
│     Method: helloWorld()                │
│     Returns: "Hello, World!"            │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ [1] Outer App Call                      │
│     Method: methodArg(appl)             │
│     Arg: Reference to transaction [0]   │
│     Returns: appId (uint64)             │
└─────────────────────────────────────────┘
```

## ABI Method Definitions

### Inner Method: helloWorld()

```typescript
const helloWorldMethod = new algosdk.ABIMethod({
  name: 'helloWorld',
  args: [],
  returns: { type: 'string', desc: 'Returns a greeting message' },
})
```

This method:
- Takes no arguments
- Returns a string value
- Will be executed as the inner call

### Outer Method: methodArg(appl)

```typescript
const methodArgMethod = new algosdk.ABIMethod({
  name: 'methodArg',
  args: [{
    type: 'appl',
    name: 'innerCall',
    desc: 'An inner application call to execute'
  }],
  returns: { type: 'uint64', desc: 'Returns the app ID of the inner call' },
})
```

This method:
- Takes an application call as argument (type: `appl`)
- Executes the inner call
- Returns the app ID as uint64

## Key API Pattern

The critical pattern for nested method calls is:

```typescript
// Step 1: Define the inner method call
const helloWorldCall: AppCallMethodCall = {
  sender: alice.addr,
  appId: appId,
  method: helloWorldMethod,
}

// Step 2: Pass it as an argument to the outer method
await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: alice.addr,
    appId: appId,
    method: methodArgMethod,
    args: [helloWorldCall], // Inner call as argument
  })
  .send()
```

Key points:
- Use `AppCallMethodCall` type for the inner call definition
- Include `sender`, `appId`, and `method` properties
- Pass the inner call object in the `args` array
- The framework automatically handles transaction group creation

## Step-by-Step Breakdown

### Step 1: Initialize AlgorandClient

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const alice = (await algorand.account.localNetDispenser()).account
```

### Step 2: Deploy Your Smart Contract

Your contract needs methods that support this pattern:

```python
# PyTeal example
@app.external
def helloWorld() -> Bytes:
    return Bytes("Hello, World!")

@app.external
def methodArg(innerCall: abi.ApplicationCallTransaction) -> abi.Uint64:
    # The inner call is automatically executed
    # You can access its return value and other properties
    return abi.Uint64(innerCall.application_id())
```

### Step 3: Define ABI Methods

```typescript
const helloWorldMethod = new algosdk.ABIMethod({
  name: 'helloWorld',
  args: [],
  returns: { type: 'string', desc: 'Returns a greeting message' },
})

const methodArgMethod = new algosdk.ABIMethod({
  name: 'methodArg',
  args: [{ type: 'appl', name: 'innerCall', desc: 'An inner application call to execute' }],
  returns: { type: 'uint64', desc: 'Returns the app ID of the inner call' },
})
```

### Step 4: Compose the Inner Method Call

```typescript
const helloWorldCall: AppCallMethodCall = {
  sender: alice.addr,
  appId: appId,
  method: helloWorldMethod,
}
```

This creates a method call definition that can be:
- Passed as an argument to another method
- Executed as part of a transaction group
- Used to compose complex workflows

### Step 5: Call the Outer Method with Inner Call as Argument

```typescript
const methodArgResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: alice.addr,
    appId: appId,
    method: methodArgMethod,
    args: [helloWorldCall],
  })
  .send()
```

### Step 6: Access Return Values

```typescript
// Return value from inner call (helloWorld)
const innerResult = methodArgResult.returns?.[0].returnValue?.valueOf()
console.log('Inner call result:', innerResult) // "Hello, World!"

// Return value from outer call (methodArg)
const outerResult = methodArgResult.returns?.[1].returnValue?.valueOf()
console.log('Outer call result:', outerResult) // appId as bigint
```

## Use Cases

### 1. Oracle Data Fetching

Fetch data from an oracle contract and process it in one atomic operation:

```typescript
const oracleCall: AppCallMethodCall = {
  sender: user.addr,
  appId: oracleAppId,
  method: getPriceMethod,
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: dexAppId,
    method: swapWithOraclePriceMethod,
    args: [oracleCall], // Fetches price and uses it for swap
  })
  .send()
```

### 2. Multi-Contract DeFi Operations

Execute operations across multiple DeFi protocols:

```typescript
const stakingCall: AppCallMethodCall = {
  sender: user.addr,
  appId: stakingProtocolId,
  method: stakeMethod,
  args: [amount],
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: yieldAggregatorId,
    method: depositAndStakeMethod,
    args: [stakingCall],
  })
  .send()
```

### 3. Modular Validation Workflows

Chain validation and execution across modular contracts:

```typescript
const validationCall: AppCallMethodCall = {
  sender: user.addr,
  appId: validatorAppId,
  method: validateMethod,
  args: [data],
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: executorAppId,
    method: executeIfValidMethod,
    args: [validationCall], // Only executes if validation passes
  })
  .send()
```

### 4. Governance Voting and Execution

Vote and execute in one atomic operation:

```typescript
const voteCall: AppCallMethodCall = {
  sender: voter.addr,
  appId: governanceAppId,
  method: castVoteMethod,
  args: [proposalId, vote],
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: executor.addr,
    appId: governanceAppId,
    method: voteAndExecuteMethod,
    args: [voteCall],
  })
  .send()
```

### 5. Multi-Step Asset Transfers

Complex asset transfer workflows:

```typescript
const approvalCall: AppCallMethodCall = {
  sender: approver.addr,
  appId: custodyAppId,
  method: approveTransferMethod,
  args: [recipient, amount],
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: operator.addr,
    appId: custodyAppId,
    method: transferWithApprovalMethod,
    args: [approvalCall],
  })
  .send()
```

## Transaction Group Mechanics

### Automatic Group Formation

When you pass a method call as an argument:

1. The inner method call is converted to a transaction
2. The outer method call is created as a separate transaction
3. Both transactions are automatically grouped with the same group ID
4. The inner transaction is referenced in the outer transaction's arguments
5. The entire group is signed and sent atomically

### Group Size Considerations

```typescript
// This creates a group of 2 transactions:
// [0] Inner call
// [1] Outer call

// If the outer method also takes method call args:
const innerCall: AppCallMethodCall = { /* ... */ }
const middleCall: AppCallMethodCall = {
  /* ... */
  args: [innerCall], // Creates 2 txns
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    /* ... */
    args: [middleCall], // Creates 3 txns total
  })
  .send()

// Transaction group:
// [0] Innermost call
// [1] Middle call (references [0])
// [2] Outer call (references [1])
```

Maximum group size is 16 transactions, so plan your nesting accordingly.

## Smart Contract Implementation

### PyTeal Example

```python
from pyteal import *
from beaker import *

app = Application("NestedMethodExample")

@app.external
def helloWorld() -> Bytes:
    """Simple method that returns a greeting."""
    return Bytes("Hello, World!")

@app.external
def methodArg(innerCall: abi.ApplicationCallTransaction) -> abi.Uint64:
    """
    Accepts an application call as an argument.
    The inner call is automatically executed by the framework.
    """
    return abi.Uint64(innerCall.application_id())
```

### TEAL Validation

```teal
// In the methodArg implementation, you can validate:

// 1. Verify we're in a group
global GroupSize
int 2
==
assert

// 2. Verify the previous transaction is an app call
gtxn 0 TypeEnum
int appl
==
assert

// 3. Verify the app being called
gtxn 0 ApplicationID
int EXPECTED_APP_ID
==
assert

// 4. Access the inner call's arguments or results
gtxn 0 ApplicationArgs 0
// ... process the inner call data
```

## Common Patterns

### Pattern 1: Data Fetching + Processing

```typescript
// Fetch data from one contract, process in another
const dataFetchCall: AppCallMethodCall = {
  sender: user.addr,
  appId: dataSourceAppId,
  method: fetchDataMethod,
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: processorAppId,
    method: processDataMethod,
    args: [dataFetchCall],
  })
  .send()
```

### Pattern 2: Conditional Execution

```typescript
// Execute action only if condition check passes
const conditionCall: AppCallMethodCall = {
  sender: user.addr,
  appId: validatorAppId,
  method: checkConditionMethod,
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: executorAppId,
    method: executeIfMethod,
    args: [conditionCall],
  })
  .send()
```

### Pattern 3: Cross-Protocol Interactions

```typescript
// Interact with multiple protocols atomically
const protocol1Call: AppCallMethodCall = {
  sender: user.addr,
  appId: protocol1Id,
  method: prepareMethod,
}

await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: protocol2Id,
    method: completeMethod,
    args: [protocol1Call],
  })
  .send()
```

## Best Practices

### 1. Order Matters for Validation

The inner call is always positioned before the outer call in the transaction group:

```typescript
// ✅ Good: Inner call can be validated by outer call
const innerCall: AppCallMethodCall = { /* ... */ }
await algorand.newGroup().addAppCallMethodCall({
  args: [innerCall], // Inner call is txn[0], outer is txn[1]
}).send()
```

### 2. Use Type-Safe ABI Definitions

Always define your ABI methods with proper types:

```typescript
// ✅ Good: Clear type definition
const method = new algosdk.ABIMethod({
  name: 'methodArg',
  args: [{ type: 'appl', name: 'innerCall', desc: 'Application call to execute' }],
  returns: { type: 'uint64', desc: 'Result of execution' },
})

// ❌ Bad: Missing or unclear types
const method = new algosdk.ABIMethod({
  name: 'methodArg',
  args: [{ type: 'appl' }], // No name or description
  returns: { type: 'uint64' },
})
```

### 3. Document Expected Call Structure

```typescript
/**
 * Calls the DeFi protocol with oracle price data.
 *
 * Expected structure:
 * - Inner call: fetchPrice() from oracle contract
 * - Outer call: swap(appl) with price data
 *
 * @param oracleAppId - The oracle application ID
 * @param dexAppId - The DEX application ID
 */
async function swapWithOraclePrice(oracleAppId: bigint, dexAppId: bigint) {
  const priceCall: AppCallMethodCall = {
    sender: user.addr,
    appId: oracleAppId,
    method: fetchPriceMethod,
  }

  return await algorand.newGroup().addAppCallMethodCall({
    sender: user.addr,
    appId: dexAppId,
    method: swapMethod,
    args: [priceCall],
  }).send()
}
```

### 4. Handle Return Values Appropriately

```typescript
const result = await algorand.newGroup().addAppCallMethodCall({
  /* ... */
  args: [innerCall],
}).send()

// Access inner call result (index 0)
const innerResult = result.returns?.[0]?.returnValue?.valueOf()

// Access outer call result (index 1)
const outerResult = result.returns?.[1]?.returnValue?.valueOf()

// Check for errors
if (!innerResult || !outerResult) {
  throw new Error('Method calls did not return expected values')
}
```

### 5. Validate Group Structure in Smart Contracts

Always validate the transaction group structure:

```teal
// Ensure correct group size
global GroupSize
int 2
==
assert

// Verify transaction types
gtxn 0 TypeEnum
int appl
==
assert

// Verify the inner call target
gtxn 0 ApplicationID
int EXPECTED_APP_ID
==
assert
```

## Security Considerations

### 1. Validate Inner Call Target

Always verify the inner call is calling the expected application:

```teal
// Verify the inner call is to a trusted app
gtxn 0 ApplicationID
int TRUSTED_APP_ID
==
assert
```

### 2. Check Method Signatures

Validate that the inner call is calling the expected method:

```teal
// Check the method selector (first 4 bytes of arg 0)
gtxn 0 ApplicationArgs 0
method "expectedMethod(uint64)void"
==
assert
```

### 3. Prevent Reentrancy

Be careful with nested calls that might create reentrancy vulnerabilities:

```teal
// Use state flags to prevent reentrancy
int 0 // global state key for "is_executing"
app_global_get
int 0
==
assert // Must not be executing

int 0
int 1
app_global_put // Set executing flag

// ... perform operations ...

int 0
int 0
app_global_put // Clear executing flag
```

### 4. Validate Call Arguments

If the inner call takes arguments, validate them:

```teal
// Verify inner call argument
gtxn 0 ApplicationArgs 1
btoi
int 1000000 // Minimum value
>=
assert
```

### 5. Check for Rekeying

Prevent unauthorized rekeying in nested calls:

```teal
// Ensure no rekeying in inner call
gtxn 0 RekeyTo
global ZeroAddress
==
assert
```

## Error Handling

### Transaction Group Validation

```typescript
try {
  const result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: user.addr,
      appId: appId,
      method: methodArgMethod,
      args: [innerCall],
    })
    .send()
} catch (error) {
  if (error.message.includes('logic eval error')) {
    console.error('Smart contract rejected the nested call')
  } else if (error.message.includes('invalid group')) {
    console.error('Transaction group structure is invalid')
  } else if (error.message.includes('does not exist')) {
    console.error('Application does not exist')
  }
  throw error
}
```

### Return Value Validation

```typescript
const result = await algorand.newGroup().addAppCallMethodCall({
  /* ... */
}).send()

// Validate return values exist
if (!result.returns || result.returns.length !== 2) {
  throw new Error('Expected 2 return values from nested call')
}

// Validate return types
const innerReturn = result.returns[0]?.returnValue
const outerReturn = result.returns[1]?.returnValue

if (!innerReturn || !outerReturn) {
  throw new Error('Missing return values')
}
```

## Debugging Tips

### 1. Log Transaction Group Structure

```typescript
console.log('Transaction group structure:')
console.log('  [0] Inner call:', innerCall.method.name)
console.log('  [1] Outer call:', methodArgMethod.name)
```

### 2. Inspect Transaction IDs

```typescript
const result = await algorand.newGroup().addAppCallMethodCall({
  /* ... */
}).send()

console.log('Transaction IDs:')
result.txIds.forEach((txId, i) => {
  console.log(`  [${i}] ${txId}`)
})
```

### 3. Check Group ID

```typescript
// All transactions in a group share the same group ID
console.log('Group ID:', result.groupId)
```

### 4. Test Individual Methods First

```typescript
// Test the inner method independently
const innerResult = await algorand
  .newGroup()
  .addAppCallMethodCall({
    sender: user.addr,
    appId: appId,
    method: helloWorldMethod,
  })
  .send()

console.log('Inner method works:', innerResult.returns?.[0])

// Then test with nesting
```

## Common Pitfalls

### Pitfall 1: Wrong Argument Type

```typescript
// ❌ Wrong: Passing a transaction object
await algorand.newGroup().addAppCallMethodCall({
  args: [paymentTxn], // This is not an AppCallMethodCall
}).send()

// ✅ Correct: Passing an AppCallMethodCall
const innerCall: AppCallMethodCall = {
  sender: user.addr,
  appId: appId,
  method: method,
}
await algorand.newGroup().addAppCallMethodCall({
  args: [innerCall],
}).send()
```

### Pitfall 2: Missing Required Properties

```typescript
// ❌ Wrong: Missing sender
const innerCall: AppCallMethodCall = {
  appId: appId,
  method: method,
}

// ✅ Correct: All required properties
const innerCall: AppCallMethodCall = {
  sender: user.addr,
  appId: appId,
  method: method,
}
```

### Pitfall 3: Incorrect App ID Type

```typescript
// ❌ Wrong: Using number instead of bigint
const appId = 1234 // number
const innerCall: AppCallMethodCall = {
  sender: user.addr,
  appId: appId, // TypeScript error
  method: method,
}

// ✅ Correct: Using bigint
const appId = 1234n // bigint
const innerCall: AppCallMethodCall = {
  sender: user.addr,
  appId: appId,
  method: method,
}
```

### Pitfall 4: Not Handling Both Return Values

```typescript
// ❌ Wrong: Only checking one return value
const result = await algorand.newGroup().addAppCallMethodCall({
  args: [innerCall],
}).send()
const value = result.returns?.[0] // Only checking inner call

// ✅ Correct: Handling both
const innerValue = result.returns?.[0]?.returnValue?.valueOf()
const outerValue = result.returns?.[1]?.returnValue?.valueOf()
```

## Educational Note

This example demonstrates the **API pattern** for nested method calls without requiring a deployed contract. The code shows:

- How to structure `AppCallMethodCall` objects
- How to pass method calls as arguments
- What the resulting transaction group looks like
- How to access return values from nested calls

To use this pattern in a real application:

1. Deploy a smart contract with methods that accept `appl` type arguments
2. Replace the placeholder `appId` with your actual application ID
3. Uncomment the execution code
4. Run the transactions against your deployed contract

For a working implementation, see the test at [src/types/algorand-client.spec.ts](../../src/types/algorand-client.spec.ts) which includes the full integration test with a deployed contract.

## Related Examples

- [Example 24: Method Calls with ABI](../24-method-calls-with-abi/README.md) - Basic ABI method calls
- [Example 25: Method Calls with Transaction Args](../25-method-calls-with-transaction-args/README.md) - Methods accepting transaction arguments
- [Example 118: Multi-Account Transaction Groups](../118-multi-account-transaction-groups-with-different-signers/README.md) - Transaction groups with multiple signers

## Running This Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

The example will display:

1. **Educational Overview**: Explanation of the nested method call pattern
2. **API Pattern**: Code examples showing how to structure the calls
3. **What Happens**: Step-by-step explanation of execution
4. **Expected Results**: What return values to expect
5. **Key Takeaways**: Summary of important concepts
6. **Common Patterns**: Real-world use cases
7. **Instructions**: How to adapt for a real contract

This is an educational example that demonstrates the API without requiring LocalNet or a deployed contract.

## Key Takeaways

1. **Methods can accept method calls**: Use ABI type `appl` for method call arguments
2. **Automatic group formation**: Framework handles transaction grouping automatically
3. **Atomic execution**: Inner and outer calls succeed or fail together
4. **Multiple return values**: Both inner and outer methods can return values
5. **Powerful composability**: Enables complex cross-contract workflows
6. **Order is preserved**: Inner call is always positioned before outer call
7. **Use AppCallMethodCall type**: Type-safe structure for defining nested calls
8. **Validate in smart contracts**: Always verify group structure and call targets

This pattern is essential for building sophisticated, composable smart contract applications on Algorand!
