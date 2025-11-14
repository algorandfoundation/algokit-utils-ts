# Debug TEAL Logic Errors with Enhanced Error Messages

This example demonstrates how AlgoKit Utils automatically provides **enhanced error messages** when TEAL logic errors occur during smart contract execution. These enhanced messages make debugging significantly easier by providing rich context about what went wrong and where.

## Key Concepts

- **Enhanced Error Messages**: AlgoKit Utils enriches raw Algorand errors with additional debugging information
- **TEAL Stack Traces**: Shows the exact TEAL source code where errors occur, marked with `<--- Error`
- **Program Counter (PC)**: The bytecode position where the error occurred
- **Source Line Numbers**: Maps bytecode errors back to TEAL source lines
- **Automatic Enrichment**: No configuration needed - errors are automatically enhanced

## What This Example Shows

1. Deploying a contract with a method that deliberately fails
2. Triggering a logic error (assert failure)
3. Catching the enhanced error with rich debugging information
4. Extracting and displaying error details (PC, line number, transaction ID)
5. Understanding the TEAL stack trace with error location marked
6. Comparing enhanced errors vs. raw Algorand errors

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

### Trigger and Catch Enhanced Error

```typescript
try {
  // Call the error() method which intentionally fails
  await appClient.send.error({ args: [] })

  // This line should never be reached
  console.log('❌ ERROR: Method should have failed!')
} catch (error: any) {
  // Error is caught here with enhanced information
  console.log('✅ Logic error caught as expected!')

  // Access the enhanced error message
  console.log('Error Message:', error.message)
  // "assert failed pc=885. at:469. ..."
}
```

**Key point**: AlgoKit Utils automatically enriches the error with debugging information before throwing.

### Extract Error Details

```typescript
catch (error: any) {
  // Parse Program Counter from error message
  const pcMatch = error.message.match(/pc=(\d+)/)
  if (pcMatch) {
    console.log(`Program Counter: ${pcMatch[1]}`)
  }

  // Parse source line number
  const lineMatch = error.message.match(/at:(\d+)/)
  if (lineMatch) {
    console.log(`TEAL Source Line: ${lineMatch[1]}`)
  }

  // Access transaction ID
  if (error.transaction) {
    console.log(`Transaction ID: ${error.transaction.txID()}`)
  }

  // Check for execution traces
  if (error.traces && error.traces.length > 0) {
    console.log(`Execution traces available: ${error.traces.length} entries`)
  }
}
```

**Important**: The error object contains multiple properties with structured debugging information.

### Display TEAL Stack Trace

```typescript
if (error.stack) {
  const stackLines = error.stack.split('\n')

  // Find the line marked with "<--- Error"
  let errorLineIndex = -1
  for (let i = 0; i < stackLines.length; i++) {
    if (stackLines[i].includes('<--- Error')) {
      errorLineIndex = i
      break
    }
  }

  if (errorLineIndex !== -1) {
    // Show context around the error
    const startIndex = Math.max(0, errorLineIndex - 5)
    const endIndex = Math.min(stackLines.length, errorLineIndex + 6)

    const relevantLines = stackLines.slice(startIndex, endIndex)
    console.log(relevantLines.join('\n'))

    // Example output:
    // // error
    // error_7:
    // proto 0 0
    // intc_0 // 0
    // // Deliberate error
    // assert <--- Error
    // retsub
  }
}
```

**Important**: The stack trace shows TEAL source code with the exact instruction that failed marked.

## API Patterns (AlgoKit Utils v9.1.2)

### Enhanced Error Object Structure

```typescript
interface EnhancedError extends Error {
  message: string           // Enhanced message with PC and line info
  stack?: string           // Stack trace with TEAL source
  traces?: any[]           // Execution traces (if available)
  transaction?: Transaction // Failed transaction
  cause?: Error            // Original underlying error
}
```

### Error Message Format

```typescript
// Enhanced error message format:
// "assert failed pc=885. at:469. Error resolving execution info..."
//  ^^^^^^^^^^^^^ ^^^^^^  ^^^^^^
//  Error type    PC      Line number

// Components:
// 1. Error type: "assert failed", "budget exceeded", etc.
// 2. PC (Program Counter): Bytecode position
// 3. Line number: Source line in TEAL (if available)
// 4. Transaction details and additional context
```

