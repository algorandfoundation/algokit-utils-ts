# Handle Schema Breaking Changes with Extra Pages

This example demonstrates how to detect and handle schema breaking changes in Algorand smart contracts, specifically focusing on storage schema changes and extra program pages.

## Key Concepts

### Schema Breaking Changes

A **schema breaking change** occurs when you attempt to update an app with incompatible structural changes that affect:

1. **Storage Schema**: Changes to global/local state requirements
2. **Extra Program Pages**: Changes to the number of additional pages needed for TEAL code
3. **Minimum Balance**: Breaking changes affect the minimum balance requirements

These changes are "breaking" because:
- Existing state may be incompatible with the new schema
- Minimum balance requirements change (more Algos needed)
- Resource allocation differs from the original deployment

### OnSchemaBreak Strategies

When a schema break is detected, you can choose how to handle it:

- **`onSchemaBreak='fail'`**: Prevents deployment and throws an error (safe default)
- **`onSchemaBreak='append'`**: Creates a new app instance alongside the existing one
- **`onSchemaBreak='replace'`**: Deletes the old app and creates a new one (if deletable)

### Storage Schema

The storage schema defines how much state an app can store:

```typescript
schema: {
  globalInts: 1,        // Number of global uint64 values
  globalByteSlices: 0,  // Number of global byte slice values
  localInts: 0,         // Number of local uint64 values per account
  localByteSlices: 0,   // Number of local byte slice values per account
}
```

**Schema breaks occur when these numbers change.** Unlike program code changes, you cannot simply "update" the schema - it requires creating a new app.

### Extra Program Pages

Algorand apps have a base code size limit of ~2KB. If your TEAL program exceeds this:

- You must allocate **extra program pages** during creation
- Each extra page increases minimum balance requirements
- Adding/removing extra pages is a **breaking change**
- You specify this with `extraProgramPages: N` in createParams

## Code Walkthrough

### Step 1: Deploy Small Application (No Extra Pages)

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()
const deployer = algorand.account.random()
await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

// Small TEAL program that fits in one page
const smallApprovalProgram = `#pragma version 10
txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

int 1
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
int 1
return`

const deployment1 = {
  sender: deployer.addr,
  metadata: {
    name: 'TestApp',
    version: '1.0',
    updatable: true,
    deletable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: smallApprovalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,           // Start with 1 global int
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    extraProgramPages: 0,      // No extra pages needed
  },
  updateParams: {
    sender: deployer.addr,
  },
  deleteParams: {
    sender: deployer.addr,
  },
}

const result1 = await algorand.appDeployer.deploy(deployment1)
console.log('App ID:', result1.appId)
console.log('Extra Pages: 0')
```

The initial deployment creates a small app with:
- 1 global integer slot
- No extra program pages
- Marked as updatable and deletable

### Step 2: Attempt Schema Breaking Change with onSchemaBreak='fail'

```typescript
const deployment2 = {
  sender: deployer.addr,
  metadata: {
    name: 'TestApp',
    version: '2.0',
    updatable: true,
    deletable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: updatedApprovalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,           // Changed from 1 to 2 - BREAKING!
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    extraProgramPages: 1,      // Changed from 0 to 1 - BREAKING!
  },
  updateParams: {
    sender: deployer.addr,
  },
  deleteParams: {
    sender: deployer.addr,
  },
  onSchemaBreak: 'fail' as const,    // Fail if schema breaks
  onUpdate: 'update' as const,
}

try {
  await algorand.appDeployer.deploy(deployment2)
  console.log('❌ Unexpected: Update should have failed')
} catch (error: any) {
  console.log('✅ Expected error caught!')
  console.log('Schema break detected!')
  console.log('  • Global storage changed: globalInts 1 → 2')
  console.log('  • Extra pages changed: 0 → 1')
}
```

**What happens:**
1. The deployer detects that `globalInts` changed from 1 to 2
2. It also detects `extraProgramPages` changed from 0 to 1
3. Both are schema breaking changes
4. `onSchemaBreak='fail'` causes deployment to throw an error
5. The existing app is **not** modified

**Why this is important:**
- Prevents accidental breaking changes in production
- Forces you to make a conscious decision about handling schema breaks
- Protects existing app state and users

### Step 3: Create New App with onSchemaBreak='append'

```typescript
const deployment3 = {
  sender: deployer.addr,
  metadata: {
    name: 'TestApp',
    version: '2.0',
    updatable: true,
    deletable: true,
  },
  createParams: {
    sender: deployer.addr,
    approvalProgram: updatedApprovalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,           // Same breaking change
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    extraProgramPages: 1,      // Same breaking change
  },
  updateParams: {
    sender: deployer.addr,
  },
  deleteParams: {
    sender: deployer.addr,
  },
  onSchemaBreak: 'append' as const,  // Create new app on schema break
  onUpdate: 'update' as const,
}

