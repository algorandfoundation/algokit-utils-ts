# Export and Import Source Maps for Enhanced Error Debugging

This example demonstrates a practical, step-by-step workflow for exporting and importing source maps to enable enhanced error debugging in production applications.

## Key Concepts

- **Step-by-Step Workflow**: Clear phases for deployment and runtime
- **Production-Ready Pattern**: Practical approach for real applications
- **Source Map Persistence**: Saving and loading debugging information
- **Enhanced Error Messages**: Comparing errors with and without source maps

## What This Example Shows

This example walks through a 7-step process:

### Deployment Phase
1. **Deploy Application** - Create and deploy your smart contract
2. **Export Source Maps** - Extract debugging information from the deployed app
3. **Save Source Maps** - Serialize and store for later use

### Runtime Phase
4. **Create Fresh Client** - New client instance (simulating restart or different service)
5. **Test Without Source Maps** - See limited error information
6. **Load and Import Source Maps** - Restore debugging capabilities
7. **Test With Source Maps** - See enhanced error information with TEAL stack traces

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

### Deployment Phase

```typescript
// 1. Deploy your application
const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
  defaultSender: deployer.addr,
})

const { appClient } = await appFactory.send.create.bare({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

// 2. Export source maps
const sourceMaps = appClient.appClient.exportSourceMaps()

// 3. Save for later use
const serialized = JSON.stringify(sourceMaps)
await fs.writeFile('sourcemaps.json', serialized)
// Or: upload to S3, save to database, etc.
```

### Runtime Phase

```typescript
// 4. Create fresh client (in different service/after restart)
const newClient = new TestingAppClient({
  algorand,
  appId: appClient.appId,
  defaultSender: deployer.addr,
})

// 5. Test without source maps - limited info
try {
  await newClient.send.error({ args: [] })
} catch (error: any) {
  console.log(error.message)
  // Shows: at:undefined ⚠️
}

// 6. Load and import source maps
const loadedSourceMaps = JSON.parse(await fs.readFile('sourcemaps.json'))
newClient.appClient.importSourceMaps(loadedSourceMaps)

// 7. Test with source maps - full debugging info!
try {
  await newClient.send.error({ args: [] })
} catch (error: any) {
  console.log(error.message)
  // Shows: at:469 ✅
  // Plus TEAL stack trace with <--- Error marker
}
```

## Expected Output

```
Deployer account: ZCXIIVJNCKMTKU37ESTW2N5DOO56OY5DYDYZKLCGIBXBIUXJZK77KVZEWY

Step 1: Deploying Application
──────────────────────────────────────────────────
App created by ZCXIIVJNCKMTKU37ESTW2N5DOO56OY5DYDYZKLCGIBXBIUXJZK77KVZEWY with ID 1004 via transaction LHAS46LDTERI2QF4LF6PSMO7TWM3FWOCV4UQ2SZ4YTCKS6RJVNEA
✅ Application deployed
   App ID: 1004n
   App Address: SW4BTZGCCNMSDYSANRLKFQOZNYRKH4B7J6DNSEUAYPSRGOYZRGKQEAW5EY

Step 2: Exporting Source Maps
──────────────────────────────────────────────────
✅ Source maps exported
   Data size: 4748 bytes
   Contains: bytecode-to-source mappings

Step 3: Saving Source Maps
──────────────────────────────────────────────────
✅ Source maps serialized for storage
   Serialized size: 4748 bytes
   Ready to save to file/database/cloud storage

Step 4: Creating Fresh Client Instance
──────────────────────────────────────────────────
✅ New client instance created
   Points to same app ID: 1004n
   No source maps loaded yet

Step 5: Testing Error Without Source Maps
──────────────────────────────────────────────────
❌ Error occurred (as expected)
   Message: assert failed pc=885. at:undefined. assert failed pc=885. at:469. Error resolvin...
   Line number: at:undefined ⚠️
   Limited debugging information available

Step 6: Loading Source Maps into Client
──────────────────────────────────────────────────
✅ Source maps loaded into client
   Debugging capabilities enabled

Step 7: Testing Error With Source Maps
──────────────────────────────────────────────────
❌ Error occurred (as expected)
   Message: assert failed pc=885. at:469. assert failed pc=885. at:469. Error resolving exec...
   Line number: at:469 ✅
   Full debugging information available!

📄 TEAL Stack Trace:
   intc_0 // 0
   // Deliberate error
   assert <--- Error
   retsub


Summary: Production Workflow
══════════════════════════════════════════════════

Deployment Phase:
  1. Deploy your application
  2. Export source maps: appClient.exportSourceMaps()
  3. Save to storage: fs.writeFile(), S3, database, etc.

Runtime Phase:
  4. Create client for deployed app
  5. Load source maps from storage
  6. Import into client: appClient.importSourceMaps()
  7. Enjoy enhanced error messages!

Benefits:
  ✅ See exact TEAL source line where errors occur
  ✅ Get detailed stack traces with code context
  ✅ Debug production issues without redeploying
  ✅ Share debugging info across services

✨ Example completed successfully!
```

