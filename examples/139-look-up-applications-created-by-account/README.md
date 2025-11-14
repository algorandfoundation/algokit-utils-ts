# Look Up Applications Created by Account

This example demonstrates how to use the Algorand Indexer API to look up all applications created by specific accounts, including pagination support for handling large result sets.

## Overview

The Algorand Indexer provides powerful query capabilities for exploring blockchain data. This example focuses on finding all applications (smart contracts) deployed by specific creator accounts, which is useful for:

- Discovering all applications deployed by a user or organization
- Managing multi-app deployments for a project
- Auditing application creation history
- Tracking application deployments across different accounts

## What You'll Learn

- How to use the indexer's `searchForApplications()` API
- Filtering applications by creator address
- Implementing pagination for large result sets
- Working with indexer responses and application metadata
- Handling indexer synchronization delays

## Key Concepts

### Algorand Indexer

The Algorand Indexer is a separate service that indexes blockchain data into a PostgreSQL database, enabling efficient queries. Unlike the algod API (which provides real-time access to current blockchain state), the indexer allows you to:

- Search for transactions by various criteria
- Look up accounts and their assets
- Find applications by creator, ID, or other parameters
- Query historical data efficiently

**Important**: The indexer has a slight delay (typically 1-5 seconds) before new transactions appear in query results.

### Application Creator Lookup

Every application on Algorand has a creator address - the account that deployed it. The indexer allows you to search for all applications created by a specific address:

```typescript
const response = await indexer
  .searchForApplications()
  .creator(creatorAddress)
  .do()
```

## Implementation

### Helper Function for Application Lookup

This example includes a reusable helper function that handles pagination automatically:

```typescript
async function lookupApplicationsByCreator(
  indexer: algosdk.Indexer,
  creator: string,
  limit?: number,
): Promise<algosdk.indexerModels.Application[]> {
  const apps: algosdk.indexerModels.Application[] = []
  let nextToken: string | undefined

  do {
    const response = await indexer
      .searchForApplications()
      .creator(creator)
      .limit(limit || 100)
      .nextToken(nextToken || '')
      .do()

    apps.push(...(response.applications || []))
    nextToken = response['next-token']
  } while (nextToken)

  return apps
}
```

**Key features:**
- Accepts an `indexer` client, `creator` address, and optional `limit`
- Automatically handles pagination using the `next-token` from responses
- Collects all results into a single array
- Returns all applications created by the specified account

### Pagination Explained

The indexer returns results in pages to avoid overwhelming responses. Each response includes:

- `applications[]`: Array of application data (up to `limit` items)
- `next-token`: Token to fetch the next page (undefined when done)

**Example pagination flow:**

```typescript
// Request page 1 (limit: 100)
const page1 = await indexer.searchForApplications().creator(addr).limit(100).do()
// Response: { applications: [app1...app100], 'next-token': 'token123' }

// Request page 2 using next-token
const page2 = await indexer.searchForApplications().creator(addr).limit(100).nextToken('token123').do()
// Response: { applications: [app101...app150], 'next-token': undefined }
// No next-token means we've reached the end
```

### Indexer Response Format

Each application in the response contains:

```typescript
{
  id: number,                    // Application ID
  'created-at-round': number,    // Round when created
  params: {
    creator: string,             // Creator address
    'approval-program': string,  // Base64 encoded approval program
    'clear-state-program': string,
    'global-state-schema': {
      'num-uint': number,
      'num-byte-slice': number
    },
    'local-state-schema': { ... }
  }
}
```

## Example Walkthrough

### Step 1: Create Multiple Applications

The example creates 5 applications from 2 different accounts:

**Creator 1** creates 3 applications:
```typescript
const app1Result = await algorand.send.appCreate({
  sender: creator1.addr,
  approvalProgram,
  clearStateProgram: clearProgram,
  schema: {
    globalInts: 1,
    globalByteSlices: 0,
    localInts: 0,
    localByteSlices: 0,
  },
})
const app1Id = app1Result.appId
```

**Creator 2** creates 2 applications with the same pattern.

### Step 2: Wait for Indexer Synchronization

