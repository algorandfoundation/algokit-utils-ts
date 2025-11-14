# Retrieve Latest App When Multiple Apps Have Same Name

This example demonstrates a critical concept in Algorand app deployment: **multiple applications can share the same name**, and they all exist on-chain with unique IDs. When querying apps by name, indexer-based tools typically return the most recently created app by default.

This behavior is fundamental for understanding:
- Version management strategies
- App replacement workflows
- How app discovery works on Algorand
- Best practices for production deployments

## Core Concept

On Algorand, app names are **not unique identifiers**. The name is stored in the transaction note field during creation, but:
- Multiple apps can have identical names
- All apps continue to exist with unique app IDs
- The indexer tracks all creation transactions
- Queries by name typically default to returning the latest app

This enables powerful deployment patterns but requires understanding the implications.

## What This Example Shows

1. **Creating Multiple Apps with Same Name**: Deploy 3 apps, all named "MyTestApp" but with different versions (1.0, 1.1, 2.0)

2. **App Discovery**: Query the indexer for apps created by an account

3. **Name vs ID**: Demonstrate that all apps exist independently with unique IDs

4. **Chronological Ordering**: Show how app IDs indicate creation order

5. **Metadata Storage**: Use transaction notes to store version information

6. **Cleanup**: Delete test apps to free up minimum balance

## The Application

The example uses a simple TEAL contract that stores an `app_number` in global state during creation:

```teal
#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Default: approve all calls
int 1
return

create:
// Store the app number in global state
byte "app_number"
txn ApplicationArgs 0
btoi
app_global_put

int 1
return
```

Each app stores a different number (1, 2, 3) to help identify which app is which.

## App Metadata

Metadata is stored in the transaction note field during creation:

```typescript
const createMetadata = (version: string) => {
  return JSON.stringify({
    name: appName,      // All apps use same name: "MyTestApp"
    version,            // Different versions: "1.0", "1.1", "2.0"
    updatable: true,
    deletable: true,
  })
}
```

## Key Behaviors Demonstrated

### 1. All Apps Exist On-Chain
After creating 3 apps with the same name:
- App 1 (version 1.0) exists with its own app ID
- App 2 (version 1.1) exists with its own app ID
- App 3 (version 2.0) exists with its own app ID

You can interact with any of them using their specific app ID.

### 2. Apps Have Unique IDs
Even though all apps share the name "MyTestApp":
- Each gets a unique app ID from the blockchain
- Each has a unique app address
- Each maintains independent global state

### 3. Creation Order is Tracked
App IDs are assigned sequentially (on the same network):
- App created first gets the lowest ID
- App created second gets the next ID
- App created latest gets the highest ID

### 4. Latest App Has Highest ID
When querying by name, most tools return the app with the highest ID (most recent creation).

## Common Use Cases

### 1. Automatic Version Upgrades
```typescript
// Development workflow
const appId = await getLatestAppByName("MyApp")  // Always get newest version

// Frontend automatically uses latest deployment
// Old versions remain accessible for fallback
```

### 2. Canary Deployments
```typescript
// Deploy new version alongside old
await createApp({ name: "MyApp", version: "2.0" })  // New version
// Old version (1.0) still running

// Route 10% of traffic to latest version
// Route 90% of traffic to previous version by ID
```

### 3. Feature Flags
```typescript
// Each version has different features
const v1AppId = 12345  // Basic features
const v2AppId = 12346  // Advanced features

// Select version based on user tier
const appId = user.isPremium ? v2AppId : v1AppId
```

### 4. Testing and Staging
```typescript
// Different environments use different versions
const devAppId = 100    // Development (oldest)
const stagingAppId = 101  // Staging (middle)
const prodAppId = 102   // Production (latest)

// Or just use latest for dev:
const devAppId = await getLatestAppByName("MyApp")
```

## Best Practices

### ✅ 1. Use Explicit App IDs in Production
```typescript
// ❌ BAD: Production queries by name (can change unexpectedly)
const appId = await getLatestAppByName("MyApp")

// ✅ GOOD: Production uses fixed app ID
const PROD_APP_ID = 12345
```

**Why**: If someone accidentally deploys a new app with the same name, queries by name will return the new app, potentially breaking your production system.

### ✅ 2. Store Version in App State
```typescript
// During app creation
byte "version"
byte "2.1.3"
app_global_put
```

**Why**: Enables runtime version checks, helps with debugging, and makes it clear which version is deployed.

### ✅ 3. Document App IDs
```typescript
// In your config or docs
const APP_REGISTRY = {
  "v1.0": 12345,
  "v1.1": 12346,
  "v2.0": 12347,  // Current production
}
```

**Why**: Makes it easy to roll back to previous versions and understand deployment history.

### ✅ 4. Clean Up Old Versions
```typescript
// Delete unused apps (if deletable)
await algorand.send.appDelete({ sender, appId: oldAppId })
```

**Why**:
- Frees up creator account's minimum balance (0.1 ALGO per app)
- Reduces confusion about which app to use
- Keeps deployment environment clean

### ✅ 5. Use Semantic Versioning
```typescript
// In transaction note
{
  "name": "MyApp",
  "version": "2.1.3",  // Major.Minor.Patch
  "breaking_changes": false
}
```

**Why**: Makes it clear which version is deployed and helps track compatibility.

## Common Pitfalls

### ❌ Pitfall 1: Assuming Name is Unique
```typescript
// WRONG ASSUMPTION
"There can only be one app named MyApp"

// REALITY
"Multiple apps can share the same name"
```

**Solution**: Always use app IDs for critical operations, not names.

