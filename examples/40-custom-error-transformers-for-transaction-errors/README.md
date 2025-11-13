# Custom Error Transformers for Transaction Errors

This example demonstrates how to register custom error transformers to catch and modify error messages during transaction simulation and sending, enabling better error handling and user experience in dApps.

## What This Example Shows

This example teaches you how to:
- Create custom error transformer functions
- Register error transformers on transaction composers
- Transform cryptic blockchain errors into user-friendly messages
- Handle errors during both simulation and transaction sending
- Chain multiple error transformers for different error types
- Improve debugging and user experience in applications

## Why This Matters

Custom error transformers are essential for production-ready dApps:

1. **User Experience**: Convert technical blockchain errors into readable messages
2. **Debugging**: Add context and additional information to errors
3. **Error Handling**: Centralize error transformation logic
4. **Maintainability**: Easily update error messages without changing business logic
5. **Localization**: Transform errors into different languages

Key concepts:
- **Error Transformer**: Function that receives an error and returns a modified error
- **Transaction Composer**: Supports registering custom error transformers
- **Error Chain**: Multiple transformers can be chained together
- **Passthrough**: Transformers can return the original error if they don't handle it
- **Simulation vs Send**: Transformers work for both simulate() and send()

Common use cases:
- **Missing Assets**: Clarify which asset ID is missing
- **Insufficient Balance**: Explain balance requirements
- **Invalid Parameters**: Provide guidance on correct values
- **Network Errors**: Add retry suggestions
- **Permission Errors**: Explain authorization requirements

## How It Works

### 1. Define Error Transformer Functions

Create functions that transform errors:

```typescript
function assetErrorTransformer(error: Error): Error {
  // Convert error to string to check all nested messages
  const errorString = error.toString() + ' ' + error.message

  // Check if the error message contains asset-related issues
  if (errorString.includes('asset') && errorString.includes('1337')) {
    // Return a new error with a clearer message
    return new Error('ASSET MISSING! The asset with ID 1337 does not exist on this network.')
  }

  // Check for invalid asset errors or missing asset errors
  if (errorString.toLowerCase().includes('asset') && errorString.toLowerCase().includes('missing')) {
    return new Error('ASSET MISSING! Please check that the asset ID is correct and exists.')
  }

  // Return the original error if we don't handle it
  return error
}
```

Transformer requirements:
- Takes an `Error` as input
- Returns an `Error` (modified or original)
- Should return original error if not handling it
- Can check error message, stack trace, or properties
- Should be specific to avoid over-matching

### 2. Create Transaction Composer

Build a transaction group:

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const sender = await algorand.account.fromEnvironment('SENDER')

// Create a new transaction group
const composer = algorand.newGroup()

// Add transactions
composer.addAssetTransfer({
  amount: 1n,
  assetId: 1337n,  // This asset doesn't exist
  sender: sender.addr,
  receiver: sender.addr,
})
```

Composer provides:
- Transaction grouping
- Error transformer registration
- Simulation and sending methods
- Automatic error transformation

### 3. Register Error Transformers

Register transformers on the composer:

```typescript
// Register our custom error transformers
composer.registerErrorTransformer(assetErrorTransformer)
composer.registerErrorTransformer(balanceErrorTransformer)
```

Registration:
- Call `registerErrorTransformer()` for each transformer
- Transformers are called in registration order
- Each transformer receives the output of the previous one
- Can register multiple transformers for different error types

### 4. Simulate or Send with Error Handling

Execute transactions with automatic error transformation:

```typescript
try {
  // Try to simulate - this will fail with our custom error message
  await composer.simulate()
} catch (error) {
  console.log('Caught transformed error:', (error as Error).message)
  // Output: "ASSET MISSING! The asset with ID 1337 does not exist on this network."
}