### Parsing Error Information

```typescript
function parseErrorDetails(error: any) {
  const details: any = {
    type: null,
    pc: null,
    line: null,
    txId: null,
  }

  // Extract error type
  if (error.message.includes('assert failed')) {
    details.type = 'assert_failed'
  } else if (error.message.includes('budget exceeded')) {
    details.type = 'budget_exceeded'
  } else if (error.message.includes('stack overflow')) {
    details.type = 'stack_overflow'
  }

  // Extract Program Counter
  const pcMatch = error.message.match(/pc=(\d+)/)
  if (pcMatch) {
    details.pc = parseInt(pcMatch[1])
  }

  // Extract source line
  const lineMatch = error.message.match(/at:(\d+)/)
  if (lineMatch) {
    details.line = parseInt(lineMatch[1])
  }

  // Get transaction ID
  if (error.transaction) {
    details.txId = error.transaction.txID()
  }

  return details
}
```

### Finding Error in Stack Trace

```typescript
function findErrorInStack(stackTrace: string): string | null {
  const lines = stackTrace.split('\n')

  // Find the line marked with "<--- Error"
  const errorIndex = lines.findIndex(line => line.includes('<--- Error'))

  if (errorIndex === -1) {
    return null
  }

  // Get context: 3 lines before and after
  const start = Math.max(0, errorIndex - 3)
  const end = Math.min(lines.length, errorIndex + 4)

  return lines.slice(start, end).join('\n')
}

// Usage:
try {
  await appClient.send.error({ args: [] })
} catch (error: any) {
  const errorContext = findErrorInStack(error.stack)
  if (errorContext) {
    console.log('Error location in TEAL:')
    console.log(errorContext)
  }
}
```

## Enhanced vs. Raw Errors

### Without AlgoKit Utils (Raw Error)

```
❌ Error: TransactionPool.Remember: transaction ABCD...: logic eval error

Problems:
- Generic error message
- No indication of where the error occurred
- No TEAL source code context
- Just a program counter number (meaningless without source map)
- Difficult to debug and fix
```

### With AlgoKit Utils (Enhanced Error)

```
✅ Error: assert failed pc=885. at:469. Error resolving execution info...

Benefits:
- Specific error type ("assert failed")
- Program Counter (pc=885)
- Source line number (at:469)
- Full TEAL stack trace with source code
- Error location marked with "<--- Error"
- Transaction ID for investigation
- Execution traces for step-by-step debugging

TEAL Stack Trace:
// error
error_7:
proto 0 0
intc_0 // 0
// Deliberate error
assert <--- Error  ← Exact failure point!
retsub
```

## Common Error Types

### Assert Failed

```typescript
// Error message:
// "assert failed pc=123"

// Meaning: An assert instruction evaluated to 0 (false)

// Common causes:
// - Condition check failed (e.g., balance check, authorization)
// - Invalid input validation
// - State verification failed
// - Deliberately failed assertion

// Example TEAL:
// txn Amount
// int 1000
// >=
// assert  // Fails if amount < 1000
```

### Budget Exceeded

```typescript
// Error message:
// "dynamic cost budget exceeded, executing program {hash}"

// Meaning: Contract used too many compute units (opcode budget)

// Common causes:
// - Too many loop iterations
// - Complex calculations
// - Many inner transactions
// - Inefficient algorithm

// Solutions:
// - Optimize contract logic
// - Reduce loop iterations
// - Use app pooling for inner transactions
// - Split complex operations across multiple calls
```

### Stack Overflow

```typescript
// Error message:
// "stack overflow"

// Meaning: Too many values pushed onto the stack

// Common causes:
// - Not consuming intermediate values
// - Excessive nested function calls
// - Poor stack management

// Solutions:
// - Use stack manipulation opcodes (dig, swap, bury)
// - Consume unused values
// - Restructure logic to reduce stack depth
```

### Invalid Operation

