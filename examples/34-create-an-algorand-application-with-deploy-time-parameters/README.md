# Create an Algorand Application with Deploy-Time Parameters

This example demonstrates how to create an Algorand application with deploy-time parameters using the factory pattern. Deploy-time parameters allow you to configure smart contracts with specific values at deployment time through TEAL template variables.

## What This Example Shows

This example teaches you how to:
- Load an app spec with TEAL template variables
- Create an app factory with the `getAppFactory()` method
- Deploy applications with custom deploy-time parameter values
- Use TEAL template variables for configuration
- Verify the app address and confirmation details
- Understand the difference between deploy-time and runtime parameters

## Why This Matters

Deploy-time parameters are essential for flexible smart contract deployment:

1. **Configuration at Deploy Time**: Set immutable values when deploying the contract
2. **Template Variables**: Use TEAL `TMPL_` prefixed variables that get replaced during deployment
3. **Reusable Contracts**: Same contract code can be deployed with different configurations
4. **Factory Pattern**: Efficiently deploy multiple instances with varying parameters
5. **Type Safety**: App specs provide type-safe parameter definitions

Key concepts:
- **Deploy-Time Parameters**: Values substituted into TEAL template variables during deployment
- **Template Variables**: TEAL variables prefixed with `TMPL_` that are replaced before compilation
- **App Factory**: Reusable deployment configuration for creating multiple app instances
- **App Spec**: JSON specification defining the contract interface and template variables
- **Immutable Configuration**: Deploy-time params cannot be changed after deployment

Common use cases:
- **Multi-Instance Apps**: Deploy same contract with different configurations
- **Access Control**: Set admin addresses or permissions at deploy time
- **Protocol Parameters**: Configure fees, limits, or thresholds
- **Feature Flags**: Enable/disable features through deploy-time configuration
- **Network-Specific Config**: Different settings for LocalNet, TestNet, MainNet

## How It Works

### 1. Initialize AlgorandClient and Get Account

Set up the client and get a funded account:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.defaultLocalNet()

// Get a funded test account
const account = await algorand.account.fromEnvironment('ACCOUNT')
console.log('Creating application from account:', account.addr.toString())
```

The account setup:
- Loads account from environment variables
- Used to pay for transaction fees
- Becomes the creator of the application
- Available via `fromEnvironment()` method

### 2. Load App Spec with Template Variables

Load the app specification that defines template variables:

```typescript
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))
```

App spec structure:
- Contains TEAL source code with `TMPL_` prefixed variables
- Defines the contract interface and methods
- Specifies state schema requirements
- Template variables get replaced during deployment
- Must be a parsed JSON object, not a file path string

### 3. Create App Factory

Create a factory for deploying app instances:

```typescript
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
})
```

Factory benefits:
- Reusable configuration for multiple deployments
- Shares app spec across deployments
- Sets default sender for all operations
- Provides type-safe method calls
- Simplifies parameter management

### 4. Deploy with Deploy-Time Parameters

Create the application with custom parameter values:

```typescript
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1, // Makes the app updatable
    TMPL_DELETABLE: 1, // Makes the app deletable
    TMPL_VALUE: 42,    // Custom parameter specific to your contract
  },
})

console.log('App ID:', appClient.appId.toString())
console.log('App Address:', appClient.appAddress.toString())
console.log('Transaction ID:', result.txIds[0])
```

The deployment process:
- `deployTimeParams` substitutes values into TEAL template variables
- Parameter names must match `TMPL_` prefixed variables in the app spec
- Values are substituted before TEAL compilation
- Returns both result (transaction data) and appClient (for future interactions)
- Template variables become immutable after deployment

### 5. Verify App Address

Confirm the app address is correctly derived:

```typescript
import algosdk from 'algosdk'

const derivedAddress = algosdk.getApplicationAddress(appClient.appId).toString()
const appAddress = appClient.appAddress.toString()

console.log('App Address:', appAddress)
console.log('Derived Address:', derivedAddress)
console.log('Addresses match:', appAddress === derivedAddress) // true
```

Address verification:
- App addresses are deterministically derived from app IDs
- Use `algosdk.getApplicationAddress()` to calculate
- Addresses must be converted to strings for comparison
- App address is a regular Algorand address
- Can receive ALGO and assets like any account

### 6. Access Confirmation Details

Get transaction confirmation information:

```typescript
const confirmation = result.confirmations?.[0]
if (confirmation) {
  console.log('Application Index:', appClient.appId.toString())
  console.log('Confirmed Round:', confirmation.confirmedRound)
}
```

Confirmation details provide:
- Round number when transaction was confirmed
- Application index (same as app ID)
- Transaction finality confirmation
- Optional chaining handles missing confirmations

## Template Variables in TEAL

Deploy-time parameters work through TEAL template variables:

### Example TEAL with Template Variables

```teal
#pragma version 8

// Template variables get replaced during deployment
int TMPL_UPDATABLE  // Replaced with deployTimeParams.TMPL_UPDATABLE
int TMPL_DELETABLE  // Replaced with deployTimeParams.TMPL_DELETABLE
int TMPL_VALUE      // Replaced with deployTimeParams.TMPL_VALUE

