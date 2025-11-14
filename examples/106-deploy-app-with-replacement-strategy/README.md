# Deploy App with Replacement Strategy

This example demonstrates the concept of app replacement deployment strategy - deleting an old app and creating a completely new one with different parameters or code.

## Key Concepts

- **App Replacement**: Deleting an existing app and creating a new one (fresh start)
- **Delete + Create Workflow**: The manual process of replacement
- **App IDs**: Understanding that replacement creates a new app ID
- **Deletable Apps**: Apps must have `TMPL_DELETABLE=1` to allow deletion
- **State Reset**: All global and local state is reset with a new app

## What This Example Shows

1. Creating an initial app (v1.0) with `TMPL_VALUE=100`
2. Deleting the app using `send.delete.bare()`
3. Creating a replacement app (v2.0) with `TMPL_VALUE=200`
4. Comparing app IDs (they are different)
5. Verifying the old app no longer exists
6. Understanding when to use replacement vs. update

## Code Walkthrough

### Create Initial App (v1.0)

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const deployer = algorand.account.random()
await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

const { appClient: appClient1, result: result1 } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1, // Make it updatable
    TMPL_DELETABLE: 1, // Make it deletable (required for replacement)
    TMPL_VALUE: 100,   // Version 1.0 marker
  },
})

console.log('App ID:', appClient1.appId)
```

Deploy the initial version with `TMPL_DELETABLE=1` (required for deletion).

### Delete the Old App

```typescript
const firstAppId = appClient1.appId

// Delete the old app
const deleteResult = await appClient1.send.delete.bare({})

console.log('Delete Transaction ID:', deleteResult.txIds[0])
```

**Key point**: Only apps with `TMPL_DELETABLE=1` can be deleted. The deployer must be the app creator.

### Create Replacement App (v2.0)

```typescript
// Create a new app with different parameters
const { appClient: appClient2, result: result2 } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 200,   // Version 2.0 marker (different from v1)
  },
})

console.log('New App ID:', appClient2.appId)
console.log('App IDs are different:', firstAppId !== appClient2.appId)
// Output: true ✅
```

**Important**: The new app gets a completely different app ID. This is a fresh deployment, not an update.

### Verify Deletion

```typescript
try {
  await algorand.client.algod.getApplicationByID(Number(firstAppId)).do()
  console.log('Old app still exists (unexpected)')
} catch (error: any) {
  if (error.status === 404 || error.message.includes('application does not exist')) {
    console.log('✅ Old app successfully deleted!')
  }
}
```

Verify that the old app no longer exists on chain.

## API Patterns (AlgoKit Utils v9.1.2)

### Deleting an App

```typescript
// App must be deletable (TMPL_DELETABLE=1)
const deleteResult = await appClient.send.delete.bare({})

// Or with ABI method if your contract has a delete method
const deleteResult = await appClient.send.delete.deleteAbi({
  args: { /* any args */ },
})
```

### Creating a New App

```typescript
// Use the same factory but create a new instance
const { appClient: newAppClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: newValue,
  },
})

// newAppClient.appId will be different from the deleted app
```

### Replacement Workflow

```typescript
// 1. Create initial app
const { appClient: v1 } = await factory.send.create.bare({ deployTimeParams: { ... } })
const oldAppId = v1.appId

// 2. Delete old app
await v1.send.delete.bare({})

// 3. Create new app
const { appClient: v2 } = await factory.send.create.bare({ deployTimeParams: { ... } })
const newAppId = v2.appId

// 4. Verify they're different
console.log(oldAppId !== newAppId) // true
```

## When to Use Replacement

### Good Use Cases ✅

```typescript
// Testing and Development
// - Rapid iteration during development
// - Testing deployment workflows
// - Experimenting with different configurations

// Major Breaking Changes
// - Complete contract rewrite
// - Incompatible state schema changes
// - New architecture that can't be updated

// Fresh Start Needed
// - Want to reset all state
// - Need a new app ID for organizational reasons
// - Fixing a fundamentally broken deployment
```

### Bad Use Cases ❌

```typescript
// Production Apps with Users
// - Users would lose access with old app ID
// - Existing integrations would break
// - State data would be lost

// Minor Updates
// - Use UPDATE strategy instead
// - Preserves app ID and state
// - Doesn't break existing integrations