```typescript
// Error message:
// "/ arg 0 < 1" (division by zero)
// "invalid Asset reference" (missing reference)

// Meaning: Operation failed due to invalid input

// Common causes:
// - Division by zero
// - Invalid account/asset/app reference
// - Out of bounds array access
// - Type mismatch

// Solutions:
// - Add input validation
// - Ensure all references are passed in transaction
// - Check array bounds
// - Verify types match expectations
```

## Debugging Workflow

### Step 1: Read the Enhanced Error Message

```typescript
catch (error: any) {
  console.log(error.message)

  // Example:
  // "assert failed pc=885. at:469. Error resolving execution info..."

  // Extract key information:
  // - Error type: "assert failed"
  // - PC: 885 (bytecode position)
  // - Line: 469 (TEAL source line)
}
```

### Step 2: Examine the TEAL Stack Trace

```typescript
if (error.stack) {
  console.log(error.stack)

  // Look for the line marked "<--- Error"
  // This shows the exact TEAL instruction that failed

  // Example output:
  // // error
  // error_7:
  // proto 0 0
  // intc_0 // 0
  // // Deliberate error
  // assert <--- Error  ← Here's your problem!
  // retsub
}
```

### Step 3: Understand the Context

```typescript
// Questions to ask:
// 1. What was the contract trying to do at this point?
// 2. What are the inputs to this function?
// 3. What condition is being checked by this assert?
// 4. Why might this condition fail?

// Example:
// If the error is at an "assert" after a balance check:
// - Is the account balance sufficient?
// - Was the balance passed correctly?
// - Is the minimum balance calculation correct?
```

### Step 4: Review Transaction Details

```typescript
if (error.transaction) {
  const txId = error.transaction.txID()
  console.log(`Transaction ID: ${txId}`)

  // Use this ID to:
  // 1. Look up the transaction on AlgoExplorer
  // 2. View transaction details using algod/indexer
  // 3. Check logs and inner transactions

  // Example:
  const txInfo = await algorand.client.algod
    .pendingTransactionInformation(txId)
    .do()

  console.log('Transaction details:', txInfo)
}
```

### Step 5: Use Execution Traces (if available)

```typescript
if (error.traces && error.traces.length > 0) {
  console.log(`Execution trace entries: ${error.traces.length}`)

  // Traces show step-by-step execution
  // Each entry contains:
  // - PC (program counter)
  // - Stack state
  // - Scratch space
  // - Logs

  // Use traces to understand execution flow leading to error
}
```

### Step 6: Fix and Test

```typescript
// After identifying the issue:
// 1. Fix the contract code or input data
// 2. Redeploy the contract (if contract changed)
// 3. Test with the same inputs
// 4. Verify the error is resolved

try {
  // Test the fix
  await appClient.send.methodName({ args: [...] })
  console.log('✅ Fixed!')
} catch (error: any) {
  console.log('Still failing:', error.message)
  // Continue debugging with enhanced error info
}
```

## Advanced Techniques

### Comparing Successful vs. Failed Calls

```typescript
// Run a successful call and capture its structure
let successTrace: any = null

try {
  const result = await appClient.send.workingMethod({ args: [validInput] })
  if (result.traces) {
    successTrace = result.traces
  }
} catch (error) {
  // Shouldn't happen
}

// Now run a failing call and compare
try {
  await appClient.send.brokenMethod({ args: [invalidInput] })
} catch (error: any) {
  console.log('Failed at PC:', error.message.match(/pc=(\d+)/)?.[1])

  if (error.traces && successTrace) {
    console.log('Success trace steps:', successTrace.length)
    console.log('Failed trace steps:', error.traces.length)
    // Identify where execution diverged
  }
}
```

### Creating Error Reports