// Your contract logic here
int 1
return
```

### How Substitution Works

```typescript
// In your deployTimeParams:
deployTimeParams: {
  TMPL_UPDATABLE: 1,
  TMPL_DELETABLE: 0,
  TMPL_VALUE: 42,
}

// TEAL after substitution (before compilation):
#pragma version 8
int 1  // TMPL_UPDATABLE replaced with 1
int 0  // TMPL_DELETABLE replaced with 0
int 42 // TMPL_VALUE replaced with 42
```

### Naming Convention

- **Always use `TMPL_` prefix** for template variables in TEAL
- **Include `TMPL_` prefix** in deployTimeParams object keys
- **Naming must match exactly** between TEAL and deployTimeParams
- **Case sensitive**: `TMPL_VALUE` ≠ `TMPL_value`

## Deploy-Time vs Runtime Parameters

Understanding the difference is crucial:

### Deploy-Time Parameters (This Example)

```typescript
// Set at deployment, cannot change
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_VALUE: 42,
  },
})
// These values are now immutable in the deployed contract
```

**Characteristics:**
- Substituted into TEAL before compilation
- Immutable after deployment
- Part of the compiled bytecode
- No runtime cost to access
- Good for: admin addresses, feature flags, protocol constants

### Runtime Parameters

```typescript
// Passed when calling methods
await appClient.send.call({
  method: 'someMethod',
  args: [100, 'dynamic_value'],  // Runtime arguments
})
```

**Characteristics:**
- Passed as method arguments during calls
- Can change on every call
- Processed at runtime
- Slight runtime cost to access
- Good for: user input, transaction data, dynamic values

## Prerequisites

- Node.js and npm installed
- AlgoKit CLI installed
- Docker Desktop running (for LocalNet)
- LocalNet running

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
Creating application from account: YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA

Creating application with deploy-time parameters...
App created by YR3TGJUKCAY6KYXHN4X63IXG3FHMAULGVJKZPXI3XHTRJ7HUXC2EP42JAA with ID 1035 via transaction GP4ZUEFKUIJSZBNJUGF26IZMLJPUWXLBQ2Y3WXDK3FMF4SSA2U2A

✅ Application created successfully!
App ID: 1035
App Address: U3TOFQM72V7G2ZYAPMIPIIOKBRXIHBYFGP7RIIA3ANOL4E763OJQRHXWTU
Transaction ID: GP4ZUEFKUIJSZBNJUGF26IZMLJPUWXLBQ2Y3WXDK3FMF4SSA2U2A

✓ Verifying app address...
App Address: U3TOFQM72V7G2ZYAPMIPIIOKBRXIHBYFGP7RIIA3ANOL4E763OJQRHXWTU
Derived Address: U3TOFQM72V7G2ZYAPMIPIIOKBRXIHBYFGP7RIIA3ANOL4E763OJQRHXWTU
Addresses match: true

Confirmation details:
Application Index: 1035
Confirmed Round: 35n

Example completed successfully!
```

## Common Patterns

### Deploy Multiple Instances with Different Config

```typescript
// Create factory once
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
})

// Deploy multiple instances with different configurations
const app1 = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,
  },
})

const app2 = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 0,  // This instance is immutable
    TMPL_DELETABLE: 0,  // This instance is permanent
    TMPL_VALUE: 200,
  },
})

console.log('Deployed two apps with different configs')
console.log('App 1 ID:', app1.appClient.appId.toString())
console.log('App 2 ID:', app2.appClient.appId.toString())
```

### Conditional Configuration Based on Network

```typescript
const isMainNet = (await algorand.client.algod.genesis().do()).network === 'mainnet'

const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: isMainNet ? 0 : 1,  // Immutable on MainNet, updatable elsewhere
    TMPL_DELETABLE: isMainNet ? 0 : 1,  // Permanent on MainNet, deletable elsewhere
    TMPL_VALUE: isMainNet ? 1000 : 10,  // Higher value on MainNet
  },
})
```

### Deploy with Address Template Variables

```typescript
// If your TEAL has an address template variable
const { result, appClient } = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_ADMIN: account.addr,  // Pass address as string
  },
})
```

### Validating Template Variable Names

```typescript
// Get template variable names from app spec
const templateVars = appSpec.source?.approval?.match(/TMPL_\w+/g) || []
console.log('Template variables:', templateVars)

// Ensure all required variables are provided
const deployTimeParams = {
  TMPL_UPDATABLE: 1,
  TMPL_DELETABLE: 1,
  TMPL_VALUE: 42,
}

const missingVars = templateVars.filter(v => !(v in deployTimeParams))
if (missingVars.length > 0) {
  console.warn('Missing template variables:', missingVars)
}
```

### Deploying with Default Parameters

