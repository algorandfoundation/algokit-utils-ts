# Replace an Existing Application

A comprehensive example demonstrating how to replace an existing Algorand application by deleting it and creating a new one, useful for breaking schema changes.

## What This Example Shows

This example demonstrates:

1. **Application Deployment** - Deploying an initial application marked as deletable
2. **Replace Strategy** - Using `onUpdate: 'replace'` to trigger delete + create
3. **Automatic Deletion** - AlgoKit automatically deleting the old application
4. **New App Creation** - Creating a fresh application with a new ID
5. **Operation Verification** - Confirming the replacement operation succeeded
6. **App ID Increment** - Verifying the new app has a higher ID than the old one
7. **Functional Testing** - Calling methods on the replaced application

## Why This Matters

Application replacement is essential when:

- **Breaking Schema Changes**: Local/global state structure changes that can't be updated
- **Major Refactoring**: Complete rewrites that are incompatible with updates
- **Clean Slate Needed**: Starting fresh with new data structures
- **Testing Deployments**: Quickly cycling through deployment versions
- **Development Iteration**: Rapid prototyping without worrying about compatibility

Unlike the update strategy which preserves the app ID and state, replacement gives you a brand new application.

## How It Works

### 1. Initialize and Setup

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))

const factory = algorand.client.getAppFactory({
  appSpec: appSpec as any,
  defaultSender: deployer.addr,
})
```

**Why**: Set up the Algorand client and create an app factory for deploying applications.

### 2. Deploy Initial Application

```typescript
const { result: createdApp } = await factory.deploy({
  deployTimeParams: {
    VALUE: 1,
  },
  onUpdate: 'update',
  onSchemaBreak: 'replace',
  deletable: true, // MUST be true for replacement to work
  updatable: true,
})

console.log(`✓ Initial app deployed with ID: ${createdApp.appId}`)
```

**Key Points**:
- Set `deletable: true` - required for replacement
- First deployment creates or updates existing app
- App ID is preserved if updating existing app

### 3. Deploy with Replace Strategy

```typescript
const { result: app } = await factory.deploy({
  deployTimeParams: {
    VALUE: 2, // Different value to trigger update
  },
  onUpdate: 'replace', // THIS triggers delete + create
  onSchemaBreak: 'replace',
  deletable: true,
  updatable: true,
})

console.log(`Operation performed: ${app.operationPerformed}`) // 'replace'
console.log(`Old app ID: ${createdApp.appId}`)
console.log(`New app ID: ${app.appId}`) // Higher ID number
```

**What Happens**:
1. AlgoKit detects the TEAL code changed
2. Sees `onUpdate: 'replace'` strategy
3. Deletes the old application
4. Creates a brand new application
5. New app gets a higher app ID

### 4. Verify Replacement

```typescript
// Verify deletion occurred
if (app.deleteResult) {
  console.log('Delete transaction confirmed')
}

// Verify new app has higher ID
console.log(`New ID (${app.appId}) > Old ID (${createdApp.appId}): ${app.appId > createdApp.appId ? '✓' : '✗'}`)

// Test the new app
const appClient = factory.getAppClientById({ appId: app.appId })
const callResult = await appClient.send.call({
  method: 'call_abi',
  args: ['Replaced App'],
})
```

**Why**: Confirm the old app was deleted and the new app is functional.

## Prerequisites

- AlgoKit installed
- Docker Desktop (for LocalNet)
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
=== Replace Application Example ===

Using deployer account: CE3U3ARY6G5OQGFSJUBY3QUREETSPZYXQ2LODEKQLPROEZE44USUU4AIQY

Step 1: Deploy initial application with VALUE=1
✓ Initial app deployed with ID: 1120
  App address: CODKHEYEQGBVCVMPQOGPTFR4JPYEJVNQQDSGCQC6KXJZ5DJPPG6HPHMKYQ
  Operation performed: create

Step 2: Deploy with replace strategy (VALUE=2)

✓ Replacement completed!
  Operation performed: replace
  Old app ID: 1120
  New app ID: 1123
  New app address: YENIZTVNPBLTQNUCOUWSEWOTCQQTYTUMYJLFC4JAKEDXBSW2LXNIIYXI7Q
  Address verification: ✓ PASSED
  Delete transaction confirmed

✓ The new app has a higher ID than the old one, confirming a new app was created
  New ID (1123) > Old ID (1120): ✓

✓ Testing the replaced application
  Method call successful! Returned: Hello, Replaced App

✅ Example completed successfully
```

