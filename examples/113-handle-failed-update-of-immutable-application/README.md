# Handle Failed Update of Immutable Application

This example demonstrates what happens when you attempt to update an immutable application (deployed with `updatable: false`). It shows how to properly detect, handle, and parse the logic error that occurs when the app's approval program rejects an update transaction.

## Key Concepts

### Immutable Applications

An **immutable application** is one that cannot be updated after deployment. This is controlled by:

1. **Metadata Flag**: Setting `updatable: false` in the app metadata
2. **TEAL Template**: The `TMPL_UPDATABLE` template variable in the approval program is set to 0
3. **Logic Enforcement**: The approval program returns 0 (fails) for `UpdateApplication` transactions

Immutable apps provide:
- **Security**: Guarantee that the app logic cannot be changed
- **Trust**: Users can verify the exact code that will always execute
- **Permanence**: Critical for DeFi protocols and other trust-requiring applications

## Code Walkthrough

### Step 1: Deploy an Immutable App

```typescript
const metadata = {
  name: 'MyImmutableApp',
  version: '1.0',
  updatable: false,  // Makes the app immutable
  deletable: false,
}

const deployment1 = {
  sender: deployer.addr,
  metadata: metadata,
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgramV1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const result1 = await algorand.appDeployer.deploy(deployment1)
```

The deployment:
- Sets `updatable: false` in metadata
- AlgoKit Utils automatically sets `TMPL_UPDATABLE=0` during compilation
- The approval program will reject any update attempts

### Step 2: Attempt to Update the Immutable App

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: {
    ...metadata,
    version: '2.0',
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgramV2,  // Different TEAL code
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onUpdate: 'update' as const,  // Try to update in place
}

try {
  await algorand.appDeployer.deploy(deployment2)
  console.log('❌ ERROR: Update should have failed!')
} catch (error: any) {
  console.log('✅ Update failed as expected')
}
```

What happens:
1. Deployer detects the TEAL code has changed
2. `onUpdate: 'update'` tells it to update the existing app
3. An `UpdateApplication` transaction is sent
4. The approval program rejects it because `TMPL_UPDATABLE=0`
5. Transaction fails with a logic error

### Step 3: Parse the Logic Error

```typescript
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

const logicError = LogicError.parseLogicError(error)

if (logicError) {
  console.log('Transaction ID:', logicError.txId)
  console.log('Program Counter:', logicError.pc)
  console.log('Message:', logicError.msg)
  console.log('Description:', logicError.desc)
}
```

The `LogicError` class provides structured information about what failed in the TEAL program.

## Understanding Immutable Apps

### What Makes an App Immutable?

The immutability is enforced at multiple levels:

1. **Metadata Level**: The `updatable: false` flag is stored in the indexer
2. **Template Level**: `TMPL_UPDATABLE` is set to 0 during compilation
3. **TEAL Level**: The approval program code enforces the restriction

```teal
handle_update:
int TMPL_UPDATABLE  # Evaluates to 0 for immutable apps
return              # Returns 0, rejecting the update
```

### Immutable vs Updatable Apps

| Aspect | Immutable App | Updatable App |
|--------|--------------|---------------|
| Metadata | `updatable: false` | `updatable: true` |
| TMPL_UPDATABLE | 0 | 1 |
| UpdateApplication | Always fails | Can succeed |
| Code changes | Impossible | Possible with update txn |
| Trust model | Code is permanent | Code can change |
| Use cases | DeFi, critical contracts | Apps needing upgrades |

### When to Use Immutable Apps

**Use immutable apps (`updatable: false`) when:**
- The app handles significant value (DeFi protocols)
- Users need to trust the exact code will never change
- The logic is well-tested and won't need updates
- Regulatory or compliance requirements demand it
- You want maximum security guarantees

**Use updatable apps (`updatable: true`) when:**
- The app is in development or testing
- You may need to fix bugs or add features
- The use case requires adaptability
- You have a governance mechanism for updates

## Handling Update Failures

### Detecting Immutable App Update Failures

```typescript
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  // Check if it's an update failure
  if (error.message.includes('transaction rejected by ApprovalProgram')) {
    console.log('Update failed - app may be immutable')

    // Parse for more details
    const logicError = LogicError.parseLogicError(error)
    if (logicError) {
      // Handle the logic error
      console.log('Program Counter:', logicError.pc)
      console.log('Message:', logicError.msg)
    }
  }
}
```

### Common Error Messages

When updating an immutable app fails, you'll see:
- `"transaction rejected by ApprovalProgram"`
- `"logic eval error"`
- Program counter pointing to the `TMPL_UPDATABLE` check

## Alternative Strategies

When you need to "update" an immutable app, consider:

### 1. Deploy a New App

Deploy a completely new app instance with a different name:

```typescript
const newDeployment = {
  sender: deployer.addr,
  metadata: {
    name: 'MyImmutableAppV2',  // Different name
    version: '1.0',
    updatable: false,
    deletable: false,
  },
  createParams: { /* ... */ },
  updateParams: { /* ... */ },
  deleteParams: { /* ... */ },
}

const result = await algorand.appDeployer.deploy(newDeployment)
```

### 2. Use App Append Strategy

Let the deployer create a new instance automatically:

```typescript
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'MyImmutableApp',
    version: '2.0',
    updatable: false,
    deletable: false,
  },
  createParams: { /* ... */ },
  updateParams: { /* ... */ },
  deleteParams: { /* ... */ },
  onSchemaBreak: 'append' as const,  // Creates new app on changes
  onUpdate: 'append' as const,       // Creates new app on updates
}
```

### 3. Plan for Upgrades with Proxy Pattern

For critical apps that may need updates, implement a proxy pattern:

```typescript
// Immutable proxy app that delegates to an updatable implementation
const proxyMetadata = {
  name: 'Proxy',
  version: '1.0',
  updatable: false,  // Proxy itself is immutable
  deletable: false,
}