// Apps Referenced by Other Contracts
// - Other contracts storing your app ID would break
// - Cross-app calls would fail
// - Requires updating all dependent contracts
```

## Replacement vs. Update

### Replacement Strategy

```typescript
// What it does:
// 1. DELETE old app
// 2. CREATE new app
// Result: New app ID, fresh state

const { appClient: oldApp } = await factory.send.create.bare({ ... })
const oldId = oldApp.appId

await oldApp.send.delete.bare({})

const { appClient: newApp } = await factory.send.create.bare({ ... })
const newId = newApp.appId

console.log(oldId !== newId) // true - different app!
```

### Update Strategy

```typescript
// What it does:
// 1. UPDATE existing app code
// Result: Same app ID, preserved state

const { appClient } = await factory.send.create.bare({ ... })
const appId = appClient.appId

// Update the app with new code
await appClient.send.update.bare({
  approvalProgram: newApprovalProgram,
  clearProgram: newClearProgram,
})

// Same app ID, updated code
console.log(appClient.appId === appId) // true - same app!
```

## Important Considerations

### Deletion Requirements

```typescript
// App must be deletable
deployTimeParams: {
  TMPL_DELETABLE: 1,  // Required!
}

// If TMPL_DELETABLE=0, deletion will fail:
deployTimeParams: {
  TMPL_DELETABLE: 0,  // App is permanent
}
// await appClient.send.delete.bare({}) // ERROR!
```

### Creator Must Delete

```typescript
// Only the creator can delete
const creator = algorand.account.random()
const { appClient } = await factory.send.create.bare({ ... })

// This works (creator deleting)
await appClient.send.delete.bare({})

// This would fail (non-creator trying to delete)
const otherAccount = algorand.account.random()
// await factory.send.delete.bare({ sender: otherAccount.addr }) // ERROR!
```

### Local State Must Be Cleared

```typescript
// If users have opted in with local state, they must close out first

// User opts in
await appClient.send.optIn({
  sender: user.addr,
})

// Before deleting app, users must close out
await appClient.send.closeOut({
  sender: user.addr,
})

// Now app can be deleted
await appClient.send.delete.bare({})
```

### App ID Changes

```typescript
// Critical: App ID changes with replacement!

// Store old app ID before deletion
const references = {
  myApp: oldAppClient.appId,  // 1234
}

// After replacement
references.myApp = newAppClient.appId  // 5678

// Any code using the old app ID must be updated!
```

## Complete Example

```typescript
async function replaceApp() {
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()

  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  // Step 1: Create initial app
  console.log('Creating v1.0...')
  const { appClient: v1 } = await factory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })
  console.log('v1.0 App ID:', v1.appId)

  // Step 2: Delete old app
  console.log('Deleting v1.0...')
  await v1.send.delete.bare({})
  console.log('v1.0 deleted')

  // Step 3: Create new app
  console.log('Creating v2.0...')
  const { appClient: v2 } = await factory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 200,
    },
  })
  console.log('v2.0 App ID:', v2.appId)

  // Step 4: Verify
  console.log('App IDs different?', v1.appId !== v2.appId) // true

  try {
    await algorand.client.algod.getApplicationByID(Number(v1.appId)).do()
    console.log('ERROR: Old app still exists')
  } catch (e: any) {
    if (e.status === 404) {
      console.log('✅ Old app successfully deleted')
    }
  }
}
```

## Expected Output

```
Deployer address: 4I7HV6GFPZIHYRR5KDUGGSDZM2Q4MTB3XDUXK4VRWUUGEHUBDOW7RUEOPM

=== First Deployment (v1.0) ===

Deploying the initial version of the application...

✅ Initial deployment successful!
App ID: 1651n
App Address: ZRM2IPQAYB46X36HDKU4LLNQNMYKVGTUVNYRSIA4KYUBRD3A3BKTXAPYJE
Template Value (version marker): 100
Transaction ID: UHZCOTWG755KM7B742V3SRTFSIF47YQO3HHVURH3FLC3EQSZZDUA

App is:
  • Updatable: Yes (TMPL_UPDATABLE=1)
  • Deletable: Yes (TMPL_DELETABLE=1)

=== Replacement Strategy: Delete Old App ===

Deleting app ID: 1651n

✅ Old app deleted successfully!
Delete Transaction ID: 2Y5ZIFTVO6SMXEH5LW6QSCLCDM4A4OGD6RMGT3NX24ILFGW3ZCSA

=== Replacement Strategy: Create New App (v2.0) ===

