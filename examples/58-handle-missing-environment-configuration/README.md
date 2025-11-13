# Handle Missing Environment Configuration

This example demonstrates how AlgorandClient handles environment configuration, including what happens when environment variables are missing and how to properly configure clients for different networks.

## What This Example Shows

This example teaches you how to:
- Understand AlgorandClient's default configuration behavior
- Configure clients using environment variables
- Work with both algod and indexer configuration
- Handle configuration for different networks (LocalNet, TestNet, MainNet)
- Understand when environment variables are required vs optional

## Why This Matters

Proper configuration management is essential for production applications:

1. **Flexible Deployment**: Different environments need different configurations
2. **Default Behavior**: Understanding what happens without explicit configuration
3. **Production Safety**: Ensuring correct network connectivity
4. **Development Efficiency**: Quick setup for development vs production
5. **Error Prevention**: Catching configuration issues early
6. **Multi-Network Support**: Easily switch between networks

Key concepts:
- **Environment Variables**: ALGOD_SERVER, ALGOD_PORT, ALGOD_TOKEN, INDEXER_*
- **Default Configuration**: AlgorandClient provides sensible defaults
- **Network-Specific Methods**: `.testNet()`, `.mainNet()`, `.defaultLocalNet()`
- **FromEnvironment()**: Creates client from environment variables
- **Configuration Precedence**: Explicit config > environment > defaults

Common use cases:
- **CI/CD Pipelines**: Configure different networks per environment
- **Multi-Environment Apps**: Dev, staging, production configurations
- **LocalNet Development**: Use defaults for local development
- **TestNet Testing**: Point to TestNet with environment variables
- **MainNet Deployment**: Explicit MainNet configuration
- **Custom Nodes**: Connect to private or custom Algorand nodes

## How It Works

### 1. Default Behavior Without Configuration

When environment variables aren't set, AlgorandClient uses defaults:

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Without any environment configuration
delete process.env.ALGOD_SERVER
delete process.env.ALGOD_PORT
delete process.env.ALGOD_TOKEN

// This still works - uses default configuration
const algorand = AlgorandClient.fromEnvironment()
console.log('Client created with defaults')
```

Default behavior:
- Creates client even without environment variables
- Uses default algod and indexer endpoints
- Suitable for LocalNet development
- Not recommended for production without explicit configuration

### 2. Configure with Environment Variables

Set environment variables for specific networks:

```typescript
// Set required environment variables
process.env.ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
process.env.ALGOD_PORT = '443'
process.env.ALGOD_TOKEN = '' // AlgoNode doesn't require a token

const algorand = AlgorandClient.fromEnvironment()
console.log('AlgorandClient created from environment')
```

Environment configuration:
- `ALGOD_SERVER`: The algod API server URL
- `ALGOD_PORT`: The algod API port (default: 443)
- `ALGOD_TOKEN`: The algod API token (default: empty)
- Optional but recommended for production

### 3. Add Indexer Configuration

Configure indexer alongside algod:

```typescript
process.env.INDEXER_SERVER = 'https://testnet-idx.algonode.cloud'
process.env.INDEXER_PORT = '443'
process.env.INDEXER_TOKEN = ''

const algorand = AlgorandClient.fromEnvironment()
console.log('AlgorandClient with indexer configured')
```

Indexer configuration:
- `INDEXER_SERVER`: The indexer API server URL
- `INDEXER_PORT`: The indexer API port (default: 443)
- `INDEXER_TOKEN`: The indexer API token (default: empty)
- Completely optional - only needed if using indexer features

### 4. Network-Specific Methods

Use dedicated methods for known networks:

```typescript
// TestNet with AlgoNode
const testnet = AlgorandClient.testNet()

// MainNet with AlgoNode
const mainnet = AlgorandClient.mainNet()

// LocalNet with default configuration
const localnet = AlgorandClient.defaultLocalNet()
```

Network methods:
- More explicit than environment configuration
- Pre-configured for public networks
- Recommended over `fromEnvironment()` for public networks
- No environment variables needed

## Prerequisites

- Node.js and npm installed
- No specific environment variables required (example demonstrates both cases)

## Running the Example

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npm start
   ```

