# ABI Methods with Default Arguments from Various Sources

This example provides a comprehensive demonstration of ABI methods with default arguments sourced from **four different locations**: constants, ABI methods, global state, and local state. It shows how smart contracts can flexibly provide default values from various sources, making contract interactions more convenient and powerful.

## Overview

Default arguments in Algorand ABI methods can be sourced from:

1. **Constants**: Hard-coded default values in the contract
2. **ABI Methods**: Values computed by calling other contract methods
3. **Global State**: Shared application state accessible to all users
4. **Local State**: Per-user state specific to each account that has opted in

This example demonstrates all four sources and shows how to work with each.

## Why This Matters

Default arguments from various sources enable:
- **Flexible Configuration**: Use global state for app-wide settings
- **User Preferences**: Store per-user settings in local state
- **Dynamic Defaults**: Compute defaults using contract logic
- **Reduced Complexity**: Clients don't need to track all configuration values
- **Gas Efficiency**: Fewer arguments means smaller transactions

## Code Walkthrough

### Setup and Deployment

```typescript
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

// Initialize test environment
const localnet = algorandFixture()
await localnet.newScope()
const { algod, indexer, testAccount } = localnet.context

const algorand = AlgorandClient.fromClients({ algod, indexer })
algorand.setDefaultSigner(testAccount.signer)

// Deploy the contract
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: testAccount.addr,
})

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 123,
  },
})
```

### Example 1: Default from Constant

The simplest form - a hard-coded default value in the contract.

```typescript
// Call with explicit value
const result = await appClient.send.defaultValue({
  args: ['defined value'],
})
console.log(result.return) // "defined value"

// Call with undefined to use constant default
const resultDefault = await appClient.send.defaultValue({
  args: [undefined],
})
console.log(resultDefault.return) // "default value" (from contract)
```

**When to Use**:
- Fixed configuration values that rarely change
- Reasonable fallback values
- Values that don't require state storage

### Example 2: Default from ABI Method

The default value is computed by calling another contract method.

```typescript
// Call with explicit value
const result = await appClient.send.defaultValueFromAbi({
  args: ['defined value'],
})
console.log(result.return) // "ABI, defined value"

// Call with undefined - contract calls another method for the default
const resultDefault = await appClient.send.defaultValueFromAbi({
  args: [undefined],
})
console.log(resultDefault.return) // "ABI, default value"
```

**How It Works**:
1. When the argument is `undefined`, the contract automatically calls another method
2. The return value from that method becomes the default
3. This allows for complex default logic encapsulated in a method

**When to Use**:
- Defaults that require computation
- Defaults based on multiple state values
- Complex business logic for default values

### Example 3: Default from Global State

The default value is read from the application's global state.

```typescript
// First, set global state
const globalInt1 = 456n
await appClient.send.setGlobal({
  args: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])],
})

// Call with undefined - uses value from global state
const result = await appClient.send.defaultValueFromGlobalState({
  args: [undefined],
})
console.log(result.return) // 456n (from global state)
```

**How It Works**:
1. The contract stores a value in global state using a key (e.g., "int1")
2. When the method is called with `undefined`, it reads from that global state key
3. All users see the same default value

**When to Use**:
- Application-wide configuration
- Fee percentages that apply to all users
- Limits or thresholds shared across the app
- Settings that can be updated by an admin

### Example 4: Default from Local State

The default value is read from the caller's local state.

```typescript
// First, opt in to create local state storage
await appClient.send.optIn.optIn({
  args: [],
})

// Set local state for this user
const localBytes1 = 'bananas'
await appClient.send.setLocal({
  args: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])],
})

// Call with explicit value
const result = await appClient.send.defaultValueFromLocalState({
  args: ['defined value'],
})
console.log(result.return) // "Local state, defined value"

// Call with undefined - uses value from caller's local state
const resultDefault = await appClient.send.defaultValueFromLocalState({
  args: [undefined],
})
console.log(resultDefault.return) // "Local state, bananas"
```

**How It Works**:
1. User opts into the application to allocate local state
2. User's preferences are stored in their local state
3. When method is called with `undefined`, contract reads from sender's local state
4. Each user has their own default values

**When to Use**:
- User preferences (language, theme, notification settings)
- Per-user configuration
- Individual user limits or allowances
- Personalized settings

## API Patterns (AlgoKit Utils v9.1.2)

### Using Undefined for Defaults

Always pass `undefined` explicitly when you want to trigger default value resolution:

```typescript
// Correct - undefined triggers the default
await appClient.send.methodWithDefault({
  args: [undefined]
})

// Also works - but less explicit
await appClient.send.methodWithDefault({
  args: []
})
```

### Overriding Defaults

Pass explicit values to override any default:

```typescript
// Explicit value always takes precedence
await appClient.send.methodWithDefault({
  args: ['my custom value']
})
```

### Mixed Arguments

For methods with multiple parameters:

```typescript
// Some explicit, some defaults
await appClient.send.complexMethod({
  args: [
    'explicit value',  // Override first parameter
    undefined,         // Use default for second
    42,               // Override third parameter
    undefined,        // Use default for fourth
  ]
})
```

## Comparison of Default Sources

| Source | Shared/Per-User | Requires Opt-In | Gas Cost | Update Method | Best For |
|--------|----------------|-----------------|----------|---------------|----------|
| **Constant** | Shared | No | Free | Contract Update | Fixed values |
| **ABI Method** | Varies | No | Low-Med | Depends on logic | Computed values |
| **Global State** | Shared | No | Low | Admin call | App-wide config |
| **Local State** | Per-User | Yes | Low | User call | User preferences |

## Running This Example

```bash
# Install dependencies
npm install

# Run the example (requires AlgoKit LocalNet running)
npm start
```

**Expected Output**:
```
Deploying TestingApp...
App deployed with ID: 1249

=== ABI Methods with Default Arguments ===

1. Default Value from Constant
   Calling method where default is a hard-coded constant...
   With explicit value: defined value
   With default value: default value

2. Default Value from ABI Method
   Calling method where default is computed by another method...
   With explicit value: ABI, defined value
   With default from ABI method: ABI, default value

3. Default Value from Global State
   Setting global state and using it as default...
   Global state set to: 456n
   With default from global state: 456n

4. Default Value from Local State
   Opting in, setting local state, and using it as default...
   Account opted in to application
   Local state set to: bananas
   With explicit value: Local state, defined value
   With default from local state: Local state, bananas

=== Example Complete ===
```

## Key Takeaways

1. **Four Sources**: Default arguments can come from constants, ABI methods, global state, or local state
2. **Use Undefined**: Pass `undefined` to trigger default value resolution from any source
3. **Override Anytime**: Explicit values always take precedence over defaults
4. **Choose Wisely**: Select the appropriate source based on your use case
5. **State Initialization**: Ensure state is initialized before using state-based defaults
6. **Opt-In Required**: Local state defaults require users to opt into the application

## Learn More

- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [ARC-4 ABI Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)
- [ARC-22 ABI Conventions](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0022.md)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
- [Application State Documentation](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/)
