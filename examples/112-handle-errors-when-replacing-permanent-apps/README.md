# Handle Errors When Replacing Permanent Apps

This example demonstrates proper error handling when attempting to replace a permanent (non-deletable) app. It shows how to detect and handle logic errors that occur when trying to delete an app that cannot be deleted.

## Key Concepts

- **Permanent Apps**: Apps deployed with `deletable: false` cannot be deleted
- **Deployment Constraints**: Understanding app lifecycle limitations
- **Logic Errors**: Errors from TEAL program execution during deletion attempts
- **Error Handling**: Properly catching and parsing deployment errors
- **Defensive Programming**: Planning for failed operations

## What This Example Shows

This example demonstrates:

1. **Deploy Permanent App** - Create an app with `deletable: false`
2. **Attempt Replacement** - Try to use `onUpdate='replace'` strategy
3. **Handle Failure** - Catch and parse the resulting logic error
4. **Understand Constraints** - Learn why the operation failed
5. **Alternative Strategies** - Know what to do instead

The key insight: When `onUpdate='replace'` is used, it attempts to:
1. Delete the old app (this fails for permanent apps!)
2. Create a new app (never reached)

## Why This Matters

In production, you might encounter situations where:
- Apps were deployed as permanent by policy
- You need to update code but can't delete the app
- Deployment strategies fail unexpectedly
- You need to handle errors gracefully

Understanding these constraints prevents deployment failures and helps you choose the right strategy.

## Quick Start

### Prerequisites

1. Start AlgoKit LocalNet:
   ```bash
   algokit localnet start
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Run the Example

```bash
npm start
```

## Code Walkthrough

### 1. Deploy Permanent App

```typescript
const deployment1 = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentApp',
    version: '1.0',
    deletable: false,  // ⚠️ Makes app permanent!
    updatable: true,   // Can still update code
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgram,
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
// App is now permanent - cannot be deleted
```

### 2. Attempt to Replace (Will Fail)

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentApp',
    version: '2.0',
    deletable: false,
    updatable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: approvalProgramV2,  // Updated code
    clearStateProgram: clearProgram,
    schema: { /* same schema */ },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onUpdate: 'replace' as const,  // ❌ Will attempt to delete!
}

try {
  await algorand.appDeployer.deploy(deployment2)
  // Never reaches here
} catch (error: any) {
  // Error: transaction rejected by ApprovalProgram
  console.log('Deletion failed - app is permanent!')
}
```

### 3. Parse the Logic Error

```typescript
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

catch (error: any) {
  // Parse the logic error for details
  const logicError = LogicError.parseLogicError(error)

  if (logicError) {
    console.log('Transaction ID:', logicError.txId)
    console.log('Program:', logicError.program)
    console.log('Line:', logicError.line)
    console.log('Message:', logicError.message)
  }
}
```

## Expected Output

```
=== Deploying Permanent App (deletable: false) ===
Using account: BN6RMICNNJKXWLTIU67A42IBBG2JM2ZWUQTYYGCHGAQHYEIQRWYVG5URSE

App PermanentApp not found; deploying app with version 1.0.
App created with ID 1017
✅ Permanent app deployed successfully!
   App ID: 1017n
   Version: 1.0
   Deletable: false ⚠️
   Updatable: true

=== Attempting to Replace Permanent App (v2.0) ===
⚠️  This should fail because the app is not deletable...

Existing app PermanentApp found with app id 1017 and version 1.0.
Detected a TEAL update in app 1017
App is not deletable and onUpdate=ReplaceApp, will attempt to create new app and delete old app, delete will most likely fail
Deploying a new PermanentApp app; deploying app with version 2.0.
Deleting existing PermanentApp app with id 1017

✅ Expected error occurred!

=== Error Details ===
Error message: transaction rejected by ApprovalProgram

=== Why Did This Fail? ===
The app was deployed with deletable: false, making it permanent.
When you try to use the "replace" strategy, it attempts to:
  1. Delete the old app
  2. Create a new app

Step 1 fails because the app's approval program does not allow deletion.
This is by design - permanent apps cannot be deleted!

=== What Should You Do Instead? ===
For permanent apps, you have these options:
  1. Use onUpdate: "update" to update the existing app in place
  2. Deploy a completely new app with a different name
  3. Design the app to be deletable from the start if replacement is needed

=== Verification ===
Original app 1017n is still alive and unchanged.
```

## Understanding Permanent Apps

### What Makes an App Permanent?

An app becomes permanent when deployed with `deletable: false`:

```typescript
const metadata = {
  name: 'MyApp',
  version: '1.0',
  deletable: false,  // ← This makes it permanent
  updatable: true,   // Can still update, just can't delete
}
```

When `deletable: false`, the deploy-time parameter `TMPL_DELETABLE` is set to `0` in the TEAL code, causing the approval program to reject any deletion attempts.

### Properties of Permanent Apps