## Expected Output

```
Environment Configuration Examples
============================================================
Example: Handling Missing Environment Configuration

Simulating missing environment configuration...

Attempting to create AlgorandClient from environment...
Client created: AlgorandClient { ... }


============================================================
Example: Correct Environment Configuration

Setting environment variables:
  ALGOD_SERVER=https://testnet-api.algonode.cloud
  ALGOD_PORT=443
  ALGOD_TOKEN=(empty)

Attempting to create AlgorandClient from environment...

✅ AlgorandClient Created Successfully!
   Client is ready to use

✅ Algod client is accessible!

Setting indexer environment variables:
  INDEXER_SERVER=https://testnet-idx.algonode.cloud
  INDEXER_PORT=443
  INDEXER_TOKEN=(empty)

✅ AlgorandClient with Indexer created successfully!

============================================================

Key Takeaways:
1. ALGOD_SERVER environment variable is required
2. ALGOD_PORT and ALGOD_TOKEN are optional (have defaults)
3. INDEXER_* variables are optional for indexer functionality
4. Error messages clearly indicate what's missing
5. Always handle configuration errors gracefully in production
```

## Common Patterns

### Basic Environment Configuration

```typescript
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Set environment variables
process.env.ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
process.env.ALGOD_PORT = '443'
process.env.ALGOD_TOKEN = ''

const algorand = AlgorandClient.fromEnvironment()
```

### Full Configuration with Indexer

```typescript
// Configure both algod and indexer
process.env.ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
process.env.ALGOD_PORT = '443'
process.env.ALGOD_TOKEN = ''

process.env.INDEXER_SERVER = 'https://testnet-idx.algonode.cloud'
process.env.INDEXER_PORT = '443'
process.env.INDEXER_TOKEN = ''

const algorand = AlgorandClient.fromEnvironment()

// Now can use both algod and indexer features
const accountInfo = await algorand.account.getInformation('ADDRESS...')
```

### Prefer Network-Specific Methods

```typescript
// Good: Use network-specific methods for public networks
const testnet = AlgorandClient.testNet()
const mainnet = AlgorandClient.mainNet()
const localnet = AlgorandClient.defaultLocalNet()

// Avoid: Using fromEnvironment() without setting variables
const algorand = AlgorandClient.fromEnvironment()
// Unclear which network this connects to
```

### Environment-Based Network Selection

```typescript
function getAlgorandClient(): AlgorandClient {
  const network = process.env.NETWORK || 'localnet'

  switch (network) {
    case 'testnet':
      return AlgorandClient.testNet()
    case 'mainnet':
      return AlgorandClient.mainNet()
    case 'localnet':
    default:
      return AlgorandClient.defaultLocalNet()
  }
}

const algorand = getAlgorandClient()
```

### Custom Node Configuration

```typescript
// For custom or private nodes
process.env.ALGOD_SERVER = 'https://my-custom-node.example.com'
process.env.ALGOD_PORT = '8080'
process.env.ALGOD_TOKEN = 'my-secret-token'

const algorand = AlgorandClient.fromEnvironment()
```

### Configuration Validation

```typescript
function validateConfiguration() {
  const required = ['ALGOD_SERVER']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Validate before creating client
validateConfiguration()
const algorand = AlgorandClient.fromEnvironment()
```

### Safe Configuration with Fallbacks

```typescript
const algorand = AlgorandClient.fromEnvironment()

// Or with explicit fallback
const algorand = process.env.ALGOD_SERVER
  ? AlgorandClient.fromEnvironment()
  : AlgorandClient.defaultLocalNet()
```

### CI/CD Configuration

```typescript
// In CI/CD, set environment variables per environment
// .env.test
// ALGOD_SERVER=https://testnet-api.algonode.cloud
// ALGOD_PORT=443
// ALGOD_TOKEN=

// .env.production
// ALGOD_SERVER=https://mainnet-api.algonode.cloud
// ALGOD_PORT=443
// ALGOD_TOKEN=

const algorand = AlgorandClient.fromEnvironment()
```