```typescript
// Set defaults at factory level
const factory = algorand.client.getAppFactory({
  appSpec,
  defaultSender: account.addr,
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 100,  // Default value
  },
})

// Use defaults
const app1 = await factory.send.bare.create()

// Override specific parameters (must specify all)
const app2 = await factory.send.bare.create({
  deployTimeParams: {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 200,  // Override
  },
})
```

## Best Practices

1. **Use Descriptive Template Variable Names**
   ```typescript
   // Good: Clear what each variable does
   deployTimeParams: {
     TMPL_ADMIN_ADDRESS: adminAccount.addr,
     TMPL_FEE_PERCENTAGE: 5,
     TMPL_MAX_SUPPLY: 1000000,
   }

   // Avoid: Unclear names
   deployTimeParams: {
     TMPL_VAR1: someAddress,
     TMPL_X: 5,
     TMPL_Y: 1000000,
   }
   ```

2. **Always Include TMPL_ Prefix**
   ```typescript
   // Good: Follows convention
   deployTimeParams: {
     TMPL_UPDATABLE: 1,
   }

   // Avoid: Missing prefix (won't work)
   deployTimeParams: {
     UPDATABLE: 1,  // Won't match TMPL_UPDATABLE in TEAL
   }
   ```

3. **Document Template Variables**
   ```typescript
   /**
    * Deploy-time parameters:
    * - TMPL_UPDATABLE: Whether app can be updated (0 = no, 1 = yes)
    * - TMPL_DELETABLE: Whether app can be deleted (0 = no, 1 = yes)
    * - TMPL_VALUE: Initial value for global state
    */
   const { result, appClient } = await factory.send.bare.create({
     deployTimeParams: {
       TMPL_UPDATABLE: 1,
       TMPL_DELETABLE: 1,
       TMPL_VALUE: 42,
     },
   })
   ```

4. **Validate Parameter Values**
   ```typescript
   // Good: Validate before deploying
   const updatable = process.env.ALLOW_UPDATES === 'true' ? 1 : 0
   const deletable = process.env.ALLOW_DELETES === 'true' ? 1 : 0
   const value = parseInt(process.env.INITIAL_VALUE || '0')

   if (isNaN(value) || value < 0) {
     throw new Error('Invalid INITIAL_VALUE')
   }

   const { result, appClient } = await factory.send.bare.create({
     deployTimeParams: {
       TMPL_UPDATABLE: updatable,
       TMPL_DELETABLE: deletable,
       TMPL_VALUE: value,
     },
   })
   ```

5. **Handle Addresses as Strings**
   ```typescript
   // Good: Convert to string for template variables
   const adminAddress = adminAccount.addr.toString()

   const { result, appClient } = await factory.send.bare.create({
     deployTimeParams: {
       TMPL_ADMIN: adminAddress,
       TMPL_UPDATABLE: 1,
     },
   })

   // Avoid: Passing Address objects
   deployTimeParams: {
     TMPL_ADMIN: adminAccount,  // Wrong type
   }
   ```

6. **Test with Different Configurations**
   ```typescript
   // Good: Test both updatable and immutable versions
   const updatableApp = await factory.send.bare.create({
     deployTimeParams: { TMPL_UPDATABLE: 1, TMPL_DELETABLE: 1, TMPL_VALUE: 100 },
   })

   const immutableApp = await factory.send.bare.create({
     deployTimeParams: { TMPL_UPDATABLE: 0, TMPL_DELETABLE: 0, TMPL_VALUE: 100 },
   })

   // Verify updatable app can be updated
   await updatableApp.appClient.send.bare.update(...)

   // Verify immutable app cannot be updated
   try {
     await immutableApp.appClient.send.bare.update(...)
     console.error('Should have failed!')
   } catch (error) {
     console.log('✓ Immutable app correctly rejected update')
   }
   ```

## Comparison with Other Examples

### Example 29: App Factory with Constructor

- **Example 29**: Sets factory-level default parameters
- **Example 34 (this)**: Focused on passing parameters at creation time
- Both use the same factory pattern
- This example emphasizes the template variable substitution mechanism

### Example 33: Create Without Parameters

- **Example 33**: Creates app from raw TEAL without parameters
- **Example 34 (this)**: Uses app spec with template variables
- Example 33 uses `algorand.send.appCreate()`
- This example uses factory pattern with `getAppFactory()`

## Key Takeaways

- Deploy-time parameters configure contracts at deployment through TEAL template variables
- Template variables must be prefixed with `TMPL_` in both TEAL and deployTimeParams
- Use `getAppFactory()` to create a reusable deployment configuration
- Values are substituted before TEAL compilation, making them immutable
- App factory pattern enables deploying multiple instances with different configurations
- Load app spec as JSON object using `JSON.parse(readFileSync(...))`
- Access results via `result` and app client via `appClient`
- Convert Address objects to strings for comparisons and template variables
- Deploy-time params are for immutable config; runtime params are for dynamic values
- Naming must match exactly between TEAL template vars and deployTimeParams keys
- Test different configurations to ensure template substitution works correctly
- Document your template variables for maintainability

This example provides a foundation for flexible smart contract deployment, allowing you to reuse the same contract code with different configurations for various deployment scenarios.
