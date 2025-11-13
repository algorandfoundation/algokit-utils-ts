# ABI Method Calls with Default Arguments from State

This example demonstrates how to call ABI methods that have default arguments sourced from the application's global state and user's local state. Default arguments allow smart contracts to use stored state values as method parameters, reducing the need to pass the same values repeatedly and simplifying contract interactions.

## Overview

Default arguments in ABI methods can be sourced from:
1. **Global State**: Shared across all users of the application
2. **Local State**: Specific to each opted-in user
3. **Constant Values**: Hard-coded defaults
4. **Other ABI Methods**: Results from calling other contract methods

This example focuses on the first two sources - global and local state.

## Key Concepts

### What Are Default Arguments?

Default arguments allow ABI methods to specify fallback values when an argument is not provided (or is `undefined`). The contract can read these values from:
- Global state variables
- Local state variables (for the transaction sender)
- Constant values defined in the contract
- Return values from other contract methods

### Benefits

- **Reduced Transaction Size**: Fewer arguments need to be passed
- **Simplified Client Code**: Common values can be stored once and reused
- **Flexibility**: Callers can override defaults when needed
- **State Management**: Encourages using state for configuration

## Code Walkthrough

### Setup and Deployment

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TestingAppClient, TestingAppFactory } from './artifacts/TestingApp/client'

// Initialize test environment
const localnet = algorandFixture()
await localnet.newScope()
const { algod, indexer, testAccount } = localnet.context

const algorand = AlgorandClient.fromClients({ algod, indexer })
algorand.setDefaultSigner(testAccount.signer)
```

**Key Points**:
- Use `algorandFixture()` without `await` - it returns a fixture object
- Call `newScope()` to initialize the context (creates a new test scope)
- Access `algod`, `indexer`, and test accounts from `localnet.context`

### Creating the App Factory

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: testAccount.addr,
})

// Deploy with template variables
const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 123,
  },
})
```

**Key Points**:
- Use `getTypedAppFactory()` for typed client generation
- The factory is used for creating new app instances
- Template variables are provided via `deployTimeParams`
- `send.create.bare()` creates the app and returns both result and client

### Example 1: Default Argument from Global State

```typescript
// Set a value in global state
const globalInt1 = 456n
await appClient.send.setGlobal({
  args: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])]
})

// Call a method that uses the global state value as default
const resultFromGlobal = await appClient.send.defaultValueFromGlobalState({
  args: [undefined] // undefined triggers using the default value
})

console.log(resultFromGlobal.return) // 456
```

**How it Works**:
1. The `set_global` method stores values in global state
2. The `default_value_from_global_state` method has a parameter with a default from global state
3. Passing `undefined` tells the method to use the default value
4. The contract reads the value from global state automatically

### Example 2: Default Argument from Local State

```typescript
// First, opt into the application
await appClient.send.optIn.optIn({
  args: []
})

// Set a value in local state
const localBytes1 = 'bananas'
await appClient.send.setLocal({
  args: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])]
})

// Call with explicit argument (overrides default)
const resultWithExplicit = await appClient.send.defaultValueFromLocalState({
  args: ['defined value']
})
console.log(resultWithExplicit.return) // "Local state, defined value"

// Call without argument (uses default from local state)
const resultFromLocal = await appClient.send.defaultValueFromLocalState({
  args: [undefined]
})
console.log(resultFromLocal.return) // "Local state, bananas"
```

**How it Works**:
1. User opts into the app to create local state storage
2. The `set_local` method stores values in the user's local state
3. The `default_value_from_local_state` method reads from the sender's local state
4. Explicit values override defaults; `undefined` uses the default

## API Patterns (AlgoKit Utils v9.1.2)

### Typed App Factory

The typed app factory is used for creating new app instances:

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: string,
  // ...other options
})

// Create methods return both result and client
const { result, appClient } = await appFactory.send.create.bare({
  deployTimeParams: { ... },
  // ...other params
})
```

### Typed App Client

Once you have an app client (from factory or by other means), use it for method calls:

```typescript
// Method call pattern
const result = await appClient.send.methodName({
  args: [arg1, arg2, ...],
  // ...other params
})

// Access return value
console.log(result.return)

// Opt-in pattern
await appClient.send.optIn.optIn({
  args: []
})
```

### Working with Default Arguments

**To use a default value**: Pass `undefined` for that argument position

```typescript
await appClient.send.methodWithDefaults({
  args: [undefined] // Uses default from contract
})
```

**To override a default**: Pass an explicit value

```typescript
await appClient.send.methodWithDefaults({
  args: ['explicit value'] // Overrides the default
})
```

## Best Practices

### 1. Use Undefined for Defaults

Always pass `undefined` explicitly when you want to use default values:

```typescript
// Good - explicit about using defaults
await appClient.send.method({
  args: [undefined]
})