// Same works for send()
try {
  await composer.send()
} catch (error) {
  console.log('Caught transformed error:', (error as Error).message)
}
```

Error flow:
- Transaction fails with blockchain error
- Error passes through each registered transformer
- Each transformer can modify the error
- Final transformed error is thrown to catch block
- Works for both simulate() and send()

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- LocalNet running

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
=== Custom Error Transformer Example ===

Sender address: CMHWHME67P2DOH44UGBZJTWH6BIMU44FADNVA265ONUPSROQSZSLEJ4A6I

--- Example 1: Simulate with Error Transformer ---
Registering error transformers...
Simulating transaction (will fail)...
✓ Caught transformed error: ASSET MISSING! The asset with ID 1337 does not exist on this network.

--- Example 2: Send with Error Transformer ---
Registering error transformers...
Sending transaction (will fail)...
✓ Caught transformed error: ASSET MISSING! The asset with ID 1337 does not exist on this network.

--- Example 3: Multiple Error Transformers ---
When multiple transformers are registered, they are called in order.
Each transformer can modify the error or pass it through unchanged.
This allows you to create a hierarchy of error handling.
Transformers should return the original error if they don't handle it.

✅ Error transformer demonstration complete
```

## Common Patterns

### Balance Error Transformer

```typescript
function balanceErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('overspend') || errorString.toLowerCase().includes('insufficient')) {
    return new Error('INSUFFICIENT BALANCE! Your account does not have enough funds for this transaction.')
  }

  return error
}
```

### Permission Error Transformer

```typescript
function permissionErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('unauthorized') || errorString.includes('not authorized')) {
    return new Error('PERMISSION DENIED! You do not have permission to perform this action.')
  }

  if (errorString.includes('not opted in')) {
    return new Error('NOT OPTED IN! Please opt into the asset before transferring.')
  }

  return error
}
```

### Network Error Transformer

```typescript
function networkErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('timeout') || errorString.includes('network')) {
    return new Error('NETWORK ERROR! Please check your connection and try again.')
  }

  if (errorString.includes('rate limit')) {
    return new Error('RATE LIMITED! Please wait a moment before trying again.')
  }

  return error
}
```

### App-Specific Error Transformer

```typescript
function smartContractErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  // Match specific TEAL errors
  if (errorString.includes('assert failed')) {
    return new Error('TRANSACTION REJECTED! The smart contract validation failed.')
  }

  if (errorString.includes('logic eval error')) {
    return new Error('CONTRACT ERROR! There was an error executing the smart contract logic.')
  }

  return error
}
```

### Detailed Error Transformer with Context

```typescript
function detailedAssetErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  // Extract asset ID from error message
  const assetIdMatch = errorString.match(/asset (\d+)/)
  const assetId = assetIdMatch ? assetIdMatch[1] : 'unknown'

  if (errorString.includes('asset') && errorString.includes('missing')) {
    return new Error(
      `ASSET MISSING! Asset ID ${assetId} does not exist on this network. ` +
      `Please verify the asset ID is correct.`
    )
  }

  if (errorString.includes('frozen')) {
    return new Error(
      `ASSET FROZEN! Asset ID ${assetId} is frozen and cannot be transferred. ` +
      `Contact the asset manager for more information.`
    )
  }

  return error
}
```

### Chaining Multiple Transformers

```typescript
// Register transformers in order of specificity (most specific first)
composer.registerErrorTransformer(smartContractErrorTransformer)
composer.registerErrorTransformer(assetErrorTransformer)
composer.registerErrorTransformer(balanceErrorTransformer)
composer.registerErrorTransformer(permissionErrorTransformer)
composer.registerErrorTransformer(networkErrorTransformer)

// Each transformer gets a chance to handle the error
// If a transformer doesn't handle it, it returns the original error
// The next transformer in the chain receives it
```

## Best Practices

1. **Check Full Error Context**
   ```typescript
   // Good: Check both toString() and message
   function errorTransformer(error: Error): Error {
     const errorString = error.toString() + ' ' + error.message

     if (errorString.includes('pattern')) {
       return new Error('Custom message')
     }

     return error
   }

   // Avoid: Only checking message
   if (error.message.includes('pattern')) {
     // May miss nested error information
   }
   ```

