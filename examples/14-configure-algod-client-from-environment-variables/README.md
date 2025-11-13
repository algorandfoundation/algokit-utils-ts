# Configure Algod Client from Environment Variables

This example demonstrates how to configure an Algod client using environment variables, which is the recommended approach for managing configuration across different environments (development, staging, production).

## What This Example Shows

This example teaches you how to:
- Configure Algod client using environment variables (ALGOD_SERVER, ALGOD_PORT, ALGOD_TOKEN)
- Use `AlgorandClient.fromEnvironment()` to create a client from env vars
- Verify connectivity by testing the Algod node connection
- Create custom Algod clients using `algosdk.Algodv2`
- Understand default LocalNet configuration behavior

## Why This Matters

Configuring clients via environment variables is important for several reasons:

1. **Environment Flexibility**: Different configurations for dev, test, and production
2. **Security**: Keep sensitive credentials out of source code
3. **Deployment Best Practices**: Industry standard for configuration management
4. **CI/CD Integration**: Easy integration with deployment pipelines

Key concepts:
- **Environment Variables**: ALGOD_SERVER, ALGOD_PORT, and ALGOD_TOKEN
- **fromEnvironment()**: Convenience method that reads from environment
- **Default Configuration**: Falls back to LocalNet defaults if vars not set
- **Custom Clients**: Can create custom algod clients when needed

Common use cases:
- **Multi-Environment Deployment**: Different nodes for different environments
- **Production Configuration**: Securely configure mainnet/testnet connections
- **CI/CD Pipelines**: Automated deployments with environment-specific config
- **Local Development**: Use LocalNet defaults for development

## How It Works

The example demonstrates three scenarios for Algod client configuration:

### 1. Configure from Environment Variables

Set the required environment variables and create a client:

```typescript
// Set environment variables (typically done in .env file or deployment config)
process.env.ALGOD_SERVER = 'http://localhost'
process.env.ALGOD_PORT = '4001'
process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

// Create client from environment
const algorand = AlgorandClient.fromEnvironment()

// Get algod client
const algodClient = algorand.client.algod

// Test connection
const status = await algodClient.status().do()
console.log(`Last Round: ${status.lastRound}`)
```

This is the recommended pattern for production applications.

### 2. Default LocalNet Configuration

If environment variables are not set, `fromEnvironment()` uses LocalNet defaults:

```typescript
// Without setting env vars, it defaults to:
// ALGOD_SERVER = 'http://localhost'
// ALGOD_PORT = '4001'
// ALGOD_TOKEN = 'a'.repeat(64)

const algorand = AlgorandClient.fromEnvironment()
```

This is convenient for local development but should not be relied upon for production.

### 3. Custom Algod Client

You can also create a custom algod client directly:

```typescript
const customAlgodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN!,
  process.env.ALGOD_SERVER!,
  process.env.ALGOD_PORT!
)

// Use the custom client with AlgorandClient
const algorand = AlgorandClient.fromClients({ algod: customAlgodClient })
```

This approach gives you more control over client configuration.

## Environment Variable Format

The three required environment variables are:

- **ALGOD_SERVER**: The URL of the Algod node (e.g., `http://localhost`, `https://mainnet-api.algonode.cloud`)
- **ALGOD_PORT**: The port number (e.g., `4001`)
- **ALGOD_TOKEN**: The authentication token (64-character string)

### Setting Environment Variables

**In .env file:**
```bash
ALGOD_SERVER=http://localhost
ALGOD_PORT=4001
ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**In shell:**
```bash
export ALGOD_SERVER=http://localhost
export ALGOD_PORT=4001
export ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**In code (for testing):**
```typescript
process.env.ALGOD_SERVER = 'http://localhost'
process.env.ALGOD_PORT = '4001'
process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
```

## Prerequisites

- Node.js and npm installed
- AlgoKit installed (for LocalNet)
- Docker installed (for LocalNet)

## Running the Example

1. Start LocalNet (optional, example sets env vars):
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
=== Algod Client Configuration Example ===

1. Configuring Algod client with environment variables:
  ✓ AlgorandClient created successfully from environment variables
  ✓ Successfully connected to Algod node:
    - Server: http://localhost:4001
    - Token: aaaaaaaaaa...
    - Last Round: 27

2. Using default LocalNet configuration:
  If environment variables are not set, AlgorandClient.fromEnvironment()
  will use default LocalNet settings (http://localhost:4001)
  For production, always set explicit environment variables.

3. Creating Algod client with custom configuration:
  ✓ Custom Algod client created successfully:
    - Last Round: 27

=== Key Takeaways ===
• Set ALGOD_SERVER, ALGOD_PORT, and ALGOD_TOKEN environment variables
• Use AlgorandClient.fromEnvironment() to create client from env vars
• Always handle potential errors when configuration is missing
• This pattern works great for different deployment environments
• You can also create custom algod clients with algosdk.Algodv2
```

## Key Takeaways

- Use environment variables for Algod client configuration
- Three required variables: ALGOD_SERVER, ALGOD_PORT, ALGOD_TOKEN
- `AlgorandClient.fromEnvironment()` is the recommended method
- Falls back to LocalNet defaults if env vars not set
- Always set explicit env vars for production deployments
- Custom clients can be created with `algosdk.Algodv2` when needed
- This pattern works seamlessly with CI/CD pipelines
- Environment-based configuration is an industry best practice
- Keep tokens and credentials out of source code
- Use .env files for local development configuration
