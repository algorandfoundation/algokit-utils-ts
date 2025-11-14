# Export and Import Source Maps for Debugging

This example demonstrates how to export and import source maps between app client instances to enable enhanced error debugging with source code context.

## Key Concepts

- **Source Maps**: Mappings from compiled TEAL bytecode to original source code
- **Export/Import**: Transferring source maps between client instances
- **Serialization**: Converting source maps to JSON for storage or transmission
- **Enhanced Errors**: TEAL stack traces with exact error locations marked
- **Cross-Service Debugging**: Sharing debugging info between different services

## What This Example Shows

1. Deploying an application with source maps automatically included
2. Exporting source maps from an app client
3. Serializing source maps to JSON (for storage or transmission)
4. Creating a new client instance without source maps
5. Comparing error messages with and without source maps
6. Importing source maps into a fresh client instance
7. Understanding the improved error details with source maps

## Why Source Maps Matter

### Without Source Maps

```
Error: assert failed pc=885. at:undefined
```

- Generic error message
- No line number information
- Difficult to locate the issue in source code

### With Source Maps

```
Error: assert failed pc=885. at:469

464: // error
465: error_7:
466: proto 0 0
467: intc_0 // 0
468: // Deliberate error
469: assert <--- Error
470: retsub
```

- Exact line number (469)
- Source code context
- Error location marked with `<--- Error`
- Easy to identify the issue

## Code Walkthrough

### Deploy App with Source Maps

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory, TestingAppClient } from './artifacts/TestingApp/client'

const algorand = AlgorandClient.defaultLocalNet()
const dispenser = await algorand.account.localNetDispenser()

const testAccount = algorand.account.random()
await algorand.account.ensureFunded(testAccount, dispenser, (5).algos())

const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: testAccount.addr,
})

