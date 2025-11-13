# Create and Update Application with ABI Methods

This example demonstrates how to create and update an Algorand application using ABI methods, including handling return values and using deploy-time parameters for configuration.

## What This Example Shows

This example teaches you how to:
- Create an application using an ABI method (not bare create)
- Call ABI methods during app creation to initialize state
- Update an existing application using an ABI method
- Handle return values from ABI create and update methods
- Use deploy-time parameters to configure app behavior
- Ensure apps are updatable by setting the correct template parameters

## Why This Matters

Understanding ABI methods for app lifecycle operations is essential for advanced smart contract development:

1. **Type-Safe Operations**: ABI methods provide type safety for create and update operations
2. **Initialization Logic**: Run custom logic during app creation via ABI methods
3. **Return Values**: Receive confirmation data from creation and update operations
4. **Version Management**: Update apps with new logic while maintaining state
5. **Configuration**: Use deploy-time parameters to control app behavior

Key concepts:
- **ABI Create Method**: Custom initialization logic executed during app creation
- **ABI Update Method**: Custom logic executed when updating app code
- **Return Values**: Type-safe responses from ABI methods
- **Deploy-Time Parameters**: Template variables substituted during deployment
- **Updatable Apps**: Apps configured to allow code updates after creation
- **Factory Pattern**: Using app factory to create and configure apps consistently

Common use cases:
- **Custom Initialization**: Initialize complex state during app creation
- **Versioned Updates**: Update app logic with version tracking
- **Migration Logic**: Run data migration during updates
- **Validation**: Verify conditions before allowing updates
- **Audit Trail**: Return values to track operations

## How It Works

### 1. Initialize AlgorandClient

Set up the client and load app spec:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const algorand = AlgorandClient.defaultLocalNet()
const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec
const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

Setup includes:
- Creating LocalNet client
- Getting funded account
- Loading app specification with ABI methods
- Ready for deployment

### 2. Create App Factory

Create a factory with the app spec:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: testAccount.addr,
})
```

Factory provides:
- Consistent configuration across operations
- Methods for creating apps with ABI methods
- Returns app clients for interaction
- Manages deploy-time parameters

### 3. Create Application with ABI Method

Deploy the app using an ABI create method:

```typescript
const { result: createResult, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['string_io'], // Arguments passed to the create_abi method
  deployTimeParams: {
    TMPL_UPDATABLE: 1, // Make the app updatable so we can update it later
    TMPL_DELETABLE: 1, // Make the app deletable
    TMPL_VALUE: 1,     // Custom deploy-time parameter
  },
})

console.log('App ID:', appClient.appId.toString())
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', createResult.txIds[0])

if (createResult.return) {
  console.log('Return value from create_abi:', createResult.return)
}
```

ABI create:
- Calls `create_abi` method during app creation
- Passes arguments to the method (automatically encoded)
- Substitutes deploy-time parameters into TEAL
- Returns transaction result with decoded return value
- App client is bound to the created app instance
- **IMPORTANT**: Set `TMPL_UPDATABLE: 1` to allow future updates

### 4. Update Application with ABI Method

Update the app using an ABI update method:

```typescript
const updateResult = await appClient.send.update({
  method: 'update_abi',
  args: ['updated_string'], // Arguments passed to the update_abi method
  deployTimeParams: {
    TMPL_UPDATABLE: 1, // Keep the app updatable
    TMPL_DELETABLE: 1, // Keep the app deletable
    TMPL_VALUE: 2,     // Changed deploy-time parameter
  },
})

console.log('Transaction ID:', updateResult.txIds[0])

if (updateResult.return) {
  console.log('Return value from update_abi:', updateResult.return)
}
```

ABI update:
- Calls `update_abi` method during app update
- Passes arguments to the method (automatically encoded)
- Updates approval and clear programs with new deploy-time parameters
- Returns transaction result with decoded return value
- Can modify app logic while preserving app ID and state

### 5. Handle Return Values

Access decoded return values:

```typescript
// Create return value
if (createResult.return) {
  const value = createResult.return as string
  console.log('Created with value:', value)
}