// Avoid - empty array might be ambiguous
await appClient.send.method({
  args: []
})
```

### 2. Document Default Behavior

When working with methods that have defaults, document what the defaults are:

```typescript
// Method has default from global state "int1"
// Pass undefined to use the current value from state
const result = await appClient.send.defaultValueFromGlobalState({
  args: [undefined] // Uses "int1" from global state
})
```

### 3. Set State Before Using Defaults

Ensure state is initialized before calling methods with state-based defaults:

```typescript
// Set the state first
await appClient.send.setGlobal({
  args: [value, ...otherArgs]
})

// Now safe to use the default
await appClient.send.methodUsingGlobalDefault({
  args: [undefined]
})
```

### 4. Handle Opt-In for Local State Defaults

For methods with local state defaults, users must opt in first:

```typescript
// Opt in to create local state storage
await appClient.send.optIn.optIn({ args: [] })

// Initialize local state
await appClient.send.setLocal({
  args: [value, ...otherArgs]
})

// Now can use local state defaults
await appClient.send.methodUsingLocalDefault({
  args: [undefined]
})
```

## Common Patterns

### Pattern 1: Configuration from Global State

Store application configuration in global state and use it as defaults:

```typescript
// Admin sets configuration
await appClient.send.setConfig({
  args: [feePercentage, maxTransactionSize, cooldownPeriod]
})

// Users automatically use the current configuration
await appClient.send.performAction({
  args: [actionData, undefined] // Uses current fee percentage
})
```

### Pattern 2: User Preferences in Local State

Store user-specific preferences in local state:

```typescript
// User sets their preferences
await appClient.send.setUserPreferences({
  args: [language, theme, notifications]
})

// Operations use user preferences automatically
await appClient.send.userAction({
  args: [undefined] // Uses user's language preference
})
```

### Pattern 3: Mixed Defaults

Combine explicit arguments with defaults:

```typescript
// Method signature: method(requiredArg, optionalWithDefault)
await appClient.send.method({
  args: [
    'explicit value',  // Required argument
    undefined          // Uses default
  ]
})
```

## Understanding the Contract

The TestingApp contract has methods demonstrating different default argument sources:

### Methods

1. **set_global**: Stores values in global state
   ```
   set_global(uint64, uint64, string, byte[4])void
   ```

2. **set_local**: Stores values in local state for the sender
   ```
   set_local(uint64, uint64, string, byte[4])void
   ```

3. **default_value_from_global_state**: Uses global state as default
   ```
   default_value_from_global_state(uint64)uint64
   ```
   - Default for uint64 parameter comes from global state key "int1"

4. **default_value_from_local_state**: Uses local state as default
   ```
   default_value_from_local_state(string)string
   ```
   - Default for string parameter comes from local state key "local_bytes1"

### State Schema

**Global State**:
- `int1`: uint64
- `int2`: uint64
- `bytes1`: bytes
- `bytes2`: bytes

**Local State**:
- `local_int1`: uint64
- `local_int2`: uint64
- `local_bytes1`: bytes
- `local_bytes2`: bytes

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
App deployed with ID: 1229

--- Example 1: Default Argument from Global State ---
Setting global state value to: 456
Global state updated successfully
Calling method that uses default value from global state...
Result: 456
Expected: 456 (value from global state)

--- Example 2: Default Argument from Local State ---
Opting in to enable local state...
Opted in successfully
Setting local state value to: "bananas"
Local state updated successfully
Calling method with explicit argument (overrides default)...
Result: "Local state, defined value"
Expected: "Local state, defined value"

Calling method that uses default value from local state...
Result: "Local state, bananas"
Expected: "Local state, bananas"

✅ All examples completed successfully!
```

## Key Takeaways

1. **Default Arguments Simplify Client Code**: Commonly used values can be stored in state and referenced automatically
2. **Global vs Local State**: Global state defaults are shared; local state defaults are per-user
3. **Explicit Overrides**: Passing explicit values always overrides defaults
4. **Use Undefined**: Pass `undefined` to trigger default value resolution
5. **State Initialization**: Ensure state is set before using state-based defaults
6. **Opt-In Required**: Local state defaults require the user to opt into the application

## Advanced Topics

### Default Arguments from ABI Methods

Defaults can also come from calling other contract methods. This allows for:
- Dynamic defaults computed at call time
- Complex default logic encapsulated in methods
- Defaults that depend on multiple state values

### Default Arguments from Constants

Simple constant defaults can be defined in the contract:
- Useful for fixed configuration values
- No state storage required
- Can't be changed without contract update

### Validation with Defaults

Contracts can validate that default values are appropriate:
- Check state is initialized before using as default
- Provide error messages if defaults are invalid
- Fall back to hard-coded values if state is not set

## Related Concepts

- **Application State Management**: Managing global and local state
- **ABI Method Calls**: Calling typed smart contract methods
- **Opt-In Transactions**: Required for local state access
- **Typed App Clients**: Generated clients with TypeScript types
- **Template Variables**: Deploy-time configuration values

## Learn More

- [AlgoKit Utils TypeScript Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [ARC-4 ABI Specification](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)
- [Algorand Application State](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/state/)
- [ABI Method Defaults](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0022.md)
