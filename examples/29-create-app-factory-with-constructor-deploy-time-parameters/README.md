# Create App Factory with Constructor Deploy-Time Parameters

This example demonstrates how to configure deploy-time parameters (TEAL template variables) in the factory constructor for cleaner, reusable deployments. This approach is useful when deploying multiple instances with the same configuration.

## What This Example Shows

This example teaches you how to:
- Create an app factory with pre-configured deploy-time parameters
- Deploy applications inheriting factory configuration automatically
- Override specific parameters for individual deployments when needed
- Organize deployments with consistent settings
- Reduce code duplication and configuration errors
- Use TEAL template variables (TMPL_) for customizable contracts

## Why This Matters

Factory-level configuration is essential for clean deployment workflows:

1. **Reusability**: Configure parameters once, deploy many times
2. **Consistency**: All apps share the same base settings
3. **Flexibility**: Override specific parameters per-deployment when needed
4. **Clean Code**: Eliminates repetition of configuration
5. **Error Prevention**: Centralized configuration reduces mistakes

Key concepts:
- **App Factory**: Factory pattern for creating app clients with shared configuration
- **Deploy-Time Parameters**: TEAL template variables substituted at deployment
- **TMPL_ Variables**: Template placeholders in TEAL code (e.g., TMPL_UPDATABLE, TMPL_VALUE)
- **Parameter Inheritance**: Deployments inherit factory configuration
- **Parameter Override**: Individual deployments can override specific parameters
- **Constructor Configuration**: Set defaults once in factory constructor

Common use cases:
- **Multi-Environment Deployment**: Different factories for dev/test/prod
- **Immutable vs Mutable Apps**: Factory with UPDATABLE=0 for production
- **Parameterized Contracts**: Same contract, different configuration values
- **Batch Deployment**: Deploy multiple instances with consistent settings
- **Configuration Management**: Centralize deployment parameters

## How It Works

The example demonstrates five scenarios for factory configuration:

### 1. Creating Factory with Pre-configured Parameters

Set up deploy-time parameters in the factory constructor:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { readFileSync } from 'fs'

const algorand = AlgorandClient.defaultLocalNet()
const account = await algorand.account.fromEnvironment('ACCOUNT')

// Load app spec
const appSpec = JSON.parse(readFileSync('artifacts/application.json', 'utf-8'))

// Create factory with deploy-time parameters
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Apps will be updatable
    TMPL_DELETABLE: 1,  // Apps will be deletable
    TMPL_VALUE: 100,    // Custom parameter
  },
})
```

The factory configuration:
- Sets default values for all TEAL template variables
- Applied to all deployments unless overridden
- Centralizes configuration in one place
- Reduces code duplication

### 2. Deploying Application with Factory Defaults

Deploy without repeating parameters:

```typescript
// Deploy app using factory defaults
const app1 = await factory.send.bare.create()

console.log(`App ID: ${app1.appClient.appId}`)
console.log(`Transaction ID: ${app1.result.txIds[0]}`)
```

Benefits:
- No need to specify deployTimeParams again
- All factory defaults automatically applied
- Cleaner deployment code
- Less chance of configuration errors

### 3. Verifying Factory Configuration

Check that parameters were applied:

```typescript
// Get application info from blockchain
const appInfo = await algorand.client.algod
  .getApplicationByID(Number(app1.appClient.appId))
  .do()

// Read global state value
const value = appInfo.params.globalState
  ?.find((s: any) => Buffer.from(s.key, 'base64').toString() === 'value')
  ?.value?.uint || 0

console.log(`Global state "value": ${value}`)  // 100
```

Verification confirms:
- Template variables were substituted correctly
- Values match factory configuration
- Application deployed with expected settings

### 4. Overriding Factory Parameters for Specific Deployment

Override specific parameters when needed:

```typescript
// Deploy with overridden TMPL_VALUE
const app4 = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,  // Still from factory
    TMPL_DELETABLE: 1,  // Still from factory
    TMPL_VALUE: 42,     // Override just this parameter
  },
})

console.log(`Application deployed: ${app4.appClient.appId}`)

// Verify override
const appInfo4 = await algorand.client.algod
  .getApplicationByID(Number(app4.appClient.appId))
  .do()

const value4 = appInfo4.params.globalState
  ?.find((s: any) => Buffer.from(s.key, 'base64').toString() === 'value')
  ?.value?.uint || 0