### ❌ Pitfall 2: Hardcoding "Latest" Queries
```typescript
// ❌ BAD: Code always queries for latest by name
const appId = await getLatestAppByName("MyApp")  // In production!

// ✅ GOOD: Development uses latest, production uses fixed ID
const appId = isDev
  ? await getLatestAppByName("MyApp")
  : PROD_APP_ID
```

**Solution**: Use fixed app IDs in production, latest queries only in development.

### ❌ Pitfall 3: Not Tracking App IDs
```typescript
// ❌ BAD: Deploy and forget
await createApp(...)
console.log("Deployed!")  // But what's the app ID?

// ✅ GOOD: Immediately record app ID
const result = await createApp(...)
await saveToRegistry({ version: "2.0", appId: result.appId })
console.log(`Deployed v2.0 with ID: ${result.appId}`)
```

**Solution**: Store app IDs in a config/registry immediately after creation.

### ❌ Pitfall 4: Breaking Changes Without New Name
```typescript
// ❌ BAD: Deploy incompatible version with same name
await createApp({
  name: "MyApp",  // Same name
  version: "2.0", // But completely different ABI
})
// Old clients will try to call new app and fail!

// ✅ GOOD: Use versioned names for breaking changes
await createApp({
  name: "MyApp_v2",  // Different name
  version: "2.0.0",
})
```

**Solution**: For breaking changes, consider using versioned app names (e.g., `MyApp_v1`, `MyApp_v2`).

## Alternative Strategies

### 1. Versioned App Names
Instead of multiple apps with the same name, use distinct names:
```typescript
await createApp({ name: "MyApp_v1" })
await createApp({ name: "MyApp_v2" })
await createApp({ name: "MyApp_v3" })
```

**Pros**: Each version has unique name, no confusion
**Cons**: Requires updating references when upgrading

### 2. App Registry Contract
Store a mapping of versions to app IDs in a registry contract:
```typescript
// Registry contract stores:
// "MyApp" -> { "latest": 12347, "stable": 12345, "beta": 12348 }
```

**Pros**: Centralized version management, dynamic routing
**Cons**: Extra contract to maintain, additional lookups

### 3. Configuration Files
Store app IDs in configuration files per environment:
```typescript
// config/production.json
{
  "appId": 12345,
  "version": "2.0.0",
  "deployedAt": "2025-01-15"
}
```

**Pros**: Simple, version controlled, environment-specific
**Cons**: Requires manual updates, config drift possible

## When to Use Each Approach

**Use Same Name for All Versions When:**
- Development workflow needs automatic latest version
- Deploying hotfixes/patches frequently
- Want seamless version upgrades in dev/test
- App is internal/prototype (not production-critical)

**Use Versioned Names When:**
- Breaking changes between versions
- Need explicit version selection
- Production stability is critical
- Multiple versions must coexist

**Use App Registry When:**
- Complex multi-app system
- Need dynamic version routing
- Centralized version management required
- Building app marketplace/ecosystem

## Understanding the Indexer Query

This example demonstrates querying the indexer for apps by creator:

```typescript
const indexerClient = algorand.client.indexer
const accountApps = await indexerClient
  .searchForApplications()
  .creator(deployer.addr)
  .do()

// Returns all apps created by this account
for (const app of accountApps.applications) {
  console.log(`App ID ${app.id}`)
}
```

**Note**: On LocalNet, the indexer may not be available or may return apps from previous runs. This is expected behavior for local development.

## Running the Example

```bash
# Start LocalNet
algokit localnet start

# Install dependencies (if needed)
npm install

# Run the example
npm start
```

## Expected Output

The example creates 3 apps with the same name and demonstrates:

1. All 3 apps are created successfully with unique IDs
2. All 3 apps exist on-chain simultaneously
3. Each app has its own global state (app_number: 1, 2, 3)
4. App IDs are sequential (indicating creation order)
5. The latest app has the highest ID

## Key Takeaways

1. **App names are NOT unique** - Multiple apps can share the same name
2. **App IDs ARE unique** - Each app gets a unique ID from the blockchain
3. **Always use app IDs** for production references, not names
4. **Names are metadata** stored in transaction notes, not enforced on-chain
5. **Latest typically means highest ID** - But don't rely on this in production
6. **Clean up old apps** to free up minimum balance and reduce confusion

## Related Examples

- **125-replace-application-with-custom-abi-methods**: Using custom ABI methods during creation/deletion
- **126-replace-an-application-with-delete-and-recreate**: Replacing apps by deleting and recreating

## Production Considerations

When deploying to MainNet or TestNet:

1. **Document all app IDs** in a version registry
2. **Use fixed app IDs** in production code (no queries by name)
3. **Test version upgrades** thoroughly on TestNet first
4. **Plan migration strategy** if users need to switch to new app
5. **Monitor both versions** during rollout
6. **Have rollback plan** (keep old version accessible)
7. **Clean up old apps** after successful migration (if deletable)

## Example Details

```json
{
  "example_id": "127-retrieve-latest-app-when-multiple-apps-have-same-name",
  "title": "Retrieve Latest App When Multiple Apps Have Same Name",
  "summary": "Demonstrates how multiple apps can share the same name and how to query them using the indexer",
  "language": "typescript",
  "complexity": "moderate",
  "use_case_category": "app deployment",
  "specific_use_case": "Create multiple apps with the same name and understand app discovery behavior",
  "target_users": [
    "Smart contract developers",
    "DevOps engineers",
    "SDK developers"
  ],
  "features_tested": [
    "algorand.send.appCreate",
    "algorand.client.indexer.searchForApplications",
    "algorand.send.appDelete"
  ],
  "feature_tags": [
    "app-creation",
    "name-collision",
    "app-discovery",
    "indexer-queries",
    "version-management"
  ]
}
```