## Common Patterns

### 1. Basic Replace Strategy

```typescript
// First deployment
await factory.deploy({
  deletable: true, // Required
  onUpdate: 'update',
})

// Replace with new version
await factory.deploy({
  onUpdate: 'replace', // Triggers delete + create
  deletable: true,
})
```

### 2. Replace on Schema Break

```typescript
await factory.deploy({
  onUpdate: 'update', // Try to update first
  onSchemaBreak: 'replace', // But replace if schema breaks
  deletable: true,
  updatable: true,
})
```

### 3. Conditional Replacement

```typescript
const deploymentStrategy = needsCleanSlate ? 'replace' : 'update'

await factory.deploy({
  onUpdate: deploymentStrategy,
  onSchemaBreak: 'replace',
  deletable: true,
  updatable: true,
})
```

### 4. Replace with State Migration

```typescript
// Read state from old app before replacing
const oldAppClient = factory.getAppClientById({ appId: oldAppId })
const oldState = await oldAppClient.getGlobalState()

// Deploy replacement
const { result: newApp } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})

// Migrate state to new app
const newAppClient = factory.getAppClientById({ appId: newApp.appId })
await newAppClient.send.call({
  method: 'set_state',
  args: [oldState.value],
})
```

### 5. Replace with Verification

```typescript
const { result: app } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})

// Verify replacement
if (app.operationPerformed !== 'replace') {
  throw new Error('Expected replace operation')
}

if (app.appId <= oldAppId) {
  throw new Error('New app ID should be higher than old app ID')
}

if (!app.deleteResult) {
  throw new Error('Old app should have been deleted')
}
```

### 6. Replace Multiple Apps

```typescript
async function replaceAllApps(appIds: number[]) {
  const results = []

  for (const appId of appIds) {
    // Deploy replacement for each app
    const { result } = await factory.deploy({
      onUpdate: 'replace',
      deletable: true,
    })

    results.push({
      oldAppId: appId,
      newAppId: result.appId,
      deleted: !!result.deleteResult,
    })
  }

  return results
}
```

### 7. Replace with Rollback Plan

```typescript
// Store old app info before replacing
const oldAppId = existingApp.appId
const oldAppAddress = existingApp.appAddress

try {
  // Attempt replacement
  const { result: newApp } = await factory.deploy({
    onUpdate: 'replace',
    deletable: true,
  })

  console.log(`Successfully replaced app ${oldAppId} with ${newApp.appId}`)
} catch (error) {
  console.error('Replacement failed, old app remains:', oldAppId)
  // Old app is still available if replacement fails
}
```

## Best Practices

### 1. Always Set deletable: true

**Good**:
```typescript
await factory.deploy({
  deletable: true, // Required for replacement
  onUpdate: 'replace',
})
```

**Avoid**:
```typescript
await factory.deploy({
  deletable: false, // Replacement will fail!
  onUpdate: 'replace',
})
```

### 2. Verify Replacement Occurred

**Good**:
```typescript
const { result: app } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})

if (app.operationPerformed !== 'replace') {
  throw new Error(`Expected replace, got: ${app.operationPerformed}`)
}

if (!app.deleteResult) {
  throw new Error('Old app was not deleted')
}
```

**Avoid**:
```typescript
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
// No verification - did it actually replace?
```

### 3. Migrate Critical State

**Good**:
```typescript
// Save critical data before replacing
const criticalData = await oldApp.getGlobalState()
await saveToBackup(criticalData)

// Replace app
const { result: newApp } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})

// Restore data to new app
await restoreData(newApp, criticalData)
```