const implementationMetadata = {
  name: 'Implementation',
  version: '1.0',
  updatable: true,   // Implementation can be updated
  deletable: false,
}
```

The proxy stores the implementation app ID and delegates calls to it.

## Best Practices

### 1. Check App Metadata Before Updates

Always check if an app is updatable before attempting updates:

```typescript
const appInfo = await algorand.app.getById(appId)

// Check the on-chain metadata (if stored)
const boxValue = await algorand.app.getBoxValue(appId, 'metadata')
const metadata = JSON.parse(new TextDecoder().decode(boxValue))

if (metadata.updatable === false) {
  console.log('App is immutable - cannot update')
  // Use alternative strategy
}
```

### 2. Use Try-Catch for All Deployments

Always wrap deployment calls in try-catch blocks:

```typescript
try {
  const result = await algorand.appDeployer.deploy(deployment)
  console.log('Deployment successful:', result.appId)
} catch (error: any) {
  console.error('Deployment failed:', error.message)

  const logicError = LogicError.parseLogicError(error)
  if (logicError) {
    // Handle logic errors specifically
  }
}
```

### 3. Document Immutability Decisions

When deploying immutable apps, document why:

```typescript
const metadata = {
  name: 'CriticalDeFiContract',
  version: '1.0',
  updatable: false,  // IMMUTABLE: Handles user funds, must be permanent
  deletable: false,  // PERMANENT: Cannot be removed from blockchain
}
```

### 4. Test Both Scenarios

Test both updatable and immutable apps in your test suite:

```typescript
describe('App updates', () => {
  it('should update an updatable app', async () => {
    const metadata = { name: 'TestApp', version: '1.0', updatable: true, deletable: true }
    // Deploy and update...
  })

  it('should fail to update an immutable app', async () => {
    const metadata = { name: 'TestApp', version: '1.0', updatable: false, deletable: false }
    // Deploy and expect update to fail...
  })
})
```

## Common Pitfalls

### 1. Forgetting Apps Are Immutable

**Problem**: Attempting to update production apps that were deployed as immutable.

**Solution**:
- Document which apps are immutable in your deployment config
- Check app metadata before update attempts
- Have a clear strategy for new versions (new app deployment)

### 2. Not Parsing Logic Errors

**Problem**: Generic error handling doesn't provide useful information.

**Solution**:
```typescript
catch (error: any) {
  // Don't just log the error
  console.error(error.message)  // ❌ Not helpful

  // Parse it for details
  const logicError = LogicError.parseLogicError(error)  // ✅ Better
  if (logicError) {
    console.log('Failed at PC:', logicError.pc)
    console.log('Reason:', logicError.desc)
  }
}
```

### 3. Setting Immutable Without Planning

**Problem**: Deploying apps as immutable without considering future needs.

**Solution**:
- Use `updatable: true` during development
- Only set `updatable: false` for final production deployment
- Consider proxy patterns for critical apps that may need updates
- Have a migration strategy if new versions are needed

### 4. Not Testing Update Failures

**Problem**: Production deployments fail because update logic wasn't tested.

**Solution**:
- Write tests that attempt to update immutable apps
- Verify error handling works correctly
- Test alternative strategies (new app deployment, append mode)

## Running the Example

### Prerequisites

1. Start LocalNet:
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

### Expected Output

```
=== Deploying Immutable App ===
Using account: <ADDRESS>

✅ Immutable app deployed successfully
   App ID: 1023n
   Version: 1.0
   Updatable: false ⚠️
   Deletable: false ⚠️

=== Attempting to Update Immutable App ===
⚠️  This should fail because the app is not updatable...

✅ Update failed as expected (app is immutable)

=== Error Details ===
Error message: Error resolving execution info via simulate in transaction 0: transaction rejected by ApprovalProgram

=== Parsed Logic Error ===
Transaction ID: <TXID>
Program Counter: <PC>
Message: <MSG>
Description: <DESC>

=== Why Did This Fail? ===
The app was deployed with updatable: false, making it immutable.
When you try to use the "update" strategy, it attempts to update the app.
However, the approval program rejects the update because TMPL_UPDATABLE=0.
This is by design - immutable apps cannot be updated!

=== Summary ===
Immutable apps cannot be updated once deployed.
This is a security feature to ensure app logic cannot be changed.
When deploying apps, carefully consider whether they should be updatable.

✨ Example completed successfully!
```

## Key Takeaways

1. **Immutable Apps**: Setting `updatable: false` makes apps permanently unchangeable
2. **Template Variables**: `TMPL_UPDATABLE` is set to 0 for immutable apps
3. **Logic Errors**: Update attempts fail with logic errors that can be parsed
4. **LogicError Class**: Use `LogicError.parseLogicError()` to extract error details
5. **Alternative Strategies**: Deploy new apps or use append mode when updates are needed
6. **Security vs Flexibility**: Choose immutability for security, updatability for flexibility
7. **Error Handling**: Always wrap deployment calls in try-catch blocks
8. **Planning**: Consider update strategy before deploying immutable apps

## Related Examples

- [example-111-fail-fast-strategy-for-schema-breaks](../111-fail-fast-strategy-for-schema-breaks) - Handling schema changes with fail strategy
- [example-112-handle-errors-when-replacing-permanent-apps](../112-handle-errors-when-replacing-permanent-apps) - Handling errors when deleting permanent apps
- [example-10-appclient-create-and-call](../10-appclient-create-and-call) - Basic app deployment
- [example-33-arc56-error-handling](../33-arc56-error-handling) - General error handling patterns

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Guide](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [LogicError API Reference](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/code/modules/types_logic_error.md)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