```typescript
function createErrorReport(error: any): string {
  const report: string[] = []

  report.push('=== Smart Contract Error Report ===')
  report.push('')

  // Error summary
  report.push(`Error: ${error.message}`)
  report.push('')

  // Extract details
  const pcMatch = error.message.match(/pc=(\d+)/)
  const lineMatch = error.message.match(/at:(\d+)/)

  if (pcMatch) {
    report.push(`Program Counter: ${pcMatch[1]}`)
  }

  if (lineMatch) {
    report.push(`Source Line: ${lineMatch[1]}`)
  }

  report.push('')

  // Transaction info
  if (error.transaction) {
    report.push(`Transaction ID: ${error.transaction.txID()}`)
    report.push('')
  }

  // Stack trace
  if (error.stack) {
    report.push('=== TEAL Stack Trace ===')
    report.push(error.stack)
    report.push('')
  }

  return report.join('\n')
}

// Usage:
try {
  await appClient.send.error({ args: [] })
} catch (error: any) {
  const report = createErrorReport(error)
  console.log(report)

  // Or save to file for later analysis
  // fs.writeFileSync('error-report.txt', report)
}
```

### Logging Errors for Production

```typescript
import * as Sentry from '@sentry/node' // or your error tracking service

try {
  await appClient.send.methodName({ args: [...] })
} catch (error: any) {
  // Log enhanced error details
  console.error('Smart contract error:', {
    message: error.message,
    pc: error.message.match(/pc=(\d+)/)?.[1],
    line: error.message.match(/at:(\d+)/)?.[1],
    txId: error.transaction?.txID(),
    hasTraces: !!error.traces,
    traceCount: error.traces?.length,
  })

  // Send to error tracking service
  Sentry.captureException(error, {
    tags: {
      errorType: 'smart_contract_logic_error',
      pc: error.message.match(/pc=(\d+)/)?.[1],
    },
    extra: {
      stackTrace: error.stack,
      transactionId: error.transaction?.txID(),
    },
  })

  // Re-throw or handle appropriately
  throw error
}
```

### Testing Error Scenarios

```typescript
describe('Smart Contract Error Handling', () => {
  it('should provide enhanced error for invalid input', async () => {
    try {
      await appClient.send.methodName({ args: [invalidInput] })
      fail('Should have thrown an error')
    } catch (error: any) {
      // Verify enhanced error information is present
      expect(error.message).toContain('assert failed')
      expect(error.message).toMatch(/pc=\d+/)
      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('<--- Error')
    }
  })

  it('should provide helpful error for budget exceeded', async () => {
    try {
      await appClient.send.expensiveMethod({ args: [largeInput] })
      fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.message).toContain('budget exceeded')
      // Can still get PC and stack trace
      expect(error.message).toMatch(/pc=\d+/)
    }
  })
})
```

## Expected Output

```
Test account address: ILTJMPBAZUYTFVN32CQTOFT4RB2KBAPLLLGHSITUIOVKWW4DYQYBXIRDTI

=== Deploying Test Application ===

This application has an "error" method that deliberately fails.

✅ App deployed successfully!
App ID: 1646n

=== Triggering Logic Error ===

Calling the "error" method which deliberately fails with assert(0)...

✅ Logic error caught as expected!

═══════════════════════════════════════════════════
📊 ENHANCED ERROR INFORMATION
═══════════════════════════════════════════════════

🔴 Error Message:
   assert failed pc=885. at:469. Error resolving execution info via simulate in transaction 0: transaction D4GDMLHODXEAHMWSX6OBW4AAASXCNIUUXHYRTFL6M7AHRGR3GQ6A: logic eval error: assert failed pc=885. Details: app=1646, pc=885, opcodes=proto 0 0; intc_0 // 0; assert

📍 Program Counter (PC):
   885 - This is the bytecode position where the error occurred

📄 TEAL Source Line:
   Line 469 in the TEAL source code

═══════════════════════════════════════════════════
📄 TEAL STACK TRACE
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

The line marked "<--- Error" shows exactly where the failure occurred!

═══════════════════════════════════════════════════
💡 WHAT MAKES THESE ERROR MESSAGES ENHANCED?
═══════════════════════════════════════════════════

Without AlgoKit Utils, you would get:
  ❌ Generic error: "TransactionPool.Remember: transaction <ID>: logic eval error"
  ❌ No indication of where in your code the error occurred
  ❌ No TEAL source code context
  ❌ Difficult to debug and fix

With AlgoKit Utils enhanced errors, you get:
  ✅ Exact error type (assert failed, budget exceeded, etc.)
  ✅ Program Counter (PC) - bytecode position
  ✅ Line number in TEAL source code
  ✅ TEAL stack trace with error location marked
  ✅ Transaction ID for further investigation
  ✅ Execution traces for step-by-step debugging

This dramatically reduces debugging time!
═══════════════════════════════════════════════════
✨ Example Completed Successfully
═══════════════════════════════════════════════════

You now understand how AlgoKit Utils provides enhanced error messages!

Key Takeaways:
  • AlgoKit Utils automatically enriches error messages
  • You get TEAL stack traces showing exactly where errors occur
  • Program Counter and line numbers help pinpoint issues
  • Transaction IDs and traces enable deeper debugging
  • This makes debugging smart contracts much easier!
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
4. Catch the enhanced error and display rich debugging information
5. Parse and extract key error details (PC, line number, transaction ID)
6. Show the TEAL stack trace with error location marked
7. Demonstrate the difference between raw and enhanced errors

## Best Practices

### Always Catch and Log Enhanced Errors

```typescript
// GOOD: Comprehensive error handling
try {
  await appClient.send.methodName({ args: [...] })
} catch (error: any) {
  // Log all available error information
  console.error('Contract call failed')
  console.error('Message:', error.message)
  console.error('PC:', error.message.match(/pc=(\d+)/)?.[1])
  console.error('Line:', error.message.match(/at:(\d+)/)?.[1])

  if (error.stack) {
    console.error('Stack trace:', error.stack)
  }

  // Handle appropriately (retry, alert user, etc.)
}