const result2 = await algorand.appDeployer.deploy(deployment3)

console.log('Operation:', result2.operationPerformed)  // 'create'
console.log('New App ID:', result2.appId)
console.log('Original App ID:', result1.appId)
console.log('App IDs different:', result1.appId !== result2.appId)  // true
```

**What happens:**
1. Same schema breaking changes are detected
2. `onSchemaBreak='append'` tells the deployer to create a new app
3. A completely new app instance is created with a different ID
4. The original app remains unchanged and functional
5. `operationPerformed` is `'create'` instead of `'update'`

## Understanding Schema Breaks

### What Triggers Schema Break Detection?

Schema breaks are detected when:

1. **Global storage changes**:
   ```typescript
   // Breaking changes
   globalInts: 1 → 2        // Adding slots
   globalInts: 2 → 1        // Removing slots
   globalByteSlices: 0 → 1  // Adding slots
   ```

2. **Local storage changes**:
   ```typescript
   // Breaking changes
   localInts: 0 → 1
   localByteSlices: 1 → 0
   ```

3. **Extra program pages change**:
   ```typescript
   // Breaking changes
   extraProgramPages: 0 → 1  // Adding pages
   extraProgramPages: 2 → 1  // Removing pages
   ```

### What Does NOT Trigger Schema Breaks?

These changes do **not** cause schema breaks:

- **Program code changes** (TEAL logic updates)
- **Metadata changes** (name, version, description)
- **Template variable values** (TMPL_UPDATABLE, etc.)

These can be updated in-place without schema breaks.

### Why Are Schema Changes Breaking?

**Storage schema** affects:
- Minimum balance calculation
- Resource allocation on the blockchain
- Existing app state compatibility

**Extra pages** affect:
- Minimum balance (each page costs more Algos)
- Resource limits per account

**Example**: An app with 1 global int has different minimum balance requirements than one with 2 global ints. Existing opted-in accounts may not have enough balance for the new schema.

## Deployment Strategies

### Strategy Comparison

| Strategy | Behavior | Use When |
|----------|----------|----------|
| `fail` | Throws error, prevents deployment | Production apps, require manual review |
| `append` | Creates new app instance | Need both old and new versions |
| `replace` | Deletes old, creates new | Migration scenario, app is deletable |

### When to Use onSchemaBreak='fail'

Use the **fail strategy** (recommended default) when:
- Deploying to production environments
- You want to be explicitly aware of breaking changes
- You need to plan migration strategies
- You want to prevent accidental schema changes

```typescript
const deployment = {
  // ...
  onSchemaBreak: 'fail' as const,
}

try {
  await algorand.appDeployer.deploy(deployment)
} catch (error) {
  console.log('Schema break detected!')
  // Handle manually: migrate data, create new app, etc.
}
```

### When to Use onSchemaBreak='append'

Use the **append strategy** when:
- You want both old and new app versions to coexist
- You're deploying multiple versions for testing
- You need gradual migration (users can opt into new version)
- The old app should remain functional

```typescript
const deployment = {
  // ...
  onSchemaBreak: 'append' as const,
}

const result = await algorand.appDeployer.deploy(deployment)
// result.appId will be a NEW app ID
// Old app continues to exist and function
```

### When to Use onSchemaBreak='replace'

Use the **replace strategy** when:
- You want to force everyone to the new version
- The app is marked as deletable
- You're in a test/development environment
- Data migration isn't required

```typescript
const deployment = {
  // ...
  metadata: {
    name: 'TestApp',
    version: '2.0',
    updatable: true,
    deletable: true,  // MUST be true for replace to work
  },
  onSchemaBreak: 'replace' as const,
}

const result = await algorand.appDeployer.deploy(deployment)
// Old app is DELETED
// New app is created (may have same or different ID)
```

## Extra Program Pages

### Understanding Program Size Limits

Algorand apps have size limits:
- **Base limit**: ~2048 bytes of compiled TEAL bytecode
- **With extra pages**: Each page adds ~2048 bytes
- **Maximum**: 3 extra pages (8KB total)

### When Do You Need Extra Pages?

You need extra pages when:
- Your TEAL program has complex logic
- You have many helper functions
- You include large byte constants
- Your compiled bytecode exceeds ~2KB

**Note**: The example demonstrates the concept by specifying `extraProgramPages: 1`, even though the actual TEAL program is small. In production, you'd determine this based on actual program size.

### How to Specify Extra Pages

```typescript
createParams: {
  sender: deployer.addr,
  approvalProgram: largeTealProgram,
  clearStateProgram: clearProgram,
  schema: { /* ... */ },
  extraProgramPages: 1,  // Request 1 extra page (4KB total)
}
```

### Cost of Extra Pages

Each extra page increases minimum balance:
- **Base app**: 0.1 ALGO
- **+1 page**: Additional ~0.1 ALGO
- **+2 pages**: Additional ~0.2 ALGO
- **+3 pages**: Additional ~0.3 ALGO

## Common Scenarios

### Scenario 1: Adding State Slots for New Features

**Problem**: You want to add a new global variable to your app.

```typescript
// Original
schema: {
  globalInts: 1,
  globalByteSlices: 0,
  localInts: 0,
  localByteSlices: 0,
}