## Key Differences: With vs Without Source Maps

### Without Source Maps

```
Message: assert failed pc=885. at:undefined
Line number: at:undefined ⚠️
Limited debugging information available
```

- Shows `at:undefined` - no line number
- Generic error message only
- Difficult to locate issue in source code

### With Source Maps

```
Message: assert failed pc=885. at:469
Line number: at:469 ✅
Full debugging information available!

📄 TEAL Stack Trace:
   intc_0 // 0
   // Deliberate error
   assert <--- Error
   retsub
```

- Shows `at:469` - exact line number
- TEAL stack trace with source context
- `<--- Error` marker shows exact failure location
- Easy to identify and fix issues

## Production Workflow

### During Deployment

```typescript
// deploy.ts
async function deployToProduction() {
  // Deploy app
  const { appClient } = await appFactory.send.create.bare({ /* params */ })

  // Export source maps
  const sourceMaps = appClient.appClient.exportSourceMaps()

  // Save to secure storage
  await saveToS3({
    bucket: 'my-app-sourcemaps',
    key: `${appClient.appId}/sourcemaps.json`,
    data: JSON.stringify(sourceMaps),
  })

  console.log(`Deployed app ${appClient.appId} with source maps saved`)
}
```

### During Runtime/Monitoring

```typescript
// error-monitor.ts
async function setupErrorMonitoring(appId: bigint) {
  // Create client
  const appClient = new TestingAppClient({
    algorand,
    appId,
    defaultSender,
  })

  // Load source maps from storage
  const sourceMaps = await loadFromS3({
    bucket: 'my-app-sourcemaps',
    key: `${appId}/sourcemaps.json`,
  })

  // Import into client
  appClient.appClient.importSourceMaps(JSON.parse(sourceMaps))

  // Now errors will have full debugging context
  return appClient
}
```

## Best Practices

### 1. Always Export After Deployment

```typescript
// ✅ Good: Export immediately after deployment
const { appClient } = await appFactory.send.create.bare({ /* params */ })
const sourceMaps = appClient.appClient.exportSourceMaps()
await saveSourceMaps(appClient.appId, sourceMaps)

// ❌ Bad: Forgetting to export
const { appClient } = await appFactory.send.create.bare({ /* params */ })
// Source maps lost - debugging will be harder
```

### 2. Store Securely

```typescript
// ✅ Good: Secure storage
await s3.putObject({
  Bucket: 'private-sourcemaps',
  Key: `${appId}/sourcemaps.json`,
  Body: JSON.stringify(sourceMaps),
  ServerSideEncryption: 'AES256',
})

// ❌ Bad: Public exposure
app.get('/sourcemaps/:appId', (req, res) => {
  res.json(sourceMaps)  // Don't expose source code!
})
```

### 3. Import Early

```typescript
// ✅ Good: Import at initialization
class AppService {
  async initialize(appId: bigint) {
    this.appClient = new TestingAppClient({ algorand, appId, defaultSender })
    const sourceMaps = await this.loadSourceMaps(appId)
    this.appClient.appClient.importSourceMaps(sourceMaps)
  }
}

// ❌ Bad: Import on every call
async function handleRequest() {
  const sourceMaps = await loadSourceMaps(appId)  // Slow!
  appClient.appClient.importSourceMaps(sourceMaps)
}
```

### 4. Handle Missing Source Maps Gracefully

```typescript
async function createClient(appId: bigint) {
  const appClient = new TestingAppClient({ algorand, appId, defaultSender })

  try {
    const sourceMaps = await loadSourceMaps(appId)
    appClient.appClient.importSourceMaps(sourceMaps)
  } catch (error) {
    console.warn('Source maps not available, errors will have less context')
    // App still works, just with reduced debugging info
  }

  return appClient
}
```

## Learn More

- [Example 108: Comprehensive Source Maps Guide](../108-export-and-import-source-maps-for-debugging/) - Detailed documentation and use cases
- [Example 104: Enhanced Error Messages](../104-debug-teal-logic-errors-with-enhanced-error-messages/) - Understanding enhanced errors
- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [TEAL Debugging Guide](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/debugging/)
