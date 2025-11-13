# TestNet Dispenser Client Configuration

This example demonstrates how to initialize and configure the TestNet Dispenser API client with different authentication methods.

## Overview

The TestNet Dispenser API client is used to programmatically fund accounts on Algorand TestNet for development and testing purposes. In AlgoKit Utils v9.1.2, use `clientManager.getTestNetDispenser()` or `clientManager.getTestNetDispenserFromEnvironment()` to create a dispenser client instance.

## Key Concepts

### Client Manager Access

The dispenser client is accessed through the `AlgorandClient`'s client manager:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()
const dispenser = algorand.client.getTestNetDispenser({ authToken: 'your_token' })
```

### Configuration Methods

There are two main methods to create a dispenser client:

1. **`getTestNetDispenser(params)`**: Requires explicit `authToken` parameter
2. **`getTestNetDispenserFromEnvironment()`**: Automatically reads from `ALGOKIT_DISPENSER_ACCESS_TOKEN` environment variable

## Code Examples

### Example 1: Explicit Auth Token

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()

// Create client with explicit auth token
const dispenser = algorand.client.getTestNetDispenser({
  authToken: 'your_access_token_here',
})

console.log('✓ Client created successfully')
```

### Example 2: From Environment Variable

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Set the auth token in environment
process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = 'your_token_here'

const algorand = AlgorandClient.testNet()

// Automatically reads from ALGOKIT_DISPENSER_ACCESS_TOKEN
const dispenser = algorand.client.getTestNetDispenserFromEnvironment()

console.log('✓ Client created from environment variable')
```

### Example 3: With Additional Parameters

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const algorand = AlgorandClient.testNet()

// Create client with auth token and custom request timeout
const dispenser = algorand.client.getTestNetDispenser({
  authToken: 'your_token',
  requestTimeout: 30, // seconds
})

console.log('✓ Client created with custom timeout')
```

## Best Practices

### 1. Store Tokens Securely

**Good** - Use environment variables or secret management:
```typescript
// Load from .env file (using dotenv package)
import dotenv from 'dotenv'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

dotenv.config()

const algorand = AlgorandClient.testNet()
const dispenser = algorand.client.getTestNetDispenserFromEnvironment()
```

**Avoid** - Hardcoding tokens in source code:
```typescript
// NEVER DO THIS
const dispenser = algorand.client.getTestNetDispenser({
  authToken: 'my-secret-token-12345', // DON'T commit this!
})
```

### 2. Handle Missing Tokens Gracefully

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

const authToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN

if (!authToken) {
  throw new Error(
    'ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable is required. ' +
    'Please set it to your TestNet Dispenser API access token.'
  )
}

const algorand = AlgorandClient.testNet()
const dispenser = algorand.client.getTestNetDispenser({ authToken })
```

### 3. Use Different Tokens for Different Environments

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Configuration based on environment
const getDispenserClient = (environment: 'dev' | 'staging' | 'test') => {
  const tokenMap = {
    dev: process.env.DISPENSER_TOKEN_DEV,
    staging: process.env.DISPENSER_TOKEN_STAGING,
    test: process.env.DISPENSER_TOKEN_TEST,
  }

  const authToken = tokenMap[environment]

  if (!authToken) {
    throw new Error(`No dispenser token configured for ${environment}`)
  }

  const algorand = AlgorandClient.testNet()
  return algorand.client.getTestNetDispenser({ authToken })
}

const devClient = getDispenserClient('dev')
```

### 4. Validate Token Format

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

function validateDispenserToken(token: string): boolean {
  // Add your validation logic based on expected token format
  if (!token || token.length < 10) {
    return false
  }
  return true
}

const authToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN || ''

if (!validateDispenserToken(authToken)) {
  throw new Error('Invalid dispenser token format')
}

const algorand = AlgorandClient.testNet()
const dispenser = algorand.client.getTestNetDispenser({ authToken })
```

## Common Use Cases

### 1. CI/CD Pipeline Integration

```typescript
// In your CI/CD pipeline, set the token as a secret environment variable
// Then use it in your test setup:

import { AlgorandClient } from '@algorandfoundation/algokit-utils'

export async function setupTestEnvironment() {
  const algorand = AlgorandClient.testNet()

  // Automatically reads from ALGOKIT_DISPENSER_ACCESS_TOKEN
  const dispenser = algorand.client.getTestNetDispenserFromEnvironment()

  // Use dispenser to fund test accounts
  return { dispenser }
}
```

### 2. Local Development with .env Files

Create a `.env` file (add to `.gitignore`):
```bash
ALGOKIT_DISPENSER_ACCESS_TOKEN=your_development_token_here
```

Load in your application:
```typescript
import dotenv from 'dotenv'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Load environment variables from .env file
dotenv.config()