// New version - BREAKING CHANGE
schema: {
  globalInts: 2,  // Added slot for new feature
  globalByteSlices: 0,
  localInts: 0,
  localByteSlices: 0,
}
```

**Solution**:
1. Use `onSchemaBreak='fail'` to detect the issue
2. Deploy a new app with `onSchemaBreak='append'`
3. Migrate users and data to the new app
4. Optionally delete the old app

### Scenario 2: Program Grew Too Large

**Problem**: Your updated TEAL code exceeds the base size limit.

```typescript
// Original
createParams: {
  approvalProgram: smallProgram,  // ~1KB compiled
  extraProgramPages: 0,
}

// New version - BREAKING CHANGE
createParams: {
  approvalProgram: largeProgram,  // ~3KB compiled
  extraProgramPages: 1,  // Need extra page
}
```

**Solution**:
Same as Scenario 1 - treat as a schema break and deploy new app.

### Scenario 3: Testing Schema Changes

**Problem**: You want to test schema changes in development.

```typescript
// Development deployment
const deployment = {
  // ...
  metadata: {
    name: 'TestApp',
    version: '1.0',
    updatable: true,
    deletable: true,  // Allow cleanup
  },
  onSchemaBreak: 'replace' as const,  // Auto-recreate in dev
}
```

This automatically deletes and recreates the app when schema changes.

## Best Practices

### 1. Plan Schema Upfront

**Design your schema with future growth in mind:**

```typescript
schema: {
  globalInts: 4,        // Reserve slots for future use
  globalByteSlices: 2,  // Better than frequent schema breaks
  localInts: 2,
  localByteSlices: 1,
}
```

**Trade-off**: Higher initial minimum balance vs. flexibility for updates.

### 2. Use Different Strategies per Environment

```typescript
const isProduction = process.env.NODE_ENV === 'production'

const deployment = {
  // ...
  onSchemaBreak: isProduction ? 'fail' : 'replace',
  onUpdate: isProduction ? 'fail' : 'update',
}
```

- **Production**: Fail fast, require manual intervention
- **Development**: Auto-replace for rapid iteration

### 3. Always Catch Schema Break Errors

```typescript
try {
  const result = await algorand.appDeployer.deploy(deployment)
  console.log('Deployment successful:', result.appId)
} catch (error: any) {
  if (error.message.includes('Schema break detected')) {
    console.log('Schema break - manual migration required')
    // Handle migration logic
  } else {
    throw error
  }
}
```

### 4. Document Schema Decisions

```typescript
schema: {
  globalInts: 3,        // 1=counter, 2=timestamp, 3=reserved
  globalByteSlices: 1,  // 1=creator address
  localInts: 0,
  localByteSlices: 0,
}
```

Clear documentation helps future developers understand schema usage.

### 5. Test Both Paths

Write tests for both schema break scenarios:

```typescript
it('should fail when schema breaks with fail strategy', async () => {
  // Deploy v1
  const result1 = await algorand.appDeployer.deploy(deployment1)

  // Attempt v2 with schema break
  const deployment2 = { ...deployment1, onSchemaBreak: 'fail' }
  deployment2.createParams.schema.globalInts = 2  // Breaking change

  await expect(
    algorand.appDeployer.deploy(deployment2)
  ).rejects.toThrow('Schema break detected')
})

