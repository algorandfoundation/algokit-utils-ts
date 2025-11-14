# Debug Smart Contract Logic Errors

This example demonstrates how to handle and debug logic errors in smart contracts with detailed error information including error messages, stack traces, program counter information, and TEAL source code context.

## Key Concepts

- **Logic Errors**: Errors that occur during smart contract execution (assert failures, budget exceeded, etc.)
- **Error Handling**: Catching and processing errors from failed contract calls
- **Program Counter (PC)**: The bytecode position where an error occurred
- **Stack Traces**: TEAL source code with error location marked
- **Debugging Information**: Rich error details to help identify and fix issues

## What This Example Shows

1. Deploying a contract with a method that deliberately fails
2. Catching logic errors from failed contract calls
3. Extracting detailed error information
4. Understanding error messages and stack traces
5. Using debugging information to locate issues

## Code Walkthrough

### Deploy Test Application

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const testAccount = algorand.account.random()
await algorand.account.ensureFunded(testAccount, dispenser, (5).algos())

// Deploy TestingApp which has an error() method
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: testAccount.addr,
})

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})
```

Deploy an application with an `error()` method that deliberately fails with `assert(0)`.

### Trigger Logic Error

```typescript
try {
  // Call the error() method which intentionally fails
  await appClient.send.error({ args: [] })

  // This line should never be reached
  console.log('❌ ERROR: Method should have failed!')
} catch (error: any) {
  // Error is caught here
  console.log('✅ Logic error caught as expected!')
}
```

**Key point**: When a smart contract fails, AlgoKit Utils throws an error with rich debugging information.

### Extract Error Information

```typescript
catch (error: any) {
  // Error message
  console.log('Error Message:', error.message)

  // Execution traces (if available)
  if (error.traces) {
    console.log('Traces available:', error.traces.length > 0)
  }

  // Transaction information
  if (error.transaction) {
    console.log('Transaction ID:', error.transaction.txID())
  }

  // Stack trace with TEAL source code
  if (error.stack) {
    console.log(error.stack)
    // Shows TEAL code with error location marked
  }
}
```

**Important**: The error object contains multiple properties with debugging information.

## API Patterns (AlgoKit Utils v9.1.2)

### Error Object Structure

```typescript
interface LogicError extends Error {
  message: string           // Error description
  stack?: string           // Stack trace with TEAL source
  traces?: any[]           // Execution traces
  transaction?: Transaction // Failed transaction
  cause?: Error            // Underlying error
}
```

### Catching Logic Errors

```typescript
try {
  await appClient.send.methodName({ args: [...] })
} catch (error: any) {
  // Check error type
  if (error.message.includes('assert failed')) {
    console.log('Assertion failure in contract')
  } else if (error.message.includes('budget exceeded')) {
    console.log('Computation budget exceeded')
  }

  // Access debugging information
  console.log('Error:', error.message)
  console.log('Stack:', error.stack)
}
```

### Reading Stack Traces

```typescript
if (error.stack) {
  // Stack trace format:
  // // function_name
  // label:
  // opcode // comment
  // opcode <--- Error
  // retsub

  // Parse to find error location
  const lines = error.stack.split('\n')
  const errorLine = lines.find(line => line.includes('<--- Error'))

  if (errorLine) {
    console.log('Error at:', errorLine)
  }
}
```

### Program Counter Information

```typescript
// Error message includes PC information:
// "assert failed pc=885"

// PC indicates the bytecode position
// Can be used to locate the instruction in TEAL bytecode

const match = error.message.match(/pc=(\d+)/)
if (match) {
  const programCounter = parseInt(match[1])
  console.log('Failed at bytecode position:', programCounter)
}
```

## Common Logic Errors

### Assert Failure

```typescript
// Contract code (TEAL):
// assert  // Fails if top of stack is 0

// Example error:
// "assert failed pc=885"

// Cause: A condition check failed
// Solution: Review the assertion logic
```

### Budget Exceeded

```typescript
// Error: "dynamic cost budget exceeded"

// Cause: Contract used too many compute units
// Solution:
// - Optimize contract code
// - Reduce loop iterations
// - Use inner transactions judiciously
// - Consider app pooling
```

### Stack Overflow

```typescript
// Error: "stack overflow"