const algorand = AlgorandClient.testNet()
const dispenser = algorand.client.getTestNetDispenserFromEnvironment()
```

### 3. Multi-Tenant Applications

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface TenantConfig {
  tenantId: string
  dispenserToken: string
}

class DispenserManager {
  private algorand: AlgorandClient
  private clients: Map<string, any>

  constructor(private configs: TenantConfig[]) {
    this.algorand = AlgorandClient.testNet()
    this.clients = new Map()
  }

  getClientForTenant(tenantId: string) {
    if (!this.clients.has(tenantId)) {
      const config = this.configs.find(c => c.tenantId === tenantId)

      if (!config) {
        throw new Error(`No configuration found for tenant ${tenantId}`)
      }

      const dispenser = this.algorand.client.getTestNetDispenser({
        authToken: config.dispenserToken,
      })

      this.clients.set(tenantId, dispenser)
    }

    return this.clients.get(tenantId)!
  }
}

// Usage
const manager = new DispenserManager([
  { tenantId: 'tenant-a', dispenserToken: process.env.DISPENSER_TOKEN_A! },
  { tenantId: 'tenant-b', dispenserToken: process.env.DISPENSER_TOKEN_B! },
])

const clientA = manager.getClientForTenant('tenant-a')
```

### 4. Testing with Mock Tokens

```typescript
// In test files
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

describe('Dispenser Client Tests', () => {
  it('should create client with mock token', () => {
    const mockToken = 'test-token-12345'
    const algorand = AlgorandClient.testNet()

    const dispenser = algorand.client.getTestNetDispenser({
      authToken: mockToken,
    })

    expect(dispenser.authToken).toBe(mockToken)
  })
})
```

## Obtaining an Access Token

To get a TestNet Dispenser API access token:

1. **Using AlgoKit CLI** (recommended):
   ```bash
   algokit dispenser login
   ```

2. **Contact Algorand Foundation**: Request access through official channels

3. **For Development**: Use the AlgoKit LocalNet dispenser for local testing (no token required)

## Environment Variable Configuration

### Setting Environment Variables

**On macOS/Linux**:
```bash
export ALGOKIT_DISPENSER_ACCESS_TOKEN="your_token_here"
```

**On Windows (PowerShell)**:
```powershell
$env:ALGOKIT_DISPENSER_ACCESS_TOKEN="your_token_here"
```

**In .env file** (recommended for development):
```bash
ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token_here
```

## Security Considerations

1. **Never Commit Tokens**: Always add `.env` files to `.gitignore`
2. **Rotate Tokens Regularly**: Change tokens periodically for security
3. **Use Minimal Permissions**: Request tokens with only necessary permissions
4. **Monitor Usage**: Track dispenser API usage to detect anomalies
5. **Secure Storage**: Use secret management systems in production (AWS Secrets Manager, Azure Key Vault, etc.)

## Error Handling

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

function createDispenserClient() {
  const authToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN

  if (!authToken) {
    throw new Error(
      'Missing ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable. ' +
      'Please configure your dispenser API access token.'
    )
  }

  try {
    const algorand = AlgorandClient.testNet()
    return algorand.client.getTestNetDispenser({ authToken })
  } catch (error) {
    console.error('Failed to create dispenser client:', error)
    throw new Error('Dispenser client initialization failed')
  }
}

// Usage with error handling
try {
  const dispenser = createDispenserClient()
  console.log('✓ Dispenser client ready')
} catch (error) {
  console.error('Cannot proceed without dispenser client:', error)
  process.exit(1)
}
```

## Running This Example

```bash
npm install
npm start
```

**Expected Output**:
```
Example 1: Creating client with explicit authentication
✓ Client created successfully
Auth token configured: ✓ Yes

Example 2: Creating client from environment variable
✓ Client successfully created from environment variable
Environment variable was used: ✓ Yes

Example 3: Explicit auth token (overrides environment variable)
✓ Client successfully created with explicit auth token
Auth token matches explicit value: ✓ Yes
Explicit parameter takes precedence over environment variable

=== Best Practices ===
1. Use environment variables for production deployments and CI/CD pipelines
2. Use explicit parameters for testing or multi-tenant scenarios
3. Always handle errors when initializing the client
4. Keep authentication tokens secure and never commit them to source control

✅ Example completed successfully
```

## Related Concepts

- **Account Funding**: [01-account-creation-and-funding](../01-account-creation-and-funding)
- **TestNet Usage**: Using the dispenser to fund TestNet accounts
- **LocalNet Alternative**: [Using LocalNet dispenser](../01-account-creation-and-funding) for local development

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand TestNet Guide](https://developer.algorand.org/docs/get-details/algorand-networks/testnet/)
- [AlgoKit CLI Documentation](https://github.com/algorandfoundation/algokit-cli)