const { appClient: originalClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

console.log('App deployed with source maps automatically included')
```

**Key point**: Source maps are automatically included in the app client after deployment.

### Export Source Maps

```typescript
// Export source maps from the original client
// Access through the underlying appClient property
const sourceMaps = originalClient.appClient.exportSourceMaps()

console.log('Source maps exported')
console.log('Data size:', JSON.stringify(sourceMaps).length, 'bytes')
```

**What's in the source maps?**
- Mapping from bytecode Program Counter (PC) to source line numbers
- TEAL source code text
- Metadata about the compiled program

### Serialize for Storage or Transmission

```typescript
// Serialize source maps to JSON
const serializedSourceMaps = JSON.stringify(sourceMaps)

// Save to file
await fs.writeFile('sourcemaps.json', serializedSourceMaps)

// Or send over network
await httpClient.post('/api/sourcemaps', { sourceMaps: serializedSourceMaps })

// Later, deserialize
const deserializedSourceMaps = JSON.parse(serializedSourceMaps)
```

**Use cases for serialization:**
- Save to file system for later use
- Send to error monitoring service
- Store in database
- Share between microservices

### Create New Client Without Source Maps

```typescript
// Create a new client instance pointing to the same app
// This simulates a fresh client or different service
const newClient = new TestingAppClient({
  algorand: algorand,
  appId: originalClient.appId,
  defaultSender: testAccount.addr,
})

// This client does NOT have source maps yet
console.log('New client created (without source maps)')
```

**When you need this:**
- Restarting your application
- Different service accessing the same app
- CI/CD pipeline running tests
- Production error monitoring

### Compare Errors Without Source Maps

```typescript
try {
  await newClient.send.error({ args: [] })
} catch (error: any) {
  console.log('Error message:', error.message)
  // Output: assert failed pc=885. at:undefined

  // Still enhanced by AlgoKit Utils, but missing some details
}
```

**Without imported source maps:**
- Error shows `at:undefined` instead of line number
- Stack trace may be less detailed
- Harder to debug

### Import Source Maps

```typescript
// Import the source maps into the new client
newClient.appClient.importSourceMaps(deserializedSourceMaps)

console.log('Source maps imported successfully')
```

**Now the client has:**
- Full bytecode-to-source mapping
- Ability to show exact error locations
- Enhanced TEAL stack traces

### Compare Errors With Source Maps

```typescript
try {
  await newClient.send.error({ args: [] })
} catch (error: any) {
  console.log('Error message:', error.message)
  // Output: assert failed pc=885. at:469

  // Stack trace includes source code context:
  // 467: intc_0 // 0
  // 468: // Deliberate error
  // 469: assert <--- Error
  // 470: retsub
}
```

**With imported source maps:**
- Error shows `at:469` with exact line number
- Stack trace shows source code with `<--- Error` marker
- Much easier to debug

## API Patterns (AlgoKit Utils v9.1.2)

### Exporting Source Maps

```typescript
// From an app client returned by deployment
const { appClient } = await appFactory.send.create.bare({ /* params */ })
const sourceMaps = appClient.appClient.exportSourceMaps()

// From an existing TestingAppClient
const testingApp = new TestingAppClient({ /* params */ })
const sourceMaps = testingApp.appClient.exportSourceMaps()
```

### Importing Source Maps

```typescript
// Into a TestingAppClient
const testingApp = new TestingAppClient({ /* params */ })
testingApp.appClient.importSourceMaps(sourceMaps)

// Into an app client returned by deployment
const { appClient } = await appFactory.send.create.bare({ /* params */ })
appClient.appClient.importSourceMaps(sourceMaps)
```

### Serialization Patterns

```typescript
// Serialize
const serialized = JSON.stringify(sourceMaps)

// Deserialize
const deserialized = JSON.parse(serialized)

// With file I/O
import * as fs from 'fs/promises'

// Save
await fs.writeFile('sourcemaps.json', JSON.stringify(sourceMaps, null, 2))

// Load
const loaded = JSON.parse(await fs.readFile('sourcemaps.json', 'utf-8'))
```

## Complete Example: Production Error Monitoring

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory, TestingAppClient } from './artifacts/TestingApp/client'
import * as fs from 'fs/promises'

async function setupErrorMonitoring() {
  // 1. Deploy app (once during deployment)
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()

  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (5).algos())

  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 0,  // Production app
      TMPL_DELETABLE: 0,  // Cannot be deleted
      TMPL_VALUE: 100,
    },
  })

  console.log('Production app deployed:', appClient.appId)

  // 2. Export and save source maps
  const sourceMaps = appClient.appClient.exportSourceMaps()
  await fs.writeFile('production-sourcemaps.json', JSON.stringify(sourceMaps))

  console.log('Source maps saved to production-sourcemaps.json')

  return appClient.appId
}

async function monitorErrors(appId: bigint) {
  // 3. In your error monitoring service
  const algorand = AlgorandClient.defaultLocalNet()
  const dispenser = await algorand.account.localNetDispenser()

  const user = algorand.account.random()
  await algorand.account.ensureFunded(user, dispenser, (1).algos())

  // 4. Create client and load source maps
  const appClient = new TestingAppClient({
    algorand,
    appId,
    defaultSender: user.addr,
  })

  const sourceMaps = JSON.parse(await fs.readFile('production-sourcemaps.json', 'utf-8'))
  appClient.appClient.importSourceMaps(sourceMaps)

  console.log('Error monitoring client ready with source maps')

  // 5. Monitor for errors
  try {
    await appClient.send.error({ args: [] })
  } catch (error: any) {
    // Error includes full source context thanks to imported source maps!
    console.error('Production error with source context:')
    console.error(error.message)

    // Send to error tracking service
    await sendToErrorTracker({
      appId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }
}

// Usage
const appId = await setupErrorMonitoring()
await monitorErrors(appId)
```

## Use Cases

### 1. Backend Services

```typescript
// Service A: Deploys the app
const { appClient } = await deployApp()
const sourceMaps = appClient.appClient.exportSourceMaps()

// Save to shared storage
await redis.set(`sourcemaps:${appClient.appId}`, JSON.stringify(sourceMaps))

// Service B: Calls the app
const appId = getAppIdFromConfig()
const appClient = new TestingAppClient({ algorand, appId, defaultSender })

// Load source maps
const sourceMaps = JSON.parse(await redis.get(`sourcemaps:${appId}`))
appClient.appClient.importSourceMaps(sourceMaps)

// Now errors have full context
try {
  await appClient.send.someMethod({ args: {} })
} catch (error) {
  logger.error('Method call failed', { error, appId })
  // Error includes source context!
}
```

### 2. CI/CD Pipelines

```typescript
// build.ts - During build/deployment
async function buildAndDeploy() {
  const { appClient } = await deployApp()
  const sourceMaps = appClient.appClient.exportSourceMaps()

  // Save as build artifact
  await fs.writeFile('dist/sourcemaps.json', JSON.stringify(sourceMaps))

  return appClient.appId
}

// test.ts - During testing
async function runIntegrationTests(appId: bigint) {
  const appClient = new TestingAppClient({ algorand, appId, defaultSender })

  // Load source maps from build artifact
  const sourceMaps = JSON.parse(await fs.readFile('dist/sourcemaps.json', 'utf-8'))
  appClient.appClient.importSourceMaps(sourceMaps)

  // Run tests with enhanced error reporting
  await runTests(appClient)
}
```

### 3. Error Monitoring Systems

```typescript
// Sentry/Datadog/New Relic integration
class ErrorMonitor {
  private sourceMaps: Map<string, any> = new Map()

  async registerApp(appId: bigint, sourceMaps: any) {
    this.sourceMaps.set(appId.toString(), sourceMaps)
  }

  async handleError(appId: bigint, error: Error) {
    // Get source maps for this app
    const sourceMaps = this.sourceMaps.get(appId.toString())

    if (sourceMaps) {
      // Create a temporary client to get enhanced error
      const tempClient = new TestingAppClient({ algorand, appId, defaultSender })
      tempClient.appClient.importSourceMaps(sourceMaps)

      // Error now has full source context
      await this.reportToSentry({
        error,
        appId,
        sourceContext: this.extractSourceContext(error),
      })
    }
  }
}
```

### 4. Production Debugging

```typescript
// Save source maps during deployment
async function deployToProduction() {
  const { appClient } = await deployApp()
  const sourceMaps = appClient.appClient.exportSourceMaps()

  // Save to secure storage
  await s3.putObject({
    Bucket: 'production-sourcemaps',
    Key: `${appClient.appId}/sourcemaps.json`,
    Body: JSON.stringify(sourceMaps),
  })

  return appClient.appId
}

// Debug production issues without redeploying
async function debugProductionIssue(appId: bigint) {
  const appClient = new TestingAppClient({ algorand, appId, defaultSender })

  // Load source maps from S3
  const response = await s3.getObject({
    Bucket: 'production-sourcemaps',
    Key: `${appId}/sourcemaps.json`,
  })

  const sourceMaps = JSON.parse(response.Body.toString())
  appClient.appClient.importSourceMaps(sourceMaps)

  // Now you can debug with full source context!
  try {
    await appClient.send.problematicMethod({ args: {} })
  } catch (error: any) {
    // Error includes exact source line and context
    console.log('Debug info:', error.message, error.stack)
  }
}
```

## Important Considerations

### Source Maps Are App-Specific

```typescript
// ✅ Good: Match source maps to correct app
const sourceMaps = appClientV1.appClient.exportSourceMaps()
appClientV1Copy.appClient.importSourceMaps(sourceMaps)

// ❌ Bad: Using source maps from different app version
const sourceMapsV1 = appClientV1.appClient.exportSourceMaps()
appClientV2.appClient.importSourceMaps(sourceMapsV1)  // Wrong! Different bytecode
```

**Rule**: Always use source maps from the same app deployment.

### Source Maps and App Updates

```typescript
// Initial deployment
const { appClient: v1 } = await appFactory.send.create.bare({ /* params */ })
const sourceMapsV1 = v1.appClient.exportSourceMaps()

// Update the app
await v1.send.update.bare({
  approvalProgram: newProgram,
  clearProgram: newClearProgram,
})

// ⚠️ Old source maps no longer valid!
// Export new source maps after update
const sourceMapsV2 = v1.appClient.exportSourceMaps()
```

**Rule**: Export new source maps after every app update.

### Security Considerations

```typescript
// Source maps contain source code - handle securely!

// ✅ Good: Secure storage
await s3.putObject({
  Bucket: 'private-sourcemaps',
  Key: `${appId}/sourcemaps.json`,
  Body: JSON.stringify(sourceMaps),
  ServerSideEncryption: 'AES256',
})

// ❌ Bad: Public exposure
app.get('/api/sourcemaps/:appId', (req, res) => {
  // Don't expose source maps publicly!
  res.json(sourceMaps)
})
```

**Rule**: Treat source maps as sensitive data - they contain your source code.

### Performance

```typescript
// Source maps can be large (~5KB+)

// ✅ Good: Cache source maps
const sourceMapCache = new Map<string, any>()

function getSourceMaps(appId: bigint) {
  const key = appId.toString()
  if (!sourceMapCache.has(key)) {
    const sourceMaps = loadSourceMapsFromStorage(appId)
    sourceMapCache.set(key, sourceMaps)
  }
  return sourceMapCache.get(key)
}

// ❌ Bad: Load every time
async function handleRequest(appId: bigint) {
  const sourceMaps = await loadSourceMapsFromS3(appId)  // Slow!
  appClient.appClient.importSourceMaps(sourceMaps)
}
```

**Rule**: Cache source maps in memory for frequently used apps.

## Expected Output

```
Test account address: FCNHEMCDBANGPEOAEV7CKZHF5CLANTFV5I7MW3LCJ2NONUDQSGVLHNBIRM

=== Deploying Application with Source Maps ===

App created by FCNHEMCDBANGPEOAEV7CKZHF5CLANTFV5I7MW3LCJ2NONUDQSGVLHNBIRM with ID 1665 via transaction G2TC2J37E6SEW4LU7D4FSLF72QG4EZZQVDKKY6KGNRQ23KA6ZR6A
✅ App deployed successfully!
App ID: 1665n

=== Exporting Source Maps ===

Source maps contain the mapping from bytecode to source code.
They enable detailed error messages with TEAL source context.

✅ Source maps exported successfully
Source map data size: 4748 bytes

Source maps can be:
  • Saved to a file for later use
  • Sent over a network to another service
  • Stored in a database
  • Shared between different client instances

=== Simulating Serialization ===

Serializing source maps to JSON...
Serialized size: 4748 bytes

Deserializing source maps from JSON...
✅ Source maps successfully serialized and deserialized

=== Creating New Client Without Source Maps ===

This simulates a fresh client instance that does not have source maps.

✅ New client created (without source maps)

=== Comparing Errors: Without Source Maps ===

Attempting to trigger an error WITHOUT source maps imported...

✅ Error caught (as expected)

Error message WITHOUT source maps:
─────────────────────────────────────────
assert failed pc=885. at:undefined
─────────────────────────────────────────

Note: Error message is still enhanced by AlgoKit Utils,
      but would be even better with explicit source maps.

=== Importing Source Maps into New Client ===

Now importing the source maps we exported earlier...

✅ Source maps imported successfully

=== Comparing Errors: With Source Maps ===

Attempting to trigger the same error WITH source maps imported...

✅ Error caught (as expected)

Error message WITH source maps:
─────────────────────────────────────────
assert failed pc=885. at:469
─────────────────────────────────────────

TEAL Stack Trace:
─────────────────────────────────────────
proto 0 0
intc_0 // 0
// Deliberate error
assert <--- Error
retsub

// create
─────────────────────────────────────────

✨ Notice the "<--- Error" marker showing exactly where the failure occurred!

With source maps imported, errors include:
  • TEAL source code context
  • Exact line where the error occurred (marked with "<--- Error")
  • Program counter (PC) and bytecode information
  • Human-readable error messages

=== Understanding Source Maps ===

What are source maps?
  • A mapping from compiled bytecode positions to source code lines
  • Generated during TEAL compilation
  • Included in the app client automatically after deployment

Why export/import source maps?
  • Share debugging info between services
  • Preserve source maps across client restarts
  • Debug production issues without redeploying
  • Enable better error reporting in production

When to use source map export/import?
  ✅ Backend services that need to debug contract errors
  ✅ Error monitoring/logging systems
  ✅ CI/CD pipelines that deploy and test contracts
  ✅ Production environments with centralized error tracking

=== Example Completed Successfully ===

Key Takeaways:
  • Use appClient.exportSourceMaps() to extract source maps
  • Source maps can be serialized with JSON.stringify()
  • Use appClient.importSourceMaps() to load source maps
  • Source maps enable detailed TEAL stack traces with error markers
  • This is invaluable for debugging smart contract issues
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
1. Deploy an app with source maps automatically included
2. Export source maps from the original client
3. Serialize/deserialize source maps (simulating storage/transmission)
4. Create a new client without source maps
5. Trigger an error and show the error message without source maps
6. Import source maps into the new client
7. Trigger the same error and show enhanced error message with source maps
8. Display TEAL stack trace with exact error location marked

## Best Practices

### 1. Always Export Source Maps After Deployment

```typescript
// ✅ Good
const { appClient } = await appFactory.send.create.bare({ /* params */ })
const sourceMaps = appClient.appClient.exportSourceMaps()
await saveSourceMaps(appClient.appId, sourceMaps)

// ❌ Bad: Forgetting to export
const { appClient } = await appFactory.send.create.bare({ /* params */ })
// No source maps saved - harder to debug later
```

### 2. Version Your Source Maps

```typescript
// Save with version information
const metadata = {
  appId: appClient.appId.toString(),
  version: '1.0.0',
  deployedAt: new Date().toISOString(),
  sourceMaps,
}

await fs.writeFile(
  `sourcemaps-${appClient.appId}-v1.0.0.json`,
  JSON.stringify(metadata, null, 2)
)
```

### 3. Import Source Maps Early

```typescript
// ✅ Good: Import at initialization
class AppService {
  private appClient: TestingAppClient

  async initialize(appId: bigint) {
    this.appClient = new TestingAppClient({ algorand, appId, defaultSender })

    // Load source maps immediately
    const sourceMaps = await this.loadSourceMaps(appId)
    this.appClient.appClient.importSourceMaps(sourceMaps)
  }
}

// ❌ Bad: Importing on every call
async function callMethod() {
  const sourceMaps = await loadSourceMaps(appId)  // Repeated work
  appClient.appClient.importSourceMaps(sourceMaps)
  await appClient.send.method({ args: {} })
}
```

### 4. Handle Missing Source Maps Gracefully

```typescript
async function createClientWithSourceMaps(appId: bigint) {
  const appClient = new TestingAppClient({ algorand, appId, defaultSender })

  try {
    const sourceMaps = await loadSourceMaps(appId)
    appClient.appClient.importSourceMaps(sourceMaps)
    console.log('Source maps loaded successfully')
  } catch (error) {
    console.warn('Could not load source maps, errors will have less context')
    // Continue without source maps - app still works
  }

  return appClient
}
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Enhanced Error Messages Example](../104-debug-teal-logic-errors-with-enhanced-error-messages/)
- [TEAL Debugging Guide](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/debugging/)
- [Source Maps in JavaScript](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)