```typescript
await new Promise((resolve) => setTimeout(resolve, 5000))
```

This wait ensures the indexer has processed the new application creation transactions. In production, you might use more sophisticated polling or event-based approaches.

### Step 3: Look Up Applications by Creator

**Query Creator 1's applications:**
```typescript
const allCreator1Apps = await lookupApplicationsByCreator(
  algorand.client.indexer,
  creator1.addr.toString()
)

// Filter to only apps created in this example
const creator1Apps = allCreator1Apps.filter((app) =>
  BigInt(app.id) === app1Id || BigInt(app.id) === app2Id || BigInt(app.id) === app3Id
)
```

**Query Creator 2's applications:**
```typescript
const allCreator2Apps = await lookupApplicationsByCreator(
  algorand.client.indexer,
  creator2.addr.toString()
)

const creator2Apps = allCreator2Apps.filter((app) =>
  BigInt(app.id) === app4Id || BigInt(app.id) === app5Id
)
```

**Why filter?** In LocalNet, the same dispenser account might have created apps in previous examples. Filtering ensures we only examine apps created in the current run.

### Step 4: Demonstrate Pagination

```typescript
const allCreator1AppsPaginated = await lookupApplicationsByCreator(
  algorand.client.indexer,
  creator1.addr.toString(),
  1, // Fetch only 1 result per page
)
```

This demonstrates that the pagination logic works correctly even with a very small page size (1 result per page).

### Step 5: Verify Results

```typescript
const creator1AppIds = creator1Apps.map((app) => BigInt(app.id)).sort((a, b) => (a < b ? -1 : 1))
const expectedCreator1Ids = [app1Id, app2Id, app3Id].sort((a, b) => (a < b ? -1 : 1))

const creator1Match = creator1AppIds.length === expectedCreator1Ids.length &&
  creator1AppIds.every((id, index) => id === expectedCreator1Ids[index])

console.log(`✅ Match: ${creator1Match}`)
```

This verifies that the indexer correctly returned all expected applications for each creator.

## Common Use Cases

### 1. Discover User's Applications

```typescript
async function getUserApps(indexer: algosdk.Indexer, userAddress: string) {
  const apps = await lookupApplicationsByCreator(indexer, userAddress)

  console.log(`Found ${apps.length} applications created by ${userAddress}:`)
  apps.forEach(app => {
    console.log(`  - App ${app.id}: Created at round ${app['created-at-round']}`)
  })
}
```

### 2. Audit Application Deployments

```typescript
async function auditDeployments(indexer: algosdk.Indexer, orgAddresses: string[]) {
  for (const address of orgAddresses) {
    const apps = await lookupApplicationsByCreator(indexer, address)
    console.log(`${address}: ${apps.length} applications`)
  }
}
```

### 3. Find Applications with Specific Schema

```typescript
async function findAppsWithSchema(
  indexer: algosdk.Indexer,
  creator: string,
  globalInts: number
) {
  const apps = await lookupApplicationsByCreator(indexer, creator)

  return apps.filter(app =>
    app.params['global-state-schema']?.['num-uint'] === globalInts
  )
}
```

## Running the Example

### Prerequisites

```bash
# Start LocalNet with indexer
algokit localnet start

# Verify indexer is running
curl http://localhost:8980/health

# Install dependencies
npm install
```

### Execute

```bash
npm start
```

### Expected Output

```
=== Look Up Applications Created by Account ===

Creator 1: F2T4H...
Creator 2: EUWSM...

=== STEP 1: Creating Applications ===

Creator 1 creating applications...
  ✅ App 1 created with ID: 1032
  ✅ App 2 created with ID: 1033
  ✅ App 3 created with ID: 1034

Creator 2 creating applications...
  ✅ App 4 created with ID: 1035
  ✅ App 5 created with ID: 1036

Waiting for indexer to index transactions...

=== STEP 2: Looking Up Applications by Creator ===

Looking up applications created by Creator 1...
Found 3 applications created in this example (19 total):
  - App ID: 1032
  - App ID: 1033
  - App ID: 1034

Looking up applications created by Creator 2...
Found 2 applications created in this example (2 total):
  - App ID: 1035
  - App ID: 1036

=== STEP 3: Demonstrating Pagination ===

Looking up Creator 1 apps with pagination (1 result per page)...
Retrieved applications from this example

=== STEP 4: Verifying Results ===

Creator 1:
  Expected app IDs: 1032, 1033, 1034
  Retrieved app IDs: 1032, 1033, 1034
  ✅ Match: true

Creator 2:
  Expected app IDs: 1035, 1036
  Retrieved app IDs: 1035, 1036
  ✅ Match: true

✨ Example completed successfully!
```

