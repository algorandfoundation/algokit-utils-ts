import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to configure and initialize the TestNet Dispenser API client.
 * The dispenser client is used to fund accounts on TestNet for development and testing purposes.
 *
 * In AlgoKit Utils v9.1.2, use clientManager.getTestNetDispenser() or
 * clientManager.getTestNetDispenserFromEnvironment() to create a dispenser client.
 */

// Initialize AlgorandClient to access the client manager
const algorand = AlgorandClient.testNet()

// Example 1: Create client with explicit auth token
console.log('Example 1: Creating client with explicit authentication')
try {
  const clientWithAuth = algorand.client.getTestNetDispenser({
    authToken: 'demo_auth_token',
  })
  console.log('✓ Client created successfully')
  console.log('Auth token configured:', clientWithAuth.authToken ? '✓ Yes' : '✗ No')
} catch (error) {
  console.error('Failed to create client:', (error as Error).message)
}

// Example 2: Create client from environment variable
console.log('\nExample 2: Creating client from environment variable')
// Set the authentication token via environment variable
const envToken = 'env_auth_token_value'
process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN = envToken

try {
  // getTestNetDispenserFromEnvironment() automatically reads from ALGOKIT_DISPENSER_ACCESS_TOKEN
  const clientFromEnv = algorand.client.getTestNetDispenserFromEnvironment()
  console.log('✓ Client successfully created from environment variable')
  console.log('Environment variable was used:', process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN ? '✓ Yes' : '✗ No')
} catch (error) {
  console.error('Failed to create client:', (error as Error).message)
}

// Example 3: Explicit auth token takes precedence over environment variable
console.log('\nExample 3: Explicit auth token (overrides environment variable)')
// Even though ALGOKIT_DISPENSER_ACCESS_TOKEN is set, the explicit parameter takes precedence
const explicitToken = 'explicit_token_value'

try {
  const clientWithExplicitAuth = algorand.client.getTestNetDispenser({
    authToken: explicitToken,
  })
  console.log('✓ Client successfully created with explicit auth token')
  console.log('Auth token matches explicit value:', clientWithExplicitAuth.authToken === explicitToken ? '✓ Yes' : '✗ No')
  console.log('Explicit parameter takes precedence over environment variable')
} catch (error) {
  console.error('Failed to create client:', (error as Error).message)
}

// Best Practices Summary
console.log('\n=== Best Practices ===')
console.log('1. Use environment variables for production deployments and CI/CD pipelines')
console.log('2. Use explicit parameters for testing or multi-tenant scenarios')
console.log('3. Always handle errors when initializing the client')
console.log('4. Keep authentication tokens secure and never commit them to source control')

console.log('\n✅ Example completed successfully')
process.exit(0)