// Update return value
if (updateResult.return) {
  const value = updateResult.return as string
  console.log('Updated with value:', value)
}
```

Return values:
- Automatically decoded based on ABI method signature
- Type matches method return type in app spec
- `undefined` if method has no return value
- Can be any ABI type (string, uint64, address, tuple, etc.)

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
Test account address: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

=== Creating Application with ABI Method ===
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1054 via transaction 2TV4R24PR46EAEKCZLUWVXAGXMEGNJTNHH57QAR442BDBV7E3OOA
App created successfully!
  App ID: 1054
  App Address: JYJEGKPTKMW4SA2GX5J4XGGS2I4K2I2LLZN534P5KDEG4H7WYH2CF256K4
  Transaction ID: 2TV4R24PR46EAEKCZLUWVXAGXMEGNJTNHH57QAR442BDBV7E3OOA
  Return value from create_abi: string_io

=== Updating Application with ABI Method ===
App 1054 updated with update_abi(updated_string) by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA via transaction VDGCKKFEW3PAYLJI6PIXHXGZXCJBPN3DQZ4E6KS2G6KJ45MY4SXA
App updated successfully!
  Transaction ID: VDGCKKFEW3PAYLJI6PIXHXGZXCJBPN3DQZ4E6KS2G6KJ45MY4SXA
  Return value from update_abi: updated_string

=== Example Complete ===
Summary:
  - Created an app with ABI method "create_abi" and retrieved return value
  - Updated the app with ABI method "update_abi" and verified the result
  - Used deploy-time parameters to configure app behavior
  - ABI methods provide type-safe interactions and return value handling

✅ Example completed successfully!
```

## Common Patterns

### Create with Initialization

```typescript
// Create app with custom initialization logic
const { result, appClient } = await factory.send.create({
  method: 'initialize',
  args: [adminAddress, 100n, 'MyApp'],
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 0,
  },
})

console.log('Initialized with return value:', result.return)
```

### Versioned Updates

```typescript
// Update app with version tracking
const updateResult = await appClient.send.update({
  method: 'update_to_version',
  args: [2n], // Version 2
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VERSION: 2,
  },
})

const newVersion = updateResult.return as bigint
console.log('Updated to version:', newVersion)
```

### Conditional Updates

```typescript
// Check if update is allowed before proceeding
const canUpdateResult = await appClient.send.call({
  method: 'can_update',
  args: [newAdminAddress],
})

if (canUpdateResult.return) {
  const updateResult = await appClient.send.update({
    method: 'update_with_new_admin',
    args: [newAdminAddress],
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 1,
    },
  })
  console.log('Update successful:', updateResult.return)
} else {
  console.log('Update not allowed')
}
```

### Multiple Create Attempts

```typescript
// Try different initialization approaches
try {
  const { result, appClient } = await factory.send.create({
    method: 'create_with_validation',
    args: [value],
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: value,
    },
  })

  console.log('Created successfully:', result.return)
} catch (error) {
  console.error('Creation failed:', error.message)
  // Try alternative approach
}
```

### Return Value Validation

```typescript
// Validate return value after create
const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['input'],
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 1,
  },
})

if (result.return) {
  const returnValue = result.return as string
  if (returnValue.includes('success')) {
    console.log('Creation validated successfully')
  } else {
    console.warn('Unexpected return value:', returnValue)
  }
}
```

### Update with Migration

```typescript
// Run data migration during update
const migrationResult = await appClient.send.update({
  method: 'update_with_migration',
  args: [oldVersion, newVersion],
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VERSION: newVersion,
  },
})

const migratedRecords = migrationResult.return as bigint
console.log('Migrated records:', migratedRecords.toString())
```

## Best Practices

1. **Always Set TMPL_UPDATABLE for Updateable Apps**
   ```typescript
   // Good: Explicitly set updatable flag
   const { result, appClient } = await factory.send.create({
     method: 'create_abi',
     args: ['input'],
     deployTimeParams: {
       TMPL_UPDATABLE: 1, // Allow updates
       TMPL_DELETABLE: 1,
       TMPL_VALUE: 1,
     },
   })

   // Later, you can update
   await appClient.send.update({
     method: 'update_abi',
     args: ['new_input'],
     deployTimeParams: {
       TMPL_UPDATABLE: 1,
       TMPL_DELETABLE: 1,
       TMPL_VALUE: 2,
     },
   })
   ```

