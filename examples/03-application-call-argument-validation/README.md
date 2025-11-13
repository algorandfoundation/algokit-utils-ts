# Application Call Argument Validation

This example demonstrates how AlgoKit Utils automatically validates argument counts when calling smart contract methods, helping you catch bugs before they reach the blockchain.

## What This Example Shows

This example teaches you how to:
- Understand the SDK's built-in argument validation for method calls
- See what error messages you get when providing the wrong number of arguments
- Leverage runtime validation to catch bugs early in development
- Call methods with the correct number of arguments

## Why This Matters

Automatic argument validation is crucial for several reasons:

1. **Early Error Detection**: Catches mistakes before submitting transactions to the blockchain
2. **Cost Savings**: Prevents wasted transaction fees from invalid calls
3. **Clear Error Messages**: Provides specific feedback about what went wrong
4. **Developer Experience**: Helps identify issues quickly during development

Without this validation:
- You'd submit invalid transactions to the blockchain
- You'd pay transaction fees for calls that will fail
- Error messages would be less helpful
- Debugging would take longer

This validation is especially valuable when:
- Working with complex smart contracts with many methods
- Integrating with third-party contracts
- Building applications where method signatures might change
- Teaching new developers who are learning the platform

## How It Works

The SDK validates arguments before constructing transactions:

```typescript
// The call_abi method expects 1 argument
await appClient.send.call({
  method: 'call_abi',
  args: ['test', 'extra'], // ❌ Too many arguments!
})
// Throws: "Unexpected arg at position 1. call_abi only expects 1 args"

// Correct usage
await appClient.send.call({
  method: 'call_abi',
  args: ['test'], // ✅ Correct number of arguments
})
// Works correctly!
```

The validation happens client-side before the transaction is sent, so:
- No blockchain interaction occurs for invalid calls
- No transaction fees are wasted
- You get immediate feedback

## Prerequisites

- AlgoKit installed
- Docker installed (for LocalNet)
- Node.js and npm

## Running the Example

1. Start LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
Using account: [account-address]

Deploying application...
Application deployed with ID: [app-id]

--- Testing Argument Validation ---
Attempting to call method with incorrect number of arguments...

✓ Caught expected error:
   Unexpected arg at position 1. call_abi only expects 1 args

--- Calling Method Correctly ---
Calling method with correct number of arguments...
✓ Method called successfully! Result: Hello, test

=== Summary ===
✓ Argument validation works correctly!
✓ The SDK prevents bugs by validating argument counts at runtime.
✓ Clear error messages help developers quickly identify issues.
```

## Key Takeaways

- The SDK validates the number of arguments before sending transactions
- Validation happens client-side, saving transaction fees
- Error messages clearly indicate which argument position is wrong and how many arguments are expected
- This validation works for all ABI method calls
- The validation is based on the application specification (ARC-32/ARC-56)
- You cannot bypass this validation - it's a safety feature built into the SDK