// Cause: Too many values on the stack
// Solution:
// - Reduce stack usage
// - Use stack manipulation opcodes (dig, swap, etc.)
// - Restructure contract logic
```

### Invalid Operation

```typescript
// Error: "/ arg 0 < 1"

// Cause: Division by zero
// Solution: Add checks before division operations
```

### Invalid Reference

```typescript
// Error: "invalid Account reference"

// Cause: Referencing an account/app/asset not in arrays
// Solution: Ensure all references are passed in transaction
```

## Debugging Workflow

### Step 1: Read the Error Message

```typescript
catch (error: any) {
  console.log(error.message)
  // Example: "assert failed pc=885. at:469."
  // - "assert failed" = type of error
  // - "pc=885" = program counter
  // - "at:469" = line in TEAL source
}
```

### Step 2: Examine the Stack Trace

```typescript
if (error.stack) {
  // Stack trace shows TEAL source code
  // Look for the line marked "<--- Error"
  console.log(error.stack)

  // Example output:
  // // error
  // error_7:
  // proto 0 0
  // intc_0 // 0
  // // Deliberate error
  // assert <--- Error
  // retsub
}
```

### Step 3: Identify the Problem

```typescript
// Common patterns in error messages:
// - "assert failed" → Condition was false
// - "budget exceeded" → Too much computation
// - "stack overflow" → Too many stack values
// - "invalid {type}" → Missing reference
// - "{op} arg {n} {condition}" → Invalid operand
```

### Step 4: Fix and Test

```typescript
// After identifying the issue:
// 1. Fix the contract code
// 2. Redeploy the contract
// 3. Test with same inputs
// 4. Verify error is resolved

try {
  await appClient.send.fixedMethod({ args: [...] })
  console.log('✅ Fixed!')
} catch (error) {
  console.log('Still failing:', error.message)
  // Continue debugging
}
```

## Advanced Debugging Techniques

### Using Simulation

```typescript
// AlgoKit Utils automatically simulates before sending
// Simulation catches errors without committing to blockchain

// To disable simulation (not recommended):
await appClient.send.methodName({
  args: [...],
  skipSimulation: true,  // Sends directly
})
```

### Logging Contract State

```typescript
// Add log statements in your TEAL contract:
// log  // Logs bytes from stack

// Then check logs in successful transactions:
const result = await appClient.send.methodName({ args: [...] })
if (result.confirmation.logs) {
  result.confirmation.logs.forEach(log => {
    console.log('Log:', Buffer.from(log).toString())
  })
}
```

### Testing with Smaller Inputs

```typescript
// If contract fails with large inputs, test with smaller ones:

try {
  // Large input
  await appClient.send.process({ args: [largeArray] })
} catch (error) {
  console.log('Failed with large input')

  // Try with small input
  try {
    await appClient.send.process({ args: [smallArray] })
    console.log('Works with small input - size issue')
  } catch (error2) {
    console.log('Fails with any input - logic issue')
  }
}
```

### Transaction Inspection

```typescript
catch (error: any) {
  if (error.transaction) {
    const txId = error.transaction.txID()
    console.log(`View on AlgoExplorer:`)
    console.log(`https://testnet.algoexplorer.io/tx/${txId}`)

    // Or use algod/indexer to get more details
    const txInfo = await algorand.client.algod
      .pendingTransactionInformation(txId)
      .do()

    console.log('Transaction details:', txInfo)
  }
}
```

### Comparing Traces

```typescript
// Save traces from successful calls
let successTrace: any[] = []

try {
  const result = await appClient.send.workingMethod({ args: [...] })
  if (result.traces) {
    successTrace = result.traces
  }
} catch (error) {
  // Doesn't reach here
}

// Compare with failed call traces
try {
  await appClient.send.brokenMethod({ args: [...] })
} catch (error: any) {
  if (error.traces && successTrace.length > 0) {
    console.log('Success trace steps:', successTrace.length)
    console.log('Failed trace steps:', error.traces.length)
    // Identify where execution diverged
  }
}
```

## Expected Output

```
Test account address: B4BQXC5OF3X4JIDPSHEMSBV2KXXULJ5YQUXLIXEOKBCN3IE546SO47MWVA

=== Deploying Test Application ===

This application has an "error" method that deliberately fails.

✅ App deployed successfully!
App ID: 1641n

=== Triggering Logic Error ===

Calling the "error" method which deliberately fails with assert(0)...

✅ Logic error caught as expected!