it('should create new app when schema breaks with append strategy', async () => {
  // Deploy v1
  const result1 = await algorand.appDeployer.deploy(deployment1)

  // Deploy v2 with schema break
  const deployment2 = { ...deployment1, onSchemaBreak: 'append' }
  deployment2.createParams.schema.globalInts = 2  // Breaking change

  const result2 = await algorand.appDeployer.deploy(deployment2)
  expect(result2.appId).not.toBe(result1.appId)
})
```

## Common Pitfalls

### 1. Forgetting Schema Is Immutable

**Problem**: Thinking you can just "update" the schema like code.

```typescript
// ❌ This will fail or create new app
const deployment = {
  // ...
  createParams: {
    schema: { globalInts: 2 },  // Changed from 1
  },
  onUpdate: 'update',  // Won't work if schema breaks
}
```

**Solution**: Understand schema changes require new app creation.

### 2. Not Handling Schema Breaks in CI/CD

**Problem**: Automated deployments fail in production due to schema breaks.

**Solution**: Implement proper error handling:

```typescript
try {
  await algorand.appDeployer.deploy(deployment)
} catch (error: any) {
  if (error.message.includes('Schema break detected')) {
    // Alert DevOps team
    await notifySchemaBreak(deployment.metadata.name)
    throw new Error('Schema break requires manual intervention')
  }
  throw error
}
```

### 3. Using 'replace' in Production

**Problem**: `onSchemaBreak='replace'` deletes the old app, losing all state.

```typescript
// ❌ Dangerous in production
const deployment = {
  // ...
  onSchemaBreak: 'replace',  // Will delete app and all state!
}
```

**Solution**: Use 'fail' or 'append' in production, reserve 'replace' for dev/test.

### 4. Not Reserving Enough Schema Slots

**Problem**: Frequent schema breaks due to tight resource limits.

```typescript
// ❌ Too restrictive
schema: {
  globalInts: 1,  // Exactly what's needed now
  globalByteSlices: 0,
}

// ✅ Room for growth
schema: {
  globalInts: 3,  // 1 used, 2 reserved
  globalByteSlices: 1,  // Reserved
}
```

**Trade-off**: Higher minimum balance vs. deployment flexibility.

### 5. Assuming Extra Pages Are Free

**Problem**: Not accounting for increased minimum balance with extra pages.

**Solution**: Calculate minimum balance before deployment:

```typescript
const baseCost = 0.1  // ALGO
const extraPageCost = 0.1  // ALGO per page
const totalCost = baseCost + (extraProgramPages * extraPageCost)

console.log(`App will require ${totalCost} ALGO minimum balance`)
```

## Running the Example

### Prerequisites

1. **Start LocalNet**:
   ```bash
   algokit localnet start
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

### Execute

```bash
npx tsx main.ts
```

### Expected Output

```
=== Step 1: Deploy Small Application (No Extra Pages) ===
Using account: <ADDRESS>

✅ Small app created successfully
   App ID: 1041n
   Version: 1.0
   Operation: create
   Extra Pages: 0

=== Step 2: Attempt Schema Breaking Change ===
We will change the global storage schema, which is a breaking change.

--- Attempt 1: Using onSchemaBreak="fail" (will fail) ---
Attempting schema break: globalInts 1 → 2, extraProgramPages 0 → 1

✅ Expected error caught!

=== Error Details ===
Error message: Schema break detected and onSchemaBreak=OnSchemaBreak.Fail

=== Why Did This Fail? ===
Schema break detected!
  • Global storage changed: globalInts 1 → 2
  • Extra pages changed: 0 → 1
The deployment was stopped to prevent breaking changes.

Schema breaks affect:
  • Storage requirements (can't shrink existing state)
  • Minimum balance requirements (more Algos needed)
  • Existing state compatibility

--- Attempt 2: Using onSchemaBreak="append" (will create new app) ---
Same schema break but with append strategy

✅ New app created successfully!
   Operation: create
   New App ID: 1042n
   Original App ID: 1041n
   App IDs different: true

=== Summary ===
Schema break handling strategies:
  • onSchemaBreak="fail": Prevents deployment when schema breaks
  • onSchemaBreak="append": Creates a new app instance
  • onSchemaBreak="replace": Deletes old app and creates new one

Schema breaks include:
  • Changes to global/local storage schema
  • Changes to extra program pages
  • These affect minimum balance and resource requirements
  • Existing state may be incompatible with new schema

✨ Example completed successfully!
```

## Key Takeaways

1. **Schema breaks** occur when storage requirements or program pages change
2. **onSchemaBreak='fail'** is the safest default for production deployments
3. **onSchemaBreak='append'** creates new app instances when schema breaks
4. **onSchemaBreak='replace'** deletes and recreates (only for deletable apps)
5. **Extra program pages** are detected as breaking changes
6. **Storage schema changes** (globalInts, localInts, etc.) always break
7. **Plan schema upfront** to minimize future breaking changes
8. **Different strategies** for different environments (dev vs production)

## Related Examples

- [111-fail-fast-strategy-for-schema-breaks](../111-fail-fast-strategy-for-schema-breaks) - Using fail strategy for schema breaks
- [112-handle-errors-when-replacing-permanent-apps](../112-handle-errors-when-replacing-permanent-apps) - Handling delete errors
- [113-handle-failed-update-of-immutable-application](../113-handle-failed-update-of-immutable-application) - Handling immutable app updates
- [10-appclient-create-and-call](../10-appclient-create-and-call) - Basic app deployment

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployment Guide](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [Algorand Smart Contract Guidelines](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/guidelines/)
