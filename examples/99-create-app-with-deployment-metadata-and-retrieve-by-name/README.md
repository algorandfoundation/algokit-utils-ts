# Create App with Deployment Metadata and Retrieve by Name

This example demonstrates how to create an Algorand application and retrieve apps by creator address using the app deployer. It showcases how deployment metadata can be tracked and queried through the indexer, enabling app discovery by name rather than just app ID.

## Key Concepts

- **App Deployer**: AlgoKit Utils component for managing app deployments
- **Deployment Metadata**: Information about app deployment (name, version, permissions)
- **Creator Apps Query**: Retrieving all apps created by a specific address
- **Indexer Integration**: Using indexer to discover apps with metadata
- **Transaction Notes**: Where deployment metadata is stored in blockchain

## What This Example Shows

1. Creating an application using the typed app factory
2. Using the app deployer to track deployment information
3. Querying apps by creator address
4. Understanding deployment metadata structure
5. Handling cases where indexer may not have metadata

## Code Walkthrough

### Initialize and Create Account

```typescript
const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const creator = algorand.account.random()
await algorand.account.ensureFunded(creator, dispenser, (5).algos())
```

Set up AlgorandClient and create a funded creator account.

### Define Deployment Metadata

```typescript
const appName = 'TestingApp'
const appVersion = '1.0.0'

console.log('Deployment metadata:')
console.log(`  Name: ${appName}`)
console.log(`  Version: ${appVersion}`)
console.log(`  Updatable: true`)
console.log(`  Deletable: true`)
```

Define the metadata you want to track for your application deployment.

### Create App with Factory

```typescript
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: creator.addr,
})

const { appClient, result } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

const appId = BigInt(result.appId)
```

Create the application using the typed app factory with deploy-time parameters.

### Retrieve Apps by Creator

```typescript
// Wait for indexer
await new Promise((resolve) => setTimeout(resolve, 2000))

// Query apps by creator
const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)

console.log('Apps found for creator:')
console.log(`  Creator: ${apps.creator}`)
console.log(`  Number of apps: ${Object.keys(apps.apps).length}`)

// Display details for each app
for (const [name, app] of Object.entries(apps.apps)) {
  console.log(`App: ${name}`)
  console.log(`  App ID: ${app.appId}`)
  console.log(`  Version: ${app.version}`)
  console.log(`  Updatable: ${app.updatable}`)
  console.log(`  Deletable: ${app.deletable}`)
}
```

**Key point**: `getCreatorAppsByName()` retrieves all apps created by an address and extracts deployment metadata from transaction notes.

## API Patterns (AlgoKit Utils v9.1.2)

### Get Creator Apps by Name

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creatorAddress)

// Returns:
// {
//   creator: string,
//   apps: {
//     [appName: string]: {
//       appId: bigint,
//       appAddress: string,
//       version: string,
//       updatable: boolean,
//       deletable: boolean,
//       createdRound: bigint,
//       updatedRound: bigint,
//       createdMetadata: object,
//       updatedMetadata: object
//     }
//   }
// }
```

### App Deployer Interface

```typescript
interface CreatorAppsByName {
  creator: string
  apps: {
    [name: string]: AppLookup
  }
}

interface AppLookup {
  appId: bigint
  appAddress: string
  createdRound: bigint
  updatedRound: bigint
  version?: string
  updatable?: boolean
  deletable?: boolean
  createdMetadata?: AppDeploymentMetadata
  updatedMetadata?: AppDeploymentMetadata
}
```

### Deploy App with Metadata

When using the app deployer's `deploy()` method (not shown in this simplified example):

```typescript
const deployment = await algorand.appDeployer.deploy({
  metadata: {
    name: 'MyApp',
    version: '1.0.0',
    updatable: true,
    deletable: false,
  },
  deployTimeParams: {
    TMPL_VALUE: 42,
  },
  createParams: {
    // app creation parameters
  },
  updateParams: {
    // app update parameters
  },
})
```

## Common Use Cases

### Find Deployed App by Name

```typescript
// You deployed an app earlier and want to find it by name
const apps = await algorand.appDeployer.getCreatorAppsByName(deployerAddress)

const myApp = apps.apps['MyTokenContract']
if (myApp) {
  console.log('Found app:', myApp.appId)

  // Get app client to interact with it
  const appClient = algorand.client.getAppClientById({
    id: myApp.appId,
    sender: account.addr,
  })

  await appClient.call({ method: 'someMethod' })
}
```

### List All Apps for a Creator

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creatorAddress)

console.log(`Creator ${apps.creator} has ${Object.keys(apps.apps).length} apps:`)

for (const [name, app] of Object.entries(apps.apps)) {
  console.log(`- ${name} (v${app.version}): App ID ${app.appId}`)
}
```

### Check App Update Policy

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creatorAddress)
const myApp = apps.apps['MyApp']

if (myApp.updatable) {
  console.log('App can be updated')
  // Proceed with update
} else {
  console.log('App is immutable, cannot update')
}
```

### Find Latest Version of an App

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creatorAddress)

// Get all versions of "MyApp"
const appVersions = Object.entries(apps.apps)
  .filter(([name]) => name.startsWith('MyApp'))
  .sort((a, b) => {
    // Sort by version
    const versionA = a[1].version || '0.0.0'
    const versionB = b[1].version || '0.0.0'
    return versionB.localeCompare(versionA)
  })

if (appVersions.length > 0) {
  const [latestName, latestApp] = appVersions[0]
  console.log(`Latest version: ${latestName} (${latestApp.version})`)
  console.log(`App ID: ${latestApp.appId}`)
}
```