// BAD: Swallowing errors or not using enhanced info
try {
  await appClient.send.methodName({ args: [...] })
} catch (error) {
  console.error('Error') // Too generic!
}
```

### Use Error Information for Debugging

```typescript
// Extract and use error details
function debugContractError(error: any) {
  const pcMatch = error.message.match(/pc=(\d+)/)
  const lineMatch = error.message.match(/at:(\d+)/)

  if (pcMatch && lineMatch) {
    console.log(`Error at PC ${pcMatch[1]} (line ${lineMatch[1]})`)

    // Use this info to locate the issue in your source code
    // Look up the line in your TEAL source or PyTeal/Puya code
  }

  if (error.stack && error.stack.includes('<--- Error')) {
    // Extract the context around the error
    const lines = error.stack.split('\n')
    const errorIndex = lines.findIndex(l => l.includes('<--- Error'))

    if (errorIndex !== -1) {
      console.log('TEAL context:')
      console.log(lines.slice(errorIndex - 3, errorIndex + 2).join('\n'))
    }
  }
}
```

### Test Error Paths

```typescript
// Write tests for expected errors
describe('Contract error handling', () => {
  it('should fail with helpful error for invalid amount', async () => {
    await expect(
      appClient.send.transfer({ args: { amount: -100 } })
    ).rejects.toThrow(/assert failed/)
  })

  it('should provide stack trace for errors', async () => {
    try {
      await appClient.send.error({ args: [] })
      fail('Should have thrown')
    } catch (error: any) {
      // Verify enhanced error info is present
      expect(error.stack).toContain('<--- Error')
      expect(error.message).toMatch(/pc=\d+/)
    }
  })
})
```

### Document Error Conditions

```typescript
/**
 * Transfers tokens from one account to another.
 *
 * @param from - Sender address
 * @param to - Recipient address
 * @param amount - Amount to transfer (must be > 0)
 *
 * @throws {Error} "assert failed" if amount <= 0
 * @throws {Error} "assert failed" if sender balance insufficient
 * @throws {Error} "invalid Account reference" if accounts not in transaction
 *
 * All errors include enhanced debugging information:
 * - Program Counter (PC)
 * - TEAL source line number
 * - Stack trace with error location marked
 */
async function transfer(from: string, to: string, amount: bigint) {
  await appClient.send.transfer({ args: { from, to, amount } })
}
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Debugging Guide](https://developer.algorand.org/docs/get-details/dapps/avm/teal/debugging/)
- [Smart Contract Errors](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/debugging/)
- [Program Counter and Source Maps](https://developer.algorand.org/docs/get-details/dapps/avm/teal/source_maps/)
- [AlgoExplorer](https://algoexplorer.io/) - View transactions on-chain