## Best Practices

1. **Use Network-Specific Methods for Public Networks**
   ```typescript
   // Good: Explicit and clear
   const testnet = AlgorandClient.testNet()
   const mainnet = AlgorandClient.mainNet()

   // Avoid: Ambiguous network
   const algorand = AlgorandClient.fromEnvironment()
   // Which network? Depends on environment
   ```

2. **Document Required Environment Variables**
   ```typescript
   // Good: Document in README or .env.example
   /*
    * Required Environment Variables:
    * - ALGOD_SERVER: Algod API server URL
    * - ALGOD_PORT: Algod API port (default: 443)
    * - ALGOD_TOKEN: Algod API token (default: empty)
    *
    * Optional:
    * - INDEXER_SERVER: Indexer API server URL
    * - INDEXER_PORT: Indexer API port (default: 443)
    * - INDEXER_TOKEN: Indexer API token (default: empty)
    */
   ```

3. **Validate Configuration in Production**
   ```typescript
   // Good: Validate before use
   if (process.env.NODE_ENV === 'production') {
     if (!process.env.ALGOD_SERVER) {
       throw new Error('ALGOD_SERVER must be set in production')
     }
   }

   const algorand = AlgorandClient.fromEnvironment()
   ```

4. **Use Environment-Specific Configuration Files**
   ```typescript
   // Good: Use dotenv or similar
   import dotenv from 'dotenv'

   // Load environment-specific configuration
   const envFile = process.env.NODE_ENV === 'production'
     ? '.env.production'
     : '.env.development'

   dotenv.config({ path: envFile })

   const algorand = AlgorandClient.fromEnvironment()
   ```

5. **Never Commit Secrets**
   ```typescript
   // Good: Load from environment
   process.env.ALGOD_TOKEN = process.env.ALGOD_TOKEN

   // Avoid: Hardcoding secrets
   process.env.ALGOD_TOKEN = 'my-secret-token' // Never do this!
   ```

## Environment Variable Reference

### Algod Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ALGOD_SERVER` | No* | Varies | Algod API server URL |
| `ALGOD_PORT` | No | 443 | Algod API port |
| `ALGOD_TOKEN` | No | Empty | Algod API authentication token |

*Not strictly required, but recommended for production

### Indexer Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `INDEXER_SERVER` | No | Varies | Indexer API server URL |
| `INDEXER_PORT` | No | 443 | Indexer API port |
| `INDEXER_TOKEN` | No | Empty | Indexer API authentication token |

### Example Configurations

#### LocalNet
```bash
# Usually no configuration needed
# Or explicitly:
ALGOD_SERVER=http://localhost
ALGOD_PORT=4001
ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

#### TestNet (AlgoNode)
```bash
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
ALGOD_TOKEN=

INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_PORT=443
INDEXER_TOKEN=
```

#### MainNet (AlgoNode)
```bash
ALGOD_SERVER=https://mainnet-api.algonode.cloud
ALGOD_PORT=443
ALGOD_TOKEN=

INDEXER_SERVER=https://mainnet-idx.algonode.cloud
INDEXER_PORT=443
INDEXER_TOKEN=
```

## Key Takeaways

- `AlgorandClient.fromEnvironment()` creates client from environment variables
- Default configuration is provided when environment variables aren't set
- `ALGOD_SERVER` is the most important variable for custom configurations
- `ALGOD_PORT` and `ALGOD_TOKEN` have sensible defaults
- Indexer configuration is completely optional
- Use `.testNet()`, `.mainNet()`, `.defaultLocalNet()` for public networks
- Always validate configuration in production environments
- Document required variables for your application
- Never commit secrets or tokens to version control
- Environment-based configuration enables flexible deployments

This example demonstrates AlgorandClient's flexible configuration system, which provides sensible defaults while allowing complete customization through environment variables.