═══════════════════════════════════════════════════
📊 ERROR INFORMATION
═══════════════════════════════════════════════════

🔴 Error Message:
   assert failed pc=885. at:469. Error resolving execution info via simulate in transaction 0: transaction ISKJJKNLXMNUJ2U6GR4WUPPVQOQO6CRNGVJ7S24KOF5Z7OUIQ4JQ: logic eval error: assert failed pc=885. Details: app=1641, pc=885, opcodes=proto 0 0; intc_0 // 0; assert

═══════════════════════════════════════════════════
📄 STACK TRACE
═══════════════════════════════════════════════════

// error
error_7:
proto 0 0
intc_0 // 0
// Deliberate error
assert <--- Error
retsub

// create
create_8:

═══════════════════════════════════════════════════
💡 DEBUGGING TIPS
═══════════════════════════════════════════════════

1. Error Message:
   - Read the error message carefully
   - It often indicates the type of failure (assert, stack overflow, etc.)

2. Stack Trace:
   - Shows the JavaScript call stack leading to the error
   - Helps identify where in your code the error originated

3. Transaction ID:
   - Use to look up the transaction on AlgoExplorer or Goal
   - Can view full transaction details and inner transactions

4. Execution Traces:
   - When available, traces show step-by-step execution
   - Helpful for understanding the contract execution path

5. Common Logic Errors:
   - assert(0): Deliberate assertion failure
   - Stack overflow: Too much recursion or stack usage
   - Invalid operation: Division by zero, invalid bytecode, etc.
   - Budget exceeded: Program used too many compute units

6. Debugging Workflow:
   - Add log statements in your contract
   - Test with smaller inputs to isolate the issue
   - Use simulation mode to test without committing
   - Review the TEAL source code and approval program

═══════════════════════════════════════════════════
✨ Example Completed Successfully
═══════════════════════════════════════════════════

You now understand how AlgoKit Utils helps debug smart contract logic errors!

Key Takeaways:
  • Errors provide detailed information for debugging
  • Stack traces help locate issues in your code
  • Transaction IDs can be used for further investigation
  • AlgoKit Utils catches and enriches error information
```

## Running the Example

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execute

```bash
npm start
```

The example will:
1. Create and fund a test account
2. Deploy an application with a failing method
3. Call the method to trigger a logic error
4. Catch the error and display debugging information
5. Show how to interpret error messages and stack traces

## Best Practices

### Always Use Try-Catch

```typescript
// GOOD: Proper error handling
try {
  await appClient.send.methodName({ args: [...] })
} catch (error: any) {
  console.error('Contract call failed:', error.message)
  // Handle error appropriately
}

// BAD: No error handling
await appClient.send.methodName({ args: [...] })
// Error crashes program
```

### Log Error Details

```typescript
catch (error: any) {
  // Log comprehensive error information
  console.error('Error:', {
    message: error.message,
    hasStack: !!error.stack,
    hasTraces: !!error.traces,
    hasTransaction: !!error.transaction,
  })

  // In production, send to error tracking service
  // Sentry.captureException(error)
}
```

### Provide User-Friendly Messages

```typescript
catch (error: any) {
  // Don't show technical details to end users
  if (error.message.includes('assert failed')) {
    throw new Error('Transaction validation failed. Please check your inputs.')
  } else if (error.message.includes('budget exceeded')) {
    throw new Error('Operation too complex. Please simplify your request.')
  } else {
    throw new Error('Transaction failed. Please try again.')
  }
}
```

### Test Error Scenarios

```typescript
// Write tests for error conditions
describe('Contract error handling', () => {
  it('should fail with invalid input', async () => {
    await expect(
      appClient.send.methodName({ args: [invalidInput] })
    ).rejects.toThrow('assert failed')
  })

  it('should provide helpful error message', async () => {
    try {
      await appClient.send.methodName({ args: [invalidInput] })
      fail('Should have thrown')
    } catch (error: any) {
      expect(error.stack).toContain('<--- Error')
      expect(error.message).toContain('pc=')
    }
  })
})
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Debugging Guide](https://developer.algorand.org/docs/get-details/dapps/avm/teal/debugging/)
- [Smart Contract Errors](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/debugging/)
- [AlgoExplorer](https://algoexplorer.io/) - View transactions on-chain
- [Error Handling Best Practices](https://developer.algorand.org/docs/get-started/basics/best_practices/)