console.log(`Verified VALUE: ${value4}`)  // 42
```

Override features:
- Specify only the parameters you want to change
- Other parameters inherited from factory
- Flexibility for special cases
- Factory defaults remain unchanged

**Important Note**: When overriding, you currently need to specify all template parameters explicitly. Parameter merging is not automatic in the current implementation.

## TEAL Template Variables

Deploy-time parameters work by substituting template variables in TEAL code:

### In TEAL Source:
```teal
#pragma version 8
intcblock 0 1 10 5 TMPL_UPDATABLE TMPL_DELETABLE
bytecblock 0x 0x151f7c75
```

### After Substitution (with TMPL_UPDATABLE=1, TMPL_DELETABLE=1):
```teal
#pragma version 8
intcblock 0 1 10 5 1 1
bytecblock 0x 0x151f7c75
```

Template variables:
- Must use `TMPL_` prefix
- Substituted before compilation
- Allow contract customization without code changes
- Common in updatable/deletable contracts

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- Funded test account

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
=== Create App Factory with Constructor Deploy-Time Parameters ===

1. Creating App Factory with Deploy-Time Parameters
   Setting up factory with pre-configured template variables...

   Using account: <account-address>
   Factory created with pre-configured parameters:
     UPDATABLE: 1 (apps will be updatable)
     DELETABLE: 1 (apps will be deletable)
     VALUE: 100 (custom parameter)

2. Deploying Application with Factory Defaults
   Notice: No need to specify deployTimeParams again...

App created by <account-address> with ID 1002 via transaction <txn-id>
   Application 1 deployed successfully!
   App ID: 1002
   App Address: <app-address>
   Transaction ID: <txn-id>

   Verifying factory parameters were applied...
   Global state "value": 100

3. Verifying Factory Configuration
   Checking that factory settings were applied...

   Factory was configured with:
     - UPDATABLE: 1 ✓
     - DELETABLE: 1 ✓
     - VALUE: 100 ✓

   All deployments from this factory will inherit these settings.
   This eliminates the need to repeat parameters for each deployment.

4. Overriding Factory Parameters for Specific Deployment
   Deploying with custom VALUE parameter...

App created by <account-address> with ID 1005 via transaction <txn-id>
   Application 4 deployed: 1005
   Parameter override:
     VALUE: 42 (overridden)
     UPDATABLE: 1 (from factory)
     DELETABLE: 1 (from factory)

   Verified VALUE in global state: 42

5. Benefits of Factory with Constructor Parameters
   Understanding the advantages...

   ✓ Reusability: Configure once, deploy many times
   ✓ Consistency: All apps share the same settings
   ✓ Flexibility: Override specific parameters when needed
   ✓ Clean Code: No repetition of configuration
   ✓ Error Prevention: Centralized configuration reduces mistakes

   Example use case:
   You could create an "immutable factory" with UPDATABLE=0, DELETABLE=0
   for production apps, and a "mutable factory" with UPDATABLE=1, DELETABLE=1
   for development apps.

=== Summary ===
✅ Successfully demonstrated app factory with constructor parameters!

Key concepts:
  • Factory pre-configured with deployTimeParams
  • All deployments inherit factory configuration
  • Individual deployments can override specific parameters
  • Useful for deploying multiple apps with consistent settings
  • Reduces code duplication and configuration errors

=== Key Takeaways ===
• Use deployTimeParams in factory constructor for reusable configuration
• Deploy multiple apps without repeating parameters
• Override parameters per-deployment when needed
• Create specialized factories (e.g., immutable factory)
• Cleaner code with less repetition
```

## Common Patterns

### Multi-Environment Factories

```typescript
// Development environment
const devFactory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

// Production environment
const prodFactory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: 0,  // Immutable
    TMPL_DELETABLE: 0,  // Permanent
    TMPL_VALUE: 1000,
  },
})

// Deploy to appropriate environment
const app = isProduction
  ? await prodFactory.send.bare.create()
  : await devFactory.send.bare.create()
```

### Batch Deployment with Same Configuration

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

// Deploy multiple instances
const apps = []
for (let i = 0; i < 5; i++) {
  const app = await factory.send.bare.create()
  apps.push(app)
  console.log(`Deployed app ${i + 1}: ${app.appClient.appId}`)
}
```

### Configuration from Environment

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: Number(process.env.APP_UPDATABLE) || 1,
    TMPL_DELETABLE: Number(process.env.APP_DELETABLE) || 1,
    TMPL_VALUE: Number(process.env.APP_VALUE) || 100,
  },
})

const app = await factory.send.bare.create()
```

## Best Practices

1. **Use Descriptive Parameter Names**
   ```typescript
   // Good: Clear purpose
   deployTimeParams: {
     TMPL_MAX_SUPPLY: 1000000,
     TMPL_MINT_PRICE: 100,
   }

   // Avoid: Generic names
   deployTimeParams: {
     TMPL_VALUE1: 1000000,
     TMPL_VALUE2: 100,
   }
   ```

2. **Create Specialized Factories**
   ```typescript
   // Good: Purpose-specific factories
   const immutableFactory = getImmutableFactory(appSpec, account)
   const testFactory = getTestFactory(appSpec, account)

   // Helpers
   function getImmutableFactory(appSpec, account) {
     return algorand.client.getAppFactory({
       appSpec,
       defaultSender: account.addr,
       deployTimeParams: {
         TMPL_UPDATABLE: 0,
         TMPL_DELETABLE: 0,
       },
     })
   }
   ```

3. **Handle Parameter Overrides Explicitly**
   ```typescript
   // Currently, you need to provide all parameters when overriding
   const app = await factory.send.bare.create({
     deployTimeParams: {
       TMPL_UPDATABLE: 1,      // Specify all params
       TMPL_DELETABLE: 1,       // Specify all params
       TMPL_VALUE: customValue,  // The one you want to override
     },
   })
   ```

## Key Takeaways

- Use `deployTimeParams` in factory constructor for reusable configuration
- All deployments from a factory inherit the factory's configuration
- Override parameters per-deployment when specific customization is needed
- TEAL template variables use `TMPL_` prefix and are substituted at deployment
- Create specialized factories for different environments (dev, test, prod)
- Factory pattern reduces code duplication and configuration errors
- Centralized configuration makes deployment management easier
- Currently requires providing all parameters when overriding (no automatic merging)
- Document factory purpose and configuration for team members
- This pattern is essential for maintaining clean, consistent deployment workflows

This approach is particularly useful for managing multiple applications with similar configurations across different environments, reducing code repetition and preventing configuration errors.