## Best Practices

### 1. Handle Indexer Delays

Always wait for the indexer to catch up after creating transactions:

```typescript
// Create application
const result = await algorand.send.appCreate({ ... })

// Wait for indexer to process
await new Promise(resolve => setTimeout(resolve, 3000))

// Now safe to query
const apps = await lookupApplicationsByCreator(indexer, creator)
```

### 2. Implement Pagination

For accounts with many applications, always use pagination:

```typescript
// Good: Handles pagination automatically
async function getAllApps(indexer, creator) {
  const apps = []
  let nextToken = undefined

  do {
    const response = await indexer
      .searchForApplications()
      .creator(creator)
      .limit(100)
      .nextToken(nextToken || '')
      .do()

    apps.push(...(response.applications || []))
    nextToken = response['next-token']
  } while (nextToken)

  return apps
}

// Bad: Only gets first page
async function getAppsWrong(indexer, creator) {
  const response = await indexer
    .searchForApplications()
    .creator(creator)
    .do()

  return response.applications // Might miss apps if there are many!
}
```

### 3. Filter and Process Results

The indexer may return deleted applications. Filter as needed:

```typescript
// Get only active applications (not deleted)
const activeApps = apps.filter(app => app.deleted === false)

// Get applications created after a certain round
const recentApps = apps.filter(app =>
  app['created-at-round'] > minRound
)
```

### 4. Error Handling

```typescript
try {
  const apps = await lookupApplicationsByCreator(indexer, creator)
  console.log(`Found ${apps.length} applications`)
} catch (error) {
  if (error.message.includes('indexer')) {
    console.error('Indexer not available. Is LocalNet running?')
  } else {
    console.error('Error looking up applications:', error)
  }
}
```

## Troubleshooting

### Indexer Returns No Results

**Problem**: Query returns 0 applications immediately after creation

**Solution**: Wait longer for indexer to sync
```typescript
await new Promise(resolve => setTimeout(resolve, 5000))
```

### Pagination Not Working

**Problem**: Only getting first page of results

**Solution**: Check that you're using the `next-token` correctly:
```typescript
// Correct
.nextToken(nextToken || '')

// Wrong (will fail if nextToken is undefined)
.nextToken(nextToken)
```

### Missing Applications

**Problem**: Some applications not returned

**Solution**: Check if applications were deleted:
```typescript
// Get application info including deleted status
const allApps = await lookupApplicationsByCreator(indexer, creator)
console.log('All apps (including deleted):', allApps.length)

const activeApps = allApps.filter(app => !app.deleted)
console.log('Active apps:', activeApps.length)
```

## Key Takeaways

1. **Indexer API**: Use `searchForApplications().creator()` to find apps by creator
2. **Pagination**: Always handle pagination for accounts with many applications
3. **Synchronization**: Wait for indexer to process new transactions (3-5 seconds)
4. **Filtering**: Filter results to handle deleted apps or specific criteria
5. **Reusable Pattern**: The helper function can be adapted for other indexer queries

## Additional Resources

- [Algorand Indexer API Documentation](https://developer.algorand.org/docs/rest-apis/indexer/)
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Indexer GitHub Repository](https://github.com/algorand/indexer)
- [Algosdk TypeScript Documentation](https://algorand.github.io/js-algorand-sdk/)

## Related Examples

- Example 138: Full App Lifecycle (Create, Update, Delete)
- Example 137: ARC-56 Error Handling
- Example 135: Using Foreign References

---

This example provides a production-ready pattern for discovering and managing applications by creator address using the Algorand Indexer API.
