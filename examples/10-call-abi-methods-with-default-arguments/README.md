# Call ABI Methods with Default Arguments

This example demonstrates how to call ABI methods that have default arguments, a powerful feature that simplifies API usage and improves user experience by providing sensible defaults.

## What This Example Shows

This example teaches you how to:
- Call ABI methods with and without explicit arguments
- Understand how default values work from constants
- Understand how default values work from other ABI methods
- Use the ARC-4 default arguments feature
- Simplify method calls by omitting optional arguments

## Why This Matters

ABI default arguments are important for several reasons:

1. **Simpler API**: Users can call methods without providing all arguments
2. **Better UX**: Common use cases don't require specifying every parameter
3. **Backward Compatibility**: New parameters can be added without breaking existing calls
4. **Reduced Transaction Data**: Fewer arguments mean smaller transactions

Key concepts:
- **Constant Defaults**: Values hardcoded in the smart contract
- **Method Defaults**: Values computed by calling another ABI method
- **Optional Arguments**: Can be omitted when calling methods
- **ARC-4 Feature**: Part of the Algorand ABI standard

Common use cases:
- **Configuration Parameters**: Use default settings for common scenarios
- **Optional Features**: Enable advanced features only when specified
- **Versioning**: Add new parameters without breaking existing integrations
- **Computed Defaults**: Dynamic values based on contract state

## How It Works

The example demonstrates two scenarios for default arguments:

### Scenario 1: Default Value from Constant

The smart contract defines a constant default value:

```typescript
// Call WITH an explicit argument
const result1 = await appClient.send.call({
  method: 'default_value',
  args: ['defined value'],
})
console.log('Result:', result1.return)
// Output: 'defined value'

// Call WITHOUT an argument (uses default)
const result2 = await appClient.send.call({
  method: 'default_value',
  args: [undefined], // Pass undefined to use default
})
console.log('Result:', result2.return)
// Output: 'default value' (from contract's constant)
```

When you omit the argument, the smart contract automatically uses its predefined constant default value.

### Scenario 2: Default Value from ABI Method

The smart contract computes the default by calling another method:

```typescript
// Call WITH an explicit argument
const result3 = await appClient.send.call({
  method: 'default_value_from_abi',
  args: ['defined value'],
})
console.log('Result:', result3.return)
// Output: 'ABI, defined value'

// Call WITHOUT an argument (uses default from ABI method)
const result4 = await appClient.send.call({
  method: 'default_value_from_abi',
  args: [undefined], // Pass undefined to use default
})
console.log('Result:', result4.return)
// Output: 'ABI, default value' (computed by calling another method)
```

This scenario is more dynamic - the default value is computed at runtime by calling another ABI method in the contract.

### How Default Arguments Work

1. **Method Definition**: The smart contract's ABI specifies which arguments have defaults
2. **Client Call**: When you call the method, pass `undefined` for arguments you want to use defaults for
3. **SDK Handling**: The AlgoKit SDK recognizes `undefined` arguments and uses the default value
4. **Contract Execution**: The contract uses the default value (constant or method-computed)

The SDK automatically:
- Validates that omitted arguments have default values defined
- Handles the encoding properly for the blockchain
- Ensures the call is constructed correctly

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
Deploying smart contract with ABI default arguments...
Application deployed with ID: 1002

=== Default Value from Constant ===
Method signature: default_value(string)string
Called with explicit argument "defined value"
Result: defined value

Called without argument (using default)
Result: default value
The contract used its predefined constant default value

=== Default Value from ABI Method ===
Method signature: default_value_from_abi(string)string
The default value is computed by calling another ABI method

Called with explicit argument "defined value"
Result: ABI, defined value

Called without argument (using default from ABI method)
Result: ABI, default value
The contract computed the default by calling another method

=== Summary ===
✅ Constant default: Method uses a hardcoded default value
✅ Method default: Method computes default by calling another method
✅ This reduces transaction complexity and improves UX

Benefits of default arguments:
- Simpler API for common use cases
- Backward compatibility when adding new parameters
- Reduced transaction data when defaults are acceptable
```

## Key Takeaways

- ABI methods can have default arguments defined in the contract
- Default values can come from constants or other ABI methods
- To use defaults, pass `undefined` for that argument position
- The SDK automatically handles default argument resolution
- This is an ARC-4 feature supported by the Algorand ABI standard
- Constant defaults are hardcoded values in the contract
- Method defaults are computed dynamically by calling another method
- Default arguments simplify API usage and improve user experience
- They enable backward compatibility when adding new parameters
- Reduce transaction size by using defaults when acceptable
- The contract's ABI specification defines which arguments have defaults
- You can still provide explicit values to override defaults