Creating a new app with different template parameters...
This new app will have:
  • Different app ID
  • Different template value (TMPL_VALUE=200)
  • Fresh state (reset)

✅ Replacement app created successfully!
New App ID: 1653n
New App Address: NCUVK3FVHMSM4Z6HNJKSWYR6LPYGNGDD4RBODOVCK5NKNJKUAQDZQFZWGI
Template Value (version marker): 200
Transaction ID: IGQISGU2KUDUGEHL3JX6KJSKAZAAZAJUYAQRRZ35UZQCPCFVY7CA

=== Comparison ===

Old App ID: 1651n
New App ID: 1653n
App IDs are different: true ✅

What happened:
  1. Old app (ID: 1651n ) was deleted
  2. New app (ID: 1653n ) was created
  3. All state was reset (fresh start)
  4. Template value changed from 100 to 200

=== Verifying Old App Deletion ===

✅ Old app successfully deleted!
   App ID 1651 no longer exists on chain

=== Understanding Replacement Strategy ===

When to use REPLACE:
  ✅ You want a fresh app ID
  ✅ You want to reset all state
  ✅ Testing deployment workflows
  ✅ Major breaking changes

When NOT to use REPLACE:
  ❌ Production apps with existing users
  ❌ Apps with valuable state data
  ❌ When you can use UPDATE instead
  ❌ Apps that are referenced by other contracts

Requirements for REPLACE:
  • Old app must be DELETABLE (TMPL_DELETABLE=1)
  • Deployer must be the app creator
  • All users must have closed out their local state

=== Example Completed Successfully ===

You now understand the replacement deployment strategy concept!

Key Takeaways:
  • Replacement involves DELETE + CREATE operations
  • New app gets a different app ID
  • All state is reset (fresh start)
  • Old app must be deletable
  • Useful for testing and major changes, not for production
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
1. Create and fund a deployer account
2. Deploy an initial app (v1.0) with `TMPL_VALUE=100`
3. Delete the app
4. Create a replacement app (v2.0) with `TMPL_VALUE=200`
5. Verify the app IDs are different
6. Confirm the old app no longer exists

## Best Practices

### Always Check Deletability

```typescript
// Before deploying, decide if the app should be deletable
const { appClient } = await factory.send.create.bare({
  deployTimeParams: {
    TMPL_DELETABLE: isTestEnvironment ? 1 : 0,
  },
})

// Production apps should usually NOT be deletable
if (process.env.NODE_ENV === 'production') {
  // TMPL_DELETABLE: 0 (permanent)
}
```

### Update References After Replacement

```typescript
// Store app IDs in configuration
const config = {
  appId: oldApp.appId,
}

// After replacement, update all references
const newApp = await replaceApp(oldApp)
config.appId = newApp.appId

// Save updated configuration
await saveConfig(config)

// Notify all services using the app ID
await notifyServices({ oldId: oldApp.appId, newId: newApp.appId })
```

### Document Replacement in Production

```typescript
// If you must replace a production app, document thoroughly
const replacementPlan = {
  reason: 'Critical bug fix requiring fresh deployment',
  oldAppId: 1234,
  newAppId: 5678,
  migrationSteps: [
    '1. Users close out from old app',
    '2. Delete old app',
    '3. Create new app',
    '4. Users opt in to new app',
    '5. Update all integrations with new app ID',
  ],
  rollbackPlan: 'Redeploy old app code if issues occur',
}
```

### Test Replacement Workflow

```typescript
describe('App Replacement', () => {
  it('should successfully replace app', async () => {
    // Create initial app
    const { appClient: v1 } = await factory.send.create.bare({
      deployTimeParams: { TMPL_DELETABLE: 1, TMPL_VALUE: 100 },
    })
    const oldId = v1.appId

    // Delete old app
    await v1.send.delete.bare({})

    // Create new app
    const { appClient: v2 } = await factory.send.create.bare({
      deployTimeParams: { TMPL_DELETABLE: 1, TMPL_VALUE: 200 },
    })

    // Verify replacement
    expect(v2.appId).not.toBe(oldId)

    // Verify old app deleted
    await expect(
      algorand.client.algod.getApplicationByID(Number(oldId)).do()
    ).rejects.toThrow()
  })
})
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Lifecycle Management](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#lifecycle)
- [Deleting Applications](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#deleting-an-application)
- [App Deployment Strategies](https://developer.algorand.org/docs/get-started/dapps/deployment/)