| Property | Permanent App | Deletable App |
|----------|---------------|---------------|
| Can be deleted | ❌ No | ✅ Yes |
| Can be updated (if updatable=true) | ✅ Yes | ✅ Yes |
| App ID stays same | ✅ Always | ✅ Until deleted |
| State preserved | ✅ Always | ✅ Until deleted |
| Can use onUpdate='replace' | ❌ No | ✅ Yes |
| Can use onUpdate='update' | ✅ Yes | ✅ Yes |

### When to Use Permanent Apps

✅ **Use permanent apps when:**
- App contains critical user data that must never be lost
- Regulatory compliance requires immutability
- App ID must remain constant forever
- Users depend on the app always being available
- Smart contracts reference your app ID

❌ **Don't use permanent apps when:**
- You might need to replace the app later
- Schema changes might be needed
- Testing and development phases
- You want flexibility to start over

## Handling Replacement Failures

### Detecting the Error

```typescript
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  // Check for deletion failure
  if (error.message.includes('transaction rejected by ApprovalProgram') ||
      error.message.includes('App is not deletable and onUpdate=ReplaceApp')) {
    console.log('Cannot delete permanent app')
    // Handle appropriately
  }
}
```

### Using LogicError for Details

```typescript
import { LogicError } from '@algorandfoundation/algokit-utils/types/logic-error'

try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  const logicError = LogicError.parseLogicError(error)

  if (logicError) {
    console.log('Program that failed:', logicError.program)  // 'approval' or 'clear'
    console.log('Line number:', logicError.line)
    console.log('Transaction:', logicError.txId)
    console.log('Message:', logicError.message)

    // Extract TEAL source if available
    if (logicError.traces) {
      console.log('TEAL trace:', logicError.traces)
    }
  }
}
```

## Alternative Strategies for Permanent Apps

### Strategy 1: Update in Place (Recommended)

```typescript
// ✅ Good: Update the existing permanent app
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentApp',
    version: '2.0',  // Increment version
    deletable: false,
    updatable: true,  // Must be true!
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: newApprovalProgram,  // Updated code
    clearStateProgram: clearProgram,
    schema: { /* same schema */ },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
  onUpdate: 'update' as const,  // ✅ Updates in place
}

const result = await algorand.appDeployer.deploy(deployment)
// Same app ID, updated code
console.log('Updated app:', result.appId)  // Same ID as before
console.log('New version:', result.version)  // 2.0
```

### Strategy 2: Deploy New App with Different Name

```typescript
// ✅ Good: Create a completely new app
const deployment = {
  sender: deployer.addr,
  metadata: {
    name: 'PermanentAppV2',  // Different name
    version: '1.0',  // Fresh start
    deletable: false,
    updatable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: newApprovalProgram,
    clearStateProgram: clearProgram,
    schema: { /* new schema */ },
  },
  updateParams: { sender: deployer.addr },
  deleteParams: { sender: deployer.addr },
}

const result = await algorand.appDeployer.deploy(deployment)
// New app ID
console.log('New app:', result.appId)
```

### Strategy 3: Graceful Migration

```typescript
// Migrate users from old permanent app to new app
async function migrateToNewApp(oldAppId: bigint) {
  console.log('Step 1: Deploy new app')
  const newApp = await algorand.appDeployer.deploy({
    sender: deployer.addr,
    metadata: {
      name: 'MyApp-V2',
      version: '1.0',
      deletable: false,
      updatable: true,
    },
    createParams: { /* ... */ },
    updateParams: { sender: deployer.addr },
    deleteParams: { sender: deployer.addr },
  })

  console.log('Step 2: Update old app to redirect to new app')
  // Update old app's code to redirect users to new app
  const redirectCode = createRedirectCode(newApp.appId)

  await algorand.appDeployer.deploy({
    sender: deployer.addr,
    metadata: {
      name: 'MyApp',  // Old app name
      version: '1.1',
      deletable: false,
      updatable: true,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: redirectCode,
      clearStateProgram: clearProgram,
      schema: { /* same schema */ },
    },
    updateParams: { sender: deployer.addr },
    deleteParams: { sender: deployer.addr },
    onUpdate: 'update',  // Update in place
  })

  console.log('Migration complete!')
  console.log('Old app:', oldAppId, '(redirects to new)')
  console.log('New app:', newApp.appId)
}
```

## Best Practices

### 1. Check Deletability Before Replacement

```typescript
// ✅ Good: Check before attempting replace
async function safeReplace(appName: string, newCode: string) {
  // Get existing app info
  const apps = await algorand.appDeployer.getCreatorAppsByName(creator)
  const existingApp = apps.apps[appName]

  if (existingApp && !existingApp.deletable) {
    console.warn('App is permanent, using update instead of replace')

    return await algorand.appDeployer.deploy({
      // ...
      onUpdate: 'update',  // Use update instead
    })
  }

  // Safe to use replace
  return await algorand.appDeployer.deploy({
    // ...
    onUpdate: 'replace',
  })
}
```

### 2. Provide Clear Error Messages