### Audit Deployment History

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creatorAddress)

for (const [name, app] of Object.entries(apps.apps)) {
  console.log(`\nApp: ${name}`)
  console.log(`  Created in round: ${app.createdRound}`)
  console.log(`  Last updated in round: ${app.updatedRound}`)

  if (app.createdMetadata) {
    console.log('  Creation metadata:', app.createdMetadata)
  }

  if (app.updatedMetadata) {
    console.log('  Update metadata:', app.updatedMetadata)
  }
}
```

## Important Considerations

### Indexer Requirement

```typescript
try {
  const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)
  // Process apps...
} catch (error) {
  console.log('Indexer not available or not synced yet')
  // Handle the case where indexer isn't ready
}
```

**Important**: This feature requires an indexer to be running and synced. On LocalNet, you may need to wait a few seconds after app creation for the indexer to catch up.

### Metadata Storage

Deployment metadata is stored in the **transaction note** field when creating or updating an app. The structure typically looks like:

```json
{
  "name": "MyApp",
  "version": "1.0.0",
  "updatable": true,
  "deletable": false,
  "deployTimeControl": {
    "deployTimeParams": {
      "TMPL_VALUE": 42
    }
  }
}
```

### Performance Considerations

```typescript
// Querying all apps for a creator can be slow if they have many apps
// Consider caching the results if you query frequently

let cachedApps: CreatorAppsByName | null = null
let cacheTime = 0
const CACHE_DURATION = 60000 // 1 minute

async function getCachedCreatorApps(creator: string) {
  const now = Date.now()

  if (cachedApps && cachedApps.creator === creator && now - cacheTime < CACHE_DURATION) {
    return cachedApps
  }

  cachedApps = await algorand.appDeployer.getCreatorAppsByName(creator)
  cacheTime = now

  return cachedApps
}
```

### App Name Uniqueness

```typescript
// App names are NOT enforced to be unique
// A creator can deploy multiple apps with the same name

const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)

// If multiple apps have the same name, only the latest is kept in the object
// To track all versions, use different naming conventions:
// - MyApp_v1, MyApp_v2
// - MyApp-1.0.0, MyApp-1.1.0
// - MyApp-prod, MyApp-dev
```

### Metadata Not Found

```typescript
const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)

if (Object.keys(apps.apps).length === 0) {
  console.log('No apps with metadata found. This could mean:')
  console.log('1. The creator has not deployed any apps')
  console.log('2. Apps were created without metadata notes')
  console.log('3. Indexer has not synced yet')
}
```

### Query by App ID vs By Name

```typescript
// By app ID (fast, doesn't require indexer metadata)
const appInfo = await algorand.app.getById(appId)

// By name (requires indexer and metadata)
const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)
const myApp = apps.apps['MyApp']

// Use app ID when:
// - You have the ID and just need app info
// - Performance is critical
// - You don't need metadata

// Use by name when:
// - You want to discover apps by human-readable name
// - You need deployment metadata
// - You're building deployment management tools
```

## Expected Output

```
Creator address: OC54CKHSBCQQUIJQWOBFECBTWZTO7FMCHTXIII2H7L4PBIJ3O7DFKZZDUI

=== Creating Application with Deployment Metadata ===

Deployment metadata:
  Name: TestingApp
  Version: 1.0.0
  Updatable: true
  Deletable: true

✅ App created successfully!
App ID: 1613n
App Address: XSCLOCOBQ5TATFV4MW2VKCYYDCISJQHXN52M5UYMSXZOO5D4CDC45HLG2I
Transaction ID: OHUQO7YBCHGGLFN5WG6CMCPPHMMKNVALHYT3Q5UXF4BWJJRAMSSQ

Waiting for indexer to index the transaction...

=== Retrieving Apps by Creator ===

📋 Apps found for creator:
  Creator: OC54CKHSBCQQUIJQWOBFECBTWZTO7FMCHTXIII2H7L4PBIJ3O7DFKZZDUI
  Number of apps: 0
  No apps found with metadata

✅ Example completed successfully!
```

**Note**: In this simplified example, no apps are found with metadata because the basic factory creation doesn't automatically add deployment metadata to transaction notes. To get full metadata tracking, use `algorand.appDeployer.deploy()` method which handles metadata properly.

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
1. Create and fund a creator account
2. Deploy an application
3. Wait for indexer to sync
4. Query apps by creator address
5. Display any apps found with metadata

## Advanced: Full Metadata Tracking

For production deployments with full metadata tracking, use the app deployer's `deploy()` method:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Deploy with full metadata tracking
const deployment = await algorand.appDeployer.deploy({
  sender: creator,
  metadata: {
    name: 'MyTokenContract',
    version: '1.0.0',
    updatable: true,
    deletable: false,
  },
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 0,
  },
  createParams: {
    // Parameters for app creation
  },
  onUpdate: 'update', // What to do if app exists
  onSchemaBreak: 'fail', // What to do on schema break
})

console.log('Deployed app ID:', deployment.appId)
console.log('Deployed app address:', deployment.appAddress)

// Now query will find it with metadata
const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)
const myApp = apps.apps['MyTokenContract']

console.log('Found app:', myApp.appId)
console.log('Version:', myApp.version)
console.log('Updatable:', myApp.updatable)
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [App Deployer Documentation](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/docs/capabilities/app-deploy.md)
- [Algorand Indexer](https://developer.algorand.org/docs/get-details/indexer/)
- [Transaction Notes](https://developer.algorand.org/docs/get-details/transactions/#note-field)
- [App Deployment Best Practices](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/)