**Avoid**:
```typescript
// Replace without saving data
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
// All state is lost!
```

### 4. Test Replacement on LocalNet First

**Good**:
```typescript
if (process.env.NETWORK === 'localnet') {
  // Test replacement on LocalNet
  await testReplaceOperation()
  console.log('✓ Replacement test passed')
}

// Only then proceed to testnet/mainnet
if (process.env.NETWORK === 'mainnet') {
  await performProductionReplace()
}
```

**Avoid**:
```typescript
// Testing replacement for first time on mainnet
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
// Very risky!
```

### 5. Document Why Replacement Was Needed

**Good**:
```typescript
/**
 * Replacement performed on 2025-01-13
 * Reason: Breaking change to global state schema
 * Old app ID: 1120
 * New app ID: 1123
 * Data migration: Completed via migration script
 */
const { result: app } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
```

**Avoid**:
```typescript
// No documentation of why replacement happened
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
```

### 6. Use onSchemaBreak for Automatic Handling

**Good**:
```typescript
await factory.deploy({
  onUpdate: 'update', // Try to update if possible
  onSchemaBreak: 'replace', // But replace if schema breaks
  deletable: true,
  updatable: true,
})
```

**Avoid**:
```typescript
// Always replace, even when update would work
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
```

### 7. Plan for Users Interacting with Old App

**Good**:
```typescript
// Notify users before replacement
await notifyUsers('App will be replaced in 5 minutes')
await delay(5 * 60 * 1000)

// Replace app
const { result: newApp } = await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})

// Update frontend with new app ID
await updateFrontend({ appId: newApp.appId })
```

**Avoid**:
```typescript
// Replace immediately without warning
await factory.deploy({
  onUpdate: 'replace',
  deletable: true,
})
// Users may get errors with old app ID
```

## Understanding Replace vs Update

### Replace Strategy

| Aspect | Replace | Update |
|--------|---------|--------|
| App ID | Changes (new, higher ID) | Stays the same |
| App Address | Changes | Stays the same |
| Global State | Lost (fresh start) | Preserved |
| Local State | Lost | Preserved |
| Boxes | Lost | Preserved |
| When to Use | Breaking changes | Compatible changes |
| Risk Level | High (data loss) | Low (data preserved) |

### When to Use Replace

- **Schema Changes**: Changing the number or type of global/local state variables
- **Major Refactoring**: Complete rewrite of application logic
- **Fresh Start**: Need to reset all state and start over
- **Development**: Rapid iteration during development phase
- **Breaking Changes**: Changes that make old and new versions incompatible

### When to Use Update

- **Bug Fixes**: Fixing bugs without changing state structure
- **Feature Addition**: Adding new methods that don't affect existing state
- **Logic Changes**: Improving algorithms without schema changes
- **Performance**: Optimizing existing code
- **Production**: Most production updates should use update, not replace

## Deployment Strategy Options

```typescript
type DeploymentStrategy = {
  onUpdate: 'replace' | 'update' | 'append' | 'fail'
  onSchemaBreak: 'replace' | 'fail' | 'append'
  deletable: boolean
  updatable: boolean
}

// Replace: Delete old, create new
{ onUpdate: 'replace', deletable: true }

// Update: Update existing app
{ onUpdate: 'update', updatable: true }

// Fail: Stop if changes detected
{ onUpdate: 'fail' }

// Replace on schema break only
{ onUpdate: 'update', onSchemaBreak: 'replace', deletable: true, updatable: true }
```

## Key Takeaways

1. **deletable: true is required** for replacement to work
2. **onUpdate: 'replace'** triggers the delete + create operation
3. **All state is lost** when replacing an application
4. **New app ID is always higher** than the old app ID
5. **Test on LocalNet first** before replacing production apps
6. **Migrate critical state** before replacing if needed
7. **Use onSchemaBreak: 'replace'** for automatic handling of breaking changes
8. **Document replacement decisions** for operational clarity