2. **Always Return an Error**
   ```typescript
   // Good: Return original error if not handled
   function errorTransformer(error: Error): Error {
     if (shouldHandle(error)) {
       return new Error('Transformed message')
     }
     return error  // Pass through unchanged
   }

   // Avoid: Returning null or undefined
   // This can cause issues in the error chain
   ```

3. **Be Specific with Error Patterns**
   ```typescript
   // Good: Specific pattern matching
   if (errorString.includes('asset') && errorString.includes('1337')) {
     return new Error('Asset 1337 not found')
   }

   // Avoid: Too broad matching
   if (errorString.includes('error')) {
     // Matches almost everything!
   }
   ```

4. **Provide Actionable Messages**
   ```typescript
   // Good: Tell user what to do
   return new Error(
     'INSUFFICIENT BALANCE! Your account needs at least 0.1 ALGO. ' +
     'Please fund your account and try again.'
   )

   // Avoid: Vague messages
   return new Error('Balance error')
   ```

5. **Order Transformers by Specificity**
   ```typescript
   // Good: Most specific first
   composer.registerErrorTransformer(specificAssetErrorTransformer)
   composer.registerErrorTransformer(generalAssetErrorTransformer)
   composer.registerErrorTransformer(genericErrorTransformer)

   // This allows specific cases to be handled before general cases
   ```

6. **Test Error Transformers**
   ```typescript
   // Create test cases for your transformers
   function testAssetErrorTransformer() {
     const testError = new Error('asset 1337 missing from account')
     const result = assetErrorTransformer(testError)

     console.assert(
       result.message.includes('ASSET MISSING'),
       'Should transform asset errors'
     )
   }
   ```

7. **Preserve Original Error Information**
   ```typescript
   // Good: Include relevant details from original error
   function errorTransformer(error: Error): Error {
     if (shouldTransform(error)) {
       const newError = new Error('User-friendly message')
       newError.cause = error  // Preserve original for debugging
       return newError
     }
     return error
   }
   ```

## Use Cases in Production dApps

### DEX Application

```typescript
function dexErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('slippage')) {
    return new Error(
      'SLIPPAGE EXCEEDED! The price moved too much. ' +
      'Try increasing your slippage tolerance.'
    )
  }

  if (errorString.includes('liquidity')) {
    return new Error(
      'INSUFFICIENT LIQUIDITY! There is not enough liquidity for this trade size.'
    )
  }

  return error
}
```

### NFT Marketplace

```typescript
function nftErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('not opted in')) {
    return new Error(
      'NFT OPT-IN REQUIRED! You must opt into this NFT collection before purchasing.'
    )
  }

  if (errorString.includes('already owns')) {
    return new Error(
      'ALREADY OWNED! You already own this NFT.'
    )
  }

  return error
}
```

### Staking Application

```typescript
function stakingErrorTransformer(error: Error): Error {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('lock period')) {
    return new Error(
      'TOKENS LOCKED! Your tokens are still in the lock period. ' +
      'You can withdraw after the lock expires.'
    )
  }

  if (errorString.includes('minimum stake')) {
    return new Error(
      'MINIMUM STAKE NOT MET! You must stake at least 100 tokens.'
    )
  }

  return error
}
```

## Key Takeaways

- Error transformers convert cryptic blockchain errors into user-friendly messages
- Register transformers using `composer.registerErrorTransformer()`
- Transformers work for both `simulate()` and `send()` operations
- Multiple transformers can be chained for different error types
- Transformers should return the original error if they don't handle it
- Check both `error.toString()` and `error.message` for patterns
- Order transformers from most specific to most general
- Provide actionable error messages that tell users what to do
- Use error transformers to improve debugging and user experience
- Essential for production dApps that need professional error handling
- Can be used for localization by transforming to different languages
- Preserve original error information using `error.cause` for debugging
- Test error transformers to ensure they work correctly

This example demonstrates how to build robust error handling for Algorand applications, essential for production-ready dApps with excellent user experience.