2. **Check Return Values**
   ```typescript
   // Good: Check if return value exists
   const { result, appClient } = await factory.send.create({
     method: 'create_abi',
     args: ['input'],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
   })

   if (result.return !== undefined) {
     console.log('Return value:', result.return)
   } else {
     console.log('No return value')
   }
   ```

3. **Use Descriptive Method Names**
   ```typescript
   // Good: Clear method names
   await factory.send.create({
     method: 'initialize_with_admin',
     args: [adminAddress],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })

   await appClient.send.update({
     method: 'upgrade_to_v2',
     args: [],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VERSION: 2 },
   })

   // Avoid: Generic names
   await factory.send.create({ method: 'method1', args: [...] })
   ```

4. **Maintain Deploy-Time Parameters**
   ```typescript
   // Good: Keep track of deploy-time parameters
   const deployTimeParams = {
     TMPL_UPDATABLE: 1,
     TMPL_DELETABLE: 1,
     TMPL_VALUE: 1,
   }

   const { result, appClient } = await factory.send.create({
     method: 'create_abi',
     args: ['input'],
     deployTimeParams,
   })

   // Use same parameters (or modified versions) for update
   await appClient.send.update({
     method: 'update_abi',
     args: ['updated'],
     deployTimeParams: {
       ...deployTimeParams,
       TMPL_VALUE: 2, // Only change what's needed
     },
   })
   ```

5. **Handle Different Return Types**
   ```typescript
   // String return
   const stringResult = await factory.send.create({
     method: 'create_with_name',
     args: ['MyApp'],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })
   const name = stringResult.result.return as string

   // Number return
   const numberResult = await factory.send.create({
     method: 'create_with_version',
     args: [1n],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 0 },
   })
   const version = numberResult.result.return as bigint
   ```

6. **Store App Client for Multiple Operations**
   ```typescript
   // Good: Store app client after creation
   const { result, appClient } = await factory.send.create({
     method: 'create_abi',
     args: ['input'],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
   })

   // Use app client for subsequent operations
   await appClient.send.call({ method: 'operation1', args: [] })
   await appClient.send.call({ method: 'operation2', args: [] })
   await appClient.send.update({
     method: 'update_abi',
     args: ['updated'],
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 2 },
   })
   ```

7. **Error Handling for Updates**
   ```typescript
   // Good: Handle update errors gracefully
   try {
     const updateResult = await appClient.send.update({
       method: 'update_abi',
       args: ['new_value'],
       deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 2 },
     })
     console.log('Update successful:', updateResult.return)
   } catch (error) {
     console.error('Update failed:', error.message)
     // App might not be updatable, or update logic failed
     // Handle appropriately
   }
   ```

## Comparison: Bare vs ABI Create/Update

### Bare Create/Update
```typescript
// No method called during creation/update
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
})
// No return value, no custom initialization logic
```

### ABI Create/Update (This Example)
```typescript
// ABI method called during creation/update
const { result, appClient } = await factory.send.create({
  method: 'create_abi',
  args: ['input'],
  deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 1 },
})
// Has return value, runs custom initialization logic
console.log('Return value:', result.return)
```

**When to use:**
- **Bare**: Simple apps with no initialization logic needed
- **ABI**: Apps requiring custom setup, validation, or return values

## Key Takeaways

- ABI create methods allow custom initialization logic during app creation
- ABI update methods allow custom logic during app updates
- Return values provide confirmation and data from create/update operations
- Deploy-time parameters configure app behavior at creation and update time
- **CRITICAL**: Set `TMPL_UPDATABLE: 1` to allow updates after creation
- App client is bound to the created app for subsequent operations
- Use same or modified deploy-time parameters when updating
- Return values are automatically decoded based on ABI method signature
- Factory pattern provides consistent configuration across operations
- ABI methods provide type safety for all operations
- Check return values for `undefined` before using
- Updates replace approval and clear programs while preserving app ID
- Apps must be created with updatable flag to allow updates later
- Both create and update can pass arguments to ABI methods

This example demonstrates advanced app lifecycle management using ABI methods for type-safe, feature-rich smart contract deployment and updates.