```typescript
// ✅ Good: Helpful error messages
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  if (error.message.includes('App is not deletable')) {
    throw new Error(
      `Cannot replace permanent app "${deployment.metadata.name}". ` +
      `The app was deployed with deletable=false. ` +
      `Options: ` +
      `1) Use onUpdate="update" to update in place, ` +
      `2) Deploy a new app with a different name, ` +
      `3) Contact admin to manually delete if needed.`
    )
  }
  throw error
}
```

### 3. Log Deployment Metadata

```typescript
// ✅ Good: Track app deployment properties
const result = await algorand.appDeployer.deploy(deployment)

console.log('App deployed:', {
  appId: result.appId,
  name: result.name,
  version: result.version,
  deletable: result.deletable,
  updatable: result.updatable,
  operation: result.operationPerformed,
})

// Save to database for future reference
await db.apps.insert({
  appId: result.appId,
  name: result.name,
  deletable: result.deletable,
  deployedAt: new Date(),
})
```

### 4. Use Try-Catch for All Deployments

```typescript
// ✅ Good: Always handle deployment errors
async function deployWithErrorHandling(deployment: AppDeployParams) {
  try {
    const result = await algorand.appDeployer.deploy(deployment)
    console.log('✅ Deployment successful:', result.appId)
    return result
  } catch (error: any) {
    console.error('❌ Deployment failed')

    // Parse logic error if available
    const logicError = LogicError.parseLogicError(error)
    if (logicError) {
      console.error('Logic error:', logicError.message)
      console.error('Transaction:', logicError.txId)
    }

    // Log for debugging
    await logDeploymentFailure({
      appName: deployment.metadata.name,
      error: error.message,
      timestamp: new Date(),
    })

    throw error
  }
}
```

## Common Pitfalls

### 1. Forgetting Apps Are Permanent

```typescript
// ❌ Bad: Assuming all apps can be replaced
const deployment = {
  // ...
  onUpdate: 'replace',  // May fail for permanent apps!
}

// ✅ Good: Check or handle errors
try {
  await algorand.appDeployer.deploy({
    // ...
    onUpdate: 'replace',
  })
} catch (error: any) {
  if (error.message.includes('not deletable')) {
    // Fall back to update strategy
    await algorand.appDeployer.deploy({
      // ...
      onUpdate: 'update',
    })
  }
}
```

### 2. Not Parsing Logic Errors

```typescript
// ❌ Bad: Generic error handling
catch (error: any) {
  console.error('Deployment failed:', error)
  // No useful information
}

// ✅ Good: Parse and extract details
catch (error: any) {
  const logicError = LogicError.parseLogicError(error)
  if (logicError) {
    console.error('TEAL error in', logicError.program, 'at line', logicError.line)
    console.error('Message:', logicError.message)
  } else {
    console.error('General error:', error.message)
  }
}
```

### 3. Setting deletable=false Without Planning

```typescript
// ❌ Bad: Making app permanent without considering consequences
const metadata = {
  name: 'MyApp',
  version: '1.0',
  deletable: false,  // ← Are you sure?
  updatable: true,
}

// ✅ Good: Document the decision
/**
 * App deployment configuration for MyApp
 *
 * IMPORTANT: This app is PERMANENT (deletable=false)
 * - Cannot be deleted once deployed
 * - Can only be updated if updatable=true
 * - Replacement strategy will NOT work
 * - App ID will never change
 *
 * Rationale: App stores critical user data that must never be lost
 */
const metadata = {
  name: 'MyApp',
  version: '1.0',
  deletable: false,
  updatable: true,
}
```

### 4. Not Testing Error Paths

```typescript
// ❌ Bad: Only testing happy path
test('deploy app', async () => {
  const result = await algorand.appDeployer.deploy(deployment)
  expect(result.appId).toBeDefined()
})

// ✅ Good: Test error scenarios
test('replace permanent app fails gracefully', async () => {
  // Deploy permanent app
  const app1 = await algorand.appDeployer.deploy({
    metadata: { name: 'App', version: '1.0', deletable: false, updatable: true },
    // ...
  })

  // Attempt to replace - should fail
  await expect(
    algorand.appDeployer.deploy({
      metadata: { name: 'App', version: '2.0', deletable: false, updatable: true },
      // ...
      onUpdate: 'replace',
    })
  ).rejects.toThrow(/transaction rejected|not deletable/)

  // Verify original app unchanged
  const appInfo = await algorand.client.algod.getApplicationByID(Number(app1.appId)).do()
  expect(appInfo.params).toBeDefined()
})
```

## Learn More

- [Example 110: Fail-Fast Deployment with onUpdate='fail'](../110-fail-fast-deployment-strategy-with-onupdatefail/) - Preventing accidental updates
- [Example 111: Fail-Fast Strategy for Schema Breaks](../111-fail-fast-strategy-for-schema-breaks/) - Handling schema changes
- [Example 106: Deploy App with Replacement Strategy](../106-deploy-app-with-replacement-strategy/) - When replacement works
- [Example 104: Debug TEAL Logic Errors](../104-debug-teal-logic-errors-with-enhanced-error-messages/) - Understanding logic errors
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand App Lifecycle](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
